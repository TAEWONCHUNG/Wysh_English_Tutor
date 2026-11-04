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

// 영화 [인턴 (The Intern, 2015)] 실전 명대사 원문 데이터베이스 (2~4단어 호흡 청크)
const CHUNK_DATABASE = {
  "A2": {
    "2": [
      {
        "text": "Real experience never gets old.",
        "chunks": [
          "Real experience",
          "never gets old."
        ],
        "translation": "진정한 경험은 결코 늙지 않습니다."
      },
      {
        "text": "I still have music in me.",
        "chunks": [
          "I still have",
          "music in me."
        ],
        "translation": "내 안엔 아직 음악(열정)이 남아있어요."
      },
      {
        "text": "I want connection, and the excitement.",
        "chunks": [
          "I want connection,",
          "and the excitement."
        ],
        "translation": "사람들과의 소통과 두근거림을 원해요."
      },
      {
        "text": "You're never wrong to do what's right.",
        "chunks": [
          "You're never wrong",
          "to do what's right."
        ],
        "translation": "옳은 일을 행함에 있어 결코 틀린 법은 없습니다."
      },
      {
        "text": "I just want to be useful.",
        "chunks": [
          "I just want",
          "to be useful."
        ],
        "translation": "전 그저 회사에 보탬이 되고 싶을 뿐입니다."
      },
      {
        "text": "I like that you're into it.",
        "chunks": [
          "I like that",
          "you're into it."
        ],
        "translation": "당신이 일에 푹 빠져있는 모습이 보기 좋습니다."
      },
      {
        "text": "You should be proud of what you built.",
        "chunks": [
          "You should be proud",
          "of what you built."
        ],
        "translation": "스스로 일군 것에 대해 자부심을 가지셔야 해요."
      },
      {
        "text": "I am Ben Whittaker, your new intern.",
        "chunks": [
          "I am Ben Whittaker,",
          "your new intern."
        ],
        "translation": "저는 벤 휘태커, 당신의 새 시니어 인턴입니다."
      },
      {
        "text": "The right key is in your pocket.",
        "chunks": [
          "The right key",
          "is in your pocket."
        ],
        "translation": "해결의 열쇠는 이미 당신 주머니에 있습니다."
      },
      {
        "text": "Good old times never felt better.",
        "chunks": [
          "Good old times",
          "never felt better."
        ],
        "translation": "옛 좋은 시절도 이보다 더 좋을 순 없었죠."
      },
      {
        "text": "I'm not trying to be a burden.",
        "chunks": [
          "I'm not trying",
          "to be a burden."
        ],
        "translation": "당신에게 부담을 드리려는 게 결코 아닙니다."
      },
      {
        "text": "Can I get you some coffee?",
        "chunks": [
          "Can I get",
          "you some coffee?"
        ],
        "translation": "따뜻한 커피 한 잔 가져다드릴까요?"
      },
      {
        "text": "You look great today, Jules.",
        "chunks": [
          "You look great",
          "today, Jules."
        ],
        "translation": "줄스, 오늘 정말 멋지고 근사해 보여요."
      },
      {
        "text": "I have an appointment at seven o'clock.",
        "chunks": [
          "I have an appointment",
          "at seven o'clock."
        ],
        "translation": "저는 7시에 잡힌 미팅 약속이 있습니다."
      },
      {
        "text": "I can drive you wherever you need.",
        "chunks": [
          "I can drive you",
          "wherever you need."
        ],
        "translation": "필요하신 곳 어디든 안전하게 모셔다드릴 수 있어요."
      },
      {
        "text": "Please let me know if you need help.",
        "chunks": [
          "Please let me know",
          "if you need help."
        ],
        "translation": "도움이 필요하시면 언제든 제게 말씀해 주세요."
      },
      {
        "text": "I am ready to begin now.",
        "chunks": [
          "I am ready",
          "to begin now."
        ],
        "translation": "저는 지금 바로 시작할 준비가 다 되었습니다."
      },
      {
        "text": "It's so nice meeting you, Jules.",
        "chunks": [
          "It's so nice",
          "meeting you, Jules."
        ],
        "translation": "줄스, 당신을 알게 되어 진심으로 기쁩니다."
      },
      {
        "text": "We can talk about this after lunch.",
        "chunks": [
          "We can talk about",
          "this after lunch."
        ],
        "translation": "이 이야기는 점심을 먹고 난 뒤에 나누죠."
      },
      {
        "text": "I will take care of that right away.",
        "chunks": [
          "I will take care",
          "of that right away."
        ],
        "translation": "그 일은 제가 지금 즉시 깔끔하게 처리하겠습니다."
      }
    ],
    "3": [
      {
        "text": "There's a hole in my life, I must fill.",
        "chunks": [
          "There's a hole",
          "in my life,",
          "I must fill."
        ],
        "translation": "내 삶에 큰 구멍이 생겼고, 이제는 그걸 채워야만 해요."
      },
      {
        "text": "Love and work, work and love. That's all there is.",
        "chunks": [
          "Love and work,",
          "work and love.",
          "That's all there is."
        ],
        "translation": "사랑과 일, 일과 사랑. 프로이트의 말처럼 인생엔 그게 전부예요."
      },
      {
        "text": "I am ready to learn anything you can teach.",
        "chunks": [
          "I am ready",
          "to learn anything",
          "you can teach."
        ],
        "translation": "당신이 제게 가르쳐 주시는 무엇이든 기쁘게 배울 준비가 되어 있습니다."
      },
      {
        "text": "It's quite amazing what we can do in one year.",
        "chunks": [
          "It's quite amazing",
          "what we can do",
          "in one year."
        ],
        "translation": "불과 1년 만에 우리가 해낸 일들을 보면 참으로 놀랍습니다."
      },
      {
        "text": "I just want to make your day a little easier.",
        "chunks": [
          "I just want",
          "to make your day",
          "a little easier."
        ],
        "translation": "그저 당신의 힘든 하루가 조금이나마 수월해지길 바랄 뿐입니다."
      },
      {
        "text": "You did a job with this presentation earlier this afternoon.",
        "chunks": [
          "You did a job",
          "with this presentation",
          "earlier this afternoon."
        ],
        "translation": "오늘 오후에 진행한 프레젠테이션, 정말 훌륭하게 잘 끝마쳤어요."
      },
      {
        "text": "I'll be right here whenever you need a ride home.",
        "chunks": [
          "I'll be right here",
          "whenever you need",
          "a ride home."
        ],
        "translation": "퇴근길 차편이 필요하실 땐 언제든 제가 곁에서 대기하고 있을게요."
      },
      {
        "text": "We have busy days ahead of us at the office.",
        "chunks": [
          "We have busy days",
          "ahead of us",
          "at the office."
        ],
        "translation": "사무실에 우리를 기다리는 매우 바쁜 일과들이 놓여 있군요."
      },
      {
        "text": "Let's take walks around the block to clear our heads.",
        "chunks": [
          "Let's take walks",
          "around the block",
          "to clear our heads."
        ],
        "translation": "복잡한 머리를 식히기 위해 동네 주변을 가볍게 한 바퀴 걷고 오죠."
      },
      {
        "text": "I am very happy to be part of this company.",
        "chunks": [
          "I am very happy",
          "to be part",
          "of this company."
        ],
        "translation": "이 역동적이고 훌륭한 회사의 일원이 되어 진심으로 행복합니다."
      },
      {
        "text": "She worked late to make sure that everything was ready.",
        "chunks": [
          "She worked late",
          "to make sure that",
          "everything was ready."
        ],
        "translation": "그녀는 모든 준비가 완벽하도록 늦은 밤까지 쉬지 않고 일했습니다."
      },
      {
        "text": "You have great people working around you every single day.",
        "chunks": [
          "You have great people",
          "working around you",
          "every single day."
        ],
        "translation": "매일 당신 곁에서 함께 달려주는 든든하고 멋진 동료들이 있잖아요."
      }
    ]
  },
  "B1": {
    "2": [
      {
        "text": "Nobody knows this business better than you do.",
        "chunks": [
          "Nobody knows this business",
          "better than you do."
        ],
        "translation": "이 사업에 대해선 그 누구도 당신보다 더 잘 알지 못합니다."
      },
      {
        "text": "Are we really still critical of working moms?",
        "chunks": [
          "Are we really still",
          "critical of working moms?"
        ],
        "translation": "지금 이 시대에도 우리는 여전히 일하는 엄마들에게 인색한가요?"
      },
      {
        "text": "I need someone who understands my vision.",
        "chunks": [
          "I need someone",
          "who understands my vision."
        ],
        "translation": "제 사업 비전과 철학을 온전히 공감해 줄 수 있는 사람이 필요해요."
      },
      {
        "text": "I appreciate your honesty more than you know.",
        "chunks": [
          "I appreciate your honesty",
          "more than you know."
        ],
        "translation": "당신의 솔직한 조언에 얼마나 감사하고 있는지 모를 겁니다."
      },
      {
        "text": "We built this company on trust and passion.",
        "chunks": [
          "We built this company",
          "on trust and passion."
        ],
        "translation": "우리는 오직 끈끈한 신뢰와 뜨거운 열정 하나로 이 회사를 세웠습니다."
      },
      {
        "text": "I cannot imagine this office without you.",
        "chunks": [
          "I cannot imagine",
          "this office without you."
        ],
        "translation": "이제는 당신이 곁에 없는 이 사무실을 상상조차 할 수 없어요."
      },
      {
        "text": "Sometimes you must pause to see things clearly.",
        "chunks": [
          "Sometimes you must pause",
          "to see things clearly."
        ],
        "translation": "상황을 냉철하고 똑바로 보려면 때로는 잠시 멈춰 서야 합니다."
      },
      {
        "text": "It takes real courage to admit needing help.",
        "chunks": [
          "It takes real courage",
          "to admit needing help."
        ],
        "translation": "누군가의 도움이 절실하다고 인정하는 데는 진정한 용기가 필요해요."
      },
      {
        "text": "We grew much faster than anyone had predicted.",
        "chunks": [
          "We grew much faster",
          "than anyone had predicted."
        ],
        "translation": "우리 회사는 당초 그 누구의 예상치보다 훨씬 가파르게 성장했습니다."
      },
      {
        "text": "Every single detail matters in our daily business.",
        "chunks": [
          "Every single detail matters",
          "in our daily business."
        ],
        "translation": "우리가 하는 비즈니스에서는 고객을 위한 아주 작은 디테일 하나도 소중합니다."
      },
      {
        "text": "I'm trying to protect what we created here.",
        "chunks": [
          "I'm trying to protect",
          "what we created here."
        ],
        "translation": "우리가 피땀 흘려 여기서 일궈낸 소중한 가치를 지켜내고 싶습니다."
      },
      {
        "text": "True real experience is something you can't fake.",
        "chunks": [
          "True real experience is",
          "something you can't fake."
        ],
        "translation": "오랜 세월 축적된 진정한 경험은 결코 흉내 내거나 속일 수 없죠."
      },
      {
        "text": "I truly want you completely happy here.",
        "chunks": [
          "I truly want you",
          "completely happy here."
        ],
        "translation": "저는 당신이 이 일터에서 온전히 행복하고 편안했으면 좋겠어요."
      },
      {
        "text": "She works tirelessly to satisfy each customer.",
        "chunks": [
          "She works tirelessly",
          "to satisfy each customer."
        ],
        "translation": "그녀는 단 한 명의 고객도 실망시키지 않기 위해 불철주야 노력합니다."
      },
      {
        "text": "You handled that crisis with remarkable grace.",
        "chunks": [
          "You handled that crisis",
          "with remarkable grace."
        ],
        "translation": "당신은 그 긴박했던 위기 상황을 놀라울 정도로 유연하고 품위 있게 대처했습니다."
      }
    ],
    "3": [
      {
        "text": "There is something here that makes me feel calm and grounded.",
        "chunks": [
          "There is something here",
          "that makes me feel",
          "calm and grounded."
        ],
        "translation": "당신과 함께 있으면 사람을 흔들리지 않고 편안하게 만들어주는 힘이 있어요."
      },
      {
        "text": "You started from nothing, and you made it a massive success.",
        "chunks": [
          "You started from nothing,",
          "and you made it",
          "a massive success."
        ],
        "translation": "당신은 아무것도 없는 바닥에서 시작해 마침내 엄청난 성공을 일궈냈어요."
      },
      {
        "text": "I spent forty years working in manufacturing before coming here.",
        "chunks": [
          "I spent forty years",
          "working in manufacturing",
          "before coming here."
        ],
        "translation": "저는 이곳에 합류하기 전 40년이라는 긴 세월 동안 제조 현장에서 일했습니다."
      },
      {
        "text": "It is very hard to trust a stranger with your company.",
        "chunks": [
          "It is very hard",
          "to trust a stranger",
          "with your company."
        ],
        "translation": "자신이 모든 걸 바쳐 키운 회사를 낯선 외부인에게 온전히 맡기기는 참 어렵죠."
      },
      {
        "text": "Don't apologize to anyone for being such a truly successful CEO.",
        "chunks": [
          "Don't apologize to anyone",
          "for being such a",
          "truly successful CEO."
        ],
        "translation": "스스로의 힘으로 성공한 뛰어난 여성 CEO라는 점에 대해 그 누구에게도 사과하지 마세요."
      },
      {
        "text": "I want someone seasoned who can guide growth in this market.",
        "chunks": [
          "I want someone seasoned",
          "who can guide growth",
          "in this market."
        ],
        "translation": "치열한 시장 환경 속에서 우리 조직의 질적 성장을 든든하게 이끌어줄 노련한 인물이 필요합니다."
      },
      {
        "text": "We need to remember why we started brands in the first place.",
        "chunks": [
          "We need to remember",
          "why we started brands",
          "in the first place."
        ],
        "translation": "우리가 애초에 이 브랜드를 왜 세상에 선보이게 되었는지 그 순수한 초심을 잊지 말아야 해요."
      },
      {
        "text": "A classic clean handkerchief is meant for lending to weeping friends.",
        "chunks": [
          "A classic clean handkerchief",
          "is meant for lending",
          "to weeping friends."
        ],
        "translation": "신사의 깨끗한 손수건은 곁에서 눈물 흘리는 소중한 이에게 건네주기 위해 존재하는 것입니다."
      },
      {
        "text": "You have built empires, and should feel thrilled with your achievement.",
        "chunks": [
          "You have built empires,",
          "and should feel thrilled",
          "with your achievement."
        ],
        "translation": "당신은 이미 거대한 상업 제국을 세웠고, 그 위대한 성과에 온전히 환호할 자격이 있습니다."
      },
      {
        "text": "I learned so much from watching your dedication throughout this month.",
        "chunks": [
          "I learned so much",
          "from watching your dedication",
          "throughout this month."
        ],
        "translation": "지난 한 달간 지켜본 당신의 헌신과 열정적인 태도로부터 저 역시 수많은 것을 배웠습니다."
      },
      {
        "text": "Do not let investors dictate how to govern your beloved firm.",
        "chunks": [
          "Do not let investors",
          "dictate how to govern",
          "your beloved firm."
        ],
        "translation": "외부 투자자들의 압박에 휘둘려 당신이 아끼는 회사의 경영 주도권을 넘겨주지 마세요."
      },
      {
        "text": "You have rare talent and the relentless drive to lead this company.",
        "chunks": [
          "You have rare talent",
          "and the relentless drive",
          "to lead this company."
        ],
        "translation": "당신에겐 이 수많은 직원과 회사를 이끌어갈 독보적인 천부적 재능과 추진력이 있습니다."
      }
    ]
  },
  "B2": {
    "2": [
      {
        "text": "Running this fast startup demands relentless personal dedication.",
        "chunks": [
          "Running this fast startup",
          "demands relentless personal dedication."
        ],
        "translation": "이처럼 급성장하는 스타트업을 이끄는 것은 밤낮없는 극한의 개인적 헌신을 요구합니다."
      },
      {
        "text": "Retirement is an effort in ongoing creativity.",
        "chunks": [
          "Retirement is an effort",
          "in ongoing creativity."
        ],
        "translation": "은퇴 이후의 삶이란 끊임없이 일상을 새롭게 채워가는 창의성의 분투 과정입니다."
      },
      {
        "text": "I won't let anyone undermine your authority here.",
        "chunks": [
          "I won't let anyone",
          "undermine your authority here."
        ],
        "translation": "그 누구도 당신이 피땀 흘려 세운 이 회사에서 당신의 권위를 흔들지 못하게 하겠습니다."
      },
      {
        "text": "Success brings complications that no one anticipates.",
        "chunks": [
          "Success brings complications",
          "that no one anticipates."
        ],
        "translation": "성공이라는 영광 뒤에는 그 누구도 사전에 예상치 못한 혹독한 복잡성이 찾아오는 법입니다."
      },
      {
        "text": "I don't want anyone running my life's dream.",
        "chunks": [
          "I don't want anyone",
          "running my life's dream."
        ],
        "translation": "내 일생의 소중한 꿈과 결실을 얼굴도 모르는 낯선 전문경영인에게 빼앗기고 싶지 않아요."
      },
      {
        "text": "How did men go from gentlemen to this?",
        "chunks": [
          "How did men go",
          "from gentlemen to this?"
        ],
        "translation": "어쩌다 한 세대 만에 남성들이 품격 있는 신사에서 이런 무기력한 모습으로 변해버린 걸까요?"
      },
      {
        "text": "You built something extraordinary entirely from scratch.",
        "chunks": [
          "You built something extraordinary",
          "entirely from scratch."
        ],
        "translation": "당신은 맨땅에서 홀로 출발해 믿을 수 없을 만큼 경이로운 사업적 금자탑을 쌓아 올렸습니다."
      },
      {
        "text": "Broad mature perspective is something only time provides.",
        "chunks": [
          "Broad mature perspective is",
          "something only time provides."
        ],
        "translation": "인생을 멀리 내다보는 깊고 성숙한 안목은 오직 오랜 세월의 파도를 거쳐야만 얻어지는 것입니다."
      },
      {
        "text": "We must confront these operational hurdles objectively.",
        "chunks": [
          "We must confront",
          "these operational hurdles objectively."
        ],
        "translation": "우리는 감정에 치우치지 않고 현재 직면한 운영상의 심각한 병목 문제를 객관적으로 직시해야 합니다."
      },
      {
        "text": "True authentic leadership requires both strength and humility.",
        "chunks": [
          "True authentic leadership requires",
          "both strength and humility."
        ],
        "translation": "진정한 리더십이란 흔들리지 않는 단호한 결단력과 구성원을 향한 겸허함을 동시에 지녀야 합니다."
      },
      {
        "text": "I won't step aside from what belongs here.",
        "chunks": [
          "I won't step aside",
          "from what belongs here."
        ],
        "translation": "온전히 내 땀과 영혼이 서려 있는 이 자리에서 힘없이 뒤로 물러서지 않겠습니다."
      },
      {
        "text": "Navigating rapid corporate expansion tests your deepest values.",
        "chunks": [
          "Navigating rapid corporate expansion",
          "tests your deepest values."
        ],
        "translation": "감당하기 힘들 만큼 빠른 기업 확장을 조율하는 과정은 인간으로서 가장 근원적인 가치관을 시험합니다."
      }
    ],
    "3": [
      {
        "text": "Seasoned CEOs might optimize, yet nobody can replace your creative soul.",
        "chunks": [
          "Seasoned CEOs might optimize,",
          "yet nobody can replace",
          "your creative soul."
        ],
        "translation": "노련한 전문경영인이 수치상의 경영 효율은 높일 수 있을지 몰라도, 당신만의 창의적인 영혼은 결코 대체할 수 없습니다."
      },
      {
        "text": "You should never surrender creative control over what you built yourself.",
        "chunks": [
          "You should never surrender",
          "creative control over",
          "what you built yourself."
        ],
        "translation": "스스로의 피와 땀으로 바닥부터 일궈낸 독창적인 사업에 대한 주도적 지휘권을 남에게 넘겨주지 마세요."
      },
      {
        "text": "I watched corporate leaders struggle through rapid transitions for four decades.",
        "chunks": [
          "I watched corporate leaders",
          "struggle through rapid transitions",
          "for four decades."
        ],
        "translation": "저는 지난 40여 년간 유수의 기업 리더들이 격변하는 환경 속에서 길을 찾고 생존을 다투는 모습을 가까이서 지켜봤습니다."
      },
      {
        "text": "Bringing in outside executives might compromise founding cultures that made us unique.",
        "chunks": [
          "Bringing in outside executives",
          "might compromise founding cultures",
          "that made us unique."
        ],
        "translation": "외부 경영진을 섣불리 영입하는 것은 우리를 독보적인 브랜드로 만들었던 고유한 창업가 정신을 훼손할 위험이 큽니다."
      },
      {
        "text": "You need no chaperone dictating how to govern this extraordinary company.",
        "chunks": [
          "You need no chaperone",
          "dictating how to govern",
          "this extraordinary company."
        ],
        "translation": "이 비범한 회사를 어떻게 경영해야 하는지 당신에게 훈수를 두고 감시할 후견인은 전혀 필요 없습니다."
      },
      {
        "text": "I'm profoundly inspired by your relentless work and sharp vision.",
        "chunks": [
          "I'm profoundly inspired",
          "by your relentless work",
          "and sharp vision."
        ],
        "translation": "지칠 줄 모르는 당신의 뜨거운 근면함과 시대를 앞서가는 예리한 통찰력에 깊은 영감과 감동을 받았습니다."
      },
      {
        "text": "Never let fear dictate monumental business decisions shaping your future.",
        "chunks": [
          "Never let fear dictate",
          "monumental business decisions",
          "shaping your future."
        ],
        "translation": "당신의 인생과 기업의 앞날을 바꿀 중차대한 경영상의 결정을 두려움이나 불안에 떠밀려 내리지 마세요."
      },
      {
        "text": "Experience gives you calm to weather sudden storms under immense pressure.",
        "chunks": [
          "Experience gives you calm",
          "to weather sudden storms",
          "under immense pressure."
        ],
        "translation": "진정한 연륜은 극한의 압박감이 짓누르는 순간에도 거센 폭풍우를 의연하게 헤쳐 나갈 수 있는 평정심을 선물합니다."
      },
      {
        "text": "You poured your soul into every single detail of this platform.",
        "chunks": [
          "You poured your soul",
          "into every single detail",
          "of this platform."
        ],
        "translation": "당신은 이 상거래 플랫폼에 입점한 상품과 포장 박스 하나하나에 이르기까지 자신의 모든 영혼을 쏟아부었습니다."
      },
      {
        "text": "Balancing dedicated family life with demanding corporate ambitions is extraordinarily challenging.",
        "chunks": [
          "Balancing dedicated family life",
          "with demanding corporate ambitions",
          "is extraordinarily challenging."
        ],
        "translation": "사랑하는 가정을 지켜내는 일과 끝없는 성장을 요구받는 기업가적 야망 사이에서 균형을 잡기란 대단히 어려운 고투입니다."
      },
      {
        "text": "A true gentleman carries a clean pressed handkerchief for vulnerable moments.",
        "chunks": [
          "A true gentleman carries",
          "a clean pressed handkerchief",
          "for vulnerable moments."
        ],
        "translation": "품격 있는 진정한 신사는 타인이 마주한 슬픔과 눈물의 연약한 순간을 보듬어주기 위해 항상 정갈한 손수건을 지닙니다."
      },
      {
        "text": "Never apologize to anyone for being passionate leaders commanding the summit.",
        "chunks": [
          "Never apologize to anyone",
          "for being passionate leaders",
          "commanding the summit."
        ],
        "translation": "자신이 일군 최고의 정상에서 당당하고 열정적으로 회사를 지휘하는 여성 리더라는 사실에 대해 결코 위축되지 마세요."
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
      return { isPerfect: true, message: "🎉 훌륭합니다! (A2 초급: 핵심 표현이 정확하여 통과되었습니다.)", markedSpoken };
    }
  }

  // B1 (중급): 핵심 단어 위주로 평가 (단어 1~2개 누락/치환 허용 또는 정확도 65% 이상)
  if (level === 'B1') {
    if (missingWords.length + substituted.length <= 1 || accuracyRatio >= 0.65) {
      return { isPerfect: true, message: "🎉 잘하셨습니다! (B1 중급: 대사의 의미가 명확하게 전달되었습니다.)", markedSpoken };
    }
  }

  const strictNotice = level === 'B2' ? ' (B2 모드: 정밀 발음)' : '';

  // B2 (고급): 깐깐함 대폭 완화! 핵심 단어 70% 이상 일치하거나 1단어 오류 시 통과 처리
  if (level === 'B2') {
    if (missingWords.length + substituted.length <= 1 || accuracyRatio >= 0.70) {
      return { isPerfect: true, message: "🎉 멋집니다! (B2 고급: 핵심 대사의 호흡과 발음이 자연스럽게 통과되었습니다.)", markedSpoken };
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
              <h1 className="font-bold text-sm text-white tracking-tight">The Intern Shadowing</h1>
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
                영화 [인턴] 대사 원문
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
                    markedSpoken ? (
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
