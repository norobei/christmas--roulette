/** 
 * キャラクターリスト
 * @type {{name: string, desc: string, msg: string, url: string, soundCh: number}}
 */
const roleList = [
  {
    name: 'boy', desc: 'プレゼントを待つ少年', msg: '今年はサンタさんくるかなぁ?',
    url: 'https://norobei.github.io/christmas-roulette-web/boy_waiting_for_present.html',
    soundCh: 37
  },
  {
    name: 'police', desc: 'クリスマス警察', msg: '悪い夢を取り締まる任務を与えよう',
    url: 'https://norobei.github.io/christmas-roulette-web/keisatsu.html',
    soundCh: 36
  },
  {
    name: 'reindeer', desc: 'トナカイ', msg: 'お前の鼻が役に立つのさ',
    url: 'https://norobei.github.io/christmas-roulette-web/reindeer.html',
    soundCh: 35
  },
  {
    name: 'santa', desc: 'サンタクロース', msg: 'メリークリスマス！',
    url: 'https://norobei.github.io/christmas-roulette-web/santa.html',
    soundCh: 31
  }
]
/**
 * LED点灯パターン
 * @type {{led1: boolean, led2: boolean, led3: boolean}[]}
 */
const targetLEDMapList = [
  { led1: true, led2: false, led3: false },
  { led1: false, led2: true, led3: false },
  { led1: false, led2: false, led3: true }
]
/**
 * ルーレットの択のインデックス
 * @type {number}
 */
let roulette
/**
 * LED点灯パターンのインデックス
 * @type {number}
 */
let led
/**
 * setIntervalのid
 * @type {number}
 */
let intervalId

// 初期化処理
initialize()

/**
 * 初期化処理
 */
function initialize() {
  roulette = 0
  led = 0

  //スタートボタン押下
  document.querySelector('.start-btn').addEventListener('click', startRoulette)
  //ストップボタン押下
  document.querySelector('.stop-btn').addEventListener('click', stopRoulette)

  // ジングルベルを再生するAPIを呼び出す
  const jingleBellCh = '33'
  fetchSoundPlay(jingleBellCh)
}

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
 * 配列の次のインデックスを取得する
 * @param {unknown[]} targetList 対象の配列
 * @param {number} currentIndex 現在のインデックス
 */
function getNextIndex(targetList, currentIndex) {
  if (currentIndex < targetList.length - 1) {
    return currentIndex + 1
  } else {
    return 0
  }
}

/**
 * ジングルベルを再生するAPIを呼び出す
 * @param {number} パトライトのサウンドチャンネル
 * @returns {void}
 */
function fetchSoundPlay(soundCh) {
  const endpoint = '/patlite'
  const queryLED = '00000'
  const querySound = String(soundCh)
  const query =
    `led=${queryLED}&sound=${querySound}`
  fetch(`${endpoint}?${query}`).then((response) => {
    if (!response.ok) {
      console.error('ジングルベル再生失敗', 'status:' + response.status)
    }
  }).catch((error) => {
    console.error('ジングルベル再生失敗', error)
  })
}

/**
 * LEDを点灯させるAPIを呼び出す
 * @param {{led1: boolean, led2: boolean, led3: boolean}} targetLEDMap 点灯対象のLEDのマップ
 * @returns {void}
 */
function fetchLEDOn(targetLEDMap) {
  const endpoint = '/patlite'
  const queryLED =
    `${targetLEDMap.led1 ? '1' : '0'}${targetLEDMap.led2 ? '1' : '0'}${targetLEDMap.led3 ? '1' : '0'}00`
  const querySound = '40'
  const query =
    `led=${queryLED}&sound=${querySound}`
  fetch(`${endpoint}?${query}`).then((response) => {
    if (!response.ok) {
      console.error('LED点灯失敗', 'status:' + response.status)
    }
  }).catch((error) => {
    console.error('LED点灯失敗', error)
  })
}

/**
 * ルーレット開始
 */
function startRoulette() {
  roulette = 0
  led = 0
  document.querySelector('.start-btn').classList.add('none')
  document.querySelector('.stop-btn').classList.remove('none')
  document.querySelector('h1').textContent = ''
  intervalId = setInterval(() => {
    document.querySelector('img').src = `images/${roleList[roulette].name}.png`
    fetchLEDOn(targetLEDMapList[led])
    led = getNextIndex(targetLEDMapList, led)
    roulette = getNextIndex(roleList, roulette)
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
    document.querySelector('img').src = `images/${roleList[roulette].name}.png`
    fetchLEDOn(targetLEDMapList[led])
    XmasRandomNum -= 1
    if (XmasRandomNum == 0) {
      clearInterval(stopRoulette)
      document.querySelector('h1').textContent = roleList[roulette].desc
      await delay(2500)
      document.querySelector('h1').textContent = roleList[roulette].msg
      await delay(2000)
      document.querySelector('.wait-btn').classList.add('none')
      document.querySelector('.restart-btn').classList.remove('none')
      document.getElementById('image_link').setAttribute('href', roleList[roulette].url)
      document.querySelector('#click_label').textContent = '＼クリック！／'
      fetchSoundPlay(roleList[roulette].soundCh)
    }
    roulette = getNextIndex(roleList, roulette)
    led = getNextIndex(targetLEDMapList, led)
  }, 700)
}