import React, { useEffect, useState } from "react";
import s from "./stepThree.module.scss";
import fileIcon from "../../../../app/assets/createLessonModal/FileIcon.svg";
import changeImage from "../../../../app/assets/createLessonModal/ChangeVideo.svg";
import plus from "../../../../app/assets/createLessonModal/GradientPlus.svg";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  setClearImage,
  setImageFile,
  setImageSrc,
  setIsPublic,
  setPublished,
} from "app/service/createLesson/CreateLessonSlice";
import link from "../../../../app/assets/lessons/LinkConditions.svg";
import { postNewLessonThumbnail } from "app/api/createLesson";
import { ConditionsBlock } from "components/CreateLessonModal/ui/ConditionsBlock/ConditionsBlock";
export const StepThree = () => {
  const { imageSrc, imageFile, published, is_public } = useSelector(
    (state) => state.createLesson,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      dispatch(setImageSrc(url));
    }
  }, [imageFile, dispatch]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add(s.dragActive);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove(s.dragActive);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragActive");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      dispatch(setImageFile(file));
      // dispatch(setImageSize(file.size));
    } else {
      console.error("Пожалуйста, загрузите файл изображения.");
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type.startsWith("image/")) {
      dispatch(setImageFile(file));
      // dispatch(setImageSize(file.size));
    }
  };

  const handleReplaceImage = () => {
    dispatch(setClearImage());
  };

  return (
    <main className={s.mainBlock}>
      <div
        className={s.loadImage}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <div className={s.loadContainer}>
          {imageFile ? (
            <div className={s.imageContainer}>
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt='Uploaded'
                  className={s.previewImage}
                />
              )}
              <div className={s.imageName}>
                <img src={fileIcon} alt='fileGradientIcon' />
                <p className={s.fileInfo}>
                  {imageFile.name} <br />
                  <span className={s.fileSize}>
                    {`${(imageFile.size / 1024 / 1024).toFixed(
                      1,
                    )} MB`}
                  </span>
                </p>
                <button
                  className={s.changeImage}
                  onClick={handleReplaceImage}>
                  <div>
                    <img src={changeImage} alt='changeImageIcon' />
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
                accept='image/*'
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              <p className={s.placeholder}>
                <span>Перетащите изображение сюда</span>
                <br />
                <span>Фото для урока</span>
              </p>
            </div>
          )}
        </div>
      </div>
      <div className={s.selections}>
        <div className={s.selectContainer}>
          <section className=''>
            <h1 className={s.title}>Каким будет урок</h1>
          </section>
          <div className={s.customSelect}>
            <button
              onClick={() => dispatch(setIsPublic(true))}
              className={is_public ? s.active : s.default}>
              <span>Открытый</span>
            </button>
            <button
              onClick={() => dispatch(setIsPublic(false))}
              className={!is_public ? s.active : s.default}>
              <span>Закрытый</span>
            </button>
          </div>
        </div>
        <div className={s.selectContainer}>
          <section>
            <h1 className={s.title}>Публикация</h1>
          </section>
          <div className={s.customSelect}>
            <button
              onClick={() => dispatch(setPublished(false))}
              className={!published ? s.active : s.default}>
              <span>В архив</span>
            </button>
            <button
              onClick={() => dispatch(setPublished(true))}
              className={published ? s.active : s.default}>
              <span>Опубликовать</span>
            </button>
          </div>
        </div>
      </div>
      {!is_public && (
        <div className={s.conditionsBlock}>
          <section className={s.titleConditionsBlock}>
            <h1 className={s.title}>Условия открытия урока </h1>
            <span className={s.subtitle}>(максимум 5 )</span>
          </section>
          <ConditionsBlock />
        </div>
      )}
    </main>
  );
};
