import React from "react";
import s from "./adBlock.module.scss";
import { refreshToken } from "helpers/localStorage.helper";
import { toast } from "react-toastify";
export const AdBlock = ({
  text,
  imageSrc,
}: {
  text?: string;
  imageSrc?: string;
}) => {
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        {" "}
        {imageSrc && (
          <img src={imageSrc} alt='Ad' className={s.image} />
        )}
      </div>
    </div>
  );
};
