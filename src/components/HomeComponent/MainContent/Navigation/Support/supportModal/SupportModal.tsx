import React, { useState } from "react";
import s from "./supportModal.module.scss";
import close from "../../../../../../app/assets/home/closeModal.svg";
import { useForm } from "react-hook-form";
import loadImage from "../../../../../../app/assets/home/loadImage.svg";
import { useTranslation } from "react-i18next";
export const SupportModal = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = (data: any) => {
    // console.log(data);
    reset();
  };
  const [, setFileName] = useState("");

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleFileClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
  };
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <section className={s.topBlock}>
          <h1> {t("myRequest.request.create")}</h1>
          <img src={close} alt='closeIcon' onClick={onClose} />
        </section>
        <div className={s.formContainer}>
          <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <input
              type='text'
              className={s.input}
              placeholder={t("myRequest.request.name")}
              {...register("firstName", {
                required: "Имя обязательно",
              })}
            />
            {/* {errors.firstName && <p className={s.error}>hi</p>} */}
            <input
              type='text'
              className={s.input}
              placeholder={t("myRequest.request.lastName")}
              {...register("lastName", {
                required: "Фамилия обязательна",
              })}
            />
            {/* {errors.lastName && <p className={s.error}>132</p>} */}
            <input
              type='tel'
              className={s.input}
              placeholder={t("myRequest.request.number")}
              {...register("phone", {
                required: "Номер телефона обязателен",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Введите корректный номер телефона",
                },
              })}
            />
            {/* {errors.phone && <p className={s.error}>123</p>} */}
            <textarea
              className={s.textarea}
              placeholder={t("myRequest.request.text")}
              {...register("message", {
                required: "Текст обращения обязателен",
              })}
            />
            {/* {errors.message && <p className={s.error}>123</p>} */}
            <input
              type='file'
              id='fileInput'
              className={s.hiddenFileInput}
              onChange={handleFileChange}
            />

            <div
              className={s.customFileInput}
              onClick={handleFileClick}>
              {/* {fileName
                ? fileName
                : "Перетащите файл или кликните для выбора"} */}
              <img src={loadImage} alt='loadImageIcon' />
              <span className={s.text}>
                {t("myRequest.request.file")}
              </span>
              <span className={s.file}>
                {t("myRequest.request.selectFile")}
              </span>
            </div>
            <button type='submit' className={s.submitButton}>
              {t("myRequest.request.next")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
