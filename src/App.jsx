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
  Timer
} from 'lucide-react';

const DIFFICULTY_LEVELS = [
  { id: 'A2', label: 'A2 초급', desc: '기초 일상 회화' },
  { id: 'B1', label: 'B1 중급', desc: '실용 직장·회의' },
  { id: 'B2', label: 'B2 중상급', desc: '비즈니스·협상' },
  { id: 'C1', label: 'C1 고급', desc: '전문 분석·경영' }
];

const CHUNK_DATABASE = {
  "A2": {
    "2": [
      {
        "text": "I usually drink warm morning coffee.",
        "chunks": [
          "I usually drink",
          "warm morning coffee."
        ],
        "translation": "저는 보통 마십니다 따뜻한 아침 커피를."
      },
      {
        "text": "I usually drink fresh green tea.",
        "chunks": [
          "I usually drink",
          "fresh green tea."
        ],
        "translation": "저는 보통 마십니다 신선한 녹차를."
      },
      {
        "text": "I usually drink hot herbal tea.",
        "chunks": [
          "I usually drink",
          "hot herbal tea."
        ],
        "translation": "저는 보통 마십니다 따뜻한 허브티를."
      },
      {
        "text": "I usually drink pure mineral water.",
        "chunks": [
          "I usually drink",
          "pure mineral water."
        ],
        "translation": "저는 보통 마십니다 맑은 생수를."
      },
      {
        "text": "I usually drink sweet iced tea.",
        "chunks": [
          "I usually drink",
          "sweet iced tea."
        ],
        "translation": "저는 보통 마십니다 달콤한 아이스티를."
      },
      {
        "text": "I usually drink the project email.",
        "chunks": [
          "I usually drink",
          "the project email."
        ],
        "translation": "저는 보통 마십니다 프로젝트 이메일을."
      },
      {
        "text": "I usually drink the invoice document.",
        "chunks": [
          "I usually drink",
          "the invoice document."
        ],
        "translation": "저는 보통 마십니다 청구서 서류를."
      },
      {
        "text": "I usually drink the daily report.",
        "chunks": [
          "I usually drink",
          "the daily report."
        ],
        "translation": "저는 보통 마십니다 일일 보고서를."
      },
      {
        "text": "I usually drink these presentation slides.",
        "chunks": [
          "I usually drink",
          "these presentation slides."
        ],
        "translation": "저는 보통 마십니다 이 발표 슬라이드를."
      },
      {
        "text": "I usually drink the meeting schedule.",
        "chunks": [
          "I usually drink",
          "the meeting schedule."
        ],
        "translation": "저는 보통 마십니다 회의 일정을."
      },
      {
        "text": "She always enjoys warm morning coffee.",
        "chunks": [
          "She always enjoys",
          "warm morning coffee."
        ],
        "translation": "그녀는 항상 즐깁니다 따뜻한 아침 커피를."
      },
      {
        "text": "She always enjoys fresh green tea.",
        "chunks": [
          "She always enjoys",
          "fresh green tea."
        ],
        "translation": "그녀는 항상 즐깁니다 신선한 녹차를."
      },
      {
        "text": "She always enjoys hot herbal tea.",
        "chunks": [
          "She always enjoys",
          "hot herbal tea."
        ],
        "translation": "그녀는 항상 즐깁니다 따뜻한 허브티를."
      },
      {
        "text": "She always enjoys pure mineral water.",
        "chunks": [
          "She always enjoys",
          "pure mineral water."
        ],
        "translation": "그녀는 항상 즐깁니다 맑은 생수를."
      },
      {
        "text": "She always enjoys sweet iced tea.",
        "chunks": [
          "She always enjoys",
          "sweet iced tea."
        ],
        "translation": "그녀는 항상 즐깁니다 달콤한 아이스티를."
      },
      {
        "text": "She always enjoys the project email.",
        "chunks": [
          "She always enjoys",
          "the project email."
        ],
        "translation": "그녀는 항상 즐깁니다 프로젝트 이메일을."
      },
      {
        "text": "She always enjoys the invoice document.",
        "chunks": [
          "She always enjoys",
          "the invoice document."
        ],
        "translation": "그녀는 항상 즐깁니다 청구서 서류를."
      },
      {
        "text": "She always enjoys the daily report.",
        "chunks": [
          "She always enjoys",
          "the daily report."
        ],
        "translation": "그녀는 항상 즐깁니다 일일 보고서를."
      },
      {
        "text": "She always enjoys these presentation slides.",
        "chunks": [
          "She always enjoys",
          "these presentation slides."
        ],
        "translation": "그녀는 항상 즐깁니다 이 발표 슬라이드를."
      },
      {
        "text": "She always enjoys the meeting schedule.",
        "chunks": [
          "She always enjoys",
          "the meeting schedule."
        ],
        "translation": "그녀는 항상 즐깁니다 회의 일정을."
      },
      {
        "text": "He likes drinking warm morning coffee.",
        "chunks": [
          "He likes drinking",
          "warm morning coffee."
        ],
        "translation": "그는 마시는 것을 좋아합니다 따뜻한 아침 커피를."
      },
      {
        "text": "He likes drinking fresh green tea.",
        "chunks": [
          "He likes drinking",
          "fresh green tea."
        ],
        "translation": "그는 마시는 것을 좋아합니다 신선한 녹차를."
      },
      {
        "text": "He likes drinking hot herbal tea.",
        "chunks": [
          "He likes drinking",
          "hot herbal tea."
        ],
        "translation": "그는 마시는 것을 좋아합니다 따뜻한 허브티를."
      },
      {
        "text": "He likes drinking pure mineral water.",
        "chunks": [
          "He likes drinking",
          "pure mineral water."
        ],
        "translation": "그는 마시는 것을 좋아합니다 맑은 생수를."
      },
      {
        "text": "He likes drinking sweet iced tea.",
        "chunks": [
          "He likes drinking",
          "sweet iced tea."
        ],
        "translation": "그는 마시는 것을 좋아합니다 달콤한 아이스티를."
      },
      {
        "text": "He likes drinking the project email.",
        "chunks": [
          "He likes drinking",
          "the project email."
        ],
        "translation": "그는 마시는 것을 좋아합니다 프로젝트 이메일을."
      },
      {
        "text": "He likes drinking the invoice document.",
        "chunks": [
          "He likes drinking",
          "the invoice document."
        ],
        "translation": "그는 마시는 것을 좋아합니다 청구서 서류를."
      },
      {
        "text": "He likes drinking the daily report.",
        "chunks": [
          "He likes drinking",
          "the daily report."
        ],
        "translation": "그는 마시는 것을 좋아합니다 일일 보고서를."
      },
      {
        "text": "He likes drinking these presentation slides.",
        "chunks": [
          "He likes drinking",
          "these presentation slides."
        ],
        "translation": "그는 마시는 것을 좋아합니다 이 발표 슬라이드를."
      },
      {
        "text": "He likes drinking the meeting schedule.",
        "chunks": [
          "He likes drinking",
          "the meeting schedule."
        ],
        "translation": "그는 마시는 것을 좋아합니다 회의 일정을."
      },
      {
        "text": "We often have warm morning coffee.",
        "chunks": [
          "We often have",
          "warm morning coffee."
        ],
        "translation": "우리는 자주 마십니다 따뜻한 아침 커피를."
      },
      {
        "text": "We often have fresh green tea.",
        "chunks": [
          "We often have",
          "fresh green tea."
        ],
        "translation": "우리는 자주 마십니다 신선한 녹차를."
      },
      {
        "text": "We often have hot herbal tea.",
        "chunks": [
          "We often have",
          "hot herbal tea."
        ],
        "translation": "우리는 자주 마십니다 따뜻한 허브티를."
      },
      {
        "text": "We often have pure mineral water.",
        "chunks": [
          "We often have",
          "pure mineral water."
        ],
        "translation": "우리는 자주 마십니다 맑은 생수를."
      },
      {
        "text": "We often have sweet iced tea.",
        "chunks": [
          "We often have",
          "sweet iced tea."
        ],
        "translation": "우리는 자주 마십니다 달콤한 아이스티를."
      },
      {
        "text": "We often have the project email.",
        "chunks": [
          "We often have",
          "the project email."
        ],
        "translation": "우리는 자주 마십니다 프로젝트 이메일을."
      },
      {
        "text": "We often have the invoice document.",
        "chunks": [
          "We often have",
          "the invoice document."
        ],
        "translation": "우리는 자주 마십니다 청구서 서류를."
      },
      {
        "text": "We often have the daily report.",
        "chunks": [
          "We often have",
          "the daily report."
        ],
        "translation": "우리는 자주 마십니다 일일 보고서를."
      },
      {
        "text": "We often have these presentation slides.",
        "chunks": [
          "We often have",
          "these presentation slides."
        ],
        "translation": "우리는 자주 마십니다 이 발표 슬라이드를."
      },
      {
        "text": "We often have the meeting schedule.",
        "chunks": [
          "We often have",
          "the meeting schedule."
        ],
        "translation": "우리는 자주 마십니다 회의 일정을."
      },
      {
        "text": "They prefer drinking warm morning coffee.",
        "chunks": [
          "They prefer drinking",
          "warm morning coffee."
        ],
        "translation": "그들은 마시는 것을 선호합니다 따뜻한 아침 커피를."
      },
      {
        "text": "They prefer drinking fresh green tea.",
        "chunks": [
          "They prefer drinking",
          "fresh green tea."
        ],
        "translation": "그들은 마시는 것을 선호합니다 신선한 녹차를."
      },
      {
        "text": "They prefer drinking hot herbal tea.",
        "chunks": [
          "They prefer drinking",
          "hot herbal tea."
        ],
        "translation": "그들은 마시는 것을 선호합니다 따뜻한 허브티를."
      },
      {
        "text": "They prefer drinking pure mineral water.",
        "chunks": [
          "They prefer drinking",
          "pure mineral water."
        ],
        "translation": "그들은 마시는 것을 선호합니다 맑은 생수를."
      },
      {
        "text": "They prefer drinking sweet iced tea.",
        "chunks": [
          "They prefer drinking",
          "sweet iced tea."
        ],
        "translation": "그들은 마시는 것을 선호합니다 달콤한 아이스티를."
      },
      {
        "text": "They prefer drinking the project email.",
        "chunks": [
          "They prefer drinking",
          "the project email."
        ],
        "translation": "그들은 마시는 것을 선호합니다 프로젝트 이메일을."
      },
      {
        "text": "They prefer drinking the invoice document.",
        "chunks": [
          "They prefer drinking",
          "the invoice document."
        ],
        "translation": "그들은 마시는 것을 선호합니다 청구서 서류를."
      },
      {
        "text": "They prefer drinking the daily report.",
        "chunks": [
          "They prefer drinking",
          "the daily report."
        ],
        "translation": "그들은 마시는 것을 선호합니다 일일 보고서를."
      },
      {
        "text": "They prefer drinking these presentation slides.",
        "chunks": [
          "They prefer drinking",
          "these presentation slides."
        ],
        "translation": "그들은 마시는 것을 선호합니다 이 발표 슬라이드를."
      },
      {
        "text": "They prefer drinking the meeting schedule.",
        "chunks": [
          "They prefer drinking",
          "the meeting schedule."
        ],
        "translation": "그들은 마시는 것을 선호합니다 회의 일정을."
      },
      {
        "text": "Please send me warm morning coffee.",
        "chunks": [
          "Please send me",
          "warm morning coffee."
        ],
        "translation": "제게 보내주세요 따뜻한 아침 커피를."
      },
      {
        "text": "Please send me fresh green tea.",
        "chunks": [
          "Please send me",
          "fresh green tea."
        ],
        "translation": "제게 보내주세요 신선한 녹차를."
      },
      {
        "text": "Please send me hot herbal tea.",
        "chunks": [
          "Please send me",
          "hot herbal tea."
        ],
        "translation": "제게 보내주세요 따뜻한 허브티를."
      },
      {
        "text": "Please send me pure mineral water.",
        "chunks": [
          "Please send me",
          "pure mineral water."
        ],
        "translation": "제게 보내주세요 맑은 생수를."
      },
      {
        "text": "Please send me sweet iced tea.",
        "chunks": [
          "Please send me",
          "sweet iced tea."
        ],
        "translation": "제게 보내주세요 달콤한 아이스티를."
      },
      {
        "text": "Please send me the project email.",
        "chunks": [
          "Please send me",
          "the project email."
        ],
        "translation": "제게 보내주세요 프로젝트 이메일을."
      },
      {
        "text": "Please send me the invoice document.",
        "chunks": [
          "Please send me",
          "the invoice document."
        ],
        "translation": "제게 보내주세요 청구서 서류를."
      },
      {
        "text": "Please send me the daily report.",
        "chunks": [
          "Please send me",
          "the daily report."
        ],
        "translation": "제게 보내주세요 일일 보고서를."
      },
      {
        "text": "Please send me these presentation slides.",
        "chunks": [
          "Please send me",
          "these presentation slides."
        ],
        "translation": "제게 보내주세요 이 발표 슬라이드를."
      },
      {
        "text": "Please send me the meeting schedule.",
        "chunks": [
          "Please send me",
          "the meeting schedule."
        ],
        "translation": "제게 보내주세요 회의 일정을."
      },
      {
        "text": "She checked her warm morning coffee.",
        "chunks": [
          "She checked her",
          "warm morning coffee."
        ],
        "translation": "그녀는 확인했습니다 따뜻한 아침 커피를."
      },
      {
        "text": "She checked her fresh green tea.",
        "chunks": [
          "She checked her",
          "fresh green tea."
        ],
        "translation": "그녀는 확인했습니다 신선한 녹차를."
      },
      {
        "text": "She checked her hot herbal tea.",
        "chunks": [
          "She checked her",
          "hot herbal tea."
        ],
        "translation": "그녀는 확인했습니다 따뜻한 허브티를."
      },
      {
        "text": "She checked her pure mineral water.",
        "chunks": [
          "She checked her",
          "pure mineral water."
        ],
        "translation": "그녀는 확인했습니다 맑은 생수를."
      },
      {
        "text": "She checked her sweet iced tea.",
        "chunks": [
          "She checked her",
          "sweet iced tea."
        ],
        "translation": "그녀는 확인했습니다 달콤한 아이스티를."
      },
      {
        "text": "She checked her the project email.",
        "chunks": [
          "She checked her",
          "the project email."
        ],
        "translation": "그녀는 확인했습니다 프로젝트 이메일을."
      },
      {
        "text": "She checked her the invoice document.",
        "chunks": [
          "She checked her",
          "the invoice document."
        ],
        "translation": "그녀는 확인했습니다 청구서 서류를."
      },
      {
        "text": "She checked her the daily report.",
        "chunks": [
          "She checked her",
          "the daily report."
        ],
        "translation": "그녀는 확인했습니다 일일 보고서를."
      },
      {
        "text": "She checked her these presentation slides.",
        "chunks": [
          "She checked her",
          "these presentation slides."
        ],
        "translation": "그녀는 확인했습니다 이 발표 슬라이드를."
      },
      {
        "text": "She checked her the meeting schedule.",
        "chunks": [
          "She checked her",
          "the meeting schedule."
        ],
        "translation": "그녀는 확인했습니다 회의 일정을."
      },
      {
        "text": "I will forward warm morning coffee.",
        "chunks": [
          "I will forward",
          "warm morning coffee."
        ],
        "translation": "제가 전달하겠습니다 따뜻한 아침 커피를."
      },
      {
        "text": "I will forward fresh green tea.",
        "chunks": [
          "I will forward",
          "fresh green tea."
        ],
        "translation": "제가 전달하겠습니다 신선한 녹차를."
      },
      {
        "text": "I will forward hot herbal tea.",
        "chunks": [
          "I will forward",
          "hot herbal tea."
        ],
        "translation": "제가 전달하겠습니다 따뜻한 허브티를."
      },
      {
        "text": "I will forward pure mineral water.",
        "chunks": [
          "I will forward",
          "pure mineral water."
        ],
        "translation": "제가 전달하겠습니다 맑은 생수를."
      },
      {
        "text": "I will forward sweet iced tea.",
        "chunks": [
          "I will forward",
          "sweet iced tea."
        ],
        "translation": "제가 전달하겠습니다 달콤한 아이스티를."
      },
      {
        "text": "I will forward the project email.",
        "chunks": [
          "I will forward",
          "the project email."
        ],
        "translation": "제가 전달하겠습니다 프로젝트 이메일을."
      },
      {
        "text": "I will forward the invoice document.",
        "chunks": [
          "I will forward",
          "the invoice document."
        ],
        "translation": "제가 전달하겠습니다 청구서 서류를."
      },
      {
        "text": "I will forward the daily report.",
        "chunks": [
          "I will forward",
          "the daily report."
        ],
        "translation": "제가 전달하겠습니다 일일 보고서를."
      },
      {
        "text": "I will forward these presentation slides.",
        "chunks": [
          "I will forward",
          "these presentation slides."
        ],
        "translation": "제가 전달하겠습니다 이 발표 슬라이드를."
      },
      {
        "text": "I will forward the meeting schedule.",
        "chunks": [
          "I will forward",
          "the meeting schedule."
        ],
        "translation": "제가 전달하겠습니다 회의 일정을."
      },
      {
        "text": "Could you print warm morning coffee.",
        "chunks": [
          "Could you print",
          "warm morning coffee."
        ],
        "translation": "인쇄해 주시겠어요 따뜻한 아침 커피를."
      },
      {
        "text": "Could you print fresh green tea.",
        "chunks": [
          "Could you print",
          "fresh green tea."
        ],
        "translation": "인쇄해 주시겠어요 신선한 녹차를."
      },
      {
        "text": "Could you print hot herbal tea.",
        "chunks": [
          "Could you print",
          "hot herbal tea."
        ],
        "translation": "인쇄해 주시겠어요 따뜻한 허브티를."
      },
      {
        "text": "Could you print pure mineral water.",
        "chunks": [
          "Could you print",
          "pure mineral water."
        ],
        "translation": "인쇄해 주시겠어요 맑은 생수를."
      },
      {
        "text": "Could you print sweet iced tea.",
        "chunks": [
          "Could you print",
          "sweet iced tea."
        ],
        "translation": "인쇄해 주시겠어요 달콤한 아이스티를."
      },
      {
        "text": "Could you print the project email.",
        "chunks": [
          "Could you print",
          "the project email."
        ],
        "translation": "인쇄해 주시겠어요 프로젝트 이메일을."
      },
      {
        "text": "Could you print the invoice document.",
        "chunks": [
          "Could you print",
          "the invoice document."
        ],
        "translation": "인쇄해 주시겠어요 청구서 서류를."
      },
      {
        "text": "Could you print the daily report.",
        "chunks": [
          "Could you print",
          "the daily report."
        ],
        "translation": "인쇄해 주시겠어요 일일 보고서를."
      },
      {
        "text": "Could you print these presentation slides.",
        "chunks": [
          "Could you print",
          "these presentation slides."
        ],
        "translation": "인쇄해 주시겠어요 이 발표 슬라이드를."
      },
      {
        "text": "Could you print the meeting schedule.",
        "chunks": [
          "Could you print",
          "the meeting schedule."
        ],
        "translation": "인쇄해 주시겠어요 회의 일정을."
      },
      {
        "text": "We must review warm morning coffee.",
        "chunks": [
          "We must review",
          "warm morning coffee."
        ],
        "translation": "우리는 검토해야 합니다 따뜻한 아침 커피를."
      },
      {
        "text": "We must review fresh green tea.",
        "chunks": [
          "We must review",
          "fresh green tea."
        ],
        "translation": "우리는 검토해야 합니다 신선한 녹차를."
      },
      {
        "text": "We must review hot herbal tea.",
        "chunks": [
          "We must review",
          "hot herbal tea."
        ],
        "translation": "우리는 검토해야 합니다 따뜻한 허브티를."
      },
      {
        "text": "We must review pure mineral water.",
        "chunks": [
          "We must review",
          "pure mineral water."
        ],
        "translation": "우리는 검토해야 합니다 맑은 생수를."
      },
      {
        "text": "We must review sweet iced tea.",
        "chunks": [
          "We must review",
          "sweet iced tea."
        ],
        "translation": "우리는 검토해야 합니다 달콤한 아이스티를."
      },
      {
        "text": "We must review the project email.",
        "chunks": [
          "We must review",
          "the project email."
        ],
        "translation": "우리는 검토해야 합니다 프로젝트 이메일을."
      },
      {
        "text": "We must review the invoice document.",
        "chunks": [
          "We must review",
          "the invoice document."
        ],
        "translation": "우리는 검토해야 합니다 청구서 서류를."
      },
      {
        "text": "We must review the daily report.",
        "chunks": [
          "We must review",
          "the daily report."
        ],
        "translation": "우리는 검토해야 합니다 일일 보고서를."
      },
      {
        "text": "We must review these presentation slides.",
        "chunks": [
          "We must review",
          "these presentation slides."
        ],
        "translation": "우리는 검토해야 합니다 이 발표 슬라이드를."
      },
      {
        "text": "We must review the meeting schedule.",
        "chunks": [
          "We must review",
          "the meeting schedule."
        ],
        "translation": "우리는 검토해야 합니다 회의 일정을."
      }
    ],
    "3": [
      {
        "text": "Our sales team prepares weekly reports every Monday morning.",
        "chunks": [
          "Our sales team",
          "prepares weekly reports",
          "every Monday morning."
        ],
        "translation": "우리 영업팀은 매주 월요일 아침에. 주간 보고서를 준비합니다"
      },
      {
        "text": "Our sales team prepares weekly reports before lunch starts.",
        "chunks": [
          "Our sales team",
          "prepares weekly reports",
          "before lunch starts."
        ],
        "translation": "우리 영업팀은 점심시간이 시작되기 전에. 주간 보고서를 준비합니다"
      },
      {
        "text": "Our sales team prepares weekly reports in the room.",
        "chunks": [
          "Our sales team",
          "prepares weekly reports",
          "in the room."
        ],
        "translation": "우리 영업팀은 회의실에서. 주간 보고서를 준비합니다"
      },
      {
        "text": "Our sales team prepares weekly reports with great care.",
        "chunks": [
          "Our sales team",
          "prepares weekly reports",
          "with great care."
        ],
        "translation": "우리 영업팀은 매우 정성스럽게. 주간 보고서를 준비합니다"
      },
      {
        "text": "Our sales team shares project schedules every Monday morning.",
        "chunks": [
          "Our sales team",
          "shares project schedules",
          "every Monday morning."
        ],
        "translation": "우리 영업팀은 매주 월요일 아침에. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "Our sales team shares project schedules before lunch starts.",
        "chunks": [
          "Our sales team",
          "shares project schedules",
          "before lunch starts."
        ],
        "translation": "우리 영업팀은 점심시간이 시작되기 전에. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "Our sales team shares project schedules in the room.",
        "chunks": [
          "Our sales team",
          "shares project schedules",
          "in the room."
        ],
        "translation": "우리 영업팀은 회의실에서. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "Our sales team shares project schedules with great care.",
        "chunks": [
          "Our sales team",
          "shares project schedules",
          "with great care."
        ],
        "translation": "우리 영업팀은 매우 정성스럽게. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "Our sales team orders office supplies every Monday morning.",
        "chunks": [
          "Our sales team",
          "orders office supplies",
          "every Monday morning."
        ],
        "translation": "우리 영업팀은 매주 월요일 아침에. 사무용품을 주문합니다"
      },
      {
        "text": "Our sales team orders office supplies before lunch starts.",
        "chunks": [
          "Our sales team",
          "orders office supplies",
          "before lunch starts."
        ],
        "translation": "우리 영업팀은 점심시간이 시작되기 전에. 사무용품을 주문합니다"
      },
      {
        "text": "Our sales team orders office supplies in the room.",
        "chunks": [
          "Our sales team",
          "orders office supplies",
          "in the room."
        ],
        "translation": "우리 영업팀은 회의실에서. 사무용품을 주문합니다"
      },
      {
        "text": "Our sales team orders office supplies with great care.",
        "chunks": [
          "Our sales team",
          "orders office supplies",
          "with great care."
        ],
        "translation": "우리 영업팀은 매우 정성스럽게. 사무용품을 주문합니다"
      },
      {
        "text": "Our sales team answers urgent questions every Monday morning.",
        "chunks": [
          "Our sales team",
          "answers urgent questions",
          "every Monday morning."
        ],
        "translation": "우리 영업팀은 매주 월요일 아침에. 긴급한 질문에 답변합니다"
      },
      {
        "text": "Our sales team answers urgent questions before lunch starts.",
        "chunks": [
          "Our sales team",
          "answers urgent questions",
          "before lunch starts."
        ],
        "translation": "우리 영업팀은 점심시간이 시작되기 전에. 긴급한 질문에 답변합니다"
      },
      {
        "text": "Our sales team answers urgent questions in the room.",
        "chunks": [
          "Our sales team",
          "answers urgent questions",
          "in the room."
        ],
        "translation": "우리 영업팀은 회의실에서. 긴급한 질문에 답변합니다"
      },
      {
        "text": "Our sales team answers urgent questions with great care.",
        "chunks": [
          "Our sales team",
          "answers urgent questions",
          "with great care."
        ],
        "translation": "우리 영업팀은 매우 정성스럽게. 긴급한 질문에 답변합니다"
      },
      {
        "text": "Our sales team organizes meeting slides every Monday morning.",
        "chunks": [
          "Our sales team",
          "organizes meeting slides",
          "every Monday morning."
        ],
        "translation": "우리 영업팀은 매주 월요일 아침에. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "Our sales team organizes meeting slides before lunch starts.",
        "chunks": [
          "Our sales team",
          "organizes meeting slides",
          "before lunch starts."
        ],
        "translation": "우리 영업팀은 점심시간이 시작되기 전에. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "Our sales team organizes meeting slides in the room.",
        "chunks": [
          "Our sales team",
          "organizes meeting slides",
          "in the room."
        ],
        "translation": "우리 영업팀은 회의실에서. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "Our sales team organizes meeting slides with great care.",
        "chunks": [
          "Our sales team",
          "organizes meeting slides",
          "with great care."
        ],
        "translation": "우리 영업팀은 매우 정성스럽게. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "The office manager prepares weekly reports every Monday morning.",
        "chunks": [
          "The office manager",
          "prepares weekly reports",
          "every Monday morning."
        ],
        "translation": "사무실 관리자는 매주 월요일 아침에. 주간 보고서를 준비합니다"
      },
      {
        "text": "The office manager prepares weekly reports before lunch starts.",
        "chunks": [
          "The office manager",
          "prepares weekly reports",
          "before lunch starts."
        ],
        "translation": "사무실 관리자는 점심시간이 시작되기 전에. 주간 보고서를 준비합니다"
      },
      {
        "text": "The office manager prepares weekly reports in the room.",
        "chunks": [
          "The office manager",
          "prepares weekly reports",
          "in the room."
        ],
        "translation": "사무실 관리자는 회의실에서. 주간 보고서를 준비합니다"
      },
      {
        "text": "The office manager prepares weekly reports with great care.",
        "chunks": [
          "The office manager",
          "prepares weekly reports",
          "with great care."
        ],
        "translation": "사무실 관리자는 매우 정성스럽게. 주간 보고서를 준비합니다"
      },
      {
        "text": "The office manager shares project schedules every Monday morning.",
        "chunks": [
          "The office manager",
          "shares project schedules",
          "every Monday morning."
        ],
        "translation": "사무실 관리자는 매주 월요일 아침에. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "The office manager shares project schedules before lunch starts.",
        "chunks": [
          "The office manager",
          "shares project schedules",
          "before lunch starts."
        ],
        "translation": "사무실 관리자는 점심시간이 시작되기 전에. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "The office manager shares project schedules in the room.",
        "chunks": [
          "The office manager",
          "shares project schedules",
          "in the room."
        ],
        "translation": "사무실 관리자는 회의실에서. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "The office manager shares project schedules with great care.",
        "chunks": [
          "The office manager",
          "shares project schedules",
          "with great care."
        ],
        "translation": "사무실 관리자는 매우 정성스럽게. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "The office manager orders office supplies every Monday morning.",
        "chunks": [
          "The office manager",
          "orders office supplies",
          "every Monday morning."
        ],
        "translation": "사무실 관리자는 매주 월요일 아침에. 사무용품을 주문합니다"
      },
      {
        "text": "The office manager orders office supplies before lunch starts.",
        "chunks": [
          "The office manager",
          "orders office supplies",
          "before lunch starts."
        ],
        "translation": "사무실 관리자는 점심시간이 시작되기 전에. 사무용품을 주문합니다"
      },
      {
        "text": "The office manager orders office supplies in the room.",
        "chunks": [
          "The office manager",
          "orders office supplies",
          "in the room."
        ],
        "translation": "사무실 관리자는 회의실에서. 사무용품을 주문합니다"
      },
      {
        "text": "The office manager orders office supplies with great care.",
        "chunks": [
          "The office manager",
          "orders office supplies",
          "with great care."
        ],
        "translation": "사무실 관리자는 매우 정성스럽게. 사무용품을 주문합니다"
      },
      {
        "text": "The office manager answers urgent questions every Monday morning.",
        "chunks": [
          "The office manager",
          "answers urgent questions",
          "every Monday morning."
        ],
        "translation": "사무실 관리자는 매주 월요일 아침에. 긴급한 질문에 답변합니다"
      },
      {
        "text": "The office manager answers urgent questions before lunch starts.",
        "chunks": [
          "The office manager",
          "answers urgent questions",
          "before lunch starts."
        ],
        "translation": "사무실 관리자는 점심시간이 시작되기 전에. 긴급한 질문에 답변합니다"
      },
      {
        "text": "The office manager answers urgent questions in the room.",
        "chunks": [
          "The office manager",
          "answers urgent questions",
          "in the room."
        ],
        "translation": "사무실 관리자는 회의실에서. 긴급한 질문에 답변합니다"
      },
      {
        "text": "The office manager answers urgent questions with great care.",
        "chunks": [
          "The office manager",
          "answers urgent questions",
          "with great care."
        ],
        "translation": "사무실 관리자는 매우 정성스럽게. 긴급한 질문에 답변합니다"
      },
      {
        "text": "The office manager organizes meeting slides every Monday morning.",
        "chunks": [
          "The office manager",
          "organizes meeting slides",
          "every Monday morning."
        ],
        "translation": "사무실 관리자는 매주 월요일 아침에. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "The office manager organizes meeting slides before lunch starts.",
        "chunks": [
          "The office manager",
          "organizes meeting slides",
          "before lunch starts."
        ],
        "translation": "사무실 관리자는 점심시간이 시작되기 전에. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "The office manager organizes meeting slides in the room.",
        "chunks": [
          "The office manager",
          "organizes meeting slides",
          "in the room."
        ],
        "translation": "사무실 관리자는 회의실에서. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "The office manager organizes meeting slides with great care.",
        "chunks": [
          "The office manager",
          "organizes meeting slides",
          "with great care."
        ],
        "translation": "사무실 관리자는 매우 정성스럽게. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "Every staff member prepares weekly reports every Monday morning.",
        "chunks": [
          "Every staff member",
          "prepares weekly reports",
          "every Monday morning."
        ],
        "translation": "모든 직원은 매주 월요일 아침에. 주간 보고서를 준비합니다"
      },
      {
        "text": "Every staff member prepares weekly reports before lunch starts.",
        "chunks": [
          "Every staff member",
          "prepares weekly reports",
          "before lunch starts."
        ],
        "translation": "모든 직원은 점심시간이 시작되기 전에. 주간 보고서를 준비합니다"
      },
      {
        "text": "Every staff member prepares weekly reports in the room.",
        "chunks": [
          "Every staff member",
          "prepares weekly reports",
          "in the room."
        ],
        "translation": "모든 직원은 회의실에서. 주간 보고서를 준비합니다"
      },
      {
        "text": "Every staff member prepares weekly reports with great care.",
        "chunks": [
          "Every staff member",
          "prepares weekly reports",
          "with great care."
        ],
        "translation": "모든 직원은 매우 정성스럽게. 주간 보고서를 준비합니다"
      },
      {
        "text": "Every staff member shares project schedules every Monday morning.",
        "chunks": [
          "Every staff member",
          "shares project schedules",
          "every Monday morning."
        ],
        "translation": "모든 직원은 매주 월요일 아침에. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "Every staff member shares project schedules before lunch starts.",
        "chunks": [
          "Every staff member",
          "shares project schedules",
          "before lunch starts."
        ],
        "translation": "모든 직원은 점심시간이 시작되기 전에. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "Every staff member shares project schedules in the room.",
        "chunks": [
          "Every staff member",
          "shares project schedules",
          "in the room."
        ],
        "translation": "모든 직원은 회의실에서. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "Every staff member shares project schedules with great care.",
        "chunks": [
          "Every staff member",
          "shares project schedules",
          "with great care."
        ],
        "translation": "모든 직원은 매우 정성스럽게. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "Every staff member orders office supplies every Monday morning.",
        "chunks": [
          "Every staff member",
          "orders office supplies",
          "every Monday morning."
        ],
        "translation": "모든 직원은 매주 월요일 아침에. 사무용품을 주문합니다"
      },
      {
        "text": "Every staff member orders office supplies before lunch starts.",
        "chunks": [
          "Every staff member",
          "orders office supplies",
          "before lunch starts."
        ],
        "translation": "모든 직원은 점심시간이 시작되기 전에. 사무용품을 주문합니다"
      },
      {
        "text": "Every staff member orders office supplies in the room.",
        "chunks": [
          "Every staff member",
          "orders office supplies",
          "in the room."
        ],
        "translation": "모든 직원은 회의실에서. 사무용품을 주문합니다"
      },
      {
        "text": "Every staff member orders office supplies with great care.",
        "chunks": [
          "Every staff member",
          "orders office supplies",
          "with great care."
        ],
        "translation": "모든 직원은 매우 정성스럽게. 사무용품을 주문합니다"
      },
      {
        "text": "Every staff member answers urgent questions every Monday morning.",
        "chunks": [
          "Every staff member",
          "answers urgent questions",
          "every Monday morning."
        ],
        "translation": "모든 직원은 매주 월요일 아침에. 긴급한 질문에 답변합니다"
      },
      {
        "text": "Every staff member answers urgent questions before lunch starts.",
        "chunks": [
          "Every staff member",
          "answers urgent questions",
          "before lunch starts."
        ],
        "translation": "모든 직원은 점심시간이 시작되기 전에. 긴급한 질문에 답변합니다"
      },
      {
        "text": "Every staff member answers urgent questions in the room.",
        "chunks": [
          "Every staff member",
          "answers urgent questions",
          "in the room."
        ],
        "translation": "모든 직원은 회의실에서. 긴급한 질문에 답변합니다"
      },
      {
        "text": "Every staff member answers urgent questions with great care.",
        "chunks": [
          "Every staff member",
          "answers urgent questions",
          "with great care."
        ],
        "translation": "모든 직원은 매우 정성스럽게. 긴급한 질문에 답변합니다"
      },
      {
        "text": "Every staff member organizes meeting slides every Monday morning.",
        "chunks": [
          "Every staff member",
          "organizes meeting slides",
          "every Monday morning."
        ],
        "translation": "모든 직원은 매주 월요일 아침에. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "Every staff member organizes meeting slides before lunch starts.",
        "chunks": [
          "Every staff member",
          "organizes meeting slides",
          "before lunch starts."
        ],
        "translation": "모든 직원은 점심시간이 시작되기 전에. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "Every staff member organizes meeting slides in the room.",
        "chunks": [
          "Every staff member",
          "organizes meeting slides",
          "in the room."
        ],
        "translation": "모든 직원은 회의실에서. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "Every staff member organizes meeting slides with great care.",
        "chunks": [
          "Every staff member",
          "organizes meeting slides",
          "with great care."
        ],
        "translation": "모든 직원은 매우 정성스럽게. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "The support desk prepares weekly reports every Monday morning.",
        "chunks": [
          "The support desk",
          "prepares weekly reports",
          "every Monday morning."
        ],
        "translation": "지원 부서는 매주 월요일 아침에. 주간 보고서를 준비합니다"
      },
      {
        "text": "The support desk prepares weekly reports before lunch starts.",
        "chunks": [
          "The support desk",
          "prepares weekly reports",
          "before lunch starts."
        ],
        "translation": "지원 부서는 점심시간이 시작되기 전에. 주간 보고서를 준비합니다"
      },
      {
        "text": "The support desk prepares weekly reports in the room.",
        "chunks": [
          "The support desk",
          "prepares weekly reports",
          "in the room."
        ],
        "translation": "지원 부서는 회의실에서. 주간 보고서를 준비합니다"
      },
      {
        "text": "The support desk prepares weekly reports with great care.",
        "chunks": [
          "The support desk",
          "prepares weekly reports",
          "with great care."
        ],
        "translation": "지원 부서는 매우 정성스럽게. 주간 보고서를 준비합니다"
      },
      {
        "text": "The support desk shares project schedules every Monday morning.",
        "chunks": [
          "The support desk",
          "shares project schedules",
          "every Monday morning."
        ],
        "translation": "지원 부서는 매주 월요일 아침에. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "The support desk shares project schedules before lunch starts.",
        "chunks": [
          "The support desk",
          "shares project schedules",
          "before lunch starts."
        ],
        "translation": "지원 부서는 점심시간이 시작되기 전에. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "The support desk shares project schedules in the room.",
        "chunks": [
          "The support desk",
          "shares project schedules",
          "in the room."
        ],
        "translation": "지원 부서는 회의실에서. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "The support desk shares project schedules with great care.",
        "chunks": [
          "The support desk",
          "shares project schedules",
          "with great care."
        ],
        "translation": "지원 부서는 매우 정성스럽게. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "The support desk orders office supplies every Monday morning.",
        "chunks": [
          "The support desk",
          "orders office supplies",
          "every Monday morning."
        ],
        "translation": "지원 부서는 매주 월요일 아침에. 사무용품을 주문합니다"
      },
      {
        "text": "The support desk orders office supplies before lunch starts.",
        "chunks": [
          "The support desk",
          "orders office supplies",
          "before lunch starts."
        ],
        "translation": "지원 부서는 점심시간이 시작되기 전에. 사무용품을 주문합니다"
      },
      {
        "text": "The support desk orders office supplies in the room.",
        "chunks": [
          "The support desk",
          "orders office supplies",
          "in the room."
        ],
        "translation": "지원 부서는 회의실에서. 사무용품을 주문합니다"
      },
      {
        "text": "The support desk orders office supplies with great care.",
        "chunks": [
          "The support desk",
          "orders office supplies",
          "with great care."
        ],
        "translation": "지원 부서는 매우 정성스럽게. 사무용품을 주문합니다"
      },
      {
        "text": "The support desk answers urgent questions every Monday morning.",
        "chunks": [
          "The support desk",
          "answers urgent questions",
          "every Monday morning."
        ],
        "translation": "지원 부서는 매주 월요일 아침에. 긴급한 질문에 답변합니다"
      },
      {
        "text": "The support desk answers urgent questions before lunch starts.",
        "chunks": [
          "The support desk",
          "answers urgent questions",
          "before lunch starts."
        ],
        "translation": "지원 부서는 점심시간이 시작되기 전에. 긴급한 질문에 답변합니다"
      },
      {
        "text": "The support desk answers urgent questions in the room.",
        "chunks": [
          "The support desk",
          "answers urgent questions",
          "in the room."
        ],
        "translation": "지원 부서는 회의실에서. 긴급한 질문에 답변합니다"
      },
      {
        "text": "The support desk answers urgent questions with great care.",
        "chunks": [
          "The support desk",
          "answers urgent questions",
          "with great care."
        ],
        "translation": "지원 부서는 매우 정성스럽게. 긴급한 질문에 답변합니다"
      },
      {
        "text": "The support desk organizes meeting slides every Monday morning.",
        "chunks": [
          "The support desk",
          "organizes meeting slides",
          "every Monday morning."
        ],
        "translation": "지원 부서는 매주 월요일 아침에. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "The support desk organizes meeting slides before lunch starts.",
        "chunks": [
          "The support desk",
          "organizes meeting slides",
          "before lunch starts."
        ],
        "translation": "지원 부서는 점심시간이 시작되기 전에. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "The support desk organizes meeting slides in the room.",
        "chunks": [
          "The support desk",
          "organizes meeting slides",
          "in the room."
        ],
        "translation": "지원 부서는 회의실에서. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "The support desk organizes meeting slides with great care.",
        "chunks": [
          "The support desk",
          "organizes meeting slides",
          "with great care."
        ],
        "translation": "지원 부서는 매우 정성스럽게. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "My project colleague prepares weekly reports every Monday morning.",
        "chunks": [
          "My project colleague",
          "prepares weekly reports",
          "every Monday morning."
        ],
        "translation": "제 프로젝트 동료는 매주 월요일 아침에. 주간 보고서를 준비합니다"
      },
      {
        "text": "My project colleague prepares weekly reports before lunch starts.",
        "chunks": [
          "My project colleague",
          "prepares weekly reports",
          "before lunch starts."
        ],
        "translation": "제 프로젝트 동료는 점심시간이 시작되기 전에. 주간 보고서를 준비합니다"
      },
      {
        "text": "My project colleague prepares weekly reports in the room.",
        "chunks": [
          "My project colleague",
          "prepares weekly reports",
          "in the room."
        ],
        "translation": "제 프로젝트 동료는 회의실에서. 주간 보고서를 준비합니다"
      },
      {
        "text": "My project colleague prepares weekly reports with great care.",
        "chunks": [
          "My project colleague",
          "prepares weekly reports",
          "with great care."
        ],
        "translation": "제 프로젝트 동료는 매우 정성스럽게. 주간 보고서를 준비합니다"
      },
      {
        "text": "My project colleague shares project schedules every Monday morning.",
        "chunks": [
          "My project colleague",
          "shares project schedules",
          "every Monday morning."
        ],
        "translation": "제 프로젝트 동료는 매주 월요일 아침에. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "My project colleague shares project schedules before lunch starts.",
        "chunks": [
          "My project colleague",
          "shares project schedules",
          "before lunch starts."
        ],
        "translation": "제 프로젝트 동료는 점심시간이 시작되기 전에. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "My project colleague shares project schedules in the room.",
        "chunks": [
          "My project colleague",
          "shares project schedules",
          "in the room."
        ],
        "translation": "제 프로젝트 동료는 회의실에서. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "My project colleague shares project schedules with great care.",
        "chunks": [
          "My project colleague",
          "shares project schedules",
          "with great care."
        ],
        "translation": "제 프로젝트 동료는 매우 정성스럽게. 프로젝트 일정을 공유합니다"
      },
      {
        "text": "My project colleague orders office supplies every Monday morning.",
        "chunks": [
          "My project colleague",
          "orders office supplies",
          "every Monday morning."
        ],
        "translation": "제 프로젝트 동료는 매주 월요일 아침에. 사무용품을 주문합니다"
      },
      {
        "text": "My project colleague orders office supplies before lunch starts.",
        "chunks": [
          "My project colleague",
          "orders office supplies",
          "before lunch starts."
        ],
        "translation": "제 프로젝트 동료는 점심시간이 시작되기 전에. 사무용품을 주문합니다"
      },
      {
        "text": "My project colleague orders office supplies in the room.",
        "chunks": [
          "My project colleague",
          "orders office supplies",
          "in the room."
        ],
        "translation": "제 프로젝트 동료는 회의실에서. 사무용품을 주문합니다"
      },
      {
        "text": "My project colleague orders office supplies with great care.",
        "chunks": [
          "My project colleague",
          "orders office supplies",
          "with great care."
        ],
        "translation": "제 프로젝트 동료는 매우 정성스럽게. 사무용품을 주문합니다"
      },
      {
        "text": "My project colleague answers urgent questions every Monday morning.",
        "chunks": [
          "My project colleague",
          "answers urgent questions",
          "every Monday morning."
        ],
        "translation": "제 프로젝트 동료는 매주 월요일 아침에. 긴급한 질문에 답변합니다"
      },
      {
        "text": "My project colleague answers urgent questions before lunch starts.",
        "chunks": [
          "My project colleague",
          "answers urgent questions",
          "before lunch starts."
        ],
        "translation": "제 프로젝트 동료는 점심시간이 시작되기 전에. 긴급한 질문에 답변합니다"
      },
      {
        "text": "My project colleague answers urgent questions in the room.",
        "chunks": [
          "My project colleague",
          "answers urgent questions",
          "in the room."
        ],
        "translation": "제 프로젝트 동료는 회의실에서. 긴급한 질문에 답변합니다"
      },
      {
        "text": "My project colleague answers urgent questions with great care.",
        "chunks": [
          "My project colleague",
          "answers urgent questions",
          "with great care."
        ],
        "translation": "제 프로젝트 동료는 매우 정성스럽게. 긴급한 질문에 답변합니다"
      },
      {
        "text": "My project colleague organizes meeting slides every Monday morning.",
        "chunks": [
          "My project colleague",
          "organizes meeting slides",
          "every Monday morning."
        ],
        "translation": "제 프로젝트 동료는 매주 월요일 아침에. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "My project colleague organizes meeting slides before lunch starts.",
        "chunks": [
          "My project colleague",
          "organizes meeting slides",
          "before lunch starts."
        ],
        "translation": "제 프로젝트 동료는 점심시간이 시작되기 전에. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "My project colleague organizes meeting slides in the room.",
        "chunks": [
          "My project colleague",
          "organizes meeting slides",
          "in the room."
        ],
        "translation": "제 프로젝트 동료는 회의실에서. 회의 슬라이드를 정리합니다"
      },
      {
        "text": "My project colleague organizes meeting slides with great care.",
        "chunks": [
          "My project colleague",
          "organizes meeting slides",
          "with great care."
        ],
        "translation": "제 프로젝트 동료는 매우 정성스럽게. 회의 슬라이드를 정리합니다"
      }
    ],
    "4": [
      {
        "text": "If weather permits, we can enjoy a friendly lunch outside the park.",
        "chunks": [
          "If weather permits,",
          "we can enjoy",
          "a friendly lunch",
          "outside the park."
        ],
        "translation": "날씨가 허락한다면, 공원 밖에서. 다정한 점심을 우리는 즐길 수 있습니다"
      },
      {
        "text": "If weather permits, we can enjoy a friendly lunch without any wait.",
        "chunks": [
          "If weather permits,",
          "we can enjoy",
          "a friendly lunch",
          "without any wait."
        ],
        "translation": "날씨가 허락한다면, 기다림 없이. 다정한 점심을 우리는 즐길 수 있습니다"
      },
      {
        "text": "If weather permits, we can enjoy helpful basic guidance outside the park.",
        "chunks": [
          "If weather permits,",
          "we can enjoy",
          "helpful basic guidance",
          "outside the park."
        ],
        "translation": "날씨가 허락한다면, 공원 밖에서. 유용한 기본 안내를 우리는 즐길 수 있습니다"
      },
      {
        "text": "If weather permits, we can enjoy helpful basic guidance without any wait.",
        "chunks": [
          "If weather permits,",
          "we can enjoy",
          "helpful basic guidance",
          "without any wait."
        ],
        "translation": "날씨가 허락한다면, 기다림 없이. 유용한 기본 안내를 우리는 즐길 수 있습니다"
      },
      {
        "text": "If weather permits, we can enjoy a brief meeting outside the park.",
        "chunks": [
          "If weather permits,",
          "we can enjoy",
          "a brief meeting",
          "outside the park."
        ],
        "translation": "날씨가 허락한다면, 공원 밖에서. 짧은 미팅을 우리는 즐길 수 있습니다"
      },
      {
        "text": "If weather permits, we can enjoy a brief meeting without any wait.",
        "chunks": [
          "If weather permits,",
          "we can enjoy",
          "a brief meeting",
          "without any wait."
        ],
        "translation": "날씨가 허락한다면, 기다림 없이. 짧은 미팅을 우리는 즐길 수 있습니다"
      },
      {
        "text": "If weather permits, we can enjoy a warm welcome outside the park.",
        "chunks": [
          "If weather permits,",
          "we can enjoy",
          "a warm welcome",
          "outside the park."
        ],
        "translation": "날씨가 허락한다면, 공원 밖에서. 따뜻한 환영을 우리는 즐길 수 있습니다"
      },
      {
        "text": "If weather permits, we can enjoy a warm welcome without any wait.",
        "chunks": [
          "If weather permits,",
          "we can enjoy",
          "a warm welcome",
          "without any wait."
        ],
        "translation": "날씨가 허락한다면, 기다림 없이. 따뜻한 환영을 우리는 즐길 수 있습니다"
      },
      {
        "text": "If weather permits, we can enjoy quick service support outside the park.",
        "chunks": [
          "If weather permits,",
          "we can enjoy",
          "quick service support",
          "outside the park."
        ],
        "translation": "날씨가 허락한다면, 공원 밖에서. 신속한 지원 서비스를 우리는 즐길 수 있습니다"
      },
      {
        "text": "If weather permits, we can enjoy quick service support without any wait.",
        "chunks": [
          "If weather permits,",
          "we can enjoy",
          "quick service support",
          "without any wait."
        ],
        "translation": "날씨가 허락한다면, 기다림 없이. 신속한 지원 서비스를 우리는 즐길 수 있습니다"
      },
      {
        "text": "If weather permits, staff will assist a friendly lunch outside the park.",
        "chunks": [
          "If weather permits,",
          "staff will assist",
          "a friendly lunch",
          "outside the park."
        ],
        "translation": "날씨가 허락한다면, 공원 밖에서. 다정한 점심을 직원이 도울 것입니다"
      },
      {
        "text": "If weather permits, staff will assist a friendly lunch without any wait.",
        "chunks": [
          "If weather permits,",
          "staff will assist",
          "a friendly lunch",
          "without any wait."
        ],
        "translation": "날씨가 허락한다면, 기다림 없이. 다정한 점심을 직원이 도울 것입니다"
      },
      {
        "text": "If weather permits, staff will assist helpful basic guidance outside the park.",
        "chunks": [
          "If weather permits,",
          "staff will assist",
          "helpful basic guidance",
          "outside the park."
        ],
        "translation": "날씨가 허락한다면, 공원 밖에서. 유용한 기본 안내를 직원이 도울 것입니다"
      },
      {
        "text": "If weather permits, staff will assist helpful basic guidance without any wait.",
        "chunks": [
          "If weather permits,",
          "staff will assist",
          "helpful basic guidance",
          "without any wait."
        ],
        "translation": "날씨가 허락한다면, 기다림 없이. 유용한 기본 안내를 직원이 도울 것입니다"
      },
      {
        "text": "If weather permits, staff will assist a brief meeting outside the park.",
        "chunks": [
          "If weather permits,",
          "staff will assist",
          "a brief meeting",
          "outside the park."
        ],
        "translation": "날씨가 허락한다면, 공원 밖에서. 짧은 미팅을 직원이 도울 것입니다"
      },
      {
        "text": "If weather permits, staff will assist a brief meeting without any wait.",
        "chunks": [
          "If weather permits,",
          "staff will assist",
          "a brief meeting",
          "without any wait."
        ],
        "translation": "날씨가 허락한다면, 기다림 없이. 짧은 미팅을 직원이 도울 것입니다"
      },
      {
        "text": "If weather permits, staff will assist a warm welcome outside the park.",
        "chunks": [
          "If weather permits,",
          "staff will assist",
          "a warm welcome",
          "outside the park."
        ],
        "translation": "날씨가 허락한다면, 공원 밖에서. 따뜻한 환영을 직원이 도울 것입니다"
      },
      {
        "text": "If weather permits, staff will assist a warm welcome without any wait.",
        "chunks": [
          "If weather permits,",
          "staff will assist",
          "a warm welcome",
          "without any wait."
        ],
        "translation": "날씨가 허락한다면, 기다림 없이. 따뜻한 환영을 직원이 도울 것입니다"
      },
      {
        "text": "If weather permits, staff will assist quick service support outside the park.",
        "chunks": [
          "If weather permits,",
          "staff will assist",
          "quick service support",
          "outside the park."
        ],
        "translation": "날씨가 허락한다면, 공원 밖에서. 신속한 지원 서비스를 직원이 도울 것입니다"
      },
      {
        "text": "If weather permits, staff will assist quick service support without any wait.",
        "chunks": [
          "If weather permits,",
          "staff will assist",
          "quick service support",
          "without any wait."
        ],
        "translation": "날씨가 허락한다면, 기다림 없이. 신속한 지원 서비스를 직원이 도울 것입니다"
      },
      {
        "text": "Before you leave, we can enjoy a friendly lunch outside the park.",
        "chunks": [
          "Before you leave,",
          "we can enjoy",
          "a friendly lunch",
          "outside the park."
        ],
        "translation": "퇴근하기 전에, 공원 밖에서. 다정한 점심을 우리는 즐길 수 있습니다"
      },
      {
        "text": "Before you leave, we can enjoy a friendly lunch without any wait.",
        "chunks": [
          "Before you leave,",
          "we can enjoy",
          "a friendly lunch",
          "without any wait."
        ],
        "translation": "퇴근하기 전에, 기다림 없이. 다정한 점심을 우리는 즐길 수 있습니다"
      },
      {
        "text": "Before you leave, we can enjoy helpful basic guidance outside the park.",
        "chunks": [
          "Before you leave,",
          "we can enjoy",
          "helpful basic guidance",
          "outside the park."
        ],
        "translation": "퇴근하기 전에, 공원 밖에서. 유용한 기본 안내를 우리는 즐길 수 있습니다"
      },
      {
        "text": "Before you leave, we can enjoy helpful basic guidance without any wait.",
        "chunks": [
          "Before you leave,",
          "we can enjoy",
          "helpful basic guidance",
          "without any wait."
        ],
        "translation": "퇴근하기 전에, 기다림 없이. 유용한 기본 안내를 우리는 즐길 수 있습니다"
      },
      {
        "text": "Before you leave, we can enjoy a brief meeting outside the park.",
        "chunks": [
          "Before you leave,",
          "we can enjoy",
          "a brief meeting",
          "outside the park."
        ],
        "translation": "퇴근하기 전에, 공원 밖에서. 짧은 미팅을 우리는 즐길 수 있습니다"
      },
      {
        "text": "Before you leave, we can enjoy a brief meeting without any wait.",
        "chunks": [
          "Before you leave,",
          "we can enjoy",
          "a brief meeting",
          "without any wait."
        ],
        "translation": "퇴근하기 전에, 기다림 없이. 짧은 미팅을 우리는 즐길 수 있습니다"
      },
      {
        "text": "Before you leave, we can enjoy a warm welcome outside the park.",
        "chunks": [
          "Before you leave,",
          "we can enjoy",
          "a warm welcome",
          "outside the park."
        ],
        "translation": "퇴근하기 전에, 공원 밖에서. 따뜻한 환영을 우리는 즐길 수 있습니다"
      },
      {
        "text": "Before you leave, we can enjoy a warm welcome without any wait.",
        "chunks": [
          "Before you leave,",
          "we can enjoy",
          "a warm welcome",
          "without any wait."
        ],
        "translation": "퇴근하기 전에, 기다림 없이. 따뜻한 환영을 우리는 즐길 수 있습니다"
      },
      {
        "text": "Before you leave, we can enjoy quick service support outside the park.",
        "chunks": [
          "Before you leave,",
          "we can enjoy",
          "quick service support",
          "outside the park."
        ],
        "translation": "퇴근하기 전에, 공원 밖에서. 신속한 지원 서비스를 우리는 즐길 수 있습니다"
      },
      {
        "text": "Before you leave, we can enjoy quick service support without any wait.",
        "chunks": [
          "Before you leave,",
          "we can enjoy",
          "quick service support",
          "without any wait."
        ],
        "translation": "퇴근하기 전에, 기다림 없이. 신속한 지원 서비스를 우리는 즐길 수 있습니다"
      },
      {
        "text": "Before you leave, staff will assist a friendly lunch outside the park.",
        "chunks": [
          "Before you leave,",
          "staff will assist",
          "a friendly lunch",
          "outside the park."
        ],
        "translation": "퇴근하기 전에, 공원 밖에서. 다정한 점심을 직원이 도울 것입니다"
      },
      {
        "text": "Before you leave, staff will assist a friendly lunch without any wait.",
        "chunks": [
          "Before you leave,",
          "staff will assist",
          "a friendly lunch",
          "without any wait."
        ],
        "translation": "퇴근하기 전에, 기다림 없이. 다정한 점심을 직원이 도울 것입니다"
      },
      {
        "text": "Before you leave, staff will assist helpful basic guidance outside the park.",
        "chunks": [
          "Before you leave,",
          "staff will assist",
          "helpful basic guidance",
          "outside the park."
        ],
        "translation": "퇴근하기 전에, 공원 밖에서. 유용한 기본 안내를 직원이 도울 것입니다"
      },
      {
        "text": "Before you leave, staff will assist helpful basic guidance without any wait.",
        "chunks": [
          "Before you leave,",
          "staff will assist",
          "helpful basic guidance",
          "without any wait."
        ],
        "translation": "퇴근하기 전에, 기다림 없이. 유용한 기본 안내를 직원이 도울 것입니다"
      },
      {
        "text": "Before you leave, staff will assist a brief meeting outside the park.",
        "chunks": [
          "Before you leave,",
          "staff will assist",
          "a brief meeting",
          "outside the park."
        ],
        "translation": "퇴근하기 전에, 공원 밖에서. 짧은 미팅을 직원이 도울 것입니다"
      },
      {
        "text": "Before you leave, staff will assist a brief meeting without any wait.",
        "chunks": [
          "Before you leave,",
          "staff will assist",
          "a brief meeting",
          "without any wait."
        ],
        "translation": "퇴근하기 전에, 기다림 없이. 짧은 미팅을 직원이 도울 것입니다"
      },
      {
        "text": "Before you leave, staff will assist a warm welcome outside the park.",
        "chunks": [
          "Before you leave,",
          "staff will assist",
          "a warm welcome",
          "outside the park."
        ],
        "translation": "퇴근하기 전에, 공원 밖에서. 따뜻한 환영을 직원이 도울 것입니다"
      },
      {
        "text": "Before you leave, staff will assist a warm welcome without any wait.",
        "chunks": [
          "Before you leave,",
          "staff will assist",
          "a warm welcome",
          "without any wait."
        ],
        "translation": "퇴근하기 전에, 기다림 없이. 따뜻한 환영을 직원이 도울 것입니다"
      },
      {
        "text": "Before you leave, staff will assist quick service support outside the park.",
        "chunks": [
          "Before you leave,",
          "staff will assist",
          "quick service support",
          "outside the park."
        ],
        "translation": "퇴근하기 전에, 공원 밖에서. 신속한 지원 서비스를 직원이 도울 것입니다"
      },
      {
        "text": "Before you leave, staff will assist quick service support without any wait.",
        "chunks": [
          "Before you leave,",
          "staff will assist",
          "quick service support",
          "without any wait."
        ],
        "translation": "퇴근하기 전에, 기다림 없이. 신속한 지원 서비스를 직원이 도울 것입니다"
      },
      {
        "text": "When clients visit, we can enjoy a friendly lunch outside the park.",
        "chunks": [
          "When clients visit,",
          "we can enjoy",
          "a friendly lunch",
          "outside the park."
        ],
        "translation": "고객이 방문할 때, 공원 밖에서. 다정한 점심을 우리는 즐길 수 있습니다"
      },
      {
        "text": "When clients visit, we can enjoy a friendly lunch without any wait.",
        "chunks": [
          "When clients visit,",
          "we can enjoy",
          "a friendly lunch",
          "without any wait."
        ],
        "translation": "고객이 방문할 때, 기다림 없이. 다정한 점심을 우리는 즐길 수 있습니다"
      },
      {
        "text": "When clients visit, we can enjoy helpful basic guidance outside the park.",
        "chunks": [
          "When clients visit,",
          "we can enjoy",
          "helpful basic guidance",
          "outside the park."
        ],
        "translation": "고객이 방문할 때, 공원 밖에서. 유용한 기본 안내를 우리는 즐길 수 있습니다"
      },
      {
        "text": "When clients visit, we can enjoy helpful basic guidance without any wait.",
        "chunks": [
          "When clients visit,",
          "we can enjoy",
          "helpful basic guidance",
          "without any wait."
        ],
        "translation": "고객이 방문할 때, 기다림 없이. 유용한 기본 안내를 우리는 즐길 수 있습니다"
      },
      {
        "text": "When clients visit, we can enjoy a brief meeting outside the park.",
        "chunks": [
          "When clients visit,",
          "we can enjoy",
          "a brief meeting",
          "outside the park."
        ],
        "translation": "고객이 방문할 때, 공원 밖에서. 짧은 미팅을 우리는 즐길 수 있습니다"
      },
      {
        "text": "When clients visit, we can enjoy a brief meeting without any wait.",
        "chunks": [
          "When clients visit,",
          "we can enjoy",
          "a brief meeting",
          "without any wait."
        ],
        "translation": "고객이 방문할 때, 기다림 없이. 짧은 미팅을 우리는 즐길 수 있습니다"
      },
      {
        "text": "When clients visit, we can enjoy a warm welcome outside the park.",
        "chunks": [
          "When clients visit,",
          "we can enjoy",
          "a warm welcome",
          "outside the park."
        ],
        "translation": "고객이 방문할 때, 공원 밖에서. 따뜻한 환영을 우리는 즐길 수 있습니다"
      },
      {
        "text": "When clients visit, we can enjoy a warm welcome without any wait.",
        "chunks": [
          "When clients visit,",
          "we can enjoy",
          "a warm welcome",
          "without any wait."
        ],
        "translation": "고객이 방문할 때, 기다림 없이. 따뜻한 환영을 우리는 즐길 수 있습니다"
      },
      {
        "text": "When clients visit, we can enjoy quick service support outside the park.",
        "chunks": [
          "When clients visit,",
          "we can enjoy",
          "quick service support",
          "outside the park."
        ],
        "translation": "고객이 방문할 때, 공원 밖에서. 신속한 지원 서비스를 우리는 즐길 수 있습니다"
      },
      {
        "text": "When clients visit, we can enjoy quick service support without any wait.",
        "chunks": [
          "When clients visit,",
          "we can enjoy",
          "quick service support",
          "without any wait."
        ],
        "translation": "고객이 방문할 때, 기다림 없이. 신속한 지원 서비스를 우리는 즐길 수 있습니다"
      },
      {
        "text": "When clients visit, staff will assist a friendly lunch outside the park.",
        "chunks": [
          "When clients visit,",
          "staff will assist",
          "a friendly lunch",
          "outside the park."
        ],
        "translation": "고객이 방문할 때, 공원 밖에서. 다정한 점심을 직원이 도울 것입니다"
      },
      {
        "text": "When clients visit, staff will assist a friendly lunch without any wait.",
        "chunks": [
          "When clients visit,",
          "staff will assist",
          "a friendly lunch",
          "without any wait."
        ],
        "translation": "고객이 방문할 때, 기다림 없이. 다정한 점심을 직원이 도울 것입니다"
      },
      {
        "text": "When clients visit, staff will assist helpful basic guidance outside the park.",
        "chunks": [
          "When clients visit,",
          "staff will assist",
          "helpful basic guidance",
          "outside the park."
        ],
        "translation": "고객이 방문할 때, 공원 밖에서. 유용한 기본 안내를 직원이 도울 것입니다"
      },
      {
        "text": "When clients visit, staff will assist helpful basic guidance without any wait.",
        "chunks": [
          "When clients visit,",
          "staff will assist",
          "helpful basic guidance",
          "without any wait."
        ],
        "translation": "고객이 방문할 때, 기다림 없이. 유용한 기본 안내를 직원이 도울 것입니다"
      },
      {
        "text": "When clients visit, staff will assist a brief meeting outside the park.",
        "chunks": [
          "When clients visit,",
          "staff will assist",
          "a brief meeting",
          "outside the park."
        ],
        "translation": "고객이 방문할 때, 공원 밖에서. 짧은 미팅을 직원이 도울 것입니다"
      },
      {
        "text": "When clients visit, staff will assist a brief meeting without any wait.",
        "chunks": [
          "When clients visit,",
          "staff will assist",
          "a brief meeting",
          "without any wait."
        ],
        "translation": "고객이 방문할 때, 기다림 없이. 짧은 미팅을 직원이 도울 것입니다"
      },
      {
        "text": "When clients visit, staff will assist a warm welcome outside the park.",
        "chunks": [
          "When clients visit,",
          "staff will assist",
          "a warm welcome",
          "outside the park."
        ],
        "translation": "고객이 방문할 때, 공원 밖에서. 따뜻한 환영을 직원이 도울 것입니다"
      },
      {
        "text": "When clients visit, staff will assist a warm welcome without any wait.",
        "chunks": [
          "When clients visit,",
          "staff will assist",
          "a warm welcome",
          "without any wait."
        ],
        "translation": "고객이 방문할 때, 기다림 없이. 따뜻한 환영을 직원이 도울 것입니다"
      },
      {
        "text": "When clients visit, staff will assist quick service support outside the park.",
        "chunks": [
          "When clients visit,",
          "staff will assist",
          "quick service support",
          "outside the park."
        ],
        "translation": "고객이 방문할 때, 공원 밖에서. 신속한 지원 서비스를 직원이 도울 것입니다"
      },
      {
        "text": "When clients visit, staff will assist quick service support without any wait.",
        "chunks": [
          "When clients visit,",
          "staff will assist",
          "quick service support",
          "without any wait."
        ],
        "translation": "고객이 방문할 때, 기다림 없이. 신속한 지원 서비스를 직원이 도울 것입니다"
      },
      {
        "text": "After morning tasks, we can enjoy a friendly lunch outside the park.",
        "chunks": [
          "After morning tasks,",
          "we can enjoy",
          "a friendly lunch",
          "outside the park."
        ],
        "translation": "아침 업무 후에, 공원 밖에서. 다정한 점심을 우리는 즐길 수 있습니다"
      },
      {
        "text": "After morning tasks, we can enjoy a friendly lunch without any wait.",
        "chunks": [
          "After morning tasks,",
          "we can enjoy",
          "a friendly lunch",
          "without any wait."
        ],
        "translation": "아침 업무 후에, 기다림 없이. 다정한 점심을 우리는 즐길 수 있습니다"
      },
      {
        "text": "After morning tasks, we can enjoy helpful basic guidance outside the park.",
        "chunks": [
          "After morning tasks,",
          "we can enjoy",
          "helpful basic guidance",
          "outside the park."
        ],
        "translation": "아침 업무 후에, 공원 밖에서. 유용한 기본 안내를 우리는 즐길 수 있습니다"
      },
      {
        "text": "After morning tasks, we can enjoy helpful basic guidance without any wait.",
        "chunks": [
          "After morning tasks,",
          "we can enjoy",
          "helpful basic guidance",
          "without any wait."
        ],
        "translation": "아침 업무 후에, 기다림 없이. 유용한 기본 안내를 우리는 즐길 수 있습니다"
      },
      {
        "text": "After morning tasks, we can enjoy a brief meeting outside the park.",
        "chunks": [
          "After morning tasks,",
          "we can enjoy",
          "a brief meeting",
          "outside the park."
        ],
        "translation": "아침 업무 후에, 공원 밖에서. 짧은 미팅을 우리는 즐길 수 있습니다"
      },
      {
        "text": "After morning tasks, we can enjoy a brief meeting without any wait.",
        "chunks": [
          "After morning tasks,",
          "we can enjoy",
          "a brief meeting",
          "without any wait."
        ],
        "translation": "아침 업무 후에, 기다림 없이. 짧은 미팅을 우리는 즐길 수 있습니다"
      },
      {
        "text": "After morning tasks, we can enjoy a warm welcome outside the park.",
        "chunks": [
          "After morning tasks,",
          "we can enjoy",
          "a warm welcome",
          "outside the park."
        ],
        "translation": "아침 업무 후에, 공원 밖에서. 따뜻한 환영을 우리는 즐길 수 있습니다"
      },
      {
        "text": "After morning tasks, we can enjoy a warm welcome without any wait.",
        "chunks": [
          "After morning tasks,",
          "we can enjoy",
          "a warm welcome",
          "without any wait."
        ],
        "translation": "아침 업무 후에, 기다림 없이. 따뜻한 환영을 우리는 즐길 수 있습니다"
      },
      {
        "text": "After morning tasks, we can enjoy quick service support outside the park.",
        "chunks": [
          "After morning tasks,",
          "we can enjoy",
          "quick service support",
          "outside the park."
        ],
        "translation": "아침 업무 후에, 공원 밖에서. 신속한 지원 서비스를 우리는 즐길 수 있습니다"
      },
      {
        "text": "After morning tasks, we can enjoy quick service support without any wait.",
        "chunks": [
          "After morning tasks,",
          "we can enjoy",
          "quick service support",
          "without any wait."
        ],
        "translation": "아침 업무 후에, 기다림 없이. 신속한 지원 서비스를 우리는 즐길 수 있습니다"
      },
      {
        "text": "After morning tasks, staff will assist a friendly lunch outside the park.",
        "chunks": [
          "After morning tasks,",
          "staff will assist",
          "a friendly lunch",
          "outside the park."
        ],
        "translation": "아침 업무 후에, 공원 밖에서. 다정한 점심을 직원이 도울 것입니다"
      },
      {
        "text": "After morning tasks, staff will assist a friendly lunch without any wait.",
        "chunks": [
          "After morning tasks,",
          "staff will assist",
          "a friendly lunch",
          "without any wait."
        ],
        "translation": "아침 업무 후에, 기다림 없이. 다정한 점심을 직원이 도울 것입니다"
      },
      {
        "text": "After morning tasks, staff will assist helpful basic guidance outside the park.",
        "chunks": [
          "After morning tasks,",
          "staff will assist",
          "helpful basic guidance",
          "outside the park."
        ],
        "translation": "아침 업무 후에, 공원 밖에서. 유용한 기본 안내를 직원이 도울 것입니다"
      },
      {
        "text": "After morning tasks, staff will assist helpful basic guidance without any wait.",
        "chunks": [
          "After morning tasks,",
          "staff will assist",
          "helpful basic guidance",
          "without any wait."
        ],
        "translation": "아침 업무 후에, 기다림 없이. 유용한 기본 안내를 직원이 도울 것입니다"
      },
      {
        "text": "After morning tasks, staff will assist a brief meeting outside the park.",
        "chunks": [
          "After morning tasks,",
          "staff will assist",
          "a brief meeting",
          "outside the park."
        ],
        "translation": "아침 업무 후에, 공원 밖에서. 짧은 미팅을 직원이 도울 것입니다"
      },
      {
        "text": "After morning tasks, staff will assist a brief meeting without any wait.",
        "chunks": [
          "After morning tasks,",
          "staff will assist",
          "a brief meeting",
          "without any wait."
        ],
        "translation": "아침 업무 후에, 기다림 없이. 짧은 미팅을 직원이 도울 것입니다"
      },
      {
        "text": "After morning tasks, staff will assist a warm welcome outside the park.",
        "chunks": [
          "After morning tasks,",
          "staff will assist",
          "a warm welcome",
          "outside the park."
        ],
        "translation": "아침 업무 후에, 공원 밖에서. 따뜻한 환영을 직원이 도울 것입니다"
      },
      {
        "text": "After morning tasks, staff will assist a warm welcome without any wait.",
        "chunks": [
          "After morning tasks,",
          "staff will assist",
          "a warm welcome",
          "without any wait."
        ],
        "translation": "아침 업무 후에, 기다림 없이. 따뜻한 환영을 직원이 도울 것입니다"
      },
      {
        "text": "After morning tasks, staff will assist quick service support outside the park.",
        "chunks": [
          "After morning tasks,",
          "staff will assist",
          "quick service support",
          "outside the park."
        ],
        "translation": "아침 업무 후에, 공원 밖에서. 신속한 지원 서비스를 직원이 도울 것입니다"
      },
      {
        "text": "After morning tasks, staff will assist quick service support without any wait.",
        "chunks": [
          "After morning tasks,",
          "staff will assist",
          "quick service support",
          "without any wait."
        ],
        "translation": "아침 업무 후에, 기다림 없이. 신속한 지원 서비스를 직원이 도울 것입니다"
      },
      {
        "text": "If you ask, we can enjoy a friendly lunch outside the park.",
        "chunks": [
          "If you ask,",
          "we can enjoy",
          "a friendly lunch",
          "outside the park."
        ],
        "translation": "요청하신다면, 공원 밖에서. 다정한 점심을 우리는 즐길 수 있습니다"
      },
      {
        "text": "If you ask, we can enjoy a friendly lunch without any wait.",
        "chunks": [
          "If you ask,",
          "we can enjoy",
          "a friendly lunch",
          "without any wait."
        ],
        "translation": "요청하신다면, 기다림 없이. 다정한 점심을 우리는 즐길 수 있습니다"
      },
      {
        "text": "If you ask, we can enjoy helpful basic guidance outside the park.",
        "chunks": [
          "If you ask,",
          "we can enjoy",
          "helpful basic guidance",
          "outside the park."
        ],
        "translation": "요청하신다면, 공원 밖에서. 유용한 기본 안내를 우리는 즐길 수 있습니다"
      },
      {
        "text": "If you ask, we can enjoy helpful basic guidance without any wait.",
        "chunks": [
          "If you ask,",
          "we can enjoy",
          "helpful basic guidance",
          "without any wait."
        ],
        "translation": "요청하신다면, 기다림 없이. 유용한 기본 안내를 우리는 즐길 수 있습니다"
      },
      {
        "text": "If you ask, we can enjoy a brief meeting outside the park.",
        "chunks": [
          "If you ask,",
          "we can enjoy",
          "a brief meeting",
          "outside the park."
        ],
        "translation": "요청하신다면, 공원 밖에서. 짧은 미팅을 우리는 즐길 수 있습니다"
      },
      {
        "text": "If you ask, we can enjoy a brief meeting without any wait.",
        "chunks": [
          "If you ask,",
          "we can enjoy",
          "a brief meeting",
          "without any wait."
        ],
        "translation": "요청하신다면, 기다림 없이. 짧은 미팅을 우리는 즐길 수 있습니다"
      },
      {
        "text": "If you ask, we can enjoy a warm welcome outside the park.",
        "chunks": [
          "If you ask,",
          "we can enjoy",
          "a warm welcome",
          "outside the park."
        ],
        "translation": "요청하신다면, 공원 밖에서. 따뜻한 환영을 우리는 즐길 수 있습니다"
      },
      {
        "text": "If you ask, we can enjoy a warm welcome without any wait.",
        "chunks": [
          "If you ask,",
          "we can enjoy",
          "a warm welcome",
          "without any wait."
        ],
        "translation": "요청하신다면, 기다림 없이. 따뜻한 환영을 우리는 즐길 수 있습니다"
      },
      {
        "text": "If you ask, we can enjoy quick service support outside the park.",
        "chunks": [
          "If you ask,",
          "we can enjoy",
          "quick service support",
          "outside the park."
        ],
        "translation": "요청하신다면, 공원 밖에서. 신속한 지원 서비스를 우리는 즐길 수 있습니다"
      },
      {
        "text": "If you ask, we can enjoy quick service support without any wait.",
        "chunks": [
          "If you ask,",
          "we can enjoy",
          "quick service support",
          "without any wait."
        ],
        "translation": "요청하신다면, 기다림 없이. 신속한 지원 서비스를 우리는 즐길 수 있습니다"
      },
      {
        "text": "If you ask, staff will assist a friendly lunch outside the park.",
        "chunks": [
          "If you ask,",
          "staff will assist",
          "a friendly lunch",
          "outside the park."
        ],
        "translation": "요청하신다면, 공원 밖에서. 다정한 점심을 직원이 도울 것입니다"
      },
      {
        "text": "If you ask, staff will assist a friendly lunch without any wait.",
        "chunks": [
          "If you ask,",
          "staff will assist",
          "a friendly lunch",
          "without any wait."
        ],
        "translation": "요청하신다면, 기다림 없이. 다정한 점심을 직원이 도울 것입니다"
      },
      {
        "text": "If you ask, staff will assist helpful basic guidance outside the park.",
        "chunks": [
          "If you ask,",
          "staff will assist",
          "helpful basic guidance",
          "outside the park."
        ],
        "translation": "요청하신다면, 공원 밖에서. 유용한 기본 안내를 직원이 도울 것입니다"
      },
      {
        "text": "If you ask, staff will assist helpful basic guidance without any wait.",
        "chunks": [
          "If you ask,",
          "staff will assist",
          "helpful basic guidance",
          "without any wait."
        ],
        "translation": "요청하신다면, 기다림 없이. 유용한 기본 안내를 직원이 도울 것입니다"
      },
      {
        "text": "If you ask, staff will assist a brief meeting outside the park.",
        "chunks": [
          "If you ask,",
          "staff will assist",
          "a brief meeting",
          "outside the park."
        ],
        "translation": "요청하신다면, 공원 밖에서. 짧은 미팅을 직원이 도울 것입니다"
      },
      {
        "text": "If you ask, staff will assist a brief meeting without any wait.",
        "chunks": [
          "If you ask,",
          "staff will assist",
          "a brief meeting",
          "without any wait."
        ],
        "translation": "요청하신다면, 기다림 없이. 짧은 미팅을 직원이 도울 것입니다"
      },
      {
        "text": "If you ask, staff will assist a warm welcome outside the park.",
        "chunks": [
          "If you ask,",
          "staff will assist",
          "a warm welcome",
          "outside the park."
        ],
        "translation": "요청하신다면, 공원 밖에서. 따뜻한 환영을 직원이 도울 것입니다"
      },
      {
        "text": "If you ask, staff will assist a warm welcome without any wait.",
        "chunks": [
          "If you ask,",
          "staff will assist",
          "a warm welcome",
          "without any wait."
        ],
        "translation": "요청하신다면, 기다림 없이. 따뜻한 환영을 직원이 도울 것입니다"
      },
      {
        "text": "If you ask, staff will assist quick service support outside the park.",
        "chunks": [
          "If you ask,",
          "staff will assist",
          "quick service support",
          "outside the park."
        ],
        "translation": "요청하신다면, 공원 밖에서. 신속한 지원 서비스를 직원이 도울 것입니다"
      },
      {
        "text": "If you ask, staff will assist quick service support without any wait.",
        "chunks": [
          "If you ask,",
          "staff will assist",
          "quick service support",
          "without any wait."
        ],
        "translation": "요청하신다면, 기다림 없이. 신속한 지원 서비스를 직원이 도울 것입니다"
      }
    ]
  },
  "B1": {
    "2": [
      {
        "text": "Customer satisfaction remains our operational priority.",
        "chunks": [
          "Customer satisfaction remains",
          "our operational priority."
        ],
        "translation": "고객 만족은 언제나 우리의 최우선 과제입니다."
      },
      {
        "text": "Customer satisfaction remains essential for success.",
        "chunks": [
          "Customer satisfaction remains",
          "essential for success."
        ],
        "translation": "고객 만족은 언제나 성공을 위해 필수적입니다."
      },
      {
        "text": "Customer satisfaction remains critical for retention.",
        "chunks": [
          "Customer satisfaction remains",
          "critical for retention."
        ],
        "translation": "고객 만족은 언제나 고객 유지에 대단히 중요합니다."
      },
      {
        "text": "Customer satisfaction remains vital for collaboration.",
        "chunks": [
          "Customer satisfaction remains",
          "vital for collaboration."
        ],
        "translation": "고객 만족은 언제나 협업을 위해 매우 중요합니다."
      },
      {
        "text": "Customer satisfaction remains key for growth.",
        "chunks": [
          "Customer satisfaction remains",
          "key for growth."
        ],
        "translation": "고객 만족은 언제나 성장을 위한 핵심입니다."
      },
      {
        "text": "Customer satisfaction remains the attached proposal.",
        "chunks": [
          "Customer satisfaction remains",
          "the attached proposal."
        ],
        "translation": "고객 만족은 언제나 첨부된 제안서를."
      },
      {
        "text": "Customer satisfaction remains the project budget.",
        "chunks": [
          "Customer satisfaction remains",
          "the project budget."
        ],
        "translation": "고객 만족은 언제나 프로젝트 예산을."
      },
      {
        "text": "Customer satisfaction remains the server issue.",
        "chunks": [
          "Customer satisfaction remains",
          "the server issue."
        ],
        "translation": "고객 만족은 언제나 서버 문제를 해결했습니다."
      },
      {
        "text": "Customer satisfaction remains the work process.",
        "chunks": [
          "Customer satisfaction remains",
          "the work process."
        ],
        "translation": "고객 만족은 언제나 업무 프로세스를."
      },
      {
        "text": "Customer satisfaction remains a truly vital role.",
        "chunks": [
          "Customer satisfaction remains",
          "a truly vital role."
        ],
        "translation": "고객 만족은 언제나 대단히 중대한 역할을 합니다."
      },
      {
        "text": "Service response quality our operational priority.",
        "chunks": [
          "Service response quality",
          "our operational priority."
        ],
        "translation": "서비스 응대 품질은 우리의 최우선 과제입니다."
      },
      {
        "text": "Service response quality essential for success.",
        "chunks": [
          "Service response quality",
          "essential for success."
        ],
        "translation": "서비스 응대 품질은 성공을 위해 필수적입니다."
      },
      {
        "text": "Service response quality critical for retention.",
        "chunks": [
          "Service response quality",
          "critical for retention."
        ],
        "translation": "서비스 응대 품질은 고객 유지에 대단히 중요합니다."
      },
      {
        "text": "Service response quality vital for collaboration.",
        "chunks": [
          "Service response quality",
          "vital for collaboration."
        ],
        "translation": "서비스 응대 품질은 협업을 위해 매우 중요합니다."
      },
      {
        "text": "Service response quality key for growth.",
        "chunks": [
          "Service response quality",
          "key for growth."
        ],
        "translation": "서비스 응대 품질은 성장을 위한 핵심입니다."
      },
      {
        "text": "Service response quality the attached proposal.",
        "chunks": [
          "Service response quality",
          "the attached proposal."
        ],
        "translation": "서비스 응대 품질은 첨부된 제안서를."
      },
      {
        "text": "Service response quality the project budget.",
        "chunks": [
          "Service response quality",
          "the project budget."
        ],
        "translation": "서비스 응대 품질은 프로젝트 예산을."
      },
      {
        "text": "Service response quality the server issue.",
        "chunks": [
          "Service response quality",
          "the server issue."
        ],
        "translation": "서비스 응대 품질은 서버 문제를 해결했습니다."
      },
      {
        "text": "Service response quality the work process.",
        "chunks": [
          "Service response quality",
          "the work process."
        ],
        "translation": "서비스 응대 품질은 업무 프로세스를."
      },
      {
        "text": "Service response quality a truly vital role.",
        "chunks": [
          "Service response quality",
          "a truly vital role."
        ],
        "translation": "서비스 응대 품질은 대단히 중대한 역할을 합니다."
      },
      {
        "text": "Direct client feedback our operational priority.",
        "chunks": [
          "Direct client feedback",
          "our operational priority."
        ],
        "translation": "직접적인 고객 피드백은 우리의 최우선 과제입니다."
      },
      {
        "text": "Direct client feedback essential for success.",
        "chunks": [
          "Direct client feedback",
          "essential for success."
        ],
        "translation": "직접적인 고객 피드백은 성공을 위해 필수적입니다."
      },
      {
        "text": "Direct client feedback critical for retention.",
        "chunks": [
          "Direct client feedback",
          "critical for retention."
        ],
        "translation": "직접적인 고객 피드백은 고객 유지에 대단히 중요합니다."
      },
      {
        "text": "Direct client feedback vital for collaboration.",
        "chunks": [
          "Direct client feedback",
          "vital for collaboration."
        ],
        "translation": "직접적인 고객 피드백은 협업을 위해 매우 중요합니다."
      },
      {
        "text": "Direct client feedback key for growth.",
        "chunks": [
          "Direct client feedback",
          "key for growth."
        ],
        "translation": "직접적인 고객 피드백은 성장을 위한 핵심입니다."
      },
      {
        "text": "Direct client feedback the attached proposal.",
        "chunks": [
          "Direct client feedback",
          "the attached proposal."
        ],
        "translation": "직접적인 고객 피드백은 첨부된 제안서를."
      },
      {
        "text": "Direct client feedback the project budget.",
        "chunks": [
          "Direct client feedback",
          "the project budget."
        ],
        "translation": "직접적인 고객 피드백은 프로젝트 예산을."
      },
      {
        "text": "Direct client feedback the server issue.",
        "chunks": [
          "Direct client feedback",
          "the server issue."
        ],
        "translation": "직접적인 고객 피드백은 서버 문제를 해결했습니다."
      },
      {
        "text": "Direct client feedback the work process.",
        "chunks": [
          "Direct client feedback",
          "the work process."
        ],
        "translation": "직접적인 고객 피드백은 업무 프로세스를."
      },
      {
        "text": "Direct client feedback a truly vital role.",
        "chunks": [
          "Direct client feedback",
          "a truly vital role."
        ],
        "translation": "직접적인 고객 피드백은 대단히 중대한 역할을 합니다."
      },
      {
        "text": "Resolving user inquiries our operational priority.",
        "chunks": [
          "Resolving user inquiries",
          "our operational priority."
        ],
        "translation": "사용자 문의 해결은 우리의 최우선 과제입니다."
      },
      {
        "text": "Resolving user inquiries essential for success.",
        "chunks": [
          "Resolving user inquiries",
          "essential for success."
        ],
        "translation": "사용자 문의 해결은 성공을 위해 필수적입니다."
      },
      {
        "text": "Resolving user inquiries critical for retention.",
        "chunks": [
          "Resolving user inquiries",
          "critical for retention."
        ],
        "translation": "사용자 문의 해결은 고객 유지에 대단히 중요합니다."
      },
      {
        "text": "Resolving user inquiries vital for collaboration.",
        "chunks": [
          "Resolving user inquiries",
          "vital for collaboration."
        ],
        "translation": "사용자 문의 해결은 협업을 위해 매우 중요합니다."
      },
      {
        "text": "Resolving user inquiries key for growth.",
        "chunks": [
          "Resolving user inquiries",
          "key for growth."
        ],
        "translation": "사용자 문의 해결은 성장을 위한 핵심입니다."
      },
      {
        "text": "Resolving user inquiries the attached proposal.",
        "chunks": [
          "Resolving user inquiries",
          "the attached proposal."
        ],
        "translation": "사용자 문의 해결은 첨부된 제안서를."
      },
      {
        "text": "Resolving user inquiries the project budget.",
        "chunks": [
          "Resolving user inquiries",
          "the project budget."
        ],
        "translation": "사용자 문의 해결은 프로젝트 예산을."
      },
      {
        "text": "Resolving user inquiries the server issue.",
        "chunks": [
          "Resolving user inquiries",
          "the server issue."
        ],
        "translation": "사용자 문의 해결은 서버 문제를 해결했습니다."
      },
      {
        "text": "Resolving user inquiries the work process.",
        "chunks": [
          "Resolving user inquiries",
          "the work process."
        ],
        "translation": "사용자 문의 해결은 업무 프로세스를."
      },
      {
        "text": "Resolving user inquiries a truly vital role.",
        "chunks": [
          "Resolving user inquiries",
          "a truly vital role."
        ],
        "translation": "사용자 문의 해결은 대단히 중대한 역할을 합니다."
      },
      {
        "text": "Building firm trust our operational priority.",
        "chunks": [
          "Building firm trust",
          "our operational priority."
        ],
        "translation": "확고한 신뢰 구축은 우리의 최우선 과제입니다."
      },
      {
        "text": "Building firm trust essential for success.",
        "chunks": [
          "Building firm trust",
          "essential for success."
        ],
        "translation": "확고한 신뢰 구축은 성공을 위해 필수적입니다."
      },
      {
        "text": "Building firm trust critical for retention.",
        "chunks": [
          "Building firm trust",
          "critical for retention."
        ],
        "translation": "확고한 신뢰 구축은 고객 유지에 대단히 중요합니다."
      },
      {
        "text": "Building firm trust vital for collaboration.",
        "chunks": [
          "Building firm trust",
          "vital for collaboration."
        ],
        "translation": "확고한 신뢰 구축은 협업을 위해 매우 중요합니다."
      },
      {
        "text": "Building firm trust key for growth.",
        "chunks": [
          "Building firm trust",
          "key for growth."
        ],
        "translation": "확고한 신뢰 구축은 성장을 위한 핵심입니다."
      },
      {
        "text": "Building firm trust the attached proposal.",
        "chunks": [
          "Building firm trust",
          "the attached proposal."
        ],
        "translation": "확고한 신뢰 구축은 첨부된 제안서를."
      },
      {
        "text": "Building firm trust the project budget.",
        "chunks": [
          "Building firm trust",
          "the project budget."
        ],
        "translation": "확고한 신뢰 구축은 프로젝트 예산을."
      },
      {
        "text": "Building firm trust the server issue.",
        "chunks": [
          "Building firm trust",
          "the server issue."
        ],
        "translation": "확고한 신뢰 구축은 서버 문제를 해결했습니다."
      },
      {
        "text": "Building firm trust the work process.",
        "chunks": [
          "Building firm trust",
          "the work process."
        ],
        "translation": "확고한 신뢰 구축은 업무 프로세스를."
      },
      {
        "text": "Building firm trust a truly vital role.",
        "chunks": [
          "Building firm trust",
          "a truly vital role."
        ],
        "translation": "확고한 신뢰 구축은 대단히 중대한 역할을 합니다."
      },
      {
        "text": "Please review carefully our operational priority.",
        "chunks": [
          "Please review carefully",
          "our operational priority."
        ],
        "translation": "주의 깊게 검토해 주세요 우리의 최우선 과제입니다."
      },
      {
        "text": "Please review carefully essential for success.",
        "chunks": [
          "Please review carefully",
          "essential for success."
        ],
        "translation": "주의 깊게 검토해 주세요 성공을 위해 필수적입니다."
      },
      {
        "text": "Please review carefully critical for retention.",
        "chunks": [
          "Please review carefully",
          "critical for retention."
        ],
        "translation": "주의 깊게 검토해 주세요 고객 유지에 대단히 중요합니다."
      },
      {
        "text": "Please review carefully vital for collaboration.",
        "chunks": [
          "Please review carefully",
          "vital for collaboration."
        ],
        "translation": "주의 깊게 검토해 주세요 협업을 위해 매우 중요합니다."
      },
      {
        "text": "Please review carefully key for growth.",
        "chunks": [
          "Please review carefully",
          "key for growth."
        ],
        "translation": "주의 깊게 검토해 주세요 성장을 위한 핵심입니다."
      },
      {
        "text": "Please review carefully the attached proposal.",
        "chunks": [
          "Please review carefully",
          "the attached proposal."
        ],
        "translation": "주의 깊게 검토해 주세요 첨부된 제안서를."
      },
      {
        "text": "Please review carefully the project budget.",
        "chunks": [
          "Please review carefully",
          "the project budget."
        ],
        "translation": "주의 깊게 검토해 주세요 프로젝트 예산을."
      },
      {
        "text": "Please review carefully the server issue.",
        "chunks": [
          "Please review carefully",
          "the server issue."
        ],
        "translation": "주의 깊게 검토해 주세요 서버 문제를 해결했습니다."
      },
      {
        "text": "Please review carefully the work process.",
        "chunks": [
          "Please review carefully",
          "the work process."
        ],
        "translation": "주의 깊게 검토해 주세요 업무 프로세스를."
      },
      {
        "text": "Please review carefully a truly vital role.",
        "chunks": [
          "Please review carefully",
          "a truly vital role."
        ],
        "translation": "주의 깊게 검토해 주세요 대단히 중대한 역할을 합니다."
      },
      {
        "text": "We finally approved our operational priority.",
        "chunks": [
          "We finally approved",
          "our operational priority."
        ],
        "translation": "우리는 마침내 승인했습니다 우리의 최우선 과제입니다."
      },
      {
        "text": "We finally approved essential for success.",
        "chunks": [
          "We finally approved",
          "essential for success."
        ],
        "translation": "우리는 마침내 승인했습니다 성공을 위해 필수적입니다."
      },
      {
        "text": "We finally approved critical for retention.",
        "chunks": [
          "We finally approved",
          "critical for retention."
        ],
        "translation": "우리는 마침내 승인했습니다 고객 유지에 대단히 중요합니다."
      },
      {
        "text": "We finally approved vital for collaboration.",
        "chunks": [
          "We finally approved",
          "vital for collaboration."
        ],
        "translation": "우리는 마침내 승인했습니다 협업을 위해 매우 중요합니다."
      },
      {
        "text": "We finally approved key for growth.",
        "chunks": [
          "We finally approved",
          "key for growth."
        ],
        "translation": "우리는 마침내 승인했습니다 성장을 위한 핵심입니다."
      },
      {
        "text": "We finally approved the attached proposal.",
        "chunks": [
          "We finally approved",
          "the attached proposal."
        ],
        "translation": "우리는 마침내 승인했습니다 첨부된 제안서를."
      },
      {
        "text": "We finally approved the project budget.",
        "chunks": [
          "We finally approved",
          "the project budget."
        ],
        "translation": "우리는 마침내 승인했습니다 프로젝트 예산을."
      },
      {
        "text": "We finally approved the server issue.",
        "chunks": [
          "We finally approved",
          "the server issue."
        ],
        "translation": "우리는 마침내 승인했습니다 서버 문제를 해결했습니다."
      },
      {
        "text": "We finally approved the work process.",
        "chunks": [
          "We finally approved",
          "the work process."
        ],
        "translation": "우리는 마침내 승인했습니다 업무 프로세스를."
      },
      {
        "text": "We finally approved a truly vital role.",
        "chunks": [
          "We finally approved",
          "a truly vital role."
        ],
        "translation": "우리는 마침내 승인했습니다 대단히 중대한 역할을 합니다."
      },
      {
        "text": "The engineering team our operational priority.",
        "chunks": [
          "The engineering team",
          "our operational priority."
        ],
        "translation": "엔지니어링 팀은 우리의 최우선 과제입니다."
      },
      {
        "text": "The engineering team essential for success.",
        "chunks": [
          "The engineering team",
          "essential for success."
        ],
        "translation": "엔지니어링 팀은 성공을 위해 필수적입니다."
      },
      {
        "text": "The engineering team critical for retention.",
        "chunks": [
          "The engineering team",
          "critical for retention."
        ],
        "translation": "엔지니어링 팀은 고객 유지에 대단히 중요합니다."
      },
      {
        "text": "The engineering team vital for collaboration.",
        "chunks": [
          "The engineering team",
          "vital for collaboration."
        ],
        "translation": "엔지니어링 팀은 협업을 위해 매우 중요합니다."
      },
      {
        "text": "The engineering team key for growth.",
        "chunks": [
          "The engineering team",
          "key for growth."
        ],
        "translation": "엔지니어링 팀은 성장을 위한 핵심입니다."
      },
      {
        "text": "The engineering team the attached proposal.",
        "chunks": [
          "The engineering team",
          "the attached proposal."
        ],
        "translation": "엔지니어링 팀은 첨부된 제안서를."
      },
      {
        "text": "The engineering team the project budget.",
        "chunks": [
          "The engineering team",
          "the project budget."
        ],
        "translation": "엔지니어링 팀은 프로젝트 예산을."
      },
      {
        "text": "The engineering team the server issue.",
        "chunks": [
          "The engineering team",
          "the server issue."
        ],
        "translation": "엔지니어링 팀은 서버 문제를 해결했습니다."
      },
      {
        "text": "The engineering team the work process.",
        "chunks": [
          "The engineering team",
          "the work process."
        ],
        "translation": "엔지니어링 팀은 업무 프로세스를."
      },
      {
        "text": "The engineering team a truly vital role.",
        "chunks": [
          "The engineering team",
          "a truly vital role."
        ],
        "translation": "엔지니어링 팀은 대단히 중대한 역할을 합니다."
      },
      {
        "text": "We must streamline our operational priority.",
        "chunks": [
          "We must streamline",
          "our operational priority."
        ],
        "translation": "우리는 간소화해야 합니다 우리의 최우선 과제입니다."
      },
      {
        "text": "We must streamline essential for success.",
        "chunks": [
          "We must streamline",
          "essential for success."
        ],
        "translation": "우리는 간소화해야 합니다 성공을 위해 필수적입니다."
      },
      {
        "text": "We must streamline critical for retention.",
        "chunks": [
          "We must streamline",
          "critical for retention."
        ],
        "translation": "우리는 간소화해야 합니다 고객 유지에 대단히 중요합니다."
      },
      {
        "text": "We must streamline vital for collaboration.",
        "chunks": [
          "We must streamline",
          "vital for collaboration."
        ],
        "translation": "우리는 간소화해야 합니다 협업을 위해 매우 중요합니다."
      },
      {
        "text": "We must streamline key for growth.",
        "chunks": [
          "We must streamline",
          "key for growth."
        ],
        "translation": "우리는 간소화해야 합니다 성장을 위한 핵심입니다."
      },
      {
        "text": "We must streamline the attached proposal.",
        "chunks": [
          "We must streamline",
          "the attached proposal."
        ],
        "translation": "우리는 간소화해야 합니다 첨부된 제안서를."
      },
      {
        "text": "We must streamline the project budget.",
        "chunks": [
          "We must streamline",
          "the project budget."
        ],
        "translation": "우리는 간소화해야 합니다 프로젝트 예산을."
      },
      {
        "text": "We must streamline the server issue.",
        "chunks": [
          "We must streamline",
          "the server issue."
        ],
        "translation": "우리는 간소화해야 합니다 서버 문제를 해결했습니다."
      },
      {
        "text": "We must streamline the work process.",
        "chunks": [
          "We must streamline",
          "the work process."
        ],
        "translation": "우리는 간소화해야 합니다 업무 프로세스를."
      },
      {
        "text": "We must streamline a truly vital role.",
        "chunks": [
          "We must streamline",
          "a truly vital role."
        ],
        "translation": "우리는 간소화해야 합니다 대단히 중대한 역할을 합니다."
      },
      {
        "text": "Effective communication plays our operational priority.",
        "chunks": [
          "Effective communication plays",
          "our operational priority."
        ],
        "translation": "효과적인 소통은 우리의 최우선 과제입니다."
      },
      {
        "text": "Effective communication plays essential for success.",
        "chunks": [
          "Effective communication plays",
          "essential for success."
        ],
        "translation": "효과적인 소통은 성공을 위해 필수적입니다."
      },
      {
        "text": "Effective communication plays critical for retention.",
        "chunks": [
          "Effective communication plays",
          "critical for retention."
        ],
        "translation": "효과적인 소통은 고객 유지에 대단히 중요합니다."
      },
      {
        "text": "Effective communication plays vital for collaboration.",
        "chunks": [
          "Effective communication plays",
          "vital for collaboration."
        ],
        "translation": "효과적인 소통은 협업을 위해 매우 중요합니다."
      },
      {
        "text": "Effective communication plays key for growth.",
        "chunks": [
          "Effective communication plays",
          "key for growth."
        ],
        "translation": "효과적인 소통은 성장을 위한 핵심입니다."
      },
      {
        "text": "Effective communication plays the attached proposal.",
        "chunks": [
          "Effective communication plays",
          "the attached proposal."
        ],
        "translation": "효과적인 소통은 첨부된 제안서를."
      },
      {
        "text": "Effective communication plays the project budget.",
        "chunks": [
          "Effective communication plays",
          "the project budget."
        ],
        "translation": "효과적인 소통은 프로젝트 예산을."
      },
      {
        "text": "Effective communication plays the server issue.",
        "chunks": [
          "Effective communication plays",
          "the server issue."
        ],
        "translation": "효과적인 소통은 서버 문제를 해결했습니다."
      },
      {
        "text": "Effective communication plays the work process.",
        "chunks": [
          "Effective communication plays",
          "the work process."
        ],
        "translation": "효과적인 소통은 업무 프로세스를."
      },
      {
        "text": "Effective communication plays a truly vital role.",
        "chunks": [
          "Effective communication plays",
          "a truly vital role."
        ],
        "translation": "효과적인 소통은 대단히 중대한 역할을 합니다."
      }
    ],
    "3": [
      {
        "text": "Effective communication plays key roles in project collaboration.",
        "chunks": [
          "Effective communication",
          "plays key roles",
          "in project collaboration."
        ],
        "translation": "효과적인 의사소통은 프로젝트 협업에서. 핵심적인 역할을 합니다"
      },
      {
        "text": "Effective communication plays key roles to workplace satisfaction.",
        "chunks": [
          "Effective communication",
          "plays key roles",
          "to workplace satisfaction."
        ],
        "translation": "효과적인 의사소통은 직장 만족도 향상에. 핵심적인 역할을 합니다"
      },
      {
        "text": "Effective communication plays key roles for creative design.",
        "chunks": [
          "Effective communication",
          "plays key roles",
          "for creative design."
        ],
        "translation": "효과적인 의사소통은 창의적인 기획 업무를 위해. 핵심적인 역할을 합니다"
      },
      {
        "text": "Effective communication plays key roles across our company.",
        "chunks": [
          "Effective communication",
          "plays key roles",
          "across our company."
        ],
        "translation": "효과적인 의사소통은 우리 회사 전반에 걸쳐. 핵심적인 역할을 합니다"
      },
      {
        "text": "Effective communication contributes quite significantly in project collaboration.",
        "chunks": [
          "Effective communication",
          "contributes quite significantly",
          "in project collaboration."
        ],
        "translation": "효과적인 의사소통은 프로젝트 협업에서. 상당한 기여를 합니다"
      },
      {
        "text": "Effective communication contributes quite significantly to workplace satisfaction.",
        "chunks": [
          "Effective communication",
          "contributes quite significantly",
          "to workplace satisfaction."
        ],
        "translation": "효과적인 의사소통은 직장 만족도 향상에. 상당한 기여를 합니다"
      },
      {
        "text": "Effective communication contributes quite significantly for creative design.",
        "chunks": [
          "Effective communication",
          "contributes quite significantly",
          "for creative design."
        ],
        "translation": "효과적인 의사소통은 창의적인 기획 업무를 위해. 상당한 기여를 합니다"
      },
      {
        "text": "Effective communication contributes quite significantly across our company.",
        "chunks": [
          "Effective communication",
          "contributes quite significantly",
          "across our company."
        ],
        "translation": "효과적인 의사소통은 우리 회사 전반에 걸쳐. 상당한 기여를 합니다"
      },
      {
        "text": "Effective communication gives more freedom in project collaboration.",
        "chunks": [
          "Effective communication",
          "gives more freedom",
          "in project collaboration."
        ],
        "translation": "효과적인 의사소통은 프로젝트 협업에서. 더 많은 여유를 줍니다"
      },
      {
        "text": "Effective communication gives more freedom to workplace satisfaction.",
        "chunks": [
          "Effective communication",
          "gives more freedom",
          "to workplace satisfaction."
        ],
        "translation": "효과적인 의사소통은 직장 만족도 향상에. 더 많은 여유를 줍니다"
      },
      {
        "text": "Effective communication gives more freedom for creative design.",
        "chunks": [
          "Effective communication",
          "gives more freedom",
          "for creative design."
        ],
        "translation": "효과적인 의사소통은 창의적인 기획 업무를 위해. 더 많은 여유를 줍니다"
      },
      {
        "text": "Effective communication gives more freedom across our company.",
        "chunks": [
          "Effective communication",
          "gives more freedom",
          "across our company."
        ],
        "translation": "효과적인 의사소통은 우리 회사 전반에 걸쳐. 더 많은 여유를 줍니다"
      },
      {
        "text": "Effective communication brings lasting benefits in project collaboration.",
        "chunks": [
          "Effective communication",
          "brings lasting benefits",
          "in project collaboration."
        ],
        "translation": "효과적인 의사소통은 프로젝트 협업에서. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Effective communication brings lasting benefits to workplace satisfaction.",
        "chunks": [
          "Effective communication",
          "brings lasting benefits",
          "to workplace satisfaction."
        ],
        "translation": "효과적인 의사소통은 직장 만족도 향상에. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Effective communication brings lasting benefits for creative design.",
        "chunks": [
          "Effective communication",
          "brings lasting benefits",
          "for creative design."
        ],
        "translation": "효과적인 의사소통은 창의적인 기획 업무를 위해. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Effective communication brings lasting benefits across our company.",
        "chunks": [
          "Effective communication",
          "brings lasting benefits",
          "across our company."
        ],
        "translation": "효과적인 의사소통은 우리 회사 전반에 걸쳐. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Effective communication reduces administrative delays in project collaboration.",
        "chunks": [
          "Effective communication",
          "reduces administrative delays",
          "in project collaboration."
        ],
        "translation": "효과적인 의사소통은 프로젝트 협업에서. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Effective communication reduces administrative delays to workplace satisfaction.",
        "chunks": [
          "Effective communication",
          "reduces administrative delays",
          "to workplace satisfaction."
        ],
        "translation": "효과적인 의사소통은 직장 만족도 향상에. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Effective communication reduces administrative delays for creative design.",
        "chunks": [
          "Effective communication",
          "reduces administrative delays",
          "for creative design."
        ],
        "translation": "효과적인 의사소통은 창의적인 기획 업무를 위해. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Effective communication reduces administrative delays across our company.",
        "chunks": [
          "Effective communication",
          "reduces administrative delays",
          "across our company."
        ],
        "translation": "효과적인 의사소통은 우리 회사 전반에 걸쳐. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Flexible work setups plays key roles in project collaboration.",
        "chunks": [
          "Flexible work setups",
          "plays key roles",
          "in project collaboration."
        ],
        "translation": "유연 근무 환경은 프로젝트 협업에서. 핵심적인 역할을 합니다"
      },
      {
        "text": "Flexible work setups plays key roles to workplace satisfaction.",
        "chunks": [
          "Flexible work setups",
          "plays key roles",
          "to workplace satisfaction."
        ],
        "translation": "유연 근무 환경은 직장 만족도 향상에. 핵심적인 역할을 합니다"
      },
      {
        "text": "Flexible work setups plays key roles for creative design.",
        "chunks": [
          "Flexible work setups",
          "plays key roles",
          "for creative design."
        ],
        "translation": "유연 근무 환경은 창의적인 기획 업무를 위해. 핵심적인 역할을 합니다"
      },
      {
        "text": "Flexible work setups plays key roles across our company.",
        "chunks": [
          "Flexible work setups",
          "plays key roles",
          "across our company."
        ],
        "translation": "유연 근무 환경은 우리 회사 전반에 걸쳐. 핵심적인 역할을 합니다"
      },
      {
        "text": "Flexible work setups contributes quite significantly in project collaboration.",
        "chunks": [
          "Flexible work setups",
          "contributes quite significantly",
          "in project collaboration."
        ],
        "translation": "유연 근무 환경은 프로젝트 협업에서. 상당한 기여를 합니다"
      },
      {
        "text": "Flexible work setups contributes quite significantly to workplace satisfaction.",
        "chunks": [
          "Flexible work setups",
          "contributes quite significantly",
          "to workplace satisfaction."
        ],
        "translation": "유연 근무 환경은 직장 만족도 향상에. 상당한 기여를 합니다"
      },
      {
        "text": "Flexible work setups contributes quite significantly for creative design.",
        "chunks": [
          "Flexible work setups",
          "contributes quite significantly",
          "for creative design."
        ],
        "translation": "유연 근무 환경은 창의적인 기획 업무를 위해. 상당한 기여를 합니다"
      },
      {
        "text": "Flexible work setups contributes quite significantly across our company.",
        "chunks": [
          "Flexible work setups",
          "contributes quite significantly",
          "across our company."
        ],
        "translation": "유연 근무 환경은 우리 회사 전반에 걸쳐. 상당한 기여를 합니다"
      },
      {
        "text": "Flexible work setups gives more freedom in project collaboration.",
        "chunks": [
          "Flexible work setups",
          "gives more freedom",
          "in project collaboration."
        ],
        "translation": "유연 근무 환경은 프로젝트 협업에서. 더 많은 여유를 줍니다"
      },
      {
        "text": "Flexible work setups gives more freedom to workplace satisfaction.",
        "chunks": [
          "Flexible work setups",
          "gives more freedom",
          "to workplace satisfaction."
        ],
        "translation": "유연 근무 환경은 직장 만족도 향상에. 더 많은 여유를 줍니다"
      },
      {
        "text": "Flexible work setups gives more freedom for creative design.",
        "chunks": [
          "Flexible work setups",
          "gives more freedom",
          "for creative design."
        ],
        "translation": "유연 근무 환경은 창의적인 기획 업무를 위해. 더 많은 여유를 줍니다"
      },
      {
        "text": "Flexible work setups gives more freedom across our company.",
        "chunks": [
          "Flexible work setups",
          "gives more freedom",
          "across our company."
        ],
        "translation": "유연 근무 환경은 우리 회사 전반에 걸쳐. 더 많은 여유를 줍니다"
      },
      {
        "text": "Flexible work setups brings lasting benefits in project collaboration.",
        "chunks": [
          "Flexible work setups",
          "brings lasting benefits",
          "in project collaboration."
        ],
        "translation": "유연 근무 환경은 프로젝트 협업에서. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Flexible work setups brings lasting benefits to workplace satisfaction.",
        "chunks": [
          "Flexible work setups",
          "brings lasting benefits",
          "to workplace satisfaction."
        ],
        "translation": "유연 근무 환경은 직장 만족도 향상에. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Flexible work setups brings lasting benefits for creative design.",
        "chunks": [
          "Flexible work setups",
          "brings lasting benefits",
          "for creative design."
        ],
        "translation": "유연 근무 환경은 창의적인 기획 업무를 위해. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Flexible work setups brings lasting benefits across our company.",
        "chunks": [
          "Flexible work setups",
          "brings lasting benefits",
          "across our company."
        ],
        "translation": "유연 근무 환경은 우리 회사 전반에 걸쳐. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Flexible work setups reduces administrative delays in project collaboration.",
        "chunks": [
          "Flexible work setups",
          "reduces administrative delays",
          "in project collaboration."
        ],
        "translation": "유연 근무 환경은 프로젝트 협업에서. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Flexible work setups reduces administrative delays to workplace satisfaction.",
        "chunks": [
          "Flexible work setups",
          "reduces administrative delays",
          "to workplace satisfaction."
        ],
        "translation": "유연 근무 환경은 직장 만족도 향상에. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Flexible work setups reduces administrative delays for creative design.",
        "chunks": [
          "Flexible work setups",
          "reduces administrative delays",
          "for creative design."
        ],
        "translation": "유연 근무 환경은 창의적인 기획 업무를 위해. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Flexible work setups reduces administrative delays across our company.",
        "chunks": [
          "Flexible work setups",
          "reduces administrative delays",
          "across our company."
        ],
        "translation": "유연 근무 환경은 우리 회사 전반에 걸쳐. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Automating daily tasks plays key roles in project collaboration.",
        "chunks": [
          "Automating daily tasks",
          "plays key roles",
          "in project collaboration."
        ],
        "translation": "일일 업무 자동화는 프로젝트 협업에서. 핵심적인 역할을 합니다"
      },
      {
        "text": "Automating daily tasks plays key roles to workplace satisfaction.",
        "chunks": [
          "Automating daily tasks",
          "plays key roles",
          "to workplace satisfaction."
        ],
        "translation": "일일 업무 자동화는 직장 만족도 향상에. 핵심적인 역할을 합니다"
      },
      {
        "text": "Automating daily tasks plays key roles for creative design.",
        "chunks": [
          "Automating daily tasks",
          "plays key roles",
          "for creative design."
        ],
        "translation": "일일 업무 자동화는 창의적인 기획 업무를 위해. 핵심적인 역할을 합니다"
      },
      {
        "text": "Automating daily tasks plays key roles across our company.",
        "chunks": [
          "Automating daily tasks",
          "plays key roles",
          "across our company."
        ],
        "translation": "일일 업무 자동화는 우리 회사 전반에 걸쳐. 핵심적인 역할을 합니다"
      },
      {
        "text": "Automating daily tasks contributes quite significantly in project collaboration.",
        "chunks": [
          "Automating daily tasks",
          "contributes quite significantly",
          "in project collaboration."
        ],
        "translation": "일일 업무 자동화는 프로젝트 협업에서. 상당한 기여를 합니다"
      },
      {
        "text": "Automating daily tasks contributes quite significantly to workplace satisfaction.",
        "chunks": [
          "Automating daily tasks",
          "contributes quite significantly",
          "to workplace satisfaction."
        ],
        "translation": "일일 업무 자동화는 직장 만족도 향상에. 상당한 기여를 합니다"
      },
      {
        "text": "Automating daily tasks contributes quite significantly for creative design.",
        "chunks": [
          "Automating daily tasks",
          "contributes quite significantly",
          "for creative design."
        ],
        "translation": "일일 업무 자동화는 창의적인 기획 업무를 위해. 상당한 기여를 합니다"
      },
      {
        "text": "Automating daily tasks contributes quite significantly across our company.",
        "chunks": [
          "Automating daily tasks",
          "contributes quite significantly",
          "across our company."
        ],
        "translation": "일일 업무 자동화는 우리 회사 전반에 걸쳐. 상당한 기여를 합니다"
      },
      {
        "text": "Automating daily tasks gives more freedom in project collaboration.",
        "chunks": [
          "Automating daily tasks",
          "gives more freedom",
          "in project collaboration."
        ],
        "translation": "일일 업무 자동화는 프로젝트 협업에서. 더 많은 여유를 줍니다"
      },
      {
        "text": "Automating daily tasks gives more freedom to workplace satisfaction.",
        "chunks": [
          "Automating daily tasks",
          "gives more freedom",
          "to workplace satisfaction."
        ],
        "translation": "일일 업무 자동화는 직장 만족도 향상에. 더 많은 여유를 줍니다"
      },
      {
        "text": "Automating daily tasks gives more freedom for creative design.",
        "chunks": [
          "Automating daily tasks",
          "gives more freedom",
          "for creative design."
        ],
        "translation": "일일 업무 자동화는 창의적인 기획 업무를 위해. 더 많은 여유를 줍니다"
      },
      {
        "text": "Automating daily tasks gives more freedom across our company.",
        "chunks": [
          "Automating daily tasks",
          "gives more freedom",
          "across our company."
        ],
        "translation": "일일 업무 자동화는 우리 회사 전반에 걸쳐. 더 많은 여유를 줍니다"
      },
      {
        "text": "Automating daily tasks brings lasting benefits in project collaboration.",
        "chunks": [
          "Automating daily tasks",
          "brings lasting benefits",
          "in project collaboration."
        ],
        "translation": "일일 업무 자동화는 프로젝트 협업에서. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Automating daily tasks brings lasting benefits to workplace satisfaction.",
        "chunks": [
          "Automating daily tasks",
          "brings lasting benefits",
          "to workplace satisfaction."
        ],
        "translation": "일일 업무 자동화는 직장 만족도 향상에. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Automating daily tasks brings lasting benefits for creative design.",
        "chunks": [
          "Automating daily tasks",
          "brings lasting benefits",
          "for creative design."
        ],
        "translation": "일일 업무 자동화는 창의적인 기획 업무를 위해. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Automating daily tasks brings lasting benefits across our company.",
        "chunks": [
          "Automating daily tasks",
          "brings lasting benefits",
          "across our company."
        ],
        "translation": "일일 업무 자동화는 우리 회사 전반에 걸쳐. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Automating daily tasks reduces administrative delays in project collaboration.",
        "chunks": [
          "Automating daily tasks",
          "reduces administrative delays",
          "in project collaboration."
        ],
        "translation": "일일 업무 자동화는 프로젝트 협업에서. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Automating daily tasks reduces administrative delays to workplace satisfaction.",
        "chunks": [
          "Automating daily tasks",
          "reduces administrative delays",
          "to workplace satisfaction."
        ],
        "translation": "일일 업무 자동화는 직장 만족도 향상에. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Automating daily tasks reduces administrative delays for creative design.",
        "chunks": [
          "Automating daily tasks",
          "reduces administrative delays",
          "for creative design."
        ],
        "translation": "일일 업무 자동화는 창의적인 기획 업무를 위해. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Automating daily tasks reduces administrative delays across our company.",
        "chunks": [
          "Automating daily tasks",
          "reduces administrative delays",
          "across our company."
        ],
        "translation": "일일 업무 자동화는 우리 회사 전반에 걸쳐. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Staff training programs plays key roles in project collaboration.",
        "chunks": [
          "Staff training programs",
          "plays key roles",
          "in project collaboration."
        ],
        "translation": "직원 교육 프로그램은 프로젝트 협업에서. 핵심적인 역할을 합니다"
      },
      {
        "text": "Staff training programs plays key roles to workplace satisfaction.",
        "chunks": [
          "Staff training programs",
          "plays key roles",
          "to workplace satisfaction."
        ],
        "translation": "직원 교육 프로그램은 직장 만족도 향상에. 핵심적인 역할을 합니다"
      },
      {
        "text": "Staff training programs plays key roles for creative design.",
        "chunks": [
          "Staff training programs",
          "plays key roles",
          "for creative design."
        ],
        "translation": "직원 교육 프로그램은 창의적인 기획 업무를 위해. 핵심적인 역할을 합니다"
      },
      {
        "text": "Staff training programs plays key roles across our company.",
        "chunks": [
          "Staff training programs",
          "plays key roles",
          "across our company."
        ],
        "translation": "직원 교육 프로그램은 우리 회사 전반에 걸쳐. 핵심적인 역할을 합니다"
      },
      {
        "text": "Staff training programs contributes quite significantly in project collaboration.",
        "chunks": [
          "Staff training programs",
          "contributes quite significantly",
          "in project collaboration."
        ],
        "translation": "직원 교육 프로그램은 프로젝트 협업에서. 상당한 기여를 합니다"
      },
      {
        "text": "Staff training programs contributes quite significantly to workplace satisfaction.",
        "chunks": [
          "Staff training programs",
          "contributes quite significantly",
          "to workplace satisfaction."
        ],
        "translation": "직원 교육 프로그램은 직장 만족도 향상에. 상당한 기여를 합니다"
      },
      {
        "text": "Staff training programs contributes quite significantly for creative design.",
        "chunks": [
          "Staff training programs",
          "contributes quite significantly",
          "for creative design."
        ],
        "translation": "직원 교육 프로그램은 창의적인 기획 업무를 위해. 상당한 기여를 합니다"
      },
      {
        "text": "Staff training programs contributes quite significantly across our company.",
        "chunks": [
          "Staff training programs",
          "contributes quite significantly",
          "across our company."
        ],
        "translation": "직원 교육 프로그램은 우리 회사 전반에 걸쳐. 상당한 기여를 합니다"
      },
      {
        "text": "Staff training programs gives more freedom in project collaboration.",
        "chunks": [
          "Staff training programs",
          "gives more freedom",
          "in project collaboration."
        ],
        "translation": "직원 교육 프로그램은 프로젝트 협업에서. 더 많은 여유를 줍니다"
      },
      {
        "text": "Staff training programs gives more freedom to workplace satisfaction.",
        "chunks": [
          "Staff training programs",
          "gives more freedom",
          "to workplace satisfaction."
        ],
        "translation": "직원 교육 프로그램은 직장 만족도 향상에. 더 많은 여유를 줍니다"
      },
      {
        "text": "Staff training programs gives more freedom for creative design.",
        "chunks": [
          "Staff training programs",
          "gives more freedom",
          "for creative design."
        ],
        "translation": "직원 교육 프로그램은 창의적인 기획 업무를 위해. 더 많은 여유를 줍니다"
      },
      {
        "text": "Staff training programs gives more freedom across our company.",
        "chunks": [
          "Staff training programs",
          "gives more freedom",
          "across our company."
        ],
        "translation": "직원 교육 프로그램은 우리 회사 전반에 걸쳐. 더 많은 여유를 줍니다"
      },
      {
        "text": "Staff training programs brings lasting benefits in project collaboration.",
        "chunks": [
          "Staff training programs",
          "brings lasting benefits",
          "in project collaboration."
        ],
        "translation": "직원 교육 프로그램은 프로젝트 협업에서. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Staff training programs brings lasting benefits to workplace satisfaction.",
        "chunks": [
          "Staff training programs",
          "brings lasting benefits",
          "to workplace satisfaction."
        ],
        "translation": "직원 교육 프로그램은 직장 만족도 향상에. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Staff training programs brings lasting benefits for creative design.",
        "chunks": [
          "Staff training programs",
          "brings lasting benefits",
          "for creative design."
        ],
        "translation": "직원 교육 프로그램은 창의적인 기획 업무를 위해. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Staff training programs brings lasting benefits across our company.",
        "chunks": [
          "Staff training programs",
          "brings lasting benefits",
          "across our company."
        ],
        "translation": "직원 교육 프로그램은 우리 회사 전반에 걸쳐. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Staff training programs reduces administrative delays in project collaboration.",
        "chunks": [
          "Staff training programs",
          "reduces administrative delays",
          "in project collaboration."
        ],
        "translation": "직원 교육 프로그램은 프로젝트 협업에서. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Staff training programs reduces administrative delays to workplace satisfaction.",
        "chunks": [
          "Staff training programs",
          "reduces administrative delays",
          "to workplace satisfaction."
        ],
        "translation": "직원 교육 프로그램은 직장 만족도 향상에. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Staff training programs reduces administrative delays for creative design.",
        "chunks": [
          "Staff training programs",
          "reduces administrative delays",
          "for creative design."
        ],
        "translation": "직원 교육 프로그램은 창의적인 기획 업무를 위해. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Staff training programs reduces administrative delays across our company.",
        "chunks": [
          "Staff training programs",
          "reduces administrative delays",
          "across our company."
        ],
        "translation": "직원 교육 프로그램은 우리 회사 전반에 걸쳐. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Streamlined approval steps plays key roles in project collaboration.",
        "chunks": [
          "Streamlined approval steps",
          "plays key roles",
          "in project collaboration."
        ],
        "translation": "간소화된 결재 단계는 프로젝트 협업에서. 핵심적인 역할을 합니다"
      },
      {
        "text": "Streamlined approval steps plays key roles to workplace satisfaction.",
        "chunks": [
          "Streamlined approval steps",
          "plays key roles",
          "to workplace satisfaction."
        ],
        "translation": "간소화된 결재 단계는 직장 만족도 향상에. 핵심적인 역할을 합니다"
      },
      {
        "text": "Streamlined approval steps plays key roles for creative design.",
        "chunks": [
          "Streamlined approval steps",
          "plays key roles",
          "for creative design."
        ],
        "translation": "간소화된 결재 단계는 창의적인 기획 업무를 위해. 핵심적인 역할을 합니다"
      },
      {
        "text": "Streamlined approval steps plays key roles across our company.",
        "chunks": [
          "Streamlined approval steps",
          "plays key roles",
          "across our company."
        ],
        "translation": "간소화된 결재 단계는 우리 회사 전반에 걸쳐. 핵심적인 역할을 합니다"
      },
      {
        "text": "Streamlined approval steps contributes quite significantly in project collaboration.",
        "chunks": [
          "Streamlined approval steps",
          "contributes quite significantly",
          "in project collaboration."
        ],
        "translation": "간소화된 결재 단계는 프로젝트 협업에서. 상당한 기여를 합니다"
      },
      {
        "text": "Streamlined approval steps contributes quite significantly to workplace satisfaction.",
        "chunks": [
          "Streamlined approval steps",
          "contributes quite significantly",
          "to workplace satisfaction."
        ],
        "translation": "간소화된 결재 단계는 직장 만족도 향상에. 상당한 기여를 합니다"
      },
      {
        "text": "Streamlined approval steps contributes quite significantly for creative design.",
        "chunks": [
          "Streamlined approval steps",
          "contributes quite significantly",
          "for creative design."
        ],
        "translation": "간소화된 결재 단계는 창의적인 기획 업무를 위해. 상당한 기여를 합니다"
      },
      {
        "text": "Streamlined approval steps contributes quite significantly across our company.",
        "chunks": [
          "Streamlined approval steps",
          "contributes quite significantly",
          "across our company."
        ],
        "translation": "간소화된 결재 단계는 우리 회사 전반에 걸쳐. 상당한 기여를 합니다"
      },
      {
        "text": "Streamlined approval steps gives more freedom in project collaboration.",
        "chunks": [
          "Streamlined approval steps",
          "gives more freedom",
          "in project collaboration."
        ],
        "translation": "간소화된 결재 단계는 프로젝트 협업에서. 더 많은 여유를 줍니다"
      },
      {
        "text": "Streamlined approval steps gives more freedom to workplace satisfaction.",
        "chunks": [
          "Streamlined approval steps",
          "gives more freedom",
          "to workplace satisfaction."
        ],
        "translation": "간소화된 결재 단계는 직장 만족도 향상에. 더 많은 여유를 줍니다"
      },
      {
        "text": "Streamlined approval steps gives more freedom for creative design.",
        "chunks": [
          "Streamlined approval steps",
          "gives more freedom",
          "for creative design."
        ],
        "translation": "간소화된 결재 단계는 창의적인 기획 업무를 위해. 더 많은 여유를 줍니다"
      },
      {
        "text": "Streamlined approval steps gives more freedom across our company.",
        "chunks": [
          "Streamlined approval steps",
          "gives more freedom",
          "across our company."
        ],
        "translation": "간소화된 결재 단계는 우리 회사 전반에 걸쳐. 더 많은 여유를 줍니다"
      },
      {
        "text": "Streamlined approval steps brings lasting benefits in project collaboration.",
        "chunks": [
          "Streamlined approval steps",
          "brings lasting benefits",
          "in project collaboration."
        ],
        "translation": "간소화된 결재 단계는 프로젝트 협업에서. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Streamlined approval steps brings lasting benefits to workplace satisfaction.",
        "chunks": [
          "Streamlined approval steps",
          "brings lasting benefits",
          "to workplace satisfaction."
        ],
        "translation": "간소화된 결재 단계는 직장 만족도 향상에. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Streamlined approval steps brings lasting benefits for creative design.",
        "chunks": [
          "Streamlined approval steps",
          "brings lasting benefits",
          "for creative design."
        ],
        "translation": "간소화된 결재 단계는 창의적인 기획 업무를 위해. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Streamlined approval steps brings lasting benefits across our company.",
        "chunks": [
          "Streamlined approval steps",
          "brings lasting benefits",
          "across our company."
        ],
        "translation": "간소화된 결재 단계는 우리 회사 전반에 걸쳐. 오랜 혜택을 가져옵니다"
      },
      {
        "text": "Streamlined approval steps reduces administrative delays in project collaboration.",
        "chunks": [
          "Streamlined approval steps",
          "reduces administrative delays",
          "in project collaboration."
        ],
        "translation": "간소화된 결재 단계는 프로젝트 협업에서. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Streamlined approval steps reduces administrative delays to workplace satisfaction.",
        "chunks": [
          "Streamlined approval steps",
          "reduces administrative delays",
          "to workplace satisfaction."
        ],
        "translation": "간소화된 결재 단계는 직장 만족도 향상에. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Streamlined approval steps reduces administrative delays for creative design.",
        "chunks": [
          "Streamlined approval steps",
          "reduces administrative delays",
          "for creative design."
        ],
        "translation": "간소화된 결재 단계는 창의적인 기획 업무를 위해. 행정적 지연을 줄여줍니다"
      },
      {
        "text": "Streamlined approval steps reduces administrative delays across our company.",
        "chunks": [
          "Streamlined approval steps",
          "reduces administrative delays",
          "across our company."
        ],
        "translation": "간소화된 결재 단계는 우리 회사 전반에 걸쳐. 행정적 지연을 줄여줍니다"
      }
    ],
    "4": [
      {
        "text": "By adopting tools, our project team shares critical documents in real time.",
        "chunks": [
          "By adopting tools,",
          "our project team",
          "shares critical documents",
          "in real time."
        ],
        "translation": "도구를 도입함으로써, 우리 프로젝트 팀은 실시간으로. 중요 서류들을 공유합니다"
      },
      {
        "text": "By adopting tools, our project team shares critical documents without technical delays.",
        "chunks": [
          "By adopting tools,",
          "our project team",
          "shares critical documents",
          "without technical delays."
        ],
        "translation": "도구를 도입함으로써, 우리 프로젝트 팀은 기술적 지연 없이. 중요 서류들을 공유합니다"
      },
      {
        "text": "By adopting tools, our project team achieves revenue growth in real time.",
        "chunks": [
          "By adopting tools,",
          "our project team",
          "achieves revenue growth",
          "in real time."
        ],
        "translation": "도구를 도입함으로써, 우리 프로젝트 팀은 실시간으로. 매출 성장을 달성합니다"
      },
      {
        "text": "By adopting tools, our project team achieves revenue growth without technical delays.",
        "chunks": [
          "By adopting tools,",
          "our project team",
          "achieves revenue growth",
          "without technical delays."
        ],
        "translation": "도구를 도입함으로써, 우리 프로젝트 팀은 기술적 지연 없이. 매출 성장을 달성합니다"
      },
      {
        "text": "By adopting tools, our project team gathers direct feedback in real time.",
        "chunks": [
          "By adopting tools,",
          "our project team",
          "gathers direct feedback",
          "in real time."
        ],
        "translation": "도구를 도입함으로써, 우리 프로젝트 팀은 실시간으로. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "By adopting tools, our project team gathers direct feedback without technical delays.",
        "chunks": [
          "By adopting tools,",
          "our project team",
          "gathers direct feedback",
          "without technical delays."
        ],
        "translation": "도구를 도입함으로써, 우리 프로젝트 팀은 기술적 지연 없이. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "By adopting tools, our project team implements process improvements in real time.",
        "chunks": [
          "By adopting tools,",
          "our project team",
          "implements process improvements",
          "in real time."
        ],
        "translation": "도구를 도입함으로써, 우리 프로젝트 팀은 실시간으로. 프로세스 개선을 실행합니다"
      },
      {
        "text": "By adopting tools, our project team implements process improvements without technical delays.",
        "chunks": [
          "By adopting tools,",
          "our project team",
          "implements process improvements",
          "without technical delays."
        ],
        "translation": "도구를 도입함으로써, 우리 프로젝트 팀은 기술적 지연 없이. 프로세스 개선을 실행합니다"
      },
      {
        "text": "By adopting tools, our project team resolves system errors in real time.",
        "chunks": [
          "By adopting tools,",
          "our project team",
          "resolves system errors",
          "in real time."
        ],
        "translation": "도구를 도입함으로써, 우리 프로젝트 팀은 실시간으로. 시스템 오류를 해결합니다"
      },
      {
        "text": "By adopting tools, our project team resolves system errors without technical delays.",
        "chunks": [
          "By adopting tools,",
          "our project team",
          "resolves system errors",
          "without technical delays."
        ],
        "translation": "도구를 도입함으로써, 우리 프로젝트 팀은 기술적 지연 없이. 시스템 오류를 해결합니다"
      },
      {
        "text": "By adopting tools, every regional branch shares critical documents in real time.",
        "chunks": [
          "By adopting tools,",
          "every regional branch",
          "shares critical documents",
          "in real time."
        ],
        "translation": "도구를 도입함으로써, 모든 지역 지사는 실시간으로. 중요 서류들을 공유합니다"
      },
      {
        "text": "By adopting tools, every regional branch shares critical documents without technical delays.",
        "chunks": [
          "By adopting tools,",
          "every regional branch",
          "shares critical documents",
          "without technical delays."
        ],
        "translation": "도구를 도입함으로써, 모든 지역 지사는 기술적 지연 없이. 중요 서류들을 공유합니다"
      },
      {
        "text": "By adopting tools, every regional branch achieves revenue growth in real time.",
        "chunks": [
          "By adopting tools,",
          "every regional branch",
          "achieves revenue growth",
          "in real time."
        ],
        "translation": "도구를 도입함으로써, 모든 지역 지사는 실시간으로. 매출 성장을 달성합니다"
      },
      {
        "text": "By adopting tools, every regional branch achieves revenue growth without technical delays.",
        "chunks": [
          "By adopting tools,",
          "every regional branch",
          "achieves revenue growth",
          "without technical delays."
        ],
        "translation": "도구를 도입함으로써, 모든 지역 지사는 기술적 지연 없이. 매출 성장을 달성합니다"
      },
      {
        "text": "By adopting tools, every regional branch gathers direct feedback in real time.",
        "chunks": [
          "By adopting tools,",
          "every regional branch",
          "gathers direct feedback",
          "in real time."
        ],
        "translation": "도구를 도입함으로써, 모든 지역 지사는 실시간으로. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "By adopting tools, every regional branch gathers direct feedback without technical delays.",
        "chunks": [
          "By adopting tools,",
          "every regional branch",
          "gathers direct feedback",
          "without technical delays."
        ],
        "translation": "도구를 도입함으로써, 모든 지역 지사는 기술적 지연 없이. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "By adopting tools, every regional branch implements process improvements in real time.",
        "chunks": [
          "By adopting tools,",
          "every regional branch",
          "implements process improvements",
          "in real time."
        ],
        "translation": "도구를 도입함으로써, 모든 지역 지사는 실시간으로. 프로세스 개선을 실행합니다"
      },
      {
        "text": "By adopting tools, every regional branch implements process improvements without technical delays.",
        "chunks": [
          "By adopting tools,",
          "every regional branch",
          "implements process improvements",
          "without technical delays."
        ],
        "translation": "도구를 도입함으로써, 모든 지역 지사는 기술적 지연 없이. 프로세스 개선을 실행합니다"
      },
      {
        "text": "By adopting tools, every regional branch resolves system errors in real time.",
        "chunks": [
          "By adopting tools,",
          "every regional branch",
          "resolves system errors",
          "in real time."
        ],
        "translation": "도구를 도입함으로써, 모든 지역 지사는 실시간으로. 시스템 오류를 해결합니다"
      },
      {
        "text": "By adopting tools, every regional branch resolves system errors without technical delays.",
        "chunks": [
          "By adopting tools,",
          "every regional branch",
          "resolves system errors",
          "without technical delays."
        ],
        "translation": "도구를 도입함으로써, 모든 지역 지사는 기술적 지연 없이. 시스템 오류를 해결합니다"
      },
      {
        "text": "Despite market challenges, our project team shares critical documents in real time.",
        "chunks": [
          "Despite market challenges,",
          "our project team",
          "shares critical documents",
          "in real time."
        ],
        "translation": "시장 난관에도 불구하고, 우리 프로젝트 팀은 실시간으로. 중요 서류들을 공유합니다"
      },
      {
        "text": "Despite market challenges, our project team shares critical documents without technical delays.",
        "chunks": [
          "Despite market challenges,",
          "our project team",
          "shares critical documents",
          "without technical delays."
        ],
        "translation": "시장 난관에도 불구하고, 우리 프로젝트 팀은 기술적 지연 없이. 중요 서류들을 공유합니다"
      },
      {
        "text": "Despite market challenges, our project team achieves revenue growth in real time.",
        "chunks": [
          "Despite market challenges,",
          "our project team",
          "achieves revenue growth",
          "in real time."
        ],
        "translation": "시장 난관에도 불구하고, 우리 프로젝트 팀은 실시간으로. 매출 성장을 달성합니다"
      },
      {
        "text": "Despite market challenges, our project team achieves revenue growth without technical delays.",
        "chunks": [
          "Despite market challenges,",
          "our project team",
          "achieves revenue growth",
          "without technical delays."
        ],
        "translation": "시장 난관에도 불구하고, 우리 프로젝트 팀은 기술적 지연 없이. 매출 성장을 달성합니다"
      },
      {
        "text": "Despite market challenges, our project team gathers direct feedback in real time.",
        "chunks": [
          "Despite market challenges,",
          "our project team",
          "gathers direct feedback",
          "in real time."
        ],
        "translation": "시장 난관에도 불구하고, 우리 프로젝트 팀은 실시간으로. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "Despite market challenges, our project team gathers direct feedback without technical delays.",
        "chunks": [
          "Despite market challenges,",
          "our project team",
          "gathers direct feedback",
          "without technical delays."
        ],
        "translation": "시장 난관에도 불구하고, 우리 프로젝트 팀은 기술적 지연 없이. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "Despite market challenges, our project team implements process improvements in real time.",
        "chunks": [
          "Despite market challenges,",
          "our project team",
          "implements process improvements",
          "in real time."
        ],
        "translation": "시장 난관에도 불구하고, 우리 프로젝트 팀은 실시간으로. 프로세스 개선을 실행합니다"
      },
      {
        "text": "Despite market challenges, our project team implements process improvements without technical delays.",
        "chunks": [
          "Despite market challenges,",
          "our project team",
          "implements process improvements",
          "without technical delays."
        ],
        "translation": "시장 난관에도 불구하고, 우리 프로젝트 팀은 기술적 지연 없이. 프로세스 개선을 실행합니다"
      },
      {
        "text": "Despite market challenges, our project team resolves system errors in real time.",
        "chunks": [
          "Despite market challenges,",
          "our project team",
          "resolves system errors",
          "in real time."
        ],
        "translation": "시장 난관에도 불구하고, 우리 프로젝트 팀은 실시간으로. 시스템 오류를 해결합니다"
      },
      {
        "text": "Despite market challenges, our project team resolves system errors without technical delays.",
        "chunks": [
          "Despite market challenges,",
          "our project team",
          "resolves system errors",
          "without technical delays."
        ],
        "translation": "시장 난관에도 불구하고, 우리 프로젝트 팀은 기술적 지연 없이. 시스템 오류를 해결합니다"
      },
      {
        "text": "Despite market challenges, every regional branch shares critical documents in real time.",
        "chunks": [
          "Despite market challenges,",
          "every regional branch",
          "shares critical documents",
          "in real time."
        ],
        "translation": "시장 난관에도 불구하고, 모든 지역 지사는 실시간으로. 중요 서류들을 공유합니다"
      },
      {
        "text": "Despite market challenges, every regional branch shares critical documents without technical delays.",
        "chunks": [
          "Despite market challenges,",
          "every regional branch",
          "shares critical documents",
          "without technical delays."
        ],
        "translation": "시장 난관에도 불구하고, 모든 지역 지사는 기술적 지연 없이. 중요 서류들을 공유합니다"
      },
      {
        "text": "Despite market challenges, every regional branch achieves revenue growth in real time.",
        "chunks": [
          "Despite market challenges,",
          "every regional branch",
          "achieves revenue growth",
          "in real time."
        ],
        "translation": "시장 난관에도 불구하고, 모든 지역 지사는 실시간으로. 매출 성장을 달성합니다"
      },
      {
        "text": "Despite market challenges, every regional branch achieves revenue growth without technical delays.",
        "chunks": [
          "Despite market challenges,",
          "every regional branch",
          "achieves revenue growth",
          "without technical delays."
        ],
        "translation": "시장 난관에도 불구하고, 모든 지역 지사는 기술적 지연 없이. 매출 성장을 달성합니다"
      },
      {
        "text": "Despite market challenges, every regional branch gathers direct feedback in real time.",
        "chunks": [
          "Despite market challenges,",
          "every regional branch",
          "gathers direct feedback",
          "in real time."
        ],
        "translation": "시장 난관에도 불구하고, 모든 지역 지사는 실시간으로. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "Despite market challenges, every regional branch gathers direct feedback without technical delays.",
        "chunks": [
          "Despite market challenges,",
          "every regional branch",
          "gathers direct feedback",
          "without technical delays."
        ],
        "translation": "시장 난관에도 불구하고, 모든 지역 지사는 기술적 지연 없이. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "Despite market challenges, every regional branch implements process improvements in real time.",
        "chunks": [
          "Despite market challenges,",
          "every regional branch",
          "implements process improvements",
          "in real time."
        ],
        "translation": "시장 난관에도 불구하고, 모든 지역 지사는 실시간으로. 프로세스 개선을 실행합니다"
      },
      {
        "text": "Despite market challenges, every regional branch implements process improvements without technical delays.",
        "chunks": [
          "Despite market challenges,",
          "every regional branch",
          "implements process improvements",
          "without technical delays."
        ],
        "translation": "시장 난관에도 불구하고, 모든 지역 지사는 기술적 지연 없이. 프로세스 개선을 실행합니다"
      },
      {
        "text": "Despite market challenges, every regional branch resolves system errors in real time.",
        "chunks": [
          "Despite market challenges,",
          "every regional branch",
          "resolves system errors",
          "in real time."
        ],
        "translation": "시장 난관에도 불구하고, 모든 지역 지사는 실시간으로. 시스템 오류를 해결합니다"
      },
      {
        "text": "Despite market challenges, every regional branch resolves system errors without technical delays.",
        "chunks": [
          "Despite market challenges,",
          "every regional branch",
          "resolves system errors",
          "without technical delays."
        ],
        "translation": "시장 난관에도 불구하고, 모든 지역 지사는 기술적 지연 없이. 시스템 오류를 해결합니다"
      },
      {
        "text": "To improve quality, our project team shares critical documents in real time.",
        "chunks": [
          "To improve quality,",
          "our project team",
          "shares critical documents",
          "in real time."
        ],
        "translation": "품질을 향상하기 위해, 우리 프로젝트 팀은 실시간으로. 중요 서류들을 공유합니다"
      },
      {
        "text": "To improve quality, our project team shares critical documents without technical delays.",
        "chunks": [
          "To improve quality,",
          "our project team",
          "shares critical documents",
          "without technical delays."
        ],
        "translation": "품질을 향상하기 위해, 우리 프로젝트 팀은 기술적 지연 없이. 중요 서류들을 공유합니다"
      },
      {
        "text": "To improve quality, our project team achieves revenue growth in real time.",
        "chunks": [
          "To improve quality,",
          "our project team",
          "achieves revenue growth",
          "in real time."
        ],
        "translation": "품질을 향상하기 위해, 우리 프로젝트 팀은 실시간으로. 매출 성장을 달성합니다"
      },
      {
        "text": "To improve quality, our project team achieves revenue growth without technical delays.",
        "chunks": [
          "To improve quality,",
          "our project team",
          "achieves revenue growth",
          "without technical delays."
        ],
        "translation": "품질을 향상하기 위해, 우리 프로젝트 팀은 기술적 지연 없이. 매출 성장을 달성합니다"
      },
      {
        "text": "To improve quality, our project team gathers direct feedback in real time.",
        "chunks": [
          "To improve quality,",
          "our project team",
          "gathers direct feedback",
          "in real time."
        ],
        "translation": "품질을 향상하기 위해, 우리 프로젝트 팀은 실시간으로. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "To improve quality, our project team gathers direct feedback without technical delays.",
        "chunks": [
          "To improve quality,",
          "our project team",
          "gathers direct feedback",
          "without technical delays."
        ],
        "translation": "품질을 향상하기 위해, 우리 프로젝트 팀은 기술적 지연 없이. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "To improve quality, our project team implements process improvements in real time.",
        "chunks": [
          "To improve quality,",
          "our project team",
          "implements process improvements",
          "in real time."
        ],
        "translation": "품질을 향상하기 위해, 우리 프로젝트 팀은 실시간으로. 프로세스 개선을 실행합니다"
      },
      {
        "text": "To improve quality, our project team implements process improvements without technical delays.",
        "chunks": [
          "To improve quality,",
          "our project team",
          "implements process improvements",
          "without technical delays."
        ],
        "translation": "품질을 향상하기 위해, 우리 프로젝트 팀은 기술적 지연 없이. 프로세스 개선을 실행합니다"
      },
      {
        "text": "To improve quality, our project team resolves system errors in real time.",
        "chunks": [
          "To improve quality,",
          "our project team",
          "resolves system errors",
          "in real time."
        ],
        "translation": "품질을 향상하기 위해, 우리 프로젝트 팀은 실시간으로. 시스템 오류를 해결합니다"
      },
      {
        "text": "To improve quality, our project team resolves system errors without technical delays.",
        "chunks": [
          "To improve quality,",
          "our project team",
          "resolves system errors",
          "without technical delays."
        ],
        "translation": "품질을 향상하기 위해, 우리 프로젝트 팀은 기술적 지연 없이. 시스템 오류를 해결합니다"
      },
      {
        "text": "To improve quality, every regional branch shares critical documents in real time.",
        "chunks": [
          "To improve quality,",
          "every regional branch",
          "shares critical documents",
          "in real time."
        ],
        "translation": "품질을 향상하기 위해, 모든 지역 지사는 실시간으로. 중요 서류들을 공유합니다"
      },
      {
        "text": "To improve quality, every regional branch shares critical documents without technical delays.",
        "chunks": [
          "To improve quality,",
          "every regional branch",
          "shares critical documents",
          "without technical delays."
        ],
        "translation": "품질을 향상하기 위해, 모든 지역 지사는 기술적 지연 없이. 중요 서류들을 공유합니다"
      },
      {
        "text": "To improve quality, every regional branch achieves revenue growth in real time.",
        "chunks": [
          "To improve quality,",
          "every regional branch",
          "achieves revenue growth",
          "in real time."
        ],
        "translation": "품질을 향상하기 위해, 모든 지역 지사는 실시간으로. 매출 성장을 달성합니다"
      },
      {
        "text": "To improve quality, every regional branch achieves revenue growth without technical delays.",
        "chunks": [
          "To improve quality,",
          "every regional branch",
          "achieves revenue growth",
          "without technical delays."
        ],
        "translation": "품질을 향상하기 위해, 모든 지역 지사는 기술적 지연 없이. 매출 성장을 달성합니다"
      },
      {
        "text": "To improve quality, every regional branch gathers direct feedback in real time.",
        "chunks": [
          "To improve quality,",
          "every regional branch",
          "gathers direct feedback",
          "in real time."
        ],
        "translation": "품질을 향상하기 위해, 모든 지역 지사는 실시간으로. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "To improve quality, every regional branch gathers direct feedback without technical delays.",
        "chunks": [
          "To improve quality,",
          "every regional branch",
          "gathers direct feedback",
          "without technical delays."
        ],
        "translation": "품질을 향상하기 위해, 모든 지역 지사는 기술적 지연 없이. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "To improve quality, every regional branch implements process improvements in real time.",
        "chunks": [
          "To improve quality,",
          "every regional branch",
          "implements process improvements",
          "in real time."
        ],
        "translation": "품질을 향상하기 위해, 모든 지역 지사는 실시간으로. 프로세스 개선을 실행합니다"
      },
      {
        "text": "To improve quality, every regional branch implements process improvements without technical delays.",
        "chunks": [
          "To improve quality,",
          "every regional branch",
          "implements process improvements",
          "without technical delays."
        ],
        "translation": "품질을 향상하기 위해, 모든 지역 지사는 기술적 지연 없이. 프로세스 개선을 실행합니다"
      },
      {
        "text": "To improve quality, every regional branch resolves system errors in real time.",
        "chunks": [
          "To improve quality,",
          "every regional branch",
          "resolves system errors",
          "in real time."
        ],
        "translation": "품질을 향상하기 위해, 모든 지역 지사는 실시간으로. 시스템 오류를 해결합니다"
      },
      {
        "text": "To improve quality, every regional branch resolves system errors without technical delays.",
        "chunks": [
          "To improve quality,",
          "every regional branch",
          "resolves system errors",
          "without technical delays."
        ],
        "translation": "품질을 향상하기 위해, 모든 지역 지사는 기술적 지연 없이. 시스템 오류를 해결합니다"
      },
      {
        "text": "When auditing accounts, our project team shares critical documents in real time.",
        "chunks": [
          "When auditing accounts,",
          "our project team",
          "shares critical documents",
          "in real time."
        ],
        "translation": "회계를 감사할 때, 우리 프로젝트 팀은 실시간으로. 중요 서류들을 공유합니다"
      },
      {
        "text": "When auditing accounts, our project team shares critical documents without technical delays.",
        "chunks": [
          "When auditing accounts,",
          "our project team",
          "shares critical documents",
          "without technical delays."
        ],
        "translation": "회계를 감사할 때, 우리 프로젝트 팀은 기술적 지연 없이. 중요 서류들을 공유합니다"
      },
      {
        "text": "When auditing accounts, our project team achieves revenue growth in real time.",
        "chunks": [
          "When auditing accounts,",
          "our project team",
          "achieves revenue growth",
          "in real time."
        ],
        "translation": "회계를 감사할 때, 우리 프로젝트 팀은 실시간으로. 매출 성장을 달성합니다"
      },
      {
        "text": "When auditing accounts, our project team achieves revenue growth without technical delays.",
        "chunks": [
          "When auditing accounts,",
          "our project team",
          "achieves revenue growth",
          "without technical delays."
        ],
        "translation": "회계를 감사할 때, 우리 프로젝트 팀은 기술적 지연 없이. 매출 성장을 달성합니다"
      },
      {
        "text": "When auditing accounts, our project team gathers direct feedback in real time.",
        "chunks": [
          "When auditing accounts,",
          "our project team",
          "gathers direct feedback",
          "in real time."
        ],
        "translation": "회계를 감사할 때, 우리 프로젝트 팀은 실시간으로. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "When auditing accounts, our project team gathers direct feedback without technical delays.",
        "chunks": [
          "When auditing accounts,",
          "our project team",
          "gathers direct feedback",
          "without technical delays."
        ],
        "translation": "회계를 감사할 때, 우리 프로젝트 팀은 기술적 지연 없이. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "When auditing accounts, our project team implements process improvements in real time.",
        "chunks": [
          "When auditing accounts,",
          "our project team",
          "implements process improvements",
          "in real time."
        ],
        "translation": "회계를 감사할 때, 우리 프로젝트 팀은 실시간으로. 프로세스 개선을 실행합니다"
      },
      {
        "text": "When auditing accounts, our project team implements process improvements without technical delays.",
        "chunks": [
          "When auditing accounts,",
          "our project team",
          "implements process improvements",
          "without technical delays."
        ],
        "translation": "회계를 감사할 때, 우리 프로젝트 팀은 기술적 지연 없이. 프로세스 개선을 실행합니다"
      },
      {
        "text": "When auditing accounts, our project team resolves system errors in real time.",
        "chunks": [
          "When auditing accounts,",
          "our project team",
          "resolves system errors",
          "in real time."
        ],
        "translation": "회계를 감사할 때, 우리 프로젝트 팀은 실시간으로. 시스템 오류를 해결합니다"
      },
      {
        "text": "When auditing accounts, our project team resolves system errors without technical delays.",
        "chunks": [
          "When auditing accounts,",
          "our project team",
          "resolves system errors",
          "without technical delays."
        ],
        "translation": "회계를 감사할 때, 우리 프로젝트 팀은 기술적 지연 없이. 시스템 오류를 해결합니다"
      },
      {
        "text": "When auditing accounts, every regional branch shares critical documents in real time.",
        "chunks": [
          "When auditing accounts,",
          "every regional branch",
          "shares critical documents",
          "in real time."
        ],
        "translation": "회계를 감사할 때, 모든 지역 지사는 실시간으로. 중요 서류들을 공유합니다"
      },
      {
        "text": "When auditing accounts, every regional branch shares critical documents without technical delays.",
        "chunks": [
          "When auditing accounts,",
          "every regional branch",
          "shares critical documents",
          "without technical delays."
        ],
        "translation": "회계를 감사할 때, 모든 지역 지사는 기술적 지연 없이. 중요 서류들을 공유합니다"
      },
      {
        "text": "When auditing accounts, every regional branch achieves revenue growth in real time.",
        "chunks": [
          "When auditing accounts,",
          "every regional branch",
          "achieves revenue growth",
          "in real time."
        ],
        "translation": "회계를 감사할 때, 모든 지역 지사는 실시간으로. 매출 성장을 달성합니다"
      },
      {
        "text": "When auditing accounts, every regional branch achieves revenue growth without technical delays.",
        "chunks": [
          "When auditing accounts,",
          "every regional branch",
          "achieves revenue growth",
          "without technical delays."
        ],
        "translation": "회계를 감사할 때, 모든 지역 지사는 기술적 지연 없이. 매출 성장을 달성합니다"
      },
      {
        "text": "When auditing accounts, every regional branch gathers direct feedback in real time.",
        "chunks": [
          "When auditing accounts,",
          "every regional branch",
          "gathers direct feedback",
          "in real time."
        ],
        "translation": "회계를 감사할 때, 모든 지역 지사는 실시간으로. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "When auditing accounts, every regional branch gathers direct feedback without technical delays.",
        "chunks": [
          "When auditing accounts,",
          "every regional branch",
          "gathers direct feedback",
          "without technical delays."
        ],
        "translation": "회계를 감사할 때, 모든 지역 지사는 기술적 지연 없이. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "When auditing accounts, every regional branch implements process improvements in real time.",
        "chunks": [
          "When auditing accounts,",
          "every regional branch",
          "implements process improvements",
          "in real time."
        ],
        "translation": "회계를 감사할 때, 모든 지역 지사는 실시간으로. 프로세스 개선을 실행합니다"
      },
      {
        "text": "When auditing accounts, every regional branch implements process improvements without technical delays.",
        "chunks": [
          "When auditing accounts,",
          "every regional branch",
          "implements process improvements",
          "without technical delays."
        ],
        "translation": "회계를 감사할 때, 모든 지역 지사는 기술적 지연 없이. 프로세스 개선을 실행합니다"
      },
      {
        "text": "When auditing accounts, every regional branch resolves system errors in real time.",
        "chunks": [
          "When auditing accounts,",
          "every regional branch",
          "resolves system errors",
          "in real time."
        ],
        "translation": "회계를 감사할 때, 모든 지역 지사는 실시간으로. 시스템 오류를 해결합니다"
      },
      {
        "text": "When auditing accounts, every regional branch resolves system errors without technical delays.",
        "chunks": [
          "When auditing accounts,",
          "every regional branch",
          "resolves system errors",
          "without technical delays."
        ],
        "translation": "회계를 감사할 때, 모든 지역 지사는 기술적 지연 없이. 시스템 오류를 해결합니다"
      },
      {
        "text": "After conducting interviews, our project team shares critical documents in real time.",
        "chunks": [
          "After conducting interviews,",
          "our project team",
          "shares critical documents",
          "in real time."
        ],
        "translation": "인터뷰를 진행한 후, 우리 프로젝트 팀은 실시간으로. 중요 서류들을 공유합니다"
      },
      {
        "text": "After conducting interviews, our project team shares critical documents without technical delays.",
        "chunks": [
          "After conducting interviews,",
          "our project team",
          "shares critical documents",
          "without technical delays."
        ],
        "translation": "인터뷰를 진행한 후, 우리 프로젝트 팀은 기술적 지연 없이. 중요 서류들을 공유합니다"
      },
      {
        "text": "After conducting interviews, our project team achieves revenue growth in real time.",
        "chunks": [
          "After conducting interviews,",
          "our project team",
          "achieves revenue growth",
          "in real time."
        ],
        "translation": "인터뷰를 진행한 후, 우리 프로젝트 팀은 실시간으로. 매출 성장을 달성합니다"
      },
      {
        "text": "After conducting interviews, our project team achieves revenue growth without technical delays.",
        "chunks": [
          "After conducting interviews,",
          "our project team",
          "achieves revenue growth",
          "without technical delays."
        ],
        "translation": "인터뷰를 진행한 후, 우리 프로젝트 팀은 기술적 지연 없이. 매출 성장을 달성합니다"
      },
      {
        "text": "After conducting interviews, our project team gathers direct feedback in real time.",
        "chunks": [
          "After conducting interviews,",
          "our project team",
          "gathers direct feedback",
          "in real time."
        ],
        "translation": "인터뷰를 진행한 후, 우리 프로젝트 팀은 실시간으로. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "After conducting interviews, our project team gathers direct feedback without technical delays.",
        "chunks": [
          "After conducting interviews,",
          "our project team",
          "gathers direct feedback",
          "without technical delays."
        ],
        "translation": "인터뷰를 진행한 후, 우리 프로젝트 팀은 기술적 지연 없이. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "After conducting interviews, our project team implements process improvements in real time.",
        "chunks": [
          "After conducting interviews,",
          "our project team",
          "implements process improvements",
          "in real time."
        ],
        "translation": "인터뷰를 진행한 후, 우리 프로젝트 팀은 실시간으로. 프로세스 개선을 실행합니다"
      },
      {
        "text": "After conducting interviews, our project team implements process improvements without technical delays.",
        "chunks": [
          "After conducting interviews,",
          "our project team",
          "implements process improvements",
          "without technical delays."
        ],
        "translation": "인터뷰를 진행한 후, 우리 프로젝트 팀은 기술적 지연 없이. 프로세스 개선을 실행합니다"
      },
      {
        "text": "After conducting interviews, our project team resolves system errors in real time.",
        "chunks": [
          "After conducting interviews,",
          "our project team",
          "resolves system errors",
          "in real time."
        ],
        "translation": "인터뷰를 진행한 후, 우리 프로젝트 팀은 실시간으로. 시스템 오류를 해결합니다"
      },
      {
        "text": "After conducting interviews, our project team resolves system errors without technical delays.",
        "chunks": [
          "After conducting interviews,",
          "our project team",
          "resolves system errors",
          "without technical delays."
        ],
        "translation": "인터뷰를 진행한 후, 우리 프로젝트 팀은 기술적 지연 없이. 시스템 오류를 해결합니다"
      },
      {
        "text": "After conducting interviews, every regional branch shares critical documents in real time.",
        "chunks": [
          "After conducting interviews,",
          "every regional branch",
          "shares critical documents",
          "in real time."
        ],
        "translation": "인터뷰를 진행한 후, 모든 지역 지사는 실시간으로. 중요 서류들을 공유합니다"
      },
      {
        "text": "After conducting interviews, every regional branch shares critical documents without technical delays.",
        "chunks": [
          "After conducting interviews,",
          "every regional branch",
          "shares critical documents",
          "without technical delays."
        ],
        "translation": "인터뷰를 진행한 후, 모든 지역 지사는 기술적 지연 없이. 중요 서류들을 공유합니다"
      },
      {
        "text": "After conducting interviews, every regional branch achieves revenue growth in real time.",
        "chunks": [
          "After conducting interviews,",
          "every regional branch",
          "achieves revenue growth",
          "in real time."
        ],
        "translation": "인터뷰를 진행한 후, 모든 지역 지사는 실시간으로. 매출 성장을 달성합니다"
      },
      {
        "text": "After conducting interviews, every regional branch achieves revenue growth without technical delays.",
        "chunks": [
          "After conducting interviews,",
          "every regional branch",
          "achieves revenue growth",
          "without technical delays."
        ],
        "translation": "인터뷰를 진행한 후, 모든 지역 지사는 기술적 지연 없이. 매출 성장을 달성합니다"
      },
      {
        "text": "After conducting interviews, every regional branch gathers direct feedback in real time.",
        "chunks": [
          "After conducting interviews,",
          "every regional branch",
          "gathers direct feedback",
          "in real time."
        ],
        "translation": "인터뷰를 진행한 후, 모든 지역 지사는 실시간으로. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "After conducting interviews, every regional branch gathers direct feedback without technical delays.",
        "chunks": [
          "After conducting interviews,",
          "every regional branch",
          "gathers direct feedback",
          "without technical delays."
        ],
        "translation": "인터뷰를 진행한 후, 모든 지역 지사는 기술적 지연 없이. 직접적인 피드백을 수집합니다"
      },
      {
        "text": "After conducting interviews, every regional branch implements process improvements in real time.",
        "chunks": [
          "After conducting interviews,",
          "every regional branch",
          "implements process improvements",
          "in real time."
        ],
        "translation": "인터뷰를 진행한 후, 모든 지역 지사는 실시간으로. 프로세스 개선을 실행합니다"
      },
      {
        "text": "After conducting interviews, every regional branch implements process improvements without technical delays.",
        "chunks": [
          "After conducting interviews,",
          "every regional branch",
          "implements process improvements",
          "without technical delays."
        ],
        "translation": "인터뷰를 진행한 후, 모든 지역 지사는 기술적 지연 없이. 프로세스 개선을 실행합니다"
      },
      {
        "text": "After conducting interviews, every regional branch resolves system errors in real time.",
        "chunks": [
          "After conducting interviews,",
          "every regional branch",
          "resolves system errors",
          "in real time."
        ],
        "translation": "인터뷰를 진행한 후, 모든 지역 지사는 실시간으로. 시스템 오류를 해결합니다"
      },
      {
        "text": "After conducting interviews, every regional branch resolves system errors without technical delays.",
        "chunks": [
          "After conducting interviews,",
          "every regional branch",
          "resolves system errors",
          "without technical delays."
        ],
        "translation": "인터뷰를 진행한 후, 모든 지역 지사는 기술적 지연 없이. 시스템 오류를 해결합니다"
      }
    ]
  },
  "B2": {
    "2": [
      {
        "text": "We successfully negotiated international contract terms.",
        "chunks": [
          "We successfully negotiated",
          "international contract terms."
        ],
        "translation": "우리는 성공적으로 협상했습니다 국제 계약 조건들을."
      },
      {
        "text": "We successfully negotiated essential for advancement.",
        "chunks": [
          "We successfully negotiated",
          "essential for advancement."
        ],
        "translation": "우리는 성공적으로 협상했습니다 성장을 위해 필수적입니다."
      },
      {
        "text": "We successfully negotiated exceeded market forecasts.",
        "chunks": [
          "We successfully negotiated",
          "exceeded market forecasts."
        ],
        "translation": "우리는 성공적으로 협상했습니다 시장 전망치를 초과했습니다."
      },
      {
        "text": "We successfully negotiated streamlined engineering cycles.",
        "chunks": [
          "We successfully negotiated",
          "streamlined engineering cycles."
        ],
        "translation": "우리는 성공적으로 협상했습니다 개발 주기를 간소화했습니다."
      },
      {
        "text": "We successfully negotiated boosts strategic initiatives.",
        "chunks": [
          "We successfully negotiated",
          "boosts strategic initiatives."
        ],
        "translation": "우리는 성공적으로 협상했습니다 전략적 이니셔티브를 촉진합니다."
      },
      {
        "text": "We successfully negotiated mitigates logistics bottlenecks.",
        "chunks": [
          "We successfully negotiated",
          "mitigates logistics bottlenecks."
        ],
        "translation": "우리는 성공적으로 협상했습니다 물류 병목 현상을 완화합니다."
      },
      {
        "text": "We successfully negotiated decisive organizational actions.",
        "chunks": [
          "We successfully negotiated",
          "decisive organizational actions."
        ],
        "translation": "우리는 성공적으로 협상했습니다 결단력 있는 조직적 조치를."
      },
      {
        "text": "We successfully negotiated emphasized strict compliance.",
        "chunks": [
          "We successfully negotiated",
          "emphasized strict compliance."
        ],
        "translation": "우리는 성공적으로 협상했습니다 엄격한 준법을 강조했습니다."
      },
      {
        "text": "We successfully negotiated reveals untapped opportunities.",
        "chunks": [
          "We successfully negotiated",
          "reveals untapped opportunities."
        ],
        "translation": "우리는 성공적으로 협상했습니다 미개척 기회를 발굴합니다."
      },
      {
        "text": "We successfully negotiated secures organizational viability.",
        "chunks": [
          "We successfully negotiated",
          "secures organizational viability."
        ],
        "translation": "우리는 성공적으로 협상했습니다 조직의 생존력을 확보합니다."
      },
      {
        "text": "Continuous professional learning international contract terms.",
        "chunks": [
          "Continuous professional learning",
          "international contract terms."
        ],
        "translation": "지속적인 전문 학습은 국제 계약 조건들을."
      },
      {
        "text": "Continuous professional learning essential for advancement.",
        "chunks": [
          "Continuous professional learning",
          "essential for advancement."
        ],
        "translation": "지속적인 전문 학습은 성장을 위해 필수적입니다."
      },
      {
        "text": "Continuous professional learning exceeded market forecasts.",
        "chunks": [
          "Continuous professional learning",
          "exceeded market forecasts."
        ],
        "translation": "지속적인 전문 학습은 시장 전망치를 초과했습니다."
      },
      {
        "text": "Continuous professional learning streamlined engineering cycles.",
        "chunks": [
          "Continuous professional learning",
          "streamlined engineering cycles."
        ],
        "translation": "지속적인 전문 학습은 개발 주기를 간소화했습니다."
      },
      {
        "text": "Continuous professional learning boosts strategic initiatives.",
        "chunks": [
          "Continuous professional learning",
          "boosts strategic initiatives."
        ],
        "translation": "지속적인 전문 학습은 전략적 이니셔티브를 촉진합니다."
      },
      {
        "text": "Continuous professional learning mitigates logistics bottlenecks.",
        "chunks": [
          "Continuous professional learning",
          "mitigates logistics bottlenecks."
        ],
        "translation": "지속적인 전문 학습은 물류 병목 현상을 완화합니다."
      },
      {
        "text": "Continuous professional learning decisive organizational actions.",
        "chunks": [
          "Continuous professional learning",
          "decisive organizational actions."
        ],
        "translation": "지속적인 전문 학습은 결단력 있는 조직적 조치를."
      },
      {
        "text": "Continuous professional learning emphasized strict compliance.",
        "chunks": [
          "Continuous professional learning",
          "emphasized strict compliance."
        ],
        "translation": "지속적인 전문 학습은 엄격한 준법을 강조했습니다."
      },
      {
        "text": "Continuous professional learning reveals untapped opportunities.",
        "chunks": [
          "Continuous professional learning",
          "reveals untapped opportunities."
        ],
        "translation": "지속적인 전문 학습은 미개척 기회를 발굴합니다."
      },
      {
        "text": "Continuous professional learning secures organizational viability.",
        "chunks": [
          "Continuous professional learning",
          "secures organizational viability."
        ],
        "translation": "지속적인 전문 학습은 조직의 생존력을 확보합니다."
      },
      {
        "text": "Quarterly operating revenue international contract terms.",
        "chunks": [
          "Quarterly operating revenue",
          "international contract terms."
        ],
        "translation": "분기별 영업 수익은 국제 계약 조건들을."
      },
      {
        "text": "Quarterly operating revenue essential for advancement.",
        "chunks": [
          "Quarterly operating revenue",
          "essential for advancement."
        ],
        "translation": "분기별 영업 수익은 성장을 위해 필수적입니다."
      },
      {
        "text": "Quarterly operating revenue exceeded market forecasts.",
        "chunks": [
          "Quarterly operating revenue",
          "exceeded market forecasts."
        ],
        "translation": "분기별 영업 수익은 시장 전망치를 초과했습니다."
      },
      {
        "text": "Quarterly operating revenue streamlined engineering cycles.",
        "chunks": [
          "Quarterly operating revenue",
          "streamlined engineering cycles."
        ],
        "translation": "분기별 영업 수익은 개발 주기를 간소화했습니다."
      },
      {
        "text": "Quarterly operating revenue boosts strategic initiatives.",
        "chunks": [
          "Quarterly operating revenue",
          "boosts strategic initiatives."
        ],
        "translation": "분기별 영업 수익은 전략적 이니셔티브를 촉진합니다."
      },
      {
        "text": "Quarterly operating revenue mitigates logistics bottlenecks.",
        "chunks": [
          "Quarterly operating revenue",
          "mitigates logistics bottlenecks."
        ],
        "translation": "분기별 영업 수익은 물류 병목 현상을 완화합니다."
      },
      {
        "text": "Quarterly operating revenue decisive organizational actions.",
        "chunks": [
          "Quarterly operating revenue",
          "decisive organizational actions."
        ],
        "translation": "분기별 영업 수익은 결단력 있는 조직적 조치를."
      },
      {
        "text": "Quarterly operating revenue emphasized strict compliance.",
        "chunks": [
          "Quarterly operating revenue",
          "emphasized strict compliance."
        ],
        "translation": "분기별 영업 수익은 엄격한 준법을 강조했습니다."
      },
      {
        "text": "Quarterly operating revenue reveals untapped opportunities.",
        "chunks": [
          "Quarterly operating revenue",
          "reveals untapped opportunities."
        ],
        "translation": "분기별 영업 수익은 미개척 기회를 발굴합니다."
      },
      {
        "text": "Quarterly operating revenue secures organizational viability.",
        "chunks": [
          "Quarterly operating revenue",
          "secures organizational viability."
        ],
        "translation": "분기별 영업 수익은 조직의 생존력을 확보합니다."
      },
      {
        "text": "Implementing agile frameworks international contract terms.",
        "chunks": [
          "Implementing agile frameworks",
          "international contract terms."
        ],
        "translation": "애자일 프레임워크 도입은 국제 계약 조건들을."
      },
      {
        "text": "Implementing agile frameworks essential for advancement.",
        "chunks": [
          "Implementing agile frameworks",
          "essential for advancement."
        ],
        "translation": "애자일 프레임워크 도입은 성장을 위해 필수적입니다."
      },
      {
        "text": "Implementing agile frameworks exceeded market forecasts.",
        "chunks": [
          "Implementing agile frameworks",
          "exceeded market forecasts."
        ],
        "translation": "애자일 프레임워크 도입은 시장 전망치를 초과했습니다."
      },
      {
        "text": "Implementing agile frameworks streamlined engineering cycles.",
        "chunks": [
          "Implementing agile frameworks",
          "streamlined engineering cycles."
        ],
        "translation": "애자일 프레임워크 도입은 개발 주기를 간소화했습니다."
      },
      {
        "text": "Implementing agile frameworks boosts strategic initiatives.",
        "chunks": [
          "Implementing agile frameworks",
          "boosts strategic initiatives."
        ],
        "translation": "애자일 프레임워크 도입은 전략적 이니셔티브를 촉진합니다."
      },
      {
        "text": "Implementing agile frameworks mitigates logistics bottlenecks.",
        "chunks": [
          "Implementing agile frameworks",
          "mitigates logistics bottlenecks."
        ],
        "translation": "애자일 프레임워크 도입은 물류 병목 현상을 완화합니다."
      },
      {
        "text": "Implementing agile frameworks decisive organizational actions.",
        "chunks": [
          "Implementing agile frameworks",
          "decisive organizational actions."
        ],
        "translation": "애자일 프레임워크 도입은 결단력 있는 조직적 조치를."
      },
      {
        "text": "Implementing agile frameworks emphasized strict compliance.",
        "chunks": [
          "Implementing agile frameworks",
          "emphasized strict compliance."
        ],
        "translation": "애자일 프레임워크 도입은 엄격한 준법을 강조했습니다."
      },
      {
        "text": "Implementing agile frameworks reveals untapped opportunities.",
        "chunks": [
          "Implementing agile frameworks",
          "reveals untapped opportunities."
        ],
        "translation": "애자일 프레임워크 도입은 미개척 기회를 발굴합니다."
      },
      {
        "text": "Implementing agile frameworks secures organizational viability.",
        "chunks": [
          "Implementing agile frameworks",
          "secures organizational viability."
        ],
        "translation": "애자일 프레임워크 도입은 조직의 생존력을 확보합니다."
      },
      {
        "text": "Allocating capital resources international contract terms.",
        "chunks": [
          "Allocating capital resources",
          "international contract terms."
        ],
        "translation": "자본 자원을 배분하는 것은 국제 계약 조건들을."
      },
      {
        "text": "Allocating capital resources essential for advancement.",
        "chunks": [
          "Allocating capital resources",
          "essential for advancement."
        ],
        "translation": "자본 자원을 배분하는 것은 성장을 위해 필수적입니다."
      },
      {
        "text": "Allocating capital resources exceeded market forecasts.",
        "chunks": [
          "Allocating capital resources",
          "exceeded market forecasts."
        ],
        "translation": "자본 자원을 배분하는 것은 시장 전망치를 초과했습니다."
      },
      {
        "text": "Allocating capital resources streamlined engineering cycles.",
        "chunks": [
          "Allocating capital resources",
          "streamlined engineering cycles."
        ],
        "translation": "자본 자원을 배분하는 것은 개발 주기를 간소화했습니다."
      },
      {
        "text": "Allocating capital resources boosts strategic initiatives.",
        "chunks": [
          "Allocating capital resources",
          "boosts strategic initiatives."
        ],
        "translation": "자본 자원을 배분하는 것은 전략적 이니셔티브를 촉진합니다."
      },
      {
        "text": "Allocating capital resources mitigates logistics bottlenecks.",
        "chunks": [
          "Allocating capital resources",
          "mitigates logistics bottlenecks."
        ],
        "translation": "자본 자원을 배분하는 것은 물류 병목 현상을 완화합니다."
      },
      {
        "text": "Allocating capital resources decisive organizational actions.",
        "chunks": [
          "Allocating capital resources",
          "decisive organizational actions."
        ],
        "translation": "자본 자원을 배분하는 것은 결단력 있는 조직적 조치를."
      },
      {
        "text": "Allocating capital resources emphasized strict compliance.",
        "chunks": [
          "Allocating capital resources",
          "emphasized strict compliance."
        ],
        "translation": "자본 자원을 배분하는 것은 엄격한 준법을 강조했습니다."
      },
      {
        "text": "Allocating capital resources reveals untapped opportunities.",
        "chunks": [
          "Allocating capital resources",
          "reveals untapped opportunities."
        ],
        "translation": "자본 자원을 배분하는 것은 미개척 기회를 발굴합니다."
      },
      {
        "text": "Allocating capital resources secures organizational viability.",
        "chunks": [
          "Allocating capital resources",
          "secures organizational viability."
        ],
        "translation": "자본 자원을 배분하는 것은 조직의 생존력을 확보합니다."
      },
      {
        "text": "Strengthening supply chains international contract terms.",
        "chunks": [
          "Strengthening supply chains",
          "international contract terms."
        ],
        "translation": "공급망을 강화하는 것은 국제 계약 조건들을."
      },
      {
        "text": "Strengthening supply chains essential for advancement.",
        "chunks": [
          "Strengthening supply chains",
          "essential for advancement."
        ],
        "translation": "공급망을 강화하는 것은 성장을 위해 필수적입니다."
      },
      {
        "text": "Strengthening supply chains exceeded market forecasts.",
        "chunks": [
          "Strengthening supply chains",
          "exceeded market forecasts."
        ],
        "translation": "공급망을 강화하는 것은 시장 전망치를 초과했습니다."
      },
      {
        "text": "Strengthening supply chains streamlined engineering cycles.",
        "chunks": [
          "Strengthening supply chains",
          "streamlined engineering cycles."
        ],
        "translation": "공급망을 강화하는 것은 개발 주기를 간소화했습니다."
      },
      {
        "text": "Strengthening supply chains boosts strategic initiatives.",
        "chunks": [
          "Strengthening supply chains",
          "boosts strategic initiatives."
        ],
        "translation": "공급망을 강화하는 것은 전략적 이니셔티브를 촉진합니다."
      },
      {
        "text": "Strengthening supply chains mitigates logistics bottlenecks.",
        "chunks": [
          "Strengthening supply chains",
          "mitigates logistics bottlenecks."
        ],
        "translation": "공급망을 강화하는 것은 물류 병목 현상을 완화합니다."
      },
      {
        "text": "Strengthening supply chains decisive organizational actions.",
        "chunks": [
          "Strengthening supply chains",
          "decisive organizational actions."
        ],
        "translation": "공급망을 강화하는 것은 결단력 있는 조직적 조치를."
      },
      {
        "text": "Strengthening supply chains emphasized strict compliance.",
        "chunks": [
          "Strengthening supply chains",
          "emphasized strict compliance."
        ],
        "translation": "공급망을 강화하는 것은 엄격한 준법을 강조했습니다."
      },
      {
        "text": "Strengthening supply chains reveals untapped opportunities.",
        "chunks": [
          "Strengthening supply chains",
          "reveals untapped opportunities."
        ],
        "translation": "공급망을 강화하는 것은 미개척 기회를 발굴합니다."
      },
      {
        "text": "Strengthening supply chains secures organizational viability.",
        "chunks": [
          "Strengthening supply chains",
          "secures organizational viability."
        ],
        "translation": "공급망을 강화하는 것은 조직의 생존력을 확보합니다."
      },
      {
        "text": "Market volatility demands international contract terms.",
        "chunks": [
          "Market volatility demands",
          "international contract terms."
        ],
        "translation": "시장의 변동성은 요구합니다 국제 계약 조건들을."
      },
      {
        "text": "Market volatility demands essential for advancement.",
        "chunks": [
          "Market volatility demands",
          "essential for advancement."
        ],
        "translation": "시장의 변동성은 요구합니다 성장을 위해 필수적입니다."
      },
      {
        "text": "Market volatility demands exceeded market forecasts.",
        "chunks": [
          "Market volatility demands",
          "exceeded market forecasts."
        ],
        "translation": "시장의 변동성은 요구합니다 시장 전망치를 초과했습니다."
      },
      {
        "text": "Market volatility demands streamlined engineering cycles.",
        "chunks": [
          "Market volatility demands",
          "streamlined engineering cycles."
        ],
        "translation": "시장의 변동성은 요구합니다 개발 주기를 간소화했습니다."
      },
      {
        "text": "Market volatility demands boosts strategic initiatives.",
        "chunks": [
          "Market volatility demands",
          "boosts strategic initiatives."
        ],
        "translation": "시장의 변동성은 요구합니다 전략적 이니셔티브를 촉진합니다."
      },
      {
        "text": "Market volatility demands mitigates logistics bottlenecks.",
        "chunks": [
          "Market volatility demands",
          "mitigates logistics bottlenecks."
        ],
        "translation": "시장의 변동성은 요구합니다 물류 병목 현상을 완화합니다."
      },
      {
        "text": "Market volatility demands decisive organizational actions.",
        "chunks": [
          "Market volatility demands",
          "decisive organizational actions."
        ],
        "translation": "시장의 변동성은 요구합니다 결단력 있는 조직적 조치를."
      },
      {
        "text": "Market volatility demands emphasized strict compliance.",
        "chunks": [
          "Market volatility demands",
          "emphasized strict compliance."
        ],
        "translation": "시장의 변동성은 요구합니다 엄격한 준법을 강조했습니다."
      },
      {
        "text": "Market volatility demands reveals untapped opportunities.",
        "chunks": [
          "Market volatility demands",
          "reveals untapped opportunities."
        ],
        "translation": "시장의 변동성은 요구합니다 미개척 기회를 발굴합니다."
      },
      {
        "text": "Market volatility demands secures organizational viability.",
        "chunks": [
          "Market volatility demands",
          "secures organizational viability."
        ],
        "translation": "시장의 변동성은 요구합니다 조직의 생존력을 확보합니다."
      },
      {
        "text": "The leadership team international contract terms.",
        "chunks": [
          "The leadership team",
          "international contract terms."
        ],
        "translation": "경영진 리더십 팀은 국제 계약 조건들을."
      },
      {
        "text": "The leadership team essential for advancement.",
        "chunks": [
          "The leadership team",
          "essential for advancement."
        ],
        "translation": "경영진 리더십 팀은 성장을 위해 필수적입니다."
      },
      {
        "text": "The leadership team exceeded market forecasts.",
        "chunks": [
          "The leadership team",
          "exceeded market forecasts."
        ],
        "translation": "경영진 리더십 팀은 시장 전망치를 초과했습니다."
      },
      {
        "text": "The leadership team streamlined engineering cycles.",
        "chunks": [
          "The leadership team",
          "streamlined engineering cycles."
        ],
        "translation": "경영진 리더십 팀은 개발 주기를 간소화했습니다."
      },
      {
        "text": "The leadership team boosts strategic initiatives.",
        "chunks": [
          "The leadership team",
          "boosts strategic initiatives."
        ],
        "translation": "경영진 리더십 팀은 전략적 이니셔티브를 촉진합니다."
      },
      {
        "text": "The leadership team mitigates logistics bottlenecks.",
        "chunks": [
          "The leadership team",
          "mitigates logistics bottlenecks."
        ],
        "translation": "경영진 리더십 팀은 물류 병목 현상을 완화합니다."
      },
      {
        "text": "The leadership team decisive organizational actions.",
        "chunks": [
          "The leadership team",
          "decisive organizational actions."
        ],
        "translation": "경영진 리더십 팀은 결단력 있는 조직적 조치를."
      },
      {
        "text": "The leadership team emphasized strict compliance.",
        "chunks": [
          "The leadership team",
          "emphasized strict compliance."
        ],
        "translation": "경영진 리더십 팀은 엄격한 준법을 강조했습니다."
      },
      {
        "text": "The leadership team reveals untapped opportunities.",
        "chunks": [
          "The leadership team",
          "reveals untapped opportunities."
        ],
        "translation": "경영진 리더십 팀은 미개척 기회를 발굴합니다."
      },
      {
        "text": "The leadership team secures organizational viability.",
        "chunks": [
          "The leadership team",
          "secures organizational viability."
        ],
        "translation": "경영진 리더십 팀은 조직의 생존력을 확보합니다."
      },
      {
        "text": "Competitor benchmark analysis international contract terms.",
        "chunks": [
          "Competitor benchmark analysis",
          "international contract terms."
        ],
        "translation": "경쟁사 벤치마킹 분석은 국제 계약 조건들을."
      },
      {
        "text": "Competitor benchmark analysis essential for advancement.",
        "chunks": [
          "Competitor benchmark analysis",
          "essential for advancement."
        ],
        "translation": "경쟁사 벤치마킹 분석은 성장을 위해 필수적입니다."
      },
      {
        "text": "Competitor benchmark analysis exceeded market forecasts.",
        "chunks": [
          "Competitor benchmark analysis",
          "exceeded market forecasts."
        ],
        "translation": "경쟁사 벤치마킹 분석은 시장 전망치를 초과했습니다."
      },
      {
        "text": "Competitor benchmark analysis streamlined engineering cycles.",
        "chunks": [
          "Competitor benchmark analysis",
          "streamlined engineering cycles."
        ],
        "translation": "경쟁사 벤치마킹 분석은 개발 주기를 간소화했습니다."
      },
      {
        "text": "Competitor benchmark analysis boosts strategic initiatives.",
        "chunks": [
          "Competitor benchmark analysis",
          "boosts strategic initiatives."
        ],
        "translation": "경쟁사 벤치마킹 분석은 전략적 이니셔티브를 촉진합니다."
      },
      {
        "text": "Competitor benchmark analysis mitigates logistics bottlenecks.",
        "chunks": [
          "Competitor benchmark analysis",
          "mitigates logistics bottlenecks."
        ],
        "translation": "경쟁사 벤치마킹 분석은 물류 병목 현상을 완화합니다."
      },
      {
        "text": "Competitor benchmark analysis decisive organizational actions.",
        "chunks": [
          "Competitor benchmark analysis",
          "decisive organizational actions."
        ],
        "translation": "경쟁사 벤치마킹 분석은 결단력 있는 조직적 조치를."
      },
      {
        "text": "Competitor benchmark analysis emphasized strict compliance.",
        "chunks": [
          "Competitor benchmark analysis",
          "emphasized strict compliance."
        ],
        "translation": "경쟁사 벤치마킹 분석은 엄격한 준법을 강조했습니다."
      },
      {
        "text": "Competitor benchmark analysis reveals untapped opportunities.",
        "chunks": [
          "Competitor benchmark analysis",
          "reveals untapped opportunities."
        ],
        "translation": "경쟁사 벤치마킹 분석은 미개척 기회를 발굴합니다."
      },
      {
        "text": "Competitor benchmark analysis secures organizational viability.",
        "chunks": [
          "Competitor benchmark analysis",
          "secures organizational viability."
        ],
        "translation": "경쟁사 벤치마킹 분석은 조직의 생존력을 확보합니다."
      },
      {
        "text": "Disciplined financial budgeting international contract terms.",
        "chunks": [
          "Disciplined financial budgeting",
          "international contract terms."
        ],
        "translation": "절제된 재무 예산 편성은 국제 계약 조건들을."
      },
      {
        "text": "Disciplined financial budgeting essential for advancement.",
        "chunks": [
          "Disciplined financial budgeting",
          "essential for advancement."
        ],
        "translation": "절제된 재무 예산 편성은 성장을 위해 필수적입니다."
      },
      {
        "text": "Disciplined financial budgeting exceeded market forecasts.",
        "chunks": [
          "Disciplined financial budgeting",
          "exceeded market forecasts."
        ],
        "translation": "절제된 재무 예산 편성은 시장 전망치를 초과했습니다."
      },
      {
        "text": "Disciplined financial budgeting streamlined engineering cycles.",
        "chunks": [
          "Disciplined financial budgeting",
          "streamlined engineering cycles."
        ],
        "translation": "절제된 재무 예산 편성은 개발 주기를 간소화했습니다."
      },
      {
        "text": "Disciplined financial budgeting boosts strategic initiatives.",
        "chunks": [
          "Disciplined financial budgeting",
          "boosts strategic initiatives."
        ],
        "translation": "절제된 재무 예산 편성은 전략적 이니셔티브를 촉진합니다."
      },
      {
        "text": "Disciplined financial budgeting mitigates logistics bottlenecks.",
        "chunks": [
          "Disciplined financial budgeting",
          "mitigates logistics bottlenecks."
        ],
        "translation": "절제된 재무 예산 편성은 물류 병목 현상을 완화합니다."
      },
      {
        "text": "Disciplined financial budgeting decisive organizational actions.",
        "chunks": [
          "Disciplined financial budgeting",
          "decisive organizational actions."
        ],
        "translation": "절제된 재무 예산 편성은 결단력 있는 조직적 조치를."
      },
      {
        "text": "Disciplined financial budgeting emphasized strict compliance.",
        "chunks": [
          "Disciplined financial budgeting",
          "emphasized strict compliance."
        ],
        "translation": "절제된 재무 예산 편성은 엄격한 준법을 강조했습니다."
      },
      {
        "text": "Disciplined financial budgeting reveals untapped opportunities.",
        "chunks": [
          "Disciplined financial budgeting",
          "reveals untapped opportunities."
        ],
        "translation": "절제된 재무 예산 편성은 미개척 기회를 발굴합니다."
      },
      {
        "text": "Disciplined financial budgeting secures organizational viability.",
        "chunks": [
          "Disciplined financial budgeting",
          "secures organizational viability."
        ],
        "translation": "절제된 재무 예산 편성은 조직의 생존력을 확보합니다."
      }
    ],
    "3": [
      {
        "text": "Our executive committee evaluates market performance to maintain advantages.",
        "chunks": [
          "Our executive committee",
          "evaluates market performance",
          "to maintain advantages."
        ],
        "translation": "우리 경영위원회는 우위를 유지하기 위해. 시장 성과를 평가합니다"
      },
      {
        "text": "Our executive committee evaluates market performance amid changing conditions.",
        "chunks": [
          "Our executive committee",
          "evaluates market performance",
          "amid changing conditions."
        ],
        "translation": "우리 경영위원회는 변화하는 환경 속에서. 시장 성과를 평가합니다"
      },
      {
        "text": "Our executive committee evaluates market performance during the summit.",
        "chunks": [
          "Our executive committee",
          "evaluates market performance",
          "during the summit."
        ],
        "translation": "우리 경영위원회는 서밋 회의 동안에. 시장 성과를 평가합니다"
      },
      {
        "text": "Our executive committee evaluates market performance with department heads.",
        "chunks": [
          "Our executive committee",
          "evaluates market performance",
          "with department heads."
        ],
        "translation": "우리 경영위원회는 부서장들과 함께. 시장 성과를 평가합니다"
      },
      {
        "text": "Our executive committee implements agile principles to maintain advantages.",
        "chunks": [
          "Our executive committee",
          "implements agile principles",
          "to maintain advantages."
        ],
        "translation": "우리 경영위원회는 우위를 유지하기 위해. 애자일 원칙을 실행합니다"
      },
      {
        "text": "Our executive committee implements agile principles amid changing conditions.",
        "chunks": [
          "Our executive committee",
          "implements agile principles",
          "amid changing conditions."
        ],
        "translation": "우리 경영위원회는 변화하는 환경 속에서. 애자일 원칙을 실행합니다"
      },
      {
        "text": "Our executive committee implements agile principles during the summit.",
        "chunks": [
          "Our executive committee",
          "implements agile principles",
          "during the summit."
        ],
        "translation": "우리 경영위원회는 서밋 회의 동안에. 애자일 원칙을 실행합니다"
      },
      {
        "text": "Our executive committee implements agile principles with department heads.",
        "chunks": [
          "Our executive committee",
          "implements agile principles",
          "with department heads."
        ],
        "translation": "우리 경영위원회는 부서장들과 함께. 애자일 원칙을 실행합니다"
      },
      {
        "text": "Our executive committee conducts competitor analysis to maintain advantages.",
        "chunks": [
          "Our executive committee",
          "conducts competitor analysis",
          "to maintain advantages."
        ],
        "translation": "우리 경영위원회는 우위를 유지하기 위해. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "Our executive committee conducts competitor analysis amid changing conditions.",
        "chunks": [
          "Our executive committee",
          "conducts competitor analysis",
          "amid changing conditions."
        ],
        "translation": "우리 경영위원회는 변화하는 환경 속에서. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "Our executive committee conducts competitor analysis during the summit.",
        "chunks": [
          "Our executive committee",
          "conducts competitor analysis",
          "during the summit."
        ],
        "translation": "우리 경영위원회는 서밋 회의 동안에. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "Our executive committee conducts competitor analysis with department heads.",
        "chunks": [
          "Our executive committee",
          "conducts competitor analysis",
          "with department heads."
        ],
        "translation": "우리 경영위원회는 부서장들과 함께. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "Our executive committee streamlines operational workflows to maintain advantages.",
        "chunks": [
          "Our executive committee",
          "streamlines operational workflows",
          "to maintain advantages."
        ],
        "translation": "우리 경영위원회는 우위를 유지하기 위해. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "Our executive committee streamlines operational workflows amid changing conditions.",
        "chunks": [
          "Our executive committee",
          "streamlines operational workflows",
          "amid changing conditions."
        ],
        "translation": "우리 경영위원회는 변화하는 환경 속에서. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "Our executive committee streamlines operational workflows during the summit.",
        "chunks": [
          "Our executive committee",
          "streamlines operational workflows",
          "during the summit."
        ],
        "translation": "우리 경영위원회는 서밋 회의 동안에. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "Our executive committee streamlines operational workflows with department heads.",
        "chunks": [
          "Our executive committee",
          "streamlines operational workflows",
          "with department heads."
        ],
        "translation": "우리 경영위원회는 부서장들과 함께. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "Our executive committee allocates available capital to maintain advantages.",
        "chunks": [
          "Our executive committee",
          "allocates available capital",
          "to maintain advantages."
        ],
        "translation": "우리 경영위원회는 우위를 유지하기 위해. 가용 자본을 배분합니다"
      },
      {
        "text": "Our executive committee allocates available capital amid changing conditions.",
        "chunks": [
          "Our executive committee",
          "allocates available capital",
          "amid changing conditions."
        ],
        "translation": "우리 경영위원회는 변화하는 환경 속에서. 가용 자본을 배분합니다"
      },
      {
        "text": "Our executive committee allocates available capital during the summit.",
        "chunks": [
          "Our executive committee",
          "allocates available capital",
          "during the summit."
        ],
        "translation": "우리 경영위원회는 서밋 회의 동안에. 가용 자본을 배분합니다"
      },
      {
        "text": "Our executive committee allocates available capital with department heads.",
        "chunks": [
          "Our executive committee",
          "allocates available capital",
          "with department heads."
        ],
        "translation": "우리 경영위원회는 부서장들과 함께. 가용 자본을 배분합니다"
      },
      {
        "text": "The senior strategy evaluates market performance to maintain advantages.",
        "chunks": [
          "The senior strategy",
          "evaluates market performance",
          "to maintain advantages."
        ],
        "translation": "수석 전략팀은 우위를 유지하기 위해. 시장 성과를 평가합니다"
      },
      {
        "text": "The senior strategy evaluates market performance amid changing conditions.",
        "chunks": [
          "The senior strategy",
          "evaluates market performance",
          "amid changing conditions."
        ],
        "translation": "수석 전략팀은 변화하는 환경 속에서. 시장 성과를 평가합니다"
      },
      {
        "text": "The senior strategy evaluates market performance during the summit.",
        "chunks": [
          "The senior strategy",
          "evaluates market performance",
          "during the summit."
        ],
        "translation": "수석 전략팀은 서밋 회의 동안에. 시장 성과를 평가합니다"
      },
      {
        "text": "The senior strategy evaluates market performance with department heads.",
        "chunks": [
          "The senior strategy",
          "evaluates market performance",
          "with department heads."
        ],
        "translation": "수석 전략팀은 부서장들과 함께. 시장 성과를 평가합니다"
      },
      {
        "text": "The senior strategy implements agile principles to maintain advantages.",
        "chunks": [
          "The senior strategy",
          "implements agile principles",
          "to maintain advantages."
        ],
        "translation": "수석 전략팀은 우위를 유지하기 위해. 애자일 원칙을 실행합니다"
      },
      {
        "text": "The senior strategy implements agile principles amid changing conditions.",
        "chunks": [
          "The senior strategy",
          "implements agile principles",
          "amid changing conditions."
        ],
        "translation": "수석 전략팀은 변화하는 환경 속에서. 애자일 원칙을 실행합니다"
      },
      {
        "text": "The senior strategy implements agile principles during the summit.",
        "chunks": [
          "The senior strategy",
          "implements agile principles",
          "during the summit."
        ],
        "translation": "수석 전략팀은 서밋 회의 동안에. 애자일 원칙을 실행합니다"
      },
      {
        "text": "The senior strategy implements agile principles with department heads.",
        "chunks": [
          "The senior strategy",
          "implements agile principles",
          "with department heads."
        ],
        "translation": "수석 전략팀은 부서장들과 함께. 애자일 원칙을 실행합니다"
      },
      {
        "text": "The senior strategy conducts competitor analysis to maintain advantages.",
        "chunks": [
          "The senior strategy",
          "conducts competitor analysis",
          "to maintain advantages."
        ],
        "translation": "수석 전략팀은 우위를 유지하기 위해. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "The senior strategy conducts competitor analysis amid changing conditions.",
        "chunks": [
          "The senior strategy",
          "conducts competitor analysis",
          "amid changing conditions."
        ],
        "translation": "수석 전략팀은 변화하는 환경 속에서. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "The senior strategy conducts competitor analysis during the summit.",
        "chunks": [
          "The senior strategy",
          "conducts competitor analysis",
          "during the summit."
        ],
        "translation": "수석 전략팀은 서밋 회의 동안에. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "The senior strategy conducts competitor analysis with department heads.",
        "chunks": [
          "The senior strategy",
          "conducts competitor analysis",
          "with department heads."
        ],
        "translation": "수석 전략팀은 부서장들과 함께. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "The senior strategy streamlines operational workflows to maintain advantages.",
        "chunks": [
          "The senior strategy",
          "streamlines operational workflows",
          "to maintain advantages."
        ],
        "translation": "수석 전략팀은 우위를 유지하기 위해. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "The senior strategy streamlines operational workflows amid changing conditions.",
        "chunks": [
          "The senior strategy",
          "streamlines operational workflows",
          "amid changing conditions."
        ],
        "translation": "수석 전략팀은 변화하는 환경 속에서. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "The senior strategy streamlines operational workflows during the summit.",
        "chunks": [
          "The senior strategy",
          "streamlines operational workflows",
          "during the summit."
        ],
        "translation": "수석 전략팀은 서밋 회의 동안에. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "The senior strategy streamlines operational workflows with department heads.",
        "chunks": [
          "The senior strategy",
          "streamlines operational workflows",
          "with department heads."
        ],
        "translation": "수석 전략팀은 부서장들과 함께. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "The senior strategy allocates available capital to maintain advantages.",
        "chunks": [
          "The senior strategy",
          "allocates available capital",
          "to maintain advantages."
        ],
        "translation": "수석 전략팀은 우위를 유지하기 위해. 가용 자본을 배분합니다"
      },
      {
        "text": "The senior strategy allocates available capital amid changing conditions.",
        "chunks": [
          "The senior strategy",
          "allocates available capital",
          "amid changing conditions."
        ],
        "translation": "수석 전략팀은 변화하는 환경 속에서. 가용 자본을 배분합니다"
      },
      {
        "text": "The senior strategy allocates available capital during the summit.",
        "chunks": [
          "The senior strategy",
          "allocates available capital",
          "during the summit."
        ],
        "translation": "수석 전략팀은 서밋 회의 동안에. 가용 자본을 배분합니다"
      },
      {
        "text": "The senior strategy allocates available capital with department heads.",
        "chunks": [
          "The senior strategy",
          "allocates available capital",
          "with department heads."
        ],
        "translation": "수석 전략팀은 부서장들과 함께. 가용 자본을 배분합니다"
      },
      {
        "text": "Every regional director evaluates market performance to maintain advantages.",
        "chunks": [
          "Every regional director",
          "evaluates market performance",
          "to maintain advantages."
        ],
        "translation": "모든 지역 본부장은 우위를 유지하기 위해. 시장 성과를 평가합니다"
      },
      {
        "text": "Every regional director evaluates market performance amid changing conditions.",
        "chunks": [
          "Every regional director",
          "evaluates market performance",
          "amid changing conditions."
        ],
        "translation": "모든 지역 본부장은 변화하는 환경 속에서. 시장 성과를 평가합니다"
      },
      {
        "text": "Every regional director evaluates market performance during the summit.",
        "chunks": [
          "Every regional director",
          "evaluates market performance",
          "during the summit."
        ],
        "translation": "모든 지역 본부장은 서밋 회의 동안에. 시장 성과를 평가합니다"
      },
      {
        "text": "Every regional director evaluates market performance with department heads.",
        "chunks": [
          "Every regional director",
          "evaluates market performance",
          "with department heads."
        ],
        "translation": "모든 지역 본부장은 부서장들과 함께. 시장 성과를 평가합니다"
      },
      {
        "text": "Every regional director implements agile principles to maintain advantages.",
        "chunks": [
          "Every regional director",
          "implements agile principles",
          "to maintain advantages."
        ],
        "translation": "모든 지역 본부장은 우위를 유지하기 위해. 애자일 원칙을 실행합니다"
      },
      {
        "text": "Every regional director implements agile principles amid changing conditions.",
        "chunks": [
          "Every regional director",
          "implements agile principles",
          "amid changing conditions."
        ],
        "translation": "모든 지역 본부장은 변화하는 환경 속에서. 애자일 원칙을 실행합니다"
      },
      {
        "text": "Every regional director implements agile principles during the summit.",
        "chunks": [
          "Every regional director",
          "implements agile principles",
          "during the summit."
        ],
        "translation": "모든 지역 본부장은 서밋 회의 동안에. 애자일 원칙을 실행합니다"
      },
      {
        "text": "Every regional director implements agile principles with department heads.",
        "chunks": [
          "Every regional director",
          "implements agile principles",
          "with department heads."
        ],
        "translation": "모든 지역 본부장은 부서장들과 함께. 애자일 원칙을 실행합니다"
      },
      {
        "text": "Every regional director conducts competitor analysis to maintain advantages.",
        "chunks": [
          "Every regional director",
          "conducts competitor analysis",
          "to maintain advantages."
        ],
        "translation": "모든 지역 본부장은 우위를 유지하기 위해. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "Every regional director conducts competitor analysis amid changing conditions.",
        "chunks": [
          "Every regional director",
          "conducts competitor analysis",
          "amid changing conditions."
        ],
        "translation": "모든 지역 본부장은 변화하는 환경 속에서. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "Every regional director conducts competitor analysis during the summit.",
        "chunks": [
          "Every regional director",
          "conducts competitor analysis",
          "during the summit."
        ],
        "translation": "모든 지역 본부장은 서밋 회의 동안에. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "Every regional director conducts competitor analysis with department heads.",
        "chunks": [
          "Every regional director",
          "conducts competitor analysis",
          "with department heads."
        ],
        "translation": "모든 지역 본부장은 부서장들과 함께. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "Every regional director streamlines operational workflows to maintain advantages.",
        "chunks": [
          "Every regional director",
          "streamlines operational workflows",
          "to maintain advantages."
        ],
        "translation": "모든 지역 본부장은 우위를 유지하기 위해. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "Every regional director streamlines operational workflows amid changing conditions.",
        "chunks": [
          "Every regional director",
          "streamlines operational workflows",
          "amid changing conditions."
        ],
        "translation": "모든 지역 본부장은 변화하는 환경 속에서. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "Every regional director streamlines operational workflows during the summit.",
        "chunks": [
          "Every regional director",
          "streamlines operational workflows",
          "during the summit."
        ],
        "translation": "모든 지역 본부장은 서밋 회의 동안에. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "Every regional director streamlines operational workflows with department heads.",
        "chunks": [
          "Every regional director",
          "streamlines operational workflows",
          "with department heads."
        ],
        "translation": "모든 지역 본부장은 부서장들과 함께. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "Every regional director allocates available capital to maintain advantages.",
        "chunks": [
          "Every regional director",
          "allocates available capital",
          "to maintain advantages."
        ],
        "translation": "모든 지역 본부장은 우위를 유지하기 위해. 가용 자본을 배분합니다"
      },
      {
        "text": "Every regional director allocates available capital amid changing conditions.",
        "chunks": [
          "Every regional director",
          "allocates available capital",
          "amid changing conditions."
        ],
        "translation": "모든 지역 본부장은 변화하는 환경 속에서. 가용 자본을 배분합니다"
      },
      {
        "text": "Every regional director allocates available capital during the summit.",
        "chunks": [
          "Every regional director",
          "allocates available capital",
          "during the summit."
        ],
        "translation": "모든 지역 본부장은 서밋 회의 동안에. 가용 자본을 배분합니다"
      },
      {
        "text": "Every regional director allocates available capital with department heads.",
        "chunks": [
          "Every regional director",
          "allocates available capital",
          "with department heads."
        ],
        "translation": "모든 지역 본부장은 부서장들과 함께. 가용 자본을 배분합니다"
      },
      {
        "text": "The marketing division evaluates market performance to maintain advantages.",
        "chunks": [
          "The marketing division",
          "evaluates market performance",
          "to maintain advantages."
        ],
        "translation": "마케팅 부문은 우위를 유지하기 위해. 시장 성과를 평가합니다"
      },
      {
        "text": "The marketing division evaluates market performance amid changing conditions.",
        "chunks": [
          "The marketing division",
          "evaluates market performance",
          "amid changing conditions."
        ],
        "translation": "마케팅 부문은 변화하는 환경 속에서. 시장 성과를 평가합니다"
      },
      {
        "text": "The marketing division evaluates market performance during the summit.",
        "chunks": [
          "The marketing division",
          "evaluates market performance",
          "during the summit."
        ],
        "translation": "마케팅 부문은 서밋 회의 동안에. 시장 성과를 평가합니다"
      },
      {
        "text": "The marketing division evaluates market performance with department heads.",
        "chunks": [
          "The marketing division",
          "evaluates market performance",
          "with department heads."
        ],
        "translation": "마케팅 부문은 부서장들과 함께. 시장 성과를 평가합니다"
      },
      {
        "text": "The marketing division implements agile principles to maintain advantages.",
        "chunks": [
          "The marketing division",
          "implements agile principles",
          "to maintain advantages."
        ],
        "translation": "마케팅 부문은 우위를 유지하기 위해. 애자일 원칙을 실행합니다"
      },
      {
        "text": "The marketing division implements agile principles amid changing conditions.",
        "chunks": [
          "The marketing division",
          "implements agile principles",
          "amid changing conditions."
        ],
        "translation": "마케팅 부문은 변화하는 환경 속에서. 애자일 원칙을 실행합니다"
      },
      {
        "text": "The marketing division implements agile principles during the summit.",
        "chunks": [
          "The marketing division",
          "implements agile principles",
          "during the summit."
        ],
        "translation": "마케팅 부문은 서밋 회의 동안에. 애자일 원칙을 실행합니다"
      },
      {
        "text": "The marketing division implements agile principles with department heads.",
        "chunks": [
          "The marketing division",
          "implements agile principles",
          "with department heads."
        ],
        "translation": "마케팅 부문은 부서장들과 함께. 애자일 원칙을 실행합니다"
      },
      {
        "text": "The marketing division conducts competitor analysis to maintain advantages.",
        "chunks": [
          "The marketing division",
          "conducts competitor analysis",
          "to maintain advantages."
        ],
        "translation": "마케팅 부문은 우위를 유지하기 위해. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "The marketing division conducts competitor analysis amid changing conditions.",
        "chunks": [
          "The marketing division",
          "conducts competitor analysis",
          "amid changing conditions."
        ],
        "translation": "마케팅 부문은 변화하는 환경 속에서. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "The marketing division conducts competitor analysis during the summit.",
        "chunks": [
          "The marketing division",
          "conducts competitor analysis",
          "during the summit."
        ],
        "translation": "마케팅 부문은 서밋 회의 동안에. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "The marketing division conducts competitor analysis with department heads.",
        "chunks": [
          "The marketing division",
          "conducts competitor analysis",
          "with department heads."
        ],
        "translation": "마케팅 부문은 부서장들과 함께. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "The marketing division streamlines operational workflows to maintain advantages.",
        "chunks": [
          "The marketing division",
          "streamlines operational workflows",
          "to maintain advantages."
        ],
        "translation": "마케팅 부문은 우위를 유지하기 위해. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "The marketing division streamlines operational workflows amid changing conditions.",
        "chunks": [
          "The marketing division",
          "streamlines operational workflows",
          "amid changing conditions."
        ],
        "translation": "마케팅 부문은 변화하는 환경 속에서. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "The marketing division streamlines operational workflows during the summit.",
        "chunks": [
          "The marketing division",
          "streamlines operational workflows",
          "during the summit."
        ],
        "translation": "마케팅 부문은 서밋 회의 동안에. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "The marketing division streamlines operational workflows with department heads.",
        "chunks": [
          "The marketing division",
          "streamlines operational workflows",
          "with department heads."
        ],
        "translation": "마케팅 부문은 부서장들과 함께. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "The marketing division allocates available capital to maintain advantages.",
        "chunks": [
          "The marketing division",
          "allocates available capital",
          "to maintain advantages."
        ],
        "translation": "마케팅 부문은 우위를 유지하기 위해. 가용 자본을 배분합니다"
      },
      {
        "text": "The marketing division allocates available capital amid changing conditions.",
        "chunks": [
          "The marketing division",
          "allocates available capital",
          "amid changing conditions."
        ],
        "translation": "마케팅 부문은 변화하는 환경 속에서. 가용 자본을 배분합니다"
      },
      {
        "text": "The marketing division allocates available capital during the summit.",
        "chunks": [
          "The marketing division",
          "allocates available capital",
          "during the summit."
        ],
        "translation": "마케팅 부문은 서밋 회의 동안에. 가용 자본을 배분합니다"
      },
      {
        "text": "The marketing division allocates available capital with department heads.",
        "chunks": [
          "The marketing division",
          "allocates available capital",
          "with department heads."
        ],
        "translation": "마케팅 부문은 부서장들과 함께. 가용 자본을 배분합니다"
      },
      {
        "text": "Our innovation group evaluates market performance to maintain advantages.",
        "chunks": [
          "Our innovation group",
          "evaluates market performance",
          "to maintain advantages."
        ],
        "translation": "우리 혁신 그룹은 우위를 유지하기 위해. 시장 성과를 평가합니다"
      },
      {
        "text": "Our innovation group evaluates market performance amid changing conditions.",
        "chunks": [
          "Our innovation group",
          "evaluates market performance",
          "amid changing conditions."
        ],
        "translation": "우리 혁신 그룹은 변화하는 환경 속에서. 시장 성과를 평가합니다"
      },
      {
        "text": "Our innovation group evaluates market performance during the summit.",
        "chunks": [
          "Our innovation group",
          "evaluates market performance",
          "during the summit."
        ],
        "translation": "우리 혁신 그룹은 서밋 회의 동안에. 시장 성과를 평가합니다"
      },
      {
        "text": "Our innovation group evaluates market performance with department heads.",
        "chunks": [
          "Our innovation group",
          "evaluates market performance",
          "with department heads."
        ],
        "translation": "우리 혁신 그룹은 부서장들과 함께. 시장 성과를 평가합니다"
      },
      {
        "text": "Our innovation group implements agile principles to maintain advantages.",
        "chunks": [
          "Our innovation group",
          "implements agile principles",
          "to maintain advantages."
        ],
        "translation": "우리 혁신 그룹은 우위를 유지하기 위해. 애자일 원칙을 실행합니다"
      },
      {
        "text": "Our innovation group implements agile principles amid changing conditions.",
        "chunks": [
          "Our innovation group",
          "implements agile principles",
          "amid changing conditions."
        ],
        "translation": "우리 혁신 그룹은 변화하는 환경 속에서. 애자일 원칙을 실행합니다"
      },
      {
        "text": "Our innovation group implements agile principles during the summit.",
        "chunks": [
          "Our innovation group",
          "implements agile principles",
          "during the summit."
        ],
        "translation": "우리 혁신 그룹은 서밋 회의 동안에. 애자일 원칙을 실행합니다"
      },
      {
        "text": "Our innovation group implements agile principles with department heads.",
        "chunks": [
          "Our innovation group",
          "implements agile principles",
          "with department heads."
        ],
        "translation": "우리 혁신 그룹은 부서장들과 함께. 애자일 원칙을 실행합니다"
      },
      {
        "text": "Our innovation group conducts competitor analysis to maintain advantages.",
        "chunks": [
          "Our innovation group",
          "conducts competitor analysis",
          "to maintain advantages."
        ],
        "translation": "우리 혁신 그룹은 우위를 유지하기 위해. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "Our innovation group conducts competitor analysis amid changing conditions.",
        "chunks": [
          "Our innovation group",
          "conducts competitor analysis",
          "amid changing conditions."
        ],
        "translation": "우리 혁신 그룹은 변화하는 환경 속에서. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "Our innovation group conducts competitor analysis during the summit.",
        "chunks": [
          "Our innovation group",
          "conducts competitor analysis",
          "during the summit."
        ],
        "translation": "우리 혁신 그룹은 서밋 회의 동안에. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "Our innovation group conducts competitor analysis with department heads.",
        "chunks": [
          "Our innovation group",
          "conducts competitor analysis",
          "with department heads."
        ],
        "translation": "우리 혁신 그룹은 부서장들과 함께. 경쟁사 분석을 수행합니다"
      },
      {
        "text": "Our innovation group streamlines operational workflows to maintain advantages.",
        "chunks": [
          "Our innovation group",
          "streamlines operational workflows",
          "to maintain advantages."
        ],
        "translation": "우리 혁신 그룹은 우위를 유지하기 위해. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "Our innovation group streamlines operational workflows amid changing conditions.",
        "chunks": [
          "Our innovation group",
          "streamlines operational workflows",
          "amid changing conditions."
        ],
        "translation": "우리 혁신 그룹은 변화하는 환경 속에서. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "Our innovation group streamlines operational workflows during the summit.",
        "chunks": [
          "Our innovation group",
          "streamlines operational workflows",
          "during the summit."
        ],
        "translation": "우리 혁신 그룹은 서밋 회의 동안에. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "Our innovation group streamlines operational workflows with department heads.",
        "chunks": [
          "Our innovation group",
          "streamlines operational workflows",
          "with department heads."
        ],
        "translation": "우리 혁신 그룹은 부서장들과 함께. 운영 워크플로우를 간소화합니다"
      },
      {
        "text": "Our innovation group allocates available capital to maintain advantages.",
        "chunks": [
          "Our innovation group",
          "allocates available capital",
          "to maintain advantages."
        ],
        "translation": "우리 혁신 그룹은 우위를 유지하기 위해. 가용 자본을 배분합니다"
      },
      {
        "text": "Our innovation group allocates available capital amid changing conditions.",
        "chunks": [
          "Our innovation group",
          "allocates available capital",
          "amid changing conditions."
        ],
        "translation": "우리 혁신 그룹은 변화하는 환경 속에서. 가용 자본을 배분합니다"
      },
      {
        "text": "Our innovation group allocates available capital during the summit.",
        "chunks": [
          "Our innovation group",
          "allocates available capital",
          "during the summit."
        ],
        "translation": "우리 혁신 그룹은 서밋 회의 동안에. 가용 자본을 배분합니다"
      },
      {
        "text": "Our innovation group allocates available capital with department heads.",
        "chunks": [
          "Our innovation group",
          "allocates available capital",
          "with department heads."
        ],
        "translation": "우리 혁신 그룹은 부서장들과 함께. 가용 자본을 배분합니다"
      }
    ],
    "4": [
      {
        "text": "Continuous professional learning is highly essential in demanding environments during this year.",
        "chunks": [
          "Continuous professional learning",
          "is highly essential",
          "in demanding environments",
          "during this year."
        ],
        "translation": "지속적인 전문 역량 학습은 대단히 필수적입니다 까다로운 환경 속에서 올해 동안."
      },
      {
        "text": "Continuous professional learning is highly essential in demanding environments without compromising standards.",
        "chunks": [
          "Continuous professional learning",
          "is highly essential",
          "in demanding environments",
          "without compromising standards."
        ],
        "translation": "지속적인 전문 역량 학습은 대단히 필수적입니다 까다로운 환경 속에서 표준을 훼손하지 않고."
      },
      {
        "text": "Continuous professional learning is highly essential by expanding operations during this year.",
        "chunks": [
          "Continuous professional learning",
          "is highly essential",
          "by expanding operations",
          "during this year."
        ],
        "translation": "지속적인 전문 역량 학습은 대단히 필수적입니다 운영을 확장함으로써 올해 동안."
      },
      {
        "text": "Continuous professional learning is highly essential by expanding operations without compromising standards.",
        "chunks": [
          "Continuous professional learning",
          "is highly essential",
          "by expanding operations",
          "without compromising standards."
        ],
        "translation": "지속적인 전문 역량 학습은 대단히 필수적입니다 운영을 확장함으로써 표준을 훼손하지 않고."
      },
      {
        "text": "Continuous professional learning is highly essential into emerging markets during this year.",
        "chunks": [
          "Continuous professional learning",
          "is highly essential",
          "into emerging markets",
          "during this year."
        ],
        "translation": "지속적인 전문 역량 학습은 대단히 필수적입니다 신흥 시장 속으로 올해 동안."
      },
      {
        "text": "Continuous professional learning is highly essential into emerging markets without compromising standards.",
        "chunks": [
          "Continuous professional learning",
          "is highly essential",
          "into emerging markets",
          "without compromising standards."
        ],
        "translation": "지속적인 전문 역량 학습은 대단히 필수적입니다 신흥 시장 속으로 표준을 훼손하지 않고."
      },
      {
        "text": "Continuous professional learning is highly essential to foster collaboration during this year.",
        "chunks": [
          "Continuous professional learning",
          "is highly essential",
          "to foster collaboration",
          "during this year."
        ],
        "translation": "지속적인 전문 역량 학습은 대단히 필수적입니다 협업을 적극 조성하기 위해 올해 동안."
      },
      {
        "text": "Continuous professional learning is highly essential to foster collaboration without compromising standards.",
        "chunks": [
          "Continuous professional learning",
          "is highly essential",
          "to foster collaboration",
          "without compromising standards."
        ],
        "translation": "지속적인 전문 역량 학습은 대단히 필수적입니다 협업을 적극 조성하기 위해 표준을 훼손하지 않고."
      },
      {
        "text": "Continuous professional learning is highly essential which enhances productivity during this year.",
        "chunks": [
          "Continuous professional learning",
          "is highly essential",
          "which enhances productivity",
          "during this year."
        ],
        "translation": "지속적인 전문 역량 학습은 대단히 필수적입니다 생산성을 직접 향상시키는 올해 동안."
      },
      {
        "text": "Continuous professional learning is highly essential which enhances productivity without compromising standards.",
        "chunks": [
          "Continuous professional learning",
          "is highly essential",
          "which enhances productivity",
          "without compromising standards."
        ],
        "translation": "지속적인 전문 역량 학습은 대단히 필수적입니다 생산성을 직접 향상시키는 표준을 훼손하지 않고."
      },
      {
        "text": "Continuous professional learning across global units in demanding environments during this year.",
        "chunks": [
          "Continuous professional learning",
          "across global units",
          "in demanding environments",
          "during this year."
        ],
        "translation": "지속적인 전문 역량 학습은 글로벌 부서 전반에 걸쳐 까다로운 환경 속에서 올해 동안."
      },
      {
        "text": "Continuous professional learning across global units in demanding environments without compromising standards.",
        "chunks": [
          "Continuous professional learning",
          "across global units",
          "in demanding environments",
          "without compromising standards."
        ],
        "translation": "지속적인 전문 역량 학습은 글로벌 부서 전반에 걸쳐 까다로운 환경 속에서 표준을 훼손하지 않고."
      },
      {
        "text": "Continuous professional learning across global units by expanding operations during this year.",
        "chunks": [
          "Continuous professional learning",
          "across global units",
          "by expanding operations",
          "during this year."
        ],
        "translation": "지속적인 전문 역량 학습은 글로벌 부서 전반에 걸쳐 운영을 확장함으로써 올해 동안."
      },
      {
        "text": "Continuous professional learning across global units by expanding operations without compromising standards.",
        "chunks": [
          "Continuous professional learning",
          "across global units",
          "by expanding operations",
          "without compromising standards."
        ],
        "translation": "지속적인 전문 역량 학습은 글로벌 부서 전반에 걸쳐 운영을 확장함으로써 표준을 훼손하지 않고."
      },
      {
        "text": "Continuous professional learning across global units into emerging markets during this year.",
        "chunks": [
          "Continuous professional learning",
          "across global units",
          "into emerging markets",
          "during this year."
        ],
        "translation": "지속적인 전문 역량 학습은 글로벌 부서 전반에 걸쳐 신흥 시장 속으로 올해 동안."
      },
      {
        "text": "Continuous professional learning across global units into emerging markets without compromising standards.",
        "chunks": [
          "Continuous professional learning",
          "across global units",
          "into emerging markets",
          "without compromising standards."
        ],
        "translation": "지속적인 전문 역량 학습은 글로벌 부서 전반에 걸쳐 신흥 시장 속으로 표준을 훼손하지 않고."
      },
      {
        "text": "Continuous professional learning across global units to foster collaboration during this year.",
        "chunks": [
          "Continuous professional learning",
          "across global units",
          "to foster collaboration",
          "during this year."
        ],
        "translation": "지속적인 전문 역량 학습은 글로벌 부서 전반에 걸쳐 협업을 적극 조성하기 위해 올해 동안."
      },
      {
        "text": "Continuous professional learning across global units to foster collaboration without compromising standards.",
        "chunks": [
          "Continuous professional learning",
          "across global units",
          "to foster collaboration",
          "without compromising standards."
        ],
        "translation": "지속적인 전문 역량 학습은 글로벌 부서 전반에 걸쳐 협업을 적극 조성하기 위해 표준을 훼손하지 않고."
      },
      {
        "text": "Continuous professional learning across global units which enhances productivity during this year.",
        "chunks": [
          "Continuous professional learning",
          "across global units",
          "which enhances productivity",
          "during this year."
        ],
        "translation": "지속적인 전문 역량 학습은 글로벌 부서 전반에 걸쳐 생산성을 직접 향상시키는 올해 동안."
      },
      {
        "text": "Continuous professional learning across global units which enhances productivity without compromising standards.",
        "chunks": [
          "Continuous professional learning",
          "across global units",
          "which enhances productivity",
          "without compromising standards."
        ],
        "translation": "지속적인 전문 역량 학습은 글로벌 부서 전반에 걸쳐 생산성을 직접 향상시키는 표준을 훼손하지 않고."
      },
      {
        "text": "The global team is highly essential in demanding environments during this year.",
        "chunks": [
          "The global team",
          "is highly essential",
          "in demanding environments",
          "during this year."
        ],
        "translation": "글로벌 비즈니스 팀은 대단히 필수적입니다 까다로운 환경 속에서 올해 동안."
      },
      {
        "text": "The global team is highly essential in demanding environments without compromising standards.",
        "chunks": [
          "The global team",
          "is highly essential",
          "in demanding environments",
          "without compromising standards."
        ],
        "translation": "글로벌 비즈니스 팀은 대단히 필수적입니다 까다로운 환경 속에서 표준을 훼손하지 않고."
      },
      {
        "text": "The global team is highly essential by expanding operations during this year.",
        "chunks": [
          "The global team",
          "is highly essential",
          "by expanding operations",
          "during this year."
        ],
        "translation": "글로벌 비즈니스 팀은 대단히 필수적입니다 운영을 확장함으로써 올해 동안."
      },
      {
        "text": "The global team is highly essential by expanding operations without compromising standards.",
        "chunks": [
          "The global team",
          "is highly essential",
          "by expanding operations",
          "without compromising standards."
        ],
        "translation": "글로벌 비즈니스 팀은 대단히 필수적입니다 운영을 확장함으로써 표준을 훼손하지 않고."
      },
      {
        "text": "The global team is highly essential into emerging markets during this year.",
        "chunks": [
          "The global team",
          "is highly essential",
          "into emerging markets",
          "during this year."
        ],
        "translation": "글로벌 비즈니스 팀은 대단히 필수적입니다 신흥 시장 속으로 올해 동안."
      },
      {
        "text": "The global team is highly essential into emerging markets without compromising standards.",
        "chunks": [
          "The global team",
          "is highly essential",
          "into emerging markets",
          "without compromising standards."
        ],
        "translation": "글로벌 비즈니스 팀은 대단히 필수적입니다 신흥 시장 속으로 표준을 훼손하지 않고."
      },
      {
        "text": "The global team is highly essential to foster collaboration during this year.",
        "chunks": [
          "The global team",
          "is highly essential",
          "to foster collaboration",
          "during this year."
        ],
        "translation": "글로벌 비즈니스 팀은 대단히 필수적입니다 협업을 적극 조성하기 위해 올해 동안."
      },
      {
        "text": "The global team is highly essential to foster collaboration without compromising standards.",
        "chunks": [
          "The global team",
          "is highly essential",
          "to foster collaboration",
          "without compromising standards."
        ],
        "translation": "글로벌 비즈니스 팀은 대단히 필수적입니다 협업을 적극 조성하기 위해 표준을 훼손하지 않고."
      },
      {
        "text": "The global team is highly essential which enhances productivity during this year.",
        "chunks": [
          "The global team",
          "is highly essential",
          "which enhances productivity",
          "during this year."
        ],
        "translation": "글로벌 비즈니스 팀은 대단히 필수적입니다 생산성을 직접 향상시키는 올해 동안."
      },
      {
        "text": "The global team is highly essential which enhances productivity without compromising standards.",
        "chunks": [
          "The global team",
          "is highly essential",
          "which enhances productivity",
          "without compromising standards."
        ],
        "translation": "글로벌 비즈니스 팀은 대단히 필수적입니다 생산성을 직접 향상시키는 표준을 훼손하지 않고."
      },
      {
        "text": "The global team across global units in demanding environments during this year.",
        "chunks": [
          "The global team",
          "across global units",
          "in demanding environments",
          "during this year."
        ],
        "translation": "글로벌 비즈니스 팀은 글로벌 부서 전반에 걸쳐 까다로운 환경 속에서 올해 동안."
      },
      {
        "text": "The global team across global units in demanding environments without compromising standards.",
        "chunks": [
          "The global team",
          "across global units",
          "in demanding environments",
          "without compromising standards."
        ],
        "translation": "글로벌 비즈니스 팀은 글로벌 부서 전반에 걸쳐 까다로운 환경 속에서 표준을 훼손하지 않고."
      },
      {
        "text": "The global team across global units by expanding operations during this year.",
        "chunks": [
          "The global team",
          "across global units",
          "by expanding operations",
          "during this year."
        ],
        "translation": "글로벌 비즈니스 팀은 글로벌 부서 전반에 걸쳐 운영을 확장함으로써 올해 동안."
      },
      {
        "text": "The global team across global units by expanding operations without compromising standards.",
        "chunks": [
          "The global team",
          "across global units",
          "by expanding operations",
          "without compromising standards."
        ],
        "translation": "글로벌 비즈니스 팀은 글로벌 부서 전반에 걸쳐 운영을 확장함으로써 표준을 훼손하지 않고."
      },
      {
        "text": "The global team across global units into emerging markets during this year.",
        "chunks": [
          "The global team",
          "across global units",
          "into emerging markets",
          "during this year."
        ],
        "translation": "글로벌 비즈니스 팀은 글로벌 부서 전반에 걸쳐 신흥 시장 속으로 올해 동안."
      },
      {
        "text": "The global team across global units into emerging markets without compromising standards.",
        "chunks": [
          "The global team",
          "across global units",
          "into emerging markets",
          "without compromising standards."
        ],
        "translation": "글로벌 비즈니스 팀은 글로벌 부서 전반에 걸쳐 신흥 시장 속으로 표준을 훼손하지 않고."
      },
      {
        "text": "The global team across global units to foster collaboration during this year.",
        "chunks": [
          "The global team",
          "across global units",
          "to foster collaboration",
          "during this year."
        ],
        "translation": "글로벌 비즈니스 팀은 글로벌 부서 전반에 걸쳐 협업을 적극 조성하기 위해 올해 동안."
      },
      {
        "text": "The global team across global units to foster collaboration without compromising standards.",
        "chunks": [
          "The global team",
          "across global units",
          "to foster collaboration",
          "without compromising standards."
        ],
        "translation": "글로벌 비즈니스 팀은 글로벌 부서 전반에 걸쳐 협업을 적극 조성하기 위해 표준을 훼손하지 않고."
      },
      {
        "text": "The global team across global units which enhances productivity during this year.",
        "chunks": [
          "The global team",
          "across global units",
          "which enhances productivity",
          "during this year."
        ],
        "translation": "글로벌 비즈니스 팀은 글로벌 부서 전반에 걸쳐 생산성을 직접 향상시키는 올해 동안."
      },
      {
        "text": "The global team across global units which enhances productivity without compromising standards.",
        "chunks": [
          "The global team",
          "across global units",
          "which enhances productivity",
          "without compromising standards."
        ],
        "translation": "글로벌 비즈니스 팀은 글로벌 부서 전반에 걸쳐 생산성을 직접 향상시키는 표준을 훼손하지 않고."
      },
      {
        "text": "Integrating customer feedback is highly essential in demanding environments during this year.",
        "chunks": [
          "Integrating customer feedback",
          "is highly essential",
          "in demanding environments",
          "during this year."
        ],
        "translation": "고객 피드백의 직접 통합은 대단히 필수적입니다 까다로운 환경 속에서 올해 동안."
      },
      {
        "text": "Integrating customer feedback is highly essential in demanding environments without compromising standards.",
        "chunks": [
          "Integrating customer feedback",
          "is highly essential",
          "in demanding environments",
          "without compromising standards."
        ],
        "translation": "고객 피드백의 직접 통합은 대단히 필수적입니다 까다로운 환경 속에서 표준을 훼손하지 않고."
      },
      {
        "text": "Integrating customer feedback is highly essential by expanding operations during this year.",
        "chunks": [
          "Integrating customer feedback",
          "is highly essential",
          "by expanding operations",
          "during this year."
        ],
        "translation": "고객 피드백의 직접 통합은 대단히 필수적입니다 운영을 확장함으로써 올해 동안."
      },
      {
        "text": "Integrating customer feedback is highly essential by expanding operations without compromising standards.",
        "chunks": [
          "Integrating customer feedback",
          "is highly essential",
          "by expanding operations",
          "without compromising standards."
        ],
        "translation": "고객 피드백의 직접 통합은 대단히 필수적입니다 운영을 확장함으로써 표준을 훼손하지 않고."
      },
      {
        "text": "Integrating customer feedback is highly essential into emerging markets during this year.",
        "chunks": [
          "Integrating customer feedback",
          "is highly essential",
          "into emerging markets",
          "during this year."
        ],
        "translation": "고객 피드백의 직접 통합은 대단히 필수적입니다 신흥 시장 속으로 올해 동안."
      },
      {
        "text": "Integrating customer feedback is highly essential into emerging markets without compromising standards.",
        "chunks": [
          "Integrating customer feedback",
          "is highly essential",
          "into emerging markets",
          "without compromising standards."
        ],
        "translation": "고객 피드백의 직접 통합은 대단히 필수적입니다 신흥 시장 속으로 표준을 훼손하지 않고."
      },
      {
        "text": "Integrating customer feedback is highly essential to foster collaboration during this year.",
        "chunks": [
          "Integrating customer feedback",
          "is highly essential",
          "to foster collaboration",
          "during this year."
        ],
        "translation": "고객 피드백의 직접 통합은 대단히 필수적입니다 협업을 적극 조성하기 위해 올해 동안."
      },
      {
        "text": "Integrating customer feedback is highly essential to foster collaboration without compromising standards.",
        "chunks": [
          "Integrating customer feedback",
          "is highly essential",
          "to foster collaboration",
          "without compromising standards."
        ],
        "translation": "고객 피드백의 직접 통합은 대단히 필수적입니다 협업을 적극 조성하기 위해 표준을 훼손하지 않고."
      },
      {
        "text": "Integrating customer feedback is highly essential which enhances productivity during this year.",
        "chunks": [
          "Integrating customer feedback",
          "is highly essential",
          "which enhances productivity",
          "during this year."
        ],
        "translation": "고객 피드백의 직접 통합은 대단히 필수적입니다 생산성을 직접 향상시키는 올해 동안."
      },
      {
        "text": "Integrating customer feedback is highly essential which enhances productivity without compromising standards.",
        "chunks": [
          "Integrating customer feedback",
          "is highly essential",
          "which enhances productivity",
          "without compromising standards."
        ],
        "translation": "고객 피드백의 직접 통합은 대단히 필수적입니다 생산성을 직접 향상시키는 표준을 훼손하지 않고."
      },
      {
        "text": "Integrating customer feedback across global units in demanding environments during this year.",
        "chunks": [
          "Integrating customer feedback",
          "across global units",
          "in demanding environments",
          "during this year."
        ],
        "translation": "고객 피드백의 직접 통합은 글로벌 부서 전반에 걸쳐 까다로운 환경 속에서 올해 동안."
      },
      {
        "text": "Integrating customer feedback across global units in demanding environments without compromising standards.",
        "chunks": [
          "Integrating customer feedback",
          "across global units",
          "in demanding environments",
          "without compromising standards."
        ],
        "translation": "고객 피드백의 직접 통합은 글로벌 부서 전반에 걸쳐 까다로운 환경 속에서 표준을 훼손하지 않고."
      },
      {
        "text": "Integrating customer feedback across global units by expanding operations during this year.",
        "chunks": [
          "Integrating customer feedback",
          "across global units",
          "by expanding operations",
          "during this year."
        ],
        "translation": "고객 피드백의 직접 통합은 글로벌 부서 전반에 걸쳐 운영을 확장함으로써 올해 동안."
      },
      {
        "text": "Integrating customer feedback across global units by expanding operations without compromising standards.",
        "chunks": [
          "Integrating customer feedback",
          "across global units",
          "by expanding operations",
          "without compromising standards."
        ],
        "translation": "고객 피드백의 직접 통합은 글로벌 부서 전반에 걸쳐 운영을 확장함으로써 표준을 훼손하지 않고."
      },
      {
        "text": "Integrating customer feedback across global units into emerging markets during this year.",
        "chunks": [
          "Integrating customer feedback",
          "across global units",
          "into emerging markets",
          "during this year."
        ],
        "translation": "고객 피드백의 직접 통합은 글로벌 부서 전반에 걸쳐 신흥 시장 속으로 올해 동안."
      },
      {
        "text": "Integrating customer feedback across global units into emerging markets without compromising standards.",
        "chunks": [
          "Integrating customer feedback",
          "across global units",
          "into emerging markets",
          "without compromising standards."
        ],
        "translation": "고객 피드백의 직접 통합은 글로벌 부서 전반에 걸쳐 신흥 시장 속으로 표준을 훼손하지 않고."
      },
      {
        "text": "Integrating customer feedback across global units to foster collaboration during this year.",
        "chunks": [
          "Integrating customer feedback",
          "across global units",
          "to foster collaboration",
          "during this year."
        ],
        "translation": "고객 피드백의 직접 통합은 글로벌 부서 전반에 걸쳐 협업을 적극 조성하기 위해 올해 동안."
      },
      {
        "text": "Integrating customer feedback across global units to foster collaboration without compromising standards.",
        "chunks": [
          "Integrating customer feedback",
          "across global units",
          "to foster collaboration",
          "without compromising standards."
        ],
        "translation": "고객 피드백의 직접 통합은 글로벌 부서 전반에 걸쳐 협업을 적극 조성하기 위해 표준을 훼손하지 않고."
      },
      {
        "text": "Integrating customer feedback across global units which enhances productivity during this year.",
        "chunks": [
          "Integrating customer feedback",
          "across global units",
          "which enhances productivity",
          "during this year."
        ],
        "translation": "고객 피드백의 직접 통합은 글로벌 부서 전반에 걸쳐 생산성을 직접 향상시키는 올해 동안."
      },
      {
        "text": "Integrating customer feedback across global units which enhances productivity without compromising standards.",
        "chunks": [
          "Integrating customer feedback",
          "across global units",
          "which enhances productivity",
          "without compromising standards."
        ],
        "translation": "고객 피드백의 직접 통합은 글로벌 부서 전반에 걸쳐 생산성을 직접 향상시키는 표준을 훼손하지 않고."
      },
      {
        "text": "To protect advantages, is highly essential in demanding environments during this year.",
        "chunks": [
          "To protect advantages,",
          "is highly essential",
          "in demanding environments",
          "during this year."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 대단히 필수적입니다 까다로운 환경 속에서 올해 동안."
      },
      {
        "text": "To protect advantages, is highly essential in demanding environments without compromising standards.",
        "chunks": [
          "To protect advantages,",
          "is highly essential",
          "in demanding environments",
          "without compromising standards."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 대단히 필수적입니다 까다로운 환경 속에서 표준을 훼손하지 않고."
      },
      {
        "text": "To protect advantages, is highly essential by expanding operations during this year.",
        "chunks": [
          "To protect advantages,",
          "is highly essential",
          "by expanding operations",
          "during this year."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 대단히 필수적입니다 운영을 확장함으로써 올해 동안."
      },
      {
        "text": "To protect advantages, is highly essential by expanding operations without compromising standards.",
        "chunks": [
          "To protect advantages,",
          "is highly essential",
          "by expanding operations",
          "without compromising standards."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 대단히 필수적입니다 운영을 확장함으로써 표준을 훼손하지 않고."
      },
      {
        "text": "To protect advantages, is highly essential into emerging markets during this year.",
        "chunks": [
          "To protect advantages,",
          "is highly essential",
          "into emerging markets",
          "during this year."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 대단히 필수적입니다 신흥 시장 속으로 올해 동안."
      },
      {
        "text": "To protect advantages, is highly essential into emerging markets without compromising standards.",
        "chunks": [
          "To protect advantages,",
          "is highly essential",
          "into emerging markets",
          "without compromising standards."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 대단히 필수적입니다 신흥 시장 속으로 표준을 훼손하지 않고."
      },
      {
        "text": "To protect advantages, is highly essential to foster collaboration during this year.",
        "chunks": [
          "To protect advantages,",
          "is highly essential",
          "to foster collaboration",
          "during this year."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 대단히 필수적입니다 협업을 적극 조성하기 위해 올해 동안."
      },
      {
        "text": "To protect advantages, is highly essential to foster collaboration without compromising standards.",
        "chunks": [
          "To protect advantages,",
          "is highly essential",
          "to foster collaboration",
          "without compromising standards."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 대단히 필수적입니다 협업을 적극 조성하기 위해 표준을 훼손하지 않고."
      },
      {
        "text": "To protect advantages, is highly essential which enhances productivity during this year.",
        "chunks": [
          "To protect advantages,",
          "is highly essential",
          "which enhances productivity",
          "during this year."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 대단히 필수적입니다 생산성을 직접 향상시키는 올해 동안."
      },
      {
        "text": "To protect advantages, is highly essential which enhances productivity without compromising standards.",
        "chunks": [
          "To protect advantages,",
          "is highly essential",
          "which enhances productivity",
          "without compromising standards."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 대단히 필수적입니다 생산성을 직접 향상시키는 표준을 훼손하지 않고."
      },
      {
        "text": "To protect advantages, across global units in demanding environments during this year.",
        "chunks": [
          "To protect advantages,",
          "across global units",
          "in demanding environments",
          "during this year."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 글로벌 부서 전반에 걸쳐 까다로운 환경 속에서 올해 동안."
      },
      {
        "text": "To protect advantages, across global units in demanding environments without compromising standards.",
        "chunks": [
          "To protect advantages,",
          "across global units",
          "in demanding environments",
          "without compromising standards."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 글로벌 부서 전반에 걸쳐 까다로운 환경 속에서 표준을 훼손하지 않고."
      },
      {
        "text": "To protect advantages, across global units by expanding operations during this year.",
        "chunks": [
          "To protect advantages,",
          "across global units",
          "by expanding operations",
          "during this year."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 글로벌 부서 전반에 걸쳐 운영을 확장함으로써 올해 동안."
      },
      {
        "text": "To protect advantages, across global units by expanding operations without compromising standards.",
        "chunks": [
          "To protect advantages,",
          "across global units",
          "by expanding operations",
          "without compromising standards."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 글로벌 부서 전반에 걸쳐 운영을 확장함으로써 표준을 훼손하지 않고."
      },
      {
        "text": "To protect advantages, across global units into emerging markets during this year.",
        "chunks": [
          "To protect advantages,",
          "across global units",
          "into emerging markets",
          "during this year."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 글로벌 부서 전반에 걸쳐 신흥 시장 속으로 올해 동안."
      },
      {
        "text": "To protect advantages, across global units into emerging markets without compromising standards.",
        "chunks": [
          "To protect advantages,",
          "across global units",
          "into emerging markets",
          "without compromising standards."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 글로벌 부서 전반에 걸쳐 신흥 시장 속으로 표준을 훼손하지 않고."
      },
      {
        "text": "To protect advantages, across global units to foster collaboration during this year.",
        "chunks": [
          "To protect advantages,",
          "across global units",
          "to foster collaboration",
          "during this year."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 글로벌 부서 전반에 걸쳐 협업을 적극 조성하기 위해 올해 동안."
      },
      {
        "text": "To protect advantages, across global units to foster collaboration without compromising standards.",
        "chunks": [
          "To protect advantages,",
          "across global units",
          "to foster collaboration",
          "without compromising standards."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 글로벌 부서 전반에 걸쳐 협업을 적극 조성하기 위해 표준을 훼손하지 않고."
      },
      {
        "text": "To protect advantages, across global units which enhances productivity during this year.",
        "chunks": [
          "To protect advantages,",
          "across global units",
          "which enhances productivity",
          "during this year."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 글로벌 부서 전반에 걸쳐 생산성을 직접 향상시키는 올해 동안."
      },
      {
        "text": "To protect advantages, across global units which enhances productivity without compromising standards.",
        "chunks": [
          "To protect advantages,",
          "across global units",
          "which enhances productivity",
          "without compromising standards."
        ],
        "translation": "경쟁적 우위를 보호하기 위해, 글로벌 부서 전반에 걸쳐 생산성을 직접 향상시키는 표준을 훼손하지 않고."
      },
      {
        "text": "Strengthening supply networks is highly essential in demanding environments during this year.",
        "chunks": [
          "Strengthening supply networks",
          "is highly essential",
          "in demanding environments",
          "during this year."
        ],
        "translation": "공급 네트워크의 강화는 대단히 필수적입니다 까다로운 환경 속에서 올해 동안."
      },
      {
        "text": "Strengthening supply networks is highly essential in demanding environments without compromising standards.",
        "chunks": [
          "Strengthening supply networks",
          "is highly essential",
          "in demanding environments",
          "without compromising standards."
        ],
        "translation": "공급 네트워크의 강화는 대단히 필수적입니다 까다로운 환경 속에서 표준을 훼손하지 않고."
      },
      {
        "text": "Strengthening supply networks is highly essential by expanding operations during this year.",
        "chunks": [
          "Strengthening supply networks",
          "is highly essential",
          "by expanding operations",
          "during this year."
        ],
        "translation": "공급 네트워크의 강화는 대단히 필수적입니다 운영을 확장함으로써 올해 동안."
      },
      {
        "text": "Strengthening supply networks is highly essential by expanding operations without compromising standards.",
        "chunks": [
          "Strengthening supply networks",
          "is highly essential",
          "by expanding operations",
          "without compromising standards."
        ],
        "translation": "공급 네트워크의 강화는 대단히 필수적입니다 운영을 확장함으로써 표준을 훼손하지 않고."
      },
      {
        "text": "Strengthening supply networks is highly essential into emerging markets during this year.",
        "chunks": [
          "Strengthening supply networks",
          "is highly essential",
          "into emerging markets",
          "during this year."
        ],
        "translation": "공급 네트워크의 강화는 대단히 필수적입니다 신흥 시장 속으로 올해 동안."
      },
      {
        "text": "Strengthening supply networks is highly essential into emerging markets without compromising standards.",
        "chunks": [
          "Strengthening supply networks",
          "is highly essential",
          "into emerging markets",
          "without compromising standards."
        ],
        "translation": "공급 네트워크의 강화는 대단히 필수적입니다 신흥 시장 속으로 표준을 훼손하지 않고."
      },
      {
        "text": "Strengthening supply networks is highly essential to foster collaboration during this year.",
        "chunks": [
          "Strengthening supply networks",
          "is highly essential",
          "to foster collaboration",
          "during this year."
        ],
        "translation": "공급 네트워크의 강화는 대단히 필수적입니다 협업을 적극 조성하기 위해 올해 동안."
      },
      {
        "text": "Strengthening supply networks is highly essential to foster collaboration without compromising standards.",
        "chunks": [
          "Strengthening supply networks",
          "is highly essential",
          "to foster collaboration",
          "without compromising standards."
        ],
        "translation": "공급 네트워크의 강화는 대단히 필수적입니다 협업을 적극 조성하기 위해 표준을 훼손하지 않고."
      },
      {
        "text": "Strengthening supply networks is highly essential which enhances productivity during this year.",
        "chunks": [
          "Strengthening supply networks",
          "is highly essential",
          "which enhances productivity",
          "during this year."
        ],
        "translation": "공급 네트워크의 강화는 대단히 필수적입니다 생산성을 직접 향상시키는 올해 동안."
      },
      {
        "text": "Strengthening supply networks is highly essential which enhances productivity without compromising standards.",
        "chunks": [
          "Strengthening supply networks",
          "is highly essential",
          "which enhances productivity",
          "without compromising standards."
        ],
        "translation": "공급 네트워크의 강화는 대단히 필수적입니다 생산성을 직접 향상시키는 표준을 훼손하지 않고."
      },
      {
        "text": "Strengthening supply networks across global units in demanding environments during this year.",
        "chunks": [
          "Strengthening supply networks",
          "across global units",
          "in demanding environments",
          "during this year."
        ],
        "translation": "공급 네트워크의 강화는 글로벌 부서 전반에 걸쳐 까다로운 환경 속에서 올해 동안."
      },
      {
        "text": "Strengthening supply networks across global units in demanding environments without compromising standards.",
        "chunks": [
          "Strengthening supply networks",
          "across global units",
          "in demanding environments",
          "without compromising standards."
        ],
        "translation": "공급 네트워크의 강화는 글로벌 부서 전반에 걸쳐 까다로운 환경 속에서 표준을 훼손하지 않고."
      },
      {
        "text": "Strengthening supply networks across global units by expanding operations during this year.",
        "chunks": [
          "Strengthening supply networks",
          "across global units",
          "by expanding operations",
          "during this year."
        ],
        "translation": "공급 네트워크의 강화는 글로벌 부서 전반에 걸쳐 운영을 확장함으로써 올해 동안."
      },
      {
        "text": "Strengthening supply networks across global units by expanding operations without compromising standards.",
        "chunks": [
          "Strengthening supply networks",
          "across global units",
          "by expanding operations",
          "without compromising standards."
        ],
        "translation": "공급 네트워크의 강화는 글로벌 부서 전반에 걸쳐 운영을 확장함으로써 표준을 훼손하지 않고."
      },
      {
        "text": "Strengthening supply networks across global units into emerging markets during this year.",
        "chunks": [
          "Strengthening supply networks",
          "across global units",
          "into emerging markets",
          "during this year."
        ],
        "translation": "공급 네트워크의 강화는 글로벌 부서 전반에 걸쳐 신흥 시장 속으로 올해 동안."
      },
      {
        "text": "Strengthening supply networks across global units into emerging markets without compromising standards.",
        "chunks": [
          "Strengthening supply networks",
          "across global units",
          "into emerging markets",
          "without compromising standards."
        ],
        "translation": "공급 네트워크의 강화는 글로벌 부서 전반에 걸쳐 신흥 시장 속으로 표준을 훼손하지 않고."
      },
      {
        "text": "Strengthening supply networks across global units to foster collaboration during this year.",
        "chunks": [
          "Strengthening supply networks",
          "across global units",
          "to foster collaboration",
          "during this year."
        ],
        "translation": "공급 네트워크의 강화는 글로벌 부서 전반에 걸쳐 협업을 적극 조성하기 위해 올해 동안."
      },
      {
        "text": "Strengthening supply networks across global units to foster collaboration without compromising standards.",
        "chunks": [
          "Strengthening supply networks",
          "across global units",
          "to foster collaboration",
          "without compromising standards."
        ],
        "translation": "공급 네트워크의 강화는 글로벌 부서 전반에 걸쳐 협업을 적극 조성하기 위해 표준을 훼손하지 않고."
      },
      {
        "text": "Strengthening supply networks across global units which enhances productivity during this year.",
        "chunks": [
          "Strengthening supply networks",
          "across global units",
          "which enhances productivity",
          "during this year."
        ],
        "translation": "공급 네트워크의 강화는 글로벌 부서 전반에 걸쳐 생산성을 직접 향상시키는 올해 동안."
      },
      {
        "text": "Strengthening supply networks across global units which enhances productivity without compromising standards.",
        "chunks": [
          "Strengthening supply networks",
          "across global units",
          "which enhances productivity",
          "without compromising standards."
        ],
        "translation": "공급 네트워크의 강화는 글로벌 부서 전반에 걸쳐 생산성을 직접 향상시키는 표준을 훼손하지 않고."
      }
    ]
  },
  "C1": {
    "2": [
      {
        "text": "The board reached a unanimous policy consensus.",
        "chunks": [
          "The board reached",
          "a unanimous policy consensus."
        ],
        "translation": "이사회는 도달했습니다 만장일치의 정책 합의에."
      },
      {
        "text": "The board reached preempts operational bottlenecks.",
        "chunks": [
          "The board reached",
          "preempts operational bottlenecks."
        ],
        "translation": "이사회는 도달했습니다 운영상의 병목 현상을 선제 방지합니다."
      },
      {
        "text": "The board reached upon agile monetary policies.",
        "chunks": [
          "The board reached",
          "upon agile monetary policies."
        ],
        "translation": "이사회는 도달했습니다 기민한 통화 정책에."
      },
      {
        "text": "The board reached fosters institutional investor confidence.",
        "chunks": [
          "The board reached",
          "fosters institutional investor confidence."
        ],
        "translation": "이사회는 도달했습니다 기관 투자자의 신뢰를 촉진합니다."
      },
      {
        "text": "The board reached demand rigorous expenditure oversight.",
        "chunks": [
          "The board reached",
          "demand rigorous expenditure oversight."
        ],
        "translation": "이사회는 도달했습니다 엄격한 지출 감독을 요구합니다."
      },
      {
        "text": "The board reached requires transparent executive dialogue.",
        "chunks": [
          "The board reached",
          "requires transparent executive dialogue."
        ],
        "translation": "이사회는 도달했습니다 투명한 경영진 대화를 요구합니다."
      },
      {
        "text": "The board reached enables unprecedented technological innovation.",
        "chunks": [
          "The board reached",
          "enables unprecedented technological innovation."
        ],
        "translation": "이사회는 도달했습니다 전례 없는 기술 혁신을 가능하게 합니다."
      },
      {
        "text": "The board reached preempts volatile market disruptions.",
        "chunks": [
          "The board reached",
          "preempts volatile market disruptions."
        ],
        "translation": "이사회는 도달했습니다 변동성 큰 시장 붕괴를 선제 방어합니다."
      },
      {
        "text": "The board reached dismantles legacy business paradigms.",
        "chunks": [
          "The board reached",
          "dismantles legacy business paradigms."
        ],
        "translation": "이사회는 도달했습니다 기존 비즈니스 패러다임을 해체합니다."
      },
      {
        "text": "The board reached hedges systemic macroeconomic volatility.",
        "chunks": [
          "The board reached",
          "hedges systemic macroeconomic volatility."
        ],
        "translation": "이사회는 도달했습니다 구조적 거시 경제 변동성을 방어합니다."
      },
      {
        "text": "Meticulous regulatory scrutiny a unanimous policy consensus.",
        "chunks": [
          "Meticulous regulatory scrutiny",
          "a unanimous policy consensus."
        ],
        "translation": "철저한 규제 정밀 검토는 만장일치의 정책 합의에."
      },
      {
        "text": "Meticulous regulatory scrutiny preempts operational bottlenecks.",
        "chunks": [
          "Meticulous regulatory scrutiny",
          "preempts operational bottlenecks."
        ],
        "translation": "철저한 규제 정밀 검토는 운영상의 병목 현상을 선제 방지합니다."
      },
      {
        "text": "Meticulous regulatory scrutiny upon agile monetary policies.",
        "chunks": [
          "Meticulous regulatory scrutiny",
          "upon agile monetary policies."
        ],
        "translation": "철저한 규제 정밀 검토는 기민한 통화 정책에."
      },
      {
        "text": "Meticulous regulatory scrutiny fosters institutional investor confidence.",
        "chunks": [
          "Meticulous regulatory scrutiny",
          "fosters institutional investor confidence."
        ],
        "translation": "철저한 규제 정밀 검토는 기관 투자자의 신뢰를 촉진합니다."
      },
      {
        "text": "Meticulous regulatory scrutiny demand rigorous expenditure oversight.",
        "chunks": [
          "Meticulous regulatory scrutiny",
          "demand rigorous expenditure oversight."
        ],
        "translation": "철저한 규제 정밀 검토는 엄격한 지출 감독을 요구합니다."
      },
      {
        "text": "Meticulous regulatory scrutiny requires transparent executive dialogue.",
        "chunks": [
          "Meticulous regulatory scrutiny",
          "requires transparent executive dialogue."
        ],
        "translation": "철저한 규제 정밀 검토는 투명한 경영진 대화를 요구합니다."
      },
      {
        "text": "Meticulous regulatory scrutiny enables unprecedented technological innovation.",
        "chunks": [
          "Meticulous regulatory scrutiny",
          "enables unprecedented technological innovation."
        ],
        "translation": "철저한 규제 정밀 검토는 전례 없는 기술 혁신을 가능하게 합니다."
      },
      {
        "text": "Meticulous regulatory scrutiny preempts volatile market disruptions.",
        "chunks": [
          "Meticulous regulatory scrutiny",
          "preempts volatile market disruptions."
        ],
        "translation": "철저한 규제 정밀 검토는 변동성 큰 시장 붕괴를 선제 방어합니다."
      },
      {
        "text": "Meticulous regulatory scrutiny dismantles legacy business paradigms.",
        "chunks": [
          "Meticulous regulatory scrutiny",
          "dismantles legacy business paradigms."
        ],
        "translation": "철저한 규제 정밀 검토는 기존 비즈니스 패러다임을 해체합니다."
      },
      {
        "text": "Meticulous regulatory scrutiny hedges systemic macroeconomic volatility.",
        "chunks": [
          "Meticulous regulatory scrutiny",
          "hedges systemic macroeconomic volatility."
        ],
        "translation": "철저한 규제 정밀 검토는 구조적 거시 경제 변동성을 방어합니다."
      },
      {
        "text": "Macroeconomic resilience hinges a unanimous policy consensus.",
        "chunks": [
          "Macroeconomic resilience hinges",
          "a unanimous policy consensus."
        ],
        "translation": "거시 경제적 회복력은 달려 있습니다 만장일치의 정책 합의에."
      },
      {
        "text": "Macroeconomic resilience hinges preempts operational bottlenecks.",
        "chunks": [
          "Macroeconomic resilience hinges",
          "preempts operational bottlenecks."
        ],
        "translation": "거시 경제적 회복력은 달려 있습니다 운영상의 병목 현상을 선제 방지합니다."
      },
      {
        "text": "Macroeconomic resilience hinges upon agile monetary policies.",
        "chunks": [
          "Macroeconomic resilience hinges",
          "upon agile monetary policies."
        ],
        "translation": "거시 경제적 회복력은 달려 있습니다 기민한 통화 정책에."
      },
      {
        "text": "Macroeconomic resilience hinges fosters institutional investor confidence.",
        "chunks": [
          "Macroeconomic resilience hinges",
          "fosters institutional investor confidence."
        ],
        "translation": "거시 경제적 회복력은 달려 있습니다 기관 투자자의 신뢰를 촉진합니다."
      },
      {
        "text": "Macroeconomic resilience hinges demand rigorous expenditure oversight.",
        "chunks": [
          "Macroeconomic resilience hinges",
          "demand rigorous expenditure oversight."
        ],
        "translation": "거시 경제적 회복력은 달려 있습니다 엄격한 지출 감독을 요구합니다."
      },
      {
        "text": "Macroeconomic resilience hinges requires transparent executive dialogue.",
        "chunks": [
          "Macroeconomic resilience hinges",
          "requires transparent executive dialogue."
        ],
        "translation": "거시 경제적 회복력은 달려 있습니다 투명한 경영진 대화를 요구합니다."
      },
      {
        "text": "Macroeconomic resilience hinges enables unprecedented technological innovation.",
        "chunks": [
          "Macroeconomic resilience hinges",
          "enables unprecedented technological innovation."
        ],
        "translation": "거시 경제적 회복력은 달려 있습니다 전례 없는 기술 혁신을 가능하게 합니다."
      },
      {
        "text": "Macroeconomic resilience hinges preempts volatile market disruptions.",
        "chunks": [
          "Macroeconomic resilience hinges",
          "preempts volatile market disruptions."
        ],
        "translation": "거시 경제적 회복력은 달려 있습니다 변동성 큰 시장 붕괴를 선제 방어합니다."
      },
      {
        "text": "Macroeconomic resilience hinges dismantles legacy business paradigms.",
        "chunks": [
          "Macroeconomic resilience hinges",
          "dismantles legacy business paradigms."
        ],
        "translation": "거시 경제적 회복력은 달려 있습니다 기존 비즈니스 패러다임을 해체합니다."
      },
      {
        "text": "Macroeconomic resilience hinges hedges systemic macroeconomic volatility.",
        "chunks": [
          "Macroeconomic resilience hinges",
          "hedges systemic macroeconomic volatility."
        ],
        "translation": "거시 경제적 회복력은 달려 있습니다 구조적 거시 경제 변동성을 방어합니다."
      },
      {
        "text": "Transparent corporate governance a unanimous policy consensus.",
        "chunks": [
          "Transparent corporate governance",
          "a unanimous policy consensus."
        ],
        "translation": "투명한 기업 지배구조는 만장일치의 정책 합의에."
      },
      {
        "text": "Transparent corporate governance preempts operational bottlenecks.",
        "chunks": [
          "Transparent corporate governance",
          "preempts operational bottlenecks."
        ],
        "translation": "투명한 기업 지배구조는 운영상의 병목 현상을 선제 방지합니다."
      },
      {
        "text": "Transparent corporate governance upon agile monetary policies.",
        "chunks": [
          "Transparent corporate governance",
          "upon agile monetary policies."
        ],
        "translation": "투명한 기업 지배구조는 기민한 통화 정책에."
      },
      {
        "text": "Transparent corporate governance fosters institutional investor confidence.",
        "chunks": [
          "Transparent corporate governance",
          "fosters institutional investor confidence."
        ],
        "translation": "투명한 기업 지배구조는 기관 투자자의 신뢰를 촉진합니다."
      },
      {
        "text": "Transparent corporate governance demand rigorous expenditure oversight.",
        "chunks": [
          "Transparent corporate governance",
          "demand rigorous expenditure oversight."
        ],
        "translation": "투명한 기업 지배구조는 엄격한 지출 감독을 요구합니다."
      },
      {
        "text": "Transparent corporate governance requires transparent executive dialogue.",
        "chunks": [
          "Transparent corporate governance",
          "requires transparent executive dialogue."
        ],
        "translation": "투명한 기업 지배구조는 투명한 경영진 대화를 요구합니다."
      },
      {
        "text": "Transparent corporate governance enables unprecedented technological innovation.",
        "chunks": [
          "Transparent corporate governance",
          "enables unprecedented technological innovation."
        ],
        "translation": "투명한 기업 지배구조는 전례 없는 기술 혁신을 가능하게 합니다."
      },
      {
        "text": "Transparent corporate governance preempts volatile market disruptions.",
        "chunks": [
          "Transparent corporate governance",
          "preempts volatile market disruptions."
        ],
        "translation": "투명한 기업 지배구조는 변동성 큰 시장 붕괴를 선제 방어합니다."
      },
      {
        "text": "Transparent corporate governance dismantles legacy business paradigms.",
        "chunks": [
          "Transparent corporate governance",
          "dismantles legacy business paradigms."
        ],
        "translation": "투명한 기업 지배구조는 기존 비즈니스 패러다임을 해체합니다."
      },
      {
        "text": "Transparent corporate governance hedges systemic macroeconomic volatility.",
        "chunks": [
          "Transparent corporate governance",
          "hedges systemic macroeconomic volatility."
        ],
        "translation": "투명한 기업 지배구조는 구조적 거시 경제 변동성을 방어합니다."
      },
      {
        "text": "Fiscal consolidation measures a unanimous policy consensus.",
        "chunks": [
          "Fiscal consolidation measures",
          "a unanimous policy consensus."
        ],
        "translation": "재정 건전화 조치는 만장일치의 정책 합의에."
      },
      {
        "text": "Fiscal consolidation measures preempts operational bottlenecks.",
        "chunks": [
          "Fiscal consolidation measures",
          "preempts operational bottlenecks."
        ],
        "translation": "재정 건전화 조치는 운영상의 병목 현상을 선제 방지합니다."
      },
      {
        "text": "Fiscal consolidation measures upon agile monetary policies.",
        "chunks": [
          "Fiscal consolidation measures",
          "upon agile monetary policies."
        ],
        "translation": "재정 건전화 조치는 기민한 통화 정책에."
      },
      {
        "text": "Fiscal consolidation measures fosters institutional investor confidence.",
        "chunks": [
          "Fiscal consolidation measures",
          "fosters institutional investor confidence."
        ],
        "translation": "재정 건전화 조치는 기관 투자자의 신뢰를 촉진합니다."
      },
      {
        "text": "Fiscal consolidation measures demand rigorous expenditure oversight.",
        "chunks": [
          "Fiscal consolidation measures",
          "demand rigorous expenditure oversight."
        ],
        "translation": "재정 건전화 조치는 엄격한 지출 감독을 요구합니다."
      },
      {
        "text": "Fiscal consolidation measures requires transparent executive dialogue.",
        "chunks": [
          "Fiscal consolidation measures",
          "requires transparent executive dialogue."
        ],
        "translation": "재정 건전화 조치는 투명한 경영진 대화를 요구합니다."
      },
      {
        "text": "Fiscal consolidation measures enables unprecedented technological innovation.",
        "chunks": [
          "Fiscal consolidation measures",
          "enables unprecedented technological innovation."
        ],
        "translation": "재정 건전화 조치는 전례 없는 기술 혁신을 가능하게 합니다."
      },
      {
        "text": "Fiscal consolidation measures preempts volatile market disruptions.",
        "chunks": [
          "Fiscal consolidation measures",
          "preempts volatile market disruptions."
        ],
        "translation": "재정 건전화 조치는 변동성 큰 시장 붕괴를 선제 방어합니다."
      },
      {
        "text": "Fiscal consolidation measures dismantles legacy business paradigms.",
        "chunks": [
          "Fiscal consolidation measures",
          "dismantles legacy business paradigms."
        ],
        "translation": "재정 건전화 조치는 기존 비즈니스 패러다임을 해체합니다."
      },
      {
        "text": "Fiscal consolidation measures hedges systemic macroeconomic volatility.",
        "chunks": [
          "Fiscal consolidation measures",
          "hedges systemic macroeconomic volatility."
        ],
        "translation": "재정 건전화 조치는 구조적 거시 경제 변동성을 방어합니다."
      },
      {
        "text": "Cultivating organizational synergy a unanimous policy consensus.",
        "chunks": [
          "Cultivating organizational synergy",
          "a unanimous policy consensus."
        ],
        "translation": "조직 시너지를 육성하는 것은 만장일치의 정책 합의에."
      },
      {
        "text": "Cultivating organizational synergy preempts operational bottlenecks.",
        "chunks": [
          "Cultivating organizational synergy",
          "preempts operational bottlenecks."
        ],
        "translation": "조직 시너지를 육성하는 것은 운영상의 병목 현상을 선제 방지합니다."
      },
      {
        "text": "Cultivating organizational synergy upon agile monetary policies.",
        "chunks": [
          "Cultivating organizational synergy",
          "upon agile monetary policies."
        ],
        "translation": "조직 시너지를 육성하는 것은 기민한 통화 정책에."
      },
      {
        "text": "Cultivating organizational synergy fosters institutional investor confidence.",
        "chunks": [
          "Cultivating organizational synergy",
          "fosters institutional investor confidence."
        ],
        "translation": "조직 시너지를 육성하는 것은 기관 투자자의 신뢰를 촉진합니다."
      },
      {
        "text": "Cultivating organizational synergy demand rigorous expenditure oversight.",
        "chunks": [
          "Cultivating organizational synergy",
          "demand rigorous expenditure oversight."
        ],
        "translation": "조직 시너지를 육성하는 것은 엄격한 지출 감독을 요구합니다."
      },
      {
        "text": "Cultivating organizational synergy requires transparent executive dialogue.",
        "chunks": [
          "Cultivating organizational synergy",
          "requires transparent executive dialogue."
        ],
        "translation": "조직 시너지를 육성하는 것은 투명한 경영진 대화를 요구합니다."
      },
      {
        "text": "Cultivating organizational synergy enables unprecedented technological innovation.",
        "chunks": [
          "Cultivating organizational synergy",
          "enables unprecedented technological innovation."
        ],
        "translation": "조직 시너지를 육성하는 것은 전례 없는 기술 혁신을 가능하게 합니다."
      },
      {
        "text": "Cultivating organizational synergy preempts volatile market disruptions.",
        "chunks": [
          "Cultivating organizational synergy",
          "preempts volatile market disruptions."
        ],
        "translation": "조직 시너지를 육성하는 것은 변동성 큰 시장 붕괴를 선제 방어합니다."
      },
      {
        "text": "Cultivating organizational synergy dismantles legacy business paradigms.",
        "chunks": [
          "Cultivating organizational synergy",
          "dismantles legacy business paradigms."
        ],
        "translation": "조직 시너지를 육성하는 것은 기존 비즈니스 패러다임을 해체합니다."
      },
      {
        "text": "Cultivating organizational synergy hedges systemic macroeconomic volatility.",
        "chunks": [
          "Cultivating organizational synergy",
          "hedges systemic macroeconomic volatility."
        ],
        "translation": "조직 시너지를 육성하는 것은 구조적 거시 경제 변동성을 방어합니다."
      },
      {
        "text": "Challenging orthodox assumptions a unanimous policy consensus.",
        "chunks": [
          "Challenging orthodox assumptions",
          "a unanimous policy consensus."
        ],
        "translation": "기존 통념에 도전하는 것은 만장일치의 정책 합의에."
      },
      {
        "text": "Challenging orthodox assumptions preempts operational bottlenecks.",
        "chunks": [
          "Challenging orthodox assumptions",
          "preempts operational bottlenecks."
        ],
        "translation": "기존 통념에 도전하는 것은 운영상의 병목 현상을 선제 방지합니다."
      },
      {
        "text": "Challenging orthodox assumptions upon agile monetary policies.",
        "chunks": [
          "Challenging orthodox assumptions",
          "upon agile monetary policies."
        ],
        "translation": "기존 통념에 도전하는 것은 기민한 통화 정책에."
      },
      {
        "text": "Challenging orthodox assumptions fosters institutional investor confidence.",
        "chunks": [
          "Challenging orthodox assumptions",
          "fosters institutional investor confidence."
        ],
        "translation": "기존 통념에 도전하는 것은 기관 투자자의 신뢰를 촉진합니다."
      },
      {
        "text": "Challenging orthodox assumptions demand rigorous expenditure oversight.",
        "chunks": [
          "Challenging orthodox assumptions",
          "demand rigorous expenditure oversight."
        ],
        "translation": "기존 통념에 도전하는 것은 엄격한 지출 감독을 요구합니다."
      },
      {
        "text": "Challenging orthodox assumptions requires transparent executive dialogue.",
        "chunks": [
          "Challenging orthodox assumptions",
          "requires transparent executive dialogue."
        ],
        "translation": "기존 통념에 도전하는 것은 투명한 경영진 대화를 요구합니다."
      },
      {
        "text": "Challenging orthodox assumptions enables unprecedented technological innovation.",
        "chunks": [
          "Challenging orthodox assumptions",
          "enables unprecedented technological innovation."
        ],
        "translation": "기존 통념에 도전하는 것은 전례 없는 기술 혁신을 가능하게 합니다."
      },
      {
        "text": "Challenging orthodox assumptions preempts volatile market disruptions.",
        "chunks": [
          "Challenging orthodox assumptions",
          "preempts volatile market disruptions."
        ],
        "translation": "기존 통념에 도전하는 것은 변동성 큰 시장 붕괴를 선제 방어합니다."
      },
      {
        "text": "Challenging orthodox assumptions dismantles legacy business paradigms.",
        "chunks": [
          "Challenging orthodox assumptions",
          "dismantles legacy business paradigms."
        ],
        "translation": "기존 통념에 도전하는 것은 기존 비즈니스 패러다임을 해체합니다."
      },
      {
        "text": "Challenging orthodox assumptions hedges systemic macroeconomic volatility.",
        "chunks": [
          "Challenging orthodox assumptions",
          "hedges systemic macroeconomic volatility."
        ],
        "translation": "기존 통념에 도전하는 것은 구조적 거시 경제 변동성을 방어합니다."
      },
      {
        "text": "Fostering institutional agility a unanimous policy consensus.",
        "chunks": [
          "Fostering institutional agility",
          "a unanimous policy consensus."
        ],
        "translation": "기관의 기민성을 함양하는 것은 만장일치의 정책 합의에."
      },
      {
        "text": "Fostering institutional agility preempts operational bottlenecks.",
        "chunks": [
          "Fostering institutional agility",
          "preempts operational bottlenecks."
        ],
        "translation": "기관의 기민성을 함양하는 것은 운영상의 병목 현상을 선제 방지합니다."
      },
      {
        "text": "Fostering institutional agility upon agile monetary policies.",
        "chunks": [
          "Fostering institutional agility",
          "upon agile monetary policies."
        ],
        "translation": "기관의 기민성을 함양하는 것은 기민한 통화 정책에."
      },
      {
        "text": "Fostering institutional agility fosters institutional investor confidence.",
        "chunks": [
          "Fostering institutional agility",
          "fosters institutional investor confidence."
        ],
        "translation": "기관의 기민성을 함양하는 것은 기관 투자자의 신뢰를 촉진합니다."
      },
      {
        "text": "Fostering institutional agility demand rigorous expenditure oversight.",
        "chunks": [
          "Fostering institutional agility",
          "demand rigorous expenditure oversight."
        ],
        "translation": "기관의 기민성을 함양하는 것은 엄격한 지출 감독을 요구합니다."
      },
      {
        "text": "Fostering institutional agility requires transparent executive dialogue.",
        "chunks": [
          "Fostering institutional agility",
          "requires transparent executive dialogue."
        ],
        "translation": "기관의 기민성을 함양하는 것은 투명한 경영진 대화를 요구합니다."
      },
      {
        "text": "Fostering institutional agility enables unprecedented technological innovation.",
        "chunks": [
          "Fostering institutional agility",
          "enables unprecedented technological innovation."
        ],
        "translation": "기관의 기민성을 함양하는 것은 전례 없는 기술 혁신을 가능하게 합니다."
      },
      {
        "text": "Fostering institutional agility preempts volatile market disruptions.",
        "chunks": [
          "Fostering institutional agility",
          "preempts volatile market disruptions."
        ],
        "translation": "기관의 기민성을 함양하는 것은 변동성 큰 시장 붕괴를 선제 방어합니다."
      },
      {
        "text": "Fostering institutional agility dismantles legacy business paradigms.",
        "chunks": [
          "Fostering institutional agility",
          "dismantles legacy business paradigms."
        ],
        "translation": "기관의 기민성을 함양하는 것은 기존 비즈니스 패러다임을 해체합니다."
      },
      {
        "text": "Fostering institutional agility hedges systemic macroeconomic volatility.",
        "chunks": [
          "Fostering institutional agility",
          "hedges systemic macroeconomic volatility."
        ],
        "translation": "기관의 기민성을 함양하는 것은 구조적 거시 경제 변동성을 방어합니다."
      },
      {
        "text": "Pioneering artificial intelligence a unanimous policy consensus.",
        "chunks": [
          "Pioneering artificial intelligence",
          "a unanimous policy consensus."
        ],
        "translation": "선구적인 인공지능 기술은 만장일치의 정책 합의에."
      },
      {
        "text": "Pioneering artificial intelligence preempts operational bottlenecks.",
        "chunks": [
          "Pioneering artificial intelligence",
          "preempts operational bottlenecks."
        ],
        "translation": "선구적인 인공지능 기술은 운영상의 병목 현상을 선제 방지합니다."
      },
      {
        "text": "Pioneering artificial intelligence upon agile monetary policies.",
        "chunks": [
          "Pioneering artificial intelligence",
          "upon agile monetary policies."
        ],
        "translation": "선구적인 인공지능 기술은 기민한 통화 정책에."
      },
      {
        "text": "Pioneering artificial intelligence fosters institutional investor confidence.",
        "chunks": [
          "Pioneering artificial intelligence",
          "fosters institutional investor confidence."
        ],
        "translation": "선구적인 인공지능 기술은 기관 투자자의 신뢰를 촉진합니다."
      },
      {
        "text": "Pioneering artificial intelligence demand rigorous expenditure oversight.",
        "chunks": [
          "Pioneering artificial intelligence",
          "demand rigorous expenditure oversight."
        ],
        "translation": "선구적인 인공지능 기술은 엄격한 지출 감독을 요구합니다."
      },
      {
        "text": "Pioneering artificial intelligence requires transparent executive dialogue.",
        "chunks": [
          "Pioneering artificial intelligence",
          "requires transparent executive dialogue."
        ],
        "translation": "선구적인 인공지능 기술은 투명한 경영진 대화를 요구합니다."
      },
      {
        "text": "Pioneering artificial intelligence enables unprecedented technological innovation.",
        "chunks": [
          "Pioneering artificial intelligence",
          "enables unprecedented technological innovation."
        ],
        "translation": "선구적인 인공지능 기술은 전례 없는 기술 혁신을 가능하게 합니다."
      },
      {
        "text": "Pioneering artificial intelligence preempts volatile market disruptions.",
        "chunks": [
          "Pioneering artificial intelligence",
          "preempts volatile market disruptions."
        ],
        "translation": "선구적인 인공지능 기술은 변동성 큰 시장 붕괴를 선제 방어합니다."
      },
      {
        "text": "Pioneering artificial intelligence dismantles legacy business paradigms.",
        "chunks": [
          "Pioneering artificial intelligence",
          "dismantles legacy business paradigms."
        ],
        "translation": "선구적인 인공지능 기술은 기존 비즈니스 패러다임을 해체합니다."
      },
      {
        "text": "Pioneering artificial intelligence hedges systemic macroeconomic volatility.",
        "chunks": [
          "Pioneering artificial intelligence",
          "hedges systemic macroeconomic volatility."
        ],
        "translation": "선구적인 인공지능 기술은 구조적 거시 경제 변동성을 방어합니다."
      },
      {
        "text": "Comprehensive portfolio diversification a unanimous policy consensus.",
        "chunks": [
          "Comprehensive portfolio diversification",
          "a unanimous policy consensus."
        ],
        "translation": "포괄적인 포트폴리오 다각화는 만장일치의 정책 합의에."
      },
      {
        "text": "Comprehensive portfolio diversification preempts operational bottlenecks.",
        "chunks": [
          "Comprehensive portfolio diversification",
          "preempts operational bottlenecks."
        ],
        "translation": "포괄적인 포트폴리오 다각화는 운영상의 병목 현상을 선제 방지합니다."
      },
      {
        "text": "Comprehensive portfolio diversification upon agile monetary policies.",
        "chunks": [
          "Comprehensive portfolio diversification",
          "upon agile monetary policies."
        ],
        "translation": "포괄적인 포트폴리오 다각화는 기민한 통화 정책에."
      },
      {
        "text": "Comprehensive portfolio diversification fosters institutional investor confidence.",
        "chunks": [
          "Comprehensive portfolio diversification",
          "fosters institutional investor confidence."
        ],
        "translation": "포괄적인 포트폴리오 다각화는 기관 투자자의 신뢰를 촉진합니다."
      },
      {
        "text": "Comprehensive portfolio diversification demand rigorous expenditure oversight.",
        "chunks": [
          "Comprehensive portfolio diversification",
          "demand rigorous expenditure oversight."
        ],
        "translation": "포괄적인 포트폴리오 다각화는 엄격한 지출 감독을 요구합니다."
      },
      {
        "text": "Comprehensive portfolio diversification requires transparent executive dialogue.",
        "chunks": [
          "Comprehensive portfolio diversification",
          "requires transparent executive dialogue."
        ],
        "translation": "포괄적인 포트폴리오 다각화는 투명한 경영진 대화를 요구합니다."
      },
      {
        "text": "Comprehensive portfolio diversification enables unprecedented technological innovation.",
        "chunks": [
          "Comprehensive portfolio diversification",
          "enables unprecedented technological innovation."
        ],
        "translation": "포괄적인 포트폴리오 다각화는 전례 없는 기술 혁신을 가능하게 합니다."
      },
      {
        "text": "Comprehensive portfolio diversification preempts volatile market disruptions.",
        "chunks": [
          "Comprehensive portfolio diversification",
          "preempts volatile market disruptions."
        ],
        "translation": "포괄적인 포트폴리오 다각화는 변동성 큰 시장 붕괴를 선제 방어합니다."
      },
      {
        "text": "Comprehensive portfolio diversification dismantles legacy business paradigms.",
        "chunks": [
          "Comprehensive portfolio diversification",
          "dismantles legacy business paradigms."
        ],
        "translation": "포괄적인 포트폴리오 다각화는 기존 비즈니스 패러다임을 해체합니다."
      },
      {
        "text": "Comprehensive portfolio diversification hedges systemic macroeconomic volatility.",
        "chunks": [
          "Comprehensive portfolio diversification",
          "hedges systemic macroeconomic volatility."
        ],
        "translation": "포괄적인 포트폴리오 다각화는 구조적 거시 경제 변동성을 방어합니다."
      }
    ],
    "3": [
      {
        "text": "Sustainable macroeconomic resilience hinges on policy adjustments amid unprecedented geopolitical shifts.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "hinges on policy adjustments",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "지속 가능한 거시경제 회복력은 전례 없는 지정학적 격변 속에서. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Sustainable macroeconomic resilience hinges on policy adjustments prior to concluding mergers.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "hinges on policy adjustments",
          "prior to concluding mergers."
        ],
        "translation": "지속 가능한 거시경제 회복력은 합병 계약을 체결하기 전에. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Sustainable macroeconomic resilience hinges on policy adjustments to ensure organizational viability.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "hinges on policy adjustments",
          "to ensure organizational viability."
        ],
        "translation": "지속 가능한 거시경제 회복력은 조직 생존력을 보장하기 위해. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Sustainable macroeconomic resilience hinges on policy adjustments across distributed global subsidiaries.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "hinges on policy adjustments",
          "across distributed global subsidiaries."
        ],
        "translation": "지속 가능한 거시경제 회복력은 분산된 글로벌 자회사 전반에 걸쳐. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Sustainable macroeconomic resilience safeguards proprietary corporate assets amid unprecedented geopolitical shifts.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "safeguards proprietary corporate assets",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "지속 가능한 거시경제 회복력은 전례 없는 지정학적 격변 속에서. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience safeguards proprietary corporate assets prior to concluding mergers.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "safeguards proprietary corporate assets",
          "prior to concluding mergers."
        ],
        "translation": "지속 가능한 거시경제 회복력은 합병 계약을 체결하기 전에. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience safeguards proprietary corporate assets to ensure organizational viability.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "safeguards proprietary corporate assets",
          "to ensure organizational viability."
        ],
        "translation": "지속 가능한 거시경제 회복력은 조직 생존력을 보장하기 위해. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience safeguards proprietary corporate assets across distributed global subsidiaries.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "safeguards proprietary corporate assets",
          "across distributed global subsidiaries."
        ],
        "translation": "지속 가능한 거시경제 회복력은 분산된 글로벌 자회사 전반에 걸쳐. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience hedges against volatile fluctuations amid unprecedented geopolitical shifts.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "hedges against volatile fluctuations",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "지속 가능한 거시경제 회복력은 전례 없는 지정학적 격변 속에서. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience hedges against volatile fluctuations prior to concluding mergers.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "hedges against volatile fluctuations",
          "prior to concluding mergers."
        ],
        "translation": "지속 가능한 거시경제 회복력은 합병 계약을 체결하기 전에. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience hedges against volatile fluctuations to ensure organizational viability.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "hedges against volatile fluctuations",
          "to ensure organizational viability."
        ],
        "translation": "지속 가능한 거시경제 회복력은 조직 생존력을 보장하기 위해. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience hedges against volatile fluctuations across distributed global subsidiaries.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "hedges against volatile fluctuations",
          "across distributed global subsidiaries."
        ],
        "translation": "지속 가능한 거시경제 회복력은 분산된 글로벌 자회사 전반에 걸쳐. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience requires dismantling entrenched silos amid unprecedented geopolitical shifts.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "requires dismantling entrenched silos",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "지속 가능한 거시경제 회복력은 전례 없는 지정학적 격변 속에서. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience requires dismantling entrenched silos prior to concluding mergers.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "requires dismantling entrenched silos",
          "prior to concluding mergers."
        ],
        "translation": "지속 가능한 거시경제 회복력은 합병 계약을 체결하기 전에. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience requires dismantling entrenched silos to ensure organizational viability.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "requires dismantling entrenched silos",
          "to ensure organizational viability."
        ],
        "translation": "지속 가능한 거시경제 회복력은 조직 생존력을 보장하기 위해. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience requires dismantling entrenched silos across distributed global subsidiaries.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "requires dismantling entrenched silos",
          "across distributed global subsidiaries."
        ],
        "translation": "지속 가능한 거시경제 회복력은 분산된 글로벌 자회사 전반에 걸쳐. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience demands proactive international engagement amid unprecedented geopolitical shifts.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "demands proactive international engagement",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "지속 가능한 거시경제 회복력은 전례 없는 지정학적 격변 속에서. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience demands proactive international engagement prior to concluding mergers.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "demands proactive international engagement",
          "prior to concluding mergers."
        ],
        "translation": "지속 가능한 거시경제 회복력은 합병 계약을 체결하기 전에. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience demands proactive international engagement to ensure organizational viability.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "demands proactive international engagement",
          "to ensure organizational viability."
        ],
        "translation": "지속 가능한 거시경제 회복력은 조직 생존력을 보장하기 위해. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Sustainable macroeconomic resilience demands proactive international engagement across distributed global subsidiaries.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "demands proactive international engagement",
          "across distributed global subsidiaries."
        ],
        "translation": "지속 가능한 거시경제 회복력은 분산된 글로벌 자회사 전반에 걸쳐. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Meticulous regulatory compliance hinges on policy adjustments amid unprecedented geopolitical shifts.",
        "chunks": [
          "Meticulous regulatory compliance",
          "hinges on policy adjustments",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "철저한 규제 준법 체계는 전례 없는 지정학적 격변 속에서. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Meticulous regulatory compliance hinges on policy adjustments prior to concluding mergers.",
        "chunks": [
          "Meticulous regulatory compliance",
          "hinges on policy adjustments",
          "prior to concluding mergers."
        ],
        "translation": "철저한 규제 준법 체계는 합병 계약을 체결하기 전에. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Meticulous regulatory compliance hinges on policy adjustments to ensure organizational viability.",
        "chunks": [
          "Meticulous regulatory compliance",
          "hinges on policy adjustments",
          "to ensure organizational viability."
        ],
        "translation": "철저한 규제 준법 체계는 조직 생존력을 보장하기 위해. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Meticulous regulatory compliance hinges on policy adjustments across distributed global subsidiaries.",
        "chunks": [
          "Meticulous regulatory compliance",
          "hinges on policy adjustments",
          "across distributed global subsidiaries."
        ],
        "translation": "철저한 규제 준법 체계는 분산된 글로벌 자회사 전반에 걸쳐. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Meticulous regulatory compliance safeguards proprietary corporate assets amid unprecedented geopolitical shifts.",
        "chunks": [
          "Meticulous regulatory compliance",
          "safeguards proprietary corporate assets",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "철저한 규제 준법 체계는 전례 없는 지정학적 격변 속에서. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Meticulous regulatory compliance safeguards proprietary corporate assets prior to concluding mergers.",
        "chunks": [
          "Meticulous regulatory compliance",
          "safeguards proprietary corporate assets",
          "prior to concluding mergers."
        ],
        "translation": "철저한 규제 준법 체계는 합병 계약을 체결하기 전에. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Meticulous regulatory compliance safeguards proprietary corporate assets to ensure organizational viability.",
        "chunks": [
          "Meticulous regulatory compliance",
          "safeguards proprietary corporate assets",
          "to ensure organizational viability."
        ],
        "translation": "철저한 규제 준법 체계는 조직 생존력을 보장하기 위해. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Meticulous regulatory compliance safeguards proprietary corporate assets across distributed global subsidiaries.",
        "chunks": [
          "Meticulous regulatory compliance",
          "safeguards proprietary corporate assets",
          "across distributed global subsidiaries."
        ],
        "translation": "철저한 규제 준법 체계는 분산된 글로벌 자회사 전반에 걸쳐. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Meticulous regulatory compliance hedges against volatile fluctuations amid unprecedented geopolitical shifts.",
        "chunks": [
          "Meticulous regulatory compliance",
          "hedges against volatile fluctuations",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "철저한 규제 준법 체계는 전례 없는 지정학적 격변 속에서. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Meticulous regulatory compliance hedges against volatile fluctuations prior to concluding mergers.",
        "chunks": [
          "Meticulous regulatory compliance",
          "hedges against volatile fluctuations",
          "prior to concluding mergers."
        ],
        "translation": "철저한 규제 준법 체계는 합병 계약을 체결하기 전에. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Meticulous regulatory compliance hedges against volatile fluctuations to ensure organizational viability.",
        "chunks": [
          "Meticulous regulatory compliance",
          "hedges against volatile fluctuations",
          "to ensure organizational viability."
        ],
        "translation": "철저한 규제 준법 체계는 조직 생존력을 보장하기 위해. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Meticulous regulatory compliance hedges against volatile fluctuations across distributed global subsidiaries.",
        "chunks": [
          "Meticulous regulatory compliance",
          "hedges against volatile fluctuations",
          "across distributed global subsidiaries."
        ],
        "translation": "철저한 규제 준법 체계는 분산된 글로벌 자회사 전반에 걸쳐. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Meticulous regulatory compliance requires dismantling entrenched silos amid unprecedented geopolitical shifts.",
        "chunks": [
          "Meticulous regulatory compliance",
          "requires dismantling entrenched silos",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "철저한 규제 준법 체계는 전례 없는 지정학적 격변 속에서. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Meticulous regulatory compliance requires dismantling entrenched silos prior to concluding mergers.",
        "chunks": [
          "Meticulous regulatory compliance",
          "requires dismantling entrenched silos",
          "prior to concluding mergers."
        ],
        "translation": "철저한 규제 준법 체계는 합병 계약을 체결하기 전에. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Meticulous regulatory compliance requires dismantling entrenched silos to ensure organizational viability.",
        "chunks": [
          "Meticulous regulatory compliance",
          "requires dismantling entrenched silos",
          "to ensure organizational viability."
        ],
        "translation": "철저한 규제 준법 체계는 조직 생존력을 보장하기 위해. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Meticulous regulatory compliance requires dismantling entrenched silos across distributed global subsidiaries.",
        "chunks": [
          "Meticulous regulatory compliance",
          "requires dismantling entrenched silos",
          "across distributed global subsidiaries."
        ],
        "translation": "철저한 규제 준법 체계는 분산된 글로벌 자회사 전반에 걸쳐. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Meticulous regulatory compliance demands proactive international engagement amid unprecedented geopolitical shifts.",
        "chunks": [
          "Meticulous regulatory compliance",
          "demands proactive international engagement",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "철저한 규제 준법 체계는 전례 없는 지정학적 격변 속에서. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Meticulous regulatory compliance demands proactive international engagement prior to concluding mergers.",
        "chunks": [
          "Meticulous regulatory compliance",
          "demands proactive international engagement",
          "prior to concluding mergers."
        ],
        "translation": "철저한 규제 준법 체계는 합병 계약을 체결하기 전에. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Meticulous regulatory compliance demands proactive international engagement to ensure organizational viability.",
        "chunks": [
          "Meticulous regulatory compliance",
          "demands proactive international engagement",
          "to ensure organizational viability."
        ],
        "translation": "철저한 규제 준법 체계는 조직 생존력을 보장하기 위해. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Meticulous regulatory compliance demands proactive international engagement across distributed global subsidiaries.",
        "chunks": [
          "Meticulous regulatory compliance",
          "demands proactive international engagement",
          "across distributed global subsidiaries."
        ],
        "translation": "철저한 규제 준법 체계는 분산된 글로벌 자회사 전반에 걸쳐. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Strategic portfolio diversification hinges on policy adjustments amid unprecedented geopolitical shifts.",
        "chunks": [
          "Strategic portfolio diversification",
          "hinges on policy adjustments",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "전략적인 포트폴리오 다각화는 전례 없는 지정학적 격변 속에서. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Strategic portfolio diversification hinges on policy adjustments prior to concluding mergers.",
        "chunks": [
          "Strategic portfolio diversification",
          "hinges on policy adjustments",
          "prior to concluding mergers."
        ],
        "translation": "전략적인 포트폴리오 다각화는 합병 계약을 체결하기 전에. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Strategic portfolio diversification hinges on policy adjustments to ensure organizational viability.",
        "chunks": [
          "Strategic portfolio diversification",
          "hinges on policy adjustments",
          "to ensure organizational viability."
        ],
        "translation": "전략적인 포트폴리오 다각화는 조직 생존력을 보장하기 위해. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Strategic portfolio diversification hinges on policy adjustments across distributed global subsidiaries.",
        "chunks": [
          "Strategic portfolio diversification",
          "hinges on policy adjustments",
          "across distributed global subsidiaries."
        ],
        "translation": "전략적인 포트폴리오 다각화는 분산된 글로벌 자회사 전반에 걸쳐. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Strategic portfolio diversification safeguards proprietary corporate assets amid unprecedented geopolitical shifts.",
        "chunks": [
          "Strategic portfolio diversification",
          "safeguards proprietary corporate assets",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "전략적인 포트폴리오 다각화는 전례 없는 지정학적 격변 속에서. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Strategic portfolio diversification safeguards proprietary corporate assets prior to concluding mergers.",
        "chunks": [
          "Strategic portfolio diversification",
          "safeguards proprietary corporate assets",
          "prior to concluding mergers."
        ],
        "translation": "전략적인 포트폴리오 다각화는 합병 계약을 체결하기 전에. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Strategic portfolio diversification safeguards proprietary corporate assets to ensure organizational viability.",
        "chunks": [
          "Strategic portfolio diversification",
          "safeguards proprietary corporate assets",
          "to ensure organizational viability."
        ],
        "translation": "전략적인 포트폴리오 다각화는 조직 생존력을 보장하기 위해. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Strategic portfolio diversification safeguards proprietary corporate assets across distributed global subsidiaries.",
        "chunks": [
          "Strategic portfolio diversification",
          "safeguards proprietary corporate assets",
          "across distributed global subsidiaries."
        ],
        "translation": "전략적인 포트폴리오 다각화는 분산된 글로벌 자회사 전반에 걸쳐. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Strategic portfolio diversification hedges against volatile fluctuations amid unprecedented geopolitical shifts.",
        "chunks": [
          "Strategic portfolio diversification",
          "hedges against volatile fluctuations",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "전략적인 포트폴리오 다각화는 전례 없는 지정학적 격변 속에서. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Strategic portfolio diversification hedges against volatile fluctuations prior to concluding mergers.",
        "chunks": [
          "Strategic portfolio diversification",
          "hedges against volatile fluctuations",
          "prior to concluding mergers."
        ],
        "translation": "전략적인 포트폴리오 다각화는 합병 계약을 체결하기 전에. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Strategic portfolio diversification hedges against volatile fluctuations to ensure organizational viability.",
        "chunks": [
          "Strategic portfolio diversification",
          "hedges against volatile fluctuations",
          "to ensure organizational viability."
        ],
        "translation": "전략적인 포트폴리오 다각화는 조직 생존력을 보장하기 위해. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Strategic portfolio diversification hedges against volatile fluctuations across distributed global subsidiaries.",
        "chunks": [
          "Strategic portfolio diversification",
          "hedges against volatile fluctuations",
          "across distributed global subsidiaries."
        ],
        "translation": "전략적인 포트폴리오 다각화는 분산된 글로벌 자회사 전반에 걸쳐. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Strategic portfolio diversification requires dismantling entrenched silos amid unprecedented geopolitical shifts.",
        "chunks": [
          "Strategic portfolio diversification",
          "requires dismantling entrenched silos",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "전략적인 포트폴리오 다각화는 전례 없는 지정학적 격변 속에서. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Strategic portfolio diversification requires dismantling entrenched silos prior to concluding mergers.",
        "chunks": [
          "Strategic portfolio diversification",
          "requires dismantling entrenched silos",
          "prior to concluding mergers."
        ],
        "translation": "전략적인 포트폴리오 다각화는 합병 계약을 체결하기 전에. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Strategic portfolio diversification requires dismantling entrenched silos to ensure organizational viability.",
        "chunks": [
          "Strategic portfolio diversification",
          "requires dismantling entrenched silos",
          "to ensure organizational viability."
        ],
        "translation": "전략적인 포트폴리오 다각화는 조직 생존력을 보장하기 위해. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Strategic portfolio diversification requires dismantling entrenched silos across distributed global subsidiaries.",
        "chunks": [
          "Strategic portfolio diversification",
          "requires dismantling entrenched silos",
          "across distributed global subsidiaries."
        ],
        "translation": "전략적인 포트폴리오 다각화는 분산된 글로벌 자회사 전반에 걸쳐. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Strategic portfolio diversification demands proactive international engagement amid unprecedented geopolitical shifts.",
        "chunks": [
          "Strategic portfolio diversification",
          "demands proactive international engagement",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "전략적인 포트폴리오 다각화는 전례 없는 지정학적 격변 속에서. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Strategic portfolio diversification demands proactive international engagement prior to concluding mergers.",
        "chunks": [
          "Strategic portfolio diversification",
          "demands proactive international engagement",
          "prior to concluding mergers."
        ],
        "translation": "전략적인 포트폴리오 다각화는 합병 계약을 체결하기 전에. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Strategic portfolio diversification demands proactive international engagement to ensure organizational viability.",
        "chunks": [
          "Strategic portfolio diversification",
          "demands proactive international engagement",
          "to ensure organizational viability."
        ],
        "translation": "전략적인 포트폴리오 다각화는 조직 생존력을 보장하기 위해. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Strategic portfolio diversification demands proactive international engagement across distributed global subsidiaries.",
        "chunks": [
          "Strategic portfolio diversification",
          "demands proactive international engagement",
          "across distributed global subsidiaries."
        ],
        "translation": "전략적인 포트폴리오 다각화는 분산된 글로벌 자회사 전반에 걸쳐. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Cultivating institutional synergy hinges on policy adjustments amid unprecedented geopolitical shifts.",
        "chunks": [
          "Cultivating institutional synergy",
          "hinges on policy adjustments",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "조직 시너지를 육성하는 것은 전례 없는 지정학적 격변 속에서. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Cultivating institutional synergy hinges on policy adjustments prior to concluding mergers.",
        "chunks": [
          "Cultivating institutional synergy",
          "hinges on policy adjustments",
          "prior to concluding mergers."
        ],
        "translation": "조직 시너지를 육성하는 것은 합병 계약을 체결하기 전에. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Cultivating institutional synergy hinges on policy adjustments to ensure organizational viability.",
        "chunks": [
          "Cultivating institutional synergy",
          "hinges on policy adjustments",
          "to ensure organizational viability."
        ],
        "translation": "조직 시너지를 육성하는 것은 조직 생존력을 보장하기 위해. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Cultivating institutional synergy hinges on policy adjustments across distributed global subsidiaries.",
        "chunks": [
          "Cultivating institutional synergy",
          "hinges on policy adjustments",
          "across distributed global subsidiaries."
        ],
        "translation": "조직 시너지를 육성하는 것은 분산된 글로벌 자회사 전반에 걸쳐. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Cultivating institutional synergy safeguards proprietary corporate assets amid unprecedented geopolitical shifts.",
        "chunks": [
          "Cultivating institutional synergy",
          "safeguards proprietary corporate assets",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "조직 시너지를 육성하는 것은 전례 없는 지정학적 격변 속에서. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Cultivating institutional synergy safeguards proprietary corporate assets prior to concluding mergers.",
        "chunks": [
          "Cultivating institutional synergy",
          "safeguards proprietary corporate assets",
          "prior to concluding mergers."
        ],
        "translation": "조직 시너지를 육성하는 것은 합병 계약을 체결하기 전에. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Cultivating institutional synergy safeguards proprietary corporate assets to ensure organizational viability.",
        "chunks": [
          "Cultivating institutional synergy",
          "safeguards proprietary corporate assets",
          "to ensure organizational viability."
        ],
        "translation": "조직 시너지를 육성하는 것은 조직 생존력을 보장하기 위해. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Cultivating institutional synergy safeguards proprietary corporate assets across distributed global subsidiaries.",
        "chunks": [
          "Cultivating institutional synergy",
          "safeguards proprietary corporate assets",
          "across distributed global subsidiaries."
        ],
        "translation": "조직 시너지를 육성하는 것은 분산된 글로벌 자회사 전반에 걸쳐. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Cultivating institutional synergy hedges against volatile fluctuations amid unprecedented geopolitical shifts.",
        "chunks": [
          "Cultivating institutional synergy",
          "hedges against volatile fluctuations",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "조직 시너지를 육성하는 것은 전례 없는 지정학적 격변 속에서. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Cultivating institutional synergy hedges against volatile fluctuations prior to concluding mergers.",
        "chunks": [
          "Cultivating institutional synergy",
          "hedges against volatile fluctuations",
          "prior to concluding mergers."
        ],
        "translation": "조직 시너지를 육성하는 것은 합병 계약을 체결하기 전에. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Cultivating institutional synergy hedges against volatile fluctuations to ensure organizational viability.",
        "chunks": [
          "Cultivating institutional synergy",
          "hedges against volatile fluctuations",
          "to ensure organizational viability."
        ],
        "translation": "조직 시너지를 육성하는 것은 조직 생존력을 보장하기 위해. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Cultivating institutional synergy hedges against volatile fluctuations across distributed global subsidiaries.",
        "chunks": [
          "Cultivating institutional synergy",
          "hedges against volatile fluctuations",
          "across distributed global subsidiaries."
        ],
        "translation": "조직 시너지를 육성하는 것은 분산된 글로벌 자회사 전반에 걸쳐. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Cultivating institutional synergy requires dismantling entrenched silos amid unprecedented geopolitical shifts.",
        "chunks": [
          "Cultivating institutional synergy",
          "requires dismantling entrenched silos",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "조직 시너지를 육성하는 것은 전례 없는 지정학적 격변 속에서. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Cultivating institutional synergy requires dismantling entrenched silos prior to concluding mergers.",
        "chunks": [
          "Cultivating institutional synergy",
          "requires dismantling entrenched silos",
          "prior to concluding mergers."
        ],
        "translation": "조직 시너지를 육성하는 것은 합병 계약을 체결하기 전에. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Cultivating institutional synergy requires dismantling entrenched silos to ensure organizational viability.",
        "chunks": [
          "Cultivating institutional synergy",
          "requires dismantling entrenched silos",
          "to ensure organizational viability."
        ],
        "translation": "조직 시너지를 육성하는 것은 조직 생존력을 보장하기 위해. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Cultivating institutional synergy requires dismantling entrenched silos across distributed global subsidiaries.",
        "chunks": [
          "Cultivating institutional synergy",
          "requires dismantling entrenched silos",
          "across distributed global subsidiaries."
        ],
        "translation": "조직 시너지를 육성하는 것은 분산된 글로벌 자회사 전반에 걸쳐. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Cultivating institutional synergy demands proactive international engagement amid unprecedented geopolitical shifts.",
        "chunks": [
          "Cultivating institutional synergy",
          "demands proactive international engagement",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "조직 시너지를 육성하는 것은 전례 없는 지정학적 격변 속에서. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Cultivating institutional synergy demands proactive international engagement prior to concluding mergers.",
        "chunks": [
          "Cultivating institutional synergy",
          "demands proactive international engagement",
          "prior to concluding mergers."
        ],
        "translation": "조직 시너지를 육성하는 것은 합병 계약을 체결하기 전에. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Cultivating institutional synergy demands proactive international engagement to ensure organizational viability.",
        "chunks": [
          "Cultivating institutional synergy",
          "demands proactive international engagement",
          "to ensure organizational viability."
        ],
        "translation": "조직 시너지를 육성하는 것은 조직 생존력을 보장하기 위해. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Cultivating institutional synergy demands proactive international engagement across distributed global subsidiaries.",
        "chunks": [
          "Cultivating institutional synergy",
          "demands proactive international engagement",
          "across distributed global subsidiaries."
        ],
        "translation": "조직 시너지를 육성하는 것은 분산된 글로벌 자회사 전반에 걸쳐. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Navigating regulatory ambiguities hinges on policy adjustments amid unprecedented geopolitical shifts.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "hinges on policy adjustments",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 전례 없는 지정학적 격변 속에서. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Navigating regulatory ambiguities hinges on policy adjustments prior to concluding mergers.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "hinges on policy adjustments",
          "prior to concluding mergers."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 합병 계약을 체결하기 전에. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Navigating regulatory ambiguities hinges on policy adjustments to ensure organizational viability.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "hinges on policy adjustments",
          "to ensure organizational viability."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 조직 생존력을 보장하기 위해. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Navigating regulatory ambiguities hinges on policy adjustments across distributed global subsidiaries.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "hinges on policy adjustments",
          "across distributed global subsidiaries."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 분산된 글로벌 자회사 전반에 걸쳐. 정책 조정에 달려 있습니다"
      },
      {
        "text": "Navigating regulatory ambiguities safeguards proprietary corporate assets amid unprecedented geopolitical shifts.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "safeguards proprietary corporate assets",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 전례 없는 지정학적 격변 속에서. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Navigating regulatory ambiguities safeguards proprietary corporate assets prior to concluding mergers.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "safeguards proprietary corporate assets",
          "prior to concluding mergers."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 합병 계약을 체결하기 전에. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Navigating regulatory ambiguities safeguards proprietary corporate assets to ensure organizational viability.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "safeguards proprietary corporate assets",
          "to ensure organizational viability."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 조직 생존력을 보장하기 위해. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Navigating regulatory ambiguities safeguards proprietary corporate assets across distributed global subsidiaries.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "safeguards proprietary corporate assets",
          "across distributed global subsidiaries."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 분산된 글로벌 자회사 전반에 걸쳐. 독점적 기업 자산을 보호합니다"
      },
      {
        "text": "Navigating regulatory ambiguities hedges against volatile fluctuations amid unprecedented geopolitical shifts.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "hedges against volatile fluctuations",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 전례 없는 지정학적 격변 속에서. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Navigating regulatory ambiguities hedges against volatile fluctuations prior to concluding mergers.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "hedges against volatile fluctuations",
          "prior to concluding mergers."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 합병 계약을 체결하기 전에. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Navigating regulatory ambiguities hedges against volatile fluctuations to ensure organizational viability.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "hedges against volatile fluctuations",
          "to ensure organizational viability."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 조직 생존력을 보장하기 위해. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Navigating regulatory ambiguities hedges against volatile fluctuations across distributed global subsidiaries.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "hedges against volatile fluctuations",
          "across distributed global subsidiaries."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 분산된 글로벌 자회사 전반에 걸쳐. 변동성을 효과적으로 방어합니다"
      },
      {
        "text": "Navigating regulatory ambiguities requires dismantling entrenched silos amid unprecedented geopolitical shifts.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "requires dismantling entrenched silos",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 전례 없는 지정학적 격변 속에서. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Navigating regulatory ambiguities requires dismantling entrenched silos prior to concluding mergers.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "requires dismantling entrenched silos",
          "prior to concluding mergers."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 합병 계약을 체결하기 전에. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Navigating regulatory ambiguities requires dismantling entrenched silos to ensure organizational viability.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "requires dismantling entrenched silos",
          "to ensure organizational viability."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 조직 생존력을 보장하기 위해. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Navigating regulatory ambiguities requires dismantling entrenched silos across distributed global subsidiaries.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "requires dismantling entrenched silos",
          "across distributed global subsidiaries."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 분산된 글로벌 자회사 전반에 걸쳐. 고착화된 부서 장벽 해체를 요구합니다"
      },
      {
        "text": "Navigating regulatory ambiguities demands proactive international engagement amid unprecedented geopolitical shifts.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "demands proactive international engagement",
          "amid unprecedented geopolitical shifts."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 전례 없는 지정학적 격변 속에서. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Navigating regulatory ambiguities demands proactive international engagement prior to concluding mergers.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "demands proactive international engagement",
          "prior to concluding mergers."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 합병 계약을 체결하기 전에. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Navigating regulatory ambiguities demands proactive international engagement to ensure organizational viability.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "demands proactive international engagement",
          "to ensure organizational viability."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 조직 생존력을 보장하기 위해. 선제적인 국제 참여를 요구합니다"
      },
      {
        "text": "Navigating regulatory ambiguities demands proactive international engagement across distributed global subsidiaries.",
        "chunks": [
          "Navigating regulatory ambiguities",
          "demands proactive international engagement",
          "across distributed global subsidiaries."
        ],
        "translation": "규제 모호성을 헤쳐나가는 것은 분산된 글로벌 자회사 전반에 걸쳐. 선제적인 국제 참여를 요구합니다"
      }
    ],
    "4": [
      {
        "text": "Navigating cross border ambiguities demands decisive executive leadership to challenge orthodox assumptions across global capital markets.",
        "chunks": [
          "Navigating cross border ambiguities",
          "demands decisive executive leadership",
          "to challenge orthodox assumptions",
          "across global capital markets."
        ],
        "translation": "국경 간 규제 모호성 해결은, 결단력 있는 리더십을 요구하며 고착화된 통념에 도전하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Navigating cross border ambiguities demands decisive executive leadership to challenge orthodox assumptions without compromising operational integrity.",
        "chunks": [
          "Navigating cross border ambiguities",
          "demands decisive executive leadership",
          "to challenge orthodox assumptions",
          "without compromising operational integrity."
        ],
        "translation": "국경 간 규제 모호성 해결은, 결단력 있는 리더십을 요구하며 고착화된 통념에 도전하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Navigating cross border ambiguities demands decisive executive leadership and implement compliance protocols across global capital markets.",
        "chunks": [
          "Navigating cross border ambiguities",
          "demands decisive executive leadership",
          "and implement compliance protocols",
          "across global capital markets."
        ],
        "translation": "국경 간 규제 모호성 해결은, 결단력 있는 리더십을 요구하며 준법 프로토콜을 시행하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Navigating cross border ambiguities demands decisive executive leadership and implement compliance protocols without compromising operational integrity.",
        "chunks": [
          "Navigating cross border ambiguities",
          "demands decisive executive leadership",
          "and implement compliance protocols",
          "without compromising operational integrity."
        ],
        "translation": "국경 간 규제 모호성 해결은, 결단력 있는 리더십을 요구하며 준법 프로토콜을 시행하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Navigating cross border ambiguities demands decisive executive leadership to anticipate structural shifts across global capital markets.",
        "chunks": [
          "Navigating cross border ambiguities",
          "demands decisive executive leadership",
          "to anticipate structural shifts",
          "across global capital markets."
        ],
        "translation": "국경 간 규제 모호성 해결은, 결단력 있는 리더십을 요구하며 구조적 변화를 예측하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Navigating cross border ambiguities demands decisive executive leadership to anticipate structural shifts without compromising operational integrity.",
        "chunks": [
          "Navigating cross border ambiguities",
          "demands decisive executive leadership",
          "to anticipate structural shifts",
          "without compromising operational integrity."
        ],
        "translation": "국경 간 규제 모호성 해결은, 결단력 있는 리더십을 요구하며 구조적 변화를 예측하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Navigating cross border ambiguities demands decisive executive leadership and optimize capital allocation across global capital markets.",
        "chunks": [
          "Navigating cross border ambiguities",
          "demands decisive executive leadership",
          "and optimize capital allocation",
          "across global capital markets."
        ],
        "translation": "국경 간 규제 모호성 해결은, 결단력 있는 리더십을 요구하며 자본 배분을 최적화하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Navigating cross border ambiguities demands decisive executive leadership and optimize capital allocation without compromising operational integrity.",
        "chunks": [
          "Navigating cross border ambiguities",
          "demands decisive executive leadership",
          "and optimize capital allocation",
          "without compromising operational integrity."
        ],
        "translation": "국경 간 규제 모호성 해결은, 결단력 있는 리더십을 요구하며 자본 배분을 최적화하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Navigating cross border ambiguities demands decisive executive leadership while preserving institutional credibility across global capital markets.",
        "chunks": [
          "Navigating cross border ambiguities",
          "demands decisive executive leadership",
          "while preserving institutional credibility",
          "across global capital markets."
        ],
        "translation": "국경 간 규제 모호성 해결은, 결단력 있는 리더십을 요구하며 기관 신뢰도를 보존하면서, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Navigating cross border ambiguities demands decisive executive leadership while preserving institutional credibility without compromising operational integrity.",
        "chunks": [
          "Navigating cross border ambiguities",
          "demands decisive executive leadership",
          "while preserving institutional credibility",
          "without compromising operational integrity."
        ],
        "translation": "국경 간 규제 모호성 해결은, 결단력 있는 리더십을 요구하며 기관 신뢰도를 보존하면서, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Navigating cross border ambiguities enables resilient multinational enterprises to challenge orthodox assumptions across global capital markets.",
        "chunks": [
          "Navigating cross border ambiguities",
          "enables resilient multinational enterprises",
          "to challenge orthodox assumptions",
          "across global capital markets."
        ],
        "translation": "국경 간 규제 모호성 해결은, 다국적 기업들로 하여금 고착화된 통념에 도전하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Navigating cross border ambiguities enables resilient multinational enterprises to challenge orthodox assumptions without compromising operational integrity.",
        "chunks": [
          "Navigating cross border ambiguities",
          "enables resilient multinational enterprises",
          "to challenge orthodox assumptions",
          "without compromising operational integrity."
        ],
        "translation": "국경 간 규제 모호성 해결은, 다국적 기업들로 하여금 고착화된 통념에 도전하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Navigating cross border ambiguities enables resilient multinational enterprises and implement compliance protocols across global capital markets.",
        "chunks": [
          "Navigating cross border ambiguities",
          "enables resilient multinational enterprises",
          "and implement compliance protocols",
          "across global capital markets."
        ],
        "translation": "국경 간 규제 모호성 해결은, 다국적 기업들로 하여금 준법 프로토콜을 시행하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Navigating cross border ambiguities enables resilient multinational enterprises and implement compliance protocols without compromising operational integrity.",
        "chunks": [
          "Navigating cross border ambiguities",
          "enables resilient multinational enterprises",
          "and implement compliance protocols",
          "without compromising operational integrity."
        ],
        "translation": "국경 간 규제 모호성 해결은, 다국적 기업들로 하여금 준법 프로토콜을 시행하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Navigating cross border ambiguities enables resilient multinational enterprises to anticipate structural shifts across global capital markets.",
        "chunks": [
          "Navigating cross border ambiguities",
          "enables resilient multinational enterprises",
          "to anticipate structural shifts",
          "across global capital markets."
        ],
        "translation": "국경 간 규제 모호성 해결은, 다국적 기업들로 하여금 구조적 변화를 예측하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Navigating cross border ambiguities enables resilient multinational enterprises to anticipate structural shifts without compromising operational integrity.",
        "chunks": [
          "Navigating cross border ambiguities",
          "enables resilient multinational enterprises",
          "to anticipate structural shifts",
          "without compromising operational integrity."
        ],
        "translation": "국경 간 규제 모호성 해결은, 다국적 기업들로 하여금 구조적 변화를 예측하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Navigating cross border ambiguities enables resilient multinational enterprises and optimize capital allocation across global capital markets.",
        "chunks": [
          "Navigating cross border ambiguities",
          "enables resilient multinational enterprises",
          "and optimize capital allocation",
          "across global capital markets."
        ],
        "translation": "국경 간 규제 모호성 해결은, 다국적 기업들로 하여금 자본 배분을 최적화하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Navigating cross border ambiguities enables resilient multinational enterprises and optimize capital allocation without compromising operational integrity.",
        "chunks": [
          "Navigating cross border ambiguities",
          "enables resilient multinational enterprises",
          "and optimize capital allocation",
          "without compromising operational integrity."
        ],
        "translation": "국경 간 규제 모호성 해결은, 다국적 기업들로 하여금 자본 배분을 최적화하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Navigating cross border ambiguities enables resilient multinational enterprises while preserving institutional credibility across global capital markets.",
        "chunks": [
          "Navigating cross border ambiguities",
          "enables resilient multinational enterprises",
          "while preserving institutional credibility",
          "across global capital markets."
        ],
        "translation": "국경 간 규제 모호성 해결은, 다국적 기업들로 하여금 기관 신뢰도를 보존하면서, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Navigating cross border ambiguities enables resilient multinational enterprises while preserving institutional credibility without compromising operational integrity.",
        "chunks": [
          "Navigating cross border ambiguities",
          "enables resilient multinational enterprises",
          "while preserving institutional credibility",
          "without compromising operational integrity."
        ],
        "translation": "국경 간 규제 모호성 해결은, 다국적 기업들로 하여금 기관 신뢰도를 보존하면서, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Fostering institutional agility demands decisive executive leadership to challenge orthodox assumptions across global capital markets.",
        "chunks": [
          "Fostering institutional agility",
          "demands decisive executive leadership",
          "to challenge orthodox assumptions",
          "across global capital markets."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 결단력 있는 리더십을 요구하며 고착화된 통념에 도전하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Fostering institutional agility demands decisive executive leadership to challenge orthodox assumptions without compromising operational integrity.",
        "chunks": [
          "Fostering institutional agility",
          "demands decisive executive leadership",
          "to challenge orthodox assumptions",
          "without compromising operational integrity."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 결단력 있는 리더십을 요구하며 고착화된 통념에 도전하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Fostering institutional agility demands decisive executive leadership and implement compliance protocols across global capital markets.",
        "chunks": [
          "Fostering institutional agility",
          "demands decisive executive leadership",
          "and implement compliance protocols",
          "across global capital markets."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 결단력 있는 리더십을 요구하며 준법 프로토콜을 시행하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Fostering institutional agility demands decisive executive leadership and implement compliance protocols without compromising operational integrity.",
        "chunks": [
          "Fostering institutional agility",
          "demands decisive executive leadership",
          "and implement compliance protocols",
          "without compromising operational integrity."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 결단력 있는 리더십을 요구하며 준법 프로토콜을 시행하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Fostering institutional agility demands decisive executive leadership to anticipate structural shifts across global capital markets.",
        "chunks": [
          "Fostering institutional agility",
          "demands decisive executive leadership",
          "to anticipate structural shifts",
          "across global capital markets."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 결단력 있는 리더십을 요구하며 구조적 변화를 예측하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Fostering institutional agility demands decisive executive leadership to anticipate structural shifts without compromising operational integrity.",
        "chunks": [
          "Fostering institutional agility",
          "demands decisive executive leadership",
          "to anticipate structural shifts",
          "without compromising operational integrity."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 결단력 있는 리더십을 요구하며 구조적 변화를 예측하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Fostering institutional agility demands decisive executive leadership and optimize capital allocation across global capital markets.",
        "chunks": [
          "Fostering institutional agility",
          "demands decisive executive leadership",
          "and optimize capital allocation",
          "across global capital markets."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 결단력 있는 리더십을 요구하며 자본 배분을 최적화하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Fostering institutional agility demands decisive executive leadership and optimize capital allocation without compromising operational integrity.",
        "chunks": [
          "Fostering institutional agility",
          "demands decisive executive leadership",
          "and optimize capital allocation",
          "without compromising operational integrity."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 결단력 있는 리더십을 요구하며 자본 배분을 최적화하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Fostering institutional agility demands decisive executive leadership while preserving institutional credibility across global capital markets.",
        "chunks": [
          "Fostering institutional agility",
          "demands decisive executive leadership",
          "while preserving institutional credibility",
          "across global capital markets."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 결단력 있는 리더십을 요구하며 기관 신뢰도를 보존하면서, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Fostering institutional agility demands decisive executive leadership while preserving institutional credibility without compromising operational integrity.",
        "chunks": [
          "Fostering institutional agility",
          "demands decisive executive leadership",
          "while preserving institutional credibility",
          "without compromising operational integrity."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 결단력 있는 리더십을 요구하며 기관 신뢰도를 보존하면서, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Fostering institutional agility enables resilient multinational enterprises to challenge orthodox assumptions across global capital markets.",
        "chunks": [
          "Fostering institutional agility",
          "enables resilient multinational enterprises",
          "to challenge orthodox assumptions",
          "across global capital markets."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 다국적 기업들로 하여금 고착화된 통념에 도전하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Fostering institutional agility enables resilient multinational enterprises to challenge orthodox assumptions without compromising operational integrity.",
        "chunks": [
          "Fostering institutional agility",
          "enables resilient multinational enterprises",
          "to challenge orthodox assumptions",
          "without compromising operational integrity."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 다국적 기업들로 하여금 고착화된 통념에 도전하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Fostering institutional agility enables resilient multinational enterprises and implement compliance protocols across global capital markets.",
        "chunks": [
          "Fostering institutional agility",
          "enables resilient multinational enterprises",
          "and implement compliance protocols",
          "across global capital markets."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 다국적 기업들로 하여금 준법 프로토콜을 시행하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Fostering institutional agility enables resilient multinational enterprises and implement compliance protocols without compromising operational integrity.",
        "chunks": [
          "Fostering institutional agility",
          "enables resilient multinational enterprises",
          "and implement compliance protocols",
          "without compromising operational integrity."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 다국적 기업들로 하여금 준법 프로토콜을 시행하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Fostering institutional agility enables resilient multinational enterprises to anticipate structural shifts across global capital markets.",
        "chunks": [
          "Fostering institutional agility",
          "enables resilient multinational enterprises",
          "to anticipate structural shifts",
          "across global capital markets."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 다국적 기업들로 하여금 구조적 변화를 예측하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Fostering institutional agility enables resilient multinational enterprises to anticipate structural shifts without compromising operational integrity.",
        "chunks": [
          "Fostering institutional agility",
          "enables resilient multinational enterprises",
          "to anticipate structural shifts",
          "without compromising operational integrity."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 다국적 기업들로 하여금 구조적 변화를 예측하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Fostering institutional agility enables resilient multinational enterprises and optimize capital allocation across global capital markets.",
        "chunks": [
          "Fostering institutional agility",
          "enables resilient multinational enterprises",
          "and optimize capital allocation",
          "across global capital markets."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 다국적 기업들로 하여금 자본 배분을 최적화하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Fostering institutional agility enables resilient multinational enterprises and optimize capital allocation without compromising operational integrity.",
        "chunks": [
          "Fostering institutional agility",
          "enables resilient multinational enterprises",
          "and optimize capital allocation",
          "without compromising operational integrity."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 다국적 기업들로 하여금 자본 배분을 최적화하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Fostering institutional agility enables resilient multinational enterprises while preserving institutional credibility across global capital markets.",
        "chunks": [
          "Fostering institutional agility",
          "enables resilient multinational enterprises",
          "while preserving institutional credibility",
          "across global capital markets."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 다국적 기업들로 하여금 기관 신뢰도를 보존하면서, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Fostering institutional agility enables resilient multinational enterprises while preserving institutional credibility without compromising operational integrity.",
        "chunks": [
          "Fostering institutional agility",
          "enables resilient multinational enterprises",
          "while preserving institutional credibility",
          "without compromising operational integrity."
        ],
        "translation": "기관의 기민성을 육성하는 것은, 다국적 기업들로 하여금 기관 신뢰도를 보존하면서, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Leveraging predictive algorithms demands decisive executive leadership to challenge orthodox assumptions across global capital markets.",
        "chunks": [
          "Leveraging predictive algorithms",
          "demands decisive executive leadership",
          "to challenge orthodox assumptions",
          "across global capital markets."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 결단력 있는 리더십을 요구하며 고착화된 통념에 도전하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Leveraging predictive algorithms demands decisive executive leadership to challenge orthodox assumptions without compromising operational integrity.",
        "chunks": [
          "Leveraging predictive algorithms",
          "demands decisive executive leadership",
          "to challenge orthodox assumptions",
          "without compromising operational integrity."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 결단력 있는 리더십을 요구하며 고착화된 통념에 도전하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Leveraging predictive algorithms demands decisive executive leadership and implement compliance protocols across global capital markets.",
        "chunks": [
          "Leveraging predictive algorithms",
          "demands decisive executive leadership",
          "and implement compliance protocols",
          "across global capital markets."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 결단력 있는 리더십을 요구하며 준법 프로토콜을 시행하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Leveraging predictive algorithms demands decisive executive leadership and implement compliance protocols without compromising operational integrity.",
        "chunks": [
          "Leveraging predictive algorithms",
          "demands decisive executive leadership",
          "and implement compliance protocols",
          "without compromising operational integrity."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 결단력 있는 리더십을 요구하며 준법 프로토콜을 시행하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Leveraging predictive algorithms demands decisive executive leadership to anticipate structural shifts across global capital markets.",
        "chunks": [
          "Leveraging predictive algorithms",
          "demands decisive executive leadership",
          "to anticipate structural shifts",
          "across global capital markets."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 결단력 있는 리더십을 요구하며 구조적 변화를 예측하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Leveraging predictive algorithms demands decisive executive leadership to anticipate structural shifts without compromising operational integrity.",
        "chunks": [
          "Leveraging predictive algorithms",
          "demands decisive executive leadership",
          "to anticipate structural shifts",
          "without compromising operational integrity."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 결단력 있는 리더십을 요구하며 구조적 변화를 예측하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Leveraging predictive algorithms demands decisive executive leadership and optimize capital allocation across global capital markets.",
        "chunks": [
          "Leveraging predictive algorithms",
          "demands decisive executive leadership",
          "and optimize capital allocation",
          "across global capital markets."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 결단력 있는 리더십을 요구하며 자본 배분을 최적화하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Leveraging predictive algorithms demands decisive executive leadership and optimize capital allocation without compromising operational integrity.",
        "chunks": [
          "Leveraging predictive algorithms",
          "demands decisive executive leadership",
          "and optimize capital allocation",
          "without compromising operational integrity."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 결단력 있는 리더십을 요구하며 자본 배분을 최적화하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Leveraging predictive algorithms demands decisive executive leadership while preserving institutional credibility across global capital markets.",
        "chunks": [
          "Leveraging predictive algorithms",
          "demands decisive executive leadership",
          "while preserving institutional credibility",
          "across global capital markets."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 결단력 있는 리더십을 요구하며 기관 신뢰도를 보존하면서, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Leveraging predictive algorithms demands decisive executive leadership while preserving institutional credibility without compromising operational integrity.",
        "chunks": [
          "Leveraging predictive algorithms",
          "demands decisive executive leadership",
          "while preserving institutional credibility",
          "without compromising operational integrity."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 결단력 있는 리더십을 요구하며 기관 신뢰도를 보존하면서, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Leveraging predictive algorithms enables resilient multinational enterprises to challenge orthodox assumptions across global capital markets.",
        "chunks": [
          "Leveraging predictive algorithms",
          "enables resilient multinational enterprises",
          "to challenge orthodox assumptions",
          "across global capital markets."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 다국적 기업들로 하여금 고착화된 통념에 도전하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Leveraging predictive algorithms enables resilient multinational enterprises to challenge orthodox assumptions without compromising operational integrity.",
        "chunks": [
          "Leveraging predictive algorithms",
          "enables resilient multinational enterprises",
          "to challenge orthodox assumptions",
          "without compromising operational integrity."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 다국적 기업들로 하여금 고착화된 통념에 도전하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Leveraging predictive algorithms enables resilient multinational enterprises and implement compliance protocols across global capital markets.",
        "chunks": [
          "Leveraging predictive algorithms",
          "enables resilient multinational enterprises",
          "and implement compliance protocols",
          "across global capital markets."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 다국적 기업들로 하여금 준법 프로토콜을 시행하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Leveraging predictive algorithms enables resilient multinational enterprises and implement compliance protocols without compromising operational integrity.",
        "chunks": [
          "Leveraging predictive algorithms",
          "enables resilient multinational enterprises",
          "and implement compliance protocols",
          "without compromising operational integrity."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 다국적 기업들로 하여금 준법 프로토콜을 시행하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Leveraging predictive algorithms enables resilient multinational enterprises to anticipate structural shifts across global capital markets.",
        "chunks": [
          "Leveraging predictive algorithms",
          "enables resilient multinational enterprises",
          "to anticipate structural shifts",
          "across global capital markets."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 다국적 기업들로 하여금 구조적 변화를 예측하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Leveraging predictive algorithms enables resilient multinational enterprises to anticipate structural shifts without compromising operational integrity.",
        "chunks": [
          "Leveraging predictive algorithms",
          "enables resilient multinational enterprises",
          "to anticipate structural shifts",
          "without compromising operational integrity."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 다국적 기업들로 하여금 구조적 변화를 예측하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Leveraging predictive algorithms enables resilient multinational enterprises and optimize capital allocation across global capital markets.",
        "chunks": [
          "Leveraging predictive algorithms",
          "enables resilient multinational enterprises",
          "and optimize capital allocation",
          "across global capital markets."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 다국적 기업들로 하여금 자본 배분을 최적화하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Leveraging predictive algorithms enables resilient multinational enterprises and optimize capital allocation without compromising operational integrity.",
        "chunks": [
          "Leveraging predictive algorithms",
          "enables resilient multinational enterprises",
          "and optimize capital allocation",
          "without compromising operational integrity."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 다국적 기업들로 하여금 자본 배분을 최적화하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Leveraging predictive algorithms enables resilient multinational enterprises while preserving institutional credibility across global capital markets.",
        "chunks": [
          "Leveraging predictive algorithms",
          "enables resilient multinational enterprises",
          "while preserving institutional credibility",
          "across global capital markets."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 다국적 기업들로 하여금 기관 신뢰도를 보존하면서, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Leveraging predictive algorithms enables resilient multinational enterprises while preserving institutional credibility without compromising operational integrity.",
        "chunks": [
          "Leveraging predictive algorithms",
          "enables resilient multinational enterprises",
          "while preserving institutional credibility",
          "without compromising operational integrity."
        ],
        "translation": "예측 알고리즘을 활용하는 것은, 다국적 기업들로 하여금 기관 신뢰도를 보존하면서, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Synthesizing macroeconomic indicators demands decisive executive leadership to challenge orthodox assumptions across global capital markets.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "demands decisive executive leadership",
          "to challenge orthodox assumptions",
          "across global capital markets."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 결단력 있는 리더십을 요구하며 고착화된 통념에 도전하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Synthesizing macroeconomic indicators demands decisive executive leadership to challenge orthodox assumptions without compromising operational integrity.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "demands decisive executive leadership",
          "to challenge orthodox assumptions",
          "without compromising operational integrity."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 결단력 있는 리더십을 요구하며 고착화된 통념에 도전하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Synthesizing macroeconomic indicators demands decisive executive leadership and implement compliance protocols across global capital markets.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "demands decisive executive leadership",
          "and implement compliance protocols",
          "across global capital markets."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 결단력 있는 리더십을 요구하며 준법 프로토콜을 시행하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Synthesizing macroeconomic indicators demands decisive executive leadership and implement compliance protocols without compromising operational integrity.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "demands decisive executive leadership",
          "and implement compliance protocols",
          "without compromising operational integrity."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 결단력 있는 리더십을 요구하며 준법 프로토콜을 시행하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Synthesizing macroeconomic indicators demands decisive executive leadership to anticipate structural shifts across global capital markets.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "demands decisive executive leadership",
          "to anticipate structural shifts",
          "across global capital markets."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 결단력 있는 리더십을 요구하며 구조적 변화를 예측하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Synthesizing macroeconomic indicators demands decisive executive leadership to anticipate structural shifts without compromising operational integrity.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "demands decisive executive leadership",
          "to anticipate structural shifts",
          "without compromising operational integrity."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 결단력 있는 리더십을 요구하며 구조적 변화를 예측하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Synthesizing macroeconomic indicators demands decisive executive leadership and optimize capital allocation across global capital markets.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "demands decisive executive leadership",
          "and optimize capital allocation",
          "across global capital markets."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 결단력 있는 리더십을 요구하며 자본 배분을 최적화하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Synthesizing macroeconomic indicators demands decisive executive leadership and optimize capital allocation without compromising operational integrity.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "demands decisive executive leadership",
          "and optimize capital allocation",
          "without compromising operational integrity."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 결단력 있는 리더십을 요구하며 자본 배분을 최적화하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Synthesizing macroeconomic indicators demands decisive executive leadership while preserving institutional credibility across global capital markets.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "demands decisive executive leadership",
          "while preserving institutional credibility",
          "across global capital markets."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 결단력 있는 리더십을 요구하며 기관 신뢰도를 보존하면서, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Synthesizing macroeconomic indicators demands decisive executive leadership while preserving institutional credibility without compromising operational integrity.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "demands decisive executive leadership",
          "while preserving institutional credibility",
          "without compromising operational integrity."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 결단력 있는 리더십을 요구하며 기관 신뢰도를 보존하면서, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Synthesizing macroeconomic indicators enables resilient multinational enterprises to challenge orthodox assumptions across global capital markets.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "enables resilient multinational enterprises",
          "to challenge orthodox assumptions",
          "across global capital markets."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 다국적 기업들로 하여금 고착화된 통념에 도전하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Synthesizing macroeconomic indicators enables resilient multinational enterprises to challenge orthodox assumptions without compromising operational integrity.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "enables resilient multinational enterprises",
          "to challenge orthodox assumptions",
          "without compromising operational integrity."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 다국적 기업들로 하여금 고착화된 통념에 도전하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Synthesizing macroeconomic indicators enables resilient multinational enterprises and implement compliance protocols across global capital markets.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "enables resilient multinational enterprises",
          "and implement compliance protocols",
          "across global capital markets."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 다국적 기업들로 하여금 준법 프로토콜을 시행하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Synthesizing macroeconomic indicators enables resilient multinational enterprises and implement compliance protocols without compromising operational integrity.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "enables resilient multinational enterprises",
          "and implement compliance protocols",
          "without compromising operational integrity."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 다국적 기업들로 하여금 준법 프로토콜을 시행하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Synthesizing macroeconomic indicators enables resilient multinational enterprises to anticipate structural shifts across global capital markets.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "enables resilient multinational enterprises",
          "to anticipate structural shifts",
          "across global capital markets."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 다국적 기업들로 하여금 구조적 변화를 예측하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Synthesizing macroeconomic indicators enables resilient multinational enterprises to anticipate structural shifts without compromising operational integrity.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "enables resilient multinational enterprises",
          "to anticipate structural shifts",
          "without compromising operational integrity."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 다국적 기업들로 하여금 구조적 변화를 예측하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Synthesizing macroeconomic indicators enables resilient multinational enterprises and optimize capital allocation across global capital markets.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "enables resilient multinational enterprises",
          "and optimize capital allocation",
          "across global capital markets."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 다국적 기업들로 하여금 자본 배분을 최적화하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Synthesizing macroeconomic indicators enables resilient multinational enterprises and optimize capital allocation without compromising operational integrity.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "enables resilient multinational enterprises",
          "and optimize capital allocation",
          "without compromising operational integrity."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 다국적 기업들로 하여금 자본 배분을 최적화하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "Synthesizing macroeconomic indicators enables resilient multinational enterprises while preserving institutional credibility across global capital markets.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "enables resilient multinational enterprises",
          "while preserving institutional credibility",
          "across global capital markets."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 다국적 기업들로 하여금 기관 신뢰도를 보존하면서, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "Synthesizing macroeconomic indicators enables resilient multinational enterprises while preserving institutional credibility without compromising operational integrity.",
        "chunks": [
          "Synthesizing macroeconomic indicators",
          "enables resilient multinational enterprises",
          "while preserving institutional credibility",
          "without compromising operational integrity."
        ],
        "translation": "거시 경제 지표를 종합하는 것은, 다국적 기업들로 하여금 기관 신뢰도를 보존하면서, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "To preempt financial failures, demands decisive executive leadership to challenge orthodox assumptions across global capital markets.",
        "chunks": [
          "To preempt financial failures,",
          "demands decisive executive leadership",
          "to challenge orthodox assumptions",
          "across global capital markets."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 결단력 있는 리더십을 요구하며 고착화된 통념에 도전하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "To preempt financial failures, demands decisive executive leadership to challenge orthodox assumptions without compromising operational integrity.",
        "chunks": [
          "To preempt financial failures,",
          "demands decisive executive leadership",
          "to challenge orthodox assumptions",
          "without compromising operational integrity."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 결단력 있는 리더십을 요구하며 고착화된 통념에 도전하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "To preempt financial failures, demands decisive executive leadership and implement compliance protocols across global capital markets.",
        "chunks": [
          "To preempt financial failures,",
          "demands decisive executive leadership",
          "and implement compliance protocols",
          "across global capital markets."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 결단력 있는 리더십을 요구하며 준법 프로토콜을 시행하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "To preempt financial failures, demands decisive executive leadership and implement compliance protocols without compromising operational integrity.",
        "chunks": [
          "To preempt financial failures,",
          "demands decisive executive leadership",
          "and implement compliance protocols",
          "without compromising operational integrity."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 결단력 있는 리더십을 요구하며 준법 프로토콜을 시행하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "To preempt financial failures, demands decisive executive leadership to anticipate structural shifts across global capital markets.",
        "chunks": [
          "To preempt financial failures,",
          "demands decisive executive leadership",
          "to anticipate structural shifts",
          "across global capital markets."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 결단력 있는 리더십을 요구하며 구조적 변화를 예측하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "To preempt financial failures, demands decisive executive leadership to anticipate structural shifts without compromising operational integrity.",
        "chunks": [
          "To preempt financial failures,",
          "demands decisive executive leadership",
          "to anticipate structural shifts",
          "without compromising operational integrity."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 결단력 있는 리더십을 요구하며 구조적 변화를 예측하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "To preempt financial failures, demands decisive executive leadership and optimize capital allocation across global capital markets.",
        "chunks": [
          "To preempt financial failures,",
          "demands decisive executive leadership",
          "and optimize capital allocation",
          "across global capital markets."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 결단력 있는 리더십을 요구하며 자본 배분을 최적화하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "To preempt financial failures, demands decisive executive leadership and optimize capital allocation without compromising operational integrity.",
        "chunks": [
          "To preempt financial failures,",
          "demands decisive executive leadership",
          "and optimize capital allocation",
          "without compromising operational integrity."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 결단력 있는 리더십을 요구하며 자본 배분을 최적화하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "To preempt financial failures, demands decisive executive leadership while preserving institutional credibility across global capital markets.",
        "chunks": [
          "To preempt financial failures,",
          "demands decisive executive leadership",
          "while preserving institutional credibility",
          "across global capital markets."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 결단력 있는 리더십을 요구하며 기관 신뢰도를 보존하면서, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "To preempt financial failures, demands decisive executive leadership while preserving institutional credibility without compromising operational integrity.",
        "chunks": [
          "To preempt financial failures,",
          "demands decisive executive leadership",
          "while preserving institutional credibility",
          "without compromising operational integrity."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 결단력 있는 리더십을 요구하며 기관 신뢰도를 보존하면서, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "To preempt financial failures, enables resilient multinational enterprises to challenge orthodox assumptions across global capital markets.",
        "chunks": [
          "To preempt financial failures,",
          "enables resilient multinational enterprises",
          "to challenge orthodox assumptions",
          "across global capital markets."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 다국적 기업들로 하여금 고착화된 통념에 도전하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "To preempt financial failures, enables resilient multinational enterprises to challenge orthodox assumptions without compromising operational integrity.",
        "chunks": [
          "To preempt financial failures,",
          "enables resilient multinational enterprises",
          "to challenge orthodox assumptions",
          "without compromising operational integrity."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 다국적 기업들로 하여금 고착화된 통념에 도전하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "To preempt financial failures, enables resilient multinational enterprises and implement compliance protocols across global capital markets.",
        "chunks": [
          "To preempt financial failures,",
          "enables resilient multinational enterprises",
          "and implement compliance protocols",
          "across global capital markets."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 다국적 기업들로 하여금 준법 프로토콜을 시행하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "To preempt financial failures, enables resilient multinational enterprises and implement compliance protocols without compromising operational integrity.",
        "chunks": [
          "To preempt financial failures,",
          "enables resilient multinational enterprises",
          "and implement compliance protocols",
          "without compromising operational integrity."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 다국적 기업들로 하여금 준법 프로토콜을 시행하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "To preempt financial failures, enables resilient multinational enterprises to anticipate structural shifts across global capital markets.",
        "chunks": [
          "To preempt financial failures,",
          "enables resilient multinational enterprises",
          "to anticipate structural shifts",
          "across global capital markets."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 다국적 기업들로 하여금 구조적 변화를 예측하고, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "To preempt financial failures, enables resilient multinational enterprises to anticipate structural shifts without compromising operational integrity.",
        "chunks": [
          "To preempt financial failures,",
          "enables resilient multinational enterprises",
          "to anticipate structural shifts",
          "without compromising operational integrity."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 다국적 기업들로 하여금 구조적 변화를 예측하고, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "To preempt financial failures, enables resilient multinational enterprises and optimize capital allocation across global capital markets.",
        "chunks": [
          "To preempt financial failures,",
          "enables resilient multinational enterprises",
          "and optimize capital allocation",
          "across global capital markets."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 다국적 기업들로 하여금 자본 배분을 최적화하도록, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "To preempt financial failures, enables resilient multinational enterprises and optimize capital allocation without compromising operational integrity.",
        "chunks": [
          "To preempt financial failures,",
          "enables resilient multinational enterprises",
          "and optimize capital allocation",
          "without compromising operational integrity."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 다국적 기업들로 하여금 자본 배분을 최적화하도록, 운영의 진실성을 훼손하지 않고."
      },
      {
        "text": "To preempt financial failures, enables resilient multinational enterprises while preserving institutional credibility across global capital markets.",
        "chunks": [
          "To preempt financial failures,",
          "enables resilient multinational enterprises",
          "while preserving institutional credibility",
          "across global capital markets."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 다국적 기업들로 하여금 기관 신뢰도를 보존하면서, 글로벌 자본 시장 전반에 걸쳐."
      },
      {
        "text": "To preempt financial failures, enables resilient multinational enterprises while preserving institutional credibility without compromising operational integrity.",
        "chunks": [
          "To preempt financial failures,",
          "enables resilient multinational enterprises",
          "while preserving institutional credibility",
          "without compromising operational integrity."
        ],
        "translation": "금융 실패를 선제 방어하기 위해, 다국적 기업들로 하여금 기관 신뢰도를 보존하면서, 운영의 진실성을 훼손하지 않고."
      }
    ]
  }
};

// 모바일(iOS Safari 및 Android Chrome) 브라우저별 최적 녹음 코덱 감지
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

const cleanText = (str) => {
  return (str || '')
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

  if (level === 'A2' || level === 'B1') {
    const ignoreWords = ['a', 'an', 'the', 'is', 'are', 'to', 'in', 'on', 'at', 'of', 'for'];
    const filterWords = (text) => text.split(' ').filter(w => !ignoreWords.includes(w)).join(' ');
    normTarget = filterWords(normTarget);
    normSpoken = filterWords(normSpoken);
  }

  if (normTarget === normSpoken) {
    if (level === 'A2' || level === 'B1') {
      return { isPerfect: true, message: `🎉 완벽합니다! (${level} 레벨: 관사나 사소한 오류는 자동으로 패스했습니다.)` };
    }
    return { isPerfect: true, message: "🎉 완벽합니다! (Spot on!) 정확하게 말씀하셨습니다." };
  }

  const targetWords = normTarget.split(' ').filter(Boolean);
  const spokenWords = normSpoken.split(' ').filter(Boolean);

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

  if (level === 'A2') {
    if (missingWords.length + substituted.length <= 1 && extraWords.length <= 1) {
      return { isPerfect: true, message: "🎉 훌륭합니다! (A2 초급: 1~2단어의 사소한 인식 오류를 관대하게 패스했습니다.)" };
    }
  }

  if (level === 'B1') {
    if (missingWords.length === 0 && substituted.length === 0 && extraWords.length <= 1) {
      return { isPerfect: true, message: "🎉 잘하셨습니다! (B1 중급: 핵심 단어가 일치하여 패스했습니다.)" };
    }
  }

  const strictNotice = (level === 'C1' || level === 'B2') ? ` (${level} 모드: 매우 엄격함)` : '';

  if (substituted.length > 0) {
    return {
      isPerfect: false,
      message: `${substituted.slice(0, 2).join(', ')}을(를) 말씀하셨습니다. 원문에 맞춰 다시 시도해 보세요!${strictNotice}`
    };
  }

  if (missingWords.length > 0) {
    return {
      isPerfect: false,
      message: `${missingWords.slice(0, 2).join(', ')} 단어가 빠졌습니다. 끝까지 말씀해 보세요.${strictNotice}`
    };
  }

  if (extraWords.length > 0) {
    return {
      isPerfect: false,
      message: `원문에 없는 '${extraWords.slice(0, 2).join("', '")}' 단어가 들어갔습니다.${strictNotice}`
    };
  }

  return {
    isPerfect: false,
    message: `아주 근접했습니다! 조금 더 또렷하게 다시 발음해 보세요.${strictNotice}`
  };
};

export default function EnglishTutorApp() {
  const [difficultyLevel, setDifficultyLevel] = useState('B2');
  const [chunkLevel, setChunkLevel] = useState(2);
  const [practiceRound, setPracticeRound] = useState(1);
  const [showHintText, setShowHintText] = useState(false);
  
  const [pauseWaitTime, setPauseWaitTime] = useState(4); 
  const [remainingSilence, setRemainingSilence] = useState(null);

  const historyRef = useRef(new Set());
  const [currentSentence, setCurrentSentence] = useState(() => {
    const list = CHUNK_DATABASE.B2[2];
    const picked = list[Math.floor(Math.random() * list.length)];
    const text = picked.chunks ? picked.chunks.join(' ') : picked.text;
    historyRef.current.add(text);
    return { ...picked, text, level: 'B2' };
  });

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [isPlayingMyVoice, setIsPlayingMyVoice] = useState(false);
  const [isPlayingUserTts, setIsPlayingUserTts] = useState(false);

  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isPerfect, setIsPerfect] = useState(false);
  
  const [speechSpeed, setSpeechSpeed] = useState(0.85);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const userAudioPlayerRef = useRef(null);

  const isRecordingRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const silenceIntervalRef = useRef(null);
  const accumulatedSpeechRef = useRef("");
  const pauseWaitTimeRef = useRef(pauseWaitTime);
  pauseWaitTimeRef.current = pauseWaitTime;

  const currentItem = currentSentence;
  const displayItem = currentSentence;

  const clearSilenceTimers = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (silenceIntervalRef.current) {
      clearInterval(silenceIntervalRef.current);
      silenceIntervalRef.current = null;
    }
    setRemainingSilence(null);
  };

  const finishRecording = () => {
    clearSilenceTimers();
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
      setErrorMsg("음성이 감지되지 않았습니다. 마이크 버튼을 누르고 다시 말씀해 보세요.");
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

        clearSilenceTimers();

        const waitTime = pauseWaitTimeRef.current;
        if (waitTime > 0 && combinedText.length > 0) {
          let secondsLeft = waitTime;
          setRemainingSilence(secondsLeft);

          silenceIntervalRef.current = setInterval(() => {
            secondsLeft -= 1;
            if (secondsLeft <= 0) {
              clearInterval(silenceIntervalRef.current);
              silenceIntervalRef.current = null;
            } else {
              setRemainingSilence(secondsLeft);
            }
          }, 1000);

          silenceTimerRef.current = setTimeout(() => {
            finishRecording();
          }, waitTime * 1000);
        }
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
      clearSilenceTimers();
      if (recognitionRef.current) recognitionRef.current.abort();
      stopMediaRecorder();
    };
  }, [currentSentence.text]);

  const playTargetAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
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
      // iOS Safari 모바일 인라인 재생 필수 속성
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      audio.preload = 'auto';
      
      userAudioPlayerRef.current = audio;
      setIsPlayingMyVoice(true);

      audio.onended = () => setIsPlayingMyVoice(false);
      audio.onerror = (e) => {
        console.warn("Audio playback error:", e);
        setIsPlayingMyVoice(false);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio play catch:", err);
          setIsPlayingMyVoice(false);
        });
      }
    } catch (e) {
      console.warn("playMyVoiceAudio error:", e);
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

        // 모바일 브라우저에서 데이터 손실 방지를 위해 200ms 단위 청크 플러시
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
      setRecordedAudioUrl(null);
      setErrorMsg("");
      clearSilenceTimers();

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
      
      if (soundEffectsEnabled) {
        playSoundEffect(localResult.isPerfect ? 'success' : 'retry');
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      setEvaluation("발음을 인식했습니다. 다시 한 번 또렷하게 시도해 보세요!");
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

    const diffGroup = CHUNK_DATABASE[targetDiff] || CHUNK_DATABASE.B2;
    const localList = diffGroup[targetLevel] || diffGroup[2] || CHUNK_DATABASE.B2[2];
    
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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl max-w-md text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-bold mb-2">음성 인식 미지원 브라우저</h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
            Chrome, Edge, Safari 최신 브라우저를 이용해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-2 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* 상단 컨트롤러 및 헤더 */}
        <div className="bg-slate-900 border-b border-slate-800/80 p-4 sm:p-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="font-bold text-base sm:text-lg text-white tracking-wide">Wysh English Tutor</h1>
                <p className="text-[11px] sm:text-xs text-slate-400">의미 덩어리(청크) 단위 보이스 섀도잉</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={() => setSoundEffectsEnabled((prev) => !prev)}
                title={soundEffectsEnabled ? "효과음 켜짐" : "효과음 꺼짐"}
                className={`p-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  soundEffectsEnabled 
                    ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Bell className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${soundEffectsEnabled ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{soundEffectsEnabled ? '효과음 ON' : '효과음 OFF'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700/60">
                  연습 #{practiceRound}
                </span>
                <button
                  onClick={() => handleNextSentence(chunkLevel, difficultyLevel)}
                  title="새로운 문장 가져오기"
                  className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all active:scale-95"
                >
                  <Wand2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>새 문장</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 문장 난이도 (CEFR 레벨) 선택 버튼 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400" />
                문장 난이도 (CEFR Level)
              </label>
              <span className="text-[10px] sm:text-[11px] text-indigo-300 font-medium">
                선택: {DIFFICULTY_LEVELS.find(d => d.id === difficultyLevel)?.desc}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {DIFFICULTY_LEVELS.map((diff) => {
                const isSelected = difficultyLevel === diff.id;
                return (
                  <button
                    key={diff.id}
                    onClick={() => handleSelectDifficulty(diff.id)}
                    className={`py-1.5 sm:py-2 px-2 sm:px-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400 scale-[1.02]'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="font-bold">{diff.label}</span>
                    <span className={`text-[9px] sm:text-[10px] font-normal ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {diff.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 청크(의미 덩어리 개수) 선택 및 배속 조절 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400" />
                문장 길이 설정 (Chunk 수)
              </label>
              
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-400">
                <span>듣기 속도:</span>
                <button
                  onClick={() => setSpeechSpeed(s => s === 0.7 ? 0.85 : s === 0.85 ? 1.0 : 0.7)}
                  className={`px-2 sm:px-2.5 py-0.5 rounded sm:rounded border transition-colors ${
                    speechSpeed === 0.7 ? 'bg-indigo-600 text-white border-indigo-500' : 
                    speechSpeed === 1.0 ? 'bg-rose-600 text-white border-rose-500' : 
                    'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {speechSpeed === 0.7 ? '0.7x (느리게)' : speechSpeed === 0.85 ? '0.85x (표준)' : '1.0x (원어민)'}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
              {[2, 3, 4].map((level) => {
                const isSelected = chunkLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => handleSelectChunkLevel(level)}
                    className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-semibold transition-all flex flex-col items-center justify-center gap-0.5 sm:gap-1 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30 scale-[1.02]'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{level} 청크</span>
                    <span className={`text-[9px] sm:text-[10px] font-normal ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {level === 2 ? '단문 (2덩어리)' : level === 3 ? '중문 (3덩어리)' : '장문 (4덩어리)'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 침묵 대기 시간 조절 */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-2 text-[10px] sm:text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Timer className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              말 멈춤 대기 시간 (정적 허용):
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { val: 2.5, label: '2.5초' },
                { val: 4, label: '4초 (추천)' },
                { val: 6, label: '6초 (초보자)' },
                { val: -1, label: '수동 종료만' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => {
                    setPauseWaitTime(opt.val);
                    clearSilenceTimers();
                  }}
                  className={`px-2 sm:px-2.5 py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-semibold border transition-all ${
                    pauseWaitTime === opt.val
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 메인 섀도잉 영역 */}
        <div className="p-4 sm:p-8 flex flex-col gap-4 sm:gap-6">

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="flex items-center justify-between w-full max-w-md mb-2">
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                CEFR {difficultyLevel}
              </span>
              <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>Voice-Only Mode</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 my-2 sm:my-3 w-full max-w-md">
              {displayItem.chunks.map((chunk, idx) => (
                <div 
                  key={idx}
                  className={`w-full sm:w-auto sm:flex-1 min-w-[70px] py-2 sm:py-3.5 px-2 sm:px-3 rounded-lg sm:rounded-xl border text-center transition-all ${
                    isPlayingAudio 
                      ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300 shadow-md shadow-indigo-500/10 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[9px] sm:text-[11px] font-bold tracking-wider block text-indigo-400 mb-0.5">
                    CHUNK {idx + 1}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-400">
                    {showHintText ? chunk : `[ ${chunk.split(' ').length} 단어 ]`}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[10px] sm:text-xs text-slate-500 mt-2">
              CEFR {difficultyLevel} 레벨의 실용 표현입니다. 귀로 듣고 의미 단위로 끊어 말해보세요.
            </p>

            <button
              onClick={() => setShowHintText(prev => !prev)}
              className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-850 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-slate-800 transition-colors"
            >
              {showHintText ? <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              <span>{showHintText ? '문장 숨기기' : '정 안 들릴 때 문장 엿보기'}</span>
            </button>

            {showHintText && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl bg-slate-900 border border-slate-700/60 text-left w-full animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs sm:text-sm font-semibold text-indigo-300 mb-1">{displayItem.text}</p>
                <p className="text-[11px] sm:text-xs text-slate-400">{displayItem.translation}</p>
              </div>
            )}
          </div>

          {/* 듣기 및 녹음 버튼 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
            <button
              onClick={playTargetAudio}
              disabled={isPlayingAudio}
              className={`py-3.5 sm:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-[0.98] ${
                isPlayingAudio
                  ? 'bg-indigo-900/70 border border-indigo-500 text-indigo-200 ring-4 ring-indigo-500/20'
                  : 'bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-100 hover:text-white shadow-lg'
              }`}
            >
              <Volume2 className={`w-5 h-5 sm:w-6 sm:h-6 ${isPlayingAudio ? 'animate-bounce text-indigo-400' : 'text-indigo-400'}`} />
              <span className="text-sm sm:text-base">{isPlayingAudio ? "재생 중..." : "원어민 듣기 (Listen)"}</span>
            </button>

            <button
              onClick={toggleRecording}
              className={`py-3.5 sm:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all active:scale-[0.98] ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 ring-4 ring-rose-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                {isRecording ? <Square className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
                <span className="text-sm sm:text-base font-bold">
                  {isRecording ? "말씀 끝남 (탭하여 완료)" : "따라 말하기 (Tap to Speak)"}
                </span>
              </div>
              {isRecording && (
                <span className="text-[9px] sm:text-[11px] font-normal text-rose-100 flex items-center gap-1.5 animate-pulse mt-0.5">
                  {remainingSilence !== null 
                    ? `⏱️ ${remainingSilence}초 동안 침묵 시 자동 채점` 
                    : pauseWaitTime === -1 
                      ? "말씀이 끝난 후 버튼을 눌러주세요"
                      : "편하게 쉬어가며 말씀하세요 (충분히 기다립니다)"}
                </span>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 sm:p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-[11px] sm:text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 내가 말한 내용 및 피드백 */}
          {(userSpeech || isEvaluating || evaluation) && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl sm:rounded-2xl p-3 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400" />
                    내가 말한 내용 (My Spoken Speech)
                  </span>
                  
                  {userSpeech && (
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {recordedAudioUrl && (
                        <button
                          onClick={playMyVoiceAudio}
                          disabled={isPlayingMyVoice}
                          className={`px-2 sm:px-2.5 py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 border transition-all ${
                            isPlayingMyVoice
                              ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse'
                              : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                          }`}
                        >
                          <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                          <span>{isPlayingMyVoice ? '재생 중...' : '내 목소리 듣기'}</span>
                        </button>
                      )}

                      <button
                        onClick={playUserSpeechTts}
                        disabled={isPlayingUserTts}
                        className={`px-2 sm:px-2.5 py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 border transition-all ${
                          isPlayingUserTts
                            ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-750 text-indigo-300 border-slate-700'
                        }`}
                      >
                        <Volume1 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{isPlayingUserTts ? '재생 중...' : '인식 문장 듣기'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-3.5 text-slate-100 text-sm sm:text-base font-medium leading-relaxed">
                  {userSpeech ? (
                    <span className="text-indigo-200">"{userSpeech}"</span>
                  ) : (
                    <span className="text-slate-400 italic text-[11px] sm:text-sm">음성을 분석하고 있습니다...</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400" />
                  튜터의 피드백 (Tutor Feedback)
                </span>

                {isEvaluating ? (
                  <div className="p-3 sm:p-4 bg-slate-900 border border-slate-800 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 text-slate-400 text-xs sm:text-sm">
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-indigo-400" />
                    <span>발음 및 단어 일치 여부를 대조하고 있습니다...</span>
                  </div>
                ) : evaluation ? (
                  <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${
                    isPerfect 
                      ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 shadow-lg shadow-emerald-950/40' 
                      : 'bg-amber-950/50 border-amber-500/60 text-amber-200'
                  }`}>
                    <div className="flex items-start gap-2 sm:gap-3">
                      {isPerfect ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="text-[11px] sm:text-sm leading-relaxed flex-1">
                        <p className="font-semibold mb-1">{evaluation}</p>
                        {isPerfect ? (
                          <div className="mt-2.5 pt-2 sm:mt-3.5 sm:pt-3 border-t border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-[10px] sm:text-xs text-emerald-300/90 font-medium">
                              👏 내가 말한 문장과 녹음된 목소리를 충분히 확인해 보세요!
                            </span>
                            <button
                              onClick={() => handleNextSentence(chunkLevel, difficultyLevel)}
                              className="w-full sm:w-auto justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all active:scale-95"
                            >
                              <span>다음 문장으로 넘어가기</span>
                              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        ) : (
                          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <button
                              onClick={toggleRecording}
                              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 flex items-center gap-1 sm:gap-1.5 transition-all active:scale-95"
                            >
                              <Mic className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span>다시 말하기</span>
                            </button>
                            <button
                              onClick={() => handleNextSentence(chunkLevel, difficultyLevel)}
                              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 sm:gap-1.5 transition-all active:scale-95"
                            >
                              <span>다음 문장 넘어가기</span>
                              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

            </div>
          )}

        </div>

        <div className="bg-slate-900 border-t border-slate-800/80 px-4 py-3 sm:px-6 sm:py-4 text-center">
          <p className="text-[10px] sm:text-xs text-slate-500">
            💡 초급(A2/B1)은 인식이 다소 관대하며, 고급(B2/C1) 모드는 매우 엄격하게 채점됩니다.
          </p>
        </div>

      </div>
    </div>
  );
}
