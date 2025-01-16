import React, { useEffect, useState } from "react";
import s from "./faq.module.scss";
import arrowDown from "../../../../../app/assets/home/arrowDown.svg";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { getFaqData } from "app/api/homeApi";
export const FAQ = () => {
  const [openElements, setOpenElements] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleOpen = (index: number) => {
    setOpenElements((prev) => ({
      ...prev,
      [index]: !prev[index], // Переключаем состояние только для выбранного элемента
    }));
  };
  const dispatch = useDispatch();
  const { faqInformation } = useSelector((state) => state.home);

  useEffect(() => {
    if (faqInformation.length > 0) return;
    const fetchData = async () => {
      await getFaqData(dispatch);
    };
    fetchData();
  }, [dispatch, faqInformation]);
  // console.log(faqInformation)
  return (
    <div className={s.wrapper}>
      <section>
        <h1 className={s.title}>FAQ</h1>
      </section>
      {faqInformation.length > 0
        ? faqInformation.map((el, index) => (
            <div
              key={index}
              onClick={() => toggleOpen(index)}
              className={s.elementBlock}>
              <button className={s.element}>
                <span>{el.title}</span>
                <img
                  src={arrowDown}
                  alt='arrowDown'
                  className={
                    openElements[index] ? s.arrowUp : s.arrowDown
                  }
                />
              </button>
              {openElements[index] && (
                <p className={s.text}>
                  <span
                    className={s.responseText}
                    dangerouslySetInnerHTML={{
                      __html:
                        // modifyImageSrcWithDOMParser(
                        el.description,
                      // ),
                    }}
                  />
                </p>
              )}
            </div>
          ))
        : // <>
          //   <section>
          //     <h1 className={s.title}>FAQ</h1>
          //   </section>
          //   <button className={s.element}>
          //     <span>
          //       Стоит ли удалять видео или расширить хранилище?
          //     </span>
          //     <img
          //       src={arrowDown}
          //       alt='arrowDown'
          //       className={openElements ? s.arrowUp : s.arrowDown}
          //     />
          //   </button>
          //   {openElement && (
          //     <p className={s.text}>
          //       <span className={s.responseText}>
          //         Если продавец удалит видео, просмотры этого видео
          //         пропадут из его общей статистики, что может привести к
          //         снижению рейтинга. Рейтинг на платформе определяется
          //         исключительно количеством просмотров уроков, поэтому
          //         удаление видео может негативно сказаться на позициях
          //         продавца в рейтинге. Вместо удаления видео
          //         рекомендуется расширить хранилище, чтобы сохранить все
          //         уроки и продолжать накапливать просмотры.
          //       </span>
          //     </p>
          //   )}
          // </>
          ""}
    </div>
  );
};
