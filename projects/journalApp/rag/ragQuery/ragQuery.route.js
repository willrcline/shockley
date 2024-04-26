const express = require('express')
const router = express.Router()
const { ragQuery } = require('./ragQuery.controller')

router.post('/', async (req, res) => {
  const {userId, query, topK = 3} = req.body

  try { 
      var response = await ragQuery(userId, query, topK);
      res.status(200).send(response);

  } catch (error) {
      console.error("ragQuery.route error___", error);
      res.status(500).send({error: 'Unexpected error processing request.'});
  }
})



module.exports = router
