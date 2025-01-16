import { useDispatch, useSelector } from "app/service/hooks/hooks";
import React, { useEffect, useRef, useState } from "react";
import s from "./style.module.scss";
import { LessonForProfile } from "components/LessonsUi/LessonForProfile/LessonForProfile";
import { useLocation } from "react-router";
import { LessonSkeleton } from "components/LessonsUi/LessonSkeleton/LessonSkeleton";
import { getMyLessons, getUsersLessons } from "app/api/apiLessons";
import {
  appendMyLessons,
  appendUserLesson,
  resetMyLessons,
  resetUserLesson,
} from "app/service/lessons/lessonsSlice";
import {
  resetOffset,
  setOffset,
} from "app/service/profileCard/profileCardSlice";
import { useTranslation } from "react-i18next";
export const UserProfileLessons = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [currentId, setCurrentId] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { userLesson, profiles, myLessons } = useSelector(
    (store) => store.lessons,
  );

  const { profileData } = useSelector((store) => store.profileCard);

  const { userData } = useSelector((store) => store.user);

  const userId = location.pathname.startsWith("/profile")
    ? location.pathname.split("/")[2] || userData?.user_id?.toString()
    : profileData?.user_id?.toString();

  const offset = useSelector(
    (state) => state.profileCard.offsets[userId || ""] || 16,
  );
  useEffect(() => {
    const isProfilePage = location.pathname.startsWith("/profile");
    const isOwnProfile = location.pathname === "/profile";

    if (!isProfilePage) {
      // Ушли с любого профиля — сбрасываем свои уроки
      dispatch(resetMyLessons());
      dispatch(resetOffset(userId || ""));
    }

    if (!isProfilePage && userId) {
      dispatch(resetUserLesson());
      dispatch(resetOffset(userId));
    }
  }, [location.pathname, userId, dispatch]);

  useEffect(() => {
    if (userData?.user_id) {
      setCurrentId(userData.user_id);
    }
  }, [userData?.user_id]);
  const pathname = location.pathname;
  useEffect(() => {
    const loadMoreLessons = async () => {
      if (!loadingMore) {
        setLoadingMore(true);

        if (location.pathname === "/profile") {
          // Логика для своего профиля
          if (
            myLessons?.next &&
            myLessons.count &&
            myLessons.count > offset
          ) {
            await getMyLessons(dispatch, offset, 16);
            dispatch(appendMyLessons(myLessons));
            dispatch(
              setOffset({
                userId: userId || "",
                offset: offset + 16,
              }),
            ); // Обновляем offset
          }
        } else if (
          location.pathname.startsWith("/profile") &&
          userId
        ) {
          // Логика для чужого профиля
          if (
            userLesson?.next &&
            userLesson.count &&
            userLesson.count > offset
          ) {
            await getUsersLessons(dispatch, userId, offset, 16);
            dispatch(appendUserLesson(userLesson));
            dispatch(setOffset({ userId, offset: offset + 16 })); // Обновляем offset
          }
        }

        setLoadingMore(false);
      }
    };

    // Обработчик для IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMoreLessons();
        }
      },
      { threshold: 1.0 },
    );

    // Наблюдение за рефом
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    // Очистка наблюдателя
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [
    dispatch,
    offset,
    loadingMore,
    myLessons,
    myLessons?.next,
    userLesson,
    userLesson?.next,
    profileData?.user_id,
    location.pathname,
    userId,
  ]);

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        {pathname === "/profile" ? (
          myLessons?.count! > 0 ? (
            myLessons?.results.map((lesson, index) => (
              <LessonForProfile
                currentId={userData?.user_id!}
                lessonData={lesson}
                key={index}
                profileData={profiles[userData?.user_id!] || null}
              />
            ))
          ) : (
            <LessonSkeleton text={t("profile.skeleton.noLessons")} />
          )
        ) : userLesson?.count! > 0 ? (
          userLesson?.results.map((lesson, index) => (
            <LessonForProfile
              currentId={currentId!}
              lessonData={lesson}
              key={index}
              profileData={profiles[lesson?.user_id!] || null}
            />
          ))
        ) : (
          <LessonSkeleton text={t("profile.skeleton.noLessons")} />
        )}
      </div>
      <div ref={loaderRef}></div>
    </div>
  );
};
