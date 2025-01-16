import React, { useState } from "react";
import s from "./resetModal.module.scss";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { resetPassword } from "app/service/servise";
export const ResetModal = () => {
  const { t } = useTranslation();
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [password, setPassword] = useState<string>();
  const [passwordRepeat, setPasswordRepeat] = useState<string>();
  const changePassword = async () => {
    if (!password) {
      toast.warn("Пожалуйста, введите пароль"); // Если почта не введена, выводим сообщение
      return;
    }
    if (password === passwordRepeat) {
      let response;
      if (token && uid && password) {
        response = await resetPassword.change(token, uid, password);
      }
      if (response?.status === 204) {
        toast.success("Письмо успешно отправлено! Проверьте почту.");
        setTimeout(() => {
          window.location.pathname = "/";
        }, 2000);
      }
    } else {
      toast.warn("Пароли не совпадают");
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPassword(e.target.value); // Сохраняем текст из инпута
  };
  const handleInputChangeRepeat = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordRepeat(e.target.value); // Сохраняем текст из инпута
  };
  return (
    <div className={s.container}>
      <div className={s.topBlock}>
        <section>
          <h1 className={s.title}>MAKEUPDATE</h1>
        </section>
        <div className={s.inputBlock}>
          <input
            type='text'
            className={s.input}
            placeholder='Введите новый пароль'
            value={password}
            onChange={handleInputChange}
          />
          <input
            type='text'
            className={s.input}
            placeholder='Введите повторно'
            value={passwordRepeat}
            onChange={handleInputChangeRepeat}
          />
        </div>
      </div>
      <button className={s.sendButton} onClick={changePassword}>
        Изменить пароль
      </button>
    </div>
  );
};
