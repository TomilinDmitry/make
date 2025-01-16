import React, { useEffect, useState } from "react";
import s from "./style.module.scss";
import img from "../../app/assets/users/filter.svg";
import search from "../../app/assets/users/search.svg";
import close from "../../app/assets/users/closeModal.svg";
import {
  getUsers,
  getUsersSearchByNameAndLocation,
  getUsersWithOutToken,
  getUsersWithOutVideo,
  getUsersWithOutVideoAndToken,
} from "app/api/apiUsers";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { useTranslation } from "react-i18next";
import {
  setUserSearchData,
  setСlearSearchData,
} from "app/service/user/userSlice";
import { useNavigate } from "react-router";

export const VoiceInput = ({ type }: { type: string }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { userSearchData, isAuth } = useSelector(
    (state) => state.user,
  );
  const [text, setText] = useState<string>(""); // Состояние для текста
  const [isListening, setIsListening] = useState<boolean>(false); // Состояние для отслеживания записи\
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [inputValue, setInputValue] = useState("");
  // const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  const { maxViewsUsers, withOutVideoUsers } = useSelector(
    (state) => state.users,
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (text) {
      handleSearch();
    }
  }, [text]);

  const startListening = () => {
    if (!isAuth) {
      navigate("/login");
    }
    if (!SpeechRecognition) {
      alert("Ваш браузер не поддерживает голосовой ввод");
      return;
    }
    setText("");
    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU"; // Установите язык (например, русский)
    recognition.interimResults = false; // Промежуточные результаты
    recognition.maxAlternatives = 1; // Максимальное количество вариантов

    recognition.start(); // Запуск записи
    setIsListening(true);

    recognition.onstart = () => {
      console.log("Голосовой ввод начат. Говорите...");
    };

    recognition.onspeechend = () => {
      console.log("Речь закончена.");
      recognition.stop();
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const recognizedText = event.results[0][0].transcript; // Получение текста
      console.log("Распознанный текст:", recognizedText);
      setText(recognizedText); // Установка текста в состояние
      handleInputChange(recognizedText); // Обновляем ввод
    };

    recognition.onerror = (event: any) => {
      console.error("Ошибка распознавания:", event.error);
      setIsListening(false);
    };
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);

    // Разделение текста в зависимости от типа
    if (type === "name") {
      const nameParts = value.trim().split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts[1] || "");
    } else if (type === "location") {
      const valueReplace = value.replace(/\s+/g, ",");
      setInputValue(valueReplace);
      const locationParts = value.replace(/\s+/g, ",").split(",");
      console.log(locationParts);
      if (locationParts.length === 1) {
        // setCountry(locationParts[0]);
        setCity(locationParts[0]);
      } else {
        // setCountry(locationParts[0]);
        setCity(locationParts[0] || "");
      }
    }
  };
  const handleSearch = () => {
    // Выполнение запроса с переданными параметрами
    // if (userSearchData.le) return
    if (!isAuth) {
      navigate("/login");
    }
    if (inputValue.length > 0) {
      getUsersSearchByNameAndLocation(
        dispatch,
        // country || undefined, // передаем country, если оно не пустое
        city || undefined, // передаем city, если оно не пустое
        firstName || undefined, // передаем firstName, если оно не пустое
        lastName || undefined, // передаем secondName, если оно не пустое
      );
    }
  };

  const handleKeyDown = (e: any) => {
    // Проверяем, если нажата клавиша Enter
    if (!isAuth) {
      navigate("/login");
    }
    if (e.key === "Enter" && inputValue.length > 0 && isAuth) {
      handleSearch(); // Вызываем функцию для выполнения запроса
    }
    // else {
    //   navigate("/login");
    // }
  };
  const handleReturnDefault = async () => {
    dispatch(setСlearSearchData());
    if (inputValue.length > 0) {
      if (isAuth) {
        // setLoadinG(true);
        await getUsers(dispatch);
        await getUsersWithOutVideo(dispatch);
        // setLoading(false);
      } else {
        // setLoading(true);
        await getUsersWithOutToken(dispatch);
        await getUsersWithOutVideoAndToken(dispatch);
        // setLoading(false);
      }
    }

    if (type === "name") {
      setInputValue("");
      setFirstName("");
      setLastName("");
    } else {
      setInputValue("");
      // setCountry("");
      setCity("");
    }
  };

  return (
    <div className={s.searchName}>
      <img
        className={s.vol}
        src={img}
        alt=''
        onClick={startListening}
      />
      <input
        className={s.inputName}
        placeholder={`${
          isListening
            ? "Идет запись,говорите"
            : type === "location"
            ? `${t("userPage.placeholderLocation")}`
            : `${t("userPage.placeholderName")}`
        }`}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        type='text'
        onKeyDown={handleKeyDown}
      />
      <img
        className={s.search_img}
        src={search}
        alt=''
        onClick={handleSearch}
      />
      {inputValue.length > 0 && (
        <img
          className={s.closeIcon}
          src={close}
          alt='closeIcon'
          onClick={handleReturnDefault}
        />
      )}
    </div>
  );
};
