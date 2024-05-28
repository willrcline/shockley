const { getPeriod } = require('../database/period.js');
const { vectorPrompts, llmPrompts} = require('./prompts.js');
const { ragQuery } = require('../rag/ragQuery/ragQuery.controller.js');
const { convertTimestampToInt } = require('../utils/datetime.js')
const { chatCompletion } = require('../../../chatCompletion/chatCompletion.controller.js');
const { setOverview } = require('../database/overviews.js');
const { getEntriesInPeriod } = require('../database/entries.js');
const { getUserById } = require('../database/user.js');

const createOverview = {
  rag : async (userId, periodId, sectionId, period, vectorFilter) => {
    const vectorPrompt = vectorPrompts[sectionId];
    const matches = await ragQuery(userId, vectorPrompt, undefined, vectorFilter)
    const matchesText = matches
      .sort((a, b) => b.dateCreated.toDate() - a.dateCreated.toDate())
      .map(match => {
          const dateStr = match.dateCreated.toDate().toLocaleString(); 
          return `${dateStr}\n${match.chunk}\n`;
      })
      .join('\n');

      const overviewSectionValue = await generateAndSave(userId, periodId, sectionId, period, matchesText)
      return overviewSectionValue
  },
  allEntriesInPeriod: async (userId, periodId, sectionId, period, json_object=true) => {
    const entries = await getEntriesInPeriod(userId, period.periodStartDate, period.periodEndDate);
    const entriesText = entries
      .sort((a, b) => b.dateCreated.toDate() - a.dateCreated.toDate())
      .map(entry => {
          const dateStr = entry.dateCreated.toDate().toLocaleString(); 
          return `${dateStr}\n${entry.body}\n`;
      })
      .join('\n');

    const overviewSectionValue = await generateAndSave(userId, periodId, sectionId, period, entriesText, json_object)
    return overviewSectionValue
  },
  goals: async (userId, periodId, sectionId, period) => {
    const user = await getUserById(userId)
    const bio = user.bio

    const entries = await getEntriesInPeriod(userId, period.periodStartDate, period.periodEndDate);

    const bioText = 'Vision / dream: ' + bio.VisionDream +  '\n' 
      + 'Specific goals: ' + bio.Goals 

    const entriesText = entries
    .sort((a, b) => b.dateCreated.toDate() - a.dateCreated.toDate())
    .map(entry => {
        const dateStr = entry.dateCreated.toDate().toLocaleString(); 
        return `${dateStr}\n${entry.body}\n`;
    })
    .join('\n');

    goalsText = bioText + '\n\n' + entriesText

    const overviewSectionValue = await generateAndSave(userId, periodId, sectionId, period, goalsText, false)
    return overviewSectionValue
  },
  suggestions: async (userId, periodId, sectionId, period) => {
    const user = await getUserById(userId)
    const bio = user.bio

    const entries = await getEntriesInPeriod(userId, period.periodStartDate, period.periodEndDate);

    const bioText 
      = 'Challenges and growth areas: ' + bio.ChallengesGrowthAreas +  '\n' 
      + 'Vision / dream: ' + bio.VisionDream +  '\n'
      + 'Specific goals: ' + bio.Goals 

    const entriesText = entries
    .sort((a, b) => b.dateCreated.toDate() - a.dateCreated.toDate())
    .map(entry => {
        const dateStr = entry.dateCreated.toDate().toLocaleString(); 
        return `${dateStr}\n${entry.body}\n`;
    })
    .join('\n');

    suggestionsText = bioText + '\n\n' + entriesText

    const overviewSectionValue = await generateAndSave(userId, periodId, sectionId, period, goalsText, false)
    return overviewSectionValue
  }
}

const generateAndSave = async (userId, periodId, sectionId, period, dataForLLM, json_object=true) => {
  let overviewSectionValue;

  const llmPrompt = llmPrompts[sectionId](period.type, dataForLLM);
  const messages = [{ "role": "system", "content": llmPrompt}]
  const completion = await chatCompletion({messages: messages, json_object: json_object})

  if (json_object) {
    const completionJson = JSON.parse(completion);
    console.log('completionJson___', completionJson)
    overviewSectionValue = completionJson[sectionId] 
  } else {
    overviewSectionValue = completion
  }

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
      overviewSectionValue = await createOverview.allEntriesInPeriod(userId, periodId, sectionId, period)
      break;
    case 'achievements':
      overviewSectionValue = await createOverview.rag(userId, periodId, sectionId, period, vectorFilter)
    case 'visualized':
      break;
    case 'quotes':
      overviewSectionValue = await createOverview.rag(userId, periodId, sectionId, period, vectorFilter)
      break;
    case 'summary':
      overviewSectionValue = await createOverview.allEntriesInPeriod(userId, periodId, sectionId, period, false)
      break;
    case 'goals':
      overviewSectionValue = await createOverview.goals(userId, periodId, sectionId, period)
      break;
    case 'personality':
      overviewSectionValue = await createOverview.allEntriesInPeriod(userId, periodId, sectionId, period)
      break;
    case 'suggestions':
      overviewSectionValue = await createOverview.allEntriesInPeriod(userId, periodId, sectionId, period)
      break;
    case 'promptSuggestions':
      overviewSectionValue = await createOverview.allEntriesInPeriod(userId, periodId, sectionId, period)
      break;
    default:
      break;
  }

  return overviewSectionValue
};

module.exports = {
  overview
};
