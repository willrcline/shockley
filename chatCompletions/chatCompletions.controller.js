const OpenAI = require("openai");;

const chatCompletions = async ({messages}) => {

    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
    });
    var responseContent = completion.choices[0].message.content;
    return responseContent
}

module.exports = {chatCompletions}