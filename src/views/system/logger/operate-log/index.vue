<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <!-- 搜索工作栏 -->
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="操作人" prop="userId">
          <el-select
            v-model="queryParams.userId"
            clearable
            filterable
            placeholder="请输入操作人员"
            class="!w-240px"
          >
            <el-option label="系统管理员" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作模块" prop="subType">
          <el-input
            v-model="queryParams.module"
            placeholder="请输入操作模块"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="操作类型" prop="type">
          <dictionary class="!w-240px" v-model="queryParams.type" code="operateType"/>
        </el-form-item>
        <el-form-item label="操作时间" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-256px"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-hasPerm="['system:operate-log:query']"
            type="primary"
            @click="handleQuery"
          >
            <template #icon><Search /></template>
            搜索
          </el-button>
          <el-button
            v-hasPerm="['system:operate-log:query']"
            @click="resetQuery"
          >
            <template #icon><Refresh /></template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 && 分页条 -->
    <el-card
      shadow="never"
      class="table-container"
      :show-overflow-tooltip="true"
    >
      <template #header>
        <div class="flex-x-between">
          <el-button
            v-hasPerm="['system:operate-log:export']"
            @click="handleExport"
          >
            <template #icon><Download /></template>
            导出
          </el-button>
        </div>
      </template>
      <el-table v-loading="loading" :data="pageData">
        <el-table-column label="日志编号" align="center" width="120" prop="id" />
        <el-table-column label="操作人" align="center" width="110" prop="userName" />
        <el-table-column label="操作地址" align="center" prop="userIp" />
        <el-table-column
          label="操作地点"
          width="120"
          align="center"
          prop="operateLocation"
        />
        <el-table-column label="操作模块" align="center" prop="module" />
        <el-table-column
          label="操作名"
          align="center"
          prop="name"
          width="180"
        />
        <el-table-column label="操作类型"  width="100" align="center" prop="type">
          <template #default="scope">
            <DictLabel v-model="scope.row.type" code="operateType"/>
          </template>
        </el-table-column>
        <el-table-column label="操作结果" width="100" align="center" prop="status">
          <template #default="scope">
            <DictLabel v-model="scope.row.resultCode" code="resultCode"/>
          </template>
        </el-table-column>
        <el-table-column
          label="操作日期"
          align="center"
          prop="startTime"
          width="180"
        >
          <template #default="scope">
            <span>{{ scope.row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行时长" width="120" align="center" prop="startTime">
          <template #default="scope">
            <span>{{ scope.row.duration }} ms</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="85">
          <template #default="scope">
            <el-button link type="primary" @click="openDetail(scope.row)">
              <template #icon><View /></template>
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页条 -->
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNumber"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>

    <!-- 详细数据 -->
    <operate-log-detail ref="detailRef" />
  </div>
</template>

<script setup lang="ts">
import OperateLogDetail from "@/views/system/logger/operate-log/components/UperateLogDetail.vue";
import LoggerAPI, { OperateLogPageVO } from "@/api/system/logger";
import DictLabel from "@/components/Dict/DictLabel.vue";

defineOptions({
  name: "OperateLog",
  inheritAttrs: false,
});

const loading = ref(false); // 列表的加载中
const queryFormRef = ref(); // 搜索的表单
const total = ref(0); // 数据总数
const pageData = ref<OperateLogPageVO[]>();

const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  userId: undefined,
  type: undefined,
  module: undefined,
  createTime: [] as any,
});

/** 搜索按钮操作 */
function handleQuery() {
  loading.value = true;
  LoggerAPI.getOperateLogPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置按钮操作 */
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

/** 详情操作 */
const detailRef = ref();

function openDetail(row: OperateLogPageVO) {
  detailRef.value.open(row);
}

/** 导出按钮操作 */
function handleExport() {
  LoggerAPI.exportOperateLog(queryParams).then((response: any) => {
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

onMounted(async () => {
  await handleQuery();
  // 获得用户列表
  // userList.value = await getSimpleUserList()
});
</script>
