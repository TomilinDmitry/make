import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { IHeaderState } from "../../types/type";
import type { RootState } from "../store";

const initialState: IHeaderState = {
  activeLink: null,
  language: localStorage.getItem("language")
    ? (localStorage.getItem("language") as string)
    : "EN",
  isModalOpen: false,
  isArrowUp: false,
};

export const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setActiveLink: (state, action: PayloadAction<string>) => {
      state.activeLink = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },

    setIsArrowUp: (state, action: PayloadAction<boolean>) => {
      state.isArrowUp = action.payload;
    },
  },
});

export const { setActiveLink, setLanguage, setIsArrowUp } =
  headerSlice.actions;

export const selectCount = (state: RootState) => state.header;

export default headerSlice.reducer;
