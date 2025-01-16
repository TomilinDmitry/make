import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  IGetUsersProfiles,
  IInitialStateLessons,
  ILesson,
  ILessonsState,
  IMyLessonsState,
  IProfilePayload,
  ITarifPayload,
} from "app/types/type";

const initialState: IInitialStateLessons = {
  lessons: null,
  myLessons: null,
  profiles: {},
  activeFilter: "popularity",
  userLesson: null,
  favouriteLessonsList: null,
  usersProfiles: null,
  usersProfilesUsersPage: null,
  isFavourite: null,
  blacklist: [],
  dateList: { results: [], next: null, count: 0 }, // Пример инициализации для dateList
  popularityList: { results: [], next: null, count: 0 },
  offsets: {
    popularity: 0, // offset для сортировки по популярности
    hi: 0, // offset для сортировки по дате
  },
  sellerTarif: [],
  openComplaint: false,
  postComplaintModal: false,
  openEditLesson: false,
};

export const lessonsSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    setLessons: (state, action: PayloadAction<ILessonsState>) => {
      state.lessons = action.payload;
    },
    appendLessons: (state, action: PayloadAction<ILessonsState>) => {
      state.lessons = {
        ...state.lessons,
        next: action.payload.next ?? null, // Если next не задан, делаем его null
        results: [
          ...(state.lessons?.results ?? []),
          ...action.payload.results,
        ], // Обрабатываем пустой массив, если results не задан
        count: action.payload.count ?? state.lessons?.count ?? 0, // Устанавливаем count или сохраняем предыдущий, если он есть
      };
    },
    setOffset(
      state,
      action: PayloadAction<{
        sortBy: "popularity" | "hi";
        offset: number;
      }>,
    ) {
      state.offsets[action.payload.sortBy] = action.payload.offset;
    },
    setMyLessons: (state, action: PayloadAction<IMyLessonsState>) => {
      state.myLessons = action.payload;
    },
    appendMyLessons(state, action) {
      state.myLessons = {
        ...state.myLessons,
        next: action.payload.next ?? null, // Если next не задан, делаем его null
        results: [
          ...action.payload.results,
          ...(state.myLessons?.results ?? []),
        ], // Обрабатываем пустой массив, если results не задан
        count: action.payload.count ?? state.myLessons?.count ?? 0, // Устанавливаем count или сохраняем предыдущий, если он есть
      };
    },
    appendUserLesson(state, action: PayloadAction<ILessonsState>) {
      if (state.userLesson) {
        state.userLesson.results = [
          ...action.payload.results,
          ...state.userLesson.results,
        ];
        state.userLesson.next = action.payload.next;
        state.userLesson.count = action.payload.count;
      } else {
        state.userLesson = action.payload;
      }
    },
    setUserLessons: (state, action: PayloadAction<ILessonsState>) => {
      state.userLesson = action.payload;
    },
    addLessonToBlacklist: (state, action: PayloadAction<number>) => {
      if (!state.blacklist.includes(action.payload)) {
        state.blacklist.push(action.payload);
      }
    },
    removeLessonFromBlacklist: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.blacklist = state.blacklist.filter(
        (id) => id !== action.payload,
      );
    },
    setUsersProfiles: (
      state,
      action: PayloadAction<IGetUsersProfiles[]>,
    ) => {
      state.usersProfiles = action.payload;
    },
    setUsersProfilesUsersPage: (
      state,
      action: PayloadAction<IGetUsersProfiles[]>,
    ) => {
      state.usersProfilesUsersPage = action.payload;
    },
    setFavouriteLessonsList: (
      state,
      action: PayloadAction<ILessonsState>,
    ) => {
      state.favouriteLessonsList = action.payload;
    },

    setProfile: (state, action) => {
      const { userId, profileData } = action.payload;
      state.profiles[userId] = profileData;
    },
    setIsFavourite: (
      state,
      action: PayloadAction<{ detail: string }>,
    ) => {
      state.isFavourite = action.payload;
    },
    setActiveFilter: (
      state,
      action: PayloadAction<"popularity" | "hi">,
    ) => {
      state.activeFilter = action.payload;
    },

    setPopularityList: (
      state,
      action: PayloadAction<ILessonsState>,
    ) => {
      state.popularityList = action.payload;
    },
    appendPopularityList: (
      state,
      action: PayloadAction<ILessonsState>,
    ) => {
      state.popularityList = {
        ...state.popularityList, // Сохраняем текущие данные
        next: action.payload.next ?? null, // Если next не задан, делаем его null
        results: [
          ...(state.popularityList?.results ?? []), // Предыдущие результаты или пустой массив
          ...action.payload.results, // Добавляем новые результаты
        ],
        count:
          action.payload.count ??
          (state.popularityList ? state.popularityList.count : 0), // Устанавливаем count или сохраняем предыдущее значение
      };
    },

    setDateList: (state, action: PayloadAction<ILessonsState>) => {
      state.dateList = action.payload;
    },
    appendDateList: (state, action: PayloadAction<ILessonsState>) => {
      state.dateList = {
        ...state.dateList, // Сохраняем текущие данные
        next: action.payload.next ?? null, // Если next не задан, делаем его null
        results: [
          ...(state.dateList?.results ?? []), // Предыдущие результаты или пустой массив
          ...action.payload.results, // Добавляем новые результаты
        ],
        count:
          action.payload.count ??
          (state.dateList ? state.dateList.count : 0), // Устанавливаем count или сохраняем предыдущее значение
      };
    },

    setProfileDataLessons: (
      state,
      action: PayloadAction<IProfilePayload>,
    ) => {
      const { user_id, profile } = action.payload;
      state.profiles[user_id] = profile;
    },
    resetMyLessons(state) {
      state.myLessons = null;
    },
    resetUserLesson(state) {
      state.userLesson = null;
    },
    setTarifData: (state, action: PayloadAction<ITarifPayload[]>) => {
      state.sellerTarif = action.payload;
    },
    setComplaintOpen: (state, action: PayloadAction<boolean>) => {
      state.openComplaint = action.payload;
    },
    setOpenPostComplaintModal: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.postComplaintModal = action.payload;
    },
    setOpenEditLesson: (state, action: PayloadAction<boolean>) => {
      state.openEditLesson = action.payload;
    },
  },
});

export const {
  setLessons,
  setProfile,
  setProfileDataLessons,
  setActiveFilter,
  setUserLessons,
  setUsersProfiles,
  setIsFavourite,
  setFavouriteLessonsList,
  addLessonToBlacklist,
  removeLessonFromBlacklist,
  appendLessons,
  setMyLessons,
  appendMyLessons,
  appendUserLesson,
  setPopularityList,
  setDateList,
  resetMyLessons,
  resetUserLesson,
  setOffset,
  appendDateList,
  appendPopularityList,
  setUsersProfilesUsersPage,
  setTarifData,
  setComplaintOpen,
  setOpenPostComplaintModal,
  setOpenEditLesson,
} = lessonsSlice.actions;

export default lessonsSlice.reducer;
