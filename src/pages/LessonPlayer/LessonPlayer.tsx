import React, { useEffect, useRef, useState } from "react";
import s from "./style.module.scss";
import img from "../../app/assets/lessons/img.svg";
import share from "../../app/assets/lessons/shareBlack.svg";
import favourite from "../../app/assets/lessons/favouriteIconBlack.svg";
import complaint from "../../app/assets/lessons/complaintBlack.svg";
import unFavourite from "../../app/assets/lessons/unFavouriteIconBlack.svg";
import view from "../../app/assets/lessons/view.svg";
import comment from "../../app/assets/lessons/comment.svg";
import search from "../../app/assets/lessons/search.svg";
import wallet from "../../app/assets/lessons/wallet.svg";
import { CustomFilter } from "components/LessonsUi/CustomFilter/CustomFilter";
import Player from "@kinescope/react-kinescope-player";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { useNavigate, useParams } from "react-router";
import {
  addNewViews,
  getPlayerComments,
  getPlayerId,
  getPlayerIdWithOutToken,
  sendPlayerComment,
} from "app/api/apiPlayer";
import { RightSideVideo } from "components/PlayerUi/RightSideVideo/RightSideVideo";
import { Comment } from "components/PlayerUi/Comment/Comment";
import { jwtDecode, JwtPayload } from "jwt-decode";
import {
  addFavouriteLesson,
  addLessonInBlackList,
  deleteFavouriteLesson,
  getDataUserProfileWithOutToken,
  getLessons,
  getLessonsWithOutToken,
  getUsersProfileList,
  getUsersProfileListWithOutToken,
  loadMoreData,
  setIsFollow,
  setIsUnFollow,
  XURL,
} from "app/api/apiLessons";
import {
  appendDateList,
  appendLessons,
  appendPopularityList,
  setFavouriteLessonsList,
  setOffset,
} from "app/service/lessons/lessonsSlice";
import {
  ILesson,
  ILessonsState,
  IPlayerCommentDataResults,
  IUsersProfiles,
} from "app/types/type";
import { getDataUserProfile } from "app/api/api";
import { Loading } from "components/Loading/Loading";
import { Link } from "react-router-dom";
import { setSubscribe } from "app/service/profileCard/profileCardSlice";
import { toast } from "react-toastify";
import { AdaptiveCardVideo } from "components/LessonsUi/AdaptiveCardVideo/AdaptiveCardVideo";
import { BASE_URL } from "components/LessonsUi/ShareMenu";
import { useTranslation } from "react-i18next";
import link from "../../app/assets/lessons/LinkConditions.svg";
import {
  setDefaultStateCommentData,
  setPlayerCommentData,
} from "app/service/player/playerSlice";
import BigLockIcon from "../../app/assets/lessons/BigLockIcon.svg";
import { Error } from "components/ErrorPage/Error";
import { ErrorPlayer } from "components/ErrorPlayer/ErrorPlayer";
import { Condition } from "components/PlayerUi/Condition/Condition";
import playIcon from "../../app/assets/lessons/PlayIcon.svg";
import { EditLessonModal } from "components/LessonsUi/EditLessonModal/EditLessonModal";
export const LessonPlayer = () => {
  const dispatch = useDispatch();
  const { playerData, playerCommentData } = useSelector(
    (state) => state.player,
  );
  const { favouriteLessonsList } = useSelector(
    (state) => state.lessons,
  );

  interface CustomJwtPayload extends JwtPayload {
    email: string;
  }
  const { isAuth, userData } = useSelector((state) => state.user);
  const { profileData, subscribe } = useSelector(
    (state) => state.profileCard,
  );
  const loaderRefAdaptive = useRef<HTMLDivElement | null>(null);
  const {
    usersProfiles,
    lessons,
    activeFilter,
    dateList,
    popularityList,
    offsets,
  } = useSelector((state) => state.lessons);
  const { idLesson } = useParams();
  const [isFavouriteLessonId, setIsFavouriteLessonId] = useState<
    boolean | null
  >(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorLoadPlayer, setErrorLoadPlayer] = useState(false);
  const [hasFetchedPlayerId, setHasFetchedPlayerId] = useState(false);
  const [, setHasFetchedProfile] = useState(false);
  const [hasFetchedComments, setHasFetchedComments] = useState(false);
  const [value, setValue] = useState("");
  const [, setIsFocused] = useState(false);
  const [blacklistedLessons, setBlacklistedLessons] = useState<
    number[]
  >([]);

  const [emailToken, setEmailToken] = useState<string | null>(null);
  useEffect(() => {
    // Прокрутка страницы наверх при монтировании компонента
    window.scrollTo(0, 0);
  }, [idLesson]);
  const handleAddToBlacklist = (lessonId: number) => {
    addLessonInBlackList(dispatch, lessonId);
    setBlacklistedLessons((prev) => [...prev, lessonId]);
    toast.success("Видео  убрано из рекомендаций");
  };

  function handleChange(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    setValue(event.target.value);
  }

  useEffect(() => {
    if (playerData?.is_favorite !== undefined) {
      setIsFavouriteLessonId(playerData.is_favorite);
    }
  }, [playerData?.is_favorite]);

  useEffect(() => {
    const profilesData = localStorage.getItem("profiles");

    if (profilesData) {
      try {
        const profiles = JSON.parse(profilesData);
        const activeProfile = localStorage.getItem("activeAcc");

        const currentProfile = profiles.filter(
          (profile: any) =>
            profile.user_id.toString() === activeProfile?.toString(),
        );

        if (currentProfile[0] && currentProfile[0].accessToken) {
          const decodedToken: CustomJwtPayload = jwtDecode(
            currentProfile[0].accessToken,
          );
          setEmailToken(decodedToken.email);
        } else {
          console.error(
            "Активный профиль не найден или accessToken отсутствует",
          );
          setEmailToken(null);
        }
      } catch (error) {
        console.error("Ошибка при обработке профилей:", error);
        setEmailToken(null);
      }
    } else {
      console.error("Профили не найдены в localStorage");
      setEmailToken(null);
    }
  }, []);
  // Первый useEffect для загрузки основной информации (плеера, комментариев и т.д.)
  useEffect(() => {
    if (!idLesson) {
      console.log("ID урока не найден");
      return; // Если idLesson неопределен, ничего не делаем
    }
    const fetchData = async () => {
      setLoading(true);
      setErrorLoadPlayer(false);
      setError(false);
      console.log("Начинаем запросы");
      try {
        const uniqueUserIds = new Set<number>();

        // Запрос данных для авторизованных пользователей
        let playerResponse;
        if (isAuth) {
          console.log("Авторизованный пользователь");
          // if (playerData) return;
          playerResponse = await getPlayerId(
            dispatch,
            idLesson.toString(),
          );
          console.log(playerResponse);

          if (playerResponse.status === 404) {
            setError(true);
            return;
          }
          if (playerResponse.message === "Network Error") {
            setErrorLoadPlayer(true);
            return;
          }

          if (playerResponse?.user_id) {
            console.log("Добавляем user_id владельца видео");
            // Добавляем user_id владельца видео
            uniqueUserIds.add(playerResponse.user_id);
            // Загружаем профиль владельца
            await getDataUserProfile(
              dispatch,
              playerResponse.user_id.toString(),
            );

            // Получение комментариев, если они есть
            if (playerResponse.count_comments > 0) {
              try {
                // Получаем комментарии
                const playerComments = await getPlayerComments(
                  dispatch,
                  +idLesson,
                );

                // Добавляем user_id комментаторов
                playerComments?.results.forEach(
                  (comment: IPlayerCommentDataResults) => {
                    if (comment.user_id) {
                      uniqueUserIds.add(comment.user_id);
                    }
                  },
                );
              } catch (error) {
                console.error(
                  "Ошибка при загрузке комментариев:",
                  error,
                );
              }
            } else {
              dispatch(setDefaultStateCommentData());
            }
          }
          // console.log(!playerResponse.media_id)
          // if (!playerResponse.media_id) {
          //   setErrorLoadPlayer(true);
          // }
        } else {
          // Для неавторизованных пользователей
          playerResponse = await getPlayerIdWithOutToken(
            dispatch,
            idLesson.toString(),
          );

          if (playerResponse === 404) {
            setError(true);
            return;
          }
          console.log(playerResponse);
          if (playerResponse?.user_id) {
            // Добавляем user_id владельца видео
            uniqueUserIds.add(playerResponse.user_id);

            // Загружаем профиль владельца
            await getDataUserProfileWithOutToken(
              dispatch,
              playerResponse.user_id.toString(),
            );

            // Получение комментариев, если они есть
            if (playerResponse.count_comments > 0) {
              await getPlayerComments(dispatch, +idLesson);
              // Добавляем user_id комментаторов
              playerCommentData?.results.forEach(
                (comment: IPlayerCommentDataResults) => {
                  // console.log(comment);
                  if (comment.user_id) {
                    // console.log(comment.user_id);
                    uniqueUserIds.add(comment.user_id);
                  }
                },
              );
            }
          }
          // console.log(!playerResponse.media_id)
          // if (!playerResponse.media_id) {
          //   setErrorLoadPlayer(true);
          // }
        }

        // Запрашиваем профили пользователей из уроков
        const allLessons = [
          ...(dateList?.results || []),
          ...(popularityList?.results || []),
        ];

        allLessons.forEach((lesson: ILesson) => {
          if (lesson.user_id) uniqueUserIds.add(lesson.user_id);
        });

        // Если нет новых user_id, выходим
        const userIdArray = Array.from(uniqueUserIds);
        if (userIdArray.length === 0) return;

        // Формируем строку с user_id для запроса
        const idsString = userIdArray.join(",");

        // Запрос профилей пользователей
        if (isAuth && allLessons) {
          await getUsersProfileList(dispatch, idsString);
        } else {
          await getUsersProfileListWithOutToken(dispatch, idsString);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    // Запускаем запрос только при изменении idLesson или isAuth
    if (idLesson) {
      fetchData();
    } else {
      console.log("ID не найден");
    }
  }, [
    dispatch,
    idLesson,
    isAuth,
    dateList?.results,
    // error,
    // errorLoadPlayer,
    popularityList?.results,
  ]);

  useEffect(() => {
    if (
      popularityList?.results.length &&
      popularityList?.results.length > 0
    )
      return;
    const fetchLessons = async () => {
      setLoading(true);
      const currentOffset = offsets[activeFilter] || 0;

      try {
        // if (playerData === 404) return
        isAuth
          ? await getLessons(dispatch, activeFilter, currentOffset) // Запрос первого набора уроков
          : await getLessonsWithOutToken(dispatch, activeFilter);
      } catch (error) {
        console.error("Ошибка при загрузке уроков:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [activeFilter, dispatch, isAuth]);
  useEffect(() => {
    if (profileData) {
      // console.log(profileData)
      dispatch(setSubscribe(profileData.is_subscribed!));
    }
  }, [dispatch, profileData]);

  const handleFollow = async () => {
    try {
      await setIsFollow(
        playerData?.user_id ? playerData?.user_id.toString() : "",
      );
      dispatch(setSubscribe(true));
    } catch (error) {
      toast.error("Ошибка при подписке.");
    }
  };

  const handleUnfollow = async () => {
    try {
      await setIsUnFollow(
        playerData?.user_id ? playerData?.user_id.toString() : "",
      );
      dispatch(setSubscribe(false));
    } catch (error) {
      toast.error("Ошибка при отписке.");
    }
  };

  const addFavouriteVideo = async () => {
    if (idLesson) {
      await addFavouriteLesson(dispatch, +idLesson);
      setIsFavouriteLessonId(true);
    }
  };
  const handleDeleteLesson = async () => {
    try {
      if (idLesson) {
        await deleteFavouriteLesson(+idLesson);
      }
      setIsFavouriteLessonId(false);
      if (favouriteLessonsList?.results && idLesson) {
        dispatch(
          setFavouriteLessonsList({
            ...favouriteLessonsList,
            results: favouriteLessonsList.results.filter(
              (lesson: ILesson) => lesson.id !== +idLesson,
            ),
          }),
        );
      }
    } catch (error) {
      console.error(
        "Ошибка при удалении урока из избранного:",
        error,
      );
    }
  };
  const { t } = useTranslation();

  const nameProfile =
    profileData?.first_name && profileData.last_name
      ? `${profileData?.first_name}  ${profileData.last_name}`
      : `${t("default.name")} ${t("default.lastName")}`;
  const [playerSize, setPlayerSize] = useState({
    width: "100%",
    height: "636",
  });

  const handleSizeChange = ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => {
    setPlayerSize({
      width: width < 600 ? `${width}px` : "100%",
      height: height < 400 ? `${height}px` : `${height}px`,
    });
  };
  function autoGrow(el: any) {
    el.style.height = "5px";
    el.style.height = el.scrollHeight + "px";
  }

  const textarea = document.getElementById("textarea");
  if (textarea) {
    textarea.addEventListener("input", function () {
      autoGrow(this as HTMLElement);
    });
  }

  const handleSendComment = (id: number, text: string) => {
    sendPlayerComment(id, text);
    setValue("");
    if (textarea) {
      textarea.style.height = "25px"; // Сбрасываем высоту textarea
    }
    setTimeout(() => {
      getPlayerComments(dispatch, id);
    }, 500);
  };
  const filteredLessons =
    (activeFilter === "hi"
      ? dateList?.results
      : popularityList?.results
    )
      ?.filter(
        (lesson: ILesson) => !blacklistedLessons.includes(lesson.id),
      )
      .filter(
        (lesson: ILesson) =>
          idLesson ? lesson.id !== +idLesson : true, // Проверяем, есть ли idLesson
      ) ?? []; // Если результат фильтрации undefined, вернуть пустой массив

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
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Ссылка скопирована в буфер обмена");
    } catch (error) {
      console.error("Ошибка копирования: ", error);
      toast.error("Не удалось скопировать ссылку");
    }
  };

  useEffect(() => {
    const loadMore = async () => {
      const currentNext =
        activeFilter === "hi" ? dateList?.next : popularityList?.next;
      if (currentNext && !loading && isAuth) {
        // console.log("Подгружаем дополнительные уроки")
        const filter = activeFilter; // Текущий фильтр
        const offset = offsets[filter] || 0; // Текущий offset для фильтра
        console.log(filter);
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
        // await fetchProfiles(); // Запрос профилей для вновь загруженных уроков
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
    if (loaderRefAdaptive.current) {
      observer.observe(loaderRefAdaptive.current);
    }

    // useEffect(() => {
    //   // Если текущая позиция превышает половину длительности видео и запрос ещё не отправлялся
    //   if (!viewAdded && currentTime >= videoDuration / 2) {
    //     axios.post("/api/addView", { videoId: playerData.id }) // Отправляем запрос
    //       .then(() => {
    //         console.log("Просмотр добавлен!");
    //         setViewAdded(true); // Помечаем, что запрос выполнен
    //       })
    //       .catch((error) => console.error("Ошибка при добавлении просмотра:", error));
    //   }
    //   return () => clearInterval(intervalId); // Очищаем таймер при размонтировании компонента
    // }, [currentTime, videoDuration, viewAdded, playerData.id]);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
      if (loaderRefAdaptive.current) {
        observer.unobserve(loaderRefAdaptive.current);
      }
    };
  }, [
    loading,
    dispatch,
    filteredLessons,
    activeFilter,
    dateList?.next,
    popularityList?.next,
    isAuth,
    // offsets,
    lessons?.next,
  ]);
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false); // Воспроизводится ли видео
  const [watchedTime, setWatchedTime] = useState(0); // Время, которое пользователь реально смотрел
  const [currentTime, setCurrentTime] = useState(0); // Текущее положение видео
  const [videoDuration, setVideoDuration] = useState(0); // Общая длительность видео
  const [viewAdded, setViewAdded] = useState(false); // Запрос отправлен или нет
  const [openEditLesson, setOpenEditLesson] =
    useState<boolean>(false);
  // Управление временем просмотра
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setWatchedTime((prevTime) => prevTime + 1); // Увеличиваем просмотренное время каждую секунду
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Очищаем таймер при паузе или размонтировании
    };
  }, [isPlaying]); // Таймер запускается только если видео воспроизводится

  // Проверяем условие для отправки запроса
  const handleReady = (playerInstance) => {
    const duration = playerInstance.duration; // Длительность видео
    console.log(duration);
    setVideoDuration(duration);
  };
  useEffect(() => {
    console.log(watchedTime);
    if (
      !viewAdded &&
      watchedTime >= videoDuration / 2 &&
      videoDuration > 0
    ) {
      console.log("Просмотр засчитан!");
      console.log(watchedTime >= videoDuration / 2);
      // Здесь отправьте запрос на добавление просмотра
      setViewAdded(true); // Отмечаем, что просмотр учтён
      if (playerData?.id) addNewViews(+playerData?.id);
    }
  }, [watchedTime, videoDuration, viewAdded]);

  // Обработчики событий плеера
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleTimeUpdate = (event) =>
    setCurrentTime(event.currentTime);
  const handleDurationChange = (duration) =>
    setVideoDuration(duration);
  return (
    <div className={s.wrapper}>
      {error ? (
        <Error />
      ) : loading ? (
        <Loading />
      ) : (
        <div className={s.container}>
          <div className={s.inputContainer}>
            <div className={s.inputBlock}>
              <div className={s.search}>
                <img className={s.vol} src={img} alt='voiceSearch' />
                <input
                  className={s.input}
                  placeholder='Поиск'
                  type='text'
                />
                <img
                  className={s.search_img}
                  src={search}
                  alt='SearchIcon'
                />
              </div>
            </div>
            <div className={s.filterBlock}>
              <CustomFilter threeTab={false} />
            </div>
          </div>
          <main className={s.main}>
            <div className={s.playerContainer}>
              <div className={s.player}>
                {errorLoadPlayer ? (
                  <div className={s.errorPlayer}>
                    <ErrorPlayer />
                  </div>
                ) : playerData?.media_id ? (
                  <div className={s.kinPlayerEmbedContainer}>
                    <Player
                      onPlay={handlePlay} // Обработчик запуска видео
                      onPause={handlePause} // Обработчик паузы
                      onReady={handleReady}
                      onTimeUpdate={handleTimeUpdate} // Обновление текущего времени
                      onDurationChange={(e) =>
                        handleDurationChange(e.duration)
                      }
                      videoId={playerData.media_id}
                      onSizeChanged={handleSizeChange}
                      watermark={{
                        text: `${emailToken}`,
                        position: "bottom-right",
                        opacity: 1,
                        floating: true,
                      }}
                    />
                  </div>
                ) : isAuth ? (
                  <div>
                    <div className={s.posterContainer}>
                      <div className={s.background}></div>
                      <img
                        src={playerData?.poster_url}
                        className={s.poster}
                        alt='posterImg'
                      />
                      <button className={s.buyBtnPoster}>
                        <img
                          className={s.img_buy}
                          src={BigLockIcon}
                          alt='biglockicon'
                        />
                      </button>
                    </div>
                    <div className={s.conditionsBlock}>
                      <section>
                        <h1 className={s.conditionsTitle}>
                          Условия открытия урока
                        </h1>
                      </section>
                      <div className={s.conditionContainer}>
                        {playerData?.conditions.map((el) => (
                          // <div className={s.condition} key={el.id}>
                          //   <button className={s.linkButton}>
                          //     <img src={link} alt='linkIcon' />
                          //   </button>
                          //   <span className={s.text}>{el.text}</span>
                          // </div>
                          <Condition
                            condition={el}
                            id={playerData.id}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={s.posterContainer}
                    onClick={() => navigate("/login")}>
                    {/* <div className={s.background}></div> */}
                    <img
                      src={playerData?.poster_url}
                      className={s.poster}
                      alt='posterImg'
                    />
                    <button className={s.buyBtnPoster}>
                      <img
                        className={s.img_buy}
                        src={playIcon}
                        alt='playIcon'
                      />
                    </button>
                  </div>
                )}
              </div>
              <div className={s.videoInfoBlock}>
                <section>
                  <h1 className={s.titleVideo}>
                    {playerData?.title
                      ? playerData.title
                      : "Название урока"}
                  </h1>
                </section>
                <div
                  className={
                    profileData?.user_id === userData?.user_id
                      ? s.navigationProfileBlock
                      : s.navigationProfileBlockOwner
                  }>
                  <div className={s.profileContainer}>
                    <Link
                      to={
                        userData?.user_id === playerData?.user_id
                          ? `/profile`
                          : `/profile/${playerData?.user_id}`
                      }>
                      <div className={s.profile}>
                        <span className={s.round}>
                          <img
                            src={
                              "https://api.lr45981.tw1.ru" +
                              profileData?.photo
                            }
                            alt='profilePhoto'
                          />
                        </span>
                        <div className={s.profileInfo}>
                          <h2 className={s.profileName}>
                            {nameProfile}
                          </h2>
                          <span className={s.date}>
                            {playerData?.published_date
                              ? new Date(
                                  playerData.published_date,
                                ).toLocaleDateString("ru-RU", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })
                              : " 01.01.2024"}{" "}
                            id-{idLesson}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {profileData?.user_id !== userData?.user_id ? (
                      subscribe ? (
                        <button
                          className={s.isSubscribe}
                          onClick={
                            isAuth
                              ? handleUnfollow
                              : () => navigate("/login")
                          }>
                          <span className={s.isSubscribeText}>
                            {t("player.navigation.subscribed")}
                          </span>
                        </button>
                      ) : (
                        <button
                          className={s.subscribe}
                          onClick={
                            isAuth
                              ? handleFollow
                              : () => navigate("/login")
                          }>
                          <span className={s.subscribeText}>
                            {t("player.navigation.subscribe")}
                          </span>
                        </button>
                      )
                    ) : (
                      <button className={s.editButton} onClick={() => setOpenEditLesson(true)}>
                        <span className={s.editText}>
                          {t("lessonPage.editButton")}
                        </span>
                      </button>
                    )}
                  </div>
                  <nav
                    className={
                      profileData?.user_id !== userData?.user_id
                        ? s.navigationButtons
                        : s.oneNavigationButton
                    }>
                    {profileData?.user_id !== userData?.user_id &&
                      (isFavouriteLessonId ? (
                        <button
                          className={s.button}
                          onClick={
                            isAuth
                              ? handleDeleteLesson
                              : () => navigate("/login")
                          }>
                          <span className={s.buttonText}>
                            <img
                              src={unFavourite}
                              alt='unfavouriteIcon'
                            />
                            {t("player.navigation.unFavourite")}
                          </span>
                        </button>
                      ) : (
                        <button
                          className={s.button}
                          onClick={
                            isAuth
                              ? addFavouriteVideo
                              : () => navigate("/login")
                          }>
                          <span className={s.buttonText}>
                            <img
                              src={favourite}
                              alt='favouriteIcon'
                            />
                            {t("player.navigation.favourite")}
                          </span>
                        </button>
                      ))}
                    <button
                      className={s.button}
                      onClick={() =>
                        copyToClipboard(
                          `${BASE_URL}${playerData?.id}`,
                        )
                      }>
                      <span className={s.buttonText}>
                        <img src={share} alt='ShareIcon' />
                        {t("player.navigation.share")}
                      </span>
                    </button>
                    {profileData?.user_id !== userData?.user_id && (
                      <button className={s.button}>
                        <span className={s.buttonText}>
                          <img src={complaint} alt='complaintIcon' />

                          {t("player.navigation.complaint")}
                        </span>
                      </button>
                    )}
                  </nav>
                </div>
                <div className={s.statistic}>
                  <span>
                    <img src={view} alt='view' />
                    {playerData?.views ? playerData.views : 0}
                  </span>
                  <span>
                    <img src={comment} alt='comment' />
                    {playerData?.count_comments
                      ? playerData.count_comments
                      : 0}
                  </span>
                </div>
                <p className={s.description}>
                  {playerData?.description
                    ? playerData.description
                    : "описание"}
                </p>
              </div>

              <div className={s.commentsContainer}>
                <h1 className={s.commentsTitle}>
                  {t("player.navigation.comments")}
                </h1>
                {playerData?.media_id && isAuth && (
                  <div className={s.CommentWrapper}>
                    <div className={s.commentFieldContainer}>
                      <textarea
                        name='comment'
                        id='textarea'
                        placeholder={t(
                          "player.navigation.placeholder",
                        )}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        value={value}
                        className={s.commentsField}
                        maxLength={200}
                      />
                      <button
                        className={s.sendComment}
                        onClick={() =>
                          handleSendComment(+idLesson!, value)
                        }>
                        {t("player.navigation.send")}
                      </button>
                      <span className={s.counterLetter}>
                        {value.length > 0
                          ? `${value.length} / 200`
                          : "0 / 200"}
                      </span>
                    </div>
                  </div>
                )}

                <div className={s.comments}>
                  {idLesson &&
                    playerCommentData?.results.map(
                      (comment, index) => (
                        <Comment
                          commentData={comment}
                          key={index}
                          profileData={
                            profilesMap[comment?.user_id!] ||
                            profilesMap[userData?.user_id!] ||
                            null
                          }
                        />
                      ),
                    )}
                </div>
              </div>
            </div>
            <div className={s.rightSideContainer}>
              <div className={s.adaptiveFilter}>
                <CustomFilter threeTab={false} />
              </div>
              {filteredLessons.map((el, index) => {
                return (
                  <RightSideVideo
                    key={index}
                    lessonData={el}
                    profileData={profilesMap[el?.user_id!] || null}
                    onBlacklist={() => handleAddToBlacklist(el.id)}
                  />
                );
              })}
              <div ref={loaderRef} className={s.ref}></div>
            </div>
            <div className={s.rightSideContainerAdaptive}>
              <div className={s.adaptiveFilter}>
                <CustomFilter threeTab={false} />
              </div>
              {filteredLessons.map((el, index) => {
                return (
                  <AdaptiveCardVideo
                    key={index}
                    lessonData={el}
                    profileData={profilesMap[el?.user_id!] || null}
                  />
                );
              })}
              <div ref={loaderRefAdaptive} className={s.ref}></div>
            </div>
          </main>
        </div>
      )}
      {openEditLesson && playerData?.title && (
        // <div className={styles.editModal}>
        <EditLessonModal
          isPublic={!!playerData.is_public}
          idLesson={playerData.id}
          closeModal={() => setOpenEditLesson(false)}
          lessonName={playerData?.title}
          lessonDesc={playerData.description}
        />
        // </div>
      )}
    </div>
  );
};
