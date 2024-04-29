const express = require('express');
const app = express();
require('dotenv').config()
const transcription = require("./transcription/transcription.route");
const voiceToAudio = require("./voiceToAudio/voiceToAudio.route");
const voiceToChatCompletion = require("./voiceToChatCompletion/voiceToChatCompletion.route");
const chatCompletion = require("./chatCompletion/chatCompletion.route");
const ragUpsert = require('./projects/journalApp/rag/ragUpsert/ragUpsert.route')
const ragQuery = require("./projects/journalApp/rag/ragQuery/ragQuery.route")
const overview = require('./projects/journalApp/overview/overview.route')
const bulkPeriods = require('./projects/journalApp/bulkPeriods/bulkPeriods.route')
const port = process.env.PORT || 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/v1/transcription', transcription)
app.use("/v1/voice-to-audio", voiceToAudio)
app.use("/v1/voice-to-chat-completion", voiceToChatCompletion)
app.use("/v1/chat-completion", chatCompletion)
app.use('/v1/rag-upsert', ragUpsert)
app.use('/v1/rag-query', ragQuery)
app.use('/v1/journal-app/overview', overview)
app.use('/v1/journal-app/bulk-periods', bulkPeriods)


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
