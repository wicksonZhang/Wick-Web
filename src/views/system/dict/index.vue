<!-- 分类字典 -->
<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="字典名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="字典名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-hasPerm="['system:dict-type:query']"
            type="primary"
            @click="handleQuery()"
          >
            <template #icon>
              <Search/>
            </template>
            搜索
          </el-button>
          <el-button
            v-hasPerm="['system:dict-type:query']"
            @click="handleReset()"
          >
            <template #icon>
              <Refresh/>
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <div class="mb-[10px]">
        <el-button
          v-hasPerm="['system:dict-type:add']"
          type="success"
          @click="handleAddClick()"
        >
          <el-icon>
            <Plus/>
          </el-icon>
          新增
        </el-button>
        <el-button
          v-hasPerm="['system:dict-type:delete']"
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
        >
          <el-icon>
            <Delete/>
          </el-icon>
          删除
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        highlight-current-row
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="字典名称" prop="name" align="center"/>
        <el-table-column label="字典编码" prop="code" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <router-link
              :to="{ path: '/system/dict-data', query: { code: scope.row.code , title: '【'+ scope.row.name + '】字典数据'} }"
              class="link-type"
            >
              {{ scope.row.code }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['system:dict-type:update']"
              type="primary"
              link
              size="small"
              @click.stop="handleEditClick(scope.row.id, scope.row.name)"
            >
              <template #icon>
                <Edit/>
              </template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['system:dict-type:delete']"
              type="danger"
              link
              size="small"
              @click.stop="handleDelete(scope.row.id)"
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
        @pagination="handleQuery"
      />
    </el-card>

    <!--字典弹窗-->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="computedRules"
        label-width="100px"
      >
        <el-form-item label="字典名称:" prop="name">
          <el-input v-model="formData.name" placeholder="请输入字典名称"/>
        </el-form-item>
        <el-form-item label="字典编码:" prop="code">
          <el-input v-model="formData.code" placeholder="请输入字典编码"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmitClick">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import DictAPI, {DictForm, DictPageVO} from "@/api/system/dict-type";
import router from "@/router";

defineOptions({
  name: "Dict",
  inherititems: false,
});

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  name: undefined,
});

const tableData = ref<DictPageVO[]>();

// 字典弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<DictForm>({});
const computedRules = computed(() => {
  const rules: Partial<Record<string, any>> = {
    name: [{required: true, message: "请输入字典名称", trigger: "blur"}],
    code: [{required: true, message: "请输入字典编码", trigger: "blur"}],
  };
  return rules;
});

// 查询
function handleQuery() {
  loading.value = true;
  DictAPI.getPage(queryParams)
    .then((data) => {
      tableData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

// 重置查询
function handleReset() {
  queryFormRef.value.resetFields();
  queryParams.pageNumber = 1;
  handleQuery();
}

// 行选择
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

// 新增字典
function handleAddClick() {
  dialog.visible = true;
  dialog.title = "新增字典";
}

/**
 * 编辑字典
 *
 * @param id 字典ID
 * @param name 字典名称
 */
function handleEditClick(id: number, name: string) {
  dialog.visible = true;
  dialog.title = "字典修改";
  DictAPI.getFormData(id).then((data) => {
    Object.assign(formData, data);
  });
}

// 提交字典表单
function handleSubmitClick() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        DictAPI.update(formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        DictAPI.add(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭字典弹窗 */
function handleCloseDialog() {
  dialog.visible = false;

  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();

  formData.id = undefined;
}

/**
 * 删除字典
 *
 * @param id 字典ID
 */
function handleDelete(id?: number) {
  const attrGroupIds = [id || ids.value].join(",");
  if (!attrGroupIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      DictAPI.deleteByIds(attrGroupIds).then(() => {
        ElMessage.success("删除成功");
        handleReset();
      });
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
