import { FC, useEffect } from "react";
import styles from "./Profile.module.scss";
import bgMobile from "../../app/assets/profileCard/BgMobileNew.png";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { getDataUserProfile } from "app/api/api";
import { useParams } from "react-router";
import { UserProfile } from "components/Profile/UserProfile/UserProfile";
import { UsersNavigationProfile } from "components/Profile/UsersNavigation/UsersNavigation";
import { UsersProfileMobile } from "components/Profile/UsersProfileMobile";
import { getDataUserProfileWithOutToken } from "app/api/apiLessons";

export const ProfileUsers: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuth } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {

      if (isAuth) {
        await getDataUserProfile(dispatch, id!);
      } else {
        await getDataUserProfileWithOutToken(dispatch, id!);
      }
    };
    fetchData();
  }, [dispatch, id, isAuth]);

  return (
    <div className={styles.profile_all_container}>
      <img
        className={styles.profile_top_img}
        src={bgMobile}
        alt='profile_bg'
      />
      <img
        className={styles.profile_top_img_mobile}
        src={bgMobile}
        alt='profile_bg'
      />

      <div className={styles.profileContainer}>
        <UserProfile idLink={id || ""} />

        <UsersNavigationProfile />
      </div>
      <div className={styles.profileContainerMobile}>
        <UsersProfileMobile idLink={id || ""} />
      </div>
    </div>
  );
};
