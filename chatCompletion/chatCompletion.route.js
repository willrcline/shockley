const express = require('express')
const router = express.Router()
const { chatCompletion } = require('./chatCompletion.controller')

router.post('/', async (req, res) => {
    console.log("chatCompletion.route req.body___", req.body)
    const {chatHistory} = req.body.data;
    console.log("chatCompletion.route chatHistory___", chatHistory)

    try { 
        var completion = await chatCompletion({messages: chatHistory});
        console.log("chatCompletion.route completion___", completion)
        res.status(200).send(completion);

    } catch (error) {
        console.error("chatCompletion.route error___", error);
        res.status(500).send({error: 'Unexpected error processing request.'});
    }
})



module.exports = router
