import { useEffect, useState } from "react";
// Import images
import channel from "../../../../../app/assets/profileCard/unknown_user.svg";
import comment from "../../../../../app/assets/lessons/comment.svg";
import more from "../../../../../app/assets/lessons/more_img.svg";
import play from "../../../../../app/assets/lessons/play.svg";
import view from "../../../../../app/assets/lessons/view.svg";
import styles from "./smallLessonCardElement.module.scss";
import { IHomeLessonProps } from "app/types/type";
import { Link } from "react-router-dom";
import { ShareMenu } from "components/LessonsUi/ShareMenu";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { removeLessonFromBlacklist } from "app/service/lessons/lessonsSlice";
import { BlackListModal } from "components/LessonsUi/BlackListModal/BlackListModal";
import { useTranslation } from "react-i18next";
export const SmallLessonCardElement = ({
  lessonData,
  profileData,
}: IHomeLessonProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [, setIsPurchasedValid] = useState<boolean>(true);
  const [activeLesson, setActiveLesson] = useState<number | null>(
    null,
  );

  const [openBlackListModal, setOpenBlackListModal] =
    useState<boolean>(false);
  const { blacklist } = useSelector((state) => state.lessons);
  const dispatch = useDispatch();
  const toggleMenu = (lessonId: number) => {
    setActiveLesson(lessonId);
    setShowMenu(!showMenu);
  };
  const { t } = useTranslation();
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
  const purchaseDate = new Date(lessonData?.untill_date!);

  // Устанавливаем дату окончания как покупка + 3 месяца
  const extendedDate = new Date(purchaseDate);
  extendedDate.setMonth(purchaseDate.getMonth() + 3);

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
        // isBlacklisted ? styles.lessonBlacklist :
        styles.lesson
      }>
      {!isBlacklisted ? (
        <>
          <div className={styles.imageContainer}>
            <Link to={`/lesson/${lessonData?.id}`}>
              <img
                className={styles.img_lesson}
                src={`${lessonData.poster_url}`}
                alt='poster'
              />

              <button className={styles.button_play}>
                <img
                  className={styles.play_img}
                  src={play}
                  alt='playVideoIcon'
                />
              </button>
              <div className={styles.time_box}>
                <div className={styles.time_lessons}>
                  {videoDuration}
                  {/* 2:02 */}
                </div>
              </div>
            </Link>
            {lessonData?.user_id ? (
              <div className={styles.shareMenu}>
                {showMenu && activeLesson === lessonData?.id && (
                  <ShareMenu
                    closeMenu={closeMenu}
                    myAccount={false}
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
          <div className={styles.name_les_btn_share}>
            <p className={styles.name_les}>
              {lessonData!.title}
              {/* Название */}
            </p>
            <button
              className={styles.btn_share}
              onClick={() => {
                // console.log("lessonData.id:", lessonData?.id)
                toggleMenu(lessonData?.id!);
              }}>
              <img
                className={styles.img_share}
                src={more}
                alt='ShareIcon'
              />
            </button>
            {/* {lessonData?.user_id ? (
						<div className={styles.shareMenu}>
							{showMenu && activeLesson === lessonData?.id && (
								<ShareMenu closeMenu={closeMenu} myAccount={false} />
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
					)} */}
          </div>
          <p className={styles.date}>
            Опубликовано:
            {publishedDate}
            {/* 01.01.2002 */}
          </p>
          <p className={styles.info}>
            {lessonData!.description}
            {/* Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Voluptatem, aliquid cumque fugiat eum repellat totam odio ex
					perspiciatis doloribus dolorem quos pariatur quod rerum
					recusandae ab aut ullam perferendis in. */}
          </p>
          <div className={styles.channel_box}>
            {window.location.pathname === "/profile1" ? (
              <button className={styles.editButton}>
                Редактировать
              </button>
            ) : (
              <>
                <Link to={`/profile/${lessonData?.user_id}`}>
                  <div className={styles.channel}>
                    <img
                      className={styles.img_channel}
                      src={photoUrl}
                      alt='ChannelIcon'
                    />

                    <div className={styles.name_view_com}>
                      <p className={styles.name_channel}>
                        <span>
                          {name}
                          {/* Dmitry Tomilin */}
                        </span>
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
                            alt=''
                          />
                          <span className={styles.num_view_com}>
                            {lessonData?.views}
                            {/* 1000 */}
                          </span>
                        </div>
                        <div className={styles.view_comment}>
                          <img
                            className={styles.img_com}
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
          </div>
        </>
      ) : (
        <div className={styles.blackList}>
          <div className={styles.blackPhoto}>
            <span className={styles.text}> {t("lessonPage.shareMenu.notInteresting.lessonDelete")}</span>
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
            // onBlacklist={onBlacklist}
          />
        </div>
      )}
    </div>
  );
};
