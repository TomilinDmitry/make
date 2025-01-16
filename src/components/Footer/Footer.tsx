import s from "./Footer.module.scss";

import inst from "../../app/assets/footer/instagram.svg";
import tg from "../../app/assets/footer/Telegram.svg";

export const Footer = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.leftSide}>
          <span className={s.nameCompany}>
            Peremena group Limited Liability Company
          </span>
          <span className={s.bin}>BIN 241040102391</span>
          <span className={s.rights}>
            © Все права сохранены. «PEREMENA GROUP», 2024.
          </span>
        </div>
        <div className={s.centerBlock}>
          <div className={s.emailBlock}>
            <a href='mailto: support@makeupdate.online'>
              <button className={s.email}>
                support@makeupdate.online
              </button>
            </a>
            <span className={s.icons}>
              <img src={inst} alt='instIcon' />
              <img src={tg} alt='TelegramIcon' />
            </span>
          </div>
        </div>
        <div className={s.rightSide}>
          <button>Публичная оферта</button>
          <button>Политика конфиденциальности</button>
        </div>
      </div>
    </div>
  );
};
