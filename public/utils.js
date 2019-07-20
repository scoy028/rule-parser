const nums = {
  'first': 1,
  '1st': 1,
  'second': 2,
  '2nd': 2,
  'third': 3,
  '3rd': 3,
  'fourth': 4,
  '4th': 4,
  'fifth': 5,
  '5th': 5,
  'sixth': 6,
  '6th': 6,
  'seventh': 7,
  '7th': 7,
  'eighth': 8,
  '8th': 8,
  'ninth': 9,
  '9th': 9,
  'tenth': 10,
  '10th': 10,
  'eleventh': 11,
  '11th': 11,
  'twelfth': 12,
  '12th': 12
}

const currencyList = {
  'dollars': '$',
  'euros': '€',
  'pounds': '£',
  'rupees': 'Rs',
  'pesos': '$',
  'yen': '¥'
}

const emailMatch = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const yyyymmddMatch = /^\d{2,4}[\/.-]\d{1,2}[\/.-]\d{1,2}$/
const mmddyyyyMatch = /^\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}$/
const currencyMatch = '[0-9]+(\.[0-9]{1,2})?$/'
const punctuation = '.!,\"\"\''

//numOne, numTwo, direction, regexOne, regexTwo
let arr = [0, 0, 0, '', '']

const sanitize = str => {
  if (punctuation.includes(str[0])) str = str.slice(1)
  if (punctuation.includes(str[str.length - 1])) str = str.slice(0, -1)
  return str
}

const directionParse = word => {
  switch(word) {
    case 'preceding':
      return 1
    case 'through':
      return 2
    case 'following':
      return 3
    default:
      return 0
  }
}

const numsParse = arr => {
  let numArr = []
  for (let i = 0; i < arr.length; i++) {
    if (nums.hasOwnProperty(arr[i])) {
      numArr.push(arr[i])
    }
  }
  return numArr
}

const applyRule = (text, rule) => {
  let ruleSplit = rule.split(' ')

  //sanitize rule
  for (let i = 0; i < ruleSplit.length; i++) {
    ruleSplit[i] = sanitize(ruleSplit[i])
  }

  let textSplit = text.split(' ')
  let numOneFromWords = 0
  let numTwoFromWords = null
  let direction
  let regexOne
  let regexTwo
  let result = ''

  if (ruleSplit.length === 2 && nums.hasOwnProperty(ruleSplit[0])) {
    numOneFromWords = nums[ruleSplit[0]]
    result = textSplit[numOneFromWords - 1]
  }

  switch(ruleSplit[0]) {
    case nums.hasOwnProperty(ruleSplit[0]) ? ruleSplit[0] : 'number':
      numOneFromWords = nums[ruleSplit[0]]
      break
    case 'email':
      regexOne = emailMatch
      regexTwo = ''
      result = 'email case'
      break
    case 'string':
      result = 'string case'
      break
    case 'date':
      regexOne = yyyymmddMatch
      regexTwo = mmddyyyyMatch
      result = 'date case'
      break
    case currencyList.hasOwnProperty(ruleSplit[0]) ? ruleSplit[0] : 'currency':
      regexOne = `/^\\${currencyList[ruleSplit[0]]}${currencyMatch}`
      regexTwo = ''
      result = 'currency case'
      break
    default:
      break
  }

  direction = directionParse(ruleSplit[1])
  console.log(direction)
  if (direction === 1) {
    if (ruleSplit.length > 3) {
      numTwoFromWords = +ruleSplit[2]
      console.log('in if')
    }
  } else if (direction === 2 || direction === 3) {
    numTwoFromWords = nums[ruleSplit[2]]
    console.log('in else', ruleSplit[2])
  }

  // switch(direction) {
  //   case 1:
  //     if (ruleSplit.length > 3) {
  //       numTwoFromWords = +ruleSplit[2]
  //     }
  //     break
  //   case 2:
  //     numTwoFromWords = nums[ruleSplit[2]]
  //     result = textSplit.slice(numOneFromWords - 1, numTwoFromWords).join(' ')
  //     break
  //   case 3:
  //     if (ruleSplit.length > 3) {
  //       numTwoFromWords = +ruleSplit[2]
  //     }
  //     break
  //   default:
  //     break
  // }

  for (let i = 0; i < textSplit.length; i++) {
    if (direction === 1 && ruleSplit.length < 4) {
      console.log('direction test', numTwoFromWords)
    }
    if (direction === 2) {
      console.log('following direction test')
    }
  }

  return sanitize(result)
}

module.exports = applyRule

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song and make it better', 'sixth word'))

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song and make it better', 'second through 4th word'))

// console.log(applyRule('Hey Jude, don\'t make it bad. Take scoy@gmail.com a sad song and make it better', 'email following 3 words'))

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song and make it better', 'string following "Jude"'))

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song and 3/4/19 make it better', 'date preceding "make"'))

// console.log(applyRule('Hey Jude, don\'t €5 make it bad. Take a sad song and make it better', 'euros preceding 3 words'))

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song $42.99 and make it better', 'dollars following 3 words'))
