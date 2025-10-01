const roleList = [
  { name: 'boy', desc: 'プレゼントを待つ少年', msg: '今年はサンタさんくるかなぁ?' },
  { name: 'police', desc: 'クリスマス警察', msg: '悪い夢を取り締まる任務を与えよう' },
  { name: 'reindeer', desc: 'トナカイ', msg: 'お前の鼻が役に立つのさ' },
  { name: 'santa', desc: 'サンタクロース', msg: 'サンタになるってなんだろう...?' }
]
let roulette = 0;
let intervalId;

document.querySelector('.start-btn').addEventListener('click', () => {
  new Audio('audio/bell.mp3')
  document.querySelector('.start-btn').classList.add('none')
  document.querySelector('.stop-btn').classList.remove('none')
  document.querySelector('h1').textContent = '　'
  intervalId = setInterval(() => {
    new Audio('audio/bell.mp3').play()
    document.querySelector('img').src = `images/${roleList[roulette].name}.png`
    if (roulette < roleList.length - 1) {
      roulette += 1;
    } else {
      roulette = 0
    }
  }, 300)
})

document.querySelector('.stop-btn').addEventListener('click', () => {
  clearInterval(intervalId)
  document.querySelector('.stop-btn').classList.add('none')
  document.querySelector('.wait-btn').classList.remove('none')
  //ランダムで生成される
  let XmasRandomNum = 4 + Math.floor(Math.random() * 3)
  let stopRoulette = setInterval(() => {
    new Audio('audio/bell.mp3').play()
    if (roulette < roleList.length - 1) {
      roulette += 1;
    } else {
      roulette = 0
    }
    document.querySelector('img').src = `images/${roleList[roulette].name}.png`
    XmasRandomNum -= 1;
    if (XmasRandomNum == 0) {
      clearInterval(stopRoulette)
      document.querySelector('h1').textContent = roleList[roulette].desc
      setTimeout(() => {
        document.querySelector('h1').textContent = roleList[roulette].msg
        setTimeout(() => {
          document.querySelector('.wait-btn').classList.add('none')
          document.querySelector('.restart-btn').classList.remove('none')
        }, 2500);
      }, 2000)
    }
  }, 700)
})