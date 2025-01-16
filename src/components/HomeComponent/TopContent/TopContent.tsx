import React, { useEffect } from "react";
import styles from "./topContent.module.scss";
import lessons from "../../../app/assets/other/Lessons.svg";
import users from "../../../app/assets/home/users.svg";
import { useTranslation } from "react-i18next";
import {
  getHomePageLessonCounter,
  getHomePageUserCounter,
} from "app/api/homeApi";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
export const TopContent = () => {
  const { lessonCounter, userCounter } = useSelector(
    (state) => state.home,
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await getHomePageLessonCounter(dispatch);
      await getHomePageUserCounter(dispatch);
    };
    fetchData();
  }, [dispatch]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.text_box_home}>
          {/* <h1 className={styles.title}>MAKEUPDATE</h1> */}
          <h2 className={styles.subtitle}>
            {t("homePage.mainText")}
          </h2>
        </section>
        <div className={styles.lessons_users_box}>
          <div className={styles.les_us}>
            <img
              className={styles.img_les_us}
              src={lessons}
              alt='lessons_icon'
            />
            <span className={styles.les_us_text}>
              {t("homePage.lessonCounter")}
            </span>
            <span className={styles.num}>
              {lessonCounter ? lessonCounter : 0}
            </span>
          </div>
          <div className={styles.les_us}>
            <img
              className={styles.img_les_us}
              src={users}
              alt='users_icon'
            />
            <span className={styles.les_us_text}>
              {t("homePage.userCounter")}
            </span>
            <span className={styles.num}>
              {" "}
              {userCounter ? userCounter : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
