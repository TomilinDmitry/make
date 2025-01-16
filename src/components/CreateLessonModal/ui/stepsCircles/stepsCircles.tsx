import React from "react";
import s from "./stepsCircles.module.scss";
export const StepsCircles = ({ steps }: { steps: 1 | 2 | 3}) => {
  const stepClassMap = {
    1: s.circleActive,
    2: s.stepsTwoCircleOne,
    3: s.stepsThreeCircleOne,
    // 4: s.stepsFourCircleOne,
  };
  const stepClassMapTwo = {
    1: s.circle,
    2: s.circleTwoStepTwo,
    3: s.circleTwoStepThree,
    // 4: s.circleTwoStepFour,
  };
  const stepClassMapThree = {
    1: s.circle,
    2: s.circle,
    3: s.circleThreeStepThree,
    // 4: s.circleThreeStepFour,
  };
  return (
    <div className={s.wrapper}>
      <span className={stepClassMap[steps] || s.circle}>
        <span className={s.whiteCircle}></span>
        <span
          className={
            steps === 2 || steps === 3 
              ? s.stepTwoLine
              : s.lineActive
          }></span>
      </span>
      <span className={stepClassMapTwo[steps] || s.circle}>
        <span
          className={
            steps === 2 || steps === 3 
              ? s.stepTwoRightLine
              : s.lineLeft
          }></span>

        <span className={s.whiteCircle}></span>
        <span
          className={
            steps === 2
              ? s.stepTwoRightLine
              : steps === 3 
                ? s.stepTwoLine
                : s.line
          }
        />
      </span>
      <span className={stepClassMapThree[steps] || s.circle}>
        <span
          className={
            steps === 3 
              ? s.stepThreeRightLine
              : s.lineLeft
          }></span>
        <span className={s.whiteCircle}></span>
        </span>
        {/* <span
          className={
            steps === 3 ? s.stepThreeLine : steps === 3 ? "" : s.line
          }></span>
      </span> */}
      {/* <span className={steps === 3 ? s.stepFourCircle : s.circle}>
        <span
          className={
            steps === 3 ? s.stepFourLineLeft : s.lineLeft
          }></span>
        <span className={s.whiteCircle}></span>
      </span> */}
    </div>
  );
};
