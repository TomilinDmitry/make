import { FC, useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import ProfileCard from "../../components/Profile/Card/ProfileCard";
// import profile_top from "../../app/assets/profileCard/profile_top.svg";
import bgMobile from "../../app/assets/profileCard/BgMobileNew.png";
import smallBg from "../../app/assets/home/bg_home_small.jpg";
import { useDispatch, useSelector } from "app/service/hooks/hooks";

import { NavigationProfile } from "components/Profile/Navigation/Navigation";
import { ProfileMobile } from "components/Profile/ProfileMobile";
import { useParams } from "react-router";
import {
  getCounterProfile,
  getDataUser,
  getDataUserProfile,
  getMyProfileCounters,
} from "app/api/api";
import { CreateLessonModal } from "components/CreateLessonModal/CreateLessonModal";
import { setOpenCreateModal } from "app/service/profileCard/profileCardSlice";

export const Profile: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { openCreateModal } = useSelector(
    (state) => state.profileCard,
  );
  const { userData } = useSelector((state) => state.user);
  const { activeProfile } = useSelector(
    (state) => state.burgerProfiles,
  );
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(setOpenCreateModal(false));
  };
  useEffect(() => {
    const fetchData = async () => {
      // Проверяем, если активный профиль существует и отличается от текущего

      if (activeProfile) {
        await getDataUser(dispatch); // Запрос данных пользователя
        await getMyProfileCounters(dispatch); // Запрос счетчиков профиля
        await getCounterProfile(dispatch, activeProfile);
      }
    };
 
    localStorage.setItem("currentLessonId", activeProfile || "");
    fetchData();
    // }
  }, [dispatch, activeProfile]); // Перезапускать эффект при изменении activeProfile

  return (
    <div className={styles.profile_all_container}>
      {openCreateModal && (
        <div className={styles.bg}>
          <CreateLessonModal closeModal={closeModal} />
        </div>
      )}
      <img
        className={styles.profile_top_img}
        src={smallBg}
        alt='profile_bg'
      />
      <img
        className={styles.profile_top_img_mobile}
        src={bgMobile}
        alt='profile_bg'
      />

      <div className={styles.profileContainer}>
        <ProfileCard idLink={id || ""} />

        <NavigationProfile />
      </div>
      {}
      <div className={styles.profileContainerMobile}>
        <ProfileMobile />
      </div>
    </div>
  );
};
