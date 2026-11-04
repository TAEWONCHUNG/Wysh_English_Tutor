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
        "text": "I usually drink coffee before starting my workday.",
        "chunks": [
          "I usually drink coffee",
          "before starting my workday."
        ],
        "translation": "저는 보통 일과를 시작하기 전에 커피를 마십니다."
      },
      {
        "text": "Please send me an email when you arrive at the office.",
        "chunks": [
          "Please send me an email",
          "when you arrive at the office."
        ],
        "translation": "사무실에 도착하시면 저에게 이메일을 보내주세요."
      },
      {
        "text": "We need to schedule the interview for tomorrow morning.",
        "chunks": [
          "We need to schedule",
          "the interview for tomorrow morning."
        ],
        "translation": "우리는 내일 아침으로 면접 일정을 잡아야 합니다."
      },
      {
        "text": "The marketing presentation starts in about ten minutes.",
        "chunks": [
          "The marketing presentation starts",
          "in about ten minutes."
        ],
        "translation": "마케팅 발표는 약 10분 후에 시작됩니다."
      },
      {
        "text": "I will call you back right after the team meeting.",
        "chunks": [
          "I will call you back",
          "right after the team meeting."
        ],
        "translation": "팀 회의가 끝난 직후에 다시 전화드리겠습니다."
      },
      {
        "text": "She left the office early to catch her evening flight.",
        "chunks": [
          "She left the office early",
          "to catch her evening flight."
        ],
        "translation": "그녀는 저녁 비행기를 타기 위해 일찍 퇴근했습니다."
      },
      {
        "text": "Could you please print these documents for our new client?",
        "chunks": [
          "Could you please print these documents",
          "for our new client?"
        ],
        "translation": "우리 신규 고객을 위해 이 서류들을 인쇄해 주시겠어요?"
      },
      {
        "text": "He usually checks his messages during his lunch break.",
        "chunks": [
          "He usually checks his messages",
          "during his lunch break."
        ],
        "translation": "그는 보통 점심시간 동안 메시지를 확인합니다."
      },
      {
        "text": "We ordered new office supplies for the engineering department.",
        "chunks": [
          "We ordered new office supplies",
          "for the engineering department."
        ],
        "translation": "우리는 엔지니어링 부서를 위해 새 사무용품을 주문했습니다."
      },
      {
        "text": "I will prepare the presentation slides before tomorrow afternoon.",
        "chunks": [
          "I will prepare the presentation slides",
          "before tomorrow afternoon."
        ],
        "translation": "내일 오후가 되기 전에 발표 슬라이드를 준비해 두겠습니다."
      }
    ],
    "3": [
      {
        "text": "We have a regular team meeting every Monday morning at nine o'clock.",
        "chunks": [
          "We have a regular team meeting",
          "every Monday morning",
          "at nine o'clock."
        ],
        "translation": "우리는 매주 월요일 아침 9시에 정기 팀 회의를 합니다."
      },
      {
        "text": "I will submit the weekly report before leaving the office this afternoon.",
        "chunks": [
          "I will submit the weekly report",
          "before leaving the office",
          "this afternoon."
        ],
        "translation": "오늘 오후 퇴근하기 전에 주간 보고서를 제출하겠습니다."
      },
      {
        "text": "Please double check the attached file before sending out the monthly newsletter.",
        "chunks": [
          "Please double check the attached file",
          "before sending out",
          "the monthly newsletter."
        ],
        "translation": "월간 소식지를 발송하기 전에 첨부 파일을 다시 한번 확인해 주세요."
      },
      {
        "text": "Our sales team met the new client at the central station yesterday afternoon.",
        "chunks": [
          "Our sales team met the new client",
          "at the central station",
          "yesterday afternoon."
        ],
        "translation": "우리 영업팀은 어제 오후 중앙역에서 새 고객을 만났습니다."
      },
      {
        "text": "She answered all client questions with great patience and strong confidence.",
        "chunks": [
          "She answered all client questions",
          "with great patience",
          "and strong confidence."
        ],
        "translation": "그녀는 뛰어난 인내심과 확신을 가지고 모든 고객 질문에 답변했습니다."
      },
      {
        "text": "Could you please review these slides and give me your feedback by tomorrow morning?",
        "chunks": [
          "Could you please review these slides",
          "and give me your feedback",
          "by tomorrow morning?"
        ],
        "translation": "내일 아침까지 이 슬라이드들을 검토하고 피드백을 주실 수 있나요?"
      },
      {
        "text": "We decided to postpone the kickoff meeting until next Wednesday at ten o'clock.",
        "chunks": [
          "We decided to postpone the kickoff meeting",
          "until next Wednesday",
          "at ten o'clock."
        ],
        "translation": "우리는 킥오프 회의를 다음 주 수요일 10시로 연기하기로 결정했습니다."
      },
      {
        "text": "The manager approved my vacation request without any hesitation this morning.",
        "chunks": [
          "The manager approved my vacation request",
          "without any hesitation",
          "this morning."
        ],
        "translation": "팀장님은 오늘 아침 망설임 없이 제 휴가 신청을 승인해 주셨습니다."
      }
    ],
    "4": [
      {
        "text": "If the weather is nice tomorrow we can enjoy lunch together outside in the garden park near our main office.",
        "chunks": [
          "If the weather is nice tomorrow",
          "we can enjoy lunch together",
          "outside in the garden park",
          "near our main office."
        ],
        "translation": "내일 날씨가 좋으면 본사 근처 정원 공원에서 함께 점심을 즐길 수 있습니다."
      },
      {
        "text": "Before you leave the building tonight please make sure that all the desktop computers are turned off properly.",
        "chunks": [
          "Before you leave the building tonight",
          "please make sure that",
          "all the desktop computers",
          "are turned off properly."
        ],
        "translation": "오늘 밤 건물을 나서기 전에 모든 데스크톱 컴퓨터가 제대로 꺼져 있는지 확인해 주세요."
      },
      {
        "text": "Whenever you receive a customer inquiry you should respond as quickly as possible and write down their key requests in the shared database.",
        "chunks": [
          "Whenever you receive a customer inquiry",
          "you should respond as quickly as possible",
          "and write down their key requests",
          "in the shared database."
        ],
        "translation": "고객 문의를 받을 때마다 가능한 한 신속히 응대하고 공유 데이터베이스에 핵심 요청 사항을 기록해야 합니다."
      },
      {
        "text": "If you have any further questions feel free to contact our support team through the official website chat during business hours.",
        "chunks": [
          "If you have any further questions",
          "feel free to contact our support team",
          "through the official website chat",
          "during business hours."
        ],
        "translation": "추가 문의 사항이 있으시면 업무 시간 중 공식 웹사이트 채팅을 통해 지원팀에 편하게 문의해 주세요."
      }
    ]
  },
  "B1": {
    "2": [
      {
        "text": "Please review carefully the attached project proposal.",
        "chunks": [
          "Please review carefully",
          "the attached project proposal."
        ],
        "translation": "첨부된 프로젝트 제안서를 주의 깊게 검토해 주시기 바랍니다."
      },
      {
        "text": "Customer satisfaction remains our highest operational priority.",
        "chunks": [
          "Customer satisfaction remains",
          "our highest operational priority."
        ],
        "translation": "고객 만족은 언제나 우리의 최우선 운영 과제입니다."
      },
      {
        "text": "We should definitely focus on improving client retention rates.",
        "chunks": [
          "We should definitely focus on",
          "improving client retention rates."
        ],
        "translation": "우리는 고객 유지율을 개선하는 데 확실히 집중해야 합니다."
      },
      {
        "text": "The technical engineering team resolved the server issue promptly.",
        "chunks": [
          "The technical engineering team",
          "resolved the server issue promptly."
        ],
        "translation": "기술 엔지니어링 팀이 서버 문제를 신속하게 해결했습니다."
      },
      {
        "text": "We need more accurate data before finalizing the marketing strategy.",
        "chunks": [
          "We need more accurate data",
          "before finalizing the marketing strategy."
        ],
        "translation": "마케팅 전략을 최종 확정하기 전에 더 정확한 데이터가 필요합니다."
      },
      {
        "text": "Please keep me closely updated regarding any upcoming schedule changes.",
        "chunks": [
          "Please keep me closely updated",
          "regarding any upcoming schedule changes."
        ],
        "translation": "향후 일정 변동이 생기면 계속해서 저에게 자세히 공유해 주세요."
      },
      {
        "text": "Our latest product launch received overwhelmingly positive feedback.",
        "chunks": [
          "Our latest product launch",
          "received overwhelmingly positive feedback."
        ],
        "translation": "우리의 최신 제품 출시는 압도적으로 긍정적인 평가를 받았습니다."
      },
      {
        "text": "The recent budget cuts will directly impact our hiring plans.",
        "chunks": [
          "The recent budget cuts",
          "will directly impact our hiring plans."
        ],
        "translation": "최근의 예산 삭감은 우리의 채용 계획에 직접적인 영향을 미칠 것입니다."
      }
    ],
    "3": [
      {
        "text": "Effective communication plays a vital role in successful team collaboration.",
        "chunks": [
          "Effective communication",
          "plays a vital role",
          "in successful team collaboration."
        ],
        "translation": "효과적인 소통은 성공적인 팀 협업에서 매우 중요한 역할을 합니다."
      },
      {
        "text": "Flexible work arrangements contributed significantly to overall employee satisfaction.",
        "chunks": [
          "Flexible work arrangements",
          "contributed significantly",
          "to overall employee satisfaction."
        ],
        "translation": "유연 근무제는 전반적인 직원 만족도 향상에 크게 기여했습니다."
      },
      {
        "text": "We need to identify the key factors behind this unexpected sales decline.",
        "chunks": [
          "We need to identify",
          "the key factors behind",
          "this unexpected sales decline."
        ],
        "translation": "우리는 이번 예상치 못한 매출 감소의 핵심 원인들을 파악해야 합니다."
      },
      {
        "text": "The newly launched application received positive feedback from most corporate clients.",
        "chunks": [
          "The newly launched application",
          "received positive feedback",
          "from most corporate clients."
        ],
        "translation": "새로 출시된 애플리케이션은 대부분의 기업 고객들로부터 긍정적인 반응을 얻었습니다."
      },
      {
        "text": "Our direct supervisor will deliver a keynote speech during the opening ceremony.",
        "chunks": [
          "Our direct supervisor",
          "will deliver a keynote speech",
          "during the opening ceremony."
        ],
        "translation": "우리 부서장님께서 개회식 동안 기조연설을 진행하실 예정입니다."
      },
      {
        "text": "Investing in staff training brings substantial benefits to our growing organization.",
        "chunks": [
          "Investing in staff training",
          "brings substantial benefits",
          "to our growing organization."
        ],
        "translation": "직원 교육에 대한 투자는 성장하는 우리 조직에 상당한 이점을 가져다줍니다."
      },
      {
        "text": "We should streamline the process to reduce unnecessary delays in client project approvals.",
        "chunks": [
          "We should streamline the process",
          "to reduce unnecessary delays",
          "in client project approvals."
        ],
        "translation": "고객 프로젝트 승인에서 불필요한 지연을 줄이기 위해 절차를 간소화해야 합니다."
      }
    ],
    "4": [
      {
        "text": "Automating routine repetitive tasks gives employees more freedom to focus their energy on creative project work.",
        "chunks": [
          "Automating routine repetitive tasks",
          "gives employees more freedom",
          "to focus their energy",
          "on creative project work."
        ],
        "translation": "반복적인 일상 업무를 자동화하면 직원들이 창의적인 프로젝트 업무에 에너지를 집중할 수 있는 여유가 생깁니다."
      },
      {
        "text": "Despite encountering unexpected challenges in the domestic market, our company achieved substantial revenue growth this quarter.",
        "chunks": [
          "Despite encountering unexpected challenges",
          "in the domestic market,",
          "our company achieved",
          "substantial revenue growth this quarter."
        ],
        "translation": "국내 시장에서 예상치 못한 어려움에 직면했음에도 불구하고, 우리 회사는 이번 분기에 상당한 매출 성장을 달성했습니다."
      },
      {
        "text": "By adopting cloud collaboration tools, our distributed remote teams can share critical project documents in real time without delay.",
        "chunks": [
          "By adopting cloud collaboration tools,",
          "our distributed remote teams",
          "can share critical project documents",
          "in real time without delay."
        ],
        "translation": "클라우드 협업 도구를 도입함으로써 분산된 원격 근무 팀들이 지연 없이 실시간으로 중요 프로젝트 문서를 공유할 수 있습니다."
      },
      {
        "text": "To improve customer service quality, we must gather direct feedback and implement constructive suggestions without unnecessary delay.",
        "chunks": [
          "To improve customer service quality,",
          "we must gather direct feedback",
          "and implement constructive suggestions",
          "without unnecessary delay."
        ],
        "translation": "고객 서비스 품질을 향상하기 위해 우리는 직접적인 피드백을 수집하고 건설적인 제안을 불필요한 지연 없이 즉각 실행해야 합니다."
      }
    ]
  },
  "B2": {
    "2": [
      {
        "text": "We successfully negotiated the new contract terms with our partners.",
        "chunks": [
          "We successfully negotiated",
          "the new contract terms with our partners."
        ],
        "translation": "우리는 파트너사들과 새로운 계약 조건을 성공적으로 협상했습니다."
      },
      {
        "text": "Continuous learning is essential for sustained professional growth.",
        "chunks": [
          "Continuous learning is essential",
          "for sustained professional growth."
        ],
        "translation": "지속적인 배움은 지속 가능한 전문적 성장을 위해 필수적입니다."
      },
      {
        "text": "Our quarterly revenue exceeded all initial market forecasts.",
        "chunks": [
          "Our quarterly revenue exceeded",
          "all initial market forecasts."
        ],
        "translation": "우리 분기 매출은 초기 모든 시장 전망치를 초과 달성했습니다."
      },
      {
        "text": "Implementing agile methodology streamlined our entire development cycle.",
        "chunks": [
          "Implementing agile methodology",
          "streamlined our entire development cycle."
        ],
        "translation": "애자일 방법론의 도입은 우리의 전체 개발 주기를 효율화했습니다."
      },
      {
        "text": "We must carefully allocate our budget across strategic growth initiatives.",
        "chunks": [
          "We must carefully allocate our budget",
          "across strategic growth initiatives."
        ],
        "translation": "우리는 전략적 성장 계획 전반에 걸쳐 예산을 신중하게 배분해야 합니다."
      },
      {
        "text": "Market volatility demands swift organizational decision making.",
        "chunks": [
          "Market volatility demands",
          "swift organizational decision making."
        ],
        "translation": "시장의 변동성은 기민한 조직 의사결정 프로세스를 요구합니다."
      },
      {
        "text": "The executive leadership team emphasized strict corporate compliance.",
        "chunks": [
          "The executive leadership team",
          "emphasized strict corporate compliance."
        ],
        "translation": "경영진 리더십 팀은 엄격한 기업 준법 경영의 중요성을 강조했습니다."
      }
    ],
    "3": [
      {
        "text": "Health and wellness are becoming top priorities for modern consumers worldwide.",
        "chunks": [
          "Health and wellness",
          "are becoming top priorities",
          "for modern consumers worldwide."
        ],
        "translation": "건강과 웰빙은 전 세계 현대 소비자들에게 최우선 순위가 되고 있습니다."
      },
      {
        "text": "Financial literacy is crucial for achieving stability over the long term.",
        "chunks": [
          "Financial literacy is crucial",
          "for achieving stability",
          "over the long term."
        ],
        "translation": "금융 문해력은 장기적인 재정 안정을 달성하는 데 결정적으로 중요합니다."
      },
      {
        "text": "Data privacy regulations require strict adherence by all global organizations.",
        "chunks": [
          "Data privacy regulations",
          "require strict adherence",
          "by all global organizations."
        ],
        "translation": "데이터 개인정보 규정은 모든 글로벌 기업 조직의 엄격한 준수를 요구합니다."
      },
      {
        "text": "Strengthening supply chain resilience helped us mitigate unexpected logistic disruptions.",
        "chunks": [
          "Strengthening supply chain resilience",
          "helped us mitigate",
          "unexpected logistic disruptions."
        ],
        "translation": "공급망 회복탄력성을 강화함으로써 예상치 못한 물류 혼선을 완화할 수 있었습니다."
      },
      {
        "text": "Conducting competitor analysis revealed promising opportunities in untapped niche markets.",
        "chunks": [
          "Conducting competitor analysis",
          "revealed promising opportunities",
          "in untapped niche markets."
        ],
        "translation": "경쟁사 분석을 수행하여 미개척 틈새시장에서 유망한 비즈니스 기회를 발굴했습니다."
      },
      {
        "text": "Cross functional collaboration fostered remarkable innovation across multiple technical departments.",
        "chunks": [
          "Cross functional collaboration",
          "fostered remarkable innovation",
          "across multiple technical departments."
        ],
        "translation": "부서 간 협업을 통해 여러 기술 부서 전반에 걸쳐 괄목할 만한 혁신을 이끌어냈습니다."
      }
    ],
    "4": [
      {
        "text": "Continuous learning is essential for long term professional growth in this rapidly changing and demanding industry environment.",
        "chunks": [
          "Continuous learning is essential",
          "for long term professional growth",
          "in this rapidly changing",
          "and demanding industry environment."
        ],
        "translation": "이처럼 급변하고 까다로운 산업 환경에서 지속적인 배움은 장기적인 전문적 성장을 위해 필수적입니다."
      },
      {
        "text": "The global marketing team plans to expand operations across key emerging markets during the upcoming fiscal year.",
        "chunks": [
          "The global marketing team",
          "plans to expand operations",
          "across key emerging markets",
          "during the upcoming fiscal year."
        ],
        "translation": "글로벌 마케팅 팀은 다가오는 회계연도 동안 주요 신흥 시장 전반으로 사업 운영을 확장할 계획입니다."
      },
      {
        "text": "Integrating customer feedback directly into regular product updates dramatically boosted our overall user retention rate.",
        "chunks": [
          "Integrating customer feedback directly",
          "into regular product updates",
          "dramatically boosted",
          "our overall user retention rate."
        ],
        "translation": "고객 피드백을 정기 제품 업데이트에 직접 반영함으로써 전반적인 사용자 유지율을 비약적으로 끌어올렸습니다."
      },
      {
        "text": "To maintain our competitive advantage, we must actively foster a collaborative work environment that encourages innovative thinking.",
        "chunks": [
          "To maintain our competitive advantage,",
          "we must actively foster",
          "a collaborative work environment",
          "that encourages innovative thinking."
        ],
        "translation": "경쟁 우위를 유지하기 위해 우리는 혁신적인 사고를 장려하는 협력적인 업무 환경을 적극적으로 조성해야 합니다."
      }
    ]
  },
  "C1": {
    "2": [
      {
        "text": "The board reached a consensus regarding fiscal consolidation measures.",
        "chunks": [
          "The board reached a consensus",
          "regarding fiscal consolidation measures."
        ],
        "translation": "이사회는 재정 건전화 조치 방안에 관해 합의에 도달했습니다."
      },
      {
        "text": "Meticulous operational scrutiny is indispensable to preempt bottlenecks.",
        "chunks": [
          "Meticulous operational scrutiny",
          "is indispensable to preempt bottlenecks."
        ],
        "translation": "병목 현상을 선제적으로 방지하기 위해 꼼꼼한 운영 정밀 검토가 필수적입니다."
      },
      {
        "text": "Strategic diversification hedges against unpredictable macroeconomic fluctuations.",
        "chunks": [
          "Strategic diversification hedges",
          "against unpredictable macroeconomic fluctuations."
        ],
        "translation": "전략적 다각화는 예측 불가능한 거시 경제적 변동성을 방어해 줍니다."
      },
      {
        "text": "Transparent corporate governance enhances institutional investor confidence.",
        "chunks": [
          "Transparent corporate governance",
          "enhances institutional investor confidence."
        ],
        "translation": "투명한 기업 지배구조는 기관 투자자의 장기적인 신뢰를 강화합니다."
      }
    ],
    "3": [
      {
        "text": "Sustainable macroeconomic resilience hinges on agile policy adjustments amid volatile market shifts.",
        "chunks": [
          "Sustainable macroeconomic resilience",
          "hinges on agile policy adjustments",
          "amid volatile market shifts."
        ],
        "translation": "지속 가능한 거시경제적 회복력은 변동성 큰 시장 변화 속 기민한 정책 조정에 달려 있습니다."
      },
      {
        "text": "Cultivating organizational synergy requires dismantling entrenched silos through transparent executive dialogue.",
        "chunks": [
          "Cultivating organizational synergy",
          "requires dismantling entrenched silos",
          "through transparent executive dialogue."
        ],
        "translation": "조직의 시너지를 창출하기 위해서는 투명한 경영진 대화를 통해 고착화된 부서 간 장벽을 허물어야 합니다."
      },
      {
        "text": "Pioneering technological disruptions systematically dismantle conventional legacy business models.",
        "chunks": [
          "Pioneering technological disruptions",
          "systematically dismantle",
          "conventional legacy business models."
        ],
        "translation": "선구적인 기술적 파괴는 기존의 전통적인 비즈니스 모델을 체계적으로 해체합니다."
      }
    ],
    "4": [
      {
        "text": "Navigating cross border regulatory ambiguities demands proactive stakeholder engagement and rigorous implementation of international compliance protocols.",
        "chunks": [
          "Navigating cross border regulatory ambiguities",
          "demands proactive stakeholder engagement",
          "and rigorous implementation",
          "of international compliance protocols."
        ],
        "translation": "국경 간 규제 모호성을 헤쳐나가기 위해서는 선제적인 이해관계자 참여와 국제 준법 프로토콜의 엄격한 이행이 요구됩니다."
      },
      {
        "text": "Fostering institutional agility requires executive leadership to challenge orthodox assumptions and embrace calculated strategic risks.",
        "chunks": [
          "Fostering institutional agility",
          "requires executive leadership",
          "to challenge orthodox assumptions",
          "and embrace calculated strategic risks."
        ],
        "translation": "조직의 기민성을 함양하기 위해서는 경영진 리더십이 통념적 가정을 재검토하고 계산된 전략적 위험을 수용할 것을 요구합니다."
      },
      {
        "text": "Leveraging predictive artificial intelligence enables modern enterprises to anticipate market volatility and optimize resource allocation strategically.",
        "chunks": [
          "Leveraging predictive artificial intelligence",
          "enables modern enterprises",
          "to anticipate market volatility",
          "and optimize resource allocation strategically."
        ],
        "translation": "예측 인공지능을 활용함으로써 현대 기업들은 시장 변동성을 예측하고 자원 배분을 전략적으로 최적화할 수 있습니다."
      }
    ]
  }
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

