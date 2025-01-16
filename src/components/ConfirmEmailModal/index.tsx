import React, { useEffect, useState } from "react";
import s from "./style.module.scss";
import closeIcon from "../../app/assets/confirmEmailModal/closeModalIcon.svg";
import { confirmEmail } from "app/service/servise";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
export const ConfirmEmailModal = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const [seconds, setSeconds] = useState(30);
  const { t } = useTranslation();
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  const resend = async () => {
    try {
      await confirmEmail.resend();
      toast.success(
        // "Повторное письмо подтверждения успешно отправлено.",
        `${t(
          "authorization.confirmEmail.notification.successResend",
        )}`,
      );
      setSeconds(30);
    } catch (resendError) {
      toast.error(
        // "Ошибка при повторной отправке активации."
        `${t("authorization.confirmEmail.notification.error3")}`,
      );
    }
  };
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
          {t("authorization.registration.title")}
        </h1>
        <h2 className={s.subtitle}>
          {t("authorization.notifications.mailSend")}
        </h2>
        {seconds > -1 && (
          <span className={s.timer}>
            {t("authorization.notifications.sendAgain")}: {seconds}{" "}
            {t("authorization.notifications.sendAgainSecond")}
          </span>
        )}
        <button
          className={seconds === 0 ? s.active : s.wait}
          onClick={resend}>
          {t("authorization.notifications.sendAgainButton")}
        </button>
      </div>
    </div>
  );
};
