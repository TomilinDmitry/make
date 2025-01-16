import { FC, useEffect, useState } from "react";
// Import images
import channel from "../../app/assets/profileCard/unknown_user.svg";
import comment from "../../app/assets/lessons/comment.svg";
import lesson from "../../app/assets/lessons/lesson.svg";
import more from "../../app/assets/lessons/more_img.svg";
import play from "../../app/assets/lessons/play.svg";
import view from "../../app/assets/lessons/view.svg";
import wallet from "../../app/assets/lessons/wallet.svg";
import wallet1 from "../../app/assets/lessons/walletGreen.svg";
import styles from "./Lessons.module.scss";
import { LessonProps } from "app/types/type";
import { Link } from "react-router-dom";
import { ShareMenu } from "components/LessonsUi/ShareMenu";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { removeLessonFromBlacklist } from "app/service/lessons/lessonsSlice";
import lockIcon from "../../app/assets/lessons/LockIconWhite.svg";
import editButton from "../../app/assets/lessons/EditButton.png";
import { BlackListModal } from "components/LessonsUi/BlackListModal/BlackListModal";
import { translateText } from "helpers/localStorage.helper";
import {
  setTranslatedDescription,
  setTranslatedVideoName,
} from "app/service/translate/translateSlice";
import { useTranslation } from "react-i18next";
import { EditLessonModal } from "components/LessonsUi/EditLessonModal/EditLessonModal";
export const Lesson = ({
  lessonData,
  profileData,
  currentId,
  onBlacklist,
}: LessonProps) => {
  const { translatedVideoName, translatedDescription } = useSelector(
    (state) => state.translated,
  );
  const { isAuth } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.header);
  const { t } = useTranslation();

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isPurchasedValid, setIsPurchasedValid] =
    useState<boolean>(true);
  const [activeLesson, setActiveLesson] = useState<number | null>(
    null,
  );

  const [openBlackListModal, setOpenBlackListModal] =
    useState<boolean>(false);
  const [openEditLesson, setOpenEditLesson] =
    useState<boolean>(false);
  const { blacklist } = useSelector((state) => state.lessons);
  const dispatch = useDispatch();
  const toggleMenu = (lessonId: number) => {
    setActiveLesson(lessonId);
    setShowMenu(!showMenu);
  };
  const closeMenu = () => setShowMenu(false);
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
  const publishedDate = new Date(
    lessonData!.published_date,
  ).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const purchaseDate = lessonData?.until_date
    ? new Date(lessonData.until_date).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null; // Или укажите другое значение, если `untill_date` отсутствует

  // Устанавливаем дату окончания как покупка + 3 месяца

  let defaultUrl = "https://api.lr45981.tw1.ru";
  let photoUrl = profileData?.photo
    ? defaultUrl + profileData.photo
    : channel;

  let videoDuration = convertSecondsToMinutes(lessonData!.duration);

  const isBlacklisted = blacklist.includes(lessonData?.id!);
  const handleRemoveFromBlacklist = (lessonId: number) => {
    dispatch(removeLessonFromBlacklist(lessonId));
  };

  const closeBlackListModal = () => {
    setOpenBlackListModal(false);
  };
  const videoName = lessonData?.title ? lessonData.title : "Название";
  const videoDescription = lessonData?.description
    ? lessonData.description
    : "Описание";

  return (
    <div
      className={
        isBlacklisted ? styles.lessonBlacklist : styles.lesson
      }>
      {!isBlacklisted ? (
        <>
          <div className={styles.imageContainer}>
            <Link to={`/lesson/${lessonData?.id}`}>
              <div className={styles.imageBlock}>
                <img
                  className={styles.img_lesson}
                  src={lessonData!.poster_url}
                  alt='poster'
                />
                <div
                  className={
                    lessonData?.is_public ||
                    lessonData?.until_date !== null
                      ? styles.none
                      : styles.background
                  }></div>
              </div>

              <button className={styles.button_play}>
                <img
                  className={styles.play_img}
                  src={
                    lessonData?.is_public ||
                    lessonData?.until_date !== null
                      ? play
                      : lockIcon
                  }
                  alt='playVideoIcon'
                />
              </button>
              <div className={styles.time_box}>
                <div className={styles.time_lessons}>
                  {videoDuration}
                </div>
              </div>
            </Link>
          </div>
          <div className={styles.name_les_btn_share}>
            <p className={styles.name_les}>
              {lessonData?.id !== undefined &&
                // translatedVideoName[lessonData?.id]
                videoName}
            </p>
            <button
              className={styles.btn_share}
              onClick={() => {
                // console.log("lessonDat?a.id:", lessonData?.id)
                toggleMenu(lessonData?.id!);
              }}>
              <img
                className={styles.img_share}
                src={more}
                alt='ShareIcon'
              />
            </button>

            {!isAuth && showMenu ? (
              // Блок для неавторизованных пользователей
              <div className={styles.shareMenu}>
                <ShareMenu
                  closeMenu={closeMenu}
                  myAccount={true} // Неавторизованный пользователь не может быть автором
                  lessonId={activeLesson!}
                />
              </div>
            ) : // Блок для авторизованных пользователей
            currentId === lessonData?.user_id ? (
              <div className={styles.shareMenu}>
                {showMenu && activeLesson === lessonData?.id && (
                  <ShareMenu
                    closeMenu={closeMenu}
                    myAccount={true} // Авторизованный пользователь — автор урока
                    lessonId={activeLesson!}
                  />
                )}
              </div>
            ) : (
              <div className={styles.shareMenu}>
                {showMenu && (
                  <ShareMenu
                    closeMenu={closeMenu}
                    myAccount={false} // Авторизованный пользователь, но не автор урока
                    lessonId={activeLesson!}
                    isFavouriteLesson={lessonData?.is_favorite}
                  />
                )}
              </div>
            )}
          </div>
          <p className={styles.date}>
            {t("lessonPage.published")}: {publishedDate}
          </p>
          <p className={styles.info}>
            {lessonData?.description !== undefined
              ? // translatedDescription[lessonData?.id]
                videoDescription
              : "описание"}
          </p>
          <div className={styles.channel_box}>
            {window.location.pathname === "/profile1" ? (
              <button
                className={styles.editButton}
                onClick={() => setOpenEditLesson(true)}>
                {t("lessonPage.editButton")}
              </button>
            ) : (
              <>
                <Link
                  to={
                    currentId === lessonData?.user_id
                      ? "/profile"
                      : `/profile/${lessonData?.user_id}`
                  }>
                  <div className={styles.channel}>
                    <img
                      className={styles.img_channel}
                      src={photoUrl}
                      alt='ChannelIcon'
                    />

                    <div className={styles.name_view_com}>
                      <p className={styles.name_channel}>
                        <span>{name}</span>
                        {/* <img
                          className={styles.img_name}
                          src={star}
                          alt=''
                        /> */}
                      </p>
                      <div className={styles.view_comm_box}>
                        <div className={styles.view_comment}>
                          <img
                            className={styles.img_view_com}
                            src={view}
                            alt='views'
                          />
                          <span className={styles.num_view_com}>
                            {lessonData?.views}
                          </span>
                        </div>
                        <div className={styles.view_comment}>
                          <img
                            className={styles.img_com}
                            src={comment}
                            alt='comments'
                          />
                          <span className={styles.num_view_com}>
                            {lessonData?.count_comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </>
            )}

            {currentId !== lessonData?.user_id ? (
              lessonData?.until_date !== null && isPurchasedValid ? (
                <button className={styles.extendDateButton}>
                  <img
                    className={styles.img_buy}
                    src={wallet1}
                    alt=''
                  />
                  <p className={styles.text_buy}>до {purchaseDate}</p>
                </button>
              ) : (
                // <button className={styles.buy_btn}>
                // 	<img
                // 		className={styles.img_buy}
                // 		src={wallet}
                // 		alt=""
                // 	/>
                // 	<p className={styles.text_buy}>
                // 		{/* Купить за */}
                // 		<span>{lessonData?.price}₽</span>
                // 	</p>
                // </button>
                ""
              )
            ) : (
              <button
                className={styles.editButton}
                onClick={() => setOpenEditLesson(true)}>
                {t("lessonPage.editButton")}
              </button>
            )}
          </div>
        </>
      ) : (
        <div className={styles.blackList}>
          <div className={styles.blackPhoto}>
            <span className={styles.text}>
              {t("lessonPage.shareMenu.notInteresting.lessonDelete")}
            </span>
            <button
              className={styles.back}
              onClick={() =>
                handleRemoveFromBlacklist(lessonData?.id!)
              }>
              {t("lessonPage.shareMenu.notInteresting.Cancel")}
            </button>
            <button
              className={styles.addBlackList}
              onClick={() => setOpenBlackListModal(true)}>
              {t("lessonPage.shareMenu.notInteresting.tell.title")}
            </button>
          </div>
        </div>
      )}
      {openEditLesson && lessonData?.title && (
        // <div className={styles.editModal}>
          <EditLessonModal
            isPublic={!!lessonData.is_public}
            published={!!lessonData.published}
            idLesson={lessonData.id}
            closeModal={() => setOpenEditLesson(false)}
            lessonName={lessonData?.title}
            lessonDesc={lessonData.description}
          />
        // </div>
      )}
    </div>
  );
};
