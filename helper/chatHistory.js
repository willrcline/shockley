const {journalAppOnboardingInit} = require("../journalApp/helper/onboardingPromptFactory.js")

const getInitialChatHistory = (projectId) => {
    if (projectId === 'JOURNAL_APP_ONBOARDING') {
        return journalAppOnboardingInit;
    }
}

module.exports = { getInitialChatHistory };