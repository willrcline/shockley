const { getPeriod } = require('../database/period.js');
const { vectorPrompts, llmPrompts} = require('./prompts.js');
const { ragQuery } = require('../rag/ragQuery/ragQuery.controller.js');
const { convertTimestampToInt } = require('../utils/datetime.js')
const { chatCompletion } = require('../../../chatCompletion/chatCompletion.controller.js');
const { getCurrentPeriod } = require('../database/period.js');
const { setOverview } = require('../database/overviews.js');

const process = async (vectorPrompt) => {
  const vectorPrompt = vectorPrompts[sectionId];
  const matches = await ragQuery(userId, vectorPrompt, undefined, vectorFilter)
  const matchesText = matches
    .sort((a, b) => b.dateCreated.toDate() - a.dateCreated.toDate())
    .map(match => {
        const dateStr = match.dateCreated.toDate().toLocaleString(); 
        return `${dateStr}\n${match.chunk}\n`;
    })
    .join('\n');

  const llmPrompt = llmPrompts[sectionId](periodType, matchesText);
  const messages = [{ "role": "system", "content": llmPrompt}]
  const completion = await chatCompletion({messages: messages, json_object: true})
  const completionJson = JSON.parse(completion);

  const overviewSectionValue = completionJson.achievements 

  await setOverview(userId, periodId, sectionId, overviewSectionValue)

  return overviewSectionValue
}

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
      const overviewSectionValue = await process(sectionId)

      return overviewSectionValue
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
