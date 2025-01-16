import React, { useEffect, useRef, useState } from "react";
import s from "./style.module.scss";
import share from "../../app/assets/lessons/share.svg";
import notIntresting from "../../app/assets/lessons/NotShowIcon.svg";
import favourite from "../../app/assets/lessons/favouriteIcon.svg";
import complaint from "../../app/assets/lessons/complaint.svg";
import unFavourite from "../../app/assets/lessons/unFavouriteIcon.svg";
import {
  addFavouriteLesson,
  deleteFavouriteLesson,
  getLessons,
} from "app/api/apiLessons";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  addLessonToBlacklist,
  setComplaintOpen,
  setFavouriteLessonsList,
} from "app/service/lessons/lessonsSlice";
import { ILesson } from "app/types/type";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ComplaintModal } from "./ComplaintModal/ComplaintModal";

export const BASE_URL = "https://lr45981.tw1.ru/lesson/";

export const ShareMenu = ({
  closeMenu,
  myAccount,
  lessonId,
  black,
}: {
  closeMenu: () => void;
  myAccount: boolean;
  lessonId?: number;
  isFavouriteLesson?: boolean;
  black?: boolean;
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { favouriteLessonsList, activeFilter, openComplaint } =
    useSelector((state) => state.lessons);
  const lesson = useSelector((store) =>
    store.lessons.lessons?.results.find((l) => l.id === lessonId),
  );

  const [isFavouriteLessonId, setIsFavouriteLessonId] = useState(
    lesson?.is_favorite || false,
  );

  useEffect(() => {
    if (lesson?.is_favorite) {
      setIsFavouriteLessonId(lesson?.is_favorite);
    }
  }, [lesson?.is_favorite, lesson, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu]);

  const addInBlackList = () => {
    dispatch(addLessonToBlacklist(lessonId!));
  };

  const addFavouriteVideo = async () => {
    await addFavouriteLesson(dispatch, lessonId!);
    setIsFavouriteLessonId((prev: boolean) => !prev);
    getLessons(dispatch, activeFilter);
  };
  const handleDeleteLesson = async (lessonId: number) => {
    try {
      await deleteFavouriteLesson(lessonId);
      setIsFavouriteLessonId(false); // Установите в false сразу после удаления
      getLessons(dispatch, activeFilter);

      if (favouriteLessonsList?.results) {
        dispatch(
          setFavouriteLessonsList({
            ...favouriteLessonsList,
            results: favouriteLessonsList.results.filter(
              (lesson: ILesson) => lesson.id !== lessonId,
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
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${t("lessonPage.shareMenu.share.message")}`);
    } catch (error) {
      console.error("Ошибка копирования: ", error);
      toast.error("Не удалось скопировать ссылку");
    }
  };

  const toggleComplaintModal = () => {
    dispatch(setComplaintOpen(true));
  };
  return (
    <div className={s.wrapper} ref={containerRef}>
      <div className={black ? s.black : s.container}>
        <ul className={s.list}>
          {!myAccount ? (
            <>
              {isFavouriteLessonId ? (
                <li
                  className={s.listElement}
                  onClick={() => handleDeleteLesson(lessonId!)}>
                  <img src={unFavourite} alt='unFavouriteIcon' />
                  <span>{t("lessonPage.shareMenu.unFavourite")}</span>
                </li>
              ) : (
                <li
                  className={s.listElement}
                  onClick={addFavouriteVideo}>
                  <img src={favourite} alt='FavouriteIcon' />
                  <span>{t("lessonPage.shareMenu.favourite")}</span>
                </li>
              )}
              <li
                className={s.listElement}
                onClick={() =>
                  copyToClipboard(`${BASE_URL}${lesson?.id}`)
                }>
                <img src={share} alt='ShareIcon' />
                <span>{t("lessonPage.shareMenu.share.title")}</span>
              </li>
              <li className={s.listElement} onClick={addInBlackList}>
                <img src={notIntresting} alt='notIntrestingIcon' />
                <span>
                  {t("lessonPage.shareMenu.notInteresting.title")}
                </span>
              </li>
              <li
                className={s.listElement}
                onClick={toggleComplaintModal}>
                <img src={complaint} alt='' />
                <span>{t("lessonPage.shareMenu.complaint")}</span>
              </li>
            </>
          ) : (
            <>
              <li
                className={s.listElement}
                onClick={() =>
                  copyToClipboard(`${BASE_URL}${lesson?.id}`)
                }>
                <img src={share} alt='ShareIcon' />
                <span>{t("lessonPage.shareMenu.share.title")}</span>
              </li>
            </>
          )}
        </ul>
      </div>
      <div>
        {openComplaint && (
          <ComplaintModal id={lessonId ? +lessonId : 0} />
        )}
      </div>
    </div>
  );
};
