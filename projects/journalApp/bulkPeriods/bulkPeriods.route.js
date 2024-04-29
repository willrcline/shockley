const express = require('express')
const router = express.Router()
const { bulkPeriods } = require('./bulkPeriods.controller')

router.post('/', async (req, res) => {
  const {userId} = req.body

  try { 
      var response = await bulkPeriods(userId);
      res.status(200).send(response);

  } catch (error) {
      console.error("bulkPeriods.route error___", error);
      res.status(500).send({error: 'Unexpected error processing request.'});
  }
})



module.exports = router
