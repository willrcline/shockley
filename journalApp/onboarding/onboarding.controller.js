import { checkEnd } from '../helper/checkEnd.js'
import { checkEnd } from '../helper/checkEnd';
import { updateChatHistory, getChatHistory } from '../helper/cache';
import { initialChatHistory } from '../helper/onboardingPromptFactory'
import { chatCompletions } from '../../chatCompletions/chatCompletions.controller';
import { textToSpeech } from '../../textToSpeech/textToSpeech.controller'

const onboarding = async ({userId, audioFile}) => {
    var responseObj = {ended: false, audioBase64: null, chatHistory: null};

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
        responseObj.ended = true;
        responseObj.chatHistory = updatedChatHistory;
    }
    else {
        updateChatHistory(userId, [...updatedChatHistory, { "role": "assistant", "content": chatCompletion }])
        responseObj.audioBase64 = await textToSpeech({text: responseText});
    }

    return responseObj;
}

export { onboarding }