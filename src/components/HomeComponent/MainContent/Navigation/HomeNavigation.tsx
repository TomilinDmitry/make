import React, { useEffect, useRef, useState } from "react";
import s from "./homeNavigation.module.scss";
import myNews from "../../../../app/assets/home/navigation/myNews.svg";
import myNewsActive from "../../../../app/assets/home/navigation/myNewsActive.svg";
import manual from "../../../../app/assets/home/navigation/manual.svg";
import manualActive from "../../../../app/assets/home/navigation/manualActive.svg";
import support from "../../../../app/assets/home/navigation/support.svg";
import supportActive from "../../../../app/assets/home/navigation/supportActive.svg";
import faq from "../../../../app/assets/home/navigation/faq.svg";
import faqActive from "../../../../app/assets/home/navigation/faqActive.svg";
import arrow from "../../../../app/assets/home/navigation/arrow.svg";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import {
  setActiveTabHome,
  setOpenCategoryIndex,
  setOpenDoc,
  setOptionListHeight,
} from "app/service/home/HomeSlice";
import { IRefProps } from "app/types/type";
import { CustomSelectCreateLessonModal } from "components/CreateLessonModal/ui/CustomSelect/customSelect";
import telegram from "../../../../app/assets/footer/Telegram.svg";
import inst from "../../../../app/assets/footer/instagram.svg";
import { useLocation, useNavigate, useParams } from "react-router";
import astanaLogo from "../../../../app/assets/footer/astanaLogoNew.svg";
import { useTranslation } from "react-i18next";
import { getSlugData } from "app/api/homeApi";

