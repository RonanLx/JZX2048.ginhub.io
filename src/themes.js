/**
 * 导出一个默认对象，包含多个主题的样式配置
 * 每个主题都是一个对象，包含一系列的CSS变量，用于定义该主题下的颜色方案
 */
export default {
  // 经典主题样式配置
  classic: {
    '--bg-color': '#faf8ef',
    '--grid-bg': '#bbada0',
    '--cell-2': '#eee4da',
    '--cell-4': '#ede0c8',
    '--cell-text': '#776e65',
    // ...完整颜色配置
  },
  // 暗黑主题样式配置
  dark: {
    '--bg-color': '#2d3436',
    '--grid-bg': '#3c4245',
    '--cell-2': '#dfe6e9',
    '--cell-text': '#ffffff',
    // ...
  },
  // 添加更多主题
}