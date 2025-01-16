import { FC, useEffect, useState } from "react";
// Import images
import channel from "../../../app/assets/profileCard/unknown_user.svg";
import comment from "../../../app/assets/lessons/comment.svg";
import more from "../../../app/assets/lessons/more_img.svg";
import play from "../../../app/assets/lessons/play.svg";
import view from "../../../app/assets/lessons/view.svg";
import wallet from "../../../app/assets/lessons/wallet.svg";
import wallet1 from "../../../app/assets/lessons/walletGreen.svg";
import styles from "./adaptiveCardVideo.module.scss";
import { LessonProps } from "app/types/type";
import { Link } from "react-router-dom";
import { ShareMenu } from "components/LessonsUi/ShareMenu";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { removeLessonFromBlacklist } from "app/service/lessons/lessonsSlice";
import { BlackListModal } from "components/LessonsUi/BlackListModal/BlackListModal";
import { useTranslation } from "react-i18next";
import lockIcon from "../../../app/assets/lessons/LockIconWhite.svg";

export const AdaptiveCardVideo = ({
  lessonData,
  profileData,
  currentId,
  onBlacklist,
}: LessonProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isPurchasedValid, setIsPurchasedValid] =
    useState<boolean>(true);
  const [activeLesson, setActiveLesson] = useState<number | null>(
    null,
  );
  const { t } = useTranslation();

  const [openBlackListModal, setOpenBlackListModal] =
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
  const purchaseDate = new Date(lessonData?.until_date!);

  // Форматируем дату окончания для отображения
  const formattedExtendedDate = purchaseDate.toLocaleDateString(
    "ru-RU",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

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
                  src={ lessonData?.is_public ||
                    lessonData?.until_date !== null
                      ? play
                      : lockIcon}
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
            <p className={styles.name_les}>{lessonData!.title}</p>
            <button
              className={styles.btn_share}
              onClick={() => {
                toggleMenu(lessonData?.id!);
              }}>
              <img
                className={styles.img_share}
                src={more}
                alt='ShareIcon'
              />
            </button>
            {currentId === lessonData?.user_id ? (
              <div className={styles.shareMenu}>
                {showMenu && activeLesson === lessonData?.id && (
                  <ShareMenu
                    closeMenu={closeMenu}
                    myAccount={currentId === lessonData?.user_id}
                    lessonId={activeLesson!}
                  />
                )}
              </div>
            ) : (
              <div className={styles.shareMenu}>
                {showMenu && (
                  <ShareMenu
                    closeMenu={closeMenu}
                    myAccount={false}
                    lessonId={activeLesson!}
                    isFavouriteLesson={lessonData?.is_favorite}
                  />
                )}
              </div>
            )}
          </div>
          <p className={styles.date}>Опубликовано: {publishedDate}</p>
          <p className={styles.info}>{lessonData!.description}</p>
          <div className={styles.channel_box}>
            {window.location.pathname === "/profile1" ? (
              <button className={styles.editButton}>
                {t("profile.edit")}
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
                      </p>
                      <div className={styles.view_comm_box}>
                        <div className={styles.view_comment}>
                          <img
                            className={styles.img_view_com}
                            src={view}
                            alt=''
                          />
                          <span className={styles.num_view_com}>
                            {lessonData?.views}
                          </span>
                        </div>
                        <div className={styles.view_comment}>
                          <img
                            className={styles.img_view_com}
                            src={comment}
                            alt=''
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
                  <p className={styles.text_buy}>
                    до {formattedExtendedDate}
                  </p>
                </button>
              ) : (
                ""
              )
            ) : (
              <button className={styles.editButton}>
                {t("profile.edit")}
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
      {openBlackListModal && (
        <div className={styles.blackLiistModal}>
          <BlackListModal
            onClose={closeBlackListModal}
            onBlacklist={onBlacklist}
          />
        </div>
      )}
    </div>
  );
};
