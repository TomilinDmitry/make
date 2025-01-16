import { FC } from "react";
import styles from "./Loading.module.scss";

export const Loading = () => {
  const text = "MAKEUPDATE";
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {text.split("").map((letter, index) => (
          <span
            key={index}
            className={styles.letterGradient}
            style={{ animationDelay: `${index * 0.3}s` }}>
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};
