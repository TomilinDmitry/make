import { FC } from "react";
import { ModalWindow } from "../../app/types/modal";
import styles from "./Info.module.scss";

export const InfoModal: FC<ModalWindow> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.box_info}>
      <ul>
        <li>Как зарегистрироваться на сайте?</li>
        <li>Как настроить личный кабинет?</li>
        <li>Как использовать продукт?</li>
        <li>Как оформить заказ?</li>
        <li>Какие есть варианты доставки?</li>
        <li>Как проверить местоположение посылки?</li>
        <li>Что делать в случае брака или обнаруженного дефекта?</li>
        <li>
          Какие существуют условия возврата товара или денежных
          средств?
        </li>
        <li>Какие есть гарантии?</li>
        <li>
          Как связаться с компанией, если клиент не нашел ответ в FAQ?
        </li>
      </ul>
    </div>
  );
};
