import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBurgerState, IMinimalUserData } from "app/types/type";

const initialState: IBurgerState = {
  profiles: JSON.parse(
    localStorage.getItem("profiles") || "[]",
  ) as IMinimalUserData[],
  activeProfile: localStorage.getItem("activeAcc")
    ? JSON.parse(localStorage.getItem("activeAcc") as string)
    : null,
};

export const burgerProfilesSlice = createSlice({
  name: "burgerProfiles",
  initialState,
  reducers: {
    addProfile: (state, action: PayloadAction<IMinimalUserData>) => {
      const profileExists = state.profiles.some(
        (profile) => profile.user_id === action.payload.user_id,
      );

      if (!profileExists) {
        // Получаем токены из localStorage для данного профиля
        const accessToken = localStorage.getItem(`accessToken`);
        const refreshToken = localStorage.getItem(`refreshToken`);

        // Создаём новый профиль с токенами
        const newProfile = {
          ...action.payload,
          accessToken: accessToken || "", // Подставляем пустую строку, если токена нет
          refreshToken: refreshToken || "", // Подставляем пустую строку, если токена нет
        };

        // Добавляем профиль в массив
        state.profiles.push(newProfile);

        // Сохраняем обновлённый массив профилей в localStorage
        localStorage.setItem(
          "profiles",
          JSON.stringify(state.profiles),
        );
      }
    },
    setActiveProfile: (state, action: PayloadAction<string>) => {
      state.activeProfile = action.payload;
      localStorage.setItem("activeAcc", action.payload);
    },
    setProfiles(state, action: PayloadAction<IMinimalUserData[]>) {
      state.profiles = action.payload; // Обновляем профили в Redux
      localStorage.setItem(
        "profiles",
        JSON.stringify(state.profiles),
      ); // Сохраняем их в localStorage
    },
    setUpdateProfilePhoto(
      state,
      action: PayloadAction<{ user_id: string; photo: string }>,
    ) {
      const { user_id, photo } = action.payload;

      // Обновление конкретного профиля
      state.profiles = state.profiles.map(
        (profile) =>
          profile.user_id.toString() === user_id.toString()
            ? { ...profile, photo: photo } // Обновляем фото
            : profile, // Остальные профили остаются без изменений
      );

      // Сохранение в localStorage
      localStorage.setItem(
        "profiles",
        JSON.stringify(state.profiles),
      );
    },
  },
});

export const {
  addProfile,
  setActiveProfile,
  setProfiles,
  setUpdateProfilePhoto,
} = burgerProfilesSlice.actions;
export default burgerProfilesSlice.reducer;
