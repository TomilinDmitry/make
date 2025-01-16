import React from "react";
import s from "./style.module.scss";
export const BigCardEvent = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <section>
          <h1 className={s.name}>Лена Мотинова</h1>
        </section>
        <div className={s.bottomBlock}>
          <section>
            <h1 className={s.title}>
              Празднование моего дня рождения на #VKFEST
            </h1>
          </section>
          <div className={s.info}>
            <p className={s.description}>
              31 августа, 21:00 ТРЦ Моремолл
            </p>
            <button className={s.signUp}>Записаться</button>
          </div>
        </div>
      </div>
    </div>
  );
};
