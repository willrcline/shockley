const { getPeriod } = require('../database/period.js');
const llmPrompts = require('./llmPrompts.js');
const { ragQuery } = require('../rag/ragQuery/ragQuery.controller.js');
const { convertTimestampToInt } = require('../utils/datetime.js')
const { chatCompletion } = require('../../../chatCompletion/chatCompletion.controller.js');
const { getCurrentPeriod } = require('../database/period.js');
const { setOverview } = require('../database/overviews.js');

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
      const matches = await ragQuery(userId, vectorPrompt, undefined, vectorFilter)
      // const matches = await ragQuery(userId, vectorPrompt)
      // const matches = [{score: 1, chunk: 'test chunk'}]
      const matchesText = matches
        .sort((a, b) => b.dateCreated.toDate() - a.dateCreated.toDate()) // Sort by date in descending order
        .map(match => {
            const dateStr = match.dateCreated.toDate().toLocaleString(); // Convert Firestore timestamp to Date and format it
            return `${dateStr}\n${match.chunk}\n`; // Combine date and chunk with separation
        })
        .join('\n'); // Join all entries into one big string

      console.log("overview.controller achievements matchesText___", matchesText)

    
      const llmPrompt = llmPrompts.achievements(periodType, matchesText);
      console.log("overview.controller achievements llmPrompt___", llmPrompt)
      const messages = [{ "role": "system", "content": llmPrompt}]
      const completion = await chatCompletion({messages: messages, json_object: true})
      const completionJson = JSON.parse(completion);
      console.log("overview.controller achievements completionJson___", completionJson)


      const overviewSectionValue = completionJson.achievements 

      await setOverview(userId, periodId, sectionId, overviewSectionValue)

      return 'success'

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
