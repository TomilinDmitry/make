import { IMinimalUserData } from "app/types/type";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode"; // Именованный импорт

import { toast } from "react-toastify";

export const getTokenExpiration = (token: string): string | null => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const expirationTime = new Date(
      decoded.exp * 1000,
    ).toLocaleString();
    return expirationTime;
  } catch (error) {
    console.error("Ошибка при декодировании токена:", error);
    return null;
  }
};


export const refreshToken = async (): Promise<any> => {
  const activeAcc = localStorage.getItem("activeAcc");
  if (!activeAcc) {
    console.error("Активный аккаунт не найден");
    window.location.href = "/";
    return null;
  }

  const profilesString = localStorage.getItem("profiles");
  const profiles = profilesString ? JSON.parse(profilesString) : [];

  // Ищем активный профиль по user_id
  const activeProfile = profiles.find(
    (profile: IMinimalUserData) =>
      profile.user_id.toString() === activeAcc,
  );

  if (!activeProfile) {
    console.error("Профиль для активного аккаунта не найден");
    return null;
  }
  const refresh = activeProfile.refreshToken;

  const { data } = await axios.post(
    "https://api.lr45981.tw1.ru/api/v1/token/refresh/",
    {
      refresh,
    },
  );
  const updatedProfiles = profiles.map((profile: any) => {
    if (profile.user_id === activeAcc) {
      return {
        ...profile,
        accessToken: data.access, // Обновляем только активный профиль
      };
    }
    return profile; // Остальные профили оставляем без изменений
  });

  // Сохраняем обновлённый массив profiles обратно в localStorage
  localStorage.setItem("profiles", JSON.stringify(updatedProfiles));

  return data.access; // Возвращаем новый access токен
};

export const isTokenExpired = (token: string): boolean => {
  const decoded: any = jwtDecode(token); // Декодируйте токен
  const currentTime = Date.now() / 1000; // Текущее время в секундах
  return decoded.exp < currentTime; // Сравнивайте с временем истечения токена
};
export const logoutProfile = () => {
  const activeAcc = localStorage.getItem("activeAcc");

  if (!activeAcc) {
    console.error("Активный аккаунт не найден");
    return;
  }

  // Получаем список профилей из localStorage
  const profilesString = localStorage.getItem("profiles");
  const profiles = profilesString ? JSON.parse(profilesString) : [];

  // Удаляем профиль с истёкшими токенами
  const updatedProfiles = profiles.filter(
    (profile: IMinimalUserData) =>
      profile.user_id.toString() !== activeAcc,
  );

  // Обновляем profiles в localStorage
  localStorage.setItem("profiles", JSON.stringify(updatedProfiles));

  if (updatedProfiles.length > 0) {
    // Если остались другие профили, делаем первый из них активным
    const newActiveProfile = updatedProfiles[0];
    // localStorage.setItem(
    //   "userData",
    //   JSON.stringify(newActiveProfile),
    // );
    localStorage.setItem(
      "activeAcc",
      newActiveProfile.user_id.toString(),
    );
    console.log(
      "Установлен новый активный профиль:",
      newActiveProfile,
    );
  } else {
    // Если профилей больше нет, очищаем userData и activeAcc
    localStorage.removeItem("userData");
    localStorage.removeItem("activeAcc");
    console.log("Все профили удалены, userData очищен.");
  }

  // Дополнительно можно очистить токены, если требуется

  localStorage.removeItem("isAuth");
};
export const getAccessToken = (): string | null => {
  const activeAcc = localStorage.getItem("activeAcc");
  const isAuth = localStorage.getItem('isAuth')
  if (!activeAcc && isAuth === "true") {
    console.warn("Активный аккаунт не найден");

    // Удаляем userData, activeAcc и другие данные из localStorage
    // localStorage.removeItem("userData");
    // localStorage.removeItem("activeAcc");
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");
    // localStorage.removeItem("isAuth");

    // Можно также перенаправить пользователя на страницу логина, если нужно:
    // window.location.href = "/login";

    return null;
  }

  // Получаем список профилей
  const profilesString = localStorage.getItem("profiles");
  const profiles = profilesString ? JSON.parse(profilesString) : [];

  // Находим профиль для активного аккаунта
  const activeProfile = profiles.find(
    (profile: IMinimalUserData) =>
      profile.user_id.toString() === activeAcc,
  );

  if (!activeProfile && isAuth === 'true') {
    console.error("Профиль для активного аккаунта не найден");

    // Удаляем userData, activeAcc и другие данные из localStorage
    localStorage.removeItem("userData");
    localStorage.removeItem("activeAcc");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuth");

    // Можно также перенаправить пользователя на страницу логина, если нужно:
    window.location.href = "/login";

    return null;
  }

  // Возвращаем accessToken, если он существует
  return activeProfile.accessToken || null;
};