export const HomeNavigation = ({
  scrollToSection,
  refs,
}: IRefProps) => {
  const {
    activeTab,
    isOpenDocList,
    manualCategory,
    manualCategoryListOne,
    openCategoryIndex,
  } = useSelector((state) => state.home);
  const optionListRef = useRef<HTMLUListElement>(null);

  const dispatch = useDispatch();
  const [view, setView] = useState<boolean>(true);
  const { t } = useTranslation();
  const setCurrentTab = (
    tab: "news" | "manual" | "support" | "FAQ",
  ) => {
    dispatch(setActiveTabHome(tab));
  };

  const updateDropdownHeight = () => {
    if (optionListRef?.current && isOpenDocList) {
      const height =
        optionListRef.current.getBoundingClientRect().height;
      dispatch(setOptionListHeight(height));
    }
  };

  const toggleOpenDoc = () => {
    updateDropdownHeight();
  };
  const [fetchedSlug, setFetchedSlug] = useState<string | null>(null);
  const [activeManualItem, setActiveManualItem] = useState<
    string | null
  >(null);
  const navigate = useNavigate();
  const location = useLocation();
  const handleManualItemClick = (itemName: string, slug: string) => {
    // Прокрутка к соответствующему разделу
    if (refs && refs[slug] && scrollToSection) {
      scrollToSection(refs[slug]); // Выполняем прокрутку
    }

    setActiveManualItem(itemName); // Устанавливаем активный элемент

    // Добавление slug в URL
    const basePath = location.pathname.includes("/my-documents")
      ? "/my-documents"
      : `${location.pathname}/my-documents`; // Проверяем базовый путь
    navigate(`${basePath}/${slug}`); // Обновляем URL
  };

  const handleToggleCategory = (index: any) => {
    dispatch(
      setOpenCategoryIndex(
        openCategoryIndex === index ? null : index,
      ),
    );
  };
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => {
    if (location.pathname.startsWith("/my-documents")) {
      setCurrentTab("manual");

      // Прокрутка до определенного элемента, если slug существует
      if (slug && refs && refs[slug] && scrollToSection) {
        scrollToSection(refs[slug]);
      }
    } else {
      setView(false);
    }
  }, [
    location.pathname,
    activeTab,
    view,
    slug,
    refs,
    scrollToSection,
    fetchedSlug,
    setCurrentTab,
  ]);
  useEffect(() => {
    // Выполняем запрос только если данных нет или они пустые
    if (
      location.pathname.startsWith("/my-documents") &&
      slug &&
      !manualCategoryListOne.length
    ) {
      dispatch(getSlugData(slug));
    }
  }, []);

  // const {i18n} = useTranslatio
  return (
    <div className={s.homeNavigationContainer}>
      <div className={s.listAndFooterContainer}>
        <ul className={s.navigation}>
          <li
            className={
              activeTab === "news"
                ? s.navigationElementActive
                : s.navigationElement
            }
            onClick={() => {
              setCurrentTab("news");
              navigate("/");
            }}>
            <section className={s.title}>
              <img
                src={activeTab === "news" ? myNewsActive : myNews}
                alt='myNews'
              />
              <h1>{t("navigation.myNews.title")}</h1>
            </section>
            <p className={s.description}>
              {t("navigation.myNews.description")}
            </p>
          </li>
          <li
            className={
              activeTab === "manual"
                ? s.navigationElementActive
                : s.navigationElement
            }
            onClick={() => {
              setCurrentTab("manual");
              // dispatch(setOpenDoc(false));
              setView(!view);
              navigate("/my-documents");
            }}>
            <section className={s.title}>
              <img
                src={activeTab === "manual" ? manualActive : manual}
                alt='myManual'
              />
              <h1>{t("navigation.myManual.title")}</h1>
            </section>
            <p className={s.description}>
              {t("navigation.myManual.description")}
            </p>
          </li>
          {activeTab === "manual" && view && (
            <li className={s.manualListContainer}>
              <ul className={s.manualList}>
                {manualCategory.map((el, index) => (
                  <div key={el.id} className={s.wrapperManualList}>
                    <div
                      className={s.titleContainer}
                      onClick={() => handleToggleCategory(el.id)}>
                      <img
                        src={arrow}
                        alt='arrow'
                        className={
                          openCategoryIndex === el.id
                            ? s.arrowOpen
                            : s.arrowClose
                        }
                      />
                      <h1 className={s.manualTitle}>
                        {el ? el.title : "Инструкция 1"}
                      </h1>
                    </div>
                    <div>
                      {
                        openCategoryIndex === el.id &&
                          // <ul className={s.manualList}>
                          (manualCategoryListOne.length > 0
                            ? manualCategoryListOne.map((item) => (
                                <li
                                  key={item.id}
                                  className={
                                    activeManualItem === item.title
                                      ? s.manualElementActive
                                      : s.manualElement
                                  }
                                  onClick={() =>
                                    handleManualItemClick(
                                      item.title,
                                      item.slug,
                                    )
                                  }>
                                  {item.title}
                                </li>
                              ))
                            : "")
                        // </ul>
                      }
                    </div>
                  </div>
                ))}
              </ul>
            </li>
          )}

          <li
            className={
              activeTab === "support"
                ? s.navigationElementActiveThree
                : s.navigationElementThree
            }
            onClick={() => {
              setCurrentTab("support");
              navigate("/support");
            }}>
            <section className={s.title}>
              <img
                src={
                  activeTab === "support" ? supportActive : support
                }
                alt='mySupport'
              />
              <h1>{t("navigation.mySupport.title")}</h1>
            </section>
            <p className={s.description}>
              {t("navigation.mySupport.description")}
            </p>
          </li>
          <li
            className={
              activeTab === "FAQ"
                ? s.navigationElementFaqActive
                : s.navigationElementFaq
            }
            onClick={() => {
              setCurrentTab("FAQ");
              navigate("/FAQ");
            }}>
            <section className={s.title}>
              <img
                src={activeTab === "FAQ" ? faqActive : faq}
                alt='faq'
              />
              <h1 className={s.desktopVersion}>
                {t("navigation.FAQ.title")}
              </h1>
              <h1 className={s.mobileVersion}>FAQ</h1>
            </section>
            <p className={s.description}>
              {t("navigation.FAQ.description")}
            </p>
          </li>
        </ul>
        <div className={s.footerContainer}>
          <div className={s.footer}>
            <div className={s.container}>
              <div className={s.topContainer}>
                <section>
                  <h1 className={s.footerTitle}>
                    Peremena group Limited Liability Company
                  </h1>
                </section>
                {/* <span className={s.bin}>BIN 241040102391</span> */}
                {/* <button className={s.offer}>
                  {t("navigation.footer.publicOffer")}
                </button>
                <button className={s.confidentiality}>
                  {t("navigation.footer.privacyPolicy")}
                </button> */}
              </div>

              <div className={s.mainBlock}>
                <a
                  className={s.email}
                  href='mailto:support@makeupdate.online'>
                  support@makeupdate.online
                </a>
                <span className={s.imageBlock}>
                  <img src={telegram} alt='telegram' />
                  <img src={inst} alt='inst' />
                </span>
                {/* <span>
                  <img
                    src={astanaLogo}
                    alt='astanaHub'
                    className={s.astanaLogo}
                  />
                </span> */}
                <span className={s.rights}>
                  © {t("navigation.footer.allRights")}.
                  <br />
                  «PEREMENA GROUP», 2024.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === "manual" && (
        <div className={s.select}>
          <>
            {manualCategory.map((el, index) => (
              <div onClick={() => toggleOpenDoc()} key={index} className={s.selectElement}>
                <CustomSelectCreateLessonModal
                  updateHeight={updateDropdownHeight}
                  data={el}
                  optionListRef={optionListRef}
                  refs={refs}
                />
              </div>
            ))}
          </>
        </div>
      )}
    </div>
  );
};
