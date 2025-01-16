import React, { useEffect, useState } from "react";
import s from "./style.module.scss";
import more from "../../../app/assets/lessons/more_img.svg";
import view from "../../../app/assets/lessons/view.svg";
import comment from "../../../app/assets/lessons/comment.svg";
import wallet from "../../../app/assets/lessons/wallet.svg";
import { LessonProps } from "app/types/type";
import { Loading } from "components/Loading/Loading";
import channel from "../../../app/assets/profileCard/unknown_user.svg";
import { Link } from "react-router-dom";
import { ShareMenu } from "components/LessonsUi/ShareMenu";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { removeLessonFromBlacklist } from "app/service/lessons/lessonsSlice";
import { BlackListModal } from "components/LessonsUi/BlackListModal/BlackListModal";
import { useTranslation } from "react-i18next";
import play from "../../../app/assets/lessons/play.svg";
import lockIcon from "../../../app/assets/lessons/LockIconWhite.svg";

export const RightSideVideo = ({
  lessonData,
  profileData,
  onBlacklist,
}: LessonProps) => {
  const { blacklist } = useSelector((state) => state.lessons);
  const dispatch = useDispatch();

  const [openBlackListModal, setOpenBlackListModal] =
    useState<boolean>(false);

  const isBlacklisted = blacklist.includes(lessonData?.id!);
  const handleRemoveFromBlacklist = (lessonId: number) => {
    dispatch(removeLessonFromBlacklist(lessonId));
  };
  const [, setIsPurchasedValid] = useState<boolean>(true);
  const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);
  const { t } = useTranslation();
  const name =
    profileData?.first_name && profileData?.last_name
      ? `${profileData.first_name} ${profileData.last_name}`
      : `${t("default.name")} ${t("default.lastName")}`;

  const convertSecondsToMinutes = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };
  let videoDuration = convertSecondsToMinutes(lessonData!.duration);
  const publishedDate = new Date(
    lessonData!.published_date,
  ).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  let defaultUrl = "https://api.lr45981.tw1.ru";
  let photoUrl = profileData?.photo
    ? defaultUrl + profileData.photo
    : channel;

  const purchaseDate = new Date(lessonData?.until_date!);
  // console.log(profileData)
  // Устанавливаем дату окончания как покупка + 3 месяца
  const extendedDate = new Date(purchaseDate);
  extendedDate.setMonth(purchaseDate.getMonth() + 3);
  // console.log(openShareMenu)
  useEffect(() => {
    const currentDate = new Date();
    const timeToCheck =
      extendedDate.getTime() - currentDate.getTime() + 2000;

    const timeout = setTimeout(() => {
      const now = new Date();
      setIsPurchasedValid(now <= extendedDate);
    }, timeToCheck);

    // Очистка таймера при размонтировании компонента
    return () => clearTimeout(timeout);
  }, [extendedDate]);

  // Форматируем дату окончания для отображения
  const formattedExtendedDate = extendedDate.toLocaleDateString(
    "ru-RU",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );
  const closeShareMenu = () => {
    setOpenShareMenu(false);
  };
  const closeBlackListModal = () => {
    setOpenBlackListModal(false);
  };
  return (
    <div className={isBlacklisted ? s.lessonBlacklist : s.wrapper}>
      {!lessonData ? (
        <Loading />
      ) : !isBlacklisted ? (
        <>
          <div className={s.imageContainer}>
            <Link
              to={`/lesson/${lessonData.id}`}
              className={s.imageLink}>
              <div className={s.imageBlock}>
                <img
                  src={lessonData!.poster_url}
                  alt='rightSideImg'
                  className={s.rightSideImg}
                />
                <div
                  className={
                    lessonData?.is_public ||
                    lessonData?.until_date !== null
                      ? s.none
                      : s.background
                  }></div>
              </div>
              <button className={s.button_play}>
                <img
                  className={s.play_img}
                  src={
                    lessonData?.is_public ||
                    lessonData?.until_date !== null
                      ? play
                      : lockIcon
                  }
                  alt='playVideoIcon'
                />
              </button>
              <div className={s.timebox}>
                <span className={s.time}>{videoDuration}</span>
              </div>
            </Link>
          </div>

          <div className={s.container}>
            <div>
              <section className={s.titleBlock}>
                <h1 className={s.title}>{lessonData?.title}</h1>
                <img
                  onClick={() => setOpenShareMenu(true)}
                  className={s.img_share}
                  src={more}
                  alt='ShareIcon'
                />
                {openShareMenu && (
                  <div className={s.shareMenuContainer}>
                    <ShareMenu
                      black
                      lessonId={lessonData.id}
                      isFavouriteLesson={lessonData?.is_favorite}
                      myAccount={false}
                      closeMenu={closeShareMenu}
                    />
                  </div>
                )}
              </section>
              <p>
                <span className={s.date}>
                  Опубликовано: {publishedDate}
                </span>
                <span className={s.description}>
                  {lessonData?.description}
                </span>
              </p>
            </div>
            <div className={s.bottomContainer}>
              <Link to={`/profile/${lessonData?.user_id}`}>
                <div className={s.profileContainer}>
                  <span className={s.round}>
                    <img src={photoUrl} alt='profilePhoto' />
                  </span>
                  <div className={s.profile}>
                    <h2 className={s.name}>{name}</h2>
                    <div className={s.statistic}>
                      <span>
                        <img src={view} alt='view' />
                        {lessonData.views}
                      </span>
                      <span>
                        <img src={comment} alt='comment' />
                        {lessonData.count_comments}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* <button className={s.buy_btn}>
								<img className={s.img_buy} src={wallet} alt="" />
								<span className={s.text_buy}>
									Купить за {lessonData.price} ₽
								</span>
							</button> */}
            </div>
          </div>
        </>
      ) : (
        <div className={s.blackList}>
          <div className={s.blackPhoto}>
            <span className={s.text}>Урок удален</span>
            <button
              className={s.back}
              onClick={() =>
                handleRemoveFromBlacklist(lessonData?.id!)
              }>
              Отменить
            </button>
            <button
              className={s.addBlackList}
              onClick={() => setOpenBlackListModal(true)}>
              Расскажите почему
            </button>
          </div>
        </div>
      )}
      {openBlackListModal && (
        <div className={s.blackLiistModal}>
          <BlackListModal
            onClose={closeBlackListModal}
            onBlacklist={onBlacklist}
          />
        </div>
      )}
    </div>
  );
};
