<template>
  <!-- 游戏容器，包含整个游戏的布局 -->
  <div class="game-container" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <!-- 头部信息，包括游戏标题和献给信息 -->
    <div class="header">
      <h1>2048</h1>
      <b>献给刘静宜(*^_^*)</b>
      <!-- 分数显示区域 -->
      <div class="scores">
        <div class="score">Score: {{ score }}</div>
        <div class="best-score">Best: {{ bestScore }}</div>
      </div>
    </div>

    <!-- 游戏网格，动态生成游戏板 -->
    <div class="grid">
      <div v-for="(row, i) in board" :key="i" class="grid-row">
        <div v-for="(cell, j) in row" :key="j" class="cell" :class="`cell-${cell}`">
          {{ cell || '' }}
        </div>
      </div>
    </div>

    <!-- 游戏结束提示 -->
    <div v-if="gameOver" class="game-over">
      <h2>Game Over!</h2>
      <button @click="initGame">Play Again</button>
    </div>

    <!-- 控制按钮区域 -->
    <div class="controls">
      <button @click="initGame">New Game</button>
      <button @click="resetGame">Reset Game</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useGame } from '../composables/useGame' // 修改路径
import useAudio from '../composables/useAudio' // 修正路径

// 使用 useGame 和 useAudio 自定义 Hook
const { board, score, bestScore, gameOver, resetGame, move, checkGameOver } = useGame()
const { play } = useAudio()

// 初始化游戏
const initGame = () => {
  resetGame()
  play('move') // 播放音效
}

// 键盘事件处理函数
const handleKeydown = (e) => {
  if (gameOver.value) return
  switch (e.key) {
    case 'ArrowUp':
      move('up')
      play('move')
      break
    case 'ArrowDown':
      move('down')
      play('move')
      break
    case 'ArrowLeft':
      move('left')
      play('move')
      break
    case 'ArrowRight':
      move('right')
      play('move')
      break
  }
}

// 触摸事件支持
let touchStartX = 0
let touchStartY = 0

// 触摸开始事件处理函数
const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
  e.preventDefault() // 阻止默认行为
}

// 触摸结束事件处理函数
const handleTouchEnd = (e) => {
  if (gameOver.value) return

  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY

  const deltaX = touchEndX - touchStartX
  const deltaY = touchEndY - touchStartY

  const absDeltaX = Math.abs(deltaX)
  const absDeltaY = Math.abs(deltaY)

  // 判断滑动方向
  if (Math.max(absDeltaX, absDeltaY) > 30) { // 滑动阈值
    if (absDeltaX > absDeltaY) {
      // 水平滑动
      if (deltaX > 0) {
        move('right')
      } else {
        move('left')
      }
    } else {
      // 垂直滑动
      if (deltaY > 0) {
        move('down')
      } else {
        move('up')
      }
    }
    play('move')
  }
  e.preventDefault() // 阻止默认行为
}

// 组件挂载时初始化游戏并监听键盘事件
onMounted(() => {
  initGame()
  window.addEventListener('keydown', handleKeydown)
})

// 组件卸载时移除键盘事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* 游戏容器样式 */
.game-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: #faf8ef;
  font-family: Arial, sans-serif;
}

/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* 网格样式 */
.grid {
  background: #bbada0;
  border-radius: 5px;
  padding: 15px;
}

.grid-row {
  display: flex;
  margin-bottom: 15px;
}

.grid-row:last-child {
  margin-bottom: 0;
}

/* 单元格样式 */
.cell {
  width: 90px;
  height: 90px;
  background: rgba(238, 228, 218, 0.35);
  border-radius: 3px;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
  font-weight: bold;
  color: #776e65;
}

.cell:last-child {
  margin-right: 0;
}

/* 根据单元格数值动态设置样式 */
.cell-2 {
  background: #eee4da;
}

.cell-4 {
  background: #ede0c8;
}

.cell-8 {
  background: #f2b179;
  color: #f9f6f2;
}

.cell-16 {
  background: #f59563;
  color: #f9f6f2;
}

.cell-32 {
  background: #f67c5f;
  color: #f9f6f2;
}

.cell-64 {
  background: #f65e3b;
  color: #f9f6f2;
}

.cell-128 {
  background: #edcf72;
  color: #f9f6f2;
  font-size: 30px;
}

.cell-256 {
  background: #edcc61;
  color: #f9f6f2;
  font-size: 30px;
}

.cell-512 {
  background: #edc850;
  color: #f9f6f2;
  font-size: 30px;
}

.cell-1024 {
  background: #edc53f;
  color: #f9f6f2;
  font-size: 25px;
}

.cell-2048 {
  background: #edc22e;
  color: #f9f6f2;
  font-size: 25px;
}

/* 游戏结束提示样式 */
.game-over {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px 40px;
  border-radius: 10px;
  text-align: center;
}

/* 按钮样式 */
button {
  margin-top: 10px;
  padding: 10px 20px;
  background: #8f7a66;
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
}

/* 控制按钮区域样式 */
.controls {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

/* 响应式样式 */
@media (max-width: 500px) {
  .cell {
    width: 70px;
    height: 70px;
    font-size: 25px;
  }
}
</style>
