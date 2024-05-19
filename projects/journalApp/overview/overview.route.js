const express = require('express')
const router = express.Router()
const { overview } = require('./overview.controller')

router.post('/', async (req, res) => {
  const {userId, periodId, sectionId} = req.body
  console.log("overview.route userId, periodId, sectionId___", userId, periodId, sectionId)

  try { 
      var response = await overview(userId, periodId, sectionId);
      res.status(200).send(response);

  } catch (error) {
      console.error("overview.route error___", error);
      res.status(500).send({error: 'Unexpected error processing request.'});
  }
})

module.exports = router