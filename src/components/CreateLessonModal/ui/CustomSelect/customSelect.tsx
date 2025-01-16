import React, { useEffect, useRef, useState } from "react";
import s from "./customSelect.module.scss";
import rus from "../../../../app/assets/Seller/Russia.svg";
import arrowDown from "../../../../app/assets/home/arrowDown.svg";
import UK from "../../../../app/assets/Seller/UK.svg";
import Spain from "../../../../app/assets/Seller/Spain.svg";
import UAE from "../../../../app/assets/Seller/Saud.svg";
import { IRefProps } from "app/types/type";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  setIsOpenDocList,
  setOpenCategoryIndex,
} from "app/service/home/HomeSlice";

export const CustomSelectCreateLessonModal = ({
  data,
  optionListRef,
  refs,
  updateHeight,
}: IRefProps) => {
  const dispatch = useDispatch();
  const { manualCategoryListOne } = useSelector(
    (state) => state.home,
  );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, any>
  >({}); // Храним выбранные опции по ID

  const { isOpenDocList, openCategoryIndex } = useSelector(
    (state) => state.home,
  );

  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement>,
    optionListRef: React.RefObject<HTMLUListElement>,
  ) => {
    if (ref.current && optionListRef.current) {
      // Получаем высоту блока optionList
      const optionListHeight =
        optionListRef.current.getBoundingClientRect().height;
      // console.log(optionListHeight)
      if (ref.current) {
        // console.log(ref.current);
        let yOffset = -630;

        const yPosition =
          ref.current.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: yPosition, behavior: "smooth" });
      }
    }
  };

  const handleOptionClick = (option: any, slug: string) => {
    // Обновляем высоту выпадающего списка при клике
    updateHeight && updateHeight();
    // Устанавливаем выбранную опцию
    if (data) {
      setSelectedOptions((prev) => ({
        ...prev,
        [data.id]: option,
      }));
    }

    // Закрываем список документации
    dispatch(setIsOpenDocList(false));
    dispatch(setOpenCategoryIndex(0));

    // Прокрутка к нужному разделу
    if (refs && refs[slug] && scrollToSection && optionListRef) {
      scrollToSection(refs[slug], optionListRef);
    }
  };

  const handleToggleCategory = (index: any) => {
    updateHeight && updateHeight();
    dispatch(setIsOpenDocList(!isOpenDocList));

    const newIndex = openCategoryIndex === index ? null : index;
    dispatch(setOpenCategoryIndex(newIndex));
  };

  useEffect(() => {
    // Если выпадающий список открылся, обновляем его высоту
    if (isOpenDocList && updateHeight && optionListRef) {
      updateHeight();
    }
  }, [isOpenDocList, optionListRef, updateHeight]); // Срабатывает при изменении состояния isOpen
  return (
    <div className={s.customSelect}>
      <div
        className={s.selectedOption}
        onClick={() => handleToggleCategory(data?.id)}>
        {data && selectedOptions[data.id] ? (
          <div className={s.optionContent}>
            <div className={s.leftBlock}>
              {" "}
              {selectedOptions[data.id].title}
            </div>
            <span>
              <img
                src={arrowDown}
                alt='arrow'
                className={
                  openCategoryIndex === data?.id ? s.open : s.close
                }
              />
            </span>
          </div>
        ) : (
          <span className={s.selectContainer}>
            {data?.title}
            <img
              src={arrowDown}
              alt='arrow'
              className={
                openCategoryIndex === data?.id ? s.open : s.close
              }
            />
          </span>
        )}
      </div>
      {isOpenDocList && openCategoryIndex === data?.id && (
        <ul className={s.optionsList} ref={optionListRef}>
          {manualCategoryListOne.map((option) => (
            <li
              key={option.id}
              className={s.optionItem}
              onClick={() => handleOptionClick(option, option.slug)}>
              {option.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
