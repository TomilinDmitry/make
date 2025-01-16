import React from "react";
import s from "./addVideoCard.module.scss";
import loadImage from "../../../app/assets/home/loadImage.svg";
export const AddVideoCard = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <span className={s.imageContainer}>
          <img src={loadImage} alt='' className={s.loadImage} />
        </span>
        <span className={s.text}>Добавить видео</span>
      </div>
    </div>
  );
};
