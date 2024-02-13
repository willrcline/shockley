const express = require('express')
const router = express.Router()
const  multer  =  require('multer')
const { whisper, correctedTranscription } = require('./transcription.controller')

const  upload  =  multer();

router.post('/', upload.single('file'), async (req, res) => {
    const corrected = req.query.corrected === 'true'; // Ensuring 'corrected' is treated as a boolean
    console.log("Transcription request received req___", req);

    try {
        const audioFile = req.file;
        console.log("transcription.route audioFile___", audioFile);
        if (!audioFile) {
            // No file was uploaded
            return res.status(400).send({error: 'No file provided.'});
        }

        try {
            // Attempt to get the raw transcription
            var rawTranscript = await whisper(audioFile);
            var transcription = rawTranscript;
        } catch (error) {
            // Handle errors from the whisper function
            console.error("Error during raw transcription: ", error);
            return res.status(500).send({error: 'Error transcribing audio with whisper.'});
        }

        if (corrected) {
            try {
                // Attempt to correct the transcription if requested
                var correctedTranscript = await correctedTranscription(transcription);
                transcription = correctedTranscript;
            } catch (error) {
                // Handle errors from the correctedTranscription function
                console.error("Error during transcription correction: ", error);
                return res.status(500).send({error: 'Error correcting transcription.'});
            }
        }

        res.json({transcription});
    } catch (error) {
        // Catch any unexpected errors
        console.error("Unexpected error: ", error);
        res.status(500).send({error: 'Unexpected error processing request.'});
    }
});



router.get('/', (req, res) => {
    res.send('test');
})

module.exports = router