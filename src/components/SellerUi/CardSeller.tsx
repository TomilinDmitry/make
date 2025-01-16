import React, { useEffect, useState } from "react";
import s from "./cardSeller.module.scss";

import "./style.css";
import gradientCheckIcon from "../../app/assets/Seller/GradientCheckIcon.svg";
import crossIcon from "../../app/assets/Seller/CrossIcon.svg";
import { useTranslation } from "react-i18next";
import { getTarifData } from "app/api/apiSeller";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import arrow from "../../app/assets/home/arrowDown.svg";
import CustomSelect from "components/CustomSelect/CustomSelect";
import { useNavigate } from "react-router";
import { setGb, setMinutes, setOpenOffer } from "app/service/seller/AuthorSlice";

export const CardSeller = ({
  status,
  data,
}: {
  status?: string;
  data?: { gb: number; m: number; type: string } | null;
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { sellerTarif } = useSelector((state) => state.lessons);
  const { typeUser } = useSelector((state) => state.profileCard);
  const { gb,openOffer } = useSelector((state) => state.author);
  useEffect(() => {
    const fetchData = async () => {
      if (sellerTarif.length > 0) return;
      await getTarifData(dispatch);
    };
    fetchData();
  }, [dispatch]);
  const { isAuth } = useSelector((state) => state.user);
  // const [gb, setgb] = useState<number | null>(20);
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (value: number) => {
    dispatch(setGb(value)); // Устанавливаем выбранное значение
    setIsOpen(false); // Закрываем выпадающий список
  };
  const navigate = useNavigate();
  const titleClass =
    status === "Seller" ? s.sellerTitleBlock : s.titleBlock;

  const titleText = status === "Seller" ? "AUTHOR" : "USER";

  const selectedTitle = (): string => {
    const tarif = `${
      sellerTarif.find((el) => el.gigo_bytes === gb)?.title || 0
    }`;
    return tarif;
  };
  const selectedPlan = (): string => {
    const GB = `${
      sellerTarif.find((el) => el.gigo_bytes === gb)?.gigo_bytes || ""
    }`;
    const minutes = `${
      sellerTarif.find((el) => el.gigo_bytes === gb)?.minutes || 0
    }`;
    const hours = Math.floor(+minutes / 60);
    const min = Math.floor(+minutes % 60);
    return `${GB} ГБ / ${hours} часов ${
      min > 0 ? `${min} минут` : ""
    }`;
  };
  const filteredTariffList = sellerTarif
    .filter((el) => el.gigo_bytes !== gb) // Исключаем выбранный GB
    .sort((a, b) => a.gigo_bytes - b.gigo_bytes); // Сортируем от меньшего к большему

  const selectedPlanMinutes = () => {
    const minutes =
      sellerTarif.find((el) => el.gigo_bytes === gb)?.minutes || 0;

    // Обновляем Redux

    return minutes;
  };

  const isCurrentTariff = () => {
    if (!data) return false;
    dispatch(setMinutes(selectedPlanMinutes() / 60));
    return data.gb === gb && data.m === selectedPlanMinutes();
  };
  const linkTo = () => [isAuth ? navigate("/author/offer") : navigate("/author")];
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <main>
          <div className={s.topBlock}>
            <section className={titleClass}>
              <h1 className={s.title}>{titleText}</h1>
              {/* {status === "Seller" ? (
								<span className={s.subtitle}>BASE</span>
							) : (
								""
							)} */}
            </section>
            {status !== "Seller" ? (
              <ul className={s.list}>
                <li className={s.listElement}>
                  <img src={gradientCheckIcon} alt='check' />
                  <span>{t("seller.user.fullAccess")}</span>
                </li>
                <li className={s.listElement}>
                  <img src={gradientCheckIcon} alt='chcek' />
                  <span>{t("seller.user.interaction")}</span>
                </li>
                <li className={s.listElement}>
                  <img src={gradientCheckIcon} alt='chcek' />
                  <span>{t("seller.user.access")}</span>
                </li>
                <li className={s.listElement}>
                  <img src={crossIcon} alt='disable' />
                  <span>{t("seller.user.noPossibility")}</span>
                </li>
              </ul>
            ) : (
              <ul className={s.list}>
                <li className={s.listElement}>
                  <img src={gradientCheckIcon} alt='chcek' />
                  <span>{t("seller.seller.allPossibility")}</span>
                </li>
                <li className={s.listElement}>
                  <img src={gradientCheckIcon} alt='chcek' />
                  <span>{t("seller.seller.scale")}</span>
                </li>
                <li className={s.listElement}>
                  <img src={gradientCheckIcon} alt='chcek' />
                  <span>{t("seller.seller.monetization")}</span>
                </li>
                <li className={s.listElement}>
                  <img src={gradientCheckIcon} alt='chcek' />
                  <span>{t("seller.seller.choice")}</span>
                </li>
                <li className={s.listElement}>
                  <img src={gradientCheckIcon} alt='chcek' />
                  <span>{t("seller.seller.sellDownload")}</span>
                </li>
              </ul>
            )}
          </div>

          {status === "Seller" ? (
            <div className={s.bottomContainer}>
              <div className={s.selector}>
                <span className={s.text}>
                  {t("seller.seller.volume")}
                </span>
                <button
                  className={s.select}
                  onClick={() => setIsOpen((prev) => !prev)}>
                  {gb &&
                    `${
                      sellerTarif.find((el) => el.gigo_bytes === gb)
                        ?.gigo_bytes || 0
                    } ГБ`}
                  <span>
                    <img
                      src={arrow}
                      alt='arrowIcon'
                      className={isOpen ? s.bottom : s.top}
                    />
                  </span>
                </button>
                {isOpen && (
                  <div className={s.options}>
                    {filteredTariffList.map((el) => (
                      <div
                        key={el.id}
                        className={s.option}
                        onClick={() => handleSelect(el.gigo_bytes)}>
                        {el.gigo_bytes} ГБ{" "}
                      </div>
                    ))}
                  </div>
                )}

                {/* Кнопка с расчетом цены */}
              </div>
              <div>
                <p className={s.selectedBlock}>
                  <span className={s.title}>Вы выбрали: </span>
                  <span className={s.selectedTariff}>
                    {selectedTitle()}
                  </span>
                </p>
                <p className={s.selectedBlock}>
                  <span className={s.title}>В него входит: </span>
                  <span className={s.selectedTariff}>
                    {selectedPlan()}
                  </span>
                </p>
              </div>
              {!isCurrentTariff() ? (
                <button
                  className={
                    isCurrentTariff() ? s.button : s.buttonSeller
                  }
                  onClick={linkTo}>
                  {gb
                    ? `${
                        sellerTarif.find((el) => el.gigo_bytes === gb)
                          ?.price || 0
                      } ₽`
                    : 0}
                </button>
              ) : (
                <button
                  className={
                    typeUser.type === "author"
                      ? s.button
                      : s.buttonSeller
                  }>
                  Ваш текущий тариф
                </button>
              )}
            </div>
          ) : (
            <button
              className={isAuth ? s.button : s.buttonSeller}
              onClick={() => navigate("/login")}>
              {isAuth
                ? `${t("seller.user.current")}`
                : "Стать пользователем"}
            </button>
          )}
        </main>
      </div>
    </div>
  );
};
