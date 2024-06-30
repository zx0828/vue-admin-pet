import type { QueryDataType, ColumnConfigProps } from "./pet.ts";

const columnsData: ColumnConfigProps[] = [
  {
    prop: "shopNo",
    label: "门店",
    align: "center",
    min_width: 100
  },
  {
    prop: "medRevenue",
    label: "医疗",
    align: "center",
    width: 80
  },
  {
    prop: "beautyRevenue",
    label: "美容",
    align: "center",
    width: 80
  },
  {
    prop: "saleRevenue",
    label: " 销售",
    align: "center",
    width: 80
  },
  {
    prop: "otherRevenue",
    label: "其他",
    align: "center",
    width: 80
  },
  {
    prop: "animalRevenue",
    label: "活体",
    align: "center",
    width: 80
  },
  {
    prop: "totalRevenue",
    label: "营业额",
    align: "center",
    width: 80
  },
  {
    prop: "freeCustomer",
    label: "散客",
    align: "center",
    width: 80
  },
  {
    prop: "vipCustomer",
    label: "会员客户",
    align: "center",
    width: 80
  },
  {
    prop: "newRegisteredVIP",
    label: "新注册会员",
    align: "center",
    width: 80
  },
  {
    prop: "medFreeCustomer",
    label: "医疗散客",
    align: "center",
    width: 80
  },
  {
    prop: "medVIPCustomer",
    label: "医疗会员客户",
    align: "center",
    width: 80
  },
  {
    prop: "incrementalPetsTotal",
    label: "新增宠物数",
    align: "center",
    width: 80
  },
  {
    prop: "beautyFreeCustomer",
    label: "美容散客",
    align: "center",
    width: 80
  },
  {
    prop: "beautyVIPCustomer",
    label: "美容会员客户",
    align: "center",
    width: 80
  },
  {
    prop: "weekendToStoreVipNum",
    label: "会员周末客户数",
    align: "center",
    width: 80
  },
  {
    prop: "workdayToStoreVipNum",
    label: "会员非周末客户数",
    align: "center",
    width: 80
  },
  {
    prop: "orderTotalNum",
    label: "总单数",
    align: "center",
    width: 80
  }
];

// 表格查询配置中 type:select 的测试数据

// let dataList: QueryDataSelectType[] = [
//   {
//     id: 1,
//     menuName: "首页"
//   },
//   {
//     id: 2,
//     menuName: "系统管理"
//   },
//   {
//     id: 3,
//     menuName: "用户管理"
//   },
//   {
//     id: 4,
//     menuName: "角色管理"
//   },
//   {
//     id: 5,
//     menuName: "菜单管理"
//   }
// ];

/*
    接下来我们来说一下查询的配置
    我们查询时传给后端的数据大多是是这样的
    {
        name:'张三,
        age:1
    }

    下面我只配置了三种情况
    text 就是用户数据关键字查询
    select 是用户选择指定数据查询
    dateTime 根据时间查询

    text 和 dateTime 没什么可说的，重要的是select
    我们之间来解析一条
    { label: "所属菜单", prop: 'menuId', type: 'select', options: dataList, valueKey: 'id', labelKey: 'menuName' },

    label 对应的是我们的名称
    prop 对应的则是字段
    type 类型就不说了，上面说了，目前就三种
    options：（数组对象）上面我会贴出测试数据
    我们这个查询是作用在select下拉菜单上的，且每次数组对象中的数据都是不同的，我们就需要两个变量去存对应的字段
    valueKey:select选择的值
    labelKey:select选择值对应的名称
*/
//默认当天
const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;
};
const queryData: QueryDataType[] = [
  // { label: "权限名称", prop: "menuPowerName", type: "text" },
  // {
  //   label: "所属菜单",
  //   prop: "menuId",
  //   type: "select",
  //   options: dataList,
  //   valueKey: "id",
  //   labelKey: "menuName"
  // },
  {
    label: "销售时间",
    prop: "saleDate",
    type: "date",
    defaultValue: getTodayDate()
  }
];

export { columnsData, queryData };
