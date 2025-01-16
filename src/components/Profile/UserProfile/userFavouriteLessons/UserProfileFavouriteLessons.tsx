import { useDispatch, useSelector } from "app/service/hooks/hooks";
import React, { useEffect, useState, useTransition } from "react";
import s from "./style.module.scss";

import { LessonForProfile } from "components/LessonsUi/LessonForProfile/LessonForProfile";
import { ILesson, IUsersProfiles } from "app/types/type";
import {
  getFavouriteLessonsList,
  getUsersProfileList,
} from "app/api/apiLessons";
import { LessonSkeleton } from "components/LessonsUi/LessonSkeleton/LessonSkeleton";
import { useTranslation } from "react-i18next";
export const UserFavouriteLessons = () => {
  const { favouriteLessonsList, usersProfiles } = useSelector(
    (store) => store.lessons,
  );
  const { userData } = useSelector((store) => store.user);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { myProfileCounter, counter } = useSelector(
    (store) => store.profileCard,
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    if (
      (myProfileCounter?.favorite_count &&
        myProfileCounter?.favorite_count < 0) ||
      favouriteLessonsList?.results
    )
      return;
    const fetchData = async () => {
      try {
        setLoading(true);
        await getFavouriteLessonsList(dispatch);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке избранных уроков:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (userData?.user_id) {
      setCurrentId(userData.user_id);
    }
    if (!loading && favouriteLessonsList?.results) {
      const uniqueUserIds = new Set<number>();
      favouriteLessonsList.results.forEach((lesson: ILesson) => {
        uniqueUserIds.add(lesson?.user_id!);
      });

      const userIdArray = Array.from(uniqueUserIds);

      if (userIdArray.length === 0) return;

      const idsString = userIdArray.join(",");
      getUsersProfileList(dispatch, idsString);
    } else if (!loading) {
    }
  }, [favouriteLessonsList, loading, userData?.user_id]);

  const profilesMap = Array.isArray(usersProfiles)
    ? usersProfiles.reduce(
        (
          acc: Record<number, IUsersProfiles>,
          profile: IUsersProfiles,
        ) => {
          acc[profile.user_id] = profile;
          return acc;
        },
        {},
      )
    : {};
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        {favouriteLessonsList === null ? (
          <LessonSkeleton
            text={t("profile.skeleton.noFavouriteLessons")}
          />
        ) : favouriteLessonsList.count! > 0 ? (
          favouriteLessonsList.results.map((lesson, index) => (
            <LessonForProfile
              currentId={currentId!}
              lessonData={lesson}
              key={index}
              profileData={profilesMap[lesson?.user_id!] || null}
            />
          ))
        ) : (
          <LessonSkeleton
            text={t("profile.skeleton.noFavouriteLessons")}
          />
        )}
      </div>
    </div>
  );
};
