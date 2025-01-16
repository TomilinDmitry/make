import React, { useEffect, useState } from "react";
import s from "./style.module.scss";
import { IGetUserData } from "app/types/type";
import arrow_bottom from "../../../app/assets/profileCard/arrow_bottomProfile.svg";
import arrow_top from "../../../app/assets/profileCard/arrow_topProfile.svg";
import location from "../../../app/assets/profileCard/location.svg";
import videos from "../../../app/assets/profileCard/videos.svg";
import view from "../../../app/assets/profileCard/view.svg";
import { Inputs } from "components/Inputs/Inputs";
import { toast } from "react-toastify";
import { axiosWithRefreshToken } from "helpers/localStorage.helper";
import { getDataUser } from "app/api/api";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { NavigationProfile } from "../Navigation/Navigation";
import { UpdateProfilePhoto } from "../LoadPhoto/LoadPhoto";
import {
  setDescription,
  setIsEditing,
  setIsSaving,
  setOpenCreateModal,
  setPublishedOpen,
} from "app/service/profileCard/profileCardSlice";
import { useTranslation } from "react-i18next";
import { ChangeNameModal } from "../ChangeNameModal/ChangeNameModal";

export const ProfileMobile = () => {
  const { isEditing, description, counter, openPublished } =
    useSelector((state) => state.profileCard);
  const { userData, minimalUserData } = useSelector(
    (store) => store.user,
  );
  const [inputData, setInputData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    let descriptionInitial: string | undefined =
      userData?.description;
    dispatch(setDescription(descriptionInitial!));
  }, [dispatch, userData]);
  const [open, setOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setOpen(!open);
  };
  const closeChangeNameModal = () => {
    setOpenChangeNameModal(false);
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
  const token = localStorage.getItem("accessToken");
  const { t } = useTranslation();
  const updateUserData = async (inputData: any) => {
    const fetchData = async () => {
      await getDataUser(dispatch);
    };
    try {
      await axiosWithRefreshToken(
        "https://api.lr45981.tw1.ru/api/v1/profile/my-profile/update/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: inputData,
        },
      );

      toast.success("Профиль успешно обновлен");
      fetchData();
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
        error.response.data.phone?.[0] ===
        "Это поле не может быть пустым."
      ) {
        toast.error("Поле телефон не может быть пустым");
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
  const toggleOpenPublished = () => {
    dispatch(setPublishedOpen(!openPublished));
  };
  const openCreateModal = () => {
    dispatch(setOpenCreateModal(true));
  };
  const [openChangeNameModal, setOpenChangeNameModal] =
    useState<boolean>(false);
  const toggleOpenChangeNameModal = () => {
    setOpenChangeNameModal(true);
  };
  return (
    <div className={s.wrapper}>
      <div className={s.imageProfile}>
        {minimalUserData && (
          <UpdateProfilePhoto
            initialPhotoUrl={minimalUserData?.photo}
          />
        )}
      </div>
      <section className={s.name}>
        <h1>
          {userData?.first_name
            ? userData.first_name.toUpperCase()
            : "Имя"}{" "}
          {userData?.last_name
            ? userData.last_name.toUpperCase()
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
              {userData?.city && userData.country
                ? `${userData.city}, ${userData.country}`
                : "Не задано"}
            </span>
          </p>
          <div className={s.videos_view}>
            <p className={s.vid_see}>
              <img
                className={s.vid_see_img}
                src={view}
                alt='view_icon'
              />
              {counter && counter.length > 0
                ? counter?.map((el) => el.total_views)
                : "0"}
            </p>
            <p className={s.vid_counter}>
              <img
                className={s.vid_counter_img}
                src={videos}
                alt='videos_icon'
              />

              {counter && counter.length > 0
                ? counter?.map((el) => el.count_lessons)
                : "0"}
            </p>
          </div>
        </div>
      </div>
      <div className={s.buttonsContainer}>
        <button
          className={`${isEditing ? s.editButtonOpen : s.editButton}`}
          onClick={toggleEdit}>
          <span className={s.editButtonText}>
            {isEditing
              ? `${t("profile.save")}`
              : `${t("profile.edit")}`}
          </span>
        </button>{" "}
        <button
          className={`${
            isEditing ? s.changeNameButton : s.notChangeNameButton
          }`}
          onClick={toggleOpenChangeNameModal}>
          <span className={s.editButtonText}>
            Изменить имя и фамилию
          </span>
        </button>
        {!isEditing && (
          <button
            className={`${s.publishedButton}`}
            onClick={toggleOpenPublished}>
            <span className={s.editButtonText}>
              {t("profile.publish")}
            </span>
          </button>
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
              className={s.button}
              // onClick={toggleOpen}
            >
              <span className={s.btn_text} onClick={openCreateModal}>
                {t("publishButton.lesson")}
              </span>
            </button>
            <button
              className={s.buttonEvent}
              // onClick={toggleOpen}
            >
              <span className={s.btn_text__Event}>
                {t("publishButton.event")}
              </span>
            </button>
            {/* <button
              className={s.button}
              // onClick={toggleOpen}
            >
              <span className={s.btn_text__Event}>
                Опубликовать фото
              </span>
            </button> */}
          </>
        )}
        <div className={!isEditing ? s.info_me : s.info_me_isEditing}>
          <h3 className={s.title_me}>{t("profile.aboutMe")}:</h3>
          {isEditing ? (
            <div className={s.textareaContainer}>
              <textarea
                name='description'
                className={s.description}
                value={description ?? ""}
                placeholder='Заполнить описание'
                onChange={handleDescriptionChange}
              />
            </div>
          ) : (
            <>
              <p className={open ? s.open : s.text_me}>
                {" "}
                {userData?.description
                  ? userData?.description
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
            </>
          )}
          {!isEditing && (
            <nav className={open ? s.openNavigation : s.navigation}>
              <NavigationProfile />
            </nav>
          )}
          {openChangeNameModal && (
            <div className={s.changeNameModal}>
              <ChangeNameModal onClose={closeChangeNameModal} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
