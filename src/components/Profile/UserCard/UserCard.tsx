import styles from "./style.module.scss";
// Import image
import location from "../../../app/assets/users/location.svg";
import user from "../../../app/assets/users/motinova.png";
import video from "../../../app/assets/profileCard/videos.svg";
import view from "../../../app/assets/profileCard/view.svg";
import { IFollower } from "app/types/type";
import { useTranslation } from "react-i18next";
type UserCardProps = {
  userData: IFollower;
  counter: {
    total_views: number;
    count_lessons: number;
  };
};
export const UserCard = ({ userData, counter }: UserCardProps) => {
  const userDataUrl = userData.photo
    ? "https://api.lr45981.tw1.ru" + userData.photo
    : null;
  const { t } = useTranslation();
  return (
    <div className={styles.box_user}>
      <img
        className={styles.user_img}
        src={userDataUrl! || user}
        alt='user_photo'
      />
      <div className={styles.line}></div>
      <div className={styles.container}>
        <p className={styles.name}>
          {userData.first_name && userData.last_name
            ? `${userData.first_name} ${userData.last_name}`
            : `${t("default.name")} ${t("default.lastName")}`}
        </p>
        <p className={styles.location}>
          <img
            className={styles.image_location}
            src={location}
            alt='location_img'
          />
          {userData.country && userData.city
            ? `${userData.country}, ${userData.city}`
            : `${t("default.country")} ${t("default.city")}`}
        </p>
        <div className={styles.view_video}>
          <div className={styles.video}>
            <img src={video} alt='video_img' />
            <span className={styles.num}>{counter.total_views}</span>
          </div>
          <div className={styles.view}>
            <img src={view} alt='view_img' />
            <span className={styles.num}>
              {counter.count_lessons}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
