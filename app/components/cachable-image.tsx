import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ClientOnly } from "remix-utils/client-only";
import { v3Config } from "~/config/base";
import ImageCacheDAO from "~/dao/image-cache";
import { ServerPayloadType } from "~/server.types";
import { ImageMetaType } from "~/types";

export const CachableImage: React.FC<{
  src: string | null;
  metaData: ImageMetaType;
  alt: string;
  className?: string;
}> = ({ src, metaData, alt, className }) => {
  const ref = useRef<HTMLImageElement | undefined>(undefined);
  const [srcState, srcDispatch] = useState(src);
  const { ref: imageRef, inView } = useInView({
    threshold: 0,
  });

  const setRefs = useCallback(
    (node: HTMLImageElement) => {
      ref.current = node;
      imageRef(node);
    },
    [imageRef]
  );

  useEffect(() => {
    if (!src) return;
    const controller = new AbortController();

    const syncImage = async () => {
      const { signal } = controller;
      if (!metaData.id) return;

      if (inView && ref.current) {
        const imageCache: ImageCacheDAO = ImageCacheDAO.instance;
        const cachedImage = await imageCache.get(metaData.id);
        const requestURL = `${v3Config.imageAPIUrl}/${metaData.id}?mime_type=${
          metaData.mime_type || ""
        }`;
        if (!metaData.mime_type) return;
        if (
          !cachedImage ||
          cachedImage.updated_at < new Date(metaData.updated_at).getTime()
        ) {
          try {
            const response = await fetch(requestURL, {
              signal,
              headers: { "x-mime_type": metaData.mime_type || "" },
            });
            if (!response.ok) {
              console.error("failed to get the corresponding image");
              return;
            }
            const body: ServerPayloadType<string> = await response.json();
            if ("payload" in body) {
              if (!body.payload) return;
              console.log("the image size is : ", body.payload.length);
              console.log("the thumbnail image size is : ", src.length);
              await imageCache.post({
                id: metaData.id,
                image_text: body.payload || "",
                updated_at: new Date(metaData.updated_at).getTime(),
              });
              srcDispatch(body.payload);
            } else {
              return;
            }
            return;
          } catch (err) {
            console.error(err);
            return;
          }
        } else {
          srcDispatch(cachedImage.image_text || srcState);
        }
      }
      if (!inView) {
        controller.abort();
      }
    };

    syncImage();

    return () => {
      controller.abort();
    };
  }, [ref, inView]);

  return (
    <ClientOnly>
      {() => (
        <img
          src={srcState || ""}
          alt={alt}
          ref={setRefs}
          className={className}
        />
      )}
    </ClientOnly>
  );
};
