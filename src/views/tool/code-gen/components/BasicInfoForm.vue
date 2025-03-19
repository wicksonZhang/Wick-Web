<template>
  <!-- 表单组件，使用 Element Plus 的 el-form 组件 -->
  <el-form ref="formRef" :model="table" :rules="rules" label-width="150px">
    <el-row>
      <!-- 左侧输入框：表名称 -->
      <el-col :span="12">
        <el-form-item label="表名称" prop="tableName">
          <el-input placeholder="请输入表名称" v-model="table.tableName"/>
        </el-form-item>
      </el-col>

      <!-- 右侧输入框：表描述 -->
      <el-col :span="12">
        <el-form-item label="表描述" prop="tableComment">
          <el-input placeholder="请输入表描述" v-model="table.tableComment"/>
        </el-form-item>
      </el-col>

      <!-- 左侧输入框：实体类名称 -->
      <el-col :span="12">
        <el-form-item label="实体类名称" prop="className">
          <el-input placeholder="请输入实体类名称" v-model="table.className"/>
        </el-form-item>
      </el-col>

      <!-- 右侧输入框：作者 -->
      <el-col :span="12">
        <el-form-item label="作者" prop="functionAuthor">
          <el-input placeholder="请输入作者" v-model="table.functionAuthor"/>
        </el-form-item>
      </el-col>

      <!-- 全宽输入框：备注 -->
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3" v-model="table.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import {PropType} from "vue";
import {CodeGenTableInfoVO} from "@/api/tool/code-gen";

defineOptions({name: 'CodegenBasicInfoForm'})

// 定义组件属性，接受父组件传递的表格数据对象
const props = defineProps({
  table: {
    type: Object as PropType<CodeGenTableInfoVO>,
    default: () => null
  }
});

// 表单校验规则
const rules = ref({
  tableName: [{required: true, message: "请输入表名称", trigger: "blur"}],
  tableComment: [{required: true, message: "请输入表描述", trigger: "blur"}],
  className: [{required: true, message: "请输入实体类名称", trigger: "blur"}],
  functionAuthor: [{required: true, message: "请输入作者", trigger: "blur"}]
});

// 表单引用，方便在其他方法中操作表单
const formRef = ref();
// 向父组件暴露的方法，供父组件调用
defineExpose({
  // 校验表单，返回校验结果
  validate: async () => unref(formRef)?.validate()
});
</script>
