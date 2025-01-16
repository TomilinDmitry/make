import { setProfileDataLessons } from "app/service/lessons/lessonsSlice";
import {
  setCounter,
  setCounterMyProfile,
  setProfileData,
} from "app/service/profileCard/profileCardSlice";
import {
  setMinimalUserData,
  setUserData,
} from "app/service/user/userSlice";
import {
  ICounter,
  IGetMyProfileCounter,
  IGetUserData,
  IMinimalUserData,
  IProfileData,
} from "app/types/type";
import axios, { AxiosResponse } from "axios";
import { axiosWithRefreshToken } from "helpers/localStorage.helper";

export const baseURL = "https://api.lr45981.tw1.ru";
export const XUrl = "https://apiv.lr45981.tw1.ru";
export const instance = axios.create({
  baseURL: "https://api.lr45981.tw1.ru/",
  headers: {
    Authorization: `Bearer` + localStorage.getItem("accessToken"),
    "Content-Type": "application/json",
    //
  },
});
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const instanceRegistration = axios.create({
  baseURL: "https://api.lr45981.tw1.ru/",
});

// Получение своего профиля
export const getDataUser = async (
  dispatch: any,
  id?: number,
  minimal?: boolean,
): Promise<any> => {
  try {
    const data = await axiosWithRefreshToken<
      IGetUserData | IMinimalUserData
    >(
      `${baseURL}/api/v1/profile/my-profile/${
        minimal ? "?minimal=true" : ""
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    dispatch(setUserData(data as IGetUserData));
    dispatch(setMinimalUserData(data as IMinimalUserData));
    dispatch(
      setProfileDataLessons({
        user_id: +data.user_id,
        profile: data as IGetUserData,
      }),
    );
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

// Получение чужого профиля
export const getDataUserProfile = async (
  dispatch: any,
  id: string | number,
) => {
  try {
    const data = await axiosWithRefreshToken<IProfileData>(
      `${baseURL}/api/v1/profiles/${id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    dispatch(setProfileData(data));
    dispatch(
      setProfileDataLessons({
        user_id: +id,
        profile: data,
      }),
    );
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const getMyProfileCounters = async (dispatch: any) => {
  try {
    const data = await axiosWithRefreshToken<IGetMyProfileCounter>(
      `${XUrl}/api/v1/counters/my-profile/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    dispatch(setCounterMyProfile(data));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const getCounterProfile = async (
  dispatch: any,
  id: string,
) => {
  try {
    const data = await axiosWithRefreshToken<ICounter[]>(
      `${XUrl}/api/v1/counters/by-user-ids/?user_ids=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    dispatch(setCounter(data));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const getCounterProfileWithOutToken = async (
  dispatch: any,
  id: string,
) => {
  try {
    const data = await axios.get(
      `${XUrl}/api/v1/counters/by-user-ids/?user_ids=${id}`,
    );
    const response: ICounter[] = data.data;
    dispatch(setCounter(response));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
