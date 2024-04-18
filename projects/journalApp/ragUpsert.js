require('dotenv').config()
const { embeddings } = require("../../embeddings/embeddings.controller");
const { vectorUpsert } = require("../../vectorUpsert/vectorUpsert.controller")

const entries = [
  {
    'id': 'A',
    'body': '<div style="color: gray;">What good did he do today?</div>\n<div style="color: white;">Cleaned car, swept flore (1.0), did laundry (for both! Hehe), cleaned kitchen, cleaned bathroom, chatted outloud with chatgpt app\nMade progress on full stack login blog cms app, inspected mueller park as a swimming area (not too dirty looking to be infeasible, resells easy area to get in and out near wall\nBegan challenge to speak on lit in Spanish with novia para una semana</div>',
  },
  {
    'id': 'B',
    'body': '<div style="color: gray;">What good did he do today?</div>\n<div style="color: white;">Reminded himself best attitude and most hard working\nWent to Bjj as intended despite expected thoughts about it\nWorked to improve functions of ocr. Issue of reading accuracy is mitigated by zooming in\nCooked some as I had offered to do</div>',
  },
  {
    'id': 'C',
    'body': '<div style="color: gray;">What good did he do today?</div>\n<div style="color: white;">Paid close attention to others projects and tried to feel like I am them and asked a question on each, reminding myself to attach ego only to inputs and that fortune favors the bold\nFixed issue with heroku deployment by turning off connections. Touched up on a professional portfolio site</div>',
  },
  {
    'id': 'D',
    'body': '<div style="color: gray;">What good did he do today?</div>\n<div style="color: white;">Complete making video game with friends\nListen to magic of thinking big\nMorning routine and walk to nature</div>',
  },
  {
    'id': 'E',
    'body': '<div style="color: gray;">What good did he do today?</div>\n<div style="color: white;">Led team calmly and concisely through technical challenges in crunch time. (12 hours)\nLearned about braelinn at cf and her e-commerce for nails\nTried to get the best o out of everyone so to speak\nConnected back</div>',
  }
]

async function run() {
  const arrayToEmbed = entries.map(entry => entry.body)
  const embeddingsArray = await embeddings(arrayToEmbed)

  const upsertData = entries.map((entry, i) => {
    return {
      id: entry.id,
      values: embeddingsArray[i].embedding,
    };
  })
  await vectorUpsert("entries", 'userId1', upsertData)
}

run()