import styles from "./Home.module.scss";
import { TopContent } from "components/HomeComponent/TopContent/TopContent";
import { MainContent } from "components/HomeComponent/MainContent/MainContent";
export const Home = () => {
  return (
    <div className={styles.wrapper}>
      <TopContent />
      <MainContent />
    </div>
  );
};
