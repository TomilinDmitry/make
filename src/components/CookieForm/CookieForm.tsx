import React, { useState, useEffect } from "react";
import s from "./cookieForm.module.scss";

export const CookieForm = () => {
  const [isCookieAccepted, setIsCookieAccepted] = useState(false);

  // Получение значения cookie по имени
  const getCookie = (name: string) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
  };

  // Установка cookie с заданным временем истечения
  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Срок действия в миллисекундах
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
  };

  const handleAccept = () => {
    setCookie("cookieConsent", "true", 365);
    setIsCookieAccepted(true);
  };

  // Проверяем, есть ли уже cookie
  useEffect(() => {
    const cookieConsent = getCookie("cookieConsent");
    if (cookieConsent === "true") {
      setIsCookieAccepted(true);
    }
  }, []);

  if (isCookieAccepted) {
    return null;
  }

  return (
    <div className={!isCookieAccepted ?s.wrapper : s.none}>
      <span>
        Мы используем файлы cookie, чтобы улучшить сайт для вас
      </span>
      <button className={s.apply} onClick={handleAccept}>
        <span>Принимаю</span>
      </button>
    </div>
  );
};
