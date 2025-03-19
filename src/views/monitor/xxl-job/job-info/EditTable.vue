<template>
  <div>
    <el-drawer
      v-model="dialogVisible"
      :size="1320"
      style="max-width: 100%"
      class="remove-el-drawer-header-margin-bottom"
      :title="titleName"
      :destroy-on-close="true"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="130px">
        <!-- 基础配置 -->
        <el-divider content-position="left">
          <strong style="font-size: 15px">基础配置</strong>
        </el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="执行器" prop="jobGroup">
              <el-select v-model="formData.jobGroup" placeholder="请选择执行器">
                <el-option
                  v-for="item in jobGroupOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="负责人" prop="author">
              <el-input v-model="formData.author" placeholder="请输入负责人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务描述" prop="jobDesc">
              <el-input v-model="formData.jobDesc" placeholder="请输入任务描述"/>
            </el-form-item>
            <el-form-item label="报警邮件" prop="alarmEmail">
              <el-input v-model="formData.alarmEmail" placeholder="请输入报警邮件"/>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 调度配置 -->
        <el-divider content-position="left">
          <strong style="font-size: 15px">调度配置</strong>
        </el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="调度类型" prop="scheduleType">
              <dictionary v-model="formData.scheduleType" code="scheduleType"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Cron" prop="scheduleConf">
              <el-input v-model="formData.scheduleConf" placeholder="请输入cron执行表达式">
                <template #append>
                  <el-button type="primary" @click="handleShowCron">
                    生成表达式
                    <i class="el-icon-time el-icon--right"/>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 任务配置 -->
        <el-divider content-position="left">
          <strong style="font-size: 15px">任务配置</strong>
        </el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="运行模式" prop="glueType">
              <dictionary
                v-model="formData.glueType"
                code="glueType"
                :disabled="formData.id !== undefined"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="JobHandler" prop="executorHandler">
              <el-input v-model="formData.executorHandler" placeholder="请输入执行器任务handler"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="任务参数" prop="executorParam">
              <el-input
                v-model="formData.executorParam"
                type="textarea"
                placeholder="请输入任务参数"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 高级配置 -->
        <el-divider content-position="left">
          <strong style="font-size: 15px">高级配置</strong>
        </el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路由策略" prop="executorRouteStrategy">
              <dictionary v-model="formData.executorRouteStrategy" code="executorRouteStrategy"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子任务ID" prop="childJobid">
              <el-input v-model="formData.childJobid" placeholder="请输入子任务ID，多个逗号分隔"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="调度过期策略" prop="executorBlockStrategy">
              <dictionary v-model="formData.misfireStrategy" code="misfireStrategy"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="阻塞处理策略" prop="executorBlockStrategy">
              <dictionary v-model="formData.executorBlockStrategy" code="executorBlockStrategy"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="任务超时时间" prop="executorTimeout">
              <el-input
                v-model="formData.executorTimeout"
                placeholder="请输入任务执行超时时间，单位秒"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失败重试次数" prop="executorFailRetryCount">
              <el-input-number
                v-model="formData.executorFailRetryCount"
                class="!w-340px"
                placeholder="请输入失败重试次数"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 底部按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" :loading="loading" @click="handleSubmit()">确定</el-button>
          <el-button @click="handleCloseDialog()">取消</el-button>
        </div>
      </template>
    </el-drawer>

    <el-dialog v-model="openCron" title="Cron表达式生成器" append-to-body destroy-on-close>
      <crontab
        ref="crontabRef"
        :expression="formData.scheduleConf"
        @hide="openCron = false"
        @fill="crontabFill"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import MonitorXxlJobInfoAPI, {MonitorXxlJobInfoForm} from "@/api/monitor/job-info";
import {ElMessage} from "element-plus";
import XxlJobGroupAPI from "@/api/monitor/job-group";
import {PropType} from "vue";

// 定义组件属性，接受父组件传递的表格数据对象
const props = defineProps({
  dataForm: {
    type: Object as PropType<MonitorXxlJobInfoForm>,
    default: () => null,
    required: true,
  },
});

// 控制抽屉的可见性
const dialogVisible = ref(false);

// 当前编辑的表格标题
const titleName = ref("");

// 提交按钮的加载状态
const loading = ref(false);

const openCron = ref(false);
const expression = ref();

// 表单数据
const formData = ref<MonitorXxlJobInfoForm>({} as MonitorXxlJobInfoForm);

// 打开抽屉并加载表格详细信息
function open(title: string) {
  dialogVisible.value = true;
  titleName.value = title;
  // 使用深拷贝来复制数据
  formData.value = JSON.parse(JSON.stringify(props.dataForm));
  loadJobGroup();
}

// 向父组件暴露 open 方法
defineExpose({ open });

// 加载执行器列表
const jobGroupOptions = ref<OptionType[]>();

function loadJobGroup() {
  XxlJobGroupAPI.getJobGroupList().then((data) => {
    jobGroupOptions.value = data;
  });
}

// 关闭抽屉
function handleCloseDialog() {
  dialogVisible.value = false;
}

// 定义表单校验规则
const rules = reactive({
  jobGroup: [{required: true, message: "请选择执行器", trigger: "change"}],
  jobDesc: [{required: true, message: "请输入任务描述", trigger: "blur"}],
  author: [{required: true, message: "请输入负责人", trigger: "blur"}],
  scheduleType: [{required: true, message: "请选择调度类型", trigger: "change"}],
  scheduleConf: [{required: true, message: "请输入cron表达式", trigger: "blur"}],
  glueType: [{required: true, message: "请选择运行模式", trigger: "change"}],
  executorHandler: [{required: true, message: "请输入执行器任务handler", trigger: "blur"}],
  executorTimeout: [{required: true, message: "请输入任务超时时间", trigger: "blur"},
    {
      pattern: /^[0-9]{1,5}$/,
      message: "请输入正确的超时时间",
      trigger: "blur",
    }],
  executorFailRetryCount: [{required: true, message: "请输入失败重试次数", trigger: "blur"},
    {
      pattern: /^[0-9]{1,5}$/,
      message: "请输入正确的失败重试次数",
      trigger: "blur",
    }]
});

/** cron表达式按钮操作 */
function handleShowCron() {
  expression.value = formData.value.scheduleConf;
  openCron.value = true;
}

/** 确定后回传值 */
function crontabFill(value: string) {
  // 修改这里，将 cronExpression 改为 scheduleConf
  formData.value.scheduleConf = value;
  openCron.value = false;
}

// 表单提交逻辑，先验证表单再提交数据
const dataFormRef = ref(ElForm);
const emit = defineEmits(["success"]);
const handleSubmit = () => {
  dataFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      const submitData = {...formData.value}; // 创建数据副本
      if (submitData.id) {
        MonitorXxlJobInfoAPI.update(submitData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            emit("success");
          })
          .finally(() => (loading.value = false));
      } else {
        MonitorXxlJobInfoAPI.add(submitData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            emit("success");
          })
          .finally(() => (loading.value = false));
      }
    }
  });
};
</script>

<style scoped>
/* 样式优化：调整抽屉标题的样式 */
:deep(.remove-el-drawer-header-margin-bottom) .el-drawer__header {
  padding-bottom: 15px;
  margin-bottom: -15px;
  font-size: 15px;
  font-weight: bold;
  border-bottom: 1px solid #ebeef5;
}
</style>
