const router = require('express').Router()
const applyRule = require('../public/utils')
const ruleParse = require('../public/utils2')

router.get('/', (req, res, next) => {
  try {
    // const text = req.body.text
    const rule = req.body.rule
    // if (!text || !rule) next()
    // const ruleApplied = applyRule(text, rule)
    const ruleApplied = ruleParse(rule)
    res.json(ruleApplied)
  } catch (error) {
    next(error)
  }
})

module.exports = router
