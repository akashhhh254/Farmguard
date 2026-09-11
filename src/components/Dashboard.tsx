import React from 'react';
import { 
  Sprout, 
  HeartPulse, 
  History, 
  Bell, 
  PhoneCall, 
  Mic, 
  ArrowRight, 
  Clock, 
  CloudSun, 
  ChevronRight, 
  MapPin,
  Layers,
  Droplets, 
  FlaskConical, 
  IndianRupee, 
  ClipboardList, 
  TrendingUp, 
  BookOpen, 
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Wind,
  Thermometer,
  ShieldAlert
} from 'lucide-react';
import { Language, AppView, ScanRecord, WeatherContext, FarmAlert, FarmerProfile } from '../types';
import { HACKATHON_DEMO_SAMPLES } from '../sampleData';

interface DashboardProps {
  language: Language;
  onNavigate: (view: AppView) => void;
  scans: ScanRecord[];
  alerts: FarmAlert[];
  weather: WeatherContext;
  onSelectSampleDemo: (sample: typeof HACKATHON_DEMO_SAMPLES[0]) => void;
  onViewScanDetail: (scan: ScanRecord) => void;
  farmerProfile?: FarmerProfile;
  onOpenVoiceModal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  language,
  onNavigate,
  scans,
  alerts,
  weather,
  onSelectSampleDemo,
  onViewScanDetail,
  farmerProfile,
  onOpenVoiceModal,
}) => {
  // Localized texts matching agricultural standard
  const t = {
    en: {
      welcomeGreeting: farmerProfile?.name ? `Good day, ${farmerProfile.name}` : 'Good day, Farmer',
      welcomeSub: 'FarmGuard AI Agricultural Command Center • Real-time advisory & monitoring',
      askAiBtn: 'Ask FarmGuard AI',
      farmLocationLabel: 'Farm Location',
      farmSizeLabel: 'Farm Size',
      primaryCropsLabel: 'Primary Crops',
      livestockLabel: 'Livestock',
      cropCardTitle: 'Crop Health Diagnosis',
      cropCardSub: 'Analyze crop leaf images to identify fungal, bacterial diseases and pest attacks instantly.',
      cropCardCta: 'Analyze Crop Image',
      animalCardTitle: 'Livestock Health Screening',
      animalCardSub: 'AI symptom assessment and clinical triage for cattle, buffalo, sheep, goats, and poultry.',
      animalCardCta: 'Check Animal Health',
      aiAssistantTitle: 'AI Health Assistant',
      aiAssistantSub: 'Ask agricultural and livestock questions in your local language by voice or text.',
      aiAssistantCta: 'Ask FarmGuard AI',
      weatherTitle: 'Agro-Weather Advisory',
      humidity: 'Humidity',
      rainRisk: 'Rain Risk',
      windSpeed: 'Wind',
      temp: 'Temp',
      alertsTitle: 'Active Farm Alerts',
      noAlerts: 'No active weather or pest risk alerts in your district.',
      viewAllAlerts: 'View All Alerts',
      toolkitTitle: 'Smart Farm Management Suite',
      toolkitSub: 'Practical daily utilities for irrigation, nutrition, accounts, and market access.',
      waterMgmt: 'Smart Irrigation',
      waterMgmtSub: 'Water planning',
      nutrition: 'Fertilizer Guide',
      nutritionSub: 'Balanced NPK',
      accounts: 'Expense Ledger',
      accountsSub: 'Cost & profit',
      records: 'Farm Ledger',
      recordsSub: 'Crops & tags',
      market: 'Mandi Rates',
      marketSub: 'APMC modal prices',
      knowledge: 'Knowledge Hub',
      knowledgeSub: 'Guides & advisories',
      recentScansTitle: 'Recent Health Diagnostics',
      viewAllScans: 'View All Records',
      noScans: 'No health scans logged yet. Start by checking your crops or animals above.',
      helplineTitle: 'Official Free Agricultural Helplines',
      kisanCall: 'Kisan Call Centre (Crop Doctor)',
      pashuCall: 'Pashu Arogya Seva (Livestock Doctor)',
      quickDemos: 'Quick Diagnostic Demo Scenarios',
      disclaimerTitle: 'Decision Support & Safety Notice',
      disclaimerText: 'FarmGuard AI is an advisory screening and decision-support tool. It does not replace certified veterinary or agronomic consultation. Always consult official extension centers or veterinary doctors before applying intensive treatments.',
      healthy: 'Healthy',
      attention: 'Needs Attention',
      highRisk: 'High Risk',
    },
    hi: {
      welcomeGreeting: farmerProfile?.name ? `नमस्ते, ${farmerProfile.name} जी` : 'नमस्ते किसान साथी',
      welcomeSub: 'फार्मगार्ड एआई कृषि कमांड सेंटर • वास्तविक समय फसल व पशु स्वास्थ्य निगरानी',
      askAiBtn: 'फार्मगार्ड एआई से पूछें',
      farmLocationLabel: 'खेत का स्थान',
      farmSizeLabel: 'खेत का क्षेत्रफल',
      primaryCropsLabel: 'मुख्य फसलें',
      livestockLabel: 'पालतू पशुधन',
      cropCardTitle: 'फसल स्वास्थ्य निदान',
      cropCardSub: 'पौधे व पत्ती की फोटो से फफूंद, कीट प्रकोप और पोषक तत्वों की कमी की त्वरित पहचान करें।',
      cropCardCta: 'फसल फोटो की जांच करें',
      animalCardTitle: 'पशु स्वास्थ्य जांच',
      animalCardSub: 'गाय, भैंस, बकरी, भेड़ और मुर्गियों के लक्षणों का एआई आधारित स्वास्थ्य परीक्षण करें।',
      animalCardCta: 'पशु स्वास्थ्य जांचें',
      aiAssistantTitle: 'एआई स्वास्थ्य सहायक',
      aiAssistantSub: 'अपनी भाषा में बोलकर या लिखकर कृषि, खाद व पशु चिकित्सा से जुड़े प्रश्न पूछें।',
      aiAssistantCta: 'एआई से सवाल पूछें',
      weatherTitle: 'कृषि-मौसम सलाह',
      humidity: 'नमी (आर्द्रता)',
      rainRisk: 'बारिश की संभावना',
      windSpeed: 'हवा की गति',
      temp: 'तापमान',
      alertsTitle: 'सक्रिय कृषि चेतावनियां',
      noAlerts: 'आपके क्षेत्र में वर्तमान में कोई गंभीर कीट या मौसम अलर्ट नहीं है।',
      viewAllAlerts: 'सभी अलर्ट देखें',
      toolkitTitle: 'स्मार्ट कृषि उपकरण व सेवाएं',
      toolkitSub: 'सिंचाई, खाद, खर्च और बाजार भाव की दैनिक उपयोगिताएं।',
      waterMgmt: 'स्मार्ट सिंचाई',
      waterMgmtSub: 'जल नियोजन',
      nutrition: 'खाद व पोषण',
      nutritionSub: 'संतुलित NPK',
      accounts: 'आय-व्यय खाता',
      accountsSub: 'खेती का हिसाब',
      records: 'खेत डायरी',
      recordsSub: 'फसल व पशु रिकॉर्ड',
      market: 'मंडी भाव',
      marketSub: 'APMC ताजे दर',
      knowledge: 'ज्ञान केंद्र',
      knowledgeSub: 'सचित्र मार्गदर्शिका',
      recentScansTitle: 'हालिया स्वास्थ्य जांचें',
      viewAllScans: 'सभी रिकॉर्ड देखें',
      noScans: 'अभी तक कोई जांच दर्ज नहीं है। ऊपर दिए गए "फसल स्वास्थ्य" या "पशु स्वास्थ्य" विकल्प से शुरू करें।',
      helplineTitle: 'सरकारी मुफ्त हेल्पलाइन सेवाएं',
      kisanCall: 'किसान कॉल सेंटर (फसल डॉक्टर)',
      pashuCall: 'पशु आरोग्य सेवा (पशु डॉक्टर)',
      quickDemos: 'त्वरित डेमो परीक्षण नमूने',
      disclaimerTitle: 'निर्णय समर्थन एवं सुरक्षा सूचना',
      disclaimerText: 'फार्मगार्ड एआई एक सलाहकार स्क्रीनिंग टूल है। यह प्रमाणित पशु चिकित्सक या कृषि वैज्ञानिक का विकल्प नहीं है। किसी भी गंभीर लक्षण पर निकटतम कृषि विज्ञान केंद्र या पशु अस्पताल से संपर्क करें।',
      healthy: 'स्वस्थ',
      attention: 'सावधानी बरतें',
      highRisk: 'उच्च जोखिम',
    },
    mr: {
      welcomeGreeting: farmerProfile?.name ? `नमस्कार, ${farmerProfile.name} जी` : 'नमस्कार शेतकरी मित्र',
      welcomeSub: 'फार्मगार्ड एआय कृषी नियंत्रण कक्ष • पीक व पशु आरोग्य देखरेख प्रणाली',
      askAiBtn: 'फार्मगार्ड एआय ला विचारा',
      farmLocationLabel: 'शेताचे स्थान',
      farmSizeLabel: 'शेताचे क्षेत्रफळ',
      primaryCropsLabel: 'मुख्य पिके',
      livestockLabel: 'पाळीव जनावरे',
      cropCardTitle: 'पीक आरोग्य निदान',
      cropCardSub: 'पानांच्या फोटोवरून बुरशीजन्य रोग, किडींचा प्रादुर्भाव आणि पोषण कमतरतेचे अचूक निदान.',
      cropCardCta: 'पीक फोटो तपासा',
      animalCardTitle: 'पशु आरोग्य तपासणी',
      animalCardSub: 'गाय, म्हैस, शेळी, मेंढी आणि कोंबड्यांच्या आजारांची लक्षणनिहाय एआय तपासणी.',
      animalCardCta: 'पशु आरोग्य तपासा',
      aiAssistantTitle: 'एआय आरोग्य सहाय्यक',
      aiAssistantSub: 'आपल्या भाषेत बोलून किंवा लिहून शेती आणि जनावरांच्या आरोग्याविषयी प्रश्न विचारा.',
      aiAssistantCta: 'एआय ला विचारा',
      weatherTitle: 'कृषी हवामान सल्ला',
      humidity: 'हवेतील आर्द्रता',
      rainRisk: 'पाऊस शक्यता',
      windSpeed: 'वाऱ्याचा वेग',
      temp: 'तापमान',
      alertsTitle: 'सक्रिय शेती सूचना',
      noAlerts: 'आपल्या जिल्ह्यात सध्या कोणतीही गंभीर कीड किंवा हवामान चेतावणी नाही.',
      viewAllAlerts: 'सर्व सूचना पहा',
      toolkitTitle: 'स्मार्ट शेती व्यवस्थापन साधने',
      toolkitSub: 'सिंचन, खत नियोजन, हिशोब आणि बाजारभावासाठी उपयुक्त साधने.',
      waterMgmt: 'पाणी नियोजन',
      waterMgmtSub: 'सिंचन सल्ला',
      nutrition: 'खत सल्ला',
      nutritionSub: 'संतुलित NPK',
      accounts: 'जमा-खर्च वही',
      accountsSub: 'नफा-तोटा हिशोब',
      records: 'नोंदवही / डायरी',
      recordsSub: 'पीक व जनावरे',
      market: 'मंडी भाव',
      marketSub: 'APMC ताजे दर',
      knowledge: 'ज्ञान केंद्र',
      knowledgeSub: 'सचित्र मार्गदर्शिका',
      recentScansTitle: 'अलीकडील तपासणी नोंदी',
      viewAllScans: 'सर्व नोंदी पहा',
      noScans: 'अद्याप कोणतीही तपासणी झालेली नाही. वरील पीक किंवा पशु आरोग्य पर्यायाचा वापर करा.',
      helplineTitle: 'शासकीय मोफत हेल्पलाइन',
      kisanCall: 'किसान कॉल सेंटर (पीक डॉक्टर)',
      pashuCall: 'पशु आरोग्य सेवा (पशु डॉक्टर)',
      quickDemos: 'प्रात्यक्षिक चाचणी नमुने',
      disclaimerTitle: 'निर्णय समर्थन व सुरक्षा सूचना',
      disclaimerText: 'फार्मगार्ड एआय ही एक सल्लागार तपासणी प्रणाली आहे. ती अधिकृत कृषी शास्त्रज्ञ किंवा पशुवैद्यकाचा पर्याय नाही. गंभीर स्थितीत तज्ज्ञांचा सल्ला घ्यावा.',
      healthy: 'निरोगी',
      attention: 'काळजी घ्या',
      highRisk: 'उच्च जोखीम',
    },
  }[language];

  // Helper for Severity display
  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'High':
      case 'Emergency':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">{t.highRisk}</span>;
      case 'Moderate':
      case 'warning':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">{t.attention}</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">{t.healthy}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      
      {/* ==================================================================== */}
      {/* 1. WELCOME SECTION & FARM SUMMARY BAR                                */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                {farmerProfile?.district || 'India'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
              {t.welcomeGreeting}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.welcomeSub}
            </p>
          </div>

          {/* AI Voice Assistant Trigger */}
          {onOpenVoiceModal && (
            <button
              onClick={onOpenVoiceModal}
              className="self-start md:self-center px-4 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Mic className="w-4 h-4 text-emerald-200" />
              <span>{t.askAiBtn}</span>
            </button>
          )}
        </div>

        {/* Farm Summary Details Grid: Location, Size, Primary Crops, Livestock */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 text-xs">
          
          {/* 1. Farm Location */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              {t.farmLocationLabel}
            </span>
            <p className="font-semibold text-slate-900 mt-1 truncate">
              {farmerProfile?.village ? `${farmerProfile.village}, ${farmerProfile.district}` : `${farmerProfile?.district || 'Nashik'}, Maharashtra`}
            </p>
          </div>

          {/* 2. Farm Size */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block font-medium flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              {t.farmSizeLabel}
            </span>
            <p className="font-semibold text-slate-900 mt-1">
              {farmerProfile?.farmSizeAcres || '4'} Acres
            </p>
          </div>

          {/* 3. Primary Crops */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block font-medium flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              {t.primaryCropsLabel}
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {(farmerProfile?.crops && farmerProfile.crops.length > 0 ? farmerProfile.crops.slice(0, 2) : ['Cotton', 'Tomato']).map((crop, idx) => (
                <span key={idx} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-800 text-[10px] font-medium truncate max-w-[95px]">
                  {crop.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>

          {/* 4. Livestock */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block font-medium flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-amber-700" />
              {t.livestockLabel}
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {(farmerProfile?.animals && farmerProfile.animals.length > 0 ? farmerProfile.animals.slice(0, 2) : ['Cow', 'Buffalo']).map((animal, idx) => (
                <span key={idx} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-800 text-[10px] font-medium truncate max-w-[95px]">
                  {animal.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. MAIN ACTION CARDS (VISUALLY PROMINENT & STRUCTURED)               */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* ACTION CARD 1: CROP HEALTH */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs hover:border-emerald-500 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-emerald-700" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                AI Agronomy
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.cropCardTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {t.cropCardSub}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('crop-scanner')}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{t.cropCardCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ACTION CARD 2: ANIMAL HEALTH */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs hover:border-amber-500 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-amber-700" />
              </div>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                Veterinary AI
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.animalCardTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {t.animalCardSub}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('animal-scanner')}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{t.animalCardCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ACTION CARD 3: AI HEALTH ASSISTANT */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs hover:border-teal-500 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center">
                <Mic className="w-6 h-6 text-teal-700" />
              </div>
              <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                Voice & Chat
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.aiAssistantTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {t.aiAssistantSub}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={onOpenVoiceModal ? onOpenVoiceModal : () => onNavigate('crop-scanner')}
              className="w-full py-2.5 px-4 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{t.aiAssistantCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* 3. WEATHER ADVISORY & FARM ALERTS (2-COLUMN BALANCED)                */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        
        {/* Weather Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-amber-600" />
              <h4 className="text-sm font-bold text-slate-900">{t.weatherTitle}</h4>
            </div>
            <span className="text-xs font-semibold text-slate-600">{weather.location || 'Nashik'}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-500 block">{t.temp}</span>
              <span className="text-base font-bold text-slate-900">{weather.temperature}°C</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-500 block">{t.humidity}</span>
              <span className="text-base font-bold text-slate-900">{weather.humidity}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-500 block">{t.rainRisk}</span>
              <span className="text-base font-bold text-slate-900">{weather.rainProbability}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-500 block">{t.windSpeed}</span>
              <span className="text-base font-bold text-slate-900">{weather.windSpeed}</span>
            </div>
          </div>

          {weather.advisory?.actionItem && (
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900 font-bold block mb-0.5">Recommended Field Action:</strong>
                {weather.advisory.actionItem}
              </div>
            </div>
          )}
        </div>

        {/* Farm Alerts Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-rose-600" />
              <h4 className="text-sm font-bold text-slate-900">{t.alertsTitle}</h4>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              {t.viewAllAlerts} ({alerts.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">{t.noAlerts}</p>
            ) : (
              alerts.slice(0, 3).map((alert) => (
                <div 
                  key={alert.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${alert.severity === 'high' ? 'text-rose-600' : 'text-amber-600'}`} />
                    <div>
                      <p className="font-semibold text-slate-900">{alert.title}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">{alert.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 uppercase tracking-wider ${
                    alert.severity === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* 4. SMART FARM MANAGEMENT SUITE                                      */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h4 className="text-base font-bold text-slate-900">{t.toolkitTitle}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{t.toolkitSub}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          
          <button
            onClick={() => onNavigate('irrigation')}
            className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-left transition-colors cursor-pointer flex flex-col justify-between min-h-[95px]"
          >
            <Droplets className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs font-bold text-slate-900">{t.waterMgmt}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.waterMgmtSub}</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('fertilizer')}
            className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-left transition-colors cursor-pointer flex flex-col justify-between min-h-[95px]"
          >
            <FlaskConical className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-xs font-bold text-slate-900">{t.nutrition}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.nutritionSub}</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('expenses')}
            className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-left transition-colors cursor-pointer flex flex-col justify-between min-h-[95px]"
          >
            <IndianRupee className="w-5 h-5 text-teal-600" />
            <div>
              <p className="text-xs font-bold text-slate-900">{t.accounts}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.accountsSub}</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('farm-records')}
            className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-left transition-colors cursor-pointer flex flex-col justify-between min-h-[95px]"
          >
            <ClipboardList className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-xs font-bold text-slate-900">{t.records}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.recordsSub}</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('market')}
            className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-left transition-colors cursor-pointer flex flex-col justify-between min-h-[95px]"
          >
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xs font-bold text-slate-900">{t.market}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.marketSub}</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('knowledge')}
            className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-left transition-colors cursor-pointer flex flex-col justify-between min-h-[95px]"
          >
            <BookOpen className="w-5 h-5 text-slate-700" />
            <div>
              <p className="text-xs font-bold text-slate-900">{t.knowledge}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.knowledgeSub}</p>
            </div>
          </button>

        </div>
      </div>

      {/* ==================================================================== */}
      {/* 5. OFFICIAL TOLL-FREE AGRICULTURAL HELPLINES                        */}
      {/* ==================================================================== */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-800" />
          <span>{t.helplineTitle}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="tel:18001801551"
            className="p-3.5 rounded-lg bg-white hover:bg-emerald-50/50 border border-slate-200 text-slate-900 flex items-center justify-between shadow-2xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-bold">{t.kisanCall}</p>
                <p className="text-[11px] text-slate-500">Government Toll-Free</p>
              </div>
            </div>
            <span className="font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              1800-180-1551
            </span>
          </a>

          <a
            href="tel:1962"
            className="p-3.5 rounded-lg bg-white hover:bg-amber-50/50 border border-slate-200 text-slate-900 flex items-center justify-between shadow-2xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
                <HeartPulse className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="text-xs font-bold">{t.pashuCall}</p>
                <p className="text-[11px] text-slate-500">Emergency Veterinary Service</p>
              </div>
            </div>
            <span className="font-bold text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
              1962
            </span>
          </a>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 6. QUICK DEMO DIAGNOSTIC SAMPLES                                     */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{t.quickDemos}</span>
          </h4>
          <span className="text-[11px] text-slate-400">One-Tap Evaluation Cases</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {HACKATHON_DEMO_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSampleDemo(sample)}
              className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
                <span className="text-slate-500">{sample.category === 'crop' ? 'Crop' : 'Livestock'}</span>
                <span className={sample.severity === 'High' ? 'text-rose-700 font-bold' : 'text-amber-700 font-bold'}>
                  {sample.severity}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-emerald-900">
                {sample.name}
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                Test Scan →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 7. RECENT DIAGNOSTIC SCANS                                          */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <h4 className="text-sm font-bold text-slate-900">{t.recentScansTitle}</h4>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{t.viewAllScans} ({scans.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {scans.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            {t.noScans}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {scans.slice(0, 4).map((scan) => (
              <div
                key={scan.id}
                onClick={() => onViewScanDetail(scan)}
                className="p-3 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-slate-50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-32 rounded bg-slate-100 overflow-hidden border border-slate-200 mb-2.5">
                    <img
                      src={scan.imageThumbnail}
                      alt={scan.entityName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-900 truncate mr-1">{scan.entityName}</span>
                    {getSeverityBadge(scan.severity)}
                  </div>

                  <p className="text-xs font-medium text-slate-700 truncate">
                    {scan.condition}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{scan.date}</span>
                  <span className="text-emerald-800 font-semibold group-hover:underline">View Report →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 8. TRUST & SAFETY DISCLAIMER (PRODUCTION COMPLIANT)                  */}
      {/* ==================================================================== */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800 font-bold block mb-0.5">{t.disclaimerTitle}</strong>
          <p className="text-slate-500 leading-relaxed text-[11px]">{t.disclaimerText}</p>
        </div>
      </div>

    </div>
  );
};
