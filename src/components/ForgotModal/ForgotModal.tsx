import React, { useEffect, useState } from "react";
import s from "./forgotModal.module.scss";
import closeIcon from "../../app/assets/confirmEmailModal/closeModalIcon.svg";
import { confirmEmail, resetPassword } from "app/service/servise";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  setIsSendEmail,
  setSeconds,
} from "app/service/auth/authSlice";
export const ForgotModal = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const { isSendEmail, seconds } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // const [seconds, setSeconds] = useState(0);
  const [email, setEmail] = useState("");
  // const [isEmailSent, setIsEmailSent] = useState(false);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEmail(e.target.value); // Сохраняем текст из инпута
  };
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(
        () => dispatch(setSeconds(seconds - 1)),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [seconds]);
  const { t } = useTranslation();
  const resend = async () => {
    if (!email) {
      toast.warn("Пожалуйста, впишите почту!"); // Если почта не введена, выводим сообщение
      return;
    }

    if (isSendEmail) {
      toast.warn("Письмо уже отправлено! Подождите немного."); // Если письмо уже отправлено
      return;
    }

    // Логика отправки письма
    const response = await resetPassword.email(email);
    if (response?.status === 204) {
      toast.success("Письмо успешно отправлено! Проверьте почту.");
    }
    // Обновляем состояние, чтобы показать, что письмо оправлено
    dispatch(setIsSendEmail(true));
    dispatch(setSeconds(30)); // Устанавливаем таймер на 30 секунд

    // Запуск таймера
  };
  useEffect(() => {
    let timer: any;
    if (seconds > 0) {
      timer = setInterval(() => {
        dispatch(setSeconds(seconds - 1)); // Уменьшаем таймер через Redux
      }, 1000);
    } else {
      dispatch(setIsSendEmail(false)); // Сбрасываем состояние отправки письма
      clearInterval(timer);
    }

    return () => clearInterval(timer); // Очищаем таймер при размонтировании
  }, [seconds, dispatch]);
  const close = () => {
    closeModal();
  };
  return (
    <div className={s.wrapper}>
      <div className={s.closeIcon} onClick={close}>
        <img src={closeIcon} alt='closeIcon' />
      </div>
      <div className={s.container}>
        <h1 className={s.title}>
          {" "}
          {t("authorization.forgotPassword.forgotPasswordText")}
        </h1>
        {isSendEmail ? (
          <span className={s.timer}>
            {t("authorization.notifications.sendAgain")}: {seconds}{" "}
            {t("authorization.notifications.sendAgainSecond")}
          </span>
        ) : (
          <input
            type='email'
            className={s.input}
            placeholder='Почта'
            value={email}
            onChange={handleInputChange}
          />
        )}
        <button
          className={seconds === 0 ? s.active : s.wait}
          onClick={resend}>
          {email && seconds === 0
            ? "Отправить подтверждение"
            : seconds > 0
            ? "Письмо уже отправлено!"
            : "Впишите почту"}
        </button>
      </div>
    </div>
  );
};
