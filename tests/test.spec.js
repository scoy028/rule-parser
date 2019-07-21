/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
// const db = require('../db')
const app = require('../index')
// const User = db.model('user')

describe('Parse route', () => {
  beforeEach(() => {
    // return db.sync({force: true})
  })

  describe('/api', () => {
    const codysEmail = 'cody@puppybook.com'

    beforeEach(() => {
      return User.create({
        email: codysEmail
      })
    })

    it('GET /api', async () => {
      const res = await request(app)
        .get('/api')
        .expect(200)

      expect(res.body).to.be.a('string')
      expect(res.body[0].email).to.be.equal(codysEmail)
    })
  }) // end describe('/api')
}) // end describe('Parse route')


// console.log(applyRule('Hey Jude, don\'t make it bad. Take scoy@gmail.com a sad song and make it better', 'email following 3 words'))

// console.log(applyRule('Take scoy@gmail.com a sad song and make it better', 'email following 3 words')) //NO RESULT

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
