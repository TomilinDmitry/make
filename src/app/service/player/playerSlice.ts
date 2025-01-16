import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  IGetPlayerIdInitialState,
  IPlayerCommentDataRepliesResults,
  IPlayerCommentState,
  IPlayerDataState,
} from "app/types/type";

const initialState: IGetPlayerIdInitialState = {
  playerData: null,
  playerCommentData: null,
  repliesByCommentId: {},
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayerData: (
      state,
      action: PayloadAction<IPlayerDataState>,
    ) => {
      state.playerData = action.payload;
    },
    setPlayerCommentData: (
      state,
      action: PayloadAction<IPlayerCommentState>,
    ) => {
      state.playerCommentData = action.payload;
    },
    setDefaultStateCommentData: (state) => {
      state.playerCommentData = null;
    },
    setPlayerCommentRepliesData: (
      state,
      action: PayloadAction<{
        commentId: number;
        replies: IPlayerCommentDataRepliesResults[];
      }>,
    ) => {
      const { commentId, replies } = action.payload;
      state.repliesByCommentId[commentId] = replies;
    },
  },
});

export const {
  setPlayerData,
  setPlayerCommentData,
  setPlayerCommentRepliesData,
  setDefaultStateCommentData,
} = playerSlice.actions;

export default playerSlice.reducer;
