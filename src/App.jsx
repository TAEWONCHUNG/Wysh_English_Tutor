import React, { useState, useEffect, useRef } from 'react';
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
  BookOpen
} from 'lucide-react';

// Unit 62 실전 스피킹 최적화 데이터베이스 (엄선된 문장 79개, 전후 문맥 자동 생성)
// Unit 62 데이터베이스 (79문장). 청크는 "|"로 구분합니다.
// 앞뒤 문맥(prevContext / nextContext)은 이웃 문장 3개씩 자동 생성됩니다.
const UNIT62_RAW = [
  // ---------- Lesson 1 ----------
  ["I wouldn't do that|even if you paid me.", "돈을 준다 해도 그런 일은 안 할 거예요."],
  ["I will help you|only if you come with me.", "당신이 함께 가야만 도와드릴게요."],
  ["If you can't come with me,|then I can't help you find the murderer.", "같이 못 간다면 살인범을 찾는 걸 도울 수 없어요."],
  ["I would eat a lot of food at lunch,|only if I were done filming for the day.", "오늘 촬영이 끝났다면 점심을 많이 먹을 텐데요."],
  ["I'll make sure you have more lines,|even if I have to write the script myself.", "제가 직접 대본을 써서라도 대사를 늘려드릴게요."],
  ["The important thing|is for you|to not believe everything you read.", "중요한 건 읽는 걸 전부 믿지 않는 거야."],
  ["My hope is for my friends|to read great literature,|not tabloids like this.", "내 친구들이 이런 타블로이드 말고 훌륭한 문학을 읽었으면 해."],
  ["The important thing is for you|to admit that aliens could exist.", "중요한 건 외계인이 존재할 수도 있다고 인정하는 거야."],
  ["The goal of the article|is for people to know|that he's been hiding here among us.", "이 기사의 목적은 그가 우리 사이에 숨어 있었다는 걸 알리는 거야."],
  ["It's possible that Dan Blaze and his alien friends|are trying to take over the world.", "댄 블레이즈와 외계인 친구들이 세계를 장악하려는 걸 수도 있어."],
  ["When you put it that way,|it is possible.", "그렇게 말하니 가능할 수도 있겠네."],
  ["My main goal|is for us to agree.", "내 주된 목표는 우리가 의견을 맞추는 거야."],
  ["Sometimes, I barely get any sleep|because I'm working all the time.", "항상 일하느라 가끔은 거의 잠을 못 자."],
  ["It's much better than working for my parents,|or finding a dead end job that leads nowhere.", "부모님 가게에서 일하거나 앞날 없는 막다른 직장을 찾는 것보다 훨씬 나아."],
  ["I'm applying for this position|because I believe I am an ideal candidate for your company.", "제가 귀사에 이상적인 지원자라고 믿기에 이 직책에 지원합니다."],
  ["I am writing in reference to an application|that I submitted for employment on your website.", "귀사 웹사이트에 제출한 입사 지원서와 관련해 글을 씁니다."],
  ["The position sounds both demanding and fulfilling,|and I would like to express my interest|in working for your company.", "이 직책은 힘들면서도 보람 있어 보이며, 귀사에서 일하고 싶은 마음을 전하고 싶습니다."],
  ["If I can provide anything else to be considered for employment,|please do not hesitate to ask.", "채용 심사에 필요한 것이 더 있다면 언제든 말씀해 주십시오."],
  ["There are a lot of strict deadlines,|because the video game field is extremely competitive.", "비디오 게임 업계는 경쟁이 매우 치열해서 엄격한 마감이 많아."],
  ["However, the work is so rewarding that,|at the end of the day,|it's all worthwhile.", "하지만 일이 너무 보람 있어서 결국엔 다 가치가 있어."],
  ["It can be intimidating|because so many of my colleagues|have more experience than I do.", "동료 중에 나보다 경력이 많은 사람이 많아서 주눅이 들 수 있어."],
  ["I had been so busy rehearsing my lines for weeks|that I forgot|that I had been in medical school.", "몇 주간 대사 연습에 너무 바빠서 의대에 다녔다는 사실도 잊었어."],
  ["I had been wondering|if I was doing the right thing with my life|for months.", "내 인생을 제대로 살고 있는지 몇 달째 고민하고 있었어."],
  ["White collar workers are businessmen or professionals|who have careers.", "화이트칼라 노동자는 커리어를 가진 사업가나 전문직 종사자야."],
  ["Blue collar workers are all the other people with regular jobs,|like plumbers and construction workers.", "블루칼라 노동자는 배관공이나 건설 노동자 같은 나머지 일반 직종 사람들이야."],
  ["I'll watch your entire series|if you play one of the video games|that I designed.", "네가 내가 디자인한 게임을 해주면 네 드라마를 전부 볼게."],
  ["I had only been waiting|for around 10 minutes|before you arrived.", "당신이 오시기 전까지 10분 정도밖에 기다리지 않았습니다."],
  ["I'd love the chance to tackle some larger projects|and progress my career|with a larger organization.", "더 큰 조직에서 더 큰 프로젝트에 도전하며 경력을 쌓고 싶습니다."],
  ["I had been studying business for 6 months|before I realized|I didn't like it.", "경영학을 6개월 공부하다가 저와 맞지 않는다는 걸 깨달았습니다."],
  ["I had been considering going on to graduate school,|but I was eager to start work.", "대학원 진학을 고민했지만 일을 빨리 시작하고 싶었습니다."],
  ["I had only been working for Green Games for a few months|when the CEO offered me a job.", "그린 게임즈에서 몇 달밖에 일하지 않았을 때 대표님이 일자리를 제안했습니다."],
  ["I've been browsing for jobs online for a week|when I saw the ad for this position.", "일주일째 온라인으로 구직 중이었을 때 이 직책의 공고를 봤습니다."],
  ["I'd been feeling bored in my current role for a while|when I decided it was time to move on.", "한동안 현재 업무가 지루하다고 느끼다가 이직할 때라고 결심했습니다."],
  ["I'm looking for a job|that is both demanding and fulfilling.", "힘들면서도 보람 있는 일을 찾고 있습니다."],
  ["I am confident that I am the best person for this job|because I'm extremely hardworking and dedicated.", "저는 매우 성실하고 헌신적이라 이 일에 가장 적합하다고 확신합니다."],

  // ---------- Lesson 2 ----------
  ["If you weren't so arrogant,|you would have prepared this correctly.", "네가 그렇게 오만하지 않았다면 이걸 제대로 준비했을 텐데."],
  ["If you weren't so dumb,|you would have remembered that.", "네가 그렇게 멍청하지 않았다면 그걸 기억했을 텐데."],
  ["If you were smart,|you would have paid better attention to me.", "네가 똑똑했다면 내 말에 더 귀 기울였을 텐데."],
  ["If I didn't know better,|I would think you're rolling your eyes at me.", "내가 모르는 사람이었다면 네가 나한테 눈을 굴린다고 생각했을 거야."],
  ["If it were just a little mistake,|I wouldn't have come in here to yell at you.", "사소한 실수였다면 내가 여기 와서 소리 지르지 않았겠지."],
  ["If I yelled at you more,|you would have paid attention to me.", "내가 더 소리를 질렀다면 너도 내 말을 들었을 텐데."],
  ["If someone were allergic to parsley,|they could be dead now.", "누군가 파슬리 알레르기가 있었다면 지금쯤 죽었을 수도 있어."],
  ["If he was happy with the dish the way you prepared it,|he wouldn't have sent it back.", "네가 만든 요리에 만족했다면 돌려보내지 않았겠지."],
  ["Can this be taken to mean|you're firing me?", "이게 저를 해고하신다는 뜻으로 받아들여도 되나요?"],
  ["In other words,|it has nothing to do with the parsley.", "다시 말해, 파슬리와는 아무 상관이 없군요."],
  ["This means that|you owe Sophie an apology.", "이 말은 당신이 소피에게 사과해야 한다는 뜻입니다."],
  ["You should apologize to everyone here|for interrupting our meals|to yell at an innocent employee.", "죄 없는 직원에게 소리 지르려고 식사를 방해한 것을 여기 모두에게 사과해야 합니다."],
  ["She's a good girl,|with twice the talent you'll ever have.", "그 애는 착한 아이고, 당신보다 두 배는 재능이 있어요."],
  ["Can that be taken to mean|you own this restaurant?", "그 말이 이 식당의 주인이라는 뜻으로 받아들여도 되나요?"],
  ["Because I'm never coming back.|In other words, I quit.", "난 다시는 안 돌아올 테니까요. 다시 말해, 그만두겠어요."],
  ["It is important for you to remember|that it is not the end of the world.", "세상이 끝난 게 아니라는 점을 기억하는 것이 중요합니다."],
  ["People lose their jobs all the time,|but they always manage to find something new and often better.", "사람들은 늘 일자리를 잃지만 결국 새롭고 종종 더 나은 일을 찾아냅니다."],
  ["It can be a good idea for you|to give yourself some time to think.", "스스로 생각할 시간을 주는 것도 좋은 방법일 수 있습니다."],
  ["The first thing for you to decide|is if you want to find a similar job|or want a change of career.", "가장 먼저 결정할 것은 비슷한 일을 찾을지, 진로를 바꿀지입니다."],
  ["If you decide to stay in the same career,|you will already have many of the skills and qualifications.", "같은 분야에 남기로 한다면 이미 많은 기술과 자격을 갖추고 있을 것입니다."],
  ["On the other hand,|if you decide to change careers,|you might have to start at the bottom.", "반면 진로를 바꾸기로 하면 밑바닥부터 시작해야 할 수도 있습니다."],
  ["Some jobs may even require you|to start as an apprentice|before becoming a full employee.", "어떤 직업은 정식 직원이 되기 전에 견습생으로 시작해야 할 수도 있습니다."],
  ["Many people who accept jobs they don't want|find that the work load is very high,|and the position is often a dead end job.", "원하지 않는 일을 받아들인 많은 사람은 업무량이 매우 많고 앞날 없는 직장임을 알게 됩니다."],
  ["Even if you have to work long hours,|the time will pass much more quickly|when you are doing something you love.", "오래 일해야 하더라도 좋아하는 일을 하면 시간이 훨씬 빨리 갑니다."],

  // ---------- Lesson 3 ----------
  ["I'm the ideal candidate|to run this company.", "제가 이 회사를 이끌 이상적인 후보입니다."],
  ["You can't be the president of this company,|no matter what your strengths are.", "강점이 무엇이든 당신은 이 회사의 사장이 될 수 없어요."],
  ["I should have known better|than to come here today.", "오늘 여기 오지 말았어야 했어요."],
  ["I would say|my biggest strength|is my attention to detail.", "제 가장 큰 강점은 세부 사항에 대한 집중력이라고 말씀드리고 싶습니다."],
  ["I think perfectionism can be a weakness,|because sometimes it can slow you down.", "완벽주의는 때로 속도를 늦추기 때문에 약점이 될 수 있다고 생각합니다."],
  ["I wouldn't change that about myself,|because it ensures I'm precise with my work.", "일을 정확하게 하게 해주기 때문에 그 점은 바꾸고 싶지 않습니다."],
  ["I think experience is more important than education.", "저는 경력이 학력보다 더 중요하다고 생각해요."],
  ["If education was so important,|he would have a job already.", "학력이 그렇게 중요했다면 그는 이미 취직했을 거예요."],
  ["Just imagine if we staffed our company|with a bunch of kids, with no experience.", "경험 없는 애송이들로만 회사를 채운다고 상상해 보세요."],
  ["Let's say that we hired a bunch of employees that had experience,|but didn't have the proper training.", "경험은 있지만 제대로 된 교육을 받지 않은 직원들만 뽑았다고 해봅시다."],
  ["What if we only hired|people just out of college?", "갓 대학을 졸업한 사람들만 뽑으면 어떨까요?"],
  ["If that were the case,|then no one would ever get hired after college.", "그렇다면 졸업 후에 아무도 취직하지 못할 거예요."],
  ["If that were true,|then it would be a good idea,|but I'm not convinced.", "그게 사실이라면 좋은 생각이겠지만 저는 아직 확신이 안 서요."],
  ["What if we high fived|every time we agree on something?", "뭔가에 동의할 때마다 하이파이브를 하면 어때요?"],
  ["I'm sorry to hear that you were made redundant,|but try to think of it as an opportunity.", "정리해고되셨다니 안타깝지만 기회라고 생각해 보세요."],
  ["It is very important for you|to make a good impression|before the interview.", "면접 전에 좋은 인상을 남기는 것이 매우 중요합니다."],
  ["During interviews,|the main thing for you to focus on|is highlighting your strengths.", "면접 중 집중할 핵심은 자신의 강점을 부각하는 것입니다."],
  ["The aim is for you|to describe something small|that you can easily improve.", "목표는 쉽게 개선할 수 있는 사소한 점을 설명하는 것입니다."],
  ["It is a good idea for you|to talk about your relevant experience only.", "관련된 경력만 이야기하는 것이 좋습니다."],
  ["Don't say anything negative|about your previous employer.", "이전 고용주에 대해 부정적인 말은 하지 마세요."]
];

