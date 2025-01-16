import React from "react";
import s from "./open.module.scss";
import redCross from "../../../../../app/assets/accessConrol/redCross.svg";
export const Close = () => {
  return (
    <div className={s.wrapper}>
      {" "}
      <img src={redCross} alt='redCrossIcon' />
      Закрыт
    </div>
  );
};
