const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    res.status(200).send({ message: "Transcription placeholder" });
});

router.get('/', (req, res) => {
    res.send('test');
})

module.exports = router