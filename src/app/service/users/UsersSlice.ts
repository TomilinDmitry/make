import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  IGetUsers,
  IGetUsersWithOutVideo,
  IUsersInitialState,
} from "app/types/type";

const initialState: IUsersInitialState = {
  maxViewsUsers: null,
  withOutVideoUsers: null,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setMaxViewsUsers: (state, action: PayloadAction<IGetUsers>) => {
      state.maxViewsUsers = action.payload;
    },
    setWithOutVideoUsers: (
      state,
      action: PayloadAction<IGetUsersWithOutVideo>,
    ) => {
      state.withOutVideoUsers = action.payload;
    },
  },
});

export const { setMaxViewsUsers, setWithOutVideoUsers } =
  usersSlice.actions;

export default usersSlice.reducer;
