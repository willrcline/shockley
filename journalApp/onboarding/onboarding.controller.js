const { checkEnd } = require('../helper/checkEnd.js');
const { updateChatHistory, getChatHistory } = require('../helper/cache');
const { initialChatHistory } = require('../helper/onboardingPromptFactory');
const { chatCompletions } = require('../../chatCompletions/chatCompletions.controller');
const { textToSpeech } = require('../../textToSpeech/textToSpeech.controller');
const { whisper, correctedTranscription } = require('../../transcription/transcription.controller.js')

const onboarding = async ({ userId, audioFile }) => {
    var responseObj = { ended: false, audioBase64: null, chatHistory: null };

    var rawTranscript = await whisper(audioFile);
    var correctedTranscript = await correctedTranscription(rawTranscript);

    var inputObj = { "role": "user", "content": correctedTranscript };
    var chatHistory = getChatHistory(userId);
    if (chatHistory.length === 0) {
        chatHistory = initialChatHistory;
    }
    var updatedChatHistory = [...chatHistory, inputObj];

    var chatCompletion = await chatCompletions({ messages: updatedChatHistory });

    if (checkEnd(chatCompletion)) {
        responseObj.ended = true;
        responseObj.chatHistory = updatedChatHistory;
    } else {
        updateChatHistory(userId, [...updatedChatHistory, { "role": "assistant", "content": chatCompletion }]);
        responseObj.audioBase64 = await textToSpeech({ text: responseText });
    }

    return responseObj;
};

module.exports = { onboarding };
