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
  "1": [
    {
      "text": "This is fantastic.",
      "chunks": [
        "This is fantastic."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Is this really my dressing room?"
      ],
      "nextContext": [
        "I should’ve come to Los Angeles sooner.",
        "You shouldn’t have jumped on the couch."
      ]
    },
    {
      "text": "You’ll ruin it.",
      "chunks": [
        "You’ll ruin it."
      ],
      "chunkCount": 1,
      "prevContext": [
        "I should’ve come to Los Angeles sooner.",
        "You shouldn’t have jumped on the couch."
      ],
      "nextContext": [
        "Sorry.",
        "Hi, I’m Jimmy, the stunt coordinator for the series."
      ]
    },
    {
      "text": "Sorry.",
      "chunks": [
        "Sorry."
      ],
      "chunkCount": 1,
      "prevContext": [
        "You shouldn’t have jumped on the couch.",
        "You’ll ruin it."
      ],
      "nextContext": [
        "Hi, I’m Jimmy, the stunt coordinator for the series.",
        "Nice to meet you."
      ]
    },
    {
      "text": "Sure, wait, what?",
      "chunks": [
        "Sure, wait, what?"
      ],
      "chunkCount": 1,
      "prevContext": [
        "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
        "Would you mind coming outside so I can become familiar with your stunt experience?"
      ],
      "nextContext": [
        "Your stunt experience.",
        "There are several explosions and fight scenes in this episode."
      ]
    },
    {
      "text": "Your stunt experience.",
      "chunks": [
        "Your stunt experience."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Would you mind coming outside so I can become familiar with your stunt experience?",
        "Sure, wait, what?"
      ],
      "nextContext": [
        "There are several explosions and fight scenes in this episode.",
        "I wasn’t told about any stunts. Someone could’ve told me."
      ]
    },
    {
      "text": "Did you stretch?",
      "chunks": [
        "Did you stretch?"
      ],
      "chunkCount": 1,
      "prevContext": [
        "I’m going to see how skilled you are at stunts.",
        "Then, teach you what you need to learn."
      ],
      "nextContext": [
        "No. You should’ve stretched.",
        "Come on."
      ]
    },
    {
      "text": "Come on.",
      "chunks": [
        "Come on."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Did you stretch?",
        "No. You should’ve stretched."
      ],
      "nextContext": [
        "Get out of here.",
        "Yes Sir."
      ]
    },
    {
      "text": "Yes Sir.",
      "chunks": [
        "Yes Sir."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Come on.",
        "Get out of here."
      ],
      "nextContext": [
        "With every stunt, one mistake could cause injury or even death.",
        "Sir, I’m an experienced actor, and I’ll be fine."
      ]
    },
    {
      "text": "Well, let’s see.",
      "chunks": [
        "Well, let’s see."
      ],
      "chunkCount": 1,
      "prevContext": [
        "But, I’ll take this very seriously.",
        "How high can you jump?"
      ],
      "nextContext": [
        "That’s it?",
        "This is worse than I thought."
      ]
    },
    {
      "text": "That’s it?",
      "chunks": [
        "That’s it?"
      ],
      "chunkCount": 1,
      "prevContext": [
        "How high can you jump?",
        "Well, let’s see."
      ],
      "nextContext": [
        "This is worse than I thought.",
        "Can you throw yourself through a brick wall?"
      ]
    },
    {
      "text": "Are you serious?",
      "chunks": [
        "Are you serious?"
      ],
      "chunkCount": 1,
      "prevContext": [
        "This is worse than I thought.",
        "Can you throw yourself through a brick wall?"
      ],
      "nextContext": [
        "Yes.",
        "I usually try to avoid brick walls rather than throw myself into them."
      ]
    },
    {
      "text": "Yes.",
      "chunks": [
        "Yes."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Can you throw yourself through a brick wall?",
        "Are you serious?"
      ],
      "nextContext": [
        "I usually try to avoid brick walls rather than throw myself into them.",
        "Just answer the question."
      ]
    },
    {
      "text": "Crash into it.",
      "chunks": [
        "Crash into it."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Just answer the question.",
        "I’ve never thrown myself into a brick wall."
      ],
      "nextContext": [
        "Are you sure this is necessary?",
        "Yes."
      ]
    },
    {
      "text": "Yes.",
      "chunks": [
        "Yes."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Crash into it.",
        "Are you sure this is necessary?"
      ],
      "nextContext": [
        "How should I do this?",
        "Crush down before you dive into it."
      ]
    },
    {
      "text": "I’m afraid.",
      "chunks": [
        "I’m afraid."
      ],
      "chunkCount": 1,
      "prevContext": [
        "How should I do this?",
        "Crush down before you dive into it."
      ],
      "nextContext": [
        "An actor should never be afraid.",
        "Go."
      ]
    },
    {
      "text": "Go.",
      "chunks": [
        "Go."
      ],
      "chunkCount": 1,
      "prevContext": [
        "I’m afraid.",
        "An actor should never be afraid."
      ],
      "nextContext": [
        "Ah~~~",
        "You didn’t break the wall."
      ]
    },
    {
      "text": "Ah~~~",
      "chunks": [
        "Ah~~~"
      ],
      "chunkCount": 1,
      "prevContext": [
        "An actor should never be afraid.",
        "Go."
      ],
      "nextContext": [
        "You didn’t break the wall.",
        "You could’ve told me it was made of real bricks."
      ]
    },
    {
      "text": "Get up.",
      "chunks": [
        "Get up."
      ],
      "chunkCount": 1,
      "prevContext": [
        "You didn’t break the wall.",
        "You could’ve told me it was made of real bricks."
      ],
      "nextContext": [
        "You need to attempt to do the next task.",
        "Are you going to make me smash into the wall again?"
      ]
    },
    {
      "text": "No.",
      "chunks": [
        "No."
      ],
      "chunkCount": 1,
      "prevContext": [
        "You need to attempt to do the next task.",
        "Are you going to make me smash into the wall again?"
      ],
      "nextContext": [
        "That’s too advanced for you.",
        "Instead, I want you to leap over it."
      ]
    },
    {
      "text": "Spin around.",
      "chunks": [
        "Spin around."
      ],
      "chunkCount": 1,
      "prevContext": [
        "I want that more than anything in the world.",
        "Then you know what to do."
      ],
      "nextContext": [
        "Dash toward the wall, then leap over it.",
        "Woo."
      ]
    },
    {
      "text": "Woo.",
      "chunks": [
        "Woo."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Spin around.",
        "Dash toward the wall, then leap over it."
      ],
      "nextContext": [
        "I didn’t want you to smash into it.",
        "You should’ve jumped before you got to the wall."
      ]
    },
    {
      "text": "Okay.",
      "chunks": [
        "Okay."
      ],
      "chunkCount": 1,
      "prevContext": [
        "You could’ve told me that before.",
        "I’ll show you. Hurl this brick at my head."
      ],
      "nextContext": [
        "I’m going to hurl this brick at you as hard  as  I can.",
        "What? Why would you do that?"
      ]
    },
    {
      "text": "Don’t crouch.",
      "chunks": [
        "Don’t crouch."
      ],
      "chunkCount": 1,
      "prevContext": [
        "You need to catch the brick before it hits you.",
        "Don’t dive out of the way."
      ],
      "nextContext": [
        "Stand up straight.",
        "Spin around."
      ]
    },
    {
      "text": "Stand up straight.",
      "chunks": [
        "Stand up straight."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Don’t dive out of the way.",
        "Don’t crouch."
      ],
      "nextContext": [
        "Spin around.",
        "When I tell you, you’re going to spin around and catch the brick."
      ]
    },
    {
      "text": "Spin around.",
      "chunks": [
        "Spin around."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Don’t crouch.",
        "Stand up straight."
      ],
      "nextContext": [
        "When I tell you, you’re going to spin around and catch the brick.",
        "Now get into position."
      ]
    },
    {
      "text": "Are you ready?",
      "chunks": [
        "Are you ready?"
      ],
      "chunkCount": 1,
      "prevContext": [
        "When I tell you, you’re going to spin around and catch the brick.",
        "Now get into position."
      ],
      "nextContext": [
        "Okay.",
        "Oh!"
      ]
    },
    {
      "text": "Okay.",
      "chunks": [
        "Okay."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Now get into position.",
        "Are you ready?"
      ],
      "nextContext": [
        "Oh!",
        "You should’ve told me you were going to hurl it."
      ]
    },
    {
      "text": "Oh!",
      "chunks": [
        "Oh!"
      ],
      "chunkCount": 1,
      "prevContext": [
        "Are you ready?",
        "Okay."
      ],
      "nextContext": [
        "You should’ve told me you were going to hurl it.",
        "I did."
      ]
    },
    {
      "text": "I did.",
      "chunks": [
        "I did."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Oh!",
        "You should’ve told me you were going to hurl it."
      ],
      "nextContext": [
        "The brick crushed into my head.",
        "I can’t even walk."
      ]
    },
    {
      "text": "You’re welcome.",
      "chunks": [
        "You’re welcome."
      ],
      "chunkCount": 1,
      "prevContext": [
        "I need to lie down.",
        "That was an awful lesson. You’re a terrible teacher."
      ],
      "nextContext": [
        "Hey Benny. What are you doing here?",
        "I came to say hello during your first day on set."
      ]
    },
    {
      "text": "Okay. Fine.",
      "chunks": [
        "Okay. Fine."
      ],
      "chunkCount": 1,
      "prevContext": [
        "You don’t have to do that Renzo.",
        "Let me help. I insist."
      ],
      "nextContext": [
        "Guess who was in the restaurant earlier.",
        "Who?"
      ]
    },
    {
      "text": "Who?",
      "chunks": [
        "Who?"
      ],
      "chunkCount": 1,
      "prevContext": [
        "Okay. Fine.",
        "Guess who was in the restaurant earlier."
      ],
      "nextContext": [
        "The politician. Walking into the dining room I bumped into him.",
        "But he was here yesterday."
      ]
    },
    {
      "text": "I know.",
      "chunks": [
        "I know."
      ],
      "chunkCount": 1,
      "prevContext": [
        "The politician. Walking into the dining room I bumped into him.",
        "But he was here yesterday."
      ],
      "nextContext": [
        "He loves this place.",
        "Weren’t you supposed to leave earlier for some meeting?"
      ]
    },
    {
      "text": "They canceled it.",
      "chunks": [
        "They canceled it."
      ],
      "chunkCount": 1,
      "prevContext": [
        "He loves this place.",
        "Weren’t you supposed to leave earlier for some meeting?"
      ],
      "nextContext": [
        "Watching you wash dishes, I realized I have to tell you something about Nadi.",
        "What about her?"
      ]
    },
    {
      "text": "What about her?",
      "chunks": [
        "What about her?"
      ],
      "chunkCount": 1,
      "prevContext": [
        "They canceled it.",
        "Watching you wash dishes, I realized I have to tell you something about Nadi."
      ],
      "nextContext": [
        "Last week, Nadi was close to begging you to come back.",
        "I don’t believe you."
      ]
    },
    {
      "text": "Wow.",
      "chunks": [
        "Wow."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Really? How do you know that? Did she tell you?",
        "Working by the dining room, I overheard Nadi telling someone that."
      ],
      "nextContext": [
        "She was supposed to call you, but didn’t.",
        "I meant to talk to you before I begged for my job back."
      ]
    },
    {
      "text": "I’m sorry Sofi.",
      "chunks": [
        "I’m sorry Sofi."
      ],
      "chunkCount": 1,
      "prevContext": [
        "I meant to tell you that, but I forgot.",
        "And now I’m a dishwasher."
      ],
      "nextContext": [
        "If it makes you feel better, I want you to be the head chef for the kitchen.",
        "Yeah, right."
      ]
    },
    {
      "text": "Yeah, right.",
      "chunks": [
        "Yeah, right."
      ],
      "chunkCount": 1,
      "prevContext": [
        "I’m sorry Sofi.",
        "If it makes you feel better, I want you to be the head chef for the kitchen."
      ],
      "nextContext": [
        "I’m serious.",
        "That’s sweet of you, Renzo. But it’s not possible."
      ]
    },
    {
      "text": "I’m serious.",
      "chunks": [
        "I’m serious."
      ],
      "chunkCount": 1,
      "prevContext": [
        "If it makes you feel better, I want you to be the head chef for the kitchen.",
        "Yeah, right."
      ],
      "nextContext": [
        "That’s sweet of you, Renzo. But it’s not possible.",
        "There’s only room for one head chef in this restaurant, and that’s you."
      ]
    },
    {
      "text": "Yes Sir.",
      "chunks": [
        "Yes Sir."
      ],
      "chunkCount": 1,
      "prevContext": [
        "I’m learning how, Renzo.",
        "There is a list of terms and chapters one and two that I want you to memorize by Friday."
      ],
      "nextContext": [
        "There are a lot of terms in those chapters. Is there a specific way you recommend we learn them by heart?",
        "Rote learning is the best way to remember anything."
      ]
    },
    {
      "text": "What’s rote learning?",
      "chunks": [
        "What’s rote learning?"
      ],
      "chunkCount": 1,
      "prevContext": [
        "There are a lot of terms in those chapters. Is there a specific way you recommend we learn them by heart?",
        "Rote learning is the best way to remember anything."
      ],
      "nextContext": [
        "Rote learning is a process of learning through repetition.",
        "The more you repeat something, the easier it is going to be for you to recall that information."
      ]
    },
    {
      "text": "Yes.",
      "chunks": [
        "Yes."
      ],
      "chunkCount": 1,
      "prevContext": [
        "The more you repeat something, the easier it is going to be for you to recall that information.",
        "You repeat the terms over and over until you know them by heart."
      ],
      "nextContext": [
        "Why do we have to memorize these terms so soon, if the test isn’t until a couple weeks from now?",
        "I want you to be prepared for this exam. In this business class, it’s important to study hard in advance. So you can retain the information."
      ]
    },
    {
      "text": "Yes Sofi",
      "chunks": [
        "Yes Sofi"
      ],
      "chunkCount": 1,
      "prevContext": [
        "If there are any bookworms out there, you will be happy to know that there will be a lot of reading to do for this course. Also cheating in any form will not be tolerated. Cheating will result in immediate expulsion from my course and any other courses at this university.",
        "That goes for playing hooky as well."
      ],
      "nextContext": [
        "What does playing hooky mean?",
        "Playing hooky means to not to come to class."
      ]
    },
    {
      "text": "Don’t do either.",
      "chunks": [
        "Don’t do either."
      ],
      "chunkCount": 1,
      "prevContext": [
        "If you miss my classes, you will fall behind in your studies. It will be incredibly difficult to catch up.",
        "Which is worse, cheating or playing hooky?"
      ],
      "nextContext": [
        "Okay I won’t.",
        "My English literacy isn’t quite as advanced as my speaking."
      ]
    },
    {
      "text": "Okay I won’t.",
      "chunks": [
        "Okay I won’t."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Which is worse, cheating or playing hooky?",
        "Don’t do either."
      ],
      "nextContext": [
        "My English literacy isn’t quite as advanced as my speaking.",
        "Are there many tutors that can help me?"
      ]
    },
    {
      "text": "Okay. Fine.",
      "chunks": [
        "Okay. Fine."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Wow, I can’t believe your bike only has five gears. I can show you a really nice 10 speed bike if you want to buy a new one.",
        "I don’t need a new bike. I need a new tire."
      ],
      "nextContext": [
        "Sorry. I didn’t mean to yell.",
        "I’m running late for an appointment. Let me pay you for the tire, and I’ll come back later to discuss the other problems."
      ]
    },
    {
      "text": "Okay.",
      "chunks": [
        "Okay."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Sorry. I didn’t mean to yell.",
        "I’m running late for an appointment. Let me pay you for the tire, and I’ll come back later to discuss the other problems."
      ],
      "nextContext": [
        "It looks like your water glass is empty. Would you like me to fill it up?",
        "No, thank you. Where’s your business partner? She’s late."
      ]
    },
    {
      "text": "Where were you?",
      "chunks": [
        "Where were you?"
      ],
      "chunkCount": 1,
      "prevContext": [
        "No, thank you. Where’s your business partner? She’s late.",
        "Hey guys. I’m so sorry. I’m late."
      ],
      "nextContext": [
        "It’s fine. Great to see you Khae.",
        "I would like to go over the primary benefits of choosing me as your investor."
      ]
    },
    {
      "text": "I like that.",
      "chunks": [
        "I like that."
      ],
      "chunkCount": 1,
      "prevContext": [
        "What’s the primary reason we should choose you as opposed to anyone else?",
        "You should let me invest in your company because of my enthusiasm and my commitment. The former reason will guarantee my excitement for your product doesn’t decrease. The latter will guarantee that we work together for a long time. I’m open to signing the contract."
      ],
      "nextContext": [
        "In contrast with other investors, I want to be really involved with every aspect of the company from developing the marketing strategy to hiring new employees.",
        "I want to be there."
      ]
    },
    {
      "text": "Wow. Okay.",
      "chunks": [
        "Wow. Okay."
      ],
      "chunkCount": 1,
      "prevContext": [
        "That’s interesting. We’ll consider that.",
        "In conclusion, I can double what any other investor offers. That’s how much I want to work with you."
      ],
      "nextContext": [
        "Please. Let me invest in your company.",
        "Thank you for your interest in the People company. We’ll review your materials and contact you soon."
      ]
    },
    {
      "text": "Thank you!",
      "chunks": [
        "Thank you!"
      ],
      "chunkCount": 1,
      "prevContext": [
        "Please. Let me invest in your company.",
        "Thank you for your interest in the People company. We’ll review your materials and contact you soon."
      ],
      "nextContext": [
        "Every investor we meet wants to work with us.",
        "We’re going to be rich Marco."
      ]
    },
    {
      "text": "I know.",
      "chunks": [
        "I know."
      ],
      "chunkCount": 1,
      "prevContext": [
        "Deal. This time tomorrow, we’ll be working with an investor.",
        "I can’t wait. This is what we always want to see Marco."
      ],
      "nextContext": [
        "I’ll be dropping my bike off at the shop at 5pm tomorrow. After that, we should celebrate.",
        "I don’t know. We have a lot of work to do."
      ]
    }
  ],
  "2": [
    {
      "text": "Is this really my dressing room?",
      "chunks": [
        "Is this really",
        "my dressing room?"
      ],
      "chunkCount": 2,
      "prevContext": [],
      "nextContext": [
        "This is fantastic.",
        "I should’ve come to Los Angeles sooner."
      ]
    },
    {
      "text": "Nice to meet you.",
      "chunks": [
        "Nice to",
        "meet you."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Sorry.",
        "Hi, I’m Jimmy, the stunt coordinator for the series."
      ],
      "nextContext": [
        "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
        "Would you mind coming outside so I can become familiar with your stunt experience?"
      ]
    },
    {
      "text": "I’m the stunt coordinator.",
      "chunks": [
        "I’m the",
        "stunt coordinator."
      ],
      "chunkCount": 2,
      "prevContext": [
        "There are several explosions and fight scenes in this episode.",
        "I wasn’t told about any stunts. Someone could’ve told me."
      ],
      "nextContext": [
        "It’s not my job to communicate that information.",
        "You should’ve read the script."
      ]
    },
    {
      "text": "You should’ve read the script.",
      "chunks": [
        "You should’ve",
        "read the script."
      ],
      "chunkCount": 2,
      "prevContext": [
        "I’m the stunt coordinator.",
        "It’s not my job to communicate that information."
      ],
      "nextContext": [
        "They gave it to me an hour ago.",
        "Well. You’ve got to perform."
      ]
    },
    {
      "text": "Well. You’ve got to perform.",
      "chunks": [
        "Well. You’ve",
        "got to perform."
      ],
      "chunkCount": 2,
      "prevContext": [
        "You should’ve read the script.",
        "They gave it to me an hour ago."
      ],
      "nextContext": [
        "I’m going to see how skilled you are at stunts.",
        "Then, teach you what you need to learn."
      ]
    },
    {
      "text": "No. You should’ve stretched.",
      "chunks": [
        "No. You",
        "should’ve stretched."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Then, teach you what you need to learn.",
        "Did you stretch?"
      ],
      "nextContext": [
        "Come on.",
        "Get out of here."
      ]
    },
    {
      "text": "Get out of here.",
      "chunks": [
        "Get out",
        "of here."
      ],
      "chunkCount": 2,
      "prevContext": [
        "No. You should’ve stretched.",
        "Come on."
      ],
      "nextContext": [
        "Yes Sir.",
        "With every stunt, one mistake could cause injury or even death."
      ]
    },
    {
      "text": "But, I’ll take this very seriously.",
      "chunks": [
        "But, I’ll take",
        "this very seriously."
      ],
      "chunkCount": 2,
      "prevContext": [
        "With every stunt, one mistake could cause injury or even death.",
        "Sir, I’m an experienced actor, and I’ll be fine."
      ],
      "nextContext": [
        "How high can you jump?",
        "Well, let’s see."
      ]
    },
    {
      "text": "How high can you jump?",
      "chunks": [
        "How high",
        "can you jump?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "Sir, I’m an experienced actor, and I’ll be fine.",
        "But, I’ll take this very seriously."
      ],
      "nextContext": [
        "Well, let’s see.",
        "That’s it?"
      ]
    },
    {
      "text": "This is worse than I thought.",
      "chunks": [
        "This is worse",
        "than I thought."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Well, let’s see.",
        "That’s it?"
      ],
      "nextContext": [
        "Can you throw yourself through a brick wall?",
        "Are you serious?"
      ]
    },
    {
      "text": "Just answer the question.",
      "chunks": [
        "Just answer",
        "the question."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Yes.",
        "I usually try to avoid brick walls rather than throw myself into them."
      ],
      "nextContext": [
        "I’ve never thrown myself into a brick wall.",
        "Crash into it."
      ]
    },
    {
      "text": "Are you sure this is necessary?",
      "chunks": [
        "Are you sure",
        "this is necessary?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "I’ve never thrown myself into a brick wall.",
        "Crash into it."
      ],
      "nextContext": [
        "Yes.",
        "How should I do this?"
      ]
    },
    {
      "text": "How should I do this?",
      "chunks": [
        "How should",
        "I do this?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "Are you sure this is necessary?",
        "Yes."
      ],
      "nextContext": [
        "Crush down before you dive into it.",
        "I’m afraid."
      ]
    },
    {
      "text": "An actor should never be afraid.",
      "chunks": [
        "An actor should",
        "never be afraid."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Crush down before you dive into it.",
        "I’m afraid."
      ],
      "nextContext": [
        "Go.",
        "Ah~~~"
      ]
    },
    {
      "text": "You didn’t break the wall.",
      "chunks": [
        "You didn’t",
        "break the wall."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Go.",
        "Ah~~~"
      ],
      "nextContext": [
        "You could’ve told me it was made of real bricks.",
        "Get up."
      ]
    },
    {
      "text": "That’s too advanced for you.",
      "chunks": [
        "That’s too",
        "advanced for you."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Are you going to make me smash into the wall again?",
        "No."
      ],
      "nextContext": [
        "Instead, I want you to leap over it.",
        "But then, the wall is too tall for me to leap over."
      ]
    },
    {
      "text": "You should probably jump high then.",
      "chunks": [
        "You should probably",
        "jump high then."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Instead, I want you to leap over it.",
        "But then, the wall is too tall for me to leap over."
      ],
      "nextContext": [
        "You want to be a big star, aren’t you?",
        "I want that more than anything in the world."
      ]
    },
    {
      "text": "Then you know what to do.",
      "chunks": [
        "Then you know",
        "what to do."
      ],
      "chunkCount": 2,
      "prevContext": [
        "You want to be a big star, aren’t you?",
        "I want that more than anything in the world."
      ],
      "nextContext": [
        "Spin around.",
        "Dash toward the wall, then leap over it."
      ]
    },
    {
      "text": "You could’ve told me that before.",
      "chunks": [
        "You could’ve told",
        "me that before."
      ],
      "chunkCount": 2,
      "prevContext": [
        "I didn’t want you to smash into it.",
        "You should’ve jumped before you got to the wall."
      ],
      "nextContext": [
        "I’ll show you. Hurl this brick at my head.",
        "Okay."
      ]
    },
    {
      "text": "What? Why would you do that?",
      "chunks": [
        "What? Why would",
        "you do that?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "Okay.",
        "I’m going to hurl this brick at you as hard  as  I can."
      ],
      "nextContext": [
        "You need to catch the brick before it hits you.",
        "Don’t dive out of the way."
      ]
    },
    {
      "text": "Don’t dive out of the way.",
      "chunks": [
        "Don’t dive out",
        "of the way."
      ],
      "chunkCount": 2,
      "prevContext": [
        "What? Why would you do that?",
        "You need to catch the brick before it hits you."
      ],
      "nextContext": [
        "Don’t crouch.",
        "Stand up straight."
      ]
    },
    {
      "text": "Now get into position.",
      "chunks": [
        "Now get",
        "into position."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Spin around.",
        "When I tell you, you’re going to spin around and catch the brick."
      ],
      "nextContext": [
        "Are you ready?",
        "Okay."
      ]
    },
    {
      "text": "The brick crushed into my head.",
      "chunks": [
        "The brick crushed",
        "into my head."
      ],
      "chunkCount": 2,
      "prevContext": [
        "You should’ve told me you were going to hurl it.",
        "I did."
      ],
      "nextContext": [
        "I can’t even walk.",
        "I have to crawl back to the dressing room."
      ]
    },
    {
      "text": "I can’t even walk.",
      "chunks": [
        "I can’t",
        "even walk."
      ],
      "chunkCount": 2,
      "prevContext": [
        "I did.",
        "The brick crushed into my head."
      ],
      "nextContext": [
        "I have to crawl back to the dressing room.",
        "I need to lie down."
      ]
    },
    {
      "text": "I need to lie down.",
      "chunks": [
        "I need",
        "to lie down."
      ],
      "chunkCount": 2,
      "prevContext": [
        "I can’t even walk.",
        "I have to crawl back to the dressing room."
      ],
      "nextContext": [
        "That was an awful lesson. You’re a terrible teacher.",
        "You’re welcome."
      ]
    },
    {
      "text": "What happened to you mate?",
      "chunks": [
        "What happened",
        "to you mate?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "Hey Benny. What are you doing here?",
        "I came to say hello during your first day on set."
      ],
      "nextContext": [
        "Why are you crawling?",
        "You look like you smashed into a brick wall."
      ]
    },
    {
      "text": "Why are you crawling?",
      "chunks": [
        "Why are",
        "you crawling?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "I came to say hello during your first day on set.",
        "What happened to you mate?"
      ],
      "nextContext": [
        "You look like you smashed into a brick wall.",
        "I didn’t smash into a brick wall."
      ]
    },
    {
      "text": "Nadi told me I have to.",
      "chunks": [
        "Nadi told me",
        "I have to."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Three years later, I became a Hollywood stunt double.",
        "Hi there Sofi, why are you washing dishes?"
      ],
      "nextContext": [
        "And I told you that you don’t have to.",
        "Having cleaned up my area, I helped Nadi with the menu."
      ]
    },
    {
      "text": "Now I’m going to help you.",
      "chunks": [
        "Now I’m going",
        "to help you."
      ],
      "chunkCount": 2,
      "prevContext": [
        "And I told you that you don’t have to.",
        "Having cleaned up my area, I helped Nadi with the menu."
      ],
      "nextContext": [
        "You don’t have to do that Renzo.",
        "Let me help. I insist."
      ]
    },
    {
      "text": "Let me help. I insist.",
      "chunks": [
        "Let me",
        "help. I insist."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Now I’m going to help you.",
        "You don’t have to do that Renzo."
      ],
      "nextContext": [
        "Okay. Fine.",
        "Guess who was in the restaurant earlier."
      ]
    },
    {
      "text": "But he was here yesterday.",
      "chunks": [
        "But he",
        "was here yesterday."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Who?",
        "The politician. Walking into the dining room I bumped into him."
      ],
      "nextContext": [
        "I know.",
        "He loves this place."
      ]
    },
    {
      "text": "He loves this place.",
      "chunks": [
        "He loves",
        "this place."
      ],
      "chunkCount": 2,
      "prevContext": [
        "But he was here yesterday.",
        "I know."
      ],
      "nextContext": [
        "Weren’t you supposed to leave earlier for some meeting?",
        "They canceled it."
      ]
    },
    {
      "text": "I don’t believe you.",
      "chunks": [
        "I don’t",
        "believe you."
      ],
      "chunkCount": 2,
      "prevContext": [
        "What about her?",
        "Last week, Nadi was close to begging you to come back."
      ],
      "nextContext": [
        "Seeing how bad business was after you left, now she realized how valuable you are to the restaurant.",
        "Really? How do you know that? Did she tell you?"
      ]
    },
    {
      "text": "And now I’m a dishwasher.",
      "chunks": [
        "And now",
        "I’m a dishwasher."
      ],
      "chunkCount": 2,
      "prevContext": [
        "That was a mistake. It doesn’t matter now.",
        "I meant to tell you that, but I forgot."
      ],
      "nextContext": [
        "I’m sorry Sofi.",
        "If it makes you feel better, I want you to be the head chef for the kitchen."
      ]
    },
    {
      "text": "I’m learning how, Renzo.",
      "chunks": [
        "I’m learning",
        "how, Renzo."
      ],
      "chunkCount": 2,
      "prevContext": [
        "I don’t really need to be the head chef anymore.",
        "How are you going to do that?"
      ],
      "nextContext": [
        "There is a list of terms and chapters one and two that I want you to memorize by Friday.",
        "Yes Sir."
      ]
    },
    {
      "text": "What does playing hooky mean?",
      "chunks": [
        "What does",
        "playing hooky mean?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "That goes for playing hooky as well.",
        "Yes Sofi"
      ],
      "nextContext": [
        "Playing hooky means to not to come to class.",
        "If you miss my classes, you will fall behind in your studies. It will be incredibly difficult to catch up."
      ]
    },
    {
      "text": "Are there any other questions?",
      "chunks": [
        "Are there",
        "any other questions?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "Thank you. But I still have a lot of work to do.",
        "Well, for students that have special needs, come talk to me after the class and I will refer you to someone who can help you."
      ],
      "nextContext": [
        "This class size is bigger than I’m used to.",
        "So, I’m not going to be able to give each of you individual attention."
      ]
    },
    {
      "text": "I do have one concern.",
      "chunks": [
        "I do",
        "have one concern."
      ],
      "chunkCount": 2,
      "prevContext": [
        "So, I’m not going to be able to give each of you individual attention.",
        "But if you have any concerns, don’t hesitate to ask."
      ],
      "nextContext": [
        "Why do we have to take so many tests?",
        "Tests help you learn."
      ]
    },
    {
      "text": "Tests help you learn.",
      "chunks": [
        "Tests help",
        "you learn."
      ],
      "chunkCount": 2,
      "prevContext": [
        "I do have one concern.",
        "Why do we have to take so many tests?"
      ],
      "nextContext": [
        "This course operates under traditional teaching methods.",
        "There are certain standards you expect from me, and I have certain standards that I expect from you. As business owners, your customers or clients would expect the same from you as I do."
      ]
    },
    {
      "text": "You see that all the time?",
      "chunks": [
        "You see that",
        "all the time?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "Now, these next few months aren’t going to be easy. But I promise you that with hard work, they will be rewarding.",
        "You often find that people want to succeed, but they don’t want to work hard."
      ],
      "nextContext": [
        "They don’t teach kids anything at most schools these days.",
        "They just want good grades."
      ]
    },
    {
      "text": "They just want good grades.",
      "chunks": [
        "They just",
        "want good grades."
      ],
      "chunkCount": 2,
      "prevContext": [
        "You see that all the time?",
        "They don’t teach kids anything at most schools these days."
      ],
      "nextContext": [
        "They don’t really want to learn.",
        "You hear stories about teachers helping students cheat. It’s terrible."
      ]
    },
    {
      "text": "They don’t really want to learn.",
      "chunks": [
        "They don’t really",
        "want to learn."
      ],
      "chunkCount": 2,
      "prevContext": [
        "They don’t teach kids anything at most schools these days.",
        "They just want good grades."
      ],
      "nextContext": [
        "You hear stories about teachers helping students cheat. It’s terrible.",
        "They say our education system is getting worse."
      ]
    },
    {
      "text": "Learn Arabic at Home",
      "chunks": [
        "Learn Arabic",
        "at Home"
      ],
      "chunkCount": 2,
      "prevContext": [
        "Thanks, Sofi. They say I’m tough, but effective.",
        "Okay. Stop complimenting me. Let’s open our book to page four."
      ],
      "nextContext": [
        "Do you want to learn Arabic, but you don't have a lot of time?",
        "Are you afraid it's going to be too difficult?"
      ]
    },
    {
      "text": "So, how does it work?",
      "chunks": [
        "So, how",
        "does it work?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "We take into account your age, profession, and outside interests to pair you with someone you will enjoy working with.",
        "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable."
      ],
      "nextContext": [
        "All you need is a computer with a webcam and a high-speed internet connection.",
        "We give you the telecommunications software you need to download."
      ]
    },
    {
      "text": "What do you mean?",
      "chunks": [
        "What do",
        "you mean?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "Ah, I see your problem right here.",
        "You’ve got a nail stuck in the tire. It only takes a second to fix, but that bike chain is going to take a little more time."
      ],
      "nextContext": [
        "Your bike chain is coming loose. Do you want me to fix that too?",
        "Fine. Just hurry. Please."
      ]
    },
    {
      "text": "Fine. Just hurry. Please.",
      "chunks": [
        "Fine. Just",
        "hurry. Please."
      ],
      "chunkCount": 2,
      "prevContext": [
        "What do you mean?",
        "Your bike chain is coming loose. Do you want me to fix that too?"
      ],
      "nextContext": [
        "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
        "See how the grips seem to be wearing down. It’s bad. If your hands slip off, that would be dangerous."
      ]
    },
    {
      "text": "Excuse me. Are you really listening?",
      "chunks": [
        "Excuse me. Are",
        "you really listening?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "See how the grips seem to be wearing down. It’s bad. If your hands slip off, that would be dangerous.",
        "Listen. I can’t be late to this meeting."
      ],
      "nextContext": [
        "Wow, I can’t believe your bike only has five gears. I can show you a really nice 10 speed bike if you want to buy a new one.",
        "I don’t need a new bike. I need a new tire."
      ]
    },
    {
      "text": "Sorry. I didn’t mean to yell.",
      "chunks": [
        "Sorry. I didn’t",
        "mean to yell."
      ],
      "chunkCount": 2,
      "prevContext": [
        "I don’t need a new bike. I need a new tire.",
        "Okay. Fine."
      ],
      "nextContext": [
        "I’m running late for an appointment. Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
        "Okay."
      ]
    },
    {
      "text": "Yes, so are we.",
      "chunks": [
        "Yes, so",
        "are we."
      ],
      "chunkCount": 2,
      "prevContext": [
        "I want you to pick me as opposed to anyone else.",
        "I’m so excited you have a working prototype."
      ],
      "nextContext": [
        "What’s the primary reason we should choose you as opposed to anyone else?",
        "You should let me invest in your company because of my enthusiasm and my commitment. The former reason will guarantee my excitement for your product doesn’t decrease. The latter will guarantee that we work together for a long time. I’m open to signing the contract."
      ]
    },
    {
      "text": "I want to be there.",
      "chunks": [
        "I want",
        "to be there."
      ],
      "chunkCount": 2,
      "prevContext": [
        "I like that.",
        "In contrast with other investors, I want to be really involved with every aspect of the company from developing the marketing strategy to hiring new employees."
      ],
      "nextContext": [
        "That’s interesting. We’ll consider that.",
        "In conclusion, I can double what any other investor offers. That’s how much I want to work with you."
      ]
    },
    {
      "text": "That’s interesting. We’ll consider that.",
      "chunks": [
        "That’s interesting.",
        "We’ll consider that."
      ],
      "chunkCount": 2,
      "prevContext": [
        "In contrast with other investors, I want to be really involved with every aspect of the company from developing the marketing strategy to hiring new employees.",
        "I want to be there."
      ],
      "nextContext": [
        "In conclusion, I can double what any other investor offers. That’s how much I want to work with you.",
        "Wow. Okay."
      ]
    },
    {
      "text": "We’re going to be rich Marco.",
      "chunks": [
        "We’re going to",
        "be rich Marco."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Thank you!",
        "Every investor we meet wants to work with us."
      ],
      "nextContext": [
        "I’ve always wanted to go on a long cruise.",
        "Maybe we can go on one of those cruises that travels around the world."
      ]
    },
    {
      "text": "I love that idea.",
      "chunks": [
        "I love",
        "that idea."
      ],
      "chunkCount": 2,
      "prevContext": [
        "I’ve always wanted to go on a long cruise.",
        "Maybe we can go on one of those cruises that travels around the world."
      ],
      "nextContext": [
        "I can imagine it now. You and I get dropped off by our ship to go backpacking down the coast of South America.",
        "I always dreamed of going on a hiking expedition through the Himalayas."
      ]
    },
    {
      "text": "I can’t celebrate with you Khae.",
      "chunks": [
        "I can’t celebrate",
        "with you Khae."
      ],
      "chunkCount": 2,
      "prevContext": [
        "What’s the point of starting a business if we can’t have a little fun?",
        "I’ll be getting up very early on Saturday to review the job applications we received."
      ],
      "nextContext": [
        "I understand. No problem.",
        "This time tomorrow, I’ll be celebrating by myself."
      ]
    },
    {
      "text": "I understand. No problem.",
      "chunks": [
        "I understand.",
        "No problem."
      ],
      "chunkCount": 2,
      "prevContext": [
        "I’ll be getting up very early on Saturday to review the job applications we received.",
        "I can’t celebrate with you Khae."
      ],
      "nextContext": [
        "This time tomorrow, I’ll be celebrating by myself.",
        "Sounds like a plan."
      ]
    },
    {
      "text": "Sounds like a plan.",
      "chunks": [
        "Sounds like",
        "a plan."
      ],
      "chunkCount": 2,
      "prevContext": [
        "I understand. No problem.",
        "This time tomorrow, I’ll be celebrating by myself."
      ],
      "nextContext": [
        "Do you want to review the selection criteria for these investors?",
        "I thought you’d never ask."
      ]
    },
    {
      "text": "I thought you’d never ask.",
      "chunks": [
        "I thought",
        "you’d never ask."
      ],
      "chunkCount": 2,
      "prevContext": [
        "Sounds like a plan.",
        "Do you want to review the selection criteria for these investors?"
      ],
      "nextContext": [
        "Where are we going to go on our big trip this year?",
        "Kate, wouldn’t it be relaxing to go on a cruise?"
      ]
    },
    {
      "text": "That would be nice, wouldn’t it?",
      "chunks": [
        "That would be",
        "nice, wouldn’t it?"
      ],
      "chunkCount": 2,
      "prevContext": [
        "That’s reasonable, isn’t it? Sure, we can do that. If we take the train, can we do some day hikes while we’re at Machu Picchu?",
        "That sounds good to me. And if we take the train, we’ll have more time in Cusco."
      ],
      "nextContext": [
        "That’s a good point. There are some amazing markets in Cusco.",
        "If I agree not to hike, will you go shopping with me in Cusco?"
      ]
    }
  ],
  "3": [
    {
      "text": "I should’ve come to Los Angeles sooner.",
      "chunks": [
        "I should’ve",
        "come to",
        "Los Angeles sooner."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Is this really my dressing room?",
        "This is fantastic."
      ],
      "nextContext": [
        "You shouldn’t have jumped on the couch.",
        "You’ll ruin it."
      ]
    },
    {
      "text": "You shouldn’t have jumped on the couch.",
      "chunks": [
        "You shouldn’t",
        "have jumped",
        "on the couch."
      ],
      "chunkCount": 3,
      "prevContext": [
        "This is fantastic.",
        "I should’ve come to Los Angeles sooner."
      ],
      "nextContext": [
        "You’ll ruin it.",
        "Sorry."
      ]
    },
    {
      "text": "Hi, I’m Jimmy, the stunt coordinator for the series.",
      "chunks": [
        "Hi, I’m Jimmy,",
        "the stunt coordinator",
        "for the series."
      ],
      "chunkCount": 3,
      "prevContext": [
        "You’ll ruin it.",
        "Sorry."
      ],
      "nextContext": [
        "Nice to meet you.",
        "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife."
      ]
    },
    {
      "text": "It’s not my job to communicate that information.",
      "chunks": [
        "It’s not",
        "my job",
        "to communicate that information."
      ],
      "chunkCount": 3,
      "prevContext": [
        "I wasn’t told about any stunts. Someone could’ve told me.",
        "I’m the stunt coordinator."
      ],
      "nextContext": [
        "You should’ve read the script.",
        "They gave it to me an hour ago."
      ]
    },
    {
      "text": "They gave it to me an hour ago.",
      "chunks": [
        "They gave",
        "it to",
        "me an hour ago."
      ],
      "chunkCount": 3,
      "prevContext": [
        "It’s not my job to communicate that information.",
        "You should’ve read the script."
      ],
      "nextContext": [
        "Well. You’ve got to perform.",
        "I’m going to see how skilled you are at stunts."
      ]
    },
    {
      "text": "Then, teach you what you need to learn.",
      "chunks": [
        "Then, teach",
        "you what",
        "you need to learn."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Well. You’ve got to perform.",
        "I’m going to see how skilled you are at stunts."
      ],
      "nextContext": [
        "Did you stretch?",
        "No. You should’ve stretched."
      ]
    },
    {
      "text": "Sir, I’m an experienced actor, and I’ll be fine.",
      "chunks": [
        "Sir, I’m an",
        "experienced actor, and",
        "I’ll be fine."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Yes Sir.",
        "With every stunt, one mistake could cause injury or even death."
      ],
      "nextContext": [
        "But, I’ll take this very seriously.",
        "How high can you jump?"
      ]
    },
    {
      "text": "Can you throw yourself through a brick wall?",
      "chunks": [
        "Can you",
        "throw yourself",
        "through a brick wall?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "That’s it?",
        "This is worse than I thought."
      ],
      "nextContext": [
        "Are you serious?",
        "Yes."
      ]
    },
    {
      "text": "I’ve never thrown myself into a brick wall.",
      "chunks": [
        "I’ve never",
        "thrown myself",
        "into a brick wall."
      ],
      "chunkCount": 3,
      "prevContext": [
        "I usually try to avoid brick walls rather than throw myself into them.",
        "Just answer the question."
      ],
      "nextContext": [
        "Crash into it.",
        "Are you sure this is necessary?"
      ]
    },
    {
      "text": "Crush down before you dive into it.",
      "chunks": [
        "Crush down",
        "before you",
        "dive into it."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Yes.",
        "How should I do this?"
      ],
      "nextContext": [
        "I’m afraid.",
        "An actor should never be afraid."
      ]
    },
    {
      "text": "You need to attempt to do the next task.",
      "chunks": [
        "You need to",
        "attempt to do",
        "the next task."
      ],
      "chunkCount": 3,
      "prevContext": [
        "You could’ve told me it was made of real bricks.",
        "Get up."
      ],
      "nextContext": [
        "Are you going to make me smash into the wall again?",
        "No."
      ]
    },
    {
      "text": "Instead, I want you to leap over it.",
      "chunks": [
        "Instead, I",
        "want you",
        "to leap over it."
      ],
      "chunkCount": 3,
      "prevContext": [
        "No.",
        "That’s too advanced for you."
      ],
      "nextContext": [
        "But then, the wall is too tall for me to leap over.",
        "You should probably jump high then."
      ]
    },
    {
      "text": "You want to be a big star, aren’t you?",
      "chunks": [
        "You want to",
        "be a big",
        "star, aren’t you?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "But then, the wall is too tall for me to leap over.",
        "You should probably jump high then."
      ],
      "nextContext": [
        "I want that more than anything in the world.",
        "Then you know what to do."
      ]
    },
    {
      "text": "I want that more than anything in the world.",
      "chunks": [
        "I want that",
        "more than anything",
        "in the world."
      ],
      "chunkCount": 3,
      "prevContext": [
        "You should probably jump high then.",
        "You want to be a big star, aren’t you?"
      ],
      "nextContext": [
        "Then you know what to do.",
        "Spin around."
      ]
    },
    {
      "text": "Dash toward the wall, then leap over it.",
      "chunks": [
        "Dash toward",
        "the wall,",
        "then leap over it."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Then you know what to do.",
        "Spin around."
      ],
      "nextContext": [
        "Woo.",
        "I didn’t want you to smash into it."
      ]
    },
    {
      "text": "I didn’t want you to smash into it.",
      "chunks": [
        "I didn’t",
        "want you",
        "to smash into it."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Dash toward the wall, then leap over it.",
        "Woo."
      ],
      "nextContext": [
        "You should’ve jumped before you got to the wall.",
        "You could’ve told me that before."
      ]
    },
    {
      "text": "You should’ve jumped before you got to the wall.",
      "chunks": [
        "You should’ve jumped",
        "before you got",
        "to the wall."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Woo.",
        "I didn’t want you to smash into it."
      ],
      "nextContext": [
        "You could’ve told me that before.",
        "I’ll show you. Hurl this brick at my head."
      ]
    },
    {
      "text": "I’ll show you. Hurl this brick at my head.",
      "chunks": [
        "I’ll show you.",
        "Hurl this brick",
        "at my head."
      ],
      "chunkCount": 3,
      "prevContext": [
        "You should’ve jumped before you got to the wall.",
        "You could’ve told me that before."
      ],
      "nextContext": [
        "Okay.",
        "I’m going to hurl this brick at you as hard  as  I can."
      ]
    },
    {
      "text": "I have to crawl back to the dressing room.",
      "chunks": [
        "I have to",
        "crawl back to",
        "the dressing room."
      ],
      "chunkCount": 3,
      "prevContext": [
        "The brick crushed into my head.",
        "I can’t even walk."
      ],
      "nextContext": [
        "I need to lie down.",
        "That was an awful lesson. You’re a terrible teacher."
      ]
    },
    {
      "text": "That was an awful lesson. You’re a terrible teacher.",
      "chunks": [
        "That was an",
        "awful lesson. You’re",
        "a terrible teacher."
      ],
      "chunkCount": 3,
      "prevContext": [
        "I have to crawl back to the dressing room.",
        "I need to lie down."
      ],
      "nextContext": [
        "You’re welcome.",
        "Hey Benny. What are you doing here?"
      ]
    },
    {
      "text": "Hey Benny. What are you doing here?",
      "chunks": [
        "Hey Benny.",
        "What are",
        "you doing here?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "That was an awful lesson. You’re a terrible teacher.",
        "You’re welcome."
      ],
      "nextContext": [
        "I came to say hello during your first day on set.",
        "What happened to you mate?"
      ]
    },
    {
      "text": "You look like you smashed into a brick wall.",
      "chunks": [
        "You look like",
        "you smashed into",
        "a brick wall."
      ],
      "chunkCount": 3,
      "prevContext": [
        "What happened to you mate?",
        "Why are you crawling?"
      ],
      "nextContext": [
        "I didn’t smash into a brick wall.",
        "Wow. You are a very committed actor."
      ]
    },
    {
      "text": "I didn’t smash into a brick wall.",
      "chunks": [
        "I didn’t",
        "smash into",
        "a brick wall."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Why are you crawling?",
        "You look like you smashed into a brick wall."
      ],
      "nextContext": [
        "Wow. You are a very committed actor.",
        "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses. She loves her job and can’t imagine doing anything else."
      ]
    },
    {
      "text": "Wow. You are a very committed actor.",
      "chunks": [
        "Wow. You",
        "are a",
        "very committed actor."
      ],
      "chunkCount": 3,
      "prevContext": [
        "You look like you smashed into a brick wall.",
        "I didn’t smash into a brick wall."
      ],
      "nextContext": [
        "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses. She loves her job and can’t imagine doing anything else.",
        "How did she become interested in this career? In a very unusual way. Read her story."
      ]
    },
    {
      "text": "He counted to three: “One, two, three, go!”",
      "chunks": [
        "He counted",
        "to three:",
        "“One, two, three, go!”"
      ],
      "chunkCount": 3,
      "prevContext": [
        "My apartment was on the top floor next to my neighbor’s apartment. The roof on our building was flat. My neighbor and I came up with a crazy idea.",
        "A few minutes later, I was standing on the ledge of his open window with a rope tied around me. My neighbor was standing on the flat rooftop holding the other end of the rope."
      ],
      "nextContext": [
        "I threw myself off the ledge while he held the rope tightly. I swung in the air toward my window ledge. I was afraid I was going to crash into the brick wall of the building. Instead, I managed to land on my window ledge. My neighbor let go of the rope, and I quickly jumped through the open window and into my apartment.",
        "I could have felt scared, but I felt incredible. It was so exciting. I did it. I really did it!"
      ]
    },
    {
      "text": "Three years later, I became a Hollywood stunt double.",
      "chunks": [
        "Three years later,",
        "I became a",
        "Hollywood stunt double."
      ],
      "chunkCount": 3,
      "prevContext": [
        "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
        "The next year, I took gymnastics and martial arts classes. I worked hard to improve my skills."
      ],
      "nextContext": [
        "Hi there Sofi, why are you washing dishes?",
        "Nadi told me I have to."
      ]
    },
    {
      "text": "Hi there Sofi, why are you washing dishes?",
      "chunks": [
        "Hi there",
        "Sofi, why",
        "are you washing dishes?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "The next year, I took gymnastics and martial arts classes. I worked hard to improve my skills.",
        "Three years later, I became a Hollywood stunt double."
      ],
      "nextContext": [
        "Nadi told me I have to.",
        "And I told you that you don’t have to."
      ]
    },
    {
      "text": "And I told you that you don’t have to.",
      "chunks": [
        "And I told",
        "you that you",
        "don’t have to."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Hi there Sofi, why are you washing dishes?",
        "Nadi told me I have to."
      ],
      "nextContext": [
        "Having cleaned up my area, I helped Nadi with the menu.",
        "Now I’m going to help you."
      ]
    },
    {
      "text": "You don’t have to do that Renzo.",
      "chunks": [
        "You don’t",
        "have to",
        "do that Renzo."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Having cleaned up my area, I helped Nadi with the menu.",
        "Now I’m going to help you."
      ],
      "nextContext": [
        "Let me help. I insist.",
        "Okay. Fine."
      ]
    },
    {
      "text": "Guess who was in the restaurant earlier.",
      "chunks": [
        "Guess who",
        "was in",
        "the restaurant earlier."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Let me help. I insist.",
        "Okay. Fine."
      ],
      "nextContext": [
        "Who?",
        "The politician. Walking into the dining room I bumped into him."
      ]
    },
    {
      "text": "Weren’t you supposed to leave earlier for some meeting?",
      "chunks": [
        "Weren’t you supposed",
        "to leave earlier",
        "for some meeting?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "I know.",
        "He loves this place."
      ],
      "nextContext": [
        "They canceled it.",
        "Watching you wash dishes, I realized I have to tell you something about Nadi."
      ]
    },
    {
      "text": "She was supposed to call you, but didn’t.",
      "chunks": [
        "She was",
        "supposed to",
        "call you, but didn’t."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Working by the dining room, I overheard Nadi telling someone that.",
        "Wow."
      ],
      "nextContext": [
        "I meant to talk to you before I begged for my job back.",
        "That was a mistake. It doesn’t matter now."
      ]
    },
    {
      "text": "That was a mistake. It doesn’t matter now.",
      "chunks": [
        "That was",
        "a mistake.",
        "It doesn’t matter now."
      ],
      "chunkCount": 3,
      "prevContext": [
        "She was supposed to call you, but didn’t.",
        "I meant to talk to you before I begged for my job back."
      ],
      "nextContext": [
        "I meant to tell you that, but I forgot.",
        "And now I’m a dishwasher."
      ]
    },
    {
      "text": "I meant to tell you that, but I forgot.",
      "chunks": [
        "I meant to",
        "tell you that,",
        "but I forgot."
      ],
      "chunkCount": 3,
      "prevContext": [
        "I meant to talk to you before I begged for my job back.",
        "That was a mistake. It doesn’t matter now."
      ],
      "nextContext": [
        "And now I’m a dishwasher.",
        "I’m sorry Sofi."
      ]
    },
    {
      "text": "That’s sweet of you, Renzo. But it’s not possible.",
      "chunks": [
        "That’s sweet of",
        "you, Renzo. But",
        "it’s not possible."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Yeah, right.",
        "I’m serious."
      ],
      "nextContext": [
        "There’s only room for one head chef in this restaurant, and that’s you.",
        "I know, I want to formally offer the position of head chef to you."
      ]
    },
    {
      "text": "You’re crazy, Renzo. What will you do?",
      "chunks": [
        "You’re crazy,",
        "Renzo. What",
        "will you do?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "There’s only room for one head chef in this restaurant, and that’s you.",
        "I know, I want to formally offer the position of head chef to you."
      ],
      "nextContext": [
        "I would be your sous chef. You’re more talented than I am.",
        "People only grow when they have someone great to learn from."
      ]
    },
    {
      "text": "I don’t know what to say Renzo, thank you.",
      "chunks": [
        "I don’t know",
        "what to say",
        "Renzo, thank you."
      ],
      "chunkCount": 3,
      "prevContext": [
        "People only grow when they have someone great to learn from.",
        "You were meant to be a chef, not a dishwasher."
      ],
      "nextContext": [
        "It means a lot, but do you really think Nadi would agree to this?",
        "She has to, she doesn’t. I’ll quit."
      ]
    },
    {
      "text": "She has to, she doesn’t. I’ll quit.",
      "chunks": [
        "She has",
        "to, she",
        "doesn’t. I’ll quit."
      ],
      "chunkCount": 3,
      "prevContext": [
        "I don’t know what to say Renzo, thank you.",
        "It means a lot, but do you really think Nadi would agree to this?"
      ],
      "nextContext": [
        "Oh no. Don’t put your job on the line for me. That’s not necessary.",
        "I don’t understand. I thought  you would be excited by this opportunity."
      ]
    },
    {
      "text": "My offer was supposed to make you happy.",
      "chunks": [
        "My offer",
        "was supposed",
        "to make you happy."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Oh no. Don’t put your job on the line for me. That’s not necessary.",
        "I don’t understand. I thought  you would be excited by this opportunity."
      ],
      "nextContext": [
        "Renzo, I want to open my own restaurant.",
        "I don’t really need to be the head chef anymore."
      ]
    },
    {
      "text": "Renzo, I want to open my own restaurant.",
      "chunks": [
        "Renzo, I",
        "want to",
        "open my own restaurant."
      ],
      "chunkCount": 3,
      "prevContext": [
        "I don’t understand. I thought  you would be excited by this opportunity.",
        "My offer was supposed to make you happy."
      ],
      "nextContext": [
        "I don’t really need to be the head chef anymore.",
        "How are you going to do that?"
      ]
    },
    {
      "text": "How are you going to do that?",
      "chunks": [
        "How are",
        "you going",
        "to do that?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "Renzo, I want to open my own restaurant.",
        "I don’t really need to be the head chef anymore."
      ],
      "nextContext": [
        "I’m learning how, Renzo.",
        "There is a list of terms and chapters one and two that I want you to memorize by Friday."
      ]
    },
    {
      "text": "Rote learning is the best way to remember anything.",
      "chunks": [
        "Rote learning is",
        "the best way",
        "to remember anything."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Yes Sir.",
        "There are a lot of terms in those chapters. Is there a specific way you recommend we learn them by heart?"
      ],
      "nextContext": [
        "What’s rote learning?",
        "Rote learning is a process of learning through repetition."
      ]
    },
    {
      "text": "Rote learning is a process of learning through repetition.",
      "chunks": [
        "Rote learning is",
        "a process of",
        "learning through repetition."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Rote learning is the best way to remember anything.",
        "What’s rote learning?"
      ],
      "nextContext": [
        "The more you repeat something, the easier it is going to be for you to recall that information.",
        "You repeat the terms over and over until you know them by heart."
      ]
    },
    {
      "text": "That goes for playing hooky as well.",
      "chunks": [
        "That goes",
        "for playing",
        "hooky as well."
      ],
      "chunkCount": 3,
      "prevContext": [
        "But for most of us, studying this information until you know it by heart is going to be the best way.",
        "If there are any bookworms out there, you will be happy to know that there will be a lot of reading to do for this course. Also cheating in any form will not be tolerated. Cheating will result in immediate expulsion from my course and any other courses at this university."
      ],
      "nextContext": [
        "Yes Sofi",
        "What does playing hooky mean?"
      ]
    },
    {
      "text": "Playing hooky means to not to come to class.",
      "chunks": [
        "Playing hooky means",
        "to not to",
        "come to class."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Yes Sofi",
        "What does playing hooky mean?"
      ],
      "nextContext": [
        "If you miss my classes, you will fall behind in your studies. It will be incredibly difficult to catch up.",
        "Which is worse, cheating or playing hooky?"
      ]
    },
    {
      "text": "Which is worse, cheating or playing hooky?",
      "chunks": [
        "Which is",
        "worse, cheating",
        "or playing hooky?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "Playing hooky means to not to come to class.",
        "If you miss my classes, you will fall behind in your studies. It will be incredibly difficult to catch up."
      ],
      "nextContext": [
        "Don’t do either.",
        "Okay I won’t."
      ]
    },
    {
      "text": "Are there many tutors that can help me?",
      "chunks": [
        "Are there",
        "many tutors",
        "that can help me?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "Okay I won’t.",
        "My English literacy isn’t quite as advanced as my speaking."
      ],
      "nextContext": [
        "I thought you were bilingual. You speak fluent English.",
        "Thank you. But I still have a lot of work to do."
      ]
    },
    {
      "text": "I thought you were bilingual. You speak fluent English.",
      "chunks": [
        "I thought you",
        "were bilingual. You",
        "speak fluent English."
      ],
      "chunkCount": 3,
      "prevContext": [
        "My English literacy isn’t quite as advanced as my speaking.",
        "Are there many tutors that can help me?"
      ],
      "nextContext": [
        "Thank you. But I still have a lot of work to do.",
        "Well, for students that have special needs, come talk to me after the class and I will refer you to someone who can help you."
      ]
    },
    {
      "text": "This class size is bigger than I’m used to.",
      "chunks": [
        "This class size",
        "is bigger than",
        "I’m used to."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Well, for students that have special needs, come talk to me after the class and I will refer you to someone who can help you.",
        "Are there any other questions?"
      ],
      "nextContext": [
        "So, I’m not going to be able to give each of you individual attention.",
        "But if you have any concerns, don’t hesitate to ask."
      ]
    },
    {
      "text": "Why do we have to take so many tests?",
      "chunks": [
        "Why do we",
        "have to take",
        "so many tests?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "But if you have any concerns, don’t hesitate to ask.",
        "I do have one concern."
      ],
      "nextContext": [
        "Tests help you learn.",
        "This course operates under traditional teaching methods."
      ]
    },
    {
      "text": "This course operates under traditional teaching methods.",
      "chunks": [
        "This course",
        "operates under",
        "traditional teaching methods."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Why do we have to take so many tests?",
        "Tests help you learn."
      ],
      "nextContext": [
        "There are certain standards you expect from me, and I have certain standards that I expect from you. As business owners, your customers or clients would expect the same from you as I do.",
        "Now, these next few months aren’t going to be easy. But I promise you that with hard work, they will be rewarding."
      ]
    },
    {
      "text": "They say our education system is getting worse.",
      "chunks": [
        "They say",
        "our education",
        "system is getting worse."
      ],
      "chunkCount": 3,
      "prevContext": [
        "They don’t really want to learn.",
        "You hear stories about teachers helping students cheat. It’s terrible."
      ],
      "nextContext": [
        "Well, I’m glad we have such a dedicated teacher as you.",
        "You hear about teachers who don’t care at all."
      ]
    },
    {
      "text": "You hear about teachers who don’t care at all.",
      "chunks": [
        "You hear about",
        "teachers who don’t",
        "care at all."
      ],
      "chunkCount": 3,
      "prevContext": [
        "They say our education system is getting worse.",
        "Well, I’m glad we have such a dedicated teacher as you."
      ],
      "nextContext": [
        "Thanks, Sofi. They say I’m tough, but effective.",
        "Okay. Stop complimenting me. Let’s open our book to page four."
      ]
    },
    {
      "text": "Thanks, Sofi. They say I’m tough, but effective.",
      "chunks": [
        "Thanks, Sofi.",
        "They say",
        "I’m tough, but effective."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Well, I’m glad we have such a dedicated teacher as you.",
        "You hear about teachers who don’t care at all."
      ],
      "nextContext": [
        "Okay. Stop complimenting me. Let’s open our book to page four.",
        "Learn Arabic at Home"
      ]
    },
    {
      "text": "Are you afraid it's going to be too difficult?",
      "chunks": [
        "Are you afraid",
        "it's going to",
        "be too difficult?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "Learn Arabic at Home",
        "Do you want to learn Arabic, but you don't have a lot of time?"
      ],
      "nextContext": [
        "Have you struggled with language courses in the past?",
        "Don't worry about any of those things."
      ]
    },
    {
      "text": "Have you struggled with language courses in the past?",
      "chunks": [
        "Have you struggled",
        "with language courses",
        "in the past?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "Do you want to learn Arabic, but you don't have a lot of time?",
        "Are you afraid it's going to be too difficult?"
      ],
      "nextContext": [
        "Don't worry about any of those things.",
        "Now that you've found Arabic Online, you are sure to succeed in becoming fluent in Arabic with our program."
      ]
    },
    {
      "text": "Don't worry about any of those things.",
      "chunks": [
        "Don't worry",
        "about any",
        "of those things."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Are you afraid it's going to be too difficult?",
        "Have you struggled with language courses in the past?"
      ],
      "nextContext": [
        "Now that you've found Arabic Online, you are sure to succeed in becoming fluent in Arabic with our program.",
        "One reason for Arabic Online's success is that, unlike other language programs, it does not use traditional teaching methods."
      ]
    },
    {
      "text": "We have very high standards for our tutors.",
      "chunks": [
        "We have",
        "very high",
        "standards for our tutors."
      ],
      "chunkCount": 3,
      "prevContext": [
        "One reason for Arabic Online's success is that, unlike other language programs, it does not use traditional teaching methods.",
        "Instead of having one teacher with a classroom full of students, you get individual attention with Arabic Online. We pair each student with a teaching tutor."
      ],
      "nextContext": [
        "They have teaching degrees, live in an Arabic-speaking country, and are bilingual. Their native language is Arabic, but they are also fluent in English.",
        "We are also careful when we pair our students with teaching tutors."
      ]
    },
    {
      "text": "This is done with a series of interactive presentations.",
      "chunks": [
        "This is done",
        "with a series",
        "of interactive presentations."
      ],
      "chunkCount": 3,
      "prevContext": [
        "We give you the telecommunications software you need to download.",
        "You will take online lessons while you learn the Arabic writing system and grammar."
      ],
      "nextContext": [
        "First, you watch a short presentation, and then you practice what you learned by completing exercises.",
        "After you finish each lesson, you work with your teaching tutor in a video chat."
      ]
    },
    {
      "text": "You can ask questions about the lesson.",
      "chunks": [
        "You can",
        "ask questions",
        "about the lesson."
      ],
      "chunkCount": 3,
      "prevContext": [
        "First, you watch a short presentation, and then you practice what you learned by completing exercises.",
        "After you finish each lesson, you work with your teaching tutor in a video chat."
      ],
      "nextContext": [
        "After that, you practice what you learned by having conversations in Arabic with your tutor.",
        "We feel the primary way to learn a language is to use it, as opposed to memorizing it."
      ]
    },
    {
      "text": "We have courses that last two and four weeks.",
      "chunks": [
        "We have courses",
        "that last two",
        "and four weeks."
      ],
      "chunkCount": 3,
      "prevContext": [
        "There is nothing like speaking with a native speaker as you learn a language.",
        "We also offer optional trips to Dubai so that you can really surround yourself with the language."
      ],
      "nextContext": [
        "You fly to Dubai and stay with an Arabic-speaking family.",
        "You take classes at our school during the day and get real-world practice speaking with your host family at night."
      ]
    },
    {
      "text": "Click here to chat with a teaching tutor now.",
      "chunks": [
        "Click here to",
        "chat with a",
        "teaching tutor now."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Our program offers classes for everyone, from complete beginners to advanced students.",
        "Do you want to take advantage of the benefits that Arabic Online offers?"
      ],
      "nextContext": [
        "To find out more about our program, click here to see our rates for the online courses and the program in Dubai.",
        "Hi there. What can I do for you?"
      ]
    },
    {
      "text": "Hi there. What can I do for you?",
      "chunks": [
        "Hi there.",
        "What can",
        "I do for you?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "Click here to chat with a teaching tutor now.",
        "To find out more about our program, click here to see our rates for the online courses and the program in Dubai."
      ],
      "nextContext": [
        "I thought riding my bike to work would get me across town so quickly. I was trying to switch gears when I ran over a curve. Now, I have a flat tire, so I'm in a hurry. Can you help me?",
        "Sure, let me take a look at that thing."
      ]
    },
    {
      "text": "Sure, let me take a look at that thing.",
      "chunks": [
        "Sure, let me",
        "take a look",
        "at that thing."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Hi there. What can I do for you?",
        "I thought riding my bike to work would get me across town so quickly. I was trying to switch gears when I ran over a curve. Now, I have a flat tire, so I'm in a hurry. Can you help me?"
      ],
      "nextContext": [
        "Ah, I see your problem right here.",
        "You’ve got a nail stuck in the tire. It only takes a second to fix, but that bike chain is going to take a little more time."
      ]
    },
    {
      "text": "Ah, I see your problem right here.",
      "chunks": [
        "Ah, I",
        "see your",
        "problem right here."
      ],
      "chunkCount": 3,
      "prevContext": [
        "I thought riding my bike to work would get me across town so quickly. I was trying to switch gears when I ran over a curve. Now, I have a flat tire, so I'm in a hurry. Can you help me?",
        "Sure, let me take a look at that thing."
      ],
      "nextContext": [
        "You’ve got a nail stuck in the tire. It only takes a second to fix, but that bike chain is going to take a little more time.",
        "What do you mean?"
      ]
    },
    {
      "text": "Listen. I can’t be late to this meeting.",
      "chunks": [
        "Listen. I",
        "can’t be",
        "late to this meeting."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
        "See how the grips seem to be wearing down. It’s bad. If your hands slip off, that would be dangerous."
      ],
      "nextContext": [
        "Excuse me. Are you really listening?",
        "Wow, I can’t believe your bike only has five gears. I can show you a really nice 10 speed bike if you want to buy a new one."
      ]
    },
    {
      "text": "No, thank you. Where’s your business partner? She’s late.",
      "chunks": [
        "No, thank you.",
        "Where’s your business",
        "partner? She’s late."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Okay.",
        "It looks like your water glass is empty. Would you like me to fill it up?"
      ],
      "nextContext": [
        "Hey guys. I’m so sorry. I’m late.",
        "Where were you?"
      ]
    },
    {
      "text": "Hey guys. I’m so sorry. I’m late.",
      "chunks": [
        "Hey guys.",
        "I’m so",
        "sorry. I’m late."
      ],
      "chunkCount": 3,
      "prevContext": [
        "It looks like your water glass is empty. Would you like me to fill it up?",
        "No, thank you. Where’s your business partner? She’s late."
      ],
      "nextContext": [
        "Where were you?",
        "It’s fine. Great to see you Khae."
      ]
    },
    {
      "text": "It’s fine. Great to see you Khae.",
      "chunks": [
        "It’s fine.",
        "Great to",
        "see you Khae."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Hey guys. I’m so sorry. I’m late.",
        "Where were you?"
      ],
      "nextContext": [
        "I would like to go over the primary benefits of choosing me as your investor.",
        "I want you to pick me as opposed to anyone else."
      ]
    },
    {
      "text": "I’m so excited you have a working prototype.",
      "chunks": [
        "I’m so",
        "excited you",
        "have a working prototype."
      ],
      "chunkCount": 3,
      "prevContext": [
        "I would like to go over the primary benefits of choosing me as your investor.",
        "I want you to pick me as opposed to anyone else."
      ],
      "nextContext": [
        "Yes, so are we.",
        "What’s the primary reason we should choose you as opposed to anyone else?"
      ]
    },
    {
      "text": "Please. Let me invest in your company.",
      "chunks": [
        "Please. Let",
        "me invest",
        "in your company."
      ],
      "chunkCount": 3,
      "prevContext": [
        "In conclusion, I can double what any other investor offers. That’s how much I want to work with you.",
        "Wow. Okay."
      ],
      "nextContext": [
        "Thank you for your interest in the People company. We’ll review your materials and contact you soon.",
        "Thank you!"
      ]
    },
    {
      "text": "Every investor we meet wants to work with us.",
      "chunks": [
        "Every investor we",
        "meet wants to",
        "work with us."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Thank you for your interest in the People company. We’ll review your materials and contact you soon.",
        "Thank you!"
      ],
      "nextContext": [
        "We’re going to be rich Marco.",
        "I’ve always wanted to go on a long cruise."
      ]
    },
    {
      "text": "I’ve always wanted to go on a long cruise.",
      "chunks": [
        "I’ve always wanted",
        "to go on",
        "a long cruise."
      ],
      "chunkCount": 3,
      "prevContext": [
        "Every investor we meet wants to work with us.",
        "We’re going to be rich Marco."
      ],
      "nextContext": [
        "Maybe we can go on one of those cruises that travels around the world.",
        "I love that idea."
      ]
    },
    {
      "text": "I hear the views from the mountains are breathtaking.",
      "chunks": [
        "I hear the",
        "views from the",
        "mountains are breathtaking."
      ],
      "chunkCount": 3,
      "prevContext": [
        "I can imagine it now. You and I get dropped off by our ship to go backpacking down the coast of South America.",
        "I always dreamed of going on a hiking expedition through the Himalayas."
      ],
      "nextContext": [
        "However, we haven’t received a check yet.",
        "So for now, we’ll have to settle for a day trip because there’s still a lot of work to do."
      ]
    },
    {
      "text": "However, we haven’t received a check yet.",
      "chunks": [
        "However, we",
        "haven’t received",
        "a check yet."
      ],
      "chunkCount": 3,
      "prevContext": [
        "I always dreamed of going on a hiking expedition through the Himalayas.",
        "I hear the views from the mountains are breathtaking."
      ],
      "nextContext": [
        "So for now, we’ll have to settle for a day trip because there’s still a lot of work to do.",
        "Good point. Maybe we can go biking out into the countryside tomorrow."
      ]
    },
    {
      "text": "This time tomorrow, I’ll be celebrating by myself.",
      "chunks": [
        "This time",
        "tomorrow, I’ll",
        "be celebrating by myself."
      ],
      "chunkCount": 3,
      "prevContext": [
        "I can’t celebrate with you Khae.",
        "I understand. No problem."
      ],
      "nextContext": [
        "Sounds like a plan.",
        "Do you want to review the selection criteria for these investors?"
      ]
    },
    {
      "text": "I don’t know. How long does it take?",
      "chunks": [
        "I don’t",
        "know. How",
        "long does it take?"
      ],
      "chunkCount": 3,
      "prevContext": [
        "Wow, Machu Picchu? Yeah, that would be amazing to see. It looks stunning in all of the pictures I’ve seen.",
        "I know, and there are some great hiking expeditions that leave from Cusco. Don’t you agree that it would be exciting to hike on the Inca Trail?"
      ],
      "nextContext": [
        "It’s about a four-day trek. You go with a guide, hike during the day, and stay in tents at night. I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
        "Well, to be honest, that sounds like a lot of work. I was looking forward to something a little more laid-back."
      ]
    }
  ],
  "4": [
    {
      "text": "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
      "chunks": [
        "Oh hello, I’m Shen,",
        "a recruiting cast member",
        "on the hit medical",
        "show under the knife."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Hi, I’m Jimmy, the stunt coordinator for the series.",
        "Nice to meet you."
      ],
      "nextContext": [
        "Would you mind coming outside so I can become familiar with your stunt experience?",
        "Sure, wait, what?"
      ]
    },
    {
      "text": "Would you mind coming outside so I can become familiar with your stunt experience?",
      "chunks": [
        "Would you mind",
        "coming outside so",
        "I can become",
        "familiar with your stunt experience?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "Nice to meet you.",
        "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife."
      ],
      "nextContext": [
        "Sure, wait, what?",
        "Your stunt experience."
      ]
    },
    {
      "text": "There are several explosions and fight scenes in this episode.",
      "chunks": [
        "There are",
        "several explosions",
        "and fight",
        "scenes in this episode."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Sure, wait, what?",
        "Your stunt experience."
      ],
      "nextContext": [
        "I wasn’t told about any stunts. Someone could’ve told me.",
        "I’m the stunt coordinator."
      ]
    },
    {
      "text": "I wasn’t told about any stunts. Someone could’ve told me.",
      "chunks": [
        "I wasn’t",
        "told about",
        "any stunts.",
        "Someone could’ve told me."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Your stunt experience.",
        "There are several explosions and fight scenes in this episode."
      ],
      "nextContext": [
        "I’m the stunt coordinator.",
        "It’s not my job to communicate that information."
      ]
    },
    {
      "text": "I’m going to see how skilled you are at stunts.",
      "chunks": [
        "I’m going",
        "to see",
        "how skilled",
        "you are at stunts."
      ],
      "chunkCount": 4,
      "prevContext": [
        "They gave it to me an hour ago.",
        "Well. You’ve got to perform."
      ],
      "nextContext": [
        "Then, teach you what you need to learn.",
        "Did you stretch?"
      ]
    },
    {
      "text": "With every stunt, one mistake could cause injury or even death.",
      "chunks": [
        "With every",
        "stunt, one",
        "mistake could",
        "cause injury or even death."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Get out of here.",
        "Yes Sir."
      ],
      "nextContext": [
        "Sir, I’m an experienced actor, and I’ll be fine.",
        "But, I’ll take this very seriously."
      ]
    },
    {
      "text": "I usually try to avoid brick walls rather than throw myself into them.",
      "chunks": [
        "I usually try",
        "to avoid brick",
        "walls rather than",
        "throw myself into them."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Are you serious?",
        "Yes."
      ],
      "nextContext": [
        "Just answer the question.",
        "I’ve never thrown myself into a brick wall."
      ]
    },
    {
      "text": "You could’ve told me it was made of real bricks.",
      "chunks": [
        "You could’ve",
        "told me",
        "it was",
        "made of real bricks."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Ah~~~",
        "You didn’t break the wall."
      ],
      "nextContext": [
        "Get up.",
        "You need to attempt to do the next task."
      ]
    },
    {
      "text": "Are you going to make me smash into the wall again?",
      "chunks": [
        "Are you",
        "going to",
        "make me",
        "smash into the wall again?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "Get up.",
        "You need to attempt to do the next task."
      ],
      "nextContext": [
        "No.",
        "That’s too advanced for you."
      ]
    },
    {
      "text": "But then, the wall is too tall for me to leap over.",
      "chunks": [
        "But then, the",
        "wall is too",
        "tall for me",
        "to leap over."
      ],
      "chunkCount": 4,
      "prevContext": [
        "That’s too advanced for you.",
        "Instead, I want you to leap over it."
      ],
      "nextContext": [
        "You should probably jump high then.",
        "You want to be a big star, aren’t you?"
      ]
    },
    {
      "text": "I’m going to hurl this brick at you as hard  as  I can.",
      "chunks": [
        "I’m going to",
        "hurl this brick",
        "at you as",
        "hard as I can."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I’ll show you. Hurl this brick at my head.",
        "Okay."
      ],
      "nextContext": [
        "What? Why would you do that?",
        "You need to catch the brick before it hits you."
      ]
    },
    {
      "text": "You need to catch the brick before it hits you.",
      "chunks": [
        "You need",
        "to catch",
        "the brick",
        "before it hits you."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I’m going to hurl this brick at you as hard  as  I can.",
        "What? Why would you do that?"
      ],
      "nextContext": [
        "Don’t dive out of the way.",
        "Don’t crouch."
      ]
    },
    {
      "text": "When I tell you, you’re going to spin around and catch the brick.",
      "chunks": [
        "When I tell",
        "you, you’re going",
        "to spin around",
        "and catch the brick."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Stand up straight.",
        "Spin around."
      ],
      "nextContext": [
        "Now get into position.",
        "Are you ready?"
      ]
    },
    {
      "text": "You should’ve told me you were going to hurl it.",
      "chunks": [
        "You should’ve",
        "told me",
        "you were",
        "going to hurl it."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Okay.",
        "Oh!"
      ],
      "nextContext": [
        "I did.",
        "The brick crushed into my head."
      ]
    },
    {
      "text": "I came to say hello during your first day on set.",
      "chunks": [
        "I came",
        "to say",
        "hello during",
        "your first day on set."
      ],
      "chunkCount": 4,
      "prevContext": [
        "You’re welcome.",
        "Hey Benny. What are you doing here?"
      ],
      "nextContext": [
        "What happened to you mate?",
        "Why are you crawling?"
      ]
    },
    {
      "text": "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses. She loves her job and can’t imagine doing anything else.",
      "chunks": [
        "She wears many wigs, costumes, and",
        "a lot of makeup to look",
        "like different famous actresses. She loves",
        "her job and can’t imagine doing anything else."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I didn’t smash into a brick wall.",
        "Wow. You are a very committed actor."
      ],
      "nextContext": [
        "How did she become interested in this career? In a very unusual way. Read her story.",
        "About three years ago, I went on a weekend trip. When I got back, I realized that I was locked out of my apartment. I should have left a key with my parents or a friend. I had no way of getting into my place."
      ]
    },
    {
      "text": "How did she become interested in this career? In a very unusual way. Read her story.",
      "chunks": [
        "How did she become",
        "interested in this career?",
        "In a very unusual",
        "way. Read her story."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Wow. You are a very committed actor.",
        "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses. She loves her job and can’t imagine doing anything else."
      ],
      "nextContext": [
        "About three years ago, I went on a weekend trip. When I got back, I realized that I was locked out of my apartment. I should have left a key with my parents or a friend. I had no way of getting into my place.",
        "It was Sunday, and the locksmiths in my area were closed. I was desperate to get into my apartment because I had a big deadline on Monday and my computer was inside. I could have taken the computer with me, but I wanted to get away without work."
      ]
    },
    {
      "text": "About three years ago, I went on a weekend trip. When I got back, I realized that I was locked out of my apartment. I should have left a key with my parents or a friend. I had no way of getting into my place.",
      "chunks": [
        "About three years ago, I went on a weekend trip. When",
        "I got back, I realized that I was locked out of",
        "my apartment. I should have left a key with my parents",
        "or a friend. I had no way of getting into my place."
      ],
      "chunkCount": 4,
      "prevContext": [
        "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses. She loves her job and can’t imagine doing anything else.",
        "How did she become interested in this career? In a very unusual way. Read her story."
      ],
      "nextContext": [
        "It was Sunday, and the locksmiths in my area were closed. I was desperate to get into my apartment because I had a big deadline on Monday and my computer was inside. I could have taken the computer with me, but I wanted to get away without work.",
        "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help. He suggested I smash open the front door, but I didn’t want to break it. Then I realized that I had left the back window open."
      ]
    },
    {
      "text": "It was Sunday, and the locksmiths in my area were closed. I was desperate to get into my apartment because I had a big deadline on Monday and my computer was inside. I could have taken the computer with me, but I wanted to get away without work.",
      "chunks": [
        "It was Sunday, and the locksmiths in my area were closed. I",
        "was desperate to get into my apartment because I had a big",
        "deadline on Monday and my computer was inside. I could have taken",
        "the computer with me, but I wanted to get away without work."
      ],
      "chunkCount": 4,
      "prevContext": [
        "How did she become interested in this career? In a very unusual way. Read her story.",
        "About three years ago, I went on a weekend trip. When I got back, I realized that I was locked out of my apartment. I should have left a key with my parents or a friend. I had no way of getting into my place."
      ],
      "nextContext": [
        "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help. He suggested I smash open the front door, but I didn’t want to break it. Then I realized that I had left the back window open.",
        "My apartment was on the top floor next to my neighbor’s apartment. The roof on our building was flat. My neighbor and I came up with a crazy idea."
      ]
    },
    {
      "text": "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help. He suggested I smash open the front door, but I didn’t want to break it. Then I realized that I had left the back window open.",
      "chunks": [
        "When I realized that I didn’t have my key, I",
        "knocked on my neighbor’s door for help. He suggested I",
        "smash open the front door, but I didn’t want to",
        "break it. Then I realized that I had left the back window open."
      ],
      "chunkCount": 4,
      "prevContext": [
        "About three years ago, I went on a weekend trip. When I got back, I realized that I was locked out of my apartment. I should have left a key with my parents or a friend. I had no way of getting into my place.",
        "It was Sunday, and the locksmiths in my area were closed. I was desperate to get into my apartment because I had a big deadline on Monday and my computer was inside. I could have taken the computer with me, but I wanted to get away without work."
      ],
      "nextContext": [
        "My apartment was on the top floor next to my neighbor’s apartment. The roof on our building was flat. My neighbor and I came up with a crazy idea.",
        "A few minutes later, I was standing on the ledge of his open window with a rope tied around me. My neighbor was standing on the flat rooftop holding the other end of the rope."
      ]
    },
    {
      "text": "My apartment was on the top floor next to my neighbor’s apartment. The roof on our building was flat. My neighbor and I came up with a crazy idea.",
      "chunks": [
        "My apartment was on the top floor",
        "next to my neighbor’s apartment. The roof",
        "on our building was flat. My neighbor",
        "and I came up with a crazy idea."
      ],
      "chunkCount": 4,
      "prevContext": [
        "It was Sunday, and the locksmiths in my area were closed. I was desperate to get into my apartment because I had a big deadline on Monday and my computer was inside. I could have taken the computer with me, but I wanted to get away without work.",
        "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help. He suggested I smash open the front door, but I didn’t want to break it. Then I realized that I had left the back window open."
      ],
      "nextContext": [
        "A few minutes later, I was standing on the ledge of his open window with a rope tied around me. My neighbor was standing on the flat rooftop holding the other end of the rope.",
        "He counted to three: “One, two, three, go!”"
      ]
    },
    {
      "text": "A few minutes later, I was standing on the ledge of his open window with a rope tied around me. My neighbor was standing on the flat rooftop holding the other end of the rope.",
      "chunks": [
        "A few minutes later, I was standing on",
        "the ledge of his open window with a",
        "rope tied around me. My neighbor was standing",
        "on the flat rooftop holding the other end of the rope."
      ],
      "chunkCount": 4,
      "prevContext": [
        "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help. He suggested I smash open the front door, but I didn’t want to break it. Then I realized that I had left the back window open.",
        "My apartment was on the top floor next to my neighbor’s apartment. The roof on our building was flat. My neighbor and I came up with a crazy idea."
      ],
      "nextContext": [
        "He counted to three: “One, two, three, go!”",
        "I threw myself off the ledge while he held the rope tightly. I swung in the air toward my window ledge. I was afraid I was going to crash into the brick wall of the building. Instead, I managed to land on my window ledge. My neighbor let go of the rope, and I quickly jumped through the open window and into my apartment."
      ]
    },
    {
      "text": "I threw myself off the ledge while he held the rope tightly. I swung in the air toward my window ledge. I was afraid I was going to crash into the brick wall of the building. Instead, I managed to land on my window ledge. My neighbor let go of the rope, and I quickly jumped through the open window and into my apartment.",
      "chunks": [
        "I threw myself off the ledge while he held the rope tightly. I swung in the",
        "air toward my window ledge. I was afraid I was going to crash into the brick",
        "wall of the building. Instead, I managed to land on my window ledge. My neighbor let",
        "go of the rope, and I quickly jumped through the open window and into my apartment."
      ],
      "chunkCount": 4,
      "prevContext": [
        "A few minutes later, I was standing on the ledge of his open window with a rope tied around me. My neighbor was standing on the flat rooftop holding the other end of the rope.",
        "He counted to three: “One, two, three, go!”"
      ],
      "nextContext": [
        "I could have felt scared, but I felt incredible. It was so exciting. I did it. I really did it!",
        "A minute later, my neighbor knocked on my door until I let him in. He said, “That was amazing. You should be a stunt person.”"
      ]
    },
    {
      "text": "I could have felt scared, but I felt incredible. It was so exciting. I did it. I really did it!",
      "chunks": [
        "I could have felt scared,",
        "but I felt incredible. It",
        "was so exciting. I did",
        "it. I really did it!"
      ],
      "chunkCount": 4,
      "prevContext": [
        "He counted to three: “One, two, three, go!”",
        "I threw myself off the ledge while he held the rope tightly. I swung in the air toward my window ledge. I was afraid I was going to crash into the brick wall of the building. Instead, I managed to land on my window ledge. My neighbor let go of the rope, and I quickly jumped through the open window and into my apartment."
      ],
      "nextContext": [
        "A minute later, my neighbor knocked on my door until I let him in. He said, “That was amazing. You should be a stunt person.”",
        "It got me thinking, and I thought that I might really enjoy a career doing stunts."
      ]
    },
    {
      "text": "A minute later, my neighbor knocked on my door until I let him in. He said, “That was amazing. You should be a stunt person.”",
      "chunks": [
        "A minute later, my neighbor knocked",
        "on my door until I let",
        "him in. He said, “That was",
        "amazing. You should be a stunt person.”"
      ],
      "chunkCount": 4,
      "prevContext": [
        "I threw myself off the ledge while he held the rope tightly. I swung in the air toward my window ledge. I was afraid I was going to crash into the brick wall of the building. Instead, I managed to land on my window ledge. My neighbor let go of the rope, and I quickly jumped through the open window and into my apartment.",
        "I could have felt scared, but I felt incredible. It was so exciting. I did it. I really did it!"
      ],
      "nextContext": [
        "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
        "The next year, I took gymnastics and martial arts classes. I worked hard to improve my skills."
      ]
    },
    {
      "text": "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
      "chunks": [
        "It got me thinking,",
        "and I thought that",
        "I might really enjoy",
        "a career doing stunts."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I could have felt scared, but I felt incredible. It was so exciting. I did it. I really did it!",
        "A minute later, my neighbor knocked on my door until I let him in. He said, “That was amazing. You should be a stunt person.”"
      ],
      "nextContext": [
        "The next year, I took gymnastics and martial arts classes. I worked hard to improve my skills.",
        "Three years later, I became a Hollywood stunt double."
      ]
    },
    {
      "text": "The next year, I took gymnastics and martial arts classes. I worked hard to improve my skills.",
      "chunks": [
        "The next year, I",
        "took gymnastics and martial",
        "arts classes. I worked",
        "hard to improve my skills."
      ],
      "chunkCount": 4,
      "prevContext": [
        "A minute later, my neighbor knocked on my door until I let him in. He said, “That was amazing. You should be a stunt person.”",
        "It got me thinking, and I thought that I might really enjoy a career doing stunts."
      ],
      "nextContext": [
        "Three years later, I became a Hollywood stunt double.",
        "Hi there Sofi, why are you washing dishes?"
      ]
    },
    {
      "text": "Having cleaned up my area, I helped Nadi with the menu.",
      "chunks": [
        "Having cleaned",
        "up my",
        "area, I",
        "helped Nadi with the menu."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Nadi told me I have to.",
        "And I told you that you don’t have to."
      ],
      "nextContext": [
        "Now I’m going to help you.",
        "You don’t have to do that Renzo."
      ]
    },
    {
      "text": "The politician. Walking into the dining room I bumped into him.",
      "chunks": [
        "The politician.",
        "Walking into",
        "the dining",
        "room I bumped into him."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Guess who was in the restaurant earlier.",
        "Who?"
      ],
      "nextContext": [
        "But he was here yesterday.",
        "I know."
      ]
    },
    {
      "text": "Watching you wash dishes, I realized I have to tell you something about Nadi.",
      "chunks": [
        "Watching you wash",
        "dishes, I realized",
        "I have to",
        "tell you something about Nadi."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Weren’t you supposed to leave earlier for some meeting?",
        "They canceled it."
      ],
      "nextContext": [
        "What about her?",
        "Last week, Nadi was close to begging you to come back."
      ]
    },
    {
      "text": "Last week, Nadi was close to begging you to come back.",
      "chunks": [
        "Last week,",
        "Nadi was",
        "close to",
        "begging you to come back."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Watching you wash dishes, I realized I have to tell you something about Nadi.",
        "What about her?"
      ],
      "nextContext": [
        "I don’t believe you.",
        "Seeing how bad business was after you left, now she realized how valuable you are to the restaurant."
      ]
    },
    {
      "text": "Seeing how bad business was after you left, now she realized how valuable you are to the restaurant.",
      "chunks": [
        "Seeing how bad business",
        "was after you left,",
        "now she realized how",
        "valuable you are to the restaurant."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Last week, Nadi was close to begging you to come back.",
        "I don’t believe you."
      ],
      "nextContext": [
        "Really? How do you know that? Did she tell you?",
        "Working by the dining room, I overheard Nadi telling someone that."
      ]
    },
    {
      "text": "Really? How do you know that? Did she tell you?",
      "chunks": [
        "Really? How",
        "do you",
        "know that?",
        "Did she tell you?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "I don’t believe you.",
        "Seeing how bad business was after you left, now she realized how valuable you are to the restaurant."
      ],
      "nextContext": [
        "Working by the dining room, I overheard Nadi telling someone that.",
        "Wow."
      ]
    },
    {
      "text": "Working by the dining room, I overheard Nadi telling someone that.",
      "chunks": [
        "Working by",
        "the dining",
        "room, I",
        "overheard Nadi telling someone that."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Seeing how bad business was after you left, now she realized how valuable you are to the restaurant.",
        "Really? How do you know that? Did she tell you?"
      ],
      "nextContext": [
        "Wow.",
        "She was supposed to call you, but didn’t."
      ]
    },
    {
      "text": "I meant to talk to you before I begged for my job back.",
      "chunks": [
        "I meant to",
        "talk to you",
        "before I begged",
        "for my job back."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Wow.",
        "She was supposed to call you, but didn’t."
      ],
      "nextContext": [
        "That was a mistake. It doesn’t matter now.",
        "I meant to tell you that, but I forgot."
      ]
    },
    {
      "text": "If it makes you feel better, I want you to be the head chef for the kitchen.",
      "chunks": [
        "If it makes you",
        "feel better, I want",
        "you to be the",
        "head chef for the kitchen."
      ],
      "chunkCount": 4,
      "prevContext": [
        "And now I’m a dishwasher.",
        "I’m sorry Sofi."
      ],
      "nextContext": [
        "Yeah, right.",
        "I’m serious."
      ]
    },
    {
      "text": "There’s only room for one head chef in this restaurant, and that’s you.",
      "chunks": [
        "There’s only room",
        "for one head",
        "chef in this",
        "restaurant, and that’s you."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I’m serious.",
        "That’s sweet of you, Renzo. But it’s not possible."
      ],
      "nextContext": [
        "I know, I want to formally offer the position of head chef to you.",
        "You’re crazy, Renzo. What will you do?"
      ]
    },
    {
      "text": "I know, I want to formally offer the position of head chef to you.",
      "chunks": [
        "I know, I",
        "want to formally",
        "offer the position",
        "of head chef to you."
      ],
      "chunkCount": 4,
      "prevContext": [
        "That’s sweet of you, Renzo. But it’s not possible.",
        "There’s only room for one head chef in this restaurant, and that’s you."
      ],
      "nextContext": [
        "You’re crazy, Renzo. What will you do?",
        "I would be your sous chef. You’re more talented than I am."
      ]
    },
    {
      "text": "I would be your sous chef. You’re more talented than I am.",
      "chunks": [
        "I would be",
        "your sous chef.",
        "You’re more talented",
        "than I am."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I know, I want to formally offer the position of head chef to you.",
        "You’re crazy, Renzo. What will you do?"
      ],
      "nextContext": [
        "People only grow when they have someone great to learn from.",
        "You were meant to be a chef, not a dishwasher."
      ]
    },
    {
      "text": "People only grow when they have someone great to learn from.",
      "chunks": [
        "People only",
        "grow when",
        "they have",
        "someone great to learn from."
      ],
      "chunkCount": 4,
      "prevContext": [
        "You’re crazy, Renzo. What will you do?",
        "I would be your sous chef. You’re more talented than I am."
      ],
      "nextContext": [
        "You were meant to be a chef, not a dishwasher.",
        "I don’t know what to say Renzo, thank you."
      ]
    },
    {
      "text": "You were meant to be a chef, not a dishwasher.",
      "chunks": [
        "You were",
        "meant to",
        "be a",
        "chef, not a dishwasher."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I would be your sous chef. You’re more talented than I am.",
        "People only grow when they have someone great to learn from."
      ],
      "nextContext": [
        "I don’t know what to say Renzo, thank you.",
        "It means a lot, but do you really think Nadi would agree to this?"
      ]
    },
    {
      "text": "It means a lot, but do you really think Nadi would agree to this?",
      "chunks": [
        "It means a",
        "lot, but do",
        "you really think",
        "Nadi would agree to this?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "You were meant to be a chef, not a dishwasher.",
        "I don’t know what to say Renzo, thank you."
      ],
      "nextContext": [
        "She has to, she doesn’t. I’ll quit.",
        "Oh no. Don’t put your job on the line for me. That’s not necessary."
      ]
    },
    {
      "text": "Oh no. Don’t put your job on the line for me. That’s not necessary.",
      "chunks": [
        "Oh no. Don’t",
        "put your job",
        "on the line",
        "for me. That’s not necessary."
      ],
      "chunkCount": 4,
      "prevContext": [
        "It means a lot, but do you really think Nadi would agree to this?",
        "She has to, she doesn’t. I’ll quit."
      ],
      "nextContext": [
        "I don’t understand. I thought  you would be excited by this opportunity.",
        "My offer was supposed to make you happy."
      ]
    },
    {
      "text": "I don’t understand. I thought  you would be excited by this opportunity.",
      "chunks": [
        "I don’t understand.",
        "I thought you",
        "would be excited",
        "by this opportunity."
      ],
      "chunkCount": 4,
      "prevContext": [
        "She has to, she doesn’t. I’ll quit.",
        "Oh no. Don’t put your job on the line for me. That’s not necessary."
      ],
      "nextContext": [
        "My offer was supposed to make you happy.",
        "Renzo, I want to open my own restaurant."
      ]
    },
    {
      "text": "I don’t really need to be the head chef anymore.",
      "chunks": [
        "I don’t",
        "really need",
        "to be",
        "the head chef anymore."
      ],
      "chunkCount": 4,
      "prevContext": [
        "My offer was supposed to make you happy.",
        "Renzo, I want to open my own restaurant."
      ],
      "nextContext": [
        "How are you going to do that?",
        "I’m learning how, Renzo."
      ]
    },
    {
      "text": "There is a list of terms and chapters one and two that I want you to memorize by Friday.",
      "chunks": [
        "There is a list",
        "of terms and chapters",
        "one and two that",
        "I want you to memorize by Friday."
      ],
      "chunkCount": 4,
      "prevContext": [
        "How are you going to do that?",
        "I’m learning how, Renzo."
      ],
      "nextContext": [
        "Yes Sir.",
        "There are a lot of terms in those chapters. Is there a specific way you recommend we learn them by heart?"
      ]
    },
    {
      "text": "There are a lot of terms in those chapters. Is there a specific way you recommend we learn them by heart?",
      "chunks": [
        "There are a lot of",
        "terms in those chapters. Is",
        "there a specific way you",
        "recommend we learn them by heart?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "There is a list of terms and chapters one and two that I want you to memorize by Friday.",
        "Yes Sir."
      ],
      "nextContext": [
        "Rote learning is the best way to remember anything.",
        "What’s rote learning?"
      ]
    },
    {
      "text": "The more you repeat something, the easier it is going to be for you to recall that information.",
      "chunks": [
        "The more you repeat",
        "something, the easier it",
        "is going to be",
        "for you to recall that information."
      ],
      "chunkCount": 4,
      "prevContext": [
        "What’s rote learning?",
        "Rote learning is a process of learning through repetition."
      ],
      "nextContext": [
        "You repeat the terms over and over until you know them by heart.",
        "Yes."
      ]
    },
    {
      "text": "You repeat the terms over and over until you know them by heart.",
      "chunks": [
        "You repeat the",
        "terms over and",
        "over until you",
        "know them by heart."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Rote learning is a process of learning through repetition.",
        "The more you repeat something, the easier it is going to be for you to recall that information."
      ],
      "nextContext": [
        "Yes.",
        "Why do we have to memorize these terms so soon, if the test isn’t until a couple weeks from now?"
      ]
    },
    {
      "text": "Why do we have to memorize these terms so soon, if the test isn’t until a couple weeks from now?",
      "chunks": [
        "Why do we have to",
        "memorize these terms so soon,",
        "if the test isn’t until",
        "a couple weeks from now?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "You repeat the terms over and over until you know them by heart.",
        "Yes."
      ],
      "nextContext": [
        "I want you to be prepared for this exam. In this business class, it’s important to study hard in advance. So you can retain the information.",
        "How would you know if we just crammed the night before the test?"
      ]
    },
    {
      "text": "I want you to be prepared for this exam. In this business class, it’s important to study hard in advance. So you can retain the information.",
      "chunks": [
        "I want you to be prepared",
        "for this exam. In this business",
        "class, it’s important to study hard",
        "in advance. So you can retain the information."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Yes.",
        "Why do we have to memorize these terms so soon, if the test isn’t until a couple weeks from now?"
      ],
      "nextContext": [
        "How would you know if we just crammed the night before the test?",
        "I wouldn’t know. But doing that would only be bad for each of you. Cramming at the last minute for an exam only helps you memorize information for a short period of time, unless you’re an extremely gifted person."
      ]
    },
    {
      "text": "How would you know if we just crammed the night before the test?",
      "chunks": [
        "How would you",
        "know if we",
        "just crammed the",
        "night before the test?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "Why do we have to memorize these terms so soon, if the test isn’t until a couple weeks from now?",
        "I want you to be prepared for this exam. In this business class, it’s important to study hard in advance. So you can retain the information."
      ],
      "nextContext": [
        "I wouldn’t know. But doing that would only be bad for each of you. Cramming at the last minute for an exam only helps you memorize information for a short period of time, unless you’re an extremely gifted person.",
        "But for most of us, studying this information until you know it by heart is going to be the best way."
      ]
    },
    {
      "text": "I wouldn’t know. But doing that would only be bad for each of you. Cramming at the last minute for an exam only helps you memorize information for a short period of time, unless you’re an extremely gifted person.",
      "chunks": [
        "I wouldn’t know. But doing that would only be",
        "bad for each of you. Cramming at the last",
        "minute for an exam only helps you memorize information",
        "for a short period of time, unless you’re an extremely gifted person."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I want you to be prepared for this exam. In this business class, it’s important to study hard in advance. So you can retain the information.",
        "How would you know if we just crammed the night before the test?"
      ],
      "nextContext": [
        "But for most of us, studying this information until you know it by heart is going to be the best way.",
        "If there are any bookworms out there, you will be happy to know that there will be a lot of reading to do for this course. Also cheating in any form will not be tolerated. Cheating will result in immediate expulsion from my course and any other courses at this university."
      ]
    },
    {
      "text": "But for most of us, studying this information until you know it by heart is going to be the best way.",
      "chunks": [
        "But for most of us,",
        "studying this information until you",
        "know it by heart is",
        "going to be the best way."
      ],
      "chunkCount": 4,
      "prevContext": [
        "How would you know if we just crammed the night before the test?",
        "I wouldn’t know. But doing that would only be bad for each of you. Cramming at the last minute for an exam only helps you memorize information for a short period of time, unless you’re an extremely gifted person."
      ],
      "nextContext": [
        "If there are any bookworms out there, you will be happy to know that there will be a lot of reading to do for this course. Also cheating in any form will not be tolerated. Cheating will result in immediate expulsion from my course and any other courses at this university.",
        "That goes for playing hooky as well."
      ]
    },
    {
      "text": "If there are any bookworms out there, you will be happy to know that there will be a lot of reading to do for this course. Also cheating in any form will not be tolerated. Cheating will result in immediate expulsion from my course and any other courses at this university.",
      "chunks": [
        "If there are any bookworms out there, you will be happy to",
        "know that there will be a lot of reading to do for",
        "this course. Also cheating in any form will not be tolerated. Cheating",
        "will result in immediate expulsion from my course and any other courses at this university."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I wouldn’t know. But doing that would only be bad for each of you. Cramming at the last minute for an exam only helps you memorize information for a short period of time, unless you’re an extremely gifted person.",
        "But for most of us, studying this information until you know it by heart is going to be the best way."
      ],
      "nextContext": [
        "That goes for playing hooky as well.",
        "Yes Sofi"
      ]
    },
    {
      "text": "If you miss my classes, you will fall behind in your studies. It will be incredibly difficult to catch up.",
      "chunks": [
        "If you miss my classes,",
        "you will fall behind in",
        "your studies. It will be",
        "incredibly difficult to catch up."
      ],
      "chunkCount": 4,
      "prevContext": [
        "What does playing hooky mean?",
        "Playing hooky means to not to come to class."
      ],
      "nextContext": [
        "Which is worse, cheating or playing hooky?",
        "Don’t do either."
      ]
    },
    {
      "text": "My English literacy isn’t quite as advanced as my speaking.",
      "chunks": [
        "My English",
        "literacy isn’t",
        "quite as",
        "advanced as my speaking."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Don’t do either.",
        "Okay I won’t."
      ],
      "nextContext": [
        "Are there many tutors that can help me?",
        "I thought you were bilingual. You speak fluent English."
      ]
    },
    {
      "text": "Thank you. But I still have a lot of work to do.",
      "chunks": [
        "Thank you. But",
        "I still have",
        "a lot of",
        "work to do."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Are there many tutors that can help me?",
        "I thought you were bilingual. You speak fluent English."
      ],
      "nextContext": [
        "Well, for students that have special needs, come talk to me after the class and I will refer you to someone who can help you.",
        "Are there any other questions?"
      ]
    },
    {
      "text": "Well, for students that have special needs, come talk to me after the class and I will refer you to someone who can help you.",
      "chunks": [
        "Well, for students that have special",
        "needs, come talk to me after",
        "the class and I will refer",
        "you to someone who can help you."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I thought you were bilingual. You speak fluent English.",
        "Thank you. But I still have a lot of work to do."
      ],
      "nextContext": [
        "Are there any other questions?",
        "This class size is bigger than I’m used to."
      ]
    },
    {
      "text": "So, I’m not going to be able to give each of you individual attention.",
      "chunks": [
        "So, I’m not",
        "going to be",
        "able to give",
        "each of you individual attention."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Are there any other questions?",
        "This class size is bigger than I’m used to."
      ],
      "nextContext": [
        "But if you have any concerns, don’t hesitate to ask.",
        "I do have one concern."
      ]
    },
    {
      "text": "But if you have any concerns, don’t hesitate to ask.",
      "chunks": [
        "But if",
        "you have",
        "any concerns,",
        "don’t hesitate to ask."
      ],
      "chunkCount": 4,
      "prevContext": [
        "This class size is bigger than I’m used to.",
        "So, I’m not going to be able to give each of you individual attention."
      ],
      "nextContext": [
        "I do have one concern.",
        "Why do we have to take so many tests?"
      ]
    },
    {
      "text": "There are certain standards you expect from me, and I have certain standards that I expect from you. As business owners, your customers or clients would expect the same from you as I do.",
      "chunks": [
        "There are certain standards you expect from me,",
        "and I have certain standards that I expect",
        "from you. As business owners, your customers or",
        "clients would expect the same from you as I do."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Tests help you learn.",
        "This course operates under traditional teaching methods."
      ],
      "nextContext": [
        "Now, these next few months aren’t going to be easy. But I promise you that with hard work, they will be rewarding.",
        "You often find that people want to succeed, but they don’t want to work hard."
      ]
    },
    {
      "text": "Now, these next few months aren’t going to be easy. But I promise you that with hard work, they will be rewarding.",
      "chunks": [
        "Now, these next few months",
        "aren’t going to be easy.",
        "But I promise you that",
        "with hard work, they will be rewarding."
      ],
      "chunkCount": 4,
      "prevContext": [
        "This course operates under traditional teaching methods.",
        "There are certain standards you expect from me, and I have certain standards that I expect from you. As business owners, your customers or clients would expect the same from you as I do."
      ],
      "nextContext": [
        "You often find that people want to succeed, but they don’t want to work hard.",
        "You see that all the time?"
      ]
    },
    {
      "text": "You often find that people want to succeed, but they don’t want to work hard.",
      "chunks": [
        "You often find",
        "that people want",
        "to succeed, but",
        "they don’t want to work hard."
      ],
      "chunkCount": 4,
      "prevContext": [
        "There are certain standards you expect from me, and I have certain standards that I expect from you. As business owners, your customers or clients would expect the same from you as I do.",
        "Now, these next few months aren’t going to be easy. But I promise you that with hard work, they will be rewarding."
      ],
      "nextContext": [
        "You see that all the time?",
        "They don’t teach kids anything at most schools these days."
      ]
    },
    {
      "text": "They don’t teach kids anything at most schools these days.",
      "chunks": [
        "They don’t",
        "teach kids",
        "anything at",
        "most schools these days."
      ],
      "chunkCount": 4,
      "prevContext": [
        "You often find that people want to succeed, but they don’t want to work hard.",
        "You see that all the time?"
      ],
      "nextContext": [
        "They just want good grades.",
        "They don’t really want to learn."
      ]
    },
    {
      "text": "You hear stories about teachers helping students cheat. It’s terrible.",
      "chunks": [
        "You hear",
        "stories about",
        "teachers helping",
        "students cheat. It’s terrible."
      ],
      "chunkCount": 4,
      "prevContext": [
        "They just want good grades.",
        "They don’t really want to learn."
      ],
      "nextContext": [
        "They say our education system is getting worse.",
        "Well, I’m glad we have such a dedicated teacher as you."
      ]
    },
    {
      "text": "Well, I’m glad we have such a dedicated teacher as you.",
      "chunks": [
        "Well, I’m",
        "glad we",
        "have such",
        "a dedicated teacher as you."
      ],
      "chunkCount": 4,
      "prevContext": [
        "You hear stories about teachers helping students cheat. It’s terrible.",
        "They say our education system is getting worse."
      ],
      "nextContext": [
        "You hear about teachers who don’t care at all.",
        "Thanks, Sofi. They say I’m tough, but effective."
      ]
    },
    {
      "text": "Okay. Stop complimenting me. Let’s open our book to page four.",
      "chunks": [
        "Okay. Stop",
        "complimenting me.",
        "Let’s open",
        "our book to page four."
      ],
      "chunkCount": 4,
      "prevContext": [
        "You hear about teachers who don’t care at all.",
        "Thanks, Sofi. They say I’m tough, but effective."
      ],
      "nextContext": [
        "Learn Arabic at Home",
        "Do you want to learn Arabic, but you don't have a lot of time?"
      ]
    },
    {
      "text": "Do you want to learn Arabic, but you don't have a lot of time?",
      "chunks": [
        "Do you want",
        "to learn Arabic,",
        "but you don't",
        "have a lot of time?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "Okay. Stop complimenting me. Let’s open our book to page four.",
        "Learn Arabic at Home"
      ],
      "nextContext": [
        "Are you afraid it's going to be too difficult?",
        "Have you struggled with language courses in the past?"
      ]
    },
    {
      "text": "Now that you've found Arabic Online, you are sure to succeed in becoming fluent in Arabic with our program.",
      "chunks": [
        "Now that you've found",
        "Arabic Online, you are",
        "sure to succeed in",
        "becoming fluent in Arabic with our program."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Have you struggled with language courses in the past?",
        "Don't worry about any of those things."
      ],
      "nextContext": [
        "One reason for Arabic Online's success is that, unlike other language programs, it does not use traditional teaching methods.",
        "Instead of having one teacher with a classroom full of students, you get individual attention with Arabic Online. We pair each student with a teaching tutor."
      ]
    },
    {
      "text": "One reason for Arabic Online's success is that, unlike other language programs, it does not use traditional teaching methods.",
      "chunks": [
        "One reason for Arabic",
        "Online's success is that,",
        "unlike other language programs,",
        "it does not use traditional teaching methods."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Don't worry about any of those things.",
        "Now that you've found Arabic Online, you are sure to succeed in becoming fluent in Arabic with our program."
      ],
      "nextContext": [
        "Instead of having one teacher with a classroom full of students, you get individual attention with Arabic Online. We pair each student with a teaching tutor.",
        "We have very high standards for our tutors."
      ]
    },
    {
      "text": "Instead of having one teacher with a classroom full of students, you get individual attention with Arabic Online. We pair each student with a teaching tutor.",
      "chunks": [
        "Instead of having one teacher with",
        "a classroom full of students, you",
        "get individual attention with Arabic Online.",
        "We pair each student with a teaching tutor."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Now that you've found Arabic Online, you are sure to succeed in becoming fluent in Arabic with our program.",
        "One reason for Arabic Online's success is that, unlike other language programs, it does not use traditional teaching methods."
      ],
      "nextContext": [
        "We have very high standards for our tutors.",
        "They have teaching degrees, live in an Arabic-speaking country, and are bilingual. Their native language is Arabic, but they are also fluent in English."
      ]
    },
    {
      "text": "They have teaching degrees, live in an Arabic-speaking country, and are bilingual. Their native language is Arabic, but they are also fluent in English.",
      "chunks": [
        "They have teaching degrees, live in",
        "an Arabic-speaking country, and are bilingual.",
        "Their native language is Arabic, but",
        "they are also fluent in English."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Instead of having one teacher with a classroom full of students, you get individual attention with Arabic Online. We pair each student with a teaching tutor.",
        "We have very high standards for our tutors."
      ],
      "nextContext": [
        "We are also careful when we pair our students with teaching tutors.",
        "We take into account your age, profession, and outside interests to pair you with someone you will enjoy working with."
      ]
    },
    {
      "text": "We are also careful when we pair our students with teaching tutors.",
      "chunks": [
        "We are also",
        "careful when we",
        "pair our students",
        "with teaching tutors."
      ],
      "chunkCount": 4,
      "prevContext": [
        "We have very high standards for our tutors.",
        "They have teaching degrees, live in an Arabic-speaking country, and are bilingual. Their native language is Arabic, but they are also fluent in English."
      ],
      "nextContext": [
        "We take into account your age, profession, and outside interests to pair you with someone you will enjoy working with.",
        "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable."
      ]
    },
    {
      "text": "We take into account your age, profession, and outside interests to pair you with someone you will enjoy working with.",
      "chunks": [
        "We take into account your",
        "age, profession, and outside interests",
        "to pair you with someone",
        "you will enjoy working with."
      ],
      "chunkCount": 4,
      "prevContext": [
        "They have teaching degrees, live in an Arabic-speaking country, and are bilingual. Their native language is Arabic, but they are also fluent in English.",
        "We are also careful when we pair our students with teaching tutors."
      ],
      "nextContext": [
        "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable.",
        "So, how does it work?"
      ]
    },
    {
      "text": "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable.",
      "chunks": [
        "In contrast to",
        "some language schools,",
        "at Arabic Online,",
        "we want learning to be enjoyable."
      ],
      "chunkCount": 4,
      "prevContext": [
        "We are also careful when we pair our students with teaching tutors.",
        "We take into account your age, profession, and outside interests to pair you with someone you will enjoy working with."
      ],
      "nextContext": [
        "So, how does it work?",
        "All you need is a computer with a webcam and a high-speed internet connection."
      ]
    },
    {
      "text": "All you need is a computer with a webcam and a high-speed internet connection.",
      "chunks": [
        "All you need",
        "is a computer",
        "with a webcam",
        "and a high-speed internet connection."
      ],
      "chunkCount": 4,
      "prevContext": [
        "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable.",
        "So, how does it work?"
      ],
      "nextContext": [
        "We give you the telecommunications software you need to download.",
        "You will take online lessons while you learn the Arabic writing system and grammar."
      ]
    },
    {
      "text": "We give you the telecommunications software you need to download.",
      "chunks": [
        "We give",
        "you the",
        "telecommunications software",
        "you need to download."
      ],
      "chunkCount": 4,
      "prevContext": [
        "So, how does it work?",
        "All you need is a computer with a webcam and a high-speed internet connection."
      ],
      "nextContext": [
        "You will take online lessons while you learn the Arabic writing system and grammar.",
        "This is done with a series of interactive presentations."
      ]
    },
    {
      "text": "You will take online lessons while you learn the Arabic writing system and grammar.",
      "chunks": [
        "You will take",
        "online lessons while",
        "you learn the",
        "Arabic writing system and grammar."
      ],
      "chunkCount": 4,
      "prevContext": [
        "All you need is a computer with a webcam and a high-speed internet connection.",
        "We give you the telecommunications software you need to download."
      ],
      "nextContext": [
        "This is done with a series of interactive presentations.",
        "First, you watch a short presentation, and then you practice what you learned by completing exercises."
      ]
    },
    {
      "text": "First, you watch a short presentation, and then you practice what you learned by completing exercises.",
      "chunks": [
        "First, you watch a",
        "short presentation, and then",
        "you practice what you",
        "learned by completing exercises."
      ],
      "chunkCount": 4,
      "prevContext": [
        "You will take online lessons while you learn the Arabic writing system and grammar.",
        "This is done with a series of interactive presentations."
      ],
      "nextContext": [
        "After you finish each lesson, you work with your teaching tutor in a video chat.",
        "You can ask questions about the lesson."
      ]
    },
    {
      "text": "After you finish each lesson, you work with your teaching tutor in a video chat.",
      "chunks": [
        "After you finish",
        "each lesson, you",
        "work with your",
        "teaching tutor in a video chat."
      ],
      "chunkCount": 4,
      "prevContext": [
        "This is done with a series of interactive presentations.",
        "First, you watch a short presentation, and then you practice what you learned by completing exercises."
      ],
      "nextContext": [
        "You can ask questions about the lesson.",
        "After that, you practice what you learned by having conversations in Arabic with your tutor."
      ]
    },
    {
      "text": "After that, you practice what you learned by having conversations in Arabic with your tutor.",
      "chunks": [
        "After that, you",
        "practice what you",
        "learned by having",
        "conversations in Arabic with your tutor."
      ],
      "chunkCount": 4,
      "prevContext": [
        "After you finish each lesson, you work with your teaching tutor in a video chat.",
        "You can ask questions about the lesson."
      ],
      "nextContext": [
        "We feel the primary way to learn a language is to use it, as opposed to memorizing it.",
        "You learn language, and then immediately use it to communicate."
      ]
    },
    {
      "text": "We feel the primary way to learn a language is to use it, as opposed to memorizing it.",
      "chunks": [
        "We feel the primary",
        "way to learn a",
        "language is to use",
        "it, as opposed to memorizing it."
      ],
      "chunkCount": 4,
      "prevContext": [
        "You can ask questions about the lesson.",
        "After that, you practice what you learned by having conversations in Arabic with your tutor."
      ],
      "nextContext": [
        "You learn language, and then immediately use it to communicate.",
        "There is nothing like speaking with a native speaker as you learn a language."
      ]
    },
    {
      "text": "You learn language, and then immediately use it to communicate.",
      "chunks": [
        "You learn",
        "language, and",
        "then immediately",
        "use it to communicate."
      ],
      "chunkCount": 4,
      "prevContext": [
        "After that, you practice what you learned by having conversations in Arabic with your tutor.",
        "We feel the primary way to learn a language is to use it, as opposed to memorizing it."
      ],
      "nextContext": [
        "There is nothing like speaking with a native speaker as you learn a language.",
        "We also offer optional trips to Dubai so that you can really surround yourself with the language."
      ]
    },
    {
      "text": "There is nothing like speaking with a native speaker as you learn a language.",
      "chunks": [
        "There is nothing",
        "like speaking with",
        "a native speaker",
        "as you learn a language."
      ],
      "chunkCount": 4,
      "prevContext": [
        "We feel the primary way to learn a language is to use it, as opposed to memorizing it.",
        "You learn language, and then immediately use it to communicate."
      ],
      "nextContext": [
        "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
        "We have courses that last two and four weeks."
      ]
    },
    {
      "text": "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
      "chunks": [
        "We also offer optional",
        "trips to Dubai so",
        "that you can really",
        "surround yourself with the language."
      ],
      "chunkCount": 4,
      "prevContext": [
        "You learn language, and then immediately use it to communicate.",
        "There is nothing like speaking with a native speaker as you learn a language."
      ],
      "nextContext": [
        "We have courses that last two and four weeks.",
        "You fly to Dubai and stay with an Arabic-speaking family."
      ]
    },
    {
      "text": "You fly to Dubai and stay with an Arabic-speaking family.",
      "chunks": [
        "You fly",
        "to Dubai",
        "and stay",
        "with an Arabic-speaking family."
      ],
      "chunkCount": 4,
      "prevContext": [
        "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
        "We have courses that last two and four weeks."
      ],
      "nextContext": [
        "You take classes at our school during the day and get real-world practice speaking with your host family at night.",
        "On the weekends, we offer trips to various places in Dubai to use the language in real-life settings and get to know more about the culture."
      ]
    },
    {
      "text": "You take classes at our school during the day and get real-world practice speaking with your host family at night.",
      "chunks": [
        "You take classes at our",
        "school during the day and",
        "get real-world practice speaking with",
        "your host family at night."
      ],
      "chunkCount": 4,
      "prevContext": [
        "We have courses that last two and four weeks.",
        "You fly to Dubai and stay with an Arabic-speaking family."
      ],
      "nextContext": [
        "On the weekends, we offer trips to various places in Dubai to use the language in real-life settings and get to know more about the culture.",
        "Our program offers classes for everyone, from complete beginners to advanced students."
      ]
    },
    {
      "text": "On the weekends, we offer trips to various places in Dubai to use the language in real-life settings and get to know more about the culture.",
      "chunks": [
        "On the weekends, we offer trips",
        "to various places in Dubai to",
        "use the language in real-life settings",
        "and get to know more about the culture."
      ],
      "chunkCount": 4,
      "prevContext": [
        "You fly to Dubai and stay with an Arabic-speaking family.",
        "You take classes at our school during the day and get real-world practice speaking with your host family at night."
      ],
      "nextContext": [
        "Our program offers classes for everyone, from complete beginners to advanced students.",
        "Do you want to take advantage of the benefits that Arabic Online offers?"
      ]
    },
    {
      "text": "Our program offers classes for everyone, from complete beginners to advanced students.",
      "chunks": [
        "Our program offers",
        "classes for everyone,",
        "from complete beginners",
        "to advanced students."
      ],
      "chunkCount": 4,
      "prevContext": [
        "You take classes at our school during the day and get real-world practice speaking with your host family at night.",
        "On the weekends, we offer trips to various places in Dubai to use the language in real-life settings and get to know more about the culture."
      ],
      "nextContext": [
        "Do you want to take advantage of the benefits that Arabic Online offers?",
        "Click here to chat with a teaching tutor now."
      ]
    },
    {
      "text": "Do you want to take advantage of the benefits that Arabic Online offers?",
      "chunks": [
        "Do you want",
        "to take advantage",
        "of the benefits",
        "that Arabic Online offers?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "On the weekends, we offer trips to various places in Dubai to use the language in real-life settings and get to know more about the culture.",
        "Our program offers classes for everyone, from complete beginners to advanced students."
      ],
      "nextContext": [
        "Click here to chat with a teaching tutor now.",
        "To find out more about our program, click here to see our rates for the online courses and the program in Dubai."
      ]
    },
    {
      "text": "To find out more about our program, click here to see our rates for the online courses and the program in Dubai.",
      "chunks": [
        "To find out more about",
        "our program, click here to",
        "see our rates for the",
        "online courses and the program in Dubai."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Do you want to take advantage of the benefits that Arabic Online offers?",
        "Click here to chat with a teaching tutor now."
      ],
      "nextContext": [
        "Hi there. What can I do for you?",
        "I thought riding my bike to work would get me across town so quickly. I was trying to switch gears when I ran over a curve. Now, I have a flat tire, so I'm in a hurry. Can you help me?"
      ]
    },
    {
      "text": "I thought riding my bike to work would get me across town so quickly. I was trying to switch gears when I ran over a curve. Now, I have a flat tire, so I'm in a hurry. Can you help me?",
      "chunks": [
        "I thought riding my bike to work would get me",
        "across town so quickly. I was trying to switch gears",
        "when I ran over a curve. Now, I have a",
        "flat tire, so I'm in a hurry. Can you help me?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "To find out more about our program, click here to see our rates for the online courses and the program in Dubai.",
        "Hi there. What can I do for you?"
      ],
      "nextContext": [
        "Sure, let me take a look at that thing.",
        "Ah, I see your problem right here."
      ]
    },
    {
      "text": "You’ve got a nail stuck in the tire. It only takes a second to fix, but that bike chain is going to take a little more time.",
      "chunks": [
        "You’ve got a nail stuck in",
        "the tire. It only takes a",
        "second to fix, but that bike",
        "chain is going to take a little more time."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Sure, let me take a look at that thing.",
        "Ah, I see your problem right here."
      ],
      "nextContext": [
        "What do you mean?",
        "Your bike chain is coming loose. Do you want me to fix that too?"
      ]
    },
    {
      "text": "Your bike chain is coming loose. Do you want me to fix that too?",
      "chunks": [
        "Your bike chain",
        "is coming loose.",
        "Do you want",
        "me to fix that too?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "You’ve got a nail stuck in the tire. It only takes a second to fix, but that bike chain is going to take a little more time.",
        "What do you mean?"
      ],
      "nextContext": [
        "Fine. Just hurry. Please.",
        "Since you’re here, I’d recommend adding plastic covers to your handlebars."
      ]
    },
    {
      "text": "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
      "chunks": [
        "Since you’re",
        "here, I’d",
        "recommend adding",
        "plastic covers to your handlebars."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Your bike chain is coming loose. Do you want me to fix that too?",
        "Fine. Just hurry. Please."
      ],
      "nextContext": [
        "See how the grips seem to be wearing down. It’s bad. If your hands slip off, that would be dangerous.",
        "Listen. I can’t be late to this meeting."
      ]
    },
    {
      "text": "See how the grips seem to be wearing down. It’s bad. If your hands slip off, that would be dangerous.",
      "chunks": [
        "See how the grips seem",
        "to be wearing down. It’s",
        "bad. If your hands slip",
        "off, that would be dangerous."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Fine. Just hurry. Please.",
        "Since you’re here, I’d recommend adding plastic covers to your handlebars."
      ],
      "nextContext": [
        "Listen. I can’t be late to this meeting.",
        "Excuse me. Are you really listening?"
      ]
    },
    {
      "text": "Wow, I can’t believe your bike only has five gears. I can show you a really nice 10 speed bike if you want to buy a new one.",
      "chunks": [
        "Wow, I can’t believe your bike only",
        "has five gears. I can show you",
        "a really nice 10 speed bike if",
        "you want to buy a new one."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Listen. I can’t be late to this meeting.",
        "Excuse me. Are you really listening?"
      ],
      "nextContext": [
        "I don’t need a new bike. I need a new tire.",
        "Okay. Fine."
      ]
    },
    {
      "text": "I don’t need a new bike. I need a new tire.",
      "chunks": [
        "I don’t",
        "need a",
        "new bike.",
        "I need a new tire."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Excuse me. Are you really listening?",
        "Wow, I can’t believe your bike only has five gears. I can show you a really nice 10 speed bike if you want to buy a new one."
      ],
      "nextContext": [
        "Okay. Fine.",
        "Sorry. I didn’t mean to yell."
      ]
    },
    {
      "text": "I’m running late for an appointment. Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
      "chunks": [
        "I’m running late for an",
        "appointment. Let me pay you",
        "for the tire, and I’ll",
        "come back later to discuss the other problems."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Okay. Fine.",
        "Sorry. I didn’t mean to yell."
      ],
      "nextContext": [
        "Okay.",
        "It looks like your water glass is empty. Would you like me to fill it up?"
      ]
    },
    {
      "text": "It looks like your water glass is empty. Would you like me to fill it up?",
      "chunks": [
        "It looks like your",
        "water glass is empty.",
        "Would you like me",
        "to fill it up?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "I’m running late for an appointment. Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
        "Okay."
      ],
      "nextContext": [
        "No, thank you. Where’s your business partner? She’s late.",
        "Hey guys. I’m so sorry. I’m late."
      ]
    },
    {
      "text": "I would like to go over the primary benefits of choosing me as your investor.",
      "chunks": [
        "I would like",
        "to go over",
        "the primary benefits",
        "of choosing me as your investor."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Where were you?",
        "It’s fine. Great to see you Khae."
      ],
      "nextContext": [
        "I want you to pick me as opposed to anyone else.",
        "I’m so excited you have a working prototype."
      ]
    },
    {
      "text": "I want you to pick me as opposed to anyone else.",
      "chunks": [
        "I want",
        "you to",
        "pick me",
        "as opposed to anyone else."
      ],
      "chunkCount": 4,
      "prevContext": [
        "It’s fine. Great to see you Khae.",
        "I would like to go over the primary benefits of choosing me as your investor."
      ],
      "nextContext": [
        "I’m so excited you have a working prototype.",
        "Yes, so are we."
      ]
    },
    {
      "text": "What’s the primary reason we should choose you as opposed to anyone else?",
      "chunks": [
        "What’s the primary",
        "reason we should",
        "choose you as",
        "opposed to anyone else?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "I’m so excited you have a working prototype.",
        "Yes, so are we."
      ],
      "nextContext": [
        "You should let me invest in your company because of my enthusiasm and my commitment. The former reason will guarantee my excitement for your product doesn’t decrease. The latter will guarantee that we work together for a long time. I’m open to signing the contract.",
        "I like that."
      ]
    },
    {
      "text": "You should let me invest in your company because of my enthusiasm and my commitment. The former reason will guarantee my excitement for your product doesn’t decrease. The latter will guarantee that we work together for a long time. I’m open to signing the contract.",
      "chunks": [
        "You should let me invest in your company because of my",
        "enthusiasm and my commitment. The former reason will guarantee my excitement",
        "for your product doesn’t decrease. The latter will guarantee that we",
        "work together for a long time. I’m open to signing the contract."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Yes, so are we.",
        "What’s the primary reason we should choose you as opposed to anyone else?"
      ],
      "nextContext": [
        "I like that.",
        "In contrast with other investors, I want to be really involved with every aspect of the company from developing the marketing strategy to hiring new employees."
      ]
    },
    {
      "text": "In contrast with other investors, I want to be really involved with every aspect of the company from developing the marketing strategy to hiring new employees.",
      "chunks": [
        "In contrast with other investors, I",
        "want to be really involved with",
        "every aspect of the company from",
        "developing the marketing strategy to hiring new employees."
      ],
      "chunkCount": 4,
      "prevContext": [
        "You should let me invest in your company because of my enthusiasm and my commitment. The former reason will guarantee my excitement for your product doesn’t decrease. The latter will guarantee that we work together for a long time. I’m open to signing the contract.",
        "I like that."
      ],
      "nextContext": [
        "I want to be there.",
        "That’s interesting. We’ll consider that."
      ]
    },
    {
      "text": "In conclusion, I can double what any other investor offers. That’s how much I want to work with you.",
      "chunks": [
        "In conclusion, I can",
        "double what any other",
        "investor offers. That’s how",
        "much I want to work with you."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I want to be there.",
        "That’s interesting. We’ll consider that."
      ],
      "nextContext": [
        "Wow. Okay.",
        "Please. Let me invest in your company."
      ]
    },
    {
      "text": "Thank you for your interest in the People company. We’ll review your materials and contact you soon.",
      "chunks": [
        "Thank you for your",
        "interest in the People",
        "company. We’ll review your",
        "materials and contact you soon."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Wow. Okay.",
        "Please. Let me invest in your company."
      ],
      "nextContext": [
        "Thank you!",
        "Every investor we meet wants to work with us."
      ]
    },
    {
      "text": "Maybe we can go on one of those cruises that travels around the world.",
      "chunks": [
        "Maybe we can",
        "go on one",
        "of those cruises",
        "that travels around the world."
      ],
      "chunkCount": 4,
      "prevContext": [
        "We’re going to be rich Marco.",
        "I’ve always wanted to go on a long cruise."
      ],
      "nextContext": [
        "I love that idea.",
        "I can imagine it now. You and I get dropped off by our ship to go backpacking down the coast of South America."
      ]
    },
    {
      "text": "I can imagine it now. You and I get dropped off by our ship to go backpacking down the coast of South America.",
      "chunks": [
        "I can imagine it now.",
        "You and I get dropped",
        "off by our ship to",
        "go backpacking down the coast of South America."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Maybe we can go on one of those cruises that travels around the world.",
        "I love that idea."
      ],
      "nextContext": [
        "I always dreamed of going on a hiking expedition through the Himalayas.",
        "I hear the views from the mountains are breathtaking."
      ]
    },
    {
      "text": "I always dreamed of going on a hiking expedition through the Himalayas.",
      "chunks": [
        "I always dreamed",
        "of going on",
        "a hiking expedition",
        "through the Himalayas."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I love that idea.",
        "I can imagine it now. You and I get dropped off by our ship to go backpacking down the coast of South America."
      ],
      "nextContext": [
        "I hear the views from the mountains are breathtaking.",
        "However, we haven’t received a check yet."
      ]
    },
    {
      "text": "So for now, we’ll have to settle for a day trip because there’s still a lot of work to do.",
      "chunks": [
        "So for now, we’ll have",
        "to settle for a day",
        "trip because there’s still a",
        "lot of work to do."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I hear the views from the mountains are breathtaking.",
        "However, we haven’t received a check yet."
      ],
      "nextContext": [
        "Good point. Maybe we can go biking out into the countryside tomorrow.",
        "I don’t know if I want to go biking again for a while."
      ]
    },
    {
      "text": "Good point. Maybe we can go biking out into the countryside tomorrow.",
      "chunks": [
        "Good point. Maybe",
        "we can go",
        "biking out into",
        "the countryside tomorrow."
      ],
      "chunkCount": 4,
      "prevContext": [
        "However, we haven’t received a check yet.",
        "So for now, we’ll have to settle for a day trip because there’s still a lot of work to do."
      ],
      "nextContext": [
        "I don’t know if I want to go biking again for a while.",
        "My last expedition through the city didn’t turn out so well."
      ]
    },
    {
      "text": "I don’t know if I want to go biking again for a while.",
      "chunks": [
        "I don’t know",
        "if I want",
        "to go biking",
        "again for a while."
      ],
      "chunkCount": 4,
      "prevContext": [
        "So for now, we’ll have to settle for a day trip because there’s still a lot of work to do.",
        "Good point. Maybe we can go biking out into the countryside tomorrow."
      ],
      "nextContext": [
        "My last expedition through the city didn’t turn out so well.",
        "Well, maybe after we choose an investor we can take a business trip to various parts of the country to find a manufacturing plant."
      ]
    },
    {
      "text": "My last expedition through the city didn’t turn out so well.",
      "chunks": [
        "My last",
        "expedition through",
        "the city",
        "didn’t turn out so well."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Good point. Maybe we can go biking out into the countryside tomorrow.",
        "I don’t know if I want to go biking again for a while."
      ],
      "nextContext": [
        "Well, maybe after we choose an investor we can take a business trip to various parts of the country to find a manufacturing plant.",
        "That sounds fun. Let’s build a manufacturing plant by a beach."
      ]
    },
    {
      "text": "Well, maybe after we choose an investor we can take a business trip to various parts of the country to find a manufacturing plant.",
      "chunks": [
        "Well, maybe after we choose an",
        "investor we can take a business",
        "trip to various parts of the",
        "country to find a manufacturing plant."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I don’t know if I want to go biking again for a while.",
        "My last expedition through the city didn’t turn out so well."
      ],
      "nextContext": [
        "That sounds fun. Let’s build a manufacturing plant by a beach.",
        "Deal. This time tomorrow, we’ll be working with an investor."
      ]
    },
    {
      "text": "That sounds fun. Let’s build a manufacturing plant by a beach.",
      "chunks": [
        "That sounds",
        "fun. Let’s",
        "build a",
        "manufacturing plant by a beach."
      ],
      "chunkCount": 4,
      "prevContext": [
        "My last expedition through the city didn’t turn out so well.",
        "Well, maybe after we choose an investor we can take a business trip to various parts of the country to find a manufacturing plant."
      ],
      "nextContext": [
        "Deal. This time tomorrow, we’ll be working with an investor.",
        "I can’t wait. This is what we always want to see Marco."
      ]
    },
    {
      "text": "Deal. This time tomorrow, we’ll be working with an investor.",
      "chunks": [
        "Deal. This",
        "time tomorrow,",
        "we’ll be",
        "working with an investor."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Well, maybe after we choose an investor we can take a business trip to various parts of the country to find a manufacturing plant.",
        "That sounds fun. Let’s build a manufacturing plant by a beach."
      ],
      "nextContext": [
        "I can’t wait. This is what we always want to see Marco.",
        "I know."
      ]
    },
    {
      "text": "I can’t wait. This is what we always want to see Marco.",
      "chunks": [
        "I can’t wait.",
        "This is what",
        "we always want",
        "to see Marco."
      ],
      "chunkCount": 4,
      "prevContext": [
        "That sounds fun. Let’s build a manufacturing plant by a beach.",
        "Deal. This time tomorrow, we’ll be working with an investor."
      ],
      "nextContext": [
        "I know.",
        "I’ll be dropping my bike off at the shop at 5pm tomorrow. After that, we should celebrate."
      ]
    },
    {
      "text": "I’ll be dropping my bike off at the shop at 5pm tomorrow. After that, we should celebrate.",
      "chunks": [
        "I’ll be dropping my",
        "bike off at the",
        "shop at 5pm tomorrow.",
        "After that, we should celebrate."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I can’t wait. This is what we always want to see Marco.",
        "I know."
      ],
      "nextContext": [
        "I don’t know. We have a lot of work to do.",
        "What’s the point of starting a business if we can’t have a little fun?"
      ]
    },
    {
      "text": "I don’t know. We have a lot of work to do.",
      "chunks": [
        "I don’t",
        "know. We",
        "have a",
        "lot of work to do."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I know.",
        "I’ll be dropping my bike off at the shop at 5pm tomorrow. After that, we should celebrate."
      ],
      "nextContext": [
        "What’s the point of starting a business if we can’t have a little fun?",
        "I’ll be getting up very early on Saturday to review the job applications we received."
      ]
    },
    {
      "text": "What’s the point of starting a business if we can’t have a little fun?",
      "chunks": [
        "What’s the point",
        "of starting a",
        "business if we",
        "can’t have a little fun?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "I’ll be dropping my bike off at the shop at 5pm tomorrow. After that, we should celebrate.",
        "I don’t know. We have a lot of work to do."
      ],
      "nextContext": [
        "I’ll be getting up very early on Saturday to review the job applications we received.",
        "I can’t celebrate with you Khae."
      ]
    },
    {
      "text": "I’ll be getting up very early on Saturday to review the job applications we received.",
      "chunks": [
        "I’ll be getting",
        "up very early",
        "on Saturday to",
        "review the job applications we received."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I don’t know. We have a lot of work to do.",
        "What’s the point of starting a business if we can’t have a little fun?"
      ],
      "nextContext": [
        "I can’t celebrate with you Khae.",
        "I understand. No problem."
      ]
    },
    {
      "text": "Do you want to review the selection criteria for these investors?",
      "chunks": [
        "Do you",
        "want to",
        "review the",
        "selection criteria for these investors?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "This time tomorrow, I’ll be celebrating by myself.",
        "Sounds like a plan."
      ],
      "nextContext": [
        "I thought you’d never ask.",
        "Where are we going to go on our big trip this year?"
      ]
    },
    {
      "text": "Where are we going to go on our big trip this year?",
      "chunks": [
        "Where are we",
        "going to go",
        "on our big",
        "trip this year?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "Do you want to review the selection criteria for these investors?",
        "I thought you’d never ask."
      ],
      "nextContext": [
        "Kate, wouldn’t it be relaxing to go on a cruise?",
        "I don’t know, Josh. It sounds kind of boring. I don’t think I want to spend a lot of time on a ship."
      ]
    },
    {
      "text": "Kate, wouldn’t it be relaxing to go on a cruise?",
      "chunks": [
        "Kate, wouldn’t",
        "it be",
        "relaxing to",
        "go on a cruise?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "I thought you’d never ask.",
        "Where are we going to go on our big trip this year?"
      ],
      "nextContext": [
        "I don’t know, Josh. It sounds kind of boring. I don’t think I want to spend a lot of time on a ship.",
        "Well, we could go on a cruise that stops at some islands. I’d like to go to the beach and relax by the ocean. Wouldn’t you?"
      ]
    },
    {
      "text": "I don’t know, Josh. It sounds kind of boring. I don’t think I want to spend a lot of time on a ship.",
      "chunks": [
        "I don’t know, Josh. It",
        "sounds kind of boring. I",
        "don’t think I want to",
        "spend a lot of time on a ship."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Where are we going to go on our big trip this year?",
        "Kate, wouldn’t it be relaxing to go on a cruise?"
      ],
      "nextContext": [
        "Well, we could go on a cruise that stops at some islands. I’d like to go to the beach and relax by the ocean. Wouldn’t you?",
        "You know, I think I’d rather do something more adventurous. Don’t you think Machu Picchu would be amazing?"
      ]
    },
    {
      "text": "Well, we could go on a cruise that stops at some islands. I’d like to go to the beach and relax by the ocean. Wouldn’t you?",
      "chunks": [
        "Well, we could go on a",
        "cruise that stops at some islands.",
        "I’d like to go to the",
        "beach and relax by the ocean. Wouldn’t you?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "Kate, wouldn’t it be relaxing to go on a cruise?",
        "I don’t know, Josh. It sounds kind of boring. I don’t think I want to spend a lot of time on a ship."
      ],
      "nextContext": [
        "You know, I think I’d rather do something more adventurous. Don’t you think Machu Picchu would be amazing?",
        "Wow, Machu Picchu? Yeah, that would be amazing to see. It looks stunning in all of the pictures I’ve seen."
      ]
    },
    {
      "text": "You know, I think I’d rather do something more adventurous. Don’t you think Machu Picchu would be amazing?",
      "chunks": [
        "You know, I think",
        "I’d rather do something",
        "more adventurous. Don’t you",
        "think Machu Picchu would be amazing?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "I don’t know, Josh. It sounds kind of boring. I don’t think I want to spend a lot of time on a ship.",
        "Well, we could go on a cruise that stops at some islands. I’d like to go to the beach and relax by the ocean. Wouldn’t you?"
      ],
      "nextContext": [
        "Wow, Machu Picchu? Yeah, that would be amazing to see. It looks stunning in all of the pictures I’ve seen.",
        "I know, and there are some great hiking expeditions that leave from Cusco. Don’t you agree that it would be exciting to hike on the Inca Trail?"
      ]
    },
    {
      "text": "Wow, Machu Picchu? Yeah, that would be amazing to see. It looks stunning in all of the pictures I’ve seen.",
      "chunks": [
        "Wow, Machu Picchu? Yeah, that",
        "would be amazing to see.",
        "It looks stunning in all",
        "of the pictures I’ve seen."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Well, we could go on a cruise that stops at some islands. I’d like to go to the beach and relax by the ocean. Wouldn’t you?",
        "You know, I think I’d rather do something more adventurous. Don’t you think Machu Picchu would be amazing?"
      ],
      "nextContext": [
        "I know, and there are some great hiking expeditions that leave from Cusco. Don’t you agree that it would be exciting to hike on the Inca Trail?",
        "I don’t know. How long does it take?"
      ]
    },
    {
      "text": "I know, and there are some great hiking expeditions that leave from Cusco. Don’t you agree that it would be exciting to hike on the Inca Trail?",
      "chunks": [
        "I know, and there are some",
        "great hiking expeditions that leave from",
        "Cusco. Don’t you agree that it",
        "would be exciting to hike on the Inca Trail?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "You know, I think I’d rather do something more adventurous. Don’t you think Machu Picchu would be amazing?",
        "Wow, Machu Picchu? Yeah, that would be amazing to see. It looks stunning in all of the pictures I’ve seen."
      ],
      "nextContext": [
        "I don’t know. How long does it take?",
        "It’s about a four-day trek. You go with a guide, hike during the day, and stay in tents at night. I’ve heard the view is breathtaking when you finally get to Machu Picchu."
      ]
    },
    {
      "text": "It’s about a four-day trek. You go with a guide, hike during the day, and stay in tents at night. I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
      "chunks": [
        "It’s about a four-day trek. You go with",
        "a guide, hike during the day, and stay",
        "in tents at night. I’ve heard the view",
        "is breathtaking when you finally get to Machu Picchu."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I know, and there are some great hiking expeditions that leave from Cusco. Don’t you agree that it would be exciting to hike on the Inca Trail?",
        "I don’t know. How long does it take?"
      ],
      "nextContext": [
        "Well, to be honest, that sounds like a lot of work. I was looking forward to something a little more laid-back.",
        "Come on. We can relax at home. I feel like we need a real adventure, don’t you?"
      ]
    },
    {
      "text": "Well, to be honest, that sounds like a lot of work. I was looking forward to something a little more laid-back.",
      "chunks": [
        "Well, to be honest, that",
        "sounds like a lot of",
        "work. I was looking forward",
        "to something a little more laid-back."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I don’t know. How long does it take?",
        "It’s about a four-day trek. You go with a guide, hike during the day, and stay in tents at night. I’ve heard the view is breathtaking when you finally get to Machu Picchu."
      ],
      "nextContext": [
        "Come on. We can relax at home. I feel like we need a real adventure, don’t you?",
        "I guess so. Maybe we can compromise. Don’t you think that’s a good idea?"
      ]
    },
    {
      "text": "Come on. We can relax at home. I feel like we need a real adventure, don’t you?",
      "chunks": [
        "Come on. We can",
        "relax at home. I",
        "feel like we need",
        "a real adventure, don’t you?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "It’s about a four-day trek. You go with a guide, hike during the day, and stay in tents at night. I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
        "Well, to be honest, that sounds like a lot of work. I was looking forward to something a little more laid-back."
      ],
      "nextContext": [
        "I guess so. Maybe we can compromise. Don’t you think that’s a good idea?",
        "Sure, I’m willing to compromise. What did you have in mind?"
      ]
    },
    {
      "text": "I guess so. Maybe we can compromise. Don’t you think that’s a good idea?",
      "chunks": [
        "I guess so.",
        "Maybe we can",
        "compromise. Don’t you",
        "think that’s a good idea?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "Well, to be honest, that sounds like a lot of work. I was looking forward to something a little more laid-back.",
        "Come on. We can relax at home. I feel like we need a real adventure, don’t you?"
      ],
      "nextContext": [
        "Sure, I’m willing to compromise. What did you have in mind?",
        "I’ll go to Machu Picchu as long as we can take the train instead of hiking to the site."
      ]
    },
    {
      "text": "Sure, I’m willing to compromise. What did you have in mind?",
      "chunks": [
        "Sure, I’m",
        "willing to",
        "compromise. What",
        "did you have in mind?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "Come on. We can relax at home. I feel like we need a real adventure, don’t you?",
        "I guess so. Maybe we can compromise. Don’t you think that’s a good idea?"
      ],
      "nextContext": [
        "I’ll go to Machu Picchu as long as we can take the train instead of hiking to the site.",
        "That’s reasonable, isn’t it? Sure, we can do that. If we take the train, can we do some day hikes while we’re at Machu Picchu?"
      ]
    },
    {
      "text": "I’ll go to Machu Picchu as long as we can take the train instead of hiking to the site.",
      "chunks": [
        "I’ll go to Machu",
        "Picchu as long as",
        "we can take the",
        "train instead of hiking to the site."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I guess so. Maybe we can compromise. Don’t you think that’s a good idea?",
        "Sure, I’m willing to compromise. What did you have in mind?"
      ],
      "nextContext": [
        "That’s reasonable, isn’t it? Sure, we can do that. If we take the train, can we do some day hikes while we’re at Machu Picchu?",
        "That sounds good to me. And if we take the train, we’ll have more time in Cusco."
      ]
    },
    {
      "text": "That’s reasonable, isn’t it? Sure, we can do that. If we take the train, can we do some day hikes while we’re at Machu Picchu?",
      "chunks": [
        "That’s reasonable, isn’t it? Sure, we",
        "can do that. If we take",
        "the train, can we do some",
        "day hikes while we’re at Machu Picchu?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "Sure, I’m willing to compromise. What did you have in mind?",
        "I’ll go to Machu Picchu as long as we can take the train instead of hiking to the site."
      ],
      "nextContext": [
        "That sounds good to me. And if we take the train, we’ll have more time in Cusco.",
        "That would be nice, wouldn’t it?"
      ]
    },
    {
      "text": "That sounds good to me. And if we take the train, we’ll have more time in Cusco.",
      "chunks": [
        "That sounds good to",
        "me. And if we",
        "take the train, we’ll",
        "have more time in Cusco."
      ],
      "chunkCount": 4,
      "prevContext": [
        "I’ll go to Machu Picchu as long as we can take the train instead of hiking to the site.",
        "That’s reasonable, isn’t it? Sure, we can do that. If we take the train, can we do some day hikes while we’re at Machu Picchu?"
      ],
      "nextContext": [
        "That would be nice, wouldn’t it?",
        "That’s a good point. There are some amazing markets in Cusco."
      ]
    },
    {
      "text": "That’s a good point. There are some amazing markets in Cusco.",
      "chunks": [
        "That’s a",
        "good point.",
        "There are",
        "some amazing markets in Cusco."
      ],
      "chunkCount": 4,
      "prevContext": [
        "That sounds good to me. And if we take the train, we’ll have more time in Cusco.",
        "That would be nice, wouldn’t it?"
      ],
      "nextContext": [
        "If I agree not to hike, will you go shopping with me in Cusco?",
        "Shopping? I hate shopping, but I’ll go with you if you promise we can relax a little bit on vacation. I mean, we’re so busy with work all the time. Wouldn’t it be nice to do something relaxing?"
      ]
    },
    {
      "text": "If I agree not to hike, will you go shopping with me in Cusco?",
      "chunks": [
        "If I agree",
        "not to hike,",
        "will you go",
        "shopping with me in Cusco?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "That would be nice, wouldn’t it?",
        "That’s a good point. There are some amazing markets in Cusco."
      ],
      "nextContext": [
        "Shopping? I hate shopping, but I’ll go with you if you promise we can relax a little bit on vacation. I mean, we’re so busy with work all the time. Wouldn’t it be nice to do something relaxing?",
        "Okay, okay. If you do some day hikes with me and go shopping in Cusco, maybe we could go to the beach at the end of the trip. How about that?"
      ]
    },
    {
      "text": "Shopping? I hate shopping, but I’ll go with you if you promise we can relax a little bit on vacation. I mean, we’re so busy with work all the time. Wouldn’t it be nice to do something relaxing?",
      "chunks": [
        "Shopping? I hate shopping, but I’ll go with you",
        "if you promise we can relax a little bit",
        "on vacation. I mean, we’re so busy with work",
        "all the time. Wouldn’t it be nice to do something relaxing?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "That’s a good point. There are some amazing markets in Cusco.",
        "If I agree not to hike, will you go shopping with me in Cusco?"
      ],
      "nextContext": [
        "Okay, okay. If you do some day hikes with me and go shopping in Cusco, maybe we could go to the beach at the end of the trip. How about that?",
        "That sounds like a perfect plan. There are some beautiful beaches on the coast of Peru. We could try surfing, rent a boat, or go fishing."
      ]
    },
    {
      "text": "Okay, okay. If you do some day hikes with me and go shopping in Cusco, maybe we could go to the beach at the end of the trip. How about that?",
      "chunks": [
        "Okay, okay. If you do some day",
        "hikes with me and go shopping in",
        "Cusco, maybe we could go to the",
        "beach at the end of the trip. How about that?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "If I agree not to hike, will you go shopping with me in Cusco?",
        "Shopping? I hate shopping, but I’ll go with you if you promise we can relax a little bit on vacation. I mean, we’re so busy with work all the time. Wouldn’t it be nice to do something relaxing?"
      ],
      "nextContext": [
        "That sounds like a perfect plan. There are some beautiful beaches on the coast of Peru. We could try surfing, rent a boat, or go fishing.",
        "And I’m only going if we can relax on the beach — you know, sitting in the sun, reading, and napping."
      ]
    },
    {
      "text": "That sounds like a perfect plan. There are some beautiful beaches on the coast of Peru. We could try surfing, rent a boat, or go fishing.",
      "chunks": [
        "That sounds like a perfect plan.",
        "There are some beautiful beaches on",
        "the coast of Peru. We could",
        "try surfing, rent a boat, or go fishing."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Shopping? I hate shopping, but I’ll go with you if you promise we can relax a little bit on vacation. I mean, we’re so busy with work all the time. Wouldn’t it be nice to do something relaxing?",
        "Okay, okay. If you do some day hikes with me and go shopping in Cusco, maybe we could go to the beach at the end of the trip. How about that?"
      ],
      "nextContext": [
        "And I’m only going if we can relax on the beach — you know, sitting in the sun, reading, and napping.",
        "You can do that for a day or two, can’t you?"
      ]
    },
    {
      "text": "And I’m only going if we can relax on the beach — you know, sitting in the sun, reading, and napping.",
      "chunks": [
        "And I’m only going if",
        "we can relax on the",
        "beach — you know, sitting",
        "in the sun, reading, and napping."
      ],
      "chunkCount": 4,
      "prevContext": [
        "Okay, okay. If you do some day hikes with me and go shopping in Cusco, maybe we could go to the beach at the end of the trip. How about that?",
        "That sounds like a perfect plan. There are some beautiful beaches on the coast of Peru. We could try surfing, rent a boat, or go fishing."
      ],
      "nextContext": [
        "You can do that for a day or two, can’t you?",
        "Yes, I suppose. If you can go shopping, I can relax for a few days."
      ]
    },
    {
      "text": "You can do that for a day or two, can’t you?",
      "chunks": [
        "You can",
        "do that",
        "for a",
        "day or two, can’t you?"
      ],
      "chunkCount": 4,
      "prevContext": [
        "That sounds like a perfect plan. There are some beautiful beaches on the coast of Peru. We could try surfing, rent a boat, or go fishing.",
        "And I’m only going if we can relax on the beach — you know, sitting in the sun, reading, and napping."
      ],
      "nextContext": [
        "Yes, I suppose. If you can go shopping, I can relax for a few days."
      ]
    },
    {
      "text": "Yes, I suppose. If you can go shopping, I can relax for a few days.",
      "chunks": [
        "Yes, I suppose.",
        "If you can",
        "go shopping, I",
        "can relax for a few days."
      ],
      "chunkCount": 4,
      "prevContext": [
        "And I’m only going if we can relax on the beach — you know, sitting in the sun, reading, and napping.",
        "You can do that for a day or two, can’t you?"
      ],
      "nextContext": []
    }
  ]
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
    const [chunkLevel, setChunkLevel] = useState(2);
  const [practiceRound, setPracticeRound] = useState(1);
  const [showHintText, setShowHintText] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(0.85);
  const [playingChunkIdx, setPlayingChunkIdx] = useState(null);

  const historyRef = useRef(new Set());
  const [currentSentence, setCurrentSentence] = useState(() => {
    const list = CHUNK_DATABASE["2"];
    const picked = list[Math.floor(Math.random() * list.length)];
    historyRef.current.add(picked.text);
    return { ...picked };
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
    handleNextSentence(level);
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
              <h1 className="font-bold text-sm text-white tracking-tight">Unit 61 Study</h1>
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


            {/* 청크 1~4청크 */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-500 font-semibold mr-0.5">청크 설정:</span>
              {[1, 2, 3, 4].map(level => (
                <button
                  key={level}
                  onClick={() => handleSelectChunkLevel(level)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    chunkLevel === level
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {level}
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
                type="button"
                onClick={() => setShowHintText(prev => !prev)}
                title={showHintText ? "문장 표시 상태 (다음 문장에도 유지)" : "문장 가림 상태 (다음 문장에도 유지)"}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all ${
                  showHintText 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {showHintText ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                <span>{showHintText ? '원문 표시 ON' : '원문 가림 OFF'}</span>
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
              <div className="mt-2 p-3 rounded-lg bg-slate-900/90 border border-slate-700/60 text-left w-full text-xs text-slate-400 flex flex-col gap-1">
                {displayItem.prevContext && displayItem.prevContext.map((c, i) => (
                   <p key={`prev-${i}`} className="leading-snug">{c}</p>
                ))}
                
                <p className="font-bold text-indigo-200 text-[13px] my-1 leading-snug border-l-2 border-indigo-500 pl-2 py-0.5 bg-indigo-500/10">
                  {displayItem.text}
                </p>
                
                {displayItem.nextContext && displayItem.nextContext.map((c, i) => (
                   <p key={`next-${i}`} className="leading-snug">{c}</p>
                ))}
              </div>
            )}
          </div>

          {/* 듣기, 다음 문장, 따라 말하기 버튼 (3열 슬림형) */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={playTargetAudio}
              disabled={isPlayingAudio}
              className={`py-2.5 px-2 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                isPlayingAudio
                  ? 'bg-indigo-900/80 border border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/20'
                  : 'bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-indigo-400' : 'text-indigo-400'}`} />
              <span>{isPlayingAudio ? "재생 중" : "듣기"}</span>
            </button>

            <button
              onClick={() => handleNextSentence(chunkLevel, difficultyLevel)}
              className="py-2.5 px-2 rounded-xl font-bold text-[11px] sm:text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <span>다음 문장</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleRecording}
              className={`py-2.5 px-2 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
              }`}
            >
              {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-4 h-4" />}
              <span>{isRecording ? "완료" : "따라 말하기"}</span>
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
