const express = require('express')
const router = express.Router()
const { ragUpsert } = require('./ragUpsert.controller')

router.post('/', async (req, res) => {
  console.log("ragUpsert.route req.body___", req.body)
  const {userId, entryId} = req.body

  try { 
      var completion = await ragUpsert(userId, userEmail, entryId);
      console.log("ragUpsert.route completion___", completion)
      res.status(200).send(completion);

  } catch (error) {
      console.error("ragUpsert.route error___", error);
      res.status(500).send({error: 'Unexpected error processing request.'});
  }
})



module.exports = router
