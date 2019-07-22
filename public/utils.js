const {nums, currencyList, emailMatch, yyyymmddMatch, mmddyyyyMatch, currencyMatch, punctuation, directionMatch} = require('./consts')



//****** Sanitize beginning and end of text string ******//

const sanitize = str => {
  if (punctuation.includes(str[0])) str = str.slice(1)
  if (punctuation.includes(str[str.length - 1])) str = str.slice(0, -1)
  return str
}



//****** Match number to valid numbers ******//

const numParse = num => {
  if (nums.hasOwnProperty(num)) return nums[num]
  else return null
}



//****** Match valid type of input to regex ******//

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



//****** Match everything after direction word ******//

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



//****** Match each valid word in rule ******//

const ruleParse = str => {
  let ruleSplit = str.split(' ').map(e => {
    return sanitize(e)
  })

  //if the rule doesn't contain a direction word, don't proceed, return error
  if (!directionMatch.includes(ruleSplit[1])) {
    return [null, null, null, 'Rule input is not formatted correctly.', null]
  }

  let numOne = numParse(ruleSplit[0])
  //if the rule is looking for a specific index of word, numTwo is null, else if there is a number after the directional word, capture the number
  let numTwo = ruleSplit.length > 2 ? detailParse(ruleSplit.slice(2))[0] : null
  let type = typeParse(ruleSplit[0])
  let direction = ruleSplit[1]
  let details = detailParse(ruleSplit.slice(2))[1]

  return [numOne, numTwo, type, direction, details]
}



//****** Match each word in text with regex ******//

const textParse = (direction, text, regex, details = null) => {
  if (direction === 'following') {
    for (let i = 0; i < text.length; i++) {
      //match regex one or regex two; date matches have 2 regular expression options
      if (text[i].match(regex[0]) || text[i].match(regex[1]) && details === null) {
        return text[i]
      }
      //no regex necessary to parse text and there are word(s) after the directional word
      if (regex[0] === null && regex[1] === null && text.includes(details)) {
        matchedText[i] = text[i]
        return text[i]
      }
    }
    return 'NO RESULT'
  //if direction is 'preceding', 'through', null
  } else {
    for (let i = text.length - 1; i >= 0; i--) {
      //match regex one or regex two; date matches have 2 regular expression options
      if (text[i].match(regex[0]) || text[i].match(regex[1]) && details === null) {
        return text[i]
      }
      //no regex necessary to parse text and there are word(s) after the directional word
      if (regex[0] === null && regex[1] === null && text.includes(details)) {
        matchedText[i] = text[i]
        return text[i]
      }
    }
    return 'NO RESULT'
  }
}



//****** Based on direction, grab relevant part of text and search for valid answer ******//

const directionParse = (numOne, numTwo, direction, type, textSplit, details) => {
  let result
  let detailsIndex = textSplit.indexOf(details)

  //if there are no indexes to match
  if (numOne === null && numTwo === null) {
    let limitedText
    if (detailsIndex === -1) return 'NO RESULT'
    //if there are no matching regex
    if (type[0] === null && type[1] === null) {
      let foundIndex = textSplit.indexOf(details)
      if (direction === 'preceding') {
        limitedText = textSplit.slice(0, foundIndex + 1)
        result = textParse(direction, limitedText, type, details)
      } else if (direction === 'following') {
        limitedText = textSplit.slice(foundIndex)
        result = limitedText[1]
      }
    //if there are matching regex
    } else {
      if (direction === 'preceding') {
        limitedText = textSplit.slice(0, detailsIndex)
        result = textParse(direction, limitedText, type)
      } else if (direction === 'following') {
        limitedText = textSplit.slice(detailsIndex - 1)
        result = textParse(direction, limitedText, type)
      }
    }
  //if there is at least one index to match
  } else if (numTwo !== null) {
    let textExists = textParse(direction, textSplit, type)
    let foundIndex = textSplit.indexOf(textExists)
    if (direction === 'preceding') {
      if (textSplit.slice(foundIndex + 1).length < numTwo) return 'NO RESULT'
      else result = textParse(direction, textSplit, type)
    } else if (direction === 'following') {
      if (textSplit.slice(0, foundIndex).length < numTwo) return 'NO RESULT'
      else result = textParse(direction, textSplit, type)
    }
  }

  return result
}



//****** Parse the rule and return matching data ******//

const applyRule = (text, rule) => {
  let result
  let textSplit = text.split(' ').map(e => {
    return sanitize(e)
  })
  let textSplitUnsanitized = text.split(' ')

  let [numOne, numTwo, type, direction, details] = ruleParse(rule)

  //if the rule doesn't contain a direction word, don't proceed, return error
  if (!directionMatch.includes(direction)) return {errors: [direction]}
  else {
    if (direction === 'word' || direction === 'words' || direction === 'string' || direction === 'strings') {
      result = textSplit[numOne - 1]
    } else if (direction === 'through') {
      result = textSplitUnsanitized.slice(numOne - 1, numTwo).join(' ')
    } else if (direction === 'preceding' || direction === 'following') {
      result = directionParse(numOne, numTwo, direction, type, textSplit, details)
    }
  }

  return {result}
}

module.exports = applyRule
