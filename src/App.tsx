import React, { useState, useEffect } from 'react';
import { 
  AppView, 
  Language, 
  ScanRecord, 
  FarmAlert, 
  FarmerProfile, 
  WeatherContext,
  AuthUser
} from './types';
import { translations } from './translations';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredScans, 
  addScanRecord,
  getStoredAlerts, 
  saveStoredAlerts,
  isUserRegistered,
  clearUserRegistration,
  DEFAULT_DEMO_PROFILE
} from './services/storage';
import { AuthService } from './services/firebaseAuth';
import { fetchWeatherAdvisory } from './services/api';
import { HACKATHON_DEMO_SAMPLES } from './sampleData';

// Components
import { LandingWelcomeScreen } from './components/LandingWelcomeScreen';
import { FarmerRegistrationScreen } from './components/FarmerRegistrationScreen';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CropDetectionModule } from './components/CropDetectionModule';
import { AnimalHealthModule } from './components/AnimalHealthModule';
import { FarmHealthOverview } from './components/FarmHealthOverview';
import { ScanHistory } from './components/ScanHistory';
import { AlertsManager } from './components/AlertsManager';
import { OfflineLibrary } from './components/OfflineLibrary';
import { AdminAnalytics } from './components/AdminAnalytics';
import { SmartIrrigationModule } from './components/SmartIrrigationModule';
import { FertilizerAdvisorModule } from './components/FertilizerAdvisorModule';
import { ExpenseTrackerModule } from './components/ExpenseTrackerModule';
import { FarmRecordsModule } from './components/FarmRecordsModule';
import { MarketIntelligenceModule } from './components/MarketIntelligenceModule';
import { KnowledgeHubModule } from './components/KnowledgeHubModule';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { ExpertContactModal } from './components/ExpertContactModal';
import { FarmerProfileModal } from './components/FarmerProfileModal';
import { ScanDetailModal } from './components/ScanDetailModal';

