<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="登录地址" prop="userIp">
          <el-input
            v-model="queryParams.userIp"
            placeholder="请输入登录地址"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="登录日期" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            type="daterange"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-256px"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-hasPerm="['system:login-log:query']"
            type="primary"
            @click="handleQuery"
          >
            <template #icon><Search /></template>
            搜索
          </el-button>
          <el-button v-hasPerm="['system:login-log:query']" @click="resetQuery">
            <template #icon><Refresh /></template>
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
            v-hasPerm="['system:login-log:export']"
            @click="handleExport"
          >
            <template #icon><Download /></template>
            导出
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="pageData"
        :show-overflow-tooltip="true"
      >
        <el-table-column label="日志编号" align="center" prop="id" />
        <el-table-column
          label="用户名称"
          align="center"
          prop="userName"
          width="180"
        />
        <el-table-column label="登录类型" align="center">
          <template #default="scope">
            <DictLabel v-model="scope.row.logType" code="loginType"/>
          </template>
        </el-table-column>
        <el-table-column
          label="登录IP"
          align="center"
          prop="userIp"
          width="180"
        />
        <el-table-column
          label="登录地点"
          align="center"
          prop="loginLocation"
          width="180"
        />
        <el-table-column label="浏览器" align="center" prop="userAgent" />
        <el-table-column label="操作系统" align="center" prop="os" />
        <el-table-column label="登陆结果" align="center" prop="result">
          <template #default="scope">
            <DictLabel v-model="scope.row.result" code="result"/>
          </template>
        </el-table-column>
        <el-table-column
          label="登录日期"
          align="center"
          prop="createTime"
          width="180"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
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
import LoggerAPI, { LoginLogPageVO } from "@/api/system/logger";
import DictLabel from "@/components/Dict/DictLabel.vue";

defineOptions({
  name: "LoginLog",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const loading = ref(false);
const createTime = ref([]);
/** 用户登录日志查询参数  */
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  userName: undefined,
  userIp: undefined,
  createTime: [] as any,
});

const total = ref(0); // 数据总数
const pageData = ref<LoginLogPageVO[]>();

/** 查询 */
function handleQuery() {
  loading.value = true;
  LoggerAPI.getPage(queryParams)
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
  createTime.value = [];
  handleQuery();
}

/**
 * 导出
 */
function handleExport() {
  LoggerAPI.exportLoginLog(queryParams).then((response: any) => {
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

onMounted(() => {
  handleQuery();
});
</script>
