const express = require('express')
const router = express.Router()
const  multer  =  require('multer')
// const { whisper, correctedTranscription } = require('./transcription.controller')
const  upload  =  multer();
import { checkEnd } from '../helper/checkEnd';
import { updateChatHistory, getChatHistory } from '../helper/cache';
import { initialChatHistory } from '../helper/onboardingPromptFactory'
import { chatCompletions } from '../../chatCompletions/chatCompletions.controller';
import { textToSpeech } from '../../textToSpeech/textToSpeech.controller'

router.post('/', upload.single('file'), async (req, res) => {
    const userId = req.query.userId;
    const audioFile = req.file;
    let ended = false;

    var rawTranscript = await whisper(audioFile);
    var correctedTranscript = await correctedTranscription(rawTranscript)

    var inputObj = { "role": "user", "content": correctedTranscript };
    var chatHistory = getChatHistory(userId);
    if (chatHistory.length === 0) {
        chatHistory = initialChatHistory;
    }
    var updatedChatHistory = [...chatHistory, inputObj];  
    var chatCompletion = await chatCompletions({ messages: updatedChatHistory });
    if(checkEnd(chatCompletion)) {
        ended = true;
    }
    else {
        updateChatHistory(userId, [...updatedChatHistory, { "role": "assistant", "content": chatCompletion }])
        var audioBase64 = await textToSpeech({text: responseText});
    }


    response.status(200).send({"data": [
        {"ended": ended},
        {"audioBase64": audioBase64},
    ]});
})



module.exports = router
