import {
  setLessonLoadLink,
  setProgress,
  setUpload,
} from "app/service/createLesson/CreateLessonSlice";
import {
  ICondition,
  IGetStatus,
  IUploadLinkResponse,
} from "app/types/type";
import { AxiosError } from "axios";
import { axiosWithRefreshToken } from "helpers/localStorage.helper";
import { toast } from "react-toastify";
import { VURL } from "./homeApi";
import { setConditions } from "app/service/createLesson/conditions/ConditionsSlice";

export const XURL = "https://apix.lr45981.tw1.ru";

export const createLesson = async (
  nameLesson: string,
  descriptionLesson: string,
  // priceLesson: number,
  selectedGender: "male" | "female",
): Promise<boolean> => {
  try {
    await axiosWithRefreshToken(`${VURL}/api/v1/task/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        title: nameLesson,
        description: descriptionLesson,
        // price: priceLesson,
        voice_gender: selectedGender,
      },
    });
    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        error.response?.data.detail &&
          error.response?.data.detail ===
            "Error user already have task"
          ? "Вы уже начали создание урока"
          : error.response?.data.detail ===
            "Permission denied you aren't seller"
          ? "Вы не продавец."
          : "Ошибка при создании урока",
      );
    }
    return false;
  }
};
export const getUploadLink = async (
  dispatch: any,
  duration: number,
  filesize: number,
): Promise<string> => {
  try {
    const response = await axiosWithRefreshToken<IUploadLinkResponse>(
      `${VURL}/api/v1/task/upload-link/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          duration: 300,
          filesize: 367001600,
        },
      },
    );
    const uploadLink = response.detail.url; // Получаем URL

    // Отправляем URL через dispatch
    dispatch(setLessonLoadLink(uploadLink));

    return uploadLink; // Возвращаем URL
  } catch (error) {
    throw new Error("Не удалось получить ссылку для загрузки");
  }
};

export const getStatusLoadLesson = async (dispatch: any) => {
  try {
    const response = await axiosWithRefreshToken<IGetStatus>(
      `${VURL}/api/v1/task/get-status/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data: IGetStatus = response;
    dispatch(setProgress(data));
    return data;
  } catch (error) {
    console.error("Не удалось получить ссылку для загрузки");
    return error;
  }
};
export const setMarkUpload = async (dispatch: any) => {
  try {
    const response = await axiosWithRefreshToken<{ detail: string }>(
      `${VURL}/api/v1/task/mark-uploaded/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    dispatch(
      setUpload(response.detail === "Video successfully uploaded."),
    );
  } catch (error) {
    console.log(error);
    throw new Error("Не удалось обновить статус");
  }
};
export const postNewLesson = async (
  dispatch: any,
  id: number,
  title: string,
  description: string,
  published: boolean,
  is_public: boolean,
) => {
  try {
    const response = await axiosWithRefreshToken<{ detail: string }>(
      `${VURL}/api/v1/lesson/${id}/update/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          title: title,
          description: description,
          is_public: is_public,
          published: published,
        },
      },
    );
    return response.detail;
    // dispatch(
    //   setUpload(response.detail === "Video successfully uploaded."),
    // );
  } catch (error) {
    console.log(error);
    throw new Error("Не удалось обновить статус");
  }
};
export const postNewLessonThumbnail = async (
  dispatch: any,
  id: number,
  file: File,
) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axiosWithRefreshToken<{ detail: string }>(
      `${VURL}/api/v1/lesson/${id}/thumbnail/`,
      {
        method: "POST",
        data: formData,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      },
    );
    return response.detail;
    // dispatch(
    //   setUpload(response.detail === "Video successfully uploaded."),
    // );
  } catch (error) {
    console.log(error);
    throw new Error("Не удалось обновить статус");
  }
};

export const postConditions = async (
  id: number,
  data: ICondition[],
) => {
  try {
    const response = await axiosWithRefreshToken(
      `${VURL}/api/v1/conditions/${id}/create/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      },
    );
    console.log("Response:", response);
    return response; // Возвращаем ответ, если нужно
    // const data: IGetStatus = response;
    // dispatch(setProgress(data));
  } catch (error) {
    throw new Error("Не удалось получить ссылку для загрузки");
  }
};
export const getConditions = async (dispatch: any, id: number) => {
  try {
    const response = await axiosWithRefreshToken<ICondition[]>(
      `${VURL}/api/v1/conditions/${id}/receive/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Response:", response);
    dispatch(setConditions(response));
    return response; // Возвращаем ответ, если нужно
    // const data: IGetStatus = response;
    // dispatch(setProgress(data));
  } catch (error) {
    throw new Error("Не удалось получить ссылку для загрузки");
  }
};
