import { FC } from "react";
import { Link } from "react-router-dom";
import styles from "./BottomBarPhone.module.scss";
import top_arrow from "./img/top_arrow.svg";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import icon_profile from "../../app/assets/other/profile_icon.svg";
import { Burger } from "components/Burger/Burger";
import { AuthForm } from "components/AuthForm/AuthForm";
import { toggleIsModalOpen } from "app/service/navigationModals/NavigationModalsSlice";
import { translations } from "app/service/translate/translate";

export const BottomBarPhone: FC = () => {
  const { minimalUserData } = useSelector((state) => state.user);
  const photoLink = minimalUserData?.photo
    ? minimalUserData?.photo.startsWith("https://api.lr45981.tw1.ru")
      ? minimalUserData?.photo
      : `https://api.lr45981.tw1.ru${minimalUserData?.photo}`
    : icon_profile;
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.header);
  const { isModalOpen, isAuthOpen } = useSelector(
    (store) => store.navigationModal,
  );

  return (
    <div className={styles.mobileNavigationContainer}>
      <nav className={styles.navigate}>
        <ul className={styles.navigateList}>
          {translations[language].links.slice(0, 2).map((el) => (
            <li
              className={`${styles.listItem} ${
                location.pathname === el.to ? styles.active : ""
              }`}
              key={el.label}>
              <Link to={el.to} className={styles.link}>
                <div className={styles.listElement}>
                  <img
                    className={styles.img_home}
                    src={el.img}
                    alt={el.label}
                  />
                </div>
                <span>{el.label}</span>
              </Link>
            </li>
          ))}

          {translations[language].links.slice(2).map((el) => (
            <li
              className={`${styles.listItem} ${
                location.pathname === el.to ? styles.active : ""
              }`}
              key={el.label}>
              <Link to={el.to} className={styles.link}>
                <div className={styles.listElement}>
                  <img
                    className={styles.img_home}
                    src={el.img}
                    alt={el.label}
                  />
                </div>
                <span>{el.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* <div
          className={styles.profileContainer}
          onClick={() => {
            dispatch(toggleIsModalOpen());
          }}>
          <div
            className={
              isModalOpen ? styles.open : styles.profileLink
            }>
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
            <img
              className={styles.img_link}
              src={top_arrow}
              alt='top_arrow'
            />
          </div> */}
        {/* </div> */}

        {/* {isModalOpen && <Burger />}
        {isAuthOpen && <AuthForm />} */}
      </nav>
    </div>
  );
};
