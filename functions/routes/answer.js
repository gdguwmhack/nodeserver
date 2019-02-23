const express = require('express')
const router = express.Router()
const db = require('../')

router.get('/:id', (req, res) => {
  const answerRef = db.database.collection('answers').doc(req.params.id)

  const getAnswer = answerRef
    .get()
    .then(a => {
      if (!a.exists) {
        return res.send(`no answer with id: ${req.params.id}`)
      } else {
        let resp = {
          id: req.params.id,
          answer_text: a.data().answer_text,
          timestamp: a.data().timestamp,
        }
        return res.send(resp)
      }
    })
    .catch(err => {
      console.log('Error getting answer', err)
    })
})

router.post('/:id', (req, res) => {
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

  const answerRef = db.database.collection('answers').doc(req.params.id)

  var setAnswer = answerRef
    .set({
      answer_text: req.body.answer_text,
      timestamp: today,
    })
    .then(ref => {
      res.send('answer added:' + req.params.id)
    })
    .catch(err => console.error(err))
})

module.exports = router
