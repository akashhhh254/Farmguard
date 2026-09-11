import React from 'react';
import { 
  X, 
  Sprout, 
  HeartPulse, 
  Volume2, 
  HelpCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Share2, 
  Calendar, 
  MapPin, 
  PhoneCall 
} from 'lucide-react';
import { ScanRecord, Language } from '../types';
import { translations } from '../translations';

interface ScanDetailModalProps {
  scan: ScanRecord | null;
  language: Language;
  onClose: () => void;
  onOpenExpert: (scan: ScanRecord) => void;
}

export const ScanDetailModal: React.FC<ScanDetailModalProps> = ({
  scan,
  language,
  onClose,
  onOpenExpert,
}) => {
  if (!scan) return null;
  const t = translations[language];

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const isCrop = scan.type === 'crop';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isCrop ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isCrop ? '🌱 Crop Pathology Scan' : '🐄 Livestock Screening'}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {scan.date}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {scan.entityName} — {scan.condition}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSpeak(`${scan.entityName}: ${scan.condition}. Severity: ${scan.severity}.`)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Read aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media & Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 aspect-square">
            <img src={scan.imageThumbnail} alt={scan.entityName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>

          <div className="sm:col-span-2 space-y-3 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-semibold">AI Certainty</span>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">{scan.confidence}%</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${scan.confidence}%` }} />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-semibold">Severity / Risk</span>
                <p className={`text-base font-extrabold mt-0.5 ${
                  scan.severity === 'High' || scan.severity === 'Emergency'
                    ? 'text-rose-600'
                    : scan.severity === 'Moderate'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}>
                  {scan.severity}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {scan.isHealthy ? 'Healthy specimen' : 'Action advised'}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong>Record ID:</strong> {scan.id} • <strong>Sync Status:</strong> Stored locally & synced
            </div>
          </div>
        </div>

        {/* Explainable AI breakdown */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Why AI Flagged This Condition (Explainable AI)</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-700">
            {isCrop && scan.cropData?.whyAiFlaggedThis ? (
              scan.cropData.whyAiFlaggedThis.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))
            ) : !isCrop && scan.animalData?.whyAiFlaggedThis ? (
              scan.animalData.whyAiFlaggedThis.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))
            ) : (
              <li>Identified characteristic symptom markers and discoloration pattern.</li>
            )}
          </ul>
        </div>

        {/* Actions & Prevention */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recommended Immediate Actions</span>
            </h4>
            <div className="space-y-1.5">
              {(isCrop ? scan.cropData?.immediateActions : scan.animalData?.immediateSafeActions)?.map((action, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
                  <span className="font-bold text-emerald-800 shrink-0">{i + 1}.</span>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Escalation */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onOpenExpert(scan)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Escalate to Expert / Doctor</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
