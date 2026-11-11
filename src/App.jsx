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
  X
} from 'lucide-react';

// ============================================================================
// 1. 코스 데이터베이스 (Unit 53 ~ 72, 총 180 Episode x 15문장 구조)
// 청크 구분은 "|" 기호로 분리되어 개별 청크 터치 청취가 가능합니다.
// ============================================================================
const RAW_COURSE_DATA = {
  // ------------------ Unit 53 ------------------
  53: {
    1: {
      1: [
        ["Welcome to Saul’s Pizza!|What can I do for you?", "사울 피자에 오신 걸 환영합니다! 무엇을 도와드릴까요?"],
        ["I saw the sign|in your window.", "창문에 붙은 안내문을 봤어요."],
        ["That’s a special offer|for today only.", "오늘만 진행하는 특별 할인 행사입니다."],
        ["Two pizzas|for ten dollars.|That’s half price.", "피자 두 판에 10달러예요. 반값입니다."],
        ["What kinds of pizzas|are on sale?", "어떤 종류의 피자가 할인 중인가요?"],
        ["All of our cheese pizzas|and our pepperoni pizzas|are included in the deal.", "모든 치즈 피자와 페퍼로니 피자가 이번 행사에 포함됩니다."],
        ["I would like|two cheese pizzas, please.", "치즈 피자 두 판 부탁드립니다."],
        ["Would you like to try|our new spicy sauce?", "저희 신메뉴 매운 소스도 한번 드셔보시겠어요?"],
        ["I'm not a big fan|of spicy food.", "매운 음식을 별로 좋아하지 않아서요."],
        ["Are you hiring|any delivery drivers right now?", "혹시 지금 배달 기사를 구하고 계시나요?"],
        ["We are always looking for|reliable and hardworking people.", "저희는 항상 성실하고 믿을 수 있는 분들을 찾고 있습니다."],
        ["I have a clean driving record|and I know this area very well.", "저는 무사고 운전 경력이 있고 이 동네 지리도 아주 잘 압니다."],
        ["Fill out this application form|and leave it with me.", "이 지원서를 작성해서 저에게 제출해 주세요."],
        ["When will I be able to hear back|about the job?", "채용 결과는 언제쯤 들을 수 있을까요?"],
        ["I will review it today|and give you a call tomorrow.", "오늘 검토해 보고 내일 연락드리겠습니다."]
      ],
      2: [
        ["Congratulations!|You’re part of Saul’s Pizza family now.", "축하합니다! 이제 사울 피자의 가족이 되셨어요."],
        ["You’re responsible for|prepping the pizzas first.", "처음에는 피자 재료 준비를 담당하시게 됩니다."],
        ["Make sure the kitchen counter|is completely wiped down.", "주방 조리대를 완전히 깨끗하게 닦아두어야 합니다."],
        ["After everything is clean,|you need to report in to me.", "청소가 모두 끝나면 저에게 보고해 주세요."],
        ["Where should I put|these delivery bags?", "이 배달용 가방들은 어디에 두면 될까요?"],
        ["Stack them neatly|on the shelf by the door.", "문 옆에 있는 선반에 가지런히 쌓아 두세요."],
        ["Always check the customer's receipt|before you leave the store.", "가게를 나서기 전에 항상 고객 영수증을 확인하세요."],
        ["Safety is our top priority|when you are on the road.", "도로에서는 안전이 우리의 최우선 과제입니다."],
        ["Don't rush,|even if the order is running late.", "주문이 조금 늦어지더라도 서두르지 마세요."],
        ["Customers appreciate polite service|more than anything else.", "고객들은 무엇보다도 정중한 서비스를 가장 좋아합니다."],
        ["What should I do|if no one answers the door?", "벨을 눌러도 아무도 안 나오면 어떻게 해야 하나요?"],
        ["Try calling their phone number|listed on the slip.", "전표에 적힌 전화번호로 전화를 걸어보세요."],
        ["If they still don't answer,|bring the pizza back to the shop.", "그래도 받지 않으면 피자를 매장으로 다시 가져오세요."],
        ["You're doing great for your first day,|keep it up!", "첫날치고 아주 잘하고 있어요. 계속 힘내세요!"],
        ["I'm really enjoying learning|the ropes here.", "여기서 일하는 법을 배우는 게 정말 즐겁습니다."]
      ],
      3: [
        ["Schedule a 30-minute interview|with each of the applicants.", "각 지원자들과 30분 동안 전화 면접을 잡으세요."],
        ["During the call,|ask questions and take detailed notes.", "통화 중에 질문을 던지고 꼼꼼하게 메모를 남기세요."],
        ["Try to get more information|about their past experience.", "그들의 과거 경력에 대해 더 많은 정보를 파악하도록 하세요."],
        ["Do you prefer working alone|or as part of a team?", "혼자 일하는 걸 선호하시나요, 아니면 팀으로 일하는 걸 선호하시나요?"],
        ["Why do you think|you are qualified for this position?", "본인이 이 직책에 적합한 인재라고 생각하는 이유는 무엇인가요?"],
        ["Describe a challenging situation|and how you solved it.", "어려웠던 상황과 그것을 어떻게 해결했는지 설명해 주세요."],
        ["Punctuality and dedication|are essential for this role.", "시간 엄수와 헌신적인 태도가 이 역할에 필수적입니다."],
        ["I have always prided myself|on my work ethic.", "저는 항상 저의 성실한 직업윤리에 자부심을 가져왔습니다."],
        ["Can you work late shifts|on weekends if needed?", "필요할 경우 주말 야간 근무도 가능하신가요?"],
        ["My schedule is flexible,|so that won't be a problem.", "일정이 유동적이어서 문제없습니다."],
        ["We provide comprehensive training|for all new staff.", "저희는 모든 신입 직원을 위한 포괄적인 교육을 제공합니다."],
        ["When is the earliest date|you could start working?", "가장 빨리 출근할 수 있는 날짜는 언제인가요?"],
        ["I can start immediately|starting from next Monday.", "다음 주 월요일부터 즉시 시작할 수 있습니다."],
        ["We will notify the successful candidates|by Friday afternoon.", "합격자에게는 금요일 오후까지 개별 통보해 드리겠습니다."],
        ["Thank you very much|for your time and consideration.", "시간 내주시고 배려해 주셔서 대단히 감사합니다."]
      ]
    },
    2: { 1: [], 2: [], 3: [] },
    3: { 1: [], 2: [], 3: [] }
  },

  // ------------------ Unit 62 (제공해주신 실제 스크립트 기반) ------------------
  62: {
    1: {
      1: [
        ["I wouldn't do that|even if you paid me.", "돈을 준다 해도 그런 일은 안 할 거예요."],
        ["I will help you|only if you come with me.", "당신이 함께 가야만 도와드릴게요."],
        ["If you can't come with me,|then I can't help you find the murderer.", "같이 못 간다면 살인범을 찾는 걸 도울 수 없어요."],
        ["Don't eat too much, though.|You don't want to be tired for your fight scene.", "너무 많이 먹진 마요. 격투 장면에서 피곤하면 안 되잖아요."],
        ["I would eat a lot of food at lunch,|only if I were done filming for the day.", "오늘 촬영이 끝났다면 점심을 많이 먹을 텐데요."],
        ["Is my character going to have|more lines in the next episode?", "다음 에피소드에서 제 역할 대사가 더 늘어나나요?"],
        ["I'll make sure you have more lines,|even if I have to write the script myself.", "제가 직접 대본을 써서라도 대사를 늘려드릴게요."],
        ["The important thing|is for you|to not believe everything you read.", "중요한 건 읽는 걸 전부 믿지 않는 거야."],
        ["Eyewitnesses report that Dan Blaze|was hiding his spaceship in a warehouse|for nearly 20 years.", "목격자들에 따르면 댄 블레이즈는 거의 20년 동안 창고에 우주선을 숨겼대."],
        ["My hope is for my friends|to read great literature,|not tabloids like this.", "내 친구들이 이런 타블로이드 말고 훌륭한 문학을 읽었으면 해."],
        ["The important thing is for you|to admit that aliens could exist.", "중요한 건 외계인이 존재할 수도 있다고 인정하는 거야."],
        ["You can't always believe|everything you hear, LiLi.", "들은 걸 다 믿을 순 없어, 릴리."],
        ["The goal of the article|is for people to know|that he's been hiding here among us.", "이 기사의 목적은 그가 우리 사이에 숨어 있었다는 걸 알리는 거야."],
        ["It's possible that Dan Blaze and his alien friends|are trying to take over the world.", "댄 블레이즈와 외계인 친구들이 세계를 장악하려는 걸 수도 있어."],
        ["When you put it that way,|it is possible.", "그렇게 말하니 가능할 수도 있겠네."]
      ],
      2: [
        ["The important thing is for you|to understand that I'm just joking with you.", "중요한 건 내가 그냥 농담하는 거라는 걸 네가 이해하는 거야."],
        ["Why don't we eat lunch now|and argue about aliens later?", "지금 점심 먹고 외계인 얘기는 나중에 논쟁하자."],
        ["My main goal|is for us to agree.", "내 주된 목표는 우리가 의견을 맞추는 거야."],
        ["It's much better than working for my parents,|or finding a dead end job that leads nowhere.", "부모님 가게에서 일하거나 앞날 없는 막다른 직장을 찾는 것보다 훨씬 나아."],
        ["Sometimes, I barely get any sleep|because I'm working all the time.", "항상 일하느라 가끔은 거의 잠을 못 자."],
        ["I am writing in reference to an application|that I submitted for employment on your website.", "귀사 웹사이트에 제출한 입사 지원서와 관련해 글을 씁니다."],
        ["The position sounds both demanding and fulfilling,|and I would like to express my interest|in working for your company.", "이 직책은 힘들면서도 보람 있어 보이며, 귀사에서 일하고 싶은 마음을 전하고 싶습니다."],
        ["I'm applying for this position|because I believe I am an ideal candidate for your company.", "제가 귀사에 이상적인 지원자라고 믿기에 이 직책에 지원합니다."],
        ["If I can provide anything else to be considered for employment,|please do not hesitate to ask.", "채용 심사에 필요한 것이 더 있다면 언제든 말씀해 주십시오."],
        ["There are a lot of strict deadlines,|because the video game field is extremely competitive.", "비디오 게임 업계는 경쟁이 매우 치열해서 엄격한 마감이 많아."],
        ["However, the work is so rewarding that,|at the end of the day,|it's all worthwhile.", "하지만 일이 너무 보람 있어서 결국엔 다 가치가 있어."],
        ["It can be intimidating|because so many of my colleagues|have more experience than I do.", "동료 중에 나보다 경력이 많은 사람이 많아서 주눅이 들 수 있어."],
        ["And regardless of the challenges this job might present,|I remind myself how much happier I am working there|than at my parents' store.", "이 일이 어떤 어려움을 주든, 부모님 가게보다 얼마나 행복한지 되새겨."],
        ["So, were you nervous|when you first started on the job?", "처음 일을 시작했을 때 긴장했어?"],
        ["I had been so busy rehearsing my lines for weeks|that I forgot|that I had been in medical school.", "몇 주간 대사 연습에 너무 바빠서 의대에 다녔다는 사실도 잊었어."]
      ],
      3: [
        ["I have been working on the show for so long|that I've become very comfortable.", "그 쇼를 너무 오래 해서 아주 편해졌어."],
        ["Being on a television show|is the most fulfilling thing I've ever done.", "TV 쇼에 출연하는 건 내가 한 일 중 가장 보람 있어."],
        ["I had been wondering|if I was doing the right thing with my life|for months.", "내 인생을 제대로 살고 있는지 몇 달째 고민하고 있었어."],
        ["But getting this job|proved that I'm exactly where I need to be.", "하지만 이 일을 얻은 덕에 내가 있어야 할 곳에 있다는 게 증명됐어."],
        ["There was a girl I knew|that had been living in the States for 12 years|before she ever watched an episode of a TV show.", "아는 애가 미국에 12년 살면서 TV 쇼를 한 편도 본 적 없었어."],
        ["White collar workers are businessmen or professionals|who have careers.", "화이트칼라 노동자는 커리어를 가진 사업가나 전문직 종사자야."],
        ["Blue collar workers are all the other people with regular jobs,|like plumbers and construction workers.", "블루칼라 노동자는 배관공이나 건설 노동자 같은 나머지 일반 직종 사람들이야."],
        ["I'll watch your entire series|if you play one of the video games|that I designed.", "네가 내가 디자인한 게임을 해주면 네 드라마를 전부 볼게."],
        ["The last time I played video games with you,|I got addicted.", "지난번에 너랑 게임했을 때 중독됐거든."],
        ["Thank you for coming in|to interview at Ultimate Video Games today.", "오늘 얼티밋 비디오 게임즈 면접에 와주셔서 감사합니다."],
        ["I had only been waiting|for around 10 minutes|before you arrived.", "당신이 오시기 전까지 10분 정도밖에 기다리지 않았습니다."],
        ["Well, I'm currently a game designer at the game design studio,|where I work on the graphics for new games.", "현재 게임 디자인 스튜디오에서 신작 그래픽을 맡고 있는 게임 디자이너입니다."],
        ["I'd love the chance to tackle some larger projects|and progress my career|with a larger organization.", "더 큰 조직에서 더 큰 프로젝트에 도전하며 경력을 쌓고 싶습니다."],
        ["I attended Pembroke University|and graduated with a bachelor's in game design.", "펨브로크 대학교에서 게임 디자인 학사를 받고 졸업했습니다."],
        ["I am confident that I am the best person for this job|because I'm extremely hardworking and dedicated.", "저는 매우 성실하고 헌신적이라 이 일에 가장 적합하다고 확신합니다."]
      ]
    },
    2: {
      1: [
        ["If you weren't so arrogant,|you would have prepared this correctly.", "네가 그렇게 오만하지 않았다면 이걸 제대로 준비했을 텐데."],
        ["Sophie,|what does this look like to you?", "소피, 이게 네 눈엔 어떻게 보이니?"],
        ["There is parsley on top of the plate,|and I didn't authorize you to use parsley on our entrees.", "접시 위에 파슬리가 있는데, 난 메인 요리에 파슬리를 쓰라고 허락한 적 없어."],
        ["If you weren't so dumb,|you would have remembered that.", "네가 그렇게 멍청하지 않았다면 그걸 기억했을 텐데."],
        ["I'm sorry.|I thought it would help with the presentation.", "죄송해요. 플레이팅에 도움이 될 줄 알았어요."],
        ["I think you're saying|my technique is dull.", "내 기술이 따분하다고 말하는 것 같네."],
        ["I just thought it was okay,|because a lot of other restaurants use parsley.", "다른 식당들도 파슬리를 많이 써서 괜찮다고 생각했어요."],
        ["I've told you many times,|we do things my way here.", "여기선 내 방식대로 한다고 여러 번 말했잖아."],
        ["If you were smart,|you would have paid better attention to me.", "네가 똑똑했다면 내 말에 더 귀 기울였을 텐데."],
        ["If I didn't know better,|I would think you're rolling your eyes at me.", "내가 모르는 사람이었다면 네가 나한테 눈을 굴린다고 생각했을 거야."],
        ["If it were just a little mistake,|I wouldn't have come in here to yell at you.", "사소한 실수였다면 내가 여기 와서 소리 지르지 않았겠지."],
        ["You don't have to|yell at me.", "저한테 소리 지르지 않으셔도 돼요."],
        ["If I yelled at you more,|you would have paid attention to me.", "내가 더 소리를 질렀다면 너도 내 말을 들었을 텐데."],
        ["If someone were allergic to parsley,|they could be dead now.", "누군가 파슬리 알레르기가 있었다면 지금쯤 죽었을 수도 있어."],
        ["I don't think parsley|has ever killed anyone, Nadi.", "파슬리가 누구를 죽인 적은 없을 것 같은데요, 나디."]
      ],
      2: [
        ["Well, a customer sent this dish back.|So he must be allergic.", "손님이 이 요리를 돌려보냈어. 그러니 알레르기가 있는 게 분명해."],
        ["If he was happy with the dish the way you prepared it,|he wouldn't have sent it back.", "네가 만든 요리에 만족했다면 돌려보내지 않았겠지."],
        ["Stop questioning me.|I'm still the boss.", "나한테 따지지 마. 내가 아직 사장이야."],
        ["Did you forget|who the boss is here?", "여기서 누가 사장인지 잊었니?"],
        ["But is parsley|really worth getting so upset about?", "하지만 파슬리가 그렇게 화낼 만한 일인가요?"],
        ["Since this is so difficult for you to understand,|why don't you come to the dining room with me?", "이해하기 그렇게 어려우니 나랑 홀로 가보는 게 어때?"],
        ["The customer should meet|the person responsible for ruining his food.", "손님은 자기 음식을 망친 책임자를 만나야 해."],
        ["I'm sorry to interrupt you,|but I have an announcement to make.", "방해해서 죄송하지만 공지할 게 있습니다."],
        ["I wanted my chef|to see the customer she had disappointed.", "제 셰프가 자신이 실망시킨 손님을 직접 보게 하고 싶었어요."],
        ["You might be the last customer|she ever serves at this restaurant.", "당신이 그녀가 이 식당에서 응대하는 마지막 손님일지도 몰라요."],
        ["Can this be taken to mean|you're firing me?", "이게 저를 해고하신다는 뜻으로 받아들여도 되나요?"],
        ["Sir, you sent your dish back|because there was parsley on it.", "손님, 파슬리가 있어서 요리를 돌려보내셨죠."],
        ["Actually, I just wanted to order the steak|instead of the chicken.", "사실 닭고기 대신 스테이크를 시키고 싶었을 뿐이에요."],
        ["In other words,|it has nothing to do with the parsley.", "다시 말해, 파슬리와는 아무 상관이 없군요."],
        ["This means that|you owe Sophie an apology.", "이 말은 당신이 소피에게 사과해야 한다는 뜻입니다."]
      ],
      3: [
        ["You should apologize to everyone here|for interrupting our meals|to yell at an innocent employee.", "죄 없는 직원에게 소리 지르려고 식사를 방해한 것을 여기 모두에게 사과해야 합니다."],
        ["Sir, this conversation is between me and my employee.|In other words, it's private.", "손님, 이건 저와 직원 사이의 대화입니다. 다시 말해 사적인 얘기예요."],
        ["This is no way|to run a restaurant.", "이건 식당을 운영하는 방식이 아니에요."],
        ["She's a good girl,|with twice the talent you'll ever have.", "그 애는 착한 아이고, 당신보다 두 배는 재능이 있어요."],
        ["Can that be taken to mean|you own this restaurant?", "그 말이 이 식당의 주인이라는 뜻으로 받아들여도 되나요?"],
        ["I don't want to see your face|in this restaurant ever again.", "다시는 이 식당에서 네 얼굴을 보고 싶지 않아."],
        ["Because I'm never coming back.|In other words, I quit.", "난 다시는 안 돌아올 테니까요. 다시 말해, 그만두겠어요."],
        ["I've just always wanted|to fire somebody like that.", "저런 사람을 해고해 보는 게 늘 소원이었어."],
        ["Losing a job|can be a difficult time for everyone.", "실직은 누구에게나 힘든 시기일 수 있습니다."],
        ["It is important for you to remember|that it is not the end of the world.", "세상이 끝난 게 아니라는 점을 기억하는 것이 중요합니다."],
        ["People lose their jobs all the time,|but they always manage to find something new and often better.", "사람들은 늘 일자리를 잃지만 결국 새롭고 종종 더 나은 일을 찾아냅니다."],
        ["The first thing for you to decide|is if you want to find a similar job|or want a change of career.", "가장 먼저 결정할 것은 비슷한 일을 찾을지, 진로를 바꿀지입니다."],
        ["If you decide to stay in the same career,|you will already have many of the skills and qualifications.", "같은 분야에 남기로 한다면 이미 많은 기술과 자격을 갖추고 있을 것입니다."],
        ["However, changing careers|can often be a good thing after losing a job.", "하지만 실직 후 진로를 바꾸는 것은 종종 좋은 일이 될 수 있습니다."],
        ["Even if you have to work long hours,|the time will pass much more quickly|when you are doing something you love.", "오래 일해야 하더라도 좋아하는 일을 하면 시간이 훨씬 빨리 갑니다."]
      ]
    },
    3: {
      1: [
        ["It says here|that you want to interview for the position of president of the company.", "여기 보니 회사 사장직 면접을 원하신다고 되어 있네요."],
        ["I'm the ideal candidate|to run this company.", "제가 이 회사를 이끌 이상적인 후보입니다."],
        ["You can't be the president of this company,|no matter what your strengths are.", "강점이 무엇이든 당신은 이 회사의 사장이 될 수 없어요."],
        ["Because Kay and I are the heads of the company.|We founded it.", "케이와 제가 회사의 대표니까요. 저희가 창립했습니다."],
        ["Also, it looks like|you have no relevant experience for working at this company.", "게다가 이 회사에서 일할 관련 경력도 없어 보이네요."],
        ["I should have known better|than to come here today.", "오늘 여기 오지 말았어야 했어요."],
        ["That was the strangest thing|I've ever seen.", "내가 본 중 가장 이상한 일이었어."],
        ["You're here to interview|for the management position.", "관리직 면접을 보러 오셨군요."],
        ["Tell me, what are your primary strengths|and weaknesses in the workplace?", "직장에서의 주된 강점과 약점이 무엇인지 말씀해 주세요."],
        ["I would say|my biggest strength|is my attention to detail.", "제 가장 큰 강점은 세부 사항에 대한 집중력이라고 말씀드리고 싶습니다."],
        ["My weakness|is that I'm a perfectionist.", "제 약점은 제가 완벽주의자라는 점입니다."],
        ["I think perfectionism can be a weakness,|because sometimes it can slow you down.", "완벽주의는 때로 속도를 늦추기 때문에 약점이 될 수 있다고 생각합니다."],
        ["I wouldn't change that about myself,|because it ensures I'm precise with my work.", "일을 정확하게 하게 해주기 때문에 그 점은 바꾸고 싶지 않습니다."],
        ["Would you like to discuss some of your relevant work experience|for the position you're interviewing for?", "지원 직책과 관련된 업무 경험을 이야기해 주시겠어요?"],
        ["I actually don't have much relevant experience|in management.", "사실 관리직 관련 경험은 많지 않습니다."]
      ],
      2: [
        ["Why were you|so rude to him?", "왜 그에게 그렇게 무례했어요?"],
        ["I think experience is more important than education.", "저는 경력이 학력보다 더 중요하다고 생각해요."],
        ["A solid track record in the industry|is necessary.", "업계에서의 탄탄한 실적이 필요해요."],
        ["Education is just as important|as relevant experience.", "학력도 관련 경력만큼 중요해요."],
        ["If that's true,|then why was that last candidate unemployed?", "그게 사실이라면 왜 마지막 지원자는 실업자였죠?"],
        ["If education was so important,|he would have a job already.", "학력이 그렇게 중요했다면 그는 이미 취직했을 거예요."],
        ["He doesn't have a job|because employers value experience.", "고용주들이 경력을 중시해서 그는 일자리가 없는 거예요."],
        ["Just imagine if we staffed our company|with a bunch of kids, with no experience.", "경험 없는 애송이들로만 회사를 채운다고 상상해 보세요."],
        ["What if we only hired|people just out of college?", "갓 대학을 졸업한 사람들만 뽑으면 어떨까요?"],
        ["We'd waste time|helping them with simple tasks.", "간단한 업무를 도와주느라 시간을 낭비하게 될 거예요."],
        ["If that were the case,|then no one would ever get hired after college.", "그렇다면 졸업 후에 아무도 취직하지 못할 거예요."],
        ["Let's assume|we hired a bunch of young people with no experience.", "경험 없는 젊은이들을 잔뜩 뽑았다고 가정해 봅시다."],
        ["They would be so excited to have jobs|that they'd work extra hard for us.", "일자리를 얻은 게 너무 기뻐서 우리를 위해 더 열심히 일할 거예요."],
        ["If that were true,|then it would be a good idea,|but I'm not convinced.", "그게 사실이라면 좋은 생각이겠지만 저는 아직 확신이 안 서요."],
        ["The People company|is about compromise.", "피플 컴퍼니는 타협을 중시하는 회사예요."]
      ],
      3: [
        ["I was very interested in your recent article|about what to do if you lose your job.", "실직했을 때 어떻게 해야 하는지에 대한 최근 기사를 매우 흥미롭게 읽었습니다."],
        ["I was recently made redundant by my employer,|and I'm searching for a new job.", "최근 회사에서 정리해고되어 새 일자리를 찾고 있습니다."],
        ["I was wondering if you could pass on some pointers|on what to do for and during the interview.", "면접 준비와 면접 중에 무엇을 해야 하는지 조언을 주실 수 있을까요?"],
        ["I'm sorry to hear that you were made redundant,|but try to think of it as an opportunity.", "정리해고되셨다니 안타깝지만 기회라고 생각해 보세요."],
        ["There are a number of things you can do|to make yourself more attractive to employers.", "고용주에게 더 매력적으로 보이기 위해 할 수 있는 일이 여러 가지 있습니다."],
        ["It is very important for you|to make a good impression|before the interview.", "면접 전에 좋은 인상을 남기는 것이 매우 중요합니다."],
        ["When you send your cover letter to the company,|make sure you write it in a formal style.", "회사에 자기소개서를 보낼 때는 반드시 격식 있는 문체로 쓰세요."],
        ["Don't use contractions, such as it's or I'm,|in your cover letter.", "자기소개서에는 it's나 I'm 같은 축약형을 쓰지 마세요."],
        ["During interviews,|the main thing for you to focus on|is highlighting your strengths.", "면접 중 집중할 핵심은 자신의 강점을 부각하는 것입니다."],
        ["Try to match your strengths|to the job you are applying for.", "자신의 강점을 지원하는 직무에 맞추려고 하세요."],
        ["Give examples|that demonstrate you have the strengths that make you the ideal candidate.", "이상적인 지원자가 되게 하는 강점이 있음을 보여주는 사례를 드세요."],
        ["You should also prepare|how to respond if the interviewers ask about your weaknesses.", "면접관이 약점을 물을 때 어떻게 답할지도 준비해야 합니다."],
        ["Tell the interviewer|what you have accomplished in your previous jobs.", "이전 직장에서 이룬 성과를 면접관에게 말하세요."],
        ["When the interview finishes,|make sure you thank the interviewer.", "면접이 끝나면 반드시 면접관에게 감사 인사를 하세요."],
        ["I hope that this helps you,|good luck with the rest of your job search.", "도움이 되었길 바라며, 남은 구직 활동에 행운을 빕니다."]
      ]
    }
  },

  // ------------------ Unit 72 (마지막 챕터 실전 스크립트) ------------------
  72: {
    1: { 1: [], 2: [], 3: [] },
    2: { 1: [], 2: [], 3: [] },
    3: {
      1: [
        ["I'm sure Marco won't mind|that I used his soccer jersey|to clean my living room.", "마르코의 축구 유니폼으로 거실을 청소했다고 해도 그가 신경 쓰진 않을 거야."],
        ["Am I interrupting?|Just doing a little cleaning.", "제가 방해한 건 아니죠? 청소 좀 하던 중이었어요."],
        ["Well, I'm still in the early stages.|Can I offer you a soda?", "아직 청소 초기 단계예요. 탄산음료 하나 드릴까요?"],
        ["I was wondering if you wanted to come over|and watch the game tonight.", "오늘 밤 저희 집에 와서 같이 축구 경기 보실래요?"],
        ["Marco invited a few friends from work,|so it should be fun.", "마르코가 직장 동료들을 몇 명 초대해서 재미있을 거예요."],
        ["I would love to,|as long as I finish cleaning this place up first.", "여기 청소를 먼저 다 끝낼 수만 있다면 정말 가고 싶어요."],
        ["Do you need any help|putting these boxes away?", "이 상자들 치우는 것 좀 도와드릴까요?"],
        ["That's very kind of you,|could you pass me that dust rag?", "정말 친절하시네요, 저기 먼지떨이 걸레 좀 건네주시겠어요?"],
        ["Wait a minute,|isn't this Marco's favorite limited edition jersey?", "잠시만요, 이거 마르코가 제일 아끼는 한정판 유니폼 아닌가요?"],
        ["He left it on the chair,|so I assumed it was an old rag.", "의자 위에 널브러져 있길래 낡은 걸레인 줄 알았죠."],
        ["He's going to be so devastated|when he finds out.", "그가 이 사실을 알면 완전히 충격받을 텐데요."],
        ["Let's quickly wash it|and pretend nothing happened.", "얼른 빨아서 아무 일도 없었던 것처럼 모른 척해요."],
        ["I don't think laundry detergent|can wash away floor grease completely.", "세탁 세제로 바닥 기름때를 완전히 지울 수 있을 것 같진 않은데요."],
        ["We have to buy him a new one|before the game starts.", "경기 시작하기 전에 새것을 하나 사다 줘야겠어요."],
        ["Good luck finding one,|they were sold out everywhere!", "구할 수 있길 빌어요, 그거 전 매장에서 매진됐었거든요!"]
      ],
      2: [],
      3: []
    }
  }
};

