import React, { useState } from "react";
import s from "./style.module.scss";
import closeIcon from "../../../app/assets/confirmEmailModal/closeModalIcon.svg";
import checkedIcon from "../../../app/assets/other/checkedIcon.svg";
import { useTranslation } from "react-i18next";

export const BlackListModal = ({
  onClose,
  onBlacklist,
}: {
  onClose: () => void;
  onBlacklist?: any;
}) => {
  const [text, setText] = useState<string>("");
  const [isAgree, setIsAgree] = useState<boolean>(false);
  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setText(e.target.value);
  };
  const { t } = useTranslation();
  // console.log(onBlacklist);
  const sendBlackList = () => {
    onBlacklist();
    onClose();
  };
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.closeButtonContainer}>
          <button onClick={() => onClose()} className={s.closeIcon}>
            <img src={closeIcon} alt='closeModalIcon' />
          </button>
        </div>

        <section>
          <h1 className={s.title}>
            {t(
              "lessonPage.shareMenu.notInteresting.tell.title",
            ).toUpperCase()}
          </h1>
        </section>
        <p className={s.text}>
          <span>
            {t(
              "lessonPage.shareMenu.notInteresting.tell.description",
            )}
          </span>
        </p>
        <div className={s.inputBlock}>
          <textarea
            className={s.textarea}
            onChange={handleTextareaChange}
            value={text}
            maxLength={100}
          />
          <span className={s.length}>{text.length}/100</span>
        </div>

        <div className={s.rules}>
          <button
            type='button'
            className={isAgree ? s.checked : s.buttonCheckbox}
            onClick={() => setIsAgree(!isAgree)}></button>
          <p>
            {t("agreement.text_1")}{" "}
            <span className={s.gradientText}>
              {t("agreement.link_1")}
            </span>{" "}
            {t("agreement.text_2")}{" "}
            <span className={s.gradientText}>
              {t("agreement.link_2")}
            </span>
          </p>
          {isAgree && (
            <img
              onClick={() => setIsAgree(!isAgree)}
              src={checkedIcon}
              alt='checkedIcon'
              className={s.checkedIcon}
            />
          )}
        </div>
        <button
          className={
            isAgree && text.length > 0 ? s.sendButton : s.notActive
          }
          onClick={
            isAgree && text.length > 0 ? sendBlackList : () => ""
          }>
          {t("lessonPage.shareMenu.notInteresting.tell.sendButton")}
        </button>
      </div>
    </div>
  );
};
