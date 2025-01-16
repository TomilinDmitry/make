import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  IGetUserData,
  IMinimalUserData,
  ISearchData,
  IUser,
} from "../../types/type";
import type { RootState } from "../store";

interface IUserState {
  user: IUser | null;
  isAuth: boolean;
  userData: IGetUserData | null;
  userSearchData: ISearchData[] | null;
  minimalUserData: IMinimalUserData | null;
}
const profiles = JSON.parse(localStorage.getItem("profiles") || "[]");
const activeAcc = JSON.parse(
  localStorage.getItem("activeAcc") || "null",
);
const initialState: IUserState = {
  user: null,
  isAuth: localStorage.getItem("isAuth") === "true",
  userData: activeAcc
    ? profiles?.find(
        (profile: IMinimalUserData) => profile.user_id === activeAcc,
      )
    : null,
  userSearchData: null,
  minimalUserData: activeAcc
    ? profiles?.find(
        (profile: IMinimalUserData) => profile.user_id === activeAcc,
      )
    : null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuth = true;
      localStorage.setItem("isAuth", "true");
    },
    logout: (state) => {
      state.isAuth = false;
      state.user = null;
      state.userData = null;
      state.minimalUserData = null;
      localStorage.setItem("isAuth", "false");
    },
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setUserData: (state, action: PayloadAction<IGetUserData>) => {
      state.userData = action.payload;
    },
    setUpdateUserPhoto(state, action: PayloadAction<string>) {
      if (state.userData?.photo) {
        state.userData.photo = action.payload;
      }
    },
    setMinimalUserData: (
      state,
      action: PayloadAction<IMinimalUserData>,
    ) => {
      state.minimalUserData = action.payload;
      // localStorage.setItem(
      //   "userData",
      //   JSON.stringify(action.payload),
      // ); // Сохраняем данные в localStorage
      localStorage.setItem(
        "activeAcc",
        JSON.stringify(action.payload.user_id),
      ); // Сохраняем данные в localStorage
    },
    setUpdateMinimalUserPhoto(state, action: PayloadAction<string>) {
      if (state.minimalUserData) {
        state.minimalUserData.photo = action.payload;
      }
    },
    setUserSearchData: (
      state,
      action: PayloadAction<ISearchData[]>,
    ) => {
      state.userSearchData = action.payload;
    },
    setСlearSearchData: (state) => {
      state.userSearchData = null;
    },
  },
});

export const {
  login,
  logout,
  setUserData,
  setUserSearchData,
  setIsAuth,
  setMinimalUserData,
  setUpdateUserPhoto,
  setUpdateMinimalUserPhoto,
  setСlearSearchData,
} = userSlice.actions;

export const selectCount = (state: RootState) => state.user;

export default userSlice.reducer;
