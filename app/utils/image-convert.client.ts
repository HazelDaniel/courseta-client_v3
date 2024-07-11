import { ChangeEvent } from "react";

interface Window {
  webkitURL?: typeof URL;
}

if (!HTMLCanvasElement?.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
    value: function (
      callback: BlobCallback,
      type?: string,
      quality?: any
    ): void {
      const dataURL = this.toDataURL(type, quality);
      const binStr = atob(dataURL.split(",")[1]);
      const len = binStr.length;
      const arr = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
      }

      callback(new Blob([arr], { type: type || "image/png" }));
    },
  });
}

window.URL = window.URL || window.webkitURL;

type ExifOrientationType = -2 | -1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

async function getExifOrientation(file: Blob): Promise<ExifOrientationType> {
  return new Promise((resolve) => {
    const slice: Blob = file.slice(0, 131072);
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) {
        resolve(-1);
        return;
      }
      const view = new DataView(e.target.result as ArrayBuffer);
      if (view.getUint16(0, false) != 0xffd8) {
        resolve(-2);
        return;
      }
      const length = view.byteLength;
      let offset = 2;
      while (offset < length) {
        const marker = view.getUint16(offset, false);
        offset += 2;
        if (marker == 0xffe1) {
          if (view.getUint32((offset += 2), false) != 0x45786966) {
            resolve(-1);
            return;
          }
          const little = view.getUint16((offset += 6), false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          const tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++)
            if (view.getUint16(offset + i * 12, little) == 0x0112) {
              resolve(
                view.getUint16(
                  offset + i * 12 + 8,
                  little
                ) as ExifOrientationType
              );
              return;
            }
        } else if ((marker & 0xff00) != 0xff00) break;
        else offset += view.getUint16(offset, false);
      }
      resolve(-1);
    };
    reader.readAsArrayBuffer(slice);
  });
}

function imgToCanvasWithOrientation(
  img: HTMLImageElement,
  rawWidth: number,
  rawHeight: number,
  orientation: ExifOrientationType
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  if (orientation > 4) {
    canvas.width = rawHeight;
    canvas.height = rawWidth;
  } else {
    canvas.width = rawWidth;
    canvas.height = rawHeight;
  }

  if (orientation > 1) {
    console.log("EXIF orientation = " + orientation + ", rotating picture");
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to get 2D context");
  }

  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, rawWidth, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, rawWidth, rawHeight);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, rawHeight);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, rawHeight, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, rawHeight, rawWidth);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, rawWidth);
      break;
  }
  ctx.drawImage(img, 0, 0, rawWidth, rawHeight);
  return canvas;
}

async function compressImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
    img.onload = async () => {
      URL.revokeObjectURL(img.src);
      try {
        const orientation = await getExifOrientation(file);
        let w = img.width,
          h = img.height;
        const scale =
          orientation > 4
            ? Math.min(maxHeight / w, maxWidth / h, 1)
            : Math.min(maxWidth / w, maxHeight / h, 1);
        h = Math.round(h * scale);
        w = Math.round(w * scale);

        const canvas = imgToCanvasWithOrientation(img, w, h, orientation);
        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    img.src = URL.createObjectURL(file);
  });
}

async function processAndCompressImage(file: File): Promise<string[]> {
  const maxWidth = 1920;
  const maxHeight = 1080;

  const originalSize = file.size;
  const halfSizeQuality = originalSize > 500 * 1024 ? 0.5 : 1; // 50% quality if > 500KB, else 100%

  try {
    const [halfSizeImage, ninetyPercentImage] = await Promise.all([
      compressImage(file, maxWidth, maxHeight, halfSizeQuality),
      compressImage(file, maxWidth, maxHeight, 0.1),
    ]);

    return [halfSizeImage, ninetyPercentImage];
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}

// Function to handle file selection and processing
export async function handleFileSelect(
  event: ChangeEvent<HTMLInputElement>,
  handler: React.Dispatch<React.SetStateAction<[string, string]>>
): Promise<void> {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    console.error("No file selected");
    return;
  }

  const file = input.files[0];
  try {
    const [halfSizeImage, ninetyPercentImage] = await processAndCompressImage(
      file
    );
    handler([halfSizeImage, ninetyPercentImage]);
  } catch (error) {
    console.error("Error processing file:", error);
  }
}
