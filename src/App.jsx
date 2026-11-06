import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Mic, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  Layers,
  Play,
  Square,
  Volume1,
  Bell,
  Wand2,
  Gauge,
  Timer,
  Film
} from 'lucide-react';

const DIFFICULTY_LEVELS = [
  { id: 'A2', label: 'A2', desc: '초급' },
  { id: 'B1', label: 'B1', desc: '중급' },
  { id: 'B2', label: 'B2', desc: '고급' }
];

// Unit 61 실전 스크립트 원문 데이터베이스 (2~4단어 호흡 청크)
const CHUNK_DATABASE = {
  "A2": {
    "2": [
      {
        "text": "No. You should’ve stretched.",
        "chunks": [
          "No. You",
          "should’ve stretched."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "They don’t really want to learn.",
        "chunks": [
          "They don’t really",
          "want to learn."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Tests help you learn.",
        "chunks": [
          "Tests help",
          "you learn."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You see that all the time?",
        "chunks": [
          "You see that",
          "all the time?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Yes, so are we.",
        "chunks": [
          "Yes, so",
          "are we."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Get out of here.",
        "chunks": [
          "Get out",
          "of here."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "That’s too advanced for you.",
        "chunks": [
          "That’s too",
          "advanced for you."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "How high can you jump?",
        "chunks": [
          "How high",
          "can you jump?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "How should I do this?",
        "chunks": [
          "How should",
          "I do this?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "What? Why would you do that?",
        "chunks": [
          "What? Why would",
          "you do that?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You could’ve told me that before.",
        "chunks": [
          "You could’ve told",
          "me that before."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I need to lie down.",
        "chunks": [
          "I need",
          "to lie down."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I understand. No problem.",
        "chunks": [
          "I understand.",
          "No problem."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Nadi told me I have to.",
        "chunks": [
          "Nadi told me",
          "I have to."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Is this really my dressing room?",
        "chunks": [
          "Is this really",
          "my dressing room?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Let me help. I insist.",
        "chunks": [
          "Let me",
          "help. I insist."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Fine. Just hurry. Please.",
        "chunks": [
          "Fine. Just",
          "hurry. Please."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Then you know what to do.",
        "chunks": [
          "Then you know",
          "what to do."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I don’t believe you.",
        "chunks": [
          "I don’t",
          "believe you."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Sorry. I didn’t mean to yell.",
        "chunks": [
          "Sorry. I didn’t",
          "mean to yell."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "What do you mean?",
        "chunks": [
          "What do",
          "you mean?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "They just want good grades.",
        "chunks": [
          "They just",
          "want good grades."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "He loves this place.",
        "chunks": [
          "He loves",
          "this place."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "What does playing hooky mean?",
        "chunks": [
          "What does",
          "playing hooky mean?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "But, I’ll take this very seriously.",
        "chunks": [
          "But, I’ll take",
          "this very seriously."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I love that idea.",
        "chunks": [
          "I love",
          "that idea."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "But he was here yesterday.",
        "chunks": [
          "But he",
          "was here yesterday."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "An actor should never be afraid.",
        "chunks": [
          "An actor should",
          "never be afraid."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I’m learning how, Renzo.",
        "chunks": [
          "I’m learning",
          "how, Renzo."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Nice to meet you.",
        "chunks": [
          "Nice to",
          "meet you."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Learn Arabic at Home",
        "chunks": [
          "Learn Arabic",
          "at Home"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "We’re going to be rich Marco.",
        "chunks": [
          "We’re going to",
          "be rich Marco."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You should’ve read the script.",
        "chunks": [
          "You should’ve",
          "read the script."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "And now I’m a dishwasher.",
        "chunks": [
          "And now",
          "I’m a dishwasher."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "That’s interesting. We’ll consider that.",
        "chunks": [
          "That’s interesting.",
          "We’ll consider that."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Excuse me. Are you really listening?",
        "chunks": [
          "Excuse me. Are",
          "you really listening?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Now get into position.",
        "chunks": [
          "Now get",
          "into position."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Don’t dive out of the way.",
        "chunks": [
          "Don’t dive out",
          "of the way."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Are there any other questions?",
        "chunks": [
          "Are there",
          "any other questions?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I do have one concern.",
        "chunks": [
          "I do",
          "have one concern."
        ],
        "translation": "제공해주신 대화 문장입니다."
      }
    ],
    "3": [
      {
        "text": "No. You should’ve stretched.",
        "chunks": [
          "No.",
          "You",
          "should’ve stretched."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "They don’t really want to learn.",
        "chunks": [
          "They",
          "don’t",
          "really want to learn."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Tests help you learn.",
        "chunks": [
          "Tests",
          "help",
          "you learn."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You see that all the time?",
        "chunks": [
          "You",
          "see",
          "that all the time?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Yes, so are we.",
        "chunks": [
          "Yes,",
          "so",
          "are we."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Get out of here.",
        "chunks": [
          "Get",
          "out",
          "of here."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "That’s too advanced for you.",
        "chunks": [
          "That’s",
          "too",
          "advanced for you."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "How high can you jump?",
        "chunks": [
          "How",
          "high",
          "can you jump?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "How should I do this?",
        "chunks": [
          "How",
          "should",
          "I do this?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "What? Why would you do that?",
        "chunks": [
          "What?",
          "Why",
          "would you do that?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      }
    ]
  },
  "B1": {
    "2": [
      {
        "text": "You shouldn’t have jumped on the couch.",
        "chunks": [
          "You shouldn’t have",
          "jumped on the couch."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Thanks, Sofi. They say I’m tough, but effective.",
        "chunks": [
          "Thanks, Sofi. They say",
          "I’m tough, but effective."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Listen. I can’t be late to this meeting.",
        "chunks": [
          "Listen. I can’t be",
          "late to this meeting."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Then, teach you what you need to learn.",
        "chunks": [
          "Then, teach you what",
          "you need to learn."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "This course operates under traditional teaching methods.",
        "chunks": [
          "This course operates",
          "under traditional teaching methods."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "This time tomorrow, I’ll be celebrating by myself.",
        "chunks": [
          "This time tomorrow, I’ll",
          "be celebrating by myself."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "That goes for playing hooky as well.",
        "chunks": [
          "That goes for",
          "playing hooky as well."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Wow. You are a very committed actor.",
        "chunks": [
          "Wow. You are",
          "a very committed actor."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I don’t know. How long does it take?",
        "chunks": [
          "I don’t know. How",
          "long does it take?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "He counted to three: “One, two, three, go!”",
        "chunks": [
          "He counted to three:",
          "“One, two, three, go!”"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You can ask questions about the lesson.",
        "chunks": [
          "You can ask",
          "questions about the lesson."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "We have very high standards for our tutors.",
        "chunks": [
          "We have very high",
          "standards for our tutors."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "She was supposed to call you, but didn’t.",
        "chunks": [
          "She was supposed to",
          "call you, but didn’t."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "That was a mistake. It doesn’t matter now.",
        "chunks": [
          "That was a mistake.",
          "It doesn’t matter now."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You’re crazy, Renzo. What will you do?",
        "chunks": [
          "You’re crazy, Renzo.",
          "What will you do?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Hey Benny. What are you doing here?",
        "chunks": [
          "Hey Benny. What",
          "are you doing here?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Which is worse, cheating or playing hooky?",
        "chunks": [
          "Which is worse,",
          "cheating or playing hooky?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Instead, I want you to leap over it.",
        "chunks": [
          "Instead, I want you",
          "to leap over it."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "They say our education system is getting worse.",
        "chunks": [
          "They say our education",
          "system is getting worse."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Hi there Sofi, why are you washing dishes?",
        "chunks": [
          "Hi there Sofi, why",
          "are you washing dishes?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "How are you going to do that?",
        "chunks": [
          "How are you",
          "going to do that?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I’m so excited you have a working prototype.",
        "chunks": [
          "I’m so excited you",
          "have a working prototype."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Hey guys. I’m so sorry. I’m late.",
        "chunks": [
          "Hey guys. I’m",
          "so sorry. I’m late."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Ah, I see your problem right here.",
        "chunks": [
          "Ah, I see",
          "your problem right here."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Are there many tutors that can help me?",
        "chunks": [
          "Are there many tutors",
          "that can help me?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Please. Let me invest in your company.",
        "chunks": [
          "Please. Let me",
          "invest in your company."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You don’t have to do that Renzo.",
        "chunks": [
          "You don’t have",
          "to do that Renzo."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Can you throw yourself through a brick wall?",
        "chunks": [
          "Can you throw yourself",
          "through a brick wall?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "She has to, she doesn’t. I’ll quit.",
        "chunks": [
          "She has to,",
          "she doesn’t. I’ll quit."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "They gave it to me an hour ago.",
        "chunks": [
          "They gave it to",
          "me an hour ago."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Don't worry about any of those things.",
        "chunks": [
          "Don't worry about",
          "any of those things."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Hi there. What can I do for you?",
        "chunks": [
          "Hi there. What can",
          "I do for you?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Renzo, I want to open my own restaurant.",
        "chunks": [
          "Renzo, I want to",
          "open my own restaurant."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "My offer was supposed to make you happy.",
        "chunks": [
          "My offer was supposed",
          "to make you happy."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Dash toward the wall, then leap over it.",
        "chunks": [
          "Dash toward the wall,",
          "then leap over it."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I didn’t want you to smash into it.",
        "chunks": [
          "I didn’t want you",
          "to smash into it."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I should’ve come to Los Angeles sooner.",
        "chunks": [
          "I should’ve come",
          "to Los Angeles sooner."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "It’s fine. Great to see you Khae.",
        "chunks": [
          "It’s fine. Great",
          "to see you Khae."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I didn’t smash into a brick wall.",
        "chunks": [
          "I didn’t smash",
          "into a brick wall."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I’ve never thrown myself into a brick wall.",
        "chunks": [
          "I’ve never thrown myself",
          "into a brick wall."
        ],
        "translation": "제공해주신 대화 문장입니다."
      }
    ],
    "3": [
      {
        "text": "Every investor we meet wants to work with us.",
        "chunks": [
          "Every investor we",
          "meet wants to",
          "work with us."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You want to be a big star, aren’t you?",
        "chunks": [
          "You want to",
          "be a big",
          "star, aren’t you?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I want that more than anything in the world.",
        "chunks": [
          "I want that",
          "more than anything",
          "in the world."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "No, thank you. Where’s your business partner? She’s late.",
        "chunks": [
          "No, thank you.",
          "Where’s your business",
          "partner? She’s late."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "And I told you that you don’t have to.",
        "chunks": [
          "And I told",
          "you that you",
          "don’t have to."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I hear the views from the mountains are breathtaking.",
        "chunks": [
          "I hear the",
          "views from the",
          "mountains are breathtaking."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "That was an awful lesson. You’re a terrible teacher.",
        "chunks": [
          "That was an",
          "awful lesson. You’re",
          "a terrible teacher."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Kate, wouldn’t it be relaxing to go on a cruise?",
        "chunks": [
          "Kate, wouldn’t it",
          "be relaxing to",
          "go on a cruise?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You need to attempt to do the next task.",
        "chunks": [
          "You need to",
          "attempt to do",
          "the next task."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "My English literacy isn’t quite as advanced as my speaking.",
        "chunks": [
          "My English literacy",
          "isn’t quite as",
          "advanced as my speaking."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "That’s sweet of you, Renzo. But it’s not possible.",
        "chunks": [
          "That’s sweet of",
          "you, Renzo. But",
          "it’s not possible."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You learn language, and then immediately use it to communicate.",
        "chunks": [
          "You learn language,",
          "and then immediately",
          "use it to communicate."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I’ve always wanted to go on a long cruise.",
        "chunks": [
          "I’ve always wanted",
          "to go on",
          "a long cruise."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "This is done with a series of interactive presentations.",
        "chunks": [
          "This is done",
          "with a series",
          "of interactive presentations."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I’ll show you. Hurl this brick at my head.",
        "chunks": [
          "I’ll show you.",
          "Hurl this brick",
          "at my head."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Have you struggled with language courses in the past?",
        "chunks": [
          "Have you struggled",
          "with language courses",
          "in the past?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Playing hooky means to not to come to class.",
        "chunks": [
          "Playing hooky means",
          "to not to",
          "come to class."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Hi, I’m Jimmy, the stunt coordinator for the series.",
        "chunks": [
          "Hi, I’m Jimmy,",
          "the stunt coordinator",
          "for the series."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You fly to Dubai and stay with an Arabic-speaking family.",
        "chunks": [
          "You fly to",
          "Dubai and stay",
          "with an Arabic-speaking family."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "There are several explosions and fight scenes in this episode.",
        "chunks": [
          "There are several",
          "explosions and fight",
          "scenes in this episode."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I thought you were bilingual. You speak fluent English.",
        "chunks": [
          "I thought you",
          "were bilingual. You",
          "speak fluent English."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "We give you the telecommunications software you need to download.",
        "chunks": [
          "We give you",
          "the telecommunications software",
          "you need to download."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I have to crawl back to the dressing room.",
        "chunks": [
          "I have to",
          "crawl back to",
          "the dressing room."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You should’ve jumped before you got to the wall.",
        "chunks": [
          "You should’ve jumped",
          "before you got",
          "to the wall."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Are you afraid it's going to be too difficult?",
        "chunks": [
          "Are you afraid",
          "it's going to",
          "be too difficult?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You hear about teachers who don’t care at all.",
        "chunks": [
          "You hear about",
          "teachers who don’t",
          "care at all."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I don’t really need to be the head chef anymore.",
        "chunks": [
          "I don’t really",
          "need to be",
          "the head chef anymore."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Click here to chat with a teaching tutor now.",
        "chunks": [
          "Click here to",
          "chat with a",
          "teaching tutor now."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Really? How do you know that? Did she tell you?",
        "chunks": [
          "Really? How do",
          "you know that?",
          "Did she tell you?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You need to catch the brick before it hits you.",
        "chunks": [
          "You need to",
          "catch the brick",
          "before it hits you."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "We have courses that last two and four weeks.",
        "chunks": [
          "We have courses",
          "that last two",
          "and four weeks."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I meant to tell you that, but I forgot.",
        "chunks": [
          "I meant to",
          "tell you that,",
          "but I forgot."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You should’ve told me you were going to hurl it.",
        "chunks": [
          "You should’ve told",
          "me you were",
          "going to hurl it."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I’m going to see how skilled you are at stunts.",
        "chunks": [
          "I’m going to",
          "see how skilled",
          "you are at stunts."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Why do we have to take so many tests?",
        "chunks": [
          "Why do we",
          "have to take",
          "so many tests?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You could’ve told me it was made of real bricks.",
        "chunks": [
          "You could’ve told",
          "me it was",
          "made of real bricks."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Weren’t you supposed to leave earlier for some meeting?",
        "chunks": [
          "Weren’t you supposed",
          "to leave earlier",
          "for some meeting?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You look like you smashed into a brick wall.",
        "chunks": [
          "You look like",
          "you smashed into",
          "a brick wall."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Sir, I’m an experienced actor, and I’ll be fine.",
        "chunks": [
          "Sir, I’m an",
          "experienced actor, and",
          "I’ll be fine."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Rote learning is the best way to remember anything.",
        "chunks": [
          "Rote learning is",
          "the best way",
          "to remember anything."
        ],
        "translation": "제공해주신 대화 문장입니다."
      }
    ]
  },
  "B2": {
    "2": [
      {
        "text": "Good point. Maybe we can go biking out into the countryside tomorrow.",
        "chunks": [
          "Good point. Maybe we can go",
          "biking out into the countryside tomorrow."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Sure, I’m willing to compromise. What did you have in mind?",
        "chunks": [
          "Sure, I’m willing to compromise.",
          "What did you have in mind?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Having cleaned up my area, I helped Nadi with the menu.",
        "chunks": [
          "Having cleaned up my area,",
          "I helped Nadi with the menu."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I always dreamed of going on a hiking expedition through the Himalayas.",
        "chunks": [
          "I always dreamed of going on",
          "a hiking expedition through the Himalayas."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Well, I’m glad we have such a dedicated teacher as you.",
        "chunks": [
          "Well, I’m glad we have",
          "such a dedicated teacher as you."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "With every stunt, one mistake could cause injury or even death.",
        "chunks": [
          "With every stunt, one mistake",
          "could cause injury or even death."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I don’t understand. I thought  you would be excited by this opportunity.",
        "chunks": [
          "I don’t understand. I thought you",
          "would be excited by this opportunity."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I don’t need a new bike. I need a new tire.",
        "chunks": [
          "I don’t need a new",
          "bike. I need a new tire."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Working by the dining room, I overheard Nadi telling someone that.",
        "chunks": [
          "Working by the dining room,",
          "I overheard Nadi telling someone that."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Thank you. But I still have a lot of work to do.",
        "chunks": [
          "Thank you. But I still have",
          "a lot of work to do."
        ],
        "translation": "제공해주신 대화 문장입니다."
      }
    ],
    "3": [
      {
        "text": "Good point. Maybe we can go biking out into the countryside tomorrow.",
        "chunks": [
          "Good point. Maybe we",
          "can go biking out",
          "into the countryside tomorrow."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Sure, I’m willing to compromise. What did you have in mind?",
        "chunks": [
          "Sure, I’m willing",
          "to compromise. What",
          "did you have in mind?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Having cleaned up my area, I helped Nadi with the menu.",
        "chunks": [
          "Having cleaned up",
          "my area, I",
          "helped Nadi with the menu."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I always dreamed of going on a hiking expedition through the Himalayas.",
        "chunks": [
          "I always dreamed of",
          "going on a hiking",
          "expedition through the Himalayas."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Well, I’m glad we have such a dedicated teacher as you.",
        "chunks": [
          "Well, I’m glad",
          "we have such",
          "a dedicated teacher as you."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "With every stunt, one mistake could cause injury or even death.",
        "chunks": [
          "With every stunt,",
          "one mistake could",
          "cause injury or even death."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I don’t understand. I thought  you would be excited by this opportunity.",
        "chunks": [
          "I don’t understand. I",
          "thought you would be",
          "excited by this opportunity."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I don’t need a new bike. I need a new tire.",
        "chunks": [
          "I don’t need",
          "a new bike.",
          "I need a new tire."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Working by the dining room, I overheard Nadi telling someone that.",
        "chunks": [
          "Working by the",
          "dining room, I",
          "overheard Nadi telling someone that."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Thank you. But I still have a lot of work to do.",
        "chunks": [
          "Thank you. But I",
          "still have a lot",
          "of work to do."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Okay. Stop complimenting me. Let’s open our book to page four.",
        "chunks": [
          "Okay. Stop complimenting",
          "me. Let’s open",
          "our book to page four."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I don’t know. We have a lot of work to do.",
        "chunks": [
          "I don’t know.",
          "We have a",
          "lot of work to do."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I can’t wait. This is what we always want to see Marco.",
        "chunks": [
          "I can’t wait. This",
          "is what we always",
          "want to see Marco."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "That’s a good point. There are some amazing markets in Cusco.",
        "chunks": [
          "That’s a good",
          "point. There are",
          "some amazing markets in Cusco."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "My last expedition through the city didn’t turn out so well.",
        "chunks": [
          "My last expedition",
          "through the city",
          "didn’t turn out so well."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Our program offers classes for everyone, from complete beginners to advanced students.",
        "chunks": [
          "Our program offers classes",
          "for everyone, from complete",
          "beginners to advanced students."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "But then, the wall is too tall for me to leap over.",
        "chunks": [
          "But then, the wall",
          "is too tall for",
          "me to leap over."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I would be your sous chef. You’re more talented than I am.",
        "chunks": [
          "I would be your",
          "sous chef. You’re more",
          "talented than I am."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "We are also careful when we pair our students with teaching tutors.",
        "chunks": [
          "We are also careful",
          "when we pair our",
          "students with teaching tutors."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Where are we going to go on our big trip this year?",
        "chunks": [
          "Where are we going",
          "to go on our",
          "big trip this year?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Last week, Nadi was close to begging you to come back.",
        "chunks": [
          "Last week, Nadi",
          "was close to",
          "begging you to come back."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Are you going to make me smash into the wall again?",
        "chunks": [
          "Are you going",
          "to make me",
          "smash into the wall again?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "People only grow when they have someone great to learn from.",
        "chunks": [
          "People only grow",
          "when they have",
          "someone great to learn from."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "That sounds fun. Let’s build a manufacturing plant by a beach.",
        "chunks": [
          "That sounds fun.",
          "Let’s build a",
          "manufacturing plant by a beach."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "You can do that for a day or two, can’t you?",
        "chunks": [
          "You can do",
          "that for a",
          "day or two, can’t you?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "The politician. Walking into the dining room I bumped into him.",
        "chunks": [
          "The politician. Walking",
          "into the dining",
          "room I bumped into him."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Do you want to review the selection criteria for these investors?",
        "chunks": [
          "Do you want",
          "to review the",
          "selection criteria for these investors?"
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
        "chunks": [
          "Since you’re here,",
          "I’d recommend adding",
          "plastic covers to your handlebars."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I came to say hello during your first day on set.",
        "chunks": [
          "I came to",
          "say hello during",
          "your first day on set."
        ],
        "translation": "제공해주신 대화 문장입니다."
      },
      {
        "text": "I want you to pick me as opposed to anyone else.",
        "chunks": [
          "I want you",
          "to pick me",
          "as opposed to anyone else."
        ],
        "translation": "제공해주신 대화 문장입니다."
      }
    ]
  }
};

// 모바일 브라우저 최적 코덱 감지 (iOS Safari: mp4/aac, Android/PC: webm)
const getBestAudioMimeType = () => {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return '';
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isSafari) {
    if (MediaRecorder.isTypeSupported('audio/mp4')) return 'audio/mp4';
    if (MediaRecorder.isTypeSupported('audio/aac')) return 'audio/aac';
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg'
  ];
  for (const mime of candidates) {
    if (MediaRecorder.isTypeSupported(mime)) {
      return mime;
    }
  }
  return '';
};

const expandContractions = (text) => {
  return (text || '')
    .replace(/you're/gi, 'you are')
    .replace(/i'm/gi, 'i am')
    .replace(/it's/gi, 'it is')
    .replace(/that's/gi, 'that is')
    .replace(/there's/gi, 'there is')
    .replace(/don't/gi, 'do not')
    .replace(/won't/gi, 'will not')
    .replace(/can't/gi, 'cannot')
    .replace(/i'll/gi, 'i will')
    .replace(/you've/gi, 'you have')
    .replace(/we're/gi, 'we are')
    .replace(/they're/gi, 'they are')
    .replace(/what's/gi, 'what is')
    .replace(/who's/gi, 'who is');
};

const cleanText = (str) => {
  const expanded = expandContractions(str || '');
  return expanded
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const playSoundEffect = (type) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'success') {
      const pitches = [523.25, 659.25, 783.99, 1046.5];
      const now = ctx.currentTime;
      pitches.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    } else if (type === 'retry') {
      const pitches = [392.0, 311.13];
      const now = ctx.currentTime;
      pitches.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.13);
        gain.gain.setValueAtTime(0, now + idx * 0.13);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.13 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.13 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.13);
        osc.stop(now + idx * 0.13 + 0.23);
      });
    }
  } catch (err) {}
};

const generateLocalFeedback = (target, spoken, level) => {
  let normTarget = cleanText(target);
  let normSpoken = cleanText(spoken);
  
  const targetWordsRaw = (normTarget).split(' ').filter(Boolean);
  const spokenWordsRaw = (normSpoken).split(' ').filter(Boolean);
  
  // Create a marked-up version of the spoken text to show corrections
  let markedSpokenHtml = "";
  
  // We'll compare spokenWordsRaw against targetWordsRaw
  let tIdx = 0;
  let sIdx = 0;
  
  // A simple alignment algorithm to build the marked string
  while (sIdx < spokenWordsRaw.length || tIdx < targetWordsRaw.length) {
    if (sIdx >= spokenWordsRaw.length) {
      // Missed words at the end
      markedSpokenHtml += `<span class="text-rose-400 font-bold line-through ml-1">[누락: ${targetWordsRaw[tIdx]}]</span> `;
      tIdx++;
    } else if (tIdx >= targetWordsRaw.length) {
      // Extra words at the end
      markedSpokenHtml += `<span class="text-rose-400 font-bold underline decoration-rose-500/50 decoration-2 underline-offset-4 ml-1">${spokenWordsRaw[sIdx]}</span> `;
      sIdx++;
    } else if (spokenWordsRaw[sIdx] === targetWordsRaw[tIdx]) {
      // Match
      markedSpokenHtml += `<span class="text-emerald-400 font-semibold ml-1">${spokenWordsRaw[sIdx]}</span> `;
      sIdx++;
      tIdx++;
    } else {
      // Mismatch: check if the spoken word appears soon in target to detect omissions/insertions
      if (targetWordsRaw.slice(tIdx, tIdx + 3).includes(spokenWordsRaw[sIdx])) {
        // Spoken word exists later in target -> target word was omitted
        markedSpokenHtml += `<span class="text-rose-400 font-bold line-through ml-1">[누락: ${targetWordsRaw[tIdx]}]</span> `;
        tIdx++;
      } else if (spokenWordsRaw.slice(sIdx, sIdx + 3).includes(targetWordsRaw[tIdx])) {
        // Target word exists later in spoken -> spoken word is extra
        markedSpokenHtml += `<span class="text-rose-400 font-bold underline decoration-rose-500/50 decoration-2 underline-offset-4 ml-1">${spokenWordsRaw[sIdx]}</span> `;
        sIdx++;
      } else {
        // Substitution
        markedSpokenHtml += `<span class="text-rose-400 font-bold underline decoration-rose-500/50 decoration-2 underline-offset-4 ml-1">${spokenWordsRaw[sIdx]}</span> `;
        sIdx++;
        tIdx++;
      }
    }
  }
  const markedSpoken = markedSpokenHtml.trim();

  // 음성 인식에서 흔히 생략되거나 뭉개지는 기능어 유연 처리
  const ignoreWords = ['a', 'an', 'the', 'is', 'are', 'to', 'in', 'on', 'at', 'of', 'for', 'and', 'that', 'with'];
  const filterWords = (text) => text.split(' ').filter(w => !ignoreWords.includes(w)).join(' ');

  const filteredTarget = filterWords(normTarget);
  const filteredSpoken = filterWords(normSpoken);

  if (normTarget === normSpoken || (filteredTarget && filteredTarget === filteredSpoken)) {
    return { isPerfect: true, message: "🎉 완벽합니다! (Spot on!) 정확하게 말씀하셨습니다." };
  }

  const targetWords = (filteredTarget || normTarget).split(' ').filter(Boolean);
  const spokenWords = (filteredSpoken || normSpoken).split(' ').filter(Boolean);

  const missingWords = [];
  const substituted = [];

  targetWords.forEach((word, idx) => {
    if (!spokenWords.includes(word)) {
      if (spokenWords[idx] && spokenWords[idx] !== word && !targetWords.includes(spokenWords[idx])) {
        substituted.push(`'${word}' 대신 '${spokenWords[idx]}'`);
      } else {
        missingWords.push(`'${word}'`);
      }
    }
  });

  const extraWords = spokenWords.filter((w) => !targetWords.includes(w));
  const totalTargetWords = targetWords.length || 1;
  const correctCount = targetWords.filter(w => spokenWords.includes(w)).length;
  const accuracyRatio = correctCount / totalTargetWords;

  // 발음 허용 범위 전반적 완화 (특히 B2 포함)
  // 통과(isPerfect: true)하는 경우에도 markedSpoken을 반환하여 사용자가 본인의 발음 교정을 확인할 수 있게 함
  
  if (level === 'A2') {
    if (missingWords.length + substituted.length <= 2 || accuracyRatio >= 0.55) {
      return { isPerfect: true, message: "🎉 훌륭합니다! (A2 초급: 핵심 표현이 정확하여 통과되었습니다.)" };
    }
  }

  // B1 (중급): 핵심 단어 위주로 평가 (단어 1~2개 누락/치환 허용 또는 정확도 65% 이상)
  if (level === 'B1') {
    if (missingWords.length + substituted.length <= 1 || accuracyRatio >= 0.65) {
      return { isPerfect: true, message: "🎉 잘하셨습니다! (B1 중급: 대사의 의미가 명확하게 전달되었습니다.)" };
    }
  }

  const strictNotice = level === 'B2' ? ' (B2 모드: 정밀 발음)' : '';

  // B2 (고급): 깐깐함 대폭 완화! 핵심 단어 70% 이상 일치하거나 1단어 오류 시 통과 처리
  if (level === 'B2') {
    if (missingWords.length + substituted.length <= 1 || accuracyRatio >= 0.70) {
      return { isPerfect: true, message: "🎉 멋집니다! (B2 고급: 핵심 대사의 호흡과 발음이 자연스럽게 통과되었습니다.)" };
    }
  }

  if (substituted.length > 0) {
    return {
      isPerfect: false,
      message: `${substituted.slice(0, 2).join(', ')}을(를) 말씀하셨습니다. 청크를 터치해 발음을 다시 듣고 도전해 보세요!`
    };
  }

  if (missingWords.length > 0) {
    return {
      isPerfect: false,
      message: `${missingWords.slice(0, 2).join(', ')} 단어가 빠졌습니다. 문장 끝까지 호흡을 유지해 보세요.`
    };
  }

  if (extraWords.length > 0) {
    return {
      isPerfect: false,
      message: `원문에 없는 '${extraWords.slice(0, 2).join("', '")}' 단어가 감지되었습니다.`
    };
  }

  return {
    isPerfect: false,
    message: "아주 근접했습니다! 조금 더 또렷하게 다시 발음해 보세요."
  };
};

export default function EnglishTutorApp() {
  const [difficultyLevel, setDifficultyLevel] = useState('A2');
  const [chunkLevel, setChunkLevel] = useState(2);
  const [practiceRound, setPracticeRound] = useState(1);
  const [showHintText, setShowHintText] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(0.85);
  const [playingChunkIdx, setPlayingChunkIdx] = useState(null);

  const historyRef = useRef(new Set());
  const [currentSentence, setCurrentSentence] = useState(() => {
    const list = CHUNK_DATABASE.A2[2];
    const picked = list[Math.floor(Math.random() * list.length)];
    const text = picked.chunks ? picked.chunks.join(' ') : picked.text;
    historyRef.current.add(text);
    return { ...picked, text, level: 'A2' };
  });

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [isPlayingMyVoice, setIsPlayingMyVoice] = useState(false);
  const [isPlayingUserTts, setIsPlayingUserTts] = useState(false);

  const [evaluation, setEvaluation] = useState(null);
  const [markedSpoken, setMarkedSpoken] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isPerfect, setIsPerfect] = useState(false);
  
  const [speechSupported, setSpeechSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const userAudioPlayerRef = useRef(null);

  const isRecordingRef = useRef(false);
  const accumulatedSpeechRef = useRef("");

  const displayItem = currentSentence;

  const finishRecording = () => {
    isRecordingRef.current = false;
    setIsRecording(false);

    try {
      if (recognitionRef.current) recognitionRef.current.stop();
    } catch (e) {}
    stopMediaRecorder();

    const finalSpoken = accumulatedSpeechRef.current.trim();
    if (finalSpoken) {
      setUserSpeech(finalSpoken);
      const targetText = currentSentence.chunks ? currentSentence.chunks.join(' ') : currentSentence.text;
      evaluateSpeech(finalSpoken, targetText);
    } else {
      setErrorMsg("음성이 감지되지 않았습니다. 다시 말씀해 보세요.");
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isRecordingRef.current = true;
        setIsRecording(true);
        setErrorMsg("");
      };

      recognition.onresult = (event) => {
        let finalTranscripts = "";
        let interimTranscripts = "";

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) finalTranscripts += res[0].transcript + " ";
          else interimTranscripts += res[0].transcript;
        }

        const combinedText = (finalTranscripts + interimTranscripts).trim();
        accumulatedSpeechRef.current = combinedText;
        setUserSpeech(combinedText);
      };

      recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.warn("Speech error:", event.error);
        }
      };

      recognition.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch (e) {}
        } else {
          setIsRecording(false);
          stopMediaRecorder();
        }
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      stopMediaRecorder();
    };
  }, [currentSentence.text]);

  const playChunkAudio = (chunkText, idx) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.lang = 'en-US';
    utterance.rate = speechSpeed;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setPlayingChunkIdx(idx);
    };
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setPlayingChunkIdx(null);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setPlayingChunkIdx(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const playTargetAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setPlayingChunkIdx(null);
    const utterance = new SpeechSynthesisUtterance(displayItem.text);
    utterance.lang = 'en-US';
    utterance.rate = speechSpeed;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const playMyVoiceAudio = () => {
    if (!recordedAudioUrl) return;
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    try {
      if (userAudioPlayerRef.current) {
        userAudioPlayerRef.current.pause();
        userAudioPlayerRef.current.currentTime = 0;
      }
      const audio = new Audio();
      audio.src = recordedAudioUrl;
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      audio.preload = 'auto';
      
      userAudioPlayerRef.current = audio;
      setIsPlayingMyVoice(true);

      audio.onended = () => setIsPlayingMyVoice(false);
      audio.onerror = () => setIsPlayingMyVoice(false);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setIsPlayingMyVoice(false));
      }
    } catch (e) {
      setIsPlayingMyVoice(false);
    }
  };

  const playUserSpeechTts = () => {
    if (!userSpeech || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(userSpeech);
    utterance.lang = 'en-US';
    utterance.rate = speechSpeed;

    utterance.onstart = () => setIsPlayingUserTts(true);
    utterance.onend = () => setIsPlayingUserTts(false);
    utterance.onerror = () => setIsPlayingUserTts(false);

    window.speechSynthesis.speak(utterance);
  };

  const startMediaRecorder = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        mediaStreamRef.current = stream;
        
        const mimeType = getBestAudioMimeType();
        const options = mimeType ? { mimeType } : undefined;
        const mediaRecorder = options ? new MediaRecorder(stream, options) : new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const actualMime = mediaRecorder.mimeType || mimeType || (MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : 'audio/webm');
            const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });
            const url = URL.createObjectURL(audioBlob);
            setRecordedAudioUrl(url);
          }
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }
        };

        mediaRecorder.start(200);
        mediaRecorderRef.current = mediaRecorder;
      }
    } catch (e) {
      console.warn("MediaRecorder start error:", e);
    }
  };

  const stopMediaRecorder = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {}
  };

  const toggleRecording = () => {
    if (isRecording) {
      finishRecording();
    } else {
      setUserSpeech("");
      accumulatedSpeechRef.current = "";
      setEvaluation(null);
      setIsPerfect(false);
      setMarkedSpoken("");
      setRecordedAudioUrl(null);
      setErrorMsg("");

      startMediaRecorder();

      try {
        isRecordingRef.current = true;
        recognitionRef.current?.start();
      } catch (e) {}
    }
  };

  const evaluateSpeech = (spokenText, targetText) => {
    setIsEvaluating(true);
    setEvaluation(null);
    setIsPerfect(false);

    try {
      const localResult = generateLocalFeedback(targetText, spokenText, difficultyLevel);
      setIsPerfect(localResult.isPerfect);
      setEvaluation(localResult.message);
      if (localResult.markedSpoken) {
        setMarkedSpoken(localResult.markedSpoken);
      }
      
      if (soundEffectsEnabled) {
        playSoundEffect(localResult.isPerfect ? 'success' : 'retry');
      }
    } catch (err) {
      setEvaluation("발음을 인식했습니다. 다시 한번 또렷하게 시도해 보세요!");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextSentence = (targetLevel = chunkLevel, targetDiff = difficultyLevel) => {
    setUserSpeech("");
    setRecordedAudioUrl(null);
    setEvaluation(null);
    setIsPerfect(false);
    setShowHintText(false);

    const diffGroup = CHUNK_DATABASE[targetDiff] || CHUNK_DATABASE.A2;
    const localList = diffGroup[targetLevel] || diffGroup[2];
    
    let available = localList.filter((item) => !historyRef.current.has(item.text));
    if (available.length === 0) {
      historyRef.current.clear();
      available = localList;
    }

    const picked = available[Math.floor(Math.random() * available.length)];
    const text = picked.chunks ? picked.chunks.join(' ') : picked.text;
    historyRef.current.add(text);
    setCurrentSentence({ ...picked, text, level: targetDiff });
    setPracticeRound((prev) => prev + 1);
  };

  const handleSelectChunkLevel = (level) => {
    if (level === chunkLevel) return;
    setChunkLevel(level);
    handleNextSentence(level, difficultyLevel);
  };

  const handleSelectDifficulty = (diffId) => {
    if (diffId === difficultyLevel) return;
    setDifficultyLevel(diffId);
    handleNextSentence(chunkLevel, diffId);
  };

  if (!speechSupported) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm text-center shadow-xl">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-base font-bold mb-1">음성 인식 미지원</h2>
          <p className="text-slate-400 text-xs">Chrome 또는 Safari 최신 브라우저를 이용해 주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 font-sans antialiased">
      <div className="w-full max-w-lg bg-slate-900/95 border border-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* 초슬림 상단 컨트롤 바 */}
        <div className="bg-slate-900 border-b border-slate-800/80 px-3.5 py-2.5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Film className="w-4 h-4 text-indigo-400" />
              <h1 className="font-bold text-sm text-white tracking-tight">Unit 61 Shadowing</h1>
              <span className="text-[10px] text-slate-400">#{practiceRound}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* 속도 토글 */}
              <button
                onClick={() => setSpeechSpeed(s => s === 0.7 ? 0.85 : s === 0.85 ? 1.0 : 0.7)}
                className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
              >
                {speechSpeed === 0.7 ? '0.7x' : speechSpeed === 0.85 ? '0.85x' : '1.0x'}
              </button>

              {/* 효과음 토글 */}
              <button
                onClick={() => setSoundEffectsEnabled(prev => !prev)}
                className={`p-1 rounded text-[10px] border ${soundEffectsEnabled ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
              >
                <Bell className="w-3 h-3" />
              </button>

              {/* 새 문장 버튼 */}
              <button
                onClick={() => handleNextSentence(chunkLevel, difficultyLevel)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all active:scale-95"
              >
                <Wand2 className="w-3 h-3" />
                <span>새 문장</span>
              </button>
            </div>
          </div>

          {/* 난이도 & 청크 선택 미니 알약 버튼 라인 */}
          <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-800/60 text-xs">
            {/* 난이도 A2 / B1 / B2 */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-500 font-semibold mr-0.5">난이도:</span>
              {DIFFICULTY_LEVELS.map(diff => (
                <button
                  key={diff.id}
                  onClick={() => handleSelectDifficulty(diff.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    difficultyLevel === diff.id
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>

            {/* 청크 2청크 / 3청크 */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-500 font-semibold mr-0.5">길이:</span>
              {[2, 3].map(level => (
                <button
                  key={level}
                  onClick={() => handleSelectChunkLevel(level)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    chunkLevel === level
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {level}청크
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 메인 섀도잉 및 피드백 통합 영역 (한 화면에 모두 표현) */}
        <div className="p-3 sm:p-4 flex flex-col gap-2.5">

          {/* 원문 청크 표시 박스 */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                Unit 61 스크립트 원문
              </span>
              <button
                onClick={() => setShowHintText(prev => !prev)}
                className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200"
              >
                {showHintText ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showHintText ? '문장 숨김' : '문장 엿보기'}</span>
              </button>
            </div>

            {/* 청크 블록 (터치 시 해당 청크 개별 발음) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 my-1.5 w-full">
              {displayItem.chunks.map((chunk, idx) => {
                const isThisChunkPlaying = isPlayingAudio && playingChunkIdx === idx;
                const isFullPlaying = isPlayingAudio && playingChunkIdx === null;
                return (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => playChunkAudio(chunk, idx)}
                    title="터치하면 이 청크만 발음해 줍니다"
                    className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer active:scale-95 group ${
                      isThisChunkPlaying
                        ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-md ring-2 ring-indigo-400/50 animate-pulse'
                        : isFullPlaying
                          ? 'bg-indigo-950/70 border-indigo-500/60 text-indigo-200 animate-pulse'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500/60 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <span className="text-[9px] font-extrabold tracking-wider text-indigo-400 group-hover:text-indigo-300">
                        CHUNK {idx + 1}
                      </span>
                      <Volume2 className={`w-2.5 h-2.5 ${isThisChunkPlaying ? 'text-white animate-bounce' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                    </div>
                    <span className="text-xs font-semibold leading-tight block">
                      {showHintText ? chunk : `[ ${chunk.split(' ').length} 단어 ]`}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 mb-1">
              💡 청크 버튼을 누르면 해당 부분만 따로 원어민 발음을 들을 수 있습니다.
            </p>

            {showHintText && (
              <div className="mt-1 p-2 rounded-lg bg-slate-900/90 border border-slate-700/60 text-left w-full text-xs">
                <p className="font-semibold text-indigo-200 mb-0.5 leading-snug">{displayItem.text}</p>
                <p className="text-[11px] text-slate-400 leading-snug">{displayItem.translation}</p>
              </div>
            )}
          </div>

          {/* 듣기 및 따라 말하기 버튼 (슬림형) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={playTargetAudio}
              disabled={isPlayingAudio}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                isPlayingAudio
                  ? 'bg-indigo-900/80 border border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/20'
                  : 'bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-indigo-400' : 'text-indigo-400'}`} />
              <span>{isPlayingAudio ? "재생 중..." : "원어민 듣기"}</span>
            </button>

            <button
              onClick={toggleRecording}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
              }`}
            >
              {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-4 h-4" />}
              <span>{isRecording ? "말씀 끝남 (완료)" : "따라 말하기"}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-[11px] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 내가 말한 내용 & 튜터 피드백 (화면 아래에 즉시 통합 표시) */}
          {(userSpeech || isEvaluating || evaluation) && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2.5 animate-in fade-in duration-200">
              
              {/* 내가 말한 내용 */}
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-lg p-2.5">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Mic className="w-3 h-3 text-indigo-400" />
                    내가 말한 내용
                  </span>
                  
                  {userSpeech && (
                    <div className="flex items-center gap-1">
                      {recordedAudioUrl && (
                        <button
                          onClick={playMyVoiceAudio}
                          disabled={isPlayingMyVoice}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border transition-all ${
                            isPlayingMyVoice
                              ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse'
                              : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>{isPlayingMyVoice ? '재생 중...' : '내 목소리'}</span>
                        </button>
                      )}

                      <button
                        onClick={playUserSpeechTts}
                        disabled={isPlayingUserTts}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border transition-all ${
                          isPlayingUserTts
                            ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse'
                            : 'bg-slate-800 text-indigo-300 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        <Volume1 className="w-2.5 h-2.5" />
                        <span>{isPlayingUserTts ? '재생 중...' : '인식 문장'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-xs sm:text-sm font-medium text-slate-300 leading-snug">
                  {userSpeech ? (
                    (evaluation && isPerfect) ? (
                      <div className="flex flex-col gap-2 mt-1">
                        <div className="text-emerald-300">"{userSpeech}"</div>
                        <div className="text-[11px] sm:text-xs text-indigo-200 border-t border-slate-700/60 pt-2">
                          <span className="font-bold mr-1">원문:</span> {displayItem.text}
                        </div>
                      </div>
                    ) : markedSpoken ? (
                      <div dangerouslySetInnerHTML={{ __html: `"${markedSpoken}"` }} className="break-words" />
                    ) : (
                      <span className="text-indigo-200">"{userSpeech}"</span>
                    )
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">음성 분석 중...</span>
                  )}
                </div>
              </div>

              {/* 튜터 피드백 및 다음으로 넘어가기 버튼 */}
              <div>
                {isEvaluating ? (
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2 text-slate-400 text-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>발음 일치도를 분석하고 있습니다...</span>
                  </div>
                ) : evaluation ? (
                  <div className={`p-2.5 rounded-lg border transition-all ${
                    isPerfect 
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200' 
                      : 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                  }`}>
                    <div className="flex items-start gap-2">
                      {isPerfect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="text-xs leading-snug flex-1">
                        <p className="font-semibold mb-1.5">{evaluation}</p>
                        
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <button
                            onClick={toggleRecording}
                            className="px-2.5 py-1 rounded text-[11px] font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center gap-1 transition-all active:scale-95"
                          >
                            <Mic className="w-3 h-3" />
                            <span>다시 말하기</span>
                          </button>
                          
                          <button
                            onClick={() => handleNextSentence(chunkLevel, difficultyLevel)}
                            className={`px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 ${
                              isPerfect
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            }`}
                          >
                            <span>다음 문장으로 넘어가기</span>
                            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
