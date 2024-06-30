<template>
  <el-card class="table-module">
    <!-- 查询 -->
    <!-- 
            实现：通过我们配置好的 查询条件
                首先去创建form表单，根据我们配置的查询条件去做一个循环判断，展示出不用类型所对应不同的输入框
                比如：text对应普通的输入框，select对应下拉选择，dateTime对应日期时间选择器
                在使用时，父组件会传来一个queryForm空的对象，
                循环出来的输入框会绑定表格配置中的prop字段绑定在queryForm对象中
         -->
    <div ref="queryRef" class="query">
      <div class="query-content">
        <el-form :model="localQueryForm" style="display: flex" label-position="left" class="query-form">
          <el-form-item v-for="item in props.tableModule.query" :key="item.prop" :label="item.label"
            style="margin-right: 20px; margin-bottom: 0px">
            <el-input v-if="item.type == 'text'" v-model="localQueryForm[item.prop]" clearable
              :placeholder="'输入' + item.label + '关键字'" />
            <el-select v-else-if="item.type == 'select'" v-model="localQueryForm[item.prop]" style="width: 240px"
              clearable :placeholder="'选择' + item.label + '关键字'">
              <el-option v-for="cItem in item.options" :key="cItem[item.valueKey]" :label="cItem[item.labelKey]"
                :value="cItem[item.valueKey]" />
            </el-select>
            <el-date-picker v-else-if="item.type == 'date'" v-model="localQueryForm[item.prop]" clearable
              type="datetimerange" format="YYYY/MM/DD" value-format="YYYY-MM-DD" range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" />
          </el-form-item>
        </el-form>
      </div>
      <div class="slot">
        <el-button type="primary" plain @click="Search">查询</el-button>
        <el-button @click="Recover">重置</el-button>
        <el-button @click="exportExcel">导出excel</el-button>
        <!-- slot插槽（用来添加表格其他操作，比如，新增数据，删除数据等其他操作） -->
        <slot name="event" />
        <!-- 
                    动态表头显示，根据表格每条配置项中的show字段来决定改列是否显示或者隐藏 
                    columns 就是我们表格配置的数组对象
                -->
        <el-popover placement="bottom" title="表格配置" :width="200" trigger="click">
          <div v-for="(item, index) in props.tableModule.columns" :key="index">
            <el-checkbox v-model="item.show" :label="item.label" :true-value="1" :false-value="0" />
          </div>
          <template #reference>
            <!-- 一个Element Plus中的图标 -->
            <el-button :icon="Operation" />
          </template>
        </el-popover>
      </div>
    </div>
    <!-- 表格 -->
    <!-- style中是计算表格的高度的 -->
    <el-table id="el-table" ref="tableRef" v-loading="props.tableModule.loading" :data="props.tableModule.dataList"
      border height="100%" style="height: calc(100vh - 245px)" @cell-dblclick="cellDblClick">
      >
      <el-table-column type="selection" width="50" align="center" />
      <!-- columns表格配置数据 -->
      <template v-for="(item, key) in props.tableModule.columns">
        <!-- 循环 columns 紧接着判断每个字段的类型 -->
        <el-table-column v-if="item.show" :key="key" :prop="item.prop" :label="item.label" :min-width="item.min_width"
          :align="item.align || 'left'">
          <template #default="scope">
            <!-- switch时使用switch开关组件，并且绑定好我们配置的属性 -->
            <div v-if="item.type == 'switch'">
              <el-switch v-model="scope.row[item.prop]" :active-value="item.activeValue"
                :inactive-value="item.inactiveValue" @change="props.tableModule.switchChange(scope.row)" />
            </div>
            <!-- status 时 使用fieldChange方法匹配出值对应的名称并返回 -->
            <div v-else-if="item.type == 'status'">
              <el-tag>{{
          fieldChange(scope.row[item.prop], item.option)
        }}</el-tag>
            </div>
            <!-- image 就是使用 el-image展示我们的图片咯 -->
            <div v-else-if="item.type == 'image'">
              <el-image style="width: 60px; height: 60px" :src="scope.row[item.prop]"
                :preview-src-list="[scope.row[item.prop]]" :preview-teleported="true" />
            </div>
            <!-- formatDate 方法将时间戳格式化为年月日时分秒的格式 -->
            <div v-else-if="item.type == 'time'">
              {{ scope.row[item.prop] }}
            </div>
            <!-- 可编辑单元格 -->
            <div v-else-if="item.isEdit">
              <el-input v-if="scope.row['Indexs'] == rowIndex &&
          scope.column['Indexs'] == columnIndex
          " ref="inputRef" v-model="scope.row[item.prop]" :placeholder="'请输入' + item.label" autofocus
                @blur="inputBlur(scope.row)" />
              <div v-else>{{ scope.row[item.prop] }}</div>
            </div>
            <!-- 类型都不匹配时直接展示 -->
            <div v-else>{{ scope.row[item.prop] }}</div>
          </template>
        </el-table-column>
      </template>
      <!-- 这里的插槽用于列表的操作列 -->
      <slot name="tableColumn" />
    </el-table>
    <!-- 分页 -->
    <!-- 分页这里没什么可说的，父组件传三个参数，当前页，每页条数，总条数就可以了。 -->
    <div class="page">
      <el-pagination v-model:page-size="pages.limit" :current-page="pages.page" :page-sizes="pageSizes" :layout="layout"
        :total="pages.total" @size-change="sizeChange" @current-change="currentChange" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import {
  defineEmits,
  computed,
  defineProps,
  onMounted,
  reactive,
  toRefs,
  ref
} from "vue";
import { utils, writeFile } from "xlsx";

