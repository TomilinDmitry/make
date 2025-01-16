import React, { useState } from "react";
import s from "./style.module.scss";
import searchGradient from "../../../app/assets/events/searchGradient.svg";
import img from "../../../app/assets/users/filter.svg";
import vol from "../../../app/assets/lessons/img.svg";
export const Navigation = () => {
  const [activeButtons, setActiveButtons] = useState<number[]>([]);
  const buttons = [
    {
      title: "События мира",
      id: 1,
    },
    {
      title: "События страны",
      id: 2,
    },
    {
      title: "События города",
      id: 3,
    },
  ];
  const handleButtonClick = (id: number) => {
    if (activeButtons.includes(id)) {
      setActiveButtons(
        activeButtons.filter((buttonId) => buttonId !== id),
      );
    } else {
      setActiveButtons([...activeButtons, id]);
    }
  };
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.leftSide}>
          {buttons.map((el) => (
            <button
              key={el.id}
              className={
                activeButtons.includes(el.id) ? s.active : s.button
              }
              onClick={() => handleButtonClick(el.id)}>
              {el.title}
            </button>
          ))}
        </div>
        <div className={s.rightSide}>
          <img src={vol} alt='searchIcon' className={s.searchIcon} />
          <img
            src={img}
            alt='mobileIcon'
            className={s.mobileInputIcon}
          />
          <input
            type='search'
            className={s.search}
            placeholder='Поиск...'
          />
          <img
            src={searchGradient}
            alt='searchGradient'
            className={s.gradientSearch}
          />
        </div>
      </div>
    </div>
  );
};
