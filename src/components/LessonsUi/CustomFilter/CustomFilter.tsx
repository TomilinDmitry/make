import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { setActiveFilter } from "app/service/lessons/lessonsSlice";
import styles from "./style.module.scss";
import {
  getLessons,
  getLessonsWithOutToken,
} from "app/api/apiLessons";
import { useTranslation } from "react-i18next";
export const CustomFilter = ({ threeTab }: { threeTab: boolean }) => {
  const { t } = useTranslation();
  const { activeFilter, dateList, popularityList, offsets } =
    useSelector((store) => store.lessons);
  const { isAuth } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const toggleFilter = async (option: "popularity" | "hi") => {
    if (activeFilter === option) return;
    dispatch(setActiveFilter(option));
    console.log(popularityList?.results);
    if (
      popularityList?.results &&
      popularityList?.results.length > 0 &&
      dateList?.results.length &&
      dateList?.results.length > 0
    )
      return;
    try {
      const offset = offsets[option]; // Берем offset для выбранного фильтра
      if (isAuth) {
        await getLessons(dispatch, option, offset); // Запрос первого набора уроков
      } else {
        await getLessonsWithOutToken(dispatch, option);
      }
    } catch (error) {
      console.error("Ошибка загрузки уроков:", error);
    }
  };

  return (
    <div className={styles.wrapperCustomSelect}>
      <button
        className={`${styles.custom_select} ${
          activeFilter === "popularity" ? styles.active : ""
        }`}
        onClick={() => toggleFilter("popularity")}>
        {t("lessonPage.filter.popular")}
      </button>
      <button
        className={`${styles.custom_select} ${
          activeFilter === "hi" ? styles.active : ""
        }`}
        onClick={() => toggleFilter("hi")}>
        {t("lessonPage.filter.date")}
      </button>
      {/* {threeTab && (
        <button
          className={`${styles.custom_select} ${
            activeFilter === "topic" ? styles.active : ""
          }`}
          onClick={() => toggleFilter("topic")}>
          По теме урока
        </button>
      )} */}
    </div>
  );
};
