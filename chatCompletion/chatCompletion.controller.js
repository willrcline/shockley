require('dotenv').config()
const OpenAI = require("openai");

const chatCompletion = async ({messages, model="gpt-3.5-turbo", json_object=false}) => {

    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      ...(json_object ? { response_format: { "type": "json_object" } } : {})
    });
    var responseContent = completion.choices[0].message.content;
    return responseContent
}

module.exports = {chatCompletion}