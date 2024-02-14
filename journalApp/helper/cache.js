const NodeCache = require('node-cache');

const chatCache = new NodeCache({ stdTTL: 86400 });

function updateChatHistory(userId, chatHistory) {
    var key = "onboarding_" + userId;
    chatCache.set(key, chatHistory);
}

function getChatHistory(userId) {
    var key = "onboarding_" + userId;
    return chatCache.get(key) || [];
}

module.exports = { updateChatHistory, getChatHistory };