const joinChunks = (row) => row[0].split("|").join(" ");

const UNIT62_DATABASE = UNIT62_RAW.map((row, i) => ({
  id: i + 1,
  text: joinChunks(row),
  chunks: row[0].split("|"),
  translation: row[1],
  prevContext: UNIT62_RAW.slice(Math.max(0, i - 3), i).map(joinChunks),
  nextContext: UNIT62_RAW.slice(i + 1, i + 4).map(joinChunks)
}));

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
  // 둥근 따옴표(’)를 직선 따옴표(')로 통일한 뒤 축약형 처리
  const expanded = expandContractions((str || '').replace(/[’‘]/g, "'"));
  return expanded
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};


// Web Audio API 효과음 (통과 딩동댕동 / 오답 알림음)
const playSoundEffect = (type) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'success') {
      // 통과 시: 경쾌하고 밝은 상승 4화음 챠임 (C5 - E5 - G5 - C6)
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
      // 불일치 시: 부드러운 2음 알림 (G4 -> D#4)
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

  // 발음 허용 범위: 핵심 단어 65% 이상 또는 오류 1단어 이내 통과
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHintText, setShowHintText] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpInput, setJumpInput] = useState("");
  const [speechSpeed, setSpeechSpeed] = useState(0.85);
  const [playingChunkIdx, setPlayingChunkIdx] = useState(null);

  const speechSpeedRef = useRef(0.85);
  useEffect(() => {
    speechSpeedRef.current = speechSpeed;
  }, [speechSpeed]);

  const displayItem = UNIT62_DATABASE[currentIndex] || UNIT62_DATABASE[0];

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
  
  const [speechSupported, setSpeechSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const userAudioPlayerRef = useRef(null);

  const isRecordingRef = useRef(false);
  const accumulatedSpeechRef = useRef("");

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
      evaluateSpeech(finalSpoken, displayItem.text);
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
  }, [displayItem.text]);

  const speakText = (text, rateOverride = null) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setPlayingChunkIdx(null);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rateOverride !== null ? rateOverride : speechSpeedRef.current;

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

  const playTargetAudio = () => {
    speakText(displayItem.text);
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
    utterance.rate = speechSpeedRef.current;

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
      const localResult = generateLocalFeedback(targetText, spokenText);
      setIsPerfect(localResult.isPerfect);
      setEvaluation(localResult.message);
      if (localResult.markedSpoken) {
        setMarkedSpoken(localResult.markedSpoken);
      }
      playSoundEffect(localResult.isPerfect ? 'success' : 'retry');
    } catch (err) {
      setEvaluation("발음을 인식했습니다. 다시 한번 또렷하게 시도해 보세요!");
      playSoundEffect('retry');
    } finally {
      setIsEvaluating(false);
    }
  };

  // 특정 문장 번호로 바로 이동 (자동으로 원어민 발음 재생)
  const jumpToSentence = (targetIdx) => {
    setUserSpeech("");
    setRecordedAudioUrl(null);
    setEvaluation(null);
    setIsPerfect(false);
    setMarkedSpoken("");
    setErrorMsg("");

    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      userAudioPlayerRef.current.currentTime = 0;
    }

    const safeIdx = Math.max(0, Math.min(UNIT62_DATABASE.length - 1, targetIdx));
    setCurrentIndex(safeIdx);
    speakText(UNIT62_DATABASE[safeIdx].text);
  };

  const handleNextSentence = () => {
    jumpToSentence((currentIndex + 1) % UNIT62_DATABASE.length);
  };

  const handlePrevSentence = () => {
    jumpToSentence((currentIndex - 1 + UNIT62_DATABASE.length) % UNIT62_DATABASE.length);
  };

  const handleJumpSubmit = (e) => {
    if (e) e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= UNIT62_DATABASE.length) {
      jumpToSentence(num - 1);
      setIsJumping(false);
    } else {
      setErrorMsg(`1번부터 ${UNIT62_DATABASE.length}번 사이의 번호를 입력해 주세요.`);
    }
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
        
        {/* 상단 컨트롤 바 */}
        <div className="bg-slate-900 border-b border-slate-800/80 px-3.5 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h1 className="font-bold text-sm text-white tracking-tight">Unit 62 Study</h1>
              <button
                type="button"
                onClick={() => {
                  setJumpInput(String(currentIndex + 1));
                  setIsJumping(true);
                }}
                title={`클릭하여 원하는 문장으로 이동 (1~${UNIT62_DATABASE.length})`}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 hover:border-indigo-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <span>#{currentIndex + 1} / {UNIT62_DATABASE.length}</span>
                <span className="text-[9px] text-indigo-400 font-bold">이동</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {/* 속도 토글 */}
              <button
                onClick={() => setSpeechSpeed(s => s === 0.7 ? 0.85 : s === 0.85 ? 1.0 : 0.7)}
                className="px-2 py-1 rounded text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
              >
                {speechSpeed === 0.7 ? '0.7x' : speechSpeed === 0.85 ? '0.85x' : '1.0x'}
              </button>
            </div>
          </div>
        </div>

        {/* 메인 섀도잉 및 피드백 통합 영역 */}
        <div className="p-3 sm:p-4 flex flex-col gap-2.5">

          {/* 원문 청크 표시 박스 */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                Unit 62 스크립트 원문
              </span>
              <button
                type="button"
                onClick={() => setShowHintText(prev => !prev)}
                title={showHintText ? "문장 표시 상태 (이동 시에도 유지)" : "문장 가림 상태 (이동 시에도 유지)"}
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

            {/* 청크 블록 (의미 단위 호흡 청크 / 터치 시 해당 청크 개별 발음) */}
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

            {/* 전후 문맥 및 현재 원문 하이라이트 표시 박스 */}
            {showHintText && (
              <div className="mt-2 p-3 rounded-xl bg-slate-900/95 border border-slate-800 text-left w-full text-xs flex flex-col gap-1.5 shadow-inner">
                {displayItem.prevContext && displayItem.prevContext.map((c, i) => (
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
                
                {displayItem.nextContext && displayItem.nextContext.map((c, i) => (
                  <p key={`next-${i}`} className="text-slate-500 leading-relaxed text-[11px] sm:text-xs">
                    {c}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 메인 컨트롤 4버튼 [이전 문장] [다시 듣기] [다음 문장] [따라 말하기] */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handlePrevSentence}
              className="py-2.5 px-1.5 rounded-xl font-bold text-[11px] sm:text-xs bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>이전</span>
            </button>

            <button
              onClick={playTargetAudio}
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
              <span>다음</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
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
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2.5 animate-in fade-in duration-200">
              
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
                    (evaluation && isPerfect) ? (
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
                            onClick={toggleRecording}
                            className="px-2.5 py-1 rounded text-[11px] font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center gap-1 transition-all active:scale-95"
                          >
                            <Mic className="w-3 h-3" />
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


        {/* 문장 이동 팝업 모달 */}
        {isJumping && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setIsJumping(false)}
          >
            <div 
              className="bg-slate-900 border border-slate-700 p-5 rounded-2xl max-w-xs w-full shadow-2xl flex flex-col gap-3.5"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">문장 바로 이동</h3>
                </div>
                <button 
                  onClick={() => setIsJumping(false)} 
                  className="text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-xs text-slate-400">
                이동할 번호 (1 ~ {UNIT62_DATABASE.length})를 입력하세요.
              </p>
              
              <form onSubmit={handleJumpSubmit} className="flex gap-2">
                <input 
                  type="number" 
                  min="1" 
                  max={UNIT62_DATABASE.length}
                  value={jumpInput} 
                  onChange={(e) => setJumpInput(e.target.value)} 
                  placeholder={`1 ~ ${UNIT62_DATABASE.length}`}
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

              {/* 빠른 구간 점프 버튼들 */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 font-semibold">빠른 이동:</span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {[1, 36, 60, UNIT62_DATABASE.length].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        jumpToSentence(num - 1);
                        setIsJumping(false);
                      }}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-all active:scale-95 ${
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
