require('dotenv').config()
const OpenAI = require("openai");

const chatCompletion = async ({messages, model="gpt-4o", json_object=false, temperature=undefined}) => {

    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      ...(temperature ? { temperature } : {}),
      ...(json_object ? { response_format: { "type": "json_object" } } : {})
    });
    var responseContent = completion.choices[0].message.content;
    return responseContent
}

module.exports = {chatCompletion}