import { ElTable } from "element-plus";
import { Operation } from "@element-plus/icons-vue";
import { getTodayDate } from "@/api/util.ts";

import type { PetReportItem, ColumnConfigProps } from "./pet.ts";
const emit = defineEmits(["update:queryForm", "update:pages"]);
import { aoa_to_sheet, openDownloadXLSXDialog, s2ab } from "@/utils/excel.ts";

const exportExcel = () => {
  const sheetName = "松子经营报表";
  const res: string[][] = props.tableModule.dataList.map(
    (item: PetReportItem) => {
      const arr = [];
      props.tableModule.columns.forEach((column: ColumnConfigProps) => {
        arr.push(item[column.prop]);
      });
      return arr;
    }
  );
  const titleList: string[] = [];
  props.tableModule.columns.forEach((column: ColumnConfigProps) => {
    titleList.push(column.label);
  });

  let ws = aoa_to_sheet(res, 1);
  // 头部冻结
  ws["!freeze"] = {
    xSplit: "1",
    ySplit: "" + 1,
    topLeftCell: "B" + (1 + 1),
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
  let wopts = {
    bookType: "xlsx",
    bookSST: false,
    type: "binary",
    cellStyles: true
  };
  let wbout = XLSX.write(workbook, wopts);
  let blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  openDownloadXLSXDialog(blob, sheetName + ".xlsx");
};

//导出Excel
const exportExcel1 = () => {
  const res: string[][] = props.tableModule.dataList.map(
    (item: PetReportItem) => {
      const arr = [];
      props.tableModule.columns.forEach((column: ColumnConfigProps) => {
        arr.push(item[column.prop]);
      });
      return arr;
    }
  );
  const titleList: string[] = [];
  props.tableModule.columns.forEach((column: ColumnConfigProps) => {
    titleList.push(column.label);
  });
  res.unshift(titleList);
  const workSheet = utils.aoa_to_sheet(res);
  // 根据column.width设置列宽
  if (!workSheet["!cols"]) {
    workSheet["!cols"] = [];
  }
  props.tableModule.columns.forEach(
    (column: ColumnConfigProps, index: number) => {
      const widthInChars = (column.min_width || column.width || 80) / 5; // 假设width是以字符宽度给出的
      workSheet["!cols"][index] = { wch: widthInChars }; // 设置列宽
    }
  );
  const workBook = utils.book_new();
  utils.book_append_sheet(workBook, workSheet, "松子经营报表");
  writeFile(workBook, "petQuery.xlsx");
};

const localQueryForm = computed({
  get() {
    return props.tableModule.queryForm;
  },
  set(value) {
    emit("update:queryForm", value);
  }
});

const pages = computed({
  get() {
    return props.tableModule.pages;
  },
  set(value) {
    emit("update:pages", value);
  }
});

const props = defineProps({
  tableModule: {
    type: Object,
    required: true
  }, // 由父组件传递而来
  layout: {
    // 分页功能配置
    type: String,
    default: "total, sizes, prev, pager, next"
  },
  pageSizes: {
    // 分页：每页条数配置
    type: Array,
    default() {
      return [10, 20, 30, 50];
    }
  }
});

const state = reactive({
  rowIndex: 0, // 行索引 用于可编辑单元格
  columnIndex: 0, // 列索引 用于可编辑单元格
  queryHeight: 0
});

const { rowIndex, columnIndex, queryHeight } = toRefs(state);

const queryRef = ref(null);

onMounted(() => {
  // 这里拿到query模块的高度，适配页面高度的
  // setTimeout(() => {
  //   state.queryHeight = queryRef.value.clientHeight;
  // }, 100);

  // 为每个表格配置项添加show属性，默认1为显示状态
  props.tableModule.columns.forEach(item => {
    item.show = 1;
  });
});

function fieldChange(row, option) {
  if (option[row]) {
    return option[row];
  }
}

// 编辑单元格 ----------
// 为每一行返回固定的className
function tableRowClassName({ row, rowIndex }) {
  row.Indexs = rowIndex;
}

// 为所有单元格设置一个固定的 className
function tableCellClassName({ column, columnIndex }) {
  column.Indexs = columnIndex;
}

// el-table单元格双击事件
function cellDblClick(row, column, cell, event) {
  state.rowIndex = row.Indexs;
  state.columnIndex = column.Indexs;
}

// input失去焦点
function inputBlur(row) {
  state.rowIndex = 0;
  state.columnIndex = 0;
  props.tableModule.editInputBlur(); // 父组件的方法，
}

// 每页条数切换时触发
function sizeChange(item) {
  pages.value.limit = item;
  props.tableModule.callback(); // 父组件绑定的回调
}

// 页数切换时触发
function currentChange(item) {
  pages.value.page = item;
  props.tableModule.callback();
}

// 点击查询按钮时触发
function Search() {
  console.log(localQueryForm, "获取到查询的查询条件");
  props.tableModule.callback();
}

// 点击重制触发
function Recover() {
  console.log("重置");
  localQueryForm.value = { saleDate: [getTodayDate(-1), getTodayDate()] };
  console.log("重置");
  props.tableModule.callback();
}
</script>

<style scoped lang="scss">
.table-module {
  .query {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;

    .query-content {
      display: flex;
      align-items: flex-start;

      .query-form {
        .el-form-item {
          margin: 0px;
          margin-right: 20px;
        }

        .el-input {
          width: 200px;
        }

        ::v-deep(.el-select) {
          .el-input {
            width: 200px;
          }
        }
      }
    }

    .slot {
      display: flex;
      justify-content: flex-end;
      padding-right: 48px;
    }
  }

  .page {
    margin-top: 10px;
  }
}
</style>
