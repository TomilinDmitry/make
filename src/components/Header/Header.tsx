import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Import img

import notification from "../../app/assets/other/notification.svg";
import icon_profile from "../../app/assets/other/profile_icon.svg";
import styles from "./Header.module.scss";
import { Burger } from "components/Burger/Burger";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  setActiveLink,
  setLanguage,
} from "app/service/header/headerSlice";
import {
  setIsModalOpen,
  toggleIsModalOpen,
} from "app/service/navigationModals/NavigationModalsSlice";
import {
  languageIconList,
  languageImages,
  translations,
} from "app/service/translate/translate";
import manual from "../../app/assets/home/navigation/manualTransparent.svg";
import i18n from "app/service/i18n";
import logo from "../../app/assets/home/Logo.svg";
import { ManualModal } from "components/ManualModal/ManualModal";
export const Header = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { minimalUserData } = useSelector((store) => store.user);
  const { isModalOpen } = useSelector(
    (store) => store.navigationModal,
  );

  const { language, isArrowUp } = useSelector(
    (store) => store.header,
  );
  const { manualCategoryListOne, manualCategory, openDoc } =
    useSelector((state) => state.home);
  const dispatch = useDispatch();
  const photoLink =
    minimalUserData?.photo &&
    minimalUserData?.photo.startsWith("https://api.lr45981.tw1.ru/")
      ? minimalUserData?.photo
      : `https://api.lr45981.tw1.ru/${minimalUserData?.photo}`;

  const [isOpenLanguageList, setOpenLanguageList] =
    useState<boolean>(false);
  const toggleLanguageList = () => {
    setOpenLanguageList((prev) => !prev);
  };

  useEffect(() => {
    const savedActiveLink = localStorage.getItem("activeLink");
    if (savedActiveLink) {
      dispatch(setActiveLink(savedActiveLink));
    } else {
      dispatch(setActiveLink(location.pathname));
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    dispatch(setActiveLink(location.pathname));
  }, [location.pathname, dispatch]);

  const handleLinkClick = (link: string) => {
    dispatch(setActiveLink(link));
  };

  const toggleLanguage = (language: string) => {
    dispatch(setLanguage(language));
    i18n.changeLanguage(language.toLowerCase());
  };

  const shouldShowBackground = [
    "/users",
    // "/profile",
    "/lessons",
    "/events",
    "/menu",
    "/login",
    "/editProfile",
    "/lesson",
    "/author",
  ].some((path) => location.pathname.includes(path));

  const filteredLanguageList = languageIconList.filter(
    (el) => el.type !== language,
  );
  const listRef = useRef<HTMLButtonElement | null>(null);
  const burgerRef = useRef<HTMLDivElement | null>(null);
  const manualRef = useRef<HTMLDivElement | null>(null);

  // // Подписываемся на событие клика при монтировании
  // Language
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setOpenLanguageList(false);
      }
    };

    if (isOpenLanguageList) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    // Удаляем обработчик при размонтировании
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpenLanguageList]);

  // Burger
  useEffect(() => {
    if (isOpenLanguageList) {
      setOpenLanguageList(false);
    }
    if (open) {
      setOpen(false);
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        burgerRef.current &&
        !burgerRef.current.contains(event.target as Node) &&
        isModalOpen
      ) {
        console.log("Закрываю модальное окно");
        dispatch(setIsModalOpen(false));
      }
    };

    // Добавляем обработчик, если модальное окно открыто
    if (isModalOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    // Удаляем обработчик при размонтировании или изменении isModalOpen
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      dispatch(setIsModalOpen(false));
    }
    if (isOpenLanguageList) {
      setOpenLanguageList(false);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        manualRef.current &&
        !manualRef.current.contains(event.target as Node) &&
        open
      ) {
        console.log("Закрываю модальное окно");
        setOpen(false);
      }
    };

    // Добавляем обработчик клика по документу
    document.addEventListener("click", handleClickOutside);

    return () => {
      // Удаляем обработчик при размонтировании
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);
  return (
    <div
      className={
        shouldShowBackground
          ? styles.headerWithBackground
          : styles.header
      }>
      <div
        className={
          ["/", "/my-documents", "/support", "/FAQ"].includes(
            location.pathname,
          ) || location.pathname.startsWith("/my-documents")
            ? styles.containerHeaderFixed
            : styles.containerHeader
        }>
        <Link to='/' className={styles.linkTo}>
          {/* <h1 className={styles.title}> */}
          {/* {translations[language].title} */}
          <img src={logo} alt='LogoIcon' />
          {/* </h1> */}
        </Link>
        <div className={styles.links}>
          {translations[language].links.map((link) => {
            // Определим активные пути для главной страницы и других страниц
            const isActive =
              ["/", "/my-documents", "/support", "/FAQ"].includes(
                location.pathname,
              ) && link.to === "/";
            const isCurrentPage = location.pathname === link.to;

            // Устанавливаем правильные классы для иконки и текста
            const imgSrc =
              isActive || isCurrentPage ? link.img_active : link.img;
            const textClass =
              isActive || isCurrentPage
                ? styles.activeText
                : styles.text;
            const linkClass =
              isActive || isCurrentPage
                ? `${styles.link} ${styles.active}`
                : styles.link;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={linkClass}
                onClick={() => handleLinkClick(link.to)}>
                <img
                  src={imgSrc}
                  alt={`${link.label}_icon`}
                  className={styles.img_links}
                />
                <span className={textClass}>{link.label}</span>
              </Link>
            );
          })}
        </div>
        <div className={styles.buttons}>
          <button className={styles.button}>
            <img
              className={styles.image_radius}
              src={notification}
              alt='notificationIcon'
            />
          </button>
          <button
            className={styles.button}
            onClick={(event) => event.stopPropagation()}>
            <img
              className={styles.image_manual}
              src={manual}
              alt='notificationIcon'
            />
            <div
              className={styles.manual}
              ref={manualRef}
              onClick={(event) => {
                event.stopPropagation();
                setOpen(!open);
              }}>
              {open && <ManualModal />}
            </div>
          </button>
          <div>
            <button
              ref={listRef}
              className={styles.button}
              onClick={toggleLanguageList}>
              {language}
              <div
                className={
                  isOpenLanguageList ? styles.languageList : ""
                }>
                {isOpenLanguageList &&
                  filteredLanguageList.map((el, index) => (
                    <div className={styles.listElement} key={index}>
                      <img src={el.img} alt={el.type} />
                      <span
                        className={styles.element}
                        onClick={() => toggleLanguage(el.type)}>
                        {el.label}
                      </span>
                    </div>
                  ))}
              </div>
            </button>
          </div>

          <div
            onClick={(event) => {
              event.stopPropagation();
              dispatch(toggleIsModalOpen());
            }}
            className={styles.button_profile}>
            {minimalUserData?.photo ? (
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
            {/* <img
              className={styles.arrow}
              src={isArrowUp ? arrow_top : arrow_bottom}
              alt='arrow'
            /> */}
            <div className={styles.burger} ref={burgerRef}>
              {isModalOpen && <Burger />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
