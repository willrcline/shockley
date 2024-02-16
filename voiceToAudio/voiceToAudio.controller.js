const { checkEnd } = require('../helper/checkEnd.js');
const { updateChatHistory, getChatHistory } = require('../helper/cache');
const { chatCompletions } = require('../chatCompletions/chatCompletions.controller.js')
const { textToSpeech } = require('../textToSpeech/textToSpeech.controller');
const { whisper, correctedTranscription } = require('../transcription/transcription.controller.js')
const { getInitialChatHistory } = require('../helper/chatHistory.js')

const voiceToAudio = async ({projectId, userId, audioFile }) => {
    console.log("VoiceToAudio.controller projectId___", projectId)
    var hasEnd = false
    if (projectId === 'JOURNAL_APP_ONBOARDING') {
        hasEnd = true
        var aiModel = "gpt-4"
    }

    var rawTranscript = await whisper(audioFile);
    var correctedTranscript = await correctedTranscription(rawTranscript);
    console.log("VoiceToAudio.controller correctedTranscript___", correctedTranscript)
    
    var inputObj = { "role": "user", "content": correctedTranscript };
    var chatHistory = getChatHistory(projectId, userId);
    if (chatHistory.length === 0) {
        chatHistory = getInitialChatHistory(projectId);
    }

    var updatedChatHistory = [...chatHistory, inputObj];
    
    var chatCompletion = await chatCompletions({ messages: updatedChatHistory, model: aiModel });
    console.log("VoiceToAudio.controller chatCompletion___", chatCompletion)

    
    var responseObj = { ended: false, audioBase64: null, chatHistory: null };

    if (hasEnd && checkEnd(chatCompletion)) {
        responseObj.ended = true;
        responseObj.chatHistory = updatedChatHistory;
        updateChatHistory(projectId, userId, []);
    } else {
        updateChatHistory(projectId, userId, [...updatedChatHistory, { "role": "assistant", "content": chatCompletion }]);
        responseObj.audioBase64 = await textToSpeech({ text: chatCompletion });
    }

    return responseObj;
};

module.exports = { voiceToAudio };
