import { FC } from "react";
import sad_face from "../../app/assets/other/sad_face.svg";
import styles from "./Error.module.scss";
import { useNavigate } from "react-router";

export const ErrorPlayer = () => {
  const navigate = useNavigate()
  return (
    <div className={styles.error_container}>
      <img className={styles.face} src={sad_face} alt='sad_face' />
      <h1 className={styles.title}>Ошибка 404</h1>
      <p className={styles.subtitle}>
        Произошла ошибка при загрузке плеера,возможно вы не авторизованы
        <br />
        <button className={styles.button} onClick={()=>navigate('/login')}>Перейти к авторизации</button>
      </p>
    </div>
  );
};
