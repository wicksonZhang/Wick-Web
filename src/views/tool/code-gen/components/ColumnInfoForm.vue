<template>
  <!-- 表格展示字段及其相关属性 -->
  <el-table ref="formRef" :data="formData" :max-height="tableHeight" row-key="columnId">
    <!-- 序号列，显示索引值 -->
    <el-table-column label="序号" type="index" min-width="5%"/>

    <!-- 字段列名，显示字段名称 -->
    <el-table-column
      label="字段列名"
      prop="columnName"
      min-width="10%"
      :show-overflow-tooltip="true"
    />

    <!-- 字段描述，可编辑输入字段注释 -->
    <el-table-column label="字段描述" min-width="10%">
      <template #default="scope">
        <el-input v-model="scope.row.columnComment"/>
      </template>
    </el-table-column>

    <!-- 物理类型，显示数据库字段类型 -->
    <el-table-column
      label="物理类型"
      prop="columnType"
      min-width="10%"
      :show-overflow-tooltip="true"
    />

    <!-- Java类型，选择Java类型 -->
    <el-table-column label="Java类型" min-width="11%">
      <template #default="scope">
        <el-select v-model="scope.row.javaType">
          <el-option label="Long" value="Long"/>
          <el-option label="String" value="String"/>
          <el-option label="Integer" value="Integer"/>
          <el-option label="Double" value="Double"/>
          <el-option label="BigDecimal" value="BigDecimal"/>
          <el-option label="Date" value="Date"/>
          <el-option label="Boolean" value="Boolean"/>
        </el-select>
      </template>
    </el-table-column>

    <!-- Java属性名，可编辑 -->
    <el-table-column label="java属性" min-width="10%">
      <template #default="scope">
        <el-input v-model="scope.row.javaField"/>
      </template>
    </el-table-column>

    <!-- 插入操作，是否在插入时使用 -->
    <el-table-column label="插入" min-width="5%">
      <template #default="scope">
        <el-checkbox true-label="1" false-label="0" v-model="scope.row.created"/>
      </template>
    </el-table-column>

    <!-- 编辑操作，是否在编辑时使用 -->
    <el-table-column label="编辑" min-width="5%">
      <template #default="scope">
        <el-checkbox true-label="1" false-label="0" v-model="scope.row.edit"/>
      </template>
    </el-table-column>

    <!-- 列表操作，是否在列表中展示 -->
    <el-table-column label="列表" min-width="5%">
      <template #default="scope">
        <el-checkbox true-label="1" false-label="0" v-model="scope.row.list"/>
      </template>
    </el-table-column>

    <!-- 查询操作，是否作为查询条件 -->
    <el-table-column label="查询" min-width="5%">
      <template #default="scope">
        <el-checkbox true-label="1" false-label="0" v-model="scope.row.query"/>
      </template>
    </el-table-column>

    <!-- 查询方式，选择查询类型 -->
    <el-table-column label="查询方式" min-width="10%">
      <template #default="scope">
        <el-select v-model="scope.row.queryType">
          <el-option label="=" value="EQ"/>
          <el-option label="!=" value="NE"/>
          <el-option label=">" value="GT"/>
          <el-option label=">=" value="GTE"/>
          <el-option label="<" value="LT"/>
          <el-option label="<=" value="LTE"/>
          <el-option label="LIKE" value="LIKE"/>
          <el-option label="BETWEEN" value="BETWEEN"/>
        </el-select>
      </template>
    </el-table-column>

    <!-- 必填字段，是否为必填 -->
    <el-table-column label="必填" min-width="5%">
      <template #default="scope">
        <el-checkbox true-label="1" false-label="0" v-model="scope.row.required"/>
      </template>
    </el-table-column>

    <!-- 显示类型，选择表单控件类型 -->
    <el-table-column label="显示类型" min-width="12%">
      <template #default="scope">
        <el-select v-model="scope.row.htmlType">
          <el-option label="文本框" value="input"/>
          <el-option label="文本域" value="textarea"/>
          <el-option label="下拉框" value="select"/>
          <el-option label="单选框" value="radio"/>
          <el-option label="复选框" value="checkbox"/>
          <el-option label="日期控件" value="datetime"/>
          <el-option label="图片上传" value="imageUpload"/>
          <el-option label="文件上传" value="fileUpload"/>
          <el-option label="富文本控件" value="editor"/>
        </el-select>
      </template>
    </el-table-column>

    <!-- 字典类型，选择字典 -->
    <el-table-column label="字典类型" min-width="12%">
      <template #default="scope">
        <el-select v-model="scope.row.dictType" clearable filterable placeholder="请选择">
          <!-- 动态加载字典选项 -->
          <el-option
            v-for="dict in dictOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          >
            <!-- 左侧显示字典标签，右侧显示字典值 -->
            <span style="float: left">{{ dict.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.value }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import DictAPI from "@/api/system/dict-type";
import {CodeGenColumnsInfoVO} from "@/api/tool/code-gen";
import {PropType} from "vue";

// 定义组件名称
defineOptions({name: 'CodegenColumnInfoForm'})

// 从父组件传入的列数据
const props = defineProps({
  columns: {
    type: Array as unknown as PropType<CodeGenColumnsInfoVO[]>,
    default: () => null
  }
})

// 响应式数据，表格的实际数据
const formData = ref<CodeGenColumnsInfoVO[]>([])

// 设置表格的最大高度，动态根据窗口大小调整
const tableHeight = document.documentElement.scrollHeight - 150 + 'px'

// 字典选项列表，用于动态加载字典类型
const dictOptions = ref()

// 查询字典下拉列表数据
function getDictOptions() {
  DictAPI.getList().then((data) => {
    dictOptions.value = data;
  })
}

// 监听 props.columns 的变化，实时更新 formData
watch(
  () => props.columns,
  (columns) => {
    if
    (!columns) return
    formData.value = columns
  },
  {
    deep: true, // 深度监听，以检测嵌套属性的变化
    immediate: true // 立即执行以确保在组件挂载时同步数据
  }
)

// 在组件挂载时加载字典数据
onMounted(async () => {
  await getDictOptions()
})
</script>
