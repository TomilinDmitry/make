import s from "./style.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { UserProfileFollowers } from "../UserProfile/userProfileFollowers/UserProfileFollowers";
import { UserProfileFollowing } from "../UserProfile/userProfileFollowing/UserProfileFollowing";
import {
  getFollowers,
  getFollowing,
  getUsersLessons,
  getUsersLessonsWhitOutToken,
} from "app/api/apiLessons";

import { UserProfileLessons } from "../UserProfile/userLessons/UserProfileLessons";
import { useLocation, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { resetFollowers, resetFollowing } from "app/service/profileCard/profileCardSlice";

export const UsersNavigationProfile = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeButton, setActiveButton] = useState<string | null>(
    "lessons",
  );
  const [activeButtonDesktop, setActiveButtonDesktop] = useState<
    number | null
  >(0);
  const { followers, following, profileData } = useSelector(
    (store) => store.profileCard,
  );

  const { userLesson } = useSelector((store) => store.lessons);
  const { isAuth } = useSelector((store) => store.user);
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const buttonsTop = [
    {
      text: `${t("userProfile.navigation.lesson")}`,
      count: userLesson?.count ? userLesson?.count : "",
    },
    { text: `${t("userProfile.navigation.events")}`, count: "" },
    {
      text: `${t("userProfile.navigation.subscribers")}`,
      count: followers?.count ? followers.count : "",
    },
    {
      text: `${t("userProfile.navigation.subscriptions")}`,
      count: following?.count ? following.count : "",
    },
  ];
  const buttons = [
    {
      id: "lessons",
      label: `${t("userProfile.navigation.lesson")}`,
      count: userLesson?.count ? userLesson?.count : "",
    },
    {
      id: "events",
      label: `${t("userProfile.navigation.events")}`,
      count: "",
    },
    {
      id: "subscribers",
      label: `${t("userProfile.navigation.subscribers")}`,
      count: followers?.count ? followers.count : "",
    },
    {
      id: "subscriptions",
      label: `${t("userProfile.navigation.subscriptions")}`,
      count: following?.count ? following.count : "",
    },
  ];
  useEffect(() => {
    // Сброс состояния кнопок и кэшированных данных профиля
    setActiveButton("lessons");
    setActiveButtonDesktop(0);
  }, [id, isAuth]);

  const location = useLocation();
  useEffect(() => {
    dispatch(resetFollowers()); // Сбросить подписчиков
    dispatch(resetFollowing()); // Сбросить подписки
  }, [location.pathname, dispatch]);


  const handleButtonClick = (id: string) => {
    setActiveButton(id);
    setActiveButtonDesktop(null);
    if (activeButton === id) return;
    if (id === "subscribers") {
      if (followers) return
      getFollowers(dispatch, profileData?.user_id.toString()!);
    }
    if (id === "subscriptions") {
      if (following) return
      getFollowing(dispatch, profileData?.user_id.toString()!);
    }
    if (id === "lessons") {
      if (isAuth) {
        getUsersLessons(dispatch, profileData?.user_id.toString()!);
      } else {
        getUsersLessonsWhitOutToken(dispatch, id!.toString());
      }
    }
  };
  // Обработка нажатия для десктопной версии
  const handleButtonClickDesktop = (index: number) => {
    setActiveButtonDesktop(index);
    setActiveButton(null);
    if (activeButtonDesktop === index) return;

    // Вызов нужного запроса по нажатию
    if (
      buttons[index]?.label ===
      `${t("userProfile.navigation.subscribers")}`
    ) {
      if (followers) return
      getFollowers(dispatch, profileData?.user_id.toString()!);
    }
    if (
      buttons[index]?.label ===
      `${t("userProfile.navigation.subscriptions")}`
    ) {
      if (following) return
      getFollowing(dispatch, profileData?.user_id.toString()!);
    }
    if (buttons[index].label === "Уроки") {
      if (isAuth) {
        getUsersLessons(dispatch, profileData?.user_id.toString()!);
      } else {
        getUsersLessonsWhitOutToken(dispatch, id!.toString());
      }
    }
  };

  // Начало перетаскивания
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos(e.pageX - containerRef.current!.offsetLeft);
    setScrollLeft(containerRef.current!.scrollLeft);
  };

  // Окончание перетаскивания
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartPos(
      e.touches[0].pageX - containerRef.current!.offsetLeft,
    );
    setScrollLeft(containerRef.current!.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - containerRef.current!.offsetLeft;
    const walk = (x - startPos) * 2;
    containerRef.current!.scrollLeft = scrollLeft - walk;
  };

  // Перемещение мышью
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - containerRef.current!.offsetLeft;
    const walk = (x - startPos) * 2;
    containerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const buttonClass = (index: number) =>
    activeButtonDesktop === index
      ? `${s.button_main_profile} ${s.active}`
      : s.button_main_profile;
  return (
    <div className={s.buttons_page_profile}>
      <div className={s.buttons_containers_profile_top}>
        {buttonsTop.map((button, index) => (
          <button
            key={index}
            className={buttonClass(index)}
            onClick={() => handleButtonClickDesktop(index)}>
            <span className={s.button_main_profile_text}>
              {button.text}
              {button.count && (
                <sup className={s.sup}>({button.count})</sup>
              )}
            </span>
          </button>
        ))}
      </div>

      <div
        className={s.buttonsContainer}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}>
        <div className={s.buttons}>
          {buttons.map((button) => (
            <button
              key={button.id}
              className={`${s.button_main_profile} ${
                activeButton === button.id ? s.active : ""
              }`}
              onClick={() => handleButtonClick(button.id)}>
              <span className={s.button_main_profile_text}>
                {button.label}
                {button.count && (
                  <sup className={s.sup}>({button.count})</sup>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {(activeButton === "lessons" || activeButtonDesktop === 0) && (
        <UserProfileLessons />
      )}
      {(activeButton === "subscribers" ||
        activeButtonDesktop === 2) && <UserProfileFollowers />}
      {(activeButton === "subscriptions" ||
        activeButtonDesktop === 3) && <UserProfileFollowing />}
    </div>
  );
};
