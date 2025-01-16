import React, { useEffect, useState } from "react";
import s from "./style.module.scss";
import videoBg from "../../../../../app/assets/home/mainBlock/videoBgBig.png";
import more from "../../../../../app/assets/lessons/more_img.svg";
import view from "../../../../../app/assets/lessons/view.svg";
import comment from "../../../../../app/assets/lessons/comment.svg";
import wallet from "../../../../../app/assets/lessons/wallet.svg";
import { LessonProps } from "app/types/type";
import { Loading } from "components/Loading/Loading";
import channel from "../../../app/assets/profileCard/unknown_user.svg";
import { Link } from "react-router-dom";

export const LessonCardElement = ({}: // lessonData,
// profileData,
LessonProps) => {
  

  return (
    <div className={s.wrapper}>
      {/* {!lessonData ? (
        <Loading />
      ) : ( */}
      {/* <> */}
      <div className={s.imageContainer}>
        <img
          src={videoBg}
          // src={lessonData!.poster_url}
          alt='rightSideImg'
          className={s.rightSideImg}
        />
        <div className={s.timebox}>
          <span className={s.time}>
            {/* {videoDuration} */}
            10:10
          </span>
        </div>
      </div>
      <div className={s.container}>
        <section className={s.titleBlock}>
          <h1 className={s.title}>
            {/* {lessonData?.title} */}
            Укладка волос в необычном стиле
          </h1>
          <img className={s.img_share} src={more} alt='ShareIcon' />
        </section>
        <p>
          <span className={s.date}>
            Опубликовано:
            {/* {publishedDate} */}
            20.02.2020
          </span>
          <span className={s.description}>
            {/* {lessonData?.description} */}
            Дескриптор, максимум 200 символов. Дескриптор, максимум
            200 символов. Дескриптор, максимум 200 символов.
            Дескриптор, максимум 200 символов. Дескриптор, максимум
            200 символов. Дескриптор, максимум 200 символов.
            Дескриптор, максимум 200 символов. Дескриптор, максимум
            200 символов. Дескриптор, максимум 200 символов.
            Дескриптор, максимум 200 символов.Дескриптор, максимум 200
            символов. Дескриптор, максимум 200 символов. Дескриптор,
            максимум 200 символов.Дескриптор, максимум 200 символов.
            Дескриптор, максимум 200 символов. Дескриптор, максимум
            200 символов.
          </span>
        </p>
        <div className={s.bottomContainer}>
          {/* <Link to={`/profile/${lessonData?.user_id}`}> */}
          <div className={s.profileContainer}>
            <span className={s.round}>
              {/* <img src={photoUrl} alt='profilePhoto' /> */}
            </span>
            <div className={s.profile}>
              <h2 className={s.name}>
                {/* {name} */}
                Лена Мотинова
              </h2>
              <div className={s.statistic}>
                <span>
                  <img src={view} alt='view' className={s.view} />
                  {/* {lessonData.views} */}
                  1200
                </span>
                <span>
                  <img
                    src={comment}
                    alt='comment'
                    className={s.comment}
                  />
                  {/* {lessonData.count_comments} */}
                  12
                </span>
              </div>
            </div>
          </div>
          {/* </Link> */}

          <button className={s.buy_btn}>
            <img className={s.img_buy} src={wallet} alt='' />
            <span className={s.text_buy}>Купить за 1000 ₽</span>
          </button>
        </div>
      </div>
      {/* </> */}
      {/* )} */}
    </div>
  );
};
