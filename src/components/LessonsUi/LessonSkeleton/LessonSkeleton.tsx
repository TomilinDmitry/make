import React from "react";
import s from "./lessonSkeleton.module.scss";
export const LessonSkeleton = ({ text }: { text?: string }) => {
  return (
    <div className={s.wrapper}>
      <span className={s.text}>{text}</span>
      <div className={s.container}>
        <div className={s.skeletonElement}></div>
        <div className={s.skeletonElement}></div>
        <div className={s.skeletonElement}></div>
        <div className={s.skeletonElement}></div>
        <div className={s.skeletonElement}></div>
      </div>
    </div>
  );
};
