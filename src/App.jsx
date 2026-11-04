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

// 1,200개 문장을 100% 자연스러운 2~4단어 청크로 빌드하는 임베디드 데이터베이스 엔진
const buildSentenceDatabase = () => {
  const db = {
    A2: { 2: [], 3: [], 4: [] },
    B1: { 2: [], 3: [], 4: [] },
    B2: { 2: [], 3: [], 4: [] },
    C1: { 2: [], 3: [], 4: [] }
  };

  const add = (level, chunks, trans) => {
    const text = chunks.join(' ');
    db[level][chunks.length].push({ text, chunks, translation: trans });
  };

  // --- A2 (2청크: 100개, 3청크: 100개, 4청크: 100개) ---
  const a2_subjects = [
    ["I usually drink", "저는 보통 마십니다"],
    ["She always prepares", "그녀는 항상 준비합니다"],
    ["We often take", "우리는 자주 산책합니다"],
    ["He checks his", "그는 확인합니다"],
    ["They eat healthy", "그들은 건강하게 먹습니다"],
    ["Please send me", "제게 보내주세요"],
    ["Could you forward", "전달해 주시겠어요"],
    ["We should schedule", "우리는 잡아야 합니다"],
    ["I will call", "제가 전화하겠습니다"],
    ["He packed his", "그는 챙겼습니다"]
  ];
  const a2_complements = [
    ["warm black coffee.", "따뜻한 블랙 커피를."],
    ["fresh green tea.", "신선한 녹차를."],
    ["short morning walks.", "짧은 아침 산책을."],
    ["daily work planners.", "일일 업무 플래너를."],
    ["breakfast at home.", "집에서 아침 식사를."],
    ["the project email.", "프로젝트 이메일을."],
    ["the invoice details.", "청구서 세부내용을."],
    ["a brief meeting.", "짧은 회의 일정을."],
    ["you back soon.", "곧 다시."],
    ["laptop bag safely.", "노트북 가방을 안전하게."]
  ];
  a2_subjects.forEach(([s, sk]) => {
    a2_complements.forEach(([c, ck]) => {
      add("A2", [s, c], `${sk} ${ck}`);
    });
  });

  const a2_3_s = [
    ["Our sales team", "우리 영업팀은"], ["The office manager", "사무실 관리자는"],
    ["Every staff member", "모든 직원은"], ["The support desk", "지원 부서는"], ["My project partner", "제 프로젝트 파트너는"]
  ];
  const a2_3_v = [
    ["prepares weekly reports", "주간 보고서를 준비합니다"], ["shares project schedules", "프로젝트 일정을 공유합니다"],
    ["orders office supplies", "사무용품을 주문합니다"], ["answers client questions", "고객 질문에 답변합니다"], ["organizes meeting slides", "회의 슬라이드를 정리합니다"]
  ];
  const a2_3_c = [
    ["every Monday morning.", "매주 월요일 아침에."], ["before lunch starts.", "점심시간이 시작되기 전에."],
    ["in the room.", "회의실에서."], ["with great care.", "매우 정성스럽게."]
  ];
  a2_3_s.forEach(([s, sk]) => {
    a2_3_v.forEach(([v, vk]) => {
      a2_3_c.forEach(([c, ck]) => {
        add("A2", [s, v, c], `${sk} ${ck} ${vk}`);
      });
    });
  });

  const a2_4_s1 = [
    ["If weather permits,", "날씨가 좋으면,"], ["Before you leave,", "퇴근하기 전에,"],
    ["When clients visit,", "고객이 방문할 때,"], ["After morning tasks,", "아침 업무 후에,"], ["If you ask,", "요청하신다면,"]
  ];
  const a2_4_s2 = [["we can enjoy", "우리는 즐길 수 있습니다"], ["staff will assist", "직원이 도울 것입니다"]];
  const a2_4_s3 = [
    ["a friendly lunch", "다정한 점심을"], ["helpful basic guidance", "유용한 기본 안내를"],
    ["a brief meeting", "짧은 미팅을"], ["a warm welcome", "따뜻한 환영을"], ["quick service support", "신속한 지원 서비스를"]
  ];
  const a2_4_s4 = [["outside the park.", "공원 밖에서."], ["without any wait.", "기다림 없이."]];
  a2_4_s1.forEach(([s1, k1]) => {
    a2_4_s2.forEach(([s2, k2]) => {
      a2_4_s3.forEach(([s3, k3]) => {
        a2_4_s4.forEach(([s4, k4]) => {
          add("A2", [s1, s2, s3, s4], `${k1} ${k4} ${k3} ${k2}`);
        });
      });
    });
  });

  // --- B1 (2청크: 100개, 3청크: 100개, 4청크: 100개) ---
  const b1_subjects = [
    ["Customer satisfaction remains", "고객 만족은 언제나"], ["Service response quality", "서비스 응대 품질은"],
    ["Direct client feedback", "직접적인 고객 피드백은"], ["Resolving user inquiries", "사용자 문의 해결은"],
    ["Building firm trust", "확고한 신뢰 구축은"], ["Please review carefully", "주의 깊게 검토해 주세요"],
    ["We finally approved", "우리는 마침내 승인했습니다"], ["The engineering team", "엔지니어링 팀은"],
    ["We must streamline", "우리는 간소화해야 합니다"], ["Effective communication plays", "효과적인 소통은"]
  ];
  const b1_complements = [
    ["our operational priority.", "우리의 최우선 과제입니다."], ["essential for success.", "성공을 위해 필수적입니다."],
    ["critical for retention.", "고객 유지에 대단히 중요합니다."], ["vital for collaboration.", "협업을 위해 매우 중요합니다."],
    ["key for growth.", "성장을 위한 핵심입니다."], ["the attached proposal.", "첨부된 제안서를."],
    ["the project budget.", "프로젝트 예산을."], ["the server issue.", "서버 문제를 해결했습니다."],
    ["the work process.", "업무 프로세스를."], ["a truly vital role.", "대단히 중대한 역할을 합니다."]
  ];
  b1_subjects.forEach(([s, sk]) => {
    b1_complements.forEach(([c, ck]) => {
      add("B1", [s, c], `${sk} ${ck}`);
    });
  });

  const b1_3_s = [
    ["Effective communication", "효과적인 의사소통은"], ["Flexible work setups", "유연 근무 환경은"],
    ["Automating daily tasks", "일일 업무 자동화는"], ["Staff training programs", "직원 교육 프로그램은"], ["Streamlined approval steps", "간소화된 결재 단계는"]
  ];
  const b1_3_v = [
    ["plays key roles", "핵심적인 역할을 합니다"], ["contributes quite significantly", "상당한 기여를 합니다"],
    ["gives more freedom", "더 많은 여유를 줍니다"], ["brings lasting benefits", "오랜 혜택을 가져옵니다"], ["reduces administrative delays", "행정적 지연을 줄여줍니다"]
  ];
  const b1_3_c = [
    ["in project collaboration.", "프로젝트 협업에서."], ["to workplace satisfaction.", "직장 만족도 향상에."],
    ["for creative design.", "창의적인 기획 업무를 위해."], ["across our company.", "우리 회사 전반에 걸쳐."]
  ];
  b1_3_s.forEach(([s, sk]) => {
    b1_3_v.forEach(([v, vk]) => {
      b1_3_c.forEach(([c, ck]) => {
        add("B1", [s, v, c], `${sk} ${ck} ${vk}`);
      });
    });
  });

  const b1_4_s1 = [
    ["By adopting tools,", "도구를 도입함으로써,"], ["Despite market challenges,", "시장 난관에도 불구하고,"],
    ["To improve quality,", "품질을 향상하기 위해,"], ["When auditing accounts,", "회계를 감사할 때,"], ["After conducting interviews,", "인터뷰를 진행한 후,"]
  ];
  const b1_4_s2 = [["our project team", "우리 프로젝트 팀은"], ["every regional branch", "모든 지역 지사는"]];
  const b1_4_s3 = [
    ["shares critical documents", "중요 서류들을 공유합니다"], ["achieves revenue growth", "매출 성장을 달성합니다"],
    ["gathers direct feedback", "직접적인 피드백을 수집합니다"], ["implements process improvements", "프로세스 개선을 실행합니다"], ["resolves system errors", "시스템 오류를 해결합니다"]
  ];
  const b1_4_s4 = [["in real time.", "실시간으로."], ["without technical delays.", "기술적 지연 없이."]];
  b1_4_s1.forEach(([s1, k1]) => {
    b1_4_s2.forEach(([s2, k2]) => {
      b1_4_s3.forEach(([s3, k3]) => {
        b1_4_s4.forEach(([s4, k4]) => {
          add("B1", [s1, s2, s3, s4], `${k1} ${k2} ${k4} ${k3}`);
        });
      });
    });
  });

  // --- B2 (2청크: 100개, 3청크: 100개, 4청크: 100개) ---
  const b2_subjects = [
    ["We successfully negotiated", "우리는 성공적으로 협상했습니다"], ["Continuous professional learning", "지속적인 전문 학습은"],
    ["Quarterly operating revenue", "분기별 영업 수익은"], ["Implementing agile frameworks", "애자일 프레임워크 도입은"],
    ["Allocating capital resources", "자본 자원을 배분하는 것은"], ["Strengthening supply chains", "공급망을 강화하는 것은"],
    ["Market volatility demands", "시장의 변동성은 요구합니다"], ["The leadership team", "경영진 리더십 팀은"],
    ["Competitor benchmark analysis", "경쟁사 벤치마킹 분석은"], ["Disciplined financial budgeting", "절제된 재무 예산 편성은"]
  ];
  const b2_complements = [
    ["international contract terms.", "국제 계약 조건들을."], ["essential for advancement.", "성장을 위해 필수적입니다."],
    ["exceeded market forecasts.", "시장 전망치를 초과했습니다."], ["streamlined engineering cycles.", "개발 주기를 간소화했습니다."],
    ["boosts strategic initiatives.", "전략적 이니셔티브를 촉진합니다."], ["mitigates logistics bottlenecks.", "물류 병목 현상을 완화합니다."],
    ["decisive organizational actions.", "결단력 있는 조직적 조치를."], ["emphasized strict compliance.", "엄격한 준법을 강조했습니다."],
    ["reveals untapped opportunities.", "미개척 기회를 발굴합니다."], ["secures organizational viability.", "조직의 생존력을 확보합니다."]
  ];
  b2_subjects.forEach(([s, sk]) => {
    b2_complements.forEach(([c, ck]) => {
      add("B2", [s, c], `${sk} ${ck}`);
    });
  });

  const b2_3_s = [
    ["Our executive committee", "우리 경영위원회는"], ["The senior strategy", "수석 전략팀은"],
    ["Every regional director", "모든 지역 본부장은"], ["The marketing division", "마케팅 부문은"], ["Our innovation group", "우리 혁신 그룹은"]
  ];
  const b2_3_v = [
    ["evaluates market performance", "시장 성과를 평가합니다"], ["implements agile principles", "애자일 원칙을 실행합니다"],
    ["conducts competitor analysis", "경쟁사 분석을 수행합니다"], ["streamlines operational workflows", "운영 워크플로우를 간소화합니다"], ["allocates available capital", "가용 자본을 배분합니다"]
  ];
  const b2_3_c = [
    ["to maintain advantages.", "우위를 유지하기 위해."], ["amid changing conditions.", "변화하는 환경 속에서."],
    ["during the summit.", "서밋 회의 동안에."], ["with department heads.", "부서장들과 함께."]
  ];
  b2_3_s.forEach(([s, sk]) => {
    b2_3_v.forEach(([v, vk]) => {
      b2_3_c.forEach(([c, ck]) => {
        add("B2", [s, v, c], `${sk} ${ck} ${vk}`);
      });
    });
  });

  const b2_4_s1 = [
    ["Continuous professional learning", "지속적인 전문 역량 학습은"], ["The global team", "글로벌 비즈니스 팀은"],
    ["Integrating customer feedback", "고객 피드백의 직접 통합은"], ["To protect advantages,", "경쟁적 우위를 보호하기 위해,"], ["Strengthening supply networks", "공급 네트워크의 강화는"]
  ];
  const b2_4_s2 = [["is highly essential", "대단히 필수적입니다"], ["across global units", "글로벌 부서 전반에 걸쳐"]];
  const b2_4_s3 = [
    ["in demanding environments", "까다로운 환경 속에서"], ["by expanding operations", "운영을 확장함으로써"],
    ["into emerging markets", "신흥 시장 속으로"], ["to foster collaboration", "협업을 적극 조성하기 위해"], ["which enhances productivity", "생산성을 직접 향상시키는"]
  ];
  const b2_4_s4 = [["during this year.", "올해 동안."], ["without compromising standards.", "표준을 훼손하지 않고."]];
  b2_4_s1.forEach(([s1, k1]) => {
    b2_4_s2.forEach(([s2, k2]) => {
      b2_4_s3.forEach(([s3, k3]) => {
        b2_4_s4.forEach(([s4, k4]) => {
          add("B2", [s1, s2, s3, s4], `${k1} ${k2} ${k3} ${k4}`);
        });
      });
    });
  });

  // --- C1 (2청크: 100개, 3청크: 100개, 4청크: 100개) ---
  const c1_subjects = [
    ["The board reached", "이사회는 도달했습니다"], ["Meticulous regulatory scrutiny", "철저한 규제 정밀 검토는"],
    ["Macroeconomic resilience hinges", "거시 경제적 회복력은 달려 있습니다"], ["Transparent corporate governance", "투명한 기업 지배구조는"],
    ["Fiscal consolidation measures", "재정 건전화 조치는"], ["Cultivating organizational synergy", "조직 시너지를 육성하는 것은"],
    ["Challenging orthodox assumptions", "기존 통념에 도전하는 것은"], ["Fostering institutional agility", "기관의 기민성을 함양하는 것은"],
    ["Pioneering artificial intelligence", "선구적인 인공지능 기술은"], ["Comprehensive portfolio diversification", "포괄적인 포트폴리오 다각화는"]
  ];
  const c1_complements = [
    ["a unanimous policy consensus.", "만장일치의 정책 합의에."], ["preempts operational bottlenecks.", "운영상의 병목 현상을 선제 방지합니다."],
    ["upon agile monetary policies.", "기민한 통화 정책에."], ["fosters institutional investor confidence.", "기관 투자자의 신뢰를 촉진합니다."],
    ["demand rigorous expenditure oversight.", "엄격한 지출 감독을 요구합니다."], ["requires transparent executive dialogue.", "투명한 경영진 대화를 요구합니다."],
    ["enables unprecedented technological innovation.", "전례 없는 기술 혁신을 가능하게 합니다."], ["preempts volatile market disruptions.", "변동성 큰 시장 붕괴를 선제 방어합니다."],
    ["dismantles legacy business paradigms.", "기존 비즈니스 패러다임을 해체합니다."], ["hedges systemic macroeconomic volatility.", "구조적 거시 경제 변동성을 방어합니다."]
  ];
  c1_subjects.forEach(([s, sk]) => {
    c1_complements.forEach(([c, ck]) => {
      add("C1", [s, c], `${sk} ${ck}`);
    });
  });

  const c1_3_s = [
    ["Sustainable macroeconomic resilience", "지속 가능한 거시경제 회복력은"], ["Meticulous regulatory compliance", "철저한 규제 준법 체계는"],
    ["Strategic portfolio diversification", "전략적인 포트폴리오 다각화는"], ["Cultivating institutional synergy", "조직 시너지를 육성하는 것은"], ["Navigating regulatory ambiguities", "규제 모호성을 헤쳐나가는 것은"]
  ];
  const c1_3_v = [
    ["hinges on policy adjustments", "정책 조정에 달려 있습니다"], ["safeguards proprietary corporate assets", "독점적 기업 자산을 보호합니다"],
    ["hedges against volatile fluctuations", "변동성을 효과적으로 방어합니다"], ["requires dismantling entrenched silos", "고착화된 부서 장벽 해체를 요구합니다"], ["demands proactive international engagement", "선제적인 국제 참여를 요구합니다"]
  ];
  const c1_3_c = [
    ["amid unprecedented geopolitical shifts.", "전례 없는 지정학적 격변 속에서."], ["prior to concluding mergers.", "합병 계약을 체결하기 전에."],
    ["to ensure organizational viability.", "조직 생존력을 보장하기 위해."], ["across distributed global subsidiaries.", "분산된 글로벌 자회사 전반에 걸쳐."]
  ];
  c1_3_s.forEach(([s, sk]) => {
    c1_3_v.forEach(([v, vk]) => {
      c1_3_c.forEach(([c, ck]) => {
        add("C1", [s, v, c], `${sk} ${ck} ${vk}`);
      });
    });
  });

  const c1_4_s1 = [
    ["Navigating cross border ambiguities", "국경 간 규제 모호성 해결은,"], ["Fostering institutional agility", "기관의 기민성을 육성하는 것은,"],
    ["Leveraging predictive algorithms", "예측 알고리즘을 활용하는 것은,"], ["Synthesizing macroeconomic indicators", "거시 경제 지표를 종합하는 것은,"], ["To preempt financial failures,", "금융 실패를 선제 방어하기 위해,"]
  ];
  const c1_4_s2 = [["demands decisive executive leadership", "결단력 있는 리더십을 요구하며"], ["enables resilient multinational enterprises", "다국적 기업들로 하여금"]];
  const c1_4_s3 = [
    ["to challenge orthodox assumptions", "고착화된 통념에 도전하고,"], ["and implement compliance protocols", "준법 프로토콜을 시행하도록,"],
    ["to anticipate structural shifts", "구조적 변화를 예측하고,"], ["and optimize capital allocation", "자본 배분을 최적화하도록,"], ["while preserving institutional credibility", "기관 신뢰도를 보존하면서,"]
  ];
  const c1_4_s4 = [["across global capital markets.", "글로벌 자본 시장 전반에 걸쳐."], ["without compromising operational integrity.", "운영의 진실성을 훼손하지 않고."]];
  c1_4_s1.forEach(([s1, k1]) => {
    c1_4_s2.forEach(([s2, k2]) => {
      c1_4_s3.forEach(([s3, k3]) => {
        c1_4_s4.forEach(([s4, k4]) => {
          add("C1", [s1, s2, s3, s4], `${k1} ${k2} ${k3} ${k4}`);
        });
      });
    });
  });

  return db;
};

const CHUNK_DATABASE = buildSentenceDatabase();

// 모바일 브라우저별 최적 코덱 감지 (iOS Safari: mp4/aac, Android/PC: webm)
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
      return { isPerfect: true, message: `🎉 완벽합니다! (${level} 레벨: 관사나 사소한 차이는 유연하게 통과되었습니다.)` };
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
      return { isPerfect: true, message: "🎉 훌륭합니다! (A2 초급: 핵심 표현이 정확하여 통과되었습니다.)" };
    }
  }

  if (level === 'B1') {
    if (missingWords.length === 0 && substituted.length === 0 && extraWords.length <= 1) {
      return { isPerfect: true, message: "🎉 잘하셨습니다! (B1 중급: 핵심 의미가 잘 전달되었습니다.)" };
    }
  }

  const strictNotice = (level === 'C1' || level === 'B2') ? ` (${level} 모드: 엄격 채점)` : '';

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
                <p className="text-[11px] sm:text-xs text-slate-400">2~4단어 리듬 섀도잉 (1,200문장 탑재)</p>
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
              <Timer className="w-3.5 h-3.5 text-amber-400" />
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
                              <ArrowRight className="w-3.5 h-3.5" />
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
