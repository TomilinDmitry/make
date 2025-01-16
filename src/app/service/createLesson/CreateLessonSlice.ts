// burgerProfilesSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICreateLessonState, IGetStatus } from "app/types/type";

const initialState: ICreateLessonState = {
  nameLesson: null,
  descriptionLesson: null,
  videoDuration: null,
  imageSrc: null,
  imageFile: null,
  voiceGender: "female",
  lessonLoadLink: null,
  videoSize: null,
  videoSrc: null,
  videoFile: null,
  currentStep: 1,
  videoStatus: null,
  markUploaded: false,
  isLoad: false,
  published: false,
  is_public: false,
};

export const createLessonSlice = createSlice({
  name: "createLesson",
  initialState,
  reducers: {
    setIsPublic: (state, action: PayloadAction<boolean>) => {
      state.is_public = action.payload;
    },
    setPublished: (state, action: PayloadAction<boolean>) => {
      state.published = action.payload;
    },
    setNameLesson: (state, action: PayloadAction<string>) => {
      state.nameLesson = action.payload;
    },

    setDescriptionLesson: (state, action: PayloadAction<string>) => {
      state.descriptionLesson = action.payload;
    },

    setVideoDuration: (state, action: PayloadAction<number>) => {
      state.videoDuration = action.payload;
    },
    setVideoSize: (state, action: PayloadAction<number>) => {
      state.videoSize = action.payload;
    },
    setImageSrc: (state, action: PayloadAction<string>) => {
      state.imageSrc = action.payload;
    },
    setVideoSrc: (state, action: PayloadAction<string>) => {
      state.videoSrc = action.payload;
    },
    setProgress: (state, action: PayloadAction<IGetStatus>) => {
      state.videoStatus = action.payload;
    },
    setLessonLoadLink: (state, action: PayloadAction<string>) => {
      state.lessonLoadLink = action.payload;
    },
    setVoiceGender: (
      state,
      action: PayloadAction<"male" | "female">,
    ) => {
      state.voiceGender = action.payload;
    },

    setVideoFile: (state, action: PayloadAction<File>) => {
      state.videoFile = action.payload;
    },
    setImageFile: (state, action: PayloadAction<File>) => {
      state.imageFile = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<1 | 2 | 3>) => {
      state.currentStep = action.payload;
    },
    setUpload: (state, action: PayloadAction<boolean>) => {
      state.markUploaded = action.payload;
    },
    setIsLoad: (state, action: PayloadAction<boolean>) => {
      state.isLoad = action.payload;
    },

    setClearVideo: (state) => {
      state.videoDuration = null;
      state.videoSize = null;
      state.videoSrc = null;
      state.videoFile = null;
    },
    setClearImage: (state) => {
      state.imageFile = null;
      state.imageSrc = null;
    },
  },
});

export const {
  setNameLesson,
  setDescriptionLesson,
  setImageSrc,
  setVideoDuration,
  setProgress,
  setVoiceGender,
  setLessonLoadLink,
  setVideoSize,
  setCurrentStep,
  setVideoSrc,
  setClearVideo,
  setVideoFile,
  setUpload,
  setIsLoad,
  setImageFile,
  setClearImage,
  setIsPublic,
  setPublished
} = createLessonSlice.actions;

export default createLessonSlice.reducer;
