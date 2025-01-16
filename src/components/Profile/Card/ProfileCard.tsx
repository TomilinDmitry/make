import { useEffect, useState } from "react";
import { Inputs } from "../../Inputs/Inputs";
import styles from "./style.module.scss";
import location from "../../../app/assets/profileCard/location.svg";
import videos from "../../../app/assets/profileCard/videos.svg";
import view from "../../../app/assets/profileCard/view.svg";
import { getDataUser } from "app/api/api";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { toast } from "react-toastify";
import { axiosWithRefreshToken } from "helpers/localStorage.helper";
import { UpdateProfilePhoto } from "components/Profile/LoadPhoto/LoadPhoto";
import { IGetUserData } from "app/types/type";
import {
  setDescription,
  setIsEditing,
  setIsSaving,
  setActiveButton,
  setPublishedOpen,
  setOpenCreateModal,
  setTypeUser,
} from "app/service/profileCard/profileCardSlice";
import { useTranslation } from "react-i18next";
import { setUserData } from "app/service/user/userSlice";
import { ChangeNameModal } from "../ChangeNameModal/ChangeNameModal";
import { useLocation, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode"; // Именованный импорт
interface ProfileCardProps {
  idLink: string;
}

const ProfileCard = ({ idLink }: ProfileCardProps) => {
  const { isEditing, description, counter, openPublished, typeUser } =
    useSelector((state) => state.profileCard);

  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [inputData, setInputData] = useState({
    first_name: "",
    last_name: "",
    city: "",
    country: "",
    telegram: "",
    phone: "",
    show_telegram: true,
    show_telephone: true,
    whats_app: "",
  });

  const token = localStorage.getItem("accessToken");
  const { t } = useTranslation();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const profiles = localStorage.getItem("profiles");
  //     const activeAcc = localStorage.getItem("activeAcc");
  
  //     if (profiles && activeAcc) {
  //       clearInterval(interval);
  //       const parsedProfiles = JSON.parse(profiles);
  //       const activeProfile = parsedProfiles.find(
  //         (profile: { user_id: string }) =>
  //           profile.user_id.toString() === activeAcc.toString(),
  //       );
  
  //       if (activeProfile) {
  //         setAccessToken(activeProfile.accessToken);
  //       }
  //     }
  //   }, 1000);
  
  //   return () => clearInterval(interval);
  // }, []);
  // useEffect(() => {
  //   if (accessToken) {
  //     try {
  //       const decoded: { type: string } = jwtDecode(accessToken);
  //       console.log("Decoded type:", decoded.type);
  //       // console.log(message);
  //       if (decoded.type === "author") {
  //         dispatch(setTypeUser(decoded.type)); // Обновляем Redux состояние
  //       }
  //     } catch (error) {
  //       console.error("Ошибка декодирования токена:", error);
  //     }
  //   }
  // }, [accessToken, dispatch]);
  useEffect(() => {
    if (userData) {
      setInputData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        city: userData.city || "",
        country: userData.country || "",
        telegram: userData.telegram || "",
        phone: userData.phone || "",
        show_telegram: userData.show_telegram ?? true,
        show_telephone: userData.show_telephone ?? true,
        whats_app: userData.whats_app || "",
      });
      let descriptionInitial: string | undefined =
        userData?.description;
      dispatch(setDescription(descriptionInitial));
    }
  }, [dispatch, userData]);

  useEffect(() => {
    const savedButton = localStorage.getItem("activeButton");
    if (savedButton) {
      dispatch(setActiveButton(savedButton));
    }
  }, [dispatch]);

  const updateUserData = async (inputData: any) => {
    try {
      const response = await axiosWithRefreshToken<IGetUserData>(
        "https://api.lr45981.tw1.ru/api/v1/profile/my-profile/update/",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: inputData,
        },
      );

      toast.success("Профиль успешно обновлен");
      // fetchData();
      dispatch(setUserData(response));
      return true;
    } catch (error: any) {
      if (error.response.data?.[0] === "first_name already exists") {
        toast.error("Имя / Фамилию нельзя изменить!");
      } else if (
        error.response.data?.[0] === "last_name already exists"
      ) {
        toast.error("Фамилию нельзя изменить!");
      } else if (
        error.response.data.phone?.[0] ===
        "Phone number must be format: '+999999999'. Allow from 7 to 15 digits."
      ) {
        toast.error(
          "Телефон должен иметь формат: +999999999.От 7 до 15 символов.",
        );
      } else if (
        error.response.data.telegram?.[0] ===
        "Это поле не может быть пустым."
      ) {
        toast.error("Поле телеграм не должно быть пустым");
      } else {
        toast.error("Произошла ошибка при обновлении профиля.");
      }
      return false;
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    dispatch(setDescription(e.target.value));
  };

  const handleInputChange = (
    field: string,
    value: string | boolean,
  ) => {
    setInputData((prev) => ({ ...prev, [field]: value }));
  };
  const toggleEdit = async () => {
    if (isEditing) {
      dispatch(setIsSaving(true));
      const updatedData: Partial<IGetUserData> = {};
      Object.keys(inputData).forEach((key) => {
        const newValue = inputData[key as keyof typeof inputData];
        const oldValue = userData?.[key as keyof IGetUserData];

        if (newValue !== oldValue) {
          if (newValue !== undefined && newValue !== "") {
            updatedData[key as keyof IGetUserData] =
              newValue as never;
          }
        }
      });

      if (description !== userData?.description) {
        updatedData.description = description as string;
      }

      if (Object.keys(updatedData).length > 0) {
        const isUpdated = await updateUserData(updatedData);

        if (isUpdated) {
          dispatch(setIsEditing(false));
        }
      } else {
        dispatch(setIsEditing(false));
      }
      dispatch(setIsSaving(false));
    } else {
      dispatch(setIsEditing(true));
    }
  };

  const [openChangeNameModal, setOpenChangeNameModal] =
    useState<boolean>(false);
  const toggleOpenChangeNameModal = () => {
    setOpenChangeNameModal(true);
  };
  const closeChangeNameModal = () => {
    setOpenChangeNameModal(false);
  };
  const navigate = useNavigate();
  const toggleOpen = () => {
    if (typeUser.type === "author") {
      dispatch(setPublishedOpen(!openPublished));
    } else {
      navigate("/author");
      toast.warn("Выберите тариф автор");
    }
  };

  const openCreateModal = () => {
    dispatch(setOpenCreateModal(true));
  };
  return (
    <div className={styles.profile_box}>
      <div className={styles.profile_img_box}>
        <UpdateProfilePhoto
          initialPhotoUrl={userData?.photo ? userData?.photo! : ""}
        />
      </div>
      <div className={styles.username_box}>
        {userData && (
          <div className={styles.username}>
            <div className={styles.usernameLang}>
              <span>
                {userData?.first_name
                  ? userData?.first_name.toUpperCase()
                  : "ИМЯ"}{" "}
              </span>{" "}
              <span>
                {userData?.last_name
                  ? userData?.last_name.toUpperCase()
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
              {userData?.city && userData?.country
                ? `${userData.city}, ${userData.country}`
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

        {window.location.pathname === "/profile" ||
        userData?.user_id === +idLink ? (
          <>
            <button
              className={`${
                isEditing ? styles.editButtonOpen : styles.editButton
              }`}
              onClick={toggleEdit}>
              <span className={styles.editButtonText}>
                {isEditing
                  ? `${t("profile.save")}`
                  : `${t("profile.edit")}`}
              </span>
            </button>
            <button
              className={`${
                isEditing
                  ? styles.changeNameButton
                  : styles.notChangeNameButton
              }`}
              onClick={toggleOpenChangeNameModal}>
              <span className={styles.editButtonText}>
                Изменить имя и фамилию
              </span>
            </button>
            {!isEditing && (
              <button
                className={`${styles.editButton}`}
                onClick={toggleOpen}>
                <span className={styles.editButtonText}>
                  {t("profile.publish")}
                </span>
              </button>
            )}
          </>
        ) : (
          <div>''</div>
        )}

        {isEditing && (
          <Inputs
            onInputChange={handleInputChange}
            initialShowTelegram={userData?.show_telegram!}
            initialShowPhone={userData?.show_telephone!}
            initialShowWhatsapp={userData?.show_whats_app!}
          />
        )}
        {openPublished && !isEditing && (
          <>
            <button
              className={styles.button}
              // onClick={toggleOpen}
            >
              <span
                className={styles.btn_text}
                onClick={openCreateModal}
                // onClick={() =>
                //   (window.location.pathname = "/author")
                // }
              >
                {t("publishButton.lesson")}
              </span>
            </button>
            <button
              className={styles.buttonEvent}
              title='Совсем скоро..'
              // onClick={toggleOpen}
            >
              <span className={styles.btn_text__Event}>
                {t("publishButton.event")}
              </span>
            </button>
            {/* <button
              className={styles.button}
              // onClick={toggleOpen}
            >
              <span className={styles.btn_text}>
                {t("publishButton.photo")}
              </span>
            </button> */}
          </>
        )}

        <div className={styles.info_me}>
          <h3
            className={
              isEditing ? styles.titleRight : styles.title_me
            }>
            {t("profile.aboutMe")}:
          </h3>
          {isEditing ? (
            <div className={styles.textareaContainer}>
              <textarea
                name='description'
                className={styles.description}
                value={description ?? ""}
                placeholder='Заполнить описание'
                onChange={handleDescriptionChange}
              />
            </div>
          ) : (
            <p className={styles.text_me}>
              {" "}
              {userData?.description
                ? userData?.description
                : "Заполнить описание"}
            </p>
          )}
        </div>
      </div>
      {openChangeNameModal && (
        <div className={styles.changeNameModal}>
          <ChangeNameModal onClose={closeChangeNameModal} />
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
