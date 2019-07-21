const express = require('express')
const app = express()
const PORT = 3000

// body parsing middleware + limit on text body size
app.use(express.json({limit: '5kb'}))

//api route
app.use('/api', require('../api'))

//error handling
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).json({errors: [err.message || 'Internal server error.']})
})

//start server
app.listen(PORT, () => {
  console.log(`Listening on port `, PORT)
})

module.exports = app
