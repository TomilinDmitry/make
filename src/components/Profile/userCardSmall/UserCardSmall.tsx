import { IPropsUsers } from "app/types/type";
import React from "react";
import s from "./userCardSmall.module.scss";
import video from "../../../app/assets/profileCard/videos.svg";
import view from "../../../app/assets/profileCard/view.svg";
import { useTranslation } from "react-i18next";
export const UserCardSmall = ({
  userData,
  totalViews,
  countLessons,
}: IPropsUsers) => {
  const { t } = useTranslation();


  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.leftSide}>
          {userData.photo && (
            <img
              src={
                userData.photo.startsWith("http")
                  ? userData.photo
                  : `https://api.lr45981.tw1.ru${userData.photo}`
              }
              alt='profilePhoto'
              className={s.profilePhoto}
            />
          )}
          <div className={s.profileInfo}>
            <section>
              <h1 className={s.name}>
                {userData.first_name && userData.last_name
                  ? `${userData.first_name} ${userData.last_name}`
                  : `${t("default.name")} ${t("default.lastName")}`}
              </h1>
            </section>
            <span className={s.location}>
              {userData.country && userData.city
                ? `${userData.country}, ${userData.city}`
                : `${t("default.country")} ${t("default.city")}`}
            </span>
          </div>
        </div>
        <div className={s.rightSide}>
          <div className={s.video}>
            <img src={video} alt='video_img' />
            <span className={s.text}>{totalViews}</span>
          </div>
          <div className={s.view}>
            <img src={view} alt='view_img' />
            <span className={s.text}>{countLessons}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
