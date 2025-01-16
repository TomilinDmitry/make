import styles from "./Users.module.scss";
// Import image
import locationIcon from "../../app/assets/users/location.svg";
import user from "../../app/assets/users/motinova.png";
import video from "../../app/assets/profileCard/videos.svg";
import view from "../../app/assets/profileCard/view.svg";
import mockImage from "../../app/assets/profileCard/photo_undefined.svg";

import { IPropsUsers } from "app/types/type";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "app/service/hooks/hooks";

import { useTranslation } from "react-i18next";
import { translateText } from "helpers/localStorage.helper";
import {
  setTranslatedLocation,
  setTranslatedName,
} from "app/service/translate/translateSlice";

export const User = ({
  userData,
  countLessons,
  totalViews,
}: IPropsUsers) => {
  const userDataUrl = userData.photo
    ? "https://api.lr45981.tw1.ru" + userData.photo
    : null;

  const [photo, setPhoto] = useState<string>(mockImage); // Default photo
  // const [translatedName, setTranslatedName] = useState<string>("")
  // const [translatedLocation, setTranslatedLocation] =
  useState<string>("");
  const { language } = useSelector((state) => state.header);
  const { translatedName, translatedLocation } = useSelector(
    (state) => state.translated,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    const isAbsoluteUrl = userData.photo?.startsWith("http");
    const imageUrl = isAbsoluteUrl ? userData.photo : userDataUrl;

    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => setPhoto(imageUrl); // Если изображение загрузилось
      img.onerror = () => setPhoto(user); // Если ошибка загрузки
    }
  }, [userData.photo, userDataUrl]);
  const { t } = useTranslation();
  const name = userData
    ? `${userData.first_name}  ${userData.last_name}`
    : `${t("default.name")} ${t("default.lastName")}`;

  const location = userData
    ? `${userData.country}, ${userData.city}`
    : "Страна Город";

  // useEffect(() => {
  // 	const translateUserData = async () => {
  // 		if (userData) {
  // 			const textsToTranslate = [name, location]

  // 			const [translatedName, translatedLocation] =
  // 				await translateText(
  // 					textsToTranslate,
  // 					"ru",
  // 					language.toLowerCase(),
  // 				)

  // 			if (userData.user_id !== undefined) {
  // 				// Сохраняем переведённое имя
  // 				dispatch(
  // 					setTranslatedName({
  // 						id: userData.user_id,
  // 						translate: translatedName,
  // 					}),
  // 				)

  // 				// Сохраняем переведённое местоположение
  // 				dispatch(
  // 					setTranslatedLocation({
  // 						id: userData.user_id,
  // 						translate: translatedLocation,
  // 					}),
  // 				)
  // 			}
  // 		}
  // 	}

  // 	translateUserData()
  // }, [language, dispatch, name, location])
  return (
    <div className={styles.box_user}>
      <img className={styles.user_img} src={photo} alt='user_photo' />
      <div className={styles.line}></div>
      <div className={styles.container}>
        <p className={styles.name}>
          {userData.user_id !== undefined &&
          // translatedName[userData.user_id]
          name
            ? // ? translatedName[userData.user_id]
              `${name}`
            : `${t("default.name")} ${t("default.lastName")}`}
        </p>
        <p className={styles.location}>
          <img
            className={styles.image_location}
            src={locationIcon}
            alt='location_img'
          />
          {userData.user_id !== undefined &&
          // translatedLocation[userData.user_id]
          location
            ? // ? translatedLocation[userData.user_id]
              `${location} `
            : `${t("default.country")} ${t("default.city")}`}
        </p>
        <div className={styles.view_video}>
          <div className={styles.view}>
            <img src={view} alt='view_img' />
            <span className={styles.num}>{totalViews}</span>
          </div>
          <div className={styles.video}>
            <img src={video} alt='video_img' />
            <span className={styles.num}> {countLessons}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
