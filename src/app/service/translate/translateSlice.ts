import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { ITranslateState } from "../../types/type";

const initialState: ITranslateState = {
  translatedName: {},
  translatedLocation: {},
  translatedDescription: {},
  translatedVideoName: {},
};

export const transletedSlice = createSlice({
  name: "translatedSlice",
  initialState,
  reducers: {
    setTranslatedName: (
      state,
      action: PayloadAction<{
        id: number;
        translate: string;
      }>,
    ) => {
      const { id, translate } = action.payload;
      state.translatedName[id] = translate;
    },
    setTranslatedLocation: (
      state,
      action: PayloadAction<{
        id: number;
        translate: string;
      }>,
    ) => {
      const { id, translate } = action.payload;
      state.translatedLocation[id] = translate;
    },
    setTranslatedVideoName: (
      state,
      action: PayloadAction<{
        id: number;
        translate: string;
      }>,
    ) => {
      const { id, translate } = action.payload;
      state.translatedVideoName[id] = translate;
    },
    setTranslatedDescription: (
      state,
      action: PayloadAction<{
        id: number;
        translate: string;
      }>,
    ) => {
      const { id, translate } = action.payload;
      state.translatedDescription[id] = translate;
    },
  },
});

export const {
  setTranslatedName,
  setTranslatedLocation,
  setTranslatedVideoName,
  setTranslatedDescription,
} = transletedSlice.actions;

export default transletedSlice.reducer;
