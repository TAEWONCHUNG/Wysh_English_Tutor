import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Volume2, 
  Mic, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Square, 
  Volume1, 
  BookOpen,
  Layers,
  Check,
  X,
  RefreshCw
} from 'lucide-react';

// 같은 src 폴더 안의 courseData.json(Unit 53~72, 총 180 Episode / 2,700문장)을 직접 불러옵니다.
import fullCourseData from './courseData.json';

const joinChunks = (row) => (row && row[0] ? row[0].split("|").join(" ") : "");

// 모바일/데스크톱 브라우저 최적 오디오 코덱 감지 (iOS Safari: mp4/aac, Android/PC: webm)
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
    if (MediaRecorder.isTypeSupported(mime)) return mime;
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
  const expanded = expandContractions((str || '').replace(/[’‘]/g, "'"));
  return expanded
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// 전역 싱글톤 AudioContext (반복 생성으로 인한 브라우저 오디오 리소스 고갈/프리징 완벽 방지)
let sharedAudioCtx = null;

const playSoundEffect = (type) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }
    const ctx = sharedAudioCtx;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    if (type === 'success') {
      const pitches = [523.25, 659.25, 783.99, 1046.5];
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
    console.warn("Audio effect error:", err);
  }
};

// 발음 일치도 분석 및 시각적 피드백 생성
const generateLocalFeedback = (target, spoken) => {
  const normTarget = cleanText(target);
  const normSpoken = cleanText(spoken);

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
  const [courseData] = useState(fullCourseData || {});

  // 코스 위치 상태 (Unit 53~72, Lesson 1~3, Episode 1~3)
  const [selectedUnit, setSelectedUnit] = useState(62);
  const [selectedLesson, setSelectedLesson] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // UI 및 오디오 설정 상태
  const [isCoursePickerOpen, setIsCoursePickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState('unit');
  const [showHintText, setShowHintText] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpInput, setJumpInput] = useState("");
  const [speechSpeed, setSpeechSpeed] = useState(0.85);
  const [playingChunkIdx, setPlayingChunkIdx] = useState(null);

  const speechSpeedRef = useRef(0.85);
  useEffect(() => {
    speechSpeedRef.current = speechSpeed;
  }, [speechSpeed]);

  // 현재 선택된 Unit > Lesson > Episode 데이터베이스 구축 및 전후 문맥 생성
  const episodeDatabase = useMemo(() => {
    const unitObj = courseData[selectedUnit] || courseData[String(selectedUnit)] || {};
    const lessonObj = unitObj[selectedLesson] || unitObj[String(selectedLesson)] || {};
    const rawList = lessonObj[selectedEpisode] || lessonObj[String(selectedEpisode)] || [
      [`Welcome to Unit ${selectedUnit} Lesson ${selectedLesson}|Episode ${selectedEpisode}.`, "학습 데이터를 불러왔습니다."]
    ];

    return rawList.map((row, i) => ({
      id: i + 1,
      text: joinChunks(row),
      chunks: row[0].split("|"),
      translation: row[1] || "",
      prevContext: rawList.slice(Math.max(0, i - 2), i).map(joinChunks),
      nextContext: rawList.slice(i + 1, i + 3).map(joinChunks)
    }));
  }, [courseData, selectedUnit, selectedLesson, selectedEpisode]);

  const displayItem = episodeDatabase[currentIndex] || episodeDatabase[0];

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
  const [errorMsg, setErrorMsg] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const userAudioPlayerRef = useRef(null);
  const isRecordingRef = useRef(false);
  const accumulatedSpeechRef = useRef("");

  // 녹음 및 오디오 리소스 안전 정리 함수
  const stopAllMediaAndSpeech = () => {
    isRecordingRef.current = false;
    setIsRecording(false);

    try {
      if (recognitionRef.current) recognitionRef.current.stop();
    } catch (e) {}

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {}

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      userAudioPlayerRef.current.currentTime = 0;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setPlayingChunkIdx(null);
    setIsPlayingMyVoice(false);
    setIsPlayingUserTts(false);
  };

  const resetEpisodeState = () => {
    stopAllMediaAndSpeech();
    setUserSpeech("");
    setRecordedAudioUrl((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
    setEvaluation(null);
    setIsPerfect(false);
    setMarkedSpoken("");
    setErrorMsg("");
    setCurrentIndex(0);
  };

  // 음성 인식(STT) 초기화 및 자동 재연결 처리
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
        const combined = (finalTranscripts + interimTranscripts).trim();
        accumulatedSpeechRef.current = combined;
        setUserSpeech(combined);
      };

      recognition.onerror = (event) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn("Speech recognition error:", event.error);
        }
      };

      // 침묵으로 인해 인식이 잠시 끊겼을 때 녹음 중 상태라면 자동 재시작
      recognition.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch (e) {}
        } else {
          setIsRecording(false);
        }
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      isRecordingRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setPlayingChunkIdx(null);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speechSpeedRef.current;
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

  const playMyVoiceAudio = () => {
    if (!recordedAudioUrl) return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    try {
      if (userAudioPlayerRef.current) {
        userAudioPlayerRef.current.pause();
        userAudioPlayerRef.current.currentTime = 0;
      }
      const audio = new Audio();
      audio.src = recordedAudioUrl;
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      userAudioPlayerRef.current = audio;
      setIsPlayingMyVoice(true);
      audio.onended = () => setIsPlayingMyVoice(false);
      audio.onerror = () => setIsPlayingMyVoice(false);
      audio.play().catch(() => setIsPlayingMyVoice(false));
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

  const toggleRecording = async () => {
    if (isRecording) {
      // 녹음 종료 및 발음 평가
      isRecordingRef.current = false;
      setIsRecording(false);
      try {
        recognitionRef.current?.stop();
      } catch (e) {}

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {}
      }

      const spoken = accumulatedSpeechRef.current.trim();
      if (spoken) {
        setIsEvaluating(true);
        setTimeout(() => {
          const result = generateLocalFeedback(displayItem.text, spoken);
          setIsPerfect(result.isPerfect);
          setEvaluation(result.message);
          setMarkedSpoken(result.markedSpoken || "");
          playSoundEffect(result.isPerfect ? 'success' : 'retry');
          setIsEvaluating(false);
        }, 250);
      } else {
        setErrorMsg("음성이 감지되지 않았습니다. 마이크에 대고 다시 말씀해 보세요.");
      }
    } else {
      // 새 녹음 시작 전 기존 재생/녹음 정리
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setPlayingChunkIdx(null);

      setUserSpeech("");
      accumulatedSpeechRef.current = "";
      setEvaluation(null);
      setIsPerfect(false);
      setMarkedSpoken("");
      setErrorMsg("");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        mediaStreamRef.current = stream;

        const mimeType = getBestAudioMimeType();
        const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
            // 이전 녹음 파일 메모리 해제 (Blob URL 메모리 누수 방지)
            setRecordedAudioUrl((prevUrl) => {
              if (prevUrl) URL.revokeObjectURL(prevUrl);
              return URL.createObjectURL(blob);
            });
          }
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((t) => t.stop());
            mediaStreamRef.current = null;
          }
        };

        mediaRecorder.start(200);
        mediaRecorderRef.current = mediaRecorder;

        isRecordingRef.current = true;
        try {
          recognitionRef.current?.start();
        } catch (e) {}
      } catch (e) {
        setErrorMsg("마이크 접근 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해 주세요.");
      }
    }
  };

  const jumpToSentence = (idx) => {
    stopAllMediaAndSpeech();
    setUserSpeech("");
    setRecordedAudioUrl((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
    setEvaluation(null);
    setIsPerfect(false);
    setMarkedSpoken("");
    setErrorMsg("");

    const safeIdx = Math.max(0, Math.min(episodeDatabase.length - 1, idx));
    setCurrentIndex(safeIdx);
    speakText(episodeDatabase[safeIdx].text);
  };

  const handleNextSentence = () => {
    if (currentIndex + 1 < episodeDatabase.length) {
      jumpToSentence(currentIndex + 1);
    } else {
      // 현재 에피소드의 마지막(15번) 문장 완료 시 다음 코스로 자동 전환
      if (selectedEpisode < 3) {
        setSelectedEpisode((e) => e + 1);
        resetEpisodeState();
      } else if (selectedLesson < 3) {
        setSelectedLesson((l) => l + 1);
        setSelectedEpisode(1);
        resetEpisodeState();
      } else if (selectedUnit < 72) {
        setSelectedUnit((u) => u + 1);
        setSelectedLesson(1);
        setSelectedEpisode(1);
        resetEpisodeState();
      } else {
        jumpToSentence(0);
      }
    }
  };

  const handleJumpSubmit = (e) => {
    if (e) e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= episodeDatabase.length) {
      jumpToSentence(num - 1);
      setIsJumping(false);
    } else {
      setErrorMsg(`1번부터 ${episodeDatabase.length}번 사이의 번호를 입력해 주세요.`);
    }
  };

  if (!speechSupported) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm text-center shadow-xl">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-base font-bold mb-1">음성 인식 미지원</h2>
          <p className="text-slate-400 text-xs">최신 Chrome 또는 Safari 브라우저를 이용해 주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 font-sans antialiased">
      <div className="w-full max-w-lg bg-slate-900/95 border border-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* 상단 통합 네비게이션 헤더 */}
        <div className="bg-slate-900 border-b border-slate-800/80 px-3.5 py-2.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsCoursePickerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-white hover:bg-indigo-900/50 transition-all cursor-pointer active:scale-95"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <div className="flex items-center gap-1 text-xs font-bold">
              <span className="text-indigo-300">Unit {selectedUnit}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-200">L{selectedLesson}</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400">Ep {selectedEpisode}</span>
            </div>
            <span className="text-[10px] ml-0.5 px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">선택</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setJumpInput(String(currentIndex + 1));
                setIsJumping(true);
              }}
              title="클릭하여 원하는 문장 번호로 이동"
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 hover:border-indigo-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span>#{currentIndex + 1} / {episodeDatabase.length}</span>
              <span className="text-[9px] text-indigo-400 font-bold">이동</span>
            </button>

            <button
              type="button"
              onClick={() => setSpeechSpeed((s) => (s === 0.7 ? 0.85 : s === 0.85 ? 1.0 : 0.7))}
              className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
            >
              {speechSpeed === 0.7 ? '0.7x' : speechSpeed === 0.85 ? '0.85x' : '1.0x'}
            </button>
          </div>
        </div>

        {/* 메인 섀도잉 및 피드백 통합 영역 */}
        <div className="p-3 sm:p-4 flex flex-col gap-2.5">
          
          {/* 원문 청크 표시 박스 */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                Unit {selectedUnit} · Lesson {selectedLesson} · Episode {selectedEpisode}
              </span>
              <button
                type="button"
                onClick={() => setShowHintText((prev) => !prev)}
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

            {/* 청크 블록 */}
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

            {/* 전후 문맥 및 현재 원문 하이라이트 표시 */}
            {showHintText && (
              <div className="mt-2 p-3 rounded-xl bg-slate-900/95 border border-slate-800 text-left w-full text-xs flex flex-col gap-1.5 shadow-inner">
                {displayItem.prevContext.map((c, i) => (
                  <p key={`prev-${i}`} className="text-slate-500 leading-relaxed text-[11px] sm:text-xs">
                    {c}
                  </p>
                ))}
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
                {displayItem.nextContext.map((c, i) => (
                  <p key={`next-${i}`} className="text-slate-500 leading-relaxed text-[11px] sm:text-xs">
                    {c}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 메인 컨트롤 4버튼 */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => jumpToSentence((currentIndex - 1 + episodeDatabase.length) % episodeDatabase.length)}
              className="py-2.5 px-1.5 rounded-xl font-bold text-[11px] sm:text-xs bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>이전</span>
            </button>

            <button
              type="button"
              onClick={() => speakText(displayItem.text)}
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

            <button
              type="button"
              onClick={handleNextSentence}
              className="py-2.5 px-1.5 rounded-xl font-bold text-[11px] sm:text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <span>{currentIndex + 1 === episodeDatabase.length ? "다음 에피소드" : "다음"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
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

          {/* 내가 말한 내용 & 튜터 피드백 */}
          {(userSpeech || isEvaluating || evaluation) && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2.5">
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
                          type="button"
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
                        type="button"
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
                    evaluation && isPerfect ? (
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
                            type="button"
                            onClick={toggleRecording}
                            className="px-2.5 py-1 rounded text-[11px] font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center gap-1 transition-all active:scale-95"
                          >
                            <RefreshCw className="w-3 h-3" />
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

        {/* 3단계 코스 선택 모달 (Unit 53~72 / Lesson 1~3 / Episode 1~3) */}
        {isCoursePickerOpen && (
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3"
            onClick={() => setIsCoursePickerOpen(false)}
          >
            <div
              className="bg-slate-900 border border-slate-700 p-4 rounded-2xl max-w-sm w-full shadow-2xl flex flex-col gap-3 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">학습 코스 선택 (총 180 Episode)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCoursePickerOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['unit', 'lesson', 'episode'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPickerTab(t)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      pickerTab === t ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t === 'unit' ? `Unit ${selectedUnit}` : t === 'lesson' ? `Lesson ${selectedLesson}` : `Ep ${selectedEpisode}`}
                  </button>
                ))}
              </div>

              {pickerTab === 'unit' && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] text-slate-400">Unit 선택 (53 ~ 72):</p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {Array.from({ length: 20 }, (_, i) => 53 + i).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => {
                          setSelectedUnit(u);
                          setPickerTab('lesson');
                          resetEpisodeState();
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedUnit === u
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                        }`}
                      >
                        U{u}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {pickerTab === 'lesson' && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] text-slate-400">Unit {selectedUnit}의 Lesson 선택:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => {
                          setSelectedLesson(l);
                          setPickerTab('episode');
                          resetEpisodeState();
                        }}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                          selectedLesson === l
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                        }`}
                      >
                        Lesson {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {pickerTab === 'episode' && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] text-slate-400">Episode 선택 (각 15문장):</p>
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3].map((ep) => (
                      <button
                        key={ep}
                        type="button"
                        onClick={() => {
                          setSelectedEpisode(ep);
                          resetEpisodeState();
                          setIsCoursePickerOpen(false);
                        }}
                        className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all ${
                          selectedEpisode === ep
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                        }`}
                      >
                        <span>Episode {ep} (15문장 훈련)</span>
                        {selectedEpisode === ep && <Check className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 문장 번호 바로 이동 팝업 모달 */}
        {isJumping && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsJumping(false)}
          >
            <div
              className="bg-slate-900 border border-slate-700 p-5 rounded-2xl max-w-xs w-full shadow-2xl flex flex-col gap-3.5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">문장 바로 이동</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsJumping(false)}
                  className="text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-400">
                이동할 번호 (1 ~ {episodeDatabase.length})를 입력하세요.
              </p>

              <form onSubmit={handleJumpSubmit} className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max={episodeDatabase.length}
                  value={jumpInput}
                  onChange={(e) => setJumpInput(e.target.value)}
                  placeholder={`1 ~ ${episodeDatabase.length}`}
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

              <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 font-semibold">빠른 이동:</span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {[1, 5, 10, episodeDatabase.length].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        jumpToSentence(num - 1);
                        setIsJumping(false);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-all active:scale-95 ${
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
