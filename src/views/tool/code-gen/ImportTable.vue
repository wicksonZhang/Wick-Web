<template>
  <el-dialog
    title="导入表"
    v-model="visible"
    width="880px"
    top="5vh"
    append-to-body
  >
    <!-- 查询表单 -->
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="数据源" prop="dataSourceId">
        <el-select
          v-model="queryParams.dataSourceId"
          @change="handleQuery"
          class="!w-240px"
          required
          placeholder="请选择数据源"
        >
          <el-option
            v-for="item in dataSourceList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入表名称"
          clearable
          class="!w-240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="请输入表描述"
          class="!w-240px"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格展示 -->
    <el-card shadow="never" class="table-container">
      <el-table
        @row-click="clickRow"
        v-loading="loading"
        ref="tableRef"
        :data="tableList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column
          prop="tableName"
          label="表名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="tableComment"
          label="表描述"
          :show-overflow-tooltip="true"
        />
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNumber"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleImportTable">导 入</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {ElTable} from "element-plus";
import GeneratorAPI, {CodeGenTableVO} from "@/api/tool/code-gen";
import ToolDataSourceAPI from "@/api/tool/data-source";

// 弹窗是否可见
const visible = ref(false);
const loading = ref(true);

// 表单引用和表格数据
const queryRef = ref(); // 查询表单引用
const tableRef = ref<typeof ElTable>(); // 表格引用
const dataSourceList = ref<OptionType[]>([]); // 数据源列表
const tableList = ref<CodeGenTableVO[]>([]); // 表格数据
const total = ref(0); // 总条目数

// 查询参数
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  dataSourceId: undefined as number | undefined,
  tableName: undefined as string | undefined,
  tableComment: undefined as string | undefined
});

// 异步加载数据源和表数据
async function open() {
  visible.value = true;
  await loadDataSources();
  if (queryParams.dataSourceId) {
    await getList(); // 数据源加载后再获取表格数据
  }
}

// 加载数据源
async function loadDataSources() {
  try {
    await ToolDataSourceAPI.getOptions().then((data) => {
      dataSourceList.value = data;
      if (data.length > 0) {
        queryParams.dataSourceId = Number(data[0].value);
      } else {
        ElMessage.error("未找到可用的数据源");
      }
    });
  } catch (error) {
    ElMessage.error("加载数据源失败");
  }
}

/** 获取表数据 */
async function getList() {
  if (!queryParams.dataSourceId) {
    ElMessage.warning("请先选择数据源");
    return;
  }

  loading.value = true;
  GeneratorAPI.getDataSourceTableList(queryParams)
    .then((data) => {
      tableList.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

defineExpose({open}); // 暴露 `open` 方法，供外部调用

/** 执行搜索操作 */
function handleQuery() {
  queryParams.pageNumber = 1; // 搜索时重置页码
  getList();
}

/** 重置搜索表单 */
function resetQuery() {
  queryRef.value.tableName = undefined; // 重置表单
  queryRef.value.tableComment = undefined; // 重置表单
  handleQuery(); // 重新搜索
}

/** 单击选择行，支持多选 */
function clickRow(row: any) {
  tableRef.value?.toggleRowSelection(row);
}

// 多选框选中的表名
const tables = ref<string[]>([]);

/** 处理多选框选中数据 */
function handleSelectionChange(selection: any[]) {
  tables.value = selection.map((item) => item.tableName);
}

// 导入表
async function handleImportTable() {
  const tableNames = tables.value.join(",");
  if (!tableNames) {
    ElMessage.error("请选择要导入的表");
    return;
  }

  const dataSourceId = queryParams.dataSourceId;
  if (!dataSourceId) {
    ElMessage.error("请选择数据源");
    return;
  }

  try {
    await GeneratorAPI.importTable(tableNames, dataSourceId);
    ElMessage.success("导入成功");
    visible.value = false;
    emit("success");
  } catch {
    ElMessage.error("导入失败");
  }
}

// 触发导入成功事件
const emit = defineEmits(["success"]);
</script>
