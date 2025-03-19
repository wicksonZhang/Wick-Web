<template>
  <el-dialog v-model="dialogVisible" :max-height="200" :scroll="true" title="定时任务调度详情" width="600">
    <el-descriptions :column="1" border v-if="detailData">
      <el-descriptions-item
        v-for="(value, key) in parsedData"
        :key="key"
        :label="key"
        align="center"
      >
        <template #default>
          {{ value }}
        </template>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({name: "JobLogDetail"});

const dialogVisible = ref(false);
const detailLoading = ref(false);
const detailData = ref('');

// 解析详情数据
const parsedData = computed(() => {
  if (!detailData.value) return {};

  // 将字符串按<br>分割成数组
  const items = detailData.value.split('<br>');
  const result: Record<string, string> = {};

  items.forEach(item => {
    // 跳过空项
    if (!item) return;

    // 处理调度失败情况
    if (item.startsWith('调度失败：')) {
      result['触发调度消息'] = item.replace('调度失败：', '');
      return;
    }

    // 处理普通键值对
    const [key, value] = item.split('：');
    if (key && value) {
      result[key] = value;
    }
  });

  return result;
});

/** 打开弹窗 */
function open(data: string) {
  dialogVisible.value = true;
  detailLoading.value = true;
  try {
    detailData.value = data;
  } finally {
    detailLoading.value = false;
  }
}

// 提供 open 方法，用于打开弹窗
defineExpose({open});
</script>

<style lang="scss" scoped>
:deep(.el-descriptions__body) {
  .el-descriptions__table.is-bordered .el-descriptions__cell {
    word-break: break-all;
  }
}
</style>
