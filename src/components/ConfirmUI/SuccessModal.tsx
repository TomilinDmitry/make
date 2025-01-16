import React from "react";
import s from "./style.module.scss";
import { useTranslation } from "react-i18next";
export const SuccessModal = ({ text }: { text: string }) => {
  const { t } = useTranslation();
  console.log(text);
  return (
    <div className={s.container}>
      <div className={s.topBlock}>
        <section>
          <h1 className={s.title}>MAKEUPDATE</h1>
        </section>
        <p className={s.text}>
          {text === "" ? (
            `${t("authorization.confirmEmail.loading")}....`
          ) : (
            <span>{text}</span>
          )}
        </p>
      </div>
      <button
        className={s.sendButton}
        onClick={() => (window.location.href = "/")}>
        {t("authorization.confirmEmail.backOnMainPage")}
      </button>
    </div>
  );
};