// 180개 에피소드 중 데이터가 채워지지 않은 Unit/Lesson/Episode에 대한 지능형 자동 백업 생성기
// (사용자가 추가 데이터를 붙여넣기 전에도 모든 180개 에피소드가 에러 없이 즉시 구동됩니다)
const getEpisodeSentences = (unit, lesson, episode) => {
  const existing = RAW_COURSE_DATA[unit]?.[lesson]?.[episode];
  if (existing && existing.length > 0) {
    return existing;
  }
  // 기본 학습 문장 15개 자동 생성 템플릿
  return [
    [`Welcome to Unit ${unit} Lesson ${lesson}|Episode ${episode} speaking practice.`, `Unit ${unit} Lesson ${lesson} Episode ${episode} 스피킹 연습에 오신 것을 환영합니다.`],
    ["Consistent daily practice|is the key to English fluency.", "꾸준한 매일의 연습이 영어 유창성의 핵심입니다."],
    ["Focus on the rhythm and intonation|rather than individual words.", "개별 단어보다는 리듬과 억양에 집중해 보세요."],
    ["Make sure you enunciate clearly|at the end of every sentence.", "모든 문장의 끝을 또렷하게 발음하도록 신경 쓰세요."],
    ["Speaking out loud|helps build natural muscle memory.", "소리 내어 말하는 것은 자연스러운 입 근육 기억을 만듭니다."],
    ["Listen carefully to the native rhythm|and mimic the pitch changes.", "원어민의 리듬을 주의 깊게 듣고 음조의 변화를 흉내 내보세요."],
    ["Do not hesitate to repeat each chunk|until it feels natural.", "자연스럽게 느껴질 때까지 각 청크를 반복하는 것을 주저하지 마세요."],
    ["Confidence is just as important|as accurate grammar in conversation.", "회화에서는 정확한 문법만큼이나 자신감이 중요합니다."],
    ["Try to speak at a steady pace|without pausing too often.", "너무 자주 멈추지 않고 일정한 속도로 말하도록 노력해 보세요."],
    ["Shadowing along with the audio|will dramatically improve your accent.", "오디오를 따라 섀도잉하면 억양이 획기적으로 개선됩니다."],
    ["Every mistake is a valuable step|toward fluent communication.", "모든 실수는 유창한 의사소통으로 나아가는 소중한 한 걸음입니다."],
    ["Break the long sentences into small breath units|as marked.", "표시된 대로 긴 문장을 작은 호흡 단위로 끊어서 연습하세요."],
    ["Notice how the words connect smoothly|between adjacent sounds.", "단어들이 인접한 소리 사이에서 어떻게 매끄럽게 연음되는지 주목하세요."],
    ["You are making tremendous progress|with every single repetition.", "한 번 반복할 때마다 여러분은 엄청난 발전을 이루고 있습니다."],
    ["Review this episode regularly|to make these expressions your own.", "이 표현들을 온전히 여러분의 것으로 만들기 위해 정기적으로 복습하세요."]
  ];
};

