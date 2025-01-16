import React, { useState } from "react";
import s from "./style.module.scss";
import arrow_bottom from "../../../app/assets/profileCard/arrow_bottomProfile.svg";
import arrow_top from "../../../app/assets/profileCard/arrow_topProfile.svg";
import location from "../../../app/assets/profileCard/location.svg";
import videos from "../../../app/assets/profileCard/videos.svg";
import view from "../../../app/assets/profileCard/view.svg";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { UpdateProfilePhoto } from "../LoadPhoto/LoadPhoto";
import { UsersNavigationProfile } from "../UsersNavigation/UsersNavigation";
import telegram from "../../../app/assets/profileCard/Telegram.svg";
import phone from "../../../app/assets/profileCard/Phone.svg";
import WhatsApp from "../../../app/assets/profileCard/WhatsApp.svg";
import { setIsFollow, setIsUnFollow } from "app/api/apiLessons";
import { setSubscribe } from "app/service/profileCard/profileCardSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface ProfileCardProps {
  idLink: string;
}
export const UsersProfileMobile = ({ idLink }: ProfileCardProps) => {
  const { isEditing, profileData, subscribe, counter } = useSelector(
    (state) => state.profileCard,
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const toggleOpen = () => {
    setOpen(!open);
  };
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
  const { t } = useTranslation();
  return (
    <div className={s.wrapper}>
      <div className={s.imageProfile}>
        <UpdateProfilePhoto initialPhotoUrl={profileData?.photo!} />
      </div>
      <section className={s.name}>
        <h1>
          {profileData?.first_name
            ? profileData.first_name.toUpperCase()
            : "Имя"}{" "}
          {profileData?.last_name
            ? profileData.last_name.toUpperCase()
            : "ФАМИЛИЯ"}
        </h1>
       
      </section>
      <div className={s.infoBlock}>
        <div className={s.box_loc_vid_view}>
          <p className={s.location}>
            <img
              className={s.location_img}
              src={location}
              alt='location_icon'
            />
            <span className={s.locationText}>
              {profileData?.city && profileData?.country
                ? `${profileData.city}, ${profileData.country}`
                : "Не задано"}
            </span>
          </p>
          <div className={s.videos_view}>
            <p className={s.vid_see}>
              <img
                className={s.vid_see_view}
                src={view}
                alt='view_icon'
              />
              {counter && counter.length > 0
                ? counter?.map((el) => el.total_views)
                : "0"}
            </p>
            <p className={s.vid_see}>
              <img
                className={s.vid_see_video}
                src={videos}
                alt='videos_icon'
              />
              {counter && counter.length > 0
                ? counter?.map((el) => el.count_lessons)
                : "0"}
            </p>
          </div>
        </div>
        <div className={s.buttonsContainerUser}>
          {subscribe ? (
            <button
              className={s.isSubscribed}
              onClick={handleUnfollow}>
              {t("userProfile.subscribed")}
            </button>
          ) : (
            <button className={s.subscribe} onClick={handleFollow}>
              {t("userProfile.subscribe")}
            </button>
          )}
          <div className={s.underSubscribeButtons}>
            {profileData?.telegram && (
              <button>
                Telegram <img src={telegram} alt='telegramIcon' />
              </button>
            )}
            <button>
              WhatsApp <img src={WhatsApp} alt='WhatsAppIcon' />
            </button>
            {profileData?.phone && (
              <button>
                Позвонить
                <img src={phone} alt='phoneIcon' />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={s.buttonsContainer}>
        <div className={s.info_me}>
          <h3 className={s.title_me}>{t("userProfile.aboutMe")}:</h3>
          <p className={open ? s.open : s.text_me}>
            {" "}
            {profileData?.description
              ? profileData?.description
              : "Заполнить описание"}
          </p>
          <div className={s.buttonDescContainer}>
            <button onClick={toggleOpen} className={s.openDesc}>
              {" "}
              <img
                className={s.arrow}
                src={open ? arrow_top : arrow_bottom}
                alt='arrow'
              />
            </button>
          </div>

          {!isEditing && (
            <nav className={open ? s.openNavigation : s.navigation}>
              <UsersNavigationProfile />
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};
