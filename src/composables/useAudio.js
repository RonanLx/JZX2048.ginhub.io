// 导入Howl类，用于处理音频播放
import { Howl } from 'howler'

/**
 * 自定义音频钩子函数
 * 该函数创建并管理游戏中的音频资源
 * 不接受参数
 * 返回一个包含play方法的对象，用于播放音频
 */
export default function useAudio() {
  // 定义音频资源，包含移动、合并和游戏结束三种音效
  const sounds = {
    move: new Howl({ src: ['/sounds/move.wav'] }),
    merge: new Howl({ src: ['/sounds/merge.wav'] }),
    gameOver: new Howl({ src: ['/sounds/gameOver.wav'] })
  }

  /**
   * 播放指定类型的音频
   * @param {string} type - 音频类型，可以是'move'、'merge'或'gameOver'
   */
  const play = (type) => {
    sounds[type]?.play()
  }

  // 返回play方法，允许外部调用以播放音频
  return { play }
}