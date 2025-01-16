import React, { useState } from "react";
import s from "./support.module.scss";
import { SupportModal } from "./supportModal/SupportModal";
import { ChatModal } from "./ChatModal/ChatModal";
import { AdaptiveCardSupport } from "./AdaptiveCardSupport/AdaptiveCardSupport";
import { useTranslation } from "react-i18next";
export const Support = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const { t } = useTranslation();
  const onClose = () => {
    openCreateModal && setOpenCreateModal(false);
    openChat && setOpenChat(false);
  };
  const tableData = [
    {
      id: 1,
      status: `${t("myRequest.navigation.button_2")}`,
      name: "Пример элемента 1",
      createdAt: "2024-11-01",
      updatedAt: "2024-11-05",
    },
    {
      id: 2,
      status: `${t("myRequest.navigation.button_3")}`,
      name: "Пример элемента 2",
      createdAt: "2024-10-25",
      updatedAt: "2024-10-30",
    },
    {
      id: 3,
      status: `${t("myRequest.navigation.button_3")}`,
      name: "Не могу загрузить видео на платформу ,после всех регистрац...",
      createdAt: "2024-09-20",
      updatedAt: "2024-10-28",
    },
    {
      id: 4,
      status: `${t("myRequest.navigation.button_3")}`,
      name: "Не могу вывести деньги с баланса",
      createdAt: "2024-08-15",
      updatedAt: "2024-09-15",
    },
    {
      id: 123456789,
      status: `${t("myRequest.navigation.button_2")}`,
      name: "Пример элемента 5",
      createdAt: "2024-07-10",
      updatedAt: "2024-08-01",
    },
  ];
  const getFilteredData = () => {
    if (activeIndex === 1) {
      // Показывать все элементы
      return tableData;
    } else if (activeIndex === 2) {
      // Показывать только открытые
      return tableData.filter(
        (item) =>
          item.status === `${t("myRequest.navigation.button_2")}`,
      );
    } else if (activeIndex === 3) {
      // Показывать только закрытые
      return tableData.filter(
        (item) =>
          item.status === `${t("myRequest.navigation.button_3")}`,
      );
    }
    return tableData;
  };
  return (
    <div className={s.wrapper}>
      <section className={s.topBlock}>
        <h1 className={s.helpTitle}>{t("myRequest.title")}</h1>
        {/* <span className={s.reference}>Справка</span> */}
      </section>
      <div className={s.supportNavigation}>
        <div className={s.leftButtons}>
          <button
            className={activeIndex === 1 ? s.buttonActive : s.button}
            onClick={() => setActiveIndex(1)}>
            {t("myRequest.navigation.button_1")}
          </button>
          <button
            className={activeIndex === 2 ? s.buttonActive : s.button}
            onClick={() => setActiveIndex(2)}>
            {t("myRequest.navigation.button_2")}
          </button>
          <button
            className={activeIndex === 3 ? s.buttonActive : s.button}
            onClick={() => setActiveIndex(3)}>
            {t("myRequest.navigation.button_3")}
          </button>
        </div>
        <button
          className={s.create}
          onClick={() => setOpenCreateModal(true)}>
          {t("myRequest.navigation.createRequest")}
        </button>
      </div>
      <table className={s.table}>
        <thead>
          <tr className={s.tableHeader}>
            <th className={s.headerElement}>{t("myRequest.table.number")}</th>
            <th className={s.headerElement}>{t("myRequest.table.status")}</th>
            <th className={s.headerElement}>{t("myRequest.table.name")}</th>
            <th className={s.headerElement}>{t("myRequest.table.createDate")}</th>
            <th className={s.headerElement}>{t("myRequest.table.updateDate")}</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredData().map((row) => (
            <tr key={row.id} className={s.row}>
              <td
                className={s.cell}
                onClick={() => setOpenChat(true)}>
                {row.id}
              </td>
              <td className={s.cell}>{row.status}</td>
              <td className={s.cell}>{row.name}</td>
              <td className={s.cell}>{row.createdAt}</td>
              <td className={s.cell}>{row.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={s.adaptiveSupport}>
        {tableData.map((el) => (
          <div onClick={() => setOpenChat(true)} key={el.id}>
            <AdaptiveCardSupport />
          </div>
        ))}
      </div>

      {openCreateModal && (
        <div className={s.blurBg}>
          <SupportModal onClose={onClose} />
        </div>
      )}
      {openChat && (
        <div className={s.blurBg}>
          <ChatModal onClose={onClose} />
        </div>
      )}
    </div>
  );
};
