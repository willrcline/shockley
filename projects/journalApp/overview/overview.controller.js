const { getPeriod } = require('../database/period.js');
const llmPrompts = require('./llmPrompts.js');
const { ragQuery } = require('../rag/ragQuery/ragQuery.controller.js');
const { convertTimestampToInt } = require('../utils/datetime.js')
const { chatCompletion } = require('../../../chatCompletion/chatCompletion.controller.js');

const overview = async (userId, periodId, sectionId) => {
  const period = await getPeriod(periodId);
  const periodType = period.type;
  const periodStart = convertTimestampToInt(period.periodStartDate);
  const periodEnd = convertTimestampToInt(period.periodEndDate);
  const vectorFilter = {
    "$and": [{ "dateCreated": {"$gte": periodStart} }, { "dateCreated": {"$lte": periodEnd} }]
  }

  switch (sectionId) {
    case 'tagCloud':
      break;
    case 'achievements':
      const vectorPrompt = `achievement or accomplishment attained`
      const matches = await ragQuery(userId, vectorPrompt, vectorFilter)

      const llmPrompt = llmPrompts.achievements(periodType, matches);
      const messages = [{ "role": "system", "content": llmPrompt}]
      const completion = await chatCompletion({messages: messages, json_object: true})
      const completionJson = JSON.parse(completion);
      
      console.log("overview.controller achievements completionJson___", completionJson)
      return completionJson;
      break;
    case 'visualized':
      break;
    case 'quotes':
      break;
    case 'summary':
      break;
    case 'goal':
      break;
    case 'personality':
      break;
    case 'suggestions':
      break;
    case 'promptPrescriptions':
      break;
    default:
      break;
  }
};

module.exports = {
  overview
};
