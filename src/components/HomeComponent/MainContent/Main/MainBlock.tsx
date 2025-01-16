import React, { useEffect, useRef, useState } from "react";
import s from "./mainBlock.module.scss";
import { MainCardElement } from "./MainCardElement/MainCardElement";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { Manual } from "../Navigation/Manual/Manual";
import { Support } from "../Navigation/Support/Support";
import { FAQ } from "../Navigation/FAQ/FAQ";
import {
  ILesson,
  ILessonHomePageResults,
  ILessonsHomePageState,
  IRefProps,
  IUsersProfiles,
} from "app/types/type";
import { SmallLessonCardElement } from "./SmallLessonCardElement/smallLessonCardElement";
import { AdBlock } from "../Ad/AdBlock";
import {
  getLessonHomePage,
  getLessonHomePageFirstTime,
  VURL,
} from "app/api/homeApi";
import {
  getUsersProfileList,
  getUsersProfileListWithOutToken,
  loadMoreData,
} from "app/api/apiLessons";
import {
  setAppendHomeLessons,
  setHomeLessonsList,
} from "app/service/home/HomeSlice";

export const MainBlock = ({ refs }: IRefProps) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);
  const { activeTab, homeLessonsList } = useSelector(
    (state) => state.home,
  );
  const { activeProfile } = useSelector(
    (state) => state.burgerProfiles,
  );
  const [loading, setLoading] = useState(false);
  const { isAuth } = useSelector((state) => state.user);
  const { lessons, usersProfiles } = useSelector(
    (state) => state.lessons,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (homeLessonsList?.results.length === 0) return;
    const fetchData = async () => {
      await getLessonHomePage(dispatch);
    };
    setTimeout(() => {
      const currentHomeLessonId = localStorage.getItem(
        "currentHomeLessonId",
      );
      // Условие предотвращения бесконечных запросов
      if (
        currentHomeLessonId?.toString() !==
          activeProfile?.toString() ||
        !homeLessonsList?.results
      ) {
        localStorage.setItem(
          "currentHomeLessonId",
          activeProfile || "",
        ); // Обновляем localStorage
        fetchData(); // Загружаем уроки
      }
    }, 200);
  }, [activeProfile, dispatch, isAuth]);

  useEffect(() => {
    if (usersProfiles) return;
    const fetchProfiles = async () => {
      if (homeLessonsList?.results) {
        const uniqueUserIds = new Set<number>();
        homeLessonsList.results.forEach(
          (lesson: ILessonHomePageResults) => {
            uniqueUserIds.add(lesson?.user_id!);
          },
        );
        const userIdArray = Array.from(uniqueUserIds);

        if (userIdArray.length === 0) return;
        const idsString = userIdArray.join(",");
        if (isAuth) {
          getUsersProfileList(dispatch, idsString);
        } else {
          getUsersProfileListWithOutToken(dispatch, idsString);
        }
      }
    };
    fetchProfiles();
  }, [
    lessons,
    dispatch,
    homeLessonsList?.results,
    isAuth,
    usersProfiles,
  ]);
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
    const loadMore = async () => {
      if (homeLessonsList?.next && !loading && isAuth) {
        // console.log("Подгружаем дополнительные уроки")
        setLoading(true);
        await loadMoreData({
          dispatch: dispatch,
          next: `${VURL}/api/v1/lessons/following/?limit=20&offset=${
            offset + 20
          }`,
          action: setAppendHomeLessons,
        });
        setOffset((prev) => prev + 20); // Увеличиваем смещение для следующей загрузки
        setLoading(false);
        // await fetchProfiles(); // Запрос профилей для вновь загруженных уроков
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          homeLessonsList?.next &&
          !loading
        ) {
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
  }, [homeLessonsList?.next, loading, dispatch, offset]);
  const chunkArray = (arr: any, chunkSize: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  const lessonChunks = chunkArray(homeLessonsList?.results || [], 3);
  return (
    <>
      <div className={s.wrapper}>
        {activeTab === "news" && (
          <>
            {lessonChunks.map((chunk, index) => (
              <div key={index}>
                <div className={s.cardElement}>
                  {chunk.map((el: any, index: number) => (
                    <SmallLessonCardElement
                      key={index}
                      lessonData={el}
                      profileData={profilesMap[el?.user_id!] || null}
                    />
                  ))}
                </div>
                {index !== lessonChunks.length - 1 && (
                  <div className={s.adBlock}>
                    <AdBlock text='реклама' />
                  </div>
                )}
              </div>
            ))}
          </>
        )}
        {activeTab === "manual" ? (
          <Manual refs={refs} />
        ) : activeTab === "support" ? (
          <Support />
        ) : activeTab === "FAQ" ? (
          <FAQ />
        ) : null}
      </div>
      {window.location.pathname === "/" && (
        <div ref={loaderRef}></div>
      )}
    </>
  );
};
