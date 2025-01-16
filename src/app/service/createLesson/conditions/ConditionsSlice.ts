// burgerProfilesSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ICondition,
  IConditionsState,
  ICreateLessonState,
  IGetStatus,
} from "app/types/type";

const initialState: IConditionsState = {
  conditions: [{ text: "", link: "", isOpen: false }],
};

export const conditionSlice = createSlice({
  name: "conditions",
  initialState,
  reducers: {
    addCondition: (state) => {
      state.conditions.push({ text: "", link: "", isOpen: false });
    },
    removeCondition: (state, action: PayloadAction<number>) => {
      state.conditions = state.conditions.filter(
        (_, i) => i !== action.payload,
      );
    },
    updateCondition: (
      state,
      action: PayloadAction<{
        index: number;
        key: "text" | "link";
        value: string;
      }>,
    ) => {
      const { index, key, value } = action.payload;
      state.conditions[index][key] = value;
    },
    toggleCondition: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.conditions[index].isOpen =
        !state.conditions[index].isOpen;
    },
    setConditions: (state, action: PayloadAction<ICondition[]>) => {
      state.conditions = action.payload;
    },
  },
});

export const {
  addCondition,
  removeCondition,
  updateCondition,
  toggleCondition,
  setConditions
} = conditionSlice.actions;

export default conditionSlice.reducer;
