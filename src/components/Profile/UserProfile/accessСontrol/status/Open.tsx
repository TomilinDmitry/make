import React from "react";
import openIcon from "../../../../../app/assets/accessConrol/openIcon.svg";
import s from "./open.module.scss";
export const Open = () => {
  return (
    <div className={s.wrapper}>
      {" "}
      <img src={openIcon} alt='openIcon' />
      Открыт
    </div>
  );
};
