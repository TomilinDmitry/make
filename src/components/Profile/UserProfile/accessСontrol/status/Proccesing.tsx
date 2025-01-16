import React from "react";
import s from "./open.module.scss";
import clock from "../../../../../app/assets/accessConrol/clock.svg";
export const Proccesing = () => {
  return (
    <div className={s.wrapper}>
      {" "}
      <img src={clock} alt='clockIcon' />В обработке
    </div>
  );
};
