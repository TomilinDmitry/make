import { getManualCategories } from "app/api/homeApi";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import React, { useEffect } from "react";
import s from "./manualModal.module.scss";
import {
  setActiveTabHome,
  setOpenCategoryIndex,
  setOpenDoc,
} from "app/service/home/HomeSlice";
import { useLocation, useNavigate } from "react-router";
export const ManualModal = () => {
  const dispatch = useDispatch();
  const { manualCategoryListOne, manualCategory,openDoc } = useSelector(
    (state) => state.home,
  );
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      if (
        manualCategoryListOne.length === 0 &&
        manualCategory.length === 0
      ) {
        // Если категории ещё не загружены, загружаем их
        if (manualCategory.length > 0) return;
        await getManualCategories(dispatch);
      }
    };
    fetchData();
  }, [dispatch]);
  const linkToManualId = (id: number) => {
    navigate("/my-documents");
    dispatch(setOpenCategoryIndex(id));
    dispatch(setActiveTabHome("manual"));
  };
  return (
    <div className={s.wrapper}>
      <ul className={s.list}>
        {manualCategory.map((el) => (
          <li
            onClick={() => linkToManualId(el.id)}
            className={s.element}>
            {el.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