export const getRefreshToken = (): string | null => {
  const activeAcc = localStorage.getItem("activeAcc");

  if (!activeAcc) {
    console.warn("Активный аккаунт не найден");
    // window.location.href = "/login"
    return null;
  }

  const profilesString = localStorage.getItem("profiles");
  const profiles = profilesString ? JSON.parse(profilesString) : [];

  const activeProfile = profiles.find(
    (profile: IMinimalUserData) =>
      profile.user_id.toString() === activeAcc,
  );

  if (!activeProfile) {
    console.error("Профиль для активного аккаунта не найден");
    // window.location.href = "/login"
    return null;
  }

  return activeProfile.refreshToken || null;
};

export const checkTokens = (): boolean => {
  const accessToken = getAccessToken();
  const refresh = getRefreshToken();

  // Если accessToken существует и истёк
  if (accessToken && isTokenExpired(accessToken)) {
    // Проверяем refreshToken
    if (refresh && !isTokenExpired(refresh)) {
      return true; // Access токен можно обновить
    }
    return false; // Оба токена истекли, требуется logout
  }

  // Если accessToken не истёк или отсутствует
  return true; // Всё в порядке
};
// export const axiosWithRefreshToken = async <T>(
// 	url: string,
// 	options?: AxiosRequestConfig,
// 	data?: any,
// ): Promise<T> => {
// 	if (!checkTokens()) {
// 		// console.log("Токены устарели,нужно зайти еще раз");

// 		logoutProfile()
// 		setTimeout(() => {
// 			toast.error("Токен авторизации устарел")
// 		}, 2000)
// 		return Promise.reject("Не удалось обновить токены")
// 	}

// 	const accessToken = getAccessToken()
// 	options = {
// 		...options,
// 		headers: {
// 			...options?.headers,
// 			Authorization: `Bearer ${accessToken}`,
// 		},
// 	}

// 	try {

// 		const response = await axios(url, options)
// 		return response.data
// 	} catch (error: any) {
// 		if (
// 			// error.response?.status === 401 ||
// 			// (error.response?.status === 400 &&
// 			isTokenExpired(getAccessToken()!)
// 		) {
// 			const refresh = getRefreshToken()
// 			if (refresh && !isTokenExpired(refresh)) {
// 				try {
// 					const newAccessToken = await refreshToken()
// 					const activeAcc = localStorage.getItem("activeAcc")
// 					const profilesString = localStorage.getItem("profiles")
// 					const profiles = profilesString
// 						? JSON.parse(profilesString)
// 						: []

// 					if (activeAcc && profiles.length > 0) {
// 						// Находим активный профиль
// 						const updatedProfiles = profiles.map((profile: any) => {
// 							if (profile.user_id.toString() === activeAcc) {
// 								return { ...profile, accessToken: newAccessToken }
// 							}
// 							return profile
// 						})
// 						console.log(updatedProfiles)
// 						localStorage.setItem(
// 							"profiles",
// 							JSON.stringify(updatedProfiles),
// 						)

// 						options.headers!.Authorization = `Bearer ${newAccessToken}`
// 						const retryResponse = await axios(url, options)
// 						return retryResponse.data
// 					} else {
// 						console.error("Активный аккаунт не найден в профилях.")
// 						throw new Error(
// 							"Не удалось обновить токен активного профиля",
// 						)
// 					}
// 				} catch (refreshError) {
// 					logoutProfile()
// 					console.error("Ошибка при обновлении токена:", refreshError)
// 					window.location.href = "/" // Если обновление токена не удалось, перенаправляем на главную страницу

// 					return Promise.reject("Ошибка обновления токена")
// 				}
// 			} else {
// 				console.error("Рефреш токен устарел")
// 				const activeAcc = localStorage.getItem("activeAcc")
// 				const profilesString = localStorage.getItem("profiles")
// 				const profiles = profilesString
// 					? JSON.parse(profilesString)
// 					: []
// 				const updatedProfiles = profiles.filter(
// 					(profile: any) => profile.user_id.toString() !== activeAcc,
// 				)
// 				if (updatedProfiles.length > 0) {
// 					// Устанавливаем оставшийся аккаунт активным
// 					localStorage.setItem(
// 						"activeAcc",
// 						updatedProfiles[0].user_id.toString(),
// 					)
// 					localStorage.setItem(
// 						"userData",
// 						JSON.stringify(updatedProfiles[0]),
// 					)
// 					localStorage.setItem(
// 						"profiles",
// 						JSON.stringify(updatedProfiles),
// 					)
// 					window.dispatchEvent(new Event("syncUserData"))

