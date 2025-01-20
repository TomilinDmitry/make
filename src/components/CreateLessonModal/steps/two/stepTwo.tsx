import React, { useEffect, useState } from "react";
import s from "./stepTwo.module.scss";
import loadImage from "../../../../app/assets/home/loadImage.svg";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  setIsLoad,
  setProgress,
  setVideoDuration,
} from "app/service/createLesson/CreateLessonSlice";
import {
  getStatusLoadLesson,
  getUploadLink,
  setMarkUpload,
} from "app/api/createLesson";
import axios from "axios";

export const StepTwo = () => {
  const {
    videoDuration,
    videoStatus,
    lessonLoadLink,
    videoSize,
    videoFile,
    markUploaded,
    isLoad,
  } = useSelector((state) => state.createLesson);
  const dispatch = useDispatch();
  // in_queue processing content_18_plus wrong_source_lang error_retry completed
  useEffect(() => {
    if (videoStatus?.video_status === "uploaded") return;
    if (lessonLoadLink) return;
    if (videoDuration && videoSize) {
      const fetchData = async () =>
        await getUploadLink(
          dispatch,
          +videoDuration.toFixed(1),
          videoSize,
        );
      fetchData();
    }
  }, [dispatch]);
  useEffect(() => {
    const uploadFile = async () => {
      if (lessonLoadLink && videoFile && !isLoad) {
        try {
          // Создаем FormData для отправки файла
          const formData = new FormData();
          formData.append("file", videoFile); // Добавляем файл в FormData

          // Отправляем PUT запрос с FormData
          const response = await axios.put(lessonLoadLink, formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Указываем тип контента для отправки файла
            },
          });

          // Получение статуса загрузки
          if (response.status === 201) {
            console.log("Файл успешно загружен.");
            dispatch(setIsLoad(true));
            // Выполняем следующие запросы
            if (markUploaded === true) return;
            await setMarkUpload(dispatch);
          } else {
            console.error(
              "Не удалось загрузить файл. Статус:",
              response.status,
            );
          }
        } catch (error) {
          console.error(`Ошибка при загрузке файла:`, error);
        }
      }
    };

    uploadFile();
  }, [lessonLoadLink, videoFile, dispatch]);
  console.log(isLoad && markUploaded === true)
  useEffect(() => {
    if (isLoad && markUploaded === true) {
      const fetch = async () => {
        await getStatusLoadLesson(dispatch);
      };

      // Выполняем запрос сразу после монтирования
      fetch();

      // Устанавливаем интервал для выполнения запроса каждые 30 секунд
      const intervalId = setInterval(fetch, 30000); // 30000 миллисекунд = 30 секунд

      // Очищаем интервал при размонтировании компонента
      return () => clearInterval(intervalId);
    }
  }, [isLoad, dispatch]);
  const statusMessages: Record<string, string> = {
    in_queue: "Ваш урок сейчас в очереди на загрузку, ожидайте",
    processing: "Ваш урок в процессе перевода",
    content_18_plus:
      "В вашем видео обнаружен контент 18+, загрузка остановлена.",
    wrong_source_lang: "Неправильный исходный язык",
    error_retry:
      "Произошла ошибка при загрузке видео, попробуйте еще раз",
    completed: "Ваш урок успешно загружен!",
  };

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        {/* {!lessonLoadLink &&
          videoStatus?.video_status !== "uploaded" && (
            <span>Получаем ссылку для загрузки...</span>
          )} */}
        {/* {isLoad ||
          lessonLoadLink === null ||
          (videoStatus?.video_status === "uploaded" && ( */}
        <div className={s.loadingBlock}>
          <span className={s.lessonText}>
            {videoStatus?.status && statusMessages[videoStatus.status]
              ? statusMessages[videoStatus.status]
              : "Ваш урок обрабатывается, не перезагружайте страницу"}
          </span>
          <div className={s.loadingContainer}>
            <div
              className={s.loadingBar}
              style={{
                width: `${videoStatus?.progress || 0}%`, // Ширина зависит от прогресса
              }}></div>
          </div>
          <span id='progress-text' className={s.loadingText}>
            Загружено:{" "}
            {videoStatus?.progress ? videoStatus?.progress : 0}%
          </span>
        </div>
        {/* ))} */}
      </div>
    </div>
  );
};
