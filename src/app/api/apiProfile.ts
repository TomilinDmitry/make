import axios from "axios";
import { VURL } from "./homeApi";
import { axiosWithRefreshToken } from "helpers/localStorage.helper";
import {
  setAccessControl,
  setBoughtVideo,
} from "app/service/profileCard/profileCardSlice";
import { IAccessControlState, ILessonsState } from "app/types/type";
import { BASEURL } from "./apiLessons";
import { toast } from "react-toastify";

export const getBoughtVideo = async (dispatch: any) => {
  try {
    const response = await axiosWithRefreshToken<ILessonsState>(
      `${VURL}/api/v1/lessons/bought/`,
    );
    dispatch(setBoughtVideo(response));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const getAccessControl = async (dispatch: any) => {
  try {
    const response = await axiosWithRefreshToken<IAccessControlState>(
      `${VURL}/api/v1/purchases/accesses/`,
    );
    dispatch(setAccessControl(response));
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const setNewName = async (
  name: string,
  lastName: string,
  reason: string,
) => {
  try {
    const response = await axiosWithRefreshToken<any>(
      `${BASEURL}/api/v1/profile/create-requests/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          new_first_name: name,
          new_last_name: lastName,
          reason: reason,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
    throw error;
  }
};
export const setNewStatus = async (
  id: number,
  status: boolean,
  access_until?: string,
) => {
  try {
    const response = await axiosWithRefreshToken<any>(
      `${VURL}/api/v1/purchases/${id}/update/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          status: status,
          access_until: access_until,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
    throw error;
  }
};
