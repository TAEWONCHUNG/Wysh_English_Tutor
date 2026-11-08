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

// Unit 61 실전 스피킹 최적화 데이터베이스 (엄선된 대화 문장 및 전후 문맥 포함)
const UNIT61_DATABASE = [
  {
    "id": 1,
    "text": "Is this really my dressing room?",
    "chunks": [
      "Is this really",
      "my dressing room?"
    ],
    "translation": "여기가 정말 제 분장실인가요?",
    "prevContext": [],
    "nextContext": [
      "I should’ve come to Los Angeles sooner.",
      "You shouldn’t have jumped on the couch.",
      "Hi, I’m Jimmy, the stunt coordinator for the series."
    ]
  },
  {
    "id": 2,
    "text": "I should’ve come to Los Angeles sooner.",
    "chunks": [
      "I should’ve come",
      "to Los Angeles sooner."
    ],
    "translation": "진작 로스앤젤레스에 왔어야 했어요.",
    "prevContext": [
      "Is this really my dressing room?"
    ],
    "nextContext": [
      "You shouldn’t have jumped on the couch.",
      "Hi, I’m Jimmy, the stunt coordinator for the series.",
      "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife."
    ]
  },
  {
    "id": 3,
    "text": "You shouldn’t have jumped on the couch.",
    "chunks": [
      "You shouldn’t have jumped",
      "on the couch."
    ],
    "translation": "소파 위에서 뛰지 말았어야죠.",
    "prevContext": [
      "Is this really my dressing room?",
      "I should’ve come to Los Angeles sooner."
    ],
    "nextContext": [
      "Hi, I’m Jimmy, the stunt coordinator for the series.",
      "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
      "Would you mind coming outside so I can become familiar with your stunt experience?"
    ]
  },
  {
    "id": 4,
    "text": "Hi, I’m Jimmy, the stunt coordinator for the series.",
    "chunks": [
      "Hi, I’m Jimmy, the stunt coordinator",
      "for the series."
    ],
    "translation": "안녕하세요, 저는 이 시리즈의 스턴트 코디네이터 지미입니다.",
    "prevContext": [
      "Is this really my dressing room?",
      "I should’ve come to Los Angeles sooner.",
      "You shouldn’t have jumped on the couch."
    ],
    "nextContext": [
      "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
      "Would you mind coming outside so I can become familiar with your stunt experience?",
      "There are several explosions and fight scenes in this episode."
    ]
  },
  {
    "id": 5,
    "text": "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
    "chunks": [
      "Oh hello,",
      "I’m Shen,",
      "a recruiting cast member on the hit medical show under the knife."
    ],
    "translation": "아 안녕하세요, 인기 메디컬 드라마에 새로 합류한 배우 션입니다.",
    "prevContext": [
      "I should’ve come to Los Angeles sooner.",
      "You shouldn’t have jumped on the couch.",
      "Hi, I’m Jimmy, the stunt coordinator for the series."
    ],
    "nextContext": [
      "Would you mind coming outside so I can become familiar with your stunt experience?",
      "There are several explosions and fight scenes in this episode.",
      "I wasn’t told about any stunts."
    ]
  },
  {
    "id": 6,
    "text": "Would you mind coming outside so I can become familiar with your stunt experience?",
    "chunks": [
      "Would you mind coming",
      "outside so I can become",
      "familiar with your stunt experience?"
    ],
    "translation": "스턴트 경험을 좀 파악하게 밖으로 나와 주시겠어요?",
    "prevContext": [
      "You shouldn’t have jumped on the couch.",
      "Hi, I’m Jimmy, the stunt coordinator for the series.",
      "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife."
    ],
    "nextContext": [
      "There are several explosions and fight scenes in this episode.",
      "I wasn’t told about any stunts.",
      "It’s not my job to communicate that information."
    ]
  },
  {
    "id": 7,
    "text": "There are several explosions and fight scenes in this episode.",
    "chunks": [
      "There are several explosions",
      "and fight scenes",
      "in this episode."
    ],
    "translation": "이번 에피소드에 폭발 장면과 격투 씬이 몇 개 있거든요.",
    "prevContext": [
      "Hi, I’m Jimmy, the stunt coordinator for the series.",
      "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
      "Would you mind coming outside so I can become familiar with your stunt experience?"
    ],
    "nextContext": [
      "I wasn’t told about any stunts.",
      "It’s not my job to communicate that information.",
      "You should’ve read the script."
    ]
  },
  {
    "id": 8,
    "text": "I wasn’t told about any stunts.",
    "chunks": [
      "I wasn’t told",
      "about any stunts."
    ],
    "translation": "스턴트에 대해선 전혀 들은 바가 없어요.",
    "prevContext": [
      "Oh hello, I’m Shen, a recruiting cast member on the hit medical show under the knife.",
      "Would you mind coming outside so I can become familiar with your stunt experience?",
      "There are several explosions and fight scenes in this episode."
    ],
    "nextContext": [
      "It’s not my job to communicate that information.",
      "You should’ve read the script.",
      "They gave it to me an hour ago."
    ]
  },
  {
    "id": 9,
    "text": "It’s not my job to communicate that information.",
    "chunks": [
      "It’s not my job",
      "to communicate that information."
    ],
    "translation": "그런 정보를 전달하는 건 제 업무가 아닙니다.",
    "prevContext": [
      "Would you mind coming outside so I can become familiar with your stunt experience?",
      "There are several explosions and fight scenes in this episode.",
      "I wasn’t told about any stunts."
    ],
    "nextContext": [
      "You should’ve read the script.",
      "They gave it to me an hour ago.",
      "I’m going to see how skilled you are at stunts."
    ]
  },
  {
    "id": 10,
    "text": "You should’ve read the script.",
    "chunks": [
      "You should’ve read",
      "the script."
    ],
    "translation": "대본을 미리 읽어보셨어야죠.",
    "prevContext": [
      "There are several explosions and fight scenes in this episode.",
      "I wasn’t told about any stunts.",
      "It’s not my job to communicate that information."
    ],
    "nextContext": [
      "They gave it to me an hour ago.",
      "I’m going to see how skilled you are at stunts.",
      "Then, teach you what you need to learn."
    ]
  },
  {
    "id": 11,
    "text": "They gave it to me an hour ago.",
    "chunks": [
      "They gave it",
      "to me an hour ago."
    ],
    "translation": "한 시간 전에야 대본을 줬다고요.",
    "prevContext": [
      "I wasn’t told about any stunts.",
      "It’s not my job to communicate that information.",
      "You should’ve read the script."
    ],
    "nextContext": [
      "I’m going to see how skilled you are at stunts.",
      "Then, teach you what you need to learn.",
      "With every stunt, one mistake could cause injury or even death."
    ]
  },
  {
    "id": 12,
    "text": "I’m going to see how skilled you are at stunts.",
    "chunks": [
      "I’m going",
      "to see",
      "how skilled you are at stunts."
    ],
    "translation": "스턴트 실력이 어느 정도인지 한번 보겠습니다.",
    "prevContext": [
      "It’s not my job to communicate that information.",
      "You should’ve read the script.",
      "They gave it to me an hour ago."
    ],
    "nextContext": [
      "Then, teach you what you need to learn.",
      "With every stunt, one mistake could cause injury or even death.",
      "Sir, I’m an experienced actor, and I’ll be fine."
    ]
  },
  {
    "id": 13,
    "text": "Then, teach you what you need to learn.",
    "chunks": [
      "Then, teach you",
      "what you need to learn."
    ],
    "translation": "그러고 나서 배워야 할 것들을 가르쳐 드리죠.",
    "prevContext": [
      "You should’ve read the script.",
      "They gave it to me an hour ago.",
      "I’m going to see how skilled you are at stunts."
    ],
    "nextContext": [
      "With every stunt, one mistake could cause injury or even death.",
      "Sir, I’m an experienced actor, and I’ll be fine.",
      "But, I’ll take this very seriously."
    ]
  },
  {
    "id": 14,
    "text": "With every stunt, one mistake could cause injury or even death.",
    "chunks": [
      "With every stunt,",
      "one mistake could cause injury or even death."
    ],
    "translation": "모든 스턴트는 사소한 실수 하나로 부상이나 사망에 이를 수 있습니다.",
    "prevContext": [
      "They gave it to me an hour ago.",
      "I’m going to see how skilled you are at stunts.",
      "Then, teach you what you need to learn."
    ],
    "nextContext": [
      "Sir, I’m an experienced actor, and I’ll be fine.",
      "But, I’ll take this very seriously.",
      "How high can you jump?"
    ]
  },
  {
    "id": 15,
    "text": "Sir, I’m an experienced actor, and I’ll be fine.",
    "chunks": [
      "Sir, I’m an experienced actor,",
      "and I’ll be fine."
    ],
    "translation": "선생님, 전 경험 많은 배우라 괜찮을 겁니다.",
    "prevContext": [
      "I’m going to see how skilled you are at stunts.",
      "Then, teach you what you need to learn.",
      "With every stunt, one mistake could cause injury or even death."
    ],
    "nextContext": [
      "But, I’ll take this very seriously.",
      "How high can you jump?",
      "This is worse than I thought."
    ]
  },
  {
    "id": 16,
    "text": "But, I’ll take this very seriously.",
    "chunks": [
      "But, I’ll take",
      "this very seriously."
    ],
    "translation": "하지만 매우 진지하게 임하겠습니다.",
    "prevContext": [
      "Then, teach you what you need to learn.",
      "With every stunt, one mistake could cause injury or even death.",
      "Sir, I’m an experienced actor, and I’ll be fine."
    ],
    "nextContext": [
      "How high can you jump?",
      "This is worse than I thought.",
      "Can you throw yourself through a brick wall?"
    ]
  },
  {
    "id": 17,
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
      "This is worse than I thought.",
      "Can you throw yourself through a brick wall?",
      "I usually try to avoid brick walls rather than throw myself into them."
    ]
  },
  {
    "id": 18,
    "text": "This is worse than I thought.",
    "chunks": [
      "This is worse",
      "than I thought."
    ],
    "translation": "생각했던 것보다 더 심각하네요.",
    "prevContext": [
      "Sir, I’m an experienced actor, and I’ll be fine.",
      "But, I’ll take this very seriously.",
      "How high can you jump?"
    ],
    "nextContext": [
      "Can you throw yourself through a brick wall?",
      "I usually try to avoid brick walls rather than throw myself into them.",
      "I’ve never thrown myself into a brick wall."
    ]
  },
  {
    "id": 19,
    "text": "Can you throw yourself through a brick wall?",
    "chunks": [
      "Can you",
      "throw yourself",
      "through a brick wall?"
    ],
    "translation": "벽돌 벽을 뚫고 몸을 날릴 수 있나요?",
    "prevContext": [
      "But, I’ll take this very seriously.",
      "How high can you jump?",
      "This is worse than I thought."
    ],
    "nextContext": [
      "I usually try to avoid brick walls rather than throw myself into them.",
      "I’ve never thrown myself into a brick wall.",
      "Are you sure this is necessary?"
    ]
  },
  {
    "id": 20,
    "text": "I usually try to avoid brick walls rather than throw myself into them.",
    "chunks": [
      "I usually try to",
      "avoid brick walls rather",
      "than throw myself into them."
    ],
    "translation": "전 보통 벽돌 벽에 몸을 던지기보단 피하려고 하는데요.",
    "prevContext": [
      "How high can you jump?",
      "This is worse than I thought.",
      "Can you throw yourself through a brick wall?"
    ],
    "nextContext": [
      "I’ve never thrown myself into a brick wall.",
      "Are you sure this is necessary?",
      "How should I do this?"
    ]
  },
  {
    "id": 21,
    "text": "I’ve never thrown myself into a brick wall.",
    "chunks": [
      "I’ve never",
      "thrown myself",
      "into a brick wall."
    ],
    "translation": "벽돌 벽에 몸을 던져본 적은 한 번도 없습니다.",
    "prevContext": [
      "This is worse than I thought.",
      "Can you throw yourself through a brick wall?",
      "I usually try to avoid brick walls rather than throw myself into them."
    ],
    "nextContext": [
      "Are you sure this is necessary?",
      "How should I do this?",
      "Crush down before you dive into it."
    ]
  },
  {
    "id": 22,
    "text": "Are you sure this is necessary?",
    "chunks": [
      "Are you sure",
      "this is necessary?"
    ],
    "translation": "이게 정말 꼭 필요한 훈련인가요?",
    "prevContext": [
      "Can you throw yourself through a brick wall?",
      "I usually try to avoid brick walls rather than throw myself into them.",
      "I’ve never thrown myself into a brick wall."
    ],
    "nextContext": [
      "How should I do this?",
      "Crush down before you dive into it.",
      "An actor should never be afraid."
    ]
  },
  {
    "id": 23,
    "text": "How should I do this?",
    "chunks": [
      "How should",
      "I do this?"
    ],
    "translation": "제가 이걸 어떻게 해야 하죠?",
    "prevContext": [
      "I usually try to avoid brick walls rather than throw myself into them.",
      "I’ve never thrown myself into a brick wall.",
      "Are you sure this is necessary?"
    ],
    "nextContext": [
      "Crush down before you dive into it.",
      "An actor should never be afraid.",
      "You didn’t break the wall."
    ]
  },
  {
    "id": 24,
    "text": "Crush down before you dive into it.",
    "chunks": [
      "Crush down",
      "before you dive into it."
    ],
    "translation": "다이빙하기 전에 몸을 웅크리세요.",
    "prevContext": [
      "I’ve never thrown myself into a brick wall.",
      "Are you sure this is necessary?",
      "How should I do this?"
    ],
    "nextContext": [
      "An actor should never be afraid.",
      "You didn’t break the wall.",
      "You could’ve told me it was made of real bricks."
    ]
  },
  {
    "id": 25,
    "text": "An actor should never be afraid.",
    "chunks": [
      "An actor should",
      "never be afraid."
    ],
    "translation": "배우는 결코 두려워해선 안 됩니다.",
    "prevContext": [
      "Are you sure this is necessary?",
      "How should I do this?",
      "Crush down before you dive into it."
    ],
    "nextContext": [
      "You didn’t break the wall.",
      "You could’ve told me it was made of real bricks.",
      "You need to attempt to do the next task."
    ]
  },
  {
    "id": 26,
    "text": "You didn’t break the wall.",
    "chunks": [
      "You didn’t break",
      "the wall."
    ],
    "translation": "벽을 부수지 못했잖아요.",
    "prevContext": [
      "How should I do this?",
      "Crush down before you dive into it.",
      "An actor should never be afraid."
    ],
    "nextContext": [
      "You could’ve told me it was made of real bricks.",
      "You need to attempt to do the next task.",
      "Are you going to make me smash into the wall again?"
    ]
  },
  {
    "id": 27,
    "text": "You could’ve told me it was made of real bricks.",
    "chunks": [
      "You could’ve told",
      "me it was",
      "made of real bricks."
    ],
    "translation": "진짜 벽돌로 만든 벽이라고 진작 말해줬어야죠.",
    "prevContext": [
      "Crush down before you dive into it.",
      "An actor should never be afraid.",
      "You didn’t break the wall."
    ],
    "nextContext": [
      "You need to attempt to do the next task.",
      "Are you going to make me smash into the wall again?",
      "That’s too advanced for you."
    ]
  },
  {
    "id": 28,
    "text": "You need to attempt to do the next task.",
    "chunks": [
      "You need",
      "to attempt",
      "to do the next task."
    ],
    "translation": "다음 과제에 도전하셔야 합니다.",
    "prevContext": [
      "An actor should never be afraid.",
      "You didn’t break the wall.",
      "You could’ve told me it was made of real bricks."
    ],
    "nextContext": [
      "Are you going to make me smash into the wall again?",
      "That’s too advanced for you.",
      "Instead, I want you to leap over it."
    ]
  },
  {
    "id": 29,
    "text": "Are you going to make me smash into the wall again?",
    "chunks": [
      "Are you going",
      "to make me smash into the wall again?"
    ],
    "translation": "저를 또 벽에 부딪히게 만드실 건가요?",
    "prevContext": [
      "You didn’t break the wall.",
      "You could’ve told me it was made of real bricks.",
      "You need to attempt to do the next task."
    ],
    "nextContext": [
      "That’s too advanced for you.",
      "Instead, I want you to leap over it.",
      "But then, the wall is too tall for me to leap over."
    ]
  },
  {
    "id": 30,
    "text": "That’s too advanced for you.",
    "chunks": [
      "That’s too advanced",
      "for you."
    ],
    "translation": "그건 당신에게 너무 고급 기술이네요.",
    "prevContext": [
      "You could’ve told me it was made of real bricks.",
      "You need to attempt to do the next task.",
      "Are you going to make me smash into the wall again?"
    ],
    "nextContext": [
      "Instead, I want you to leap over it.",
      "But then, the wall is too tall for me to leap over.",
      "You should probably jump high then."
    ]
  },
  {
    "id": 31,
    "text": "Instead, I want you to leap over it.",
    "chunks": [
      "Instead, I want you",
      "to leap over it."
    ],
    "translation": "대신, 벽을 뛰어넘어 보세요.",
    "prevContext": [
      "You need to attempt to do the next task.",
      "Are you going to make me smash into the wall again?",
      "That’s too advanced for you."
    ],
    "nextContext": [
      "But then, the wall is too tall for me to leap over.",
      "You should probably jump high then.",
      "You want to be a big star, aren’t you?"
    ]
  },
  {
    "id": 32,
    "text": "But then, the wall is too tall for me to leap over.",
    "chunks": [
      "But then,",
      "the wall is too tall for me to leap over."
    ],
    "translation": "하지만 그러기엔 벽이 너무 높아서 뛰어넘을 수가 없어요.",
    "prevContext": [
      "Are you going to make me smash into the wall again?",
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
    "id": 33,
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
    "id": 34,
    "text": "You want to be a big star, aren’t you?",
    "chunks": [
      "You want to be a big star,",
      "aren’t you?"
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
      "Dash toward the wall, then leap over it."
    ]
  },
  {
    "id": 35,
    "text": "I want that more than anything in the world.",
    "chunks": [
      "I want",
      "that more than anything",
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
      "Dash toward the wall, then leap over it.",
      "I didn’t want you to smash into it."
    ]
  },
  {
    "id": 36,
    "text": "Then you know what to do.",
    "chunks": [
      "Then you know what",
      "to do."
    ],
    "translation": "그럼 뭘 해야 할지 아시겠네요.",
    "prevContext": [
      "You should probably jump high then.",
      "You want to be a big star, aren’t you?",
      "I want that more than anything in the world."
    ],
    "nextContext": [
      "Dash toward the wall, then leap over it.",
      "I didn’t want you to smash into it.",
      "You should’ve jumped before you got to the wall."
    ]
  },
  {
    "id": 37,
    "text": "Dash toward the wall, then leap over it.",
    "chunks": [
      "Dash toward the wall,",
      "then leap over it."
    ],
    "translation": "벽을 향해 돌진한 다음 뛰어넘으세요.",
    "prevContext": [
      "You want to be a big star, aren’t you?",
      "I want that more than anything in the world.",
      "Then you know what to do."
    ],
    "nextContext": [
      "I didn’t want you to smash into it.",
      "You should’ve jumped before you got to the wall.",
      "You could’ve told me that before."
    ]
  },
  {
    "id": 38,
    "text": "I didn’t want you to smash into it.",
    "chunks": [
      "I didn’t want you",
      "to smash into it."
    ],
    "translation": "벽에 부딪히길 바란 게 아니었는데요.",
    "prevContext": [
      "I want that more than anything in the world.",
      "Then you know what to do.",
      "Dash toward the wall, then leap over it."
    ],
    "nextContext": [
      "You should’ve jumped before you got to the wall.",
      "You could’ve told me that before.",
      "Hurl this brick at my head."
    ]
  },
  {
    "id": 39,
    "text": "You should’ve jumped before you got to the wall.",
    "chunks": [
      "You should’ve jumped",
      "before you got",
      "to the wall."
    ],
    "translation": "벽에 닿기 전에 점프를 했어야죠.",
    "prevContext": [
      "Then you know what to do.",
      "Dash toward the wall, then leap over it.",
      "I didn’t want you to smash into it."
    ],
    "nextContext": [
      "You could’ve told me that before.",
      "Hurl this brick at my head.",
      "I’m going to hurl this brick at you as hard  as  I can."
    ]
  },
  {
    "id": 40,
    "text": "You could’ve told me that before.",
    "chunks": [
      "You could’ve told",
      "me that before."
    ],
    "translation": "그 말을 진작에 해주셨어야죠.",
    "prevContext": [
      "Dash toward the wall, then leap over it.",
      "I didn’t want you to smash into it.",
      "You should’ve jumped before you got to the wall."
    ],
    "nextContext": [
      "Hurl this brick at my head.",
      "I’m going to hurl this brick at you as hard  as  I can.",
      "Why would you do that?"
    ]
  },
  {
    "id": 41,
    "text": "Hurl this brick at my head.",
    "chunks": [
      "Hurl this brick",
      "at my head."
    ],
    "translation": "이 벽돌을 제 머리에 힘껏 던지세요.",
    "prevContext": [
      "I didn’t want you to smash into it.",
      "You should’ve jumped before you got to the wall.",
      "You could’ve told me that before."
    ],
    "nextContext": [
      "I’m going to hurl this brick at you as hard  as  I can.",
      "Why would you do that?",
      "You need to catch the brick before it hits you."
    ]
  },
  {
    "id": 42,
    "text": "I’m going to hurl this brick at you as hard  as  I can.",
    "chunks": [
      "I’m going to hurl",
      "this brick at you",
      "as hard as I can."
    ],
    "translation": "힘껏 벽돌을 던질 겁니다.",
    "prevContext": [
      "You should’ve jumped before you got to the wall.",
      "You could’ve told me that before.",
      "Hurl this brick at my head."
    ],
    "nextContext": [
      "Why would you do that?",
      "You need to catch the brick before it hits you.",
      "Don’t dive out of the way."
    ]
  },
  {
    "id": 43,
    "text": "Why would you do that?",
    "chunks": [
      "Why would",
      "you do that?"
    ],
    "translation": "왜 그렇게 하시는 건데요?",
    "prevContext": [
      "You could’ve told me that before.",
      "Hurl this brick at my head.",
      "I’m going to hurl this brick at you as hard  as  I can."
    ],
    "nextContext": [
      "You need to catch the brick before it hits you.",
      "Don’t dive out of the way.",
      "When I tell you, you’re going to spin around and catch the brick."
    ]
  },
  {
    "id": 44,
    "text": "You need to catch the brick before it hits you.",
    "chunks": [
      "You need",
      "to catch the brick",
      "before it hits you."
    ],
    "translation": "벽돌에 맞기 전에 그걸 낚아채야 합니다.",
    "prevContext": [
      "Hurl this brick at my head.",
      "I’m going to hurl this brick at you as hard  as  I can.",
      "Why would you do that?"
    ],
    "nextContext": [
      "Don’t dive out of the way.",
      "When I tell you, you’re going to spin around and catch the brick.",
      "You should’ve told me you were going to hurl it."
    ]
  },
  {
    "id": 45,
    "text": "Don’t dive out of the way.",
    "chunks": [
      "Don’t dive out of",
      "the way."
    ],
    "translation": "피하려고 몸을 피하지 마세요.",
    "prevContext": [
      "I’m going to hurl this brick at you as hard  as  I can.",
      "Why would you do that?",
      "You need to catch the brick before it hits you."
    ],
    "nextContext": [
      "When I tell you, you’re going to spin around and catch the brick.",
      "You should’ve told me you were going to hurl it.",
      "The brick crushed into my head."
    ]
  },
  {
    "id": 46,
    "text": "When I tell you, you’re going to spin around and catch the brick.",
    "chunks": [
      "When I tell you,",
      "you’re going to spin around and catch the brick."
    ],
    "translation": "제가 신호를 주면 돌아서서 벽돌을 잡는 겁니다.",
    "prevContext": [
      "Why would you do that?",
      "You need to catch the brick before it hits you.",
      "Don’t dive out of the way."
    ],
    "nextContext": [
      "You should’ve told me you were going to hurl it.",
      "The brick crushed into my head.",
      "I have to crawl back to the dressing room."
    ]
  },
  {
    "id": 47,
    "text": "You should’ve told me you were going to hurl it.",
    "chunks": [
      "You should’ve told me you were going",
      "to hurl it."
    ],
    "translation": "던질 거라고 미리 말을 해주셨어야죠.",
    "prevContext": [
      "You need to catch the brick before it hits you.",
      "Don’t dive out of the way.",
      "When I tell you, you’re going to spin around and catch the brick."
    ],
    "nextContext": [
      "The brick crushed into my head.",
      "I have to crawl back to the dressing room.",
      "I need to lie down."
    ]
  },
  {
    "id": 48,
    "text": "The brick crushed into my head.",
    "chunks": [
      "The brick crushed into",
      "my head."
    ],
    "translation": "벽돌이 제 머리에 정통으로 부딪혔어요.",
    "prevContext": [
      "Don’t dive out of the way.",
      "When I tell you, you’re going to spin around and catch the brick.",
      "You should’ve told me you were going to hurl it."
    ],
    "nextContext": [
      "I have to crawl back to the dressing room.",
      "I need to lie down.",
      "That was an awful lesson."
    ]
  },
  {
    "id": 49,
    "text": "I have to crawl back to the dressing room.",
    "chunks": [
      "I have",
      "to crawl back",
      "to the dressing room."
    ],
    "translation": "분장실까지 기어서 돌아가야겠어요.",
    "prevContext": [
      "When I tell you, you’re going to spin around and catch the brick.",
      "You should’ve told me you were going to hurl it.",
      "The brick crushed into my head."
    ],
    "nextContext": [
      "I need to lie down.",
      "That was an awful lesson.",
      "What are you doing here?"
    ]
  },
  {
    "id": 50,
    "text": "I need to lie down.",
    "chunks": [
      "I need",
      "to lie down."
    ],
    "translation": "저 좀 누워야겠어요.",
    "prevContext": [
      "You should’ve told me you were going to hurl it.",
      "The brick crushed into my head.",
      "I have to crawl back to the dressing room."
    ],
    "nextContext": [
      "That was an awful lesson.",
      "What are you doing here?",
      "I came to say hello during your first day on set."
    ]
  },
  {
    "id": 51,
    "text": "That was an awful lesson.",
    "chunks": [
      "That was",
      "an awful lesson."
    ],
    "translation": "정말 끔찍한 수업이었어요.",
    "prevContext": [
      "The brick crushed into my head.",
      "I have to crawl back to the dressing room.",
      "I need to lie down."
    ],
    "nextContext": [
      "What are you doing here?",
      "I came to say hello during your first day on set.",
      "What happened to you mate?"
    ]
  },
  {
    "id": 52,
    "text": "What are you doing here?",
    "chunks": [
      "What are",
      "you doing here?"
    ],
    "translation": "여기서 뭐 하고 있어?",
    "prevContext": [
      "I have to crawl back to the dressing room.",
      "I need to lie down.",
      "That was an awful lesson."
    ],
    "nextContext": [
      "I came to say hello during your first day on set.",
      "What happened to you mate?",
      "You look like you smashed into a brick wall."
    ]
  },
  {
    "id": 53,
    "text": "I came to say hello during your first day on set.",
    "chunks": [
      "I came",
      "to say hello during",
      "your first day on set."
    ],
    "translation": "세트장 첫날이라 인사하러 왔지.",
    "prevContext": [
      "I need to lie down.",
      "That was an awful lesson.",
      "What are you doing here?"
    ],
    "nextContext": [
      "What happened to you mate?",
      "You look like you smashed into a brick wall.",
      "I didn’t smash into a brick wall."
    ]
  },
  {
    "id": 54,
    "text": "What happened to you mate?",
    "chunks": [
      "What happened",
      "to you mate?"
    ],
    "translation": "친구, 대체 무슨 일이야?",
    "prevContext": [
      "That was an awful lesson.",
      "What are you doing here?",
      "I came to say hello during your first day on set."
    ],
    "nextContext": [
      "You look like you smashed into a brick wall.",
      "I didn’t smash into a brick wall.",
      "You are a very committed actor."
    ]
  },
  {
    "id": 55,
    "text": "You look like you smashed into a brick wall.",
    "chunks": [
      "You look like",
      "you smashed into",
      "a brick wall."
    ],
    "translation": "꼭 벽돌 벽에 들이받은 사람처럼 보여.",
    "prevContext": [
      "What are you doing here?",
      "I came to say hello during your first day on set.",
      "What happened to you mate?"
    ],
    "nextContext": [
      "I didn’t smash into a brick wall.",
      "You are a very committed actor.",
      "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses."
    ]
  },
  {
    "id": 56,
    "text": "I didn’t smash into a brick wall.",
    "chunks": [
      "I didn’t smash",
      "into a brick wall."
    ],
    "translation": "벽돌 벽에 부딪힌 게 아니야.",
    "prevContext": [
      "I came to say hello during your first day on set.",
      "What happened to you mate?",
      "You look like you smashed into a brick wall."
    ],
    "nextContext": [
      "You are a very committed actor.",
      "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses.",
      "She loves her job and can’t imagine doing anything else."
    ]
  },
  {
    "id": 57,
    "text": "You are a very committed actor.",
    "chunks": [
      "You are a",
      "very committed actor."
    ],
    "translation": "너 정말 헌신적인 배우구나.",
    "prevContext": [
      "What happened to you mate?",
      "You look like you smashed into a brick wall.",
      "I didn’t smash into a brick wall."
    ],
    "nextContext": [
      "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses.",
      "She loves her job and can’t imagine doing anything else.",
      "How did she become interested in this career?"
    ]
  },
  {
    "id": 58,
    "text": "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses.",
    "chunks": [
      "She wears many wigs,",
      "costumes,",
      "and a lot of makeup",
      "to look like different famous actresses."
    ],
    "translation": "그녀는 여배우들과 닮아 보이도록 가발과 의상, 짙은 분장을 합니다.",
    "prevContext": [
      "You look like you smashed into a brick wall.",
      "I didn’t smash into a brick wall.",
      "You are a very committed actor."
    ],
    "nextContext": [
      "She loves her job and can’t imagine doing anything else.",
      "How did she become interested in this career?",
      "In a very unusual way."
    ]
  },
  {
    "id": 59,
    "text": "She loves her job and can’t imagine doing anything else.",
    "chunks": [
      "She loves her job",
      "and can’t imagine doing anything else."
    ],
    "translation": "그녀는 자신의 일을 사랑하며 다른 일은 상상조차 할 수 없습니다.",
    "prevContext": [
      "I didn’t smash into a brick wall.",
      "You are a very committed actor.",
      "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses."
    ],
    "nextContext": [
      "How did she become interested in this career?",
      "In a very unusual way.",
      "About three years ago, I went on a weekend trip."
    ]
  },
  {
    "id": 60,
    "text": "How did she become interested in this career?",
    "chunks": [
      "How did she become interested",
      "in this career?"
    ],
    "translation": "그녀는 어떻게 이 직업에 관심을 갖게 되었을까요?",
    "prevContext": [
      "You are a very committed actor.",
      "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses.",
      "She loves her job and can’t imagine doing anything else."
    ],
    "nextContext": [
      "In a very unusual way.",
      "About three years ago, I went on a weekend trip.",
      "When I got back, I realized that I was locked out of my apartment."
    ]
  },
  {
    "id": 61,
    "text": "In a very unusual way.",
    "chunks": [
      "In a",
      "very unusual way."
    ],
    "translation": "매우 독특한 방식이었습니다.",
    "prevContext": [
      "She wears many wigs, costumes, and a lot of makeup to look like different famous actresses.",
      "She loves her job and can’t imagine doing anything else.",
      "How did she become interested in this career?"
    ],
    "nextContext": [
      "About three years ago, I went on a weekend trip.",
      "When I got back, I realized that I was locked out of my apartment.",
      "I should have left a key with my parents or a friend."
    ]
  },
  {
    "id": 62,
    "text": "About three years ago, I went on a weekend trip.",
    "chunks": [
      "About three years ago,",
      "I went on a weekend trip."
    ],
    "translation": "약 3년 전, 저는 주말여행을 떠났습니다.",
    "prevContext": [
      "She loves her job and can’t imagine doing anything else.",
      "How did she become interested in this career?",
      "In a very unusual way."
    ],
    "nextContext": [
      "When I got back, I realized that I was locked out of my apartment.",
      "I should have left a key with my parents or a friend.",
      "I had no way of getting into my place."
    ]
  },
  {
    "id": 63,
    "text": "When I got back, I realized that I was locked out of my apartment.",
    "chunks": [
      "When I got back,",
      "I realized that I was locked out of my apartment."
    ],
    "translation": "집에 돌아왔을 때, 문이 잠겨 아파트에 들어갈 수 없다는 걸 알았습니다.",
    "prevContext": [
      "How did she become interested in this career?",
      "In a very unusual way.",
      "About three years ago, I went on a weekend trip."
    ],
    "nextContext": [
      "I should have left a key with my parents or a friend.",
      "I had no way of getting into my place.",
      "It was Sunday, and the locksmiths in my area were closed."
    ]
  },
  {
    "id": 64,
    "text": "I should have left a key with my parents or a friend.",
    "chunks": [
      "I should have left a key",
      "with my parents or a friend."
    ],
    "translation": "부모님이나 친구에게 열쇠를 맡겨뒀어야 했는데 말이죠.",
    "prevContext": [
      "In a very unusual way.",
      "About three years ago, I went on a weekend trip.",
      "When I got back, I realized that I was locked out of my apartment."
    ],
    "nextContext": [
      "I had no way of getting into my place.",
      "It was Sunday, and the locksmiths in my area were closed.",
      "I could have taken the computer with me, but I wanted to get away without work."
    ]
  },
  {
    "id": 65,
    "text": "I had no way of getting into my place.",
    "chunks": [
      "I had no",
      "way of getting",
      "into my place."
    ],
    "translation": "집으로 들어갈 수 있는 방법이 전혀 없었습니다.",
    "prevContext": [
      "About three years ago, I went on a weekend trip.",
      "When I got back, I realized that I was locked out of my apartment.",
      "I should have left a key with my parents or a friend."
    ],
    "nextContext": [
      "It was Sunday, and the locksmiths in my area were closed.",
      "I could have taken the computer with me, but I wanted to get away without work.",
      "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help."
    ]
  },
  {
    "id": 66,
    "text": "It was Sunday, and the locksmiths in my area were closed.",
    "chunks": [
      "It was Sunday,",
      "and the locksmiths in my area were closed."
    ],
    "translation": "일요일이라 동네 열쇠 가게들은 모두 문을 닫은 상태였습니다.",
    "prevContext": [
      "When I got back, I realized that I was locked out of my apartment.",
      "I should have left a key with my parents or a friend.",
      "I had no way of getting into my place."
    ],
    "nextContext": [
      "I could have taken the computer with me, but I wanted to get away without work.",
      "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help.",
      "He suggested I smash open the front door, but I didn’t want to break it."
    ]
  },
  {
    "id": 67,
    "text": "I could have taken the computer with me, but I wanted to get away without work.",
    "chunks": [
      "I could have taken the computer with me,",
      "but I wanted to get away without work."
    ],
    "translation": "컴퓨터를 챙겨갈 수도 있었지만, 일 없이 온전히 쉬고 싶었습니다.",
    "prevContext": [
      "I should have left a key with my parents or a friend.",
      "I had no way of getting into my place.",
      "It was Sunday, and the locksmiths in my area were closed."
    ],
    "nextContext": [
      "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help.",
      "He suggested I smash open the front door, but I didn’t want to break it.",
      "Then I realized that I had left the back window open."
    ]
  },
  {
    "id": 68,
    "text": "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help.",
    "chunks": [
      "When I realized that I didn’t have my key,",
      "I knocked on my neighbor’s door for help."
    ],
    "translation": "열쇠가 없다는 걸 알고 이웃집 문을 두드려 도움을 청했습니다.",
    "prevContext": [
      "I had no way of getting into my place.",
      "It was Sunday, and the locksmiths in my area were closed.",
      "I could have taken the computer with me, but I wanted to get away without work."
    ],
    "nextContext": [
      "He suggested I smash open the front door, but I didn’t want to break it.",
      "Then I realized that I had left the back window open.",
      "My apartment was on the top floor next to my neighbor’s apartment."
    ]
  },
  {
    "id": 69,
    "text": "He suggested I smash open the front door, but I didn’t want to break it.",
    "chunks": [
      "He suggested I smash open the front door,",
      "but I didn’t want to break it."
    ],
    "translation": "이웃은 현관문을 부수자고 했지만, 전 문을 망가뜨리고 싶지 않았습니다.",
    "prevContext": [
      "It was Sunday, and the locksmiths in my area were closed.",
      "I could have taken the computer with me, but I wanted to get away without work.",
      "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help."
    ],
    "nextContext": [
      "Then I realized that I had left the back window open.",
      "My apartment was on the top floor next to my neighbor’s apartment.",
      "The roof on our building was flat."
    ]
  },
  {
    "id": 70,
    "text": "Then I realized that I had left the back window open.",
    "chunks": [
      "Then I realized",
      "that I had left the back window open."
    ],
    "translation": "그때 뒷창문을 열어두고 나갔다는 사실이 번뜩 떠올랐습니다.",
    "prevContext": [
      "I could have taken the computer with me, but I wanted to get away without work.",
      "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help.",
      "He suggested I smash open the front door, but I didn’t want to break it."
    ],
    "nextContext": [
      "My apartment was on the top floor next to my neighbor’s apartment.",
      "The roof on our building was flat.",
      "My neighbor and I came up with a crazy idea."
    ]
  },
  {
    "id": 71,
    "text": "My apartment was on the top floor next to my neighbor’s apartment.",
    "chunks": [
      "My apartment was on the top floor next",
      "to my neighbor’s apartment."
    ],
    "translation": "제 아파트는 이웃집 바로 옆 꼭대기 층에 있었습니다.",
    "prevContext": [
      "When I realized that I didn’t have my key, I knocked on my neighbor’s door for help.",
      "He suggested I smash open the front door, but I didn’t want to break it.",
      "Then I realized that I had left the back window open."
    ],
    "nextContext": [
      "The roof on our building was flat.",
      "My neighbor and I came up with a crazy idea.",
      "My neighbor was standing on the flat rooftop holding the other end of the rope."
    ]
  },
  {
    "id": 72,
    "text": "The roof on our building was flat.",
    "chunks": [
      "The roof",
      "on our building was flat."
    ],
    "translation": "저희 건물 옥상은 평평한 구조였습니다.",
    "prevContext": [
      "He suggested I smash open the front door, but I didn’t want to break it.",
      "Then I realized that I had left the back window open.",
      "My apartment was on the top floor next to my neighbor’s apartment."
    ],
    "nextContext": [
      "My neighbor and I came up with a crazy idea.",
      "My neighbor was standing on the flat rooftop holding the other end of the rope.",
      "He counted to three: “One, two, three, go!”"
    ]
  },
  {
    "id": 73,
    "text": "My neighbor and I came up with a crazy idea.",
    "chunks": [
      "My neighbor",
      "and I came up",
      "with a crazy idea."
    ],
    "translation": "이웃과 저는 기상천외한 아이디어를 하나 떠올렸습니다.",
    "prevContext": [
      "Then I realized that I had left the back window open.",
      "My apartment was on the top floor next to my neighbor’s apartment.",
      "The roof on our building was flat."
    ],
    "nextContext": [
      "My neighbor was standing on the flat rooftop holding the other end of the rope.",
      "He counted to three: “One, two, three, go!”",
      "I threw myself off the ledge while he held the rope tightly."
    ]
  },
  {
    "id": 74,
    "text": "My neighbor was standing on the flat rooftop holding the other end of the rope.",
    "chunks": [
      "My neighbor was standing on",
      "the flat rooftop holding the",
      "other end of the rope."
    ],
    "translation": "이웃은 평평한 옥상에서 밧줄의 반대쪽 끝을 꽉 쥐고 있었습니다.",
    "prevContext": [
      "My apartment was on the top floor next to my neighbor’s apartment.",
      "The roof on our building was flat.",
      "My neighbor and I came up with a crazy idea."
    ],
    "nextContext": [
      "He counted to three: “One, two, three, go!”",
      "I threw myself off the ledge while he held the rope tightly.",
      "I swung in the air toward my window ledge."
    ]
  },
  {
    "id": 75,
    "text": "He counted to three: “One, two, three, go!”",
    "chunks": [
      "He counted",
      "to three:",
      "“One, two, three, go!”"
    ],
    "translation": "그는 셋을 셌습니다. '하나, 둘, 셋, 출발!'",
    "prevContext": [
      "The roof on our building was flat.",
      "My neighbor and I came up with a crazy idea.",
      "My neighbor was standing on the flat rooftop holding the other end of the rope."
    ],
    "nextContext": [
      "I threw myself off the ledge while he held the rope tightly.",
      "I swung in the air toward my window ledge.",
      "I was afraid I was going to crash into the brick wall of the building."
    ]
  },
  {
    "id": 76,
    "text": "I threw myself off the ledge while he held the rope tightly.",
    "chunks": [
      "I threw myself off the ledge",
      "while he held the rope tightly."
    ],
    "translation": "그가 밧줄을 단단히 잡고 있는 동안 전 난간에서 몸을 날렸습니다.",
    "prevContext": [
      "My neighbor and I came up with a crazy idea.",
      "My neighbor was standing on the flat rooftop holding the other end of the rope.",
      "He counted to three: “One, two, three, go!”"
    ],
    "nextContext": [
      "I swung in the air toward my window ledge.",
      "I was afraid I was going to crash into the brick wall of the building.",
      "Instead, I managed to land on my window ledge."
    ]
  },
  {
    "id": 77,
    "text": "I swung in the air toward my window ledge.",
    "chunks": [
      "I swung",
      "in the air",
      "toward my window ledge."
    ],
    "translation": "저는 공중으로 그네를 타듯 제 방 창문 난간을 향해 날아갔습니다.",
    "prevContext": [
      "My neighbor was standing on the flat rooftop holding the other end of the rope.",
      "He counted to three: “One, two, three, go!”",
      "I threw myself off the ledge while he held the rope tightly."
    ],
    "nextContext": [
      "I was afraid I was going to crash into the brick wall of the building.",
      "Instead, I managed to land on my window ledge.",
      "I could have felt scared, but I felt incredible."
    ]
  },
  {
    "id": 78,
    "text": "I was afraid I was going to crash into the brick wall of the building.",
    "chunks": [
      "I was afraid I was",
      "going to crash into the",
      "brick wall of the building."
    ],
    "translation": "건물의 벽돌 벽에 세게 부딪힐까 봐 덜컥 두려웠습니다.",
    "prevContext": [
      "He counted to three: “One, two, three, go!”",
      "I threw myself off the ledge while he held the rope tightly.",
      "I swung in the air toward my window ledge."
    ],
    "nextContext": [
      "Instead, I managed to land on my window ledge.",
      "I could have felt scared, but I felt incredible.",
      "A minute later, my neighbor knocked on my door until I let him in."
    ]
  },
  {
    "id": 79,
    "text": "Instead, I managed to land on my window ledge.",
    "chunks": [
      "Instead, I managed",
      "to land on my window ledge."
    ],
    "translation": "하지만 다행히 제 창문 난간에 안전하게 발을 디뎠습니다.",
    "prevContext": [
      "I threw myself off the ledge while he held the rope tightly.",
      "I swung in the air toward my window ledge.",
      "I was afraid I was going to crash into the brick wall of the building."
    ],
    "nextContext": [
      "I could have felt scared, but I felt incredible.",
      "A minute later, my neighbor knocked on my door until I let him in.",
      "He said, “That was amazing."
    ]
  },
  {
    "id": 80,
    "text": "I could have felt scared, but I felt incredible.",
    "chunks": [
      "I could have felt scared,",
      "but I felt incredible."
    ],
    "translation": "무서웠을 수도 있었지만, 믿을 수 없을 만큼 짜릿했습니다.",
    "prevContext": [
      "I swung in the air toward my window ledge.",
      "I was afraid I was going to crash into the brick wall of the building.",
      "Instead, I managed to land on my window ledge."
    ],
    "nextContext": [
      "A minute later, my neighbor knocked on my door until I let him in.",
      "He said, “That was amazing.",
      "You should be a stunt person.”"
    ]
  },
  {
    "id": 81,
    "text": "A minute later, my neighbor knocked on my door until I let him in.",
    "chunks": [
      "A minute later,",
      "my neighbor knocked on my door until I let him in."
    ],
    "translation": "잠시 후 이웃이 문을 두드렸고 제가 문을 열어주었습니다.",
    "prevContext": [
      "I was afraid I was going to crash into the brick wall of the building.",
      "Instead, I managed to land on my window ledge.",
      "I could have felt scared, but I felt incredible."
    ],
    "nextContext": [
      "He said, “That was amazing.",
      "You should be a stunt person.”",
      "It got me thinking, and I thought that I might really enjoy a career doing stunts."
    ]
  },
  {
    "id": 82,
    "text": "He said, “That was amazing.",
    "chunks": [
      "He said,",
      "“That was amazing."
    ],
    "translation": "그는 '정말 대단했어'라고 말했습니다.",
    "prevContext": [
      "Instead, I managed to land on my window ledge.",
      "I could have felt scared, but I felt incredible.",
      "A minute later, my neighbor knocked on my door until I let him in."
    ],
    "nextContext": [
      "You should be a stunt person.”",
      "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
      "The next year, I took gymnastics and martial arts classes."
    ]
  },
  {
    "id": 83,
    "text": "You should be a stunt person.”",
    "chunks": [
      "You should be",
      "a stunt person.”"
    ],
    "translation": "넌 스턴트맨을 해야 해.”",
    "prevContext": [
      "I could have felt scared, but I felt incredible.",
      "A minute later, my neighbor knocked on my door until I let him in.",
      "He said, “That was amazing."
    ],
    "nextContext": [
      "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
      "The next year, I took gymnastics and martial arts classes.",
      "I worked hard to improve my skills."
    ]
  },
  {
    "id": 84,
    "text": "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
    "chunks": [
      "It got me thinking,",
      "and I thought that I might really enjoy a career doing stunts."
    ],
    "translation": "그 말이 계기가 되어 스턴트 커리어를 진지하게 즐길 수 있겠다고 생각했습니다.",
    "prevContext": [
      "A minute later, my neighbor knocked on my door until I let him in.",
      "He said, “That was amazing.",
      "You should be a stunt person.”"
    ],
    "nextContext": [
      "The next year, I took gymnastics and martial arts classes.",
      "I worked hard to improve my skills.",
      "Three years later, I became a Hollywood stunt double."
    ]
  },
  {
    "id": 85,
    "text": "The next year, I took gymnastics and martial arts classes.",
    "chunks": [
      "The next year,",
      "I took gymnastics and martial arts classes."
    ],
    "translation": "그다음 해, 저는 기계체조와 무술 수업을 들었습니다.",
    "prevContext": [
      "He said, “That was amazing.",
      "You should be a stunt person.”",
      "It got me thinking, and I thought that I might really enjoy a career doing stunts."
    ],
    "nextContext": [
      "I worked hard to improve my skills.",
      "Three years later, I became a Hollywood stunt double.",
      "Hi there Sofi, why are you washing dishes?"
    ]
  },
  {
    "id": 86,
    "text": "I worked hard to improve my skills.",
    "chunks": [
      "I worked hard",
      "to improve my skills."
    ],
    "translation": "실력을 키우기 위해 정말 열심히 연습했습니다.",
    "prevContext": [
      "You should be a stunt person.”",
      "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
      "The next year, I took gymnastics and martial arts classes."
    ],
    "nextContext": [
      "Three years later, I became a Hollywood stunt double.",
      "Hi there Sofi, why are you washing dishes?",
      "Nadi told me I have to."
    ]
  },
  {
    "id": 87,
    "text": "Three years later, I became a Hollywood stunt double.",
    "chunks": [
      "Three years later,",
      "I became a Hollywood stunt double."
    ],
    "translation": "3년 후, 저는 마침내 할리우드 스턴트 대역 배우가 되었습니다.",
    "prevContext": [
      "It got me thinking, and I thought that I might really enjoy a career doing stunts.",
      "The next year, I took gymnastics and martial arts classes.",
      "I worked hard to improve my skills."
    ],
    "nextContext": [
      "Hi there Sofi, why are you washing dishes?",
      "Nadi told me I have to.",
      "And I told you that you don’t have to."
    ]
  },
  {
    "id": 88,
    "text": "Hi there Sofi, why are you washing dishes?",
    "chunks": [
      "Hi there Sofi,",
      "why are you washing dishes?"
    ],
    "translation": "안녕 소피, 왜 설거지를 하고 있어?",
    "prevContext": [
      "The next year, I took gymnastics and martial arts classes.",
      "I worked hard to improve my skills.",
      "Three years later, I became a Hollywood stunt double."
    ],
    "nextContext": [
      "Nadi told me I have to.",
      "And I told you that you don’t have to.",
      "Having cleaned up my area, I helped Nadi with the menu."
    ]
  },
  {
    "id": 89,
    "text": "Nadi told me I have to.",
    "chunks": [
      "Nadi told me",
      "I have to."
    ],
    "translation": "나디가 나한테 해야 한다고 해서.",
    "prevContext": [
      "I worked hard to improve my skills.",
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
    "id": 90,
    "text": "And I told you that you don’t have to.",
    "chunks": [
      "And I told you",
      "that you don’t have to."
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
    "id": 91,
    "text": "Having cleaned up my area, I helped Nadi with the menu.",
    "chunks": [
      "Having cleaned up my area,",
      "I helped Nadi with the menu."
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
      "Guess who was in the restaurant earlier."
    ]
  },
  {
    "id": 92,
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
      "Guess who was in the restaurant earlier.",
      "Walking into the dining room I bumped into him."
    ]
  },
  {
    "id": 93,
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
      "Guess who was in the restaurant earlier.",
      "Walking into the dining room I bumped into him.",
      "But he was here yesterday."
    ]
  },
  {
    "id": 94,
    "text": "Guess who was in the restaurant earlier.",
    "chunks": [
      "Guess who was",
      "in the restaurant earlier."
    ],
    "translation": "아까 식당에 누가 왔었는지 알아?",
    "prevContext": [
      "Having cleaned up my area, I helped Nadi with the menu.",
      "Now I’m going to help you.",
      "You don’t have to do that Renzo."
    ],
    "nextContext": [
      "Walking into the dining room I bumped into him.",
      "But he was here yesterday.",
      "Weren’t you supposed to leave earlier for some meeting?"
    ]
  },
  {
    "id": 95,
    "text": "Walking into the dining room I bumped into him.",
    "chunks": [
      "Walking into the",
      "dining room I",
      "bumped into him."
    ],
    "translation": "다이닝 룸으로 들어가다 그와 딱 마주쳤어.",
    "prevContext": [
      "Now I’m going to help you.",
      "You don’t have to do that Renzo.",
      "Guess who was in the restaurant earlier."
    ],
    "nextContext": [
      "But he was here yesterday.",
      "Weren’t you supposed to leave earlier for some meeting?",
      "Watching you wash dishes, I realized I have to tell you something about Nadi."
    ]
  },
  {
    "id": 96,
    "text": "But he was here yesterday.",
    "chunks": [
      "But he",
      "was here yesterday."
    ],
    "translation": "하지만 어제도 왔었잖아.",
    "prevContext": [
      "You don’t have to do that Renzo.",
      "Guess who was in the restaurant earlier.",
      "Walking into the dining room I bumped into him."
    ],
    "nextContext": [
      "Weren’t you supposed to leave earlier for some meeting?",
      "Watching you wash dishes, I realized I have to tell you something about Nadi.",
      "Last week, Nadi was close to begging you to come back."
    ]
  },
  {
    "id": 97,
    "text": "Weren’t you supposed to leave earlier for some meeting?",
    "chunks": [
      "Weren’t you supposed",
      "to leave earlier",
      "for some meeting?"
    ],
    "translation": "미팅 때문에 일찍 나가기로 하지 않았어?",
    "prevContext": [
      "Guess who was in the restaurant earlier.",
      "Walking into the dining room I bumped into him.",
      "But he was here yesterday."
    ],
    "nextContext": [
      "Watching you wash dishes, I realized I have to tell you something about Nadi.",
      "Last week, Nadi was close to begging you to come back.",
      "How do you know that?"
    ]
  },
  {
    "id": 98,
    "text": "Watching you wash dishes, I realized I have to tell you something about Nadi.",
    "chunks": [
      "Watching you wash dishes,",
      "I realized I have to tell you something about Nadi."
    ],
    "translation": "너 설거지하는 걸 보니 나디에 대해 해줄 말이 생각났어.",
    "prevContext": [
      "Walking into the dining room I bumped into him.",
      "But he was here yesterday.",
      "Weren’t you supposed to leave earlier for some meeting?"
    ],
    "nextContext": [
      "Last week, Nadi was close to begging you to come back.",
      "How do you know that?",
      "Working by the dining room, I overheard Nadi telling someone that."
    ]
  },
  {
    "id": 99,
    "text": "Last week, Nadi was close to begging you to come back.",
    "chunks": [
      "Last week,",
      "Nadi was close to begging you to come back."
    ],
    "translation": "지난주에 나디가 너한테 제발 돌아와 달라고 사정할 뻔했어.",
    "prevContext": [
      "But he was here yesterday.",
      "Weren’t you supposed to leave earlier for some meeting?",
      "Watching you wash dishes, I realized I have to tell you something about Nadi."
    ],
    "nextContext": [
      "How do you know that?",
      "Working by the dining room, I overheard Nadi telling someone that.",
      "She was supposed to call you, but didn’t."
    ]
  },
  {
    "id": 100,
    "text": "How do you know that?",
    "chunks": [
      "How do",
      "you know that?"
    ],
    "translation": "그걸 어떻게 알아?",
    "prevContext": [
      "Weren’t you supposed to leave earlier for some meeting?",
      "Watching you wash dishes, I realized I have to tell you something about Nadi.",
      "Last week, Nadi was close to begging you to come back."
    ],
    "nextContext": [
      "Working by the dining room, I overheard Nadi telling someone that.",
      "She was supposed to call you, but didn’t.",
      "I meant to talk to you before I begged for my job back."
    ]
  },
  {
    "id": 101,
    "text": "Working by the dining room, I overheard Nadi telling someone that.",
    "chunks": [
      "Working by the dining room,",
      "I overheard Nadi telling someone that."
    ],
    "translation": "홀 쪽에서 일하다가 나디가 누군가에게 그렇게 말하는 걸 우연히 들었어.",
    "prevContext": [
      "Watching you wash dishes, I realized I have to tell you something about Nadi.",
      "Last week, Nadi was close to begging you to come back.",
      "How do you know that?"
    ],
    "nextContext": [
      "She was supposed to call you, but didn’t.",
      "I meant to talk to you before I begged for my job back.",
      "I meant to tell you that, but I forgot."
    ]
  },
  {
    "id": 102,
    "text": "She was supposed to call you, but didn’t.",
    "chunks": [
      "She was supposed to call you,",
      "but didn’t."
    ],
    "translation": "너한테 전화하기로 되어 있었는데 안 했더라고.",
    "prevContext": [
      "Last week, Nadi was close to begging you to come back.",
      "How do you know that?",
      "Working by the dining room, I overheard Nadi telling someone that."
    ],
    "nextContext": [
      "I meant to talk to you before I begged for my job back.",
      "I meant to tell you that, but I forgot.",
      "And now I’m a dishwasher."
    ]
  },
  {
    "id": 103,
    "text": "I meant to talk to you before I begged for my job back.",
    "chunks": [
      "I meant to talk",
      "to you before I",
      "begged for my job back."
    ],
    "translation": "다시 일하게 해달라고 부탁하기 전에 너랑 얘기했어야 했는데.",
    "prevContext": [
      "How do you know that?",
      "Working by the dining room, I overheard Nadi telling someone that.",
      "She was supposed to call you, but didn’t."
    ],
    "nextContext": [
      "I meant to tell you that, but I forgot.",
      "And now I’m a dishwasher.",
      "If it makes you feel better, I want you to be the head chef for the kitchen."
    ]
  },
  {
    "id": 104,
    "text": "I meant to tell you that, but I forgot.",
    "chunks": [
      "I meant to tell you that,",
      "but I forgot."
    ],
    "translation": "그 말 해주려 했는데 깜빡 잊었네.",
    "prevContext": [
      "Working by the dining room, I overheard Nadi telling someone that.",
      "She was supposed to call you, but didn’t.",
      "I meant to talk to you before I begged for my job back."
    ],
    "nextContext": [
      "And now I’m a dishwasher.",
      "If it makes you feel better, I want you to be the head chef for the kitchen.",
      "That’s sweet of you, Renzo."
    ]
  },
  {
    "id": 105,
    "text": "And now I’m a dishwasher.",
    "chunks": [
      "And now",
      "I’m a dishwasher."
    ],
    "translation": "그리고 지금 난 설거지 담당이지.",
    "prevContext": [
      "She was supposed to call you, but didn’t.",
      "I meant to talk to you before I begged for my job back.",
      "I meant to tell you that, but I forgot."
    ],
    "nextContext": [
      "If it makes you feel better, I want you to be the head chef for the kitchen.",
      "That’s sweet of you, Renzo.",
      "There’s only room for one head chef in this restaurant, and that’s you."
    ]
  },
  {
    "id": 106,
    "text": "If it makes you feel better, I want you to be the head chef for the kitchen.",
    "chunks": [
      "If it makes you feel better,",
      "I want you to be the head chef for the kitchen."
    ],
    "translation": "네 기분이 나아진다면, 네가 주방의 수석 셰프를 맡아줬으면 해.",
    "prevContext": [
      "I meant to talk to you before I begged for my job back.",
      "I meant to tell you that, but I forgot.",
      "And now I’m a dishwasher."
    ],
    "nextContext": [
      "That’s sweet of you, Renzo.",
      "There’s only room for one head chef in this restaurant, and that’s you.",
      "I know, I want to formally offer the position of head chef to you."
    ]
  },
  {
    "id": 107,
    "text": "That’s sweet of you, Renzo.",
    "chunks": [
      "That’s sweet",
      "of you, Renzo."
    ],
    "translation": "마음은 고마워 렌조.",
    "prevContext": [
      "I meant to tell you that, but I forgot.",
      "And now I’m a dishwasher.",
      "If it makes you feel better, I want you to be the head chef for the kitchen."
    ],
    "nextContext": [
      "There’s only room for one head chef in this restaurant, and that’s you.",
      "I know, I want to formally offer the position of head chef to you.",
      "I would be your sous chef."
    ]
  },
  {
    "id": 108,
    "text": "There’s only room for one head chef in this restaurant, and that’s you.",
    "chunks": [
      "There’s only room for one head chef in this restaurant,",
      "and that’s you."
    ],
    "translation": "이 식당의 수석 셰프 자리는 오직 하나고, 그건 바로 너야.",
    "prevContext": [
      "And now I’m a dishwasher.",
      "If it makes you feel better, I want you to be the head chef for the kitchen.",
      "That’s sweet of you, Renzo."
    ],
    "nextContext": [
      "I know, I want to formally offer the position of head chef to you.",
      "I would be your sous chef.",
      "You’re more talented than I am."
    ]
  },
  {
    "id": 109,
    "text": "I know, I want to formally offer the position of head chef to you.",
    "chunks": [
      "I know,",
      "I want to formally offer the position of head chef to you."
    ],
    "translation": "알아, 그래서 정식으로 너한테 수석 셰프 자리를 넘겨주고 싶어.",
    "prevContext": [
      "If it makes you feel better, I want you to be the head chef for the kitchen.",
      "That’s sweet of you, Renzo.",
      "There’s only room for one head chef in this restaurant, and that’s you."
    ],
    "nextContext": [
      "I would be your sous chef.",
      "You’re more talented than I am.",
      "People only grow when they have someone great to learn from."
    ]
  },
  {
    "id": 110,
    "text": "I would be your sous chef.",
    "chunks": [
      "I would be",
      "your sous chef."
    ],
    "translation": "내가 네 부주방장 할게.",
    "prevContext": [
      "That’s sweet of you, Renzo.",
      "There’s only room for one head chef in this restaurant, and that’s you.",
      "I know, I want to formally offer the position of head chef to you."
    ],
    "nextContext": [
      "You’re more talented than I am.",
      "People only grow when they have someone great to learn from.",
      "You were meant to be a chef, not a dishwasher."
    ]
  },
  {
    "id": 111,
    "text": "You’re more talented than I am.",
    "chunks": [
      "You’re more talented",
      "than I am."
    ],
    "translation": "네가 나보다 훨씬 재능이 뛰어나니까.",
    "prevContext": [
      "There’s only room for one head chef in this restaurant, and that’s you.",
      "I know, I want to formally offer the position of head chef to you.",
      "I would be your sous chef."
    ],
    "nextContext": [
      "People only grow when they have someone great to learn from.",
      "You were meant to be a chef, not a dishwasher.",
      "I don’t know what to say Renzo, thank you."
    ]
  },
  {
    "id": 112,
    "text": "People only grow when they have someone great to learn from.",
    "chunks": [
      "People only grow",
      "when they have someone great",
      "to learn from."
    ],
    "translation": "사람은 배울 만한 훌륭한 사람 곁에 있을 때 성장하는 법이야.",
    "prevContext": [
      "I know, I want to formally offer the position of head chef to you.",
      "I would be your sous chef.",
      "You’re more talented than I am."
    ],
    "nextContext": [
      "You were meant to be a chef, not a dishwasher.",
      "I don’t know what to say Renzo, thank you.",
      "It means a lot, but do you really think Nadi would agree to this?"
    ]
  },
  {
    "id": 113,
    "text": "You were meant to be a chef, not a dishwasher.",
    "chunks": [
      "You were meant to be a chef,",
      "not a dishwasher."
    ],
    "translation": "너는 설거지꾼이 아니라 셰프가 될 운명이야.",
    "prevContext": [
      "I would be your sous chef.",
      "You’re more talented than I am.",
      "People only grow when they have someone great to learn from."
    ],
    "nextContext": [
      "I don’t know what to say Renzo, thank you.",
      "It means a lot, but do you really think Nadi would agree to this?",
      "She has to, she doesn’t."
    ]
  },
  {
    "id": 114,
    "text": "I don’t know what to say Renzo, thank you.",
    "chunks": [
      "I don’t know what to say Renzo,",
      "thank you."
    ],
    "translation": "무슨 말을 해야 할지 모르겠네 렌조, 고마워.",
    "prevContext": [
      "You’re more talented than I am.",
      "People only grow when they have someone great to learn from.",
      "You were meant to be a chef, not a dishwasher."
    ],
    "nextContext": [
      "It means a lot, but do you really think Nadi would agree to this?",
      "She has to, she doesn’t.",
      "Don’t put your job on the line for me."
    ]
  },
  {
    "id": 115,
    "text": "It means a lot, but do you really think Nadi would agree to this?",
    "chunks": [
      "It means a lot,",
      "but do you really think Nadi would agree to this?"
    ],
    "translation": "정말 고맙지만, 나디가 이걸 동의할 거라 생각해?",
    "prevContext": [
      "People only grow when they have someone great to learn from.",
      "You were meant to be a chef, not a dishwasher.",
      "I don’t know what to say Renzo, thank you."
    ],
    "nextContext": [
      "She has to, she doesn’t.",
      "Don’t put your job on the line for me.",
      "I thought  you would be excited by this opportunity."
    ]
  },
  {
    "id": 116,
    "text": "She has to, she doesn’t.",
    "chunks": [
      "She has to,",
      "she doesn’t."
    ],
    "translation": "동의해야만 해.",
    "prevContext": [
      "You were meant to be a chef, not a dishwasher.",
      "I don’t know what to say Renzo, thank you.",
      "It means a lot, but do you really think Nadi would agree to this?"
    ],
    "nextContext": [
      "Don’t put your job on the line for me.",
      "I thought  you would be excited by this opportunity.",
      "My offer was supposed to make you happy."
    ]
  },
  {
    "id": 117,
    "text": "Don’t put your job on the line for me.",
    "chunks": [
      "Don’t put your",
      "job on the",
      "line for me."
    ],
    "translation": "나 때문에 네 일자리를 걸지 마.",
    "prevContext": [
      "I don’t know what to say Renzo, thank you.",
      "It means a lot, but do you really think Nadi would agree to this?",
      "She has to, she doesn’t."
    ],
    "nextContext": [
      "I thought  you would be excited by this opportunity.",
      "My offer was supposed to make you happy.",
      "Renzo, I want to open my own restaurant."
    ]
  },
  {
    "id": 118,
    "text": "I thought  you would be excited by this opportunity.",
    "chunks": [
      "I thought you",
      "would be excited",
      "by this opportunity."
    ],
    "translation": "네가 이 기회에 기뻐할 줄 알았는데.",
    "prevContext": [
      "It means a lot, but do you really think Nadi would agree to this?",
      "She has to, she doesn’t.",
      "Don’t put your job on the line for me."
    ],
    "nextContext": [
      "My offer was supposed to make you happy.",
      "Renzo, I want to open my own restaurant.",
      "I don’t really need to be the head chef anymore."
    ]
  },
  {
    "id": 119,
    "text": "My offer was supposed to make you happy.",
    "chunks": [
      "My offer was supposed",
      "to make you happy."
    ],
    "translation": "내 제안이 너를 기쁘게 할 줄 알았어.",
    "prevContext": [
      "She has to, she doesn’t.",
      "Don’t put your job on the line for me.",
      "I thought  you would be excited by this opportunity."
    ],
    "nextContext": [
      "Renzo, I want to open my own restaurant.",
      "I don’t really need to be the head chef anymore.",
      "How are you going to do that?"
    ]
  },
  {
    "id": 120,
    "text": "Renzo, I want to open my own restaurant.",
    "chunks": [
      "Renzo, I want",
      "to open my own restaurant."
    ],
    "translation": "렌조, 난 내 식당을 차리고 싶어.",
    "prevContext": [
      "Don’t put your job on the line for me.",
      "I thought  you would be excited by this opportunity.",
      "My offer was supposed to make you happy."
    ],
    "nextContext": [
      "I don’t really need to be the head chef anymore.",
      "How are you going to do that?",
      "There are a lot of terms in those chapters."
    ]
  },
  {
    "id": 121,
    "text": "I don’t really need to be the head chef anymore.",
    "chunks": [
      "I don’t really need",
      "to be the head chef anymore."
    ],
    "translation": "더 이상 수석 셰프 자리는 필요 없어.",
    "prevContext": [
      "I thought  you would be excited by this opportunity.",
      "My offer was supposed to make you happy.",
      "Renzo, I want to open my own restaurant."
    ],
    "nextContext": [
      "How are you going to do that?",
      "There are a lot of terms in those chapters.",
      "Is there a specific way you recommend we learn them by heart?"
    ]
  },
  {
    "id": 122,
    "text": "How are you going to do that?",
    "chunks": [
      "How are you going",
      "to do that?"
    ],
    "translation": "그걸 어떻게 해낼 건데?",
    "prevContext": [
      "My offer was supposed to make you happy.",
      "Renzo, I want to open my own restaurant.",
      "I don’t really need to be the head chef anymore."
    ],
    "nextContext": [
      "There are a lot of terms in those chapters.",
      "Is there a specific way you recommend we learn them by heart?",
      "Rote learning is the best way to remember anything."
    ]
  },
  {
    "id": 123,
    "text": "There are a lot of terms in those chapters.",
    "chunks": [
      "There are a lot of terms",
      "in those chapters."
    ],
    "translation": "그 장들에는 용어가 아주 많습니다.",
    "prevContext": [
      "Renzo, I want to open my own restaurant.",
      "I don’t really need to be the head chef anymore.",
      "How are you going to do that?"
    ],
    "nextContext": [
      "Is there a specific way you recommend we learn them by heart?",
      "Rote learning is the best way to remember anything.",
      "Rote learning is a process of learning through repetition."
    ]
  },
  {
    "id": 124,
    "text": "Is there a specific way you recommend we learn them by heart?",
    "chunks": [
      "Is there a specific",
      "way you recommend we",
      "learn them by heart?"
    ],
    "translation": "완벽히 암기할 수 있는 교수님만의 추천 공부법이 있나요?",
    "prevContext": [
      "I don’t really need to be the head chef anymore.",
      "How are you going to do that?",
      "There are a lot of terms in those chapters."
    ],
    "nextContext": [
      "Rote learning is the best way to remember anything.",
      "Rote learning is a process of learning through repetition.",
      "You repeat the terms over and over until you know them by heart."
    ]
  },
  {
    "id": 125,
    "text": "Rote learning is the best way to remember anything.",
    "chunks": [
      "Rote learning is the best way",
      "to remember anything."
    ],
    "translation": "기계적 반복 학습이 암기에 가장 좋은 방법입니다.",
    "prevContext": [
      "How are you going to do that?",
      "There are a lot of terms in those chapters.",
      "Is there a specific way you recommend we learn them by heart?"
    ],
    "nextContext": [
      "Rote learning is a process of learning through repetition.",
      "You repeat the terms over and over until you know them by heart.",
      "I want you to be prepared for this exam."
    ]
  },
  {
    "id": 126,
    "text": "Rote learning is a process of learning through repetition.",
    "chunks": [
      "Rote learning is",
      "a process of",
      "learning through repetition."
    ],
    "translation": "기계적 암기는 반복을 통해 학습하는 과정입니다.",
    "prevContext": [
      "There are a lot of terms in those chapters.",
      "Is there a specific way you recommend we learn them by heart?",
      "Rote learning is the best way to remember anything."
    ],
    "nextContext": [
      "You repeat the terms over and over until you know them by heart.",
      "I want you to be prepared for this exam.",
      "In this business class, it’s important to study hard in advance."
    ]
  },
  {
    "id": 127,
    "text": "You repeat the terms over and over until you know them by heart.",
    "chunks": [
      "You repeat the terms",
      "over and over until",
      "you know them by heart."
    ],
    "translation": "완전히 외울 때까지 용어들을 계속 반복해서 읊는 거죠.",
    "prevContext": [
      "Is there a specific way you recommend we learn them by heart?",
      "Rote learning is the best way to remember anything.",
      "Rote learning is a process of learning through repetition."
    ],
    "nextContext": [
      "I want you to be prepared for this exam.",
      "In this business class, it’s important to study hard in advance.",
      "So you can retain the information."
    ]
  },
  {
    "id": 128,
    "text": "I want you to be prepared for this exam.",
    "chunks": [
      "I want you",
      "to be prepared",
      "for this exam."
    ],
    "translation": "여러분이 이번 시험에 철저히 대비하길 바랍니다.",
    "prevContext": [
      "Rote learning is the best way to remember anything.",
      "Rote learning is a process of learning through repetition.",
      "You repeat the terms over and over until you know them by heart."
    ],
    "nextContext": [
      "In this business class, it’s important to study hard in advance.",
      "So you can retain the information.",
      "How would you know if we just crammed the night before the test?"
    ]
  },
  {
    "id": 129,
    "text": "In this business class, it’s important to study hard in advance.",
    "chunks": [
      "In this business class,",
      "it’s important to study hard in advance."
    ],
    "translation": "이 경영학 수업에서는 미리 열심히 예습하는 것이 중요합니다.",
    "prevContext": [
      "Rote learning is a process of learning through repetition.",
      "You repeat the terms over and over until you know them by heart.",
      "I want you to be prepared for this exam."
    ],
    "nextContext": [
      "So you can retain the information.",
      "How would you know if we just crammed the night before the test?",
      "But doing that would only be bad for each of you."
    ]
  },
  {
    "id": 130,
    "text": "So you can retain the information.",
    "chunks": [
      "So you can retain",
      "the information."
    ],
    "translation": "그래야 지식을 온전히 머릿속에 보존할 수 있으니까요.",
    "prevContext": [
      "You repeat the terms over and over until you know them by heart.",
      "I want you to be prepared for this exam.",
      "In this business class, it’s important to study hard in advance."
    ],
    "nextContext": [
      "How would you know if we just crammed the night before the test?",
      "But doing that would only be bad for each of you.",
      "Also cheating in any form will not be tolerated."
    ]
  },
  {
    "id": 131,
    "text": "How would you know if we just crammed the night before the test?",
    "chunks": [
      "How would you know",
      "if we just crammed",
      "the night before the test?"
    ],
    "translation": "저희가 전날 밤 벼락치기를 했는지 교수님이 어떻게 아시나요?",
    "prevContext": [
      "I want you to be prepared for this exam.",
      "In this business class, it’s important to study hard in advance.",
      "So you can retain the information."
    ],
    "nextContext": [
      "But doing that would only be bad for each of you.",
      "Also cheating in any form will not be tolerated.",
      "Cheating will result in immediate expulsion from my course and any other courses at this university."
    ]
  },
  {
    "id": 132,
    "text": "But doing that would only be bad for each of you.",
    "chunks": [
      "But doing",
      "that would only be bad",
      "for each of you."
    ],
    "translation": "하지만 그건 여러분 각자에게 해로울 뿐입니다.",
    "prevContext": [
      "In this business class, it’s important to study hard in advance.",
      "So you can retain the information.",
      "How would you know if we just crammed the night before the test?"
    ],
    "nextContext": [
      "Also cheating in any form will not be tolerated.",
      "Cheating will result in immediate expulsion from my course and any other courses at this university.",
      "That goes for playing hooky as well."
    ]
  },
  {
    "id": 133,
    "text": "Also cheating in any form will not be tolerated.",
    "chunks": [
      "Also cheating",
      "in any form",
      "will not be tolerated."
    ],
    "translation": "또한 어떤 형태의 부정행위도 결코 용납되지 않습니다.",
    "prevContext": [
      "So you can retain the information.",
      "How would you know if we just crammed the night before the test?",
      "But doing that would only be bad for each of you."
    ],
    "nextContext": [
      "Cheating will result in immediate expulsion from my course and any other courses at this university.",
      "That goes for playing hooky as well.",
      "What does playing hooky mean?"
    ]
  },
  {
    "id": 134,
    "text": "Cheating will result in immediate expulsion from my course and any other courses at this university.",
    "chunks": [
      "Cheating will result in immediate",
      "expulsion from my course and",
      "any other courses at this university."
    ],
    "translation": "부정행위는 즉시 이 과목 및 본 대학 모든 강의에서의 제적으로 이어집니다.",
    "prevContext": [
      "How would you know if we just crammed the night before the test?",
      "But doing that would only be bad for each of you.",
      "Also cheating in any form will not be tolerated."
    ],
    "nextContext": [
      "That goes for playing hooky as well.",
      "What does playing hooky mean?",
      "Playing hooky means to not to come to class."
    ]
  },
  {
    "id": 135,
    "text": "That goes for playing hooky as well.",
    "chunks": [
      "That goes",
      "for playing hooky as well."
    ],
    "translation": "수업을 빼먹는 행위도 마찬가지입니다.",
    "prevContext": [
      "But doing that would only be bad for each of you.",
      "Also cheating in any form will not be tolerated.",
      "Cheating will result in immediate expulsion from my course and any other courses at this university."
    ],
    "nextContext": [
      "What does playing hooky mean?",
      "Playing hooky means to not to come to class.",
      "If you miss my classes, you will fall behind in your studies."
    ]
  },
  {
    "id": 136,
    "text": "What does playing hooky mean?",
    "chunks": [
      "What does",
      "playing hooky mean?"
    ],
    "translation": "Playing hooky가 무슨 뜻인가요?",
    "prevContext": [
      "Also cheating in any form will not be tolerated.",
      "Cheating will result in immediate expulsion from my course and any other courses at this university.",
      "That goes for playing hooky as well."
    ],
    "nextContext": [
      "Playing hooky means to not to come to class.",
      "If you miss my classes, you will fall behind in your studies.",
      "It will be incredibly difficult to catch up."
    ]
  },
  {
    "id": 137,
    "text": "Playing hooky means to not to come to class.",
    "chunks": [
      "Playing hooky means",
      "to not",
      "to come to class."
    ],
    "translation": "수업을 땡땡이치고 결석한다는 뜻입니다.",
    "prevContext": [
      "Cheating will result in immediate expulsion from my course and any other courses at this university.",
      "That goes for playing hooky as well.",
      "What does playing hooky mean?"
    ],
    "nextContext": [
      "If you miss my classes, you will fall behind in your studies.",
      "It will be incredibly difficult to catch up.",
      "Which is worse, cheating or playing hooky?"
    ]
  },
  {
    "id": 138,
    "text": "If you miss my classes, you will fall behind in your studies.",
    "chunks": [
      "If you miss my classes,",
      "you will fall behind in your studies."
    ],
    "translation": "제 수업을 놓치면 진도에서 뒤처지게 됩니다.",
    "prevContext": [
      "That goes for playing hooky as well.",
      "What does playing hooky mean?",
      "Playing hooky means to not to come to class."
    ],
    "nextContext": [
      "It will be incredibly difficult to catch up.",
      "Which is worse, cheating or playing hooky?",
      "My English literacy isn’t quite as advanced as my speaking."
    ]
  },
  {
    "id": 139,
    "text": "It will be incredibly difficult to catch up.",
    "chunks": [
      "It will be incredibly difficult",
      "to catch up."
    ],
    "translation": "따라잡기가 대단히 어려울 겁니다.",
    "prevContext": [
      "What does playing hooky mean?",
      "Playing hooky means to not to come to class.",
      "If you miss my classes, you will fall behind in your studies."
    ],
    "nextContext": [
      "Which is worse, cheating or playing hooky?",
      "My English literacy isn’t quite as advanced as my speaking.",
      "Are there many tutors that can help me?"
    ]
  },
  {
    "id": 140,
    "text": "Which is worse, cheating or playing hooky?",
    "chunks": [
      "Which is worse,",
      "cheating or playing hooky?"
    ],
    "translation": "부정행위와 땡땡이 중 어느 것이 더 나쁜가요?",
    "prevContext": [
      "Playing hooky means to not to come to class.",
      "If you miss my classes, you will fall behind in your studies.",
      "It will be incredibly difficult to catch up."
    ],
    "nextContext": [
      "My English literacy isn’t quite as advanced as my speaking.",
      "Are there many tutors that can help me?",
      "I thought you were bilingual."
    ]
  },
  {
    "id": 141,
    "text": "My English literacy isn’t quite as advanced as my speaking.",
    "chunks": [
      "My English literacy",
      "isn’t quite as",
      "advanced as my speaking."
    ],
    "translation": "제 영어 읽기 쓰기는 말하기만큼 유창하지 않아요.",
    "prevContext": [
      "If you miss my classes, you will fall behind in your studies.",
      "It will be incredibly difficult to catch up.",
      "Which is worse, cheating or playing hooky?"
    ],
    "nextContext": [
      "Are there many tutors that can help me?",
      "I thought you were bilingual.",
      "But I still have a lot of work to do."
    ]
  },
  {
    "id": 142,
    "text": "Are there many tutors that can help me?",
    "chunks": [
      "Are there many tutors",
      "that can help me?"
    ],
    "translation": "저를 도와줄 수 있는 튜터가 많이 있나요?",
    "prevContext": [
      "It will be incredibly difficult to catch up.",
      "Which is worse, cheating or playing hooky?",
      "My English literacy isn’t quite as advanced as my speaking."
    ],
    "nextContext": [
      "I thought you were bilingual.",
      "But I still have a lot of work to do.",
      "This class size is bigger than I’m used to."
    ]
  },
  {
    "id": 143,
    "text": "I thought you were bilingual.",
    "chunks": [
      "I thought",
      "you were bilingual."
    ],
    "translation": "전 당신이 이중언어 구사자인 줄 알았어요.",
    "prevContext": [
      "Which is worse, cheating or playing hooky?",
      "My English literacy isn’t quite as advanced as my speaking.",
      "Are there many tutors that can help me?"
    ],
    "nextContext": [
      "But I still have a lot of work to do.",
      "This class size is bigger than I’m used to.",
      "So, I’m not going to be able to give each of you individual attention."
    ]
  },
  {
    "id": 144,
    "text": "But I still have a lot of work to do.",
    "chunks": [
      "But I still",
      "have a lot",
      "of work to do."
    ],
    "translation": "하지만 아직 보완할 점이 많아요.",
    "prevContext": [
      "My English literacy isn’t quite as advanced as my speaking.",
      "Are there many tutors that can help me?",
      "I thought you were bilingual."
    ],
    "nextContext": [
      "This class size is bigger than I’m used to.",
      "So, I’m not going to be able to give each of you individual attention.",
      "But if you have any concerns, don’t hesitate to ask."
    ]
  },
  {
    "id": 145,
    "text": "This class size is bigger than I’m used to.",
    "chunks": [
      "This class size",
      "is bigger than",
      "I’m used to."
    ],
    "translation": "수강 인원이 제가 익숙한 규모보다 크네요.",
    "prevContext": [
      "Are there many tutors that can help me?",
      "I thought you were bilingual.",
      "But I still have a lot of work to do."
    ],
    "nextContext": [
      "So, I’m not going to be able to give each of you individual attention.",
      "But if you have any concerns, don’t hesitate to ask.",
      "I do have one concern."
    ]
  },
  {
    "id": 146,
    "text": "So, I’m not going to be able to give each of you individual attention.",
    "chunks": [
      "So,",
      "I’m not going to be able",
      "to give each of you individual attention."
    ],
    "translation": "따라서 개별적인 집중 지도는 어려울 수 있습니다.",
    "prevContext": [
      "I thought you were bilingual.",
      "But I still have a lot of work to do.",
      "This class size is bigger than I’m used to."
    ],
    "nextContext": [
      "But if you have any concerns, don’t hesitate to ask.",
      "I do have one concern.",
      "Why do we have to take so many tests?"
    ]
  },
  {
    "id": 147,
    "text": "But if you have any concerns, don’t hesitate to ask.",
    "chunks": [
      "But if you have any concerns,",
      "don’t hesitate to ask."
    ],
    "translation": "궁금한 점이 있다면 언제든 주저 말고 물어보세요.",
    "prevContext": [
      "But I still have a lot of work to do.",
      "This class size is bigger than I’m used to.",
      "So, I’m not going to be able to give each of you individual attention."
    ],
    "nextContext": [
      "I do have one concern.",
      "Why do we have to take so many tests?",
      "This course operates under traditional teaching methods."
    ]
  },
  {
    "id": 148,
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
      "This course operates under traditional teaching methods.",
      "As business owners, your customers or clients would expect the same from you as I do."
    ]
  },
  {
    "id": 149,
    "text": "Why do we have to take so many tests?",
    "chunks": [
      "Why do we have",
      "to take",
      "so many tests?"
    ],
    "translation": "시험을 왜 이렇게 많이 봐야 하나요?",
    "prevContext": [
      "So, I’m not going to be able to give each of you individual attention.",
      "But if you have any concerns, don’t hesitate to ask.",
      "I do have one concern."
    ],
    "nextContext": [
      "This course operates under traditional teaching methods.",
      "As business owners, your customers or clients would expect the same from you as I do.",
      "Now, these next few months aren’t going to be easy."
    ]
  },
  {
    "id": 150,
    "text": "This course operates under traditional teaching methods.",
    "chunks": [
      "This course operates",
      "under traditional teaching methods."
    ],
    "translation": "이 강의는 전통적인 교수 방식으로 운영됩니다.",
    "prevContext": [
      "But if you have any concerns, don’t hesitate to ask.",
      "I do have one concern.",
      "Why do we have to take so many tests?"
    ],
    "nextContext": [
      "As business owners, your customers or clients would expect the same from you as I do.",
      "Now, these next few months aren’t going to be easy.",
      "But I promise you that with hard work, they will be rewarding."
    ]
  },
  {
    "id": 151,
    "text": "As business owners, your customers or clients would expect the same from you as I do.",
    "chunks": [
      "As business owners,",
      "your customers or clients would expect the same from you as I do."
    ],
    "translation": "사업주로서 여러분의 고객들 역시 제가 요구하는 것과 같은 수준을 기대할 것입니다.",
    "prevContext": [
      "I do have one concern.",
      "Why do we have to take so many tests?",
      "This course operates under traditional teaching methods."
    ],
    "nextContext": [
      "Now, these next few months aren’t going to be easy.",
      "But I promise you that with hard work, they will be rewarding.",
      "You often find that people want to succeed, but they don’t want to work hard."
    ]
  },
  {
    "id": 152,
    "text": "Now, these next few months aren’t going to be easy.",
    "chunks": [
      "Now, these next few months aren’t going",
      "to be easy."
    ],
    "translation": "앞으로 몇 달간 결코 쉽지 않을 것입니다.",
    "prevContext": [
      "Why do we have to take so many tests?",
      "This course operates under traditional teaching methods.",
      "As business owners, your customers or clients would expect the same from you as I do."
    ],
    "nextContext": [
      "But I promise you that with hard work, they will be rewarding.",
      "You often find that people want to succeed, but they don’t want to work hard.",
      "You see that all the time?"
    ]
  },
  {
    "id": 153,
    "text": "But I promise you that with hard work, they will be rewarding.",
    "chunks": [
      "But I promise you that with hard work,",
      "they will be rewarding."
    ],
    "translation": "하지만 열심히 노력한다면 분명 값진 보람이 있을 거라 약속합니다.",
    "prevContext": [
      "This course operates under traditional teaching methods.",
      "As business owners, your customers or clients would expect the same from you as I do.",
      "Now, these next few months aren’t going to be easy."
    ],
    "nextContext": [
      "You often find that people want to succeed, but they don’t want to work hard.",
      "You see that all the time?",
      "They don’t teach kids anything at most schools these days."
    ]
  },
  {
    "id": 154,
    "text": "You often find that people want to succeed, but they don’t want to work hard.",
    "chunks": [
      "You often find that people want to succeed,",
      "but they don’t want to work hard."
    ],
    "translation": "사람들은 성공을 바라면서도 열심히 일하기는 싫어하죠.",
    "prevContext": [
      "As business owners, your customers or clients would expect the same from you as I do.",
      "Now, these next few months aren’t going to be easy.",
      "But I promise you that with hard work, they will be rewarding."
    ],
    "nextContext": [
      "You see that all the time?",
      "They don’t teach kids anything at most schools these days.",
      "They just want good grades."
    ]
  },
  {
    "id": 155,
    "text": "You see that all the time?",
    "chunks": [
      "You see that all",
      "the time?"
    ],
    "translation": "늘상 그런 걸 보시나요?",
    "prevContext": [
      "Now, these next few months aren’t going to be easy.",
      "But I promise you that with hard work, they will be rewarding.",
      "You often find that people want to succeed, but they don’t want to work hard."
    ],
    "nextContext": [
      "They don’t teach kids anything at most schools these days.",
      "They just want good grades.",
      "They don’t really want to learn."
    ]
  },
  {
    "id": 156,
    "text": "They don’t teach kids anything at most schools these days.",
    "chunks": [
      "They don’t teach",
      "kids anything at",
      "most schools these days."
    ],
    "translation": "요즘 대부분의 학교는 아이들에게 제대로 된 걸 가르치지 않아요.",
    "prevContext": [
      "But I promise you that with hard work, they will be rewarding.",
      "You often find that people want to succeed, but they don’t want to work hard.",
      "You see that all the time?"
    ],
    "nextContext": [
      "They just want good grades.",
      "They don’t really want to learn.",
      "You hear stories about teachers helping students cheat."
    ]
  },
  {
    "id": 157,
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
      "You hear stories about teachers helping students cheat.",
      "They say our education system is getting worse."
    ]
  },
  {
    "id": 158,
    "text": "They don’t really want to learn.",
    "chunks": [
      "They don’t really want",
      "to learn."
    ],
    "translation": "진짜 배우고 싶어 하진 않아요.",
    "prevContext": [
      "You see that all the time?",
      "They don’t teach kids anything at most schools these days.",
      "They just want good grades."
    ],
    "nextContext": [
      "You hear stories about teachers helping students cheat.",
      "They say our education system is getting worse.",
      "Well, I’m glad we have such a dedicated teacher as you."
    ]
  },
  {
    "id": 159,
    "text": "You hear stories about teachers helping students cheat.",
    "chunks": [
      "You hear",
      "stories about",
      "teachers helping students cheat."
    ],
    "translation": "교사가 학생의 부정을 돕는다는 뉴스도 들리잖아요.",
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
    "id": 160,
    "text": "They say our education system is getting worse.",
    "chunks": [
      "They say",
      "our education",
      "system is getting worse."
    ],
    "translation": "교육 제도가 점점 악화되고 있다고들 하죠.",
    "prevContext": [
      "They just want good grades.",
      "They don’t really want to learn.",
      "You hear stories about teachers helping students cheat."
    ],
    "nextContext": [
      "Well, I’m glad we have such a dedicated teacher as you.",
      "You hear about teachers who don’t care at all.",
      "They say I’m tough, but effective."
    ]
  },
  {
    "id": 161,
    "text": "Well, I’m glad we have such a dedicated teacher as you.",
    "chunks": [
      "Well, I’m glad",
      "we have such",
      "a dedicated teacher as you."
    ],
    "translation": "교수님처럼 열정적인 분이 계셔서 참 다행입니다.",
    "prevContext": [
      "They don’t really want to learn.",
      "You hear stories about teachers helping students cheat.",
      "They say our education system is getting worse."
    ],
    "nextContext": [
      "You hear about teachers who don’t care at all.",
      "They say I’m tough, but effective.",
      "Let’s open our book to page four."
    ]
  },
  {
    "id": 162,
    "text": "You hear about teachers who don’t care at all.",
    "chunks": [
      "You hear about teachers",
      "who don’t care at all."
    ],
    "translation": "전혀 신경 쓰지 않는 교사들도 많잖아요.",
    "prevContext": [
      "You hear stories about teachers helping students cheat.",
      "They say our education system is getting worse.",
      "Well, I’m glad we have such a dedicated teacher as you."
    ],
    "nextContext": [
      "They say I’m tough, but effective.",
      "Let’s open our book to page four.",
      "Do you want to learn Arabic, but you don't have a lot of time?"
    ]
  },
  {
    "id": 163,
    "text": "They say I’m tough, but effective.",
    "chunks": [
      "They say I’m tough,",
      "but effective."
    ],
    "translation": "다들 제가 엄하지만 효과적이라고 하더군요.",
    "prevContext": [
      "They say our education system is getting worse.",
      "Well, I’m glad we have such a dedicated teacher as you.",
      "You hear about teachers who don’t care at all."
    ],
    "nextContext": [
      "Let’s open our book to page four.",
      "Do you want to learn Arabic, but you don't have a lot of time?",
      "Are you afraid it's going to be too difficult?"
    ]
  },
  {
    "id": 164,
    "text": "Let’s open our book to page four.",
    "chunks": [
      "Let’s open our book",
      "to page four."
    ],
    "translation": "교재 4페이지를 펴봅시다.",
    "prevContext": [
      "Well, I’m glad we have such a dedicated teacher as you.",
      "You hear about teachers who don’t care at all.",
      "They say I’m tough, but effective."
    ],
    "nextContext": [
      "Do you want to learn Arabic, but you don't have a lot of time?",
      "Are you afraid it's going to be too difficult?",
      "Have you struggled with language courses in the past?"
    ]
  },
  {
    "id": 165,
    "text": "Do you want to learn Arabic, but you don't have a lot of time?",
    "chunks": [
      "Do you want to learn Arabic,",
      "but you don't have a lot of time?"
    ],
    "translation": "아랍어를 배우고 싶지만 시간이 부족하신가요?",
    "prevContext": [
      "You hear about teachers who don’t care at all.",
      "They say I’m tough, but effective.",
      "Let’s open our book to page four."
    ],
    "nextContext": [
      "Are you afraid it's going to be too difficult?",
      "Have you struggled with language courses in the past?",
      "Don't worry about any of those things."
    ]
  },
  {
    "id": 166,
    "text": "Are you afraid it's going to be too difficult?",
    "chunks": [
      "Are you afraid it's going",
      "to be too difficult?"
    ],
    "translation": "너무 어려울까 봐 걱정되시나요?",
    "prevContext": [
      "They say I’m tough, but effective.",
      "Let’s open our book to page four.",
      "Do you want to learn Arabic, but you don't have a lot of time?"
    ],
    "nextContext": [
      "Have you struggled with language courses in the past?",
      "Don't worry about any of those things.",
      "We pair each student with a teaching tutor."
    ]
  },
  {
    "id": 167,
    "text": "Have you struggled with language courses in the past?",
    "chunks": [
      "Have you struggled",
      "with language courses",
      "in the past?"
    ],
    "translation": "과거에 어학 강좌로 고생한 적이 있으신가요?",
    "prevContext": [
      "Let’s open our book to page four.",
      "Do you want to learn Arabic, but you don't have a lot of time?",
      "Are you afraid it's going to be too difficult?"
    ],
    "nextContext": [
      "Don't worry about any of those things.",
      "We pair each student with a teaching tutor.",
      "We have very high standards for our tutors."
    ]
  },
  {
    "id": 168,
    "text": "Don't worry about any of those things.",
    "chunks": [
      "Don't worry",
      "about any of those things."
    ],
    "translation": "그런 걱정은 전혀 하지 마세요.",
    "prevContext": [
      "Do you want to learn Arabic, but you don't have a lot of time?",
      "Are you afraid it's going to be too difficult?",
      "Have you struggled with language courses in the past?"
    ],
    "nextContext": [
      "We pair each student with a teaching tutor.",
      "We have very high standards for our tutors.",
      "They have teaching degrees, live in an Arabic-speaking country, and are bilingual."
    ]
  },
  {
    "id": 169,
    "text": "We pair each student with a teaching tutor.",
    "chunks": [
      "We pair each student",
      "with a teaching tutor."
    ],
    "translation": "저희는 학생마다 전담 지도 튜터를 매칭해 드립니다.",
    "prevContext": [
      "Are you afraid it's going to be too difficult?",
      "Have you struggled with language courses in the past?",
      "Don't worry about any of those things."
    ],
    "nextContext": [
      "We have very high standards for our tutors.",
      "They have teaching degrees, live in an Arabic-speaking country, and are bilingual.",
      "Their native language is Arabic, but they are also fluent in English."
    ]
  },
  {
    "id": 170,
    "text": "We have very high standards for our tutors.",
    "chunks": [
      "We have very high standards",
      "for our tutors."
    ],
    "translation": "저희 튜터진은 엄격한 기준을 통과했습니다.",
    "prevContext": [
      "Have you struggled with language courses in the past?",
      "Don't worry about any of those things.",
      "We pair each student with a teaching tutor."
    ],
    "nextContext": [
      "They have teaching degrees, live in an Arabic-speaking country, and are bilingual.",
      "Their native language is Arabic, but they are also fluent in English.",
      "We are also careful when we pair our students with teaching tutors."
    ]
  },
  {
    "id": 171,
    "text": "They have teaching degrees, live in an Arabic-speaking country, and are bilingual.",
    "chunks": [
      "They have teaching degrees,",
      "live in an Arabic-speaking country,",
      "and are bilingual."
    ],
    "translation": "교육 학위를 보유하고 아랍어권에 거주하는 이중언어 구사자들입니다.",
    "prevContext": [
      "Don't worry about any of those things.",
      "We pair each student with a teaching tutor.",
      "We have very high standards for our tutors."
    ],
    "nextContext": [
      "Their native language is Arabic, but they are also fluent in English.",
      "We are also careful when we pair our students with teaching tutors.",
      "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable."
    ]
  },
  {
    "id": 172,
    "text": "Their native language is Arabic, but they are also fluent in English.",
    "chunks": [
      "Their native language is Arabic,",
      "but they are also fluent in English."
    ],
    "translation": "모국어는 아랍어이지만 영어 또한 원어민처럼 유창합니다.",
    "prevContext": [
      "We pair each student with a teaching tutor.",
      "We have very high standards for our tutors.",
      "They have teaching degrees, live in an Arabic-speaking country, and are bilingual."
    ],
    "nextContext": [
      "We are also careful when we pair our students with teaching tutors.",
      "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable.",
      "So, how does it work?"
    ]
  },
  {
    "id": 173,
    "text": "We are also careful when we pair our students with teaching tutors.",
    "chunks": [
      "We are also careful",
      "when we pair our students",
      "with teaching tutors."
    ],
    "translation": "학생과 튜터 매칭에 세심한 주의를 기울입니다.",
    "prevContext": [
      "We have very high standards for our tutors.",
      "They have teaching degrees, live in an Arabic-speaking country, and are bilingual.",
      "Their native language is Arabic, but they are also fluent in English."
    ],
    "nextContext": [
      "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable.",
      "So, how does it work?",
      "All you need is a computer with a webcam and a high-speed internet connection."
    ]
  },
  {
    "id": 174,
    "text": "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable.",
    "chunks": [
      "In contrast to some language schools,",
      "at Arabic Online,",
      "we want learning to be enjoyable."
    ],
    "translation": "저희는 배움 자체가 즐겁기를 바랍니다.",
    "prevContext": [
      "They have teaching degrees, live in an Arabic-speaking country, and are bilingual.",
      "Their native language is Arabic, but they are also fluent in English.",
      "We are also careful when we pair our students with teaching tutors."
    ],
    "nextContext": [
      "So, how does it work?",
      "All you need is a computer with a webcam and a high-speed internet connection.",
      "We give you the telecommunications software you need to download."
    ]
  },
  {
    "id": 175,
    "text": "So, how does it work?",
    "chunks": [
      "So, how",
      "does it work?"
    ],
    "translation": "어떻게 진행되냐고요?",
    "prevContext": [
      "Their native language is Arabic, but they are also fluent in English.",
      "We are also careful when we pair our students with teaching tutors.",
      "In contrast to some language schools, at Arabic Online, we want learning to be enjoyable."
    ],
    "nextContext": [
      "All you need is a computer with a webcam and a high-speed internet connection.",
      "We give you the telecommunications software you need to download.",
      "You will take online lessons while you learn the Arabic writing system and grammar."
    ]
  },
  {
    "id": 176,
    "text": "All you need is a computer with a webcam and a high-speed internet connection.",
    "chunks": [
      "All you need is",
      "a computer with a webcam",
      "and a high-speed internet connection."
    ],
    "translation": "웹캠이 달린 컴퓨터와 인터넷만 있으면 됩니다.",
    "prevContext": [
      "We are also careful when we pair our students with teaching tutors.",
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
    "id": 177,
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
    "id": 178,
    "text": "You will take online lessons while you learn the Arabic writing system and grammar.",
    "chunks": [
      "You will take online",
      "lessons while you learn the",
      "Arabic writing system and grammar."
    ],
    "translation": "아랍어 문자와 문법을 온라인 강의로 쉽게 학습합니다.",
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
    "id": 179,
    "text": "This is done with a series of interactive presentations.",
    "chunks": [
      "This is done",
      "with a series of interactive presentations."
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
    "id": 180,
    "text": "First, you watch a short presentation, and then you practice what you learned by completing exercises.",
    "chunks": [
      "First,",
      "you watch a short presentation,",
      "and then you practice what",
      "you learned by completing exercises."
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
    "id": 181,
    "text": "After you finish each lesson, you work with your teaching tutor in a video chat.",
    "chunks": [
      "After you finish each lesson,",
      "you work with your teaching tutor in a video chat."
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
      "You learn language, and then immediately use it to communicate."
    ]
  },
  {
    "id": 182,
    "text": "You can ask questions about the lesson.",
    "chunks": [
      "You can ask questions",
      "about the lesson."
    ],
    "translation": "궁금한 점은 무엇이든 질문할 수 있습니다.",
    "prevContext": [
      "This is done with a series of interactive presentations.",
      "First, you watch a short presentation, and then you practice what you learned by completing exercises.",
      "After you finish each lesson, you work with your teaching tutor in a video chat."
    ],
    "nextContext": [
      "After that, you practice what you learned by having conversations in Arabic with your tutor.",
      "You learn language, and then immediately use it to communicate.",
      "There is nothing like speaking with a native speaker as you learn a language."
    ]
  },
  {
    "id": 183,
    "text": "After that, you practice what you learned by having conversations in Arabic with your tutor.",
    "chunks": [
      "After that,",
      "you practice what you learned by having conversations in Arabic with your tutor."
    ],
    "translation": "배운 내용을 활용해 아랍어로 실전 회화를 나눕니다.",
    "prevContext": [
      "First, you watch a short presentation, and then you practice what you learned by completing exercises.",
      "After you finish each lesson, you work with your teaching tutor in a video chat.",
      "You can ask questions about the lesson."
    ],
    "nextContext": [
      "You learn language, and then immediately use it to communicate.",
      "There is nothing like speaking with a native speaker as you learn a language.",
      "We also offer optional trips to Dubai so that you can really surround yourself with the language."
    ]
  },
  {
    "id": 184,
    "text": "You learn language, and then immediately use it to communicate.",
    "chunks": [
      "You learn language,",
      "and then immediately use it to communicate."
    ],
    "translation": "배운 직후 바로 대화에 적용해 봅니다.",
    "prevContext": [
      "After you finish each lesson, you work with your teaching tutor in a video chat.",
      "You can ask questions about the lesson.",
      "After that, you practice what you learned by having conversations in Arabic with your tutor."
    ],
    "nextContext": [
      "There is nothing like speaking with a native speaker as you learn a language.",
      "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
      "We have courses that last two and four weeks."
    ]
  },
  {
    "id": 185,
    "text": "There is nothing like speaking with a native speaker as you learn a language.",
    "chunks": [
      "There is nothing like",
      "speaking with a native speaker",
      "as you learn a language."
    ],
    "translation": "원어민과의 직접 대화보다 좋은 공부법은 없습니다.",
    "prevContext": [
      "You can ask questions about the lesson.",
      "After that, you practice what you learned by having conversations in Arabic with your tutor.",
      "You learn language, and then immediately use it to communicate."
    ],
    "nextContext": [
      "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
      "We have courses that last two and four weeks.",
      "You fly to Dubai and stay with an Arabic-speaking family."
    ]
  },
  {
    "id": 186,
    "text": "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
    "chunks": [
      "We also offer optional trips",
      "to Dubai so that you can",
      "really surround yourself with the language."
    ],
    "translation": "현지 언어 환경에 몰입할 수 있는 두바이 어학연수도 지원합니다.",
    "prevContext": [
      "After that, you practice what you learned by having conversations in Arabic with your tutor.",
      "You learn language, and then immediately use it to communicate.",
      "There is nothing like speaking with a native speaker as you learn a language."
    ],
    "nextContext": [
      "We have courses that last two and four weeks.",
      "You fly to Dubai and stay with an Arabic-speaking family.",
      "Our program offers classes for everyone, from complete beginners to advanced students."
    ]
  },
  {
    "id": 187,
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
      "Our program offers classes for everyone, from complete beginners to advanced students.",
      "Do you want to take advantage of the benefits that Arabic Online offers?"
    ]
  },
  {
    "id": 188,
    "text": "You fly to Dubai and stay with an Arabic-speaking family.",
    "chunks": [
      "You fly",
      "to Dubai",
      "and stay with an Arabic-speaking family."
    ],
    "translation": "두바이 현지 홈스테이 가정에 머물며 생활합니다.",
    "prevContext": [
      "There is nothing like speaking with a native speaker as you learn a language.",
      "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
      "We have courses that last two and four weeks."
    ],
    "nextContext": [
      "Our program offers classes for everyone, from complete beginners to advanced students.",
      "Do you want to take advantage of the benefits that Arabic Online offers?",
      "Click here to chat with a teaching tutor now."
    ]
  },
  {
    "id": 189,
    "text": "Our program offers classes for everyone, from complete beginners to advanced students.",
    "chunks": [
      "Our program offers classes for everyone,",
      "from complete beginners to advanced students."
    ],
    "translation": "왕초보부터 고급자까지 모든 수준에 맞춘 강좌가 있습니다.",
    "prevContext": [
      "We also offer optional trips to Dubai so that you can really surround yourself with the language.",
      "We have courses that last two and four weeks.",
      "You fly to Dubai and stay with an Arabic-speaking family."
    ],
    "nextContext": [
      "Do you want to take advantage of the benefits that Arabic Online offers?",
      "Click here to chat with a teaching tutor now.",
      "What can I do for you?"
    ]
  },
  {
    "id": 190,
    "text": "Do you want to take advantage of the benefits that Arabic Online offers?",
    "chunks": [
      "Do you want to",
      "take advantage of the",
      "benefits that Arabic Online offers?"
    ],
    "translation": "아랍어 온라인만의 특별한 혜택을 누려보시겠어요?",
    "prevContext": [
      "We have courses that last two and four weeks.",
      "You fly to Dubai and stay with an Arabic-speaking family.",
      "Our program offers classes for everyone, from complete beginners to advanced students."
    ],
    "nextContext": [
      "Click here to chat with a teaching tutor now.",
      "What can I do for you?",
      "I thought riding my bike to work would get me across town so quickly."
    ]
  },
  {
    "id": 191,
    "text": "Click here to chat with a teaching tutor now.",
    "chunks": [
      "Click here",
      "to chat",
      "with a teaching tutor now."
    ],
    "translation": "지금 바로 튜터와 상담을 시작해 보세요.",
    "prevContext": [
      "You fly to Dubai and stay with an Arabic-speaking family.",
      "Our program offers classes for everyone, from complete beginners to advanced students.",
      "Do you want to take advantage of the benefits that Arabic Online offers?"
    ],
    "nextContext": [
      "What can I do for you?",
      "I thought riding my bike to work would get me across town so quickly.",
      "I was trying to switch gears when I ran over a curve."
    ]
  },
  {
    "id": 192,
    "text": "What can I do for you?",
    "chunks": [
      "What can I do",
      "for you?"
    ],
    "translation": "무엇을 도와드릴까요?",
    "prevContext": [
      "Our program offers classes for everyone, from complete beginners to advanced students.",
      "Do you want to take advantage of the benefits that Arabic Online offers?",
      "Click here to chat with a teaching tutor now."
    ],
    "nextContext": [
      "I thought riding my bike to work would get me across town so quickly.",
      "I was trying to switch gears when I ran over a curve.",
      "Now, I have a flat tire, so I'm in a hurry."
    ]
  },
  {
    "id": 193,
    "text": "I thought riding my bike to work would get me across town so quickly.",
    "chunks": [
      "I thought riding my",
      "bike to work would get",
      "me across town so quickly."
    ],
    "translation": "자전거로 출근하면 도심을 빨리 가로지를 수 있을 줄 알았어요.",
    "prevContext": [
      "Do you want to take advantage of the benefits that Arabic Online offers?",
      "Click here to chat with a teaching tutor now.",
      "What can I do for you?"
    ],
    "nextContext": [
      "I was trying to switch gears when I ran over a curve.",
      "Now, I have a flat tire, so I'm in a hurry.",
      "Sure, let me take a look at that thing."
    ]
  },
  {
    "id": 194,
    "text": "I was trying to switch gears when I ran over a curve.",
    "chunks": [
      "I was trying",
      "to switch gears",
      "when I ran over a curve."
    ],
    "translation": "기어를 바꾸려다 도로 연석 턱에 부딪혔거든요.",
    "prevContext": [
      "Click here to chat with a teaching tutor now.",
      "What can I do for you?",
      "I thought riding my bike to work would get me across town so quickly."
    ],
    "nextContext": [
      "Now, I have a flat tire, so I'm in a hurry.",
      "Sure, let me take a look at that thing.",
      "Ah, I see your problem right here."
    ]
  },
  {
    "id": 195,
    "text": "Now, I have a flat tire, so I'm in a hurry.",
    "chunks": [
      "Now, I have a flat tire,",
      "so I'm",
      "in a hurry."
    ],
    "translation": "지금 타이어에 펑크가 나서 무척 급합니다.",
    "prevContext": [
      "What can I do for you?",
      "I thought riding my bike to work would get me across town so quickly.",
      "I was trying to switch gears when I ran over a curve."
    ],
    "nextContext": [
      "Sure, let me take a look at that thing.",
      "Ah, I see your problem right here.",
      "You’ve got a nail stuck in the tire."
    ]
  },
  {
    "id": 196,
    "text": "Sure, let me take a look at that thing.",
    "chunks": [
      "Sure, let me",
      "take a look",
      "at that thing."
    ],
    "translation": "그럼요, 어디 한번 살펴봅시다.",
    "prevContext": [
      "I thought riding my bike to work would get me across town so quickly.",
      "I was trying to switch gears when I ran over a curve.",
      "Now, I have a flat tire, so I'm in a hurry."
    ],
    "nextContext": [
      "Ah, I see your problem right here.",
      "You’ve got a nail stuck in the tire.",
      "Your bike chain is coming loose."
    ]
  },
  {
    "id": 197,
    "text": "Ah, I see your problem right here.",
    "chunks": [
      "Ah, I see",
      "your problem right here."
    ],
    "translation": "아, 문제가 뭔지 바로 보이네요.",
    "prevContext": [
      "I was trying to switch gears when I ran over a curve.",
      "Now, I have a flat tire, so I'm in a hurry.",
      "Sure, let me take a look at that thing."
    ],
    "nextContext": [
      "You’ve got a nail stuck in the tire.",
      "Your bike chain is coming loose.",
      "Do you want me to fix that too?"
    ]
  },
  {
    "id": 198,
    "text": "You’ve got a nail stuck in the tire.",
    "chunks": [
      "You’ve got a nail stuck",
      "in the tire."
    ],
    "translation": "타이어에 못이 박혔군요.",
    "prevContext": [
      "Now, I have a flat tire, so I'm in a hurry.",
      "Sure, let me take a look at that thing.",
      "Ah, I see your problem right here."
    ],
    "nextContext": [
      "Your bike chain is coming loose.",
      "Do you want me to fix that too?",
      "Since you’re here, I’d recommend adding plastic covers to your handlebars."
    ]
  },
  {
    "id": 199,
    "text": "Your bike chain is coming loose.",
    "chunks": [
      "Your bike chain",
      "is coming loose."
    ],
    "translation": "체인이 헐거워져 빠지려 하네요.",
    "prevContext": [
      "Sure, let me take a look at that thing.",
      "Ah, I see your problem right here.",
      "You’ve got a nail stuck in the tire."
    ],
    "nextContext": [
      "Do you want me to fix that too?",
      "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
      "See how the grips seem to be wearing down."
    ]
  },
  {
    "id": 200,
    "text": "Do you want me to fix that too?",
    "chunks": [
      "Do you want me",
      "to fix that too?"
    ],
    "translation": "이것도 손봐드릴까요?",
    "prevContext": [
      "Ah, I see your problem right here.",
      "You’ve got a nail stuck in the tire.",
      "Your bike chain is coming loose."
    ],
    "nextContext": [
      "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
      "See how the grips seem to be wearing down.",
      "If your hands slip off, that would be dangerous."
    ]
  },
  {
    "id": 201,
    "text": "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
    "chunks": [
      "Since you’re here,",
      "I’d recommend adding plastic covers to your handlebars."
    ],
    "translation": "오신 김에 핸들 그립 덮개도 씌우시는 걸 추천해요.",
    "prevContext": [
      "You’ve got a nail stuck in the tire.",
      "Your bike chain is coming loose.",
      "Do you want me to fix that too?"
    ],
    "nextContext": [
      "See how the grips seem to be wearing down.",
      "If your hands slip off, that would be dangerous.",
      "I can’t be late to this meeting."
    ]
  },
  {
    "id": 202,
    "text": "See how the grips seem to be wearing down.",
    "chunks": [
      "See how the grips seem",
      "to be wearing down."
    ],
    "translation": "손잡이가 많이 닳아 있는 거 보이시죠.",
    "prevContext": [
      "Your bike chain is coming loose.",
      "Do you want me to fix that too?",
      "Since you’re here, I’d recommend adding plastic covers to your handlebars."
    ],
    "nextContext": [
      "If your hands slip off, that would be dangerous.",
      "I can’t be late to this meeting.",
      "Wow, I can’t believe your bike only has five gears."
    ]
  },
  {
    "id": 203,
    "text": "If your hands slip off, that would be dangerous.",
    "chunks": [
      "If your hands slip off,",
      "that would be dangerous."
    ],
    "translation": "손이 미끄러지면 아주 위험할 수 있거든요.",
    "prevContext": [
      "Do you want me to fix that too?",
      "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
      "See how the grips seem to be wearing down."
    ],
    "nextContext": [
      "I can’t be late to this meeting.",
      "Wow, I can’t believe your bike only has five gears.",
      "I don’t need a new bike."
    ]
  },
  {
    "id": 204,
    "text": "I can’t be late to this meeting.",
    "chunks": [
      "I can’t be late",
      "to this meeting."
    ],
    "translation": "저 이번 미팅에 늦으면 안 돼요.",
    "prevContext": [
      "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
      "See how the grips seem to be wearing down.",
      "If your hands slip off, that would be dangerous."
    ],
    "nextContext": [
      "Wow, I can’t believe your bike only has five gears.",
      "I don’t need a new bike.",
      "I need a new tire."
    ]
  },
  {
    "id": 205,
    "text": "Wow, I can’t believe your bike only has five gears.",
    "chunks": [
      "Wow, I can’t",
      "believe your bike",
      "only has five gears."
    ],
    "translation": "세상에, 자전거 기어가 5단밖에 안 되네요.",
    "prevContext": [
      "See how the grips seem to be wearing down.",
      "If your hands slip off, that would be dangerous.",
      "I can’t be late to this meeting."
    ],
    "nextContext": [
      "I don’t need a new bike.",
      "I need a new tire.",
      "I didn’t mean to yell."
    ]
  },
  {
    "id": 206,
    "text": "I don’t need a new bike.",
    "chunks": [
      "I don’t need",
      "a new bike."
    ],
    "translation": "새 자전거는 필요 없어요.",
    "prevContext": [
      "If your hands slip off, that would be dangerous.",
      "I can’t be late to this meeting.",
      "Wow, I can’t believe your bike only has five gears."
    ],
    "nextContext": [
      "I need a new tire.",
      "I didn’t mean to yell.",
      "I’m running late for an appointment."
    ]
  },
  {
    "id": 207,
    "text": "I need a new tire.",
    "chunks": [
      "I need",
      "a new tire."
    ],
    "translation": "타이어만 갈아주시면 돼요.",
    "prevContext": [
      "I can’t be late to this meeting.",
      "Wow, I can’t believe your bike only has five gears.",
      "I don’t need a new bike."
    ],
    "nextContext": [
      "I didn’t mean to yell.",
      "I’m running late for an appointment.",
      "Let me pay you for the tire, and I’ll come back later to discuss the other problems."
    ]
  },
  {
    "id": 208,
    "text": "I didn’t mean to yell.",
    "chunks": [
      "I didn’t mean",
      "to yell."
    ],
    "translation": "소리 지르려던 건 아니었어요.",
    "prevContext": [
      "Wow, I can’t believe your bike only has five gears.",
      "I don’t need a new bike.",
      "I need a new tire."
    ],
    "nextContext": [
      "I’m running late for an appointment.",
      "Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
      "It looks like your water glass is empty."
    ]
  },
  {
    "id": 209,
    "text": "I’m running late for an appointment.",
    "chunks": [
      "I’m running late",
      "for an appointment."
    ],
    "translation": "약속 시간에 늦어서 그래요.",
    "prevContext": [
      "I don’t need a new bike.",
      "I need a new tire.",
      "I didn’t mean to yell."
    ],
    "nextContext": [
      "Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
      "It looks like your water glass is empty.",
      "Would you like me to fill it up?"
    ]
  },
  {
    "id": 210,
    "text": "Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
    "chunks": [
      "Let me pay you for the tire,",
      "and I’ll come back later to discuss the other problems."
    ],
    "translation": "타이어 비용만 먼저 내고 나중에 다시 와서 상담받을게요.",
    "prevContext": [
      "I need a new tire.",
      "I didn’t mean to yell.",
      "I’m running late for an appointment."
    ],
    "nextContext": [
      "It looks like your water glass is empty.",
      "Would you like me to fill it up?",
      "Great to see you Khae."
    ]
  },
  {
    "id": 211,
    "text": "It looks like your water glass is empty.",
    "chunks": [
      "It looks",
      "like your",
      "water glass is empty."
    ],
    "translation": "물잔이 빈 것 같네요.",
    "prevContext": [
      "I didn’t mean to yell.",
      "I’m running late for an appointment.",
      "Let me pay you for the tire, and I’ll come back later to discuss the other problems."
    ],
    "nextContext": [
      "Would you like me to fill it up?",
      "Great to see you Khae.",
      "I would like to go over the primary benefits of choosing me as your investor."
    ]
  },
  {
    "id": 212,
    "text": "Would you like me to fill it up?",
    "chunks": [
      "Would you like me",
      "to fill it up?"
    ],
    "translation": "물 좀 더 채워드릴까요?",
    "prevContext": [
      "I’m running late for an appointment.",
      "Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
      "It looks like your water glass is empty."
    ],
    "nextContext": [
      "Great to see you Khae.",
      "I would like to go over the primary benefits of choosing me as your investor.",
      "I want you to pick me as opposed to anyone else."
    ]
  },
  {
    "id": 213,
    "text": "Great to see you Khae.",
    "chunks": [
      "Great to",
      "see you Khae."
    ],
    "translation": "만나서 반가워 카이.",
    "prevContext": [
      "Let me pay you for the tire, and I’ll come back later to discuss the other problems.",
      "It looks like your water glass is empty.",
      "Would you like me to fill it up?"
    ],
    "nextContext": [
      "I would like to go over the primary benefits of choosing me as your investor.",
      "I want you to pick me as opposed to anyone else.",
      "I’m so excited you have a working prototype."
    ]
  },
  {
    "id": 214,
    "text": "I would like to go over the primary benefits of choosing me as your investor.",
    "chunks": [
      "I would like to go",
      "over the primary benefits of",
      "choosing me as your investor."
    ],
    "translation": "저를 투자자로 선택했을 때의 핵심 이점들을 설명해 드리고 싶어요.",
    "prevContext": [
      "It looks like your water glass is empty.",
      "Would you like me to fill it up?",
      "Great to see you Khae."
    ],
    "nextContext": [
      "I want you to pick me as opposed to anyone else.",
      "I’m so excited you have a working prototype.",
      "What’s the primary reason we should choose you as opposed to anyone else?"
    ]
  },
  {
    "id": 215,
    "text": "I want you to pick me as opposed to anyone else.",
    "chunks": [
      "I want you",
      "to pick me as opposed",
      "to anyone else."
    ],
    "translation": "다른 누구보다 저를 선택해 주셨으면 합니다.",
    "prevContext": [
      "Would you like me to fill it up?",
      "Great to see you Khae.",
      "I would like to go over the primary benefits of choosing me as your investor."
    ],
    "nextContext": [
      "I’m so excited you have a working prototype.",
      "What’s the primary reason we should choose you as opposed to anyone else?",
      "You should let me invest in your company because of my enthusiasm and my commitment."
    ]
  },
  {
    "id": 216,
    "text": "I’m so excited you have a working prototype.",
    "chunks": [
      "I’m so",
      "excited you",
      "have a working prototype."
    ],
    "translation": "작동하는 시제품이 있다는 소식에 정말 가슴이 뛰네요.",
    "prevContext": [
      "Great to see you Khae.",
      "I would like to go over the primary benefits of choosing me as your investor.",
      "I want you to pick me as opposed to anyone else."
    ],
    "nextContext": [
      "What’s the primary reason we should choose you as opposed to anyone else?",
      "You should let me invest in your company because of my enthusiasm and my commitment.",
      "The former reason will guarantee my excitement for your product doesn’t decrease."
    ]
  },
  {
    "id": 217,
    "text": "What’s the primary reason we should choose you as opposed to anyone else?",
    "chunks": [
      "What’s the primary reason",
      "we should choose you",
      "as opposed to anyone else?"
    ],
    "translation": "저희가 다른 투자자 대신 당신을 택해야 하는 주된 이유가 뭘까요?",
    "prevContext": [
      "I would like to go over the primary benefits of choosing me as your investor.",
      "I want you to pick me as opposed to anyone else.",
      "I’m so excited you have a working prototype."
    ],
    "nextContext": [
      "You should let me invest in your company because of my enthusiasm and my commitment.",
      "The former reason will guarantee my excitement for your product doesn’t decrease.",
      "The latter will guarantee that we work together for a long time."
    ]
  },
  {
    "id": 218,
    "text": "You should let me invest in your company because of my enthusiasm and my commitment.",
    "chunks": [
      "You should let me invest",
      "in your company because of",
      "my enthusiasm and my commitment."
    ],
    "translation": "제 뜨거운 열정과 헌신을 보고 투자하게 해주셔야 합니다.",
    "prevContext": [
      "I want you to pick me as opposed to anyone else.",
      "I’m so excited you have a working prototype.",
      "What’s the primary reason we should choose you as opposed to anyone else?"
    ],
    "nextContext": [
      "The former reason will guarantee my excitement for your product doesn’t decrease.",
      "The latter will guarantee that we work together for a long time.",
      "I’m open to signing the contract."
    ]
  },
  {
    "id": 219,
    "text": "The former reason will guarantee my excitement for your product doesn’t decrease.",
    "chunks": [
      "The former reason will guarantee my excitement",
      "for your product doesn’t decrease."
    ],
    "translation": "전자는 제품에 대한 제 열정이 식지 않음을 보장할 것입니다.",
    "prevContext": [
      "I’m so excited you have a working prototype.",
      "What’s the primary reason we should choose you as opposed to anyone else?",
      "You should let me invest in your company because of my enthusiasm and my commitment."
    ],
    "nextContext": [
      "The latter will guarantee that we work together for a long time.",
      "I’m open to signing the contract.",
      "I want to be there."
    ]
  },
  {
    "id": 220,
    "text": "The latter will guarantee that we work together for a long time.",
    "chunks": [
      "The latter will guarantee",
      "that we work together",
      "for a long time."
    ],
    "translation": "후자는 우리가 오랫동안 함께 일할 것임을 보장할 테고요.",
    "prevContext": [
      "What’s the primary reason we should choose you as opposed to anyone else?",
      "You should let me invest in your company because of my enthusiasm and my commitment.",
      "The former reason will guarantee my excitement for your product doesn’t decrease."
    ],
    "nextContext": [
      "I’m open to signing the contract.",
      "I want to be there.",
      "In conclusion, I can double what any other investor offers."
    ]
  },
  {
    "id": 221,
    "text": "I’m open to signing the contract.",
    "chunks": [
      "I’m open",
      "to signing the contract."
    ],
    "translation": "저는 지금 당장 계약서에 서명할 준비가 되어 있습니다.",
    "prevContext": [
      "You should let me invest in your company because of my enthusiasm and my commitment.",
      "The former reason will guarantee my excitement for your product doesn’t decrease.",
      "The latter will guarantee that we work together for a long time."
    ],
    "nextContext": [
      "I want to be there.",
      "In conclusion, I can double what any other investor offers.",
      "That’s how much I want to work with you."
    ]
  },
  {
    "id": 222,
    "text": "I want to be there.",
    "chunks": [
      "I want",
      "to be there."
    ],
    "translation": "늘 함께하고 싶어요.",
    "prevContext": [
      "The former reason will guarantee my excitement for your product doesn’t decrease.",
      "The latter will guarantee that we work together for a long time.",
      "I’m open to signing the contract."
    ],
    "nextContext": [
      "In conclusion, I can double what any other investor offers.",
      "That’s how much I want to work with you.",
      "Let me invest in your company."
    ]
  },
  {
    "id": 223,
    "text": "In conclusion, I can double what any other investor offers.",
    "chunks": [
      "In conclusion,",
      "I can double what any other investor offers."
    ],
    "translation": "결론적으로, 다른 투자자가 부른 금액의 2배를 투자하겠습니다.",
    "prevContext": [
      "The latter will guarantee that we work together for a long time.",
      "I’m open to signing the contract.",
      "I want to be there."
    ],
    "nextContext": [
      "That’s how much I want to work with you.",
      "Let me invest in your company.",
      "Thank you for your interest in the People company."
    ]
  },
  {
    "id": 224,
    "text": "That’s how much I want to work with you.",
    "chunks": [
      "That’s how much I want",
      "to work with you."
    ],
    "translation": "그만큼 여러분과 꼭 함께하고 싶습니다.",
    "prevContext": [
      "I’m open to signing the contract.",
      "I want to be there.",
      "In conclusion, I can double what any other investor offers."
    ],
    "nextContext": [
      "Let me invest in your company.",
      "Thank you for your interest in the People company.",
      "We’ll review your materials and contact you soon."
    ]
  },
  {
    "id": 225,
    "text": "Let me invest in your company.",
    "chunks": [
      "Let me invest",
      "in your company."
    ],
    "translation": "여러분의 회사에 투자하게 해주세요.",
    "prevContext": [
      "I want to be there.",
      "In conclusion, I can double what any other investor offers.",
      "That’s how much I want to work with you."
    ],
    "nextContext": [
      "Thank you for your interest in the People company.",
      "We’ll review your materials and contact you soon.",
      "Every investor we meet wants to work with us."
    ]
  },
  {
    "id": 226,
    "text": "Thank you for your interest in the People company.",
    "chunks": [
      "Thank you",
      "for your interest",
      "in the People company."
    ],
    "translation": "저희 피플 컴퍼니에 관심 가져주셔서 감사합니다.",
    "prevContext": [
      "In conclusion, I can double what any other investor offers.",
      "That’s how much I want to work with you.",
      "Let me invest in your company."
    ],
    "nextContext": [
      "We’ll review your materials and contact you soon.",
      "Every investor we meet wants to work with us.",
      "We’re going to be rich Marco."
    ]
  },
  {
    "id": 227,
    "text": "We’ll review your materials and contact you soon.",
    "chunks": [
      "We’ll review your materials",
      "and contact you soon."
    ],
    "translation": "보내주신 자료를 신중히 검토한 뒤 곧 연락드리겠습니다.",
    "prevContext": [
      "That’s how much I want to work with you.",
      "Let me invest in your company.",
      "Thank you for your interest in the People company."
    ],
    "nextContext": [
      "Every investor we meet wants to work with us.",
      "We’re going to be rich Marco.",
      "I’ve always wanted to go on a long cruise."
    ]
  },
  {
    "id": 228,
    "text": "Every investor we meet wants to work with us.",
    "chunks": [
      "Every investor we meet wants",
      "to work with us."
    ],
    "translation": "만나는 투자자마다 우리와 일하고 싶어 안달이야.",
    "prevContext": [
      "Let me invest in your company.",
      "Thank you for your interest in the People company.",
      "We’ll review your materials and contact you soon."
    ],
    "nextContext": [
      "We’re going to be rich Marco.",
      "I’ve always wanted to go on a long cruise.",
      "Maybe we can go on one of those cruises that travels around the world."
    ]
  },
  {
    "id": 229,
    "text": "We’re going to be rich Marco.",
    "chunks": [
      "We’re going",
      "to be rich Marco."
    ],
    "translation": "우리 부자 될 거야 마르코.",
    "prevContext": [
      "Thank you for your interest in the People company.",
      "We’ll review your materials and contact you soon.",
      "Every investor we meet wants to work with us."
    ],
    "nextContext": [
      "I’ve always wanted to go on a long cruise.",
      "Maybe we can go on one of those cruises that travels around the world.",
      "I can imagine it now."
    ]
  },
  {
    "id": 230,
    "text": "I’ve always wanted to go on a long cruise.",
    "chunks": [
      "I’ve always wanted",
      "to go on a long cruise."
    ],
    "translation": "난 늘 호화 크루즈 여행을 떠나고 싶었어.",
    "prevContext": [
      "We’ll review your materials and contact you soon.",
      "Every investor we meet wants to work with us.",
      "We’re going to be rich Marco."
    ],
    "nextContext": [
      "Maybe we can go on one of those cruises that travels around the world.",
      "I can imagine it now.",
      "I always dreamed of going on a hiking expedition through the Himalayas."
    ]
  },
  {
    "id": 231,
    "text": "Maybe we can go on one of those cruises that travels around the world.",
    "chunks": [
      "Maybe we can go",
      "on one of those cruises",
      "that travels around the world."
    ],
    "translation": "세계일주 크루즈 여행을 떠날 수도 있겠지.",
    "prevContext": [
      "Every investor we meet wants to work with us.",
      "We’re going to be rich Marco.",
      "I’ve always wanted to go on a long cruise."
    ],
    "nextContext": [
      "I can imagine it now.",
      "I always dreamed of going on a hiking expedition through the Himalayas.",
      "I hear the views from the mountains are breathtaking."
    ]
  },
  {
    "id": 232,
    "text": "I can imagine it now.",
    "chunks": [
      "I can",
      "imagine it now."
    ],
    "translation": "벌써 눈앞에 그려져.",
    "prevContext": [
      "We’re going to be rich Marco.",
      "I’ve always wanted to go on a long cruise.",
      "Maybe we can go on one of those cruises that travels around the world."
    ],
    "nextContext": [
      "I always dreamed of going on a hiking expedition through the Himalayas.",
      "I hear the views from the mountains are breathtaking.",
      "However, we haven’t received a check yet."
    ]
  },
  {
    "id": 233,
    "text": "I always dreamed of going on a hiking expedition through the Himalayas.",
    "chunks": [
      "I always dreamed of",
      "going on a hiking",
      "expedition through the Himalayas."
    ],
    "translation": "난 늘 히말라야 트레킹 원정을 꿈꿨어.",
    "prevContext": [
      "I’ve always wanted to go on a long cruise.",
      "Maybe we can go on one of those cruises that travels around the world.",
      "I can imagine it now."
    ],
    "nextContext": [
      "I hear the views from the mountains are breathtaking.",
      "However, we haven’t received a check yet.",
      "Maybe we can go biking out into the countryside tomorrow."
    ]
  },
  {
    "id": 234,
    "text": "I hear the views from the mountains are breathtaking.",
    "chunks": [
      "I hear the",
      "views from the",
      "mountains are breathtaking."
    ],
    "translation": "산에서 바라보는 절경이 숨 막히게 아름답다고 하더라고.",
    "prevContext": [
      "Maybe we can go on one of those cruises that travels around the world.",
      "I can imagine it now.",
      "I always dreamed of going on a hiking expedition through the Himalayas."
    ],
    "nextContext": [
      "However, we haven’t received a check yet.",
      "Maybe we can go biking out into the countryside tomorrow.",
      "I don’t know if I want to go biking again for a while."
    ]
  },
  {
    "id": 235,
    "text": "However, we haven’t received a check yet.",
    "chunks": [
      "However, we haven’t",
      "received a check yet."
    ],
    "translation": "하지만 아직 입금된 수표는 없잖아.",
    "prevContext": [
      "I can imagine it now.",
      "I always dreamed of going on a hiking expedition through the Himalayas.",
      "I hear the views from the mountains are breathtaking."
    ],
    "nextContext": [
      "Maybe we can go biking out into the countryside tomorrow.",
      "I don’t know if I want to go biking again for a while.",
      "My last expedition through the city didn’t turn out so well."
    ]
  },
  {
    "id": 236,
    "text": "Maybe we can go biking out into the countryside tomorrow.",
    "chunks": [
      "Maybe we can",
      "go biking out",
      "into the countryside tomorrow."
    ],
    "translation": "내일 근교 시골로 자전거 타러 갈까?",
    "prevContext": [
      "I always dreamed of going on a hiking expedition through the Himalayas.",
      "I hear the views from the mountains are breathtaking.",
      "However, we haven’t received a check yet."
    ],
    "nextContext": [
      "I don’t know if I want to go biking again for a while.",
      "My last expedition through the city didn’t turn out so well.",
      "Let’s build a manufacturing plant by a beach."
    ]
  },
  {
    "id": 237,
    "text": "I don’t know if I want to go biking again for a while.",
    "chunks": [
      "I don’t know if",
      "I want to go",
      "biking again for a while."
    ],
    "translation": "당분간은 자전거 타고 싶지 않은데.",
    "prevContext": [
      "I hear the views from the mountains are breathtaking.",
      "However, we haven’t received a check yet.",
      "Maybe we can go biking out into the countryside tomorrow."
    ],
    "nextContext": [
      "My last expedition through the city didn’t turn out so well.",
      "Let’s build a manufacturing plant by a beach.",
      "This time tomorrow, we’ll be working with an investor."
    ]
  },
  {
    "id": 238,
    "text": "My last expedition through the city didn’t turn out so well.",
    "chunks": [
      "My last expedition",
      "through the city",
      "didn’t turn out so well."
    ],
    "translation": "지난번 도심 라이딩 원정이 영 엉망이었거든.",
    "prevContext": [
      "However, we haven’t received a check yet.",
      "Maybe we can go biking out into the countryside tomorrow.",
      "I don’t know if I want to go biking again for a while."
    ],
    "nextContext": [
      "Let’s build a manufacturing plant by a beach.",
      "This time tomorrow, we’ll be working with an investor.",
      "This is what we always want to see Marco."
    ]
  },
  {
    "id": 239,
    "text": "Let’s build a manufacturing plant by a beach.",
    "chunks": [
      "Let’s build",
      "a manufacturing",
      "plant by a beach."
    ],
    "translation": "해변가에 공장을 짓자.",
    "prevContext": [
      "Maybe we can go biking out into the countryside tomorrow.",
      "I don’t know if I want to go biking again for a while.",
      "My last expedition through the city didn’t turn out so well."
    ],
    "nextContext": [
      "This time tomorrow, we’ll be working with an investor.",
      "This is what we always want to see Marco.",
      "I’ll be dropping my bike off at the shop at 5pm tomorrow."
    ]
  },
  {
    "id": 240,
    "text": "This time tomorrow, we’ll be working with an investor.",
    "chunks": [
      "This time tomorrow,",
      "we’ll be working with an investor."
    ],
    "translation": "내일 이맘때면 투자자와 계약 완료했을 거야.",
    "prevContext": [
      "I don’t know if I want to go biking again for a while.",
      "My last expedition through the city didn’t turn out so well.",
      "Let’s build a manufacturing plant by a beach."
    ],
    "nextContext": [
      "This is what we always want to see Marco.",
      "I’ll be dropping my bike off at the shop at 5pm tomorrow.",
      "After that, we should celebrate."
    ]
  },
  {
    "id": 241,
    "text": "This is what we always want to see Marco.",
    "chunks": [
      "This is",
      "what we always want",
      "to see Marco."
    ],
    "translation": "우리가 늘 바랐던 순간이잖아 마르코.",
    "prevContext": [
      "My last expedition through the city didn’t turn out so well.",
      "Let’s build a manufacturing plant by a beach.",
      "This time tomorrow, we’ll be working with an investor."
    ],
    "nextContext": [
      "I’ll be dropping my bike off at the shop at 5pm tomorrow.",
      "After that, we should celebrate.",
      "We have a lot of work to do."
    ]
  },
  {
    "id": 242,
    "text": "I’ll be dropping my bike off at the shop at 5pm tomorrow.",
    "chunks": [
      "I’ll be dropping my",
      "bike off at the",
      "shop at 5pm tomorrow."
    ],
    "translation": "내일 오후 5시에 자전거를 수리점에 맡길 거야.",
    "prevContext": [
      "Let’s build a manufacturing plant by a beach.",
      "This time tomorrow, we’ll be working with an investor.",
      "This is what we always want to see Marco."
    ],
    "nextContext": [
      "After that, we should celebrate.",
      "We have a lot of work to do.",
      "What’s the point of starting a business if we can’t have a little fun?"
    ]
  },
  {
    "id": 243,
    "text": "After that, we should celebrate.",
    "chunks": [
      "After that,",
      "we should celebrate."
    ],
    "translation": "그다음 축하 파티를 하자.",
    "prevContext": [
      "This time tomorrow, we’ll be working with an investor.",
      "This is what we always want to see Marco.",
      "I’ll be dropping my bike off at the shop at 5pm tomorrow."
    ],
    "nextContext": [
      "We have a lot of work to do.",
      "What’s the point of starting a business if we can’t have a little fun?",
      "I’ll be getting up very early on Saturday to review the job applications we received."
    ]
  },
  {
    "id": 244,
    "text": "We have a lot of work to do.",
    "chunks": [
      "We have",
      "a lot",
      "of work to do."
    ],
    "translation": "우리는 할 일이 산더미야.",
    "prevContext": [
      "This is what we always want to see Marco.",
      "I’ll be dropping my bike off at the shop at 5pm tomorrow.",
      "After that, we should celebrate."
    ],
    "nextContext": [
      "What’s the point of starting a business if we can’t have a little fun?",
      "I’ll be getting up very early on Saturday to review the job applications we received.",
      "I can’t celebrate with you Khae."
    ]
  },
  {
    "id": 245,
    "text": "What’s the point of starting a business if we can’t have a little fun?",
    "chunks": [
      "What’s the point of",
      "starting a business if we",
      "can’t have a little fun?"
    ],
    "translation": "즐기지도 못할 거면 창업은 왜 하니?",
    "prevContext": [
      "I’ll be dropping my bike off at the shop at 5pm tomorrow.",
      "After that, we should celebrate.",
      "We have a lot of work to do."
    ],
    "nextContext": [
      "I’ll be getting up very early on Saturday to review the job applications we received.",
      "I can’t celebrate with you Khae.",
      "This time tomorrow, I’ll be celebrating by myself."
    ]
  },
  {
    "id": 246,
    "text": "I’ll be getting up very early on Saturday to review the job applications we received.",
    "chunks": [
      "I’ll be getting up very",
      "early on Saturday to review",
      "the job applications we received."
    ],
    "translation": "난 토요일 아침 일찍 입사지원서들 검토해야 해.",
    "prevContext": [
      "After that, we should celebrate.",
      "We have a lot of work to do.",
      "What’s the point of starting a business if we can’t have a little fun?"
    ],
    "nextContext": [
      "I can’t celebrate with you Khae.",
      "This time tomorrow, I’ll be celebrating by myself.",
      "Do you want to review the selection criteria for these investors?"
    ]
  },
  {
    "id": 247,
    "text": "I can’t celebrate with you Khae.",
    "chunks": [
      "I can’t celebrate",
      "with you Khae."
    ],
    "translation": "파티는 같이 못 하겠어 카이.",
    "prevContext": [
      "We have a lot of work to do.",
      "What’s the point of starting a business if we can’t have a little fun?",
      "I’ll be getting up very early on Saturday to review the job applications we received."
    ],
    "nextContext": [
      "This time tomorrow, I’ll be celebrating by myself.",
      "Do you want to review the selection criteria for these investors?",
      "I thought you’d never ask."
    ]
  },
  {
    "id": 248,
    "text": "This time tomorrow, I’ll be celebrating by myself.",
    "chunks": [
      "This time tomorrow,",
      "I’ll be celebrating by myself."
    ],
    "translation": "내일 이맘때 나 혼자 축배를 들고 있겠네.",
    "prevContext": [
      "What’s the point of starting a business if we can’t have a little fun?",
      "I’ll be getting up very early on Saturday to review the job applications we received.",
      "I can’t celebrate with you Khae."
    ],
    "nextContext": [
      "Do you want to review the selection criteria for these investors?",
      "I thought you’d never ask.",
      "Where are we going to go on our big trip this year?"
    ]
  },
  {
    "id": 249,
    "text": "Do you want to review the selection criteria for these investors?",
    "chunks": [
      "Do you want",
      "to review the selection criteria",
      "for these investors?"
    ],
    "translation": "투자자 심사 기준 다시 점검해 볼래?",
    "prevContext": [
      "I’ll be getting up very early on Saturday to review the job applications we received.",
      "I can’t celebrate with you Khae.",
      "This time tomorrow, I’ll be celebrating by myself."
    ],
    "nextContext": [
      "I thought you’d never ask.",
      "Where are we going to go on our big trip this year?",
      "Kate, wouldn’t it be relaxing to go on a cruise?"
    ]
  },
  {
    "id": 250,
    "text": "I thought you’d never ask.",
    "chunks": [
      "I thought",
      "you’d never ask."
    ],
    "translation": "그 말 안 나오나 기다리고 있었어.",
    "prevContext": [
      "I can’t celebrate with you Khae.",
      "This time tomorrow, I’ll be celebrating by myself.",
      "Do you want to review the selection criteria for these investors?"
    ],
    "nextContext": [
      "Where are we going to go on our big trip this year?",
      "Kate, wouldn’t it be relaxing to go on a cruise?",
      "It sounds kind of boring."
    ]
  },
  {
    "id": 251,
    "text": "Where are we going to go on our big trip this year?",
    "chunks": [
      "Where are we going",
      "to go on our big trip this year?"
    ],
    "translation": "올해 우리 대망의 휴가는 어디로 갈까?",
    "prevContext": [
      "This time tomorrow, I’ll be celebrating by myself.",
      "Do you want to review the selection criteria for these investors?",
      "I thought you’d never ask."
    ],
    "nextContext": [
      "Kate, wouldn’t it be relaxing to go on a cruise?",
      "It sounds kind of boring.",
      "I don’t think I want to spend a lot of time on a ship."
    ]
  },
  {
    "id": 252,
    "text": "Kate, wouldn’t it be relaxing to go on a cruise?",
    "chunks": [
      "Kate, wouldn’t it be relaxing",
      "to go on a cruise?"
    ],
    "translation": "케이트, 편안하게 크루즈 여행 가는 건 어때?",
    "prevContext": [
      "Do you want to review the selection criteria for these investors?",
      "I thought you’d never ask.",
      "Where are we going to go on our big trip this year?"
    ],
    "nextContext": [
      "It sounds kind of boring.",
      "I don’t think I want to spend a lot of time on a ship.",
      "Well, we could go on a cruise that stops at some islands."
    ]
  },
  {
    "id": 253,
    "text": "It sounds kind of boring.",
    "chunks": [
      "It sounds",
      "kind of boring."
    ],
    "translation": "좀 지루할 것 같아.",
    "prevContext": [
      "I thought you’d never ask.",
      "Where are we going to go on our big trip this year?",
      "Kate, wouldn’t it be relaxing to go on a cruise?"
    ],
    "nextContext": [
      "I don’t think I want to spend a lot of time on a ship.",
      "Well, we could go on a cruise that stops at some islands.",
      "I’d like to go to the beach and relax by the ocean."
    ]
  },
  {
    "id": 254,
    "text": "I don’t think I want to spend a lot of time on a ship.",
    "chunks": [
      "I don’t think I",
      "want to spend a lot",
      "of time on a ship."
    ],
    "translation": "배 위에서 오랜 시간을 보내고 싶진 않아.",
    "prevContext": [
      "Where are we going to go on our big trip this year?",
      "Kate, wouldn’t it be relaxing to go on a cruise?",
      "It sounds kind of boring."
    ],
    "nextContext": [
      "Well, we could go on a cruise that stops at some islands.",
      "I’d like to go to the beach and relax by the ocean.",
      "You know, I think I’d rather do something more adventurous."
    ]
  },
  {
    "id": 255,
    "text": "Well, we could go on a cruise that stops at some islands.",
    "chunks": [
      "Well, we could go on a cruise",
      "that stops at some islands."
    ],
    "translation": "섬들을 들르는 크루즈로 가면 되잖아.",
    "prevContext": [
      "Kate, wouldn’t it be relaxing to go on a cruise?",
      "It sounds kind of boring.",
      "I don’t think I want to spend a lot of time on a ship."
    ],
    "nextContext": [
      "I’d like to go to the beach and relax by the ocean.",
      "You know, I think I’d rather do something more adventurous.",
      "Don’t you think Machu Picchu would be amazing?"
    ]
  },
  {
    "id": 256,
    "text": "I’d like to go to the beach and relax by the ocean.",
    "chunks": [
      "I’d like",
      "to go",
      "to the beach and relax by the ocean."
    ],
    "translation": "해변으로 가서 바다를 보며 쉬고 싶어.",
    "prevContext": [
      "It sounds kind of boring.",
      "I don’t think I want to spend a lot of time on a ship.",
      "Well, we could go on a cruise that stops at some islands."
    ],
    "nextContext": [
      "You know, I think I’d rather do something more adventurous.",
      "Don’t you think Machu Picchu would be amazing?",
      "Yeah, that would be amazing to see."
    ]
  },
  {
    "id": 257,
    "text": "You know, I think I’d rather do something more adventurous.",
    "chunks": [
      "You know,",
      "I think I’d rather do something more adventurous."
    ],
    "translation": "난 좀 더 모험적인 걸 하고 싶어.",
    "prevContext": [
      "I don’t think I want to spend a lot of time on a ship.",
      "Well, we could go on a cruise that stops at some islands.",
      "I’d like to go to the beach and relax by the ocean."
    ],
    "nextContext": [
      "Don’t you think Machu Picchu would be amazing?",
      "Yeah, that would be amazing to see.",
      "It looks stunning in all of the pictures I’ve seen."
    ]
  },
  {
    "id": 258,
    "text": "Don’t you think Machu Picchu would be amazing?",
    "chunks": [
      "Don’t you",
      "think Machu",
      "Picchu would be amazing?"
    ],
    "translation": "마추픽추 가면 정말 멋지지 않을까?",
    "prevContext": [
      "Well, we could go on a cruise that stops at some islands.",
      "I’d like to go to the beach and relax by the ocean.",
      "You know, I think I’d rather do something more adventurous."
    ],
    "nextContext": [
      "Yeah, that would be amazing to see.",
      "It looks stunning in all of the pictures I’ve seen.",
      "I know, and there are some great hiking expeditions that leave from Cusco."
    ]
  },
  {
    "id": 259,
    "text": "Yeah, that would be amazing to see.",
    "chunks": [
      "Yeah, that would be amazing",
      "to see."
    ],
    "translation": "응, 실제로 보면 정말 멋지겠다.",
    "prevContext": [
      "I’d like to go to the beach and relax by the ocean.",
      "You know, I think I’d rather do something more adventurous.",
      "Don’t you think Machu Picchu would be amazing?"
    ],
    "nextContext": [
      "It looks stunning in all of the pictures I’ve seen.",
      "I know, and there are some great hiking expeditions that leave from Cusco.",
      "Don’t you agree that it would be exciting to hike on the Inca Trail?"
    ]
  },
  {
    "id": 260,
    "text": "It looks stunning in all of the pictures I’ve seen.",
    "chunks": [
      "It looks stunning",
      "in all of the pictures I’ve seen."
    ],
    "translation": "사진으로 봤을 때도 엄청 멋지긴 하더라.",
    "prevContext": [
      "You know, I think I’d rather do something more adventurous.",
      "Don’t you think Machu Picchu would be amazing?",
      "Yeah, that would be amazing to see."
    ],
    "nextContext": [
      "I know, and there are some great hiking expeditions that leave from Cusco.",
      "Don’t you agree that it would be exciting to hike on the Inca Trail?",
      "How long does it take?"
    ]
  },
  {
    "id": 261,
    "text": "I know, and there are some great hiking expeditions that leave from Cusco.",
    "chunks": [
      "I know,",
      "and there are some great hiking expeditions that leave from Cusco."
    ],
    "translation": "쿠스코에서 출발하는 멋진 하이킹 코스들이 있거든.",
    "prevContext": [
      "Don’t you think Machu Picchu would be amazing?",
      "Yeah, that would be amazing to see.",
      "It looks stunning in all of the pictures I’ve seen."
    ],
    "nextContext": [
      "Don’t you agree that it would be exciting to hike on the Inca Trail?",
      "How long does it take?",
      "It’s about a four-day trek."
    ]
  },
  {
    "id": 262,
    "text": "Don’t you agree that it would be exciting to hike on the Inca Trail?",
    "chunks": [
      "Don’t you agree that",
      "it would be exciting to",
      "hike on the Inca Trail?"
    ],
    "translation": "잉카 트레일 트레킹하는 게 얼마나 흥미진진한데!",
    "prevContext": [
      "Yeah, that would be amazing to see.",
      "It looks stunning in all of the pictures I’ve seen.",
      "I know, and there are some great hiking expeditions that leave from Cusco."
    ],
    "nextContext": [
      "How long does it take?",
      "It’s about a four-day trek.",
      "You go with a guide, hike during the day, and stay in tents at night."
    ]
  },
  {
    "id": 263,
    "text": "How long does it take?",
    "chunks": [
      "How long",
      "does it take?"
    ],
    "translation": "시간이 얼마나 걸리는데?",
    "prevContext": [
      "It looks stunning in all of the pictures I’ve seen.",
      "I know, and there are some great hiking expeditions that leave from Cusco.",
      "Don’t you agree that it would be exciting to hike on the Inca Trail?"
    ],
    "nextContext": [
      "It’s about a four-day trek.",
      "You go with a guide, hike during the day, and stay in tents at night.",
      "I’ve heard the view is breathtaking when you finally get to Machu Picchu."
    ]
  },
  {
    "id": 264,
    "text": "It’s about a four-day trek.",
    "chunks": [
      "It’s about",
      "a four-day trek."
    ],
    "translation": "4일 정도 트레킹하는 코스야.",
    "prevContext": [
      "I know, and there are some great hiking expeditions that leave from Cusco.",
      "Don’t you agree that it would be exciting to hike on the Inca Trail?",
      "How long does it take?"
    ],
    "nextContext": [
      "You go with a guide, hike during the day, and stay in tents at night.",
      "I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
      "Well, to be honest, that sounds like a lot of work."
    ]
  },
  {
    "id": 265,
    "text": "You go with a guide, hike during the day, and stay in tents at night.",
    "chunks": [
      "You go with a guide,",
      "hike during the day,",
      "and stay in tents at night."
    ],
    "translation": "가이드와 함께 낮에는 걷고 밤에는 텐트에서 자는 거지.",
    "prevContext": [
      "Don’t you agree that it would be exciting to hike on the Inca Trail?",
      "How long does it take?",
      "It’s about a four-day trek."
    ],
    "nextContext": [
      "I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
      "Well, to be honest, that sounds like a lot of work.",
      "I was looking forward to something a little more laid-back."
    ]
  },
  {
    "id": 266,
    "text": "I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
    "chunks": [
      "I’ve heard the view",
      "is breathtaking when you",
      "finally get to Machu Picchu."
    ],
    "translation": "마추픽추에 마침내 도착했을 때의 경치는 숨이 멎을 정도래.",
    "prevContext": [
      "How long does it take?",
      "It’s about a four-day trek.",
      "You go with a guide, hike during the day, and stay in tents at night."
    ],
    "nextContext": [
      "Well, to be honest, that sounds like a lot of work.",
      "I was looking forward to something a little more laid-back.",
      "We can relax at home."
    ]
  },
  {
    "id": 267,
    "text": "Well, to be honest, that sounds like a lot of work.",
    "chunks": [
      "Well, to be honest,",
      "that sounds like a lot of work."
    ],
    "translation": "솔직히 너무 힘들고 고될 것 같아.",
    "prevContext": [
      "It’s about a four-day trek.",
      "You go with a guide, hike during the day, and stay in tents at night.",
      "I’ve heard the view is breathtaking when you finally get to Machu Picchu."
    ],
    "nextContext": [
      "I was looking forward to something a little more laid-back.",
      "We can relax at home.",
      "I feel like we need a real adventure, don’t you?"
    ]
  },
  {
    "id": 268,
    "text": "I was looking forward to something a little more laid-back.",
    "chunks": [
      "I was looking forward",
      "to something a little more laid-back."
    ],
    "translation": "난 좀 더 여유롭고 느긋한 휴가를 기대했거든.",
    "prevContext": [
      "You go with a guide, hike during the day, and stay in tents at night.",
      "I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
      "Well, to be honest, that sounds like a lot of work."
    ],
    "nextContext": [
      "We can relax at home.",
      "I feel like we need a real adventure, don’t you?",
      "Don’t you think that’s a good idea?"
    ]
  },
  {
    "id": 269,
    "text": "We can relax at home.",
    "chunks": [
      "We can relax",
      "at home."
    ],
    "translation": "휴식은 집에서도 얼마든지 되잖아.",
    "prevContext": [
      "I’ve heard the view is breathtaking when you finally get to Machu Picchu.",
      "Well, to be honest, that sounds like a lot of work.",
      "I was looking forward to something a little more laid-back."
    ],
    "nextContext": [
      "I feel like we need a real adventure, don’t you?",
      "Don’t you think that’s a good idea?",
      "Sure, I’m willing to compromise."
    ]
  },
  {
    "id": 270,
    "text": "I feel like we need a real adventure, don’t you?",
    "chunks": [
      "I feel like we need a real adventure,",
      "don’t you?"
    ],
    "translation": "우리에게 진짜 모험이 필요한 것 같아, 안 그래?",
    "prevContext": [
      "Well, to be honest, that sounds like a lot of work.",
      "I was looking forward to something a little more laid-back.",
      "We can relax at home."
    ],
    "nextContext": [
      "Don’t you think that’s a good idea?",
      "Sure, I’m willing to compromise.",
      "What did you have in mind?"
    ]
  },
  {
    "id": 271,
    "text": "Don’t you think that’s a good idea?",
    "chunks": [
      "Don’t you think",
      "that’s a good idea?"
    ],
    "translation": "그게 좋은 방법이지 않을까?",
    "prevContext": [
      "I was looking forward to something a little more laid-back.",
      "We can relax at home.",
      "I feel like we need a real adventure, don’t you?"
    ],
    "nextContext": [
      "Sure, I’m willing to compromise.",
      "What did you have in mind?",
      "Sure, we can do that."
    ]
  },
  {
    "id": 272,
    "text": "Sure, I’m willing to compromise.",
    "chunks": [
      "Sure, I’m willing",
      "to compromise."
    ],
    "translation": "좋아, 기꺼이 타협하지.",
    "prevContext": [
      "We can relax at home.",
      "I feel like we need a real adventure, don’t you?",
      "Don’t you think that’s a good idea?"
    ],
    "nextContext": [
      "What did you have in mind?",
      "Sure, we can do that.",
      "If we take the train, can we do some day hikes while we’re at Machu Picchu?"
    ]
  },
  {
    "id": 273,
    "text": "What did you have in mind?",
    "chunks": [
      "What did you have",
      "in mind?"
    ],
    "translation": "생각해 둔 게 있어?",
    "prevContext": [
      "I feel like we need a real adventure, don’t you?",
      "Don’t you think that’s a good idea?",
      "Sure, I’m willing to compromise."
    ],
    "nextContext": [
      "Sure, we can do that.",
      "If we take the train, can we do some day hikes while we’re at Machu Picchu?",
      "That sounds good to me."
    ]
  },
  {
    "id": 274,
    "text": "Sure, we can do that.",
    "chunks": [
      "Sure, we",
      "can do that."
    ],
    "translation": "좋아, 그렇게 하자.",
    "prevContext": [
      "Don’t you think that’s a good idea?",
      "Sure, I’m willing to compromise.",
      "What did you have in mind?"
    ],
    "nextContext": [
      "If we take the train, can we do some day hikes while we’re at Machu Picchu?",
      "That sounds good to me.",
      "And if we take the train, we’ll have more time in Cusco."
    ]
  },
  {
    "id": 275,
    "text": "If we take the train, can we do some day hikes while we’re at Machu Picchu?",
    "chunks": [
      "If we take the train,",
      "can we do some day hikes while we’re at Machu Picchu?"
    ],
    "translation": "기차 타는 대신 마추픽추 주변에서 가벼운 당일 하이킹은 해도 되지?",
    "prevContext": [
      "Sure, I’m willing to compromise.",
      "What did you have in mind?",
      "Sure, we can do that."
    ],
    "nextContext": [
      "That sounds good to me.",
      "And if we take the train, we’ll have more time in Cusco.",
      "That would be nice, wouldn’t it?"
    ]
  },
  {
    "id": 276,
    "text": "That sounds good to me.",
    "chunks": [
      "That sounds good",
      "to me."
    ],
    "translation": "그건 아주 좋아.",
    "prevContext": [
      "What did you have in mind?",
      "Sure, we can do that.",
      "If we take the train, can we do some day hikes while we’re at Machu Picchu?"
    ],
    "nextContext": [
      "And if we take the train, we’ll have more time in Cusco.",
      "That would be nice, wouldn’t it?",
      "There are some amazing markets in Cusco."
    ]
  },
  {
    "id": 277,
    "text": "And if we take the train, we’ll have more time in Cusco.",
    "chunks": [
      "And if we take the train,",
      "we’ll have more time in Cusco."
    ],
    "translation": "기차를 타면 쿠스코에 머물 시간도 더 생길 테고.",
    "prevContext": [
      "Sure, we can do that.",
      "If we take the train, can we do some day hikes while we’re at Machu Picchu?",
      "That sounds good to me."
    ],
    "nextContext": [
      "That would be nice, wouldn’t it?",
      "There are some amazing markets in Cusco.",
      "If I agree not to hike, will you go shopping with me in Cusco?"
    ]
  },
  {
    "id": 278,
    "text": "That would be nice, wouldn’t it?",
    "chunks": [
      "That would be nice,",
      "wouldn’t it?"
    ],
    "translation": "그거 참 좋겠다, 그렇지?",
    "prevContext": [
      "If we take the train, can we do some day hikes while we’re at Machu Picchu?",
      "That sounds good to me.",
      "And if we take the train, we’ll have more time in Cusco."
    ],
    "nextContext": [
      "There are some amazing markets in Cusco.",
      "If I agree not to hike, will you go shopping with me in Cusco?",
      "I mean, we’re so busy with work all the time."
    ]
  },
  {
    "id": 279,
    "text": "There are some amazing markets in Cusco.",
    "chunks": [
      "There are some amazing markets",
      "in Cusco."
    ],
    "translation": "쿠스코에 정말 멋진 전통 시장들이 많거든.",
    "prevContext": [
      "That sounds good to me.",
      "And if we take the train, we’ll have more time in Cusco.",
      "That would be nice, wouldn’t it?"
    ],
    "nextContext": [
      "If I agree not to hike, will you go shopping with me in Cusco?",
      "I mean, we’re so busy with work all the time.",
      "Wouldn’t it be nice to do something relaxing?"
    ]
  },
  {
    "id": 280,
    "text": "If I agree not to hike, will you go shopping with me in Cusco?",
    "chunks": [
      "If I agree not to hike,",
      "will you go shopping with me in Cusco?"
    ],
    "translation": "내가 등산 안 하는 대신 쿠스코에서 나랑 쇼핑 같이 해줄래?",
    "prevContext": [
      "And if we take the train, we’ll have more time in Cusco.",
      "That would be nice, wouldn’t it?",
      "There are some amazing markets in Cusco."
    ],
    "nextContext": [
      "I mean, we’re so busy with work all the time.",
      "Wouldn’t it be nice to do something relaxing?",
      "That sounds like a perfect plan."
    ]
  },
  {
    "id": 281,
    "text": "I mean, we’re so busy with work all the time.",
    "chunks": [
      "I mean,",
      "we’re so busy with work all the time."
    ],
    "translation": "늘 일하느라 너무 바쁘잖아.",
    "prevContext": [
      "That would be nice, wouldn’t it?",
      "There are some amazing markets in Cusco.",
      "If I agree not to hike, will you go shopping with me in Cusco?"
    ],
    "nextContext": [
      "Wouldn’t it be nice to do something relaxing?",
      "That sounds like a perfect plan.",
      "There are some beautiful beaches on the coast of Peru."
    ]
  },
  {
    "id": 282,
    "text": "Wouldn’t it be nice to do something relaxing?",
    "chunks": [
      "Wouldn’t it be nice",
      "to do something relaxing?"
    ],
    "translation": "여유로운 힐링을 즐기는 것도 좋지 않겠어?",
    "prevContext": [
      "There are some amazing markets in Cusco.",
      "If I agree not to hike, will you go shopping with me in Cusco?",
      "I mean, we’re so busy with work all the time."
    ],
    "nextContext": [
      "That sounds like a perfect plan.",
      "There are some beautiful beaches on the coast of Peru.",
      "We could try surfing, rent a boat, or go fishing."
    ]
  },
  {
    "id": 283,
    "text": "That sounds like a perfect plan.",
    "chunks": [
      "That sounds like",
      "a perfect plan."
    ],
    "translation": "완벽한 계획이다!",
    "prevContext": [
      "If I agree not to hike, will you go shopping with me in Cusco?",
      "I mean, we’re so busy with work all the time.",
      "Wouldn’t it be nice to do something relaxing?"
    ],
    "nextContext": [
      "There are some beautiful beaches on the coast of Peru.",
      "We could try surfing, rent a boat, or go fishing.",
      "You can do that for a day or two, can’t you?"
    ]
  },
  {
    "id": 284,
    "text": "There are some beautiful beaches on the coast of Peru.",
    "chunks": [
      "There are some",
      "beautiful beaches on",
      "the coast of Peru."
    ],
    "translation": "페루 해안에 정말 아름다운 해변들이 많아.",
    "prevContext": [
      "I mean, we’re so busy with work all the time.",
      "Wouldn’t it be nice to do something relaxing?",
      "That sounds like a perfect plan."
    ],
    "nextContext": [
      "We could try surfing, rent a boat, or go fishing.",
      "You can do that for a day or two, can’t you?",
      "If you can go shopping, I can relax for a few days."
    ]
  },
  {
    "id": 285,
    "text": "We could try surfing, rent a boat, or go fishing.",
    "chunks": [
      "We could try surfing,",
      "rent a boat,",
      "or go fishing."
    ],
    "translation": "서핑도 해보고 보트도 빌리고 낚시도 할 수 있겠네.",
    "prevContext": [
      "Wouldn’t it be nice to do something relaxing?",
      "That sounds like a perfect plan.",
      "There are some beautiful beaches on the coast of Peru."
    ],
    "nextContext": [
      "You can do that for a day or two, can’t you?",
      "If you can go shopping, I can relax for a few days."
    ]
  },
  {
    "id": 286,
    "text": "You can do that for a day or two, can’t you?",
    "chunks": [
      "You can do that for a day or two,",
      "can’t you?"
    ],
    "translation": "하루이틀 정도는 그렇게 해줄 수 있지?",
    "prevContext": [
      "That sounds like a perfect plan.",
      "There are some beautiful beaches on the coast of Peru.",
      "We could try surfing, rent a boat, or go fishing."
    ],
    "nextContext": [
      "If you can go shopping, I can relax for a few days."
    ]
  },
  {
    "id": 287,
    "text": "If you can go shopping, I can relax for a few days.",
    "chunks": [
      "If you can go shopping,",
      "I can relax for a few days."
    ],
    "translation": "네가 쇼핑해 주면 나도 며칠 느긋하게 쉴 수 있으니까.",
    "prevContext": [
      "There are some beautiful beaches on the coast of Peru.",
      "We could try surfing, rent a boat, or go fishing.",
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


// Web Audio API 효과음 (통과 딩동댕동 / 오답 알림음)
const playSoundEffect = (type) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'success') {
      // 통과 시: 경쾌하고 밝은 상승 4화음 챠임 (C5 - E5 - G5 - C6)
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
      // 불일치 시: 부드러운 2음 알림 (G4 -> D#4)
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

const generateLocalFeedback = (target, spoken) => {
  let normTarget = cleanText(target);
  let normSpoken = cleanText(spoken);
  
  const targetWordsRaw = normTarget.split(' ').filter(Boolean);
  const spokenWordsRaw = normSpoken.split(' ').filter(Boolean);
  
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

  // 발음 허용 범위: 핵심 단어 65% 이상 또는 오류 1단어 이내 통과
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
  const [isJumping, setIsJumping] = useState(false);
  const [jumpInput, setJumpInput] = useState("");
  const [speechSpeed, setSpeechSpeed] = useState(0.85);
  const [playingChunkIdx, setPlayingChunkIdx] = useState(null);

  const speechSpeedRef = useRef(0.85);
  useEffect(() => {
    speechSpeedRef.current = speechSpeed;
  }, [speechSpeed]);

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

  const speakText = (text, rateOverride = null) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setPlayingChunkIdx(null);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rateOverride !== null ? rateOverride : speechSpeedRef.current;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const playChunkAudio = (chunkText, idx) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.lang = 'en-US';
    utterance.rate = speechSpeedRef.current;

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
    speakText(displayItem.text);
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
    utterance.rate = speechSpeedRef.current;

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
      playSoundEffect(localResult.isPerfect ? 'success' : 'retry');
    } catch (err) {
      setEvaluation("발음을 인식했습니다. 다시 한번 또렷하게 시도해 보세요!");
      playSoundEffect('retry');
    } finally {
      setIsEvaluating(false);
    }
  };

  // 특정 문장 번호로 바로 이동 (자동으로 원어민 발음 재생)
  const jumpToSentence = (targetIdx) => {
    setUserSpeech("");
    setRecordedAudioUrl(null);
    setEvaluation(null);
    setIsPerfect(false);
    setMarkedSpoken("");
    setErrorMsg("");

    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      userAudioPlayerRef.current.currentTime = 0;
    }

    const safeIdx = Math.max(0, Math.min(UNIT61_DATABASE.length - 1, targetIdx));
    setCurrentIndex(safeIdx);
    speakText(UNIT61_DATABASE[safeIdx].text);
  };

  const handleNextSentence = () => {
    jumpToSentence((currentIndex + 1) % UNIT61_DATABASE.length);
  };

  const handlePrevSentence = () => {
    jumpToSentence((currentIndex - 1 + UNIT61_DATABASE.length) % UNIT61_DATABASE.length);
  };

  const handleJumpSubmit = (e) => {
    if (e) e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= UNIT61_DATABASE.length) {
      jumpToSentence(num - 1);
      setIsJumping(false);
    } else {
      setErrorMsg(`1번부터 ${UNIT61_DATABASE.length}번 사이의 번호를 입력해 주세요.`);
    }
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
              <button
                type="button"
                onClick={() => {
                  setJumpInput(String(currentIndex + 1));
                  setIsJumping(true);
                }}
                title="클릭하여 원하는 문장으로 이동 (1~287)"
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 hover:border-indigo-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <span>#{currentIndex + 1} / {UNIT61_DATABASE.length}</span>
                <span className="text-[9px] text-indigo-400 font-bold">이동</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {/* 속도 토글 */}
              <button
                onClick={() => setSpeechSpeed(s => s === 0.7 ? 0.85 : s === 0.85 ? 1.0 : 0.7)}
                className="px-2 py-1 rounded text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
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
                title={showHintText ? "문장 표시 상태 (이동 시에도 유지)" : "문장 가림 상태 (이동 시에도 유지)"}
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

            {/* 청크 블록 (의미 단위 호흡 청크 / 터치 시 해당 청크 개별 발음) */}
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
                    className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer active:scale-95 group ${
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
              💡 청크 버튼을 누르면 해당 호흡 단위만 따로 원어민 발음을 들을 수 있습니다.
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

          {/* 메인 컨트롤 4버튼 [이전 문장] [다시 듣기] [다음 문장] [따라 말하기] */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {/* 이전 문장 (이동 + 자동 오디오 재생) */}
            <button
              type="button"
              onClick={handlePrevSentence}
              className="py-2.5 px-1.5 rounded-xl font-bold text-[11px] sm:text-xs bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>이전</span>
            </button>

            {/* 원어민 다시 듣기 */}
            <button
              onClick={playTargetAudio}
              disabled={isPlayingAudio}
              className={`py-2.5 px-1.5 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-all active:scale-95 ${
                isPlayingAudio
                  ? 'bg-indigo-900/80 border border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/20'
                  : 'bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce text-indigo-400' : 'text-indigo-400'}`} />
              <span>{isPlayingAudio ? "재생 중" : "다시 듣기"}</span>
            </button>

            {/* 다음 문장 (이동 + 자동 오디오 재생) */}
            <button
              type="button"
              onClick={handleNextSentence}
              className="py-2.5 px-1.5 rounded-xl font-bold text-[11px] sm:text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <span>다음</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* 따라 말하기 */}
            <button
              onClick={toggleRecording}
              className={`py-2.5 px-1.5 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-all active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
              }`}
            >
              {isRecording ? <Square className="w-3 h-3 fill-current" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isRecording ? "완료" : "말하기"}</span>
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


        {/* 문장 이동 팝업 모달 */}
        {isJumping && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setIsJumping(false)}
          >
            <div 
              className="bg-slate-900 border border-slate-700 p-5 rounded-2xl max-w-xs w-full shadow-2xl flex flex-col gap-3.5"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">문장 바로 이동</h3>
                </div>
                <button 
                  onClick={() => setIsJumping(false)} 
                  className="text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-xs text-slate-400">
                이동할 번호 (1 ~ {UNIT61_DATABASE.length})를 입력하세요.
              </p>
              
              <form onSubmit={handleJumpSubmit} className="flex gap-2">
                <input 
                  type="number" 
                  min="1" 
                  max={UNIT61_DATABASE.length}
                  value={jumpInput} 
                  onChange={(e) => setJumpInput(e.target.value)} 
                  placeholder={`1 ~ ${UNIT61_DATABASE.length}`}
                  autoFocus 
                  className="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white text-center focus:outline-none focus:border-indigo-500 font-bold" 
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all"
                >
                  이동
                </button>
              </form>

              {/* 빠른 구간 점프 버튼들 */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 font-semibold">빠른 이동:</span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {[1, 30, 60, 100, 150, 200, 250, 287].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        jumpToSentence(num - 1);
                        setIsJumping(false);
                      }}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-all active:scale-95 ${
                        currentIndex + 1 === num
                          ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                          : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                      }`}
                    >
                      #{num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
