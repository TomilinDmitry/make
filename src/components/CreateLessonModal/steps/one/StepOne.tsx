import React, { useEffect, useMemo, useState } from "react";
import s from "./stepOne.module.scss";
import man from "../../../../app/assets/createLessonModal/man.svg";
import woman from "../../../../app/assets/createLessonModal/woman.svg";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import checkedIcon from "../../../../app/assets/createLessonModal/checkedIcon.svg";
import fileIcon from "../../../../app/assets/createLessonModal/FileIcon.svg";
import changeVideo from "../../../../app/assets/createLessonModal/ChangeVideo.svg";
import {
  setClearVideo,
  setDescriptionLesson,
  setNameLesson,
  setVideoDuration,
  setVideoFile,
  setVideoSize,
  setVideoSrc,
  setVoiceGender,
} from "app/service/createLesson/CreateLessonSlice";
export const StepOne = () => {
  const {
    nameLesson,
    descriptionLesson,
    voiceGender,
    videoSrc,
    videoFile,
  } = useSelector((state) => state.createLesson);
  const dispatch = useDispatch();

  // const [videoDuration, setVideoDuration] = useState<number | null>(
  //   null,
  // ); // для хранения длительности видео
  const { videoDuration, lessonLoadLink, videoSize } = useSelector(
    (state) => state.createLesson,
  );

  useEffect(() => {
    if (videoFile) {
      console.log(videoFile);
      const url = URL.createObjectURL(videoFile);
      dispatch(setVideoSrc(url)); // Сохраняем ссылку в Redux

      // return () => {
      //   URL.revokeObjectURL(url); // Освобождаем память
      //   dispatch(setVideoSrc('')); // Очищаем ссылку в Redux
      // };
    }
  }, [videoFile, dispatch]);
  // Обработчик для получения длительности видео
  const handleLoadedMetadata = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>,
  ) => {
    dispatch(setVideoDuration(e.currentTarget.duration));
  };
  const handleDragOver = (e: any) => {
    e.preventDefault(); // Останавливаем дефолтное поведение браузера
    e.dataTransfer.dropEffect = "copy"; // Меняем указатель мыши на "копировать"
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.target.classList.add(s.dragActive); // Добавляем класс, чтобы подсветить зону
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.target.classList.remove(s.dragActive); // Убираем подсветку зоны
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.target.classList.remove("dragActive");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      dispatch(setVideoFile(file));
    } else {
      // setError("Пожалуйста, загрузите видеофайл.");
    }
  };
  const handleChangeName = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    dispatch(setNameLesson(e.target.value));
  };
  const handleChangeDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    dispatch(setDescriptionLesson(e.target.value));
  };
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type.startsWith("video/")) {
      dispatch(setVideoFile(file));
      dispatch(setVideoSize(file.size));
    }
  };

  // Обработчик для замены видео
  const handleReplaceVideo = () => {
    // setVideoFile(null);
    dispatch(setClearVideo());
  };
  return (
    <main className={s.mainBlock}>
      <div className={s.inputNameVideoContainer}>
        <label htmlFor='name' className={s.labelNameVideo}>
          Название урока
        </label>
        <textarea
          id='name'
          value={nameLesson ? nameLesson : ""}
          className={s.inputNameVideo}
          onChange={handleChangeName}
          // type='text'
          maxLength={66}
        />
        <span className={s.counter}>
          {nameLesson?.length
            ? `${nameLesson?.length}/66`
            : `${0}/66`}
        </span>
      </div>
      <div className={s.descriptionVideoContainer}>
        <label htmlFor='description' className={s.labelNameVideo}>
          Описание урока
        </label>
        <textarea
          value={descriptionLesson ? descriptionLesson : ""}
          id='description'
          maxLength={300}
          onChange={handleChangeDescription}
          className={s.textarea}
        />
      </div>
      <div className={s.voiceTranslateContanier}>
        <div className={s.leftSide}>
          <section>
            <h1 className={s.title}>
              Параметры голосового перевода урока
            </h1>
          </section>
          <span className={s.text}>
            Выберите голос который будет вас озвучивать:
          </span>
        </div>
        <div className={s.select}>
          <img
            src={woman}
            alt='woman'
            className={
              voiceGender === "female" ? s.active : s.default
            }
            onClick={() => dispatch(setVoiceGender("female"))}
          />

          <span className={s.line}></span>
          <img
            src={man}
            alt='man'
            className={voiceGender === "male" ? s.active : s.default}
            onClick={() => dispatch(setVoiceGender("male"))}
          />
        </div>
      </div>

      <div
        className={s.loadVideo}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <div className={s.loadContainer}>
          {videoFile ? (
            <div className={s.videoContainer}>
              {videoSrc && (
                <video
                  controls
                  src={videoSrc || undefined}
                  onLoadedMetadata={handleLoadedMetadata}
                />
              )}
              <div className={s.videoName}>
                <img src={fileIcon} alt='fileGradientIcon' />
                <p className={s.fileInfo}>
                  {videoFile.name} <br />
                  <span className={s.fileSize}>
                    {`${(videoFile.size / 1024 / 1024).toFixed(
                      1,
                    )} MB`}
                  </span>
                </p>
                <button
                  className={s.changeVideo}
                  onClick={handleReplaceVideo}>
                  <div>
                    <img src={changeVideo} alt='changeVideoIcon' />
                    <span>Заменить</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div
              className={s.placeholderContainer}
              onClick={() =>
                document.getElementById("fileInput")?.click()
              }>
              <input
                id='fileInput'
                type='file'
                accept='video/*'
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              <p className={s.placeholder}>
                <span>Переместите видео сюда</span>
                <br />
                <span>или выберите файл</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
