const express = require('express')
const router = express.Router()
const { ragUpsert } = require('./ragUpsert.controller')

router.post('/', async (req, res) => {
  console.log("ragUpsert.route req.body___", req.body)
  const {userId, userEmail, entryId} = req.body

  try { 
      var response = await ragUpsert(userId, userEmail, entryId);
      res.status(200).send(response);

  } catch (error) {
      console.error("ragUpsert.route error___", error);
      res.status(500).send({error: 'Unexpected error processing request.'});
  }
})



module.exports = router
