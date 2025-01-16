import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INavigationModalState } from "app/types/type";

const initialState: INavigationModalState = {
  isModalOpen: false,
  isAuthOpen: false,
};

export const navigationModalSlice = createSlice({
  name: "navigationModal",
  initialState: initialState,
  reducers: {
    setIsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    setIsAuthOpen: (state, action: PayloadAction<boolean>) => {
      state.isAuthOpen = action.payload;
    },
    toggleIsModalOpen: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },

    toggleIsAuthOpen: (state) => {
      state.isAuthOpen = !state.isAuthOpen;
    },
  },
});
export const {
  setIsModalOpen,
  setIsAuthOpen,
  toggleIsAuthOpen,
  toggleIsModalOpen,
} = navigationModalSlice.actions;

export default navigationModalSlice.reducer;
