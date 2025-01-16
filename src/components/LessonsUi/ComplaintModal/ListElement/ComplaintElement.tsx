import React, { useState } from "react";
import s from "./ComplaintElement.module.scss";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { setOpenPostComplaintModal } from "app/service/lessons/lessonsSlice";
export const ComplaintElement = ({
  title,
  type,
  onClick,
}: {
  title: string;
  type: string;
  onClick: () => void;
}) => {
  const dispatch = useDispatch();
  const click = () => {
    if (typeof onClick === "function") {
      dispatch(setOpenPostComplaintModal(true));
      onClick();
    } else {
      console.error("onClick не является функцией:", onClick);
    }
  };
  return (
    <li className={s.element} onClick={click}>
      <span>{title}</span>
    </li>
  );
};
