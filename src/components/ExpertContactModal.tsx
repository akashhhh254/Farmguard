import React from 'react';
import { 
  X, 
  PhoneCall, 
  Share2, 
  Download, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { ScanRecord, FarmerProfile } from '../types';

interface ExpertContactModalProps {
  scan: ScanRecord | null;
  farmer: FarmerProfile;
  onClose: () => void;
}

export const ExpertContactModal: React.FC<ExpertContactModalProps> = ({
  scan,
  farmer,
  onClose,
}) => {
  if (!scan) return null;

  const isCrop = scan.type === 'crop';

  const handleShare = async () => {
    const text = `FarmGuard AI Escalation Card:\nEntity: ${scan.entityName}\nSuspected: ${scan.condition}\nSeverity: ${scan.severity} (${scan.confidence}% confidence)\nFarmer: ${farmer.name}, ${farmer.village}\nContact: ${farmer.phone}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FarmGuard AI Case: ${scan.entityName}`,
          text: text,
        });
      } catch (e) {
        console.log('Share dismissed');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Case card summary copied to clipboard! You can paste into WhatsApp or SMS.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isCrop ? 'KVK & Agronomist Escalation' : 'Veterinary Officer Consultation'}
              </h3>
              <p className="text-[11px] text-slate-500">Official Farmer Decision Support Case Handoff</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shareable Case Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              FarmGuard AI Telemetry Card
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              scan.severity === 'High' || scan.severity === 'Emergency'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {scan.severity} Priority
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
              <img src={scan.imageThumbnail} alt={scan.entityName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                {scan.entityName} — {scan.condition}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                AI Diagnostic Confidence: <strong>{scan.confidence}%</strong>
              </p>
              <span className="text-[11px] text-slate-400 block mt-0.5">{scan.date}</span>
            </div>
          </div>

          {/* Farmer Details */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/60 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-700">
              <span><strong>Farmer:</strong> {farmer.name}</span>
              <span><strong>Phone:</strong> {farmer.phone}</span>
            </div>
            <div className="text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{farmer.village}, {farmer.district} ({farmer.farmSizeAcres} Acres)</span>
            </div>
          </div>

          {/* Summary notes */}
          <div className="text-xs text-slate-600 leading-relaxed bg-white/60 p-2.5 rounded-lg border border-slate-200/50">
            <strong>Diagnostic Memo:</strong>{' '}
            {isCrop
              ? scan.cropData?.whyAiFlaggedThis?.join(' ') || 'Foliar fungal pathogen spotted.'
              : scan.animalData?.whyAiFlaggedThis?.join(' ') || 'Cutaneous nodular screening alert.'}
          </div>
        </div>

        {/* Direct Action Buttons: Free Government Helplines */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Immediate Helplines:</span>

          {isCrop ? (
            <a
              href="tel:18001801551"
              className="w-full p-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-between cursor-pointer transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                <span>Call Kisan Call Center (KCC) — Toll Free</span>
              </div>
              <span className="bg-emerald-800 px-2 py-0.5 rounded text-[11px]">1800-180-1551</span>
            </a>
          ) : (
            <a
              href="tel:1962"
              className="w-full p-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center justify-between cursor-pointer transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                <span>Call Pashu Arogya Seva (Veterinary Helpline)</span>
              </div>
              <span className="bg-amber-800 px-2 py-0.5 rounded text-[11px]">1962</span>
            </a>
          )}

          <button
            onClick={handleShare}
            className="w-full p-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Share Case Card (WhatsApp / SMS / Doctor)</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          FarmGuard AI provides early screening and decision support for farmers. Never delay consulting a certified agricultural specialist or veterinarian in acute emergencies.
        </p>
      </div>
    </div>
  );
};
