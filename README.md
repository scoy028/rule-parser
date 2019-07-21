# Rule Parser

Rule Parser is an API service with one endpoint that takes text and a human-readable sentence that describes a rule to apply a regex to the original text.
The response is the part of the text that is captured based on the rule.

The rules can be structured as follows:
  "second word"
  "second through 4th word"
  "email following 3 words"
  "string preceding 'phone'"
  "date preceding 'Phone'"

The request body should look like this:
  {
    "text": "Some random string that will change over every request and can be anything",
    "rule": "dollars following 3 words"
  }

## Dev Start

`npm run start` will start the server

If you want to run the test, you can also `npm run test`.

Use Postman to test your request.
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/71bc5e8118f0afa9c360)
