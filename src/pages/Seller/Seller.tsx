import React, { useEffect, useState } from "react";
import s from "./seller.module.scss";
import { CardSeller } from "components/SellerUi/CardSeller";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { getTarifData } from "app/api/apiSeller";
import { FAQ } from "components/HomeComponent/MainContent/Navigation/FAQ/FAQ";
import { jwtDecode } from "jwt-decode";
import { setTypeUser } from "app/service/profileCard/profileCardSlice";
import { OfferModal } from "components/SellerUi/offerModal/OfferModal";
export const Seller = () => {
  const { typeUser } = useSelector((state) => state.profileCard);
  const { openOffer } = useSelector((state) => state.author);
  console.log(openOffer);
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <CardSeller />

        <CardSeller status='Seller' data={typeUser} />
      </div>
      <FAQ />
      {openOffer && <OfferModal />}
    </div>
  );
};
