import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IHomeState,
  ILessonsHomePageState,
  IManualCategories,
  IManualCategoryElement,
} from "app/types/type";

const initialState: IHomeState = {
  activeTab: "news",
  openDoc: false,
  openProtection: false,
  isOpenList: false,
  homeLessonsList: null,
  isOpenDocList: false,
  manualCategory: [],
  manualCategoryListOne: [],
  openCategoryIndex: null,
  optionListHeight: null,
  faqInformation: [],
  lessonCounter: 0,
  userCounter: 0,
};

export const homeSlice = createSlice({
  name: "home",
  initialState: initialState,
  reducers: {
    setActiveTabHome: (
      state,
      action: PayloadAction<"news" | "manual" | "support" | "FAQ">,
    ) => {
      state.activeTab = action.payload;
    },
    setOpenDoc: (state, action: PayloadAction<boolean>) => {
      state.openDoc = action.payload;
    },
    setOpenProtection: (state, action: PayloadAction<boolean>) => {
      state.openProtection = action.payload;
    },
    setIsOpenList: (state, action: PayloadAction<boolean>) => {
      state.isOpenList = action.payload;
    },
    setIsOpenDocList: (state, action: PayloadAction<boolean>) => {
      state.isOpenDocList = action.payload;
    },
    setOptionListHeight: (state, action: PayloadAction<number>) => {
      state.optionListHeight = action.payload;
    },
    setOpenCategoryIndex: (
      state,
      action: PayloadAction<
        number | ((prevIndex: number | null) => number | null)
      >,
    ) => {
      if (typeof action.payload === "function") {
        state.openCategoryIndex = action.payload(
          state.openCategoryIndex,
        );
      } else {
        state.openCategoryIndex = action.payload;
      }
    },
    setManualCategory: (
      state,
      action: PayloadAction<IManualCategories[]>,
    ) => {
      state.manualCategory = action.payload;
    },
    setManualCategoryListOne: (
      state,
      action: PayloadAction<IManualCategoryElement[]>,
    ) => {
      state.manualCategoryListOne = action.payload;
    },
    setHomeLessonsList: (
      state,
      action: PayloadAction<ILessonsHomePageState>,
    ) => {
      state.homeLessonsList = action.payload;
    },
    setFaqInformation: (state, action: PayloadAction<any>) => {
      state.faqInformation = action.payload;
    },
    setAppendHomeLessons: (
      state,
      action: PayloadAction<ILessonsHomePageState>,
    ) => {
      state.homeLessonsList = {
        ...state.homeLessonsList,
        next: action.payload.next ?? null, // Если next не задан, делаем его null
        results: [
          ...(state.homeLessonsList?.results ?? []),
          ...action.payload.results,
        ], // Обрабатываем пустой массив, если results не задан
        count:
          action.payload.count ?? state.homeLessonsList?.count ?? 0, // Устанавливаем count или сохраняем предыдущий, если он есть
      };
    },
    setLessonCounter: (state, action: PayloadAction<number>) => {
      state.lessonCounter = action.payload;
    },
    setUserCounter: (state, action: PayloadAction<number>) => {
      state.userCounter = action.payload;
    },
  },
});
export const {
  setActiveTabHome,
  setOpenDoc,
  setOpenProtection,
  setIsOpenList,
  setHomeLessonsList,
  setIsOpenDocList,
  setManualCategory,
  setManualCategoryListOne,
  setOpenCategoryIndex,
  setOptionListHeight,
  setFaqInformation,
  setAppendHomeLessons,
  setLessonCounter,
  setUserCounter,
} = homeSlice.actions;

export default homeSlice.reducer;
