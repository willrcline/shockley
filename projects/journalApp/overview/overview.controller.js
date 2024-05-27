const { getPeriod } = require('../database/period.js');
const { vectorPrompts, llmPrompts} = require('./prompts.js');
const { ragQuery } = require('../rag/ragQuery/ragQuery.controller.js');
const { convertTimestampToInt } = require('../utils/datetime.js')
const { chatCompletion } = require('../../../chatCompletion/chatCompletion.controller.js');
const { getCurrentPeriod } = require('../database/period.js');
const { setOverview } = require('../database/overviews.js');
const { getEntriesInPeriod } = require('../database/entries.js');

const rag = async (userId, periodId, sectionId, periodType, vectorFilter) => {
  const vectorPrompt = vectorPrompts[sectionId];
  console.log("overview.controller rag___")
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

  const overviewSectionValue = completionJson[sectionId] 

  await setOverview(userId, periodId, sectionId, overviewSectionValue)

  return overviewSectionValue
}

const allEntriesInPeriod = async (userId, periodId, sectionId, period) => {
  const entries = await getEntriesInPeriod(userId, period.periodStartDate, period.periodEndDate);
  // console.log('allEntriesInPeriod___', entries)
  const entriesText = entries
    .sort((a, b) => b.dateCreated.toDate() - a.dateCreated.toDate())
    .map(entry => {
        const dateStr = entry.dateCreated.toDate().toLocaleString(); 
        return `${dateStr}\n${entry.body}\n`;
    })
    .join('\n');

  console.log('entriesText___', entriesText)

  const llmPrompt = llmPrompts[sectionId](period.type, entriesText);
  const messages = [{ "role": "system", "content": llmPrompt}]
  const completion = await chatCompletion({messages: messages, json_object: true})
  const completionJson = JSON.parse(completion);

  const overviewSectionValue = completionJson[sectionId] 

  await setOverview(userId, periodId, sectionId, overviewSectionValue)

  return overviewSectionValue
}


const overview = async (userId, periodId, sectionId) => {
  const period = await getPeriod(periodId);
  const periodType = period.type;
  const periodStart = convertTimestampToInt(period.periodStartDate);
  const periodEnd = convertTimestampToInt(period.periodEndDate);
  let overviewSectionValue = null;
  const vectorFilter = {
    "$and": [{ "dateCreated": {"$gte": periodStart} }, { "dateCreated": {"$lte": periodEnd} }]
  }

  console.log("overview.controller sectionId___", sectionId)
  switch (sectionId) {
    case 'tagCloud':
      overviewSectionValue = await allEntriesInPeriod(userId, periodId, sectionId, period)
      break;
    case 'achievements':
      overviewSectionValue = await rag(userId, periodId, sectionId, periodType, vectorFilter)
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

  console.log('overviewSectionValue___', overviewSectionValue)
  return overviewSectionValue
};

module.exports = {
  overview
};
