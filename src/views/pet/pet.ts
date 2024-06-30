export interface QueryDataType {
  label: String;
  prop: String;
  type: String;
  options?: QueryDataSelectType[];
  valueKey?: String;
  labelKey?: String;
  defaultValue?: String;
}

export interface QueryDataSelectType {
  id: number;
  menuName: String;
}

export interface QueryDataParamType {
  saleDate?: Array<String>;
}

export interface ColumnConfigProps {
  prop: string;
  label: string;
  type?: string;
  align?: "left" | "center" | "right";
  min_width?: number;
  width?: number;
  isEdit?: boolean;
}

export interface Pages {
  total: number;
  limit: number;
  page: number;
}
export type PetReportItem = {
  animalRevenue: number;
  beautyFreeCustomer: number;
  beautyRevenue: number;
  beautyVIPCustomer: number;
  freeCustomer: number;
  incrementalPetsTotal: number;
  medFreeCustomer: number;
  medRevenue: number;
  medVIPCustomer: number;
  newRegisteredVIP: number;
  orderTotalNum: number;
  otherRevenue: number;
  saleRevenue: number;
  shopNo: String;
  totalRevenue: number;
  vipCustomer: number;
  weekendToStoreVipNum: number;
  workdayToStoreVipNum: number;
};
export interface TableModuleType {
  editInputBlur?: () => void;
  callback?: () => void;
  queryForm: QueryDataParamType;
  columns: ColumnConfigProps[];
  dataList: Array<PetReportItem>;
  loading: boolean;
  pages: Pages;
  query: QueryDataType[];
}
// editInputBlur: editInputBlur, // 可编辑单元的，失去焦点时的回调
//   callback: getDataList, // 回调，子组件中可以看到很多调用callback的，这里对应的是获取列表数据的方法
//     // 以下不说了，上面都给解释了
//     queryForm: queryForm,
//       columns: columns,
//         dataList: dataList,
//           loading: loading,
//             pages: pages,
//               query: query
