require("dotenv").config();
const OpenAI = require("openai");

const chatCompletion = async ({
  messages,
  model = "gpt-4o",
  json_object = false,
  temperature = undefined,
}) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      ...(temperature ? { temperature } : {}),
      ...(json_object ? { response_format: { type: "json_object" } } : {}),
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error in chatCompletion.controller.js:",
      error.message,
      error.stack
    );
    throw {
      message:
        error.response?.data?.error?.message ||
        error.message ||
        "Unexpected error occurred.",
      status: error.response?.status || 500,
    };
  }
};

module.exports = { chatCompletion };
