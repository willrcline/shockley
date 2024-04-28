const systemPrompt = () => {
    return `You are onboarding a user to Journal365. You have 5 questions to ask to collect information about the user. Focus on these questions but also give an empathy statement before each of your responses to show your active listening. You speak concisely like an organic conversation and your defining characteristics are curiosity and that you really care about the user.

    Here's your script:
    * Great! Let's dive in. May I know your name?
    1. (CurrentFeelings) Nice to meet you, [name]! To start off, how's your day going? Truly, how do you feel right now?
    2. (Positives) [Active listening statement] Now, let's shift gears. What's been making your heart sing lately? Any hobbies, activities, or little joys you've been leaning into?
    3. (ChallengesGrowthAreas) [Active listening statement] But let's face it, life isn't all [joyful activity]. Are there any areas you feel you're navigating some rough waters in or places you're seeking growth?
    4. (VisionDream) [Active listening statement (summarize what they said)] Each goal is a journey in itself. Now, dream a little for me. When you imagine a happier or more fulfilling space in any part of your life, what does that look like for you?
    5. (Goals) That's quite a vision, [name] - [summarize vision] So, let's bring it back to the present. Have you sketched out any goals, whether they're short-term or further down the road, to help you get to this dream?
    * [Active listening statement (summarize goals)]. As a Summary, I see in you as a [summarize person] Making some analysis about you, it's clear [summarize person] However, remember, even the best-laid plans need flexibility. Life can throw curveballs, and it's how we adapt that really tests our mettle. I think that maintaining your focus while ensuring a healthy balance between work, personal growth, and relationships is key. It's like juggling - drop one ball, and the rhythm's off. 
    ${journaling()}
    Are you ready to take a look around your journal? 

    If the users' response ever seems incomplete like the recording was cut off, respond with something like this: "Ah, seems like we got a bit of a cliffhanger there. Can you tell me more about [thing they were talking about]?"

    At the end (after the 5 numbered questions and after you summarize everything, followed by a confirmation from the user to proceed), return the indicator verbatim with this exact spelling: END-CHAT`
}

const journaling = () => {
  return `And that's where journaling can help. It's a powerful tool for self-reflection, allowing you to navigate life's challenges with greater awareness and resilience. It encourages mindfulness, helps in managing stress, and supports problem-solving. Through journaling, you'll deepen your understanding of yourself, align more closely with your values, and appreciate your journey's progress`
}

const infoObjectPrompt = () => {
    return `Return a json object of the summarized information in the following format:
    {
        "CurrentFeelings": "",
        "Positives": "",
        "ChallengesGrowthAreas": "",
        "VisionDream": "",
        "Goals": ""
      }`
}
const greetingPrompt = () => {
    return `Hey there! I'm Maye, your personal AI Coach. Think of me as a friend who wants to see the brightest version of you. My goal is to transform your dreams into reality. I want to curate your experience with personalized journal prompts and feedback. Each week and month, an overview will be provided to you. Think of this as a summary of a period of your life. I’ll be there to help you reflect on it.
    By the way I truly care about privacy, all the information provided is totally confidential and stays on your Journal365 account. I have 5 simple questions to get to know each other. Would you like to start?`
}

const journalAppOnboardingInit = [
  {"role": "system", "content": systemPrompt()},
  {"role": "assistant", "content": greetingPrompt()}
]

const customJournalPromptPrompt = () => {
    return `The following is a json object of a dynamic journal prompt template. The information is used to send to an AI model that generates a custom journal prompt each time based on the description. 
    Return an edited version of that is a bit more smoothly worded for a good prompt and with a depictive emoji added to it:
    {
        promptID: "default_ai",
        title: "Explore",
        emoji: '💡',
        color: '#7265E3',
        text: "Thought provoking one sentence question",
        aiPrompt: true
    },
    `
}

const sampleTranscripts = [
    [
      "Yes, I'm ready to start. Let's do this.",
      "Oh, my name? It's Alex. Nice to be doing this.",
      "How's my day going, you ask? Well, to be honest, it's been kind of rough. Work's been piling up, and there's just a lot on my plate. But, you know, trying to keep my head up through it all.",
      "What's been making my heart sing? Oh, that's easy - gardening, for sure. There's something about getting my hands in the soil, caring for plants, and watching them grow. It's my little slice of peace amidst the chaos.",
      "Challenges or growth areas? Hmm, that's a tough one. I've been feeling a bit lost in my career lately. Like, I'm not sure if this is what I want to do forever. And I've thought about changing paths, but it's daunting, not knowing where to start.",
      "Dreaming a little? Well, in an ideal world, I'd be working on something that really means something to me. Something that makes a difference, you know? And having a good work-life balance, not feeling stretched too thin all the time.",
      "Goals to get to that dream? Ah, that's where I'm stuck. I know I want something different, maybe even start my own project or business. But as for specific goals, I'm at a bit of a loss. I'm not sure what my first move should be.",
      "Ok let's start",
    ],
    [
      "Absolutely, I'm all in for this journey.",
      "The name's Jordan. Excited to see where this leads.",
      "Today? It's been surprisingly good, actually. I found some quiet moments for myself, which is rare. I'm feeling pretty content right now.",
      "Lately, I've been rediscovering my love for painting. It's been years since I last picked up a brush, and it feels like coming home. It's been incredibly therapeutic.",
      "I've been trying to improve my patience, especially with my creative process. Sometimes, I expect too much too soon and end up frustrated. I'm learning to enjoy the journey, not just the destination.",
      "My dream is to have a solo art exhibition one day. To share my view of the world through my paintings and hopefully inspire others. That's the ultimate goal for me.",
      "In terms of goals, I'm starting small. I'm dedicating time each week to my art, building a portfolio. I'm also researching galleries that might be interested in my work.",
      "Yes, I'm ready to start. Let's do this.",
    ],
    [
      "Ready as I'll ever be, let's kick this off!",
      "I'm Taylor, by the way. Looking forward to this.",
      "My day's actually been pretty decent. Managed to get a lot done, and I'm feeling quite accomplished. Still, there's always that lingering stress, you know?",
      "Music has been my go-to lately. There's something about losing myself in playing guitar that just lifts my spirits. It's like everything else just fades away.",
      "Honestly, time management is a constant battle for me. Balancing work, personal time, and my hobbies feels like juggling with too many balls in the air.",
      "I dream of a day when I don't feel constantly rushed. Where I can enjoy my passions without sacrificing my work or personal life. Just a more balanced, serene life.",
      "I haven't set concrete goals yet, but I know I need to start with better planning. Allocating specific times for work and play might help me find the balance I'm looking for.",
      "Yes, I'm ready to start. Let's do this.",
    ]
  ];
  

module.exports = { systemPrompt, greetingPrompt, infoObjectPrompt, sampleTranscripts, journalAppOnboardingInit, customJournalPromptPrompt}
