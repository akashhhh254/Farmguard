import React, { useState } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  CloudRain, 
  Clock, 
  CheckCircle2, 
  Plus, 
  AlertTriangle, 
  Trash2, 
  Calendar,
  X,
  Filter
} from 'lucide-react';
import { Language, FarmAlert } from '../types';
import { translations } from '../translations';

interface AlertsManagerProps {
  language: Language;
  alerts: FarmAlert[];
  onAddAlert: (alert: FarmAlert) => void;
  onDismissAlert: (id: string) => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({
  language,
  alerts,
  onAddAlert,
  onDismissAlert,
}) => {
  const t = translations[language];
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'crop' | 'livestock' | 'weather' | 'reminder'>('all');

  // New alert form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'crop' | 'livestock' | 'weather' | 'reminder'>('crop');
  const [newSeverity, setNewSeverity] = useState<'info' | 'warning' | 'high'>('warning');
  const [newDescription, setNewDescription] = useState('');
  const [newAction, setNewAction] = useState('');

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const alert: FarmAlert = {
      id: `alert-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      severity: newSeverity,
      timestamp: 'Just now',
      description: newDescription || 'Follow-up inspection scheduled by farm operator.',
      actionRequired: newAction || 'Perform field inspection and log update.',
    };

    onAddAlert(alert);
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewAction('');
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterCategory === 'all') return true;
    return a.category === filterCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              Module 6: Real-Time Farm Alerts & Preventive Early Warning
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Farm Alerts & Scheduled Interventions
          </h2>
          <p className="text-xs text-slate-500">
            Timely agronomic advisories, disease incubation warnings, and veterinary task schedules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Farm Reminder</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
            filterCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setFilterCategory('crop')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
            filterCategory === 'crop'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          Crop Pathology
        </button>
        <button
          onClick={() => setFilterCategory('livestock')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
            filterCategory === 'livestock'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          Livestock Biosecurity
        </button>
        <button
          onClick={() => setFilterCategory('weather')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
            filterCategory === 'weather'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-50'
          }`}
        >
          Weather & Humidity
        </button>
        <button
          onClick={() => setFilterCategory('reminder')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
            filterCategory === 'reminder'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          Follow-up Reminders
        </button>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border transition-all shadow-xs space-y-3 flex flex-col justify-between ${
              alert.severity === 'high'
                ? 'bg-rose-50/70 border-rose-200'
                : alert.severity === 'warning'
                ? 'bg-amber-50/70 border-amber-200'
                : 'bg-blue-50/70 border-blue-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    alert.severity === 'high'
                      ? 'bg-rose-200 text-rose-900'
                      : alert.severity === 'warning'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-blue-200 text-blue-900'
                  }`}>
                    {alert.category}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{alert.timestamp}</span>
                </div>

                <button
                  onClick={() => onDismissAlert(alert.id)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  title="Mark resolved and dismiss"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2">
                {alert.title}
              </h3>

              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {alert.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">
                Action: {alert.actionRequired}
              </span>
              <button
                onClick={() => onDismissAlert(alert.id)}
                className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
              >
                Mark Done
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Alert Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule Farm Reminder / Alert</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Inspect Tomato Plot after 48h bio-spray"
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  >
                    <option value="crop">Crop Pathology</option>
                    <option value="livestock">Livestock</option>
                    <option value="weather">Weather Warning</option>
                    <option value="reminder">Follow-up</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newSeverity}
                    onChange={(e: any) => setNewSeverity(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  >
                    <option value="info">Normal</option>
                    <option value="warning">Warning / Watch</option>
                    <option value="high">High Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Details & Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed notes on what needs checking..."
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Action Required</label>
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="e.g. Check for white fungal mycelium on lower stems"
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  Save Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
