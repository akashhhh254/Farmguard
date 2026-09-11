import React, { useState } from 'react';
import { 
  Droplets, 
  CloudRain, 
  Sun, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  ArrowLeft 
} from 'lucide-react';
import { Language, WeatherContext } from '../types';

interface SmartIrrigationModuleProps {
  language: Language;
  weather: WeatherContext;
  onBack: () => void;
}

export const SmartIrrigationModule: React.FC<SmartIrrigationModuleProps> = ({
  language,
  weather,
  onBack,
}) => {
  const [selectedCrop, setSelectedCrop] = useState('कपास (Cotton)');
  const [soilType, setSoilType] = useState('काली भारी मिट्टी (Black Clay Soil)');
  const [cropStage, setCropStage] = useState('फूल एवं फल अवस्था (Flowering / Boll Formation)');
  const [soilMoistureEstimated, setSoilMoistureEstimated] = useState<number>(45);

  const texts = {
    hi: {
      title: 'स्मार्ट सिंचाई सलाहकार (Smart Irrigation Advisor)',
      subtitle: 'मौसम, फसल अवस्था और मिट्टी के प्रकार के आधार पर वैज्ञानिक जल प्रबंधन',
      cropLabel: 'फसल चुनें:',
      soilLabel: 'मिट्टी का प्रकार:',
      stageLabel: 'फसल की वृद्धि अवस्था:',
      moistureLabel: 'अनुमानित मिट्टी नमी स्तर (%):',
      weatherImpact: 'वर्तमान मौसम प्रभाव:',
      recommendationTitle: 'एआई जल प्रबंधन सिफारिश',
      irrigateNow: 'मध्यम सिंचाई करें (Recommended Irrigation)',
      delayNotice: 'बारिश की संभावना होने पर सिंचाई 24 घंटे टालें',
      optimalTiming: 'सिंचाई का सही समय: सुबह 6:00 - 8:30 AM या शाम 5:30 PM के बाद',
      waterSavingTip: 'ड्रिप या बूंद-बूंद सिंचाई से 40% तक पानी और बिजली की बचत होती है।',
      waterVolume: 'अनुमानित जल आवश्यकता: लगभग 18,000 - 22,000 लीटर / एकड़',
      sensorNote: 'नोट: यदि डिजिटल सॉइल सेंसर उपलब्ध नहीं हैं, तो यह गणना मौसम और वाष्पीकरण मॉडल पर आधारित है।',
      backBtn: '← मुख्य पृष्ठ पर वापस जाएं',
    },
    mr: {
      title: 'स्मार्ट पाणी व्यवस्थापन (Smart Irrigation Advisor)',
      subtitle: 'हवामान, पिकाची अवस्था व मातीच्या प्रकारानुसार योग्य पाणी नियोजन',
      cropLabel: 'पीक निवडा:',
      soilLabel: 'मातीचा प्रकार:',
      stageLabel: 'पिकाची वाढीची अवस्था:',
      moistureLabel: 'अंदाजित जमिनीतील ओलावा (%):',
      weatherImpact: 'सध्याचा हवामान प्रभाव:',
      recommendationTitle: 'एआय पाणी व्यवस्थापन सल्ला',
      irrigateNow: 'हलके ते मध्यम पाणी द्या (Recommended Irrigation)',
      delayNotice: 'पावसाची शक्यता असल्यास पाणी देणे २४ तास पुढे ढकला',
      optimalTiming: 'पाणी देण्याची सर्वोत्तम वेळ: सकाळी ६:०० ते ८:३० किंवा संध्याकाळी ५:३० नंतर',
      waterSavingTip: 'ठिबक सिंचनाचा वापर करून ४०% पाणी आणि विजेची बचत करा.',
      waterVolume: 'अंदाजित पाण्याची गरज: सुमारे १८,००० - २२,००० लिटर / एकर',
      sensorNote: 'टीप: प्रत्यक्ष सेन्सर उपलब्ध नसल्यास हा सल्ला हवामान आणि बाष्पीभवन मॉडेलवर आधारित आहे.',
      backBtn: '← मुख्य पृष्ठावर परत जा',
    },
    en: {
      title: 'Smart Irrigation Advisor',
      subtitle: 'Scientific water management guided by weather, growth stage, and soil properties',
      cropLabel: 'Select Crop:',
      soilLabel: 'Soil Type:',
      stageLabel: 'Growth Stage:',
      moistureLabel: 'Estimated Soil Moisture (%):',
      weatherImpact: 'Current Weather Impact:',
      recommendationTitle: 'AI Water Management Recommendation',
      irrigateNow: 'Moderate Irrigation Recommended',
      delayNotice: 'Delay irrigation if heavy rain is forecast in next 24-48 hours',
      optimalTiming: 'Optimal Timing: Early morning (6:00 - 8:30 AM) or late evening to minimize evaporation',
      waterSavingTip: 'Drip irrigation saves up to 40% water and prevents fungal root rot from waterlogging.',
      waterVolume: 'Estimated Water Requirement: ~20,000 Litres / Acre',
      sensorNote: 'Notice: If physical telemetry probes are not installed, recommendation uses real-time agro-meteorological estimation.',
      backBtn: '← Back to Dashboard',
    },
  }[language];

  // Logic calculation
  const isRainLikely = weather.rainProbability >= 40;

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

      <div className="bg-gradient-to-r from-blue-700 to-teal-800 text-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
            💧
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">{texts.title}</h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-0.5">{texts.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Input Form Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-bold text-slate-700">{texts.cropLabel}</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
          >
            <option>कपास (Cotton)</option>
            <option>टमाटर (Tomato)</option>
            <option>सोयाबीन (Soybean)</option>
            <option>गेहूं (Wheat)</option>
            <option>गन्ना (Sugarcane)</option>
            <option>प्याज (Onion)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700">{texts.soilLabel}</label>
          <select
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
          >
            <option>काली भारी मिट्टी (Black Heavy Soil / Clay)</option>
            <option>लाल दोमट मिट्टी (Red Loamy Soil)</option>
            <option>रेतीली दोमट मिट्टी (Sandy Loam)</option>
            <option>जलोढ़ उपजाऊ मिट्टी (Alluvial Silt)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700">{texts.stageLabel}</label>
          <select
            value={cropStage}
            onChange={(e) => setCropStage(e.target.value)}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
          >
            <option>अंकुरण / शुरुआती अवस्था (Germination / Seedling)</option>
            <option>शाकीय वानस्पतिक बढ़वार (Vegetative Growth)</option>
            <option>फूल एवं फल अवस्था (Flowering / Fruiting)</option>
            <option>परिपक्वता / कटाई पूर्व (Maturity / Ripening)</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{texts.moistureLabel}</span>
            <span className="text-blue-600 font-black">{soilMoistureEstimated}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            value={soilMoistureEstimated}
            onChange={(e) => setSoilMoistureEstimated(Number(e.target.value))}
            className="w-full mt-3 accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>सूखी (Dry)</span>
            <span>इष्टतम (Optimal)</span>
            <span>अत्यधिक गीली (Waterlogged)</span>
          </div>
        </div>
      </div>

      {/* Output Advisory Card */}
      <div className="bg-emerald-50/70 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-emerald-950 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>{texts.recommendationTitle}</span>
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-black ${
            isRainLikely ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
          }`}>
            {isRainLikely ? '⚠️ बारिश की संभावना' : '✓ सिंचाई अनुकूल'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>{isRainLikely ? texts.delayNotice : texts.irrigateNow}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {weather.location} में तापमान {weather.temperature}°C और आर्द्रता {weather.humidity}% है। {selectedCrop} के {cropStage} पर पानी का जमाव न होने दें।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>सिंचाई समय व मात्रा:</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {texts.optimalTiming}
            </p>
            <div className="text-[11px] font-bold text-emerald-700">
              {texts.waterVolume}
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-900/10 border border-blue-500/20 text-xs text-blue-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <span>{texts.waterSavingTip}</span>
        </div>

        <p className="text-[10px] text-slate-500 text-center italic">
          {texts.sensorNote}
        </p>
      </div>
    </div>
  );
};
