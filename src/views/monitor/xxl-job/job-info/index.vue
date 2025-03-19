<template>
  <div class="app-container">
    <div class="search-bar">
      <!-- 搜索表单 -->
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="执行器" prop="jobGroup">
          <el-select v-model="queryParams.jobGroup" class="!w-220px" placeholder="请选择执行器">
            <el-option
              v-for="item in jobGroupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="jobDesc">
          <el-input
            v-model="queryParams.jobDesc"
            placeholder="任务描述"
            clearable
            class="!w-220px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="Handler" prop="executorHandler">
          <el-input
            v-model="queryParams.executorHandler"
            placeholder="执行器任务handler"
            clearable
            class="!w-210px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="调度状态" prop="triggerStatus">
          <dictionary v-model="queryParams.triggerStatus" class="!w-220px" code="triggerStatus"/>
        </el-form-item>
        <el-form-item>
          <!-- 搜索和重置按钮 -->
          <el-button v-hasPerm="['monitor:job-info:query']" type="primary" @click="handleQuery">
            <template #icon>
              <Search/>
            </template>
            搜索
          </el-button>
          <el-button v-hasPerm="['monitor:job-info:query']" @click="handleResetQuery">
            <template #icon>
              <Refresh/>
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <!-- 表格头部操作按钮 -->
        <el-button v-hasPerm="['monitor:job-info:add']" type="success" @click="handleOpenDialog()">
          <el-icon>
            <Plus/>
          </el-icon>
          新增
        </el-button>
        <el-button
          v-hasPerm="['monitor:job-info:delete']"
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
        >
          <el-icon>
            <Delete/>
          </el-icon>
          删除
        </el-button>
      </template>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="pageData"
        highlight-current-row
        show-overflow-tooltip
        @selection-change="handleSelectionChange"
      >
        <!-- 表格列定义 -->
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column align="center" label="任务编号" prop="id"/>
        <el-table-column align="center" label="任务描述" width="240" prop="jobDesc"/>
        <el-table-column align="center" label="调度类型" prop="scheduleType">
          <template #default="scope">
            {{ scope.row.scheduleType }}: {{ scope.row.scheduleConf }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="运行模式" width="200" prop="executorHandler">
          <template #default="scope">
            {{ scope.row.glueType }}: {{ scope.row.executorHandler }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="负责人" width="120" prop="author"/>
        <el-table-column align="center" label="调度状态" width="120" prop="triggerStatus">
          <template #default="scope">
            <el-switch
              v-model="scope.row.triggerStatus"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              style="--el-switch-on-color: #13ce66"
              active-text="启动"
              inactive-text="停止"
              @change="handleTriggerStatus(scope.row.id, scope.row.triggerStatus)"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册节点" prop="addTime"/>
        <el-table-column align="center" label="上次调度时间" prop="triggerLastTime"/>
        <el-table-column align="center" label="下次调度时间" prop="triggerNextTime"/>
        <el-table-column fixed="right" label="操作" width="300">
          <template #default="scope">
            <!-- 每行的操作按钮 -->
            <el-button
              v-hasPerm="['monitor:job-info:add']"
              type="primary"
              size="small"
              link
              @click="handleTriggerDialog(scope.row.id, scope.row.executorParam)"
            >
              <template #icon>
                <Position/>
              </template>
              执行任务
            </el-button>
            <el-button
              v-hasPerm="['monitor:job-info:add']"
              type="primary"
              size="small"
              link
              @click="handleOpenJobLog(scope.row.id, scope.row.jobGroup)"
            >
              <template #icon>
                <View/>
              </template>
              日志详情
            </el-button>
            <el-button
              v-hasPerm="['monitor:job-info:update']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row)"
            >
              <template #icon>
                <Edit/>
              </template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['monitor:job-info:delete']"
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
            >
              <template #icon>
                <Delete/>
              </template>
              删除
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
        @pagination="handleQuery"
      />
    </el-card>

    <!-- 编辑弹窗 -->
    <EditTable ref="handleEditRef" :dataForm="formData" @success="handleQuery"/>

    <!-- 执行弹窗 -->
    <TriggerTable ref="handleTriggerRef" @success="handleQuery"/>
  </div>
</template>

<script setup lang="ts">
import EditTable from "@/views/monitor/xxl-job/job-info/EditTable.vue";
import TriggerTable from "@/views/monitor/xxl-job/job-info/TriggerTable.vue";
import MonitorXxlJobInfoAPI, {
  MonitorXxlJobInfoForm,
  MonitorXxlJobInfoVO,
} from "@/api/monitor/job-info";
import XxlJobGroupAPI from "@/api/monitor/job-group";
import router from "@/router";

defineOptions({
  name: "MonitorXxlJobInfo",
  inheritAttrs: false,
});

// 定义响应式数据
const queryFormRef = ref(ElForm);
const loading = ref(false); // 控制加载状态
const ids = ref<number[]>([]); // 选中的ID集合，用于批量操作
const total = ref(0); // 分页的总数

/** 执行器下拉选项 */
const jobGroupOptions = ref<OptionType[]>([]);

// 查询参数，包含分页和筛选条件
const queryParams = reactive({
  pageNumber: 1, // 当前页码
  pageSize: 10, // 每页数据条数
  jobGroup: '' as string | number,
  jobDesc: undefined,
  executorHandler: undefined,
  triggerStatus: -1
});

// job-info表格数据
const pageData = ref<MonitorXxlJobInfoVO[]>([]);

// 编辑表单数据
const formData = reactive<MonitorXxlJobInfoForm>({} as MonitorXxlJobInfoForm);

/** 查询job-info数据 */
async function handleQuery() {
  loading.value = true; // 开启加载状态
  try {
    const data = await MonitorXxlJobInfoAPI.getPage(queryParams);
    pageData.value = data.list; // 更新表格数据
    total.value = data.total; // 更新总记录数
  } catch (error) {
    ElMessage.error("查询数据失败");
  } finally {
    loading.value = false; // 关闭加载状态
  }
}

/** 重置查询条件 */
function handleResetQuery() {
  queryFormRef.value!.resetFields(); // 重置表单字段
  queryParams.pageNumber = 1; // 重置为第一页
  queryParams.jobGroup = jobGroupOptions.value[0].value
  handleQuery(); // 重新查询
}

/** 处理选中的行，更新ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 定时任务调度状态
 */
async function handleTriggerStatus(id?: number, status?: number) {
  try {
    await MonitorXxlJobInfoAPI.handleTriggerStatus(id, status);
    ElMessage.success(status ? "启动成功" : "停止成功");
  } catch (error) {
    ElMessage.error("操作失败");
  }
}

const handleTriggerRef = ref();

function handleTriggerDialog(id?: number, executorParam?: string) {
  handleTriggerRef.value.open(id, executorParam);
}

/** 打开编辑或新增对话框 */
const handleEditRef = ref();

/** 打开编辑或新增对话框 */
function handleOpenDialog(row?: MonitorXxlJobInfoForm) {
  // 清空所有属性
  Object.keys(formData).forEach((key) => {
    delete formData[key as keyof MonitorXxlJobInfoForm];
  });

  if (row?.id) {
    // 如果是编辑，则添加新数据
    Object.assign(formData, row);
    handleEditRef.value.open("修改定时任务");
  } else {
    formData.jobGroup = jobGroupOptions.value[0].value; // 执行器
    formData.scheduleType = "CRON"; // 调度类型
    formData.glueType = "BEAN"; // 运行模式
    formData.executorRouteStrategy = "FIRST"; //路由策略
    formData.misfireStrategy = "DO_NOTHING"; //调度过期策略
    formData.executorBlockStrategy = "SERIAL_EXECUTION"; // 阻塞处理策略
    formData.executorTimeout = 0; // 任务超时时间
    formData.executorFailRetryCount = 0; // 失败重试次数
    // 如果是新增，formData 已经被清空了
    handleEditRef.value.open("新增定时任务");
  }
}

/** 删除选中的job-info项 */
function handleDelete(id?: number) {
  const removeIds = id ? id.toString() : ids.value.join(",");
  if (!removeIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  // 弹出确认框
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    loading.value = true;
    try {
      await MonitorXxlJobInfoAPI.deleteByIds(removeIds); // 调用删除接口
      ElMessage.success("删除成功");
      handleResetQuery(); // 删除成功后重置查询
    } catch (error) {
      ElMessage.error("删除失败");
    } finally {
      loading.value = false;
    }
  });
}

function handleOpenJobLog(id?: number, jobGroup?: number) {
  router.push({
    path: "/monitor/job/job-log",
    query: {jobId: id, jobGroup: jobGroup},
  });
}

// 加载执行器
async function loadJobGroup() {
  try {
    const data = await XxlJobGroupAPI.getJobGroupList();
    jobGroupOptions.value = data;
    if (data.length > 0) {
      queryParams.jobGroup = data[0].value;
    } else {
      ElMessage.error("未找到可用的执行器");
    }
  } catch (error) {
    ElMessage.error("加载执行器失败");
  }
}

// 页面加载时初始化数据
onMounted(async () => {
  // 获取执行器列表
  await loadJobGroup();
  if (queryParams.jobGroup) {
    await handleQuery();
  }
});
</script>
