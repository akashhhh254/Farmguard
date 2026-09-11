import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sprout, 
  HeartPulse, 
  ShieldCheck, 
  AlertTriangle, 
  WifiOff, 
  CheckCircle2, 
  Download, 
  Bookmark,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { OFFLINE_EDUCATIONAL_LIBRARY } from '../sampleData';

interface OfflineLibraryProps {
  language: Language;
  isOnline: boolean;
}

export const OfflineLibrary: React.FC<OfflineLibraryProps> = ({
  language,
  isOnline,
}) => {
  const t = translations[language];
  const [activeCategory, setActiveCategory] = useState<'all' | 'crop' | 'livestock'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(OFFLINE_EDUCATIONAL_LIBRARY[0].id);

  const filteredItems = OFFLINE_EDUCATIONAL_LIBRARY.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.symptoms.toLowerCase().includes(q) ||
        (item.organicRemedy && item.organicRemedy.toLowerCase().includes(q)) ||
        (item.firstAid && item.firstAid.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Module 10: On-Device Offline Field Knowledge Base
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Offline Field Knowledge & First-Aid Guides
          </h2>
          <p className="text-xs text-slate-500">
            Available 100% offline without cellular network. Instant agronomic and veterinary emergency protocols.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Local Storage Cached</span>
        </div>
      </div>

      {/* Offline Status Alert */}
      {!isOnline && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm">Working in Offline Mode</span>
            <p className="mt-0.5 leading-relaxed">
              All guides below are permanently stored on your device. You can safely inspect crop diseases and animal emergency protocols right here in the field.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Guides ({OFFLINE_EDUCATIONAL_LIBRARY.length})
          </button>
          <button
            onClick={() => setActiveCategory('crop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
              activeCategory === 'crop'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Crop Guides</span>
          </button>
          <button
            onClick={() => setActiveCategory('livestock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
              activeCategory === 'livestock'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Livestock Protocols</span>
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms or treatment..."
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Accordion Cards */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    item.category === 'crop' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {item.category === 'crop' ? <Sprout className="w-5 h-5" /> : <HeartPulse className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      item.category === 'crop' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.category === 'crop' ? 'Crop Pathology' : 'Livestock Care'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-3.5 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Diagnostic Symptoms:</span>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg leading-relaxed">
                      {item.symptoms}
                    </p>
                  </div>

                  {item.category === 'crop' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                        <span className="font-bold text-emerald-900 block mb-1">Organic / Bio-Control Remedy:</span>
                        <p className="leading-relaxed">{item.organicRemedy}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950">
                        <span className="font-bold text-blue-900 block mb-1">Chemical Recommendation:</span>
                        <p className="leading-relaxed">{item.chemicalControl}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
                        <span className="font-bold text-amber-900 block mb-1">Immediate Safe First-Aid:</span>
                        <p className="leading-relaxed">{item.firstAid}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950">
                        <span className="font-bold text-rose-900 block mb-1">Veterinary Medical Directive:</span>
                        <p className="leading-relaxed">{item.veterinaryNote}</p>
                      </div>
                    </div>
                  )}

                  <div className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                    <strong>Prevention Protocol:</strong> {item.prevention}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
