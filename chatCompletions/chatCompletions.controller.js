const OpenAI = require("openai");;

const chatCompletions = async ({messages, model="gpt-3.5-turbo"}) => {

    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });
    var responseContent = completion.choices[0].message.content;
    return responseContent
}

module.exports = {chatCompletions}