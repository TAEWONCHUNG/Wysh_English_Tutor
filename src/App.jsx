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
  Layers,
  Check,
  X
} from 'lucide-react';

// 같은 src 폴더 안에 있는 180개 에피소드 전체 데이터를 바로 불러옵니다.
import fullCourseData from './courseData.json';

const joinChunks = (row) => (row && row[0] ? row[0].split("|").join(" ") : "");

// 브라우저별 최적 오디오 코덱 자동 탐색 (iOS Safari 지원)
const getBestAudioMimeType = () => {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return '';
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isSafari) {
    if (MediaRecorder.isTypeSupported('audio/mp4')) return 'audio/mp4';
    if (MediaRecorder.isTypeSupported('audio/aac')) return 'audio/aac';
  }
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac', 'audio/ogg'];
  for (const mime of candidates) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return '';
};

// 텍스트 정규화 (비교 판정용)
const cleanText = (str) => {
  return (str || '')
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Web Audio API 효과음 (통과 화음 / 재도전 차임)
const playSoundEffect = (type) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'success') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    } else {
      [392.0, 311.13].forEach((freq, idx) => {
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
  } catch (e) {}
};

// 음성 분석 및 시각적 피드백 생성
const generateLocalFeedback = (target, spoken) => {
  let normTarget = cleanText(target);
  let normSpoken = cleanText(spoken);

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

  const correctCount = targetWords.filter(w => spokenWords.includes(w)).length;
  const accuracyRatio = correctCount / (targetWords.length || 1);

  if (missingWords.length + substituted.length <= 1 || accuracyRatio >= 0.65) {
    return { isPerfect: true, message: "🎉 훌륭합니다! 핵심 대사의 호흡과 발음이 자연스럽게 통과되었습니다." };
  }
  if (substituted.length > 0) {
    return { isPerfect: false, message: `${substituted.slice(0, 2).join(', ')}을(를) 말씀하셨습니다. 발음을 다시 듣고 도전해 보세요!`, markedSpoken };
  }
  if (missingWords.length > 0) {
    return { isPerfect: false, message: `${missingWords.slice(0, 2).join(', ')} 단어가 빠졌습니다. 문장 끝까지 호흡을 유지해 보세요.`, markedSpoken };
  }
  return { isPerfect: false, message: "아주 근접했습니다! 조금 더 또렷하게 다시 발음해 보세요.", markedSpoken };
};

export default function EnglishTutorApp() {
  // src/courseData.json 을 기본 데이터로 설정
  const [courseData, setCourseData] = useState(fullCourseData);
  
  // 코스 위치 상태 (Unit 53~72, Lesson 1~3, Episode 1~3)
  const [selectedUnit, setSelectedUnit] = useState(62);
  const [selectedLesson, setSelectedLesson] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // UI 및 음성 상태
  const [isCoursePickerOpen, setIsCoursePickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState('unit');
  const [showHintText, setShowHintText] = useState(true);
  const [speechSpeed, setSpeechSpeed] = useState(0.85);
  const [playingChunkIdx, setPlayingChunkIdx] = useState(null);

  const speechSpeedRef = useRef(0.85);
  useEffect(() => { speechSpeedRef.current = speechSpeed; }, [speechSpeed]);

  // 현재 선택된 Unit > Lesson > Episode 데이터 로드 및 전후 문맥 생성
  const episodeDatabase = useMemo(() => {
    const unitObj = courseData[selectedUnit] || {};
    const lessonObj = unitObj[selectedLesson] || {};
    // 데이터가 비어있을 경우 안전한 기본값 제공
    const rawList = lessonObj[selectedEpisode] || [
      [`Welcome to Unit ${selectedUnit} Lesson ${selectedLesson}|Episode ${selectedEpisode}.`, "해당 에피소드 데이터가 부족합니다."]
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

  const resetEpisodeState = () => {
    setUserSpeech("");
    setRecordedAudioUrl(null);
    setEvaluation(null);
    setIsPerfect(false);
    setMarkedSpoken("");
    setErrorMsg("");
    setCurrentIndex(0);
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
        const combined = (finalTranscripts + interimTranscripts).trim();
        accumulatedSpeechRef.current = combined;
        setUserSpeech(combined);
      };

      recognition.onerror = () => {};
      recognition.onend = () => {
        if (!isRecordingRef.current) setIsRecording(false);
      };
      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
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
    utterance.onstart = () => { setIsPlayingAudio(true); setPlayingChunkIdx(idx); };
    utterance.onend = () => { setIsPlayingAudio(false); setPlayingChunkIdx(null); };
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
      userAudioPlayerRef.current = audio;
      setIsPlayingMyVoice(true);
      audio.onended = () => setIsPlayingMyVoice(false);
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
    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      isRecordingRef.current = false;
      setIsRecording(false);
      try { recognitionRef.current?.stop(); } catch (e) {}
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
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
        }, 300);
      } else {
        setErrorMsg("음성이 감지되지 않았습니다.");
      }
    } else {
      setUserSpeech("");
      accumulatedSpeechRef.current = "";
      setEvaluation(null);
      setIsPerfect(false);
      setMarkedSpoken("");
      setErrorMsg("");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: { echoCancellation: true, noiseSuppression: true }
        });
        mediaStreamRef.current = stream;
        
        const mimeType = getBestAudioMimeType();
        const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
          setRecordedAudioUrl(URL.createObjectURL(blob));
          mediaStreamRef.current?.getTracks().forEach(t => t.stop());
        };
        
        mediaRecorder.start(200);
        mediaRecorderRef.current = mediaRecorder;
        
        isRecordingRef.current = true;
        recognitionRef.current?.start();
      } catch (e) {
        setErrorMsg("마이크 접근 권한이 필요합니다.");
      }
    }
  };

  const jumpToSentence = (idx) => {
    setUserSpeech("");
    setRecordedAudioUrl(null);
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
      // 에피소드 완주 시 다음 코스로 자동 연계 이동
      if (selectedEpisode < 3) {
        setSelectedEpisode(e => e + 1);
        resetEpisodeState();
      } else if (selectedLesson < 3) {
        setSelectedLesson(l => l + 1);
        setSelectedEpisode(1);
        resetEpisodeState();
      } else if (selectedUnit < 72) {
        setSelectedUnit(u => u + 1);
        setSelectedLesson(1);
        setSelectedEpisode(1);
        resetEpisodeState();
      } else {
        jumpToSentence(0);
      }
    }
  };

  if (!speechSupported) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center shadow-xl">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-base font-bold mb-1">음성 인식 미지원</h2>
          <p className="text-slate-400 text-xs">최신 Chrome 또는 Safari 브라우저를 이용해 주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-3 font-sans">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* 상단 통합 네비게이션 헤더 */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsCoursePickerOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-white hover:bg-indigo-900/50 transition-all active:scale-95"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-indigo-300">Unit {selectedUnit}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-200">L{selectedLesson}</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400">Ep {selectedEpisode}</span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">
              #{currentIndex + 1} / {episodeDatabase.length}
            </span>
            <button
              onClick={() => setSpeechSpeed(s => s === 0.7 ? 0.85 : s === 0.85 ? 1.0 : 0.7)}
              className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white"
            >
              {speechSpeed}x
            </button>
          </div>
        </div>

        {/* 메인 섀도잉 영역 */}
        <div className="p-4 flex flex-col gap-3">
          
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 text-center flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10">
                Unit {selectedUnit} 스크립트 훈련
              </span>
              <button
                onClick={() => setShowHintText(prev => !prev)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {showHintText ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showHintText ? '원문 표시' : '원문 가림'}</span>
              </button>
            </div>

            {/* 청크 분할 버튼 */}
            <div className="flex flex-wrap gap-1.5 my-2">
              {displayItem.chunks.map((chunk, idx) => (
                <button
                  key={idx}
                  onClick={() => playChunkAudio(chunk, idx)}
                  className={`flex-1 min-w-[90px] py-2 px-2 rounded-lg border text-center transition-all ${
                    playingChunkIdx === idx
                      ? 'bg-indigo-600 border-indigo-400 text-white ring-2 ring-indigo-400/50 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500/60'
                  }`}
                >
                  <div className="text-[9px] text-indigo-400 font-bold mb-0.5 flex justify-center gap-1">
                    <span>CHUNK {idx + 1}</span>
                    <Volume2 className="w-2.5 h-2.5 opacity-50" />
                  </div>
                  <span className="text-xs font-semibold">{showHintText ? chunk : `[ ${chunk.split(' ').length} 단어 ]`}</span>
                </button>
              ))}
            </div>

            {/* 전후 문맥 및 현재 문장 */}
            {showHintText && (
              <div className="mt-2 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-left text-xs flex flex-col gap-1.5">
                {displayItem.prevContext.map((c, i) => <p key={`prev-${i}`} className="text-slate-500 leading-relaxed">{c}</p>)}
                <div className="my-1 p-2 rounded-lg bg-indigo-950/60 border-l-4 border-indigo-500 pl-3">
                  <p className="font-bold text-indigo-100">{displayItem.text}</p>
                  {displayItem.translation && <p className="text-[11px] text-indigo-300/80 mt-1">{displayItem.translation}</p>}
                </div>
                {displayItem.nextContext.map((c, i) => <p key={`next-${i}`} className="text-slate-500 leading-relaxed">{c}</p>)}
              </div>
            )}
          </div>

          {/* 메인 컨트롤 4버튼 */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => jumpToSentence((currentIndex - 1 + episodeDatabase.length) % episodeDatabase.length)}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1 active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> 이전
            </button>
            <button
              onClick={() => speakText(displayItem.text)}
              disabled={isPlayingAudio}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 ${
                isPlayingAudio ? 'bg-indigo-900/80 border border-indigo-500 text-indigo-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce text-indigo-400' : 'text-indigo-400'}`} />
              듣기
            </button>
            <button
              onClick={handleNextSentence}
              className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-95 shadow-md"
            >
              다음 <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleRecording}
              className={`py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1 active:scale-95 shadow-md ${
                isRecording ? 'bg-rose-600 ring-2 ring-rose-500/30' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {isRecording ? <Square className="w-3 h-3 fill-current" /> : <Mic className="w-3.5 h-3.5" />}
              {isRecording ? '완료' : '말하기'}
            </button>
          </div>

          {errorMsg && (
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
            </div>
          )}

          {/* 피드백 영역 */}
          {(userSpeech || isEvaluating || evaluation) && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Mic className="w-3 h-3 text-indigo-400" /> 내가 말한 내용
                </span>
                {userSpeech && (
                  <div className="flex items-center gap-1">
                    {recordedAudioUrl && (
                      <button onClick={playMyVoiceAudio} disabled={isPlayingMyVoice} className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border ${isPlayingMyVoice ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse' : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'}`}>
                        <Play className="w-2.5 h-2.5 fill-current" /> {isPlayingMyVoice ? '재생 중' : '내 목소리'}
                      </button>
                    )}
                    <button onClick={playUserSpeechTts} disabled={isPlayingUserTts} className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border ${isPlayingUserTts ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse' : 'bg-slate-800 text-indigo-300 border-slate-700 hover:bg-slate-700'}`}>
                      <Volume1 className="w-2.5 h-2.5" /> 인식 문장
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs sm:text-sm font-medium text-slate-300 leading-snug">
                {userSpeech ? (
                  evaluation && isPerfect ? (
                    <div className="flex flex-col gap-2">
                      <div className="text-emerald-300">"{userSpeech}"</div>
                      <div className="text-[11px] text-indigo-200 border-t border-slate-700/60 pt-1">
                        <span className="font-bold mr-1">원문:</span> {displayItem.text}
                      </div>
                    </div>
                  ) : markedSpoken ? (
                    <div dangerouslySetInnerHTML={{ __html: `"${markedSpoken}"` }} className="break-words" />
                  ) : (
                    <span className="text-indigo-200">"{userSpeech}"</span>
                  )
                ) : (
                  <span className="text-slate-400 italic text-[11px]">분석 중...</span>
                )}
              </div>

              {isEvaluating ? (
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2 text-slate-400 text-xs mt-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>분석하고 있습니다...</span>
                </div>
              ) : evaluation && (
                <div className={`p-2 rounded-lg border text-xs mt-1 flex items-start gap-1.5 ${isPerfect ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200' : 'bg-amber-950/60 border-amber-500/60 text-amber-200'}`}>
                  {isPerfect ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />}
                  <div>
                    <p className="font-semibold">{evaluation}</p>
                    {!isPerfect && (
                      <button onClick={toggleRecording} className="mt-1.5 px-2.5 py-1 rounded text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> 다시 말하기
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* 전체 코스 선택기 모달 (Unit 53 ~ 72) */}
        {isCoursePickerOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3" onClick={() => setIsCoursePickerOpen(false)}>
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl max-w-sm w-full shadow-2xl flex flex-col gap-3" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">학습 코스 선택</h3>
                </div>
                <button onClick={() => setIsCoursePickerOpen(false)} className="text-slate-400 p-1"><X className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['unit', 'lesson', 'episode'].map(t => (
                  <button
                    key={t}
                    onClick={() => setPickerTab(t)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${pickerTab === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {t === 'unit' ? `Unit ${selectedUnit}` : t === 'lesson' ? `L${selectedLesson}` : `Ep ${selectedEpisode}`}
                  </button>
                ))}
              </div>

              {pickerTab === 'unit' && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] text-slate-400">Unit (53~72):</p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-56 overflow-y-auto">
                    {Array.from({ length: 20 }, (_, i) => 53 + i).map(u => (
                      <button
                        key={u}
                        onClick={() => { setSelectedUnit(u); setPickerTab('lesson'); resetEpisodeState(); }}
                        className={`py-2 rounded-xl text-xs font-bold border ${selectedUnit === u ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
                      >
                        U{u}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {pickerTab === 'lesson' && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] text-slate-400">Lesson 선택:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(l => (
                      <button
                        key={l}
                        onClick={() => { setSelectedLesson(l); setPickerTab('episode'); resetEpisodeState(); }}
                        className={`py-3 rounded-xl text-xs font-bold border ${selectedLesson === l ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
                      >
                        Lesson {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {pickerTab === 'episode' && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] text-slate-400">Episode (각 15문장):</p>
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3].map(ep => (
                      <button
                        key={ep}
                        onClick={() => { setSelectedEpisode(ep); resetEpisodeState(); setIsCoursePickerOpen(false); }}
                        className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between ${selectedEpisode === ep ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
                      >
                        <span>Episode {ep}</span>
                        {selectedEpisode === ep && <Check className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
