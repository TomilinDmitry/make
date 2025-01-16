import { FC, useEffect, useState } from "react";
import { User } from "./User";
import styles from "./Users.module.scss";
// Import image
import { Link } from "react-router-dom";
import {
  getUsers,
  getUsersSearchByNameAndLocation,
  getUsersWithOutToken,
  getUsersWithOutVideo,
  getUsersWithOutVideoAndToken,
} from "app/api/apiUsers";

import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  getUsersProfileList,
  getUsersProfileListWithOutToken,
} from "app/api/apiLessons";
import { IGetUsersInitialState } from "app/types/type";
import { Loading } from "components/Loading/Loading";
import { UserCardSmall } from "components/Profile/userCardSmall/UserCardSmall";
import { VoiceInput } from "components/VoiceInput/VoiceInput";
import { useTranslation } from "react-i18next";

export const Users: FC = () => {
  const { isAuth, userData, userSearchData } = useSelector(
    (store) => store.user,
  );
  const { usersProfilesUsersPage } = useSelector(
    (store) => store.lessons,
  );
  const { maxViewsUsers, withOutVideoUsers } = useSelector(
    (state) => state.users,
  );
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const [text, setText] = useState<string>(""); // Состояние для текста
  const [isListening, setIsListening] = useState<boolean>(false); // Состояние для отслеживания записи\
  // Имя
  const [inputName, setInputName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [translatedUsers, setTranslatedUsers] = useState<any>([]);
  // Функция для разделения имени и фамилии
  const splitNameIntoParts = (value: string) => {
    const nameParts = value.trim().split(" "); // Разделяем текст по пробелу
    setFirstName(nameParts[0] || ""); // Первое слово — имя
    setLastName(nameParts[1] || ""); // Второе слово — фамилия (если есть)
  };

  // Логика обработки распознанного текста при isListening
  useEffect(() => {
    if (text) {
      splitNameIntoParts(text); // Если слушаем и текст доступен, разделяем его
      setInputName(text); // Обновляем текстовое поле
      handleSearch();
    }
  }, [isListening, text]);

  // // Страна
  const [inputValue, setInputValue] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (maxViewsUsers && withOutVideoUsers) return;
    const fetchData = async () => {
      if (isAuth) {
        setLoading(true);
        await getUsers(dispatch);
        await getUsersWithOutVideo(dispatch);
        setLoading(false);
      } else {
        setLoading(true);
        await getUsersWithOutToken(dispatch);
        await getUsersWithOutVideoAndToken(dispatch);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, isAuth]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!loading && maxViewsUsers?.results) {
        const uniqueUserIds = new Set<number>();
        maxViewsUsers.results.forEach(
          (user: IGetUsersInitialState) => {
            uniqueUserIds.add(user?.user_id!);
          },
        );
        const userIdArray = Array.from(uniqueUserIds);
        // if (userIdArray.length === 0) return
        const idsString = userIdArray.join(",");
        if (isAuth) {
          getUsersProfileList(dispatch, idsString, "users");
        } else {
          getUsersProfileListWithOutToken(
            dispatch,
            idsString,
            "users",
          );
        }
      }
    };
    fetchProfiles();
  }, [loading, dispatch, isAuth, maxViewsUsers?.results]);

  // Map для данных о просмотрах
  const viewsMap = maxViewsUsers?.results?.reduce((acc, item) => {
    acc[item.user_id] = {
      total_views: item.total_views,
      count_lessons: item.count_lessons,
    };
    return acc;
  }, {} as Record<number, { total_views: number; count_lessons: number }>);
  const combinedUsers = [
    ...(usersProfilesUsersPage || []),
    ...(withOutVideoUsers?.results || []),
  ];
  const sortedCombinedUsers = combinedUsers
    .slice() // Создаем копию массива, чтобы не мутировать исходный
    .sort((a, b) => {
      const viewsA = viewsMap?.[a.user_id]?.total_views || 0; // Берем количество просмотров для пользователя A
      const viewsB = viewsMap?.[b.user_id]?.total_views || 0; // Берем количество просмотров для пользователя B

      return viewsB - viewsA; // Сортируем по убыванию просмотров
    });
  // useEffect(() => {
  // 	const translateAllUsers = async () => {
  // 		if (combinedUsers.length > 0) {
  // 			// Собираем все данные для перевода
  // 			const usersToTranslate = combinedUsers.map((user) => ({
  // 				user,
  // 				name: `${user.first_name} ${user.last_name}`,
  // 				location: `${user.country}, ${user.city}`,
  // 			}))
  // 			const textsToTranslate = usersToTranslate.flatMap((item) => [
  // 				item.name,
  // 				item.location,
  // 			])
  // 			console.log(textsToTranslate)
  // 			// Выполняем перевод
  // 			const translations = await translateText(
  // 				textsToTranslate,
  // 				"ru",
  // 				"en", // Замените на нужный язык
  // 			)

  // 			// Разбиваем переводы и сохраняем их для каждого пользователя
  // 			let index = 0
  // 			const translatedData = usersToTranslate.map((item) => ({
  // 				...item.user, // Сохраняем оригинальные данные пользователя
  // 				translatedName: translations[index++], // Перевод имени
  // 				translatedLocation: translations[index++], // Перевод местоположения
  // 			}))

  // 			setTranslatedUsers(translatedData)
  // 		}
  // 	}

  // 	translateAllUsers()
  // }, [combinedUsers])
  // console.log(translatedUsers)

  const handleSearch = () => {
    // Выполнение запроса с переданными параметрами
    getUsersSearchByNameAndLocation(
      dispatch,
      // country || undefined, // передаем country, если оно не пустое
      city || undefined, // передаем city, если оно не пустое
      firstName || undefined, // передаем firstName, если оно не пустое
      lastName || undefined, // передаем secondName, если оно не пустое
    );
  };
  return (
    <div className={styles.container_users}>
      {!maxViewsUsers?.results && !withOutVideoUsers?.results && loading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.inputs_container}>
            <VoiceInput type='name' />
            <div className={styles.searchLocation}>
              <VoiceInput type='location' />
            </div>
          </div>
          <div className={styles.users_box}>
            {userSearchData === null ? (
              // Если inputValue или inputName пусто, показываем combinedUsers
              sortedCombinedUsers.length > 0 ? (
                sortedCombinedUsers.map((el: any, index: number) => {
                  const userViewsData =
                    viewsMap && viewsMap[el?.user_id]
                      ? viewsMap[el?.user_id]
                      : { total_views: 0, count_lessons: 0 };

                  return (
                    <Link
                      to={
                        el.user_id === userData?.user_id
                          ? `/profile`
                          : `/profile/${el.user_id}`
                      }
                      key={index}>
                      <User
                        userData={el}
                        totalViews={userViewsData.total_views}
                        countLessons={userViewsData.count_lessons}
                      />
                    </Link>
                  );
                })
              ) : (
                <div>{t("userPage.notFoundUser")}</div>
              )
            ) : // Если есть результат поиска, показываем его
            userSearchData !== null && userSearchData.length > 0 ? (
              userSearchData.map((el, index) => {
                const userViewsData =
                  viewsMap && viewsMap[el?.user_id]
                    ? viewsMap[el?.user_id]
                    : { total_views: 0, count_lessons: 0 };

                return (
                  <Link
                    to={
                      el.user_id === userData?.user_id
                        ? `/profile`
                        : `/profile/${el.user_id}`
                    }
                    key={index}>
                    <User
                      userData={el}
                      totalViews={userViewsData.total_views}
                      countLessons={userViewsData.count_lessons}
                    />
                  </Link>
                );
              })
            ) : (
              <div>{t("userPage.notFoundUser")}</div>
            )}
          </div>

          <div className={styles.users_boxSmallCard}>
            {userSearchData === null ? (
              // Если inputValue или inputName пусто, показываем combinedUsers
              sortedCombinedUsers.length > 0 ? (
                sortedCombinedUsers.map((el, index) => {
                  const userViewsData =
                    viewsMap && viewsMap[el?.user_id]
                      ? viewsMap[el?.user_id]
                      : { total_views: 0, count_lessons: 0 };

                  return (
                    <Link
                      to={
                        el.user_id === userData?.user_id
                          ? `/profile`
                          : `/profile/${el.user_id}`
                      }
                      key={index}>
                      <UserCardSmall
                        userData={el}
                        totalViews={userViewsData.total_views}
                        countLessons={userViewsData.count_lessons}
                      />
                    </Link>
                  );
                })
              ) : (
                <div>{t("userPage.notFoundUser")}</div>
              )
            ) : // Если есть результат поиска, показываем его
            userSearchData !== null ? (
              userSearchData.map((el, index) => {
                const userViewsData =
                  viewsMap && viewsMap[el?.user_id]
                    ? viewsMap[el?.user_id]
                    : { total_views: 0, count_lessons: 0 };

                return (
                  <Link
                    to={
                      el.user_id === userData?.user_id
                        ? `/profile`
                        : `/profile/${el.user_id}`
                    }
                    key={index}>
                    <UserCardSmall
                      userData={el}
                      totalViews={userViewsData.total_views}
                      countLessons={userViewsData.count_lessons}
                    />
                  </Link>
                );
              })
            ) : (
              <div>{t("userPage.notFoundUser")}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
