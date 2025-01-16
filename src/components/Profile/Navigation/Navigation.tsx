import s from "./style.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { UserProfileFollowers } from "../UserProfile/userProfileFollowers/UserProfileFollowers";

import { UserProfileFollowing } from "../UserProfile/userProfileFollowing/UserProfileFollowing";
import {
  getFollowers,
  getFollowing,
  getMyLessons,
} from "app/api/apiLessons";
import { UserProfileLessons } from "../UserProfile/userLessons/UserProfileLessons";
import { UserFavouriteLessons } from "../UserProfile/userFavouriteLessons/UserProfileFavouriteLessons";
import { getAccessControl, getBoughtVideo } from "app/api/apiProfile";
import { UserBoughtVideo } from "../UserProfile/userBoughtVideo/userBoughtVideo";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import {
  resetFollowers,
  resetFollowing,
} from "app/service/profileCard/profileCardSlice";
import { AccessСontrol } from "../UserProfile/accessСontrol/AccessСontrol";
import { toast } from "react-toastify";

export const NavigationProfile = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeButton, setActiveButton] = useState<string | null>();

  const [activeButtonDesktop, setActiveButtonDesktop] = useState<
    number | null
  >(null);
  const { userData } = useSelector((store) => store.user);
  const { myLessons } = useSelector((store) => store.lessons);

  const {
    myProfileCounter,
    counter,
    followers,
    following,
    boughtVideo,
    accessControl,
    typeUser,
  } = useSelector((store) => store.profileCard);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const buttonsTop = [
    {
      text: `${t("profile.navigation.myLesson")}`,
      count: counter ? counter?.map((el) => el.count_lessons) : "",
    },
    {
      text: `${t("profile.navigation.access")}`,
      count: myProfileCounter?.purchase_count
        ? myProfileCounter?.purchase_count
        : "",
    },
    {
      text: `${t("profile.navigation.favouriteLessons")}`,
      count: myProfileCounter?.favorite_count
        ? myProfileCounter.favorite_count
        : "",
    },
    // { text: `${t("profile.navigation.myEvents")}`, count: "" },
    {
      text: `${t("profile.navigation.subscribers")}`,
      count: userData?.followers_count
        ? userData.followers_count
        : "",
    },
    {
      text: `${t("profile.navigation.subscriptions")}`,
      count: userData?.following_count
        ? userData.following_count
        : "",
    },
    { text: "Управление доступом" },
  ];

  const buttons = [
    {
      id: "lessons",
      label: `${t("profile.navigation.myLesson")}`,
      count: myLessons?.count ? myLessons?.count : "",
    },
    {
      id: "access",
      label: `${t("profile.navigation.access")}`,
      count: myProfileCounter?.purchase_count
        ? myProfileCounter?.purchase_count
        : "",
    },
    {
      id: "favourites",
      label: `${t("profile.navigation.favouriteLessons")}`,
      count: myProfileCounter?.favorite_count
        ? myProfileCounter.favorite_count
        : "",
    },
    // {
    //   id: "events",
    //   label: `${t("profile.navigation.myEvents")}`,
    //   count: "",
    // },

    {
      id: "subscribers",
      label: `${t("profile.navigation.subscribers")}`,
      count: userData?.followers_count
        ? userData.followers_count
        : "",
    },
    {
      id: "subscriptions",
      label: `${t("profile.navigation.subscriptions")}`,
      count: userData?.following_count
        ? userData.following_count
        : "",
    },
    { id: "accessControl", label: "Управление доступом" },
  ];
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
  // console.log(activeButton);
  const location = useLocation();
  useEffect(() => {
    dispatch(resetFollowers()); // Сбросить подписчиков
    dispatch(resetFollowing()); // Сбросить подписки
  }, [location.pathname, dispatch]);
  const handleButtonClick = async (id: string) => {
    setActiveButton(id);
    setActiveButtonDesktop(null);
    if (activeButton === id) return;

    if (id === "subscribers") {
      if (followers) return;
      getFollowers(dispatch, userData?.user_id.toString()!);
    }

    if (id === "subscriptions") {
      if (following || userData?.following_count === 0) return;
      await getFollowing(dispatch, userData?.user_id.toString()!);
    }
    if (id === "lessons") {
      if (myLessons) return;
      await getMyLessons(dispatch);
    }
    if (
      id === "access" &&
      myProfileCounter?.purchase_count &&
      myProfileCounter?.purchase_count > 0
    ) {
      if (boughtVideo) return;
      await getBoughtVideo(dispatch);
    }
    if (id === "accessСontrol") {
      await getAccessControl(dispatch);
    }
  };

  const handleButtonClickDesktop = async (index: number) => {
    setActiveButtonDesktop(index);
    setActiveButton(null);
    if (activeButtonDesktop === index) return;

    if (
      buttons[index].label ===
      `${t("profile.navigation.subscribers")}`
    ) {
      if (followers || userData?.followers_count === 0) return;
      await getFollowers(dispatch, userData?.user_id.toString()!);
    }
    if (
      buttons[index].label ===
      `${t("profile.navigation.subscriptions")}`
    ) {
      if (following || userData?.following_count === 0) return;
      await getFollowing(dispatch, userData?.user_id.toString()!);
    }
    if (
      buttons[index].label === `${t("profile.navigation.myLesson")}`
    ) {
      if (myLessons) return;
      await getMyLessons(dispatch);
    }
    if (
      buttons[index].label === `${t("profile.navigation.access")}` &&
      myProfileCounter?.purchase_count &&
      myProfileCounter?.purchase_count > 0
    ) {
      if (boughtVideo) return;
      await getBoughtVideo(dispatch);
    }
    if (buttons[index].label === `Управление доступом`) {
      if (typeUser === "author") {
        if (accessControl) return;
        await getAccessControl(dispatch);
      } else {
        toast.warn("Вы не являетесь автором");
      }
    }
  };

  const buttonClass = (index: number) =>
    activeButtonDesktop === index
      ? `${s.button_main_profile} ${s.active}`
      : s.button_main_profile;

  // console.log(activeButtonDesktop);
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

      {(activeButton === "subscribers" ||
        activeButtonDesktop === 3) && <UserProfileFollowers />}
      {(activeButton === "subscriptions" ||
        activeButtonDesktop === 4) && <UserProfileFollowing />}
      {(activeButton === "lessons" || activeButtonDesktop === 0) && (
        <UserProfileLessons />
      )}
      {(activeButton === "access" || activeButtonDesktop === 1) && (
        <UserBoughtVideo />
      )}

      {(activeButton === "favourites" ||
        activeButtonDesktop === 2) && <UserFavouriteLessons />}
      {(activeButton === "accessControl" ||
        activeButtonDesktop === 5) && <AccessСontrol />}
    </div>
  );
};
