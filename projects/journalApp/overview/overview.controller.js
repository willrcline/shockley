const { getPeriod } = require('../database/period.js');
const llmPrompts = require('./llmPrompts.js');
const { ragQuery } = require('../rag/ragQuery/ragQuery.controller.js');

const overview = async (userId, periodId, sectionId) => {
  //get period object from periodId
  const period = await getPeriod(periodId);
  const periodType = period.type;

  switch (sectionId) {
    case 'tagCloud':
      // Code for 'tagCloud' section
      console.log('🤯 Snapshot');
      break;
    case 'achievements':
      // Code for 'achievements' section
      console.log('😎 Achievements');
      const vectorFilter = {
        "genre": {"$eq": "documentary"},
        "year": 2019
      }
      const matches = await ragQuery(userId, vectorPrompt, vectorFilter )
      llmPrompts.achievements(periodType);
      break;
    case 'visualized':
      // Code for 'visualized' section
      console.log('🖼 Visualized');
      break;
    case 'quotes':
      // Code for 'quotes' section
      console.log('😇 Highlight Reel');
      break;
    case 'summary':
      // Code for 'summary' section
      console.log('👁️ Overview');
      break;
    case 'goal':
      // Code for 'goal' section
      console.log('🚀 Goal');
      break;
    case 'personality':
      // Code for 'personality' section
      console.log('👤 Personality');
      break;
    case 'suggestions':
      // Code for 'suggestions' section
      console.log('🤔 Suggestions');
      break;
    case 'promptPrescriptions':
      // Code for 'promptPrescriptions' section
      console.log('✅ Journaling assignments');
      break;
    default:
      // Code for handling unknown sectionId
      console.log('Unknown sectionId');
      break;
  }
};

module.exports = {
  overview
};