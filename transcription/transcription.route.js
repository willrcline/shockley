const express = require('express')
const router = express.Router()
const  multer  =  require('multer')
const { whisper } = require('./transcription.controller')

const  upload  =  multer();

router.post('/', upload.single('file'), async (req, res) => {
    console.log("Transcription request received___")
    try {
        const audioFile = req.file
        if (!audioFile) {
            return res.status(400).send('No file provided.');
        }
        var transcription = await whisper(audioFile)
        res.json({transcription})
    } catch (error) {
        console.error(error)
        res.status(500).send('Error transcribing audio')
    }
});


router.get('/', (req, res) => {
    res.send('test');
})

module.exports = router