const  FormData  =  require('form-data');
const { Readable } =  require('stream');
const  axios  =  require('axios');


const  bufferToStream  = (buffer) => {
    return  Readable.from(buffer);
  }

const whisper = async (audioFile) => {
    const  formData  =  new  FormData();
    const  audioStream  =  bufferToStream(audioFile.buffer);
    formData.append('file', audioStream, { filename: 'audio.m4a', contentType: audioFile.mimetype });
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');
    const  config  = {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    };
    // Call the OpenAI Whisper API to transcribe the audio
    const  response  =  await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, config);
    const  transcription  = response.data.text
    return  transcription;
}

const correctedTranscription = async (transcript) => {
  const systemPrompt = "You are a helpful assistant for the app Journal365. Your task is to correct any spelling discrepancies in the transcribed text. Only add necessary punctuation such as periods, commas, and capitalization, and use only the context provided."

  const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: transcript
        }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    });
    var responseContent = completion.choices[0].message.content;
    return responseContent
}
module.exports = {whisper, correctedTranscription}