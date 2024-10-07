<template>
  <el-dialog v-model="dialogVisible" align-center width="80%">
    <!-- 自定义标题部分 -->
    <template #header>
      <div class="dialog-title">[{{ tableName }}] 代码预览</div>
    </template>

    <div class="flex" element-loading-text="代码文件生成中...">
      <!-- 左侧树形菜单 -->
      <el-col :span="6">
        <el-scrollbar class="scroll-container" always>
          <el-tree
            ref="treeRef"
            :data="treeData"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
            class="tree-menu"
          />
        </el-scrollbar>
      </el-col>

      <!-- 右侧代码编辑器 -->
      <el-col :span="18">
        <div class="editor-wrapper">
          <!-- 顶部操作栏 -->
          <div class="editor-actions">
            <!-- 显示当前语言 -->
            <div class="language-label">{{ currentLanguage }}</div>
            <!-- 一键复制按钮 -->
            <el-link
              type="primary"
              class="copy-button"
              :underline="false"
              @click="handleCopyCode"
            >
              <el-icon>
                <CopyDocument />
              </el-icon>
              一键复制
            </el-link>
          </div>

          <!-- 代码显示区域 -->
          <el-scrollbar :style="{ height: 'calc(80vh - 100px)' }">
            <Codemirror
              v-model:value="code"
              :options="cmOptions"
              ref="cmRef"
              :readonly="true"
              height="100%"
              width="100%"
            />
          </el-scrollbar>
        </div>
      </el-col>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import "codemirror/mode/clike/clike";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/foldgutter.css";

import Codemirror, { CmComponentRef } from "codemirror-editor-vue3";
import { EditorConfiguration } from "codemirror";
import GeneratorAPI from "@/api/tools/generator";

// 弹窗和加载状态的控制
const dialogVisible = ref(false);
const loading = ref(false);
const tableName = ref(""); // 当前编辑的表名

// 当前代码语言和代码内容
const currentLanguage = ref("");

// 树形结构数据
const treeData = ref<TreeNode[]>([]);

// Codemirror 配置和引用
const cmRef = ref<CmComponentRef>();
const cmOptions: EditorConfiguration = {
  mode: "text/x-java", // 初始模式
  tabSize: 4,
  lineNumbers: true,
  theme: "idea",
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
};

// 树节点类型定义
interface TreeNode {
  label: string;
  content?: string;
  children?: TreeNode[];
}

// 节点点击事件处理函数
function handleNodeClick(data: TreeNode) {
  if (!data.children?.length) {
    code.value = data.content || ""; // 更新代码内容
    currentLanguage.value = data.label; // 更新当前语言
    updateCodeMirrorMode(); // 根据文件类型更新 Codemirror 模式
  }
}

// 打开弹窗并加载数据
async function open(id: number, name: string) {
  dialogVisible.value = true;
  loading.value = true;
  treeData.value = [];
  try {
    const data = await GeneratorAPI.getPreviewData(id); // 获取代码预览数据
    tableName.value = name;
    treeData.value = buildTree(data); // 构建文件树

    const firstLeafNode = findFirstLeafNode(treeData.value);
    if (firstLeafNode) {
      code.value = firstLeafNode.content || "";
      currentLanguage.value = firstLeafNode.label;
      updateCodeMirrorMode();
    }
  } finally {
    loading.value = false;
  }
}

defineExpose({ open });

// 根据文件类型设置 Codemirror 模式
function updateCodeMirrorMode() {
  const modeMap: { [key: string]: string } = {
    java: "text/x-java",
    xml: "application/xml",
    ts: "text/typescript",
    vue: "text/x-vue",
    sql: "text/x-sql",
    js: "text/javascript",
    javascript: "text/javascript",
  };
  cmOptions.mode = modeMap[currentLanguage.value] || "text/plain";
}

// 一键复制
const { copy, copied } = useClipboard();
const code = ref();
const handleCopyCode = () => {
  if (code.value) copy(code.value);
};

// 构建树形结构
function buildTree(
  data: {
    path: string;
    packagePath: string;
    fileName: string;
    content: string;
  }[]
): TreeNode[] {
  const root: TreeNode[] = [];

  data.forEach((item) => {
    const separator = item.path.includes("/") ? "/" : "\\";
    const parts = item.path.split(separator);
    const mergedParts = mergePaths(parts, separator, item.packagePath);

    // 构建树节点
    let currentNodeArray = root;
    mergedParts.forEach((part) => {
      let node = currentNodeArray.find((child) => child.label === part);
      if (!node) {
        node = { label: part, children: [] };
        currentNodeArray.push(node);
      }
      currentNodeArray = node.children!;
    });

    currentNodeArray.push({ label: item.fileName, content: item.content });
  });

  return root;
}

// 合并特殊路径
function mergePaths(
  parts: string[],
  separator: string,
  packagePath: string
): string[] {
  const specialPaths = [
    `src${separator}main`,
    "java",
    "wick-boot",
    "wick-web",
    packagePath,
  ];

  const mergedParts: string[] = [];
  let buffer: string[] = [];

  parts.forEach((part) => {
    buffer.push(part);
    const currentPath = buffer.join(separator);
    if (specialPaths.includes(currentPath)) {
      mergedParts.push(currentPath);
      buffer = [];
    }
  });

  return mergedParts.concat(buffer);
}

// 查找第一个叶子节点
function findFirstLeafNode(nodes: TreeNode[]): TreeNode | null {
  for (const node of nodes) {
    if (!node.children?.length) return node;
    const leafNode = findFirstLeafNode(node.children);
    if (leafNode) return leafNode;
  }
  return null;
}

// 监听复制状态并显示提示信息
watch(copied, () => {
  if (copied.value) ElMessage.success("复制成功");
});
</script>

<style lang="scss" scoped>
.dialog-title {
  font-size: 15px;
  font-weight: bold;
  text-align: left;
}

.scroll-container {
  height: calc(80vh - 50px);
  overflow-x: auto; /* 启用水平滚动条 */
  white-space: nowrap; /* 禁止换行 */
}

.tree-menu {
  display: inline-block; /* 让树形菜单宽度自适应内容 */
  width: max-content; /* 内容多宽，容器就多宽 */
}

.el-tree-node__label {
  max-width: 100%; /* 限制最大宽度 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分用省略号显示 */
  white-space: nowrap;
}

.editor-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.editor-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #eceef1;
  border-radius: 6px 6px 0 0;
}

.language-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.copy-button {
  margin-left: auto;
  font-size: 14px;
}
</style>
