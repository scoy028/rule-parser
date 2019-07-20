const express = require('express')
const app = express()
const compression = require('compression')
const path = require('path')
const PORT = 3000

// body parsing middleware
app.use(express.json())

// compression middleware
app.use(compression())

//api route
app.use('/api', require('../api'))

//serve static files
app.use(express.static(path.join(__dirname, '..', 'public')))

//any remaining requests, send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
  } else {
    next()
  }
})

//sends HTML file
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})

//error handling
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

//start server
app.listen(PORT, () => {
  console.log(`Listening on port `, PORT)
})

module.exports = app
