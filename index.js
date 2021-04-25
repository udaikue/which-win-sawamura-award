#! /usr/bin/env node

const { prompt } = require('enquirer')

async function input() {
  const responseA = await prompt([
    {
      type: 'input',
      name: 'name',
      message: '1人目の投手の名前を入力してください'
    },
    {
      type: 'input',
      name: 'pitchedGame',
      message: '登板試合数は?'
    },
    {
      type: 'input',
      name: 'completeGame',
      message: '完投試合数は?'
    },
    {
      type: 'input',
      name: 'victoryGame',
      message: '勝利数は?'
    },
    {
      type: 'input',
      name: 'losingGame',
      message: '敗戦数は?'
    },
    {
      type: 'input',
      name: 'pitchedInning',
      message: '投球回数は?(1未満は切り捨ててください)'
    },
    {
      type: 'input',
      name: 'strikeout',
      message: '奪三振数は?'
    },
    {
      type: 'input',
      name: 'ER',
      message: '自責点は?'
    },
    {
      type: 'input',
      name: 'qualityStart',
      message: 'QS(投球回数7回以上で自責点3点以内)試合数は?'
    }
  ])

  const responseB = await prompt([
    {
      type: 'input',
      name: 'name',
      message: '2人目の投手の名前を入力してください'
    },
    {
      type: 'input',
      name: 'pitchedGame',
      message: '登板試合数は?'
    },
    {
      type: 'input',
      name: 'completeGame',
      message: '完投試合数は?'
    },
    {
      type: 'input',
      name: 'victoryGame',
      message: '勝利数は?'
    },
    {
      type: 'input',
      name: 'losingGame',
      message: '敗戦数は?'
    },
    {
      type: 'input',
      name: 'pitchedInning',
      message: '投球回数は?(1未満は切り捨ててください)'
    },
    {
      type: 'input',
      name: 'strikeout',
      message: '奪三振数は?'
    },
    {
      type: 'input',
      name: 'ER',
      message: '自責点は?'
    },
    {
      type: 'input',
      name: 'qualityStart',
      message: 'QS(投球回数7回以上で自責点3点以内)試合数は?'
    }
  ])

  const pitcherA = calculate(Object.entries(responseA))
  const pitcherB = calculate(Object.entries(responseB))
  const winner = selectFromTwo(pitcherA, pitcherB)
  let result = criteria(winner)

  if (isNAN(Object.entries(responseA)) || isNAN(Object.entries(responseB)) === '入力エラー') {
    result = ['数値以外が入力されています。やり直してください。']
  }
  return result[0]
}

function isNAN (input) {
  for (let index = 1; index < 9; index++) {
    if (isNaN(input[index][1])) {
      return '入力エラー'
    }
  }
}

function calculate (pitcherInput) {
  this.pitcherData = []
  this.pitcherData.push(pitcherInput[0][1]) // 名前
  this.pitcherData.push(parseInt(pitcherInput[1][1])) // 登板試合数
  this.pitcherData.push(parseInt(pitcherInput[2][1])) // 完投試合数
  this.pitcherData.push(parseInt(pitcherInput[3][1])) // 勝利数
  this.pitcherData.push(parseFloat(((parseInt(pitcherInput[3][1]) / (parseInt(pitcherInput[3][1]) + parseInt(pitcherInput[4][1])))).toFixed(2))) // 勝率
  this.pitcherData.push(parseInt(pitcherInput[5][1])) // 投球回数
  this.pitcherData.push(parseInt(pitcherInput[6][1])) // 奪三振数
  this.pitcherData.push(parseFloat(((parseInt(pitcherInput[8][1]) / parseInt(pitcherInput[1][1]))).toFixed(2))) // QS率
  this.pitcherData.push(parseFloat(((parseInt(pitcherInput[7][1]) * 9 / parseInt(pitcherInput[5][1]))).toFixed(2))) // 防御率

  return this.pitcherData
}

function selectFromTwo (pitcherA, pitcherB) {
  let scoreA = 0
  let scoreB = 0
  for (let counter = 1; counter <8 ; counter++) {
    let difference = pitcherA[counter] - pitcherB[counter]
    if (difference > 0) {
      scoreA++
    } else if (difference < 0) {
      scoreB++
    }
  }
  if (scoreA > scoreB) {
    return pitcherA
  }
  else if (scoreA < scoreB) {
    return pitcherB
  }
  else {
    // 同点だった場合、防御率で決める
    return compareERA(pitcherA, pitcherB)
  }
}

function compareERA (pitcherA, pitcherB) {
  if (pitcherA[8] < pitcherB[8]) {
    return pitcherA
  }
  else if (pitcherA[8] > pitcherB[8]) {
    return pitcherB
  }
  else {
    return ['決められませんでした...']
  }
}

function criteria (pitcher) {
  if (pitcher[1] < 20) { // 登板試合数20以上
    return ['該当者なし']
  }
  else if (pitcher[2] < 3) { // 完投数3以上
    return ['該当者なし']
  }
  else if (pitcher[3] < 11) { // 11勝以上
    return ['該当者なし']
  }
  else if (pitcher[4] < 0.6) { // 勝率6割以上
    return ['該当者なし']
  }
  else if (pitcher[5] < 148) { // 投球イニング数148以上
    return ['該当者なし']
  }
  else if (pitcher[8] >= 2.9 ) { // 防御率2.9未満
    return ['該当者なし']
  }
  else {
    return pitcher
  }
}

input().then(value => {
  console.log(`結果: ${value}`)
}).catch(console.error)