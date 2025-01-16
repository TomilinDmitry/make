import React, { useState } from "react";
import s from "./Condition.module.scss";
import link from "../../../app/assets/lessons/LinkConditions.svg";
import closeIcon from "../../../app/assets/lessons/ConditionCloseIcon.svg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { sendPurchasesCreate } from "app/api/apiPlayer";
export const Condition = ({
  condition,
  id,
}: {
  id: number;
  condition: { id: number; text: string; link: string };
}) => {
  console.log(condition);
  const [open, setOpen] = useState<boolean>(false);
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Ссылка успешно скопирована!");
      })
      .catch((err) => {
        toast.error("Не удалось скопировать текст:", err);
      });
  };
  const navigate = useNavigate();
  const createPurchase = (id: number, link: string) => {
    console.log(id);
    sendPurchasesCreate(id);
    setTimeout(() => {
      window.location.href = link;
    }, 2000);
  };
  //   Подключить апи purchases/<int:media_id>/create/', {"post": "create_blank_purchase"}, пустой пост запрос
  return (
    <>
      <div className={s.condition} key={condition.id}>
        <button
          className={s.linkButton}
          onClick={() => setOpen(true)}>
          <img src={link} alt='linkIcon' />
        </button>
        <span className={s.text}>{condition.text}</span>
      </div>
      {open && (
        <div className={s.wrapper}>
            <div className={s.mainBlock}>
          <div className={s.container}>
              <div>
                <section className={s.linkTitleBlock}>
                  <h1>Ссылка условия</h1>
                  <img
                    src={closeIcon}
                    alt='closeIcon'
                    onClick={() => setOpen(false)}
                  />
                </section>
                <div className={s.inputBlock}>
                  <input
                    type='text'
                    value={condition.link}
                    className={s.input}
                  />
                  <button
                    className={s.button}
                    onClick={() => copyToClipboard(condition.link)}>
                    {" "}
                    <span>Скопировать</span>
                  </button>
                </div>
              </div>

              {/* <a href={condition.link}> */}
              <button
                //   type='button'
                className={s.link}
                onClick={() => createPurchase(id, condition.link)}>
                Перейти по ссылке
              </button>
              {/* </a> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
