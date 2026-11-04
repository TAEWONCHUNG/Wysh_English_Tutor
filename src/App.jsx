import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX,
  Mic, 
  MicOff, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  Layers,
  HelpCircle,
  Play,
  Square,
  Volume1,
  Bell,
  Wand2,
  RefreshCw,
  Gauge,
  Timer
} from 'lucide-react';

// 난이도(CEFR 레벨) 정의
const DIFFICULTY_LEVELS = [
  { id: 'A2', label: 'A2 초급', desc: '기초 일상 회화' },
  { id: 'B1', label: 'B1 중급', desc: '실용 직장·여행' },
  { id: 'B2', label: 'B2 중상급', desc: '비즈니스·토론' },
  { id: 'C1', label: 'C1 고급', desc: '전문가·시사 심화' }
];

// 체계적인 의미 덩어리(Chunk)별 및 레벨별 비즈니스 & 실용 영어 기본 데이터베이스 (오프라인/즉각 대체용)
const CHUNK_DATABASE = {
  A2: {
    2: [
      {
        text: "I usually drink coffee before starting my workday.",
        chunks: ["I usually drink coffee", "before starting my workday."],
        translation: "저는 보통 일과를 시작하기 전에 커피를 마십니다."
      },
      {
        text: "Please send me an email when you arrive.",
        chunks: ["Please send me an email", "when you arrive."],
        translation: "도착하시면 저에게 이메일을 보내주세요."
      }
    ],
    3: [
      {
        text: "We have a team meeting every Monday morning at nine.",
        chunks: ["We have a team meeting", "every Monday morning", "at nine o'clock."],
        translation: "우리는 매주 월요일 아침 9시에 팀 회의를 합니다."
      }
    ],
    4: [
      {
        text: "If the weather is nice tomorrow we can have lunch outside in the park.",
        chunks: ["If the weather is nice", "tomorrow afternoon", "we can have lunch", "outside in the park."],
        translation: "내일 날씨가 좋으면 우리는 공원 밖에서 점심을 먹을 수 있습니다."
      }
    ]
  },
  B1: {
    2: [
      {
        text: "Please review the attached project proposal.",
        chunks: ["Please review", "the attached project proposal."],
        translation: "첨부된 프로젝트 제안서를 검토해 주시기 바랍니다."
      },
      {
        text: "Customer satisfaction remains our highest priority.",
        chunks: ["Customer satisfaction", "remains our highest priority."],
        translation: "고객 만족은 언제나 우리의 최우선 과제입니다."
      }
    ],
    3: [
      {
        text: "Effective communication plays a vital role in team collaboration.",
        chunks: ["Effective communication", "plays a vital role", "in team collaboration."],
        translation: "효과적인 소통은 팀 협업에서 매우 중요한 역할을 합니다."
      },
      {
        text: "Flexible work arrangements contributed significantly to employee satisfaction.",
        chunks: ["Flexible work arrangements", "contributed significantly", "to employee satisfaction."],
        translation: "유연 근무제는 직원 만족도 향상에 크게 기여했습니다."
      }
    ],
    4: [
      {
        text: "Automating routine repetitive tasks gives employees more freedom to focus on creative work.",
        chunks: ["Automating routine repetitive tasks", "gives employees more freedom", "to focus on", "creative work."],
        translation: "반복적인 일상 업무를 자동화하면 직원들이 창의적 업무에 집중할 수 있는 여유가 생깁니다."
      }
    ]
  },
  B2: {
    2: [
      {
        text: "We successfully negotiated the new contract terms.",
        chunks: ["We successfully negotiated", "the new contract terms."],
        translation: "우리는 새로운 계약 조건을 성공적으로 협상했습니다."
      },
      {
        text: "Continuous learning is essential for professional growth.",
        chunks: ["Continuous learning is essential", "for professional growth."],
        translation: "지속적인 배움은 전문적 성장을 위해 필수적입니다."
      },
      {
        text: "Our quarterly revenue exceeded all initial forecasts.",
        chunks: ["Our quarterly revenue", "exceeded all initial forecasts."],
        translation: "우리 분기 매출은 초기 모든 전망치를 초과 달성했습니다."
      }
    ],
    3: [
      {
        text: "Health and wellness are becoming top priorities for modern consumers.",
        chunks: ["Health and wellness", "are becoming top priorities", "for modern consumers."],
        translation: "건강과 웰빙은 현대 소비자들에게 최우선 순위가 되고 있습니다."
      },
      {
        text: "Financial literacy is crucial for long term financial stability.",
        chunks: ["Financial literacy is crucial", "for long term", "financial stability."],
        translation: "금융 문해력은 장기적인 재정 안정을 위해 결정적으로 중요합니다."
      },
      {
        text: "Data privacy regulations require strict adherence by all organizations.",
        chunks: ["Data privacy regulations", "require strict adherence", "by all organizations."],
        translation: "데이터 개인정보 규정은 모든 조직의 엄격한 준수를 요구합니다."
      }
    ],
    4: [
      {
        text: "Continuous learning is essential for professional growth in this rapidly changing industry.",
        chunks: ["Continuous learning", "is essential", "for professional growth", "in this rapidly changing industry."],
        translation: "이처럼 급변하는 산업 환경에서 지속적인 배움은 전문적 성장을 위해 필수적입니다."
      },
      {
        text: "The global marketing team plans to expand its operations across emerging markets next year.",
        chunks: ["The global marketing team", "plans to expand its operations", "across emerging markets", "next year."],
        translation: "글로벌 마케팅 팀은 내년에 신흥 시장 전반으로 사업 운영을 확장할 계획입니다."
      }
    ]
  },
  C1: {
    2: [
      {
        text: "The board reached a consensus regarding fiscal consolidation.",
        chunks: ["The board reached a consensus", "regarding fiscal consolidation."],
        translation: "이사회는 재정 건전화 방안에 관해 합의에 도달했습니다."
      },
      {
        text: "Meticulous scrutiny is indispensable to preempt operational bottlenecks.",
        chunks: ["Meticulous scrutiny is indispensable", "to preempt operational bottlenecks."],
        translation: "운영상의 병목 현상을 선제적으로 방지하기 위해 꼼꼼한 정밀 검토가 필수적입니다."
      }
    ],
    3: [
      {
        text: "Sustainable macroeconomic resilience hinges on agile policy adjustments amid volatile shifts.",
        chunks: ["Sustainable macroeconomic resilience", "hinges on agile policy adjustments", "amid volatile shifts."],
        translation: "지속 가능한 거시경제적 회복력은 변동성 큰 변화 속 기민한 정책 조정에 달려 있습니다."
      }
    ],
    4: [
      {
        text: "Navigating cross-border regulatory ambiguities demands proactive stakeholder engagement and rigorous compliance protocols.",
        chunks: ["Navigating cross-border ambiguities", "demands proactive stakeholder engagement", "and rigorous implementation", "of compliance protocols."],
        translation: "국경 간 규제 모호성을 헤쳐나가기 위해서는 선제적인 이해관계자 참여와 철저한 준법 프로토콜 시행이 요구됩니다."
      }
    ]
  }
};

