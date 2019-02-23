const express = require('express')
const router = express.Router()
const db = require('../')

router.get('/', (req, res) => {
  db.database
    .collection('questions')
    .get()
    .then(snapshot => {
      const qs = []
      snapshot.forEach(q => {
        qs.push({
          id: q.id,
          question_text: q.data().question_text,
          topic: q.data().topic,
          timestamp: q.data().timestamp,
        })
      })
      res.send({ questions: qs })
    })
    .catch(err => {
      console.log('Error getting questions', err)
    })
})

module.exports = router
