const OpenAI = require("openai");;

const textToSpeech = async ({text}) => {
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    const audioResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text
    });

    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    const audioBase64 = audioBuffer.toString('base64');

    return audioBase64
}

export {textToSpeech}