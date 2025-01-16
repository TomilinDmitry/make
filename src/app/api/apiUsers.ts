import { setUserSearchData } from "app/service/user/userSlice";
import {
  setMaxViewsUsers,
  setWithOutVideoUsers,
} from "app/service/users/UsersSlice";
import {
  IGetUsers,
  IGetUsersWithOutVideo,
  ISearchData,
} from "app/types/type";
import axios from "axios";
import { axiosWithRefreshToken } from "helpers/localStorage.helper";

export const BASEURL = "https://api.lr45981.tw1.ru";
export const XURL = "https://apiv.lr45981.tw1.ru";

export const getUsers = async (dispatch: any) => {
  try {
    const response = await axiosWithRefreshToken<IGetUsers>(
      `${XURL}/api/v1/counters/max-views/`,
    );
    dispatch(setMaxViewsUsers(response));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const getUsersWithOutVideo = async (dispatch: any) => {
  try {
    const response =
      await axiosWithRefreshToken<IGetUsersWithOutVideo>(
        `${BASEURL}/api/v1/profiles/remaining/`,
      );
    dispatch(setWithOutVideoUsers(response));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const getUsersWithOutToken = async (dispatch: any) => {
  try {
    const response = await axios.get(
      `${XURL}/api/v1/counters/max-views/`,
    );
    const data: IGetUsers = response.data;
    dispatch(setMaxViewsUsers(data));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const getUsersWithOutVideoAndToken = async (dispatch: any) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/v1/profiles/remaining/`,
    );
    const data: IGetUsersWithOutVideo = response.data;
    dispatch(setWithOutVideoUsers(data));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const getUsersSearchByName = async (
  dispatch: any,
  firstName?: string,
  lastName?: string,
) => {
  try {
    const response = await axiosWithRefreshToken<ISearchData[]>(
      `${BASEURL}/api/v1/profiles/search/`,
      {
        params: { first_name: firstName, last_name: lastName },
      },
    );

    dispatch(setUserSearchData(response));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const getUsersSearchByLocation = async (
  dispatch: any,
  country?: string,
  city?: string,
) => {
  try {
    const response = await axiosWithRefreshToken<ISearchData[]>(
      `${BASEURL}/api/v1/profiles/search/`,
      {
        params: { country, city },
      },
    );

    dispatch(setUserSearchData(response));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const getUsersSearchByNameAndLocation = async (
  dispatch: any,
  // country?: string,
  city?: string,
  firstName?: string,
  lastName?: string,
) => {
  try {
    const isLatin = (str: string) => /^[a-zA-Z\s]+$/.test(str);

    // Создаем объект params, который будет содержать только те параметры, которые переданы
    const params: { [key: string]: string | undefined } = {};

    // Добавляем параметры в объект только если они не пустые
    // if (country) params.country = country;
    if (city) params.city = city;
    if (firstName && isLatin(firstName)) {
      params.lat_first_name = firstName;
    } else if (firstName) {
      params.first_name = firstName;
    }
    if (lastName && isLatin(lastName)) {
      params.lat_last_name = lastName;
    } else if (lastName) {
      params.last_name = lastName;
    }
    // Отправляем запрос с динамически сформированными параметрами
    const response = await axiosWithRefreshToken<ISearchData[]>(
      `${BASEURL}/api/v1/profiles/search/`,
      {
        params,
      },
    );
    // Диспатчим полученные данные в store
    dispatch(setUserSearchData(response));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
