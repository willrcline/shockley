const express = require('express')
const router = express.Router()
const { chatCompletion } = require('./chatCompletion.controller')

router.post('/', async (req, res) => {
    const {chatHistory, temperature} = req.body

    try { 
        var completion = await chatCompletion({messages: chatHistory, temperature});
        console.log("chatCompletion.route completion___", completion)
        res.status(200).send(completion);

    } catch (error) {
        console.error("chatCompletion.route error___", error);
        res.status(500).send({error: 'Unexpected error processing request.'});
    }
})



module.exports = router
