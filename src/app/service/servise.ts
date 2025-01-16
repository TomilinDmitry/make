import { toast } from "react-toastify";
import { instance, instanceRegistration } from "../api/api";
import {
  IConfirm,
  IResponseUser,
  IResponseUserData,
  IUser,
  IUserData,
} from "../types/type";

export const AuthService = {
  async registration(
    userData: IUserData,
  ): Promise<IResponseUserData | undefined> {
    try {
      const { data } = await instanceRegistration.post<
        IUserData,
        { data: IResponseUserData }
      >("api/v1/user/create/", userData);

      return data;
    } catch (error: any) {
      console.error("Ошибка при создании пользователя:", error);
      return undefined; // Возвращаем undefined при ошибке
    }
  },

  async login(userData: IUser): Promise<IResponseUser | undefined> {
    const { data } = await instance.post<IResponseUser>(
      "api/v1/token/create/",
      userData,
    );

    return data;
  },
};
export const confirmEmail = {
  async confirm(userData: IConfirm): Promise<any | undefined> {
    const response = await instanceRegistration.post<any>(
      "api/v1/user/activate/",
      userData,
    );
    return response;
  },
  async resend(): Promise<void> {
    const email = localStorage.getItem("email");
    const lang = localStorage.getItem("language")?.toLowerCase();
    if (!email) {
      throw new Error("Email не найден в localStorage");
    }
    await instanceRegistration.post(
      "api/v1/user/resend_activation/",
      { email, lang },
    );
  },
};
export const resetPassword = {
  async email(email: string): Promise<any | undefined> {
    await instanceRegistration.post<string>(
      "api/v1/user/reset_password/",
      { email: email },
    );
  },
  async change(
    token: string,
    uid: string,
    password: string,
  ): Promise<any | undefined> {
    if (token && uid && password) {
      try {
        await instanceRegistration.post(
          "api/v1/user/confirm_password/",
          { uid: uid, token: token, new_password: password },
        );
      } catch (e) {
        // toast.error(e.response.data.new_password.map((el) => el));
        const error = e.response.data.new_password.map((el) => el);
        error.forEach((error: string) => {
          toast.error(error); // Используем toast.error для отображения ошибок
        });
      }
    } else {
      toast.error("Нe были предоставленны нужные данные");
    }
  },
};
