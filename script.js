/** 
 * キャラクターリスト
 * @type {{name: string, desc: string, msg: string}}
 */
const roleList = [
  { name: 'boy', desc: 'プレゼントを待つ少年', msg: '今年はサンタさんくるかなぁ?' },
  { name: 'police', desc: 'クリスマス警察', msg: '悪い夢を取り締まる任務を与えよう' },
  { name: 'reindeer', desc: 'トナカイ', msg: 'お前の鼻が役に立つのさ' },
  { name: 'santa', desc: 'サンタクロース', msg: 'サンタになるってなんだろう？' }
]
/**
 * ルーレットの択のインデックス
 * @type {number}
 */
let roulette = 0
/**
 * setIntervalのid
 * @type {number}
 */
let intervalId

/**
 * 指定した時間(ms)待機する
 * @param {number} ms 待機時間(ms)
 * @returns {Promise<void>}
 */
async function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * ルーレット開始
 */
function startRoulette() {
  document.querySelector('.start-btn').classList.add('none')
  document.querySelector('.stop-btn').classList.remove('none')
  document.querySelector('h1').textContent = ''
  intervalId = setInterval(() => {
    document.querySelector('img').src = `images/${roleList[roulette].name}.png`
    if (roulette < roleList.length - 1) {
      roulette += 1
    } else {
      roulette = 0
    }
  }, 300)
}

/**
 * ルーレット停止
 */
function stopRoulette() {
  clearInterval(intervalId)
  document.querySelector('.stop-btn').classList.add('none')
  document.querySelector('.wait-btn').classList.remove('none')

  //ランダムで生成される
  let XmasRandomNum = 4 + Math.floor(Math.random() * 3)
  let stopRoulette = setInterval(async () => {
    if (roulette < roleList.length - 1) {
      roulette += 1
    } else {
      roulette = 0
    }
    document.querySelector('img').src = `images/${roleList[roulette].name}.png`
    XmasRandomNum -= 1
    if (XmasRandomNum == 0) {
      clearInterval(stopRoulette)
      document.querySelector('h1').textContent = roleList[roulette].desc
      await delay(2500)
      document.querySelector('h1').textContent = roleList[roulette].msg
      await delay(2000)
      document.querySelector('.wait-btn').classList.add('none')
      document.querySelector('.restart-btn').classList.remove('none')
    }
  }, 700)
}

//スタートボタン押下
document.querySelector('.start-btn').addEventListener('click', startRoulette)

//ストップボタン押下
document.querySelector('.stop-btn').addEventListener('click', stopRoulette)