<template>
  <el-form ref="formRef" :model="table" :rules="rules" label-width="150px">
    <el-row>
      <!-- 生成包路径 -->
      <el-col :span="12">
        <el-form-item prop="packageName">
          <template #label>
            生成包路径
            <!-- 包路径提示工具 -->
            <el-tooltip content="生成在哪个java包下，例如 com.ruoyi.system" placement="top">
              <el-icon>
                <question-filled/>
              </el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="table.packageName"/>
        </el-form-item>
      </el-col>

      <!-- 生成模板 -->
      <el-col :span="12">
        <el-form-item prop="tplCategory">
          <template #label>生成模板</template>
          <el-select v-model="table.tplCategory" disabled>
            <el-option label="单表（增删改查）" value="crud"/>
          </el-select>
        </el-form-item>
      </el-col>

      <!-- 生成模块名 -->
      <el-col :span="12">
        <el-form-item prop="moduleName">
          <template #label>
            生成模块名
            <!-- 模块名提示工具 -->
            <el-tooltip content="可理解为子系统名，例如 system" placement="top">
              <el-icon>
                <question-filled/>
              </el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="table.moduleName"/>
        </el-form-item>
      </el-col>

      <!-- 生成业务名 -->
      <el-col :span="12">
        <el-form-item prop="businessName">
          <template #label>
            生成业务名
            <!-- 业务名提示工具 -->
            <el-tooltip content="可理解为功能英文名，例如 user" placement="top">
              <el-icon>
                <question-filled/>
              </el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="table.businessName"/>
        </el-form-item>
      </el-col>

      <!-- 生成功能名 -->
      <el-col :span="12">
        <el-form-item prop="functionName">
          <template #label>
            生成功能名
            <!-- 功能名提示工具 -->
            <el-tooltip content="用作类描述，例如 用户" placement="top">
              <el-icon>
                <question-filled/>
              </el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="table.functionName"/>
        </el-form-item>
      </el-col>

      <!-- 上级菜单 -->
      <el-col :span="12">
        <el-form-item prop="parentMenuId">
          <template #label>
            上级菜单
            <!-- 菜单选择提示工具 -->
            <el-tooltip content="分配到指定菜单下，例如 系统管理" placement="top">
              <el-icon>
                <question-filled/>
              </el-icon>
            </el-tooltip>
          </template>
          <el-tree-select
            v-model="table.parentMenuId"
            placeholder="选择上级菜单"
            :data="menuOptions"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>
      </el-col>

      <!-- 生成代码方式 -->
      <el-col :span="12">
        <el-form-item prop="genType">
          <template #label>
            生成代码方式
            <!-- 生成代码方式提示工具 -->
            <el-tooltip content="默认为zip压缩包下载，也可以自定义生成路径" placement="top">
              <el-icon>
                <question-filled/>
              </el-icon>
            </el-tooltip>
          </template>
          <el-radio v-model="table.genType" value="0">zip压缩包</el-radio>
          <el-radio v-model="table.genType" value="1">自定义路径</el-radio>
        </el-form-item>
      </el-col>

      <!-- 自定义路径 -->
      <el-col :span="24" v-if="table.genType === '1'">
        <el-form-item prop="genPath">
          <template #label>
            自定义路径
            <!-- 自定义路径提示工具 -->
            <el-tooltip content="填写磁盘绝对路径，若不填写，则生成到当前Web项目下" placement="top">
              <el-icon>
                <question-filled/>
              </el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="table.genPath">
            <template #append>
              <el-dropdown>
                <el-button type="primary">
                  最近路径快速选择
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="table.genPath = '/'">
                      恢复默认的生成基础路径
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import MenuAPI from "@/api/system/menu";
import {PropType} from "vue";
import {CodeGenColumnsInfoVO, CodeGenTableInfoVO} from "@/api/tools/generator";

// 定义组件名称
defineOptions({name: 'CodegenGenerateInfoForm'});

// 接收来自父组件的 props，用于绑定表单数据
const props = defineProps({
  table: {
    type: Object as PropType<CodeGenTableInfoVO>,
    default: () => null
  },
  columns: {
    type: Array as unknown as PropType<CodeGenColumnsInfoVO[]>,
    default: () => null
  }
});

// 表单的引用，用于执行校验等操作
const formRef = ref();
// 向外暴露的 validate 方法，用于表单校验
defineExpose({
  validate: async () => unref(formRef)?.validate()
});

// 表单的校验规则
const rules = ref({
  tplCategory: [{required: true, message: "请选择生成模板", trigger: "blur"}],
  packageName: [{required: true, message: "请输入生成包路径", trigger: "blur"}],
  moduleName: [{required: true, message: "请输入生成模块名", trigger: "blur"}],
  businessName: [{required: true, message: "请输入生成业务名", trigger: "blur"}],
  functionName: [{required: true, message: "请输入生成功能名", trigger: "blur"}]
});

// 菜单选项列表，用于上级菜单的下拉选择
const menuOptions = ref<OptionType[]>([]);

// 组件挂载时加载菜单选项数据
onMounted(async () => {
  MenuAPI.getOptions(true).then((data) => {
    menuOptions.value = data;
  });
});

</script>
