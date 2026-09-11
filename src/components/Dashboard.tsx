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
  Sparkles
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
  // Localized texts for the four primary high-contrast buttons and dashboard sections
  const texts = {
    hi: {
      greeting: farmerProfile?.name ? `नमस्ते ${farmerProfile.name} जी 🙏` : 'नमस्ते किसान साथी 🙏',
      greetingSub: `${farmerProfile?.village || 'खेत'}: ${weather.temperature}°C, ${weather.condition}`,
      todayTip: 'आज का कृषि सुझाव:',
      voiceBtn: 'बोलकर पूछें 🎙️',

      // 4 Large Button Labels
      cropTitle: 'फसल स्वास्थ्य',
      cropSub: 'Crop Health • पौधे व पत्ती जांच',
      cropAction: 'फोटो लें व रोग जांचें',

      animalTitle: 'पशु स्वास्थ्य',
      animalSub: 'Animal Health • पशु आरोग्य जांच',
      animalAction: 'लक्षण व रोग जांचें',

      historyTitle: 'जांच इतिहास',
      historySub: 'Scan History • पुराने रिकॉर्ड',
      historyAction: `${scans.length} जांच रिकॉर्ड देखें`,

      alertsTitle: 'त्वरित अलर्ट',
      alertsSub: 'Quick Alerts • जरूरी चेतावनियां',
      alertsAction: `${alerts.length} सक्रिय अलर्ट देखें`,

      // Helplines & Secondary
      helplineTitle: 'सरकारी मुफ्त डॉक्टर सहायता (Toll-Free Helpline)',
      kisanCall: 'किसान कॉल सेंटर (फसल डॉक्टर)',
      pashuCall: 'पशु आरोग्य सेवा (पशु डॉक्टर)',
      quickTests: 'त्वरित डेमो टेस्ट केस (Quick Demo Scenarios)',
      recentTitle: 'पिछली जांचें (Recent Scans)',
      viewAll: 'सभी देखें',
      noScans: 'अभी तक कोई जांच नहीं हुई है। ऊपर दिए गए "फसल स्वास्थ्य" या "पशु स्वास्थ्य" बटन दबाएं!',
      healthy: 'स्वस्थ',
      attention: 'सावधानी बरतें',
      highRisk: 'डॉक्टर को दिखाएं',
    },
    mr: {
      greeting: farmerProfile?.name ? `नमस्कार ${farmerProfile.name} जी 🙏` : 'नमस्कार शेतकरी मित्र 🙏',
      greetingSub: `${farmerProfile?.village || 'शेत'}: ${weather.temperature}°C, ${weather.condition}`,
      todayTip: 'आजचा शेती सल्ला:',
      voiceBtn: 'बोलून विचारा 🎙️',

      // 4 Large Button Labels
      cropTitle: 'पीक आरोग्य',
      cropSub: 'Crop Health • पीक व पान तपासणी',
      cropAction: 'फोटो काढा व रोग तपासा',

      animalTitle: 'पशु आरोग्य',
      animalSub: 'Animal Health • जनावरांची तपासणी',
      animalAction: 'लक्षणे व आजार तपासा',

      historyTitle: 'तपासणी इतिहास',
      historySub: 'Scan History • मागील नोंदी',
      historyAction: `${scans.length} तपासणी अहवाल पहा`,

      alertsTitle: 'त्वरित इशारे',
      alertsSub: 'Quick Alerts • तातडीच्या सूचना',
      alertsAction: `${alerts.length} सक्रिय सूचना पहा`,

      // Helplines & Secondary
      helplineTitle: 'शासकीय मोफत डॉक्टर सहाय्य (Toll-Free Helpline)',
      kisanCall: 'किसान कॉल सेंटर (पीक सल्ला)',
      pashuCall: 'पशु आरोग्य सेवा (पशु वैद्यकीय सल्ला)',
      quickTests: 'झटपट डेमो नमुने (Quick Demo Scenarios)',
      recentTitle: 'मागील तपासण्या (Recent Scans)',
      viewAll: 'सर्व पहा',
      noScans: 'अद्याप कोणतीही तपासणी झालेली नाही. वरील "पीक आरोग्य" किंवा "पशु आरोग्य" बटण दाबा!',
      healthy: 'निरोगी',
      attention: 'काळजी घ्या',
      highRisk: 'डॉक्टरांना दाखवा',
    },
    en: {
      greeting: farmerProfile?.name ? `Welcome ${farmerProfile.name} 🙏` : 'Welcome Farmer 🙏',
      greetingSub: `${farmerProfile?.village || 'Farm'}: ${weather.temperature}°C, ${weather.condition}`,
      todayTip: 'Today\'s Advisory:',
      voiceBtn: 'Voice Assistant 🎙️',

      // 4 Large Button Labels
      cropTitle: 'Crop Health',
      cropSub: 'Plant Pathology & Leaf Scan',
      cropAction: 'Scan Leaf & Diagnose Diseases',

      animalTitle: 'Animal Health',
      animalSub: 'Livestock Veterinary Screening',
      animalAction: 'Check Animal Symptoms & Care',

      historyTitle: 'Scan History',
      historySub: 'Past Diagnostic Records',
      historyAction: `View ${scans.length} Saved Scans`,

      alertsTitle: 'Quick Alerts',
      alertsSub: 'Farm Risks & Urgent Advisories',
      alertsAction: `View ${alerts.length} Active Alerts`,

      // Helplines & Secondary
      helplineTitle: 'Official Free Doctor Helplines (Toll-Free)',
      kisanCall: 'Kisan Call Centre (Crop Doctor)',
      pashuCall: 'Pashu Arogya Seva (Veterinary Doctor)',
      quickTests: 'Quick Hackathon Test Cases',
      recentTitle: 'Your Recent Health Scans',
      viewAll: 'View All',
      noScans: 'No health scans yet. Tap "Crop Health" or "Animal Health" above to run your first diagnostic scan!',
      healthy: 'Healthy',
      attention: 'Needs Attention',
      highRisk: 'Consult Doctor',
    },
  }[language];

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. WARM FARMER GREETING & WEATHER ADVISORY */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-600/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold text-emerald-200 bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider">
            {farmerProfile?.district || 'FARMGUARD AI'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-1.5 tracking-tight">
            {texts.greeting}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-medium flex items-center gap-1.5">
            <CloudSun className="w-4 h-4 text-amber-300" />
            <span>{texts.greetingSub}</span>
          </p>
          {weather.advisory?.actionItem && (
            <div className="mt-2.5 bg-black/20 text-emerald-100 text-xs px-3.5 py-1.5 rounded-xl border border-white/10 font-medium">
              💡 <strong>{texts.todayTip}</strong> {weather.advisory.actionItem}
            </div>
          )}
        </div>

        {/* Big Voice Button Shortcut */}
        {onOpenVoiceModal && (
          <button
            onClick={onOpenVoiceModal}
            className="self-start sm:self-center shrink-0 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition-transform transform active:scale-95 cursor-pointer"
          >
            <Mic className="w-5 h-5 text-amber-900" />
            <span>{texts.voiceBtn}</span>
          </button>
        )}
      </div>

      {/* 2. THE FOUR LARGE, CLEAR, HIGH-CONTRAST BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        
        {/* BUTTON 1: CROP HEALTH (High-Contrast Emerald) */}
        <button
          onClick={() => onNavigate('crop-scanner')}
          className="group relative text-left bg-emerald-700 hover:bg-emerald-800 text-white rounded-3xl p-6 sm:p-7 border-4 border-emerald-500/80 shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[190px] transform active:scale-[0.99]"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-emerald-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Sprout className="w-8 h-8 text-emerald-700" />
              </div>
              <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                01 • फसल / पीक
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
              {texts.cropTitle}
            </h3>
            <p className="text-sm font-bold text-emerald-100 mt-2">
              {texts.cropSub}
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-emerald-600 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-extrabold text-emerald-100 flex items-center gap-1.5">
              <span>{texts.cropAction}</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-white text-emerald-800 flex items-center justify-center font-bold shadow-xs group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 text-emerald-800" />
            </div>
          </div>
        </button>

        {/* BUTTON 2: ANIMAL HEALTH (High-Contrast Amber/Orange) */}
        <button
          onClick={() => onNavigate('animal-scanner')}
          className="group relative text-left bg-amber-600 hover:bg-amber-700 text-white rounded-3xl p-6 sm:p-7 border-4 border-amber-400/90 shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[190px] transform active:scale-[0.99]"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-amber-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <HeartPulse className="w-8 h-8 text-amber-700" />
              </div>
              <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                02 • पशु / जनावरे
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
              {texts.animalTitle}
            </h3>
            <p className="text-sm font-bold text-amber-100 mt-2">
              {texts.animalSub}
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-amber-500 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-extrabold text-amber-100 flex items-center gap-1.5">
              <span>{texts.animalAction}</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-white text-amber-800 flex items-center justify-center font-bold shadow-xs group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 text-amber-800" />
            </div>
          </div>
        </button>

        {/* BUTTON 3: SCAN HISTORY (High-Contrast Indigo/Blue) */}
        <button
          onClick={() => onNavigate('history')}
          className="group relative text-left bg-indigo-700 hover:bg-indigo-800 text-white rounded-3xl p-6 sm:p-7 border-4 border-indigo-400/80 shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[190px] transform active:scale-[0.99]"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-indigo-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <History className="w-8 h-8 text-indigo-700" />
              </div>
              <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                03 • इतिहास / Records
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
              {texts.historyTitle}
            </h3>
            <p className="text-sm font-bold text-indigo-100 mt-2">
              {texts.historySub}
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-indigo-600 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-extrabold text-indigo-100 flex items-center gap-1.5">
              <span>{texts.historyAction}</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-white text-indigo-800 flex items-center justify-center font-bold shadow-xs group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 text-indigo-800" />
            </div>
          </div>
        </button>

        {/* BUTTON 4: QUICK ALERTS (High-Contrast Rose/Red) */}
        <button
          onClick={() => onNavigate('alerts')}
          className="group relative text-left bg-rose-700 hover:bg-rose-800 text-white rounded-3xl p-6 sm:p-7 border-4 border-rose-400/80 shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[190px] transform active:scale-[0.99]"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-rose-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Bell className="w-8 h-8 text-rose-700" />
              </div>
              <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                04 • चेतावनियां / Alerts
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
              {texts.alertsTitle}
            </h3>
            <p className="text-sm font-bold text-rose-100 mt-2">
              {texts.alertsSub}
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-rose-600 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-extrabold text-rose-100 flex items-center gap-1.5">
              <span>{texts.alertsAction}</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-white text-rose-800 flex items-center justify-center font-bold shadow-xs group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 text-rose-800" />
            </div>
          </div>
        </button>

      </div>

      {/* 3. DIRECT DOCTOR TOLL-FREE HELPLINES */}
      <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>{texts.helplineTitle}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="tel:18001801551"
            className="p-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-between shadow-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                🌱
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">{texts.kisanCall}</p>
                <p className="text-[11px] text-emerald-100 mt-0.5">टोल-फ्री नंबर (मुफ्त कॉल)</p>
              </div>
            </div>
            <span className="bg-emerald-900 text-white font-black text-xs px-3 py-1.5 rounded-xl">
              1800-180-1551
            </span>
          </a>

          <a
            href="tel:1962"
            className="p-3.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-between shadow-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                🐄
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">{texts.pashuCall}</p>
                <p className="text-[11px] text-amber-100 mt-0.5">पशु चिकित्सा हेल्पलाइन (मुफ्त)</p>
              </div>
            </div>
            <span className="bg-amber-900 text-white font-black text-xs px-3 py-1.5 rounded-xl">
              1962
            </span>
          </a>
        </div>
      </div>

      {/* 4. QUICK DEMO EVALUATION SAMPLES */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{texts.quickTests}</span>
          </h4>
          <span className="text-[11px] text-slate-400 font-semibold">One-Tap AI Evaluation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {HACKATHON_DEMO_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSampleDemo(sample)}
              className="p-2.5 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/60 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[10px] font-black mb-1">
                <span>{sample.category === 'crop' ? '🌱 फसल' : '🐄 पशु'}</span>
                <span className={sample.severity === 'High' ? 'text-rose-600' : 'text-amber-600'}>
                  {sample.severity}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-800">
                {sample.name}
              </p>
              <span className="text-[10px] text-emerald-700 font-black mt-1 block">
                जांचें →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. RECENT SCANS SUMMARY */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>{texts.recentTitle}</span>
          </h4>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{texts.viewAll} ({scans.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {scans.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs font-medium">
            {texts.noScans}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {scans.slice(0, 4).map((scan) => (
              <div
                key={scan.id}
                onClick={() => onViewScanDetail(scan)}
                className="p-3 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-slate-50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-32 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 mb-2.5">
                    <img
                      src={scan.imageThumbnail}
                      alt={scan.entityName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-extrabold text-slate-900">{scan.entityName}</span>
                    <span className={`px-2 py-0.2 rounded-full font-bold ${
                      scan.severity === 'High' || scan.severity === 'Emergency'
                        ? 'bg-rose-100 text-rose-800'
                        : scan.severity === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {scan.severity === 'High' || scan.severity === 'Emergency'
                        ? texts.highRisk
                        : scan.severity === 'Moderate'
                        ? texts.attention
                        : texts.healthy}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 line-clamp-1">
                    {scan.condition}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{scan.date}</span>
                  <span className="text-emerald-700 font-extrabold group-hover:underline">रिपोर्ट देखें →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
