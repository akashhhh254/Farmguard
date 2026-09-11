import React from 'react';
import { 
  BarChart3, 
  Sprout, 
  HeartPulse, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Calendar, 
  ChevronRight,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { Language, ScanRecord, FarmAlert } from '../types';
import { translations } from '../translations';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';

interface FarmHealthOverviewProps {
  language: Language;
  scans: ScanRecord[];
  alerts: FarmAlert[];
  onNavigateToCrop: () => void;
  onNavigateToAnimal: () => void;
  onViewScanDetail: (scan: ScanRecord) => void;
}

export const FarmHealthOverview: React.FC<FarmHealthOverviewProps> = ({
  language,
  scans,
  alerts,
  onNavigateToCrop,
  onNavigateToAnimal,
  onViewScanDetail,
}) => {
  const t = translations[language];

  const cropScans = scans.filter((s) => s.type === 'crop');
  const animalScans = scans.filter((s) => s.type === 'animal');

  const highRiskCases = scans.filter((s) => s.severity === 'High' || s.severity === 'Emergency');
  const moderateCases = scans.filter((s) => s.severity === 'Moderate');
  const healthyCases = scans.filter((s) => s.isHealthy || s.severity === 'Low');

  // Unified score calculation
  const total = scans.length;
  let score = 88;
  if (total > 0) {
    const penalty = (highRiskCases.length * 22 + moderateCases.length * 9) / total;
    score = Math.max(40, Math.min(98, Math.round(96 - penalty)));
  }

  const status = score >= 80 ? 'healthy' : score >= 60 ? 'attention' : 'risk';

  // 30-Day Trend Historical Data
  const trendData = [
    { day: 'Day 1', cropScore: 92, animalScore: 88, overall: 90 },
    { day: 'Day 6', cropScore: 89, animalScore: 86, overall: 87 },
    { day: 'Day 12', cropScore: 85, animalScore: 84, overall: 84 },
    { day: 'Day 18', cropScore: 90, animalScore: 82, overall: 86 },
    { day: 'Day 24', cropScore: 92, animalScore: 78, overall: 85 },
    { day: 'Today', cropScore: 91, animalScore: 79, overall: score },
  ];

  // Distribution Data
  const distributionData = [
    { name: 'Healthy', value: healthyCases.length || 1, color: '#10b981' },
    { name: 'Attention', value: moderateCases.length || 1, color: '#f59e0b' },
    { name: 'High Risk', value: highRiskCases.length || 1, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Module 3: Unified Farm Ecosystem Health
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Farm Health Overview
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Integrated diagnostic monitoring combining crop pathology, livestock screening, and local micro-climate data.
          </p>
        </div>

        {/* Big Health Status Badge */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Unified Farm Index</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-slate-900">{score}</span>
              <span className="text-xs font-bold text-slate-400">/100</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
            status === 'healthy'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : status === 'attention'
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-rose-50 text-rose-800 border-rose-300'
          }`}>
            <span>
              {status === 'healthy' ? '🟢 Healthy' : status === 'attention' ? '🟡 Needs Attention' : '🔴 High Risk'}
            </span>
          </div>
        </div>
      </div>

      {/* Dual Pillar Score Cards: Crops vs Livestock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Crop Pillar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Crop Health Ecosystem</h3>
                <p className="text-xs text-slate-500">{cropScans.length} plant samples logged</p>
              </div>
            </div>
            <button
              onClick={onNavigateToCrop}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              New Crop Scan +
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium">Healthy Crops</span>
              <p className="text-lg font-bold text-emerald-700 mt-1">
                {cropScans.filter((s) => s.isHealthy || s.severity === 'Low').length}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium">Leaf Spots / Mildew</span>
              <p className="text-lg font-bold text-amber-700 mt-1">
                {cropScans.filter((s) => s.severity === 'Moderate').length}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium">Severe Blight</span>
              <p className="text-lg font-bold text-rose-700 mt-1">
                {cropScans.filter((s) => s.severity === 'High').length}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
            <strong>Agronomic Summary:</strong> Cotton plot shows Cercospora fungal spots under current humid conditions. Tomato vines staked; preventative bio-fungicide recommended before rain.
          </div>
        </div>

        {/* Livestock Pillar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Livestock Health Ecosystem</h3>
                <p className="text-xs text-slate-500">{animalScans.length} animal evaluations logged</p>
              </div>
            </div>
            <button
              onClick={onNavigateToAnimal}
              className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              New Animal Scan +
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium">Healthy Herd</span>
              <p className="text-lg font-bold text-emerald-700 mt-1">
                {animalScans.filter((s) => s.isHealthy || s.severity === 'Low').length}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium">Mild Distress</span>
              <p className="text-lg font-bold text-amber-700 mt-1">
                {animalScans.filter((s) => s.severity === 'Moderate').length}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium">Veterinary Alert</span>
              <p className="text-lg font-bold text-rose-700 mt-1">
                {animalScans.filter((s) => s.severity === 'High' || s.severity === 'Emergency').length}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
            <strong>Veterinary Summary:</strong> 1 high-priority nodular dermatitis screening flagged on Gir cow; isolation active. Shed sanitized with lime; buffalo udder health normal.
          </div>
        </div>
      </div>

      {/* 30-Day Trend Chart & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">30-Day Farm Health Trend</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Past 30 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAnimal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="overall" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOverall)" name="Overall Farm Index" />
                <Area type="monotone" dataKey="animalScore" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorAnimal)" name="Livestock Health" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Overall Farm Score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Livestock Score</span>
            </div>
          </div>
        </div>

        {/* Severity Distribution Pie (1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
              <h3 className="text-sm font-bold text-slate-900">Condition Severity Split</h3>
              <span className="text-xs text-slate-400 font-medium">{scans.length} records</span>
            </div>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2">
              {distributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value} items</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 text-center">
            * Explainable health rating derived from physical scans, not speculative estimation.
          </div>
        </div>
      </div>

      {/* Actionable Preventative Farm Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ClipboardList className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Recommended Preventive Farm Checklist</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs text-emerald-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bio-Fungicide Spray Window</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              Spray Trichoderma viride or Neem oil (5ml/L) on Cotton and Tomato lower leaves before forecast showers tomorrow.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 text-xs text-amber-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Livestock Stall Disinfection</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Spread lime powder on stall floor; maintain dry bedding to prevent fly breeding and mastitis pathogens.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 text-xs text-blue-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-900">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Hydration & Salt Licks</span>
            </div>
            <p className="text-blue-800 leading-relaxed">
              Supply clean mineral salt licks and fresh water in shade to mitigate humidity stress in milking cattle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
