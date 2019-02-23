const functions = require('firebase-functions')
const express = require('express')
const question = require('./routes/question')
const questions = require('./routes/questions')
const answer = require('./routes/answer')
const admin = require('firebase-admin')
const request = require('request')
const cors = require('cors')

admin.initializeApp(functions.config().firebase)

exports.database = database = admin.firestore()

const app = express()
app.use(cors())

app.use('/question', question)
app.use('/questions', questions)
app.use('/answer', answer)

app.post('/slack', (req, res) => {
  console.log(req.body)
  var today = new Date()
  var dd = today.getDate()

  var mm = today.getMonth() + 1
  var yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }
  today = mm + '/' + dd + '/' + yyyy

  const answerRef = database
    .collection('answers')
    .doc(req.body.event.text.split('#')[1])

  var setAnswer = answerRef
    .set({
      answer_text: req.body.event.text.split('#')[0],
      timestamp: today,
    })
    .then(ref => {
      res.send('answer added:' + req.params.id)
    })
    .catch(err => console.error(err))

  console.error(req.body)
  res.send(req.body)
})

app.get('/test', (req, res) => {
  res.send('service is running')
})

exports.app = functions.https.onRequest(app)
