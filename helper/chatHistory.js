const { journalAppOnboardingInit } = require("../projects/journalApp/onboardingPromptFactory.js")
const { willrclineInit } = require("../projects/willrcline/willrclinePromptFactory.js")

const getInitialChatHistory = (projectId) => {
    switch (projectId) {
        case 'JOURNAL_APP_ONBOARDING':
            return journalAppOnboardingInit;
        case 'WILLRCLINE.COM':
            return willrclineInit;
        default:
            return []
    }
}

module.exports = { getInitialChatHistory };