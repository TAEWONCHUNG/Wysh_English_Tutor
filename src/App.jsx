import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Mic, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play, 
  Square, 
  Volume1, 
  BookOpen
} from 'lucide-react';

// Unit 61 실전 스크립트 전체 문장 데이터베이스 (순차 진행 및 전후 문맥 포함)
const UNIT61_DATABASE = [
  {
    "id": 1,
    "text": "Is this really my dressing room?",
    "chunks": [
      "Is this really",
      "my dressing room?"
    ],
    "translation": "여기가 진짜 제 분장실인가요?",
    "prevContext": [],
    "nextContext": [
      "This is fantastic.",
      "I should’ve come to Los Angeles sooner.",
      "You shouldn’t have jumped on the couch."
    ]
  },
  {
    "id": 2,
    "text": "This is fantastic.",
    "chunks": [
      "This is fantastic."
    ],
    "translation": "정말 환상적이네요.",
    "prevContext": [
      "Is this really my dressing room?"
    ],
    "nextContext": [
      "I should’ve come to Los Angeles sooner.",
      "You shouldn’t have jumped on the couch.",
      "You’ll ruin it."
    ]
  },
  {
    "id": 3,
    "text": "I should’ve come to Los Angeles sooner.",
    "chunks": [
      "I should’ve come",
      "to Los Angeles sooner."
    ],
    "translation": "진작 로스앤젤레스에 왔어야 했어요.",
    "prevContext": [
      "Is this really my dressing room?",
      "This is fantastic."
    ],
    "nextContext": [
      "You shouldn’t have jumped on the couch.",
      "You’ll ruin it.",
      "Sorry."
    ]
  },
  {
    "id": 4,
    "text": "You shouldn’t have jumped on the couch.",
    "chunks": [
      "You shouldn’t have",
      "jumped on the couch."
    ],
    "translation": "소파 위에서 뛰지 말았어야죠.",
    "prevContext": [
      "Is this really my dressing room?",
      "This is fantastic.",
      "I should’ve come to Los Angeles sooner."
    ],
    "nextContext": [
      "You’ll ruin it.",
      "Sorry.",
      "Hi, I’m Jimmy, the stunt coordinator for the series."
    ]
  },
  {
    "id": 5,
    "text": "You’ll ruin it.",
    "chunks": [
      "You’ll ruin it."
    ],
    "translation": "망가뜨릴 뻔했잖아요.",
    "prevContext": [
      "This is fantastic.",
      "I should’ve come to Los Angeles sooner.",
      "You shouldn’t have jumped on the couch."
    ],
    "nextContext": [
      "Sorry.",
      "Hi, I’m Jimmy, the stunt coordinator for the series.",
      "Nice to meet you."
    ]
  },
  {
    "id": 6,
    "text": "Sorry.",
    "chunks": [
      "Sorry."
    ],
    "translation": "죄송합니다.",
    "prevContext": [
      "I should’ve come to Los Angeles sooner.",
      "You shouldn’t have jumped on the couch.",
      "You’ll ruin it."
    ],
    "nextContext": [
      "Hi, I’m Jimmy, the stunt coordinator for the series.",
      "Nice to meet you.",
      "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife."
    ]
  },
  {
    "id": 7,
    "text": "Hi, I’m Jimmy, the stunt coordinator for the series.",
    "chunks": [
      "Hi, I’m Jimmy,",
      "the stunt coordinator",
      "for the series."
    ],
    "translation": "안녕하세요, 저는 이 시리즈의 스턴트 코디네이터 지미입니다.",
    "prevContext": [
      "You shouldn’t have jumped on the couch.",
      "You’ll ruin it.",
      "Sorry."
    ],
    "nextContext": [
      "Nice to meet you.",
      "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
      "Would you mind coming outside so I can become familiar with your stunt experience?"
    ]
  },
  {
    "id": 8,
    "text": "Nice to meet you.",
    "chunks": [
      "Nice to meet you."
    ],
    "translation": "만나서 반갑습니다.",
    "prevContext": [
      "You’ll ruin it.",
      "Sorry.",
      "Hi, I’m Jimmy, the stunt coordinator for the series."
    ],
    "nextContext": [
      "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
      "Would you mind coming outside so I can become familiar with your stunt experience?",
      "Sure, wait, what?"
    ]
  },
  {
    "id": 9,
    "text": "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
    "chunks": [
      "Oh hello, I’m Shen,",
      "a recruiting cast member",
      "on the hit medical",
      "show under the knife."
    ],
    "translation": "아 안녕하세요, 인기 의학 드라마 '언더 더 나이프'에 새로 합류한 션입니다.",
    "prevContext": [
      "Sorry.",
      "Hi, I’m Jimmy, the stunt coordinator for the series.",
      "Nice to meet you."
    ],
    "nextContext": [
      "Would you mind coming outside so I can become familiar with your stunt experience?",
      "Sure, wait, what?",
      "Your stunt experience."
    ]
  },
  {
    "id": 10,
    "text": "Would you mind coming outside so I can become familiar with your stunt experience?",
    "chunks": [
      "Would you mind",
      "coming outside so",
      "I can become",
      "familiar with your stunt experience?"
    ],
    "translation": "스턴트 경험을 좀 파악하게 밖으로 나와 주시겠어요?",
    "prevContext": [
      "Hi, I’m Jimmy, the stunt coordinator for the series.",
      "Nice to meet you.",
      "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife."
    ],
    "nextContext": [
      "Sure, wait, what?",
      "Your stunt experience.",
      "There are several explosions and fight scenes in this episode."
    ]
  },
  {
    "id": 11,
    "text": "Sure, wait, what?",
    "chunks": [
      "Sure, wait, what?"
    ],
    "translation": "네, 잠깐, 뭐라고요?",
    "prevContext": [
      "Nice to meet you.",
      "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
      "Would you mind coming outside so I can become familiar with your stunt experience?"
    ],
    "nextContext": [
      "Your stunt experience.",
      "There are several explosions and fight scenes in this episode.",
      "I wasn’t told about any stunts. Someone could’ve told me."
    ]
  },
  {
    "id": 12,
    "text": "Your stunt experience.",
    "chunks": [
      "Your stunt experience."
    ],
    "translation": "당신의 스턴트 경험이요.",
    "prevContext": [
      "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
      "Would you mind coming outside so I can become familiar with your stunt experience?",
      "Sure, wait, what?"
    ],
    "nextContext": [
      "There are several explosions and fight scenes in this episode.",
      "I wasn’t told about any stunts. Someone could’ve told me.",
      "I’m the stunt coordinator."
    ]
  },
  {
    "id": 13,
    "text": "There are several explosions and fight scenes in this episode.",
    "chunks": [
      "There are several",
      "explosions and fight",
      "scenes in this episode."
    ],
    "translation": "이번 에피소드에 폭발 장면과 격투 씬이 몇 개 있거든요.",
    "prevContext": [
      "Would you mind coming outside so I can become familiar with your stunt experience?",
      "Sure, wait, what?",
      "Your stunt experience."
    ],
    "nextContext": [
      "I wasn’t told about any stunts. Someone could’ve told me.",
      "I’m the stunt coordinator.",
      "It’s not my job to communicate that information."
    ]
  },
  {
    "id": 14,
    "text": "I wasn’t told about any stunts. Someone could’ve told me.",
    "chunks": [
      "I wasn’t told",
      "about any stunts.",
      "Someone could’ve told me."
    ],
    "translation": "스턴트에 대해선 전혀 못 들었어요. 누가 미리 말해줄 수도 있었잖아요.",
    "prevContext": [
      "Sure, wait, what?",
      "Your stunt experience.",
      "There are several explosions and fight scenes in this episode."
    ],
    "nextContext": [
      "I’m the stunt coordinator.",
      "It’s not my job to communicate that information.",
      "You should’ve read the script."
    ]
  },
  {
    "id": 15,
    "text": "I’m the stunt coordinator.",
    "chunks": [
      "I’m the stunt coordinator."
    ],
    "translation": "전 스턴트 코디네이터입니다.",
    "prevContext": [
      "Your stunt experience.",
      "There are several explosions and fight scenes in this episode.",
      "I wasn’t told about any stunts. Someone could’ve told me."
    ],
    "nextContext": [
      "It’s not my job to communicate that information.",
      "You should’ve read the script.",
      "They gave it to me an hour ago."
    ]
  },
  {
    "id": 16,
    "text": "It’s not my job to communicate that information.",
    "chunks": [
      "It’s not my job",
      "to communicate that information."
    ],
    "translation": "그런 정보를 전달하는 건 제 일이 아닙니다.",
    "prevContext": [
      "There are several explosions and fight scenes in this episode.",
      "I wasn’t told about any stunts. Someone could’ve told me.",
      "I’m the stunt coordinator."
    ],
    "nextContext": [
      "You should’ve read the script.",
      "They gave it to me an hour ago.",
      "Well. You’ve got to perform."
    ]
  },
  {
    "id": 17,
    "text": "You should’ve read the script.",
    "chunks": [
      "You should’ve",
      "read the script."
    ],
    "translation": "대본을 읽어보셨어야죠.",
    "prevContext": [
      "I wasn’t told about any stunts. Someone could’ve told me.",
      "I’m the stunt coordinator.",
      "It’s not my job to communicate that information."
    ],
    "nextContext": [
      "They gave it to me an hour ago.",
      "Well. You’ve got to perform.",
      "I’m going to see how skilled you are at stunts."
    ]
  },
  {
    "id": 18,
    "text": "They gave it to me an hour ago.",
    "chunks": [
      "They gave it to",
      "me an hour ago."
    ],
    "translation": "한 시간 전에야 대본을 줬다고요.",
    "prevContext": [
      "I’m the stunt coordinator.",
      "It’s not my job to communicate that information.",
      "You should’ve read the script."
    ],
    "nextContext": [
      "Well. You’ve got to perform.",
      "I’m going to see how skilled you are at stunts.",
      "Then, teach you what you need to learn."
    ]
  },
  {
    "id": 19,
    "text": "Well. You’ve got to perform.",
    "chunks": [
      "Well. You’ve",
      "got to perform."
    ],
    "translation": "글쎄요. 어쨌든 연기는 하셔야 합니다.",
    "prevContext": [
      "It’s not my job to communicate that information.",
      "You should’ve read the script.",
      "They gave it to me an hour ago."
    ],
    "nextContext": [
      "I’m going to see how skilled you are at stunts.",
      "Then, teach you what you need to learn.",
      "Did you stretch?"
    ]
  },
  {
    "id": 20,
    "text": "I’m going to see how skilled you are at stunts.",
    "chunks": [
      "I’m going to",
      "see how skilled",
      "you are at stunts."
    ],
    "translation": "스턴트 실력이 어느 정도인지 한번 보겠습니다.",
    "prevContext": [
      "You should’ve read the script.",
      "They gave it to me an hour ago.",
      "Well. You’ve got to perform."
    ],
    "nextContext": [
      "Then, teach you what you need to learn.",
      "Did you stretch?",
      "No. You should’ve stretched."
    ]
  },
  {
    "id": 21,
    "text": "Then, teach you what you need to learn.",
    "chunks": [
      "Then, teach you what",
      "you need to learn."
    ],
    "translation": "그러고 나서 배워야 할 것들을 가르쳐 드리죠.",
    "prevContext": [
      "They gave it to me an hour ago.",
      "Well. You’ve got to perform.",
      "I’m going to see how skilled you are at stunts."
    ],
    "nextContext": [
      "Did you stretch?",
      "No. You should’ve stretched.",
      "Come on."
    ]
  },
  {
    "id": 22,
    "text": "Did you stretch?",
    "chunks": [
      "Did you stretch?"
    ],
    "translation": "스트레칭은 하셨나요?",
    "prevContext": [
      "Well. You’ve got to perform.",
      "I’m going to see how skilled you are at stunts.",
      "Then, teach you what you need to learn."
    ],
    "nextContext": [
      "No. You should’ve stretched.",
      "Come on.",
      "Get out of here."
    ]
  },
  {
    "id": 23,
    "text": "No. You should’ve stretched.",
    "chunks": [
      "No. You should’ve stretched."
    ],
    "translation": "아니요. 스트레칭을 해뒀어야죠.",
    "prevContext": [
      "I’m going to see how skilled you are at stunts.",
      "Then, teach you what you need to learn.",
      "Did you stretch?"
    ],
    "nextContext": [
      "Come on.",
      "Get out of here.",
      "Yes Sir."
    ]
  },
  {
    "id": 24,
    "text": "Come on.",
    "chunks": [
      "Come on."
    ],
    "translation": "어서요.",
    "prevContext": [
      "Then, teach you what you need to learn.",
      "Did you stretch?",
      "No. You should’ve stretched."
    ],
    "nextContext": [
      "Get out of here.",
      "Yes Sir.",
      "With every stunt, one mistake could cause injury or even death."
    ]
  },
  {
    "id": 25,
    "text": "Get out of here.",
    "chunks": [
      "Get out of here."
    ],
    "translation": "밖으로 나갑시다.",
    "prevContext": [
      "Did you stretch?",
      "No. You should’ve stretched.",
      "Come on."
    ],
    "nextContext": [
      "Yes Sir.",
      "With every stunt, one mistake could cause injury or even death.",
      "Sir, I’m an experienced actor, and I’ll be fine."
    ]
  },
  {
    "id": 26,
    "text": "Yes Sir.",
    "chunks": [
      "Yes Sir."
    ],
    "translation": "네, 교수님.",
    "prevContext": [
      "No. You should’ve stretched.",
      "Come on.",
      "Get out of here."
    ],
    "nextContext": [
      "With every stunt, one mistake could cause injury or even death.",
      "Sir, I’m an experienced actor, and I’ll be fine.",
      "But, I’ll take this very seriously."
    ]
  },
  {
    "id": 27,
    "text": "With every stunt, one mistake could cause injury or even death.",
    "chunks": [
      "With every stunt,",
      "one mistake could",
      "cause injury or even death."
    ],
    "translation": "모든 스턴트는 사소한 실수 하나로 부상이나 사망에 이를 수 있습니다.",
    "prevContext": [
      "Come on.",
      "Get out of here.",
      "Yes Sir."
    ],
    "nextContext": [
      "Sir, I’m an experienced actor, and I’ll be fine.",
      "But, I’ll take this very seriously.",
      "How high can you jump?"
    ]
  },
  {
    "id": 28,
    "text": "Sir, I’m an experienced actor, and I’ll be fine.",
    "chunks": [
      "Sir, I’m an",
      "experienced actor, and",
      "I’ll be fine."
    ],
    "translation": "선생님, 전 경험 많은 배우라 괜찮을 겁니다.",
    "prevContext": [
      "Get out of here.",
      "Yes Sir.",
      "With every stunt, one mistake could cause injury or even death."
    ],
    "nextContext": [
      "But, I’ll take this very seriously.",
      "How high can you jump?",
      "Well, let’s see."
    ]
  },
  {
    "id": 29,
    "text": "But, I’ll take this very seriously.",
    "chunks": [
      "But, I’ll take",
      "this very seriously."
    ],
    "translation": "하지만 매우 진지하게 임하겠습니다.",
    "prevContext": [
      "Yes Sir.",
      "With every stunt, one mistake could cause injury or even death.",
      "Sir, I’m an experienced actor, and I’ll be fine."
    ],
    "nextContext": [
      "How high can you jump?",
      "Well, let’s see.",
      "That’s it?"
    ]
  },
  {
    "id": 30,
    "text": "How high can you jump?",
    "chunks": [
      "How high",
      "can you jump?"
    ],
    "translation": "얼마나 높이 뛸 수 있나요?",
    "prevContext": [
      "With every stunt, one mistake could cause injury or even death.",
      "Sir, I’m an experienced actor, and I’ll be fine.",
      "But, I’ll take this very seriously."
    ],
    "nextContext": [
      "Well, let’s see.",
      "That’s it?",
      "This is worse than I thought."
    ]
  },
  {
    "id": 31,
    "text": "Well, let’s see.",
    "chunks": [
      "Well, let’s see."
    ],
    "translation": "음, 어디 한번 보죠.",
    "prevContext": [
      "Sir, I’m an experienced actor, and I’ll be fine.",
      "But, I’ll take this very seriously.",
      "How high can you jump?"
    ],
    "nextContext": [
      "That’s it?",
      "This is worse than I thought.",
      "Can you throw yourself through a brick wall?"
    ]
  },
  {
    "id": 32,
    "text": "That’s it?",
    "chunks": [
      "That’s it?"
    ],
    "translation": "그게 다예요?",
    "prevContext": [
      "But, I’ll take this very seriously.",
      "How high can you jump?",
      "Well, let’s see."
    ],
    "nextContext": [
      "This is worse than I thought.",
      "Can you throw yourself through a brick wall?",
      "Are you serious?"
    ]
  },
  {
    "id": 33,
    "text": "This is worse than I thought.",
    "chunks": [
      "This is worse",
      "than I thought."
    ],
    "translation": "생각했던 것보다 더 심각하네요.",
    "prevContext": [
      "How high can you jump?",
      "Well, let’s see.",
      "That’s it?"
    ],
    "nextContext": [
      "Can you throw yourself through a brick wall?",
      "Are you serious?",
      "Yes."
    ]
  },
  {
    "id": 34,
    "text": "Can you throw yourself through a brick wall?",
    "chunks": [
      "Can you throw yourself",
      "through a brick wall?"
    ],
    "translation": "벽돌 벽을 뚫고 몸을 날릴 수 있나요?",
    "prevContext": [
      "Well, let’s see.",
      "That’s it?",
      "This is worse than I thought."
    ],
    "nextContext": [
      "Are you serious?",
      "Yes.",
      "I usually try to avoid brick walls rather than throw myself into them."
    ]
  },
  {
    "id": 35,
    "text": "Are you serious?",
    "chunks": [
      "Are you serious?"
    ],
    "translation": "진심이세요?",
    "prevContext": [
      "That’s it?",
      "This is worse than I thought.",
      "Can you throw yourself through a brick wall?"
    ],
    "nextContext": [
      "Yes.",
      "I usually try to avoid brick walls rather than throw myself into them.",
      "Just answer the question."
    ]
  },
  {
    "id": 36,
    "text": "Yes.",
    "chunks": [
      "Yes."
    ],
    "translation": "네.",
    "prevContext": [
      "This is worse than I thought.",
      "Can you throw yourself through a brick wall?",
      "Are you serious?"
    ],
    "nextContext": [
      "I usually try to avoid brick walls rather than throw myself into them.",
      "Just answer the question.",
      "I’ve never thrown myself into a brick wall."
    ]
  },
  {
    "id": 37,
    "text": "I usually try to avoid brick walls rather than throw myself into them.",
    "chunks": [
      "I usually try to",
      "avoid brick walls rather",
      "than throw myself into them."
    ],
    "translation": "전 보통 벽돌 벽에 몸을 던지기보단 피하려고 하는데요.",
    "prevContext": [
      "Can you throw yourself through a brick wall?",
      "Are you serious?",
      "Yes."
    ],
    "nextContext": [
      "Just answer the question.",
      "I’ve never thrown myself into a brick wall.",
      "Crash into it."
    ]
  },
  {
    "id": 38,
    "text": "Just answer the question.",
    "chunks": [
      "Just answer the question."
    ],
    "translation": "질문에만 답하세요.",
    "prevContext": [
      "Are you serious?",
      "Yes.",
      "I usually try to avoid brick walls rather than throw myself into them."
    ],
    "nextContext": [
      "I’ve never thrown myself into a brick wall.",
      "Crash into it.",
      "Are you sure this is necessary?"
    ]
  },
  {
    "id": 39,
    "text": "I’ve never thrown myself into a brick wall.",
    "chunks": [
      "I’ve never thrown myself",
      "into a brick wall."
    ],
    "translation": "벽돌 벽에 몸을 던져본 적은 한 번도 없습니다.",
    "prevContext": [
      "Yes.",
      "I usually try to avoid brick walls rather than throw myself into them.",
      "Just answer the question."
    ],
    "nextContext": [
      "Crash into it.",
      "Are you sure this is necessary?",
      "Yes."
    ]
  },
  {
    "id": 40,
    "text": "Crash into it.",
    "chunks": [
      "Crash into it."
    ],
    "translation": "벽에 부딪히세요.",
    "prevContext": [
      "I usually try to avoid brick walls rather than throw myself into them.",
      "Just answer the question.",
      "I’ve never thrown myself into a brick wall."
    ],
    "nextContext": [
      "Are you sure this is necessary?",
      "Yes.",
      "How should I do this?"
    ]
  },
  {
    "id": 41,
    "text": "Are you sure this is necessary?",
    "chunks": [
      "Are you sure",
      "this is necessary?"
    ],
    "translation": "이게 정말 꼭 필요한 건가요?",
    "prevContext": [
      "Just answer the question.",
      "I’ve never thrown myself into a brick wall.",
      "Crash into it."
    ],
    "nextContext": [
      "Yes.",
      "How should I do this?",
      "Crush down before you dive into it."
    ]
  },
  {
    "id": 42,
    "text": "Yes.",
    "chunks": [
      "Yes."
    ],
    "translation": "네.",
    "prevContext": [
      "I’ve never thrown myself into a brick wall.",
      "Crash into it.",
      "Are you sure this is necessary?"
    ],
    "nextContext": [
      "How should I do this?",
      "Crush down before you dive into it.",
      "I’m afraid."
    ]
  },
  {
    "id": 43,
    "text": "How should I do this?",
    "chunks": [
      "How should",
      "I do this?"
    ],
    "translation": "어떻게 해야 하죠?",
    "prevContext": [
      "Crash into it.",
      "Are you sure this is necessary?",
      "Yes."
    ],
    "nextContext": [
      "Crush down before you dive into it.",
      "I’m afraid.",
      "An actor should never be afraid."
    ]
  },
  {
    "id": 44,
    "text": "Crush down before you dive into it.",
    "chunks": [
      "Crush down before",
      "you dive into it."
    ],
    "translation": "다이빙하기 전에 몸을 웅크리세요.",
    "prevContext": [
      "Are you sure this is necessary?",
      "Yes.",
      "How should I do this?"
    ],
    "nextContext": [
      "I’m afraid.",
      "An actor should never be afraid.",
      "Go."
    ]
  },
  {
    "id": 45,
    "text": "I’m afraid.",
    "chunks": [
      "I’m afraid."
    ],
    "translation": "무서워요.",
    "prevContext": [
      "Yes.",
      "How should I do this?",
      "Crush down before you dive into it."
    ],
    "nextContext": [
      "An actor should never be afraid.",
      "Go.",
      "Ah~~~"
    ]
  },
  {
    "id": 46,
    "text": "An actor should never be afraid.",
    "chunks": [
      "An actor should",
      "never be afraid."
    ],
    "translation": "배우는 결코 두려워해선 안 됩니다.",
    "prevContext": [
      "How should I do this?",
      "Crush down before you dive into it.",
      "I’m afraid."
    ],
    "nextContext": [
      "Go.",
      "Ah~~~",
      "You didn’t break the wall."
    ]
  },
  {
    "id": 47,
    "text": "Go.",
    "chunks": [
      "Go."
    ],
    "translation": "출발.",
    "prevContext": [
      "Crush down before you dive into it.",
      "I’m afraid.",
      "An actor should never be afraid."
    ],
    "nextContext": [
      "Ah~~~",
      "You didn’t break the wall.",
      "You could’ve told me it was made of real bricks."
    ]
  },
  {
    "id": 48,
    "text": "Ah~~~",
    "chunks": [
      "Ah~~~"
    ],
    "translation": "아악~~~",
    "prevContext": [
      "I’m afraid.",
      "An actor should never be afraid.",
      "Go."
    ],
    "nextContext": [
      "You didn’t break the wall.",
      "You could’ve told me it was made of real bricks.",
      "Get up."
    ]
  },
  {
    "id": 49,
    "text": "You didn’t break the wall.",
    "chunks": [
      "You didn’t",
      "break the wall."
    ],
    "translation": "벽을 못 부쉈잖아요.",
    "prevContext": [
      "An actor should never be afraid.",
      "Go.",
      "Ah~~~"
    ],
    "nextContext": [
      "You could’ve told me it was made of real bricks.",
      "Get up.",
      "You need to attempt to do the next task."
    ]
  },
  {
    "id": 50,
    "text": "You could’ve told me it was made of real bricks.",
    "chunks": [
      "You could’ve told",
      "me it was",
      "made of real bricks."
    ],
    "translation": "진짜 벽돌로 만들었다고 진작 말해줬어야죠.",
    "prevContext": [
      "Go.",
      "Ah~~~",
      "You didn’t break the wall."
    ],
    "nextContext": [
      "Get up.",
      "You need to attempt to do the next task.",
      "Are you going to make me smash into the wall again?"
    ]
  },
  {
    "id": 51,
    "text": "Get up.",
    "chunks": [
      "Get up."
    ],
    "translation": "일어나세요.",
    "prevContext": [
      "Ah~~~",
      "You didn’t break the wall.",
      "You could’ve told me it was made of real bricks."
    ],
    "nextContext": [
      "You need to attempt to do the next task.",
      "Are you going to make me smash into the wall again?",
      "No."
    ]
  },
  {
    "id": 52,
    "text": "You need to attempt to do the next task.",
    "chunks": [
      "You need to",
      "attempt to do",
      "the next task."
    ],
    "translation": "다음 과제에 도전해야 합니다.",
    "prevContext": [
      "You didn’t break the wall.",
      "You could’ve told me it was made of real bricks.",
      "Get up."
    ],
    "nextContext": [
      "Are you going to make me smash into the wall again?",
      "No.",
      "That’s too advanced for you."
    ]
  },
  {
    "id": 53,
    "text": "Are you going to make me smash into the wall again?",
    "chunks": [
      "Are you going",
      "to make me",
      "smash into the wall again?"
    ],
    "translation": "저를 또 벽에 처박히게 만드실 건가요?",
    "prevContext": [
      "You could’ve told me it was made of real bricks.",
      "Get up.",
      "You need to attempt to do the next task."
    ],
    "nextContext": [
      "No.",
      "That’s too advanced for you.",
      "Instead, I want you to leap over it."
    ]
  },
  {
    "id": 54,
    "text": "No.",
    "chunks": [
      "No."
    ],
    "translation": "아닙니다.",
    "prevContext": [
      "Get up.",
      "You need to attempt to do the next task.",
      "Are you going to make me smash into the wall again?"
    ],
    "nextContext": [
      "That’s too advanced for you.",
      "Instead, I want you to leap over it.",
      "But then, the wall is too tall for me to leap over."
    ]
  },
  {
    "id": 55,
    "text": "That’s too advanced for you.",
    "chunks": [
      "That’s too",
      "advanced for you."
    ],
    "translation": "그건 당신에겐 너무 고급 기술이네요.",
    "prevContext": [
      "You need to attempt to do the next task.",
      "Are you going to make me smash into the wall again?",
      "No."
    ],
    "nextContext": [
      "Instead, I want you to leap over it.",
      "But then, the wall is too tall for me to leap over.",
      "You should probably jump high then."
    ]
  },
  {
    "id": 56,
    "text": "Instead, I want you to leap over it.",
    "chunks": [
      "Instead, I want you",
      "to leap over it."
    ],
    "translation": "대신, 벽을 뛰어넘어 보세요.",
    "prevContext": [
      "Are you going to make me smash into the wall again?",
      "No.",
      "That’s too advanced for you."
    ],
    "nextContext": [
      "But then, the wall is too tall for me to leap over.",
      "You should probably jump high then.",
      "You want to be a big star, aren’t you?"
    ]
  },
  {
    "id": 57,
    "text": "But then, the wall is too tall for me to leap over.",
    "chunks": [
      "But then, the wall",
      "is too tall for",
      "me to leap over."
    ],
    "translation": "하지만 그러기엔 제가 뛰어넘기에 벽이 너무 높은데요.",
    "prevContext": [
      "No.",
      "That’s too advanced for you.",
      "Instead, I want you to leap over it."
    ],
    "nextContext": [
      "You should probably jump high then.",
      "You want to be a big star, aren’t you?",
      "I want that more than anything in the world."
    ]
  },
  {
    "id": 58,
    "text": "You should probably jump high then.",
    "chunks": [
      "You should probably",
      "jump high then."
    ],
    "translation": "그럼 높이 뛰셔야겠네요.",
    "prevContext": [
      "That’s too advanced for you.",
      "Instead, I want you to leap over it.",
      "But then, the wall is too tall for me to leap over."
    ],
    "nextContext": [
      "You want to be a big star, aren’t you?",
      "I want that more than anything in the world.",
      "Then you know what to do."
    ]
  },
  {
    "id": 59,
    "text": "You want to be a big star, aren’t you?",
    "chunks": [
      "You want to",
      "be a big",
      "star, aren’t you?"
    ],
    "translation": "대스타가 되고 싶지 않으세요?",
    "prevContext": [
      "Instead, I want you to leap over it.",
      "But then, the wall is too tall for me to leap over.",
      "You should probably jump high then."
    ],
    "nextContext": [
      "I want that more than anything in the world.",
      "Then you know what to do.",
      "Spin around."
    ]
  },
  {
    "id": 60,
    "text": "I want that more than anything in the world.",
    "chunks": [
      "I want that",
      "more than anything",
      "in the world."
    ],
    "translation": "세상 그 어떤 것보다 간절히 원합니다.",
    "prevContext": [
      "But then, the wall is too tall for me to leap over.",
      "You should probably jump high then.",
      "You want to be a big star, aren’t you?"
    ],
    "nextContext": [
      "Then you know what to do.",
      "Spin around.",
      "Dash toward the wall, then leap over it."
    ]
  },
  {
    "id": 61,
    "text": "Then you know what to do.",
    "chunks": [
      "Then you know",
      "what to do."
    ],
    "translation": "그럼 뭘 해야 할지 아시겠네요.",
    "prevContext": [
      "You should probably jump high then.",
      "You want to be a big star, aren’t you?",
      "I want that more than anything in the world."
    ],
    "nextContext": [
      "Spin around.",
      "Dash toward the wall, then leap over it.",
      "Woo."
    ]
  },
  {
    "id": 62,
    "text": "Spin around.",
    "chunks": [
      "Spin around."
    ],
    "translation": "몸을 돌리세요.",
    "prevContext": [
      "You want to be a big star, aren’t you?",
      "I want that more than anything in the world.",
      "Then you know what to do."
    ],
    "nextContext": [
      "Dash toward the wall, then leap over it.",
      "Woo.",
      "I didn’t want you to smash into it."
    ]
  },
  {
    "id": 63,
    "text": "Dash toward the wall, then leap over it.",
    "chunks": [
      "Dash toward the wall,",
      "then leap over it."
    ],
    "translation": "벽을 향해 질주한 다음 뛰어넘으세요.",
    "prevContext": [
      "I want that more than anything in the world.",
      "Then you know what to do.",
      "Spin around."
    ],
    "nextContext": [
      "Woo.",
      "I didn’t want you to smash into it.",
      "You should’ve jumped before you got to the wall."
    ]
  },
  {
    "id": 64,
    "text": "Woo.",
    "chunks": [
      "Woo."
    ],
    "translation": "우와.",
    "prevContext": [
      "Then you know what to do.",
      "Spin around.",
      "Dash toward the wall, then leap over it."
    ],
    "nextContext": [
      "I didn’t want you to smash into it.",
      "You should’ve jumped before you got to the wall.",
      "You could’ve told me that before."
    ]
  },
  {
    "id": 65,
    "text": "I didn’t want you to smash into it.",
    "chunks": [
      "I didn’t want you",
      "to smash into it."
    ],
    "translation": "벽에 처박히길 바란 게 아니었는데요.",
    "prevContext": [
      "Spin around.",
      "Dash toward the wall, then leap over it.",
      "Woo."
    ],
    "nextContext": [
      "You should’ve jumped before you got to the wall.",
      "You could’ve told me that before.",
      "I’ll show you. Hurl this brick at my head."
    ]
  },
  {
    "id": 66,
    "text": "You should’ve jumped before you got to the wall.",
    "chunks": [
      "You should’ve jumped",
      "before you got",
      "to the wall."
    ],
    "translation": "벽에 도달하기 전에 점프를 했어야죠.",
    "prevContext": [
      "Dash toward the wall, then leap over it.",
      "Woo.",
      "I didn’t want you to smash into it."
    ],
    "nextContext": [
      "You could’ve told me that before.",
      "I’ll show you. Hurl this brick at my head.",
      "Okay."
    ]
  },
  {
    "id": 67,
    "text": "You could’ve told me that before.",
    "chunks": [
      "You could’ve told",
      "me that before."
    ],
    "translation": "그 말을 진작에 해주셨어야죠.",
    "prevContext": [
      "Woo.",
      "I didn’t want you to smash into it.",
      "You should’ve jumped before you got to the wall."
    ],
    "nextContext": [
      "I’ll show you. Hurl this brick at my head.",
      "Okay.",
      "I’m going to hurl this brick at you as hard  as  I can."
    ]
  },
  {
    "id": 68,
    "text": "I’ll show you. Hurl this brick at my head.",
    "chunks": [
      "I’ll show you.",
      "Hurl this brick",
      "at my head."
    ],
    "translation": "시범을 보여드리죠. 이 벽돌을 제 머리에 던지세요.",
    "prevContext": [
      "I didn’t want you to smash into it.",
      "You should’ve jumped before you got to the wall.",
      "You could’ve told me that before."
    ],
    "nextContext": [
      "Okay.",
      "I’m going to hurl this brick at you as hard  as  I can.",
      "What? Why would you do that?"
    ]
  },
  {
    "id": 69,
    "text": "Okay.",
    "chunks": [
      "Okay."
    ],
    "translation": "알겠습니다.",
    "prevContext": [
      "You should’ve jumped before you got to the wall.",
      "You could’ve told me that before.",
      "I’ll show you. Hurl this brick at my head."
    ],
    "nextContext": [
      "I’m going to hurl this brick at you as hard  as  I can.",
      "What? Why would you do that?",
      "You need to catch the brick before it hits you."
    ]
  },
  {
    "id": 70,
    "text": "I’m going to hurl this brick at you as hard  as  I can.",
    "chunks": [
      "I’m going to hurl",
      "this brick at you",
      "as hard as I can."
    ],
    "translation": "힘껏 벽돌을 던질 겁니다.",
    "prevContext": [
      "You could’ve told me that before.",
      "I’ll show you. Hurl this brick at my head.",
      "Okay."
    ],
    "nextContext": [
      "What? Why would you do that?",
      "You need to catch the brick before it hits you.",
      "Don’t dive out of the way."
    ]
  },
  {
    "id": 71,
    "text": "What? Why would you do that?",
    "chunks": [
      "What? Why would",
      "you do that?"
    ],
    "translation": "네? 왜 그렇게 하시는 건데요?",
    "prevContext": [
      "I’ll show you. Hurl this brick at my head.",
      "Okay.",
      "I’m going to hurl this brick at you as hard  as  I can."
    ],
    "nextContext": [
      "You need to catch the brick before it hits you.",
      "Don’t dive out of the way.",
      "Don’t crouch."
    ]
  },
  {
    "id": 72,
    "text": "You need to catch the brick before it hits you.",
    "chunks": [
      "You need to",
      "catch the brick",
      "before it hits you."
    ],
    "translation": "벽돌에 맞기 전에 그걸 잡아야 합니다.",
    "prevContext": [
      "Okay.",
      "I’m going to hurl this brick at you as hard  as  I can.",
      "What? Why would you do that?"
    ],
    "nextContext": [
      "Don’t dive out of the way.",
      "Don’t crouch.",
      "Stand up straight."
    ]
  },
  {
    "id": 73,
    "text": "Don’t dive out of the way.",
    "chunks": [
      "Don’t dive out",
      "of the way."
    ],
    "translation": "피하려고 몸을 던지지 마세요.",
    "prevContext": [
      "I’m going to hurl this brick at you as hard  as  I can.",
      "What? Why would you do that?",
      "You need to catch the brick before it hits you."
    ],
    "nextContext": [
      "Don’t crouch.",
      "Stand up straight.",
      "Spin around."
    ]
  },
  {
    "id": 74,
    "text": "Don’t crouch.",
    "chunks": [
      "Don’t crouch."
    ],
    "translation": "웅크리지 마세요.",
    "prevContext": [
      "What? Why would you do that?",
      "You need to catch the brick before it hits you.",
      "Don’t dive out of the way."
    ],
    "nextContext": [
      "Stand up straight.",
      "Spin around.",
      "When I tell you, you’re going to spin around and catch the brick."
    ]
  },
  {
    "id": 75,
    "text": "Stand up straight.",
    "chunks": [
      "Stand up straight."
    ],
    "translation": "똑바로 서세요.",
    "prevContext": [
      "You need to catch the brick before it hits you.",
      "Don’t dive out of the way.",
      "Don’t crouch."
    ],
    "nextContext": [
      "Spin around.",
      "When I tell you, you’re going to spin around and catch the brick.",
      "Now get into position."
    ]
  },
  {
    "id": 76,
    "text": "Spin around.",
    "chunks": [
      "Spin around."
    ],
    "translation": "몸을 돌리세요.",
    "prevContext": [
      "Don’t dive out of the way.",
      "Don’t crouch.",
      "Stand up straight."
    ],
    "nextContext": [
      "When I tell you, you’re going to spin around and catch the brick.",
      "Now get into position.",
      "Are you ready?"
    ]
  },
  {
    "id": 77,
    "text": "When I tell you, you’re going to spin around and catch the brick.",
    "chunks": [
      "When I tell you,",
      "you’re going to spin",
      "around and catch the brick."
    ],
    "translation": "제가 신호를 주면 돌아서서 벽돌을 잡는 겁니다.",
    "prevContext": [
      "Don’t crouch.",
      "Stand up straight.",
      "Spin around."
    ],
    "nextContext": [
      "Now get into position.",
      "Are you ready?",
      "Okay."
    ]
  },
  {
    "id": 78,
    "text": "Now get into position.",
    "chunks": [
      "Now get into position."
    ],
    "translation": "이제 자세를 잡으세요.",
    "prevContext": [
      "Stand up straight.",
      "Spin around.",
      "When I tell you, you’re going to spin around and catch the brick."
    ],
    "nextContext": [
      "Are you ready?",
      "Okay.",
      "Oh!"
    ]
  },
  {
    "id": 79,
    "text": "Are you ready?",
    "chunks": [
      "Are you ready?"
    ],
    "translation": "준비되셨나요?",
    "prevContext": [
      "Spin around.",
      "When I tell you, you’re going to spin around and catch the brick.",
      "Now get into position."
    ],
    "nextContext": [
      "Okay.",
      "Oh!",
      "You should’ve told me you were going to hurl it."
    ]
  },
  {
    "id": 80,
    "text": "Okay.",
    "chunks": [
      "Okay."
    ],
    "translation": "알겠습니다.",
    "prevContext": [
      "When I tell you, you’re going to spin around and catch the brick.",
      "Now get into position.",
      "Are you ready?"
    ],
    "nextContext": [
      "Oh!",
      "You should’ve told me you were going to hurl it.",
      "I did."
    ]
  },
  {
    "id": 81,
    "text": "Oh!",
    "chunks": [
      "Oh!"
    ],
    "translation": "어!",
    "prevContext": [
      "Now get into position.",
      "Are you ready?",
      "Okay."
    ],
    "nextContext": [
      "You should’ve told me you were going to hurl it.",
      "I did.",
      "The brick crushed into my head."
    ]
  },
  {
    "id": 82,
    "text": "You should’ve told me you were going to hurl it.",
    "chunks": [
      "You should’ve told",
      "me you were",
      "going to hurl it."
    ],
    "translation": "던질 거라고 미리 말을 해주셨어야죠.",
    "prevContext": [
      "Are you ready?",
      "Okay.",
      "Oh!"
    ],
    "nextContext": [
      "I did.",
      "The brick crushed into my head.",
      "I can’t even walk."
    ]
  },
  {
    "id": 83,
    "text": "I did.",
    "chunks": [
      "I did."
    ],
    "translation": "말했잖아요.",
    "prevContext": [
      "Okay.",
      "Oh!",
      "You should’ve told me you were going to hurl it."
    ],
    "nextContext": [
      "The brick crushed into my head.",
      "I can’t even walk.",
      "I have to crawl back to the dressing room."
    ]
  },
  {
    "id": 84,
    "text": "The brick crushed into my head.",
    "chunks": [
      "The brick crushed",
      "into my head."
    ],
    "translation": "벽돌이 제 머리에 정통으로 부딪혔어요.",
    "prevContext": [
      "Oh!",
      "You should’ve told me you were going to hurl it.",
      "I did."
    ],
    "nextContext": [
      "I can’t even walk.",
      "I have to crawl back to the dressing room.",
      "I need to lie down."
    ]
  },
  {
    "id": 85,
    "text": "I can’t even walk.",
    "chunks": [
      "I can’t even walk."
    ],
    "translation": "걷지도 못하겠어요.",
    "prevContext": [
      "You should’ve told me you were going to hurl it.",
      "I did.",
      "The brick crushed into my head."
    ],
    "nextContext": [
      "I have to crawl back to the dressing room.",
      "I need to lie down.",
      "That was an awful lesson. You’re a terrible teacher."
    ]
  },
  {
    "id": 86,
    "text": "I have to crawl back to the dressing room.",
    "chunks": [
      "I have to",
      "crawl back to",
      "the dressing room."
    ],
    "translation": "분장실까지 기어서 돌아가야겠어요.",
    "prevContext": [
      "I did.",
      "The brick crushed into my head.",
      "I can’t even walk."
    ],
    "nextContext": [
      "I need to lie down.",
      "That was an awful lesson. You’re a terrible teacher.",
      "You’re welcome."
    ]
  },
  {
    "id": 87,
    "text": "I need to lie down.",
    "chunks": [
      "I need",
      "to lie down."
    ],
    "translation": "좀 누워야겠어요.",
    "prevContext": [
      "The brick crushed into my head.",
      "I can’t even walk.",
      "I have to crawl back to the dressing room."
    ],
    "nextContext": [
      "That was an awful lesson. You’re a terrible teacher.",
      "You’re welcome.",
      "Hey Benny. What are you doing here?"
    ]
  },
  {
    "id": 88,
    "text": "That was an awful lesson. You’re a terrible teacher.",
    "chunks": [
      "That was an",
      "awful lesson. You’re",
      "a terrible teacher."
    ],
    "translation": "최악의 수업이었어요. 당신은 엉터리 선생입니다.",
    "prevContext": [
      "I can’t even walk.",
      "I have to crawl back to the dressing room.",
      "I need to lie down."
    ],
    "nextContext": [
      "You’re welcome.",
      "Hey Benny. What are you doing here?",
      "I came to say hello during your first day on set."
    ]
  },
  {
    "id": 89,
    "text": "You’re welcome.",
    "chunks": [
      "You’re welcome."
    ],
    "translation": "별말씀을요.",
    "prevContext": [
      "I have to crawl back to the dressing room.",
      "I need to lie down.",
      "That was an awful lesson. You’re a terrible teacher."
    ],
    "nextContext": [
      "Hey Benny. What are you doing here?",
      "I came to say hello during your first day on set.",
      "What happened to you mate?"
    ]
  },
  {
    "id": 90,
    "text": "Hey Benny. What are you doing here?",
    "chunks": [
      "Hey Benny. What",
      "are you doing here?"
    ],
    "translation": "안녕 베니. 여기서 뭐 해?",
    "prevContext": [
      "I need to lie down.",
      "That was an awful lesson. You’re a terrible teacher.",
      "You’re welcome."
    ],
    "nextContext": [
      "I came to say hello during your first day on set.",
      "What happened to you mate?",
      "Why are you crawling?"
    ]
  },
  {
    "id": 91,
    "text": "I came to say hello during your first day on set.",
    "chunks": [
      "I came to",
      "say hello during",
      "your first day on set."
    ],
    "translation": "세트장 첫날이라 인사하러 왔지.",
    "prevContext": [
      "That was an awful lesson. You’re a terrible teacher.",
      "You’re welcome.",
      "Hey Benny. What are you doing here?"
    ],
    "nextContext": [
      "What happened to you mate?",
      "Why are you crawling?",
      "You look like you smashed into a brick wall."
    ]
  },
  {
    "id": 92,
    "text": "What happened to you mate?",
    "chunks": [
      "What happened",
      "to you mate?"
    ],
    "translation": "친구, 무슨 일 있었어?",
    "prevContext": [
      "You’re welcome.",
      "Hey Benny. What are you doing here?",
      "I came to say hello during your first day on set."
    ],
    "nextContext": [
      "Why are you crawling?",
      "You look like you smashed into a brick wall.",
      "I didn’t smash into a brick wall."
    ]
  },
  {
    "id": 93,
    "text": "Why are you crawling?",
    "chunks": [
      "Why are you crawling?"
    ],
    "translation": "왜 기어가고 있어?",
    "prevContext": [
      "Hey Benny. What are you doing here?",
      "I came to say hello during your first day on set.",
      "What happened to you mate?"
    ],
    "nextContext": [
      "You look like you smashed into a brick wall.",
      "I didn’t smash into a brick wall.",
      "Wow. You are a very committed actor."
    ]
  },
  {
    "id": 94,
    "text": "You look like you smashed into a brick wall.",
    "chunks": [
      "You look like",
      "you smashed into",
      "a brick wall."
    ],
    "translation": "벽돌 벽에 들이받은 사람처럼 보이는데.",
    "prevContext": [
      "I came to say hello during your first day on set.",
      "What happened to you mate?",
      "Why are you crawling?"
    ],
    "nextContext": [
      "I didn’t smash into a brick wall.",
      "Wow. You are a very committed actor.",
      "Carla Peterson doesn’t just double for famous actresses. She does stunts for actresses in movies. For example, if a lead actress is riding a motorcycle in a chase scene, Carla rides the motorcycle for the actress. If the actress has to jump over fire or crash through a wall, Carla does it instead."
    ]
  },
  {
    "id": 95,
    "text": "I didn’t smash into a brick wall.",
    "chunks": [
      "I didn’t smash",
      "into a brick wall."
    ],
    "translation": "벽돌 벽에 들이받은 게 아니야.",
    "prevContext": [
      "What happened to you mate?",
      "Why are you crawling?",
      "You look like you smashed into a brick wall."
    ],
    "nextContext": [
      "Wow. You are a very committed actor.",
      "Carla Peterson doesn’t just double for famous actresses. She does stunts for actresses in movies. For example, if a lead actress is riding a motorcycle in a chase scene, Carla rides the motorcycle for the actress. If the actress has to jump over fire or crash through a wall, Carla does it instead.",
      "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses. She loves her job and can’t imagine doing anything else."
    ]
  },
  {
    "id": 96,
    "text": "Wow. You are a very committed actor.",
    "chunks": [
      "Wow. You are",
      "a very committed actor."
    ],
    "translation": "와. 너 정말 열정적인 배우구나.",
    "prevContext": [
      "Why are you crawling?",
      "You look like you smashed into a brick wall.",
      "I didn’t smash into a brick wall."
    ],
    "nextContext": [
      "Carla Peterson doesn’t just double for famous actresses. She does stunts for actresses in movies. For example, if a lead actress is riding a motorcycle in a chase scene, Carla rides the motorcycle for the actress. If the actress has to jump over fire or crash through a wall, Carla does it instead.",
      "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses. She loves her job and can’t imagine doing anything else.",
      "How did she become interested in this career? In a very unusual way. Read her story."
    ]
  },
  {
    "id": 97,
    "text": "Carla Peterson doesn’t just double for famous actresses. She does stunts for actresses in movies. For example, if a lead actress is riding a motorcycle in a chase scene, Carla rides the motorcycle for the actress. If the actress has to jump over fire or crash through a wall, Carla does it instead.",
    "chunks": [
      "Carla Peterson doesn’t just double for famous actresses. She does stunts for actresses",
      "in movies. For example, if a lead actress is riding a motorcycle in",
      "a chase scene, Carla rides the motorcycle for the actress. If the actress",
      "has to jump over fire or crash through a wall, Carla does it instead."
    ],
    "translation": "카를라 피터슨은 유명 여배우의 대역에 그치지 않고, 영화 속 고난도 스턴트를 직접 연기합니다.",
    "prevContext": [
      "You look like you smashed into a brick wall.",
      "I didn’t smash into a brick wall.",
      "Wow. You are a very committed actor."
    ],
    "nextContext": [
      "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses. She loves her job and can’t imagine doing anything else.",
      "How did she become interested in this career? In a very unusual way. Read her story.",
      "About three years ago, I went on a weekend trip. When I got back, I realized that I was locked out of my apartment. I should have left a key with my parents or a friend. I had no way of getting into my place."
    ]
  },
  {
    "id": 98,
    "text": "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses. She loves her job and can’t imagine doing anything else.",
    "chunks": [
      "She wears many wigs, costumes, and",
      "a lot of makeup to look",
      "like different famous actresses. She loves",
      "her job and can’t imagine doing anything else."
    ],
    "translation": "그녀는 여배우와 똑같아 보이도록 가발과 분장을 하고, 자신의 일을 누구보다 사랑합니다.",
    "prevContext": [
      "I didn’t smash into a brick wall.",
      "Wow. You are a very committed actor.",
      "Carla Peterson doesn’t just double for famous actresses. She does stunts for actresses in movies. For example, if a lead actress is riding a motorcycle in a chase scene, Carla rides the motorcycle for the actress. If the actress has to jump over fire or crash through a wall, Carla does it instead."
    ],
    "nextContext": [
      "How did she become interested in this career? In a very unusual way. Read her story.",
      "About three years ago, I went on a weekend trip. When I got back, I realized that I was locked out of my apartment. I should have left a key with my parents or a friend. I had no way of getting into my place.",
      "It was Sunday, and the locksmiths in my area were closed. I was desperate to get into my apartment because I had a big deadline on Monday and my computer was inside. I could have taken the computer with me, but I wanted to get away without work."
    ]
  },
  {
    "id": 99,
    "text": "How did she become interested in this career? In a very unusual way. Read her story.",
    "chunks": [
      "How did she become",
      "interested in this career?",
      "In a very unusual",
      "way. Read her story."
    ],
    "translation": "그녀는 어떻게 이 직업에 관심을 갖게 되었을까요? 매우 독특한 계기였습니다.",
    "prevContext": [
      "Wow. You are a very committed actor.",
      "Carla Peterson doesn’t just double for famous actresses. She does stunts for actresses in movies. For example, if a lead actress is riding a motorcycle in a chase scene, Carla rides the motorcycle for the actress. If the actress has to jump over fire or crash through a wall, Carla does it instead.",
      "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses. She loves her job and can’t imagine doing anything else."
    ],
    "nextContext": [
      "About three years ago, I went on a weekend trip. When I got back, I realized that I was locked out of my apartment. I should have left a key with my parents or a friend. I had no way of getting into my place.",
      "It was Sunday, and the locksmiths in my area were closed. I was desperate to get into my apartment because I had a big deadline on Monday and my computer was inside. I could have taken the computer with me, but I wanted to get away without work.",
      "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help. He suggested I smash open the front door, but I didn’t want to break it. Then I realized that I had left the back window open."
    ]
  },
  {
    "id": 100,
    "text": "About three years ago, I went on a weekend trip. When I got back, I realized that I was locked out of my apartment. I should have left a key with my parents or a friend. I had no way of getting into my place.",
    "chunks": [
      "About three years ago, I went on a weekend trip. When",
      "I got back, I realized that I was locked out of",
      "my apartment. I should have left a key with my parents",
      "or a friend. I had no way of getting into my place."
    ],
    "translation": "약 3년 전 주말여행 후 돌아왔을 때 열쇠가 없어 집에 들어갈 수 없었습니다.",
    "prevContext": [
      "Carla Peterson doesn’t just double for famous actresses. She does stunts for actresses in movies. For example, if a lead actress is riding a motorcycle in a chase scene, Carla rides the motorcycle for the actress. If the actress has to jump over fire or crash through a wall, Carla does it instead.",
      "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses. She loves her job and can’t imagine doing anything else.",
      "How did she become interested in this career? In a very unusual way. Read her story."
    ],
    "nextContext": [
      "It was Sunday, and the locksmiths in my area were closed. I was desperate to get into my apartment because I had a big deadline on Monday and my computer was inside. I could have taken the computer with me, but I wanted to get away without work.",
      "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help. He suggested I smash open the front door, but I didn’t want to break it. Then I realized that I had left the back window open.",
      "My apartment was on the top floor next to my neighbor’s apartment. The roof on our building was flat. My neighbor and I came up with a crazy idea."
    ]
  },
  {
    "id": 101,
    "text": "It was Sunday, and the locksmiths in my area were closed. I was desperate to get into my apartment because I had a big deadline on Monday and my computer was inside. I could have taken the computer with me, but I wanted to get away without work.",
    "chunks": [
      "It was Sunday, and the locksmiths in my area were closed. I",
      "was desperate to get into my apartment because I had a big",
      "deadline on Monday and my computer was inside. I could have taken",
      "the computer with me, but I wanted to get away without work."
    ],
    "translation": "일요일이라 열쇠 가게도 문을 닫았고, 월요일 마감 때문에 컴퓨터가 절실했습니다.",
    "prevContext": [
      "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses. She loves her job and can’t imagine doing anything else.",
      "How did she become interested in this career? In a very unusual way. Read her story.",
      "About three years ago, I went on a weekend trip. When I got back, I realized that I was locked out of my apartment. I should have left a key with my parents or a friend. I had no way of getting into my place."
    ],
    "nextContext": [
      "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help. He suggested I smash open the front door, but I didn’t want to break it. Then I realized that I had left the back window open.",
      "My apartment was on the top floor next to my neighbor’s apartment. The roof on our building was flat. My neighbor and I came up with a crazy idea.",
      "A few minutes later, I was standing on the ledge of his open window with a rope tied around me. My neighbor was standing on the flat rooftop holding the other end of the rope."
    ]
  },
  {
    "id": 102,
    "text": "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help. He suggested I smash open the front door, but I didn’t want to break it. Then I realized that I had left the back window open.",
    "chunks": [
      "When I realized that I didn’t have my key, I",
      "knocked on my neighbor’s door for help. He suggested I",
      "smash open the front door, but I didn’t want to",
      "break it. Then I realized that I had left the back window open."
    ],
    "translation": "이웃에게 도움을 청했고, 뒷창문이 열려 있다는 사실이 떠올랐습니다.",
    "prevContext": [
      "How did she become interested in this career? In a very unusual way. Read her story.",
      "About three years ago, I went on a weekend trip. When I got back, I realized that I was locked out of my apartment. I should have left a key with my parents or a friend. I had no way of getting into my place.",
      "It was Sunday, and the locksmiths in my area were closed. I was desperate to get into my apartment because I had a big deadline on Monday and my computer was inside. I could have taken the computer with me, but I wanted to get away without work."
    ],
    "nextContext": [
      "My apartment was on the top floor next to my neighbor’s apartment. The roof on our building was flat. My neighbor and I came up with a crazy idea.",
      "A few minutes later, I was standing on the ledge of his open window with a rope tied around me. My neighbor was standing on the flat rooftop holding the other end of the rope.",
      "He counted to three: “One, two, three, go!”"
    ]
  },
  {
    "id": 103,
    "text": "My apartment was on the top floor next to my neighbor’s apartment. The roof on our building was flat. My neighbor and I came up with a crazy idea.",
    "chunks": [
      "My apartment was on the top floor",
      "next to my neighbor’s apartment. The roof",
      "on our building was flat. My neighbor",
      "and I came up with a crazy idea."
    ],
    "translation": "건물 옥상이 평평해서 이웃과 함께 기상천외한 아이디어를 냈습니다.",
    "prevContext": [
      "About three years ago, I went on a weekend trip. When I got back, I realized that I was locked out of my apartment. I should have left a key with my parents or a friend. I had no way of getting into my place.",
      "It was Sunday, and the locksmiths in my area were closed. I was desperate to get into my apartment because I had a big deadline on Monday and my computer was inside. I could have taken the computer with me, but I wanted to get away without work.",
      "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help. He suggested I smash open the front door, but I didn’t want to break it. Then I realized that I had left the back window open."
    ],
    "nextContext": [
      "A few minutes later, I was standing on the ledge of his open window with a rope tied around me. My neighbor was standing on the flat rooftop holding the other end of the rope.",
      "He counted to three: “One, two, three, go!”",
      "I threw myself off the ledge while he held the rope tightly. I swung in the air toward my window ledge. I was afraid I was going to crash into the brick wall of the building. Instead, I managed to land on my window ledge. My neighbor let go of the rope, and I quickly jumped through the open window and into my apartment."
    ]
  },
  {
    "id": 104,
    "text": "A few minutes later, I was standing on the ledge of his open window with a rope tied around me. My neighbor was standing on the flat rooftop holding the other end of the rope.",
    "chunks": [
      "A few minutes later, I was standing on",
      "the ledge of his open window with a",
      "rope tied around me. My neighbor was standing",
      "on the flat rooftop holding the other end of the rope."
    ],
    "translation": "몸에 밧줄을 묶고 창문 난간에 섰고, 이웃은 옥상에서 밧줄을 잡았습니다.",
    "prevContext": [
      "It was Sunday, and the locksmiths in my area were closed. I was desperate to get into my apartment because I had a big deadline on Monday and my computer was inside. I could have taken the computer with me, but I wanted to get away without work.",
      "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help. He suggested I smash open the front door, but I didn’t want to break it. Then I realized that I had left the back window open.",
      "My apartment was on the top floor next to my neighbor’s apartment. The roof on our building was flat. My neighbor and I came up with a crazy idea."
    ],
    "nextContext": [
      "He counted to three: “One, two, three, go!”",
      "I threw myself off the ledge while he held the rope tightly. I swung in the air toward my window ledge. I was afraid I was going to crash into the brick wall of the building. Instead, I managed to land on my window ledge. My neighbor let go of the rope, and I quickly jumped through the open window and into my apartment.",
      "I could have felt scared, but I felt incredible. It was so exciting. I did it. I really did it!"
    ]
  },
  {
    "id": 105,
    "text": "He counted to three: “One, two, three, go!”",
    "chunks": [
      "He counted to three:",
      "“One, two, three, go!”"
    ],
    "translation": "이웃이 셋을 셌습니다: '하나, 둘, 셋, 출발!'",
    "prevContext": [
      "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help. He suggested I smash open the front door, but I didn’t want to break it. Then I realized that I had left the back window open.",
      "My apartment was on the top floor next to my neighbor’s apartment. The roof on our building was flat. My neighbor and I came up with a crazy idea.",
      "A few minutes later, I was standing on the ledge of his open window with a rope tied around me. My neighbor was standing on the flat rooftop holding the other end of the rope."
    ],
    "nextContext": [
      "I threw myself off the ledge while he held the rope tightly. I swung in the air toward my window ledge. I was afraid I was going to crash into the brick wall of the building. Instead, I managed to land on my window ledge. My neighbor let go of the rope, and I quickly jumped through the open window and into my apartment.",
      "I could have felt scared, but I felt incredible. It was so exciting. I did it. I really did it!",
      "A minute later, my neighbor knocked on my door until I let him in. He said, “That was amazing. You should be a stunt person.”"
    ]
  },
  {
    "id": 106,
    "text": "I threw myself off the ledge while he held the rope tightly. I swung in the air toward my window ledge. I was afraid I was going to crash into the brick wall of the building. Instead, I managed to land on my window ledge. My neighbor let go of the rope, and I quickly jumped through the open window and into my apartment.",
    "chunks": [
      "I threw myself off the ledge while he held the rope tightly. I swung in the",
      "air toward my window ledge. I was afraid I was going to crash into the brick",
      "wall of the building. Instead, I managed to land on my window ledge. My neighbor let",
      "go of the rope, and I quickly jumped through the open window and into my apartment."
    ],
    "translation": "밧줄에 의지해 공중을 날아 마침내 제 창문 난간에 안전하게 착지했습니다.",
    "prevContext": [
      "My apartment was on the top floor next to my neighbor’s apartment. The roof on our building was flat. My neighbor and I came up with a crazy idea.",
      "A few minutes later, I was standing on the ledge of his open window with a rope tied around me. My neighbor was standing on the flat rooftop holding the other end of the rope.",
      "He counted to three: “One, two, three, go!”"
    ],
    "nextContext": [
      "I could have felt scared, but I felt incredible. It was so exciting. I did it. I really did it!",
      "A minute later, my neighbor knocked on my door until I let him in. He said, “That was amazing. You should be a stunt person.”",
      "It got me thinking, and I thought that I might really enjoy a career doing stunts."
    ]
  },
  {
    "id": 107,
    "text": "I could have felt scared, but I felt incredible. It was so exciting. I did it. I really did it!",
    "chunks": [
      "I could have felt scared,",
      "but I felt incredible. It",
      "was so exciting. I did",
      "it. I really did it!"
    ],
    "translation": "무섭기보다는 짜릿하고 엄청난 성취감이 들었습니다. 내가 해냈어!",
    "prevContext": [
      "A few minutes later, I was standing on the ledge of his open window with a rope tied around me. My neighbor was standing on the flat rooftop holding the other end of the rope.",
      "He counted to three: “One, two, three, go!”",
      "I threw myself off the ledge while he held the rope tightly. I swung in the air toward my window ledge. I was afraid I was going to crash into the brick wall of the building. Instead, I managed to land on my window ledge. My neighbor let go of the rope, and I quickly jumped through the open window and into my apartment."
    ],
    "nextContext": [
      "A minute later, my neighbor knocked on my door until I let him in. He said, “That was amazing. You should be a stunt person.”",
      "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
      "The next year, I took gymnastics and martial arts classes. I worked hard to improve my skills."
    ]
  },
  {
    "id": 108,
    "text": "A minute later, my neighbor knocked on my door until I let him in. He said, “That was amazing. You should be a stunt person.”",
    "chunks": [
      "A minute later, my neighbor knocked",
      "on my door until I let",
      "him in. He said, “That was",
      "amazing. You should be a stunt person.”"
    ],
    "translation": "이웃이 들어와 외쳤습니다. '정말 대단했어. 넌 스턴트맨을 해야 해.'",
    "prevContext": [
      "He counted to three: “One, two, three, go!”",
      "I threw myself off the ledge while he held the rope tightly. I swung in the air toward my window ledge. I was afraid I was going to crash into the brick wall of the building. Instead, I managed to land on my window ledge. My neighbor let go of the rope, and I quickly jumped through the open window and into my apartment.",
      "I could have felt scared, but I felt incredible. It was so exciting. I did it. I really did it!"
    ],
    "nextContext": [
      "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
      "The next year, I took gymnastics and martial arts classes. I worked hard to improve my skills.",
      "Three years later, I became a Hollywood stunt double."
    ]
  },
  {
    "id": 109,
    "text": "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
    "chunks": [
      "It got me thinking,",
      "and I thought that",
      "I might really enjoy",
      "a career doing stunts."
    ],
    "translation": "그 말이 계기가 되어 스턴트 배우라는 직업에 진지하게 매료되었습니다.",
    "prevContext": [
      "I threw myself off the ledge while he held the rope tightly. I swung in the air toward my window ledge. I was afraid I was going to crash into the brick wall of the building. Instead, I managed to land on my window ledge. My neighbor let go of the rope, and I quickly jumped through the open window and into my apartment.",
      "I could have felt scared, but I felt incredible. It was so exciting. I did it. I really did it!",
      "A minute later, my neighbor knocked on my door until I let him in. He said, “That was amazing. You should be a stunt person.”"
    ],
    "nextContext": [
      "The next year, I took gymnastics and martial arts classes. I worked hard to improve my skills.",
      "Three years later, I became a Hollywood stunt double.",
      "Hi there Sofi, why are you washing dishes?"
    ]
  },
  {
    "id": 110,
    "text": "The next year, I took gymnastics and martial arts classes. I worked hard to improve my skills.",
    "chunks": [
      "The next year, I",
      "took gymnastics and martial",
      "arts classes. I worked",
      "hard to improve my skills."
    ],
    "translation": "그다음 해 체조와 무술 수업을 들으며 기량을 열심히 갈고닦았습니다.",
    "prevContext": [
      "I could have felt scared, but I felt incredible. It was so exciting. I did it. I really did it!",
      "A minute later, my neighbor knocked on my door until I let him in. He said, “That was amazing. You should be a stunt person.”",
      "It got me thinking, and I thought that I might really enjoy a career doing stunts."
    ],
    "nextContext": [
      "Three years later, I became a Hollywood stunt double.",
      "Hi there Sofi, why are you washing dishes?",
      "Nadi told me I have to."
    ]
  },
  {
    "id": 111,
    "text": "Three years later, I became a Hollywood stunt double.",
    "chunks": [
      "Three years later,",
      "I became a",
      "Hollywood stunt double."
    ],
    "translation": "3년 후, 저는 마침내 할리우드 스턴트 대역 배우가 되었습니다.",
    "prevContext": [
      "A minute later, my neighbor knocked on my door until I let him in. He said, “That was amazing. You should be a stunt person.”",
      "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
      "The next year, I took gymnastics and martial arts classes. I worked hard to improve my skills."
    ],
    "nextContext": [
      "Hi there Sofi, why are you washing dishes?",
      "Nadi told me I have to.",
      "And I told you that you don’t have to."
    ]
  },
  {
    "id": 112,
    "text": "Hi there Sofi, why are you washing dishes?",
    "chunks": [
      "Hi there Sofi,",
      "why are you washing dishes?"
    ],
    "translation": "안녕 소피, 왜 설거지를 하고 있어?",
    "prevContext": [
      "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
      "The next year, I took gymnastics and martial arts classes. I worked hard to improve my skills.",
      "Three years later, I became a Hollywood stunt double."
    ],
    "nextContext": [
      "Nadi told me I have to.",
      "And I told you that you don’t have to.",
      "Having cleaned up my area, I helped Nadi with the menu."
    ]
  },
  {
    "id": 113,
    "text": "Nadi told me I have to.",
    "chunks": [
      "Nadi told me",
      "I have to."
    ],
    "translation": "나디가 나한테 해야 한다고 해서.",
    "prevContext": [
      "The next year, I took gymnastics and martial arts classes. I worked hard to improve my skills.",
      "Three years later, I became a Hollywood stunt double.",
      "Hi there Sofi, why are you washing dishes?"
    ],
    "nextContext": [
      "And I told you that you don’t have to.",
      "Having cleaned up my area, I helped Nadi with the menu.",
      "Now I’m going to help you."
    ]
  },
  {
    "id": 114,
    "text": "And I told you that you don’t have to.",
    "chunks": [
      "And I told",
      "you that you",
      "don’t have to."
    ],
    "translation": "내가 그럴 필요 없다고 했잖아.",
    "prevContext": [
      "Three years later, I became a Hollywood stunt double.",
      "Hi there Sofi, why are you washing dishes?",
      "Nadi told me I have to."
    ],
    "nextContext": [
      "Having cleaned up my area, I helped Nadi with the menu.",
      "Now I’m going to help you.",
      "You don’t have to do that Renzo."
    ]
  },
  {
    "id": 115,
    "text": "Having cleaned up my area, I helped Nadi with the menu.",
    "chunks": [
      "Having cleaned up",
      "my area, I",
      "helped Nadi with the menu."
    ],
    "translation": "내 구역 청소를 끝내고 나디의 메뉴 정리를 도왔어.",
    "prevContext": [
      "Hi there Sofi, why are you washing dishes?",
      "Nadi told me I have to.",
      "And I told you that you don’t have to."
    ],
    "nextContext": [
      "Now I’m going to help you.",
      "You don’t have to do that Renzo.",
      "Let me help. I insist."
    ]
  },
  {
    "id": 116,
    "text": "Now I’m going to help you.",
    "chunks": [
      "Now I’m going",
      "to help you."
    ],
    "translation": "이제 너를 도와줄게.",
    "prevContext": [
      "Nadi told me I have to.",
      "And I told you that you don’t have to.",
      "Having cleaned up my area, I helped Nadi with the menu."
    ],
    "nextContext": [
      "You don’t have to do that Renzo.",
      "Let me help. I insist.",
      "Okay. Fine."
    ]
  },
  {
    "id": 117,
    "text": "You don’t have to do that Renzo.",
    "chunks": [
      "You don’t have",
      "to do that Renzo."
    ],
    "translation": "그럴 필요 없어, 렌조.",
    "prevContext": [
      "And I told you that you don’t have to.",
      "Having cleaned up my area, I helped Nadi with the menu.",
      "Now I’m going to help you."
    ],
    "nextContext": [
      "Let me help. I insist.",
      "Okay. Fine.",
      "Guess who was in the restaurant earlier."
    ]
  },
  {
    "id": 118,
    "text": "Let me help. I insist.",
    "chunks": [
      "Let me",
      "help. I insist."
    ],
    "translation": "도와주게 해줘. 내 고집이야.",
    "prevContext": [
      "Having cleaned up my area, I helped Nadi with the menu.",
      "Now I’m going to help you.",
      "You don’t have to do that Renzo."
    ],
    "nextContext": [
      "Okay. Fine.",
      "Guess who was in the restaurant earlier.",
      "Who?"
    ]
  },
  {
    "id": 119,
    "text": "Okay. Fine.",
    "chunks": [
      "Okay. Fine."
    ],
    "translation": "알겠어. 좋아.",
    "prevContext": [
      "Now I’m going to help you.",
      "You don’t have to do that Renzo.",
      "Let me help. I insist."
    ],
    "nextContext": [
      "Guess who was in the restaurant earlier.",
      "Who?",
      "The politician. Walking into the dining room I bumped into him."
    ]
  },
  {
    "id": 120,
    "text": "Guess who was in the restaurant earlier.",
    "chunks": [
      "Guess who was",
      "in the restaurant earlier."
    ],
    "translation": "아까 식당에 누가 왔었는지 알아?",
    "prevContext": [
      "You don’t have to do that Renzo.",
      "Let me help. I insist.",
      "Okay. Fine."
    ],
    "nextContext": [
      "Who?",
      "The politician. Walking into the dining room I bumped into him.",
      "But he was here yesterday."
    ]
  },
  {
    "id": 121,
    "text": "Who?",
    "chunks": [
      "Who?"
    ],
    "translation": "누구?",
    "prevContext": [
      "Let me help. I insist.",
      "Okay. Fine.",
      "Guess who was in the restaurant earlier."
    ],
    "nextContext": [
      "The politician. Walking into the dining room I bumped into him.",
      "But he was here yesterday.",
      "I know."
    ]
  },
  {
    "id": 122,
    "text": "The politician. Walking into the dining room I bumped into him.",
    "chunks": [
      "The politician. Walking",
      "into the dining",
      "room I bumped into him."
    ],
    "translation": "그 정치인 말이야. 다이닝 룸으로 들어가다 딱 마주쳤어.",
    "prevContext": [
      "Okay. Fine.",
      "Guess who was in the restaurant earlier.",
      "Who?"
    ],
    "nextContext": [
      "But he was here yesterday.",
      "I know.",
      "He loves this place."
    ]
  },
  {
    "id": 123,
    "text": "But he was here yesterday.",
    "chunks": [
      "But he",
      "was here yesterday."
    ],
    "translation": "하지만 어제도 왔었잖아.",
    "prevContext": [
      "Guess who was in the restaurant earlier.",
      "Who?",
      "The politician. Walking into the dining room I bumped into him."
    ],
    "nextContext": [
      "I know.",
      "He loves this place.",
      "Weren’t you supposed to leave earlier for some meeting?"
    ]
  },
  {
    "id": 124,
    "text": "I know.",
    "chunks": [
      "I know."
    ],
    "translation": "그러게 말이야.",
    "prevContext": [
      "Who?",
      "The politician. Walking into the dining room I bumped into him.",
      "But he was here yesterday."
    ],
    "nextContext": [
      "He loves this place.",
      "Weren’t you supposed to leave earlier for some meeting?",
      "They canceled it."
    ]
  },
  {
    "id": 125,
    "text": "He loves this place.",
    "chunks": [
      "He loves this place."
    ],
    "translation": "여길 정말 좋아하나 봐.",
    "prevContext": [
      "The politician. Walking into the dining room I bumped into him.",
      "But he was here yesterday.",
      "I know."
    ],
    "nextContext": [
      "Weren’t you supposed to leave earlier for some meeting?",
      "They canceled it.",
      "Watching you wash dishes, I realized I have to tell you something about Nadi."
    ]
  },
  {
    "id": 126,
    "text": "Weren’t you supposed to leave earlier for some meeting?",
    "chunks": [
      "Weren’t you supposed",
      "to leave earlier",
      "for some meeting?"
    ],
    "translation": "미팅 때문에 일찍 나가기로 하지 않았어?",
    "prevContext": [
      "But he was here yesterday.",
      "I know.",
      "He loves this place."
    ],
    "nextContext": [
      "They canceled it.",
      "Watching you wash dishes, I realized I have to tell you something about Nadi.",
      "What about her?"
    ]
  },
  {
    "id": 127,
    "text": "They canceled it.",
    "chunks": [
      "They canceled it."
    ],
    "translation": "취소됐어.",
    "prevContext": [
      "I know.",
      "He loves this place.",
      "Weren’t you supposed to leave earlier for some meeting?"
    ],
    "nextContext": [
      "Watching you wash dishes, I realized I have to tell you something about Nadi.",
      "What about her?",
      "Last week, Nadi was close to begging you to come back."
    ]
  },
  {
    "id": 128,
    "text": "Watching you wash dishes, I realized I have to tell you something about Nadi.",
    "chunks": [
      "Watching you wash",
      "dishes, I realized",
      "I have to",
      "tell you something about Nadi."
    ],
    "translation": "너 설거지하는 걸 보니 나디에 대해 해줄 말이 생각났어.",
    "prevContext": [
      "He loves this place.",
      "Weren’t you supposed to leave earlier for some meeting?",
      "They canceled it."
    ],
    "nextContext": [
      "What about her?",
      "Last week, Nadi was close to begging you to come back.",
      "I don’t believe you."
    ]
  },
  {
    "id": 129,
    "text": "What about her?",
    "chunks": [
      "What about her?"
    ],
    "translation": "나디가 왜?",
    "prevContext": [
      "Weren’t you supposed to leave earlier for some meeting?",
      "They canceled it.",
      "Watching you wash dishes, I realized I have to tell you something about Nadi."
    ],
    "nextContext": [
      "Last week, Nadi was close to begging you to come back.",
      "I don’t believe you.",
      "Seeing how bad business was after you left, now she realized how valuable you are to the restaurant."
    ]
  },
  {
    "id": 130,
    "text": "Last week, Nadi was close to begging you to come back.",
    "chunks": [
      "Last week, Nadi",
      "was close to",
      "begging you to come back."
    ],
    "translation": "지난주에 나디가 너한테 제발 돌아와 달라고 사정할 뻔했어.",
    "prevContext": [
      "They canceled it.",
      "Watching you wash dishes, I realized I have to tell you something about Nadi.",
      "What about her?"
    ],
    "nextContext": [
      "I don’t believe you.",
      "Seeing how bad business was after you left, now she realized how valuable you are to the restaurant.",
      "Really? How do you know that? Did she tell you?"
    ]
  },
  {
    "id": 131,
    "text": "I don’t believe you.",
    "chunks": [
      "I don’t believe you."
    ],
    "translation": "안 믿겨.",
    "prevContext": [
      "Watching you wash dishes, I realized I have to tell you something about Nadi.",
      "What about her?",
      "Last week, Nadi was close to begging you to come back."
    ],
    "nextContext": [
      "Seeing how bad business was after you left, now she realized how valuable you are to the restaurant.",
      "Really? How do you know that? Did she tell you?",
      "Working by the dining room, I overheard Nadi telling someone that."
    ]
  },
  {
    "id": 132,
    "text": "Seeing how bad business was after you left, now she realized how valuable you are to the restaurant.",
    "chunks": [
      "Seeing how bad business",
      "was after you left,",
      "now she realized how",
      "valuable you are to the restaurant."
    ],
    "translation": "네가 떠난 뒤 장사가 안되는 걸 보고 네가 얼마나 소중한지 깨달은 거지.",
    "prevContext": [
      "What about her?",
      "Last week, Nadi was close to begging you to come back.",
      "I don’t believe you."
    ],
    "nextContext": [
      "Really? How do you know that? Did she tell you?",
      "Working by the dining room, I overheard Nadi telling someone that.",
      "Wow."
    ]
  },
  {
    "id": 133,
    "text": "Really? How do you know that? Did she tell you?",
    "chunks": [
      "Really? How do",
      "you know that?",
      "Did she tell you?"
    ],
    "translation": "정말? 그걸 어떻게 알아? 나디가 너한테 말했어?",
    "prevContext": [
      "Last week, Nadi was close to begging you to come back.",
      "I don’t believe you.",
      "Seeing how bad business was after you left, now she realized how valuable you are to the restaurant."
    ],
    "nextContext": [
      "Working by the dining room, I overheard Nadi telling someone that.",
      "Wow.",
      "She was supposed to call you, but didn’t."
    ]
  },
  {
    "id": 134,
    "text": "Working by the dining room, I overheard Nadi telling someone that.",
    "chunks": [
      "Working by the",
      "dining room, I",
      "overheard Nadi telling someone that."
    ],
    "translation": "홀 쪽에서 일하다가 나디가 누군가에게 그렇게 말하는 걸 우연히 들었어.",
    "prevContext": [
      "I don’t believe you.",
      "Seeing how bad business was after you left, now she realized how valuable you are to the restaurant.",
      "Really? How do you know that? Did she tell you?"
    ],
    "nextContext": [
      "Wow.",
      "She was supposed to call you, but didn’t.",
      "I meant to talk to you before I begged for my job back."
    ]
  },
  {
    "id": 135,
    "text": "Wow.",
    "chunks": [
      "Wow."
    ],
    "translation": "와우.",
    "prevContext": [
      "Seeing how bad business was after you left, now she realized how valuable you are to the restaurant.",
      "Really? How do you know that? Did she tell you?",
      "Working by the dining room, I overheard Nadi telling someone that."
    ],
    "nextContext": [
      "She was supposed to call you, but didn’t.",
      "I meant to talk to you before I begged for my job back.",
      "That was a mistake. It doesn’t matter now."
    ]
  },
  {
    "id": 136,
    "text": "She was supposed to call you, but didn’t.",
    "chunks": [
      "She was supposed to call you,",
      "but didn’t."
    ],
    "translation": "너한테 전화하기로 되어 있었는데 안 했더라고.",
    "prevContext": [
      "Really? How do you know that? Did she tell you?",
      "Working by the dining room, I overheard Nadi telling someone that.",
      "Wow."
    ],
    "nextContext": [
      "I meant to talk to you before I begged for my job back.",
      "That was a mistake. It doesn’t matter now.",
      "I meant to tell you that, but I forgot."
    ]
  },
  {
    "id": 137,
    "text": "I meant to talk to you before I begged for my job back.",
    "chunks": [
      "I meant to talk",
      "to you before I",
      "begged for my job back."
    ],
    "translation": "다시 일하게 해달라고 부탁하기 전에 너랑 얘기했어야 했는데.",
    "prevContext": [
      "Working by the dining room, I overheard Nadi telling someone that.",
      "Wow.",
      "She was supposed to call you, but didn’t."
    ],
    "nextContext": [
      "That was a mistake. It doesn’t matter now.",
      "I meant to tell you that, but I forgot.",
      "And now I’m a dishwasher."
    ]
  },
  {
    "id": 138,
    "text": "That was a mistake. It doesn’t matter now.",
    "chunks": [
      "That was a mistake.",
      "It doesn’t matter now."
    ],
    "translation": "실수였어. 이제 상관없어.",
    "prevContext": [
      "Wow.",
      "She was supposed to call you, but didn’t.",
      "I meant to talk to you before I begged for my job back."
    ],
    "nextContext": [
      "I meant to tell you that, but I forgot.",
      "And now I’m a dishwasher.",
      "I’m sorry Sofi."
    ]
  },
  {
    "id": 139,
    "text": "I meant to tell you that, but I forgot.",
    "chunks": [
      "I meant to",
      "tell you that,",
      "but I forgot."
    ],
    "translation": "그 말 해주려 했는데 깜빡 잊었네.",
    "prevContext": [
      "She was supposed to call you, but didn’t.",
      "I meant to talk to you before I begged for my job back.",
      "That was a mistake. It doesn’t matter now."
    ],
    "nextContext": [
      "And now I’m a dishwasher.",
      "I’m sorry Sofi.",
      "If it makes you feel better, I want you to be the head chef for the kitchen."
    ]
  },
  {
    "id": 140,
    "text": "And now I’m a dishwasher.",
    "chunks": [
      "And now",
      "I’m a dishwasher."
    ],
    "translation": "그리고 지금 난 설거지 담당이지.",
    "prevContext": [
      "I meant to talk to you before I begged for my job back.",
      "That was a mistake. It doesn’t matter now.",
      "I meant to tell you that, but I forgot."
    ],
    "nextContext": [
      "I’m sorry Sofi.",
      "If it makes you feel better, I want you to be the head chef for the kitchen.",
      "Yeah, right."
    ]
  },
  {
    "id": 141,
    "text": "I’m sorry Sofi.",
    "chunks": [
      "I’m sorry Sofi."
    ],
    "translation": "미안해 소피.",
    "prevContext": [
      "That was a mistake. It doesn’t matter now.",
      "I meant to tell you that, but I forgot.",
      "And now I’m a dishwasher."
    ],
    "nextContext": [
      "If it makes you feel better, I want you to be the head chef for the kitchen.",
      "Yeah, right.",
      "I’m serious."
    ]
  },
  {
    "id": 142,
    "text": "If it makes you feel better, I want you to be the head chef for the kitchen.",
    "chunks": [
      "If it makes you",
      "feel better, I want",
      "you to be the",
      "head chef for the kitchen."
    ],
    "translation": "네 기분이 나아진다면, 네가 주방의 수석 셰프를 맡아줬으면 해.",
    "prevContext": [
      "I meant to tell you that, but I forgot.",
      "And now I’m a dishwasher.",
      "I’m sorry Sofi."
    ],
    "nextContext": [
      "Yeah, right.",
      "I’m serious.",
      "That’s sweet of you, Renzo. But it’s not possible."
    ]
  },
  {
    "id": 143,
    "text": "Yeah, right.",
    "chunks": [
      "Yeah, right."
    ],
    "translation": "참 나, 됐거든.",
    "prevContext": [
      "And now I’m a dishwasher.",
      "I’m sorry Sofi.",
      "If it makes you feel better, I want you to be the head chef for the kitchen."
    ],
    "nextContext": [
      "I’m serious.",
      "That’s sweet of you, Renzo. But it’s not possible.",
      "There’s only room for one head chef in this restaurant, and that’s you."
    ]
  },
  {
    "id": 144,
    "text": "I’m serious.",
    "chunks": [
      "I’m serious."
    ],
    "translation": "진심이야.",
    "prevContext": [
      "I’m sorry Sofi.",
      "If it makes you feel better, I want you to be the head chef for the kitchen.",
      "Yeah, right."
    ],
    "nextContext": [
      "That’s sweet of you, Renzo. But it’s not possible.",
      "There’s only room for one head chef in this restaurant, and that’s you.",
      "I know, I want to formally offer the position of head chef to you."
    ]
  },
  {
    "id": 145,
    "text": "That’s sweet of you, Renzo. But it’s not possible.",
    "chunks": [
      "That’s sweet of",
      "you, Renzo. But",
      "it’s not possible."
    ],
    "translation": "마음은 고마워 렌조. 하지만 그건 불가능해.",
    "prevContext": [
      "If it makes you feel better, I want you to be the head chef for the kitchen.",
      "Yeah, right.",
      "I’m serious."
    ],
    "nextContext": [
      "There’s only room for one head chef in this restaurant, and that’s you.",
      "I know, I want to formally offer the position of head chef to you.",
      "You’re crazy, Renzo. What will you do?"
    ]
  },
  {
    "id": 146,
    "text": "There’s only room for one head chef in this restaurant, and that’s you.",
    "chunks": [
      "There’s only room for",
      "one head chef in",
      "this restaurant, and that’s you."
    ],
    "translation": "이 식당의 수석 셰프 자리는 오직 하나고, 그건 바로 너야.",
    "prevContext": [
      "Yeah, right.",
      "I’m serious.",
      "That’s sweet of you, Renzo. But it’s not possible."
    ],
    "nextContext": [
      "I know, I want to formally offer the position of head chef to you.",
      "You’re crazy, Renzo. What will you do?",
      "I would be your sous chef. You’re more talented than I am."
    ]
  },
  {
    "id": 147,
    "text": "I know, I want to formally offer the position of head chef to you.",
    "chunks": [
      "I know, I",
      "want to formally",
      "offer the position",
      "of head chef to you."
    ],
    "translation": "알아, 그래서 정식으로 너한테 수석 셰프 자리를 넘겨주고 싶어.",
    "prevContext": [
      "I’m serious.",
      "That’s sweet of you, Renzo. But it’s not possible.",
      "There’s only room for one head chef in this restaurant, and that’s you."
    ],
    "nextContext": [
      "You’re crazy, Renzo. What will you do?",
      "I would be your sous chef. You’re more talented than I am.",
      "People only grow when they have someone great to learn from."
    ]
  },
  {
    "id": 148,
    "text": "You’re crazy, Renzo. What will you do?",
    "chunks": [
      "You’re crazy,",
      "Renzo. What will you do?"
    ],
    "translation": "미쳤어 렌조. 그럼 넌 어쩌려고?",
    "prevContext": [
      "That’s sweet of you, Renzo. But it’s not possible.",
      "There’s only room for one head chef in this restaurant, and that’s you.",
      "I know, I want to formally offer the position of head chef to you."
    ],
    "nextContext": [
      "I would be your sous chef. You’re more talented than I am.",
      "People only grow when they have someone great to learn from.",
      "You were meant to be a chef, not a dishwasher."
    ]
  },
  {
    "id": 149,
    "text": "I would be your sous chef. You’re more talented than I am.",
    "chunks": [
      "I would be your",
      "sous chef. You’re more",
      "talented than I am."
    ],
    "translation": "내가 네 부주방장 할게. 네가 나보다 훨씬 재능이 뛰어나니까.",
    "prevContext": [
      "There’s only room for one head chef in this restaurant, and that’s you.",
      "I know, I want to formally offer the position of head chef to you.",
      "You’re crazy, Renzo. What will you do?"
    ],
    "nextContext": [
      "People only grow when they have someone great to learn from.",
      "You were meant to be a chef, not a dishwasher.",
      "I don’t know what to say Renzo, thank you."
    ]
  },
  {
    "id": 150,
    "text": "People only grow when they have someone great to learn from.",
    "chunks": [
      "People only grow",
      "when they have",
      "someone great to learn from."
    ],
    "translation": "사람은 배울 만한 훌륭한 사람 곁에 있을 때 성장하는 법이야.",
    "prevContext": [
      "I know, I want to formally offer the position of head chef to you.",
      "You’re crazy, Renzo. What will you do?",
      "I would be your sous chef. You’re more talented than I am."
    ],
    "nextContext": [
      "You were meant to be a chef, not a dishwasher.",
      "I don’t know what to say Renzo, thank you.",
      "It means a lot, but do you really think Nadi would agree to this?"
    ]
  },
  {
    "id": 151,
    "text": "You were meant to be a chef, not a dishwasher.",
    "chunks": [
      "You were meant",
      "to be a",
      "chef, not a dishwasher."
    ],
    "translation": "너는 설거지꾼이 아니라 셰프가 될 운명이야.",
    "prevContext": [
      "You’re crazy, Renzo. What will you do?",
      "I would be your sous chef. You’re more talented than I am.",
      "People only grow when they have someone great to learn from."
    ],
    "nextContext": [
      "I don’t know what to say Renzo, thank you.",
      "It means a lot, but do you really think Nadi would agree to this?",
      "She has to, she doesn’t. I’ll quit."
    ]
  },
  {
    "id": 152,
    "text": "I don’t know what to say Renzo, thank you.",
    "chunks": [
      "I don’t know",
      "what to say",
      "Renzo, thank you."
    ],
    "translation": "무슨 말을 해야 할지 모르겠네 렌조, 고마워.",
    "prevContext": [
      "I would be your sous chef. You’re more talented than I am.",
      "People only grow when they have someone great to learn from.",
      "You were meant to be a chef, not a dishwasher."
    ],
    "nextContext": [
      "It means a lot, but do you really think Nadi would agree to this?",
      "She has to, she doesn’t. I’ll quit.",
      "Oh no. Don’t put your job on the line for me. That’s not necessary."
    ]
  },
  {
    "id": 153,
    "text": "It means a lot, but do you really think Nadi would agree to this?",
    "chunks": [
      "It means a",
      "lot, but do",
      "you really think",
      "Nadi would agree to this?"
    ],
    "translation": "정말 고맙지만, 나디가 이걸 동의할 거라 생각해?",
    "prevContext": [
      "People only grow when they have someone great to learn from.",
      "You were meant to be a chef, not a dishwasher.",
      "I don’t know what to say Renzo, thank you."
    ],
    "nextContext": [
      "She has to, she doesn’t. I’ll quit.",
      "Oh no. Don’t put your job on the line for me. That’s not necessary.",
      "I don’t understand. I thought  you would be excited by this opportunity."
    ]
  },
  {
    "id": 154,
    "text": "She has to, she doesn’t. I’ll quit.",
    "chunks": [
      "She has to,",
      "she doesn’t. I’ll quit."
    ],
    "translation": "동의해야지. 안 그러면 내가 그만둘 거야.",
    "prevContext": [
      "You were meant to be a chef, not a dishwasher.",
      "I don’t know what to say Renzo, thank you.",
      "It means a lot, but do you really think Nadi would agree to this?"
    ],
    "nextContext": [
      "Oh no. Don’t put your job on the line for me. That’s not necessary.",
      "I don’t understand. I thought  you would be excited by this opportunity.",
      "My offer was supposed to make you happy."
    ]
  },
  {
    "id": 155,
    "text": "Oh no. Don’t put your job on the line for me. That’s not necessary.",
    "chunks": [
      "Oh no. Don’t",
      "put your job",
      "on the line",
      "for me. That’s not necessary."
    ],
    "translation": "안 돼. 나 때문에 네 일자리를 걸지 마. 그럴 필요 없어.",
    "prevContext": [
      "I don’t know what to say Renzo, thank you.",
      "It means a lot, but do you really think Nadi would agree to this?",
      "She has to, she doesn’t. I’ll quit."
    ],
    "nextContext": [
      "I don’t understand. I thought  you would be excited by this opportunity.",
      "My offer was supposed to make you happy.",
      "Renzo, I want to open my own restaurant."
    ]
  },
  {
    "id": 156,
    "text": "I don’t understand. I thought  you would be excited by this opportunity.",
    "chunks": [
      "I don’t understand. I",
      "thought you would be",
      "excited by this opportunity."
    ],
    "translation": "이해가 안 가네. 네가 이 기회에 기뻐할 줄 알았는데.",
    "prevContext": [
      "It means a lot, but do you really think Nadi would agree to this?",
      "She has to, she doesn’t. I’ll quit.",
      "Oh no. Don’t put your job on the line for me. That’s not necessary."
    ],
    "nextContext": [
      "My offer was supposed to make you happy.",
      "Renzo, I want to open my own restaurant.",
      "I don’t really need to be the head chef anymore."
    ]
  },
  {
    "id": 157,
    "text": "My offer was supposed to make you happy.",
    "chunks": [
      "My offer was supposed",
      "to make you happy."
    ],
    "translation": "내 제안이 너를 기쁘게 할 줄 알았어.",
    "prevContext": [
      "She has to, she doesn’t. I’ll quit.",
      "Oh no. Don’t put your job on the line for me. That’s not necessary.",
      "I don’t understand. I thought  you would be excited by this opportunity."
    ],
    "nextContext": [
      "Renzo, I want to open my own restaurant.",
      "I don’t really need to be the head chef anymore.",
      "How are you going to do that?"
    ]
  },
  {
    "id": 158,
    "text": "Renzo, I want to open my own restaurant.",
    "chunks": [
      "Renzo, I want to",
      "open my own restaurant."
    ],
    "translation": "렌조, 난 내 식당을 차리고 싶어.",
    "prevContext": [
      "Oh no. Don’t put your job on the line for me. That’s not necessary.",
      "I don’t understand. I thought  you would be excited by this opportunity.",
      "My offer was supposed to make you happy."
    ],
    "nextContext": [
      "I don’t really need to be the head chef anymore.",
      "How are you going to do that?",
      "I’m learning how, Renzo."
    ]
  },
  {
    "id": 159,
    "text": "I don’t really need to be the head chef anymore.",
    "chunks": [
      "I don’t really",
      "need to be",
      "the head chef anymore."
    ],
    "translation": "더 이상 수석 셰프 자리는 필요 없어.",
    "prevContext": [
      "I don’t understand. I thought  you would be excited by this opportunity.",
      "My offer was supposed to make you happy.",
      "Renzo, I want to open my own restaurant."
    ],
    "nextContext": [
      "How are you going to do that?",
      "I’m learning how, Renzo.",
      "There is a list of terms and chapters one and two that I want you to memorize by Friday."
    ]
  },
  {
    "id": 160,
    "text": "How are you going to do that?",
    "chunks": [
      "How are you",
      "going to do that?"
    ],
    "translation": "그걸 어떻게 할 건데?",
    "prevContext": [
      "My offer was supposed to make you happy.",
      "Renzo, I want to open my own restaurant.",
      "I don’t really need to be the head chef anymore."
    ],
    "nextContext": [
      "I’m learning how, Renzo.",
      "There is a list of terms and chapters one and two that I want you to memorize by Friday.",
      "Yes Sir."
    ]
  },
  {
    "id": 161,
    "text": "I’m learning how, Renzo.",
    "chunks": [
      "I’m learning how, Renzo."
    ],
    "translation": "어떻게 하는지 배우고 있어, 렌조.",
    "prevContext": [
      "Renzo, I want to open my own restaurant.",
      "I don’t really need to be the head chef anymore.",
      "How are you going to do that?"
    ],
    "nextContext": [
      "There is a list of terms and chapters one and two that I want you to memorize by Friday.",
      "Yes Sir.",
      "There are a lot of terms in those chapters. Is there a specific way you recommend we learn them by heart?"
    ]
  },
  {
    "id": 162,
    "text": "There is a list of terms and chapters one and two that I want you to memorize by Friday.",
    "chunks": [
      "There is a list",
      "of terms and chapters",
      "one and two that",
      "I want you to memorize by Friday."
    ],
    "translation": "금요일까지 외워야 할 1장과 2장의 용어 목록입니다.",
    "prevContext": [
      "I don’t really need to be the head chef anymore.",
      "How are you going to do that?",
      "I’m learning how, Renzo."
    ],
    "nextContext": [
      "Yes Sir.",
      "There are a lot of terms in those chapters. Is there a specific way you recommend we learn them by heart?",
      "Rote learning is the best way to remember anything."
    ]
  },
  {
    "id": 163,
    "text": "Yes Sir.",
    "chunks": [
      "Yes Sir."
    ],
    "translation": "네, 교수님.",
    "prevContext": [
      "How are you going to do that?",
      "I’m learning how, Renzo.",
      "There is a list of terms and chapters one and two that I want you to memorize by Friday."
    ],
    "nextContext": [
      "There are a lot of terms in those chapters. Is there a specific way you recommend we learn them by heart?",
      "Rote learning is the best way to remember anything.",
      "What’s rote learning?"
    ]
  },
  {
    "id": 164,
    "text": "There are a lot of terms in those chapters. Is there a specific way you recommend we learn them by heart?",
    "chunks": [
      "There are a lot of",
      "terms in those chapters. Is",
      "there a specific way you",
      "recommend we learn them by heart?"
    ],
    "translation": "용어가 많은데, 완벽히 암기할 수 있는 추천 공부법이 있을까요?",
    "prevContext": [
      "I’m learning how, Renzo.",
      "There is a list of terms and chapters one and two that I want you to memorize by Friday.",
      "Yes Sir."
    ],
    "nextContext": [
      "Rote learning is the best way to remember anything.",
      "What’s rote learning?",
      "Rote learning is a process of learning through repetition."
    ]
  },
  {
    "id": 165,
    "text": "Rote learning is the best way to remember anything.",
    "chunks": [
      "Rote learning is",
      "the best way",
      "to remember anything."
    ],
    "translation": "기계적 반복 학습이 암기에 가장 좋은 방법입니다.",
    "prevContext": [
      "There is a list of terms and chapters one and two that I want you to memorize by Friday.",
      "Yes Sir.",
      "There are a lot of terms in those chapters. Is there a specific way you recommend we learn them by heart?"
    ],
    "nextContext": [
      "What’s rote learning?",
      "Rote learning is a process of learning through repetition.",
      "The more you repeat something, the easier it is going to be for you to recall that information."
    ]
  },
  {
    "id": 166,
    "text": "What’s rote learning?",
    "chunks": [
      "What’s rote learning?"
    ],
    "translation": "기계적 암기가 뭔가요?",
    "prevContext": [
      "Yes Sir.",
      "There are a lot of terms in those chapters. Is there a specific way you recommend we learn them by heart?",
      "Rote learning is the best way to remember anything."
    ],
    "nextContext": [
      "Rote learning is a process of learning through repetition.",
      "The more you repeat something, the easier it is going to be for you to recall that information.",
      "You repeat the terms over and over until you know them by heart."
    ]
  },
  {
    "id": 167,
    "text": "Rote learning is a process of learning through repetition.",
    "chunks": [
      "Rote learning is",
      "a process of",
      "learning through repetition."
    ],
    "translation": "기계적 암기는 반복을 통해 학습하는 과정입니다.",
    "prevContext": [
      "There are a lot of terms in those chapters. Is there a specific way you recommend we learn them by heart?",
      "Rote learning is the best way to remember anything.",
      "What’s rote learning?"
    ],
    "nextContext": [
      "The more you repeat something, the easier it is going to be for you to recall that information.",
      "You repeat the terms over and over until you know them by heart.",
      "Yes."
    ]
  },
  {
    "id": 168,
    "text": "The more you repeat something, the easier it is going to be for you to recall that information.",
    "chunks": [
      "The more you repeat",
      "something, the easier it",
      "is going to be",
      "for you to recall that information."
    ],
    "translation": "더 많이 반복할수록 정보를 떠올리기가 훨씬 수월해집니다.",
    "prevContext": [
      "Rote learning is the best way to remember anything.",
      "What’s rote learning?",
      "Rote learning is a process of learning through repetition."
    ],
    "nextContext": [
      "You repeat the terms over and over until you know them by heart.",
      "Yes.",
      "Why do we have to memorize these terms so soon, if the test isn’t until a couple weeks from now?"
    ]
  },
  {
    "id": 169,
    "text": "You repeat the terms over and over until you know them by heart.",
    "chunks": [
      "You repeat the terms",
      "over and over until",
      "you know them by heart."
    ],
    "translation": "완전히 외울 때까지 용어들을 계속 반복해서 읊는 거죠.",
    "prevContext": [
      "What’s rote learning?",
      "Rote learning is a process of learning through repetition.",
      "The more you repeat something, the easier it is going to be for you to recall that information."
    ],
    "nextContext": [
      "Yes.",
      "Why do we have to memorize these terms so soon, if the test isn’t until a couple weeks from now?",
      "I want you to be prepared for this exam. In this business class, it’s important to study hard in advance. So you can retain the information."
    ]
  },
  {
    "id": 170,
    "text": "Yes.",
    "chunks": [
      "Yes."
    ],
    "translation": "네.",
    "prevContext": [
      "Rote learning is a process of learning through repetition.",
      "The more you repeat something, the easier it is going to be for you to recall that information.",
      "You repeat the terms over and over until you know them by heart."
    ],
    "nextContext": [
      "Why do we have to memorize these terms so soon, if the test isn’t until a couple weeks from now?",
      "I want you to be prepared for this exam. In this business class, it’s important to study hard in advance. So you can retain the information.",
      "How would you know if we just crammed the night before the test?"
    ]
  },
  {
    "id": 171,
    "text": "Why do we have to memorize these terms so soon, if the test isn’t until a couple weeks from now?",
    "chunks": [
      "Why do we have to",
      "memorize these terms so soon,",
      "if the test isn’t until",
      "a couple weeks from now?"
    ],
    "translation": "시험이 몇 주 뒤인데 왜 벌써 외워야 하나요?",
    "prevContext": [
      "The more you repeat something, the easier it is going to be for you to recall that information.",
      "You repeat the terms over and over until you know them by heart.",
      "Yes."
    ],
    "nextContext": [
      "I want you to be prepared for this exam. In this business class, it’s important to study hard in advance. So you can retain the information.",
      "How would you know if we just crammed the night before the test?",
      "I wouldn’t know. But doing that would only be bad for each of you. Cramming at the last minute for an exam only helps you memorize information for a short period of time, unless you’re an extremely gifted person."
    ]
  },
  {
    "id": 172,
    "text": "I want you to be prepared for this exam. In this business class, it’s important to study hard in advance. So you can retain the information.",
    "chunks": [
      "I want you to be prepared",
      "for this exam. In this business",
      "class, it’s important to study hard",
      "in advance. So you can retain the information."
    ],
    "translation": "미리 철저히 공부해서 지식을 머릿속에 온전히 보존하길 바라기 때문입니다.",
    "prevContext": [
      "You repeat the terms over and over until you know them by heart.",
      "Yes.",
      "Why do we have to memorize these terms so soon, if the test isn’t until a couple weeks from now?"
    ],
    "nextContext": [
      "How would you know if we just crammed the night before the test?",
      "I wouldn’t know. But doing that would only be bad for each of you. Cramming at the last minute for an exam only helps you memorize information for a short period of time, unless you’re an extremely gifted person.",
      "But for most of us, studying this information until you know it by heart is going to be the best way."
    ]
  },
  {
    "id": 173,
    "text": "How would you know if we just crammed the night before the test?",
    "chunks": [
      "How would you know",
      "if we just crammed",
      "the night before the test?"
    ],
    "translation": "저희가 전날 밤 벼락치기를 했는지 교수님이 어떻게 아시나요?",
    "prevContext": [
      "Yes.",
      "Why do we have to memorize these terms so soon, if the test isn’t until a couple weeks from now?",
      "I want you to be prepared for this exam. In this business class, it’s important to study hard in advance. So you can retain the information."
    ],
    "nextContext": [
      "I wouldn’t know. But doing that would only be bad for each of you. Cramming at the last minute for an exam only helps you memorize information for a short period of time, unless you’re an extremely gifted person.",
      "But for most of us, studying this information until you know it by heart is going to be the best way.",
      "If there are any bookworms out there, you will be happy to know that there will be a lot of reading to do for this course. Also cheating in any form will not be tolerated. Cheating will result in immediate expulsion from my course and any other courses at this university."
    ]
  },
  {
    "id": 174,
    "text": "I wouldn’t know. But doing that would only be bad for each of you. Cramming at the last minute for an exam only helps you memorize information for a short period of time, unless you’re an extremely gifted person.",
    "chunks": [
      "I wouldn’t know. But doing that would only be",
      "bad for each of you. Cramming at the last",
      "minute for an exam only helps you memorize information",
      "for a short period of time, unless you’re an extremely gifted person."
    ],
    "translation": "벼락치기는 단기 기억에만 머물 뿐 여러분에게 아무런 도움이 되지 않습니다.",
    "prevContext": [
      "Why do we have to memorize these terms so soon, if the test isn’t until a couple weeks from now?",
      "I want you to be prepared for this exam. In this business class, it’s important to study hard in advance. So you can retain the information.",
      "How would you know if we just crammed the night before the test?"
    ],
    "nextContext": [
      "But for most of us, studying this information until you know it by heart is going to be the best way.",
      "If there are any bookworms out there, you will be happy to know that there will be a lot of reading to do for this course. Also cheating in any form will not be tolerated. Cheating will result in immediate expulsion from my course and any other courses at this university.",
      "That goes for playing hooky as well."
    ]
  },
  {
    "id": 175,
    "text": "But for most of us, studying this information until you know it by heart is going to be the best way.",
    "chunks": [
      "But for most of us,",
      "studying this information until you",
      "know it by heart is",
      "going to be the best way."
    ],
    "translation": "완전히 체득할 때까지 반복 학습하는 것이 최선의 방법입니다.",
    "prevContext": [
      "I want you to be prepared for this exam. In this business class, it’s important to study hard in advance. So you can retain the information.",
      "How would you know if we just crammed the night before the test?",
      "I wouldn’t know. But doing that would only be bad for each of you. Cramming at the last minute for an exam only helps you memorize information for a short period of time, unless you’re an extremely gifted person."
    ],
    "nextContext": [
      "If there are any bookworms out there, you will be happy to know that there will be a lot of reading to do for this course. Also cheating in any form will not be tolerated. Cheating will result in immediate expulsion from my course and any other courses at this university.",
      "That goes for playing hooky as well.",
      "Yes Sofi"
    ]
  },
  {
    "id": 176,
    "text": "If there are any bookworms out there, you will be happy to know that there will be a lot of reading to do for this course. Also cheating in any form will not be tolerated. Cheating will result in immediate expulsion from my course and any other courses at this university.",
    "chunks": [
      "If there are any bookworms out there, you will be happy to",
      "know that there will be a lot of reading to do for",
      "this course. Also cheating in any form will not be tolerated. Cheating",
      "will result in immediate expulsion from my course and any other courses at this university."
    ],
    "translation": "부정행위는 어떤 형태로든 용납되지 않으며 즉시 퇴학 처리됩니다.",
    "prevContext": [
      "How would you know if we just crammed the night before the test?",
      "I wouldn’t know. But doing that would only be bad for each of you. Cramming at the last minute for an exam only helps you memorize information for a short period of time, unless you’re an extremely gifted person.",
      "But for most of us, studying this information until you know it by heart is going to be the best way."
    ],
    "nextContext": [
      "That goes for playing hooky as well.",
      "Yes Sofi",
      "What does playing hooky mean?"
    ]
  },
  {
    "id": 177,
    "text": "That goes for playing hooky as well.",
    "chunks": [
      "That goes for",
      "playing hooky as well."
    ],
    "translation": "수업을 빼먹는 행위도 마찬가지입니다.",
    "prevContext": [
      "I wouldn’t know. But doing that would only be bad for each of you. Cramming at the last minute for an exam only helps you memorize information for a short period of time, unless you’re an extremely gifted person.",
      "But for most of us, studying this information until you know it by heart is going to be the best way.",
      "If there are any bookworms out there, you will be happy to know that there will be a lot of reading to do for this course. Also cheating in any form will not be tolerated. Cheating will result in immediate expulsion from my course and any other courses at this university."
    ],
    "nextContext": [
      "Yes Sofi",
      "What does playing hooky mean?",
      "Playing hooky means to not to come to class."
    ]
  },
  {
    "id": 178,
    "text": "Yes Sofi",
    "chunks": [
      "Yes Sofi"
    ],
    "translation": "네, 소피 학생.",
    "prevContext": [
      "But for most of us, studying this information until you know it by heart is going to be the best way.",
      "If there are any bookworms out there, you will be happy to know that there will be a lot of reading to do for this course. Also cheating in any form will not be tolerated. Cheating will result in immediate expulsion from my course and any other courses at this university.",
      "That goes for playing hooky as well."
    ],
    "nextContext": [
      "What does playing hooky mean?",
      "Playing hooky means to not to come to class.",
      "If you miss my classes, you will fall behind in your studies. It will be incredibly difficult to catch up."
    ]
  },
  {
    "id": 179,
    "text": "What does playing hooky mean?",
    "chunks": [
      "What does",
      "playing hooky mean?"
    ],
    "translation": "Playing hooky가 무슨 뜻인가요?",
    "prevContext": [
      "If there are any bookworms out there, you will be happy to know that there will be a lot of reading to do for this course. Also cheating in any form will not be tolerated. Cheating will result in immediate expulsion from my course and any other courses at this university.",
      "That goes for playing hooky as well.",
      "Yes Sofi"
    ],
    "nextContext": [
      "Playing hooky means to not to come to class.",
      "If you miss my classes, you will fall behind in your studies. It will be incredibly difficult to catch up.",
      "Which is worse, cheating or playing hooky?"
    ]
  },
  {
    "id": 180,
    "text": "Playing hooky means to not to come to class.",
    "chunks": [
      "Playing hooky means",
      "to not to",
      "come to class."
    ],
    "translation": "수업을 땡땡이치고 결석한다는 뜻입니다.",
    "prevContext": [
      "That goes for playing hooky as well.",
      "Yes Sofi",
      "What does playing hooky mean?"
    ],
    "nextContext": [
      "If you miss my classes, you will fall behind in your studies. It will be incredibly difficult to catch up.",
      "Which is worse, cheating or playing hooky?",
      "Don’t do either."
    ]
  },
  {
    "id": 181,
    "text": "If you miss my classes, you will fall behind in your studies. It will be incredibly difficult to catch up.",
    "chunks": [
      "If you miss my classes,",
      "you will fall behind in",
      "your studies. It will be",
      "incredibly difficult to catch up."
    ],
    "translation": "제 수업을 놓치면 진도를 따라잡기가 대단히 어려울 겁니다.",
    "prevContext": [
      "Yes Sofi",
      "What does playing hooky mean?",
      "Playing hooky means to not to come to class."
    ],
    "nextContext": [
      "Which is worse, cheating or playing hooky?",
      "Don’t do either.",
      "Okay I won’t."
    ]
  },
  {
    "id": 182,
    "text": "Which is worse, cheating or playing hooky?",
    "chunks": [
      "Which is worse,",
      "cheating or playing hooky?"
    ],
    "translation": "부정행위와 땡땡이 중 어느 것이 더 나쁜가요?",
    "prevContext": [
      "What does playing hooky mean?",
      "Playing hooky means to not to come to class.",
      "If you miss my classes, you will fall behind in your studies. It will be incredibly difficult to catch up."
    ],
    "nextContext": [
      "Don’t do either.",
      "Okay I won’t.",
      "My English literacy isn’t quite as advanced as my speaking."
    ]
  },
  {
    "id": 183,
    "text": "Don’t do either.",
    "chunks": [
      "Don’t do either."
    ],
    "translation": "둘 다 하지 마세요.",
    "prevContext": [
      "Playing hooky means to not to come to class.",
      "If you miss my classes, you will fall behind in your studies. It will be incredibly difficult to catch up.",
      "Which is worse, cheating or playing hooky?"
    ],
    "nextContext": [
      "Okay I won’t.",
      "My English literacy isn’t quite as advanced as my speaking.",
      "Are there many tutors that can help me?"
    ]
  },
  {
    "id": 184,
    "text": "Okay I won’t.",
    "chunks": [
      "Okay I won’t."
    ],
    "translation": "네, 안 하겠습니다.",
    "prevContext": [
      "If you miss my classes, you will fall behind in your studies. It will be incredibly difficult to catch up.",
      "Which is worse, cheating or playing hooky?",
      "Don’t do either."
    ],
    "nextContext": [
      "My English literacy isn’t quite as advanced as my speaking.",
      "Are there many tutors that can help me?",
      "I thought you were bilingual. You speak fluent English."
    ]
  },
  {
    "id": 185,
    "text": "My English literacy isn’t quite as advanced as my speaking.",
    "chunks": [
      "My English literacy",
      "isn’t quite as",
      "advanced as my speaking."
    ],
    "translation": "제 영어 읽기 쓰기는 말하기만큼 유창하지 않아요.",
    "prevContext": [
      "Which is worse, cheating or playing hooky?",
      "Don’t do either.",
      "Okay I won’t."
    ],
    "nextContext": [
      "Are there many tutors that can help me?",
      "I thought you were bilingual. You speak fluent English.",
      "Thank you. But I still have a lot of work to do."
    ]
  },
  {
    "id": 186,
    "text": "Are there many tutors that can help me?",
    "chunks": [
      "Are there many tutors",
      "that can help me?"
    ],
    "translation": "저를 도와줄 수 있는 튜터가 있나요?",
    "prevContext": [
      "Don’t do either.",
      "Okay I won’t.",
      "My English literacy isn’t quite as advanced as my speaking."
    ],
    "nextContext": [
      "I thought you were bilingual. You speak fluent English.",
      "Thank you. But I still have a lot of work to do.",
      "Well, for students that have special needs, come talk to me after the class and I will refer you to someone who can help you."
    ]
  },
  {
    "id": 187,
    "text": "I thought you were bilingual. You speak fluent English.",
    "chunks": [
      "I thought you",
      "were bilingual. You",
      "speak fluent English."
    ],
    "translation": "영어를 유창하게 해서 이중언어 사용자인 줄 알았는데요.",
    "prevContext": [
      "Okay I won’t.",
      "My English literacy isn’t quite as advanced as my speaking.",
      "Are there many tutors that can help me?"
    ],
    "nextContext": [
      "Thank you. But I still have a lot of work to do.",
      "Well, for students that have special needs, come talk to me after the class and I will refer you to someone who can help you.",
      "Are there any other questions?"
    ]
  },
  {
    "id": 188,
    "text": "Thank you. But I still have a lot of work to do.",
    "chunks": [
      "Thank you. But I",
      "still have a lot",
      "of work to do."
    ],
    "translation": "감사합니다. 하지만 아직 보완할 점이 많아요.",
    "prevContext": [
      "My English literacy isn’t quite as advanced as my speaking.",
      "Are there many tutors that can help me?",
      "I thought you were bilingual. You speak fluent English."
    ],
    "nextContext": [
      "Well, for students that have special needs, come talk to me after the class and I will refer you to someone who can help you.",
      "Are there any other questions?",
      "This class size is bigger than I’m used to."
    ]
  },
  {
    "id": 189,
    "text": "Well, for students that have special needs, come talk to me after the class and I will refer you to someone who can help you.",
    "chunks": [
      "Well, for students that have special",
      "needs, come talk to me after",
      "the class and I will refer",
      "you to someone who can help you."
    ],
    "translation": "도움이 필요한 학생은 수업 후에 찾아오면 튜터를 소개해 주겠습니다.",
    "prevContext": [
      "Are there many tutors that can help me?",
      "I thought you were bilingual. You speak fluent English.",
      "Thank you. But I still have a lot of work to do."
    ],
    "nextContext": [
      "Are there any other questions?",
      "This class size is bigger than I’m used to.",
      "So, I’m not going to be able to give each of you individual attention."
    ]
  },
  {
    "id": 190,
    "text": "Are there any other questions?",
    "chunks": [
      "Are there",
      "any other questions?"
    ],
    "translation": "다른 질문 더 있습니까?",
    "prevContext": [
      "I thought you were bilingual. You speak fluent English.",
      "Thank you. But I still have a lot of work to do.",
      "Well, for students that have special needs, come talk to me after the class and I will refer you to someone who can help you."
    ],
    "nextContext": [
      "This class size is bigger than I’m used to.",
      "So, I’m not going to be able to give each of you individual attention.",
      "But if you have any concerns, don’t hesitate to ask."
    ]
  },
  {
    "id": 191,
    "text": "This class size is bigger than I’m used to.",
    "chunks": [
      "This class size",
      "is bigger than",
      "I’m used to."
    ],
    "translation": "수강 인원이 생각보다 많네요.",
    "prevContext": [
      "Thank you. But I still have a lot of work to do.",
      "Well, for students that have special needs, come talk to me after the class and I will refer you to someone who can help you.",
      "Are there any other questions?"
    ],
    "nextContext": [
      "So, I’m not going to be able to give each of you individual attention.",
      "But if you have any concerns, don’t hesitate to ask.",
      "I do have one concern."
    ]
  },
  {
    "id": 192,
    "text": "So, I’m not going to be able to give each of you individual attention.",
    "chunks": [
      "So, I’m not",
      "going to be",
      "able to give",
      "each of you individual attention."
    ],
    "translation": "개별적인 집중 지도는 어려울 수 있습니다.",
    "prevContext": [
      "Well, for students that have special needs, come talk to me after the class and I will refer you to someone who can help you.",
      "Are there any other questions?",
      "This class size is bigger than I’m used to."
    ],
    "nextContext": [
      "But if you have any concerns, don’t hesitate to ask.",
      "I do have one concern.",
      "Why do we have to take so many tests?"
    ]
  },
  {
    "id": 193,
    "text": "But if you have any concerns, don’t hesitate to ask.",
    "chunks": [
      "But if you",
      "have any concerns,",
      "don’t hesitate to ask."
    ],
    "translation": "궁금한 점이 있으면 언제든 주저 말고 물어보세요.",
    "prevContext": [
      "Are there any other questions?",
      "This class size is bigger than I’m used to.",
      "So, I’m not going to be able to give each of you individual attention."
    ],
    "nextContext": [
      "I do have one concern.",
      "Why do we have to take so many tests?",
      "Tests help you learn."
    ]
  },
  {
    "id": 194,
    "text": "I do have one concern.",
    "chunks": [
      "I do",
      "have one concern."
    ],
    "translation": "우려되는 점이 하나 있습니다.",
    "prevContext": [
      "This class size is bigger than I’m used to.",
      "So, I’m not going to be able to give each of you individual attention.",
      "But if you have any concerns, don’t hesitate to ask."
    ],
    "nextContext": [
      "Why do we have to take so many tests?",
      "Tests help you learn.",
      "This course operates under traditional teaching methods."
    ]
  },
  {
    "id": 195,
    "text": "Why do we have to take so many tests?",
    "chunks": [
      "Why do we",
      "have to take",
      "so many tests?"
    ],
    "translation": "시험을 왜 이렇게 많이 봐야 하나요?",
    "prevContext": [
      "So, I’m not going to be able to give each of you individual attention.",
      "But if you have any concerns, don’t hesitate to ask.",
      "I do have one concern."
    ],
    "nextContext": [
      "Tests help you learn.",
      "This course operates under traditional teaching methods.",
      "There are certain standards you expect from me, and I have certain standards that I expect from you. As business owners, your customers or clients would expect the same from you as I do."
    ]
  },
  {
    "id": 196,
    "text": "Tests help you learn.",
    "chunks": [
      "Tests help you learn."
    ],
    "translation": "시험은 학습을 돕습니다.",
    "prevContext": [
      "But if you have any concerns, don’t hesitate to ask.",
      "I do have one concern.",
      "Why do we have to take so many tests?"
    ],
    "nextContext": [
      "This course operates under traditional teaching methods.",
      "There are certain standards you expect from me, and I have certain standards that I expect from you. As business owners, your customers or clients would expect the same from you as I do.",
      "Now, these next few months aren’t going to be easy. But I promise you that with hard work, they will be rewarding."
    ]
  },
  {
    "id": 197,
    "text": "This course operates under traditional teaching methods.",
    "chunks": [
      "This course operates",
      "under traditional teaching methods."
    ],
    "translation": "이 강의는 전통적인 교수 방식으로 운영됩니다.",
    "prevContext": [
      "I do have one concern.",
      "Why do we have to take so many tests?",
      "Tests help you learn."
    ],
    "nextContext": [
      "There are certain standards you expect from me, and I have certain standards that I expect from you. As business owners, your customers or clients would expect the same from you as I do.",
      "Now, these next few months aren’t going to be easy. But I promise you that with hard work, they will be rewarding.",
      "You often find that people want to succeed, but they don’t want to work hard."
    ]
  },
  {
    "id": 198,
    "text": "There are certain standards you expect from me, and I have certain standards that I expect from you. As business owners, your customers or clients would expect the same from you as I do.",
    "chunks": [
      "There are certain standards you expect from me,",
      "and I have certain standards that I expect",
      "from you. As business owners, your customers or",
      "clients would expect the same from you as I do."
    ],
    "translation": "여러분이 제게 기대하는 기준이 있듯 저 역시 여러분에게 바라는 기준이 있습니다.",
    "prevContext": [
      "Why do we have to take so many tests?",
      "Tests help you learn.",
      "This course operates under traditional teaching methods."
    ],
    "nextContext": [
      "Now, these next few months aren’t going to be easy. But I promise you that with hard work, they will be rewarding.",
      "You often find that people want to succeed, but they don’t want to work hard.",
      "You see that all the time?"
    ]
  },
  {
    "id": 199,
    "text": "Now, these next few months aren’t going to be easy. But I promise you that with hard work, they will be rewarding.",
    "chunks": [
      "Now, these next few months",
      "aren’t going to be easy.",
      "But I promise you that",
      "with hard work, they will be rewarding."
    ],
    "translation": "앞으로 몇 달간 힘들겠지만 열심히 노력하면 보람이 있을 겁니다.",
    "prevContext": [
      "Tests help you learn.",
      "This course operates under traditional teaching methods.",
      "There are certain standards you expect from me, and I have certain standards that I expect from you. As business owners, your customers or clients would expect the same from you as I do."
    ],
    "nextContext": [
      "You often find that people want to succeed, but they don’t want to work hard.",
      "You see that all the time?",
      "They don’t teach kids anything at most schools these days."
    ]
  },
  {
    "id": 200,
    "text": "You often find that people want to succeed, but they don’t want to work hard.",
    "chunks": [
      "You often find",
      "that people want",
      "to succeed, but",
      "they don’t want to work hard."
    ],
    "translation": "사람들은 성공을 바라면서도 열심히 일하기는 싫어하죠.",
    "prevContext": [
      "This course operates under traditional teaching methods.",
      "There are certain standards you expect from me, and I have certain standards that I expect from you. As business owners, your customers or clients would expect the same from you as I do.",
      "Now, these next few months aren’t going to be easy. But I promise you that with hard work, they will be rewarding."
    ],
    "nextContext": [
      "You see that all the time?",
      "They don’t teach kids anything at most schools these days.",
      "They just want good grades."
    ]
  },
  {
    "id": 201,
    "text": "You see that all the time?",
    "chunks": [
      "You see that",
      "all the time?"
    ],
    "translation": "늘상 그런 걸 보시나요?",
    "prevContext": [
      "There are certain standards you expect from me, and I have certain standards that I expect from you. As business owners, your customers or clients would expect the same from you as I do.",
      "Now, these next few months aren’t going to be easy. But I promise you that with hard work, they will be rewarding.",
      "You often find that people want to succeed, but they don’t want to work hard."
    ],
    "nextContext": [
      "They don’t teach kids anything at most schools these days.",
      "They just want good grades.",
      "They don’t really want to learn."
    ]
  },
  {
    "id": 202,
    "text": "They don’t teach kids anything at most schools these days.",
    "chunks": [
      "They don’t teach",
      "kids anything at",
      "most schools these days."
    ],
    "translation": "요즘 학교들은 아이들에게 제대로 된 걸 가르치지 않아요.",
    "prevContext": [
      "Now, these next few months aren’t going to be easy. But I promise you that with hard work, they will be rewarding.",
      "You often find that people want to succeed, but they don’t want to work hard.",
      "You see that all the time?"
    ],
    "nextContext": [
      "They just want good grades.",
      "They don’t really want to learn.",
      "You hear stories about teachers helping students cheat. It’s terrible."
    ]
  },
  {
    "id": 203,
    "text": "They just want good grades.",
    "chunks": [
      "They just",
      "want good grades."
    ],
    "translation": "아이들은 그저 좋은 성적만 바라죠.",
    "prevContext": [
      "You often find that people want to succeed, but they don’t want to work hard.",
      "You see that all the time?",
      "They don’t teach kids anything at most schools these days."
    ],
    "nextContext": [
      "They don’t really want to learn.",
      "You hear stories about teachers helping students cheat. It’s terrible.",
      "They say our education system is getting worse."
    ]
  },
  {
    "id": 204,
    "text": "They don’t really want to learn.",
    "chunks": [
      "They don’t really",
      "want to learn."
    ],
    "translation": "진짜 배우고 싶어 하진 않아요.",
    "prevContext": [
      "You see that all the time?",
      "They don’t teach kids anything at most schools these days.",
      "They just want good grades."
    ],
    "nextContext": [
      "You hear stories about teachers helping students cheat. It’s terrible.",
      "They say our education system is getting worse.",
      "Well, I’m glad we have such a dedicated teacher as you."
    ]
  },
  {
    "id": 205,
    "text": "You hear stories about teachers helping students cheat. It’s terrible.",
    "chunks": [
      "You hear stories",
      "about teachers helping",
      "students cheat. It’s terrible."
    ],
    "translation": "교사가 학생의 부정을 돕는다는 뉴스도 들리는데, 끔찍합니다.",
    "prevContext": [
      "They don’t teach kids anything at most schools these days.",
      "They just want good grades.",
      "They don’t really want to learn."
    ],
    "nextContext": [
      "They say our education system is getting worse.",
      "Well, I’m glad we have such a dedicated teacher as you.",
      "You hear about teachers who don’t care at all."
    ]
  },
  {
    "id": 206,
    "text": "They say our education system is getting worse.",
    "chunks": [
      "They say our education",
      "system is getting worse."
    ],
    "translation": "교육 제도가 점점 악화되고 있다고들 하죠.",
    "prevContext": [
      "They just want good grades.",
      "They don’t really want to learn.",
      "You hear stories about teachers helping students cheat. It’s terrible."
    ],
    "nextContext": [
      "Well, I’m glad we have such a dedicated teacher as you.",
      "You hear about teachers who don’t care at all.",
      "Thanks, Sofi. They say I’m tough, but effective."
    ]
  },
  {
    "id": 207,
    "text": "Well, I’m glad we have such a dedicated teacher as you.",
    "chunks": [
      "Well, I’m glad",
      "we have such",
      "a dedicated teacher as you."
    ],
    "translation": "교수님처럼 열정적인 분이 계셔서 참 다행입니다.",
    "prevContext": [
      "They don’t really want to learn.",
      "You hear stories about teachers helping students cheat. It’s terrible.",
      "They say our education system is getting worse."
    ],
    "nextContext": [
      "You hear about teachers who don’t care at all.",
      "Thanks, Sofi. They say I’m tough, but effective.",
      "Okay. Stop complimenting me. Let’s open our book to page four."
    ]
  },
  {
    "id": 208,
    "text": "You hear about teachers who don’t care at all.",
    "chunks": [
      "You hear about",
      "teachers who don’t",
      "care at all."
    ],
    "translation": "전혀 신경 쓰지 않는 교사들도 많잖아요.",
    "prevContext": [
      "You hear stories about teachers helping students cheat. It’s terrible.",
      "They say our education system is getting worse.",
      "Well, I’m glad we have such a dedicated teacher as you."
    ],
    "nextContext": [
      "Thanks, Sofi. They say I’m tough, but effective.",
      "Okay. Stop complimenting me. Let’s open our book to page four.",
      "Learn Arabic at Home"
    ]
  },
  {
    "id": 209,
    "text": "Thanks, Sofi. They say I’m tough, but effective.",
    "chunks": [
      "Thanks, Sofi. They say",
      "I’m tough, but effective."
    ],
    "translation": "고마워요, 소피. 다들 제가 엄하지만 효과적이라고 하더군요.",
    "prevContext": [
      "They say our education system is getting worse.",
      "Well, I’m glad we have such a dedicated teacher as you.",
      "You hear about teachers who don’t care at all."
    ],
    "nextContext": [
      "Okay. Stop complimenting me. Let’s open our book to page four.",
      "Learn Arabic at Home",
      "Do you want to learn Arabic, but you don't have a lot of time?"
    ]
  },
  {
    "id": 210,
    "text": "Okay. Stop complimenting me. Let’s open our book to page four.",
    "chunks": [
      "Okay. Stop complimenting",
      "me. Let’s open",
      "our book to page four."
    ],
    "translation": "좋아요. 칭찬은 그만하고 교재 4페이지를 펴세요.",
    "prevContext": [
      "Well, I’m glad we have such a dedicated teacher as you.",
      "You hear about teachers who don’t care at all.",
      "Thanks, Sofi. They say I’m tough, but effective."
    ],
    "nextContext": [
      "Learn Arabic at Home",
      "Do you want to learn Arabic, but you don't have a lot of time?",
      "Are you afraid it's going to be too difficult?"
    ]
  },
  {
    "id": 211,
    "text": "Learn Arabic at Home",
    "chunks": [
      "Learn Arabic at Home"
    ],
    "translation": "제공해주신 대화 문장입니다.",
    "prevContext": [
      "You hear about teachers who don’t care at all.",
      "Thanks, Sofi. They say I’m tough, but effective.",
      "Okay. Stop complimenting me. Let’s open our book to page four."
    ],
    "nextContext": [
      "Do you want to learn Arabic, but you don't have a lot of time?",
      "Are you afraid it's going to be too difficult?",
      "Have you struggled with language courses in the past?"
    ]
  },
  {
    "id": 212,
    "text": "Do you want to learn Arabic, but you don't have a lot of time?",
    "chunks": [
      "Do you want",
      "to learn Arabic,",
      "but you don't",
      "have a lot of time?"
    ],
    "translation": "아랍어를 배우고 싶지만 시간이 부족하신가요?",
    "prevContext": [
      "Thanks, Sofi. They say I’m tough, but effective.",
      "Okay. Stop complimenting me. Let’s open our book to page four.",
      "Learn Arabic at Home"
    ],
    "nextContext": [
      "Are you afraid it's going to be too difficult?",
      "Have you struggled with language courses in the past?",
      "Don't worry about any of those things."
    ]
  },
  {
    "id": 213,
    "text": "Are you afraid it's going to be too difficult?",
    "chunks": [
      "Are you afraid",
      "it's going to",
      "be too difficult?"
    ],
    "translation": "너무 어려울까 봐 걱정되시나요?",
    "prevContext": [
      "Okay. Stop complimenting me. Let’s open our book to page four.",
      "Learn Arabic at Home",
      "Do you want to learn Arabic, but you don't have a lot of time?"
    ],
    "nextContext": [
      "Have you struggled with language courses in the past?",
      "Don't worry about any of those things.",
      "Now that you've found Arabic Online, you are sure to succeed in becoming fluent in Arabic with our program."
    ]
  },
  {
    "id": 214,
    "text": "Have you struggled with language courses in the past?",
    "chunks": [
      "Have you struggled",
      "with language courses",
      "in the past?"
    ],
    "translation": "과거에 어학 코스로 고생한 적이 있으신가요?",
    "prevContext": [
      "Learn Arabic at Home",
      "Do you want to learn Arabic, but you don't have a lot of time?",
      "Are you afraid it's going to be too difficult?"
    ],
    "nextContext": [
      "Don't worry about any of those things.",
      "Now that you've found Arabic Online, you are sure to succeed in becoming fluent in Arabic with our program.",
      "One reason for Arabic Online's success is that, unlike other language programs, it does not use traditional teaching methods."
    ]
  },
  {
    "id": 215,
    "text": "Don't worry about any of those things.",
    "chunks": [
      "Don't worry about",
      "any of those things."
    ],
    "translation": "그런 걱정은 전혀 하지 마세요.",
    "prevContext": [
      "Do you want to learn Arabic, but you don't have a lot of time?",
      "Are you afraid it's going to be too difficult?",
      "Have you struggled with language courses in the past?"
    ],
    "nextContext": [
      "Now that you've found Arabic Online, you are sure to succeed in becoming fluent in Arabic with our program.",
      "One reason for Arabic Online's success is that, unlike other language programs, it does not use traditional teaching methods.",
      "Instead of having one teacher with a classroom full of students, you get individual attention with Arabic Online. We pair each student with a teaching tutor."
    ]
  },
  {
    "id": 216,
    "text": "Now that you've found Arabic Online, you are sure to succeed in becoming fluent in Arabic with our program.",
    "chunks": [
      "Now that you've found",
      "Arabic Online, you are",
      "sure to succeed in",
      "becoming fluent in Arabic with our program."
    ],
    "translation": "아랍어 온라인과 함께라면 유창한 실력을 갖추실 수 있습니다.",
    "prevContext": [
      "Are you afraid it's going to be too difficult?",
      "Have you struggled with language courses in the past?",
      "Don't worry about any of those things."
    ],
    "nextContext": [
      "One reason for Arabic Online's success is that, unlike other language programs, it does not use traditional teaching methods.",
      "Instead of having one teacher with a classroom full of students, you get individual attention with Arabic Online. We pair each student with a teaching tutor.",
      "We have very high standards for our tutors."
    ]
  },
  {
    "id": 217,
    "text": "One reason for Arabic Online's success is that, unlike other language programs, it does not use traditional teaching methods.",
    "chunks": [
      "One reason for Arabic",
      "Online's success is that,",
      "unlike other language programs,",
      "it does not use traditional teaching methods."
    ],
    "translation": "저희는 기존의 고루한 교수법을 탈피했습니다.",
    "prevContext": [
      "Have you struggled with language courses in the past?",
      "Don't worry about any of those things.",
      "Now that you've found Arabic Online, you are sure to succeed in becoming fluent in Arabic with our program."
    ],
    "nextContext": [
      "Instead of having one teacher with a classroom full of students, you get individual attention with Arabic Online. We pair each student with a teaching tutor.",
      "We have very high standards for our tutors.",
      "They have teaching degrees, live in an Arabic-speaking country, and are bilingual. Their native language is Arabic, but they are also fluent in English."
    ]
  },
  {
    "id": 218,
    "text": "Instead of having one teacher with a classroom full of students, you get individual attention with Arabic Online. We pair each student with a teaching tutor.",
    "chunks": [
      "Instead of having one teacher with",
      "a classroom full of students, you",
      "get individual attention with Arabic Online.",
      "We pair each student with a teaching tutor."
    ],
    "translation": "1:1 전담 튜터가 여러분을 집중 지도합니다.",
    "prevContext": [
      "Don't worry about any of those things.",
      "Now that you've found Arabic Online, you are sure to succeed in becoming fluent in Arabic with our program.",
      "One reason for Arabic Online's success is that, unlike other language programs, it does not use traditional teaching methods."
    ],
    "nextContext": [
      "We have very high standards for our tutors.",
      "They have teaching degrees, live in an Arabic-speaking country, and are bilingual. Their native language is Arabic, but they are also fluent in English.",
      "We are also careful when we pair our students with teaching tutors."
    ]
  },
  {
    "id": 219,
    "text": "We have very high standards for our tutors.",
    "chunks": [
      "We have very high",
      "standards for our tutors."
    ],
    "translation": "저희 튜터진은 엄격한 기준을 통과했습니다.",
    "prevContext": [
      "Now that you've found Arabic Online, you are sure to succeed in becoming fluent in Arabic with our program.",
      "One reason for Arabic Online's success is that, unlike other language programs, it does not use traditional teaching methods.",
      "Instead of having one teacher with a classroom full of students, you get individual attention with Arabic Online. We pair each student with a teaching tutor."
    ],
    "nextContext": [
      "They have teaching degrees, live in an Arabic-speaking country, and are bilingual. Their native language is Arabic, but they are also fluent in English.",
      "We are also careful when we pair our students with teaching tutors.",
      "We take into account your age, profession, and outside interests to pair you with someone you will enjoy working with."
    ]
  },
  {
    "id": 220,
    "text": "They have teaching degrees, live in an Arabic-speaking country, and are bilingual. Their native language is Arabic, but they are also fluent in English.",
    "chunks": [
      "They have teaching degrees, live in",
      "an Arabic-speaking country, and are bilingual.",
      "Their native language is Arabic, but",
      "they are also fluent in English."
    ],
    "translation": "교육 학위를 지니고 영어가 유창한 원어민들입니다.",
    "prevContext": [
      "One reason for Arabic Online's success is that, unlike other language programs, it does not use traditional teaching methods.",
      "Instead of having one teacher with a classroom full of students, you get individual attention with Arabic Online. We pair each student with a teaching tutor.",
      "We have very high standards for our tutors."
    ],
    "nextContext": [
      "We are also careful when we pair our students with teaching tutors.",
      "We take into account your age, profession, and outside interests to pair you with someone you will enjoy working with.",
      "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable."
    ]
  },
  {
    "id": 221,
    "text": "We are also careful when we pair our students with teaching tutors.",
    "chunks": [
      "We are also careful",
      "when we pair our",
      "students with teaching tutors."
    ],
    "translation": "학생과 튜터 매칭에 세심한 주의를 기울입니다.",
    "prevContext": [
      "Instead of having one teacher with a classroom full of students, you get individual attention with Arabic Online. We pair each student with a teaching tutor.",
      "We have very high standards for our tutors.",
      "They have teaching degrees, live in an Arabic-speaking country, and are bilingual. Their native language is Arabic, but they are also fluent in English."
    ],
    "nextContext": [
      "We take into account your age, profession, and outside interests to pair you with someone you will enjoy working with.",
      "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable.",
      "So, how does it work?"
    ]
  },
  {
    "id": 222,
    "text": "We take into account your age, profession, and outside interests to pair you with someone you will enjoy working with.",
    "chunks": [
      "We take into account your",
      "age, profession, and outside interests",
      "to pair you with someone",
      "you will enjoy working with."
    ],
    "translation": "연령과 직업, 관심사를 고려해 최적의 튜터를 배정합니다.",
    "prevContext": [
      "We have very high standards for our tutors.",
      "They have teaching degrees, live in an Arabic-speaking country, and are bilingual. Their native language is Arabic, but they are also fluent in English.",
      "We are also careful when we pair our students with teaching tutors."
    ],
    "nextContext": [
      "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable.",
      "So, how does it work?",
      "All you need is a computer with a webcam and a high-speed internet connection."
    ]
  },
  {
    "id": 223,
    "text": "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable.",
    "chunks": [
      "In contrast to",
      "some language schools,",
      "at Arabic Online,",
      "we want learning to be enjoyable."
    ],
    "translation": "저희는 배움 자체가 즐겁기를 바랍니다.",
    "prevContext": [
      "They have teaching degrees, live in an Arabic-speaking country, and are bilingual. Their native language is Arabic, but they are also fluent in English.",
      "We are also careful when we pair our students with teaching tutors.",
      "We take into account your age, profession, and outside interests to pair you with someone you will enjoy working with."
    ],
    "nextContext": [
      "So, how does it work?",
      "All you need is a computer with a webcam and a high-speed internet connection.",
      "We give you the telecommunications software you need to download."
    ]
  },
  {
    "id": 224,
    "text": "So, how does it work?",
    "chunks": [
      "So, how",
      "does it work?"
    ],
    "translation": "어떻게 진행되냐고요?",
    "prevContext": [
      "We are also careful when we pair our students with teaching tutors.",
      "We take into account your age, profession, and outside interests to pair you with someone you will enjoy working with.",
      "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable."
    ],
    "nextContext": [
      "All you need is a computer with a webcam and a high-speed internet connection.",
      "We give you the telecommunications software you need to download.",
      "You will take online lessons while you learn the Arabic writing system and grammar."
    ]
  },
  {
    "id": 225,
    "text": "All you need is a computer with a webcam and a high-speed internet connection.",
    "chunks": [
      "All you need",
      "is a computer",
      "with a webcam",
      "and a high-speed internet connection."
    ],
    "translation": "웹캠이 달린 컴퓨터와 인터넷만 있으면 됩니다.",
    "prevContext": [
      "We take into account your age, profession, and outside interests to pair you with someone you will enjoy working with.",
      "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable.",
      "So, how does it work?"
    ],
    "nextContext": [
      "We give you the telecommunications software you need to download.",
      "You will take online lessons while you learn the Arabic writing system and grammar.",
      "This is done with a series of interactive presentations."
    ]
  },
  {
    "id": 226,
    "text": "We give you the telecommunications software you need to download.",
    "chunks": [
      "We give you",
      "the telecommunications software",
      "you need to download."
    ],
    "translation": "필요한 화상 소프트웨어를 무료로 제공해 드립니다.",
    "prevContext": [
      "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable.",
      "So, how does it work?",
      "All you need is a computer with a webcam and a high-speed internet connection."
    ],
    "nextContext": [
      "You will take online lessons while you learn the Arabic writing system and grammar.",
      "This is done with a series of interactive presentations.",
      "First, you watch a short presentation, and then you practice what you learned by completing exercises."
    ]
  },
  {
    "id": 227,
    "text": "You will take online lessons while you learn the Arabic writing system and grammar.",
    "chunks": [
      "You will take",
      "online lessons while",
      "you learn the",
      "Arabic writing system and grammar."
    ],
    "translation": "문자와 문법을 대화형 영상으로 쉽게 학습합니다.",
    "prevContext": [
      "So, how does it work?",
      "All you need is a computer with a webcam and a high-speed internet connection.",
      "We give you the telecommunications software you need to download."
    ],
    "nextContext": [
      "This is done with a series of interactive presentations.",
      "First, you watch a short presentation, and then you practice what you learned by completing exercises.",
      "After you finish each lesson, you work with your teaching tutor in a video chat."
    ]
  },
  {
    "id": 228,
    "text": "This is done with a series of interactive presentations.",
    "chunks": [
      "This is done",
      "with a series",
      "of interactive presentations."
    ],
    "translation": "인터랙티브 프레젠테이션으로 수업이 진행됩니다.",
    "prevContext": [
      "All you need is a computer with a webcam and a high-speed internet connection.",
      "We give you the telecommunications software you need to download.",
      "You will take online lessons while you learn the Arabic writing system and grammar."
    ],
    "nextContext": [
      "First, you watch a short presentation, and then you practice what you learned by completing exercises.",
      "After you finish each lesson, you work with your teaching tutor in a video chat.",
      "You can ask questions about the lesson."
    ]
  },
  {
    "id": 229,
    "text": "First, you watch a short presentation, and then you practice what you learned by completing exercises.",
    "chunks": [
      "First, you watch a",
      "short presentation, and then",
      "you practice what you",
      "learned by completing exercises."
    ],
    "translation": "영상을 본 뒤 연습 문제를 풀며 내용을 다집니다.",
    "prevContext": [
      "We give you the telecommunications software you need to download.",
      "You will take online lessons while you learn the Arabic writing system and grammar.",
      "This is done with a series of interactive presentations."
    ],
    "nextContext": [
      "After you finish each lesson, you work with your teaching tutor in a video chat.",
      "You can ask questions about the lesson.",
      "After that, you practice what you learned by having conversations in Arabic with your tutor."
    ]
  },
  {
    "id": 230,
    "text": "After you finish each lesson, you work with your teaching tutor in a video chat.",
    "chunks": [
      "After you finish",
      "each lesson, you",
      "work with your",
      "teaching tutor in a video chat."
    ],
    "translation": "수업 후 튜터와 화상 채팅으로 직접 대화합니다.",
    "prevContext": [
      "You will take online lessons while you learn the Arabic writing system and grammar.",
      "This is done with a series of interactive presentations.",
      "First, you watch a short presentation, and then you practice what you learned by completing exercises."
    ],
    "nextContext": [
      "You can ask questions about the lesson.",
      "After that, you practice what you learned by having conversations in Arabic with your tutor.",
      "We feel the primary way to learn a language is to use it, as opposed to memorizing it."
    ]
  },
  {
    "id": 231,
    "text": "You can ask questions about the lesson.",
    "chunks": [
      "You can ask",
      "questions about the lesson."
    ],
    "translation": "궁금한 점은 무엇이든 질문할 수 있습니다.",
    "prevContext": [
      "This is done with a series of interactive presentations.",
      "First, you watch a short presentation, and then you practice what you learned by completing exercises.",
      "After you finish each lesson, you work with your teaching tutor in a video chat."
    ],
    "nextContext": [
      "After that, you practice what you learned by having conversations in Arabic with your tutor.",
      "We feel the primary way to learn a language is to use it, as opposed to memorizing it.",
      "You learn language, and then immediately use it to communicate."
    ]
  },
  {
    "id": 232,
    "text": "After that, you practice what you learned by having conversations in Arabic with your tutor.",
    "chunks": [
      "After that, you",
      "practice what you",
      "learned by having",
      "conversations in Arabic with your tutor."
    ],
    "translation": "배운 내용을 활용해 아랍어로 실전 회화를 나눕니다.",
    "prevContext": [
      "First, you watch a short presentation, and then you practice what you learned by completing exercises.",
      "After you finish each lesson, you work with your teaching tutor in a video chat.",
      "You can ask questions about the lesson."
    ],
    "nextContext": [
      "We feel the primary way to learn a language is to use it, as opposed to memorizing it.",
      "You learn language, and then immediately use it to communicate.",
      "There is nothing like speaking with a native speaker as you learn a language."
    ]
  },
  {
    "id": 233,
    "text": "We feel the primary way to learn a language is to use it, as opposed to memorizing it.",
    "chunks": [
      "We feel the primary",
      "way to learn a",
      "language is to use",
      "it, as opposed to memorizing it."
    ],
    "translation": "단순 암기보다 직접 입으로 말하는 것이 핵심입니다.",
    "prevContext": [
      "After you finish each lesson, you work with your teaching tutor in a video chat.",
      "You can ask questions about the lesson.",
      "After that, you practice what you learned by having conversations in Arabic with your tutor."
    ],
    "nextContext": [
      "You learn language, and then immediately use it to communicate.",
      "There is nothing like speaking with a native speaker as you learn a language.",
      "We also offer optional trips to Dubai so that you can really surround yourself with the language."
    ]
  },
  {
    "id": 234,
    "text": "You learn language, and then immediately use it to communicate.",
    "chunks": [
      "You learn language,",
      "and then immediately",
      "use it to communicate."
    ],
    "translation": "배운 직후 바로 대화에 적용해 봅니다.",
    "prevContext": [
      "You can ask questions about the lesson.",
      "After that, you practice what you learned by having conversations in Arabic with your tutor.",
      "We feel the primary way to learn a language is to use it, as opposed to memorizing it."
    ],
    "nextContext": [
      "There is nothing like speaking with a native speaker as you learn a language.",
      "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
      "We have courses that last two and four weeks."
    ]
  },
  {
    "id": 235,
    "text": "There is nothing like speaking with a native speaker as you learn a language.",
    "chunks": [
      "There is nothing",
      "like speaking with",
      "a native speaker",
      "as you learn a language."
    ],
    "translation": "원어민과의 직접 대화보다 좋은 공부법은 없습니다.",
    "prevContext": [
      "After that, you practice what you learned by having conversations in Arabic with your tutor.",
      "We feel the primary way to learn a language is to use it, as opposed to memorizing it.",
      "You learn language, and then immediately use it to communicate."
    ],
    "nextContext": [
      "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
      "We have courses that last two and four weeks.",
      "You fly to Dubai and stay with an Arabic-speaking family."
    ]
  },
  {
    "id": 236,
    "text": "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
    "chunks": [
      "We also offer optional",
      "trips to Dubai so",
      "that you can really",
      "surround yourself with the language."
    ],
    "translation": "현지 언어 환경에 몰입할 수 있는 두바이 어학연수도 지원합니다.",
    "prevContext": [
      "We feel the primary way to learn a language is to use it, as opposed to memorizing it.",
      "You learn language, and then immediately use it to communicate.",
      "There is nothing like speaking with a native speaker as you learn a language."
    ],
    "nextContext": [
      "We have courses that last two and four weeks.",
      "You fly to Dubai and stay with an Arabic-speaking family.",
      "You take classes at our school during the day and get real-world practice speaking with your host family at night."
    ]
  },
  {
    "id": 237,
    "text": "We have courses that last two and four weeks.",
    "chunks": [
      "We have courses",
      "that last two",
      "and four weeks."
    ],
    "translation": "2주 및 4주 과정의 연수 코스가 준비되어 있습니다.",
    "prevContext": [
      "You learn language, and then immediately use it to communicate.",
      "There is nothing like speaking with a native speaker as you learn a language.",
      "We also offer optional trips to Dubai so that you can really surround yourself with the language."
    ],
    "nextContext": [
      "You fly to Dubai and stay with an Arabic-speaking family.",
      "You take classes at our school during the day and get real-world practice speaking with your host family at night.",
      "On the weekends, we offer trips to various places in Dubai to use the language in real-life settings and get to know more about the culture."
    ]
  },
  {
    "id": 238,
    "text": "You fly to Dubai and stay with an Arabic-speaking family.",
    "chunks": [
      "You fly to",
      "Dubai and stay",
      "with an Arabic-speaking family."
    ],
    "translation": "두바이 현지 홈스테이 가정에 머물며 생활합니다.",
    "prevContext": [
      "There is nothing like speaking with a native speaker as you learn a language.",
      "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
      "We have courses that last two and four weeks."
    ],
    "nextContext": [
      "You take classes at our school during the day and get real-world practice speaking with your host family at night.",
      "On the weekends, we offer trips to various places in Dubai to use the language in real-life settings and get to know more about the culture.",
      "Our program offers classes for everyone, from complete beginners to advanced students."
    ]
  },
  {
    "id": 239,
    "text": "You take classes at our school during the day and get real-world practice speaking with your host family at night.",
    "chunks": [
      "You take classes at our",
      "school during the day and",
      "get real-world practice speaking with",
      "your host family at night."
    ],
    "translation": "낮에는 학원 수업을, 밤에는 가족들과 실전 회화를 나눕니다.",
    "prevContext": [
      "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
      "We have courses that last two and four weeks.",
      "You fly to Dubai and stay with an Arabic-speaking family."
    ],
    "nextContext": [
      "On the weekends, we offer trips to various places in Dubai to use the language in real-life settings and get to know more about the culture.",
      "Our program offers classes for everyone, from complete beginners to advanced students.",
      "Do you want to take advantage of the benefits that Arabic Online offers?"
    ]
  },
  {
    "id": 240,
    "text": "On the weekends, we offer trips to various places in Dubai to use the language in real-life settings and get to know more about the culture.",
    "chunks": [
      "On the weekends, we offer trips",
      "to various places in Dubai to",
      "use the language in real-life settings",
      "and get to know more about the culture."
    ],
    "translation": "주말에는 명소를 탐방하며 현지 문화를 체험합니다.",
    "prevContext": [
      "We have courses that last two and four weeks.",
      "You fly to Dubai and stay with an Arabic-speaking family.",
      "You take classes at our school during the day and get real-world practice speaking with your host family at night."
    ],
    "nextContext": [
      "Our program offers classes for everyone, from complete beginners to advanced students.",
      "Do you want to take advantage of the benefits that Arabic Online offers?",
      "Click here to chat with a teaching tutor now."
    ]
  },
  {
    "id": 241,
    "text": "Our program offers classes for everyone, from complete beginners to advanced students.",
    "chunks": [
      "Our program offers classes",
      "for everyone, from complete",
      "beginners to advanced students."
    ],
    "translation": "왕초보부터 고급자까지 모든 수준에 맞춘 강좌가 있습니다.",
    "prevContext": [
      "You fly to Dubai and stay with an Arabic-speaking family.",
      "You take classes at our school during the day and get real-world practice speaking with your host family at night.",
      "On the weekends, we offer trips to various places in Dubai to use the language in real-life settings and get to know more about the culture."
    ],
    "nextContext": [
      "Do you want to take advantage of the benefits that Arabic Online offers?",
      "Click here to chat with a teaching tutor now.",
      "To find out more about our program, click here to see our rates for the online courses and the program in Dubai."
    ]
  },
  {
    "id": 242,
    "text": "Do you want to take advantage of the benefits that Arabic Online offers?",
    "chunks": [
      "Do you want to",
      "take advantage of the",
      "benefits that Arabic Online offers?"
    ],
    "translation": "아랍어 온라인만의 특별한 혜택을 누려보시겠어요?",
    "prevContext": [
      "You take classes at our school during the day and get real-world practice speaking with your host family at night.",
      "On the weekends, we offer trips to various places in Dubai to use the language in real-life settings and get to know more about the culture.",
      "Our program offers classes for everyone, from complete beginners to advanced students."
    ],
    "nextContext": [
      "Click here to chat with a teaching tutor now.",
      "To find out more about our program, click here to see our rates for the online courses and the program in Dubai.",
      "Hi there. What can I do for you?"
    ]
  },
  {
    "id": 243,
    "text": "Click here to chat with a teaching tutor now.",
    "chunks": [
      "Click here to",
      "chat with a",
      "teaching tutor now."
    ],
    "translation": "지금 바로 튜터와 상담을 시작해 보세요.",
    "prevContext": [
      "On the weekends, we offer trips to various places in Dubai to use the language in real-life settings and get to know more about the culture.",
      "Our program offers classes for everyone, from complete beginners to advanced students.",
      "Do you want to take advantage of the benefits that Arabic Online offers?"
    ],
    "nextContext": [
      "To find out more about our program, click here to see our rates for the online courses and the program in Dubai.",
      "Hi there. What can I do for you?",
      "I thought riding my bike to work would get me across town so quickly. I was trying to switch gears when I ran over a curve. Now, I have a flat tire, so I'm in a hurry. Can you help me?"
    ]
  },
  {
    "id": 244,
    "text": "To find out more about our program, click here to see our rates for the online courses and the program in Dubai.",
    "chunks": [
      "To find out more about",
      "our program, click here to",
      "see our rates for the",
      "online courses and the program in Dubai."
    ],
    "translation": "수강료 및 두바이 연수 비용을 확인해 보세요.",
    "prevContext": [
      "Our program offers classes for everyone, from complete beginners to advanced students.",
      "Do you want to take advantage of the benefits that Arabic Online offers?",
      "Click here to chat with a teaching tutor now."
    ],
    "nextContext": [
      "Hi there. What can I do for you?",
      "I thought riding my bike to work would get me across town so quickly. I was trying to switch gears when I ran over a curve. Now, I have a flat tire, so I'm in a hurry. Can you help me?",
      "Sure, let me take a look at that thing."
    ]
  },
  {
    "id": 245,
    "text": "Hi there. What can I do for you?",
    "chunks": [
      "Hi there. What can",
      "I do for you?"
    ],
    "translation": "안녕하세요. 무엇을 도와드릴까요?",
    "prevContext": [
      "Do you want to take advantage of the benefits that Arabic Online offers?",
      "Click here to chat with a teaching tutor now.",
      "To find out more about our program, click here to see our rates for the online courses and the program in Dubai."
    ],
    "nextContext": [
      "I thought riding my bike to work would get me across town so quickly. I was trying to switch gears when I ran over a curve. Now, I have a flat tire, so I'm in a hurry. Can you help me?",
      "Sure, let me take a look at that thing.",
      "Ah, I see your problem right here."
    ]
  },
  {
    "id": 246,
    "text": "I thought riding my bike to work would get me across town so quickly. I was trying to switch gears when I ran over a curve. Now, I have a flat tire, so I'm in a hurry. Can you help me?",
    "chunks": [
      "I thought riding my bike to work would get me",
      "across town so quickly. I was trying to switch gears",
      "when I ran over a curve. Now, I have a",
      "flat tire, so I'm in a hurry. Can you help me?"
    ],
    "translation": "자전거로 출근하다 연석에 부딪혀 타이어에 펑크가 났어요. 급한데 좀 도와주실 수 있나요?",
    "prevContext": [
      "Click here to chat with a teaching tutor now.",
      "To find out more about our program, click here to see our rates for the online courses and the program in Dubai.",
      "Hi there. What can I do for you?"
    ],
    "nextContext": [
      "Sure, let me take a look at that thing.",
      "Ah, I see your problem right here.",
      "You’ve got a nail stuck in the tire. It only takes a second to fix, but that bike chain is going to take a little more time."
    ]
  },
  {
    "id": 247,
    "text": "Sure, let me take a look at that thing.",
    "chunks": [
      "Sure, let me",
      "take a look",
      "at that thing."
    ],
    "translation": "그럼요, 어디 한번 살펴봅시다.",
    "prevContext": [
      "To find out more about our program, click here to see our rates for the online courses and the program in Dubai.",
      "Hi there. What can I do for you?",
      "I thought riding my bike to work would get me across town so quickly. I was trying to switch gears when I ran over a curve. Now, I have a flat tire, so I'm in a hurry. Can you help me?"
    ],
    "nextContext": [
      "Ah, I see your problem right here.",
      "You’ve got a nail stuck in the tire. It only takes a second to fix, but that bike chain is going to take a little more time.",
      "What do you mean?"
    ]
  },
  {
    "id": 248,
    "text": "Ah, I see your problem right here.",
    "chunks": [
      "Ah, I see",
      "your problem right here."
    ],
    "translation": "아, 문제가 뭔지 바로 보이네요.",
    "prevContext": [
      "Hi there. What can I do for you?",
      "I thought riding my bike to work would get me across town so quickly. I was trying to switch gears when I ran over a curve. Now, I have a flat tire, so I'm in a hurry. Can you help me?",
      "Sure, let me take a look at that thing."
    ],
    "nextContext": [
      "You’ve got a nail stuck in the tire. It only takes a second to fix, but that bike chain is going to take a little more time.",
      "What do you mean?",
      "Your bike chain is coming loose. Do you want me to fix that too?"
    ]
  },
  {
    "id": 249,
    "text": "You’ve got a nail stuck in the tire. It only takes a second to fix, but that bike chain is going to take a little more time.",
    "chunks": [
      "You’ve got a nail stuck in",
      "the tire. It only takes a",
      "second to fix, but that bike",
      "chain is going to take a little more time."
    ],
    "translation": "타이어에 못이 박혔군요. 타이어는 금방 고치지만 체인은 시간이 좀 걸리겠어요.",
    "prevContext": [
      "I thought riding my bike to work would get me across town so quickly. I was trying to switch gears when I ran over a curve. Now, I have a flat tire, so I'm in a hurry. Can you help me?",
      "Sure, let me take a look at that thing.",
      "Ah, I see your problem right here."
    ],
    "nextContext": [
      "What do you mean?",
      "Your bike chain is coming loose. Do you want me to fix that too?",
      "Fine. Just hurry. Please."
    ]
  },
  {
    "id": 250,
    "text": "What do you mean?",
    "chunks": [
      "What do you mean?"
    ],
    "translation": "그게 무슨 말씀이시죠?",
    "prevContext": [
      "Sure, let me take a look at that thing.",
      "Ah, I see your problem right here.",
      "You’ve got a nail stuck in the tire. It only takes a second to fix, but that bike chain is going to take a little more time."
    ],
    "nextContext": [
      "Your bike chain is coming loose. Do you want me to fix that too?",
      "Fine. Just hurry. Please.",
      "Since you’re here, I’d recommend adding plastic covers to your handlebars."
    ]
  },
  {
    "id": 251,
    "text": "Your bike chain is coming loose. Do you want me to fix that too?",
    "chunks": [
      "Your bike chain",
      "is coming loose.",
      "Do you want",
      "me to fix that too?"
    ],
    "translation": "체인이 헐거워져 빠지려 하네요. 이것도 손봐드릴까요?",
    "prevContext": [
      "Ah, I see your problem right here.",
      "You’ve got a nail stuck in the tire. It only takes a second to fix, but that bike chain is going to take a little more time.",
      "What do you mean?"
    ],
    "nextContext": [
      "Fine. Just hurry. Please.",
      "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
      "See how the grips seem to be wearing down. It’s bad. If your hands slip off, that would be dangerous."
    ]
  },
  {
    "id": 252,
    "text": "Fine. Just hurry. Please.",
    "chunks": [
      "Fine. Just hurry. Please."
    ],
    "translation": "좋아요. 제발 서둘러만 주세요.",
    "prevContext": [
      "You’ve got a nail stuck in the tire. It only takes a second to fix, but that bike chain is going to take a little more time.",
      "What do you mean?",
      "Your bike chain is coming loose. Do you want me to fix that too?"
    ],
    "nextContext": [
      "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
      "See how the grips seem to be wearing down. It’s bad. If your hands slip off, that would be dangerous.",
      "Listen. I can’t be late to this meeting."
    ]
  },
  {
    "id": 253,
    "text": "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
    "chunks": [
      "Since you’re here,",
      "I’d recommend adding",
      "plastic covers to your handlebars."
    ],
    "translation": "오신 김에 핸들 그립 덮개도 씌우시는 걸 추천해요.",
    "prevContext": [
      "What do you mean?",
      "Your bike chain is coming loose. Do you want me to fix that too?",
      "Fine. Just hurry. Please."
    ],
    "nextContext": [
      "See how the grips seem to be wearing down. It’s bad. If your hands slip off, that would be dangerous.",
      "Listen. I can’t be late to this meeting.",
      "Excuse me. Are you really listening?"
    ]
  },
  {
    "id": 254,
    "text": "See how the grips seem to be wearing down. It’s bad. If your hands slip off, that would be dangerous.",
    "chunks": [
      "See how the grips seem",
      "to be wearing down. It’s",
      "bad. If your hands slip",
      "off, that would be dangerous."
    ],
    "translation": "손잡이가 많이 닳아서 미끄러지면 위험할 수 있거든요.",
    "prevContext": [
      "Your bike chain is coming loose. Do you want me to fix that too?",
      "Fine. Just hurry. Please.",
      "Since you’re here, I’d recommend adding plastic covers to your handlebars."
    ],
    "nextContext": [
      "Listen. I can’t be late to this meeting.",
      "Excuse me. Are you really listening?",
      "Wow, I can’t believe your bike only has five gears. I can show you a really nice 10 speed bike if you want to buy a new one."
    ]
  },
  {
    "id": 255,
    "text": "Listen. I can’t be late to this meeting.",
    "chunks": [
      "Listen. I can’t be",
      "late to this meeting."
    ],
    "translation": "저기요, 저 이번 미팅에 늦으면 큰일 난다고요.",
    "prevContext": [
      "Fine. Just hurry. Please.",
      "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
      "See how the grips seem to be wearing down. It’s bad. If your hands slip off, that would be dangerous."
    ],
    "nextContext": [
      "Excuse me. Are you really listening?",
      "Wow, I can’t believe your bike only has five gears. I can show you a really nice 10 speed bike if you want to buy a new one.",
      "I don’t need a new bike. I need a new tire."
    ]
  },
  {
    "id": 256,
    "text": "Excuse me. Are you really listening?",
    "chunks": [
      "Excuse me. Are",
      "you really listening?"
    ],
    "translation": "실례지만 제 말 듣고는 계신가요?",
    "prevContext": [
      "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
      "See how the grips seem to be wearing down. It’s bad. If your hands slip off, that would be dangerous.",
      "Listen. I can’t be late to this meeting."
    ],
    "nextContext": [
      "Wow, I can’t believe your bike only has five gears. I can show you a really nice 10 speed bike if you want to buy a new one.",
      "I don’t need a new bike. I need a new tire.",
      "Okay. Fine."
    ]
  },
  {
    "id": 257,
    "text": "Wow, I can’t believe your bike only has five gears. I can show you a really nice 10 speed bike if you want to buy a new one.",
    "chunks": [
      "Wow, I can’t believe your bike only",
      "has five gears. I can show you",
      "a really nice 10 speed bike if",
      "you want to buy a new one."
    ],
    "translation": "기어가 5단밖에 안 되네요. 새로 사실 거면 근사한 10단 자전거 보여드릴 수 있는데.",
    "prevContext": [
      "See how the grips seem to be wearing down. It’s bad. If your hands slip off, that would be dangerous.",
      "Listen. I can’t be late to this meeting.",
      "Excuse me. Are you really listening?"
    ],
    "nextContext": [
      "I don’t need a new bike. I need a new tire.",
      "Okay. Fine.",
      "Sorry. I didn’t mean to yell."
    ]
  },
  {
    "id": 258,
    "text": "I don’t need a new bike. I need a new tire.",
    "chunks": [
      "I don’t need",
      "a new bike.",
      "I need a new tire."
    ],
    "translation": "새 자전거는 필요 없고요, 타이어만 갈아주시면 돼요.",
    "prevContext": [
      "Listen. I can’t be late to this meeting.",
      "Excuse me. Are you really listening?",
      "Wow, I can’t believe your bike only has five gears. I can show you a really nice 10 speed bike if you want to buy a new one."
    ],
    "nextContext": [
      "Okay. Fine.",
      "Sorry. I didn’t mean to yell.",
      "I’m running late for an appointment. Let me pay you for the tire, and I’ll come back later to discuss the other problems."
    ]
  },
  {
    "id": 259,
    "text": "Okay. Fine.",
    "chunks": [
      "Okay. Fine."
    ],
    "translation": "알겠어. 좋아.",
    "prevContext": [
      "Excuse me. Are you really listening?",
      "Wow, I can’t believe your bike only has five gears. I can show you a really nice 10 speed bike if you want to buy a new one.",
      "I don’t need a new bike. I need a new tire."
    ],
    "nextContext": [
      "Sorry. I didn’t mean to yell.",
      "I’m running late for an appointment. Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
      "Okay."
    ]
  },
  {
    "id": 260,
    "text": "Sorry. I didn’t mean to yell.",
    "chunks": [
      "Sorry. I didn’t",
      "mean to yell."
    ],
    "translation": "소리 질러서 죄송해요.",
    "prevContext": [
      "Wow, I can’t believe your bike only has five gears. I can show you a really nice 10 speed bike if you want to buy a new one.",
      "I don’t need a new bike. I need a new tire.",
      "Okay. Fine."
    ],
    "nextContext": [
      "I’m running late for an appointment. Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
      "Okay.",
      "It looks like your water glass is empty. Would you like me to fill it up?"
    ]
  },
  {
    "id": 261,
    "text": "I’m running late for an appointment. Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
    "chunks": [
      "I’m running late for an",
      "appointment. Let me pay you",
      "for the tire, and I’ll",
      "come back later to discuss the other problems."
    ],
    "translation": "약속 시간에 늦어서요. 타이어 비용만 먼저 내고 나중에 다시 올게요.",
    "prevContext": [
      "I don’t need a new bike. I need a new tire.",
      "Okay. Fine.",
      "Sorry. I didn’t mean to yell."
    ],
    "nextContext": [
      "Okay.",
      "It looks like your water glass is empty. Would you like me to fill it up?",
      "No, thank you. Where’s your business partner? She’s late."
    ]
  },
  {
    "id": 262,
    "text": "Okay.",
    "chunks": [
      "Okay."
    ],
    "translation": "알겠습니다.",
    "prevContext": [
      "Okay. Fine.",
      "Sorry. I didn’t mean to yell.",
      "I’m running late for an appointment. Let me pay you for the tire, and I’ll come back later to discuss the other problems."
    ],
    "nextContext": [
      "It looks like your water glass is empty. Would you like me to fill it up?",
      "No, thank you. Where’s your business partner? She’s late.",
      "Hey guys. I’m so sorry. I’m late."
    ]
  },
  {
    "id": 263,
    "text": "It looks like your water glass is empty. Would you like me to fill it up?",
    "chunks": [
      "It looks like your",
      "water glass is empty.",
      "Would you like me",
      "to fill it up?"
    ],
    "translation": "물잔이 빈 것 같네요. 더 채워드릴까요?",
    "prevContext": [
      "Sorry. I didn’t mean to yell.",
      "I’m running late for an appointment. Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
      "Okay."
    ],
    "nextContext": [
      "No, thank you. Where’s your business partner? She’s late.",
      "Hey guys. I’m so sorry. I’m late.",
      "Where were you?"
    ]
  },
  {
    "id": 264,
    "text": "No, thank you. Where’s your business partner? She’s late.",
    "chunks": [
      "No, thank you.",
      "Where’s your business",
      "partner? She’s late."
    ],
    "translation": "아닙니다. 그런데 동업자는 어디 있나요? 늦네요.",
    "prevContext": [
      "I’m running late for an appointment. Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
      "Okay.",
      "It looks like your water glass is empty. Would you like me to fill it up?"
    ],
    "nextContext": [
      "Hey guys. I’m so sorry. I’m late.",
      "Where were you?",
      "It’s fine. Great to see you Khae."
    ]
  },
  {
    "id": 265,
    "text": "Hey guys. I’m so sorry. I’m late.",
    "chunks": [
      "Hey guys. I’m",
      "so sorry. I’m late."
    ],
    "translation": "여러분 정말 죄송해요. 제가 늦었죠.",
    "prevContext": [
      "Okay.",
      "It looks like your water glass is empty. Would you like me to fill it up?",
      "No, thank you. Where’s your business partner? She’s late."
    ],
    "nextContext": [
      "Where were you?",
      "It’s fine. Great to see you Khae.",
      "I would like to go over the primary benefits of choosing me as your investor."
    ]
  },
  {
    "id": 266,
    "text": "Where were you?",
    "chunks": [
      "Where were you?"
    ],
    "translation": "어디 있었어?",
    "prevContext": [
      "It looks like your water glass is empty. Would you like me to fill it up?",
      "No, thank you. Where’s your business partner? She’s late.",
      "Hey guys. I’m so sorry. I’m late."
    ],
    "nextContext": [
      "It’s fine. Great to see you Khae.",
      "I would like to go over the primary benefits of choosing me as your investor.",
      "I want you to pick me as opposed to anyone else."
    ]
  },
  {
    "id": 267,
    "text": "It’s fine. Great to see you Khae.",
    "chunks": [
      "It’s fine. Great",
      "to see you Khae."
    ],
    "translation": "괜찮아. 반가워 카이.",
    "prevContext": [
      "No, thank you. Where’s your business partner? She’s late.",
      "Hey guys. I’m so sorry. I’m late.",
      "Where were you?"
    ],
    "nextContext": [
      "I would like to go over the primary benefits of choosing me as your investor.",
      "I want you to pick me as opposed to anyone else.",
      "I’m so excited you have a working prototype."
    ]
  },
  {
    "id": 268,
    "text": "I would like to go over the primary benefits of choosing me as your investor.",
    "chunks": [
      "I would like",
      "to go over",
      "the primary benefits",
      "of choosing me as your investor."
    ],
    "translation": "저를 투자자로 선택했을 때의 핵심 이점들을 설명해 드리고 싶어요.",
    "prevContext": [
      "Hey guys. I’m so sorry. I’m late.",
      "Where were you?",
      "It’s fine. Great to see you Khae."
    ],
    "nextContext": [
      "I want you to pick me as opposed to anyone else.",
      "I’m so excited you have a working prototype.",
      "Yes, so are we."
    ]
  },
  {
    "id": 269,
    "text": "I want you to pick me as opposed to anyone else.",
    "chunks": [
      "I want you",
      "to pick me",
      "as opposed to anyone else."
    ],
    "translation": "다른 누구보다 저를 선택해 주셨으면 합니다.",
    "prevContext": [
      "Where were you?",
      "It’s fine. Great to see you Khae.",
      "I would like to go over the primary benefits of choosing me as your investor."
    ],
    "nextContext": [
      "I’m so excited you have a working prototype.",
      "Yes, so are we.",
      "What’s the primary reason we should choose you as opposed to anyone else?"
    ]
  },
  {
    "id": 270,
    "text": "I’m so excited you have a working prototype.",
    "chunks": [
      "I’m so excited you",
      "have a working prototype."
    ],
    "translation": "작동하는 시제품이 있다는 소식에 정말 가슴이 뛰네요.",
    "prevContext": [
      "It’s fine. Great to see you Khae.",
      "I would like to go over the primary benefits of choosing me as your investor.",
      "I want you to pick me as opposed to anyone else."
    ],
    "nextContext": [
      "Yes, so are we.",
      "What’s the primary reason we should choose you as opposed to anyone else?",
      "You should let me invest in your company because of my enthusiasm and my commitment. The former reason will guarantee my excitement for your product doesn’t decrease. The latter will guarantee that we work together for a long time. I’m open to signing the contract."
    ]
  },
  {
    "id": 271,
    "text": "Yes, so are we.",
    "chunks": [
      "Yes, so are we."
    ],
    "translation": "네, 저희도 무척 기쁩니다.",
    "prevContext": [
      "I would like to go over the primary benefits of choosing me as your investor.",
      "I want you to pick me as opposed to anyone else.",
      "I’m so excited you have a working prototype."
    ],
    "nextContext": [
      "What’s the primary reason we should choose you as opposed to anyone else?",
      "You should let me invest in your company because of my enthusiasm and my commitment. The former reason will guarantee my excitement for your product doesn’t decrease. The latter will guarantee that we work together for a long time. I’m open to signing the contract.",
      "I like that."
    ]
  },
  {
    "id": 272,
    "text": "What’s the primary reason we should choose you as opposed to anyone else?",
    "chunks": [
      "What’s the primary reason",
      "we should choose you",
      "as opposed to anyone else?"
    ],
    "translation": "저희가 다른 투자자 대신 당신을 택해야 하는 주된 이유가 뭘까요?",
    "prevContext": [
      "I want you to pick me as opposed to anyone else.",
      "I’m so excited you have a working prototype.",
      "Yes, so are we."
    ],
    "nextContext": [
      "You should let me invest in your company because of my enthusiasm and my commitment. The former reason will guarantee my excitement for your product doesn’t decrease. The latter will guarantee that we work together for a long time. I’m open to signing the contract.",
      "I like that.",
      "In contrast with other investors, I want to be really involved with every aspect of the company from developing the marketing strategy to hiring new employees."
    ]
  },
  {
    "id": 273,
    "text": "You should let me invest in your company because of my enthusiasm and my commitment. The former reason will guarantee my excitement for your product doesn’t decrease. The latter will guarantee that we work together for a long time. I’m open to signing the contract.",
    "chunks": [
      "You should let me invest in your company because of my",
      "enthusiasm and my commitment. The former reason will guarantee my excitement",
      "for your product doesn’t decrease. The latter will guarantee that we",
      "work together for a long time. I’m open to signing the contract."
    ],
    "translation": "제 열정과 헌신 때문입니다. 열정은 제품에 대한 기대를 유지시키고, 헌신은 오랜 협력을 보장할 것입니다.",
    "prevContext": [
      "I’m so excited you have a working prototype.",
      "Yes, so are we.",
      "What’s the primary reason we should choose you as opposed to anyone else?"
    ],
    "nextContext": [
      "I like that.",
      "In contrast with other investors, I want to be really involved with every aspect of the company from developing the marketing strategy to hiring new employees.",
      "I want to be there."
    ]
  },
  {
    "id": 274,
    "text": "I like that.",
    "chunks": [
      "I like that."
    ],
    "translation": "마음에 드네요.",
    "prevContext": [
      "Yes, so are we.",
      "What’s the primary reason we should choose you as opposed to anyone else?",
      "You should let me invest in your company because of my enthusiasm and my commitment. The former reason will guarantee my excitement for your product doesn’t decrease. The latter will guarantee that we work together for a long time. I’m open to signing the contract."
    ],
    "nextContext": [
      "In contrast with other investors, I want to be really involved with every aspect of the company from developing the marketing strategy to hiring new employees.",
      "I want to be there.",
      "That’s interesting. We’ll consider that."
    ]
  },
  {
    "id": 275,
    "text": "In contrast with other investors, I want to be really involved with every aspect of the company from developing the marketing strategy to hiring new employees.",
    "chunks": [
      "In contrast with other investors, I",
      "want to be really involved with",
      "every aspect of the company from",
      "developing the marketing strategy to hiring new employees."
    ],
    "translation": "다른 투자자들과 달리 마케팅부터 채용까지 회사의 모든 분야에 적극 참여하고 싶습니다.",
    "prevContext": [
      "What’s the primary reason we should choose you as opposed to anyone else?",
      "You should let me invest in your company because of my enthusiasm and my commitment. The former reason will guarantee my excitement for your product doesn’t decrease. The latter will guarantee that we work together for a long time. I’m open to signing the contract.",
      "I like that."
    ],
    "nextContext": [
      "I want to be there.",
      "That’s interesting. We’ll consider that.",
      "In conclusion, I can double what any other investor offers. That’s how much I want to work with you."
    ]
  },
  {
    "id": 276,
    "text": "I want to be there.",
    "chunks": [
      "I want",
      "to be there."
    ],
    "translation": "늘 함께하고 싶어요.",
    "prevContext": [
      "You should let me invest in your company because of my enthusiasm and my commitment. The former reason will guarantee my excitement for your product doesn’t decrease. The latter will guarantee that we work together for a long time. I’m open to signing the contract.",
      "I like that.",
      "In contrast with other investors, I want to be really involved with every aspect of the company from developing the marketing strategy to hiring new employees."
    ],
    "nextContext": [
      "That’s interesting. We’ll consider that.",
      "In conclusion, I can double what any other investor offers. That’s how much I want to work with you.",
      "Wow. Okay."
    ]
  },
  {
    "id": 277,
    "text": "That’s interesting. We’ll consider that.",
    "chunks": [
      "That’s interesting.",
      "We’ll consider that."
    ],
    "translation": "흥미롭군요. 긍정적으로 검토하겠습니다.",
    "prevContext": [
      "I like that.",
      "In contrast with other investors, I want to be really involved with every aspect of the company from developing the marketing strategy to hiring new employees.",
      "I want to be there."
    ],
    "nextContext": [
      "In conclusion, I can double what any other investor offers. That’s how much I want to work with you.",
      "Wow. Okay.",
      "Please. Let me invest in your company."
    ]
  },
  {
    "id": 278,
    "text": "In conclusion, I can double what any other investor offers. That’s how much I want to work with you.",
    "chunks": [
      "In conclusion, I can",
      "double what any other",
      "investor offers. That’s how",
      "much I want to work with you."
    ],
    "translation": "결론적으로, 다른 투자자가 부른 금액의 2배를 투자하겠습니다. 그만큼 함께하고 싶어요.",
    "prevContext": [
      "In contrast with other investors, I want to be really involved with every aspect of the company from developing the marketing strategy to hiring new employees.",
      "I want to be there.",
      "That’s interesting. We’ll consider that."
    ],
    "nextContext": [
      "Wow. Okay.",
      "Please. Let me invest in your company.",
      "Thank you for your interest in the People company. We’ll review your materials and contact you soon."
    ]
  },
  {
    "id": 279,
    "text": "Wow. Okay.",
    "chunks": [
      "Wow. Okay."
    ],
    "translation": "와우, 좋습니다.",
    "prevContext": [
      "I want to be there.",
      "That’s interesting. We’ll consider that.",
      "In conclusion, I can double what any other investor offers. That’s how much I want to work with you."
    ],
    "nextContext": [
      "Please. Let me invest in your company.",
      "Thank you for your interest in the People company. We’ll review your materials and contact you soon.",
      "Thank you!"
    ]
  },
  {
    "id": 280,
    "text": "Please. Let me invest in your company.",
    "chunks": [
      "Please. Let me",
      "invest in your company."
    ],
    "translation": "부디 여러분의 회사에 투자할 수 있게 해주세요.",
    "prevContext": [
      "That’s interesting. We’ll consider that.",
      "In conclusion, I can double what any other investor offers. That’s how much I want to work with you.",
      "Wow. Okay."
    ],
    "nextContext": [
      "Thank you for your interest in the People company. We’ll review your materials and contact you soon.",
      "Thank you!",
      "Every investor we meet wants to work with us."
    ]
  },
  {
    "id": 281,
    "text": "Thank you for your interest in the People company. We’ll review your materials and contact you soon.",
    "chunks": [
      "Thank you for your",
      "interest in the People",
      "company. We’ll review your",
      "materials and contact you soon."
    ],
    "translation": "저희 회사에 관심 가져주셔서 감사합니다. 검토 후 곧 연락드리겠습니다.",
    "prevContext": [
      "In conclusion, I can double what any other investor offers. That’s how much I want to work with you.",
      "Wow. Okay.",
      "Please. Let me invest in your company."
    ],
    "nextContext": [
      "Thank you!",
      "Every investor we meet wants to work with us.",
      "We’re going to be rich Marco."
    ]
  },
  {
    "id": 282,
    "text": "Thank you!",
    "chunks": [
      "Thank you!"
    ],
    "translation": "감사합니다!",
    "prevContext": [
      "Wow. Okay.",
      "Please. Let me invest in your company.",
      "Thank you for your interest in the People company. We’ll review your materials and contact you soon."
    ],
    "nextContext": [
      "Every investor we meet wants to work with us.",
      "We’re going to be rich Marco.",
      "I’ve always wanted to go on a long cruise."
    ]
  },
  {
    "id": 283,
    "text": "Every investor we meet wants to work with us.",
    "chunks": [
      "Every investor we",
      "meet wants to",
      "work with us."
    ],
    "translation": "만나는 투자자마다 우리와 일하고 싶어 안달이야.",
    "prevContext": [
      "Please. Let me invest in your company.",
      "Thank you for your interest in the People company. We’ll review your materials and contact you soon.",
      "Thank you!"
    ],
    "nextContext": [
      "We’re going to be rich Marco.",
      "I’ve always wanted to go on a long cruise.",
      "Maybe we can go on one of those cruises that travels around the world."
    ]
  },
  {
    "id": 284,
    "text": "We’re going to be rich Marco.",
    "chunks": [
      "We’re going to",
      "be rich Marco."
    ],
    "translation": "우리 부자 될 거야 마르코.",
    "prevContext": [
      "Thank you for your interest in the People company. We’ll review your materials and contact you soon.",
      "Thank you!",
      "Every investor we meet wants to work with us."
    ],
    "nextContext": [
      "I’ve always wanted to go on a long cruise.",
      "Maybe we can go on one of those cruises that travels around the world.",
      "I love that idea."
    ]
  },
  {
    "id": 285,
    "text": "I’ve always wanted to go on a long cruise.",
    "chunks": [
      "I’ve always wanted",
      "to go on",
      "a long cruise."
    ],
    "translation": "난 늘 호화 크루즈 여행을 떠나고 싶었어.",
    "prevContext": [
      "Thank you!",
      "Every investor we meet wants to work with us.",
      "We’re going to be rich Marco."
    ],
    "nextContext": [
      "Maybe we can go on one of those cruises that travels around the world.",
      "I love that idea.",
      "I can imagine it now. You and I get dropped off by our ship to go backpacking down the coast of South America."
    ]
  },
  {
    "id": 286,
    "text": "Maybe we can go on one of those cruises that travels around the world.",
    "chunks": [
      "Maybe we can",
      "go on one",
      "of those cruises",
      "that travels around the world."
    ],
    "translation": "세계일주 크루즈 여행을 떠날 수도 있겠지.",
    "prevContext": [
      "Every investor we meet wants to work with us.",
      "We’re going to be rich Marco.",
      "I’ve always wanted to go on a long cruise."
    ],
    "nextContext": [
      "I love that idea.",
      "I can imagine it now. You and I get dropped off by our ship to go backpacking down the coast of South America.",
      "I always dreamed of going on a hiking expedition through the Himalayas."
    ]
  },
  {
    "id": 287,
    "text": "I love that idea.",
    "chunks": [
      "I love that idea."
    ],
    "translation": "그 생각 너무 좋다.",
    "prevContext": [
      "We’re going to be rich Marco.",
      "I’ve always wanted to go on a long cruise.",
      "Maybe we can go on one of those cruises that travels around the world."
    ],
    "nextContext": [
      "I can imagine it now. You and I get dropped off by our ship to go backpacking down the coast of South America.",
      "I always dreamed of going on a hiking expedition through the Himalayas.",
      "I hear the views from the mountains are breathtaking."
    ]
  },
  {
    "id": 288,
    "text": "I can imagine it now. You and I get dropped off by our ship to go backpacking down the coast of South America.",
    "chunks": [
      "I can imagine it now.",
      "You and I get dropped",
      "off by our ship to",
      "go backpacking down the coast of South America."
    ],
    "translation": "크루즈에서 내려 남미 해안을 따라 배낭여행하는 상상이 돼.",
    "prevContext": [
      "I’ve always wanted to go on a long cruise.",
      "Maybe we can go on one of those cruises that travels around the world.",
      "I love that idea."
    ],
    "nextContext": [
      "I always dreamed of going on a hiking expedition through the Himalayas.",
      "I hear the views from the mountains are breathtaking.",
      "However, we haven’t received a check yet."
    ]
  },
  {
    "id": 289,
    "text": "I always dreamed of going on a hiking expedition through the Himalayas.",
    "chunks": [
      "I always dreamed of",
      "going on a hiking",
      "expedition through the Himalayas."
    ],
    "translation": "난 늘 히말라야 트레킹 원정을 꿈꿨어.",
    "prevContext": [
      "Maybe we can go on one of those cruises that travels around the world.",
      "I love that idea.",
      "I can imagine it now. You and I get dropped off by our ship to go backpacking down the coast of South America."
    ],
    "nextContext": [
      "I hear the views from the mountains are breathtaking.",
      "However, we haven’t received a check yet.",
      "So for now, we’ll have to settle for a day trip because there’s still a lot of work to do."
    ]
  },
  {
    "id": 290,
    "text": "I hear the views from the mountains are breathtaking.",
    "chunks": [
      "I hear the",
      "views from the",
      "mountains are breathtaking."
    ],
    "translation": "산에서 바라보는 절경이 숨 막히게 아름답다고 하더라고.",
    "prevContext": [
      "I love that idea.",
      "I can imagine it now. You and I get dropped off by our ship to go backpacking down the coast of South America.",
      "I always dreamed of going on a hiking expedition through the Himalayas."
    ],
    "nextContext": [
      "However, we haven’t received a check yet.",
      "So for now, we’ll have to settle for a day trip because there’s still a lot of work to do.",
      "Good point. Maybe we can go biking out into the countryside tomorrow."
    ]
  },
  {
    "id": 291,
    "text": "However, we haven’t received a check yet.",
    "chunks": [
      "However, we haven’t",
      "received a check yet."
    ],
    "translation": "하지만 아직 입금된 수표는 없잖아.",
    "prevContext": [
      "I can imagine it now. You and I get dropped off by our ship to go backpacking down the coast of South America.",
      "I always dreamed of going on a hiking expedition through the Himalayas.",
      "I hear the views from the mountains are breathtaking."
    ],
    "nextContext": [
      "So for now, we’ll have to settle for a day trip because there’s still a lot of work to do.",
      "Good point. Maybe we can go biking out into the countryside tomorrow.",
      "I don’t know if I want to go biking again for a while."
    ]
  },
  {
    "id": 292,
    "text": "So for now, we’ll have to settle for a day trip because there’s still a lot of work to do.",
    "chunks": [
      "So for now, we’ll have",
      "to settle for a day",
      "trip because there’s still a",
      "lot of work to do."
    ],
    "translation": "그러니 지금은 할 일이 많으니 당일치기 여행으로 만족해야 해.",
    "prevContext": [
      "I always dreamed of going on a hiking expedition through the Himalayas.",
      "I hear the views from the mountains are breathtaking.",
      "However, we haven’t received a check yet."
    ],
    "nextContext": [
      "Good point. Maybe we can go biking out into the countryside tomorrow.",
      "I don’t know if I want to go biking again for a while.",
      "My last expedition through the city didn’t turn out so well."
    ]
  },
  {
    "id": 293,
    "text": "Good point. Maybe we can go biking out into the countryside tomorrow.",
    "chunks": [
      "Good point. Maybe we",
      "can go biking out",
      "into the countryside tomorrow."
    ],
    "translation": "맞는 말이야. 내일 근교 시골로 자전거 타러 갈까?",
    "prevContext": [
      "I hear the views from the mountains are breathtaking.",
      "However, we haven’t received a check yet.",
      "So for now, we’ll have to settle for a day trip because there’s still a lot of work to do."
    ],
    "nextContext": [
      "I don’t know if I want to go biking again for a while.",
      "My last expedition through the city didn’t turn out so well.",
      "Well, maybe after we choose an investor we can take a business trip to various parts of the country to find a manufacturing plant."
    ]
  },
  {
    "id": 294,
    "text": "I don’t know if I want to go biking again for a while.",
    "chunks": [
      "I don’t know if",
      "I want to go",
      "biking again for a while."
    ],
    "translation": "당분간은 자전거 타고 싶지 않은데.",
    "prevContext": [
      "However, we haven’t received a check yet.",
      "So for now, we’ll have to settle for a day trip because there’s still a lot of work to do.",
      "Good point. Maybe we can go biking out into the countryside tomorrow."
    ],
    "nextContext": [
      "My last expedition through the city didn’t turn out so well.",
      "Well, maybe after we choose an investor we can take a business trip to various parts of the country to find a manufacturing plant.",
      "That sounds fun. Let’s build a manufacturing plant by a beach."
    ]
  },
  {
    "id": 295,
    "text": "My last expedition through the city didn’t turn out so well.",
    "chunks": [
      "My last expedition",
      "through the city",
      "didn’t turn out so well."
    ],
    "translation": "지난번 도심 라이딩 원정이 영 엉망이었거든.",
    "prevContext": [
      "So for now, we’ll have to settle for a day trip because there’s still a lot of work to do.",
      "Good point. Maybe we can go biking out into the countryside tomorrow.",
      "I don’t know if I want to go biking again for a while."
    ],
    "nextContext": [
      "Well, maybe after we choose an investor we can take a business trip to various parts of the country to find a manufacturing plant.",
      "That sounds fun. Let’s build a manufacturing plant by a beach.",
      "Deal. This time tomorrow, we’ll be working with an investor."
    ]
  },
  {
    "id": 296,
    "text": "Well, maybe after we choose an investor we can take a business trip to various parts of the country to find a manufacturing plant.",
    "chunks": [
      "Well, maybe after we choose an",
      "investor we can take a business",
      "trip to various parts of the",
      "country to find a manufacturing plant."
    ],
    "translation": "투자자 결정하고 나면 제조 공장 알아보러 전국 출장이나 다녀오자.",
    "prevContext": [
      "Good point. Maybe we can go biking out into the countryside tomorrow.",
      "I don’t know if I want to go biking again for a while.",
      "My last expedition through the city didn’t turn out so well."
    ],
    "nextContext": [
      "That sounds fun. Let’s build a manufacturing plant by a beach.",
      "Deal. This time tomorrow, we’ll be working with an investor.",
      "I can’t wait. This is what we always want to see Marco."
    ]
  },
  {
    "id": 297,
    "text": "That sounds fun. Let’s build a manufacturing plant by a beach.",
    "chunks": [
      "That sounds fun.",
      "Let’s build a",
      "manufacturing plant by a beach."
    ],
    "translation": "재밌겠다! 해변가에 공장을 짓자.",
    "prevContext": [
      "I don’t know if I want to go biking again for a while.",
      "My last expedition through the city didn’t turn out so well.",
      "Well, maybe after we choose an investor we can take a business trip to various parts of the country to find a manufacturing plant."
    ],
    "nextContext": [
      "Deal. This time tomorrow, we’ll be working with an investor.",
      "I can’t wait. This is what we always want to see Marco.",
      "I know."
    ]
  },
  {
    "id": 298,
    "text": "Deal. This time tomorrow, we’ll be working with an investor.",
    "chunks": [
      "Deal. This time",
      "tomorrow, we’ll be",
      "working with an investor."
    ],
    "translation": "좋았어. 내일 이맘때면 투자자와 계약 완료했을 거야.",
    "prevContext": [
      "My last expedition through the city didn’t turn out so well.",
      "Well, maybe after we choose an investor we can take a business trip to various parts of the country to find a manufacturing plant.",
      "That sounds fun. Let’s build a manufacturing plant by a beach."
    ],
    "nextContext": [
      "I can’t wait. This is what we always want to see Marco.",
      "I know.",
      "I’ll be dropping my bike off at the shop at 5pm tomorrow. After that, we should celebrate."
    ]
  },
  {
    "id": 299,
    "text": "I can’t wait. This is what we always want to see Marco.",
    "chunks": [
      "I can’t wait. This",
      "is what we always",
      "want to see Marco."
    ],
    "translation": "너무 기대돼. 우리가 늘 바랐던 순간이잖아 마르코.",
    "prevContext": [
      "Well, maybe after we choose an investor we can take a business trip to various parts of the country to find a manufacturing plant.",
      "That sounds fun. Let’s build a manufacturing plant by a beach.",
      "Deal. This time tomorrow, we’ll be working with an investor."
    ],
    "nextContext": [
      "I know.",
      "I’ll be dropping my bike off at the shop at 5pm tomorrow. After that, we should celebrate.",
      "I don’t know. We have a lot of work to do."
    ]
  },
  {
    "id": 300,
    "text": "I know.",
    "chunks": [
      "I know."
    ],
    "translation": "그러게 말이야.",
    "prevContext": [
      "That sounds fun. Let’s build a manufacturing plant by a beach.",
      "Deal. This time tomorrow, we’ll be working with an investor.",
      "I can’t wait. This is what we always want to see Marco."
    ],
    "nextContext": [
      "I’ll be dropping my bike off at the shop at 5pm tomorrow. After that, we should celebrate.",
      "I don’t know. We have a lot of work to do.",
      "What’s the point of starting a business if we can’t have a little fun?"
    ]
  },
  {
    "id": 301,
    "text": "I’ll be dropping my bike off at the shop at 5pm tomorrow. After that, we should celebrate.",
    "chunks": [
      "I’ll be dropping my",
      "bike off at the",
      "shop at 5pm tomorrow.",
      "After that, we should celebrate."
    ],
    "translation": "내일 오후 5시에 자전거 맡기고 나서 파티하자.",
    "prevContext": [
      "Deal. This time tomorrow, we’ll be working with an investor.",
      "I can’t wait. This is what we always want to see Marco.",
      "I know."
    ],
    "nextContext": [
      "I don’t know. We have a lot of work to do.",
      "What’s the point of starting a business if we can’t have a little fun?",
      "I’ll be getting up very early on Saturday to review the job applications we received."
    ]
  },
  {
    "id": 302,
    "text": "I don’t know. We have a lot of work to do.",
    "chunks": [
      "I don’t know.",
      "We have a",
      "lot of work to do."
    ],
    "translation": "글쎄, 아직 할 일이 태산인걸.",
    "prevContext": [
      "I can’t wait. This is what we always want to see Marco.",
      "I know.",
      "I’ll be dropping my bike off at the shop at 5pm tomorrow. After that, we should celebrate."
    ],
    "nextContext": [
      "What’s the point of starting a business if we can’t have a little fun?",
      "I’ll be getting up very early on Saturday to review the job applications we received.",
      "I can’t celebrate with you Khae."
    ]
  },
  {
    "id": 303,
    "text": "What’s the point of starting a business if we can’t have a little fun?",
    "chunks": [
      "What’s the point",
      "of starting a",
      "business if we",
      "can’t have a little fun?"
    ],
    "translation": "즐기지도 못할 거면 창업은 왜 하니?",
    "prevContext": [
      "I know.",
      "I’ll be dropping my bike off at the shop at 5pm tomorrow. After that, we should celebrate.",
      "I don’t know. We have a lot of work to do."
    ],
    "nextContext": [
      "I’ll be getting up very early on Saturday to review the job applications we received.",
      "I can’t celebrate with you Khae.",
      "I understand. No problem."
    ]
  },
  {
    "id": 304,
    "text": "I’ll be getting up very early on Saturday to review the job applications we received.",
    "chunks": [
      "I’ll be getting",
      "up very early",
      "on Saturday to",
      "review the job applications we received."
    ],
    "translation": "난 토요일 아침 일찍 입사지원서들 검토해야 해.",
    "prevContext": [
      "I’ll be dropping my bike off at the shop at 5pm tomorrow. After that, we should celebrate.",
      "I don’t know. We have a lot of work to do.",
      "What’s the point of starting a business if we can’t have a little fun?"
    ],
    "nextContext": [
      "I can’t celebrate with you Khae.",
      "I understand. No problem.",
      "This time tomorrow, I’ll be celebrating by myself."
    ]
  },
  {
    "id": 305,
    "text": "I can’t celebrate with you Khae.",
    "chunks": [
      "I can’t celebrate",
      "with you Khae."
    ],
    "translation": "파티는 같이 못 하겠어 카이.",
    "prevContext": [
      "I don’t know. We have a lot of work to do.",
      "What’s the point of starting a business if we can’t have a little fun?",
      "I’ll be getting up very early on Saturday to review the job applications we received."
    ],
    "nextContext": [
      "I understand. No problem.",
      "This time tomorrow, I’ll be celebrating by myself.",
      "Sounds like a plan."
    ]
  },
  {
    "id": 306,
    "text": "I understand. No problem.",
    "chunks": [
      "I understand. No problem."
    ],
    "translation": "제공해주신 대화 문장입니다.",
    "prevContext": [
      "What’s the point of starting a business if we can’t have a little fun?",
      "I’ll be getting up very early on Saturday to review the job applications we received.",
      "I can’t celebrate with you Khae."
    ],
    "nextContext": [
      "This time tomorrow, I’ll be celebrating by myself.",
      "Sounds like a plan.",
      "Do you want to review the selection criteria for these investors?"
    ]
  },
  {
    "id": 307,
    "text": "This time tomorrow, I’ll be celebrating by myself.",
    "chunks": [
      "This time tomorrow,",
      "I’ll be celebrating by myself."
    ],
    "translation": "내일 이맘때 나 혼자 축배를 들고 있겠네.",
    "prevContext": [
      "I’ll be getting up very early on Saturday to review the job applications we received.",
      "I can’t celebrate with you Khae.",
      "I understand. No problem."
    ],
    "nextContext": [
      "Sounds like a plan.",
      "Do you want to review the selection criteria for these investors?",
      "I thought you’d never ask."
    ]
  },
  {
    "id": 308,
    "text": "Sounds like a plan.",
    "chunks": [
      "Sounds like a plan."
    ],
    "translation": "좋은 계획이야.",
    "prevContext": [
      "I can’t celebrate with you Khae.",
      "I understand. No problem.",
      "This time tomorrow, I’ll be celebrating by myself."
    ],
    "nextContext": [
      "Do you want to review the selection criteria for these investors?",
      "I thought you’d never ask.",
      "Where are we going to go on our big trip this year?"
    ]
  },
  {
    "id": 309,
    "text": "Do you want to review the selection criteria for these investors?",
    "chunks": [
      "Do you want",
      "to review the",
      "selection criteria for these investors?"
    ],
    "translation": "투자자 심사 기준 다시 점검해 볼래?",
    "prevContext": [
      "I understand. No problem.",
      "This time tomorrow, I’ll be celebrating by myself.",
      "Sounds like a plan."
    ],
    "nextContext": [
      "I thought you’d never ask.",
      "Where are we going to go on our big trip this year?",
      "Kate, wouldn’t it be relaxing to go on a cruise?"
    ]
  },
  {
    "id": 310,
    "text": "I thought you’d never ask.",
    "chunks": [
      "I thought",
      "you’d never ask."
    ],
    "translation": "그 말 안 나오나 기다리고 있었어.",
    "prevContext": [
      "This time tomorrow, I’ll be celebrating by myself.",
      "Sounds like a plan.",
      "Do you want to review the selection criteria for these investors?"
    ],
    "nextContext": [
      "Where are we going to go on our big trip this year?",
      "Kate, wouldn’t it be relaxing to go on a cruise?",
      "I don’t know, Josh. It sounds kind of boring. I don’t think I want to spend a lot of time on a ship."
    ]
  },
  {
    "id": 311,
    "text": "Where are we going to go on our big trip this year?",
    "chunks": [
      "Where are we going",
      "to go on our",
      "big trip this year?"
    ],
    "translation": "올해 우리 대망의 휴가는 어디로 갈까?",
    "prevContext": [
      "Sounds like a plan.",
      "Do you want to review the selection criteria for these investors?",
      "I thought you’d never ask."
    ],
    "nextContext": [
      "Kate, wouldn’t it be relaxing to go on a cruise?",
      "I don’t know, Josh. It sounds kind of boring. I don’t think I want to spend a lot of time on a ship.",
      "Well, we could go on a cruise that stops at some islands. I’d like to go to the beach and relax by the ocean. Wouldn’t you?"
    ]
  },
  {
    "id": 312,
    "text": "Kate, wouldn’t it be relaxing to go on a cruise?",
    "chunks": [
      "Kate, wouldn’t it",
      "be relaxing to",
      "go on a cruise?"
    ],
    "translation": "케이트, 편안하게 크루즈 여행 가는 건 어때?",
    "prevContext": [
      "Do you want to review the selection criteria for these investors?",
      "I thought you’d never ask.",
      "Where are we going to go on our big trip this year?"
    ],
    "nextContext": [
      "I don’t know, Josh. It sounds kind of boring. I don’t think I want to spend a lot of time on a ship.",
      "Well, we could go on a cruise that stops at some islands. I’d like to go to the beach and relax by the ocean. Wouldn’t you?",
      "You know, I think I’d rather do something more adventurous. Don’t you think Machu Picchu would be amazing?"
    ]
  },
  {
    "id": 313,
    "text": "I don’t know, Josh. It sounds kind of boring. I don’t think I want to spend a lot of time on a ship.",
    "chunks": [
      "I don’t know, Josh. It",
      "sounds kind of boring. I",
      "don’t think I want to",
      "spend a lot of time on a ship."
    ],
    "translation": "글쎄 조쉬, 지루할 것 같아. 배 위에서 오랜 시간을 보내고 싶진 않아.",
    "prevContext": [
      "I thought you’d never ask.",
      "Where are we going to go on our big trip this year?",
      "Kate, wouldn’t it be relaxing to go on a cruise?"
    ],
    "nextContext": [
      "Well, we could go on a cruise that stops at some islands. I’d like to go to the beach and relax by the ocean. Wouldn’t you?",
      "You know, I think I’d rather do something more adventurous. Don’t you think Machu Picchu would be amazing?",
      "Wow, Machu Picchu? Yeah, that would be amazing to see. It looks stunning in all of the pictures I’ve seen."
    ]
  },
  {
    "id": 314,
    "text": "Well, we could go on a cruise that stops at some islands. I’d like to go to the beach and relax by the ocean. Wouldn’t you?",
    "chunks": [
      "Well, we could go on a",
      "cruise that stops at some islands.",
      "I’d like to go to the",
      "beach and relax by the ocean. Wouldn’t you?"
    ],
    "translation": "섬들을 들르는 코스로 가면 해변에서 바다 보며 쉴 수 있잖아. 안 그래?",
    "prevContext": [
      "Where are we going to go on our big trip this year?",
      "Kate, wouldn’t it be relaxing to go on a cruise?",
      "I don’t know, Josh. It sounds kind of boring. I don’t think I want to spend a lot of time on a ship."
    ],
    "nextContext": [
      "You know, I think I’d rather do something more adventurous. Don’t you think Machu Picchu would be amazing?",
      "Wow, Machu Picchu? Yeah, that would be amazing to see. It looks stunning in all of the pictures I’ve seen.",
      "I know, and there are some great hiking expeditions that leave from Cusco. Don’t you agree that it would be exciting to hike on the Inca Trail?"
    ]
  },
  {
    "id": 315,
    "text": "You know, I think I’d rather do something more adventurous. Don’t you think Machu Picchu would be amazing?",
    "chunks": [
      "You know, I think",
      "I’d rather do something",
      "more adventurous. Don’t you",
      "think Machu Picchu would be amazing?"
    ],
    "translation": "난 좀 더 모험적인 걸 하고 싶어. 마추픽추 가면 정말 멋지지 않을까?",
    "prevContext": [
      "Kate, wouldn’t it be relaxing to go on a cruise?",
      "I don’t know, Josh. It sounds kind of boring. I don’t think I want to spend a lot of time on a ship.",
      "Well, we could go on a cruise that stops at some islands. I’d like to go to the beach and relax by the ocean. Wouldn’t you?"
    ],
    "nextContext": [
      "Wow, Machu Picchu? Yeah, that would be amazing to see. It looks stunning in all of the pictures I’ve seen.",
      "I know, and there are some great hiking expeditions that leave from Cusco. Don’t you agree that it would be exciting to hike on the Inca Trail?",
      "I don’t know. How long does it take?"
    ]
  },
  {
    "id": 316,
    "text": "Wow, Machu Picchu? Yeah, that would be amazing to see. It looks stunning in all of the pictures I’ve seen.",
    "chunks": [
      "Wow, Machu Picchu? Yeah, that",
      "would be amazing to see.",
      "It looks stunning in all",
      "of the pictures I’ve seen."
    ],
    "translation": "와, 마추픽추? 사진으로 봤을 때도 엄청 멋지긴 하더라.",
    "prevContext": [
      "I don’t know, Josh. It sounds kind of boring. I don’t think I want to spend a lot of time on a ship.",
      "Well, we could go on a cruise that stops at some islands. I’d like to go to the beach and relax by the ocean. Wouldn’t you?",
      "You know, I think I’d rather do something more adventurous. Don’t you think Machu Picchu would be amazing?"
    ],
    "nextContext": [
      "I know, and there are some great hiking expeditions that leave from Cusco. Don’t you agree that it would be exciting to hike on the Inca Trail?",
      "I don’t know. How long does it take?",
      "It’s about a four-day trek. You go with a guide, hike during the day, and stay in tents at night. I’ve heard the view is breathtaking when you finally get to Machu Picchu."
    ]
  },
  {
    "id": 317,
    "text": "I know, and there are some great hiking expeditions that leave from Cusco. Don’t you agree that it would be exciting to hike on the Inca Trail?",
    "chunks": [
      "I know, and there are some",
      "great hiking expeditions that leave from",
      "Cusco. Don’t you agree that it",
      "would be exciting to hike on the Inca Trail?"
    ],
    "translation": "쿠스코에서 출발하는 잉카 트레일 트레킹 코스가 얼마나 흥미진진한데!",
    "prevContext": [
      "Well, we could go on a cruise that stops at some islands. I’d like to go to the beach and relax by the ocean. Wouldn’t you?",
      "You know, I think I’d rather do something more adventurous. Don’t you think Machu Picchu would be amazing?",
      "Wow, Machu Picchu? Yeah, that would be amazing to see. It looks stunning in all of the pictures I’ve seen."
    ],
    "nextContext": [
      "I don’t know. How long does it take?",
      "It’s about a four-day trek. You go with a guide, hike during the day, and stay in tents at night. I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
      "Well, to be honest, that sounds like a lot of work. I was looking forward to something a little more laid-back."
    ]
  },
  {
    "id": 318,
    "text": "I don’t know. How long does it take?",
    "chunks": [
      "I don’t know. How",
      "long does it take?"
    ],
    "translation": "글쎄, 걷는 데 며칠이나 걸리는데?",
    "prevContext": [
      "You know, I think I’d rather do something more adventurous. Don’t you think Machu Picchu would be amazing?",
      "Wow, Machu Picchu? Yeah, that would be amazing to see. It looks stunning in all of the pictures I’ve seen.",
      "I know, and there are some great hiking expeditions that leave from Cusco. Don’t you agree that it would be exciting to hike on the Inca Trail?"
    ],
    "nextContext": [
      "It’s about a four-day trek. You go with a guide, hike during the day, and stay in tents at night. I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
      "Well, to be honest, that sounds like a lot of work. I was looking forward to something a little more laid-back.",
      "Come on. We can relax at home. I feel like we need a real adventure, don’t you?"
    ]
  },
  {
    "id": 319,
    "text": "It’s about a four-day trek. You go with a guide, hike during the day, and stay in tents at night. I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
    "chunks": [
      "It’s about a four-day trek. You go with",
      "a guide, hike during the day, and stay",
      "in tents at night. I’ve heard the view",
      "is breathtaking when you finally get to Machu Picchu."
    ],
    "translation": "4일 정도 트레킹해. 가이드랑 걷고 밤엔 텐트에서 자는 거지. 마추픽추 도착할 때의 경치는 환상적이래.",
    "prevContext": [
      "Wow, Machu Picchu? Yeah, that would be amazing to see. It looks stunning in all of the pictures I’ve seen.",
      "I know, and there are some great hiking expeditions that leave from Cusco. Don’t you agree that it would be exciting to hike on the Inca Trail?",
      "I don’t know. How long does it take?"
    ],
    "nextContext": [
      "Well, to be honest, that sounds like a lot of work. I was looking forward to something a little more laid-back.",
      "Come on. We can relax at home. I feel like we need a real adventure, don’t you?",
      "I guess so. Maybe we can compromise. Don’t you think that’s a good idea?"
    ]
  },
  {
    "id": 320,
    "text": "Well, to be honest, that sounds like a lot of work. I was looking forward to something a little more laid-back.",
    "chunks": [
      "Well, to be honest, that",
      "sounds like a lot of",
      "work. I was looking forward",
      "to something a little more laid-back."
    ],
    "translation": "솔직히 너무 힘들 것 같아. 난 좀 더 여유롭고 느긋한 휴가를 기대했거든.",
    "prevContext": [
      "I know, and there are some great hiking expeditions that leave from Cusco. Don’t you agree that it would be exciting to hike on the Inca Trail?",
      "I don’t know. How long does it take?",
      "It’s about a four-day trek. You go with a guide, hike during the day, and stay in tents at night. I’ve heard the view is breathtaking when you finally get to Machu Picchu."
    ],
    "nextContext": [
      "Come on. We can relax at home. I feel like we need a real adventure, don’t you?",
      "I guess so. Maybe we can compromise. Don’t you think that’s a good idea?",
      "Sure, I’m willing to compromise. What did you have in mind?"
    ]
  },
  {
    "id": 321,
    "text": "Come on. We can relax at home. I feel like we need a real adventure, don’t you?",
    "chunks": [
      "Come on. We can",
      "relax at home. I",
      "feel like we need",
      "a real adventure, don’t you?"
    ],
    "translation": "휴식은 집에서도 되잖아. 우리에겐 진짜 모험이 필요해!",
    "prevContext": [
      "I don’t know. How long does it take?",
      "It’s about a four-day trek. You go with a guide, hike during the day, and stay in tents at night. I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
      "Well, to be honest, that sounds like a lot of work. I was looking forward to something a little more laid-back."
    ],
    "nextContext": [
      "I guess so. Maybe we can compromise. Don’t you think that’s a good idea?",
      "Sure, I’m willing to compromise. What did you have in mind?",
      "I’ll go to Machu Picchu as long as we can take the train instead of hiking to the site."
    ]
  },
  {
    "id": 322,
    "text": "I guess so. Maybe we can compromise. Don’t you think that’s a good idea?",
    "chunks": [
      "I guess so.",
      "Maybe we can",
      "compromise. Don’t you",
      "think that’s a good idea?"
    ],
    "translation": "그렇긴 하네. 그럼 서로 절충안을 찾아보는 건 어때?",
    "prevContext": [
      "It’s about a four-day trek. You go with a guide, hike during the day, and stay in tents at night. I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
      "Well, to be honest, that sounds like a lot of work. I was looking forward to something a little more laid-back.",
      "Come on. We can relax at home. I feel like we need a real adventure, don’t you?"
    ],
    "nextContext": [
      "Sure, I’m willing to compromise. What did you have in mind?",
      "I’ll go to Machu Picchu as long as we can take the train instead of hiking to the site.",
      "That’s reasonable, isn’t it? Sure, we can do that. If we take the train, can we do some day hikes while we’re at Machu Picchu?"
    ]
  },
  {
    "id": 323,
    "text": "Sure, I’m willing to compromise. What did you have in mind?",
    "chunks": [
      "Sure, I’m willing",
      "to compromise. What",
      "did you have in mind?"
    ],
    "translation": "좋아, 기꺼이 타협하지. 생각해 둔 게 있어?",
    "prevContext": [
      "Well, to be honest, that sounds like a lot of work. I was looking forward to something a little more laid-back.",
      "Come on. We can relax at home. I feel like we need a real adventure, don’t you?",
      "I guess so. Maybe we can compromise. Don’t you think that’s a good idea?"
    ],
    "nextContext": [
      "I’ll go to Machu Picchu as long as we can take the train instead of hiking to the site.",
      "That’s reasonable, isn’t it? Sure, we can do that. If we take the train, can we do some day hikes while we’re at Machu Picchu?",
      "That sounds good to me. And if we take the train, we’ll have more time in Cusco."
    ]
  },
  {
    "id": 324,
    "text": "I’ll go to Machu Picchu as long as we can take the train instead of hiking to the site.",
    "chunks": [
      "I’ll go to Machu",
      "Picchu as long as",
      "we can take the",
      "train instead of hiking to the site."
    ],
    "translation": "걸어 올라가는 대신 기차 타고 마추픽추에 간다면 나도 찬성할게.",
    "prevContext": [
      "Come on. We can relax at home. I feel like we need a real adventure, don’t you?",
      "I guess so. Maybe we can compromise. Don’t you think that’s a good idea?",
      "Sure, I’m willing to compromise. What did you have in mind?"
    ],
    "nextContext": [
      "That’s reasonable, isn’t it? Sure, we can do that. If we take the train, can we do some day hikes while we’re at Machu Picchu?",
      "That sounds good to me. And if we take the train, we’ll have more time in Cusco.",
      "That would be nice, wouldn’t it?"
    ]
  },
  {
    "id": 325,
    "text": "That’s reasonable, isn’t it? Sure, we can do that. If we take the train, can we do some day hikes while we’re at Machu Picchu?",
    "chunks": [
      "That’s reasonable, isn’t it? Sure, we",
      "can do that. If we take",
      "the train, can we do some",
      "day hikes while we’re at Machu Picchu?"
    ],
    "translation": "합리적이네 좋아! 대신 마추픽추 주변에서 가벼운 당일 하이킹은 해도 되지?",
    "prevContext": [
      "I guess so. Maybe we can compromise. Don’t you think that’s a good idea?",
      "Sure, I’m willing to compromise. What did you have in mind?",
      "I’ll go to Machu Picchu as long as we can take the train instead of hiking to the site."
    ],
    "nextContext": [
      "That sounds good to me. And if we take the train, we’ll have more time in Cusco.",
      "That would be nice, wouldn’t it?",
      "That’s a good point. There are some amazing markets in Cusco."
    ]
  },
  {
    "id": 326,
    "text": "That sounds good to me. And if we take the train, we’ll have more time in Cusco.",
    "chunks": [
      "That sounds good to",
      "me. And if we",
      "take the train, we’ll",
      "have more time in Cusco."
    ],
    "translation": "그건 좋아. 기차 타면 쿠스코에 머물 시간도 더 생기겠네.",
    "prevContext": [
      "Sure, I’m willing to compromise. What did you have in mind?",
      "I’ll go to Machu Picchu as long as we can take the train instead of hiking to the site.",
      "That’s reasonable, isn’t it? Sure, we can do that. If we take the train, can we do some day hikes while we’re at Machu Picchu?"
    ],
    "nextContext": [
      "That would be nice, wouldn’t it?",
      "That’s a good point. There are some amazing markets in Cusco.",
      "If I agree not to hike, will you go shopping with me in Cusco?"
    ]
  },
  {
    "id": 327,
    "text": "That would be nice, wouldn’t it?",
    "chunks": [
      "That would be nice,",
      "wouldn’t it?"
    ],
    "translation": "그거 참 좋겠다, 그렇지?",
    "prevContext": [
      "I’ll go to Machu Picchu as long as we can take the train instead of hiking to the site.",
      "That’s reasonable, isn’t it? Sure, we can do that. If we take the train, can we do some day hikes while we’re at Machu Picchu?",
      "That sounds good to me. And if we take the train, we’ll have more time in Cusco."
    ],
    "nextContext": [
      "That’s a good point. There are some amazing markets in Cusco.",
      "If I agree not to hike, will you go shopping with me in Cusco?",
      "Shopping? I hate shopping, but I’ll go with you if you promise we can relax a little bit on vacation. I mean, we’re so busy with work all the time. Wouldn’t it be nice to do something relaxing?"
    ]
  },
  {
    "id": 328,
    "text": "That’s a good point. There are some amazing markets in Cusco.",
    "chunks": [
      "That’s a good",
      "point. There are",
      "some amazing markets in Cusco."
    ],
    "translation": "맞는 말이야. 쿠스코에 정말 멋진 전통 시장들이 많거든.",
    "prevContext": [
      "That’s reasonable, isn’t it? Sure, we can do that. If we take the train, can we do some day hikes while we’re at Machu Picchu?",
      "That sounds good to me. And if we take the train, we’ll have more time in Cusco.",
      "That would be nice, wouldn’t it?"
    ],
    "nextContext": [
      "If I agree not to hike, will you go shopping with me in Cusco?",
      "Shopping? I hate shopping, but I’ll go with you if you promise we can relax a little bit on vacation. I mean, we’re so busy with work all the time. Wouldn’t it be nice to do something relaxing?",
      "Okay, okay. If you do some day hikes with me and go shopping in Cusco, maybe we could go to the beach at the end of the trip. How about that?"
    ]
  },
  {
    "id": 329,
    "text": "If I agree not to hike, will you go shopping with me in Cusco?",
    "chunks": [
      "If I agree",
      "not to hike,",
      "will you go",
      "shopping with me in Cusco?"
    ],
    "translation": "내가 등산 안 하는 대신 쿠스코에서 나랑 쇼핑 같이 해줄래?",
    "prevContext": [
      "That sounds good to me. And if we take the train, we’ll have more time in Cusco.",
      "That would be nice, wouldn’t it?",
      "That’s a good point. There are some amazing markets in Cusco."
    ],
    "nextContext": [
      "Shopping? I hate shopping, but I’ll go with you if you promise we can relax a little bit on vacation. I mean, we’re so busy with work all the time. Wouldn’t it be nice to do something relaxing?",
      "Okay, okay. If you do some day hikes with me and go shopping in Cusco, maybe we could go to the beach at the end of the trip. How about that?",
      "That sounds like a perfect plan. There are some beautiful beaches on the coast of Peru. We could try surfing, rent a boat, or go fishing."
    ]
  },
  {
    "id": 330,
    "text": "Shopping? I hate shopping, but I’ll go with you if you promise we can relax a little bit on vacation. I mean, we’re so busy with work all the time. Wouldn’t it be nice to do something relaxing?",
    "chunks": [
      "Shopping? I hate shopping, but I’ll go with you",
      "if you promise we can relax a little bit",
      "on vacation. I mean, we’re so busy with work",
      "all the time. Wouldn’t it be nice to do something relaxing?"
    ],
    "translation": "쇼핑 질색이지만 갈게. 대신 휴가 때 푹 쉬게 해준다고 약속해.",
    "prevContext": [
      "That would be nice, wouldn’t it?",
      "That’s a good point. There are some amazing markets in Cusco.",
      "If I agree not to hike, will you go shopping with me in Cusco?"
    ],
    "nextContext": [
      "Okay, okay. If you do some day hikes with me and go shopping in Cusco, maybe we could go to the beach at the end of the trip. How about that?",
      "That sounds like a perfect plan. There are some beautiful beaches on the coast of Peru. We could try surfing, rent a boat, or go fishing.",
      "And I’m only going if we can relax on the beach — you know, sitting in the sun, reading, and napping."
    ]
  },
  {
    "id": 331,
    "text": "Okay, okay. If you do some day hikes with me and go shopping in Cusco, maybe we could go to the beach at the end of the trip. How about that?",
    "chunks": [
      "Okay, okay. If you do some day",
      "hikes with me and go shopping in",
      "Cusco, maybe we could go to the",
      "beach at the end of the trip. How about that?"
    ],
    "translation": "알았어, 일정 마지막엔 해변으로 가자. 어때?",
    "prevContext": [
      "That’s a good point. There are some amazing markets in Cusco.",
      "If I agree not to hike, will you go shopping with me in Cusco?",
      "Shopping? I hate shopping, but I’ll go with you if you promise we can relax a little bit on vacation. I mean, we’re so busy with work all the time. Wouldn’t it be nice to do something relaxing?"
    ],
    "nextContext": [
      "That sounds like a perfect plan. There are some beautiful beaches on the coast of Peru. We could try surfing, rent a boat, or go fishing.",
      "And I’m only going if we can relax on the beach — you know, sitting in the sun, reading, and napping.",
      "You can do that for a day or two, can’t you?"
    ]
  },
  {
    "id": 332,
    "text": "That sounds like a perfect plan. There are some beautiful beaches on the coast of Peru. We could try surfing, rent a boat, or go fishing.",
    "chunks": [
      "That sounds like a perfect plan.",
      "There are some beautiful beaches on",
      "the coast of Peru. We could",
      "try surfing, rent a boat, or go fishing."
    ],
    "translation": "완벽한 계획이다! 페루 해안에서 서핑도 하고 배도 타자.",
    "prevContext": [
      "If I agree not to hike, will you go shopping with me in Cusco?",
      "Shopping? I hate shopping, but I’ll go with you if you promise we can relax a little bit on vacation. I mean, we’re so busy with work all the time. Wouldn’t it be nice to do something relaxing?",
      "Okay, okay. If you do some day hikes with me and go shopping in Cusco, maybe we could go to the beach at the end of the trip. How about that?"
    ],
    "nextContext": [
      "And I’m only going if we can relax on the beach — you know, sitting in the sun, reading, and napping.",
      "You can do that for a day or two, can’t you?",
      "Yes, I suppose. If you can go shopping, I can relax for a few days."
    ]
  },
  {
    "id": 333,
    "text": "And I’m only going if we can relax on the beach — you know, sitting in the sun, reading, and napping.",
    "chunks": [
      "And I’m only going if",
      "we can relax on the",
      "beach — you know, sitting",
      "in the sun, reading, and napping."
    ],
    "translation": "난 해변에서 햇살 받으며 책 읽고 낮잠 잘 수 있을 때만 갈 거야.",
    "prevContext": [
      "Shopping? I hate shopping, but I’ll go with you if you promise we can relax a little bit on vacation. I mean, we’re so busy with work all the time. Wouldn’t it be nice to do something relaxing?",
      "Okay, okay. If you do some day hikes with me and go shopping in Cusco, maybe we could go to the beach at the end of the trip. How about that?",
      "That sounds like a perfect plan. There are some beautiful beaches on the coast of Peru. We could try surfing, rent a boat, or go fishing."
    ],
    "nextContext": [
      "You can do that for a day or two, can’t you?",
      "Yes, I suppose. If you can go shopping, I can relax for a few days."
    ]
  },
  {
    "id": 334,
    "text": "You can do that for a day or two, can’t you?",
    "chunks": [
      "You can do",
      "that for a",
      "day or two, can’t you?"
    ],
    "translation": "하루이틀 정도는 그렇게 해줄 수 있지?",
    "prevContext": [
      "Okay, okay. If you do some day hikes with me and go shopping in Cusco, maybe we could go to the beach at the end of the trip. How about that?",
      "That sounds like a perfect plan. There are some beautiful beaches on the coast of Peru. We could try surfing, rent a boat, or go fishing.",
      "And I’m only going if we can relax on the beach — you know, sitting in the sun, reading, and napping."
    ],
    "nextContext": [
      "Yes, I suppose. If you can go shopping, I can relax for a few days."
    ]
  },
  {
    "id": 335,
    "text": "Yes, I suppose. If you can go shopping, I can relax for a few days.",
    "chunks": [
      "Yes, I suppose.",
      "If you can",
      "go shopping, I",
      "can relax for a few days."
    ],
    "translation": "응 그럴게. 네가 쇼핑해 주면 나도 며칠 쉴 수 있으니까.",
    "prevContext": [
      "That sounds like a perfect plan. There are some beautiful beaches on the coast of Peru. We could try surfing, rent a boat, or go fishing.",
      "And I’m only going if we can relax on the beach — you know, sitting in the sun, reading, and napping.",
      "You can do that for a day or two, can’t you?"
    ],
    "nextContext": []
  }
];

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

