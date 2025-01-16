import React, { useEffect, useState } from "react";
import s from "./createLessonModal.module.scss";
import close from "../../app/assets/home/closeModal.svg";
import { StepsCircles } from "./ui/stepsCircles/stepsCircles";
import { StepOne } from "./steps/one/StepOne";
import { StepTwo } from "./steps/two/stepTwo";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  createLesson,
  getStatusLoadLesson,
  postConditions,
  postNewLesson,
  postNewLessonThumbnail,
} from "app/api/createLesson";
import {
  setClearImage,
  setClearVideo,
  setCurrentStep,
} from "app/service/createLesson/CreateLessonSlice";
import { StepThree } from "./steps/three/StepThree";
import { toast } from "react-toastify";
export const CreateLessonModal = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  // const [steps, setSteps] = useState<1 | 2 | 3>(1);
  const {
    nameLesson,
    descriptionLesson,
    videoDuration,
    imageSrc,
    voiceGender,
    currentStep,
    videoStatus,
    imageFile,
    is_public,
    published,
  } = useSelector((state) => state.createLesson);
  const { conditions } = useSelector((state) => state.conditions);
  const dispatch = useDispatch();
  useEffect(() => {
    const getStatus = async () => {
      const response = await getStatusLoadLesson(dispatch);
      console.log(response);
      if (
        response.status === 404 ||
        response.video_status === "not_uploaded"
      ) {
        dispatch(setCurrentStep(1));
      } else {
        dispatch(setCurrentStep(2));
      }
    };
    getStatus();
  }, [dispatch]);

  const checkValue = () => {
    switch (currentStep) {
      case 1:
        return Boolean(
          nameLesson && videoDuration && descriptionLesson,
        );
      case 2:
        return Boolean(
          videoStatus?.progress === 100 &&
            videoStatus.status === "completed",
        );
      case 3:
        return Boolean(imageSrc);
      default:
        return false;
    }
  };
  const setNextStep = () => {
    const nextStep =
      currentStep < 3
        ? ((currentStep + 1) as 1 | 2 | 3)
        : currentStep;

    dispatch(setCurrentStep(nextStep));
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (nameLesson && videoDuration && descriptionLesson) {
        try {
          const success = await createLesson(
            nameLesson,
            descriptionLesson,
            // lessonPrice,
            voiceGender,
          );
          // console.log(success)
          if (success) {
            setNextStep();
          }
        } catch (error) {
          console.error("Ошибка при создании урока:", error);
        }
      } else {
        console.error("Пожалуйста, заполните все поля для шага 1");
      }
    } else if (currentStep === 2) {
      if (
        videoStatus?.progress === 100 &&
        videoStatus.status === "completed"
      ) {
        // Запрос или другая логика для шага 2 (если нужно)
        setNextStep();
      } else {
        console.error(
          "Пожалуйста, дождитесь завершения загрузки видео",
        );
      }
    }
    // else if (currentStep === 3) {
    //   if (imageSrc) {
    //     // Запрос или другая логика для шага 3 (если нужно)
    //     // setNextStep();
    //   } else {
    //     console.error("Пожалуйста, загрузите обложку");
    //   }
    // }
  };
  console.log(conditions.length);
  const setPublicNewLesson = async () => {
    try {
      // if (nameLesson && descriptionLesson) {
      await postNewLesson(
        dispatch,
        7,
        "Новинка в макияже № 2",
        "Лена Мотинова делает красивый макияж на новый 2025 год, стрелки глаз",
        is_public,
        published,
      );
      // }
      if (imageFile) {
        await postNewLessonThumbnail(dispatch, 7, imageFile);
      }
      if (conditions.length > 0) {
        await postConditions(7, conditions);
      }
      toast.success("Урок успешно загружен!");
      closeModal();
      setClearImage();
      setClearVideo();
    } catch (error: any) {
      toast.error("Ошибка при загрузке урока");
    } finally {
    }
  };
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      // Дополнительная логика перед изменением шага, если нужно
      const prevStep =
        currentStep > 1
          ? ((currentStep - 1) as 1 | 2 | 3)
          : currentStep;

      dispatch(setCurrentStep(prevStep));
    }
  };
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <section className={s.topBlock}>
          {currentStep === 1 && (
            <h1>Заполните информацию об уроке</h1>
          )}
          {currentStep === 2 && <h1>Загрузите видео</h1>}
          {currentStep === 3 && <h1>Загрузите обложку</h1>}
          {/* {steps === 4 && <h1>Предпросмотр урока</h1>} */}
          <img src={close} alt='closeIcon' onClick={closeModal} />
        </section>
        <div className={s.circles}>
          <StepsCircles steps={currentStep} />
        </div>
        <div className={s.mainBlock}>
          {currentStep === 1 && <StepOne />}
          {currentStep === 2 && <StepTwo />}
          {currentStep === 3 && <StepThree />}
          {/* {steps === 4 && <StepFour />} */}
        </div>

        <div
          className={
            // currentStep > 1
            //   ? s.buttonContainerJustify
            s.buttonContainer
          }>
          {/* {currentStep > 1 && (
            <button className={s.back} onClick={handlePreviousStep}>
              Назад
            </button>
          )} */}
          {currentStep === 3 ? (
            <div className={s.buttonGroup}>
              <button className={s.preview}>Предпросмотр</button>
              <button className={s.next} onClick={setPublicNewLesson}>
                Опубликовать
              </button>
            </div>
          ) : (
            <button
              className={checkValue() ? s.next : s.disabled}
              onClick={handleNextStep}>
              Далее
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
