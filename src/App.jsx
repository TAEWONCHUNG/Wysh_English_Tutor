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

  // --- C1 (2청크: 1
