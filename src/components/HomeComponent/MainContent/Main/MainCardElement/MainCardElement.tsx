import React from "react";
import s from "./mainCardElement.module.scss";
import { Link } from "react-router-dom";
import videoBg from "../../../../../app/assets/home/mainBlock/videoBg.png";
import play from "../../../../../app/assets/lessons/play.svg";
import more from "../../../../../app/assets/lessons/more_img.svg";
import view from "../../../../../app/assets/lessons/view.svg";
import comment from "../../../../../app/assets/lessons/comment.svg";
import wallet from "../../../../../app/assets/lessons/wallet.svg";
export const MainCardElement = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        {/* Image  */}
        <div className={s.imageContainer}>
          {/* <Link to={`/lesson/${lessonData?.id}`}> */}
          <img className={s.img_lesson} src={videoBg} alt='poster' />

          <button className={s.button_play}>
            <img
              className={s.play_img}
              src={play}
              alt='playVideoIcon'
            />
          </button>
          <div className={s.time_box}>
            <span className={s.time_lessons}>10:10</span>
          </div>
          {/* </Link> */}
        </div>
        {/* /Image */}
        <section className={s.titleBlock}>
          <h1 className={s.title}>Макияж дневной</h1>
          <button className={s.shareButton}>
            <img className={s.img_share} src={more} alt='ShareIcon' />
          </button>
        </section>
        <span className={s.date}>Опубликовано:20.11.2023</span>
        <p className={s.description}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab
          ad ullam aliquam dolore atque. Aliquam, ipsa. Accusamus
          necessitatibus explicabo, adipisci reiciendis magnam
          corrupti, suscipit quibusdam architecto animi vitae mollitia
          qui.
        </p>
        <div className={s.profileContainer}>
          <div className={s.profileBlock}>
            <span className={s.round}></span>
            <div className={s.profile}>
              <section>
                <h1 className={s.profileName}>Лена Мотинова</h1>
              </section>
              <div className={s.counters}>
                <span>
                  <img
                    className={s.img_view_com}
                    src={view}
                    alt='view'
                  />
                  1200
                </span>
                <span>
                  <img
                    className={s.img_view_com}
                    src={comment}
                    alt='comment'
                  />
                  12
                </span>
              </div>
            </div>
          </div>
          <button className={s.buyBtn}>
            <img className={s.img_buy} src={wallet} alt='wallet' />
            <span> Купить за 399₽</span>
          </button>
        </div>
      </div>
    </div>
  );
};
