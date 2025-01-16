import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { BASEURL } from "./apiLessons";
import { IGetUsersProfiles } from "app/types/type";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASEURL}/api/v1/`,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["UserProfile"], // Здесь указываем все используемые типы тегов
  endpoints: (builder) => ({
    getUsersProfileList: builder.query<
      IGetUsersProfiles[],
      { ids: string; page?: string }
    >({
      query: ({ ids }) => ({
        url: `profiles/by-user-ids/`,
        method: "GET",
        params: { user_ids: ids },
      }),
      providesTags: (result, error, { ids }) =>
        result
          ? ids
              .split(",")
              .map((id) => ({ type: "UserProfile" as const, id })) // Указываем тип 'UserProfile'
          : [],
    }),
  }),
});

export const { useGetUsersProfileListQuery } = api;

export const countersApi = createApi({
  reducerPath: "countersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://apiv.lr45981.tw1.ru/api/v1/", // Базовый URL для запросов
  }),
  endpoints: (builder) => ({
    getCountersByUserIds: builder.query<
      Record<
        number,
        {
          total_views: number;
          count_lessons: number;
          user_id: string;
        }
      >,
      number[]
    >({
      query: (userIds) => ({
        url: `counters/by-user-ids/?user_ids=${userIds}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCountersByUserIdsQuery } = countersApi;
