const express = require('express');
const app = express();
require('dotenv').config()
const transcription = require("./transcription/transcription.route");
const onboarding = require("./journalApp/onboarding/onboarding.route")
const port = process.env.PORT || 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/v1/transcription', transcription)

app.use('/v1/onboarding', onboarding)

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
