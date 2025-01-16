import React from "react";
import s from "./adaptiveCardSupport.module.scss";
import { useTranslation } from "react-i18next";
export const AdaptiveCardSupport = () => {
  const { t } = useTranslation();
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.topBlock}>
          <span className={s.createDate}>C 14.11.2024</span>
          <p className={s.id}>
            ID: <span>123456789</span>
          </p>
        </div>
        <div className={s.mainBlock}>
          <section>
            <h1 className={s.title}>{t("myRequest.table.name")}</h1>
          </section>
          <span className={s.description}>
            Не могу вывести деньги с баланса платформы Не могу вывести
            деньги с баланса платф...
          </span>
        </div>
        <div className={s.bottomBlock}>
          <span className={s.updateDate}>Обновлено: 14.11.2024 </span>
          <span className={s.status}>
            {t("myRequest.navigation.button_2")}
          </span>
        </div>
      </div>
    </div>
  );
};
