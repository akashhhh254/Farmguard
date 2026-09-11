import React, { useState } from 'react';
import { 
  Sprout, 
  FlaskConical, 
  ShieldAlert, 
  Leaf, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';

interface FertilizerAdvisorModuleProps {
  language: Language;
  onBack: () => void;
}

export const FertilizerAdvisorModule: React.FC<FertilizerAdvisorModuleProps> = ({
  language,
  onBack,
}) => {
  const [crop, setCrop] = useState('कपास (Cotton)');
  const [stage, setStage] = useState('फूल व गूलर अवस्था (Squaring / Flowering)');
  const [soilStatus, setSoilStatus] = useState('मध्यम नाइट्रोजन, मध्यम पोटाश');

  const texts = {
    hi: {
      title: 'उर्वरक एवं पोषण सलाहकार (Fertilizer Advisor)',
      subtitle: 'फसल की आवश्यकता अनुसार संतुलित पोषण और जैविक खाद की वैज्ञानिक सिफारिश',
      cropLabel: 'फसल:',
      stageLabel: 'फसल अवस्था:',
      soilLabel: 'मृदा स्वास्थ्य स्थिति:',
      advisoryTitle: 'संतुलित पोषण योजना (NPK & Bio-Nutrients)',
      chemicalHeading: 'संतुलित रासायनिक खाद (General Guidance):',
      organicHeading: 'जैविक व सुरक्षित विकल्प (Organic & Bio-fertilizers):',
      safetyHeading: 'सुरक्षा एवं सावधानी (Crucial Farmer Safety):',
      safetyNote: 'कीटनाशक व रसायनों का अंधाधुंध छिड़काव न करें। हमेशा दस्ताने और मास्क का प्रयोग करें। वास्तविक प्रयोग से पूर्व कृषि विज्ञान केंद्र (KVK) से मृदा परीक्षण रिपोर्ट अवश्य सत्यापित कराएं।',
      disclaimer: 'यह एक निर्णय सहायता प्रणाली है। किसी भी रासायनिक खाद के उपयोग से पूर्व पैकेट पर लिखे लेबल व स्थानीय कृषि अधिकारी के निर्देशों का पालन करें।',
      backBtn: '← मुख्य पृष्ठ पर वापस जाएं',
    },
    mr: {
      title: 'खत व पोषण व्यवस्थापन (Fertilizer Advisor)',
      subtitle: 'पिकाच्या गरजेनुसार संतुलित खते व सेंद्रिय खतांचा शास्त्रीय सल्ला',
      cropLabel: 'पीक:',
      stageLabel: 'पिकाची वाढीची अवस्था:',
      soilLabel: 'जमिनीची सुपीकता पातळी:',
      advisoryTitle: 'संतुलित खत योजना (NPK & Bio-Nutrients)',
      chemicalHeading: 'संतुलित रासायनिक खते (General Guidance):',
      organicHeading: 'सेंद्रिय व जैविक पर्याय (Organic & Bio-fertilizers):',
      safetyHeading: 'सुरक्षा आणि काळजी (Crucial Farmer Safety):',
      safetyNote: 'कीटकनाशके व रसायनांचा अतिवापर टाळा. फवारणी करताना नेहमी मास्क व हातमोजे वापरा. स्थानिक कृषी विज्ञान केंद्राकडून माती परीक्षण करून घेणे हितकारक ठरेल.',
      disclaimer: 'ही एक सहाय्यकारी प्रणाली आहे. प्रत्यक्ष रासायनिक खते वापरण्यापूर्वी पाकिटावरील सूचना आणि कृषी अधिकाऱ्यांचा सल्ला घ्यावा.',
      backBtn: '← मुख्य पृष्ठावर परत जा',
    },
    en: {
      title: 'Fertilizer & Soil Nutrition Advisor',
      subtitle: 'Balanced nutrient guidance and organic alternatives tailored to crop lifecycle',
      cropLabel: 'Crop:',
      stageLabel: 'Growth Stage:',
      soilLabel: 'Soil Nutrient Status:',
      advisoryTitle: 'Balanced Nutritional Plan (NPK & Bio-Nutrients)',
      chemicalHeading: 'Targeted Balanced Application (General Guidance):',
      organicHeading: 'Organic Alternatives & Bio-Fertilizers:',
      safetyHeading: 'Safety Notice & Application Guidelines:',
      safetyNote: 'Avoid excessive nitrogen fertilization which increases sucking pest infestation. Wear protective gloves and facial masks. Validate with Soil Health Card tests from local KVK.',
      disclaimer: 'FarmGuard is an agronomic decision support tool. Follow verified container label rates and consult certified agricultural extension officers before field application.',
      backBtn: '← Back to Dashboard',
    },
  }[language];

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

      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
            🌱
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">{texts.title}</h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">{texts.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700">{texts.cropLabel}</label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
          >
            <option>कपास (Cotton)</option>
            <option>टमाटर (Tomato)</option>
            <option>सोयाबीन (Soybean)</option>
            <option>गेहूं (Wheat)</option>
            <option>गन्ना (Sugarcane)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700">{texts.stageLabel}</label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
          >
            <option>बुवाई समय बेसल डोज (Basal Dose at Sowing)</option>
            <option>शाकीय बढ़वार अवस्था (Vegetative Growth)</option>
            <option>फूल व फल अवस्था (Flowering / Fruiting)</option>
            <option>दाना भराई अवस्था (Grain Filling)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700">{texts.soilLabel}</label>
          <select
            value={soilStatus}
            onChange={(e) => setSoilStatus(e.target.value)}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
          >
            <option>मध्यम नाइट्रोजन, मध्यम पोटाश</option>
            <option>कम जैविक कार्बन, उच्च फास्फोरस</option>
            <option>सामान्य संतुलित काली मिट्टी</option>
          </select>
        </div>
      </div>

      {/* Advisory Output */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>{texts.advisoryTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-amber-950">
              <FlaskConical className="w-4 h-4 text-amber-700" />
              <span>{texts.chemicalHeading}</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
              <li><strong>यूरिया (Nitrogen):</strong> विभाजित खुराक (Split application) में दें। गूलर/फल के समय यूरिया का अधिक उपयोग न करें।</li>
              <li><strong>पोटाश (MOP 0-0-60):</strong> 20-25 किग्रा/एकड़ फल बनने की अवस्था पर दानों के वजन व चमक बढ़ाने हेतु।</li>
              <li><strong>जिंक सल्फेट व बोरॉन:</strong> 0.5% जिंक सल्फेट + 0.2% बोरिक एसिड का पर्णीय छिड़काव फूल गिरने से बचाता है।</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
              <Leaf className="w-4 h-4 text-emerald-700" />
              <span>{texts.organicHeading}</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
              <li><strong>जीवामृत / घनजीवामृत:</strong> 200 लीटर जीवामृत प्रति एकड़ सिंचाई के पानी के साथ चलाएं।</li>
              <li><strong>नीम खली (Neem Cake):</strong> 100 किग्रा प्रति एकड़ दीमक व सूत्रकृमि (Nematodes) से सुरक्षा देता है।</li>
              <li><strong>पीएसबी (PSB) व एजोटोबैक्टर:</strong> बीज उपचार और मृदा में फास्फोरस की उपलब्धता 20% बढ़ाता है।</li>
            </ul>
          </div>
        </div>

        {/* Safety Warning */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5 text-xs text-rose-900">
          <div className="flex items-center gap-2 font-black">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>{texts.safetyHeading}</span>
          </div>
          <p className="leading-relaxed">{texts.safetyNote}</p>
        </div>

        <p className="text-[10px] text-slate-400 text-center italic">
          {texts.disclaimer}
        </p>
      </div>
    </div>
  );
};
