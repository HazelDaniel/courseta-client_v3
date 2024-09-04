import { useLocation } from "@remix-run/react";
import { CourseLessonType } from "~/types";
import { StatusErrorElement } from "./not-found";

import styles from "~/styles/lesson-content.module.css";
import { extractIfConvertibleEmbed_ } from "~/utils/conversion";

export const LessonContentBody: React.FC<{
  contentID: number;
  lesson: CourseLessonType;
}> = ({ contentID, lesson }) => {
  const [content] = lesson.contents.filter((content) => {
    return content.id === contentID;
  });

  let srcString: string;
  const [isConverted, convertedMatch] = extractIfConvertibleEmbed_(
    content.href
  );
  if (!isConverted) {
    if (!convertedMatch)
      srcString = content.href; // because it might be from some other sites.
    else srcString = content.href;
  } else {
    srcString = convertedMatch as string;
  }

  if (content) {
    return (
      <div className={styles.lesson_content_body_styled}>
        <h1>{lesson.courseTitle}</h1>
        <h2>Resource</h2>
        <div className={styles.resource_header_div}>
          <span>title: </span>
          <p>{`${content.title}`}</p>
        </div>
        <iframe
          src={srcString}
          ng-show="showvideo"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          // referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
    );
  } else {
    return <StatusErrorElement />;
  }
};
