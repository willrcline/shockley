import { journalAppOnboardingInit } from "../journalApp/helper/onboardingPromptFactory"}

const getInitialChatHistory = (projectId) => {
    if (projectId === 'JOURNAL_APP_ONBOARDING') {
        return journalAppOnboardingInit;
    }
}

module.exports = { getInitialChatHistory };