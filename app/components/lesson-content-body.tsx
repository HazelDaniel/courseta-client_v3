import { useLocation } from "@remix-run/react";
import { CourseLessonType } from "~/types";
import { NotFound } from "./not-found";

import styles from "~/styles/lesson-content.module.css";

export const LessonContentBody: React.FC<{
  contentID: number;
  lesson: CourseLessonType;
}> = ({ contentID, lesson }) => {
  // console.log("lesson contents are ", lesson);
  // return null;
  const [content] = lesson.contents.filter((content) => {
    return content.id === contentID;
  });

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
          src={content.href.replace("youtube.com/watch", "youtube.com/embed")}
          frameBorder="0"
          ng-show="showvideo"
          allowFullScreen
        ></iframe>
      </div>
    );
  } else {
    return <NotFound />;
  }
};
