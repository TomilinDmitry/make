import { useParams } from "react-router";
import styles from "./Confirm.module.scss";
import { confirmEmail } from "app/service/servise";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SuccessModal } from "components/ConfirmUI/SuccessModal";
import { useTranslation } from "react-i18next";

export const Confirm = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const { t } = useTranslation();
  const [text, setText] = useState<string>("");
  useEffect(() => {
    const handleConfirmEmail = async () => {
      const email = localStorage.getItem("email");

      if (email && uid && token) {
        try {
          const response = await confirmEmail.confirm({
            uid,
            token,
          });
          // console.log(response);
          if (response?.status === 204) {
            localStorage.removeItem("email");
            setText(
              `${t(
                "authorization.confirmEmail.notification.success",
              )}`,
            );
            toast.success(
              `${t(
                "authorization.confirmEmail.notification.success",
              )}`,
            );
            setTimeout(() => {
              window.location.pathname = "/";
            }, 5000);
          } else {
            // console.log(response);
            await confirmEmail.resend();
            toast.success(
              // "Повторное письмо подтверждения успешно отправлено.",
              `${t(
                "authorization.confirmEmail.notification.successResend",
              )}`,
            );
          }
        } catch (error) {
          toast.error(
            `${t("authorization.confirmEmail.notification.error2")}`,
          );
          setText(
            `${t("authorization.confirmEmail.notification.error2")}`,
          );
          try {
            await confirmEmail.resend();
            toast.success(
              // "Повторное письмо подтверждения успешно отправлено.",
              `${t(
                "authorization.confirmEmail.notification.successResend",
              )}`,
            );
          } catch (resendError) {
            toast.error(
              // "Ошибка при повторной отправке активации."
              `${t(
                "authorization.confirmEmail.notification.error3",
              )}`,
            );
          }
        }
      } else {
        toast.error(
          // "Email не найден. Пожалуйста, повторите подтверждение.",
          `${t("authorization.confirmEmail.notification.error")}`,
        );
      }
    };

    const timer = setTimeout(() => {
      handleConfirmEmail();
    }, 2000);
    return () => clearTimeout(timer);
  }, [uid, token]);

  return (
    <div className={styles.box_email}>
      <SuccessModal text={text} />
    </div>
  );
};
