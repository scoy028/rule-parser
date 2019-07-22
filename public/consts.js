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
const directionMatch = ['through', 'preceding', 'following', 'word', 'words', 'string', 'strings']

module.exports = {
  nums,
  currencyList,
  emailMatch,
  yyyymmddMatch,
  mmddyyyyMatch,
  currencyMatch,
  punctuation,
  directionMatch
}