export default function App() {
  // Current Authenticated User (from Firebase Auth session)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => AuthService.getCurrentUser());

  // Gating state: User MUST be authenticated and have a farm profile to access main page
  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    return Boolean(AuthService.getCurrentUser() && isUserRegistered());
  });

  // User Profile & Language
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(() => {
    const saved = getStoredProfile();
    return saved || DEFAULT_DEMO_PROFILE;
  });
  
  const [language, setLanguage] = useState<Language>(farmerProfile.language || 'hi');

  // Navigation & View State
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  // Farm Records & Diagnostics
  const [scans, setScans] = useState<ScanRecord[]>(getStoredScans());
  const [alerts, setAlerts] = useState<FarmAlert[]>(getStoredAlerts());
  const [weather, setWeather] = useState<WeatherContext>({
    location: `${farmerProfile.district || 'नाशिक, महाराष्ट्र'}`,
    temperature: 28,
    condition: 'धूप और हल्की छांव',
    humidity: 75,
    windSpeed: '12 km/h',
    rainProbability: 25,
    advisory: {
      cropRisk: 'नमी के कारण फफूंद (Fungus) का हल्का जोखिम हो सकता है।',
      actionItem: 'शाम को बारिश की संभावना कम है, आज सुबह या शाम को छिड़काव कर सकते हैं।',
      livestockAdvice: 'पशुओं के बाड़े को सूखा रखें और स्वच्छ ताजा पानी दें।',
    },
  });

  // Modal States
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedScanForDetail, setSelectedScanForDetail] = useState<ScanRecord | null>(null);
  const [selectedScanForExpert, setSelectedScanForExpert] = useState<ScanRecord | null>(null);
  const [prefillSample, setPrefillSample] = useState<typeof HACKATHON_DEMO_SAMPLES[0] | null>(null);

  // Subscribe to Firebase Auth changes in real-time
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        setIsRegistered(true);
        const stored = getStoredProfile();
        if (stored) {
          if (user.displayName && (!stored.name || stored.name === 'किसान (Farmer)')) {
            stored.name = user.displayName;
          }
          if (user.email && !stored.email) {
            stored.email = user.email;
          }
          if (user.photoURL && !stored.photoURL) {
            stored.photoURL = user.photoURL;
          }
          setFarmerProfile(stored);
        }
      } else {
        setCurrentUser(null);
        setIsRegistered(false);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Weather update on mount or location change
  useEffect(() => {
    if (farmerProfile?.district) {
      fetchWeatherAdvisory(farmerProfile.district)
        .then(setWeather)
        .catch(console.warn);
    }
  }, [farmerProfile?.district]);

  // Handler for Farmer Registration / Login
  const handleFarmerRegister = (newProfile: FarmerProfile, authUser?: AuthUser) => {
    saveStoredProfile(newProfile);
    setFarmerProfile(newProfile);
    setLanguage(newProfile.language || 'hi');
    if (authUser) {
      setCurrentUser(authUser);
      AuthService.saveUserSession(authUser);
    }
    setIsRegistered(true);
    setCurrentView('dashboard');
  };

  // Handler for Logout / Switch Farmer (returns to registration screen)
  const handleLogout = async () => {
    await AuthService.signOut();
    clearUserRegistration();
    setCurrentUser(null);
    setIsRegistered(false);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    const updated = { ...farmerProfile, language: lang };
    setFarmerProfile(updated);
    saveStoredProfile(updated);
  };

  const handleScanSaved = (newRecord: ScanRecord) => {
    setScans((prev) => [newRecord, ...prev]);
  };

  const handleAddAlert = (newAlert: FarmAlert) => {
    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    saveStoredAlerts(updated);
  };

  const handleDismissAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    saveStoredAlerts(updated);
  };

  const handleSelectSampleDemo = (sample: typeof HACKATHON_DEMO_SAMPLES[0]) => {
    setPrefillSample(sample);
    if (sample.category === 'crop') {
      setCurrentView('crop-scanner');
    } else {
      setCurrentView('animal-scanner');
    }
  };

  // Gating check: When user visits without an active authenticated profile, show Landing/Welcome screen
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-[#fbfbf9]">
        <LandingWelcomeScreen
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
          onAuthenticated={(profile, user) => {
            handleFarmerRegister(profile, user);
          }}
          onOpenAdvancedLogin={() => {
            setIsAuthModalOpen(true);
          }}
          onOpenAdvancedRegister={() => {
            setIsAuthModalOpen(true);
          }}
        />

        {/* Optional Modal overlay for Email/Password Wizard */}
        {isAuthModalOpen && (
          <FarmerRegistrationScreen
            onRegister={(profile, user) => {
              handleFarmerRegister(profile, user);
              setIsAuthModalOpen(false);
            }}
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        language={language}
        onLanguageChange={handleLanguageChange}
        unreadAlertsCount={alerts.length}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        farmerProfile={farmerProfile}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {currentView === 'welcome-info' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">FarmGuard AI — प्लेटफॉर्म परिचय (Platform Info)</span>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              >
                ← मुख्य डैशबोर्ड पर जाएं (Open Dashboard)
              </button>
            </div>
            <LandingWelcomeScreen
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
              onAuthenticated={(profile, user) => {
                handleFarmerRegister(profile, user);
              }}
              onOpenAdvancedLogin={() => setIsAuthModalOpen(true)}
              onOpenAdvancedRegister={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            language={language}
            onNavigate={setCurrentView}
            scans={scans}
            alerts={alerts}
            weather={weather}
            onSelectSampleDemo={handleSelectSampleDemo}
            onViewScanDetail={(scan) => setSelectedScanForDetail(scan)}
            farmerProfile={farmerProfile}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}

        {currentView === 'crop-scanner' && (
          <CropDetectionModule
            language={language}
            isOnline={true}
            onBackToDashboard={() => {
              setPrefillSample(null);
              setCurrentView('dashboard');
            }}
            onScanSaved={handleScanSaved}
            onOpenExpertModal={(scan) => setSelectedScanForExpert(scan)}
            prefillSample={prefillSample}
          />
        )}

        {currentView === 'animal-scanner' && (
          <AnimalHealthModule
            language={language}
            isOnline={true}
            onBackToDashboard={() => {
              setPrefillSample(null);
              setCurrentView('dashboard');
            }}
            onScanSaved={handleScanSaved}
            onOpenExpertModal={(scan) => setSelectedScanForExpert(scan)}
            prefillSample={prefillSample}
          />
        )}

        {currentView === 'overview' && (
          <FarmHealthOverview
            language={language}
            scans={scans}
            alerts={alerts}
            onNavigateToCrop={() => setCurrentView('crop-scanner')}
            onNavigateToAnimal={() => setCurrentView('animal-scanner')}
            onViewScanDetail={(scan) => setSelectedScanForDetail(scan)}
          />
        )}

        {currentView === 'history' && (
          <ScanHistory
            language={language}
            scans={scans}
            onViewDetail={(scan) => setSelectedScanForDetail(scan)}
          />
        )}

        {currentView === 'alerts' && (
          <AlertsManager
            language={language}
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onDismissAlert={handleDismissAlert}
          />
        )}

        {currentView === 'irrigation' && (
          <SmartIrrigationModule
            language={language}
            weather={weather}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'fertilizer' && (
          <FertilizerAdvisorModule
            language={language}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'expenses' && (
          <ExpenseTrackerModule
            language={language}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'farm-records' && (
          <FarmRecordsModule
            language={language}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'market' && (
          <MarketIntelligenceModule
            language={language}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'knowledge' && (
          <KnowledgeHubModule
            language={language}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'offline-library' && (
          <OfflineLibrary
            language={language}
            isOnline={true}
          />
        )}

        {currentView === 'admin-analytics' && (
          <AdminAnalytics
            language={language}
            scans={scans}
          />
        )}
      </main>

      {/* Floating Bottom Quick Bar for Farmers on Mobile */}
      <div className="lg:hidden sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-black cursor-pointer ${
            currentView === 'dashboard' ? 'text-emerald-700' : 'text-slate-500'
          }`}
        >
          <span className="text-base">🏠</span>
          <span>{language === 'mr' ? 'मुख्य' : language === 'hi' ? 'होम' : 'Home'}</span>
        </button>

        <button
          onClick={() => setCurrentView('crop-scanner')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-black cursor-pointer ${
            currentView === 'crop-scanner' ? 'text-emerald-700' : 'text-slate-500'
          }`}
        >
          <span className="text-base">🌱</span>
          <span>{language === 'mr' ? 'पीक' : language === 'hi' ? 'फसल' : 'Crop'}</span>
        </button>

        {/* Center Voice Assistant Floating Action Button */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg cursor-pointer transform active:scale-95 border-2 border-white"
          title="बोलकर पूछें"
        >
          <span className="text-xl">🎙️</span>
        </button>

        <button
          onClick={() => setCurrentView('animal-scanner')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-black cursor-pointer ${
            currentView === 'animal-scanner' ? 'text-amber-700' : 'text-slate-500'
          }`}
        >
          <span className="text-base">🐄</span>
          <span>{language === 'mr' ? 'पशु' : language === 'hi' ? 'पशु' : 'Animal'}</span>
        </button>

        <button
          onClick={() => setCurrentView('history')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-black cursor-pointer ${
            currentView === 'history' ? 'text-emerald-700' : 'text-slate-500'
          }`}
        >
          <span className="text-base">📋</span>
          <span>{language === 'mr' ? 'नोंदी' : language === 'hi' ? 'जांचें' : 'History'}</span>
        </button>
      </div>

      {/* Clean, Simple Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-5 text-slate-500 text-xs text-center space-y-1">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-bold text-slate-700">
            FARMGUARD AI — किसान और पशु आरोग्य सहायक 🌾
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>किसान कॉल सेंटर: <strong>1800-180-1551</strong></span>
            <span>•</span>
            <span>पशु हेल्पलाइन: <strong>1962</strong></span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
      />

      <ExpertContactModal
        scan={selectedScanForExpert}
        farmer={farmerProfile}
        onClose={() => setSelectedScanForExpert(null)}
      />

      <FarmerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={farmerProfile}
        onProfileUpdate={(updated) => {
          setFarmerProfile(updated);
          saveStoredProfile(updated);
        }}
        onLanguageChange={handleLanguageChange}
      />

      <ScanDetailModal
        scan={selectedScanForDetail}
        language={language}
        onClose={() => setSelectedScanForDetail(null)}
        onOpenExpert={(scan) => {
          setSelectedScanForDetail(null);
          setSelectedScanForExpert(scan);
        }}
      />

      {/* Clean, Non-blocking Farmer Registration / Sign In Modal */}
      {isAuthModalOpen && (
        <FarmerRegistrationScreen
          onRegister={(profile, user) => {
            handleFarmerRegister(profile, user);
            setIsAuthModalOpen(false);
          }}
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
}
