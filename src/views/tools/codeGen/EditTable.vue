<template>
  <div>
    <el-drawer
      :size="1320"
      style="max-width: 100%"
      :destroy-on-close="true"
      class="remove-el-drawer-header-margin-bottom"
      :title="`修改 [${tableName}] 生成配置`"
      v-model="dialogVisible"
    >
      <!-- 基本信息部分 -->
      <el-divider content-position="left">
        <strong style="font-size: 15px">基本信息</strong>
      </el-divider>
      <basic-info-form ref="basicInfoRef" :table="formData.table"/>

      <!-- 生成信息部分 -->
      <el-divider content-position="left">
        <strong style="font-size: 15px">生成信息</strong>
      </el-divider>
      <generate-info-form ref="generateInfoRef" :columns="formData.columns" :table="formData.table"/>

      <!-- 列信息部分 -->
      <el-divider content-position="left">
        <strong style="font-size: 15px">列信息</strong>
      </el-divider>
      <column-info-form ref="columInfoRef" :columns="formData.columns"/>

      <!-- 底部按钮 -->
      <template #footer>
        <el-button @click="closeDrawer">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {ElMessage} from 'element-plus';
import {BasicInfoForm, ColumnInfoForm, GenerateInfoForm} from './components';
import GeneratorAPI, {CodeGenTableDetailsVO} from '@/api/tools/generator';

defineOptions({name: 'CodegenEditTable'})

/**
 * 控制抽屉的可见性
 */
const dialogVisible = ref(false);

/**
 * 当前正在编辑的表名
 */
const tableName = ref('');

/**
 * 提交按钮的加载状态
 */
const loading = ref(false);

/**
 * 子组件引用：表单的基本信息、生成信息、列信息部分
 */
const basicInfoRef = ref<InstanceType<typeof BasicInfoForm>>();
const columInfoRef = ref<InstanceType<typeof ColumnInfoForm>>();
const generateInfoRef = ref<InstanceType<typeof GenerateInfoForm>>();

/**
 * 表单数据，定义了表结构和列信息
 */
const formData = ref<CodeGenTableDetailsVO>({
  table: {},
  columns: []
});

/**
 * 打开抽屉并加载表格详细信息
 * @param tableId - 要编辑的表格 ID
 * @param name - 表格名称
 */
async function open(tableId: number, name: string) {
  dialogVisible.value = true; // 显示抽屉
  tableName.value = name; // 设置表名

  if (tableId) {
    try {
      // 获取并设置表格详细信息
      formData.value = await GeneratorAPI.getToolCodeGenTable(tableId);
    } catch (error) {
      ElMessage.error('无法获取表详细信息'); // 错误提示
    }
  }
}

// 向父组件暴露 open 方法
defineExpose({open});

/**
 * 表单提交逻辑，先验证表单再提交数据
 */
async function submitForm() {
  if (!unref(formData)) return; // 如果表单数据为空则不提交

  // 验证基本信息和生成信息表单的有效性
  const valid = await validateForms();
  if (!valid) return; // 如果验证不通过，则停止提交

  try {
    loading.value = true; // 开启加载状态
    await GeneratorAPI.updateToolCodeGenTable(unref(formData)); // 提交表单数据
    ElMessage.success('操作成功'); // 成功提示
    closeDrawer(); // 关闭抽屉
  } catch (error) {
    ElMessage.error('提交失败，请重试'); // 错误提示
  } finally {
    loading.value = false; // 关闭加载状态
  }
}

/**
 * 验证表单的基本信息和生成信息部分
 * @returns 返回验证是否通过
 */
async function validateForms(): Promise<boolean> {
  try {
    await unref(basicInfoRef)?.validate();
    await unref(generateInfoRef)?.validate();
    return true;
  } catch (error) {
    return false; // 任何表单验证失败都会返回 false
  }
}

/**
 * 关闭抽屉
 */
function closeDrawer() {
  dialogVisible.value = false;
}
</script>

<style scoped>
/* 样式优化：调整抽屉标题的样式 */
:deep(.remove-el-drawer-header-margin-bottom) .el-drawer__header {
  margin-bottom: -15px;
  font-size: 15px;
  font-weight: bold;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}
</style>
