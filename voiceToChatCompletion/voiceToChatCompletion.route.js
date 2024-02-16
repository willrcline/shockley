const express = require('express')
const router = express.Router()
const  multer  =  require('multer')
// const { whisper, correctedTranscription } = require('./transcription.controller')
const  upload  =  multer();
const { voiceToChatCompletion } = require('./voiceToChatCompletion.controller')

router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
    const userId = req.query.userId;
    const projectId = req.query.projectId;
    const audioFile = req.file;

    try { 
        var responseObj = await voiceToChatCompletion({projectId, userId, audioFile});
        res.status(200).send(responseObj);

    } catch (error) {
        console.error("voiceToChatCompletion.route error___", error);
        res.status(500).send({error: 'Unexpected error processing request.'});
    }
})



module.exports = router
