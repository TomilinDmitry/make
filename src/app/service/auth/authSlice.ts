import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { IInitialStateAuth } from "../../types/type";

const initialState: IInitialStateAuth = {
  email: "",
  telegram: "",
  password: "",
  confirmPassword: "",
  isLogin: true,
  isConfirmEmail: false,
  isChecked: false,
  whatsapp: "",
  isSendEmail: false,
  seconds: 0,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setWhatsapp: (state, action: PayloadAction<string>) => {
      state.whatsapp = action.payload;
    },
    setTelegram: (state, action: PayloadAction<string>) => {
      state.telegram = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    setIsConfirmEmail: (state, action: PayloadAction<boolean>) => {
      state.isConfirmEmail = action.payload;
    },
    setIsChecked: (state, action: PayloadAction<boolean>) => {
      state.isChecked = action.payload;
    },
    setIsSendEmail: (state, action: PayloadAction<boolean>) => {
      state.isSendEmail = action.payload;
    },
    setSeconds: (state, action: PayloadAction<number>) => {
      state.seconds = action.payload;
    },
  },
});

export const {
  setEmail,
  setTelegram,
  setPassword,
  setConfirmPassword,
  setIsLogin,
  setIsConfirmEmail,
  setIsChecked,
  setWhatsapp,
  setIsSendEmail,
  setSeconds,
} = authSlice.actions;

export default authSlice.reducer;
