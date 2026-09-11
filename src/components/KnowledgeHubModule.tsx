import React, { useState } from 'react';
import { 
  BookOpen, 
  Sprout, 
  HeartPulse, 
  Droplets, 
  ShieldCheck, 
  Volume2, 
  ArrowLeft,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';

interface KnowledgeHubProps {
  language: Language;
  onBack: () => void;
}

export const KnowledgeHubModule: React.FC<KnowledgeHubProps> = ({
  language,
  onBack,
}) => {
  const [selectedCat, setSelectedCat] = useState<'all' | 'crop' | 'animal' | 'water' | 'soil'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const ARTICLES = [
    {
      id: 'art-1',
      category: 'crop',
      titleHi: 'कपास में गुलाबी सुंडी (Pink Bollworm) की पहचान व नियंत्रण',
      titleMr: 'कपाशीवरील गुलाबी बोंडअळी ओळख व एकात्मिक नियंत्रण',
      titleEn: 'Identification and IPM Control of Pink Bollworm in Cotton',
      summaryHi: 'फूल व बोंड निकलने के समय फेरोमोन ट्रैप (Pheromone Trap) 5 प्रति एकड़ लगाएं। नीम का तेल 1500 ppm का छिड़काव शुरुआती प्रकोप रोकता है।',
      summaryMr: 'फुलधारणा व बोंड लागतेवेळी एकरी ५ कामगंध सापळे लावावेत. निंबोळी अर्क ५% किंवा १५०० पीपीएम नीम तेलाची फवारणी फायदेशीर ठरते.',
      summaryEn: 'Install 5 pheromone traps per acre during squaring. Spray 1500 ppm neem oil early to prevent larval entry into young bolls.',
    },
    {
      id: 'art-2',
      category: 'crop',
      titleHi: 'टमाटर में अगेती व पछेती झुलसा (Early & Late Blight)',
      titleMr: 'टोमॅटोवरील करपा (अगेती व पछेती) रोग नियंत्रण',
      titleEn: 'Early and Late Blight in Tomato Leaves',
      summaryHi: 'पत्तियों पर भूरे छल्लेदार धब्बे दिखने पर कॉपर ऑक्सीक्लोराइड 2.5 ग्राम प्रति लीटर पानी में मिलाकर छिड़कें। पौधों में हवा का आवागमन बनाए रखें।',
      summaryMr: 'पानांवर तपकिरी वाटोळे ठिपके दिसताच कॉपर ऑक्सिक्लोराईड २.५ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारावे. वाफ्यामध्ये हवा खेळती ठेवावी.',
      summaryEn: 'Circular concentric brown target lesions. Apply copper oxychloride at 2.5 g/L and ensure balanced spacing for ventilation.',
    },
    {
      id: 'art-3',
      category: 'animal',
      titleHi: 'दुधारू गाय-भैंस में थनैला (Mastitis) की समय पर पहचान',
      titleMr: 'दुभत्या जनावरांमधील मस्टायटीस (स्तनदाह) आजार व काळजी',
      titleEn: 'Early Detection and Prevention of Bovine Mastitis',
      summaryHi: 'दूध निकालने से पहले और बाद में थनों को पोटाश (KMNO4) के हल्के घोल से धोएं। फर्श को सूखा रखें। दूध में थक्के या खून दिखते ही पशु चिकित्सक से संपर्क करें।',
      summaryMr: 'दूध काढण्यापूर्वी व नंतर सड पोटॅशच्या सौम्य पाण्याने धुवावेत. गोठा स्वच्छ व कोरडा ठेवावा. दूध फाटल्यासारखे किंवा रक्त आल्यास तातडीने पशुवैद्यकांचा सल्ला घ्यावा.',
      summaryEn: 'Dip teats in antiseptic solution pre and post milking. Keep shed flooring dry. Isolate cow immediately upon detecting milk clots.',
    },
    {
      id: 'art-4',
      category: 'animal',
      titleHi: 'लंपी स्किन रोग (Lumpy Skin Disease) से बचाव व टीकाकरण',
      titleMr: 'लम्पी त्वचा रोग (Lumpy Skin) प्रतिबंध व लसीकरण',
      titleEn: 'Lumpy Skin Disease Biosecurity and Goat Pox Vaccination',
      summaryHi: 'त्वचा पर 2-5 सेमी की गांठें दिखने पर संक्रमित पशु को अलग करें। गोट पॉक्स वैक्सीन (Goat Pox Vaccine) लगवाएं। मक्खी-मच्छर नियंत्रण के लिए नीम धुआं करें।',
      summaryMr: 'त्वचेवर गाठी दिसल्यास आजारी जनावरास त्वरित वेगळे बांधावे. गोट पॉक्स लस वेळेवर टोचावी. गोचीड व डास नियंत्रणासाठी गोठ्यात कडुलिंबाचा धूर करावा.',
      summaryEn: 'Isolate suspected cattle immediately. Administer Goat Pox vaccine as advised by state veterinary department. Control vector biting flies.',
    },
    {
      id: 'art-5',
      category: 'soil',
      titleHi: 'जीवामृत बनाने की विधि और मिट्टी में जैविक कार्बन वृद्धि',
      titleMr: 'जीवामृत तयार करण्याची कृती व जमिनीचा सेंद्रिय कर्ब',
      titleEn: 'Jiwamrit Bio-Formulation to Restore Soil Organic Carbon',
      summaryHi: '10 किग्रा देसी गाय का गोबर, 10 लीटर गोमूत्र, 1 किग्रा गुड़, 1 किग्रा बेसन और खेत की मेड़ की एक मुट्ठी मिट्टी को 200 लीटर पानी में 48 घंटे फर्मेंट करें।',
      summaryMr: '१० किलो देशी गाईचे शेण, १० लिटर गोमूत्र, १ किलो गूळ, १ किलो डाळीचे पीठ आणि शेतातील मूठभर माती २०० लिटर पाण्यात ४८ तास आंबवून शेताला द्यावे.',
      summaryEn: 'Ferment 10kg indigenous cow dung, 10L urine, 1kg jaggery, 1kg pulse flour in 200L water for 48 hours to multiply beneficial soil microbes.',
    },
  ];

  const texts = {
    hi: {
      title: 'किसान ज्ञान केंद्र (Farm Knowledge Hub)',
      subtitle: 'फसल सुरक्षा, कीट नियंत्रण और पशु स्वास्थ्य पर सचित्र एवं बोलकर सुनने योग्य मार्गदर्शिका',
      searchPlaceholder: 'रोग, कीड़ा या उपचार खोजें...',
      tabAll: 'सभी',
      tabCrop: '🌱 फसल रोग',
      tabAnimal: '🐄 पशु स्वास्थ्य',
      tabSoil: '🌾 मृदा व जैविक',
      listenAudio: 'आवाज में सुनें',
      stopAudio: 'आवाज रोकें',
      backBtn: '← मुख्य पृष्ठ पर वापस जाएं',
    },
    mr: {
      title: 'शेतकरी ज्ञान केंद्र (Farm Knowledge Hub)',
      subtitle: 'पीक संरक्षण, कीड नियंत्रण व पशु आरोग्यावरील सचित्र व ऐकता येण्याजोगी मार्गदर्शिका',
      searchPlaceholder: 'रोग, कीड किंवा उपाय शोधा...',
      tabAll: 'सर्व',
      tabCrop: '🌱 पीक रोग',
      tabAnimal: '🐄 पशु आरोग्य',
      tabSoil: '🌾 माती व सेंद्रिय',
      listenAudio: 'आवाजात ऐका',
      stopAudio: 'आवाज थांबवा',
      backBtn: '← मुख्य पृष्ठावर परत जा',
    },
    en: {
      title: 'Farmer Knowledge & Advisory Hub',
      subtitle: 'Illustrated & voice-narrated guides for crop pathology, pest control, and livestock hygiene',
      searchPlaceholder: 'Search disease, pest, or remedy...',
      tabAll: 'All Guides',
      tabCrop: '🌱 Crop Pathology',
      tabAnimal: '🐄 Livestock Care',
      tabSoil: '🌾 Soil & Organic',
      listenAudio: 'Read Aloud 🔊',
      stopAudio: 'Stop Audio ⏹️',
      backBtn: '← Back to Dashboard',
    },
  }[language];

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (playingId === id) {
        window.speechSynthesis.cancel();
        setPlayingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      setPlayingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const filtered = ARTICLES.filter(art => {
    const matchesCat = selectedCat === 'all' || art.category === selectedCat;
    const title = language === 'hi' ? art.titleHi : language === 'mr' ? art.titleMr : art.titleEn;
    const summary = language === 'hi' ? art.summaryHi : language === 'mr' ? art.summaryMr : art.summaryEn;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-100/80 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>{texts.backBtn}</span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
            📚
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">{texts.title}</h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">{texts.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={texts.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCat === 'all' ? 'bg-emerald-700 text-white' : 'bg-white border text-slate-700'
            }`}
          >
            {texts.tabAll}
          </button>
          <button
            onClick={() => setSelectedCat('crop')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCat === 'crop' ? 'bg-emerald-700 text-white' : 'bg-white border text-slate-700'
            }`}
          >
            {texts.tabCrop}
          </button>
          <button
            onClick={() => setSelectedCat('animal')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCat === 'animal' ? 'bg-amber-600 text-white' : 'bg-white border text-slate-700'
            }`}
          >
            {texts.tabAnimal}
          </button>
          <button
            onClick={() => setSelectedCat('soil')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCat === 'soil' ? 'bg-teal-700 text-white' : 'bg-white border text-slate-700'
            }`}
          >
            {texts.tabSoil}
          </button>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filtered.map((art) => {
          const title = language === 'hi' ? art.titleHi : language === 'mr' ? art.titleMr : art.titleEn;
          const summary = language === 'hi' ? art.summaryHi : language === 'mr' ? art.summaryMr : art.summaryEn;
          const isPlaying = playingId === art.id;

          return (
            <div key={art.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    art.category === 'crop' ? 'bg-emerald-100 text-emerald-800' : art.category === 'animal' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {art.category === 'crop' ? '🌱 Crop Health' : art.category === 'animal' ? '🐄 Veterinary' : '🌾 Soil Nutrition'}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {title}
                  </h3>
                </div>

                <button
                  onClick={() => handleSpeak(art.id, `${title}. ${summary}`)}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer ${
                    isPlaying 
                      ? 'bg-rose-100 text-rose-800' 
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                  }`}
                  title={isPlaying ? texts.stopAudio : texts.listenAudio}
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{isPlaying ? texts.stopAudio : texts.listenAudio}</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {summary}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
