import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosWithRefreshToken } from "helpers/localStorage.helper";
import styles from "./style.module.scss";
import mockImage from "../../../app/assets/profileCard/photo_undefined.svg";
import loadImage from "../../../app/assets/profileCard/loadImagePhoto.svg";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { useLocation } from "react-router";
import {
  setUpdateMinimalUserPhoto,
  setUpdateUserPhoto,
} from "app/service/user/userSlice";
import { setUpdateProfilePhoto } from "app/service/burgerProfiles/burgerSlice";

interface UpdatePhotoResponse {
  photo: string;
}

export const UpdateProfilePhoto = ({
  initialPhotoUrl,
}: {
  initialPhotoUrl: string;
}) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");
  const { isEditing } = useSelector((state) => state.profileCard);
  const { userData } = useSelector((state) => state.user);
  const userDataUrl = initialPhotoUrl
    ? "https://api.lr45981.tw1.ru" + initialPhotoUrl
    : null;

  const location = useLocation();

  const validPhotoUrl =
    userDataUrl && userDataUrl.includes("null") ? null : userDataUrl;

  const [photoUrl, setPhotoUrl] = useState<string | null>(
    validPhotoUrl || null,
  );

  const [, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    const userDataUrl = initialPhotoUrl
      ? initialPhotoUrl.startsWith("https://api.lr45981.tw1.ru")
        ? initialPhotoUrl
        : `https://api.lr45981.tw1.ru${initialPhotoUrl}`
      : null;
    const validPhotoUrl =
      userDataUrl && !userDataUrl.includes("null")
        ? userDataUrl
        : null;

    setPhotoUrl(validPhotoUrl || null);
  }, [initialPhotoUrl]);

  const updatePhoto = async (selectedPhoto: File) => {
    const formData = new FormData();
    formData.append("photo", selectedPhoto);

    try {
      const response =
        await axiosWithRefreshToken<UpdatePhotoResponse>(
          "https://api.lr45981.tw1.ru/api/v1/profile/my-profile/update-photo/",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            data: formData,
          },
        );

      if (response.photo) {
        toast.success("Фото успешно обновлено!");
        const newPhotoUrl =
          "https://api.lr45981.tw1.ru" + response.photo;
        setPhotoUrl(newPhotoUrl);

        // Диспатчим новое фото в Redux
        dispatch(setUpdateUserPhoto(response.photo));
        dispatch(setUpdateMinimalUserPhoto(response.photo));
        if (userData?.user_id) {
          // console.log(userData.user_id);
          dispatch(
            setUpdateProfilePhoto({
              user_id: userData.user_id.toString(),
              photo: newPhotoUrl,
            }),
          );
        }
      }
    } catch (error) {
      console.error("Ошибка при загрузке фото:", error);
      toast.error("Ошибка при обновлении фото.");
    }
  };

  const handlePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const selectedPhoto = e.target.files[0];
      setPhoto(selectedPhoto);
      await updatePhoto(selectedPhoto);
    }
  };
  // console.log(photoUrl)

  return (
    <div className={styles.container}>
      <input
        type='file'
        accept='image/*'
        style={{ display: "none" }}
        id='photo-upload'
        onChange={handlePhotoChange}
      />

      <button className={styles.loadImage}>
        {isEditing && (
          <>
            <div
              className={styles.hoverBg}
              onClick={() =>
                document.getElementById("photo-upload")?.click()
              }>
              Сменить фото
            </div>
            <img
              src={loadImage}
              alt='loadImage'
              className={styles.loadImageIcon}
              onClick={() =>
                document.getElementById("photo-upload")?.click()
              }
            />
          </>
        )}

        {location.pathname === "/editProfile" ? (
          <img
            className={styles.img_meEdited}
            src={photoUrl || mockImage}
            alt='profile_photo or icon'
          />
        ) : (
          <img
            className={styles.img_me}
            src={photoUrl || mockImage}
            alt='profile_photo or icon'
          />
        )}
      </button>
    </div>
  );
};
