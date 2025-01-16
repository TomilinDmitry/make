import React, { useState } from "react";
import s from "./style.module.scss";
import rightArrow from "../../../app/assets/events/rightArrow.svg";
import leftArrow from "../../../app/assets/events/leftArrow.svg";

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export const CalendarEvents: React.FC = () => {
  const [startDay, setStartDay] = useState(new Date());
  const daysToShow = 27;

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getVisibleDays = () => {
    const visibleDays: { day: number; month: number }[] = [];
    const currentDate = new Date(startDay);
    let daysRemaining = daysToShow;

    while (daysRemaining > 0) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const currentMonthDays = getDaysInMonth(month, year);
      const startDayOfMonth = currentDate.getDate();

      const daysInThisMonth = Math.min(
        currentMonthDays - startDayOfMonth + 1,
        daysRemaining,
      );

      for (let i = 0; i < daysInThisMonth; i++) {
        visibleDays.push({
          day: startDayOfMonth + i,
          month,
        });
      }

      daysRemaining -= daysInThisMonth;
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(1);
    }

    return visibleDays;
  };

  const handleNext = () => {
    const nextStartDay = new Date(startDay);
    nextStartDay.setDate(startDay.getDate() + 7);
    setStartDay(nextStartDay);
  };
  const handleBack = () => {
    const nextStartDay = new Date(startDay);
    nextStartDay.setDate(startDay.getDate() - 7);
    setStartDay(nextStartDay);
  };

  const visibleDays = getVisibleDays();

  return (
    <div className={s.calendarWrapper}>
      <div className={s.calendarContainer}>
        {visibleDays.map((dayInfo, index) => (
          <React.Fragment key={index}>
            {dayInfo.day === 1 && (
              <div className={s.monthNameWrapper}>
                <div className={s.monthName}>
                  {months[dayInfo.month]}
                </div>
              </div>
            )}
            <div className={s.day}>
              <div className={s.dayContent}>
                <div className={s.dayAbbr}>
                  {getDayAbbr(
                    new Date(
                      new Date().getFullYear(),
                      dayInfo.month,
                      dayInfo.day,
                    ),
                  )}
                </div>
                <div className={s.dayNumber}>{dayInfo.day}</div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <button className={s.navButton} onClick={handleNext}>
        <img src={rightArrow} alt='' />
      </button>
      <button className={s.navButtonLeft} onClick={handleBack}>
        <img src={leftArrow} alt='' />
      </button>
    </div>
  );
};

const getDayAbbr = (date: Date) => {
  const dayOfWeek = date.getDay();
  return (
    <span className={dayOfWeek === 0 || dayOfWeek === 6 ? s.red : ""}>
      {date.toLocaleString("ru-RU", { weekday: "short" })}
    </span>
  );
};
