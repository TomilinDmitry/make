import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setFaqInformation,
  setHomeLessonsList,
  setLessonCounter,
  setManualCategory,
  setManualCategoryListOne,
  setUserCounter,
} from "app/service/home/HomeSlice";
import {
  ILessonsHomePageState,
  IManualCategories,
  IManualCategoryElement,
} from "app/types/type";
import axios, { AxiosResponse } from "axios";
import { axiosWithRefreshToken } from "helpers/localStorage.helper";
import { toast } from "react-toastify";
export const VURL = "https://apiv.lr45981.tw1.ru";
export const URL = "https://api.lr45981.tw1.ru";
export const getLessonHomePage = async (dispatch: any) => {
  try {
    const response =
      await axiosWithRefreshToken<ILessonsHomePageState>(
        `${VURL}/api/v1/lessons/following`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    const data: ILessonsHomePageState = response;
    dispatch(setHomeLessonsList(data));
  } catch (error) {
    console.log("Не удалось получить ссылку для загрузки");
  }
};
export const getLessonHomePageFirstTime = async (dispatch: any) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("Access token не найден в localStorage");
    }
    // Запрос с токеном из localStorage
    const response = await axios.get<ILessonsHomePageState>(
      `${VURL}/api/v1/lessons/following`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data: ILessonsHomePageState = response.data;
    dispatch(setHomeLessonsList(data));
  } catch (finalError) {
    // В случае неудачи выводим ошибку
    console.error("Ошибка при запросе с accessToken:", finalError);
  }
};
export const getManualCategories = async (dispatch: any) => {
  try {
    let response:
      | IManualCategories[]
      | AxiosResponse<IManualCategories[], any>;
    response = await axios.get<IManualCategories[]>(
      `${URL}/api/v1/instruction/categories/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data: IManualCategories[] =
      "data" in response ? response.data : response;
    dispatch(setManualCategory(data));
  } catch (error) {
    console.error("Не удалось получить категории");
    toast.error("Не удалось получить категории");
  }
};

export const getManualCategoryList = async (
  dispatch: any,
  id: number,
) => {
  try {
    let response: AxiosResponse<IManualCategoryElement[], any>;
    response = await axios.get<IManualCategoryElement[]>(
      `${URL}/api/v1/instruction/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // {id === 1 ? (
    const data: IManualCategoryElement[] =
      "data" in response ? response.data : response;
    if (data.length === 0) return;
    dispatch(setManualCategoryListOne(data));
    return data;
  } catch (error) {
    console.error("Не удалось получить список категорий");
    toast.error("Не удалось получить список категорий");
  }
};

export const getFaqData = async (dispatch: any) => {
  try {
    let response: AxiosResponse<any, any>;
    response = await axios.get<any>(`${URL}/api/v1/faq/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: any = response.data;
    dispatch(setFaqInformation(data));
  } catch {
    console.error("Не удалось получить часто задаваемые вопросы");
    toast.error("Не удалось получить часто задаваемые вопросы");
  }
};
export const fetchManualCategoryList = createAsyncThunk(
  "manual/fetchManualCategoryList",
  async (id: number, { dispatch }) => {
    try {
      const response = await axiosWithRefreshToken<
        IManualCategoryElement[]
      >(`${URL}/api/v1/instruction/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      // console.log(response);
      dispatch(setManualCategoryListOne(response));
    } catch (error) {
      console.error("Не удалось получить ссылку для загрузки");
    }
  },
);

export const getSlugData = createAsyncThunk<
  IManualCategoryElement[], // Укажите возвращаемый тип данных
  string, // Тип параметра (slug)
  { rejectValue: string } // Тип значения rejectWithValue
>(
  "category/getSlugData",
  async (slug, { dispatch, rejectWithValue }) => {
    try {
      const response: AxiosResponse<IManualCategoryElement[]> =
        await axios.get(`${URL}/api/v1/instruction/${slug}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

      const data = response.data; // Это массив IManualCategoryElement[]
      dispatch(setManualCategoryListOne(data)); // Передаем только data
      return data; // Возвращаем данные
    } catch (error) {
      return rejectWithValue("Не удалось получить данные");
    }
  },
);
export const getHomePageLessonCounter = async (dispatch: any) => {
  try {
    const response = await axios.get<{
      lesson_count: number;
    }>(`${VURL}/api/v1/counters/all-lesson/`, {
      // method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const data: ILessonsHomePageState = response;
    dispatch(setLessonCounter(response.data.lesson_count));
  } catch (error) {
    console.log("Не удалось получить ссылку для загрузки");
  }
};
export const getHomePageUserCounter = async (dispatch: any) => {
  try {
    const response = await axios.get<{
      profile_count: number;
    }>(`${URL}/api/v1/profile/count-all/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const data: ILessonsHomePageState = response;
    dispatch(setUserCounter(response.data.profile_count));
  } catch (error) {
    console.log("Не удалось получить ссылку для загрузки");
  }
};
