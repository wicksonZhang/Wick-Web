<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="AppName" prop="appName">
          <el-input
            v-model="queryParams.appName"
            placeholder="请输入AppName"
            clearable
            class="!w-240px"
            @keyup.enter="handleQuery()"
          />
        </el-form-item>
        <el-form-item label="执行器名称" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入执行器名称"
            clearable
            class="!w-240px"
            @keyup.enter="handleQuery()"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleQuery()">
            <template #icon>
              <Search/>
            </template>
            搜索
          </el-button>
          <el-button
            @click="handleResetQuery()">
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
        <el-button
          type="success"
          v-hasPerm="['monitor:job-group:query']"
          @click="handleOpenDialog()"
        >
          <el-icon>
            <Plus/>
          </el-icon>
          新增
        </el-button>
        <el-button
          type="danger"
          v-hasPerm="['monitor:job-group:query']"
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
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column align="center" label="AppName" prop="appName"/>
        <el-table-column align="center" label="执行器名称" prop="title"/>
        <el-table-column align="center" label="注册方式" prop="addressType">
          <template #default="scope">
            <DictLabel v-model="scope.row.addressType" code="addressType"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="OnLine 机器地址" prop="addressList"/>
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              v-hasPerm="['monitor:job-group:update']"
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
              type="danger"
              v-hasPerm="['monitor:job-group:delete']"
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

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNumber"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery()"
      />
    </el-card>

    <!-- job-group表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="AppName" prop="appName">
          <el-input v-model="formData.appName" placeholder="请输入执行器AppName"/>
        </el-form-item>
        <el-form-item label="执行器名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入执行器名称"/>
        </el-form-item>
        <el-form-item label="注册方式" prop="addressType">
          <el-radio-group v-model='formData.addressType' :value="0">
            <el-radio :label='0'> 自动注册</el-radio>
            <el-radio :label='1'> 手动录入</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="机器地址" prop="addressList">
          <el-input v-model="formData.addressList" type="textarea" placeholder="请输入机器地址"
                    :disabled="formData.addressType === 0"/>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="handleCloseDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "XxlJobGroup",
  inheritAttrs: false,
});

import XxlJobGroupAPI, {XxlJobGroupVO, XxlJobGroupForm} from "@/api/monitor/job-group";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  appName: undefined,
  title: undefined,
});

// job-group表格数据
const pageData = ref<XxlJobGroupVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// job-group表单数据
const formData = reactive<XxlJobGroupForm>({
  addressType: 0
});

// job-group表单校验规则
const rules = reactive({
  appName: [
    {required: true, message: "appName不能为空", trigger: "blur"},
    {min: 4, max: 64, message: 'AppName长度限制为4~64', trigger: 'blur'}
  ],
  title: [
    {required: true, message: "执行器名称不能为空", trigger: "blur"},
    {min: 4, max: 12, message: '执行器名称长度限制为4~12', trigger: 'blur'}
  ],
  addressType: [{required: true, message: "注册方式不能为空", trigger: "blur"}],
});

/** 查询job-group */
function handleQuery() {
  loading.value = true;
  XxlJobGroupAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置job-group查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNumber = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/** 打开job-group弹窗 */
function handleOpenDialog(row?: XxlJobGroupVO) {
  dialog.visible = true;
  if (row) {
    dialog.title = "修改执行器管理";
    Object.assign(formData, row);
  } else {
    dialog.title = "新增执行器管理";
  }
}

/** 提交job-group表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        XxlJobGroupAPI.update(formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        XxlJobGroupAPI.add(formData)
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

/** 关闭job-group弹窗 */
function handleCloseDialog() {
  dialog.visible = false;

  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();

  formData.id = undefined;
}

/** 删除job-group */
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
      XxlJobGroupAPI.deleteByIds(removeIds)
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