// --- Gemini API를 이용한 실시간 맞춤 난이도 문장 무한 생성 엔진 ---
const generateSentenceWithAI = async (chunkCount, difficultyLevel = 'B2') => {
  const apiKey = ""; // Canvas 환경에서 자동 주입됨
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const levelDescriptions = {
    A2: "CEFR Level A2 (Elementary / Pre-intermediate practical English, simple everyday vocabulary, high-frequency words, clear and direct structures).",
    B1: "CEFR Level B1 (Intermediate practical English, workplace and daily interactions, clear standard language).",
    B2: "CEFR Level B2 (Upper-intermediate practical English, professional workplace discussions, natural idioms and collocations).",
    C1: "CEFR Level C1 (Advanced English, sophisticated business and analytical concepts, rich vocabulary and precise expressions)."
  };

  const levelInstruction = levelDescriptions[difficultyLevel] || levelDescriptions.B2;

  const prompt = `
Generate 1 unique, natural, and realistic English sentence for shadowing and dictation practice.
Requirements:
1. Difficulty: ${levelInstruction}
2. Chunks count: Exactly ${chunkCount} meaningful grammatical chunks (thought groups) that feel natural to speak and pause between.
   - For 2 chunks: [Subject + Verb phrase] + [Object/Complement/Prepositional phrase]
   - For 3 chunks: [Subject/Topic clause] + [Core action/verb phrase] + [Context/condition/modifier]
   - For 4 chunks: [Intro/Subject] + [Verb clause] + [Direct complement] + [Extended condition/outcome]
3. Tone: Modern, authentic, clear, appropriate to CEFR ${difficultyLevel}.
4. Provide a smooth and accurate Korean translation.
`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: {
      parts: [{ text: "You are an expert English language educator specializing in CEFR shadowing training. Output strictly structured JSON." }]
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          text: { type: "STRING" },
          chunks: {
            type: "ARRAY",
            items: { type: "STRING" }
          },
          translation: { type: "STRING" }
        },
        required: ["text", "chunks", "translation"],
        propertyOrdering: ["text", "chunks", "translation"]
      }
    }
  };

  // 지수 백오프 (Exponential Backoff) 적용
  let delay = 1000;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const result = await response.json();
        const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          if (parsed.text && Array.isArray(parsed.chunks) && parsed.chunks.length > 0) {
            return {
              text: parsed.text.trim(),
              chunks: parsed.chunks.map((c) => c.trim()),
              translation: parsed.translation || "한국어 번역이 제공됩니다.",
              isAiGenerated: true,
              level: difficultyLevel
            };
          }
        }
      }
    } catch (e) {
      // 오류 콘솔 출력 없이 재시도 대기
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= 2;
  }
  return null;
};

