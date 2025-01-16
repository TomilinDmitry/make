import React, { useEffect, useState } from "react";
import s from "./accessControl.module.scss";
import calendar from "../../../../app/assets/accessConrol/calendar.svg";
import clock from "../../../../app/assets/accessConrol/clock.svg";
import openIcon from "../../../../app/assets/accessConrol/openIcon.svg";
import redCross from "../../../../app/assets/accessConrol/redCross.svg";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { Open } from "./status/Open";
import { Close } from "./status/Close";
import { Proccesing } from "./status/Proccesing";
import { useNavigate } from "react-router";
import { useGetUsersProfileListQuery } from "app/api/RTKApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { getAccessControl, setNewStatus } from "app/api/apiProfile";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Импорт стилей для календаря
import { toast } from "react-toastify";
import { LessonSkeleton } from "components/LessonsUi/LessonSkeleton/LessonSkeleton";

export const AccessСontrol = () => {
  const { accessControl } = useSelector((state) => state.profileCard);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<number | null>(
    null,
  );
  const dispatch = useDispatch();
  const handleDateChange = async (id: number) => {
    if (selectedDate) {
      const isoDate = selectedDate.toISOString();

      await setNewStatus(id, true, isoDate)
        .then(async (res) => {
          // Закрываем календарь после успешного ответа
          setShowDatePicker(null);
          toast.success(
            `Предоставлен доступ до ${selectedDate.toLocaleString()}`,
          );
          await getAccessControl(dispatch);
        })
        .catch((err) => {
          console.error("Error sending request:", err);
        });
    }
  };
  function formatToLocalTime(dateString: string): string {
    // Создаем объект даты из переданной строки
    const date = new Date(dateString);
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }

    // Получаем компоненты локального времени
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Форматируем строку в нужном формате
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
  const navigate = useNavigate();

  const [userIds, setUserIds] = useState<string | null>(null);

  useEffect(() => {
    if (accessControl?.results) {
      const ids = accessControl.results
        .map((item) => item.user_id)
        .join(",");
      setUserIds(ids);
    }
  }, [accessControl]);
  const { data } = useGetUsersProfileListQuery(
    userIds ? { ids: userIds } : skipToken,
    {
      skip: !userIds,
    },
  );
  const findUserById = (userId: number) => {
    return data?.find((user: any) => user.user_id === userId);
  };
  const setCloseStatus = async (id: number) => {
    await setNewStatus(id, false);
    await getAccessControl(dispatch);
  };
  return (
    <>
      {accessControl?.results.length ? (
        <table className={s.table}>
          <thead>
            <tr className={s.tableHeader}>
              <th className={s.headerElement}>Номер заказа</th>
              <th className={s.headerElement}>Наименование</th>
              <th className={s.headerElement}>Пользователь</th>
              <th className={s.headerElement}>Статус</th>
              <th className={s.headerElement}>Доступ</th>
              <th className={s.headerElement}>Дата</th>
              <th className={s.headerElement}>Доступ</th>
            </tr>
          </thead>
          <tbody>
            {accessControl?.results.map((el) => {
              const user = findUserById(el.user_id);
              return (
                <tr className={s.row} key={el.id}>
                  <th className={s.cell}>{el.id}</th>
                  <th
                    className={s.cell}
                    onClick={() =>
                      navigate(`/lesson/${el.media_id}`)
                    }>
                    {el.title}
                  </th>
                  <th
                    className={s.cell}
                    onClick={() =>
                      navigate(`/profile/${user?.user_id}`)
                    }>
                    {" "}
                    {user
                      ? `${user.first_name} ${user.last_name}`
                      : "Неизвестный пользователь"}
                  </th>
                  <th className={s.cell}>
                    {el.status === true ? (
                      <Open />
                    ) : el.status === false ? (
                      <Close />
                    ) : el.status === null ? (
                      <Proccesing />
                    ) : (
                      ""
                    )}
                  </th>
                  <th className={s.cell}>
                    До {formatToLocalTime(el.access_until)}
                  </th>
                  <th className={s.cell}>
                    {" "}
                    {formatToLocalTime(el.created_at)}
                  </th>
                  <th className={s.cell}>
                    <div className={s.access}>
                      <img
                        onClick={() => setCloseStatus(el.media_id)}
                        src={redCross}
                        alt='redCrossIcon'
                        title='Запретить доступ'
                      />
                      <span className={s.line}></span>
                      <img
                        src={calendar}
                        alt='calendarIcon'
                        title='Доступ на время'
                        onClick={() =>
                          setShowDatePicker((prev) =>
                            prev === el.media_id ? null : el.media_id,
                          )
                        } // Показать календарь
                        style={{ cursor: "pointer" }}
                      />
                      {showDatePicker === el.media_id && (
                        <div className={s.calendar}>
                          <DatePicker
                            inline // Встраивает календарь без текстового поля
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)} // Сохраняем выбранную дату в состоянии
                            showTimeSelect // Добавляем выбор времени
                            timeFormat='HH:mm'
                            timeIntervals={15}
                            dateFormat='dd.MM.yyyy HH:mm'
                          />
                          <div
                            style={{
                              marginTop: "10px",
                              textAlign: "center",
                            }}>
                            <button
                              onClick={() =>
                                handleDateChange(el.media_id)
                              } // Отправка выбранной даты
                              className={s.button}>
                              Применить
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <LessonSkeleton text='Заказов не найдено' />
      )}
    </>
  );
};
