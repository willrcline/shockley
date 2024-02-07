const express = require('express');
const app = express();
require('dotenv').config()
const transcription = require("./transcription/transcription.route");
const port = process.env.PORT || 3001;

app.use(express.json());

// POST route at /v1/transcription
app.use('/v1/transcription', transcription)

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
