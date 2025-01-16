import { FC, useEffect, useRef, useState } from "react";

import img from "../../app/assets/lessons/img.svg";
import search from "../../app/assets/lessons/search.svg";
import { Lesson } from "./lesson";
import styles from "./Lessons.module.scss";
import {
  addLessonInBlackList,
  getLessons,
  getLessonsWithOutToken,
  loadMoreData,
  XURL,
} from "app/api/apiLessons";
import { useDispatch, useSelector } from "app/service/hooks/hooks";

import { ILesson, IUsersProfiles } from "app/types/type";
import { toast } from "react-toastify";
import { CustomFilter } from "components/LessonsUi/CustomFilter/CustomFilter";
import { Loading } from "components/Loading/Loading";
import { useTranslation } from "react-i18next";
import {
  appendDateList,
  appendPopularityList,
  setOffset,
  setUsersProfiles,
} from "app/service/lessons/lessonsSlice";
import { useGetUsersProfileListQuery } from "app/api/RTKApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router";
import { ComplaintModal } from "components/LessonsUi/ComplaintModal/ComplaintModal";

export const Lessons: FC = () => {
  const dispatch = useDispatch();
  const {
    lessons,
    activeFilter,
    usersProfiles,
    dateList,
    popularityList,
    openComplaint,
  } = useSelector((store) => store.lessons);
  const { activeProfile } = useSelector(
    (state) => state.burgerProfiles,
  );
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { userData, isAuth } = useSelector((store) => store.user);
  const [blacklistedLessons, setBlacklistedLessons] = useState<
    number[]
  >([]);

  const navigate = useNavigate();
  const handleAddToBlacklist = (lessonId: number) => {
    addLessonInBlackList(dispatch, lessonId);
    setBlacklistedLessons((prev) => [...prev, lessonId]);
    toast.success("Видео  убрано из рекомендаций");
  };
  const { offsets } = useSelector((state) => state.lessons);
  const authRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let isCancelled = false;

    const fetchLessons = async () => {
      setLoading(true);
      const currentOffset = offsets[activeFilter] || 0;
      try {
        if (isAuth) {
          await getLessons(dispatch, "popularity", currentOffset);
        } else {
          await getLessonsWithOutToken(dispatch, "popularity");
        }
      } catch (error) {
        console.error("Ошибка при загрузке уроков:", error);
      } finally {
        setLoading(false);
      }
    };

    const currentLessonId = localStorage.getItem("currentLessonId");
    if (
      (currentLessonId?.toString() !== activeProfile?.toString() &&
        isAuth) ||
      !lessons?.results
    ) {
      localStorage.setItem("currentLessonId", activeProfile || "");
      fetchLessons();
    }

    return () => {
      isCancelled = true; // Очистка флага при размонтировании компонента
    };
  }, [
    activeFilter,
    activeProfile,
    dispatch,
    isAuth,
    lessons?.results,
    offsets,
  ]);

  const [userIds, setUserIds] = useState<string | null>(null);

  // Извлекаем уникальные user_id из уроков
  useEffect(() => {
    // Проверяем, есть ли данные в dateList или popularityList
    if (!dateList?.results && !popularityList?.results) return;

    // Извлекаем уникальные user_id из обоих списков
    const uniqueUserIds = new Set<number>();
    const allLessons = [
      ...(dateList?.results || []),
      ...(popularityList?.results || []),
    ];

    allLessons.forEach((lesson: ILesson) => {
      if (lesson.user_id) uniqueUserIds.add(lesson.user_id);
    });

    // Формируем строку из уникальных user_id
    const idsString = Array.from(uniqueUserIds).join(",");
    setUserIds(idsString); // Сохраняем строку user_id
  }, [dateList?.results, popularityList?.results]);

  const { data } = useGetUsersProfileListQuery(
    userIds ? { ids: userIds } : skipToken,
    {
      skip: !userIds,
    },
  );

  useEffect(() => {
    if (data) {
      dispatch(setUsersProfiles(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const loadMore = async () => {
      const currentNext =
        activeFilter === "hi" ? dateList?.next : popularityList?.next;
      if (currentNext && !loading && isAuth) {
        const filter = activeFilter; // Текущий фильтр
        const offset = offsets[filter]; // Текущий offset для фильтра

        setLoading(true);
        const action =
          filter === "hi" ? appendDateList : appendPopularityList;
        await loadMoreData({
          dispatch: dispatch,
          next: `${XURL}/api/v1/lessons/homepage/?sort=${activeFilter}&limit=20&offset=${
            offset + 20
          }`,
          action: action,
        });
        dispatch(setOffset({ sortBy: filter, offset: offset + 20 })); // Увеличиваем смещение для следующей загрузки
        setLoading(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && lessons?.next && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [
    lessons?.next,
    dispatch,
    offsets,
    isAuth,
    activeFilter,
    loading,
  ]);

  const [currentId, setCurrentId] = useState<number | null>(null);
  const filteredLessons =
    (activeFilter === "hi"
      ? dateList?.results
      : popularityList?.results
    )?.filter(
      (lesson: ILesson) =>
        lesson && !blacklistedLessons.includes(lesson.id),
    ) ?? []; // Если результат фильтрации undefined, вернуть пустой массив
  useEffect(() => {
    // Проверяем, если profileData существует, обновляем currentId
    if (userData?.user_id) {
      setCurrentId(userData.user_id);
    }
  }, [userData?.user_id]);
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

  useEffect(() => {
    if (!authRef.current) return;
    if (!isAuth && lessons?.results && lessons?.results.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isAuth) {
              navigate("/login");
            }
          });
        },
        { threshold: 1.0 }, // Срабатывает, когда 10% элемента видны
      );

      observer.observe(authRef.current);

      return () => {
        if (authRef.current) {
          observer.unobserve(authRef.current);
        }
      };
    }
  }, [isAuth, navigate]);
  console.log(
    !isAuth && lessons?.results && lessons?.results.length > 0,
  );
  return (
    <div className={styles.lessons_container}>
      {!lessons ? (
        <Loading />
      ) : (
        <>
          <div className={styles.filter_block}>
            <div className={styles.search_filter}>
              <div className={styles.filter}>
                <CustomFilter threeTab={false} />
              </div>
              <div className={styles.inputContainer}>
                <div className={styles.search}>
                  <img className={styles.vol} src={img} alt='' />
                  <input
                    className={styles.input}
                    placeholder={t("lessonPage.placeholder")}
                    type='text'
                  />
                  <img
                    className={styles.search_img}
                    src={search}
                    alt=''
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.all_lessons_box}>
            {filteredLessons?.map((lesson: ILesson, index) => (
              <Lesson
                key={index}
                currentId={currentId!}
                lessonData={lesson}
                profileData={
                  profilesMap[lesson?.user_id!] ||
                  profilesMap[userData?.user_id!] ||
                  null
                }
                onBlacklist={() => handleAddToBlacklist(lesson.id)}
              />
            ))}
          </div>
        </>
      )}
      <div ref={loaderRef}></div>
      {/* {!isAuth && lessons?.results && lessons?.results.length > 0 && ( */}
      <div ref={authRef} className={styles.authRef}></div>
      {/* )} */}
   
    </div>
  );
};
