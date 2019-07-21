const router = require('express').Router()
const applyRule = require('../public/utils')

router.post('/', (req, res, next) => {
  let errors = []

  const text = req.body.text
  const rule = req.body.rule

  if (!text) {
    errors.push('Please enter a valid text input.')
  } else if (typeof text !== 'string') {
    errors.push('Text input must be a string.')
  }

  if (!rule) {
    errors.push('Please enter a valid rule input.')
  } else if (typeof rule !== 'string') {
    errors.push('Rule input must be a string.')
  }

  if (errors.length) {
    //if the text or the rule aren't formatted correctly, send bad request status with errors
    res.status(400).json({errors})
  } else {
    const ruleApplied = applyRule(text, rule)
    res.status(200).json(ruleApplied)
  }
})

module.exports = router
