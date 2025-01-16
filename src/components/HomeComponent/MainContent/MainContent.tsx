import React, { useRef } from "react";
import s from "./MainContent.module.scss";
import { HomeNavigation } from "./Navigation/HomeNavigation";
import { MainBlock } from "./Main/MainBlock";
import { AdBlock } from "./Ad/AdBlock";
import { useSelector } from "app/service/hooks/hooks";
import adPhoto1 from "../../../app/assets/home/mainBlock/adPhoto1.jpg";
import adPhoto2 from "../../../app/assets/home/mainBlock/adPhoto2.jpg";
export const MainContent = () => {
  const { activeTab, manualCategoryListOne } = useSelector(
    (state) => state.home,
  );

  const refs = useRef<
    Record<string, React.RefObject<HTMLDivElement>>
  >({});

  manualCategoryListOne.forEach((el) => {
    if (!refs.current[el.slug]) {
      refs.current[el.slug] = React.createRef();
    }
  });

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const yOffset = -150;
      const yPosition =
        ref.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <nav className={activeTab === "manual" ? s.manual : ""}>
          <HomeNavigation
            refs={refs.current}
            scrollToSection={scrollToSection}
          />
        </nav>
        <main>
          <MainBlock refs={refs.current} />
        </main>
        <aside>
          <AdBlock imageSrc={adPhoto1} />
          <AdBlock imageSrc={adPhoto2} />
          <AdBlock />
        </aside>
      </div>
    </div>
  );
};
