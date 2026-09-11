import React, { useState } from 'react';
import { 
  Sprout, 
  HeartPulse, 
  History, 
  Bell, 
  Mic, 
  User, 
  Menu, 
  X,
  LogOut,
  Layers,
  PhoneCall
} from 'lucide-react';
import { Language, AppView, FarmerProfile } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  unreadAlertsCount: number;
  onOpenVoiceModal: () => void;
  onOpenProfileModal: () => void;
  farmerProfile: FarmerProfile;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  language,
  onLanguageChange,
  unreadAlertsCount,
  onOpenVoiceModal,
  onOpenProfileModal,
  farmerProfile,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  // Simplified navigation directly focused on what the farmer needs
  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: t.navDashboard || 'होम', icon: <Layers className="w-4 h-4" /> },
    { id: 'crop-scanner', label: t.navCrops || 'फसल स्वास्थ्य', icon: <Sprout className="w-4 h-4 text-emerald-600" /> },
    { id: 'animal-scanner', label: t.navAnimals || 'पशु स्वास्थ्य', icon: <HeartPulse className="w-4 h-4 text-amber-600" /> },
    { id: 'history', label: t.navHistory || 'जांच इतिहास', icon: <History className="w-4 h-4 text-indigo-600" /> },
    { id: 'alerts', label: t.navAlerts || 'अलर्ट', icon: <Bell className="w-4 h-4 text-rose-600" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo & Farmer Info */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => onNavigate('dashboard')}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight">FARMGUARD</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">AI</span>
                </div>
                <p className="text-[10px] text-slate-500 hidden md:block font-medium">किसान और पशु स्वास्थ्य सहायक</p>
              </div>
            </div>

            {/* Farmer Registered Badge */}
            {farmerProfile.name && (
              <div 
                onClick={onOpenProfileModal}
                className="hidden lg:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs text-emerald-900 font-bold cursor-pointer transition-colors"
                title="किसान प्रोफाइल देखें / संपादित करें"
              >
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span className="max-w-[130px] truncate">{farmerProfile.name}</span>
                {farmerProfile.village && (
                  <span className="text-[10px] text-emerald-700/80 font-normal">({farmerProfile.village})</span>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.id === 'alerts' && unreadAlertsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500 text-white font-bold">
                      {unreadAlertsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Big Prominent Voice Assistant Button for Farmers */}
            <button
              onClick={onOpenVoiceModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold px-3 py-2 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
              title="बोलकर सवाल पूछें (Voice Assistant)"
            >
              <Mic className="w-4 h-4 animate-pulse text-amber-200" />
              <span className="inline font-bold">
                {language === 'hi' ? 'बोलकर पूछें' : language === 'mr' ? 'बोलून विचारा' : 'Voice'}
              </span>
            </button>

            {/* Language Switcher - Very clear for rural farmers */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 rounded-lg cursor-pointer transition-all ${
                  language === 'hi' ? 'bg-white text-emerald-800 font-extrabold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="हिन्दी"
              >
                हिं
              </button>
              <button
                onClick={() => onLanguageChange('mr')}
                className={`px-2 py-1 rounded-lg cursor-pointer transition-all ${
                  language === 'mr' ? 'bg-white text-emerald-800 font-extrabold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="मराठी"
              >
                मरा
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded-lg cursor-pointer transition-all ${
                  language === 'en' ? 'bg-white text-emerald-800 font-extrabold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Profile / Switch Farmer Button */}
            <button
              onClick={onOpenProfileModal}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title={t.profileTitle}
            >
              <User className="w-4 h-4 text-emerald-700" />
            </button>

            {/* Logout / Switch Farmer Gate */}
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title={language === 'hi' ? 'नया किसान पंजीकरण / लॉगआउट' : language === 'mr' ? 'नवीन नोंदणी / बाहेर पडा' : 'Switch Farmer / Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {farmerProfile.name && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-950">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                {farmerProfile.name} ({farmerProfile.village || 'खेत'})
              </span>
              <button
                onClick={onLogout}
                className="text-[11px] text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>लॉगआउट</span>
              </button>
            </div>
          )}

          {navItems.map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.id === 'alerts' && unreadAlertsCount > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-rose-500 text-white font-bold">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
