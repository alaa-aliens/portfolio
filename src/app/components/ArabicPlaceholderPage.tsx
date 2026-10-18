import imgImage58 from "figma:asset/9c54594e5e8cffefd87aca83834a7588b7f814b9.png";
import { useMode } from "./ModeContext";
import { motion, AnimatePresence } from "motion/react";

/* ── Al-Mutanabbi poetry (shared across both modes) ── */
const professionalPoetry = `أنا الذي نظر الأعمى إلى أدبي
وأسمعت كلماتي من به صمم

كم تطلــــبون لنا عيـــــبًا فيعجزكم
ويكره المجد ما تأتون والكرم

ما أبعد العيب والنقصان عن شرفي
أنا الثّريا وذان الشيب والهرم

وإذا أتــــتك مذمتي من نـــــاقصٍ
فهي الشــــهادةُ لي بأني كامــلُ

أنام ملء جفونــــي عن شواردها
ويسهرُ الخلقُ جراها ويختصـم

غيري بأكثر هذا الناسِ ينخــــدعُ
إن قاتلوا جبنوا أو حدثّوا شجعوا

ولا الجمع بين الماء والنار في يدي
بأصعب من أن أجمع الجدَّ والفهما

وإني لمن قومٍ كأنّ نفوســـــــــَهم
بها أنفٌ أن تسكنَ اللحم والعظما

عدوك مذمـــــــــومٌ بكل لســــانِ
وإن كان من أعدائـِـــك القمـــران

ولله ســـــــرٌّ في عــُـــلاك وإنما
كلام العِـدا ضربٌ من الهذيـــــان

على قدرِ أهلِ العزمِ تأتي العزائمُ
وتأتي على قدرِ الكرامِ المكـــــارمُ

وتعظمُ في عينِ الصغيرِ صغاره
وتصغر في عينِ العــــظيمِ العظائمُ

لعل عتبَك محـــــــــــمودٌ عواقبه
فربّما صحّت الأجســــــــامُ بالعللِ`;

const funPoetry = `أنا الذي نظرَ المستخدمُ في واجهتي
فما تاهَ مسارٌ، ولا ضاعَتْ له الهِمَمُ

أزراريَ تعرفُ أينَ تذهبُ وحدَها
والنقرُ فيها بديهيٌّ بلا نَدَمُ

كم قالوا: "صعّبْ قليلًا" فقلتُ لهم
التعقيدُ عيبٌ، ومنهُ يولدُ السَّقَمُ

ما بينَ باگٍ ولا فلوٍ ولا كراشٍ
شاشتي نظيفةٌ، والباقي هُمُ الوَهَمُ

أنا الفِغما إذا ضاعَ الفريقُ بها
وأنا الديزاينُ إن ضلَّ الذي فَهِموا

وإن أتى النقدُ ممّن لا تجربةَ له
فذاك وسامٌ، بهِ المصمّمُ يُحتَرَمُ

أنامُ بعدَ التسليمِ مرتاحَ الضميرِ
ويصحو العميلُ يقولُ: "هذا هو النِّعَمُ"`;

const professionalMessage =
  "Meanwhile, I'm working on the Arabic version... hopefully it will be ready before we land a man on Mars.";

const funMessage =
  "Meanwhile, I'm working on the Arabic version... hopefully it'll be ready before I run out of Arabic poetry to show off. (Spoiler: I won't.)";

export function ArabicPlaceholderPage() {
  const { setLang, isProfessional, mode } = useMode();
  const message = isProfessional ? professionalMessage : funMessage;
  const poetry = isProfessional ? professionalPoetry : funPoetry;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center w-full pt-[110px] md:pt-[140px]"
      >
        {/* ── Poetry + Illustration row ── */}
        <div className="w-full max-w-[820px] px-6 flex flex-col items-center">
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2.5">
            {/* Poetry block */}
            <div className="relative w-full md:w-[395px] h-[420px] md:h-[516px] shrink-0 overflow-hidden pt-8">
              <div
                dir="rtl"
                className="font-['Noto_Naskh_Arabic',serif] text-[22px] md:text-[27px] leading-[35px] text-black text-center whitespace-pre-wrap px-2"
              >
                {poetry}
              </div>
              {/* Gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-[300px] md:h-[368px] bg-gradient-to-b from-transparent to-[#fdecd0] pointer-events-none" />
            </div>

            {/* Illustration — desktop */}
            <div className="hidden md:block w-[393px] h-[493px] relative shrink-0">
              <div className="absolute inset-0 overflow-hidden">
                <img
                  alt="Ala'a illustration"
                  className="absolute h-[204%] left-[-83%] top-0 w-[192%] max-w-none"
                  src={imgImage58}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[58%] to-[#fdecd0]" />
            </div>
          </div>

          {/* Illustration — mobile (below poetry) */}
          <div className="md:hidden w-[260px] h-[320px] relative shrink-0 -mt-24">
            <div className="absolute inset-0 overflow-hidden">
              <img
                alt="Ala'a illustration"
                className="absolute h-[204%] left-[-83%] top-0 w-[192%] max-w-none"
                src={imgImage58}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[50%] to-[#fdecd0]" />
          </div>

          {/* ── Message + Back button ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col items-center gap-5 mt-[21px] md:mt-[11px] relative z-10 pb-16 md:pb-20"
          >
            <p className="font-['IBM_Plex_Serif'] text-[18px] md:text-[24px] leading-[30px] md:leading-[32px] text-black text-center max-w-[634px]">
              {message}
            </p>
            <button
              onClick={() => {
                setLang("en");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="relative bg-white text-black px-5 py-2.5 font-['IBM_Plex_Serif'] text-[17px] md:text-[19px] border border-black shadow-[4px_4px_0px_0px_black] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_black] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_black] transition-all cursor-pointer"
            >
              Back to English
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}