const {expect} = require('chai')
const request = require('supertest')
const app = require('../server')
const applyRule = require('../public/utils')

describe('Rule Parser', () => {

  describe('/api POST unit tests', () => {

    it('parses an email', () => {
      let emailParse = applyRule('Hey Jude, don\'t make it bad. Take scoy@gmail.com a sad song and make it better', 'email following 3 words')
      let result = 'scoy@gmail.com'

      expect(emailParse).to.be.an('object')
      expect(emailParse.result).to.be.equal(result)
    })

    it('parses currency', () => {
      let currencyParse = applyRule('Hey Jude, don\'t €5 make it bad. Take a sad song and make it better', 'euros preceding 3 words')
      let result = '€5'

      expect(currencyParse).to.be.an('object')
      expect(currencyParse.result).to.be.equal(result)
    })

    it('parses a date', () => {
      let dateParse = applyRule('Hey Jude, don\'t it bad. Take a sad song and 3/4/19 make it better', 'date preceding "make"')
      let result = '3/4/19'

      expect(dateParse).to.be.an('object')
      expect(dateParse.result).to.be.equal(result)
    })

    it('returns a response if rule can\'t be met', () => {
      let errorParse = applyRule('Take scoy@gmail.com a sad song and make it better', 'email following 3 words')
      let result = 'NO RESULT'

      expect(errorParse).to.be.an('object')
      expect(errorParse.result).to.be.equal(result)
    })

  }) // end describe('/api POST unit tests')

  describe('/api POST integration tests', () => {

    it('returns an email', async () => {
      const scoyEmail = 'scoy@gmail.com'
      const res = await request(app)
        .post('/api')
        .send({
          text: 'Hey Jude, don\'t make it bad. Take scoy@gmail.com a sad song and make it better',
          rule: 'email following "add email here"'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.result).to.be.a('string')
      expect(res.body.result).to.be.equal(scoyEmail)
    })

    it('returns a range of indexes', async () => {
      const secThrFourWord = 'Jude, don\'t make'
      const res = await request(app)
        .post('/api')
        .send({
          text: 'Hey Jude, don\'t make it bad. Take a sad song and make it better',
          rule: 'second through 4th word'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.result).to.be.a('string')
      expect(res.body.result).to.be.equal(secThrFourWord)
    })

    it('returns a single index', async () => {
      const sixthWord = 'bad'
      const res = await request(app)
        .post('/api')
        .send({
          text: 'Hey Jude, don\'t make it bad. Take a sad song and make it better',
          rule: 'sixth word'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.result).to.be.a('string')
      expect(res.body.result).to.be.equal(sixthWord)
    })

    it('returns currency', async () => {
      const dollarsWord = '$42.99'
      const res = await request(app)
        .post('/api')
        .send({
          text: 'Hey Jude, don\'t make it bad. Take a sad song $42.99 and make it better',
          rule: 'dollars following 3 words'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.result).to.be.a('string')
      expect(res.body.result).to.be.equal(dollarsWord)
    })

    it('returns an error if no text is provided', async () => {
      const noTextError = 'Please enter a valid text input.'
      const res = await request(app)
        .post('/api')
        .send({
          rule: 'dollars following 3 words'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)

      expect(res.body.errors).to.be.an('array')
      expect(res.body.errors).to.include(noTextError)
    })
  }) // end describe('/api POST integration tests')

}) // end describe('Rule parser')


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

// console.log(applyRule('sad song $42.99 and make it better', 'dollars following 3 words')) //NO RESULT







// console.log(applyRule('Hey Jude, don\'t make it bad. Take scoy@gmail.com a sad song and make it better', 'email following 3 words'))

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song and make it better', 'second through 4th word'))

// console.log(applyRule('Hey Jude, don\'t make it bad. Take a sad song and make it better', 'sixth word'))