const joinChunks = (row) => row[0].split("|").join(" ");

// 브라우저 최적 코덱 감지 (iOS Safari: mp4/aac, Android/PC: webm)
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

// Web Audio API 효과음 (통과 화음 / 재도전 차임)
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
  // 코스 위치 상태 (Unit 53~72, Lesson 1~3, Episode 1~3)
  const [selectedUnit, setSelectedUnit] = useState(62);
  const [selectedLesson, setSelectedLesson] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 모달 제어 상태
  const [isCoursePickerOpen, setIsCoursePickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState('unit'); // 'unit', 'lesson', 'episode'
  const [showHintText, setShowHintText] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpInput, setJumpInput] = useState("");
  const [speechSpeed, setSpeechSpeed] = useState(0.85);
  const [playingChunkIdx, setPlayingChunkIdx] = useState(null);

  const speechSpeedRef = useRef(0.85);
  useEffect(() => {
    speechSpeedRef.current = speechSpeed;
  }, [speechSpeed]);

  // 현재 선택된 Episode 데이터베이스 구축 (15문장 & 전후 문맥 자동 계산)
  const episodeDatabase = useMemo(() => {
    const rawList = getEpisodeSentences(selectedUnit, selectedLesson, selectedEpisode);
    return rawList.map((row, i) => ({
      id: i + 1,
      text: joinChunks(row),
      chunks: row[0].split("|"),
      translation: row[1],
      prevContext: rawList.slice(Math.max(0, i - 2), i).map(joinChunks),
      nextContext: rawList.slice(i + 1, i + 3).map(joinChunks)
    }));
  }, [selectedUnit, selectedLesson, selectedEpisode]);

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
  
  const [speechSupported, setSpeechSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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

    const safeIdx = Math.max(0, Math.min(episodeDatabase.length - 1, targetIdx));
    setCurrentIndex(safeIdx);
    speakText(episodeDatabase[safeIdx].text);
  };

  const handleNextSentence = () => {
    if (currentIndex + 1 < episodeDatabase.length) {
      jumpToSentence(currentIndex + 1);
    } else {
      // 에피소드 마지막 15번 문장 완료 시 다음 에피소드로 이동 안내
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

  const handlePrevSentence = () => {
    jumpToSentence((currentIndex - 1 + episodeDatabase.length) % episodeDatabase.length);
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
          <p className="text-slate-400 text-xs">Chrome 또는 Safari 최신 브라우저를 이용해 주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 font-sans antialiased">
      <div className="w-full max-w-lg bg-slate-900/95 border border-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* ================= 상단 통합 네비게이션 헤더 ================= */}
        <div className="bg-slate-900 border-b border-slate-800/80 px-3.5 py-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            
            {/* 코스 선택 트리거 버튼 */}
            <button
              type="button"
              onClick={() => setIsCoursePickerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white hover:border-indigo-400 hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <div className="flex items-center gap-1 text-xs font-bold">
                <span className="text-indigo-300">Unit {selectedUnit}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-200">L{selectedLesson}</span>
                <span className="text-slate-500">·</span>
                <span className="text-emerald-400">Ep {selectedEpisode}</span>
              </div>
              <span className="text-[10px] ml-1 px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-medium">선택</span>
            </button>

            {/* 문장 인덱스 & 음성 속도 컨트롤 */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setJumpInput(String(currentIndex + 1));
                  setIsJumping(true);
                }}
                className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-indigo-300 hover:border-indigo-400 transition-all flex items-center gap-1 active:scale-95"
              >
                <span>#{currentIndex + 1} / {episodeDatabase.length}</span>
              </button>

              <button
                onClick={() => setSpeechSpeed(s => s === 0.7 ? 0.85 : s === 0.85 ? 1.0 : 0.7)}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
              >
                {speechSpeed === 0.7 ? '0.7x' : speechSpeed === 0.85 ? '0.85x' : '1.0x'}
              </button>
            </div>

          </div>
        </div>

        {/* ================= 메인 섀도잉 및 음성 연습 영역 ================= */}
        <div className="p-3 sm:p-4 flex flex-col gap-2.5">

          {/* 원문 청크 표시 박스 */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                Unit {selectedUnit} · Lesson {selectedLesson} · Episode {selectedEpisode}
              </span>
              <button
                type="button"
                onClick={() => setShowHintText(prev => !prev)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all ${
                  showHintText 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {showHintText ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                <span>{showHintText ? '원문 ON' : '원문 가림'}</span>
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
              💡 청크를 탭하면 호흡 단위별 원어민 발음을 개별 청취할 수 있습니다.
            </p>

            {/* 전후 문맥 및 현재 원문 표시 */}
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

          {/* 메인 컨트롤 4버튼 */}
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
              <span>{currentIndex + 1 === episodeDatabase.length ? "다음 에피소드" : "다음"}</span>
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

          {/* 녹음 결과 및 실시간 피드백 */}
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
                        <div className="text-emerald-300 font-bold">"{userSpeech}"</div>
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

        {/* ================= 3단계 코스 선택 모달 (Unit / Lesson / Episode) ================= */}
        {isCoursePickerOpen && (
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-in fade-in duration-150"
            onClick={() => setIsCoursePickerOpen(false)}
          >
            <div 
              className="bg-slate-900 border border-slate-700 p-4 sm:p-5 rounded-2xl max-w-sm w-full shadow-2xl flex flex-col gap-3.5 max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">학습 코스 선택</h3>
                </div>
                <button 
                  onClick={() => setIsCoursePickerOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 3단계 탭 버튼 */}
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPickerTab('unit')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    pickerTab === 'unit' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Unit {selectedUnit}
                </button>
                <button
                  type="button"
                  onClick={() => setPickerTab('lesson')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    pickerTab === 'lesson' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Lesson {selectedLesson}
                </button>
                <button
                  type="button"
                  onClick={() => setPickerTab('episode')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    pickerTab === 'episode' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Ep {selectedEpisode}
                </button>
              </div>

              {/* 탭 1: Unit 선택 그리드 (Unit 53 ~ 72) */}
              {pickerTab === 'unit' && (
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] text-slate-400">학습할 Unit을 선택하세요 (53~72):</p>
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
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-500/30'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                        }`}
                      >
                        Unit {u}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 탭 2: Lesson 선택 (Lesson 1, 2, 3) */}
              {pickerTab === 'lesson' && (
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] text-slate-400">Unit {selectedUnit}의 Lesson을 선택하세요:</p>
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
                        className={`py-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                          selectedLesson === l
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-500/30'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                        }`}
                      >
                        <span>Lesson {l}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 탭 3: Episode 선택 (Episode 1, 2, 3) */}
              {pickerTab === 'episode' && (
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] text-slate-400">Unit {selectedUnit} - Lesson {selectedLesson}의 Episode (각 15문장):</p>
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
                        className={`p-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
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

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsCoursePickerOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
                >
                  닫기
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= 문장 바로 이동 팝업 모달 ================= */}
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
                  <h3 className="text-sm font-bold text-white">문장 번호 이동</h3>
                </div>
                <button 
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
                <span className="text-[10px] text-slate-500 font-semibold">빠른 번호:</span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {[1, 5, 10, 15].map((num) => (
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
