import { FC, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./App.module.scss";
import { AuthForm } from "../components/AuthForm/AuthForm";
import { BottomBarPhone } from "../components/BottomBarPhone/BottomBarPhone";
import { Header } from "../components/Header/Header";
import { Loading } from "../components/Loading/Loading";
import AppRouter from "./router";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "./service/hooks/hooks";
import {
  setIsAuthOpen,
  setIsModalOpen,
} from "./service/navigationModals/NavigationModalsSlice";
import {
  setMinimalUserData,
  setUserData,
} from "./service/user/userSlice";
import {
  setActiveProfile,
  setProfiles,
} from "./service/burgerProfiles/burgerSlice";
import { isTokenExpired } from "helpers/localStorage.helper";
import {
  resetMyLessons,
  resetUserLesson,
} from "./service/lessons/lessonsSlice";
import {
  resetOffset,
  setTypeUser,
} from "./service/profileCard/profileCardSlice";
import {
  getHomePageLessonCounter,
  getHomePageUserCounter,
} from "./api/homeApi";
import { jwtDecode } from "jwt-decode";
import { CookieForm } from "components/CookieForm/CookieForm";
import { ComplaintModal } from "components/LessonsUi/ComplaintModal/ComplaintModal";

const App: FC = () => {
  const [loading, setLoading] = useState(true); // Начальное состояние загрузки

  const { isAuth, userData } = useSelector((state) => state.user);
  const { profileData } = useSelector((state) => state.profileCard);
  const { openComplaint } = useSelector((state) => state.lessons);
  const { isAuthOpen } = useSelector(
    (state) => state.navigationModal,
  );

  const location = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };
    fetchData();
  }, []);
  const dispatch = useDispatch();
  const isProfilePage = location.pathname.startsWith("/profile/");

  useEffect(() => {
    if (!isProfilePage && userData?.user_id) {
      // Ушли с любого профиля — сбрасываем свои уроки
      dispatch(resetMyLessons());
      dispatch(resetOffset(userData?.user_id.toString()));
    }
    if (!isProfilePage && profileData?.user_id) {
      dispatch(resetUserLesson());
      dispatch(resetOffset(profileData.user_id.toString()));
    }
  }, [
    location.pathname,
    dispatch,
    isProfilePage,
    profileData?.user_id,
    userData?.user_id,
  ]);

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.currentTarget === event.target) {
      dispatch(setIsModalOpen(false));
      dispatch(setIsAuthOpen(false));
    }
  };

  const [accessToken, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      const profiles = localStorage.getItem("profiles");
      const activeAcc = localStorage.getItem("activeAcc");

      if (profiles && activeAcc) {
        clearInterval(interval); // Очистка интервала
        const parsedProfiles = JSON.parse(profiles);
        const activeProfile = parsedProfiles.find(
          (profile: { user_id: string }) =>
            profile.user_id.toString() === activeAcc.toString(),
        );

        if (activeProfile) {
          setAccessToken(activeProfile.accessToken);
        }
      }
    }, 1000);

    return () => clearInterval(interval); // Очистка при размонтировании
  }, []);
  useEffect(() => {
    if (accessToken) {
      try {
        const decoded: { type: string; m: number; gb: number } =
          jwtDecode(accessToken);
        console.log("Decoded type:", decoded.type);

        if (decoded.type === "author") {
          dispatch(
            setTypeUser({
              type: decoded.type,
              m: decoded.m,
              gb: decoded.gb,
            }),
          );
        }
      } catch (error) {
        // console.error("Ошибка декодирования токена:", error.message);
      }
    }
  }, [accessToken]);

  useEffect(() => {
    if (location.pathname === "/login") {
      dispatch(setIsAuthOpen(true));
    }
  }, [dispatch, location.pathname]);
  const isCooldown = useRef(false);
  const cleanUpExpiredTokens = () => {
    // Получаем список профилей из localStorage (гарантированно массив или [])
    const profiles = JSON.parse(
      localStorage.getItem("profiles") || "[]",
    );

    // Если профили пустые, очищаем localStorage и перенаправляем
    if (profiles.length === 0) {
      console.log(
        "Пользователь впервые зашел на сайт или нет сохраненных профилей.",
      );
      return [];
    }

    // Фильтруем только те, у кого токен еще действителен
    const validProfiles = profiles.filter(
      (profile: any) =>
        profile.refreshToken && !isTokenExpired(profile.refreshToken),
    );

    // Если валидных профилей нет, очищаем localStorage и перенаправляем
    if (validProfiles.length === 0) {
      toast.warn("Токены истекли, пожалуйста, авторизуйтесь.");
      setTimeout(() => {
        localStorage.clear();
        window.location.pathname = "/login"; // Переход на страницу авторизации
      }, 2000);
      return [];
    }

    // Если есть изменения, обновляем localStorage
    if (validProfiles.length !== profiles.length) {
      localStorage.setItem("profiles", JSON.stringify(validProfiles));
    }

    return validProfiles; // Возвращаем актуальный список
  };

  const handleClick = () => {
    if (isCooldown.current) {
      return; // Пропускаем обработку, если еще идет "кулдаун"
    }
    if (window.location.href === "/login") return;

    isCooldown.current = true;

    const validProfiles = cleanUpExpiredTokens();

    // Читаем прошлое состояние из localStorage (или 0, если там ничего нет)
    const previousProfileCount = parseInt(
      localStorage.getItem("previousProfileCount") || "0",
      10,
    );

    console.log("Прошлое состояние профилей:", previousProfileCount);

    // Если было два профиля, а стало один, переключаемся
    if (previousProfileCount === 2 && validProfiles.length === 1) {
      const activeProfile = validProfiles[0];
      dispatch(setProfiles(validProfiles));
      dispatch(setMinimalUserData(activeProfile));
      dispatch(setUserData(activeProfile));
      dispatch(setActiveProfile(activeProfile.user_id));
      toast.warn("Переключились на последний валидный профиль.");
    }

    // Сохраняем текущее состояние профилей в localStorage
    localStorage.setItem(
      "previousProfileCount",
      validProfiles.length.toString(),
    );
    // Сбрасываем флаг через 2 секунды
    setTimeout(() => {
      isCooldown.current = false;
      // console.log("Задержка закончилась, обработка снова доступна.");
    }, 2000);
  };
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const password = prompt("Введите пароль:");

  //   const correctPassword = "Make2024Update"; // Установленный пароль

  //   if (password === correctPassword) {
  //     setIsAuthenticated(true); // Если пароль верный, показываем данные
  //   } else {
  //     alert("Неверный пароль");
  //   }
  // }, []);

  useEffect(() => {
    // Добавляем глобальный слушатель кликов
    document.addEventListener("click", handleClick);

    // Удаляем слушатель при размонтировании
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (loading) return <Loading />;
  // if (!isAuthenticated) {
  //   // Если пользователь не авторизован, показываем только форму
  //   return (
  //     <div onClick={handleOverlayClick} className={styles.App}>
  //       Неверный пароль
  //     </div>
  //   );
  // }

  return (
    <div onClick={handleOverlayClick} className={styles.App}>
      <div className={styles.loading}>{loading && <Loading />}</div>
     
      {location.pathname.includes("/confirmEmail") ? (
        ""
      ) : (
        <div className={styles.header}>
          <Header />
        </div>
      )}
      <AppRouter isAuthenticated={isAuth} />
      <div className={styles.cookieForm}>
        <CookieForm />
      </div>

      {isAuthOpen && (
        <div className={styles.overlay_auth}>
          <AuthForm />
        </div>
      )}
      <div className={styles.bottomNavigation}>
        <BottomBarPhone />
      </div>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </div>
  );
};
export default App;
