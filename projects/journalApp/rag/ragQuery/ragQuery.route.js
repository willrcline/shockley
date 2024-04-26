const express = require('express')
const router = express.Router()
const { ragQuery } = require('./ragQuery.controller')

router.post('/', async (req, res) => {
  console.log("ragQuery.route req.body___", req.body)
  const {userId} = req.body

  try { 
      var completion = await ragQuery(userId, userEmail, entryId);
      console.log("ragQuery.route completion___", completion)
      res.status(200).send(completion);

  } catch (error) {
      console.error("ragQuery.route error___", error);
      res.status(500).send({error: 'Unexpected error processing request.'});
  }
})



module.exports = router
