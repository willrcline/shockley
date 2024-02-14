const express = require('express')
const router = express.Router()
const  multer  =  require('multer')
// const { whisper, correctedTranscription } = require('./transcription.controller')
const  upload  =  multer();
const { onboarding } = require('./onboarding.controller')

router.post('/', upload.single('file'), async (req, res) => {
    const userId = req.query.userId;
    const audioFile = req.file;

    try { 
        var responseObj = await onboarding({userId, audioFile});
        res.status(200).send(responseObj);

    } catch (error) {
        console.error("onboarding.route error___", error);
        res.status(500).send({error: 'Unexpected error processing request.'});
    }
})



module.exports = router
