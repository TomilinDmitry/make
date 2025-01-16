import {
  appendLessons,
  setDateList,
  setFavouriteLessonsList,
  setIsFavourite,
  setLessons,
  setMyLessons,
  setPopularityList,
  setProfileDataLessons,
  setUserLessons,
  setUsersProfiles,
  setUsersProfilesUsersPage,
} from "app/service/lessons/lessonsSlice";
import {
  setFollowers,
  setFollowing,
  setProfileData,
} from "app/service/profileCard/profileCardSlice";
import {
  IFollowers,
  IGetUsersProfiles,
  ILessonsState,
  ILoadMoreParams,
  IMyLessonsState,
  IProfileData,
} from "app/types/type";
import axios from "axios";
import { axiosWithRefreshToken } from "helpers/localStorage.helper";
import { toast } from "react-toastify";
import { VURL } from "./homeApi";

export const BASEURL = "https://api.lr45981.tw1.ru";
export const XURL = "https://apiv.lr45981.tw1.ru";

//с токеном

export const getLessons = async (
  dispatch: any,
  sortBy: string,
  offset?: number,
) => {
  try {
    const response = await axiosWithRefreshToken<ILessonsState>(
      `${XURL}/api/v1/lessons/homepage/?sort=${sortBy}&limit=20&offset=${offset}`,
    );
    // Диспатчим обновленные данные
    dispatch(setLessons(response));
    if (sortBy === "popularity") {
      dispatch(setPopularityList(response)); // Например, для популярных уроков
    } else if (sortBy === "hi") {
      dispatch(setDateList(response)); // Для сортировки по дате
    }
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const loadMoreData = async ({
  dispatch,
  next,
  action,
}: ILoadMoreParams) => {
  try {
    const response = await axiosWithRefreshToken<any>(next); // Здесь можно уточнить тип данных, если нужно
    dispatch(action(response)); // Диспатчим данные через переданный action
  } catch (error) {
    console.error(
      "Ошибка при загрузке дополнительных данных:",
      error,
    );
  }
};
export const getDataUserProfileWithOutToken = async (
  dispatch: any,
  id: string | number,
) => {
  try {
    // Получаем данные профиля из API
    const response = await axios.get(
      `${BASEURL}/api/v1/profiles/${id}/`,
    );

    // Извлекаем только поле `data` из ответа
    const profileData: IProfileData = response.data;

    // Диспатчим только полезные данные
    dispatch(setProfileData(profileData));

    dispatch(
      setProfileDataLessons({
        user_id: +id,
        profile: profileData,
      }),
    );
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const setIsFollow = async (id: string) => {
  try {
    await axiosWithRefreshToken<string>(
      `${BASEURL}/api/v1/profile/${id}/follow/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    toast.success("Вы подписались!");
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
// Анфолоу
export const setIsUnFollow = async (id: string) => {
  try {
    await axiosWithRefreshToken<string>(
      `${BASEURL}/api/v1/profile/${id}/unfollow/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    toast.success("Вы отписались!");
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const getFollowers = async (dispatch: any, id: string) => {
  try {
    const data = await axiosWithRefreshToken<IFollowers>(
      `${BASEURL}/api/v1/profile/${id}/followers/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    dispatch(setFollowers(data));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const getFollowing = async (dispatch: any, id: string) => {
  try {
    const data = await axiosWithRefreshToken<IFollowers>(
      `${BASEURL}/api/v1/profile/${id}/following/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    dispatch(setFollowing(data));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
// Получение уроков

export const getUsersLessons = async (
  dispatch: any,
  id: string,
  offset = 0,
  limit = 16,
) => {
  try {
    const data = await axiosWithRefreshToken<ILessonsState>(
      `${XURL}/api/v1/lessons/user/${id}/?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    dispatch(setUserLessons(data));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const getMyLessons = async (
  dispatch: any,
  offset = 0,
  limit = 16,
) => {
  try {
    const data = await axiosWithRefreshToken<IMyLessonsState>(
      `${XURL}/api/v1/lessons/my-lessons/?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    dispatch(setMyLessons(data));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const addFavouriteLesson = async (
  dispatch: any,
  id: number,
) => {
  try {
    const data = await axiosWithRefreshToken<{ detail: string }>(
      `${XURL}/api/v1/lesson/${id}/favorite/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    toast.success("Урок добавлен в избранное");

    dispatch(setIsFavourite(data));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const deleteFavouriteLesson = async (id: number) => {
  try {
    await axiosWithRefreshToken<string>(
      `${XURL}/api/v1/lesson/${id}/unfavorite/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    toast.success("Урок убран из избранного");
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const getFavouriteLessonsList = async (dispatch: any) => {
  try {
    const data = await axiosWithRefreshToken<ILessonsState>(
      `${XURL}/api/v1/lessons/favorites/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    dispatch(setFavouriteLessonsList(data));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const getUsersProfileList = async (
  dispatch: any,
  ids: string,
  page?: string,
) => {
  try {
    const defUrl = `${BASEURL}/api/v1/profiles/by-user-ids/`;
    const userPage = `${BASEURL}/api/v1/profiles/by-user-ids/?selection=full`;
    const URL = page === "users" ? userPage : defUrl;
    const data = await axiosWithRefreshToken<IGetUsersProfiles[]>(
      URL,
      {
        params: { user_ids: ids },
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    // console.log(page)
    if (page === "users") {
      dispatch(setUsersProfilesUsersPage(data));
    } else {
      dispatch(setUsersProfiles(data));
    }
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const addLessonInBlackList = async (
  dispatch: any,
  id: number,
) => {
  try {
    await axiosWithRefreshToken<IGetUsersProfiles[]>(
      `${XURL}/api/v1/lesson/${id}/blacklist/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

// Запросы без токена

// Без токена
export const getLessonsWithOutToken = async (
  dispatch: any,
  sortBy: string,
) => {
  try {
    const response = await axios.get(
      `${XURL}/api/v1/lessons/homepage/?sort=${sortBy}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data: ILessonsState = response.data;
    if (sortBy === "popularity") {
      dispatch(setPopularityList(data)); // Например, для популярных уроков
    } else if (sortBy === "hi") {
      dispatch(setDateList(data)); // Для сортировки по дате
    }
    // Диспатчим обновленные данные
    dispatch(setLessons(data));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const getUsersProfileListWithOutToken = async (
  dispatch: any,
  ids: string,
  page?: string,
) => {
  try {
    const defUrl = `${BASEURL}/api/v1/profiles/by-user-ids/`;
    const userPage = `${BASEURL}/api/v1/profiles/by-user-ids/?selection=full`;
    const URL = page === "users" ? userPage : defUrl;
    const data = await axios.get(URL, {
      params: { user_ids: ids },
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response: IGetUsersProfiles[] = data.data;
    if (page === "users") {
      dispatch(setUsersProfilesUsersPage(response));
    } else {
      dispatch(setUsersProfiles(response));
    }
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const getFavouriteLessonsListWithOutToken = async (
  dispatch: any,
) => {
  try {
    const data = await axios.get(`${XURL}/api/v1/lessons/favorites/`);
    const response: ILessonsState = data.data;
    dispatch(setFavouriteLessonsList(response));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const getUsersLessonsWhitOutToken = async (
  dispatch: any,
  id: string,
) => {
  try {
    const data = await axios.get(
      `${XURL}/api/v1/lessons/user/${id}/`,
    );
    const response: ILessonsState = data.data;
    dispatch(setUserLessons(response));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const getFollowersWithOutToken = async (
  dispatch: any,
  id: string,
) => {
  try {
    const data = await axios.get(
      `${BASEURL}/api/v1/profile/${id}/followers/`,
    );
    const response: IFollowers = data.data;
    dispatch(setFollowers(response));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const getFollowingWithOutToken = async (
  dispatch: any,
  id: string,
) => {
  try {
    const data = await axios.get(
      `${BASEURL}/api/v1/profile/${id}/following/`,
    );
    const response: IFollowers = data.data;
    dispatch(setFollowing(response));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const postComplaint = async (
  id: number,
  type: string,
  text?: string,
) => {
  try {
    const data = await axiosWithRefreshToken(
      `${VURL}/api/v1/lesson/${id}/complaint/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          complaint_type: type,
          text: text,
        },
      },
    );
    return data;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const updateLesson = async (
  id: number,
  type: string,
  text?: string,
) => {
  try {
    const data = await axiosWithRefreshToken(
      `${VURL}/api/v1/lesson/${id}/complaint/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          complaint_type: type,
          text: text,
        },
      },
    );
    return data;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