// 레벨별 관대함(Strictness)을 적용한 피드백 엔진
const generateLocalFeedback = (target, spoken, level) => {
  
  let normTarget = cleanText(target);
  let normSpoken = cleanText(spoken);

  // A2, B1: 관사 및 전치사 등 덜 중요한 단어 일부 무시 (원활한 통과를 위해)
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

  // A2 레벨 특별 관대함: 1단어 누락이나 오인식은 애교로 패스 (STT 스트레스 방지)
  if (level === 'A2') {
    if (missingWords.length + substituted.length <= 1 && extraWords.length <= 1) {
      return { isPerfect: true, message: "🎉 훌륭합니다! (A2 초급: 1~2단어의 사소한 인식 오류를 관대하게 패스했습니다.)" };
    }
  }

  // B1 레벨 특별 관대함: 의미 있는 단어는 다 말했는데 잉여 단어(extra)가 1개 끼어든 정도는 패스
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
  
  // 재생 속도 상태 (0.7, 0.85, 1.0)
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
      evaluateSpeech(finalSpoken, currentItem.text);
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

  useEffect(() => {
    let timer;
    if (isPerfect) {
      timer = setTimeout(() => {
        handleNextSentence();
      }, 2200);
    }
    return () => clearTimeout(timer);
  }, [isPerfect]);

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
    if (userAudioPlayerRef.current) userAudioPlayerRef.current.pause();
    const audio = new Audio(recordedAudioUrl);
    userAudioPlayerRef.current = audio;
    setIsPlayingMyVoice(true);
    audio.onended = () => setIsPlayingMyVoice(false);
    audio.onerror = () => setIsPlayingMyVoice(false);
    audio.play().catch(() => setIsPlayingMyVoice(false));
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
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            setRecordedAudioUrl(URL.createObjectURL(audioBlob));
          }
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
      }
    } catch (e) {}
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

    // 레벨 정보를 평가 함수로 전달
    const localResult = generateLocalFeedback(targetText, spokenText, difficultyLevel);
    setIsPerfect(localResult.isPerfect);
    setEvaluation(localResult.message);
    
    if (soundEffectsEnabled) {
      playSoundEffect(localResult.isPerfect ? 'success' : 'retry');
    }
    setIsEvaluating(false);
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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md text-center shadow-2xl">
          <AlertCircle className="w-14 h-14 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">음성 인식 미지원 브라우저</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Chrome, Edge, Safari 최신 브라우저를 이용해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* 상단 컨트롤러 및 헤더 */}
        <div className="bg-slate-900 border-b border-slate-800/80 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white tracking-wide">Wysh English Tutor</h1>
                <p className="text-xs text-slate-400">의미 덩어리(청크) 단위 보이스 섀도잉</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEffectsEnabled((prev) => !prev)}
                title={soundEffectsEnabled ? "효과음 켜짐" : "효과음 꺼짐"}
                className={`p-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  soundEffectsEnabled 
                    ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${soundEffectsEnabled ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{soundEffectsEnabled ? '효과음 ON' : '효과음 OFF'}</span>
              </button>

              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700/60">
                연습 #{practiceRound}
              </span>
              <button
                onClick={() => handleNextSentence(chunkLevel, difficultyLevel)}
                title="새로운 문장 가져오기"
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all active:scale-95"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>새 문장</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 문장 난이도 (CEFR 레벨) 선택 버튼 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                문장 난이도 (CEFR Level)
              </label>
              <span className="text-[11px] text-indigo-300 font-medium">
                선택: {DIFFICULTY_LEVELS.find(d => d.id === difficultyLevel)?.desc}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DIFFICULTY_LEVELS.map((diff) => {
                const isSelected = difficultyLevel === diff.id;
                return (
                  <button
                    key={diff.id}
                    onClick={() => handleSelectDifficulty(diff.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400 scale-[1.02]'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="font-bold">{diff.label}</span>
                    <span className={`text-[10px] font-normal ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
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
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                문장 길이 설정 (Chunk 수)
              </label>
              
              {/* 재생 속도 변경 버튼 (1.0x 추가) */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>듣기 속도:</span>
                <button
                  onClick={() => setSpeechSpeed(s => s === 0.7 ? 0.85 : s === 0.85 ? 1.0 : 0.7)}
                  className={`px-2.5 py-0.5 rounded border transition-colors ${
                    speechSpeed === 0.7 ? 'bg-indigo-600 text-white border-indigo-500' : 
                    speechSpeed === 1.0 ? 'bg-rose-600 text-white border-rose-500' : 
                    'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {speechSpeed === 0.7 ? '0.7x (느리게)' : speechSpeed === 0.85 ? '0.85x (표준)' : '1.0x (원어민)'}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2.5">
              {[2, 3, 4].map((level) => {
                const isSelected = chunkLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => handleSelectChunkLevel(level)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex flex-col items-center justify-center gap-1 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30 scale-[1.02]'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{level} 청크</span>
                    <span className={`text-[10px] font-normal ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {level === 2 ? '단문 (2덩어리)' : level === 3 ? '중문 (3덩어리)' : '장문 (4덩어리)'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 침묵 대기 시간 조절 */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              말 멈춤 대기 시간 (정적 허용):
            </span>
            <div className="flex items-center gap-1.5">
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
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
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
        <div className="p-6 sm:p-8 flex flex-col gap-6">

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="flex items-center justify-between w-full max-w-md mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                CEFR {difficultyLevel}
              </span>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>Voice-Only Mode</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 my-3 w-full max-w-md">
              {displayItem.chunks.map((chunk, idx) => (
                <div 
                  key={idx}
                  className={`flex-1 min-w-[90px] py-3.5 px-3 rounded-xl border text-center transition-all ${
                    isPlayingAudio 
                      ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300 shadow-md shadow-indigo-500/10 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[11px] font-bold tracking-wider block text-indigo-400 mb-0.5">
                    CHUNK {idx + 1}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {showHintText ? chunk : `[ ${chunk.split(' ').length} 단어 ]`}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 mt-2">
              CEFR {difficultyLevel} 레벨의 실용 표현입니다. 귀로 듣고 의미 단위로 끊어 말해보세요.
            </p>

            <button
              onClick={() => setShowHintText(prev => !prev)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
            >
              {showHintText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showHintText ? '문장 숨기기' : '정 안 들릴 때 문장 엿보기'}</span>
            </button>

            {showHintText && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-700/60 text-left w-full animate-in fade-in zoom-in-95 duration-200">
                <p className="text-sm font-semibold text-indigo-300 mb-1">{displayItem.text}</p>
                <p className="text-xs text-slate-400">{displayItem.translation}</p>
              </div>
            )}
          </div>

          {/* 듣기 및 녹음 버튼 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              onClick={playTargetAudio}
              disabled={isPlayingAudio}
              className={`py-5 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                isPlayingAudio
                  ? 'bg-indigo-900/70 border border-indigo-500 text-indigo-200 ring-4 ring-indigo-500/20'
                  : 'bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-100 hover:text-white shadow-lg'
              }`}
            >
              <Volume2 className={`w-6 h-6 ${isPlayingAudio ? 'animate-bounce text-indigo-400' : 'text-indigo-400'}`} />
              <span>{isPlayingAudio ? "재생 중..." : "원어민 듣기 (Listen)"}</span>
            </button>

            <button
              onClick={toggleRecording}
              className={`py-5 px-6 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.98] ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 ring-4 ring-rose-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
              }`}
            >
              <div className="flex items-center gap-2">
                {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-6 h-6" />}
                <span className="text-base font-bold">
                  {isRecording ? "말씀 끝남 (탭하여 완료)" : "따라 말하기 (Tap to Speak)"}
                </span>
              </div>
              {isRecording && (
                <span className="text-[11px] font-normal text-rose-100 flex items-center gap-1.5 animate-pulse">
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
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 내가 말한 내용 및 피드백 */}
          {(userSpeech || isEvaluating || evaluation) && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-indigo-400" />
                    내가 말한 내용 (My Spoken Speech)
                  </span>
                  
                  {userSpeech && (
                    <div className="flex items-center gap-2">
                      {recordedAudioUrl && (
                        <button
                          onClick={playMyVoiceAudio}
                          disabled={isPlayingMyVoice}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                            isPlayingMyVoice
                              ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse'
                              : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isPlayingMyVoice ? '재생 중...' : '내 목소리 듣기'}</span>
                        </button>
                      )}

                      <button
                        onClick={playUserSpeechTts}
                        disabled={isPlayingUserTts}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                          isPlayingUserTts
                            ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-750 text-indigo-300 border-slate-700'
                        }`}
                      >
                        <Volume1 className="w-3.5 h-3.5" />
                        <span>{isPlayingUserTts ? '재생 중...' : '인식 문장 듣기'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-slate-100 text-base font-medium leading-relaxed">
                  {userSpeech ? (
                    <span className="text-indigo-200">"{userSpeech}"</span>
                  ) : (
                    <span className="text-slate-400 italic text-sm">음성을 분석하고 있습니다...</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  튜터의 피드백 (Tutor Feedback)
                </span>

                {isEvaluating ? (
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3 text-slate-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>발음 및 단어 일치 여부를 대조하고 있습니다...</span>
                  </div>
                ) : (
                  <div className={`p-4 rounded-xl border transition-all ${
                    isPerfect 
                      ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 shadow-lg shadow-emerald-950/40' 
                      : 'bg-amber-950/50 border-amber-500/60 text-amber-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      {isPerfect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="text-sm leading-relaxed">
                        <p className="font-semibold mb-1">{evaluation}</p>
                        {isPerfect && (
                          <p className="text-xs text-emerald-300/80">
                            다음 문장으로 자동 이동합니다...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        <div className="bg-slate-900 border-t border-slate-800/80 px-6 py-4 text-center">
          <p className="text-xs text-slate-500">
            💡 초급(A2/B1)은 인식이 다소 관대하며, 고급(B2/C1) 모드는 매우 엄격하게 채점됩니다.
          </p>
        </div>

      </div>
    </div>
  );
}
