<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="参数名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="参数名称"
            clearable
            @keyup.enter="handleQuery()"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="用户名"
            clearable
            @keyup.enter="handleQuery()"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-hasPerm="['tool:data-source:query']"
            type="primary"
            @click="handleQuery()">
            <template #icon><Search /></template>
            搜索
          </el-button>
          <el-button
            v-hasPerm="['tool:data-source:query']"
            @click="handleResetQuery()">
            <template #icon><Refresh /></template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button
          v-hasPerm="['tool:data-source:add']"
          type="success"
          @click="handleOpenDialog()"
        >
          <el-icon>
            <Plus />
          </el-icon>
          新增
        </el-button>
        <el-button
          v-hasPerm="['tool:data-source:delete']"
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
        >
          <el-icon>
            <Delete />
          </el-icon>
          删除
        </el-button>
      </template>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="pageData"
        border
        highlight-current-row
        show-overflow-tooltip
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column
          align="center"
          key="id"
          label="主键编号"
          prop="id"
          min-width="50"
        />
        <el-table-column
          align="center"
          key="name"
          label="参数名称"
          prop="name"
          min-width="100"
        />
        <el-table-column
          align="center"
          key="url"
          label="数据源连接"
          prop="url"
          min-width="100"
        />
        <el-table-column
          align="center"
          key="username"
          label="用户名"
          prop="username"
          min-width="100"
        />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['tool:data-source:update']"
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['tool:data-source:delete']"
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
            >
              <template #icon><Delete /></template>
              删除
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

    <!-- data-source表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="参数名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="参数名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="数据源连接" prop="url">
          <el-input type="textarea"
                    v-model="formData.url"
                    placeholder="数据源连接"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="用户名"
            type="password"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="success" @click="testConnection()">测试连接</el-button>
          <el-button type="primary" @click="handleSubmit()">确定</el-button>
          <el-button @click="handleCloseDialog()">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "ToolDataSource",
  inheritAttrs: false,
});

import ToolDataSourceAPI, {ToolDataSourceVO, ToolDataSourceForm} from "@/api//tool/data-source";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  name: undefined,
  url: undefined,
  username: undefined,
});

// data-source表格数据
const pageData = ref<ToolDataSourceVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// data-source表单数据
const formData = reactive<ToolDataSourceForm>({});

// data-source表单校验规则
const rules = reactive({
  name: [{required: true, message: "请输入参数名称", trigger: "blur"}],
  url: [{required: true, message: "请输入数据源连接", trigger: "blur"}],
  username: [{required: true, message: "请输入用户名", trigger: "blur"}],
});

/** 查询data-source */
function handleQuery() {
  loading.value = true;
  ToolDataSourceAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置data-source查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNumber = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/** 打开data-source弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改数据源配置";
    ToolDataSourceAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增数据源配置";
  }
}

/** 测试连接 */
function testConnection() {
  ToolDataSourceAPI.testConnection(formData).then((data) => {
    if (data) {
      ElMessage.success("连接成功");
    } else {
      ElMessage.error("连接失败,请检查数据库连接信息");
    }
  })
}

/** 提交data-source表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        ToolDataSourceAPI.update(formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        ToolDataSourceAPI.add(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭data-source弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除data-source */
function handleDelete(id?: number) {
  const removeIds = [id || ids.value].join(",");
  if (!removeIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
      loading.value = true;
      ToolDataSourceAPI.deleteByIds(removeIds)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

onMounted(() => {
  handleQuery();
});
</script>
