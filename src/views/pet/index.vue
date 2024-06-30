<template>
  <div>
    <!-- TableModule  tableModule是一个对象，下面有解释 -->
    <el-button type="primary" @click="exportExcel">导出</el-button>
    <TableModule ref="TableModuleRef" v-model:queryForm="tableModule.queryForm" :tableModule="tableModule">
      <!-- #event是插入的新增按钮和删除按钮，具体操作按照自己的业务流程实现 -->
      <!-- <template #event>
        <el-button type="primary" @click="Add">新增</el-button>
        <el-button type="danger" @click="Delete">删除</el-button>
      </template> -->
      <!-- #tableColumn 插入表格的操作列 -->
      <!-- <template #tableColumn>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button @click="Edit(scope)">编辑</el-button>
          </template>
        </el-table-column>
      </template> -->
    </TableModule>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref, onMounted, computed } from "vue";
import { columnsData, queryData } from "./table"; // 引入我们配置好的数据
import TableModule from "@/views/pet/TableModule.vue";
import type { TableModuleType } from "./pet.ts";
import { getTodayDate } from "@/api/util.ts";
import { queryAllData, PetReportResult } from "@/api/pet.ts";
import { aoa_to_sheet, openDownloadXLSXDialog, s2ab } from "@/utils/excel.ts";
import { ElMessage } from "element-plus";
const TableModuleRef = ref();

const excelData = [
  ["姓名", "专业技能", undefined, undefined, undefined, undefined, undefined],
  [undefined, "前端", undefined, "后端", undefined, undefined, undefined],
  [undefined, "JavaScript", "CSS", "java", undefined, "框架", undefined],
  [undefined, undefined, undefined, "nio", "基础", "SpringBoot", "MyBatis"],
  ["张三", "熟练", "一般", "了解", "精通", "熟练", "了解"]
];
const sheetName = "xlsx复杂表格导出demo";
const exportExcel = () => {
  let ws = aoa_to_sheet(excelData, 4);
  // 头部冻结
  ws["!freeze"] = {
    xSplit: "1",
    ySplit: "" + 4,
    topLeftCell: "B" + (4 + 1),
    activePane: "bottomRight",
    state: "frozen"
  };
  // 列宽
  ws["!cols"] = [{ wpx: 265 }];
  let workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  };
  workbook.Sheets[sheetName] = ws;
  // excel样式
  let wopts: WritingOptions = {
    bookType: "xlsx",
    bookSST: false,
    type: "binary",
    cellStyles: true
  };
  let wbout = XLSX.write(workbook, wopts);
  let blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  openDownloadXLSXDialog(blob, sheetName + ".xlsx");
};

onMounted(() => {
  getDataList();
});

const state = reactive<TableModuleType>({
  columns: columnsData, // 表格配置
  query: queryData, // 查询条件配置
  queryForm: { saleDate: [getTodayDate(-1), getTodayDate()] }, // 查询form表单
  loading: false, // 加载状态
  dataList: [], // 列表数据
  pages: {
    // 分页数据
    total: 0,
    limit: 20,
    page: 1
  }
});
const { loading, dataList, columns, pages, query, queryForm } = toRefs(state);

// 传给子组件的
const tableModule = ref<TableModuleType>({
  editInputBlur: editInputBlur, // 可编辑单元的，失去焦点时的回调
  callback: getDataList, // 回调，子组件中可以看到很多调用callback的，这里对应的是获取列表数据的方法
  // 以下不说了，上面都给解释了
  queryForm: queryForm.value,
  columns: columns.value,
  dataList: dataList.value,
  loading: loading.value,
  pages: pages.value,
  query: query.value
});
// 将tableModule定义为计算属性
// const tableModule = computed<TableModuleType>(() => ({
//   editInputBlur: editInputBlur,
//   callback: getDataList,
//   queryForm: queryForm.value,
//   columns: columns.value,
//   dataList: dataList.value, // 直接引用state.dataList
//   loading: loading.value,
//   pages: pages.value,
//   query: query.value
// }));

// 获取列表信息
async function getDataList() {
  if (!state.queryForm.saleDate && state.queryForm.saleDate.length != 2) {
    ElMessage({
      message: "请选择销售日期",
      type: "warning"
    });
    return;
  }
  const params = {
    startDate: state.queryForm.saleDate[0],
    endDate: state.queryForm.saleDate[1]
  };
  state.loading = true;
  // 掉自己的接口，切勿复制粘贴
  const res: PetReportResult = await queryAllData({
    ...params
  });
  state.loading = false;
  if (res.code != "000000") {
    ElMessage.error(res.msg.trim());
    return;
  }
  state.dataList = res.data && res.data.dataList;
  tableModule.value.dataList = res.data && res.data.dataList;
  state.pages.total = res.data && res.data.dataList.length;
}

function Add() {
  // 新增事件
}

function Edit(row: any) {
  // 编辑事件
  console.log(row);
}

function Delete() {
  // 删除事件
}

function editInputBlur() {
  console.log("失去焦点回调");
}
</script>

<style scoped></style>
