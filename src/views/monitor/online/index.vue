<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入登录名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="登录地址" prop="loginAddress">
          <el-input
            v-model="queryParams.loginAddress"
            placeholder="请输入登录地址"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-hasPerm="['monitor:online:query']"
            type="primary"
            icon="search"
            @click="handleQuery"
          >
            搜索
          </el-button>
          <el-button
            v-hasPerm="['monitor:online:query']"
            @click="resetQuery"
            icon="refresh"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="never" class="table-container">
      <template #header>
        <div class="flex-x-between">
          <el-button
            v-hasPerm="['monitor:online:export']"
            @click="handleExport"
          >
            <template #icon>
              <Download />
            </template>
            导出
          </el-button>
        </div>
      </template>

      <el-table
        border
        v-loading="loading"
        :data="pageData"
        :show-overflow-tooltip="true"
      >
        <el-table-column
          label="会话编号"
          align="center"
          prop="sessionId"
          width="280"
        />
        <el-table-column
          label="登录名称"
          align="center"
          prop="username"
          width="180"
        />
        <el-table-column label="部门名称" align="center" prop="deptName" />
        <el-table-column label="登录IP" align="center" prop="loginIp" />
        <el-table-column label="登录地址" align="center" prop="loginAddress" />
        <el-table-column
          label="登录时间"
          align="center"
          prop="loginDate"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
        <el-table-column label="操作" align="center" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="forceQuit(scope.row.sessionId)"
            >
              <template #icon>
                <RefreshLeft />
              </template>
              强制退出
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--   分页条   -->
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNumber"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import OnlineAPI, { MonitorOnlinePageVO } from "@/api/monitor/online";
import LoggerAPI from "@/api/system/logger";

defineOptions({
  name: "Online",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const loading = ref(false);
const total = ref(0); // 数据总数
const pageData = ref<MonitorOnlinePageVO[]>();

/** 用户登录日志查询参数  */
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  username: undefined,
  loginAddress: undefined,
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  OnlineAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

/**
 * 导出
 */
function handleExport() {
  OnlineAPI.exportOnline(queryParams).then((response: any) => {
    const fileData = response.data;
    const fileName = decodeURI(
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    );
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";

    const blob = new Blob([fileData], { type: fileType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadUrl);
  });
}

/**
 * 强制退出
 */
function forceQuit(sessionId: string) {
  ElMessageBox.confirm("确认强制退出已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      OnlineAPI.forceQuit(sessionId)
        .then(() => {
          ElMessage.success("操作成功");
          resetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消操作");
    }
  );
}

onMounted(() => {
  handleQuery();
});
</script>
