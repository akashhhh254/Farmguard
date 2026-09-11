import React from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Sprout, 
  HeartPulse, 
  FileSpreadsheet, 
  Download,
  Building2,
  Activity,
  Layers
} from 'lucide-react';
import { Language, ScanRecord } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface AdminAnalyticsProps {
  language: Language;
  scans: ScanRecord[];
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  language,
  scans,
}) => {
  // Agronomic disease frequency statistics
  const cropDiseaseStats = [
    { name: 'Cercospora Leaf Spot', count: 34, severity: 'Moderate', crop: 'Cotton' },
    { name: 'Early Blight (Alternaria)', count: 28, severity: 'High', crop: 'Tomato' },
    { name: 'Yellow Rust', count: 19, severity: 'High', crop: 'Wheat' },
    { name: 'Anthracnose Fruit Rot', count: 15, severity: 'Moderate', crop: 'Chili' },
    { name: 'Powdery Mildew', count: 12, severity: 'Low', crop: 'Soybean' },
  ];

  // Livestock surveillance statistics
  const animalConditionStats = [
    { name: 'Suspected Lumpy Skin Disease', count: 14, risk: 'High', animal: 'Cattle' },
    { name: 'Sub-Clinical Mastitis', count: 11, risk: 'Moderate', animal: 'Buffalo' },
    { name: 'Ruminal Bloat / Tympany', count: 9, risk: 'Moderate', animal: 'Goat/Sheep' },
    { name: 'Poultry Heat Stress Respiratory', count: 8, risk: 'Moderate', animal: 'Poultry' },
    { name: 'Foot Rot / Lameness', count: 6, risk: 'Low', animal: 'Sheep' },
  ];

  // Regional outbreak clusters
  const regionalClusters = [
    {
      region: 'Nashik District (Niphad, Sinnar)',
      primaryThreat: 'Cotton Cercospora & Tomato Early Blight',
      affectedFarms: 58,
      severity: 'High',
      status: 'Advisory Dispatched',
    },
    {
      region: 'Jalgaon District (Raver, Yawal)',
      primaryThreat: 'Banana Sigatoka & Cattle Cutaneous Nodules',
      affectedFarms: 42,
      severity: 'Critical',
      status: 'Veterinary Team En Route',
    },
    {
      region: 'Ahmednagar District (Rahuri, Sangamner)',
      primaryThreat: 'Wheat Stripe Rust Surveillance',
      affectedFarms: 26,
      severity: 'Monitoring',
      status: 'Spore Trap Verified',
    },
    {
      region: 'Aurangabad / Chhatrapati Sambhajinagar',
      primaryThreat: 'Soybean Pod Blight',
      affectedFarms: 19,
      severity: 'Moderate',
      status: 'Seed Treatment Protocol',
    },
  ];

  const pieColors = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Module 11: Regional Agronomy & Veterinary Surveillance
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            District Agronomy & Veterinary Officer Portal
          </h2>
          <p className="text-xs text-slate-500">
            Aggregated epidemiological surveillance for Krishi Vigyan Kendras (KVK), Extension Officers, and State Animal Husbandry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            Surveillance Active: 4 Districts
          </span>
        </div>
      </div>

      {/* KPI Top Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Active Monitored Farms</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">1,248</span>
            <span className="text-[11px] text-emerald-600 font-bold">+12% this wk</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 42 Gram Panchayats</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Plant Pathogen Scans</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-700">3,490</span>
            <span className="text-[11px] text-slate-500 font-bold">92.4% accuracy</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cotton & Tomato lead</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Livestock Screenings</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-700">894</span>
            <span className="text-[11px] text-rose-600 font-bold">14 LSD flags</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Quarantine alerts sent</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Edge Sync Reliability</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-indigo-700">99.8%</span>
            <span className="text-[11px] text-emerald-600 font-bold">0 data loss</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Offline-first queue active</p>
        </div>
      </div>

      {/* Regional Outbreak Alert Clusters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">Active Regional Disease Clusters & Early Warning Alerts</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Real-time spatial aggregation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {regionalClusters.map((cluster, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                cluster.severity === 'Critical'
                  ? 'bg-rose-50/70 border-rose-200'
                  : cluster.severity === 'High'
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-900 text-sm">{cluster.region}</span>
                <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${
                  cluster.severity === 'Critical'
                    ? 'bg-rose-600 text-white'
                    : cluster.severity === 'High'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-200 text-slate-800'
                }`}>
                  {cluster.severity}
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-medium">Primary Threat Vector:</span>
                <p className="text-slate-900 font-bold mt-0.5">{cluster.primaryThreat}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                <span className="text-slate-600 font-medium">
                  Impacted Farms: <strong>{cluster.affectedFarms}</strong>
                </span>
                <span className="text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                  {cluster.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disease Distribution Charts: Crops vs Livestock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Crop Pathogens */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Crop Pathogen Frequency Index</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">30-Day Field Reports</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropDiseaseStats} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} name="Cases Identified" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {cropDiseaseStats.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{item.name} ({item.crop})</span>
                <span className="font-bold text-emerald-700">{item.count} confirmed scans</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Common Livestock Conditions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Livestock Health Syndromic Flags</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Veterinary Case Logs</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={animalConditionStats} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Animals Screened" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {animalConditionStats.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{item.name} ({item.animal})</span>
                <span className="font-bold text-amber-800">{item.count} flagged cases</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
