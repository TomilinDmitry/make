import { FC } from "react";
import styles from "./Menu.module.scss";

export const Menu: FC = () => {
  return (
    <div>
      <ul className={styles.box_menu}>
        <li className={styles.list_section}>
          Как зарегистрироваться на сайте?
        </li>
        <li className={styles.list_section}>
          Как настроить личный кабинет?
        </li>
        <li className={styles.list_section}>
          Как использовать продукт?
        </li>
        <li className={styles.list_section}>Как оформить заказ?</li>
        <li className={styles.list_section}>
          Какие есть варианты доставки?
        </li>
        <li className={styles.list_section}>
          Как проверить местоположение посылки?
        </li>
        <li className={styles.list_section}>
          Что делать в случае брака или обнаруженного дефекта?
        </li>
        <li className={styles.list_section}>
          Какие существуют условия возврата товара или денежных
          средств?
        </li>
        <li className={styles.list_section}>Какие есть гарантии?</li>
        <li className={styles.list_section}>
          Как связаться с компанией, если клиент не нашел ответ в FAQ?
        </li>
      </ul>
    </div>
  );
};
