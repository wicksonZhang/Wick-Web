<template>
  <el-dialog v-model="dialogVisible" title="详情">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="数据源名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入参数名称" />
      </el-form-item>
      <el-form-item label="数据源连接" prop="url">
        <el-input v-model="formData.url" placeholder="请输入数据源连接" />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="formData.password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="success" @click="isSuccess">测 试 连 接</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm"
        >确 定</el-button
      >
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { DataSourceConfigVO } from "@/api/dataSourceConfig/type";
import {
  createDataSourceConfig,
  getDataSourceConfigById,
  testConnection,
  updateDataSourceConfig,
} from "@/api/dataSourceConfig";

const dialogVisible = ref(false); // 弹窗的是否展示
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(""); // 表单的类型：create - 新增；update - 修改
const formData = ref<DataSourceConfigVO>({
  id: undefined,
  name: "",
  url: "",
  username: "",
  password: "",
});
const formRef = ref(); // 表单 Ref

const formRules = reactive({
  name: [{ required: true, message: "数据源名称不能为空", trigger: "blur" }],
  url: [{ required: true, message: "数据源连接不能为空", trigger: "blur" }],
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
});

/** 打开弹窗 */
function open(type: string, id: number) {
  dialogVisible.value = true;
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      console.debug(id);
      getDataSourceConfigById(id).then(({ data }) => {
        formData.value = data;
      });
    } finally {
      formLoading.value = false;
    }
  }
}

defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/**
 * 测试连接
 */
function isSuccess() {
  // 校验表单
  if (!formRef.value) return;
  const valid = formRef.value.validate();
  if (!valid) return;
  // 提交请求
  testConnection(formData.value).then((data) => {
    if (data.data) {
      ElMessage.success("连接成功");
    } else {
      ElMessage.error("连接失败");
    }
  });
}

/** 提交表单 */
const emit = defineEmits(["success"]); // 定义 success 事件，用于操作成功后的回调
function submitForm() {
  // 校验表单
  if (!formRef.value) return;
  const valid = formRef.value.validate();
  if (!valid) return;
  // 提交请求
  formLoading.value = true;
  try {
    if (formType.value === "create") {
      createDataSourceConfig(formData.value).then(() => {
        ElMessage.success("新增成功");
      });
    } else {
      updateDataSourceConfig(formData.value).then(() => {
        ElMessage.success("修改成功");
      });
    }
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit("success");
  } finally {
    formLoading.value = false;
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: "",
    url: "",
    username: "",
    password: "",
  };
  formRef.value?.resetFields();
};
</script>
