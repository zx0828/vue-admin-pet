import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/util";
import type { PetReportItem } from "@/views/pet/pet";
export type PetReportResult = {
  msg: string;
  code: string;
  data: {
    dataList: Array<PetReportItem>;
  };
};

/** 查询宠物报表数据 */
export const queryAllData = (data?: object) => {
  return http.request<PetReportResult>(
    "post",
    baseUrlApi("pet/statistics/queryAllData"),
    {
      data
    }
  );
};
