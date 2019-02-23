const express = require('express')
const router = express.Router()
const db = require('../')

const request = require('request')

router.get('/:id', (req, res) => {
  const questionRef = db.database.collection('questions').doc(req.params.id)

  const getQuestion = questionRef
    .get()
    .then(q => {
      if (!q.exists) {
        return res.send(`no question with id: ${req.params.id}`)
      } else {
        let resp = {
          id: req.params.id,
          question_text: q.data().question_text,
          topic: q.data().topic,
          timestamp: q.data().timestamp,
        }
        return res.send(resp)
      }
    })
    .catch(err => {
      console.log('Error getting document', err)
    })
})

router.post('/', (req, res) => {
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

  db.database
    .collection('questions')
    .add({
      question_text: req.body.question_text,
      timestamp: today,
      topic: 'work',
    })
    .then(ref => {
      const postData = {
        id: 1,
        type: 'message',
        channel: 'thetribe',
        text: `${req.body.question_text}  #${ref.id}`,
      }

      var url =
        'https://hooks.slack.com/services/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'
      var options = {
        method: 'post',
        body: postData,
        json: true,
        url: url,
      }
      request(options, (err, resp, body) => {
        if (err) {
          console.log(err)
        }
        console.error(resp)
        res.send('Id:' + ref.id)
      })
    })
    .catch(err => console.error(err))
})

module.exports = router
