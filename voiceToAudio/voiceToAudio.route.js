const express = require('express')
const router = express.Router()
const  multer  =  require('multer')
// const { whisper, correctedTranscription } = require('./transcription.controller')
const  upload  =  multer();
const { voiceToAudio } = require('./voiceToAudio.controller')

router.post('/', upload.single('file'), async (req, res) => {
    console.log("voiceToAudio.route req.query___", req.query)
    const userId = req.query.userId;
    const projectId = req.query.projectId;
    const audioFile = req.file;

    try { 
        var responseObj = await voiceToAudio({projectId, userId, audioFile});
        res.status(200).send(responseObj);

    } catch (error) {
        console.error("voiceToAudio.route error___", error);
        res.status(500).send({error: 'Unexpected error processing request.'});
    }
})



module.exports = router
