const { checkEnd } = require('../helper/checkEnd.js');
const { updateChatHistory, getChatHistory } = require('../helper/cache.js');
const { chatCompletions } = require('../chatCompletions/chatCompletions.controller.js')
const { textToSpeech } = require('../textToSpeech/textToSpeech.controller.js');
const { whisper, correctedTranscription } = require('../transcription/transcription.controller.js')
const { getInitialChatHistory } = require('../helper/chatHistory.js')

const voiceToChatCompletion = async ({projectId, userId, audioFile }) => {
    console.log("voiceToChatCompletion.controller projectId___", projectId)
    var hasEnd = false

    var rawTranscript = await whisper(audioFile);
    var correctedTranscript = await correctedTranscription(rawTranscript);
    console.log("voiceToChatCompletion.controller correctedTranscript___", correctedTranscript)
    
    var inputObj = { "role": "user", "content": correctedTranscript };
    var chatHistory = getChatHistory(projectId, userId);
    if (chatHistory.length === 0) {
        chatHistory = getInitialChatHistory(projectId);
    }

    var updatedChatHistory = [...chatHistory, inputObj];
    
    var chatCompletion = await chatCompletions({ messages: updatedChatHistory });
    console.log("voiceToChatCompletion.controller chatCompletion___", chatCompletion)

    
    var responseObj = { ended: false, chatCompletion: null, chatHistory: null };
    responseObj.chatCompletion = chatCompletion;

    if (hasEnd && checkEnd(chatCompletion)) {
        responseObj.ended = true;
        responseObj.chatHistory = updatedChatHistory;
        updateChatHistory(projectId, userId, []);
    } else {
        updateChatHistory(projectId, userId, [...updatedChatHistory, { "role": "assistant", "content": chatCompletion }]);
    }

    return responseObj;
};

module.exports = { voiceToChatCompletion };
