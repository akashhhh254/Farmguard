import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Sprout, 
  HeartPulse, 
  ShieldAlert, 
  Calendar,
  ArrowUpDown,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { Language, ScanRecord } from '../types';
import { translations } from '../translations';

interface ScanHistoryProps {
  language: Language;
  scans: ScanRecord[];
  onViewDetail: (scan: ScanRecord) => void;
  onClearHistory?: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  language,
  scans,
  onViewDetail,
}) => {
  const t = translations[language];
  const [filterType, setFilterType] = useState<'all' | 'crop' | 'animal' | 'high_risk'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScans = scans.filter((scan) => {
    if (filterType === 'crop' && scan.type !== 'crop') return false;
    if (filterType === 'animal' && scan.type !== 'animal') return false;
    if (filterType === 'high_risk' && scan.severity !== 'High' && scan.severity !== 'Emergency') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        scan.entityName.toLowerCase().includes(q) ||
        scan.condition.toLowerCase().includes(q) ||
        scan.severity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Export as CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Date', 'Type', 'Entity', 'Condition', 'Confidence(%)', 'Severity', 'Healthy'];
    const rows = scans.map((s) => [
      s.id,
      `"${s.date}"`,
      s.type,
      `"${s.entityName}"`,
      `"${s.condition}"`,
      s.confidence,
      s.severity,
      s.isHealthy ? 'Yes' : 'No',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FarmGuard_Health_Records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Module 4: Farm Record Book
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Scan History & Health Log
          </h2>
          <p className="text-xs text-slate-500">
            Immutable longitudinal record of plant pathology scans and livestock screening cases.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl shadow-2xs cursor-pointer transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Records ({scans.length})
          </button>
          <button
            onClick={() => setFilterType('crop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
              filterType === 'crop'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Crops</span>
          </button>
          <button
            onClick={() => setFilterType('animal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
              filterType === 'animal'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Livestock</span>
          </button>
          <button
            onClick={() => setFilterType('high_risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
              filterType === 'high_risk'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>High Risk</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop, disease, or animal..."
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Scans List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredScans.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredScans.map((scan) => (
              <div
                key={scan.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img
                      src={scan.imageThumbnail}
                      alt={scan.entityName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        scan.type === 'crop'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {scan.type === 'crop' ? '🌱 Crop Pathology' : '🐄 Livestock Health'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {scan.date}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {scan.entityName} — <span className="text-slate-700 font-medium">{scan.condition}</span>
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Model Confidence: <strong>{scan.confidence}%</strong></span>
                      <span>•</span>
                      <span>Status: {scan.isHealthy ? 'Healthy' : 'Affected'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                    scan.severity === 'High' || scan.severity === 'Emergency'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : scan.severity === 'Moderate'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {scan.severity} Severity
                  </span>

                  <button
                    onClick={() => onViewDetail(scan)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Case</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <History className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No scan records match your filter</p>
            <p className="text-xs text-slate-400">Try changing your search keywords or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
