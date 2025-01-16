import React, { useState } from "react";
import s from "./changeNameModal.module.scss";
import blueCloseIcon from "../../../app/assets/profileCard/BlueCloseIcon.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import { IChangeNameFormState } from "app/types/type";
import { useTranslation } from "react-i18next";
import checkedIcon from "../../../app/assets/other/checkedIcon.svg";
import { toast } from "react-toastify";
import { setNewName } from "app/api/apiProfile";
export const ChangeNameModal = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IChangeNameFormState>({
    mode: "onSubmit",
  });
  const onSubmit: SubmitHandler<IChangeNameFormState> = async (
    data,
  ) => {
    try {
      // Отправка данных на сервер
      const response = await setNewName(
        data.new_first_name,
        data.new_last_name,
        data.reason,
      );
      if (response) {
        reset();
        onClose();
        toast.success("Ваша заявка успешно отправлена!");
      }
    } catch (error) {
      toast.error(error.response.data.detail);
    }
  };

  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.close} onClick={onClose}>
          <img src={blueCloseIcon} alt='closeIcon' />
        </div>
        <section>
          <h1 className={s.title}>CМЕНИТЬ ИМЯ И ФАМИЛИЮ</h1>
        </section>
        <span className={s.subtitle}>
          Ваш запрос на смену имени и фамилии будет проверяться
          модерацией.
        </span>
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          <input
            className={s.input}
            placeholder='Введите имя*'
            {...register("new_first_name", { required: true })}
          />
          <span className={s.hiden}>
            {errors.new_first_name &&
              toast.error('Поле "Имя" обязательно к заполнению ')}
          </span>

          <input
            className={s.input}
            placeholder='Введите фамилию*'
            {...register("new_last_name", { required: true })}
          />
          <span className={s.hiden}>
            {errors.new_last_name &&
              toast.error('Поле "Фамилия" обязательно к заполнению ')}
          </span>

          <textarea
            placeholder='Причина изменения*'
            className={s.textarea}
            {...register("reason", { required: true })}
          />
          <span className={s.hiden}>
            {errors.reason &&
              toast.error(
                'Поле "Причина изменения" обязательно к заполнению ',
              )}
          </span>

          <div className={s.checkboxBlock}>
            <button
              type='button'
              className={isChecked ? s.checked : s.buttonCheckbox}
              onClick={() => setIsChecked(!isChecked)}>
              {isChecked && (
                <img
                  onClick={() => setIsChecked(!isChecked)}
                  src={checkedIcon}
                  alt='checkedIcon'
                  className={s.checkedIcon}
                />
              )}
            </button>
            <p className={s.agreement}>
              {/* {t("agreement.text_1")}{" "}
              <span className={s.gradientText}>
                {t("agreement.link_1")}
              </span>{" "}
              {t("agreement.text_2")}{" "}
              <span className={s.gradientText}>
                {t("agreement.link_2")}
              </span> */}
              <span>Я понимаю, что в ближайшее время не смогу подать новую заявку</span>
            </p>
          </div>
          <button
            className={isChecked ? s.button : s.disabled}
            type={`${isChecked ? "submit" : "button"}`}>
            Отправить запрос на проверку
          </button>
        </form>
      </div>
    </div>
  );
};