// 텍스트 정규화 유틸리티
const cleanText = (str) => {
  return (str || '')
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// --- Web Audio API 기반 즉각 효과음 생성기 (외부 파일 없이 100% 작동) ---
const playSoundEffect = (type) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'success') {
      // 산뜻하고 경쾌한 성공 메이저 아르페지오 (C5 -> E5 -> G5 -> C6)
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
      // 부담스럽지 않은 부드러운 2단 피드백 톤 (400Hz -> 310Hz)
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
  } catch (err) {
    console.debug('Web Audio SFX blocked or unsupported', err);
  }
};

// 로컬 즉각 분석기: AI 네트워크 지연이나 API 키가 없을 때도 정확한 피드백 제공
const generateLocalFeedback = (target, spoken) => {
  const normTarget = cleanText(target);
  const normSpoken = cleanText(spoken);

  if (normTarget === normSpoken) {
    return { isPerfect: true, message: "🎉 완벽합니다! (Spot on!) 토씨 하나 틀리지 않고 정확히 말씀하셨습니다." };
  }

  const targetWords = normTarget.split(' ').filter(Boolean);
  const spokenWords = normSpoken.split(' ').filter(Boolean);

  // 단어 치환 및 누락 파악
  const missingWords = [];
  const substituted = [];

  targetWords.forEach((word, idx) => {
    if (!spokenWords.includes(word)) {
      if (spokenWords[idx] && spokenWords[idx] !== word) {
        // [원문 정답 단어] 대신 [사용자가 발음한 오답 단어] 순서로 정확하게 안내
        substituted.push(`'${word}' 대신 '${spokenWords[idx]}'`);
      } else {
        missingWords.push(`'${word}'`);
      }
    }
  });

  if (substituted.length > 0) {
    return {
      isPerfect: false,
      message: `${substituted.slice(0, 2).join(', ')}을(를) 말씀하셨습니다. 원문 발음에 주의하여 다시 시도해 보세요!`
    };
  }

  if (missingWords.length > 0) {
    return {
      isPerfect: false,
      message: `${missingWords.slice(0, 2).join(', ')} 단어가 빠졌습니다. 문장 끝까지 정확히 발음해 보세요.`
    };
  }

  if (spokenWords.length > targetWords.length) {
    const extraWords = spokenWords.filter((w) => !targetWords.includes(w));
    if (extraWords.length > 0) {
      return {
        isPerfect: false,
        message: `원문에 없는 '${extraWords.slice(0, 2).join("', '")}' 단어가 들어갔습니다. 다시 시도해 보세요!`
      };
    }
    return {
      isPerfect: false,
      message: "원래 문장에 없는 단어가 추가되었거나 반복되었습니다. 다시 시도해 보세요!"
    };
  }

  return {
    isPerfect: false,
    message: "아주 근접했습니다! 조금 더 또렷한 억양으로 다시 한번 말해보세요."
  };
};

