import { useParams } from "react-router";
import styles from "./reset.module.scss";
import { confirmEmail } from "app/service/servise";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SuccessModal } from "components/ConfirmUI/SuccessModal";
import { useTranslation } from "react-i18next";
import { ResetModal } from "components/ResetUI/ResetModal";

export const Reset = () => {


  return (
    <div className={styles.box_email}>
      <ResetModal />
    </div>
  );
};
