import React, { useEffect, useState } from "react";
import s from "./manual.module.scss";
import { IRefProps } from "app/types/type";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  getManualCategories,
  getManualCategoryList,
} from "app/api/homeApi";
import {
  setManualCategory,
  setManualCategoryListOne,
} from "app/service/home/HomeSlice";

export const Manual = ({ drmRef, watermarkRef, refs }: IRefProps) => {
  const {
    openProtection,
    isOpenDocList,
    manualCategoryListOne,
    openCategoryIndex,
    optionListHeight,
    manualCategory,
  } = useSelector((store) => store.home);
  const dispatch = useDispatch();

  useEffect(() => {
    // Очищаем состояния manualCategory и manualCategoryListOne при изменении openCategoryIndex
    dispatch(setManualCategoryListOne([])); // Очищаем manualCategoryListOne
  }, [openCategoryIndex, dispatch]);
  useEffect(() => {
    const fetchData = async () => {
      if (
        manualCategoryListOne.length === 0 &&
        manualCategory.length === 0
      ) {
        // Если категории ещё не загружены, загружаем их
        if (manualCategory.length > 0) return;
        await getManualCategories(dispatch);
      }
    };
    fetchData();
  }, [dispatch]);
  useEffect(() => {
    const fetchData = async () => {
      // Проверяем, есть ли данные в manualCategoryListOne
      if (manualCategoryListOne.length === 0 && openCategoryIndex) {
        const result = await getManualCategoryList(
          dispatch,
          openCategoryIndex,
        );
        if (result?.length === 0) return;
        // Если результат пустой, не ставим флаг
        if (result && result.length > 0) {
          dispatch(setManualCategoryListOne(result)); // Обновляем данные, если они не пустые
        }
        if (result) return;
      }
    };

    fetchData();
  }, [dispatch, manualCategoryListOne, openCategoryIndex]);

  const wrapperStyle =
    isOpenDocList && optionListHeight
      ? {
          marginTop: `${
            optionListHeight + (window.innerWidth <= 600 ? 30 : 0)
          }px`,
        }
      : {};

  return (
    <div className={s.wrapper} style={wrapperStyle}>
      <div className={s.container}>
        {!openProtection ? (
          <>
            {manualCategoryListOne.map((el) => (
              <section
                id='registration'
                ref={refs && refs[el.slug]}
                key={el.id}>
                <h1 className={s.title}>{el.title}</h1>
                {/* <span className={s.stepsTitle}>
									Чтобы начать использовать платформу MAKEUPDATE,
									выполните следующие шаги:
								</span> */}
                <div
                  className={s.stepsElement}
                  dangerouslySetInnerHTML={{
                    __html:
                      // modifyImageSrcWithDOMParser(
                      el.description,
                    // ),
                  }}
                />
              </section>
            ))}
          </>
        ) : (
          openProtection && <></>
        )}
      </div>
    </div>
  );
};
