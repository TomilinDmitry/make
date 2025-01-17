import React, { useEffect, useState } from "react";
import s from "./editLesson.module.scss";
import close from "../../../app/assets/home/closeModal.svg";

import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  createLesson,
  getConditions,
  getStatusLoadLesson,
  postConditions,
  postNewLesson,
  postNewLessonThumbnail,
} from "app/api/createLesson";
import {
  setClearImage,
  setClearVideo,
  setCurrentStep,
  setDescriptionLesson,
  setImageFile,
  setNameLesson,
} from "app/service/createLesson/CreateLessonSlice";
import { StepThree } from "../../CreateLessonModal/steps/three/StepThree";
import { toast } from "react-toastify";
import fileIcon from "../../../app/assets/createLessonModal/FileIcon.svg";
import changeImage from "../../../app/assets/createLessonModal/ChangeVideo.svg";
import { LoadImage } from "components/LoadImage/LoadImage";
export const EditLessonModal = ({
  idLesson,
  closeModal,
  lessonName,
  isPublic,
  lessonDesc,
}: {
  closeModal: () => void;
  lessonName: string;
  lessonDesc: string;
  isPublic: boolean;
  published?: boolean;
  idLesson: number;
}) => {
  // const [steps, setSteps] = useState<1 | 2 | 3>(1);
  const {
    nameLesson,
    descriptionLesson,
    is_public,
    imageFile,
    published,
  } = useSelector((state) => state.createLesson);
  const { conditions } = useSelector((state) => state.conditions);
  const [originalConditions, setOriginalConditions] = useState<any[]>([]);
  const [localName, setLocalName] = useState<string>(lessonName);
  const [localDesc, setLocalDesc] = useState<string>(lessonDesc);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedConditions = await getConditions(dispatch, idLesson);
      setOriginalConditions(fetchedConditions);
    };
    fetchData();
  }, [dispatch,idLesson]);

  const handleChangeName = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setLocalName(value); // Обновляем локальное состояние
    dispatch(setNameLesson(value)); // Отправляем изменения в Redux
  };

  const handleChangeDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setLocalDesc(value); // Обновляем локальное состояние
    dispatch(setDescriptionLesson(value)); // Отправляем изменения в Redux
  };
  const updateLesson = async () => {
    // Обновление урока
    const response = await postNewLesson(
      dispatch,
      idLesson,
      localName,
      localDesc,
      is_public,
      published
    );

    // Обновление изображения (если есть)
    if (imageFile) {
      await postNewLessonThumbnail(dispatch, idLesson, imageFile);
    }

    // Удаляем дубликаты из условий
    const uniqueConditions = conditions.filter(
      (condition, index, self) =>
        index ===
        self.findIndex(
          (c) =>
            c.text.trim() === condition.text.trim() &&
            c.link.trim() === condition.link.trim()
        )
    );

    if (uniqueConditions.length !== conditions.length) {
      toast.warn("Обнаружены дублирующиеся условия. Они были удалены.");
    }

    // Сравниваем уникальные условия с оригинальными
    const changedConditions = uniqueConditions.filter((localCondition) => {
      const original = originalConditions.find(
        (orig) =>
          orig.text.trim() === localCondition.text.trim() &&
          orig.link.trim() === localCondition.link.trim()
      );

      // Если не найдено соответствие или изменено, условие считается изменённым
      return !original || original.isOpen !== localCondition.isOpen;
    });

    // Если есть изменения, отправляем их
    if (changedConditions.length > 0) {
      await postConditions(idLesson, changedConditions);
      toast.success("Изменённые условия успешно обновлены.");
    } else {
      toast.info("Нет изменений в условиях.");
    }

    // Сообщение об успехе или ошибке
    if (response === "Lesson updated successfully.") {
      toast.success("Урок успешно обновлен");
      closeModal();
    } else {
      toast.warn("Произошла ошибка при обновлении урока");
    }
  };
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <section className={s.topBlock}>
          <h1>Редактирование урока</h1>
          <img src={close} alt='closeIcon' onClick={closeModal} />
        </section>

        <div className={s.mainBlock}>
          <div className={s.inputNameVideoContainer}>
            <label htmlFor='name' className={s.labelNameVideo}>
              Название урока
            </label>
            <textarea
              id='name'
              value={localName}
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
              value={localDesc}
              id='description'
              maxLength={300}
              onChange={handleChangeDescription}
              className={s.textarea}
            />
          </div>
          <LoadImage published={published} isPublic={isPublic} />
        </div>

        <div className={s.buttonContainer}>
          {/* {currentStep > 1 && (
            <button className={s.back} onClick={handlePreviousStep}>
              Назад
            </button>
          )} */}

          <div className={s.buttonGroup}>
            {/* <button className={s.preview}>Предпросмотр</button> */}
            <button className={s.next} onClick={updateLesson}>
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
