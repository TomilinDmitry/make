import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import authSlice from "./auth/authSlice";
import profileCardSlice from "./profileCard/profileCardSlice";
import headerSlice from "./header/headerSlice";
import lessonsSlice from "./lessons/lessonsSlice";
import usersSlice from "./users/UsersSlice";
import playerSlice from "./player/playerSlice";
import HomeSlice from "./home/HomeSlice";
import burgerProfilesSlice from "./burgerProfiles/burgerSlice";
import createLessonSlice from "./createLesson/CreateLessonSlice";
import navigationModalSlice from "./navigationModals/NavigationModalsSlice";
import translatedSlice from "./translate/translateSlice";
import { api, countersApi } from "app/api/RTKApi";
import conditionSlice from "./createLesson/conditions/ConditionsSlice";
import  authorSlice  from "./seller/AuthorSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authSlice,
    profileCard: profileCardSlice,
    header: headerSlice,
    lessons: lessonsSlice,
    users: usersSlice,
    player: playerSlice,
    home: HomeSlice,
    burgerProfiles: burgerProfilesSlice,
    createLesson: createLessonSlice,
    navigationModal: navigationModalSlice,
    translated: translatedSlice,
    conditions: conditionSlice,
    author:authorSlice,
    [api.reducerPath]: api.reducer,
    [countersApi.reducerPath]: countersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["createLesson/setVideoFile"], // Игнорируем конкретное действие
        ignoredPaths: ["createLesson.videoFile"], // Игнорируем путь в состоянии
      },
    }).concat(api.middleware,countersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
