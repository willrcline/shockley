const NodeCache = require('node-cache');

const chatCache = new NodeCache({ stdTTL: 86400 });

function updateChatHistory(projectId, userId, chatHistory) {
    var key = getKey(projectId, userId);
    chatCache.set(key, chatHistory);
}

function getChatHistory(projectId, userId) {
    var key = getKey(projectId, userId)
    return chatCache.get(key) || [];
}

function getKey(projectId, userId) {
    return projectId + userId;
}

module.exports = { updateChatHistory, getChatHistory };
