const express = require('express');
const app = express();
require('dotenv').config()
const transcription = require("./transcription/transcription.route");
const voiceToAudio = require("./voiceToAudio/voiceToAudio.route");
const voiceToChatCompletion = require("./voiceToChatCompletion/voiceToChatCompletion.route");
const chatCompletion = require("./chatCompletion/chatCompletion.route");
const ragUpsert = require('./projects/journalApp/rag/ragUpsert/ragUpsert.route')
const port = process.env.PORT || 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/v1/transcription', transcription)
app.use("/v1/voice-to-audio", voiceToAudio)
app.use("/v1/voice-to-chat-completion", voiceToChatCompletion)
app.use("/v1/chat-completion", chatCompletion)
app.use('/v1/rag-upsert', ragUpsert)


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
