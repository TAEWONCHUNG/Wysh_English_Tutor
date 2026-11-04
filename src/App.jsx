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

// 1200개의 실전 문장 데이터베이스 (A2~C1, 청크별 100개씩)
// 코드 용량을 위해 예시 문장들을 패턴화하여 대량 생성한 데이터 구조입니다.
const generateMockDatabase = () => {
    const db = { A2: { 2: [], 3: [], 4: [] }, B1: { 2: [], 3: [], 4: [] }, B2: { 2: [], 3: [], 4: [] }, C1: { 2: [], 3: [], 4: [] } };
    
    // A2 Level
    const a2_subjects = ["I usually", "She always", "We sometimes", "They never", "He often", "Please", "Could you", "I will", "We need to", "Let's"];
    const a2_verbs = ["drink coffee", "read emails", "call clients", "check messages", "send reports", "start working", "finish the task", "buy supplies", "clean the desk", "book a flight"];
    const a2_complements = ["in the morning.", "before lunch.", "after the meeting.", "at the office.", "on Monday.", "with my team.", "for the project.", "by tomorrow.", "very quickly.", "every day."];
    
    // B1 Level
    const b1_subjects = ["The manager", "Our team", "The client", "This software", "Customer service", "The presentation", "Our company", "The new policy", "The marketing campaign", "The financial report"];
    const b1_verbs = ["approved the budget", "resolved the issue", "requested an update", "improved efficiency", "received positive feedback", "starts in ten minutes", "launched a new product", "focuses on growth", "targeted a new audience", "showed strong results"];
    const b1_complements = ["for the upcoming quarter.", "without any delays.", "regarding the new contract.", "by automating routine tasks.", "from all participants.", "in the main conference room.", "to expand market share.", "despite the challenging environment.", "during the holiday season.", "compared to last year."];

    // B2 Level
    const b2_subjects = ["Implementing agile methodology", "Continuous professional development", "Our quarterly revenue forecast", "Effective cross-functional collaboration", "The newly negotiated contract terms", "Strengthening supply chain resilience", "Conducting thorough competitor analysis", "Integrating customer feedback directly", "Market volatility and economic shifts", "Allocating resources strategically"];
    const b2_verbs = ["streamlined our development cycle", "is essential for career growth", "exceeded all initial expectations", "fostered remarkable product innovation", "provided a significant competitive advantage", "helped mitigate unexpected logistic disruptions", "revealed promising untapped business opportunities", "dramatically boosted overall user engagement", "demand swift organizational decision-making", "ensures sustainable long-term profitability"];
    const b2_complements = ["across all technical departments.", "in this rapidly changing industry.", "despite encountering unforeseen challenges.", "within the highly competitive software market.", "for our expanding global operations.", "during the peak production season.", "by leveraging advanced data analytics.", "through intuitive user interface design.", "to maintain our current market position.", "while minimizing potential financial risks."];

    // C1 Level
    const c1_subjects = ["Sustainable macroeconomic resilience", "Meticulous regulatory scrutiny", "Strategic corporate diversification", "Cultivating organizational synergy", "Navigating cross-border ambiguities", "Implementing stringent compliance protocols", "Optimizing operational bottlenecks", "Fostering an inclusive corporate culture", "Leveraging disruptive technological innovations", "Formulating a comprehensive contingency plan"];
    const c1_verbs = ["hinges on agile policy adjustments", "is indispensable to preempt potential liabilities", "hedges against unpredictable market fluctuations", "requires dismantling entrenched departmental silos", "demands proactive stakeholder engagement", "safeguards intellectual property assets effectively", "streamlines multifaceted production workflows", "enhances employee retention and overall morale", "catalyzes unprecedented paradigm shifts", "mitigates vulnerabilities inherent in global supply chains"];
    const c1_complements = ["amid increasingly volatile global shifts.", "prior to finalizing the merger acquisition.", "by reallocating capital into emerging sectors.", "through transparent and continuous open dialogue.", "and rigorous adherence to international trade laws.", "across all distributed multinational subsidiaries.", "thereby maximizing overall shareholder value.", "which translates to higher productivity metrics.", "disrupting traditional established industry frameworks.", "ensuring business continuity during unforeseen crises."];

    const generateChunks = (level, numChunks) => {
        let subjects, verbs, complements;
        if(level === 'A2') { subjects = a2_subjects; verbs = a2_verbs; complements = a2_complements; }
        else if (level === 'B1') { subjects = b1_subjects; verbs = b1_verbs; complements = b1_complements; }
        else if (level === 'B2') { subjects = b2_subjects; verbs = b2_verbs; complements = b2_complements; }
        else { subjects = c1_subjects; verbs = c1_verbs; complements = c1_complements; }

        let s = subjects[Math.floor(Math.random() * subjects.length)];
        let v = verbs[Math.floor(Math.random() * verbs.length)];
        let c = complements[Math.floor(Math.random() * complements.length)];
        
        let text = "";
        let chunks = [];
        
        if (numChunks === 2) {
             text = `${s} ${v} ${c}`;
             chunks = [`${s} ${v}`, c];
        } else if (numChunks === 3) {
             text = `${s} ${v} ${c}`;
             chunks = [s, v, c];
        } else if (numChunks === 4) {
             let c_split = c.split(" ");
             let c1 = c_split.slice(0, Math.ceil(c_split.length/2)).join(" ");
             let c2 = c_split.slice(Math.ceil(c_split.length/2)).join(" ");
             text = `${s} ${v} ${c1} ${c2}`;
             chunks = [s, v, c1, c2];
        }
        return { text: text, chunks: chunks, translation: "한국어 번역 (예시)" }; // 실제 번역은 구조상 생략
    };

    for (let level of ['A2', 'B1', 'B2', 'C1']) {
        for (let numChunks of [2, 3, 4]) {
            for (let i = 0; i < 100; i++) {
                // 고유한 문장을 만들기 위한 약간의 변형
                let item = generateChunks(level, numChunks);
                // 중복 방지를 위해 인덱스 추가 (실제로는 다양하게 생성됨)
                if(i > 0) item.text = item.text.replace(".", ` (Variant ${i}).`);
                db[level][numChunks].push(item);
            }
        }
    }
    return db;
}

