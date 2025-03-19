<template>
  <el-dialog v-model="dialogVisible" width="500px" title="执行定时任务">
    <el-form ref="dataFormRef" :model="formData" label-width="auto">
      <el-form-item label="任务参数" prop="executorParam">
        <el-input v-model="formData.executorParam" placeholder="请输入任务参数" />
      </el-form-item>
      <el-form-item label="机器地址" prop="addressList">
        <el-input
          v-model="formData.addressList"
          type="textarea"
          :rows="3"
          placeholder="请输入本次执行的机器地址，为空则从执行器获取"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmitClick">确 定</el-button>
        <el-button @click="handleCloseDialog">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import MonitorXxlJobInfoAPI, { MonitorExecutorParamVO } from "@/api/monitor/job-info";

// 控制抽屉的可见性
const dialogVisible = ref(false);

const formData = reactive<MonitorExecutorParamVO>({});

// 打开抽屉并加载表格详细信息
function open(id: number, executorParam: string) {
  dialogVisible.value = true;
  formData.id = id;
  formData.executorParam = executorParam;
}

function handleSubmitClick() {
  MonitorXxlJobInfoAPI.executeTrigger(formData).then(() => {
    ElMessage.success("执行成功");
    handleCloseDialog();
  });
}

function handleCloseDialog() {
  dialogVisible.value = false;

  formData.id = undefined;
  formData.executorParam = undefined;
  formData.addressList = undefined;
}

// 向父组件暴露 open 方法
defineExpose({ open });
</script>
