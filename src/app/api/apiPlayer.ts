import axios from "axios";
import { BASEURL, XURL } from "./apiLessons";
import {
  setPlayerCommentData,
  setPlayerCommentRepliesData,
  setPlayerData,
} from "app/service/player/playerSlice";
import { axiosWithRefreshToken } from "helpers/localStorage.helper";
import {
  IPlayerCommentRepliesState,
  IPlayerCommentState,
  IPlayerDataState,
  IPlayerSendComment,
} from "app/types/type";
import { VURL } from "./homeApi";

export const getPlayerIdWithOutToken = async (
  dispatch: any,
  id: string,
): Promise<IPlayerDataState | any> => {
  try {
    const response = await axios.get(
      `${XURL}/api/v1/lesson/${id}/detail/`,
    );
    const data: IPlayerDataState = response.data;
    dispatch(setPlayerData(data));
    return data;
  } catch (error) {
    console.log(error);
    console.error("Ошибка при получении данных:", error);
    return error.status;
  }
};

export const getPlayerId = async (
  dispatch: any,
  id: string,
): Promise<IPlayerDataState | any> => {
  try {
    const response = await axiosWithRefreshToken<IPlayerDataState>(
      `${XURL}/api/v1/lesson/${id}/detail/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    dispatch(setPlayerData(response));
    return response;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return error;
  }
};
export const getPlayerComments = async (
  dispatch: any,
  id: number,
) => {
  try {
    const response = await axiosWithRefreshToken<IPlayerCommentState>(
      `${XURL}/api/v1/comments/media/${id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    dispatch(setPlayerCommentData(response));
    return response;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const getPlayerCommentsReplies = async (
  dispatch: any,
  id: number, // id comment
) => {
  try {
    const response =
      await axiosWithRefreshToken<IPlayerCommentRepliesState>(
        `${XURL}/api/v1/comments/${id}/replies/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    // console.log(response);
    dispatch(
      setPlayerCommentRepliesData({
        commentId: id,
        replies: response.results,
      }),
    );
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const sendPlayerComment = async (
  id: number, // id comment
  text: string,
) => {
  try {
    await axiosWithRefreshToken<IPlayerSendComment>(
      `${XURL}/api/v1/comments/media/${id}/add/`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        data: {
          text,
        },
      },
    );
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const sendPlayerCommentReplies = async (
  id: number, // id comment
  text: string,
) => {
  try {
    await axiosWithRefreshToken<IPlayerSendComment>(
      `${XURL}/api/v1/comments/${id}/reply/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          text,
        },
      },
    );
    return "ok"
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
export const sendPurchasesCreate = async (id: number) => {
  try {
    await axiosWithRefreshToken(
      `${VURL}/api/v1/purchases/${id}/create/`,
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
export const addNewViews = async (id: number) => {
  try {
    await axiosWithRefreshToken(
      `${VURL}/api/v1/lesson/${id}/add-view`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
