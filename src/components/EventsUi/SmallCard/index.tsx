import React from "react";
import s from "./style.module.scss";
import bg from "../../../app/assets/events/smallCardEventBg.png";
export const SmallCardEvents = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.photoWithBtn}>
          <img src={bg} alt='bg' />
          <button className={s.signUp}>Записаться</button>
        </div>
        <div className={s.info}>
          <h1 className={s.title}>
            Празднование моего дня рождения на #VKFEST в олимпийском
            парке
          </h1>
          <span className={s.description}>
            20 августа в 18:00 - Сочи, Олимпийский парк
          </span>
        </div>
      </div>
    </div>
  );
};
