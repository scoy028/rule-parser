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
const currencyMatch = '[0-9]+(\.[0-9]{1,2})?$'
const punctuation = '.!,\"\"\''

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

const numParse = num => {
  if (nums.hasOwnProperty(num)) return nums[num]
  else return null
}

const typeParse = word => {
  switch(word) {
    case 'email':
      return [emailMatch, null]
    case 'string':
      return [null, null]
    case 'date':
      return [yyyymmddMatch, mmddyyyyMatch]
    case currencyList.hasOwnProperty(word) ? word : 'currency':
      let newRegex = new RegExp(`^\\${currencyList[word]}${currencyMatch}`)
      return [newRegex, null]
    default:
      return []
  }
}

const detailParse = words => {
  let numTwo
  let word
  if (words.length === 1) {
    numTwo = null
    word = words.join(' ')
  } else {
    if (numParse(words[0]) !== null) {
      numTwo = numParse(words[0])
    } else if (!isNaN(+words[0])) {
      numTwo = words[0]
    }
    word = null
  }
  return [numTwo, word]
}

const ruleParse = str => {
  let ruleSplit = str.split(' ')

  for (let i = 0; i < ruleSplit.length; i++) {
    ruleSplit[i] = sanitize(ruleSplit[i])
  }
  console.log('rule split', ruleSplit)
  let numOne = numParse(ruleSplit[0])
  let numTwo = ruleSplit.length > 2 ? detailParse(ruleSplit.slice(2))[0] : null
  let type = typeParse(ruleSplit[0])
  let direction = directionParse(ruleSplit[1])
  let details = detailParse(ruleSplit.slice(2))[1]

  return [numOne, numTwo, type, direction, details]
}

const parseText = (text, regex, details = null) => {
  for (let i = 0; i < text.length; i++) {
    if (text[i].match(regex[0]) || text[i].match(regex[1])) {
      return text[i]
    }
    if (regex[0] === null && regex[1] === null && text.includes(details)) {
      return text[i]
    }
  }
  return 'NO RESULT'
}

const applyRule = (text, rule) => {
  let textSplit = text.split(' ')

  for (let i = 0; i < textSplit.length; i++) {
    textSplit[i] = sanitize(textSplit[i])
  }

  let [numOne, numTwo, type, direction, details] = ruleParse(rule)
  let detailsIndex = textSplit.indexOf(details)
  let result

  console.log('text split', textSplit)
  console.log('parsed rule', [numOne, numTwo, type, direction, details])
  console.log('details index', detailsIndex)
  if (direction === 0) {
    result = textSplit[numOne - 1]
  }

  if (direction === 2) {
    result = textSplit.slice(numOne - 1, numTwo).join(' ')
  }

  if (direction === 1) {
    if (numOne === null && numTwo === null) {
      let limitedText
      console.log('type', type)
      if (type[0] === null && type[1] === null) {
        let foundIndex = textSplit.indexOf(details)
        console.log('found index', foundIndex)
        limitedText = textSplit.slice(0, foundIndex + 1)
        console.log('limited textttt', limitedText)
        result = parseText(limitedText, type, details)
      } else {
        limitedText = textSplit.slice(0, detailsIndex)
        result = parseText(limitedText, type)
      }
    } else if (numTwo !== null) {
      let textExists = parseText(textSplit, type)
      let foundIndex = textSplit.indexOf(textExists)
      if (textSplit.slice(foundIndex + 1).length < numTwo) return 'NO RESULT'
      else result = parseText(textSplit, type)
    }
  }

  if (direction === 3) {
    if (numOne === null && numTwo === null) {
      let limitedText
      console.log('type', type)
      if (type[0] === null && type[1] === null) {
        let foundIndex = textSplit.indexOf(details)
        console.log('found index', foundIndex)
        limitedText = textSplit.slice(foundIndex)
        console.log('limited textttt', limitedText)
        result = limitedText[1]
      } else {
        limitedText = textSplit.slice(detailsIndex - 1)
        result = parseText(limitedText, type)
      }
    } else if (numTwo !== null) {
      let textExists = parseText(textSplit, type)
      let foundIndex = textSplit.indexOf(textExists)
      if (textSplit.slice(0, foundIndex).length < numTwo) return 'NO RESULT'
      else result = parseText(textSplit, type)
    }
  }
  // return sanitize(result)
  return result
}

module.exports = ruleParse

console.log(applyRule('Hey Jude, don\'t make it bad. Take scoy@gmail.com a sad song and make it better', 'email following 3 words'))

console.log(applyRule('Take scoy@gmail.com a sad song and make it better', 'email following 3 words')) //NO RESULT

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song and make it better', 'string following "Jude"'))

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song and make it better', 'email following "Jude"')) //NO RESULT

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song and make it better', 'string preceding "Jude"'))

// console.log(applyRule('Hey Jude, don\'t it bad. Take a sad song and 3/4/19 make it better', 'date preceding "make"'))

// console.log(applyRule('Hey Jude, don\'t it bad. Take a sad song and 3/4/19 it better', 'date preceding "make"')) //NO RESULT

// console.log(applyRule('Hey Jude, don\'t €5 make it bad. Take a sad song and make it better', 'euros preceding 3 words'))

// console.log(applyRule('Hey Jude, don\'t $5 make it bad. Take a sad song and make it better', 'euros preceding 3 words')) //NO RESULT

// console.log(applyRule('Hey Jude, don\'t €5 make it', 'euros preceding 3 words')) //NO RESULT

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song $42.99 and make it better', 'dollars following 3 words'))

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song €42.99 and make it better', 'dollars following 3 words')) //NO RESULT

// console.log(applyRule('sad song $42.99 and make it better', 'dollars following 3 words'))

// console.log("\nTEST: date preceding phone" + ruleParse('date preceding "phone"') + "\n")

// console.log("\nTEST: email following 3 words" + ruleParse('email following 3 words') + "\n")

// console.log("\nTEST: second through 4th word" + ruleParse('second through 4th word') + "\n")

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song and make it better', 'sixth word'))

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song and make it better', 'second through 4th word'))