// 					// Обновляем состояние пользователя
// 					toast.error(
// 						"Токены для активного аккаунта устарели, переключаем на следующий.",
// 					)
// 					const newAccessToken = updatedProfiles[0].accessToken // Получить новый accessToken из профиля
// 					if (newAccessToken) {
// 						options.headers!.Authorization = `Bearer ${newAccessToken}`
// 						try {
// 							const retryResponse = await axios(url, options)
// 							return retryResponse.data
// 						} catch (retryError) {
// 							console.error(
// 								"Ошибка при повторном запросе:",
// 								retryError,
// 							)
// 							return Promise.reject(retryError)
// 						}
// 					}
// 				} else {
// 					localStorage.clear()
// 					toast.error("Вы не авторизованы")
// 					setTimeout(() => {
// 						window.location.href = "/login" // Перенаправляем на страницу входа
// 					}, 2000)
// 				}
// 				return Promise.reject("Refresh token is expired or missing")
// 			}
// 		}
// 		throw error
// 	}
// }
export const axiosWithRefreshToken = async <T>(
  url: string,
  options?: AxiosRequestConfig,
  data?: any,
): Promise<T> => {
  // Проверяем токены перед выполнением запроса
  if (!checkTokens()) {
    logoutProfile();
    toast.error("Токен авторизации устарел. Войдите заново.");
    window.location.href = "/login";
    return Promise.reject("Не удалось обновить токены");
  }

  let accessToken = getAccessToken();

  if (isTokenExpired(accessToken!)) {
    const refresh = getRefreshToken();

    if (refresh && !isTokenExpired(refresh)) {
      try {
        const newAccessToken = await refreshToken();

        // Сохраняем новый accessToken
        const activeAcc = localStorage.getItem("activeAcc");
        const profilesString = localStorage.getItem("profiles");
        const profiles = profilesString
          ? JSON.parse(profilesString)
          : [];
        console.log(profiles);
        if (activeAcc && profiles.length > 0) {
          const updatedProfiles = profiles.map((profile: any) => {
            if (profile.user_id.toString() === activeAcc) {
              return { ...profile, accessToken: newAccessToken };
            }
            return profile;
          });
          localStorage.setItem(
            "profiles",
            JSON.stringify(updatedProfiles),
          );
          // localStorage.setItem(
          // 	"userData",
          // 	JSON.stringify(updatedProfiles),
          // )

          accessToken = newAccessToken;
        } else {
          console.error("Активный аккаунт не найден в профилях.");
          localStorage.clear();
          throw new Error(
            "Не удалось обновить токен активного профиля",
          );
        }
      } catch (refreshError) {
        logoutProfile();
        toast.error(
          "Ошибка обновления токена. Авторизуйтесь заново.",
        );
        window.location.href = "/login"
        return Promise.reject("Ошибка обновления токена");
      }
    } else {
      console.error("Рефреш токен устарел или отсутствует");
      // handleExpiredRefreshToken();
      return Promise.reject("Refresh token expired or missing");
    }
  }

  options = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response: AxiosResponse<T> = await axios(url, options);
    return response.data;
  } catch (error: any) {
    console.error("Ошибка при выполнении запроса:", error);
    return Promise.reject(error);
  }
};

// Функция для обработки устаревшего рефреш-токена
// const handleExpiredRefreshToken = () => {
//   const activeAcc = localStorage.getItem("activeAcc");
//   const profilesString = localStorage.getItem("profiles");
//   const profiles = profilesString ? JSON.parse(profilesString) : [];

//   const updatedProfiles = profiles.filter(
//     (profile: any) => profile.user_id.toString() !== activeAcc,
//   );
//   console.log(updatedProfiles);
//   if (updatedProfiles.length > 0) {
//     // Переключаемся на следующий аккаунт
//     localStorage.setItem(
//       "activeAcc",
//       updatedProfiles[0].user_id.toString(),
//     );
//     localStorage.setItem(
//       "userData",
//       JSON.stringify(updatedProfiles[0]),
//     );
//     localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
//     window.dispatchEvent(new Event("syncUserData"));
//     toast.error(
//       "Токены для активного аккаунта устарели, переключаем на следующий.",
//     );
//   } else {
//     // Очищаем всё и перенаправляем на страницу входа
//     // localStorage.clear()
//     toast.error("Вы не авторизованы. Пожалуйста, войдите заново.");
//     setTimeout(() => {
//       window.location.href = "/login";
//     }, 2000);
//   }
// };

export const translateText = async (
  texts: string[], // Принимаем массив строк для перевода
  defLanguage = "ru",
  targetLanguage: string,
): Promise<string[]> => {
  try {
    const response = await fetch(
      "https://translate.lr45981.tw1.ru/translate",
      {
        method: "POST",
        body: JSON.stringify({
          q: texts, // Отправляем массив строк
          source: defLanguage,
          target: targetLanguage,
          format: "text",
          alternatives: 0,
        }),
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Предположим, что переводы возвращаются в виде массива
    return data.translatedTexts || texts; // Возвращаем переводы или исходные строки
  } catch (error) {
    console.error("Ошибка при переводе текста:", error);
    return texts; // В случае ошибки возвращаем исходные строки
  }
};
