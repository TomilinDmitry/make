import { useEffect } from "react";
import styles from "./style.module.scss";
import location from "../../../app/assets/profileCard/location.svg";
import videos from "../../../app/assets/profileCard/videos.svg";
import view from "../../../app/assets/profileCard/view.svg";
import {
  getCounterProfile,
  getCounterProfileWithOutToken,
} from "app/api/api";
import {
  getUsersLessons,
  getUsersLessonsWhitOutToken,
} from "app/api/apiLessons";
import { setIsFollow, setIsUnFollow } from "app/api/apiLessons";

import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { toast } from "react-toastify";
import { UpdateProfilePhoto } from "components/Profile/LoadPhoto/LoadPhoto";
import telegram from "../../../app/assets/profileCard/Telegram.svg";
import phone from "../../../app/assets/profileCard/Phone.svg";
import WhatsApp from "../../../app/assets/profileCard/WhatsApp.svg";

import {
  setActiveButton,
  setSubscribe,
} from "app/service/profileCard/profileCardSlice";
import { useTranslation } from "react-i18next";

interface ProfileCardProps {
  idLink: string;
}
export const UserProfile = ({ idLink }: ProfileCardProps) => {
  const { profileData, subscribe, counter } = useSelector(
    (state) => state.profileCard,
  );
  const { isAuth } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (isAuth) {
        await getCounterProfile(dispatch, idLink);
        await getUsersLessons(dispatch, idLink);
      } else {
        await getCounterProfileWithOutToken(dispatch, idLink);
        await getUsersLessonsWhitOutToken(dispatch, idLink);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const savedButton = localStorage.getItem("activeButton");
    if (savedButton) {
      dispatch(setActiveButton(savedButton));
    }
  }, [dispatch, idLink]);

  useEffect(() => {
    if (profileData) {
      dispatch(setSubscribe(profileData.is_subscribed!));
    }
  }, [dispatch, profileData]);

  const handleFollow = async () => {
    try {
      await setIsFollow(idLink);
      dispatch(setSubscribe(true));
    } catch (error) {
      toast.error("Ошибка при подписке.");
    }
  };

  const handleUnfollow = async () => {
    try {
      await setIsUnFollow(idLink);
      dispatch(setSubscribe(false));
    } catch (error) {
      toast.error("Ошибка при отписке.");
    }
  };
  const notAuthFollow = () =>
    toast.error(
      "Войдите в аккаунт для того чтобы подписаться на пользователя",
    );
  return (
    <div className={styles.profile_box}>
      <div className={styles.profile_img_box}>
        <UpdateProfilePhoto
          initialPhotoUrl={
            profileData?.photo ? profileData.photo : ""
          }
        />
      </div>
      <div className={styles.username_box}>
        {profileData && (
          <div className={styles.username}>
            <div className={styles.usernameLang}>
              <span>
                {profileData?.first_name
                  ? profileData?.first_name.toUpperCase()
                  : "ИМЯ"}{" "}
              </span>{" "}
              <span>
                {profileData?.last_name
                  ? profileData?.last_name.toUpperCase()
                  : "ФАМИЛИЯ"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.containerInfo}>
        <div className={styles.box_loc_vid_view}>
          <p className={styles.location}>
            <img
              className={styles.location_img}
              src={location}
              alt='location_icon'
            />
            <span className={styles.locationText}>
              {profileData?.city && profileData?.country
                ? `${profileData.city}, ${profileData.country}`
                : "Не задано"}
            </span>
          </p>
          <div className={styles.videos_view}>
            <p className={styles.vid_see}>
              <img
                className={styles.vid_see_img}
                src={view}
                alt='view_icon'
              />
              {counter && counter.length > 0
                ? counter?.map((el) => el.total_views)
                : "0"}
            </p>
            <p className={styles.vid_see}>
              <img
                className={styles.vid_see_img}
                src={videos}
                alt='videos_icon'
              />
              {counter && counter.length > 0
                ? counter?.map((el) => el.count_lessons)
                : "0"}
            </p>
          </div>
        </div>
        <div className={styles.buttonsContainerUserProfile}>
          {profileData?.telegram && (
            <button className={styles.usersSocialButton}>
              <a
                href={`https://t.me/${profileData.telegram}`}
                target='_blank'
                rel='noopener noreferrer'
                // className={styles.usersSocialButton}
              >
                Telegram
                <img src={telegram} alt='telegram' />
              </a>
            </button>
          )}
          {profileData?.whatsapp && profileData?.show_whats_app && (
            <button className={styles.usersSocialButton}>
              <a
                href={`https://wa.me/${profileData.whatsapp}`}
                target='_blank'
                rel='noopener noreferrer'
                // className={styles.usersSocialButton}
              >
                WhatsApp
                <img src={WhatsApp} alt='whatsappIcon' />
              </a>
            </button>
          )}
          {profileData?.phone && (
            <button className={styles.usersSocialButton}>
              <a
                href={`tel:${profileData.phone}`}
                // className={styles.usersSocialButton}
              >
                {t("profile.call")}
                <img src={phone} alt='phoneIcon' />
              </a>
            </button>
          )}
          {subscribe ? (
            <button
              className={styles.isSubscribed}
              onClick={handleUnfollow}>
              {t("userProfile.subscribed")}
            </button>
          ) : (
            <button
              className={
                !isAuth ? styles.notAuthSubscribe : styles.subscribe
              }
              onClick={!isAuth ? notAuthFollow : handleFollow}>
              {t("userProfile.subscribe")}
            </button>
          )}
        </div>
        <div className={styles.info_me}>
          <h3 className={styles.title_me}>
            {t("userProfile.aboutMe")}:
          </h3>

          <p className={styles.text_me}>
            {" "}
            {profileData?.description
              ? profileData?.description
              : "Заполнить описание"}
          </p>
        </div>
      </div>
    </div>
  );
};