const generateLocalFeedback = (target, spoken) => {
  let normTarget = cleanText(target);
  let normSpoken = cleanText(spoken);
  
  const targetWordsRaw = normTarget.split(' ').filter(Boolean);
  const spokenWordsRaw = normSpoken.split(' ').filter(Boolean);
  
  // 단어별 발음 대조 마크업 생성
  let markedSpokenHtml = "";
  let tIdx = 0;
  let sIdx = 0;
  
  while (sIdx < spokenWordsRaw.length || tIdx < targetWordsRaw.length) {
    if (sIdx >= spokenWordsRaw.length) {
      markedSpokenHtml += `<span class="text-rose-400 font-bold line-through ml-1">[누락: ${targetWordsRaw[tIdx]}]</span> `;
      tIdx++;
    } else if (tIdx >= targetWordsRaw.length) {
      markedSpokenHtml += `<span class="text-rose-400 font-bold underline decoration-rose-500/50 decoration-2 underline-offset-4 ml-1">${spokenWordsRaw[sIdx]}</span> `;
      sIdx++;
    } else if (spokenWordsRaw[sIdx] === targetWordsRaw[tIdx]) {
      markedSpokenHtml += `<span class="text-emerald-400 font-semibold ml-1">${spokenWordsRaw[sIdx]}</span> `;
      sIdx++;
      tIdx++;
    } else {
      if (targetWordsRaw.slice(tIdx, tIdx + 3).includes(spokenWordsRaw[sIdx])) {
        markedSpokenHtml += `<span class="text-rose-400 font-bold line-through ml-1">[누락: ${targetWordsRaw[tIdx]}]</span> `;
        tIdx++;
      } else if (spokenWordsRaw.slice(sIdx, sIdx + 3).includes(targetWordsRaw[tIdx])) {
        markedSpokenHtml += `<span class="text-rose-400 font-bold underline decoration-rose-500/50 decoration-2 underline-offset-4 ml-1">${spokenWordsRaw[sIdx]}</span> `;
        sIdx++;
      } else {
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

  // 발음 허용 기준 완화 (핵심 단어 65% 이상 또는 오류 1단어 이내 통과)
  if (missingWords.length + substituted.length <= 1 || accuracyRatio >= 0.65) {
    return { isPerfect: true, message: "🎉 훌륭합니다! 핵심 대사의 호흡과 발음이 자연스럽게 통과되었습니다." };
  }

  if (substituted.length > 0) {
    return {
      isPerfect: false,
      message: `${substituted.slice(0, 2).join(', ')}을(를) 말씀하셨습니다. 청크를 터치해 발음을 다시 듣고 도전해 보세요!`,
      markedSpoken
    };
  }

  if (missingWords.length > 0) {
    return {
      isPerfect: false,
      message: `${missingWords.slice(0, 2).join(', ')} 단어가 빠졌습니다. 문장 끝까지 호흡을 유지해 보세요.`,
      markedSpoken
    };
  }

  if (extraWords.length > 0) {
    return {
      isPerfect: false,
      message: `원문에 없는 '${extraWords.slice(0, 2).join("', '")}' 단어가 감지되었습니다.`,
      markedSpoken
    };
  }

  return {
    isPerfect: false,
    message: "아주 근접했습니다! 조금 더 또렷하게 다시 발음해 보세요.",
    markedSpoken
  };
};

export default function EnglishTutorApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHintText, setShowHintText] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(0.85);
  const [playingChunkIdx, setPlayingChunkIdx] = useState(null);

  const displayItem = UNIT61_DATABASE[currentIndex] || UNIT61_DATABASE[0];

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  
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
      evaluateSpeech(finalSpoken, displayItem.text);
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
  }, [displayItem.text]);

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
      const localResult = generateLocalFeedback(targetText, spokenText);
      setIsPerfect(localResult.isPerfect);
      setEvaluation(localResult.message);
      if (localResult.markedSpoken) {
        setMarkedSpoken(localResult.markedSpoken);
      }
    } catch (err) {
      setEvaluation("발음을 인식했습니다. 다시 한번 또렷하게 시도해 보세요!");
    } finally {
      setIsEvaluating(false);
    }
  };

  // 다음 문장 전환 (오류 없이 안정적으로 인덱스 증가)
  const handleNextSentence = () => {
    setUserSpeech("");
    setRecordedAudioUrl(null);
    setEvaluation(null);
    setIsPerfect(false);
    setMarkedSpoken("");
    setErrorMsg("");

    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      userAudioPlayerRef.current.currentTime = 0;
    }

    setCurrentIndex((prev) => (prev + 1) % UNIT61_DATABASE.length);
  };

  // 이전 문장 전환
  const handlePrevSentence = () => {
    setUserSpeech("");
    setRecordedAudioUrl(null);
    setEvaluation(null);
    setIsPerfect(false);
    setMarkedSpoken("");
    setErrorMsg("");

    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      userAudioPlayerRef.current.currentTime = 0;
    }

    setCurrentIndex((prev) => (prev - 1 + UNIT61_DATABASE.length) % UNIT61_DATABASE.length);
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
        
        {/* 상단 컨트롤 바 */}
        <div className="bg-slate-900 border-b border-slate-800/80 px-3.5 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h1 className="font-bold text-sm text-white tracking-tight">Unit 61 Study</h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300">
                #{currentIndex + 1} / {UNIT61_DATABASE.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* 이전/다음 빠른 이동 미니 버튼 */}
              <button
                onClick={handlePrevSentence}
                title="이전 문장"
                className="p-1 rounded text-slate-400 hover:text-white bg-slate-800 border border-slate-700 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextSentence}
                title="다음 문장"
                className="p-1 rounded text-slate-400 hover:text-white bg-slate-800 border border-slate-700 active:scale-95 transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* 속도 토글 */}
              <button
                onClick={() => setSpeechSpeed(s => s === 0.7 ? 0.85 : s === 0.85 ? 1.0 : 0.7)}
                className="px-2 py-1 rounded text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
              >
                {speechSpeed === 0.7 ? '0.7x' : speechSpeed === 0.85 ? '0.85x' : '1.0x'}
              </button>
            </div>
          </div>
        </div>

        {/* 메인 섀도잉 및 피드백 통합 영역 */}
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

            {/* 청크 블록 (자연스러운 1~4청크 구성 / 터치 시 해당 청크 개별 발음) */}
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
                    className={`flex-1 min-w-[80px] py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer active:scale-95 group ${
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

            {/* 전후 문맥 2-3문장 및 현재 원문 하이라이트 표시 박스 */}
            {showHintText && (
              <div className="mt-2 p-3 rounded-xl bg-slate-900/95 border border-slate-800 text-left w-full text-xs flex flex-col gap-1.5 shadow-inner">
                {/* 앞 2~3문장 (문맥 파악용 흐린 텍스트) */}
                {displayItem.prevContext && displayItem.prevContext.map((c, i) => (
                  <p key={`prev-${i}`} className="text-slate-500 leading-relaxed text-[11px] sm:text-xs">
                    {c}
                  </p>
                ))}
                
                {/* 현재 연습 타겟 문장 (색상 다르게 하이라이트 + 한글 해석) */}
                <div className="my-1 p-2.5 rounded-lg bg-indigo-950/80 border-l-4 border-indigo-400 pl-3">
                  <p className="font-bold text-indigo-100 text-xs sm:text-sm leading-snug">
                    {displayItem.text}
                  </p>
                  {displayItem.translation && (
                    <p className="text-[11px] sm:text-xs text-indigo-300/80 mt-1 leading-snug">
                      {displayItem.translation}
                    </p>
                  )}
                </div>
                
                {/* 뒤 2~3문장 (문맥 파악용 흐린 텍스트) */}
                {displayItem.nextContext && displayItem.nextContext.map((c, i) => (
                  <p key={`next-${i}`} className="text-slate-500 leading-relaxed text-[11px] sm:text-xs">
                    {c}
                  </p>
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
              <span>{isPlayingAudio ? "재생 중" : "원어민 듣기"}</span>
            </button>

            <button
              type="button"
              onClick={handleNextSentence}
              className="py-2.5 px-2 rounded-xl font-bold text-[11px] sm:text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <span>다음 문장</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
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
              <span>{isRecording ? "말씀 완료" : "따라 말하기"}</span>
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

              {/* 튜터 피드백 */}
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
