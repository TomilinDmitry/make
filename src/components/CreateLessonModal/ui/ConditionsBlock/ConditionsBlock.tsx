import React, { useState } from "react";
import s from "./conditions.module.scss";
import link from "../../../../app/assets/lessons/LinkConditions.svg";
import linkActive from "../../../../app/assets/createLessonModal/activeLinkIcon..svg";
import plus from "../../../../app/assets/createLessonModal/GradientPlus.svg";
import notActivePlus from "../../../../app/assets/createLessonModal/notActiveGradientPlus.svg";
import minus from "../../../../app/assets/createLessonModal/minus.svg";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  addCondition,
  removeCondition,
  toggleCondition,
  updateCondition,
} from "app/service/createLesson/conditions/ConditionsSlice";
export const ConditionsBlock = ({ isEdit }: { isEdit?: boolean }) => {
  // const [conditions, setConditions] = useState<
  //   { title: string; link: string; isOpen: boolean }[]
  // >([{ title: "", link: "", isOpen: false }]);
  const { conditions } = useSelector((state) => state.conditions);
  const dispatch = useDispatch();
  // Добавление нового condition
  const handleAddCondition = () => {
    dispatch(addCondition());
  };

  // Обновление значения title или link
  const handleRemoveCondition = (index: number) => {
    dispatch(removeCondition(index));
  };

  const handleInputChange = (
    index: number,
    key: "text" | "link",
    value: string,
  ) => {
    dispatch(updateCondition({ index, key, value }));
  };

  const toggleOpen = (index: number) => {
    dispatch(toggleCondition(index));
  };
  return (
    <div className={s.conditions}>
      {conditions.length === 0 ? (
        <div className={s.condition}>
          <input
            type="text"
            className={s.conditionsInput}
            placeholder="Введите условие"
            onChange={(e) =>
              handleInputChange(0, "text", e.target.value)
            }
          />
          <div className={s.imageGroup}>
            <img
              src={link}
              alt="linkIcon"
              onClick={() => toggleOpen(0)}
            />
            <img
              src={plus}
              alt="gradientPlusIcon"
              onClick={handleAddCondition}
              className={s.plus}
            />
          </div>
        </div>
      ) : (
        conditions.map((condition, index) => (
          <div className={s.condition} key={index}>
            {condition.isOpen ? (
              <input
                type="text"
                className={s.conditionsInput}
                placeholder="Вставьте ссылку"
                value={condition.link}
                onChange={(e) =>
                  handleInputChange(index, "link", e.target.value)
                }
              />
            ) : (
              <input
                type="text"
                className={s.conditionsInput}
                placeholder="Введите условие"
                value={condition.text}
                onChange={(e) =>
                  handleInputChange(index, "text", e.target.value)
                }
              />
            )}
            <div className={s.imageGroup}>
              <img
                src={condition.isOpen ? linkActive : link}
                alt="linkIcon"
                onClick={() => toggleOpen(index)}
              />
              {index === 0 && !condition.isOpen && conditions.length < 5 ? (
                <img
                  src={plus}
                  alt="gradientPlusIcon"
                  onClick={handleAddCondition}
                  className={s.plus}
                />
              ) : index !== 0 && !condition.isOpen ? (
                <img
                  src={minus}
                  alt="gradientPlusIcon"
                  onClick={() => handleRemoveCondition(index)}
                  className={s.plus}
                />
              ) : (
                <img
                  src={notActivePlus}
                  alt="gradientPlusIcon"
                  className={s.plus}
                />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};