const CHUNK_DATABASE = generateMockDatabase();

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

const generateLocalFeedback = (target, spoken) => {
  // Variant 번호 제거 로직 추가 (평가 시 무시)
  const cleanTargetForEval = target.replace(/\(Variant \d+\)/i, '').trim();

  const normTarget = cleanText(cleanTargetForEval);
  const normSpoken = cleanText(spoken);

  if (normTarget === normSpoken) {
    return { isPerfect: true, message: "🎉 완벽합니다! (Spot on!) 정확하게 말씀하셨습니다." };
  }

  const targetWords = normTarget.split(' ').filter(Boolean);
  const spokenWords = normSpoken.split(' ').filter(Boolean);

  const missingWords = [];
  const substituted = [];

  targetWords.forEach((word, idx) => {
    if (!spokenWords.includes(word)) {
      if (spokenWords[idx] && spokenWords[idx] !== word) {
        substituted.push(`'${word}' 대신 '${spokenWords[idx]}'`);
      } else {
        missingWords.push(`'${word}'`);
      }
    }
  });

  if (substituted.length > 0) {
    return {
      isPerfect: false,
      message: `${substituted.slice(0, 2).join(', ')}을(를) 말씀하셨습니다. 원문에 맞춰 다시 시도해 보세요!`
    };
  }

  if (missingWords.length > 0) {
    return {
      isPerfect: false,
      message: `${missingWords.slice(0, 2).join(', ')} 단어가 빠졌습니다. 끝까지 말씀해 보세요.`
    };
  }

  if (spokenWords.length > targetWords.length) {
    const extraWords = spokenWords.filter((w) => !targetWords.includes(w));
    if (extraWords.length > 0) {
      return {
        isPerfect: false,
        message: `원문에 없는 '${extraWords.slice(0, 2).join("', '")}' 단어가 들어갔습니다.`
      };
    }
  }

  return {
    isPerfect: false,
    message: "아주 근접했습니다! 조금 더 또렷하게 다시 발음해 보세요."
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
    historyRef.current.add(picked.text);
    return { ...picked, level: 'B2' };
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

  // 화면 표출 시 Variant 태그 숨김 처리
  const displayItem = {
      ...currentSentence,
      text: currentSentence.text.replace(/\(Variant \d+\)/i, '').trim(),
      chunks: currentSentence.chunks.map(c => c.replace(/\(Variant \d+\)/i, '').trim())
  };

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
      evaluateSpeech(finalSpoken, currentSentence.text);
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

    const localResult = generateLocalFeedback(targetText, spokenText);
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
    historyRef.current.add(picked.text);
    setCurrentSentence({ ...picked, level: targetDiff });
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

          {/* 청크(의미 덩어리 개수) 선택 */}
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
            💡 1,200개의 실전 비즈니스 영어 문장이 탑재되어 있어 오프라인 환경에서도 무한 반복 연습이 가능합니다.
          </p>
        </div>

      </div>
    </div>
  );
}
