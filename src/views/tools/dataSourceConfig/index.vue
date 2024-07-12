<template>
  <div class="app-container">
    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button type="primary" @click="getList"
          ><i-ep-refresh />刷新</el-button
        >
        <el-button type="success" @click="openDialog('create', undefined)"
          ><i-ep-plus />新增</el-button
        >
      </template>

      <!-- 表单数据 -->
      <el-table v-loading="loading" :data="list">
        <el-table-column label="主键编号" align="center" prop="id" />
        <el-table-column label="数据源名称" align="center" prop="name" />
        <el-table-column
          label="数据源连接"
          align="center"
          prop="url"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="用户名" align="center" prop="username" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
        />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="openDialog('update', scope.row.id)"
            >
              <i-ep-edit /> 编辑
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="handleDelete(scope.row.id)"
            >
              <i-ep-delete /> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 表单弹窗：添加/修改 -->
    <data-source-config-form ref="formRef" @success="getList" />
  </div>
</template>

<script setup lang="ts">
import {
  deleteDataSourceConfig,
  getListDataSourceConfig,
} from "@/api/dataSourceConfig";

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据

/** 查询列表 */
function getList() {
  loading.value = true;
  getListDataSourceConfig()
    .then(({ data }) => {
      list.value = data;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 添加/修改操作 */
const formRef = ref();
function openDialog(type: string, id: number) {
  formRef.value.open(type, id);
}

/**
 * 删除数据源配置项
 * @param id
 */
function handleDelete(id: number) {
  if (!id) {
    ElMessage.warning("请选择删除项");
    return;
  }
  ElMessageBox.confirm(`确认删除已选中的数据项?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteDataSourceConfig(id).then(() => {
      ElMessage.success("删除成功");
      getList();
    });
  });
}

onMounted(() => {
  getList();
});
</script>
