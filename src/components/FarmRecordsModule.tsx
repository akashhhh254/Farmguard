import React, { useState } from 'react';
import { 
  ClipboardList, 
  Sprout, 
  HeartPulse, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { Language, CropRecordItem, AnimalRecordItem } from '../types';
import { 
  getStoredCropRecords, 
  saveStoredCropRecords, 
  getStoredAnimalRecords, 
  saveStoredAnimalRecords 
} from '../services/storage';

interface FarmRecordsModuleProps {
  language: Language;
  onBack: () => void;
}

export const FarmRecordsModule: React.FC<FarmRecordsModuleProps> = ({
  language,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'crops' | 'animals'>('crops');
  const [crops, setCrops] = useState<CropRecordItem[]>(getStoredCropRecords());
  const [animals, setAnimals] = useState<AnimalRecordItem[]>(getStoredAnimalRecords());

  const texts = {
    hi: {
      title: 'खेत एवं पशुधन अभिलेख (Crop & Livestock Ledger)',
      subtitle: 'बोई गई फसलों, रोपण तिथियों, पशु टैग और टीकाकरण का स्थायी रिकॉर्ड',
      cropsTab: '🌱 फसल रिकॉर्ड (Crops Ledger)',
      animalsTab: '🐄 पशुधन रिकॉर्ड (Livestock Ledger)',
      addCrop: '+ नई फसल जोड़ें',
      addAnimal: '+ नया पशु जोड़ें',
      variety: 'किस्म:',
      planted: 'रोपण तिथि:',
      plot: 'खेत क्षेत्र:',
      stage: 'अवस्था:',
      tag: 'टैग संख्या / नाम:',
      age: 'उम्र:',
      vaccines: 'टीकाकरण इतिहास:',
      lastCheckup: 'पिछली जांच:',
      backBtn: '← मुख्य पृष्ठ पर वापस जाएं',
    },
    mr: {
      title: 'शेत व पशुधन नोंदवही (Crop & Livestock Ledger)',
      subtitle: 'पेरणीची तारीख, पिकाची जात, जनावरांचे टॅग व लसीकरणाची संपूर्ण नोंद',
      cropsTab: '🌱 पीक नोंदवही (Crops Ledger)',
      animalsTab: '🐄 पशुधन नोंदवही (Livestock Ledger)',
      addCrop: '+ नवीन पीक जोडा',
      addAnimal: '+ नवीन जनावर जोडा',
      variety: 'वाण:',
      planted: 'पेरणी दिनांक:',
      plot: 'शेत क्षेत्र:',
      stage: 'अवस्था:',
      tag: 'टॅग क्रमांक / नाव:',
      age: 'वय:',
      vaccines: 'लसीकरण नोंदी:',
      lastCheckup: 'मागील तपासणी:',
      backBtn: '← मुख्य पृष्ठावर परत जा',
    },
    en: {
      title: 'Crop & Livestock Ledger',
      subtitle: 'Maintain planting schedules, field plots, animal tag IDs and vaccination dates',
      cropsTab: '🌱 Crop Records',
      animalsTab: '🐄 Livestock Records',
      addCrop: '+ Add Crop Plot',
      addAnimal: '+ Add Animal Tag',
      variety: 'Variety:',
      planted: 'Planting Date:',
      plot: 'Field / Area:',
      stage: 'Stage:',
      tag: 'Tag ID / Name:',
      age: 'Age:',
      vaccines: 'Vaccination History:',
      lastCheckup: 'Last Checkup:',
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

      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
            📋
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">{texts.title}</h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">{texts.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('crops')}
          className={`pb-2 px-3 text-sm font-black transition-all cursor-pointer ${
            activeTab === 'crops' 
              ? 'border-b-2 border-emerald-600 text-emerald-800' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {texts.cropsTab} ({crops.length})
        </button>
        <button
          onClick={() => setActiveTab('animals')}
          className={`pb-2 px-3 text-sm font-black transition-all cursor-pointer ${
            activeTab === 'animals' 
              ? 'border-b-2 border-amber-600 text-amber-800' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {texts.animalsTab} ({animals.length})
        </button>
      </div>

      {/* CROPS LIST */}
      {activeTab === 'crops' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crops.map((crop) => (
              <div key={crop.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌱</span>
                    <h3 className="font-black text-slate-900 text-base">{crop.cropName}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    {crop.stage}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p><strong>{texts.variety}</strong> {crop.variety || 'Hybrid'}</p>
                  <p><strong>{texts.plot}</strong> {crop.fieldArea}</p>
                  <p><strong>{texts.planted}</strong> {crop.plantingDate}</p>
                  <p className="text-slate-500 italic mt-1">"{crop.notes}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANIMALS LIST */}
      {activeTab === 'animals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {animals.map((an) => (
              <div key={an.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🐄</span>
                    <h3 className="font-black text-slate-900 text-base">{an.animalType}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                    {an.tagId}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5">
                  <p><strong>{texts.age}</strong> {an.ageYears} Years</p>
                  <p><strong>{texts.lastCheckup}</strong> {an.lastCheckupDate}</p>
                  <div>
                    <strong className="block text-slate-700">{texts.vaccines}</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {an.vaccinationHistory.map((v, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700">
                          ✓ {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-500 italic mt-1">"{an.notes}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
