import React, { useState } from 'react';
import { 
  Sprout, 
  HeartPulse, 
  User, 
  Phone, 
  MapPin, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Languages
} from 'lucide-react';
import { FarmerProfile, Language } from '../types';
import { DEFAULT_DEMO_PROFILE } from '../services/storage';

interface FarmerRegistrationScreenProps {
  onRegister: (profile: FarmerProfile) => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const FarmerRegistrationScreen: React.FC<FarmerRegistrationScreenProps> = ({
  onRegister,
  currentLanguage,
  onLanguageChange,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('महाराष्ट्र (नाशिक)');
  const [farmSizeAcres, setFarmSizeAcres] = useState('3');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['कपास (Cotton)', 'टमाटर (Tomato)']);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>(['गाय (Cow)']);
  const [errorMsg, setErrorMsg] = useState('');

  // Translations specifically for Registration Form
  const texts = {
    hi: {
      badge: 'डिजिटल किसान सेवा',
      title: 'किसान पंजीकरण फॉर्म',
      subtitle: 'फसल और पशु स्वास्थ्य की तुरंत जांच के लिए अपनी जानकारी दर्ज करें',
      langSelect: 'भाषा चुनें:',
      nameLabel: '1. किसान का पूरा नाम *',
      namePlaceholder: 'उदा. आकाश ठाकरे / रमेश पाटिल',
      phoneLabel: '2. मोबाइल नंबर *',
      phonePlaceholder: '10 अंकों का मोबाइल नंबर',
      districtLabel: '3. राज्य एवं जिला *',
      districtPlaceholder: 'उदा. नाशिक, महाराष्ट्र',
      villageLabel: '4. गाँव / कस्बा *',
      villagePlaceholder: 'उदा. पिंपलगांव, रावेर',
      landLabel: '5. खेत का आकार (एकड़ में)',
      cropsLabel: '6. आप कौन-सी फसलें उगाते हैं? (चुनें)',
      animalsLabel: '7. आपके पास कौन-से पशु हैं? (चुनें)',
      submitBtn: 'पंजीकरण पूरा करें और मुख्य पेज पर जाएं 🚀',
      quickFill: '⚡ एक क्लिक में डेमो भरें (Quick Demo Fill)',
      securityNote: 'आपकी जानकारी सुरक्षित है और केवल फसल व पशु स्वास्थ्य सलाह के लिए उपयोग की जाएगी।',
      errorRequired: 'कृपया अपना नाम और मोबाइल नंबर अवश्य भरें!',
    },
    mr: {
      badge: 'डिजिटल शेतकरी सेवा',
      title: 'शेतकरी नोंदणी फॉर्म',
      subtitle: 'पीक आणि पशु आरोग्याच्या अचूक तपासणीसाठी आपली माहिती भरा',
      langSelect: 'भाषा निवडा:',
      nameLabel: '१. शेतकऱ्याचे पूर्ण नाव *',
      namePlaceholder: 'उदा. आकाश ठाकरे / रमेश पाटील',
      phoneLabel: '२. मोबाईल नंबर *',
      phonePlaceholder: '१० अंकी मोबाईल नंबर',
      districtLabel: '३. राज्य व जिल्हा *',
      districtPlaceholder: 'उदा. नाशिक, महाराष्ट्र',
      villageLabel: '४. गाव / तालुका *',
      villagePlaceholder: 'उदा. पिंपळगाव, रावेर',
      landLabel: '५. शेतीचे क्षेत्र (एकर मध्ये)',
      cropsLabel: '६. आपण कोणती पिके घेता? (निवडा)',
      animalsLabel: '७. आपल्याकडे कोणते पशुधन आहे? (निवडा)',
      submitBtn: 'नोंदणी पूर्ण करा आणि मुख्य पेजवर जा 🚀',
      quickFill: '⚡ एका क्लिकमध्ये डेमो भरा (Quick Demo Fill)',
      securityNote: 'आपली माहिती सुरक्षित असून केवळ पीक आणि पशु आरोग्य सल्ल्यासाठी वापरली जाईल.',
      errorRequired: 'कृपया आपले नाव आणि मोबाईल नंबर नक्की भरा!',
    },
    en: {
      badge: 'Farmer Digital Gateway',
      title: 'Farmer Registration & Profile',
      subtitle: 'Enter your farm details to unlock instant AI crop and livestock health checks',
      langSelect: 'Select Language:',
      nameLabel: '1. Farmer Full Name *',
      namePlaceholder: 'e.g. Akash Thakare / Ramesh Patil',
      phoneLabel: '2. Mobile Number *',
      phonePlaceholder: '10-digit mobile number',
      districtLabel: '3. State & District *',
      districtPlaceholder: 'e.g. Nashik, Maharashtra',
      villageLabel: '4. Village / Town *',
      villagePlaceholder: 'e.g. Pimpalgaon, Sinnar',
      landLabel: '5. Farm Size (in Acres)',
      cropsLabel: '6. What crops do you cultivate? (Select)',
      animalsLabel: '7. What livestock animals do you rear? (Select)',
      submitBtn: 'Complete Registration & Enter FarmGuard 🚀',
      quickFill: '⚡ One-Click Demo Fill',
      securityNote: 'Your farm data is stored safely on your device for personalized agronomic & veterinary advisories.',
      errorRequired: 'Please enter your Name and Mobile Number to continue!',
    },
  }[currentLanguage];

  const availableCrops = [
    { id: 'cotton', label: currentLanguage === 'mr' ? 'कापूस (Cotton)' : currentLanguage === 'hi' ? 'कपास (Cotton)' : 'Cotton', icon: '🌱' },
    { id: 'tomato', label: currentLanguage === 'mr' ? 'टोमॅटो (Tomato)' : currentLanguage === 'hi' ? 'टमाटर (Tomato)' : 'Tomato', icon: '🍅' },
    { id: 'wheat', label: currentLanguage === 'mr' ? 'गहू (Wheat)' : currentLanguage === 'hi' ? 'गेहूं (Wheat)' : 'Wheat', icon: '🌾' },
    { id: 'soybean', label: currentLanguage === 'mr' ? 'सोयाबीन (Soybean)' : currentLanguage === 'hi' ? 'सोयाबीन (Soybean)' : 'Soybean', icon: '🌿' },
    { id: 'rice', label: currentLanguage === 'mr' ? 'भात/धान (Paddy)' : currentLanguage === 'hi' ? 'धान/चावल (Rice)' : 'Rice/Paddy', icon: '🌾' },
    { id: 'chili', label: currentLanguage === 'mr' ? 'मिरची (Chili)' : currentLanguage === 'hi' ? 'मिर्च (Chili)' : 'Chili', icon: '🌶️' },
    { id: 'onion', label: currentLanguage === 'mr' ? 'कांदा (Onion)' : currentLanguage === 'hi' ? 'प्याज (Onion)' : 'Onion', icon: '🧅' },
    { id: 'sugarcane', label: currentLanguage === 'mr' ? 'ऊस (Sugarcane)' : currentLanguage === 'hi' ? 'गन्ना (Sugarcane)' : 'Sugarcane', icon: '🎋' },
  ];

  const availableAnimals = [
    { id: 'cow', label: currentLanguage === 'mr' ? 'गाय (Cow)' : currentLanguage === 'hi' ? 'गाय (Cow)' : 'Cow / Cattle', icon: '🐄' },
    { id: 'buffalo', label: currentLanguage === 'mr' ? 'म्हैस (Buffalo)' : currentLanguage === 'hi' ? 'भैंस (Buffalo)' : 'Buffalo', icon: '🐃' },
    { id: 'goat', label: currentLanguage === 'mr' ? 'शेळी (Goat)' : currentLanguage === 'hi' ? 'बकरी (Goat)' : 'Goat', icon: '🐐' },
    { id: 'sheep', label: currentLanguage === 'mr' ? 'मेंढी (Sheep)' : currentLanguage === 'hi' ? 'भेड़ (Sheep)' : 'Sheep', icon: '🐑' },
    { id: 'poultry', label: currentLanguage === 'mr' ? 'कुक्कुटपालन (Poultry)' : currentLanguage === 'hi' ? 'मुर्गी (Poultry)' : 'Poultry/Chicken', icon: '🐔' },
  ];

  const toggleCrop = (cropLabel: string) => {
    if (selectedCrops.includes(cropLabel)) {
      setSelectedCrops(selectedCrops.filter((c) => c !== cropLabel));
    } else {
      setSelectedCrops([...selectedCrops, cropLabel]);
    }
  };

  const toggleAnimal = (animalLabel: string) => {
    if (selectedAnimals.includes(animalLabel)) {
      setSelectedAnimals(selectedAnimals.filter((a) => a !== animalLabel));
    } else {
      setSelectedAnimals([...selectedAnimals, animalLabel]);
    }
  };

  const handleQuickFill = () => {
    setName(DEFAULT_DEMO_PROFILE.name);
    setPhone(DEFAULT_DEMO_PROFILE.phone || '9822012345');
    setVillage(DEFAULT_DEMO_PROFILE.village);
    setDistrict(DEFAULT_DEMO_PROFILE.district);
    setFarmSizeAcres(DEFAULT_DEMO_PROFILE.farmSizeAcres);
    setSelectedCrops(DEFAULT_DEMO_PROFILE.crops);
    setSelectedAnimals(DEFAULT_DEMO_PROFILE.animals);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(texts.errorRequired);
      return;
    }

    const newProfile: FarmerProfile = {
      name: name.trim(),
      phone: phone.trim() || '9822012345',
      village: village.trim() || (currentLanguage === 'mr' ? 'पिंपळगाव' : 'पिंपलगांव'),
      district: district.trim() || (currentLanguage === 'mr' ? 'नाशिक, महाराष्ट्र' : 'नाशिक, महाराष्ट्र'),
      farmSizeAcres: farmSizeAcres || '4',
      crops: selectedCrops.length > 0 ? selectedCrops : ['कपास (Cotton)', 'टमाटर (Tomato)'],
      animals: selectedAnimals.length > 0 ? selectedAnimals : ['गाय (Cow)'],
      language: currentLanguage,
      isRegistered: true,
    };

    onRegister(newProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-950 py-8 px-4 flex flex-col justify-center items-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-500/20">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-bold text-emerald-100 mb-2 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>{texts.badge}</span>
          </div>

          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 flex items-center justify-center font-black text-xl shadow-md">
              <Sprout className="w-6 h-6 text-emerald-700" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">FARMGUARD AI</h1>
          </div>

          <h2 className="text-lg sm:text-xl font-bold mt-2 text-emerald-50">
            {texts.title}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-lg mx-auto">
            {texts.subtitle}
          </p>

          {/* Quick Language Switcher Bar at Top */}
          <div className="mt-4 inline-flex items-center bg-black/20 p-1 rounded-xl border border-white/20 text-xs font-bold">
            <span className="px-2 text-emerald-200 text-[11px] hidden sm:inline">{texts.langSelect}</span>
            <button
              type="button"
              onClick={() => onLanguageChange('hi')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                currentLanguage === 'hi' ? 'bg-white text-emerald-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              🇮🇳 हिन्दी
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('mr')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                currentLanguage === 'mr' ? 'bg-white text-emerald-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              🇮🇳 मराठी
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                currentLanguage === 'en' ? 'bg-white text-emerald-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Farmer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>{texts.nameLabel}</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg('');
                }}
                placeholder={texts.namePlaceholder}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{texts.phoneLabel}</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={texts.phonePlaceholder}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* 2. Village, District & Farm Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{texts.villageLabel}</span>
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder={texts.villagePlaceholder}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{texts.districtLabel}</span>
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder={texts.districtPlaceholder}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                <span>{texts.landLabel}</span>
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={farmSizeAcres}
                onChange={(e) => setFarmSizeAcres(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* 3. Crops Selector with Big Friendly Visual Badges */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>{texts.cropsLabel}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {availableCrops.map((crop) => {
                const isSelected = selectedCrops.includes(crop.label);
                return (
                  <button
                    type="button"
                    key={crop.id}
                    onClick={() => toggleCrop(crop.label)}
                    className={`p-3 rounded-xl border-2 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all text-left ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                        : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">{crop.icon}</span>
                    <span className="flex-1 leading-tight">{crop.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Livestock Selector with Big Friendly Badges */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-amber-600" />
              <span>{texts.animalsLabel}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {availableAnimals.map((animal) => {
                const isSelected = selectedAnimals.includes(animal.label);
                return (
                  <button
                    type="button"
                    key={animal.id}
                    onClick={() => toggleAnimal(animal.label)}
                    className={`p-3 rounded-xl border-2 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all text-left ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-xs'
                        : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">{animal.icon}</span>
                    <span className="flex-1 leading-tight">{animal.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions: Big Submit Button and Quick Fill Demo */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99]"
            >
              <span>{texts.submitBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <span>{texts.quickFill}</span>
              </button>

              <span className="text-[11px] text-slate-400 font-medium">
                100% Free for Farmers
              </span>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-slate-100">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{texts.securityNote}</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
