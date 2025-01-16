import { FC, useState } from "react";
import { Bounce, toast } from "react-toastify";

import { AuthService } from "../../app/service/servise";
import {
  login,
  setMinimalUserData,
  setUserData,
} from "../../app/service/user/userSlice";
import styles from "./AuthFrm.module.scss";

// Import img
import cross from "./cross.svg";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  IGetUserData,
  IMinimalUserData,
  IUser,
} from "app/types/type";
import checkedIcon from "../../app/assets/other/checkedIcon.svg";
import { useLocation, useNavigate } from "react-router";

import { ConfirmEmailModal } from "components/ConfirmEmailModal";
import {
  setConfirmPassword,
  setEmail,
  setIsChecked,
  setIsConfirmEmail,
  setIsLogin,
  setPassword,
  setTelegram,
  setWhatsapp,
} from "app/service/auth/authSlice";

import { setIsAuthOpen } from "app/service/navigationModals/NavigationModalsSlice";
import {
  addProfile,
  setActiveProfile,
} from "app/service/burgerProfiles/burgerSlice";
import axios, { AxiosResponse } from "axios";
import { getDataUser } from "app/api/api";
import { useTranslation } from "react-i18next";
import { getLessonHomePage } from "app/api/homeApi";
import { ForgotModal } from "components/ForgotModal/ForgotModal";
import { Loading } from "components/Loading/Loading";
import {
  setActiveTabHome,
  setOpenCategoryIndex,
} from "app/service/home/HomeSlice";
export const AuthForm = () => {
  const {
    email,
    telegram,
    password,
    confirmPassword,
    isLogin,
    isConfirmEmail,
    isChecked,
    whatsapp,
  } = useSelector((state) => state.auth);
  const { profiles } = useSelector((state) => state.burgerProfiles);
  const { isAuthOpen } = useSelector(
    (state) => state.navigationModal,
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useSelector((state) => state.header);
  localStorage.setItem("language", language);
  const langLocalStorage = localStorage.getItem("language");
  const lang = langLocalStorage
    ? langLocalStorage?.toLowerCase()
    : "";
  const [isOpenForgotModal, setIsOpenForgotModal] =
    useState<boolean>(false);
  const openForgotModal = () => {
    setIsOpenForgotModal(true);
  };

  const getMinimalDataUser = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      let data:
        | IMinimalUserData
        | AxiosResponse<IMinimalUserData, any>;
      data = await axios.get<IMinimalUserData>(
        "https://api.lr45981.tw1.ru/api/v1/profile/my-profile/?minimal=true",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const response: IMinimalUserData =
        "data" in data ? data.data : data;

      dispatch(setMinimalUserData(response));
      dispatch(setUserData(response as unknown as IGetUserData));
      dispatch(addProfile(response));
      dispatch(setActiveProfile(response.user_id));

      return data;
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };
  const [isCheck, setIsCheck] = useState<boolean>(false);
  if (!isAuthOpen) return null;
  const closeModal = () => {
    navigate("/");
    dispatch(setIsAuthOpen(false));
    if (isConfirmEmail) {
      dispatch(setIsConfirmEmail(false));
    }
  };
  const toggleForm = () => {
    dispatch(setIsLogin(!isLogin));
  };

  const registrationHandler = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(
        `${t("authorization.notifications.passworDontMatch")}`,
      );
      return;
    }
    try {
      const data = await AuthService.registration({
        email,
        password,
        telegram,
        whatsapp,
        lang,
      });
      if (data) {
        localStorage.setItem("email", data.email);
        toast.success(
          `${t("authorization.notifications.accountCreate")}`,
        );
        dispatch(setIsConfirmEmail(true));
      } else {
        console.error("Ошибка при создании аккаунта");
      }
    } catch (error: any) {
      const err = error.response.data.email;
      toast.error(
        err?.toString() || "Ошибка при создании пользователя",
        {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        },
      );
    }
  };

  const loginHandler = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      const data = await AuthService.login({
        email,
        password,
      });
      if (data) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        const from = location.state?.from?.pathname || "/";
        navigate(from);
        const user: IUser = { email, password };
        dispatch(login(user));
        toast.success(
          `${t("authorization.notifications.loginSuccess")}`,
        );
        await getMinimalDataUser();

        dispatch(setIsAuthOpen(false));

        setTimeout(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }, 1000);
      }
    } catch (error: any) {
      const err = error.response?.data.message;
      console.log(err);
      toast.error(
        err
          ? err.toString()
          : `${t("authorization.notifications.loginError")}`,
        {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        },
      );
    }
  };
  const errorHandler = (e: any) => [
    e.preventDefault(),
    toast.error(
      `${t("authorization.notifications.registrationError")}`,
      {
        position: "top-left",
      },
    ),
  ];
  const handleAddProfile = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    if (profiles.length === 0) {
      // Вызываем loginHandler, если профилей нет
      await loginHandler(e);
    } else {
      e.preventDefault();
      // Если профили уже есть, выполняем refreshToken() и получаем данные профиля
      try {
        const data = await AuthService.login({
          email,
          password,
        });
        if (data) {
          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
          const user: IUser = { email, password };
          dispatch(login(user));
          toast.success(
            `${t("authorization.notifications.loginSuccess")}`,
          );
          await getMinimalDataUser();

          dispatch(setIsAuthOpen(false));
          setTimeout(() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }, 1000);
        } else {
          <Loading />;
        }
      } catch (error) {
        console.error("Ошибка обновления токена:", error);
        toast.error("Проверьте правильность введенных данных");
      }
    }
  };

  const agreementLink = () => {
    dispatch(setIsAuthOpen(false));
    // dispatch(setActiveTabHome("manual"));
    dispatch(setOpenCategoryIndex(5));
    navigate(
      "/my-documents/polzovatelskoe-soglashenie-platformyi-makeupdate",
    );
  };
  const agreementLinkPersonData = () => {
    dispatch(setIsAuthOpen(false));
    // dispatch(setActiveTabHome("manual"));
    dispatch(setOpenCategoryIndex(4));
    navigate(
      "/my-documents/politika-obrabotki-personalnyih-dannyih-platformyi-makeupdate",
    );
  };

  return (
    <div className={styles.authWrapper}>
      <div
        className={
          isConfirmEmail || isOpenForgotModal
            ? styles.hidden
            : styles.box_auth
        }>
        <button onClick={closeModal} className={styles.closeModal}>
          <img src={cross} alt='close' />
        </button>
        <form
          onSubmit={
            !isLogin && !isChecked
              ? errorHandler
              : isLogin
              ? handleAddProfile
              : registrationHandler
          }
          className={styles.form}>
          <h1 className={styles.title}>
            {isLogin
              ? `${t("authorization.login.title")}`
              : `${t("authorization.registration.title")}`}
          </h1>
          <div className={styles.inputs}>
            <input
              onChange={(e) => dispatch(setEmail(e.target.value))}
              className={styles.input_auth}
              placeholder={t("default.mail")}
              type='text'
              value={email}
            />
            {!isLogin && (
              <input
                onChange={(e) =>
                  dispatch(setTelegram(e.target.value))
                }
                className={styles.input_auth}
                placeholder={t("default.Telegram")}
                type='text'
                value={telegram}
              />
            )}
            {!isLogin && (
              <input
                onChange={(e) =>
                  dispatch(setWhatsapp(e.target.value))
                }
                className={styles.input_auth}
                placeholder='Whatsapp'
                type='text'
                value={whatsapp}
              />
            )}
            <input
              className={styles.input_auth}
              type='password'
              onChange={(e) => dispatch(setPassword(e.target.value))}
              placeholder={t("default.password")}
              value={password}
            />
            {!isLogin && (
              <input
                className={styles.input_auth}
                placeholder={t("default.repeatPassword")}
                type='password'
                onChange={(e) =>
                  dispatch(setConfirmPassword(e.target.value))
                }
                value={confirmPassword}
              />
            )}
          </div>
          {isLogin && (
            <button
              className={styles.reset_pass}
              type='button'
              onClick={openForgotModal}>
              {t("authorization.login.forgot")}
            </button>
          )}
          {!isLogin && (
            <>
              <div className={styles.rules}>
                <button
                  type='button'
                  className={
                    isChecked ? styles.checked : styles.buttonCheckbox
                  }
                  onClick={() => dispatch(setIsChecked(!isChecked))}>
                  {isChecked && (
                    <img
                      onClick={() =>
                        dispatch(setIsChecked(!isChecked))
                      }
                      src={checkedIcon}
                      alt='checkedIcon'
                      className={styles.checkedIcon}
                    />
                  )}
                </button>
                <p>
                  {t("agreement.text_1")}{" "}
                  <span
                    className={styles.gradientText}
                    onClick={agreementLinkPersonData}>
                    {t("agreement.link_1")}
                  </span>{" "}
                  {/* {t("agreement.text_2")}{" "}
                  <span className={styles.gradientText}>
                    {t("agreement.link_2")}
                  </span> */}
                </p>
              </div>
              <div className={styles.rules}>
                <button
                  type='button'
                  className={
                    isCheck ? styles.checked : styles.buttonCheckbox
                  }
                  onClick={() => setIsCheck(!isCheck)}>
                  {isCheck && (
                    <img
                      onClick={() => setIsCheck(!isCheck)}
                      src={checkedIcon}
                      alt='checkedIcon'
                      className={styles.checkedIcon}
                    />
                  )}
                </button>
                <p>
                  <span>
                    Я принимаю{" "}
                    <span
                      className={styles.gradientText}
                      onClick={agreementLink}>
                      пользовательское соглашение платформы MAKEUPDATE
                    </span>
                  </span>
                </p>
              </div>
            </>
          )}

          <button
            className={
              isChecked && isCheck && !isLogin
                ? styles.send_form
                : isLogin
                ? styles.send_form
                : styles.nonActive
            }>
            {isLogin
              ? `${t("authorization.login.button")}`
              : `${t("authorization.registration.button")}`}
          </button>
          <p className={styles.question}>
            {isLogin
              ? `${t("authorization.login.withOutAccount")}`
              : `${t("authorization.registration.withAccount")}`}
            <button
              type='button'
              onClick={toggleForm}
              className={styles.login_or_reg}>
              {isLogin
                ? `${t("authorization.login.registration")}`
                : `${t("authorization.registration.login")}`}
            </button>
          </p>
        </form>
      </div>
      {isConfirmEmail && (
        <ConfirmEmailModal closeModal={closeModal} />
      )}
      {isOpenForgotModal && <ForgotModal closeModal={closeModal} />}
    </div>
  );
};
