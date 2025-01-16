import React from "react";
import s from "./chatModal.module.scss";
import close from "../../../../../../app/assets/home/closeModal.svg";
import { useTranslation } from "react-i18next";

export const ChatModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        {" "}
        <section className={s.topBlock}>
          <h1>{t("myRequest.chat.title")}</h1>
          <img src={close} alt='closeIcon' onClick={onClose} />
        </section>
        <div className={s.chatContainer}>
          <div className={s.inputContainer}>
            <input
              type='text'
              placeholder={t("myRequest.chat.placeholder")}
            />
            <button>{t("myRequest.chat.send")}</button>
          </div>
          <div>
            <div className={s.chat}>
              <div className={s.supportPeoples}>
                <div className={s.avatarContainer}>
                  <span className={s.avatar}></span>
                </div>
                <div className={s.textContainer}>
                  <span className={s.name}>Специалист поддержки</span>
                  <p className={s.text}>
                    Добрый день, был сбой програмы,вы уже можете
                    выложить урок на платформу Если остались вопросы,
                    мы вам поможем
                  </p>
                </div>
                <span className={s.time}>10:11</span>
              </div>
            </div>
            <div className={s.chatRight}>
              <div className={s.supportPeoples}>
                <div className={s.textContainer}>
                  <span className={s.name}>Лена Мотинова</span>
                  <p className={s.text}>
                    Добрый день, был сбой програмы,вы уже можете
                    выложить урок на платформу Если остались вопросы,
                    мы вам поможем
                  </p>
                </div>
                <span className={s.time}>10:11</span>
                <div className={s.avatarContainer}>
                  <span className={s.avatar}></span>
                </div>
              </div>
            </div>
            <div className={s.chat}>
              <div className={s.supportPeoples}>
                <div className={s.avatarContainer}>
                  <span className={s.avatar}></span>
                </div>
                <div className={s.textContainer}>
                  <span className={s.name}>Специалист поддержки</span>
                  <p className={s.text}>
                    Добрый день, был сбой програмы
                  </p>
                </div>
                <span className={s.time}>10:11</span>
              </div>
            </div>
            <div className={s.chatRight}>
              <div className={s.supportPeoples}>
                <div className={s.textContainer}>
                  <span className={s.name}>Лена Мотинова</span>
                  <p className={s.text}>Добрый день, был сбой</p>
                </div>
                <span className={s.time}>10:11</span>
                <div className={s.avatarContainer}>
                  <span className={s.avatar}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
