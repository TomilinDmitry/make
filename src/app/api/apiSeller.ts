import axios from "axios";
import { BASEURL } from "./apiLessons";
import { ITarifPayload } from "app/types/type";
import { setTarifData } from "app/service/lessons/lessonsSlice";

export const getTarifData = async (dispatch: any) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/v1/tariff/get-all/`,
    );
    const data: ITarifPayload[] = response.data;
    console.log(data)
    dispatch(setTarifData(data));
    return data
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};
