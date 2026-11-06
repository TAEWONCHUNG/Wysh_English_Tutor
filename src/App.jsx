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
        "translation": "아니요. 당신은 스트레칭을 했어야 했어요."
      },
      {
        "text": "They don’t really want to learn.",
        "chunks": [
          "They don’t really",
          "want to learn."
        ],
        "translation": "그들은 진정으로 배우기를 원하지 않아요."
      },
      {
        "text": "Tests help you learn.",
        "chunks": [
          "Tests help",
          "you learn."
        ],
        "translation": "시험은 당신이 배우는 데 도움을 줍니다."
      },
      {
        "text": "You see that all the time?",
        "chunks": [
          "You see that",
          "all the time?"
        ],
        "translation": "당신은 항상 그런 걸 보나요?"
      },
      {
        "text": "Yes, so are we.",
        "chunks": [
          "Yes, so",
          "are we."
        ],
        "translation": "네, 우리도 그래요."
      },
      {
        "text": "Get out of here.",
        "chunks": [
          "Get out",
          "of here."
        ],
        "translation": "여기서 나가세요."
      },
      {
        "text": "That’s too advanced for you.",
        "chunks": [
          "That’s too",
          "advanced for you."
        ],
        "translation": "그건 당신에게 너무 어렵습니다."
      },
      {
        "text": "How high can you jump?",
        "chunks": [
          "How high",
          "can you jump?"
        ],
        "translation": "얼마나 높이 뛸 수 있나요?"
      },
      {
        "text": "How should I do this?",
        "chunks": [
          "How should",
          "I do this?"
        ],
        "translation": "제가 이걸 어떻게 해야 하죠?"
      },
      {
        "text": "What? Why would you do that?",
        "chunks": [
          "What? Why would",
          "you do that?"
        ],
        "translation": "뭐라고요? 왜 그렇게 하시려는 거죠?"
      },
      {
        "text": "You could’ve told me that before.",
        "chunks": [
          "You could’ve told",
          "me that before."
        ],
        "translation": "저한테 진작에 말씀해 주실 수 있었잖아요."
      },
      {
        "text": "I need to lie down.",
        "chunks": [
          "I need",
          "to lie down."
        ],
        "translation": "저 좀 누워야겠어요."
      },
      {
        "text": "I understand. No problem.",
        "chunks": [
          "I understand.",
          "No problem."
        ],
        "translation": "이해합니다. 문제없어요."
      },
      {
        "text": "Nadi told me I have to.",
        "chunks": [
          "Nadi told me",
          "I have to."
        ],
        "translation": "나디가 저한테 해야 한다고 말했어요."
      },
      {
        "text": "Is this really my dressing room?",
        "chunks": [
          "Is this really",
          "my dressing room?"
        ],
        "translation": "여기가 진짜 제 분장실인가요?"
      },
      {
        "text": "Let me help. I insist.",
        "chunks": [
          "Let me",
          "help. I insist."
        ],
        "translation": "제가 도와드릴게요. 제발요."
      },
      {
        "text": "Fine. Just hurry. Please.",
        "chunks": [
          "Fine. Just",
          "hurry. Please."
        ],
        "translation": "알겠어요. 그냥 서둘러 주세요. 제발요."
      },
      {
        "text": "Then you know what to do.",
        "chunks": [
          "Then you know",
          "what to do."
        ],
        "translation": "그럼 무엇을 해야 할지 아실 겁니다."
      },
      {
        "text": "I don’t believe you.",
        "chunks": [
          "I don’t",
          "believe you."
        ],
        "translation": "전 당신을 믿지 않아요."
      },
      {
        "text": "Sorry. I didn’t mean to yell.",
        "chunks": [
          "Sorry. I didn’t",
          "mean to yell."
        ],
        "translation": "죄송해요. 소리치려던 건 아니었어요."
      },
      {
        "text": "What do you mean?",
        "chunks": [
          "What do",
          "you mean?"
        ],
        "translation": "그게 무슨 뜻이죠?"
      },
      {
        "text": "They just want good grades.",
        "chunks": [
          "They just",
          "want good grades."
        ],
        "translation": "그들은 그저 좋은 성적만 원해요."
      },
      {
        "text": "He loves this place.",
        "chunks": [
          "He loves",
          "this place."
        ],
        "translation": "그는 이곳을 무척 좋아합니다."
      },
      {
        "text": "What does playing hooky mean?",
        "chunks": [
          "What does",
          "playing hooky mean?"
        ],
        "translation": "수업을 빼먹는다는 게 무슨 뜻인가요?"
      },
      {
        "text": "But, I’ll take this very seriously.",
        "chunks": [
          "But, I’ll take",
          "this very seriously."
        ],
        "translation": "하지만 저는 이 일을 매우 진지하게 받아들일 겁니다."
      },
      {
        "text": "I love that idea.",
        "chunks": [
          "I love",
          "that idea."
        ],
        "translation": "그 아이디어 정말 마음에 드네요."
      },
      {
        "text": "But he was here yesterday.",
        "chunks": [
          "But he",
          "was here yesterday."
        ],
        "translation": "하지만 그는 어제 여기 있었어요."
      },
      {
        "text": "An actor should never be afraid.",
        "chunks": [
          "An actor should",
          "never be afraid."
        ],
        "translation": "배우는 결코 두려워해선 안 됩니다."
      },
      {
        "text": "I’m learning how, Renzo.",
        "chunks": [
          "I’m learning",
          "how, Renzo."
        ],
        "translation": "어떻게 하는지 배우고 있어요, 렌조."
      },
      {
        "text": "Nice to meet you.",
        "chunks": [
          "Nice to",
          "meet you."
        ],
        "translation": "만나서 반갑습니다."
      },
      {
        "text": "Learn Arabic at Home",
        "chunks": [
          "Learn Arabic",
          "at Home"
        ],
        "translation": "집에서 아랍어를 배워보세요"
      },
      {
        "text": "We’re going to be rich Marco.",
        "chunks": [
          "We’re going to",
          "be rich Marco."
        ],
        "translation": "우리는 부자가 될 거야, 마르코."
      },
      {
        "text": "You should’ve read the script.",
        "chunks": [
          "You should’ve",
          "read the script."
        ],
        "translation": "당신은 대본을 읽었어야 했어요."
      },
      {
        "text": "And now I’m a dishwasher.",
        "chunks": [
          "And now",
          "I’m a dishwasher."
        ],
        "translation": "그리고 지금 저는 접시닦이네요."
      },
      {
        "text": "That’s interesting. We’ll consider that.",
        "chunks": [
          "That’s interesting.",
          "We’ll consider that."
        ],
        "translation": "흥미롭군요. 고려해 보겠습니다."
      },
      {
        "text": "Excuse me. Are you really listening?",
        "chunks": [
          "Excuse me. Are",
          "you really listening?"
        ],
        "translation": "실례지만, 제 말 정말 듣고 계신 건가요?"
      },
      {
        "text": "Now get into position.",
        "chunks": [
          "Now get",
          "into position."
        ],
        "translation": "이제 자리로 가세요."
      },
      {
        "text": "Don’t dive out of the way.",
        "chunks": [
          "Don’t dive out",
          "of the way."
        ],
        "translation": "피하려고 몸을 던지지 마세요."
      },
      {
        "text": "Are there any other questions?",
        "chunks": [
          "Are there",
          "any other questions?"
        ],
        "translation": "다른 질문 있습니까?"
      },
      {
        "text": "I do have one concern.",
        "chunks": [
          "I do",
          "have one concern."
        ],
        "translation": "제게 한 가지 우려되는 점이 있습니다."
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
        "translation": "아니요. 당신은 스트레칭을 했어야 했어요."
      },
      {
        "text": "They don’t really want to learn.",
        "chunks": [
          "They",
          "don’t",
          "really want to learn."
        ],
        "translation": "그들은 진정으로 배우기를 원하지 않아요."
      },
      {
        "text": "Tests help you learn.",
        "chunks": [
          "Tests",
          "help",
          "you learn."
        ],
        "translation": "시험은 당신이 배우는 데 도움을 줍니다."
      },
      {
        "text": "You see that all the time?",
        "chunks": [
          "You",
          "see",
          "that all the time?"
        ],
        "translation": "당신은 항상 그런 걸 보나요?"
      },
      {
        "text": "Yes, so are we.",
        "chunks": [
          "Yes,",
          "so",
          "are we."
        ],
        "translation": "네, 우리도 그래요."
      },
      {
        "text": "Get out of here.",
        "chunks": [
          "Get",
          "out",
          "of here."
        ],
        "translation": "여기서 나가세요."
      },
      {
        "text": "That’s too advanced for you.",
        "chunks": [
          "That’s",
          "too",
          "advanced for you."
        ],
        "translation": "그건 당신에게 너무 어렵습니다."
      },
      {
        "text": "How high can you jump?",
        "chunks": [
          "How",
          "high",
          "can you jump?"
        ],
        "translation": "얼마나 높이 뛸 수 있나요?"
      },
      {
        "text": "How should I do this?",
        "chunks": [
          "How",
          "should",
          "I do this?"
        ],
        "translation": "제가 이걸 어떻게 해야 하죠?"
      },
      {
        "text": "What? Why would you do that?",
        "chunks": [
          "What?",
          "Why",
          "would you do that?"
        ],
        "translation": "뭐라고요? 왜 그렇게 하시려는 거죠?"
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
        "translation": "소파 위에서 뛰지 말았어야 했어요."
      },
      {
        "text": "Thanks, Sofi. They say I’m tough, but effective.",
        "chunks": [
          "Thanks, Sofi. They say",
          "I’m tough, but effective."
        ],
        "translation": "고마워요, 소피. 사람들은 제가 엄격하지만 유능하다고들 하죠."
      },
      {
        "text": "Listen. I can’t be late to this meeting.",
        "chunks": [
          "Listen. I can’t be",
          "late to this meeting."
        ],
        "translation": "들어봐요. 전 이 회의에 늦을 수 없어요."
      },
      {
        "text": "Then, teach you what you need to learn.",
        "chunks": [
          "Then, teach you what",
          "you need to learn."
        ],
        "translation": "그러고 나서 당신이 배워야 할 것들을 가르쳐 줄게요."
      },
      {
        "text": "This course operates under traditional teaching methods.",
        "chunks": [
          "This course operates",
          "under traditional teaching methods."
        ],
        "translation": "이 강의는 전통적인 교수법으로 운영됩니다."
      },
      {
        "text": "This time tomorrow, I’ll be celebrating by myself.",
        "chunks": [
          "This time tomorrow, I’ll",
          "be celebrating by myself."
        ],
        "translation": "내일 이맘때쯤엔 저 혼자 축하하고 있을 거예요."
      },
      {
        "text": "That goes for playing hooky as well.",
        "chunks": [
          "That goes for",
          "playing hooky as well."
        ],
        "translation": "그건 수업을 빼먹는 행위에도 똑같이 적용됩니다."
      },
      {
        "text": "Wow. You are a very committed actor.",
        "chunks": [
          "Wow. You are",
          "a very committed actor."
        ],
        "translation": "와우. 당신은 정말 헌신적인 배우군요."
      },
      {
        "text": "I don’t know. How long does it take?",
        "chunks": [
          "I don’t know. How",
          "long does it take?"
        ],
        "translation": "글쎄요. 시간이 얼마나 걸리나요?"
      },
      {
        "text": "He counted to three: “One, two, three, go!”",
        "chunks": [
          "He counted to three:",
          "“One, two, three, go!”"
        ],
        "translation": "그는 셋을 셌습니다. '하나, 둘, 셋, 출발!'"
      },
      {
        "text": "You can ask questions about the lesson.",
        "chunks": [
          "You can ask",
          "questions about the lesson."
        ],
        "translation": "수업 내용에 대해 질문할 수 있습니다."
      },
      {
        "text": "We have very high standards for our tutors.",
        "chunks": [
          "We have very high",
          "standards for our tutors."
        ],
        "translation": "우리는 튜터에 대해 매우 높은 기준을 가지고 있습니다."
      },
      {
        "text": "She was supposed to call you, but didn’t.",
        "chunks": [
          "She was supposed to",
          "call you, but didn’t."
        ],
        "translation": "그녀가 당신에게 전화하기로 되어 있었는데, 하지 않았어요."
      },
      {
        "text": "That was a mistake. It doesn’t matter now.",
        "chunks": [
          "That was a mistake.",
          "It doesn’t matter now."
        ],
        "translation": "그건 실수였어요. 지금은 중요하지 않아요."
      },
      {
        "text": "You’re crazy, Renzo. What will you do?",
        "chunks": [
          "You’re crazy, Renzo.",
          "What will you do?"
        ],
        "translation": "당신 미쳤군요, 렌조. 당신은 어쩌려고요?"
      },
      {
        "text": "Hey Benny. What are you doing here?",
        "chunks": [
          "Hey Benny. What",
          "are you doing here?"
        ],
        "translation": "안녕, 베니. 여기서 뭐 해?"
      },
      {
        "text": "Which is worse, cheating or playing hooky?",
        "chunks": [
          "Which is worse,",
          "cheating or playing hooky?"
        ],
        "translation": "부정행위와 무단결석 중 어느 것이 더 나쁜가요?"
      },
      {
        "text": "Instead, I want you to leap over it.",
        "chunks": [
          "Instead, I want you",
          "to leap over it."
        ],
        "translation": "대신, 저는 당신이 그걸 뛰어넘길 원합니다."
      },
      {
        "text": "They say our education system is getting worse.",
        "chunks": [
          "They say our education",
          "system is getting worse."
        ],
        "translation": "사람들은 우리 교육 시스템이 악화되고 있다고 말합니다."
      },
      {
        "text": "Hi there Sofi, why are you washing dishes?",
        "chunks": [
          "Hi there Sofi, why",
          "are you washing dishes?"
        ],
        "translation": "안녕 소피, 왜 설거지를 하고 있나요?"
      },
      {
        "text": "How are you going to do that?",
        "chunks": [
          "How are you",
          "going to do that?"
        ],
        "translation": "그걸 어떻게 해낼 생각인가요?"
      },
      {
        "text": "I’m so excited you have a working prototype.",
        "chunks": [
          "I’m so excited you",
          "have a working prototype."
        ],
        "translation": "당신이 작동하는 시제품을 가지고 있다니 정말 흥분되네요."
      },
      {
        "text": "Hey guys. I’m so sorry. I’m late.",
        "chunks": [
          "Hey guys. I’m",
          "so sorry. I’m late."
        ],
        "translation": "안녕하세요 여러분. 너무 죄송해요. 제가 늦었네요."
      },
      {
        "text": "Ah, I see your problem right here.",
        "chunks": [
          "Ah, I see",
          "your problem right here."
        ],
        "translation": "아, 여기서 문제가 뭔지 알겠군요."
      },
      {
        "text": "Are there many tutors that can help me?",
        "chunks": [
          "Are there many tutors",
          "that can help me?"
        ],
        "translation": "저를 도와줄 수 있는 튜터가 많이 있나요?"
      },
      {
        "text": "Please. Let me invest in your company.",
        "chunks": [
          "Please. Let me",
          "invest in your company."
        ],
        "translation": "제발. 당신들 회사에 투자하게 해 주세요."
      },
      {
        "text": "You don’t have to do that Renzo.",
        "chunks": [
          "You don’t have",
          "to do that Renzo."
        ],
        "translation": "렌조, 당신은 그렇게 하지 않아도 돼요."
      },
      {
        "text": "Can you throw yourself through a brick wall?",
        "chunks": [
          "Can you throw yourself",
          "through a brick wall?"
        ],
        "translation": "벽돌 벽을 뚫고 몸을 날릴 수 있나요?"
      },
      {
        "text": "She has to, she doesn’t. I’ll quit.",
        "chunks": [
          "She has to,",
          "she doesn’t. I’ll quit."
        ],
        "translation": "그녀는 동의해야만 해요, 안 그러면 제가 그만둘 겁니다."
      },
      {
        "text": "They gave it to me an hour ago.",
        "chunks": [
          "They gave it to",
          "me an hour ago."
        ],
        "translation": "한 시간 전에야 저한테 대본을 줬어요."
      },
      {
        "text": "Don't worry about any of those things.",
        "chunks": [
          "Don't worry about",
          "any of those things."
        ],
        "translation": "그런 것들에 대해선 아무 걱정 하지 마세요."
      },
      {
        "text": "Hi there. What can I do for you?",
        "chunks": [
          "Hi there. What can",
          "I do for you?"
        ],
        "translation": "안녕하세요. 무엇을 도와드릴까요?"
      },
      {
        "text": "Renzo, I want to open my own restaurant.",
        "chunks": [
          "Renzo, I want to",
          "open my own restaurant."
        ],
        "translation": "렌조, 저는 제 레스토랑을 열고 싶어요."
      },
      {
        "text": "My offer was supposed to make you happy.",
        "chunks": [
          "My offer was supposed",
          "to make you happy."
        ],
        "translation": "제 제안은 당신을 행복하게 만들었어야 했는데요."
      },
      {
        "text": "Dash toward the wall, then leap over it.",
        "chunks": [
          "Dash toward the wall,",
          "then leap over it."
        ],
        "translation": "벽을 향해 돌진한 다음, 뛰어넘으세요."
      },
      {
        "text": "I didn’t want you to smash into it.",
        "chunks": [
          "I didn’t want you",
          "to smash into it."
        ],
        "translation": "저는 당신이 벽에 충돌하길 원치 않았어요."
      },
      {
        "text": "I should’ve come to Los Angeles sooner.",
        "chunks": [
          "I should’ve come",
          "to Los Angeles sooner."
        ],
        "translation": "저는 진작에 로스앤젤레스에 왔어야 했어요."
      },
      {
        "text": "It’s fine. Great to see you Khae.",
        "chunks": [
          "It’s fine. Great",
          "to see you Khae."
        ],
        "translation": "괜찮아요. 만나서 반가워요, 카이."
      },
      {
        "text": "I didn’t smash into a brick wall.",
        "chunks": [
          "I didn’t smash",
          "into a brick wall."
        ],
        "translation": "저는 벽돌 벽에 부딪힌 게 아니에요."
      },
      {
        "text": "I’ve never thrown myself into a brick wall.",
        "chunks": [
          "I’ve never thrown myself",
          "into a brick wall."
        ],
        "translation": "저는 벽돌 벽에 몸을 던져본 적이 없습니다."
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
        "translation": "우리가 만나는 투자자마다 우리와 일하고 싶어 해요."
      },
      {
        "text": "You want to be a big star, aren’t you?",
        "chunks": [
          "You want to",
          "be a big",
          "star, aren’t you?"
        ],
        "translation": "당신은 대스타가 되길 원하죠, 안 그런가요?"
      },
      {
        "text": "I want that more than anything in the world.",
        "chunks": [
          "I want that",
          "more than anything",
          "in the world."
        ],
        "translation": "저는 세상 그 어떤 것보다 그걸 간절히 원해요."
      },
      {
        "text": "No, thank you. Where’s your business partner? She’s late.",
        "chunks": [
          "No, thank you.",
          "Where’s your business",
          "partner? She’s late."
        ],
        "translation": "아니요, 괜찮습니다. 동업자는 어디 있나요? 늦네요."
      },
      {
        "text": "And I told you that you don’t have to.",
        "chunks": [
          "And I told",
          "you that you",
          "don’t have to."
        ],
        "translation": "그리고 전 당신이 그럴 필요 없다고 말했잖아요."
      },
      {
        "text": "I hear the views from the mountains are breathtaking.",
        "chunks": [
          "I hear the",
          "views from the",
          "mountains are breathtaking."
        ],
        "translation": "그 산에서 바라보는 경치가 숨 멎을 듯 아름답다고 들었어요."
      },
      {
        "text": "That was an awful lesson. You’re a terrible teacher.",
        "chunks": [
          "That was an",
          "awful lesson. You’re",
          "a terrible teacher."
        ],
        "translation": "정말 끔찍한 수업이었어요. 당신은 끔찍한 선생입니다."
      },
      {
        "text": "Kate, wouldn’t it be relaxing to go on a cruise?",
        "chunks": [
          "Kate, wouldn’t it",
          "be relaxing to",
          "go on a cruise?"
        ],
        "translation": "케이트, 크루즈 여행을 가는 게 훨씬 편안하지 않을까?"
      },
      {
        "text": "You need to attempt to do the next task.",
        "chunks": [
          "You need to",
          "attempt to do",
          "the next task."
        ],
        "translation": "당신은 다음 과제를 시도해야 합니다."
      },
      {
        "text": "My English literacy isn’t quite as advanced as my speaking.",
        "chunks": [
          "My English literacy",
          "isn’t quite as",
          "advanced as my speaking."
        ],
        "translation": "제 영어 읽기 쓰기 실력은 말하기만큼 뛰어나지 않아요."
      },
      {
        "text": "That’s sweet of you, Renzo. But it’s not possible.",
        "chunks": [
          "That’s sweet of",
          "you, Renzo. But",
          "it’s not possible."
        ],
        "translation": "마음은 고맙지만, 렌조. 그건 불가능해요."
      },
      {
        "text": "You learn language, and then immediately use it to communicate.",
        "chunks": [
          "You learn language,",
          "and then immediately",
          "use it to communicate."
        ],
        "translation": "언어를 배우고, 소통하기 위해 즉시 그것을 사용합니다."
      },
      {
        "text": "I’ve always wanted to go on a long cruise.",
        "chunks": [
          "I’ve always wanted",
          "to go on",
          "a long cruise."
        ],
        "translation": "저는 항상 긴 크루즈 여행을 떠나고 싶었어요."
      },
      {
        "text": "This is done with a series of interactive presentations.",
        "chunks": [
          "This is done",
          "with a series",
          "of interactive presentations."
        ],
        "translation": "이것은 일련의 대화형 프레젠테이션을 통해 이루어집니다."
      },
      {
        "text": "I’ll show you. Hurl this brick at my head.",
        "chunks": [
          "I’ll show you.",
          "Hurl this brick",
          "at my head."
        ],
        "translation": "제가 보여주죠. 이 벽돌을 제 머리를 향해 던지세요."
      },
      {
        "text": "Have you struggled with language courses in the past?",
        "chunks": [
          "Have you struggled",
          "with language courses",
          "in the past?"
        ],
        "translation": "과거에 언어 수업 때문에 어려움을 겪은 적이 있나요?"
      },
      {
        "text": "Playing hooky means to not to come to class.",
        "chunks": [
          "Playing hooky means",
          "to not to",
          "come to class."
        ],
        "translation": "Playing hooky라는 말은 수업에 오지 않는다는 뜻입니다."
      },
      {
        "text": "Hi, I’m Jimmy, the stunt coordinator for the series.",
        "chunks": [
          "Hi, I’m Jimmy,",
          "the stunt coordinator",
          "for the series."
        ],
        "translation": "안녕하세요, 저는 이 시리즈의 스턴트 코디네이터인 지미입니다."
      },
      {
        "text": "You fly to Dubai and stay with an Arabic-speaking family.",
        "chunks": [
          "You fly to",
          "Dubai and stay",
          "with an Arabic-speaking family."
        ],
        "translation": "당신은 두바이로 날아가 아랍어를 쓰는 가정에서 머물게 됩니다."
      },
      {
        "text": "There are several explosions and fight scenes in this episode.",
        "chunks": [
          "There are several",
          "explosions and fight",
          "scenes in this episode."
        ],
        "translation": "이번 에피소드에는 몇 차례의 폭발과 격투 씬이 있습니다."
      },
      {
        "text": "I thought you were bilingual. You speak fluent English.",
        "chunks": [
          "I thought you",
          "were bilingual. You",
          "speak fluent English."
        ],
        "translation": "전 당신이 이중언어 구사자인 줄 알았어요. 유창한 영어를 쓰잖아요."
      },
      {
        "text": "We give you the telecommunications software you need to download.",
        "chunks": [
          "We give you",
          "the telecommunications software",
          "you need to download."
        ],
        "translation": "우리는 당신이 다운로드해야 할 통신 소프트웨어를 제공합니다."
      },
      {
        "text": "I have to crawl back to the dressing room.",
        "chunks": [
          "I have to",
          "crawl back to",
          "the dressing room."
        ],
        "translation": "전 분장실까지 기어서 돌아가야 해요."
      },
      {
        "text": "You should’ve jumped before you got to the wall.",
        "chunks": [
          "You should’ve jumped",
          "before you got",
          "to the wall."
        ],
        "translation": "당신은 벽에 도달하기 전에 점프를 했어야 했어요."
      },
      {
        "text": "Are you afraid it's going to be too difficult?",
        "chunks": [
          "Are you afraid",
          "it's going to",
          "be too difficult?"
        ],
        "translation": "그게 너무 어려울까 봐 두려우신가요?"
      },
      {
        "text": "You hear about teachers who don’t care at all.",
        "chunks": [
          "You hear about",
          "teachers who don’t",
          "care at all."
        ],
        "translation": "학생들에게 전혀 관심 없는 교사들 이야기를 듣곤 하잖아요."
      },
      {
        "text": "I don’t really need to be the head chef anymore.",
        "chunks": [
          "I don’t really",
          "need to be",
          "the head chef anymore."
        ],
        "translation": "저는 더 이상 수석 셰프가 될 필요가 없어요."
      },
      {
        "text": "Click here to chat with a teaching tutor now.",
        "chunks": [
          "Click here to",
          "chat with a",
          "teaching tutor now."
        ],
        "translation": "튜터와 지금 바로 채팅하려면 여기를 클릭하세요."
      },
      {
        "text": "Really? How do you know that? Did she tell you?",
        "chunks": [
          "Really? How do",
          "you know that?",
          "Did she tell you?"
        ],
        "translation": "정말요? 그걸 어떻게 알죠? 그녀가 말해줬나요?"
      },
      {
        "text": "You need to catch the brick before it hits you.",
        "chunks": [
          "You need to",
          "catch the brick",
          "before it hits you."
        ],
        "translation": "당신은 벽돌이 당신을 치기 전에 그걸 잡아야 해요."
      },
      {
        "text": "We have courses that last two and four weeks.",
        "chunks": [
          "We have courses",
          "that last two",
          "and four weeks."
        ],
        "translation": "우리는 2주와 4주 과정의 코스를 운영하고 있습니다."
      },
      {
        "text": "I meant to tell you that, but I forgot.",
        "chunks": [
          "I meant to",
          "tell you that,",
          "but I forgot."
        ],
        "translation": "그 얘기를 해주려고 했는데, 깜빡 잊어버렸어요."
      },
      {
        "text": "You should’ve told me you were going to hurl it.",
        "chunks": [
          "You should’ve told",
          "me you were",
          "going to hurl it."
        ],
        "translation": "당신이 그걸 던질 거라고 진작에 말해줬어야죠."
      },
      {
        "text": "I’m going to see how skilled you are at stunts.",
        "chunks": [
          "I’m going to",
          "see how skilled",
          "you are at stunts."
        ],
        "translation": "당신의 스턴트 실력이 얼마나 뛰어난지 보겠습니다."
      },
      {
        "text": "Why do we have to take so many tests?",
        "chunks": [
          "Why do we",
          "have to take",
          "so many tests?"
        ],
        "translation": "우리는 왜 이렇게 많은 시험을 쳐야 하는 거죠?"
      },
      {
        "text": "You could’ve told me it was made of real bricks.",
        "chunks": [
          "You could’ve told",
          "me it was",
          "made of real bricks."
        ],
        "translation": "그게 진짜 벽돌로 만들어졌다고 저한테 말해줄 수도 있었잖아요."
      },
      {
        "text": "Weren’t you supposed to leave earlier for some meeting?",
        "chunks": [
          "Weren’t you supposed",
          "to leave earlier",
          "for some meeting?"
        ],
        "translation": "무슨 회의 때문에 일찍 퇴근하기로 되어 있지 않았나요?"
      },
      {
        "text": "You look like you smashed into a brick wall.",
        "chunks": [
          "You look like",
          "you smashed into",
          "a brick wall."
        ],
        "translation": "당신 꼭 벽돌 벽에 들이받은 사람처럼 보이네요."
      },
      {
        "text": "Sir, I’m an experienced actor, and I’ll be fine.",
        "chunks": [
          "Sir, I’m an",
          "experienced actor, and",
          "I’ll be fine."
        ],
        "translation": "선생님, 전 경험 많은 배우라 괜찮을 겁니다."
      },
      {
        "text": "Rote learning is the best way to remember anything.",
        "chunks": [
          "Rote learning is",
          "the best way",
          "to remember anything."
        ],
        "translation": "기계적 암기는 무언가를 기억하는 가장 좋은 방법입니다."
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
        "translation": "좋은 지적이네요. 아마 내일 우리는 시골로 자전거를 타러 갈 수 있을 거예요."
      },
      {
        "text": "Sure, I’m willing to compromise. What did you have in mind?",
        "chunks": [
          "Sure, I’m willing to compromise.",
          "What did you have in mind?"
        ],
        "translation": "물론이죠, 저도 기꺼이 타협할 의향이 있습니다. 무슨 생각 하셨나요?"
      },
      {
        "text": "Having cleaned up my area, I helped Nadi with the menu.",
        "chunks": [
          "Having cleaned up my area,",
          "I helped Nadi with the menu."
        ],
        "translation": "제 구역을 청소한 후, 저는 나디의 메뉴 준비를 도왔습니다."
      },
      {
        "text": "I always dreamed of going on a hiking expedition through the Himalayas.",
        "chunks": [
          "I always dreamed of going on",
          "a hiking expedition through the Himalayas."
        ],
        "translation": "저는 항상 히말라야를 가로지르는 하이킹 원정을 꿈꿔왔어요."
      },
      {
        "text": "Well, I’m glad we have such a dedicated teacher as you.",
        "chunks": [
          "Well, I’m glad we have",
          "such a dedicated teacher as you."
        ],
        "translation": "음, 당신처럼 헌신적인 선생님이 계셔서 정말 다행입니다."
      },
      {
        "text": "With every stunt, one mistake could cause injury or even death.",
        "chunks": [
          "With every stunt, one mistake",
          "could cause injury or even death."
        ],
        "translation": "모든 스턴트에서, 단 한 번의 실수가 부상이나 심지어 죽음을 초래할 수 있습니다."
      },
      {
        "text": "I don’t understand. I thought  you would be excited by this opportunity.",
        "chunks": [
          "I don’t understand. I thought you",
          "would be excited by this opportunity."
        ],
        "translation": "해석이 제공되지 않은 문장입니다."
      },
      {
        "text": "I don’t need a new bike. I need a new tire.",
        "chunks": [
          "I don’t need a new",
          "bike. I need a new tire."
        ],
        "translation": "새 자전거는 필요 없어요. 제겐 새 타이어가 필요합니다."
      },
      {
        "text": "Working by the dining room, I overheard Nadi telling someone that.",
        "chunks": [
          "Working by the dining room,",
          "I overheard Nadi telling someone that."
        ],
        "translation": "다이닝 룸 근처에서 일하다가, 나디가 누군가에게 그렇게 말하는 걸 우연히 들었어요."
      },
      {
        "text": "Thank you. But I still have a lot of work to do.",
        "chunks": [
          "Thank you. But I still have",
          "a lot of work to do."
        ],
        "translation": "감사합니다. 하지만 저는 아직 해야 할 일이 많이 남아 있어요."
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
        "translation": "좋은 지적이네요. 아마 내일 우리는 시골로 자전거를 타러 갈 수 있을 거예요."
      },
      {
        "text": "Sure, I’m willing to compromise. What did you have in mind?",
        "chunks": [
          "Sure, I’m willing",
          "to compromise. What",
          "did you have in mind?"
        ],
        "translation": "물론이죠, 저도 기꺼이 타협할 의향이 있습니다. 무슨 생각 하셨나요?"
      },
      {
        "text": "Having cleaned up my area, I helped Nadi with the menu.",
        "chunks": [
          "Having cleaned up",
          "my area, I",
          "helped Nadi with the menu."
        ],
        "translation": "제 구역을 청소한 후, 저는 나디의 메뉴 준비를 도왔습니다."
      },
      {
        "text": "I always dreamed of going on a hiking expedition through the Himalayas.",
        "chunks": [
          "I always dreamed of",
          "going on a hiking",
          "expedition through the Himalayas."
        ],
        "translation": "저는 항상 히말라야를 가로지르는 하이킹 원정을 꿈꿔왔어요."
      },
      {
        "text": "Well, I’m glad we have such a dedicated teacher as you.",
        "chunks": [
          "Well, I’m glad",
          "we have such",
          "a dedicated teacher as you."
        ],
        "translation": "음, 당신처럼 헌신적인 선생님이 계셔서 정말 다행입니다."
      },
      {
        "text": "With every stunt, one mistake could cause injury or even death.",
        "chunks": [
          "With every stunt,",
          "one mistake could",
          "cause injury or even death."
        ],
        "translation": "모든 스턴트에서, 단 한 번의 실수가 부상이나 심지어 죽음을 초래할 수 있습니다."
      },
      {
        "text": "I don’t understand. I thought  you would be excited by this opportunity.",
        "chunks": [
          "I don’t understand. I",
          "thought you would be",
          "excited by this opportunity."
        ],
        "translation": "해석이 제공되지 않은 문장입니다."
      },
      {
        "text": "I don’t need a new bike. I need a new tire.",
        "chunks": [
          "I don’t need",
          "a new bike.",
          "I need a new tire."
        ],
        "translation": "새 자전거는 필요 없어요. 제겐 새 타이어가 필요합니다."
      },
      {
        "text": "Working by the dining room, I overheard Nadi telling someone that.",
        "chunks": [
          "Working by the",
          "dining room, I",
          "overheard Nadi telling someone that."
        ],
        "translation": "다이닝 룸 근처에서 일하다가, 나디가 누군가에게 그렇게 말하는 걸 우연히 들었어요."
      },
      {
        "text": "Thank you. But I still have a lot of work to do.",
        "chunks": [
          "Thank you. But I",
          "still have a lot",
          "of work to do."
        ],
        "translation": "감사합니다. 하지만 저는 아직 해야 할 일이 많이 남아 있어요."
      },
      {
        "text": "Okay. Stop complimenting me. Let’s open our book to page four.",
        "chunks": [
          "Okay. Stop complimenting",
          "me. Let’s open",
          "our book to page four."
        ],
        "translation": "좋아요. 칭찬은 그만합시다. 책 4페이지를 펴볼까요."
      },
      {
        "text": "I don’t know. We have a lot of work to do.",
        "chunks": [
          "I don’t know.",
          "We have a",
          "lot of work to do."
        ],
        "translation": "글쎄요. 우리는 해야 할 일이 산더미예요."
      },
      {
        "text": "I can’t wait. This is what we always want to see Marco.",
        "chunks": [
          "I can’t wait. This",
          "is what we always",
          "want to see Marco."
        ],
        "translation": "너무 기대되네요. 이게 우리가 항상 보고 싶었던 모습이잖아요, 마르코."
      },
      {
        "text": "That’s a good point. There are some amazing markets in Cusco.",
        "chunks": [
          "That’s a good",
          "point. There are",
          "some amazing markets in Cusco."
        ],
        "translation": "좋은 지적이에요. 쿠스코에는 정말 놀라운 시장들이 몇 군데 있거든요."
      },
      {
        "text": "My last expedition through the city didn’t turn out so well.",
        "chunks": [
          "My last expedition",
          "through the city",
          "didn’t turn out so well."
        ],
        "translation": "지난번 도시 원정은 결과가 그리 좋지 않았어요."
      },
      {
        "text": "Our program offers classes for everyone, from complete beginners to advanced students.",
        "chunks": [
          "Our program offers classes",
          "for everyone, from complete",
          "beginners to advanced students."
        ],
        "translation": "저희 프로그램은 완전 초보자부터 상급자까지 모든 분을 위한 수업을 제공합니다."
      },
      {
        "text": "But then, the wall is too tall for me to leap over.",
        "chunks": [
          "But then, the wall",
          "is too tall for",
          "me to leap over."
        ],
        "translation": "하지만 그러기엔, 제가 뛰어넘기에 벽이 너무 높은걸요."
      },
      {
        "text": "I would be your sous chef. You’re more talented than I am.",
        "chunks": [
          "I would be your",
          "sous chef. You’re more",
          "talented than I am."
        ],
        "translation": "제가 당신의 부주방장이 될게요. 당신이 저보다 훨씬 재능이 뛰어나니까요."
      },
      {
        "text": "We are also careful when we pair our students with teaching tutors.",
        "chunks": [
          "We are also careful",
          "when we pair our",
          "students with teaching tutors."
        ],
        "translation": "저희는 학생들과 지도 튜터를 매칭할 때 매우 신중을 기합니다."
      },
      {
        "text": "Where are we going to go on our big trip this year?",
        "chunks": [
          "Where are we going",
          "to go on our",
          "big trip this year?"
        ],
        "translation": "올해 우리의 대여행은 어디로 갈 생각이야?"
      },
      {
        "text": "Last week, Nadi was close to begging you to come back.",
        "chunks": [
          "Last week, Nadi",
          "was close to",
          "begging you to come back."
        ],
        "translation": "지난주에 나디는 당신에게 돌아와 달라고 거의 애원할 뻔했어요."
      },
      {
        "text": "Are you going to make me smash into the wall again?",
        "chunks": [
          "Are you going",
          "to make me",
          "smash into the wall again?"
        ],
        "translation": "저를 또다시 벽에 처박히게 만드실 건가요?"
      },
      {
        "text": "People only grow when they have someone great to learn from.",
        "chunks": [
          "People only grow",
          "when they have",
          "someone great to learn from."
        ],
        "translation": "사람은 훌륭한 배움을 줄 누군가가 곁에 있을 때 성장하는 법이죠."
      },
      {
        "text": "That sounds fun. Let’s build a manufacturing plant by a beach.",
        "chunks": [
          "That sounds fun.",
          "Let’s build a",
          "manufacturing plant by a beach."
        ],
        "translation": "그거 재미있겠네요. 해변가에 제조 공장을 하나 지어보죠."
      },
      {
        "text": "You can do that for a day or two, can’t you?",
        "chunks": [
          "You can do",
          "that for a",
          "day or two, can’t you?"
        ],
        "translation": "하루 이틀 정도는 그렇게 해줄 수 있잖아, 안 그래?"
      },
      {
        "text": "The politician. Walking into the dining room I bumped into him.",
        "chunks": [
          "The politician. Walking",
          "into the dining",
          "room I bumped into him."
        ],
        "translation": "그 정치인 말이에요. 다이닝 룸으로 들어가다 그와 딱 마주쳤어요."
      },
      {
        "text": "Do you want to review the selection criteria for these investors?",
        "chunks": [
          "Do you want",
          "to review the",
          "selection criteria for these investors?"
        ],
        "translation": "이 투자자들에 대한 선정 기준을 검토해 볼래?"
      },
      {
        "text": "Since you’re here, I’d recommend adding plastic covers to your handlebars.",
        "chunks": [
          "Since you’re here,",
          "I’d recommend adding",
          "plastic covers to your handlebars."
        ],
        "translation": "마침 오셨으니, 자전거 핸들에 플라스틱 덮개를 추가하는 걸 추천합니다."
      },
      {
        "text": "I came to say hello during your first day on set.",
        "chunks": [
          "I came to",
          "say hello during",
          "your first day on set."
        ],
        "translation": "세트장에서 맞이하는 당신의 첫날, 인사라도 하려고 왔습니다."
      },
      {
        "text": "I want you to pick me as opposed to anyone else.",
        "chunks": [
          "I want you",
          "to pick me",
          "as opposed to anyone else."
        ],
        "translation": "다른 그 누구도 아닌 저를 선택해 주셨으면 합니다."
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
