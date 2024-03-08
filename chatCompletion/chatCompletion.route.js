const express = require('express')
const router = express.Router()
const { chatCompletion } = require('./chatCompletion.controller')

router.post('/', async (req, res) => {
    const {chatHistory} = req.body.data;

    try { 
        var chatCompletion = await chatCompletion({messages});
        console.log("voiceToChatCompletion.route responseObj___", responseObj)
        res.status(200).send(chatCompletion);

    } catch (error) {
        console.error("voiceToChatCompletion.route error___", error);
        res.status(500).send({error: 'Unexpected error processing request.'});
    }
})



module.exports = router
