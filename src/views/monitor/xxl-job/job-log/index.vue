<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="执行器" prop="jobGroup">
          <el-select
            v-model="queryParams.jobGroup"
            placeholder="请选择执行器"
            class="!w-220px"
            @keyup.enter="handleQuery()"
            @change="loadJobIdOptions"
          >
            <el-option
              v-for="item in jobGroupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="定时任务" prop="jobId">
          <el-select
            v-model="queryParams.jobId"
            placeholder="请选择定时任务"
            class="!w-220px"
            clearable
            @keyup.enter="handleQuery()"
          >
            <el-option
              v-for="item in jobIdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="调度时间" prop="triggerTime">
          <el-date-picker
            v-model="queryParams.triggerTime"
            type="daterange"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-256px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()">
            <template #icon>
              <Search/>
            </template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery()">
            <template #icon>
              <Refresh/>
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <el-table
        ref="dataTableRef"
        v-loading="loading"
        border
        :data="pageData"
        highlight-current-row
        show-overflow-tooltip
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column align="center" label="任务编号" prop="id"/>
        <el-table-column align="center" label="Handler" prop="executorHandler"/>
        <el-table-column align="center" label="任务参数" prop="executorParam">
          <template #default="scope">
            {{ scope.row.executorParam === null || scope.row.executorParam === '' ? "无" : scope.row.executorParam }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="调度时间" prop="triggerTime"/>
        <el-table-column align="center" label="结束时间" prop="handleTime"/>
        <el-table-column align="center" label="调度结果" prop="triggerCode">
          <template #default="scope">
            <DictLabel v-model="scope.row.triggerCode" code="triggerCode"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="执行备注" prop="handleMsg">
          <template #default="scope">
            {{ scope.row.handleMsg === null ? "无" : scope.row.handleMsg }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" link @click="openDetail(scope.row.triggerMsg)">
              <template #icon>
                <View/>
              </template>
              查看日志
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNumber"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery()"
      />
    </el-card>

    <!-- job-log表单弹窗 -->
    <job-log-details ref="detailRef"/>
  </div>
</template>

<script setup lang="ts">
import XxlJobGroupAPI from "@/api/monitor/job-group";
import XxlJobLogAPI, {XxlJobLogVO} from "@/api/monitor/job-log";
import JobLogDetails from "@/views/monitor/xxl-job/job-log/components/job-log-details.vue";

defineOptions({
  name: "XxlJobLog",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const route = useRoute();
const jobId = ref(Number(route.query.jobId) || undefined);
const jobGroup = ref(Number(route.query.jobGroup) || undefined);

const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  logStatus: -1,
  jobGroup: jobGroup.value as string | undefined,
  jobId: jobId.value as number | undefined,
  triggerTime: [] as any,
});

// job-log表格数据
const pageData = ref<XxlJobLogVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

/** 查询job-log */
async function handleQuery() {
  loading.value = true;
  XxlJobLogAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置job-log查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNumber = 1;
  queryParams.pageSize = 10;
  queryParams.logStatus = -1;
  handleQuery();
}

/** 详情操作 */
const detailRef = ref();

function openDetail(triggerMsg: string) {
  detailRef.value.open(triggerMsg);
}

/** 执行器下拉选项 */
const jobGroupOptions = ref<OptionType[]>([]);

/** 定时任务下拉选项 */
const jobIdOptions = ref<OptionType[]>([]);

/** 加载执行器 */
async function loadJobGroup() {
  try {
    jobGroupOptions.value = await XxlJobGroupAPI.getJobGroupList();
  } catch (error) {
    ElMessage.error("加载执行器失败");
  }
}

/** 加载定时任务 */
async function loadJobIdOptions() {
  try {
    jobIdOptions.value = await XxlJobLogAPI.getJobIdByGroup(queryParams.jobGroup);
  } catch (error) {
    ElMessage.error("加载定时任务失败");
    jobIdOptions.value = [];
  }
}

// 监听jobGroup变化，加载相应的定时任务数据
watch(() => queryParams.jobGroup, loadJobIdOptions);

onMounted(async () => {
  // 获取执行器列表
  await loadJobGroup();
  // 如果有初始 jobGroup，加载对应的任务列表
  if (queryParams.jobGroup) {
    await loadJobIdOptions();
  }
  await handleQuery();
});
</script>
