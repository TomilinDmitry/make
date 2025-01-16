import { useDispatch, useSelector } from "app/service/hooks/hooks";
import React, { useEffect, useState } from "react";
import s from "./userBoughtVideo.module.scss";

import { LessonForProfile } from "components/LessonsUi/LessonForProfile/LessonForProfile";
import { ILesson, IUsersProfiles } from "app/types/type";
import { getUsersProfileList } from "app/api/apiLessons";
import { LessonSkeleton } from "components/LessonsUi/LessonSkeleton/LessonSkeleton";
import { useTranslation } from "react-i18next";
export const UserBoughtVideo = () => {
  const { usersProfiles } = useSelector((store) => store.lessons);
  const { boughtVideo } = useSelector((store) => store.profileCard);
  const { userData } = useSelector((store) => store.user);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [loading] = useState(true);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    if (userData?.user_id) {
      setCurrentId(userData.user_id);
    }
    if (boughtVideo?.results) {
      const uniqueUserIds = new Set<number>();
      boughtVideo.results.forEach((lesson: ILesson) => {
        uniqueUserIds.add(lesson?.user_id!);
      });

      const userIdArray = Array.from(uniqueUserIds);

      if (userIdArray.length === 0) return;

      const idsString = userIdArray.join(",");
      getUsersProfileList(dispatch, idsString);
    } else if (!loading) {
    }
  }, [boughtVideo, dispatch, loading, userData?.user_id]);

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
        {boughtVideo === null ? (
          <LessonSkeleton text={t("profile.skeleton.noAccessLessons")} />
        ) : boughtVideo.count! > 0 ? (
          boughtVideo.results.map((lesson, index) => (
            <LessonForProfile
              currentId={currentId!}
              lessonData={lesson}
              key={index}
              profileData={profilesMap[lesson?.user_id!] || null}
            />
          ))
        ) : (
          <LessonSkeleton text={t("profile.skeleton.noAccessLessons")} />
        )}
      </div>
    </div>
  );
};
