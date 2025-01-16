import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Burger.module.scss";
import noUser from "./img/photo_undefined.svg";
import icon_profile from "../../app/assets/other/profile_icon.svg";
import { toast } from "react-toastify";
import {
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  refreshToken,
} from "helpers/localStorage.helper";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  logout,
  setMinimalUserData,
  setUserData,
} from "app/service/user/userSlice";

import { IMinimalUserData } from "app/types/type";
import {
  setIsAuthOpen,
  setIsModalOpen,
} from "app/service/navigationModals/NavigationModalsSlice";
import {
  setActiveProfile,
  setProfiles,
} from "app/service/burgerProfiles/burgerSlice";
import { useTranslation } from "react-i18next";

export const Burger = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { profiles, activeProfile } = useSelector(
    (state) => state.burgerProfiles,
  );
  const { isModalOpen } = useSelector(
    (store) => store.navigationModal,
  );
  const { typeUser } = useSelector((state) => state.profileCard);
  const { isAuth, minimalUserData } = useSelector(
    (state) => state.user,
  );

  const logOut = () => {
    const activeAcc = localStorage.getItem("activeAcc");

    if (!activeAcc) {
      console.error("Активный аккаунт не найден");
      return;
    }

    // Получаем массив профилей из localStorage
    const profilesString = localStorage.getItem("profiles");
    const profiles = profilesString ? JSON.parse(profilesString) : [];

    // Фильтруем профиль с активным user_id
    const updatedProfiles = profiles.filter(
      (profile: any) => profile.user_id.toString() !== activeAcc,
    );
    if (updatedProfiles.length === 1) {
      const newActiveProfile = updatedProfiles[0];
      localStorage.setItem(
        "activeAcc",
        newActiveProfile.user_id.toString(),
      );
      dispatch(setActiveProfile(newActiveProfile.user_id));
      dispatch(setMinimalUserData(newActiveProfile));
      dispatch(setUserData(newActiveProfile));
    } else {
      localStorage.clear();
      dispatch(logout());
    }
    // Сохраняем обновленный список профилей в localStorage
    localStorage.setItem("profiles", JSON.stringify(updatedProfiles));

    // Обновляем состояние Redux, передавая обновленные данные из localStorage
    dispatch(setProfiles(updatedProfiles)); // Обновите состояние с новым массивом профилей

    // Закрываем модальное окно
    dispatch(setIsModalOpen(false));

    toast.success("Успешно!");
  };

  if (!isModalOpen) return null;

  const handleProfileClick = async (profile: IMinimalUserData) => {
    try {
      // Установить активный профиль
      dispatch(setActiveProfile(profile.user_id));
      localStorage.setItem("activeAcc", profile.user_id.toString());
      const profilesString = localStorage.getItem("profiles");
      const profiles = profilesString
        ? JSON.parse(profilesString)
        : [];
      const selectedProfile = profiles.find(
        (p: IMinimalUserData) => p.user_id === profile.user_id,
      );

      if (selectedProfile) {
        dispatch(setMinimalUserData(selectedProfile));
        dispatch(setUserData(selectedProfile));
        window.location.reload();
      } else {
        throw new Error("Профиль не найден в списке profiles");
      }

      // Проверить токен
      let accessToken = getAccessToken(); // Получаем токен
      if (!accessToken || isTokenExpired(accessToken)) {
        const refresh = getRefreshToken(); // Получаем refreshToken
        if (!refresh || isTokenExpired(refresh)) {
          console.error(
            "Все токены истекли. Перенаправляем на страницу входа.",
          );
          toast.error(
            "Сессия истекла. Пожалуйста, авторизуйтесь снова.",
          );
          setTimeout(() => {
            window.location.href = "/login"; // Перенаправление на страницу авторизации
          }, 2000);
          throw new Error(
            "Все токены истекли. Перенаправление на авторизацию.",
          );
        }

        try {
          // Обновляем токен с помощью refresh
          const newAccessToken = await refreshToken(); // Здесь `refreshToken` возвращает новый токен
          accessToken = newAccessToken;

          // Обновляем токен в профиле
          const updatedProfiles = profiles.map(
            (p: IMinimalUserData) =>
              p.user_id === profile.user_id
                ? { ...p, accessToken: newAccessToken }
                : p,
          );
          // Сохраняем обновленный список профилей
          localStorage.setItem(
            "profiles",
            JSON.stringify(updatedProfiles),
          );
          console.log(
            "Токен успешно обновлен для активного аккаунта",
          );
        } catch (error) {
          console.error("Ошибка обновления токена:", error);
          toast.error(
            "Ошибка при обновлении токена. Пожалуйста, авторизуйтесь снова.",
          );
          setTimeout(() => {
            window.location.href = "/login"; // Перенаправление на страницу авторизации
          }, 2000);
          throw error;
        }
      }
    } catch (error) {
      console.error("Ошибка при переключении профиля:", error);
      toast.error(
        "Не удалось переключить профиль. Попробуйте снова.",
      );
      const profilesString = localStorage.getItem("profiles");
      const profiles = profilesString
        ? JSON.parse(profilesString)
        : [];

      const filteredProfiles = profiles.filter(
        (p: IMinimalUserData) => p.user_id !== profile.user_id, // Удаляем только профиль, на который переключиться не удалось
      );
      localStorage.setItem(
        "profiles",
        JSON.stringify(filteredProfiles),
      );
      localStorage.setItem(
        "activeAcc",
        filteredProfiles[0].user_id.toString(),
      );
      dispatch(setProfiles(filteredProfiles));
      dispatch(
        setActiveProfile(filteredProfiles[0].user_id.toString()),
      );
    }
  };
  const openAuthModal = () => {
    dispatch(setIsAuthOpen(true));
  };

  const photoLink = minimalUserData?.photo
    ? minimalUserData?.photo.startsWith("https://api.lr45981.tw1.ru")
      ? minimalUserData?.photo
      : `https://api.lr45981.tw1.ru${minimalUserData?.photo}`
    : noUser;
  console.log(profiles.length);
  return (
    <div className={styles.menu}>
      <ul className={styles.list}>
        <li className={styles.list_section}>
          {isAuth ? (
            <>
              <Link to='/profile' className={styles.list_section}>
                <div className={styles.profile_section}>
                  <div className={styles.box_img}>
                    {photoLink ? (
                      <img
                        className={styles.img_icon}
                        src={photoLink}
                        alt='icon_profile'
                      />
                    ) : (
                      <img
                        className={styles.img_icon}
                        src={icon_profile}
                        alt='icon_profile'
                      />
                    )}
                  </div>

                  <span className={styles.prof_select}>
                    {minimalUserData?.first_name &&
                    minimalUserData.last_name
                      ? `${minimalUserData.first_name} ${minimalUserData.last_name}`
                      : `${t("default.name")} ${t(
                          "default.lastName",
                        )}`}
                  </span>
                </div>
              </Link>
              <li
                className={
                  profiles.length > 1
                    ? styles.list_section
                    : styles.none
                }>
                {profiles.length > 0 &&
                  // Преобразуем Map в массив перед итерацией
                  profiles
                    .filter(
                      (profile) => profile.user_id !== activeProfile,
                    )
                    .map((profile, index) => (
                      <div
                        key={index}
                        className={styles.profile_section}
                        onClick={(event) => {
                          event.preventDefault();
                          handleProfileClick(profile);
                        }}>
                        <div className={styles.box_img}>
                          {profile?.photo ? (
                            <img
                              className={styles.img_icon}
                              src={
                                profile.photo.startsWith(
                                  "https://api.lr45981.tw1.ru",
                                )
                                  ? profile.photo
                                  : `https://api.lr45981.tw1.ru${profile.photo}`
                              }
                              alt='icon_profile'
                            />
                          ) : (
                            <img
                              className={styles.img_icon}
                              src={icon_profile}
                              alt='icon_profile'
                            />
                          )}
                        </div>

                        <span className={styles.prof_select}>
                          {profile?.first_name && profile.last_name
                            ? `${profile.first_name} ${profile.last_name}`
                            : `${t("default.name")} ${t(
                                "default.lastName",
                              )}`}
                        </span>
                      </div>
                    ))}
              </li>
            </>
          ) : (
            <span>{t("burger.viewer")}</span>
          )}
        </li>
        {!isAuth && (
          <li className={styles.list_section} onClick={openAuthModal}>
            {t("burger.user")}
          </li>
        )}
        <Link to='/author'>
          <li className={styles.list_section}>
           {typeUser && typeUser.type === "author" ? "Изменить тариф"  : `${t("burger.seller")}`} 
          </li>
        </Link>
        {profiles.length < 2 && profiles.length > 0 && (
          <>
            <div className={styles.line}></div>
            <li
              onClick={openAuthModal}
              className={styles.list_section}>
              {t("burger.addProfile")}
            </li>
          </>
        )}

        {isAuth && (
          <>
            <div className={styles.line}></div>
            <li className={styles.list_section} onClick={logOut}>
              {t("burger.logout")}
            </li>
          </>
        )}
      </ul>
    </div>
  );
};