export default function EnglishTutorApp() {
  const [difficultyLevel, setDifficultyLevel] = useState('B2');
  const [chunkLevel, setChunkLevel] = useState(2);
  const [practiceRound, setPracticeRound] = useState(1);
  const [showHintText, setShowHintText] = useState(false);
  
  // 침묵 허용 대기 시간 (초) - 기본 4초로 넉넉하게 설정
  const [pauseWaitTime, setPauseWaitTime] = useState(4); 
  const [remainingSilence, setRemainingSilence] = useState(null);

  // 현재 문장 객체 및 AI 생성 상태 관리
  const [currentSentence, setCurrentSentence] = useState(() => {
    const list = CHUNK_DATABASE.B2[2];
    return { ...list[Math.floor(Math.random() * list.length)], isAiGenerated: false, level: 'B2' };
  });
  const [isGeneratingAiSentence, setIsGeneratingAiSentence] = useState(false);
  const prefetchedNextSentenceRef = useRef(null);
  const historyRef = useRef(new Set());

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

  // 녹음 상태 및 타이머 제어를 위한 최신 Ref
  const isRecordingRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const silenceIntervalRef = useRef(null);
  const accumulatedSpeechRef = useRef("");
  const pauseWaitTimeRef = useRef(pauseWaitTime);
  pauseWaitTimeRef.current = pauseWaitTime;

  const currentItem = currentSentence;

  // 다음 AI 문장 백그라운드 사전 생성 (대기 시간 제로화)
  const prefetchNextAiSentence = async (level = chunkLevel, difficulty = difficultyLevel) => {
    try {
      const generated = await generateSentenceWithAI(level, difficulty);
      if (generated && !historyRef.current.has(generated.text)) {
        prefetchedNextSentenceRef.current = generated;
      }
    } catch (e) {
      // Background prefetch error ignore
    }
  };

  // 컴포넌트 마운트 및 조건 전환 시 다음 AI 문장 사전 확보
  useEffect(() => {
    prefetchNextAiSentence(chunkLevel, difficultyLevel);
  }, [chunkLevel, difficultyLevel, currentSentence.text]);

  // 침묵 카운트다운 및 타이머 정리 유틸리티
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

  // 녹음 종료 및 평가 트리거
  const finishRecording = () => {
    clearSilenceTimers();
    isRecordingRef.current = false;
    setIsRecording(false);

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {
      // 이미 정지된 경우 무시
    }
    stopMediaRecorder();

    const finalSpoken = accumulatedSpeechRef.current.trim();
    if (finalSpoken) {
      setUserSpeech(finalSpoken);
      evaluateSpeech(finalSpoken, currentSentence.text);
    } else {
      setErrorMsg("음성이 감지되지 않았습니다. 버튼을 누른 후 다시 말씀해 보세요.");
    }
  };

  // 음성 인식(STT) 초기화 - 연속 모드 및 실시간 청취 적용
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      // 연속 수신 모드로 변경하여 단어 사이의 침묵으로 끊기지 않도록 설정
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
          if (res.isFinal) {
            finalTranscripts += res[0].transcript + " ";
          } else {
            interimTranscripts += res[0].transcript;
          }
        }

        const combinedText = (finalTranscripts + interimTranscripts).trim();
        accumulatedSpeechRef.current = combinedText;
        setUserSpeech(combinedText);

        // 사용자가 말을 한 순간 침묵 타이머를 리셋하고 다시 대기
        clearSilenceTimers();

        // 수동 종료 모드(-1)가 아닌 경우 침묵 대기 타이머 가동
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
        // 브라우저가 임의로 연결을 끊었으나 사용자가 여전히 녹음 중인 상태라면 재시작
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch (e) {
            // 재시작 에러 방지
          }
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
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopMediaRecorder();
    };
  }, [currentSentence.text]);

  // 정답(PERFECT) 달성 시 2.5초 후 자동으로 다음 랜덤 문장으로 넘어가기
  useEffect(() => {
    let timer;
    if (isPerfect) {
      timer = setTimeout(() => {
        handleNextSentence();
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [isPerfect]);

  // TTS (원어민 발음 듣기)
  const playTargetAudio = () => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentItem.text);
    utterance.lang = 'en-US';
    utterance.rate = speechSpeed;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // 사용자가 말한 내용 다시 들려주기 (1: 내 실제 목소리 녹음 재생)
  const playMyVoiceAudio = () => {
    if (!recordedAudioUrl) return;
    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    userAudioPlayerRef.current = audio;
    setIsPlayingMyVoice(true);
    audio.onended = () => setIsPlayingMyVoice(false);
    audio.onerror = () => setIsPlayingMyVoice(false);
    audio.play().catch(() => setIsPlayingMyVoice(false));
  };

  // 사용자가 말한 내용 다시 들려주기 (2: 인식된 텍스트를 TTS로 들려주기)
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

  // 실제 마이크 녹음 시작 (MediaRecorder)
  const startMediaRecorder = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setRecordedAudioUrl(audioUrl);
          }
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
      }
    } catch (e) {
      console.warn("MediaRecorder start failed:", e);
    }
  };

  // 실제 마이크 녹음 종료
  const stopMediaRecorder = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {
      console.warn("MediaRecorder stop failed:", e);
    }
  };

  // 녹음 시작/중지 토글
  const toggleRecording = () => {
    if (isRecording) {
      // 사용자가 직접 누르면 침묵 시간을 기다리지 않고 즉시 분석 완료
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
      } catch (e) {
        console.warn("Recognition start failed or already active", e);
      }
    }
  };

  // AI 및 정밀 평가 로직
  const evaluateSpeech = async (spokenText, targetText) => {
    setIsEvaluating(true);
    setEvaluation(null);
    setIsPerfect(false);

    const normSpoken = cleanText(spokenText);
    const normTarget = cleanText(targetText);

    // 완전 일치 시 즉시 합격 처리 및 정답 효과음 재생
    if (normSpoken === normTarget) {
      setIsPerfect(true);
      setEvaluation("🎉 완벽합니다! (Spot on!) 토씨 하나 틀리지 않고 정확히 말씀하셨습니다.");
      setIsEvaluating(false);
      if (soundEffectsEnabled) playSoundEffect('success');
      return;
    }

    // Gemini API 호출 시도 (API 키가 주입되어 있을 경우 초정밀 뉘앙스 평가)
    const prompt = `
      You are an attentive, strict English tutor conducting shadowing training.
      Expected sentence: "${targetText}"
      User's spoken output: "${spokenText}"

      If the user matched the sentence exactly (ignoring casing & punctuation), reply with strictly only: PERFECT
      Otherwise, point out the exact replacement, missing word, or extra word in a concise, friendly Korean sentence.
      CRITICAL INSTRUCTION FOR REPLACED WORDS:
      Make sure to follow this exact order: "'[원문 정답 단어]' 대신 '[사용자가 말한 오답 단어]'을(를) 발음하셨습니다."
      Example: If the target has 'buys' but the user said 'buy', you must say: "'buys' 대신 'buy'을(를) 발음하셨습니다. 다시 시도해보세요." (NEVER say "'buy' 대신 'buys'").
    `;

    try {
      const apiKey = ""; // Cloud 환경 자동 주입 지원
      if (apiKey) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        if (res.ok) {
          const data = await res.json();
          const feedback = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
          if (feedback.toUpperCase().includes("PERFECT")) {
            setIsPerfect(true);
            setEvaluation("🎉 완벽합니다! (Spot on!) 잠시 후 다음 문장으로 이동합니다.");
            setIsEvaluating(false);
            if (soundEffectsEnabled) playSoundEffect('success');
            return;
          } else {
            setIsPerfect(false);
            setEvaluation(feedback);
            setIsEvaluating(false);
            if (soundEffectsEnabled) playSoundEffect('retry');
            return;
          }
        }
      }
      
      // API Key가 없거나 네트워크 오류 시 로컬 고성능 언어 평가 엔진으로 대체
      const localResult = generateLocalFeedback(targetText, spokenText);
      setIsPerfect(localResult.isPerfect);
      setEvaluation(localResult.message);
      if (soundEffectsEnabled) {
        playSoundEffect(localResult.isPerfect ? 'success' : 'retry');
      }
    } catch (err) {
      const localResult = generateLocalFeedback(targetText, spokenText);
      setIsPerfect(localResult.isPerfect);
      setEvaluation(localResult.message);
      if (soundEffectsEnabled) {
        playSoundEffect(localResult.isPerfect ? 'success' : 'retry');
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  // 다음 문장 로딩 (AI 실시간 생성 우선 -> 사전 생성 캐시 -> 로컬 풀 순)
  const handleNextSentence = async (targetLevel = chunkLevel, targetDiff = difficultyLevel) => {
    setUserSpeech("");
    setRecordedAudioUrl(null);
    setEvaluation(null);
    setIsPerfect(false);
    setShowHintText(false);

    // 1. 이미 사전 준비된 AI 문장이 있고 동일한 레벨인 경우 즉시 사용
    if (prefetchedNextSentenceRef.current && prefetchedNextSentenceRef.current.level === targetDiff) {
      const nextOne = prefetchedNextSentenceRef.current;
      prefetchedNextSentenceRef.current = null;
      historyRef.current.add(nextOne.text);
      setCurrentSentence(nextOne);
      setPracticeRound((prev) => prev + 1);
      prefetchNextAiSentence(targetLevel, targetDiff);
      return;
    }

    // 2. 대기 캐시가 없을 시 실시간 AI 생성 요청
    setIsGeneratingAiSentence(true);
    try {
      const generated = await generateSentenceWithAI(targetLevel, targetDiff);
      if (generated && !historyRef.current.has(generated.text)) {
        historyRef.current.add(generated.text);
        setCurrentSentence(generated);
        setPracticeRound((prev) => prev + 1);
        setIsGeneratingAiSentence(false);
        prefetchNextAiSentence(targetLevel, targetDiff);
        return;
      }
    } catch (err) {
      console.warn("AI generation fallback to DB", err);
    } finally {
      setIsGeneratingAiSentence(false);
    }

    // 3. 네트워크 오류/지연 시 고품질 로컬 풀에서 중복 없이 선택
    const diffGroup = CHUNK_DATABASE[targetDiff] || CHUNK_DATABASE.B2;
    const localList = diffGroup[targetLevel] || diffGroup[2] || CHUNK_DATABASE.B2[2];
    const available = localList.filter((item) => !historyRef.current.has(item.text));
    const pickList = available.length > 0 ? available : localList;
    const picked = pickList[Math.floor(Math.random() * pickList.length)];
    historyRef.current.add(picked.text);
    setCurrentSentence({ ...picked, isAiGenerated: false, level: targetDiff });
    setPracticeRound((prev) => prev + 1);
    prefetchNextAiSentence(targetLevel, targetDiff);
  };

  // 청크 난이도 변경 핸들러
  const handleSelectChunkLevel = (level) => {
    if (level === chunkLevel) return;
    setChunkLevel(level);
    prefetchedNextSentenceRef.current = null;
    handleNextSentence(level, difficultyLevel);
  };

  // 문장 난이도(CEFR) 변경 핸들러
  const handleSelectDifficulty = (diffId) => {
    if (diffId === difficultyLevel) return;
    setDifficultyLevel(diffId);
    prefetchedNextSentenceRef.current = null;
    handleNextSentence(chunkLevel, diffId);
  };

  if (!speechSupported) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md text-center shadow-2xl">
          <AlertCircle className="w-14 h-14 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">음성 인식 미지원 브라우저</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            현재 브라우저에서는 음성 인식(STT) 기능을 지원하지 않습니다. Chrome, Edge, Safari 최신 버전을 이용해 주세요.
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
                <h1 className="font-bold text-lg text-white tracking-wide">TAEWON Shadowing Lab</h1>
                <p className="text-xs text-slate-400">의미 덩어리(청크) 단위 보이스 섀도잉</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* 효과음 토글 버튼 */}
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
                disabled={isGeneratingAiSentence}
                title="새로운 문장 가져오기"
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all active:scale-95 disabled:opacity-50"
              >
                {isGeneratingAiSentence ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5" />
                )}
                <span>새 문장</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 문장 난이도 (CEFR 레벨) 선택 버튼 그룹 */}
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

          {/* 청크(의미 덩어리 개수) 선택 탭 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                문장 길이 설정 (Chunk 수)
              </label>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>속도:</span>
                <button
                  onClick={() => setSpeechSpeed(s => s === 0.85 ? 0.7 : 0.85)}
                  className={`px-2 py-0.5 rounded border transition-colors ${speechSpeed === 0.7 ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
                >
                  {speechSpeed === 0.7 ? '0.7x (느리게)' : '0.85x (표준)'}
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

          {/* 초보자 배려: 침묵 대기 시간 조절 옵션 */}
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

        {/* 메인 섀도잉 영역 (보이스 중심) */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">

          {/* 청크 리듬 시각 가이드 (텍스트는 숨기되 호흡 단위 안내) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="flex items-center justify-between w-full max-w-md mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  CEFR {difficultyLevel}
                </span>
                {currentItem.isAiGenerated && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-in fade-in">
                    ✨ AI 생성 문장
                  </span>
                )}
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>Voice-Only Mode</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
            </div>

            {/* 청크 블록 비주얼라이저 */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 my-3 w-full max-w-md">
              {currentItem.chunks.map((chunk, idx) => (
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

            {/* 힌트 토글 버튼 */}
            <button
              onClick={() => setShowHintText(prev => !prev)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
            >
              {showHintText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showHintText ? '문장 숨기기' : '정 안 들릴 때 문장 엿보기'}</span>
            </button>

            {/* 힌트 공개 시 보여줄 문장 및 해석 */}
            {showHintText && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-700/60 text-left w-full animate-in fade-in zoom-in-95 duration-200">
                <p className="text-sm font-semibold text-indigo-300 mb-1">{currentItem.text}</p>
                <p className="text-xs text-slate-400">{currentItem.translation}</p>
              </div>
            )}
          </div>

          {/* 청취 & 녹음 실행 버튼 */}
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
                  {isRecording ? "말씀 끝남 (탭하여 즉시 완료)" : "따라 말하기 (Tap to Speak)"}
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

          {/* 피드백 및 결과 디스플레이: 내가 말한 내용 표시 + 스피커 다시 듣기 */}
          {(userSpeech || isEvaluating || evaluation) && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* 내가 말한 내용 카드 & 스피커 재생 컨트롤러 */}
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-indigo-400" />
                    내가 말한 내용 (My Spoken Speech)
                  </span>
                  
                  {/* 스피커 재생 버튼 그룹 */}
                  {userSpeech && (
                    <div className="flex items-center gap-2">
                      {/* 내 실제 녹음 목소리 재생 */}
                      {recordedAudioUrl && (
                        <button
                          onClick={playMyVoiceAudio}
                          disabled={isPlayingMyVoice}
                          title="내가 직접 말한 실제 녹음 목소리 듣기"
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

                      {/* 인식된 문장 TTS 재생 */}
                      <button
                        onClick={playUserSpeechTts}
                        disabled={isPlayingUserTts}
                        title="인식된 텍스트를 원어민 발음으로 다시 듣기"
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

              {/* 튜터 피드백 및 결과 상태 */}
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

        {/* 푸터 가이드 */}
        <div className="bg-slate-900 border-t border-slate-800/80 px-6 py-4 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
            <span>💡 팁: 원하는 난이도(A2~C1)와 청크 수를 버튼으로 조합하면 Gemini AI가 맞춤형 영어 문장을 무한히 생성합니다.</span>
          </p>
        </div>

      </div>
    </div>
  );
}
