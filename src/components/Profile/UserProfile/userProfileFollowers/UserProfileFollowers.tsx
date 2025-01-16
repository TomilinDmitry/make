import { useSelector } from "app/service/hooks/hooks";
import React from "react";
import s from "./style.module.scss";
import { Link } from "react-router-dom";
import { UserCard } from "components/Profile/UserCard/UserCard";
import { UserCardSmall } from "components/Profile/userCardSmall/UserCardSmall";
import { useGetCountersByUserIdsQuery } from "app/api/RTKApi";
export const UserProfileFollowers = () => {
  const { followers } = useSelector((store) => store.profileCard);
  const { userData } = useSelector((store) => store.user);
  const usersId = followers?.results.map((el) => el.user_id);

  const { data: userCounters } = useGetCountersByUserIdsQuery(
    usersId || [],
    {
      skip: !usersId || usersId.length === 0, // Ожидаем, пока usersId не будет заполнен
    },
  );
  const usersWithCounters: Record<string, { total_views: number; count_lessons: number; user_id: string }> = {};

  // Добавляем контракты к каждому пользователю
  if (userCounters) {
    Object.values(userCounters).forEach((counter) => {
      usersWithCounters[counter.user_id] = counter;
    });
  }
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        {followers?.results.map((user, index) => {
          const counter = usersWithCounters[user.user_id] || {
            count_lessons: 0,
            total_views: 0,
          };
          return (
            <div className={s.box} key={user.user_id}>
              <div className={s.user}>
                <Link
                  to={
                    user.user_id === userData?.user_id
                      ? "/profile"
                      : `/profile/${user.user_id}`
                  }>
                  <UserCard userData={user} counter={counter} />
                </Link>
              </div>
              <div className={s.userSmall}>
                <Link
                  to={
                    user.user_id === userData?.user_id
                      ? "/profile"
                      : `/profile/${user.user_id}`
                  }>
                  <UserCardSmall
                    userData={user}
                    totalViews={counter.total_views}
                    countLessons={counter.count_lessons}
                  />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
