import { ref, reactive } from 'vue'

/**
 * 使用 Vue 的 reactive 和 ref 功能创建并管理游戏状态
 * @returns {Object} 返回包含游戏相关数据和方法的对象
 */
export function useGame() {
  const SIZE = 4
  // 创建一个 4x4 的响应式棋盘数组，初始值为 0
  const board = reactive(Array(SIZE).fill().map(() => Array(SIZE).fill(0)))
  // 创建一个响应式的分数变量
  const score = ref(0)
  // 创建一个响应式的最高分变量
  const bestScore = ref(0)
  // 创建一个响应式的游戏结束标志变量
  const gameOver = ref(false)
  // 创建一个响应式的集合，用于记录新的方块位置
  const newTiles = reactive(new Set())
  // 创建一个响应式的集合，用于记录合并的方块位置
  const mergedTiles = reactive(new Set())

  /**
   * 重置游戏状态
   * 清空棋盘，添加两个新方块，并重置分数和游戏结束标志
   */
  const resetGame = () => {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        board[i][j] = 0
      }
    }
    addNewTile()
    addNewTile()
    score.value = 0
    gameOver.value = false
  }

  /**
   * 在棋盘上添加一个新的方块
   * 随机选择一个空位置，并将其设置为 2 或 4
   */
  const addNewTile = () => {
    const emptyCells = []
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (board[i][j] === 0) emptyCells.push({ i, j })
      }
    }
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      board[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4
    }
  }

  /**
   * 执行一次移动操作
   * 根据指定的方向移动棋盘上的方块，并合并相同的方块
   * @param {string} direction 移动的方向，可以是 'left'、'right'、'up' 或 'down'
   */
  const move = (direction) => {
    let moved = false
    const newBoard = JSON.parse(JSON.stringify(board))

    // 旋转矩阵
    const rotate = matrix => matrix[0].map((_, i) =>
      matrix.map(row => row[i]).reverse()
    )

    // 移动一行中的方块并合并相同的方块
    const moveRow = row => {
      let newRow = row.filter(cell => cell !== 0)
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2
          score.value += newRow[i]
          newRow.splice(i + 1, 1)
          newRow.push(0)
          moved = true
        }
      }
      while (newRow.length < SIZE) newRow.push(0)
      return newRow
    }

    // 根据不同的方向处理棋盘上的方块
    switch (direction) {
      case 'left':
        newBoard.forEach((row, i) => {
          newBoard[i] = moveRow(row)
        })
        break
      case 'right':
        newBoard.forEach((row, i) => {
          newBoard[i] = moveRow([...row].reverse()).reverse()
        })
        break
      case 'up':
        {
          let rotatedUp = rotate(newBoard)
          rotatedUp.forEach((row, i) => {
            rotatedUp[i] = moveRow(row)
          })
          Object.assign(newBoard, rotate(rotatedUp))
        }
        break
      case 'down':
        {
          let rotatedDown = rotate(newBoard).map(row => [...row].reverse())
          rotatedDown.forEach((row, i) => {
            rotatedDown[i] = moveRow(row)
          })
          Object.assign(newBoard, rotate(rotatedDown.map(row => [...row].reverse())))
        }
        break
    }

    // 如果棋盘状态发生变化，则更新棋盘，添加新的方块，并检查游戏是否结束
    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      Object.assign(board, newBoard)
      addNewTile()
      checkGameOver()
    }
  }

  /**
   * 检查游戏是否结束
   * 如果棋盘上没有空位置，且没有相邻的相同数字，则游戏结束
   * @returns {boolean} 如果游戏结束则返回 true，否则返回 false
   */
  const checkGameOver = () => {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (board[i][j] === 0) return false
        if (j < SIZE - 1 && board[i][j] === board[i][j + 1]) return false
        if (i < SIZE - 1 && board[i][j] === board[i + 1][j]) return false
      }
    }
    gameOver.value = true
    return true
  }

  // 返回包含游戏相关数据和方法的对象
  return {
    board,
    score,
    bestScore,
    gameOver,
    newTiles,
    mergedTiles,
    resetGame,
    move,
    checkGameOver
  }
}