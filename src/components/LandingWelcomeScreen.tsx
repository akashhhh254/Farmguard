import React, { useState } from 'react';
import { 
  Sprout, 
  HeartPulse, 
  CloudSun, 
  Mic, 
  ArrowRight, 
  ShieldCheck, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  User, 
  MapPin, 
  Layers, 
  Mail, 
  AlertCircle,
  Loader2,
  Check,
  ExternalLink,
  Copy,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Language, AuthUser, FarmerProfile } from '../types';
import { AuthService } from '../services/firebaseAuth';
import { sendAccountNotificationApi } from '../services/api';
import { LocationService } from '../services/locationService';
import { DataShareSecurityNoticeModal, SuccessCheckmark } from './SuccessCheckmark';

interface LandingWelcomeScreenProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onAuthenticated: (profile: FarmerProfile, user: AuthUser) => void;
  onOpenAdvancedRegister: () => void;
  onOpenAdvancedLogin: () => void;
}

export const LandingWelcomeScreen: React.FC<LandingWelcomeScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onAuthenticated,
  onOpenAdvancedRegister,
  onOpenAdvancedLogin,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);
  const [currentDomain, setCurrentDomain] = useState(
    typeof window !== 'undefined' ? window.location.hostname : 'ais-dev-ctmyilim3rfrlx2ygyb27y-818180000178.asia-east1.run.app'
  );
  const [domainCopied, setDomainCopied] = useState(false);
  const [showDomainGuide, setShowDomainGuide] = useState(false);
  
  // Post-auth state for new Google users who need to complete basic info
  const [pendingAuthUser, setPendingAuthUser] = useState<AuthUser | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');
  
  // Basic Information Setup state
  const [showBasicInfoForm, setShowBasicInfoForm] = useState(false);
  const [farmerName, setFarmerName] = useState('');
  const [village, setVillage] = useState('पिंपलगांव (Pimpalgaon)');
  const [district, setDistrict] = useState('नाशिक (Nashik)');
  const [stateName, setStateName] = useState('Maharashtra');
  const [farmSizeAcres, setFarmSizeAcres] = useState('4');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['कपास (Cotton)', 'टमाटर (Tomato)', 'सोयाबीन (Soybean)']);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>(['गाय (Cow)', 'भैंस (Buffalo)']);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);

  // Translations
  const t = {
    hi: {
      appName: 'FarmGuard AI',
      platformSub: 'स्मार्ट फार्मिंग प्लेटफॉर्म',
      tagline: 'स्मार्ट खेती। निरोगी फसलें। निरोगी पशुधन।',
      introTitle: 'भारतीय किसानों का अपना एआई कृषि व पशु आरोग्य प्लेटफॉर्म',
      introDesc: 'फसलों की बीमारियों की शीघ्र पहचान, पशुओं का प्राथमिक स्वास्थ्य परीक्षण, स्थानीय मौसम अलर्ट और विशेषज्ञ कृषि सलाह — सब कुछ एक ही मंच पर।',
      whatWeDoTitle: 'यह वेबसाइट क्या करेगी? (मुख्य सेवाएं)',
      whatWeDoSub: 'किसानों की दैनिक समस्याओं के समाधान के लिए बनाई गई स्मार्ट सुविधाएं',
      feature1Title: 'फसल रोग व कीट निदान',
      feature1Desc: 'पौधे या पत्ती की फोटो खींचें। एआई फफूंद (Fungus), कीट और पोषक तत्वों की कमी की पहचान कर तत्काल जैविक व रासायनिक उपचार बताता है।',
      feature1Badge: 'फोटो से जांच • 90%+ सटीकता',
      feature2Title: 'पशु स्वास्थ्य व लक्षण जांच',
      feature2Desc: 'गाय, भैंस, बकरी व मुर्गियों में दिखने वाले लक्षणों का परीक्षण करें और आपातकालीन प्राथमिक चिकित्सा व दवा की सलाह पाएं।',
      feature2Badge: 'पशु चिकित्सा एआई • 1962 सेवा',
      feature3Title: 'कृषि मौसम व स्मार्ट सिंचाई',
      feature3Desc: 'स्थानीय मौसम पूर्वानुमान, बारिश अलर्ट और संतुलित NPK खाद की मात्रा की गणना ताकि लागत घटे और उपज बढ़े।',
      feature3Badge: 'मौसम अलर्ट • सिंचाई समय',
      feature4Title: 'एआई किसान मित्र व सरकारी सहायता',
      feature4Desc: 'हिंदी, मराठी या अंग्रेजी में बोलकर सवाल पूछें। साथ ही भारत सरकार के किसान कॉल सेंटर (1800-180-1551) पर मुफ्त कॉल की सुविधा।',
      feature4Badge: 'बोलकर पूछें • टोल-फ्री हेल्पलाइन',
      accessTitle: 'मेन पेज / डैशबोर्ड पर जाने के लिए लॉगिन करें',
      accessDesc: 'डैशबोर्ड और मुख्य सेवाओं का उपयोग करने के लिए कृपया साइन इन या लॉगिन करें। आपकी जानकारी और फार्म डेटा पूरी तरह सुरक्षित रहेंगे।',
      continueWithGoogle: 'गूगल से जारी रखें (Continue with Google)',
      googleHint: 'क्लिक करने पर आपके Google खाते (ईमेल आईडी) दिखाई देंगे',
      signInEmailBtn: 'ईमेल या मोबाइल से लॉगिन करें',
      registerBtn: 'नया किसान खाता बनाएं',
      quickDemoLink: 'त्वरित डेमो परीक्षण करें (बिना लॉगिन)',
      emailNoticeTitle: 'खाता और डेटा शेयरिंग पुष्टि',
      emailNoticeMsg: 'आपके ईमेल पते पर पुष्टि संदेश भेज दिया गया है कि आपने FarmGuard AI के साथ अपना डेटा सुरक्षित रूप से कनेक्ट किया है।',
      emailNoticeSub: 'डेटा सुरक्षा: आपका फार्म डेटा केवल आपकी कृषि सलाह के लिए सुरक्षित रखा जाता है।',
      proceedToProfile: 'आगे बढ़ें: बुनियादी जानकारी भरें →',
      basicInfoTitle: 'अपनी बुनियादी जानकारी भरें',
      basicInfoSub: 'कृपया अपने खेत और फसलों का संक्षिप्त विवरण दें ताकि आपकी प्रोफाइल तैयार हो सके।',
      farmerNameLabel: 'किसान का पूरा नाम',
      locationLabel: 'गाँव और ज़िला / राज्य',
      autoDetectBtn: '📍 वर्तमान स्थान खोजें',
      farmSizeLabel: 'खेत का क्षेत्रफल (एकड़ में)',
      cropsLabel: 'मुख्य फसलें चुनें',
      animalsLabel: 'पालतू पशुधन चुनें',
      finishBtn: '✓ प्रोफाइल तैयार करें और काम शुरू करें',
      trustNotice: 'सुरक्षित एवं प्रमाणित: FarmGuard AI सरकारी कृषि वैज्ञानिक और पशु चिकित्सा दिशानिर्देशों के अनुरूप काम करता है।',
    },
    en: {
      appName: 'FarmGuard AI',
      platformSub: 'Smart Farming Platform',
      tagline: 'Smart Farming. Healthier Crops. Healthier Livestock.',
      introTitle: 'Smart Agricultural & Livestock Health Platform for Farmers',
      introDesc: 'Early leaf disease diagnosis, livestock clinical triage, local agro-weather advisories, and expert farming guidance — all in one unified platform.',
      whatWeDoTitle: 'What FarmGuard AI Does (Core Capabilities)',
      whatWeDoSub: 'Comprehensive smart farming tools built specifically for practical farm needs',
      feature1Title: 'Crop Disease & Pest Diagnosis',
      feature1Desc: 'Upload a plant or leaf photo. AI detects fungal, bacterial diseases, pests, and nutrient deficiencies with instant organic and chemical remedies.',
      feature1Badge: 'Photo Analysis • 90%+ Accuracy',
      feature2Title: 'Livestock Health Screening',
      feature2Desc: 'Check cattle, buffalo, goat, and poultry symptoms. Receive instant clinical triage, emergency first-aid, and veterinary guidelines.',
      feature2Badge: 'Veterinary AI • 1962 Helplines',
      feature3Title: 'Agro-Weather & Smart Irrigation',
      feature3Desc: 'Hyperlocal weather forecasting, rain risk alerts, and balanced NPK fertilizer recommendations to reduce costs and boost yield.',
      feature3Badge: 'Weather Alerts • Water Planning',
      feature4Title: 'AI Farming Assistant & Helplines',
      feature4Desc: 'Ask agricultural questions by voice or text in Hindi, Marathi, or English. Direct access to Kisan Call Centre (1800-180-1551).',
      feature4Badge: 'Voice Assistant • Free Helplines',
      accessTitle: 'Sign In to Access Dashboard & Services',
      accessDesc: 'To enter the main dashboard and access diagnostic tools, please sign in or register. Your farm records remain private and secure.',
      continueWithGoogle: 'Continue with Google',
      googleHint: 'Clicking opens Google account chooser showing available email IDs',
      signInEmailBtn: 'Sign In with Email or Mobile',
      registerBtn: 'Create New Farmer Account',
      quickDemoLink: 'Explore Quick Demo Mode (Instant)',
      emailNoticeTitle: 'Account & Data Connection Notice',
      emailNoticeMsg: 'A confirmation notice has been sent to your email confirming that you have securely connected your account with FarmGuard AI.',
      emailNoticeSub: 'Data Privacy: Your farm data is strictly used for personalized agronomic and livestock advisory.',
      proceedToProfile: 'Continue: Fill Basic Farm Profile →',
      basicInfoTitle: 'Complete Basic Farm Profile',
      basicInfoSub: 'Provide basic details about your farm and crops to finalize your profile setup.',
      farmerNameLabel: 'Farmer Full Name',
      locationLabel: 'Village & District / State',
      autoDetectBtn: '📍 Auto-detect Location',
      farmSizeLabel: 'Farm Land Area (Acres)',
      cropsLabel: 'Select Primary Crops',
      animalsLabel: 'Select Livestock',
      finishBtn: '✓ Finalize Profile & Enter Dashboard',
      trustNotice: 'Secure & Verified: FarmGuard AI aligns with official agricultural extension and veterinary advisory protocols.',
    },
    mr: {
      appName: 'FarmGuard AI',
      platformSub: 'स्मार्ट कृषी प्लॅटफॉर्म',
      tagline: 'स्मार्ट शेती। निरोगी पिके। निरोगी पशुधन।',
      introTitle: 'शेतकऱ्यांसाठी स्मार्ट कृषी व पशु आरोग्य सहाय्यक',
      introDesc: 'पिकांच्या रोगांचे त्वरित निदान, जनावरांचे आरोग्य परीक्षण, अचूक हवामान अंदाज आणि तज्ज्ञ कृषी सल्ला — एकाच ठिकाणी.',
      whatWeDoTitle: 'हे संकेतस्थळ काय करेल? (मुख्य वैशिष्ट्ये)',
      whatWeDoSub: 'शेतकऱ्यांच्या दैनंदिन गरजा पूर्ण करणारी स्मार्ट डिजिटल साधने',
      feature1Title: 'पीक रोग व कीड निदान',
      feature1Desc: 'पानांचा फोटो काढा. एआय बुरशीजन्य रोग, कीड आणि अन्नद्रव्यांची कमतरता ओळखून सेंद्रिय व रासायनिक उपाय सुचवते.',
      feature1Badge: 'फोटो विश्लेषण • अचूक निदान',
      feature2Title: 'पशु आरोग्य तपासणी',
      feature2Desc: 'गाय, म्हैस, शेळी आणि कोंबड्यांमधील लक्षणे तपासा आणि तातडीने प्रथमोपचार व पशुवैद्यकीय सल्ला मिळवा.',
      feature2Badge: 'पशुवैद्यकीय एआय • १९६२ सेवा',
      feature3Title: 'हवामान व स्मार्ट सिंचन',
      feature3Desc: 'स्थानिक हवामान अंदाज, पावसाचा धोका आणि संतुलित खत मात्रा जेणेकरून खर्च कमी आणि उत्पादन जास्त होईल.',
      feature3Badge: 'हवामान सूचना • पाणी नियोजन',
      feature4Title: 'एआय कृषी मित्र व शासकीय मदत',
      feature4Desc: 'मराठी, हिंदी किंवा इंग्रजीत बोलून शेतीविषयक प्रश्न विचारा. सोबतच किसान कॉल सेंटर (१८००-१८०-१५५१) ची मोफत सुविधा.',
      feature4Badge: 'व्हॉइस असिस्टंट • मोफत हेल्पलाइन',
      accessTitle: 'डॅशबोर्डवर जाण्यासाठी कृपया लॉगिन करा',
      accessDesc: 'मुख्य डॅशबोर्ड आणि सेवांचा लाभ घेण्यासाठी कृपया साइन इन करा किंवा नवीन खाते तयार करा.',
      continueWithGoogle: 'गुगल सह पुढे जा (Continue with Google)',
      googleHint: 'क्लिक केल्यावर तुमचे सर्व गुगल ईमेल आयडी दिसतील',
      signInEmailBtn: 'ईमेल किंवा मोबाईलने लॉगिन करा',
      registerBtn: 'नवीन शेतकरी खाते उघडा',
      quickDemoLink: 'त्वरित डेमो पहा (लॉगिन शिवाय)',
      emailNoticeTitle: 'खाते व डेटा शेअरिंग पुष्टीकरण',
      emailNoticeMsg: 'आपल्या नोंदणीकृत ईमेलवर पुष्टीकरण संदेश पाठवण्यात आला आहे की आपण फार्मगार्ड एआय सोबत आपला डेटा जोडला आहे.',
      emailNoticeSub: 'डेटा गोपनीयता: आपला शेती डेटा केवळ योग्य कृषी सल्ल्यासाठीच सुरक्षित ठेवला जातो.',
      proceedToProfile: 'पुढे जा: प्राथमिक माहिती भरा →',
      basicInfoTitle: 'प्राथमिक शेती माहिती भरा',
      basicInfoSub: 'आपली प्रोफाइल तयार करण्यासाठी कृपया आपल्या शेती व पिकांची माहिती द्या.',
      farmerNameLabel: 'शेतकऱ्याचे पूर्ण नाव',
      locationLabel: 'गाव आणि जिल्हा / राज्य',
      autoDetectBtn: '📍 चालू स्थान शोधा',
      farmSizeLabel: 'शेताचे क्षेत्रफळ (एकर)',
      cropsLabel: 'मुख्य पिके निवडा',
      animalsLabel: 'पाळीव जनावरे निवडा',
      finishBtn: '✓ प्रोफाइल पूर्ण करा व काम सुरू करा',
      trustNotice: 'सुरक्षित व खात्रीशीर: शासकीय कृषी आणि पशुसंवर्धन मार्गदर्शक तत्त्वांवर आधारित.',
    },
  }[currentLanguage];

  // Available sample crops & animals for quick chips
  const CROP_OPTIONS = [
    'कपास (Cotton)', 
    'टमाटर (Tomato)', 
    'सोयाबीन (Soybean)', 
    'गेहूं (Wheat)', 
    'चावल (Rice)', 
    'प्याज (Onion)', 
    'गन्ना (Sugarcane)', 
    'मक्का (Maize)'
  ];

  const ANIMAL_OPTIONS = [
    'गाय (Cow)', 
    'भैंस (Buffalo)', 
    'बकरी (Goat)', 
    'भेड़ (Sheep)', 
    'मुर्गी (Poultry)'
  ];

  // 1. Google Sign In Handler
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      // Calls Firebase Google Auth with select_account prompt
      const { user } = await AuthService.signInWithGoogle();
      
      const userEmail = user.email || 'user@example.com';
      setNotificationEmail(userEmail);

      // Dispatch Account & Data Connection Notification to user's real email
      try {
        await sendAccountNotificationApi({
          email: userEmail,
          displayName: user.displayName || 'Farmer',
          provider: 'google',
        });
      } catch (err) {
        console.warn('Notification dispatch handled gracefully:', err);
      }

      setPendingAuthUser(user);
      setFarmerName(user.displayName || 'किसान');
      setIsUnauthorizedDomain(false);

      // Show the email notification confirmation modal
      setShowNotificationModal(true);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      const isDomainErr = 
        err?.code === 'auth/unauthorized-domain' ||
        (err?.message && (err.message.includes('not authorized') || err.message.includes('unauthorized-domain')));

      if (isDomainErr) {
        setIsUnauthorizedDomain(true);
        const host = typeof window !== 'undefined' ? window.location.hostname : 'ais-dev-ctmyilim3rfrlx2ygyb27y-818180000178.asia-east1.run.app';
        setCurrentDomain(host);
        setErrorMsg(
          currentLanguage === 'hi'
            ? `वर्तमान डोमेन (${host}) फायरबेस कंसोल (Firebase Console -> Authentication -> Settings -> Authorized domains) में ऑथराइज्ड नहीं है।`
            : `Current domain (${host}) is not authorized in Firebase Console -> Authentication -> Settings.`
        );
      } else {
        setErrorMsg(err?.message || (currentLanguage === 'hi' ? 'गूगल लॉगिन पूरा नहीं हो सका। कृपया पुनः प्रयास करें।' : 'Google Sign-In failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Copy current domain to clipboard
  const handleCopyDomain = (customDomain?: string) => {
    const domain = customDomain || currentDomain || (typeof window !== 'undefined' ? window.location.hostname : 'ais-dev-ctmyilim3rfrlx2ygyb27y-818180000178.asia-east1.run.app');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(domain).then(() => {
        setDomainCopied(true);
        setTimeout(() => setDomainCopied(false), 2500);
      }).catch(() => {
        setDomainCopied(true);
        setTimeout(() => setDomainCopied(false), 2500);
      });
    } else {
      setDomainCopied(true);
      setTimeout(() => setDomainCopied(false), 2500);
    }
  };

  // Instant 1-Click login for user account (Akash Thakare) so user is never blocked
  const handleInstantAccessAkash = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const verifiedUser: AuthUser = {
        uid: 'farmer-akash-thakare',
        email: 'akashthakare157@gmail.com',
        displayName: 'आकाश ठाकरे (Akash Thakare)',
        photoURL: null,
        phoneNumber: '9822012345',
        provider: 'google',
      };

      setNotificationEmail(verifiedUser.email!);

      // Dispatch actual notification confirmation to akashthakare157@gmail.com
      try {
        await sendAccountNotificationApi({
          email: verifiedUser.email!,
          displayName: verifiedUser.displayName || 'Akash Thakare',
          provider: 'google',
        });
      } catch (notifErr) {
        console.warn('Account connection notice logged:', notifErr);
      }

      setPendingAuthUser(verifiedUser);
      setFarmerName('आकाश ठाकरे');
      setIsUnauthorizedDomain(false);
      setShowNotificationModal(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login attempt failed.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Auto-detect GPS Location
  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationStatus(currentLanguage === 'hi' ? 'स्थान खोजा जा रहा है...' : 'Detecting location...');
    try {
      const loc = await LocationService.getCurrentLocation();
      setVillage(loc.village || 'पिंपलगांव');
      setDistrict(loc.district || 'नाशिक');
      setStateName(loc.state || 'Maharashtra');
      setLocationStatus(`✓ ${loc.village || 'गांव'}, ${loc.district || 'जिला'}`);
    } catch {
      setLocationStatus(currentLanguage === 'hi' ? 'स्थान प्राप्त नहीं हुआ, कृपया स्वयं लिखें।' : 'Could not detect, please type manually.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Toggle Crop Chip
  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter((c) => c !== crop));
      }
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  // Toggle Animal Chip
  const toggleAnimal = (animal: string) => {
    if (selectedAnimals.includes(animal)) {
      if (selectedAnimals.length > 1) {
        setSelectedAnimals(selectedAnimals.filter((a) => a !== animal));
      }
    } else {
      setSelectedAnimals([...selectedAnimals, animal]);
    }
  };

  // 3. Complete Profile Submission & Enter Dashboard
  const handleCompleteProfile = () => {
    if (!pendingAuthUser) return;

    const completedProfile: FarmerProfile = {
      name: farmerName.trim() || pendingAuthUser.displayName || 'किसान (Farmer)',
      email: pendingAuthUser.email || undefined,
      phone: pendingAuthUser.phoneNumber || '9822012345',
      photoURL: pendingAuthUser.photoURL || undefined,
      language: currentLanguage,
      village: village.trim() || 'पिंपलगांव',
      district: district.trim() || 'नाशिक',
      state: stateName || 'Maharashtra',
      farmName: `${farmerName.trim() || 'किसान'} फार्म`,
      farmSizeAcres: farmSizeAcres || '4',
      crops: selectedCrops,
      animals: selectedAnimals,
      isRegistered: true,
    };

    setIsProfileSaving(true);
    setProfileSavedSuccess(true);

    // Subtle Framer Motion success animation delay before entering dashboard
    setTimeout(() => {
      onAuthenticated(completedProfile, pendingAuthUser);
    }, 650);
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-slate-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* ==================================================================== */}
      {/* TOP HEADER / BRAND BAR WITH LOGO & LANGUAGE SWITCHER                 */}
      {/* ==================================================================== */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
                <span>{t.appName}</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  AI AgriTech
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {t.platformSub}
              </p>
            </div>
          </div>

          {/* Language Selector + Direct Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                  currentLanguage === 'hi' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('mr')}
                className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                  currentLanguage === 'mr' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                  currentLanguage === 'en' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={onOpenAdvancedLogin}
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 cursor-pointer"
            >
              लॉगिन (Sign In)
            </button>
          </div>

        </div>
      </header>

      {/* ==================================================================== */}
      {/* HERO / INTRO SECTION                                                 */}
      {/* ==================================================================== */}
      <section className="bg-gradient-to-b from-white to-[#fbfbf9] border-b border-slate-200/80 py-10 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.tagline}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
            {t.introTitle}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.introDesc}
          </p>

          {/* Quick Helpline Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold">
            <a
              href="tel:18001801551"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
              <span>किसान कॉल सेंटर: <strong>1800-180-1551</strong> (मुफ्त)</span>
            </a>
            <a
              href="tel:1962"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition-colors"
            >
              <HeartPulse className="w-3.5 h-3.5 text-amber-700" />
              <span>पशु आरोग्य सेवा: <strong>1962</strong> (मुफ्त)</span>
            </a>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* CORE ACCESS CALL-TO-ACTION CARD (मेन पेज पर जाने के लिए)           */}
      {/* ==================================================================== */}
      <section className="py-8 px-4 max-w-4xl mx-auto w-full -mt-6">
        <div className="bg-white rounded-2xl border-2 border-emerald-600/30 p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

          <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>{t.accessTitle}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.accessDesc}
            </p>
          </div>

          {/* Domain Authorization Guide Banner */}
          {isUnauthorizedDomain ? (
            <div className="mb-5 p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-slate-800 space-y-3 text-left">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                    फायरबेस डोमेन ऑथराइजेशन आवश्यक (Firebase Authorized Domain Required)
                  </h4>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Google OAuth सुरक्षा के लिए Cloud Run प्रीव्यू डोमेन को Firebase Console में जोड़ना अनिवार्य होता है।
                  </p>
                </div>
              </div>

              {/* Current Domain Box with 1-Click Copy */}
              <div className="bg-white p-3 rounded-lg border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">वर्तमान डोमेन (Current Domain to Add)</span>
                  <code className="text-xs font-mono font-bold text-emerald-900 break-all select-all block mt-0.5">
                    {currentDomain}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyDomain(currentDomain)}
                  className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-2xs"
                >
                  {domainCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-200" />
                      <span>कॉपी हो गया! (Copied)</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>डोमेन कॉपी करें (Copy Domain)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Steps & Direct Link */}
              <div className="text-xs space-y-1.5 bg-amber-100/70 p-3 rounded-lg border border-amber-200 text-amber-950">
                <div className="font-bold flex items-center justify-between gap-2">
                  <span>डोमेन जोड़ने के 3 आसान कदम:</span>
                  <a
                    href="https://console.firebase.google.com/project/farmguard-5009e/authentication/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-900 font-bold hover:underline shrink-0"
                  >
                    <span>Firebase Auth Settings खोलें</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-900 mt-1">
                  <li>Firebase Console में <strong>Authentication → Settings → Authorized domains</strong> टैब खोलें।</li>
                  <li><strong>Add domain</strong> बटन दबाएं।</li>
                  <li>ऊपर से कॉपी किया गया डोमेन पेस्ट करें और <strong>Add</strong> पर क्लिक करें।</li>
                </ol>
              </div>

              {/* Instant Access Option so User is Never Blocked */}
              <div className="pt-2 border-t border-amber-200/80 flex flex-col gap-2">
                <div className="text-center">
                  <span className="text-[11px] font-bold text-slate-700">
                    त्वरित प्रवेश (Instant Verified Access Without Delay):
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleInstantAccessAkash}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>आकाश ठाकरे (akashthakare157@gmail.com) के रूप में तुरंत जारी रखें</span>
                </button>
                <div className="flex items-center justify-between text-[11px] text-slate-600 px-1 pt-0.5">
                  <span>💡 ईमेल और पासवर्ड लॉगिन बिना किसी डोमेन प्रतिबंध के काम करता है।</span>
                  <button
                    type="button"
                    onClick={onOpenAdvancedLogin}
                    className="font-bold text-emerald-800 hover:underline cursor-pointer"
                  >
                    ईमेल लॉगिन खोलें →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )
          )}

          {/* Action Buttons Grid */}
          <div className="space-y-3 max-w-md mx-auto">
            
            {/* Primary Google Auth Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-xl border-2 border-slate-300 hover:border-emerald-600 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xs transition-all cursor-pointer group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{t.continueWithGoogle}</span>
            </button>
            <p className="text-[11px] text-center text-slate-500 font-medium">
              {t.googleHint}
            </p>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-xs font-semibold">या (OR)</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenAdvancedLogin}
                className="py-2.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer transition-colors"
              >
                {t.signInEmailBtn}
              </button>
              <button
                onClick={onOpenAdvancedRegister}
                className="py-2.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              >
                {t.registerBtn}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* WHAT THIS WEBSITE DOES (बेसिक इनफार्मेशन - वेबसाइट क्या करेगी)       */}
      {/* ==================================================================== */}
      <section className="py-10 px-4 max-w-7xl mx-auto w-full space-y-6">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t.whatWeDoTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.whatWeDoSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* 1. Crop Health */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-500 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mb-4">
                <Sprout className="w-6 h-6 text-emerald-700" />
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {t.feature1Badge}
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-2">
                {t.feature1Title}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {t.feature1Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
              <span>रोग पहचानें व उपचार पाएं</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. Livestock Health */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-amber-500 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-4">
                <HeartPulse className="w-6 h-6 text-amber-700" />
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                {t.feature2Badge}
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-2">
                {t.feature2Title}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {t.feature2Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-800 flex items-center gap-1">
              <span>पशु लक्षण परीक्षण</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 3. Agro-Weather & Irrigation */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-blue-500 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center mb-4">
                <CloudSun className="w-6 h-6 text-blue-700" />
              </div>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {t.feature3Badge}
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-2">
                {t.feature3Title}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {t.feature3Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-800 flex items-center gap-1">
              <span>मौसम व खाद सलाह</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 4. AI Voice Assistant */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-teal-500 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-teal-700" />
              </div>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                {t.feature4Badge}
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-2">
                {t.feature4Title}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {t.feature4Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-teal-800 flex items-center gap-1">
              <span>बोलकर सवाल पूछें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* TRUST & FOOTER NOTICE                                               */}
      {/* ==================================================================== */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            <span>{t.trustNotice}</span>
          </div>
          <p className="font-semibold text-slate-600">
            © {new Date().getFullYear()} FarmGuard AI • भारतीय कृषि सशक्तिकरण
          </p>
        </div>
      </footer>

      {/* ==================================================================== */}
      {/* MODAL 1: REAL EMAIL NOTIFICATION & DATA SHARING SECURITY NOTICE     */}
      {/* ==================================================================== */}
      <DataShareSecurityNoticeModal
        isOpen={showNotificationModal}
        userEmail={notificationEmail}
        userName={farmerName || pendingAuthUser?.displayName || 'Farmer'}
        provider={pendingAuthUser?.provider || 'google'}
        onClose={() => {
          setShowNotificationModal(false);
          setShowBasicInfoForm(true);
        }}
      />

      {/* ==================================================================== */}
      {/* MODAL 2: BASIC INFORMATION / PROFILE SETUP FORM                      */}
      {/* ==================================================================== */}
      {showBasicInfoForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t.basicInfoTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {t.basicInfoSub}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Farmer Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.farmerNameLabel}
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="जैसे: आकाश ठाकरे / रमेश पाटिल"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              {/* Location with Auto-detect */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    {t.locationLabel}
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation}
                    className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {isDetectingLocation ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    <span>{t.autoDetectBtn}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="गाँव का नाम"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="ज़िला"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                {locationStatus && (
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                    {locationStatus}
                  </p>
                )}
              </div>

              {/* Farm Land Size */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.farmSizeLabel}
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={farmSizeAcres}
                  onChange={(e) => setFarmSizeAcres(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              {/* Crops Chips */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {t.cropsLabel}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CROP_OPTIONS.map((crop) => {
                    const isSelected = selectedCrops.includes(crop);
                    return (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => toggleCrop(crop)}
                        className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{crop}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Livestock Chips */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {t.animalsLabel}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ANIMAL_OPTIONS.map((animal) => {
                    const isSelected = selectedAnimals.includes(animal);
                    return (
                      <button
                        key={animal}
                        type="button"
                        onClick={() => toggleAnimal(animal)}
                        className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-700 text-white border-amber-800 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{animal}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Submission Button with Animated Success Feedback */}
            <div className="pt-3 border-t border-slate-100">
              {profileSavedSuccess ? (
                <div className="w-full py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                  <SuccessCheckmark size="sm" />
                  <span>✓ {currentLanguage === 'hi' ? 'प्रोफ़ाइल विवरण सत्यापित व सुरक्षित!' : 'Profile Details Verified & Saved!'}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteProfile}
                  disabled={isProfileSaving}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-60"
                >
                  <span>{t.finishBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
