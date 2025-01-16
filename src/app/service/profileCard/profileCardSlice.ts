import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  IAccessControlState,
  ICounter,
  IFollowers,
  IGetMyProfileCounter,
  IInitialStateProfileCard,
  ILessonsState,
  IProfileData,
} from "../../types/type";

const initialState: IInitialStateProfileCard = {
  isEditing: false,
  isSaving: false,
  description: "",
  profileData: null,
  subscribe: false,
  followers: null,
  following: null,
  counter: null,
  myProfileCounter: null,
  openPublished: false,
  openCreateModal: false,
  boughtVideo: null,
  offsets: {},
  typeUser: { type: "user", m: 0, gb: 0 },
  accessControl: null,
};

export const profileCardSlice = createSlice({
  name: "profileCard",
  initialState,
  reducers: {
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setBoughtVideo: (state, action: PayloadAction<ILessonsState>) => {
      state.boughtVideo = action.payload;
    },
    setAccessControl: (
      state,
      action: PayloadAction<IAccessControlState>,
    ) => {
      state.accessControl = action.payload;
    },

    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setActiveButton: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setSubscribe: (state, action: PayloadAction<boolean>) => {
      state.subscribe = action.payload;
    },
    setFollowers: (state, action: PayloadAction<IFollowers>) => {
      state.followers = action.payload;
    },
    setFollowing: (state, action: PayloadAction<IFollowers>) => {
      state.following = action.payload;
    },
    setCounter: (state, action: PayloadAction<ICounter[]>) => {
      state.counter = action.payload;
    },
    setPublishedOpen: (state, action: PayloadAction<boolean>) => {
      state.openPublished = action.payload;
    },
    setCounterMyProfile: (
      state,
      action: PayloadAction<IGetMyProfileCounter>,
    ) => {
      state.myProfileCounter = action.payload;
    },
    setOpenCreateModal: (state, action: PayloadAction<boolean>) => {
      state.openCreateModal = action.payload;
    },
    setProfileData: (state, action: PayloadAction<IProfileData>) => {
      state.profileData = action.payload;
    },
    setTypeUser: (
      state,
      action: PayloadAction<{ type: string; m: number; gb: number }>,
    ) => {
      state.typeUser = action.payload;
    },
    setOffset: (
      state,
      action: PayloadAction<{ userId: string; offset: number }>,
    ) => {
      state.offsets[action.payload.userId] = action.payload.offset;
    },
    resetOffset: (state, action: PayloadAction<string>) => {
      delete state.offsets[action.payload]; // Удаляем offset для текущего userId
    },
    resetFollowers(state) {
      state.followers = null;
    },
    resetFollowing(state) {
      state.following = null;
    },
  },
});

export const {
  setIsEditing,
  setIsSaving,
  setDescription,
  setActiveButton,
  setProfileData,
  setSubscribe,
  setFollowers,
  setFollowing,
  setCounter,
  setCounterMyProfile,
  setPublishedOpen,
  setOpenCreateModal,
  setBoughtVideo,
  setOffset,
  resetOffset,
  resetFollowers,
  resetFollowing,
  setTypeUser,
  setAccessControl,
} = profileCardSlice.actions;

export default profileCardSlice.reducer;
