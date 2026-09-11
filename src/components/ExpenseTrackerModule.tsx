import React, { useState } from 'react';
import { 
  IndianRupee, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  ArrowLeft,
  Trash2,
  PieChart
} from 'lucide-react';
import { Language, ExpenseRecord } from '../types';
import { getStoredExpenses, saveStoredExpenses } from '../services/storage';

interface ExpenseTrackerModuleProps {
  language: Language;
  onBack: () => void;
}

export const ExpenseTrackerModule: React.FC<ExpenseTrackerModuleProps> = ({
  language,
  onBack,
}) => {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(getStoredExpenses());
  const [showAddForm, setShowAddForm] = useState(false);

  // New Record State
  const [recordType, setRecordType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState<ExpenseRecord['category']>('Fertilizer');
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const texts = {
    hi: {
      title: 'किसान आय-व्यय खाता (Farm Expense Tracker)',
      subtitle: 'बीज, खाद, कीटनाशक, मजदूरी और उपज बिक्री का सरल वित्तीय हिसाब',
      totalExpense: 'कुल खर्च (Total Expense)',
      totalIncome: 'कुल आमदनी (Total Income)',
      netBalance: 'अनुमानित बचत (Net Balance)',
      addRecord: '+ नया लेन-देन जोड़ें',
      historyTitle: 'हालिया लेन-देन रिकॉर्ड',
      noRecords: 'अभी तक कोई हिसाब नहीं दर्ज किया गया है।',
      typeLabel: 'प्रकार:',
      catLabel: 'श्रेणी (Category):',
      amountLabel: 'रुपये (Amount in ₹):',
      notesLabel: 'विवरण / टिप्पणी:',
      saveBtn: 'खाते में जोड़ें',
      cancelBtn: 'रद्द करें',
      backBtn: '← मुख्य पृष्ठ पर वापस जाएं',
    },
    mr: {
      title: 'शेतकरी जमा-खर्च वही (Farm Expense Tracker)',
      subtitle: 'बियाणे, खते, मजुरी व शेतमाल विक्रीचा सोपा आर्थिक हिशोब',
      totalExpense: 'एकूण खर्च (Total Expense)',
      totalIncome: 'एकूण उत्पन्न (Total Income)',
      netBalance: 'शिल्लक नफा (Net Balance)',
      addRecord: '+ नवीन व्यवहार जोडा',
      historyTitle: 'अलीकडील जमा-खर्च नोंदी',
      noRecords: 'अद्याप कोणताही हिशोब नोंदवला नाही.',
      typeLabel: 'प्रकार:',
      catLabel: 'वर्गवारी (Category):',
      amountLabel: 'रक्कम (Amount in ₹):',
      notesLabel: 'तपशील / शेरा:',
      saveBtn: 'नोंद जतन करा',
      cancelBtn: 'रद्द करा',
      backBtn: '← मुख्य पृष्ठावर परत जा',
    },
    en: {
      title: 'Farm Expense & Income Tracker',
      subtitle: 'Simple ledger for seeds, fertilizer, labor, veterinary, and produce sales',
      totalExpense: 'Total Expenses',
      totalIncome: 'Total Income',
      netBalance: 'Estimated Balance',
      addRecord: '+ Add Transaction',
      historyTitle: 'Recent Farm Ledger Entries',
      noRecords: 'No transactions recorded yet.',
      typeLabel: 'Type:',
      catLabel: 'Category:',
      amountLabel: 'Amount (₹):',
      notesLabel: 'Notes / Description:',
      saveBtn: 'Record Entry',
      cancelBtn: 'Cancel',
      backBtn: '← Back to Dashboard',
    },
  }[language];

  const totalExpense = expenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = expenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const newRecord: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: recordType,
      category,
      amount: Number(amount),
      notes: notes || category,
    };

    const updated = [newRecord, ...expenses];
    setExpenses(updated);
    saveStoredExpenses(updated);
    setShowAddForm(false);
    setAmount('');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveStoredExpenses(updated);
  };

  const CATEGORIES: ExpenseRecord['category'][] = [
    'Seeds',
    'Fertilizer',
    'Pesticides',
    'Labour',
    'Irrigation',
    'Equipment',
    'Veterinary',
    'Feed',
    'Transport',
    'Produce Sale',
    'Other',
  ];

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
            💰
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">{texts.title}</h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">{texts.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 shadow-2xs">
          <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            <span>{texts.totalExpense}</span>
          </span>
          <div className="text-2xl font-black text-rose-900 mt-2">
            ₹{totalExpense.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-2xs">
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{texts.totalIncome}</span>
          </span>
          <div className="text-2xl font-black text-emerald-900 mt-2">
            ₹{totalIncome.toLocaleString('en-IN')}
          </div>
        </div>

        <div className={`p-5 rounded-3xl border shadow-2xs ${
          netBalance >= 0 ? 'bg-teal-50 border-teal-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <IndianRupee className="w-4 h-4" />
            <span>{texts.netBalance}</span>
          </span>
          <div className={`text-2xl font-black mt-2 ${
            netBalance >= 0 ? 'text-teal-900' : 'text-amber-900'
          }`}>
            ₹{netBalance.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Add Button & Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">
            {texts.historyTitle}
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{texts.addRecord}</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">{texts.typeLabel}</label>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setRecordType('expense')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                      recordType === 'expense' ? 'bg-rose-600 text-white' : 'bg-white text-slate-700 border'
                    }`}
                  >
                    खर्च (Expense)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecordType('income')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                      recordType === 'income' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border'
                    }`}
                  >
                    आमदनी (Income)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">{texts.catLabel}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">{texts.amountLabel}</label>
                <input
                  type="number"
                  placeholder="₹ 1500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">{texts.notesLabel}</label>
                <input
                  type="text"
                  placeholder="उदा. खाद का कट्टा, बीज खरीद"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                {texts.cancelBtn}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
              >
                {texts.saveBtn}
              </button>
            </div>
          </form>
        )}

        {/* List of records */}
        {expenses.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-400 font-medium">
            {texts.noRecords}
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {expenses.map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                    rec.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {rec.type === 'income' ? '+' : '-'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{rec.notes || rec.category}</p>
                    <p className="text-[10px] text-slate-400">{rec.date} • {rec.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-sm font-black ${
                    rec.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {rec.type === 'income' ? '+' : '-'}₹{rec.amount.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
