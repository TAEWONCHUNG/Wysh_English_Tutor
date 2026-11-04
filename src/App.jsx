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
  Play,
  Square,
  Volume1,
  Bell,
  Wand2,
  Film
} from 'lucide-react';

const DIFFICULTY_LEVELS = [
  { id: 'A2', label: 'A2', desc: '초급' },
  { id: 'B1', label: 'B1', desc: '중급' },
  { id: 'B2', label: 'B2', desc: '고급' }
];

// 영화 [인턴 (The Intern, 2015)] 실제 명대사 원문 (자연스러운 의미 단위 호흡 청크)
const CHUNK_DATABASE = {
  "A2": {
    "2": [
      {
        "text": "Experience never gets old.",
        "chunks": ["Experience", "never gets old."],
        "translation": "경험은 결코 늙지 않습니다. (인턴 대표 태그라인)"
      },
      {
        "text": "You're never wrong to do the right thing.",
        "chunks": ["You're never wrong", "to do the right thing."],
        "translation": "옳은 일을 하는 데 있어 결코 잘못된 때는 없습니다."
      },
      {
        "text": "I still have music in me.",
        "chunks": ["I still have", "music in me."],
        "translation": "내 안엔 아직 음악(열정)이 남아있어요."
      },
      {
        "text": "I just want to be helpful.",
        "chunks": ["I just want", "to be helpful."],
        "translation": "전 그저 도움이 되고 싶을 뿐입니다."
      },
      {
        "text": "You should be proud of what you've built.",
        "chunks": ["You should be proud", "of what you've built."],
        "translation": "당신이 일군 것에 대해 자부심을 가지셔야 해요."
      },
      {
        "text": "I like that you're into it.",
        "chunks": ["I like that", "you're into it."],
        "translation": "당신이 일에 푹 빠져있는 모습이 보기 좋습니다."
      },
      {
        "text": "Can I get you some coffee?",
        "chunks": ["Can I get you", "some warm coffee?"],
        "translation": "따뜻한 커피 한 잔 가져다드릴까요?"
      },
      {
        "text": "You look great today, Jules.",
        "chunks": ["You look great today,", "Jules."],
        "translation": "줄스, 오늘 정말 멋져 보여요."
      },
      {
        "text": "I can drive you wherever you need.",
        "chunks": ["I can drive you", "wherever you need."],
        "translation": "필요하신 곳 어디든 모셔다드릴 수 있습니다."
      },
      {
        "text": "Please let me know if you need help.",
        "chunks": ["Please let me know", "if you need help."],
        "translation": "도움이 필요하시면 언제든 말씀해 주세요."
      },
      {
        "text": "I'm not trying to be a burden.",
        "chunks": ["I'm not trying", "to be a burden."],
        "translation": "당신에게 짐이 되려는 게 아닙니다."
      },
      {
        "text": "The key is in your pocket.",
        "chunks": ["The key is", "in your pocket."],
        "translation": "해답의 열쇠는 이미 당신 주머니에 있습니다."
      },
      {
        "text": "I will take care of that right now.",
        "chunks": ["I will take care of that", "right now."],
        "translation": "그 일은 제가 지금 바로 처리하겠습니다."
      },
      {
        "text": "We can talk after lunch.",
        "chunks": ["We can talk", "after lunch."],
        "translation": "우리 점심 먹고 이야기 나누죠."
      },
      {
        "text": "It's so nice meeting you, Jules.",
        "chunks": ["It's so nice", "meeting you, Jules."],
        "translation": "줄스, 당신을 알게 되어 정말 반갑습니다."
      }
    ],
    "3": [
      {
        "text": "Love and work. Work and love. That's all there is.",
        "chunks": ["Love and work.", "Work and love.", "That's all there is."],
        "translation": "사랑과 일, 일과 사랑. 프로이트의 말처럼 인생엔 그게 전부예요."
      },
      {
        "text": "There's a hole in my life, and I need to fill it.",
        "chunks": ["There's a hole in my life,", "and I need", "to fill it."],
        "translation": "내 삶에 큰 구멍이 생겼고, 이제는 그걸 채워야만 해요."
      },
      {
        "text": "I am ready to learn anything you can teach me.",
        "chunks": ["I am ready to learn", "anything", "you can teach me."],
        "translation": "당신이 제게 가르쳐 주시는 무엇이든 기쁘게 배울 준비가 되어 있습니다."
      },
      {
        "text": "It's quite amazing what you did in one year.",
        "chunks": ["It's quite amazing", "what you did", "in one year."],
        "translation": "불과 1년 만에 당신이 해낸 일들을 보면 참으로 놀랍습니다."
      },
      {
        "text": "I just want to make your day a little easier.",
        "chunks": ["I just want", "to make your day", "a little easier."],
        "translation": "그저 당신의 힘든 하루가 조금이나마 수월해지길 바랄 뿐입니다."
      },
      {
        "text": "I'll be right here whenever you need a ride.",
        "chunks": ["I'll be right here", "whenever you need", "a ride home."],
        "translation": "퇴근길 차편이 필요하실 땐 언제든 곁에서 대기하고 있을게요."
      },
      {
        "text": "Let's take a walk to clear our heads.",
        "chunks": ["Let's take a walk", "around the block", "to clear our heads."],
        "translation": "머리를 식히기 위해 동네 주변을 가볍게 한 바퀴 걷고 오죠."
      },
      {
        "text": "I am very happy to be a part of this.",
        "chunks": ["I am very happy", "to be a part", "of this company."],
        "translation": "이 회사의 일원이 될 수 있어 진심으로 행복합니다."
      },
      {
        "text": "You did a great job with this presentation today.",
        "chunks": ["You did a great job", "with this presentation", "earlier today."],
        "translation": "오늘 진행한 프레젠테이션, 정말 훌륭하게 잘 끝마쳤어요."
      },
      {
        "text": "You have great people working around you every day.",
        "chunks": ["You have great people", "working around you", "every single day."],
        "translation": "매일 당신 곁에서 함께 달려주는 든든한 동료들이 있잖아요."
      }
    ]
  },
  "B1": {
    "2": [
      {
        "text": "Nobody knows this business better than you do.",
        "chunks": ["Nobody knows this business", "better than you do."],
        "translation": "이 사업에 대해선 그 누구도 당신보다 더 잘 알지 못합니다."
      },
      {
        "text": "Why are people still critical of working moms?",
        "chunks": ["Why are people still", "critical of working moms?"],
        "translation": "사람들은 왜 여전히 일하는 엄마들에게 인색할까요?"
      },
      {
        "text": "I need someone who understands my vision.",
        "chunks": ["I need someone", "who understands my vision."],
        "translation": "제 사업 비전을 온전히 이해해 줄 수 있는 사람이 필요해요."
      },
      {
        "text": "I appreciate your honesty more than you know.",
        "chunks": ["I appreciate your honesty", "more than you know."],
        "translation": "당신의 솔직함에 제가 얼마나 감사하고 있는지 모를 겁니다."
      },
      {
        "text": "We built this company on trust and passion.",
        "chunks": ["We built this company", "on trust and passion."],
        "translation": "우리는 신뢰와 열정 하나로 이 회사를 세웠습니다."
      },
      {
        "text": "I cannot imagine this office without you.",
        "chunks": ["I cannot imagine", "this office without you."],
        "translation": "이제는 당신이 없는 이 사무실을 상상조차 할 수 없어요."
      },
      {
        "text": "Sometimes you must pause to see things clearly.",
        "chunks": ["Sometimes you must pause", "to see things clearly."],
        "translation": "상황을 똑바로 보려면 때로는 잠시 멈춰 서야 합니다."
      },
      {
        "text": "It takes courage to admit needing help.",
        "chunks": ["It takes courage", "to admit needing help."],
        "translation": "도움이 필요하다고 인정하는 데는 큰 용기가 필요합니다."
      },
      {
        "text": "We grew much faster than anyone predicted.",
        "chunks": ["We grew much faster", "than anyone predicted."],
        "translation": "우리 회사는 그 누구의 예상보다 훨씬 빠르게 성장했습니다."
      },
      {
        "text": "Every single detail matters in this business.",
        "chunks": ["Every single detail matters", "in this business."],
        "translation": "이 비즈니스에서는 사소한 디테일 하나하나가 중요합니다."
      },
      {
        "text": "Don't let anyone take that away from you.",
        "chunks": ["Don't let anyone", "take that away from you."],
        "translation": "그 누구도 당신이 이룬 것을 빼앗아가지 못하게 하세요."
      },
      {
        "text": "You handled that crisis with remarkable grace.",
        "chunks": ["You handled that crisis", "with remarkable grace."],
        "translation": "당신은 그 위기 상황을 놀라울 정도로 유연하고 품위 있게 대처했습니다."
      }
    ],
    "3": [
      {
        "text": "The best reason to carry a handkerchief is to lend it.",
        "chunks": ["The best reason", "to carry a handkerchief", "is to lend it."],
        "translation": "손수건을 지니고 다녀야 하는 가장 좋은 이유는 누군가에게 건네주기 위함입니다."
      },
      {
        "text": "You started from nothing, and you made it a massive success.",
        "chunks": ["You started from nothing,", "and you made it", "a massive success."],
        "translation": "당신은 맨땅에서 시작해 엄청난 성공을 일궈냈어요."
      },
      {
        "text": "I spent forty years working in manufacturing before this.",
        "chunks": ["I spent forty years", "working in manufacturing", "before coming here."],
        "translation": "저는 이곳에 오기 전 40년 동안 제조 현장에서 일했습니다."
      },
      {
        "text": "It is very hard to trust a stranger with your company.",
        "chunks": ["It is very hard", "to trust a stranger", "with your company."],
        "translation": "모든 걸 바쳐 키운 회사를 낯선 사람에게 맡기기는 참 어렵죠."
      },
      {
        "text": "Don't apologize to anyone for being a successful CEO.",
        "chunks": ["Don't apologize to anyone", "for being", "a successful CEO."],
        "translation": "성공한 여성 CEO라는 사실에 대해 그 누구에게도 미안해하지 마세요."
      },
      {
        "text": "We need to remember why we started in the first place.",
        "chunks": ["We need to remember", "why we started", "in the first place."],
        "translation": "우리가 애초에 왜 이 일을 시작했는지 초심을 기억해야 합니다."
      },
      {
        "text": "You're not just my intern, you're my best friend.",
        "chunks": ["You're not just my intern,", "you are actually", "my best friend."],
        "translation": "당신은 단순한 인턴이 아니라, 제 가장 소중한 친구입니다."
      },
      {
        "text": "Do not let investors dictate how you run your business.",
        "chunks": ["Do not let investors", "dictate", "how you run your business."],
        "translation": "외부 투자자들의 말에 휘둘려 회사를 어떻게 운영할지 결정당하지 마세요."
      }
    ]
  },
  "B2": {
    "2": [
      {
        "text": "Running this startup demands relentless dedication.",
        "chunks": ["Running this startup", "demands relentless dedication."],
        "translation": "이 스타트업을 이끄는 것은 밤낮없는 헌신을 요구합니다."
      },
      {
        "text": "Retirement is an ongoing effort in creativity.",
        "chunks": ["Retirement is an effort", "in ongoing creativity."],
        "translation": "은퇴 이후의 삶이란 끊임없이 일상을 새롭게 채워가는 창의성의 분투 과정입니다."
      },
      {
        "text": "I won't let anyone undermine your authority.",
        "chunks": ["I won't let anyone", "undermine your authority."],
        "translation": "그 누구도 당신의 경영 권위를 흔들지 못하게 하겠습니다."
      },
      {
        "text": "Success brings complications that no one anticipates.",
        "chunks": ["Success brings complications", "that no one anticipates."],
        "translation": "성공 뒤에는 그 누구도 사전에 예상치 못한 복잡한 문제들이 찾아옵니다."
      },
      {
        "text": "I don't want anyone running my dream.",
        "chunks": ["I don't want anyone", "running my life's dream."],
        "translation": "내 일생의 소중한 꿈을 낯선 사람에게 넘겨주고 싶지 않아요."
      },
      {
        "text": "How did men go from gentlemen to this?",
        "chunks": ["How did men go", "from gentlemen to this?"],
        "translation": "어쩌다 한 세대 만에 남성들이 품격 있는 신사에서 이렇게 변해버린 걸까요?"
      },
      {
        "text": "A mature perspective is something only time provides.",
        "chunks": ["A mature perspective", "is something only time provides."],
        "translation": "성숙한 안목은 오직 오랜 세월의 파도를 거쳐야만 얻어지는 것입니다."
      },
      {
        "text": "True leadership requires both strength and humility.",
        "chunks": ["True leadership requires", "both strength and humility."],
        "translation": "진정한 리더십이란 결단력과 구성원을 향한 겸손함을 동시에 지녀야 합니다."
      }
    ],
    "3": [
      {
        "text": "A seasoned CEO might optimize, but nobody can replace your passion.",
        "chunks": ["A seasoned CEO might optimize,", "yet nobody can replace", "your creative passion."],
        "translation": "전문경영인이 수치상의 경영 효율은 높일지 몰라도, 당신의 창의적인 열정은 결코 대체할 수 없습니다."
