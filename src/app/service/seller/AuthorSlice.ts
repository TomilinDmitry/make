// burgerProfilesSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthorState, IConditionsState } from "app/types/type";

const initialState: IAuthorState = {
  gb: 20,
  minutes: 300,
  openOffer: false,
};

export const authorSlice = createSlice({
  name: "author",
  initialState,
  reducers: {
    setMinutes: (state, action: PayloadAction<number>) => {
      state.minutes = action.payload;
    },

    setGb: (state, action: PayloadAction<number>) => {
      state.gb = action.payload;
    },
    setOpenOffer: (state, action: PayloadAction<boolean>) => {
      state.openOffer = action.payload;
    },
  },
});

export const { setGb, setMinutes,setOpenOffer } = authorSlice.actions;

export default authorSlice.reducer;
