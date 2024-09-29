<template>
  <div class="app-container">
    <!-- 搜索框 - 用于过滤表格数据 -->
    <div class="search-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
        <!-- 表名称输入框，支持回车键触发搜索 -->
        <el-form-item label="表名称" prop="tableName">
          <el-input
            v-model="queryParams.tableName"
            placeholder="请输入表名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <!-- 表描述输入框，支持回车键触发搜索 -->
        <el-form-item label="表描述" prop="tableComment">
          <el-input
            v-model="queryParams.tableComment"
            placeholder="请输入表描述"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <!-- 创建时间选择器，支持选择日期范围 -->
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            type="daterange"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-240px"
          />
        </el-form-item>
        <!-- 搜索与重置按钮 -->
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">
            搜索
          </el-button>
          <el-button icon="Refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表单数据展示区域 -->
    <el-card shadow="never" class="table-container">
      <template #header>
        <!-- 导入按钮 -->
        <el-button
          v-hasPerm="['tools:code-gen:import']"
          type="success"
          icon="Upload"
          @click="openImportTable()"
        >
          导入
        </el-button>
        <!-- 删除按钮，支持多选 -->
        <el-button
          v-hasPerm="['tools:code-gen:delete']"
          type="danger"
          icon="Delete"
          :disabled="removeIds.length === 0"
          @click="handleDelete()"
        >
          删除
        </el-button>
      </template>

      <!-- 表格展示 -->
      <el-table
        v-loading="loading"
        highlight-current-row
        :data="tableList"
        :show-overflow-tooltip="true"
        border
        @selection-change="handleSelectionChange"
      >
        <!-- 多选框列 -->
        <el-table-column type="selection" align="center" width="55" />
        <!-- 序号列，动态计算当前页数序号 -->
        <el-table-column label="序号" type="index" width="80" align="center">
          <template #default="scope">
            <span>
              {{
                (queryParams.pageNumber - 1) * queryParams.pageSize +
                scope.$index +
                1
              }}
            </span>
          </template>
        </el-table-column>
        <!-- 表名称列，显示表的名称信息 -->
        <el-table-column label="表名称" align="center" prop="tableName" />
        <!-- 表描述列 -->
        <el-table-column label="表描述" align="center" prop="tableComment" />
        <!-- 类名列 -->
        <el-table-column label="类名" align="center" prop="className" />
        <!-- 创建时间列 -->
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <!-- 更新时间列 -->
        <el-table-column label="更新时间" align="center" prop="updateTime" />
        <!-- 操作列，包含预览、编辑、删除、同步、生成代码操作 -->
        <el-table-column label="操作" align="center" width="350">
          <template #default="scope">
            <el-button
              link
              type="success"
              size="small"
              icon="View"
              @click="handlePreview(scope.row)"
            >
              预览
            </el-button>
            <el-button
              v-hasPerm="['tools:code-gen:update']"
              link
              type="primary"
              size="small"
              icon="Edit"
              @click="handleEditTable(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPerm="['tools:code-gen:delete']"
              link
              type="danger"
              size="small"
              icon="Delete"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
            <el-button
              v-hasPerm="['tools:code-gen:async']"
              link
              type="warning"
              size="small"
              icon="Refresh"
              @click="handleSyncDb(scope.row)"
            >
              同步
            </el-button>
            <el-button
              v-hasPerm="['tools:code-gen:codeGen']"
              link
              type="primary"
              size="small"
              icon="Download"
              @click="handleGenTable(scope.row)"
            >
              生成代码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNumber"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 弹窗组件 -->
    <ImportTable ref="importRef" @success="handleQuery" />
    <!-- 导入表弹窗 -->
    <PreviewCode ref="previewRef" />
    <!-- 预览代码弹窗 -->
    <EditTable ref="handleEditRef" />
    <!-- 编辑代码弹窗 -->
  </div>
</template>

<script lang="ts" setup>
import ImportTable from "@/views/tools/codeGen/ImportTable.vue";
import PreviewCode from "@/views/tools/codeGen/PreviewCode.vue";
import GeneratorAPI, {
  CodeGenTablePageQuery,
  CodeGenTableVO,
} from "@/api/tools/generator";
import EditTable from "@/views/tools/codeGen/EditTable.vue";

const queryRef = ref(ElForm); // 表单引用，用于重置表单
const tableList = ref<CodeGenTableVO[]>([]); // 表格数据
const loading = ref(true); // 加载状态
const removeIds = ref([]);
const total = ref(0); // 表格数据总数
const tableNames = ref([]); // 选中表格的名称
const createTime = ref([]); // 创建时间范围
const queryParams = reactive<CodeGenTablePageQuery>({
  // 查询参数，包括分页信息
  pageNumber: 1,
  pageSize: 10,
});

/** 获取表格数据 */
async function getList() {
  loading.value = true;
  GeneratorAPI.getCodeGenTableList(queryParams)
    .then((data) => {
      tableList.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 搜索功能：重新获取数据，页码重置为第一页 */
async function handleQuery() {
  queryParams.pageNumber = 1;
  await getList();
}

/** 生成代码功能 */
function handleGenTable(row: CodeGenTableVO) {
  console.log(row); // 打印行数据，实际开发中应调用生成代码API
}

/** 同步数据库操作 */
function handleSyncDb(row: CodeGenTableVO) {
  ElMessageBox.confirm("确认要强制同步" + row.tableName + "表结构吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      GeneratorAPI.syncCodegenFromDB(row.id)
        .then(() => {
          ElMessage.success("代码同步成功");
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消代码同步");
    }
  );
}

/** 打开导入表弹窗 */
const importRef = ref();
function openImportTable() {
  importRef.value.open();
}

/** 重置搜索条件，并重新获取数据 */
function handleResetQuery() {
  queryRef.value.resetFields(); // 重置表单
  createTime.value = []; // 清空时间范围
  getList();
}

/** 预览代码功能 */
const previewRef = ref();

function handlePreview(row: CodeGenTableVO) {
  previewRef.value.open(row.id, row.tableName);
}

/** 多选框选中数据时的操作 */
const handleSelectionChange = (selection: any) => {
  removeIds.value = selection.map((item: any) => item.id);
  tableNames.value = selection.map((item: any) => item.tableName);
};

/** 编辑表功能 */
const handleEditRef = ref();
function handleEditTable(row: CodeGenTableVO) {
  handleEditRef.value.open(row.id, row.tableName);
}

/** 删除表功能 */
function handleDelete(id?: number) {
  const tableIds = [id || removeIds.value].join(",");
  if (!tableIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      GeneratorAPI.deleteByIds(tableIds)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

/** 组件挂载时，自动加载数据 */
onMounted(async () => {
  await getList();
});
</script>
