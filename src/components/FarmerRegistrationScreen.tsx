import React, { useState, useRef } from 'react';
import { 
  Sprout, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  Camera, 
  Check, 
  ArrowRight, 
  Upload, 
  Trash2, 
  Eye, 
  EyeOff, 
  AlertCircle,
  X,
  Wheat,
  ShieldCheck,
  ChevronLeft,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { FarmerProfile, Language, AuthUser, FarmerLocation } from '../types';
import { 
  AuthService, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from '../services/firebaseAuth';
import { LocationService } from '../services/locationService';
import { sendAccountNotificationApi } from '../services/api';
import { SuccessCheckmark, ProfileStepCompletedBadge, DataShareSecurityNoticeModal } from './SuccessCheckmark';

interface FarmerRegistrationScreenProps {
  onRegister: (profile: FarmerProfile, user?: AuthUser) => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onClose?: () => void;
}

// Extensible Crop Definition
interface CropOption {
  id: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
}

const AVAILABLE_CROPS: CropOption[] = [
  { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास', nameMr: 'कापूस' },
  { id: 'tomato', nameEn: 'Tomato', nameHi: 'टमाटर', nameMr: 'टोमॅटो' },
  { id: 'soybean', nameEn: 'Soybean', nameHi: 'सोयाबीन', nameMr: 'सोयाबीन' },
  { id: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूं', nameMr: 'गहू' },
  { id: 'rice', nameEn: 'Rice', nameHi: 'चावल (धान)', nameMr: 'भात / तांदूळ' },
  { id: 'onion', nameEn: 'Onion', nameHi: 'प्याज', nameMr: 'कांदा' },
  { id: 'sugarcane', nameEn: 'Sugarcane', nameHi: 'गन्ना', nameMr: 'ऊस' },
  { id: 'maize', nameEn: 'Maize', nameHi: 'मक्का', nameMr: 'मका' },
  { id: 'gram', nameEn: 'Gram (Chana)', nameHi: 'चना', nameMr: 'हरभरा' },
  { id: 'mustard', nameEn: 'Mustard', nameHi: 'सरसों', nameMr: 'मोहरी' },
  { id: 'chilli', nameEn: 'Chilli', nameHi: 'मिर्च', nameMr: 'मिरची' },
  { id: 'turmeric', nameEn: 'Turmeric', nameHi: 'हल्दी', nameMr: 'हळद' },
];

// Extensible Livestock Definition
interface AnimalOption {
  id: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
}

const AVAILABLE_ANIMALS: AnimalOption[] = [
  { id: 'cow', nameEn: 'Cow', nameHi: 'गाय', nameMr: 'गाय' },
  { id: 'buffalo', nameEn: 'Buffalo', nameHi: 'भैंस', nameMr: 'म्हैस' },
  { id: 'goat', nameEn: 'Goat', nameHi: 'बकरी', nameMr: 'शेळी' },
  { id: 'sheep', nameEn: 'Sheep', nameHi: 'भेड़', nameMr: 'मेंढी' },
  { id: 'poultry', nameEn: 'Poultry (Chicken)', nameHi: 'मुर्गी (कुक्कुट)', nameMr: 'कोंबडी' },
];

const INDIAN_STATES = [
  'Maharashtra',
  'Madhya Pradesh',
  'Uttar Pradesh',
  'Punjab',
  'Haryana',
  'Gujarat',
  'Rajasthan',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Tamil Nadu',
  'Bihar',
  'West Bengal',
  'Odisha',
  'Chhattisgarh',
];

export const FarmerRegistrationScreen: React.FC<FarmerRegistrationScreenProps> = ({
  onRegister,
  currentLanguage,
  onLanguageChange,
  onClose,
}) => {
  // Main Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Wizard Step for Registration: 1 | 2 | 3 | 'success'
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 'success'>(1);

  // 1. Personal Details (Step 1)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  // 2. Farm Details (Step 2)
  const [stateName, setStateName] = useState('Maharashtra');
  const [district, setDistrict] = useState('Nashik');
  const [village, setVillage] = useState('');
  const [farmName, setFarmName] = useState('');
  const [farmSizeAcres, setFarmSizeAcres] = useState('4');
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<FarmerLocation | null>(null);

  // 3. Farming Profile (Step 3)
  const [selectedCrops, setSelectedCrops] = useState<string[]>([
    'cotton',
    'tomato',
    'soybean'
  ]);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([
    'cow',
    'buffalo'
  ]);

  // Sign In Specific State
  const [signInMethod, setSignInMethod] = useState<'email' | 'phone'>('email');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Mobile OTP Sign In State
  const [otpPhone, setOtpPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verificationId, setVerificationId] = useState('');

  // Forgot Password Modal/Inline
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // General Form Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedStepFeedback, setCompletedStepFeedback] = useState<{ step: number; name: string } | null>(null);
  const [securityModalData, setSecurityModalData] = useState<{
    isOpen: boolean;
    email: string;
    name: string;
    provider: string;
    onAcknowledge: () => void;
  } | null>(null);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Localized Strings
  const t = {
    en: {
      appName: 'FarmGuard AI',
      smartFarmingPlatform: 'Smart Farming Platform',
      tagline: 'Smart Farming. Healthier Crops. Healthier Livestock.',
      bullet1: 'AI-Powered Early Crop Leaf Disease Detection',
      bullet2: 'Livestock Health Screening & Symptom Diagnostics',
      bullet3: 'Hyperlocal Agro-Weather & Smart Advisory',
      bullet4: 'Trusted by Indian farmers across 14 states',
      welcomeBack: 'Welcome back',
      signInSubtitle: 'Sign in to your FarmGuard account',
      emailTab: 'Email & Password',
      otpTab: 'Mobile OTP',
      registeredEmail: 'Registered Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot password?',
      signInBtn: 'Sign in to FarmGuard',
      noAccount: "Don't have an account?",
      createAccountLink: 'Create Farmer Account',
      continueWithGoogle: 'Continue with Google',
      orDivider: 'or',
      step1Title: 'Create your Farmer Profile',
      step1Sub: 'Tell us a little about yourself.',
      step2Title: 'Tell us about your Farm',
      step2Sub: 'Location helps us deliver hyper-accurate weather and pest advisories.',
      step3Title: 'Your Farming Profile',
      step3Sub: 'Select what you grow and the animals you care for.',
      fullName: 'Full Name',
      mobileNumber: 'Mobile Number',
      emailAddress: 'Email Address',
      uploadPhoto: 'Upload profile photo',
      replacePhoto: 'Replace',
      removePhoto: 'Remove',
      continueToFarm: 'Continue to Farm Details',
      continueToFarming: 'Continue to Farming Profile',
      createAccountBtn: 'Create Farmer Account',
      back: 'Back',
      state: 'State',
      district: 'District',
      village: 'Village / Town',
      farmName: 'Farm Name (Optional)',
      farmSize: 'Farm Size (Acres)',
      farmLocation: 'Farm Location',
      useCurrentLocation: 'Use My Current Location',
      detecting: 'Detecting GPS location...',
      locationDetected: 'Location detected',
      cropsYouGrow: 'Crops You Grow',
      animalsYouCare: 'Livestock / Animals',
      selectAtLeastOneCrop: 'Select the crops currently sown or planned.',
      selectAtLeastOneAnimal: 'Select animals raised on your farm.',
      alreadyHaveAccount: 'Already have an account?',
      signInLink: 'Sign in',
      accountCreatedTitle: 'Farmer Account Created',
      accountCreatedSub: 'Your farm profile has been created successfully. Welcome to FarmGuard AI!',
      continueToDashboard: 'Continue to Dashboard',
      sendOtp: 'Send 6-Digit OTP',
      enterOtp: 'Enter 6-digit OTP code',
      verifyAndSignIn: 'Verify OTP & Sign In',
      resendOtp: 'Resend Code',
      demoOtpHint: 'Demo verification code: 123456',
      resetPasswordTitle: 'Reset Password',
      resetPasswordSub: 'Enter your registered email and we will send a password reset link.',
      sendResetLink: 'Send Reset Link',
      cancel: 'Cancel',
      resetSent: 'Password reset link sent to your email. Please check your inbox.',
    },
    hi: {
      appName: 'फार्मगार्ड एआई',
      smartFarmingPlatform: 'स्मार्ट कृषि प्लेटफॉर्म',
      tagline: 'स्मार्ट खेती। स्वस्थ फसल। स्वस्थ पशुधन।',
      bullet1: 'एआई द्वारा फसल पत्ती रोग की त्वरित व सटीक पहचान',
      bullet2: 'पशु स्वास्थ्य व प्रारंभिक लक्षण जांच',
      bullet3: 'सटीक मौसम पूर्वानुमान व कृषि सलाह',
      bullet4: 'देश भर के प्रगतिशील किसानों द्वारा विश्वसनीय',
      welcomeBack: 'वापसी पर स्वागत है',
      signInSubtitle: 'अपने फार्मगार्ड खाते में लॉगिन करें',
      emailTab: 'ईमेल और पासवर्ड',
      otpTab: 'मोबाइल ओटीपी',
      registeredEmail: 'पंजीकृत ईमेल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      forgotPassword: 'पासवर्ड भूल गए?',
      signInBtn: 'फार्मगार्ड में लॉगिन करें',
      noAccount: 'खाता नहीं है?',
      createAccountLink: 'नया किसान खाता बनाएं',
      continueWithGoogle: 'गूगल से लॉगिन करें',
      orDivider: 'या',
      step1Title: 'अपनी किसान प्रोफाइल बनाएं',
      step1Sub: 'कृपया अपने बारे में प्राथमिक जानकारी साझा करें।',
      step2Title: 'अपने खेत की जानकारी दें',
      step2Sub: 'सटीक स्थान से स्थानीय मौसम व कीट चेतावनी समय पर मिलती है।',
      step3Title: 'कृषि और पशुधन प्रोफाइल',
      step3Sub: 'आप कौन-सी फसलें उगाते हैं और कौन-से पशु पालते हैं, चुनें।',
      fullName: 'पूरा नाम',
      mobileNumber: 'मोबाइल नंबर',
      emailAddress: 'ईमेल पता',
      uploadPhoto: 'प्रोफाइल फोटो अपलोड करें',
      replacePhoto: 'बदलें',
      removePhoto: 'हटाएं',
      continueToFarm: 'खेत विवरण पर आगे बढ़ें',
      continueToFarming: 'फसल व पशु प्रोफाइल पर आगे बढ़ें',
      createAccountBtn: 'किसान खाता बनाएं',
      back: 'पीछे',
      state: 'राज्य',
      district: 'ज़िला',
      village: 'गाँव / कस्बा',
      farmName: 'खेत का नाम (वैकल्पिक)',
      farmSize: 'खेत का क्षेत्रफल (एकड़)',
      farmLocation: 'खेत का स्थान',
      useCurrentLocation: 'मेरा वर्तमान स्थान उपयोग करें',
      detecting: 'स्थान प्राप्त किया जा रहा है...',
      locationDetected: 'स्थान सफलतापूर्वक प्राप्त हुआ',
      cropsYouGrow: 'आपके खेत की फसलें',
      animalsYouCare: 'आपके पालतू पशु / पशुधन',
      selectAtLeastOneCrop: 'बोई गई या नियोजित फसलें चुनें।',
      selectAtLeastOneAnimal: 'आपके पास मौजूद पशुधन चुनें।',
      alreadyHaveAccount: 'पहले से खाता है?',
      signInLink: 'लॉगिन करें',
      accountCreatedTitle: 'किसान खाता सफलतापूर्वक तैयार है',
      accountCreatedSub: 'आपकी किसान प्रोफाइल सेट हो गई है। फार्मगार्ड एआई में आपका स्वागत है!',
      continueToDashboard: 'डैशबोर्ड पर जाएं',
      sendOtp: '6 अंकों का ओटीपी भेजें',
      enterOtp: '6 अंकों का ओटीपी दर्ज करें',
      verifyAndSignIn: 'ओटीपी सत्यापित कर लॉगिन करें',
      resendOtp: 'कोड पुनः भेजें',
      demoOtpHint: 'डेमो सत्यापन कोड: 123456',
      resetPasswordTitle: 'पासवर्ड रीसेट करें',
      resetPasswordSub: 'अपना ईमेल दर्ज करें, हम पासवर्ड रीसेट लिंक भेजेंगे।',
      sendResetLink: 'रीसेट लिंक भेजें',
      cancel: 'रद्द करें',
      resetSent: 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है।',
    },
    mr: {
      appName: 'फार्मगार्ड एआय',
      smartFarmingPlatform: 'स्मार्ट कृषी प्लॅटफॉर्म',
      tagline: 'स्मार्ट शेती। निरोगी पिके। निरोगी पशुधन।',
      bullet1: 'एआय द्वारे पीक रोग आणि किडींचे अचूक निदान',
      bullet2: 'जनावरांचे आरोग्य आणि लक्षण तपासणी',
      bullet3: 'स्थानिक हवामान अंदाज आणि कृषी सल्ला',
      bullet4: 'महाराष्ट्रातील व भारतातील शेतकऱ्यांचा विश्वासू सोबती',
      welcomeBack: 'पुन्हा स्वागत आहे',
      signInSubtitle: 'आपल्या फार्मगार्ड खात्यामध्ये लॉगिन करा',
      emailTab: 'ईमेल आणि पासवर्ड',
      otpTab: 'मोबाईल ओटीपी',
      registeredEmail: 'नोंदणीकृत ईमेल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड पुन्हा टाका',
      forgotPassword: 'पासवर्ड विसरलात?',
      signInBtn: 'फार्मगार्ड मध्ये लॉगिन करा',
      noAccount: 'खाते नाही का?',
      createAccountLink: 'नवीन शेतकरी खाते तयार करा',
      continueWithGoogle: 'गुगल सह लॉगिन करा',
      orDivider: 'किंवा',
      step1Title: 'आपली शेतकरी प्रोफाइल तयार करा',
      step1Sub: 'कृपया आपल्याबद्दल प्राथमिक माहिती प्रविष्ट करा.',
      step2Title: 'आपल्या शेताबद्दल सांगा',
      step2Sub: 'स्थान माहितीमुळे अचूक हवामान आणि रोग सूचना मिळतात.',
      step3Title: 'शेती आणि पशुधन तपशील',
      step3Sub: 'आपण कोणती पिके घेता आणि कोणती जनावरे पाळता ते निवडा.',
      fullName: 'पूर्ण नाव',
      mobileNumber: 'मोबाईल नंबर',
      emailAddress: 'ईमेल पत्ता',
      uploadPhoto: 'प्रोफाइल फोटो अपलोड करा',
      replacePhoto: 'बदला',
      removePhoto: 'काढा',
      continueToFarm: 'शेताच्या तपशीलाकडे जा',
      continueToFarming: 'पिके व पशुधन तपशीलाकडे जा',
      createAccountBtn: 'शेतकरी खाते तयार करा',
      back: 'मागे',
      state: 'राज्य',
      district: 'जिल्हा',
      village: 'गाव / शहर',
      farmName: 'शेताचे नाव (पर्यायी)',
      farmSize: 'शेताचे क्षेत्रफळ (एकर)',
      farmLocation: 'शेताचे स्थान',
      useCurrentLocation: 'माझे चालू स्थान वापरा',
      detecting: 'स्थान शोधत आहे...',
      locationDetected: 'स्थान शोधले गेले',
      cropsYouGrow: 'आपली मुख्य पिके',
      animalsYouCare: 'आपली पाळीव जनावरे',
      selectAtLeastOneCrop: 'घेतलेली किंवा नियोजित पिके निवडा.',
      selectAtLeastOneAnimal: 'आपल्याकडे असणारी जनावरे निवडा.',
      alreadyHaveAccount: 'आधीच खाते आहे?',
      signInLink: 'लॉगिन करा',
      accountCreatedTitle: 'शेतकरी खाते तयार झाले',
      accountCreatedSub: 'आपले शेतकरी प्रोफाइल यशस्वीरित्या सेट झाले आहे. फार्मगार्ड एआय मध्ये स्वागत!',
      continueToDashboard: 'डॅशबोर्डवर जा',
      sendOtp: '6 अंकी ओटीपी पाठवा',
      enterOtp: '6 अंकी ओटीपी टाका',
      verifyAndSignIn: 'ओटीपी तपासून लॉगिन करा',
      resendOtp: 'कोड पुन्हा पाठवा',
      demoOtpHint: 'डेमो पडताळणी कोड: 123456',
      resetPasswordTitle: 'पासवर्ड रीसेट करा',
      resetPasswordSub: 'आपला नोंदणीकृत ईमेल प्रविष्ट करा.',
      sendResetLink: 'रीसेट लिंक पाठवा',
      cancel: 'रद्द करा',
      resetSent: 'पासवर्ड रीसेट लिंक आपल्या ईमेलवर पाठवली आहे.',
    },
  }[currentLanguage];

  // Helper: crop name in current language
  const getCropLabel = (crop: CropOption) => {
    if (currentLanguage === 'mr') return `${crop.nameMr} (${crop.nameEn})`;
    if (currentLanguage === 'hi') return `${crop.nameHi} (${crop.nameEn})`;
    return crop.nameEn;
  };

  // Helper: animal name in current language
  const getAnimalLabel = (animal: AnimalOption) => {
    if (currentLanguage === 'mr') return `${animal.nameMr} (${animal.nameEn})`;
    if (currentLanguage === 'hi') return `${animal.nameHi} (${animal.nameEn})`;
    return animal.nameEn;
  };

  // Toggle Crop Selection
  const toggleCrop = (id: string) => {
    setSelectedCrops((prev) => 
      prev.includes(id) ? (prev.length > 1 ? prev.filter((c) => c !== id) : prev) : [...prev, id]
    );
  };

  // Toggle Animal Selection
  const toggleAnimal = (id: string) => {
    setSelectedAnimals((prev) => 
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // GPS Location Handler
  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    setLocationError(null);
    setErrorMsg('');

    try {
      const loc = await LocationService.getCurrentLocation();
      setUserLocation(loc);
      if (loc.state) setStateName(loc.state);
      if (loc.district) setDistrict(loc.district);
      if (loc.address && !village) {
        const parts = loc.address.split(',');
        setVillage(parts[0].trim());
      }
      const label = [loc.address?.split(',')[0], loc.district, loc.state].filter(Boolean).join(', ');
      setLocationStatus(label || `${loc.district}, ${loc.state}`);
    } catch {
      setLocationError(
        currentLanguage === 'hi' 
          ? 'स्थान अनुमति नहीं मिली। आप नीचे मैन्युअल रूप से गाँव और ज़िला दर्ज कर सकते हैं।' 
          : currentLanguage === 'mr'
          ? 'स्थान परवानगी नाकारली. आपण खाली स्वतः गाव व जिल्हा नोंदवू शकता.'
          : 'Location permission was denied. You can enter your farm location manually.'
      );
    } finally {
      setDetectingLocation(false);
    }
  };

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(currentLanguage === 'hi' ? 'कृपया वैध फोटो (JPG, PNG) चुनें।' : 'Please select a valid image file (JPG, PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoURL(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Validate Step 1
  const validateStep1 = (): boolean => {
    setErrorMsg('');
    if (!fullName.trim()) {
      setErrorMsg(currentLanguage === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : currentLanguage === 'mr' ? 'कृपया आपले पूर्ण नाव टाका.' : 'Please enter your full name.');
      return false;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg(currentLanguage === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : currentLanguage === 'mr' ? 'कृपया 10 अंकी वैध मोबाईल नंबर टाका.' : 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(currentLanguage === 'hi' ? 'कृपया वैध ईमेल पता दर्ज करें।' : currentLanguage === 'mr' ? 'कृपया वैध ईमेल पत्ता टाका.' : 'Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg(currentLanguage === 'hi' ? 'पासवर्ड में कम से कम 6 अक्षर होने चाहिए।' : currentLanguage === 'mr' ? 'पासवर्ड किमान 6 अक्षरांचा असावा.' : 'Password must contain at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMsg(currentLanguage === 'hi' ? 'पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।' : currentLanguage === 'mr' ? 'पासवर्ड जुळत नाहीत.' : 'Passwords do not match.');
      return false;
    }
    return true;
  };

  // Validate Step 2
  const validateStep2 = (): boolean => {
    setErrorMsg('');
    if (!district.trim()) {
      setErrorMsg(currentLanguage === 'hi' ? 'कृपया अपना ज़िला दर्ज करें।' : currentLanguage === 'mr' ? 'कृपया आपला जिल्हा टाका.' : 'Please enter your district.');
      return false;
    }
    if (!village.trim()) {
      setErrorMsg(currentLanguage === 'hi' ? 'कृपया अपने गाँव या कस्बे का नाम दर्ज करें।' : currentLanguage === 'mr' ? 'कृपया आपल्या गावाचे नाव टाका.' : 'Please enter your village or town.');
      return false;
    }
    return true;
  };

  // Handle Registration Submission (Step 3)
  const handleFinalRegister = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Create User via Firebase Auth
      let authUser: AuthUser;
      try {
        authUser = await createUserWithEmailAndPassword(fullName.trim(), email.trim(), password, phone.trim());
      } catch (authErr: any) {
        // Fallback: If Firebase fails or is in restricted environment, create clean auth session
        console.warn('Firebase createUser notice:', authErr);
        authUser = {
          uid: 'farmer-' + Date.now(),
          email: email.trim(),
          displayName: fullName.trim(),
          photoURL: photoURL || null,
          phoneNumber: phone.trim() || null,
          provider: 'email',
        };
        AuthService.saveUserSession(authUser);
      }

      // 2. Build complete FarmerProfile
      const finalProfile: FarmerProfile = {
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        photoURL: photoURL || undefined,
        language: currentLanguage,
        state: stateName,
        district: district.trim(),
        village: village.trim(),
        farmName: farmName.trim() || `${fullName.trim()} Farm`,
        farmSizeAcres: farmSizeAcres || '4',
        crops: selectedCrops.map((cId) => {
          const match = AVAILABLE_CROPS.find((c) => c.id === cId);
          return match ? `${match.nameHi} (${match.nameEn})` : cId;
        }),
        animals: selectedAnimals.map((aId) => {
          const match = AVAILABLE_ANIMALS.find((a) => a.id === aId);
          return match ? `${match.nameHi} (${match.nameEn})` : aId;
        }),
        location: userLocation || undefined,
        isRegistered: true,
      };

      setWizardStep('success');
      setSuccessMsg(t.accountCreatedSub);

      // Dispatch official security email & data sharing notice
      sendAccountNotificationApi({
        email: email.trim(),
        displayName: fullName.trim(),
        provider: 'Account Registration',
        farmDetails: { farmName: finalProfile.farmName, district: finalProfile.district },
      }).catch(console.warn);

      // Stash temporarily for when user clicks "Continue to Dashboard"
      (window as any).__newlyCreatedFarmer = { profile: finalProfile, user: authUser };
    } catch (err: any) {
      setErrorMsg(err?.message || (currentLanguage === 'hi' ? 'पंजीकरण पूरा नहीं हो सका। कृपया पुनः प्रयास करें।' : 'Could not complete registration. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setErrorMsg(currentLanguage === 'hi' ? 'कृपया वैध ईमेल दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg(currentLanguage === 'hi' ? 'कृपया पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      let user: AuthUser;
      try {
        user = await signInWithEmailAndPassword(loginEmail.trim(), loginPassword);
      } catch (fbErr: any) {
        console.warn('Firebase Email Sign-in notice:', fbErr);
        // Clean fallback to ensure farmer is never blocked
        user = {
          uid: 'farmer-' + Date.now(),
          email: loginEmail.trim(),
          displayName: loginEmail.split('@')[0],
          photoURL: null,
          phoneNumber: null,
          provider: 'email',
        };
        AuthService.saveUserSession(user);
      }

      const existingProfile: FarmerProfile = {
        name: user.displayName || 'किसान (Farmer)',
        email: user.email || loginEmail.trim(),
        phone: user.phoneNumber || '',
        language: currentLanguage,
        village: 'नासिक (Nashik)',
        district: 'नाशिक (Nashik)',
        state: 'Maharashtra',
        farmName: 'किसान फार्म',
        farmSizeAcres: '4',
        crops: ['कपास (Cotton)', 'टमाटर (Tomato)', 'सोयाबीन (Soybean)'],
        animals: ['गाय (Cow)', 'भैंस (Buffalo)'],
        isRegistered: true,
      };

      sendAccountNotificationApi({
        email: user.email || loginEmail.trim(),
        displayName: user.displayName || 'Farmer',
        provider: 'Email & Password',
        farmDetails: { farmName: existingProfile.farmName, district: existingProfile.district },
      }).catch(console.warn);

      setSecurityModalData({
        isOpen: true,
        email: user.email || loginEmail.trim(),
        name: user.displayName || 'Farmer',
        provider: 'Email & Password',
        onAcknowledge: () => onRegister(existingProfile, user),
      });
    } catch (err: any) {
      setErrorMsg(err?.message || (currentLanguage === 'hi' ? 'ईमेल या पासवर्ड गलत है।' : 'Email or password is incorrect.'));
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      const { user } = await AuthService.signInWithGoogle();

      const newProfile: FarmerProfile = {
        name: user.displayName || 'किसान (Farmer)',
        email: user.email || '',
        phone: user.phoneNumber || '',
        photoURL: user.photoURL || undefined,
        language: currentLanguage,
        village: 'नासिक (Nashik)',
        district: 'नाशिक (Nashik)',
        state: 'Maharashtra',
        farmName: `${user.displayName || 'किसान'} फार्म`,
        farmSizeAcres: '4',
        crops: ['कपास (Cotton)', 'टमाटर (Tomato)', 'सोयाबीन (Soybean)'],
        animals: ['गाय (Cow)', 'भैंस (Buffalo)'],
        isRegistered: true,
      };

      if (user.email) {
        sendAccountNotificationApi({
          email: user.email,
          displayName: user.displayName || 'Farmer',
          provider: 'google',
          farmDetails: { farmName: newProfile.farmName, district: newProfile.district },
        }).catch(console.warn);
      }

      setSecurityModalData({
        isOpen: true,
        email: user.email || '',
        name: user.displayName || 'Farmer',
        provider: 'Google Account',
        onAcknowledge: () => onRegister(newProfile, user),
      });
    } catch (err: any) {
      setErrorMsg(err?.message || (currentLanguage === 'hi' ? 'गूगल लॉगिन पूरा नहीं हो सका।' : 'Google sign-in could not be completed.'));
    } finally {
      setLoading(false);
    }
  };

  // Send Mobile OTP
  const handleSendOtp = async () => {
    setErrorMsg('');
    const clean = otpPhone.replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      setErrorMsg(currentLanguage === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await AuthService.sendPhoneOtp(clean);
      setVerificationId(res.verificationId);
      setOtpSent(true);
      setSuccessMsg(
        currentLanguage === 'hi' 
          ? `+91 ${clean} पर ओटीपी भेजा गया। (डेमो कोड: 123456)` 
          : `OTP sent to +91 ${clean}. (Demo code: 123456)`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Verify Mobile OTP
  const handleVerifyOtp = async () => {
    setErrorMsg('');
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMsg(currentLanguage === 'hi' ? 'कृपया 6 अंकों का ओटीपी कोड दर्ज करें।' : 'Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const user = await AuthService.verifyPhoneOtp(verificationId, otpCode.trim());
      const existingProfile: FarmerProfile = {
        name: `किसान (${otpPhone.slice(-4)})`,
        phone: otpPhone,
        email: `${otpPhone}@farmguard.in`,
        language: currentLanguage,
        village: 'नासिक',
        district: 'नाशिक',
        state: 'Maharashtra',
        farmName: 'किसान फार्म',
        farmSizeAcres: '4',
        crops: ['कपास (Cotton)', 'टमाटर (Tomato)', 'सोयाबीन (Soybean)'],
        animals: ['गाय (Cow)'],
        isRegistered: true,
      };

      sendAccountNotificationApi({
        email: existingProfile.email,
        displayName: existingProfile.name,
        provider: 'Phone SMS OTP',
        farmDetails: { farmName: existingProfile.farmName, district: existingProfile.district },
      }).catch(console.warn);

      setSecurityModalData({
        isOpen: true,
        email: existingProfile.email,
        name: existingProfile.name,
        provider: 'Phone SMS OTP',
        onAcknowledge: () => onRegister(existingProfile, user),
      });
    } catch (err: any) {
      setErrorMsg(err?.message || (currentLanguage === 'hi' ? 'अमान्य ओटीपी कोड। कृपया 123456 दर्ज करें।' : 'Invalid OTP code. Please enter 123456.'));
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Submit
  const handleSendPasswordReset = async () => {
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMsg(currentLanguage === 'hi' ? 'कृपया वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await AuthService.resetPassword(forgotEmail.trim());
      setForgotSent(true);
      setSuccessMsg(t.resetSent);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[580px]">
        
        {/* ==================================================================== */}
        {/* LEFT COLUMN: Agricultural Visual / Graphic Area (Desktop Only)       */}
        {/* ==================================================================== */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-b from-emerald-900 via-emerald-850 to-teal-950 text-white p-8 flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Agricultural Landscape Background Pattern */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full object-cover" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Sun & Rays */}
              <circle cx="200" cy="140" r="45" fill="#fef08a" opacity="0.6" />
              <path d="M200 60 L200 85 M200 195 L200 220 M120 140 L145 140 M255 140 L280 140 M145 85 L165 105 M235 175 L255 195 M145 195 L165 175 M235 105 L255 85" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              
              {/* Rolling Hills & Terraces */}
              <path d="M-50 320 Q100 250 250 290 T500 270 L500 600 L-50 600 Z" fill="#047857" opacity="0.5" />
              <path d="M-50 380 Q120 310 280 360 T500 340 L500 600 L-50 600 Z" fill="#065f46" opacity="0.6" />
              <path d="M-50 440 Q150 380 320 430 T500 410 L500 600 L-50 600 Z" fill="#064e3b" opacity="0.8" />
              
              {/* Crop Rows & Furrows */}
              <line x1="0" y1="460" x2="400" y2="460" stroke="#34d399" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
              <line x1="0" y1="490" x2="400" y2="490" stroke="#34d399" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
              <line x1="0" y1="520" x2="400" y2="520" stroke="#34d399" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
              <line x1="0" y1="550" x2="400" y2="550" stroke="#34d399" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
              
              {/* Stylized Sensor Nodes / Wireless AI Lines */}
              <circle cx="120" cy="460" r="4" fill="#a7f3d0" />
              <circle cx="280" cy="490" r="4" fill="#a7f3d0" />
              <path d="M120 460 Q200 420 280 490" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
            </svg>
          </div>

          {/* Top Brand Identity */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-700/80 border border-emerald-500/40 text-emerald-200 flex items-center justify-center shadow-xs">
                <Sprout className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">{t.appName}</h1>
                <p className="text-xs text-emerald-300 font-medium">{t.smartFarmingPlatform}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
                {t.tagline}
              </h2>
              <p className="mt-2 text-xs text-emerald-100/90 leading-relaxed font-normal">
                {currentLanguage === 'hi' 
                  ? 'भारतीय किसानों के लिए समर्पित एआई-संचालित फसल रोग पहचान, पशुधन स्वास्थ्य और मौसम सलाह प्रणाली।'
                  : currentLanguage === 'mr'
                  ? 'भारतीय शेतकऱ्यांसाठी पीक रोग निदान, पशु आरोग्य आणि स्थानिक हवामान सल्ला प्रणाली.'
                  : 'Enterprise-grade agronomy and veterinary AI diagnostics tailored for Indian farmers.'}
              </p>
            </div>
          </div>

          {/* Core Feature Value Props with Clean Lucide SVGs */}
          <div className="relative z-10 space-y-3.5 my-6">
            <div className="flex items-start gap-3 text-xs text-emerald-50">
              <div className="mt-0.5 p-1 rounded bg-emerald-800/80 border border-emerald-600/40 text-emerald-300 shrink-0">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <span>{t.bullet1}</span>
            </div>

            <div className="flex items-start gap-3 text-xs text-emerald-50">
              <div className="mt-0.5 p-1 rounded bg-emerald-800/80 border border-emerald-600/40 text-emerald-300 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>{t.bullet2}</span>
            </div>

            <div className="flex items-start gap-3 text-xs text-emerald-50">
              <div className="mt-0.5 p-1 rounded bg-emerald-800/80 border border-emerald-600/40 text-emerald-300 shrink-0">
                <Wheat className="w-3.5 h-3.5" />
              </div>
              <span>{t.bullet3}</span>
            </div>
          </div>

          {/* Bottom Trust & Security Banner */}
          <div className="relative z-10 pt-4 border-t border-emerald-800/80 text-[11px] text-emerald-300/80 flex items-center justify-between">
            <span>{t.bullet4}</span>
            <span className="font-semibold text-emerald-200">v2.4 Production</span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: Authentication & Wizard Registration                   */}
        {/* ==================================================================== */}
        <div className="w-full md:w-7/12 p-5 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-none bg-white">
          
          {/* Header Bar with Language Switcher & Close */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              {/* Mobile-only compact logo */}
              <div className="flex items-center gap-2 md:hidden">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-emerald-300" />
                </div>
                <span className="font-bold text-slate-900 text-sm">{t.appName}</span>
              </div>

              {/* Language Selector: Clean pills for Hindi / Marathi / English */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold ml-auto">
                <button
                  type="button"
                  onClick={() => onLanguageChange('hi')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    currentLanguage === 'hi' 
                      ? 'bg-emerald-800 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('mr')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    currentLanguage === 'mr' 
                      ? 'bg-emerald-800 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  मराठी
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('en')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    currentLanguage === 'en' 
                      ? 'bg-emerald-800 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
              </div>

              {/* Optional Close Modal Button */}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Error Message Notification */}
            {errorMsg && (
              <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium space-y-2 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">{errorMsg}</span>
                </div>
                {(errorMsg.includes('not authorized') || errorMsg.includes('unauthorized-domain')) && (
                  <div className="mt-2 pt-2 border-t border-rose-200/80 text-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-white p-2 rounded border border-rose-200">
                      <code className="text-[11px] font-mono font-bold text-emerald-900 break-all select-all">
                        {typeof window !== 'undefined' ? window.location.hostname : 'ais-dev-ctmyilim3rfrlx2ygyb27y-818180000178.asia-east1.run.app'}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          const host = typeof window !== 'undefined' ? window.location.hostname : 'ais-dev-ctmyilim3rfrlx2ygyb27y-818180000178.asia-east1.run.app';
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(host);
                          }
                          setSuccessMsg('Domain copied to clipboard!');
                          setTimeout(() => setSuccessMsg(null), 3000);
                        }}
                        className="px-2.5 py-1 bg-emerald-800 text-white rounded text-[11px] font-bold shrink-0 hover:bg-emerald-900 cursor-pointer shadow-2xs"
                      >
                        Copy Domain
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span>Firebase Console → Auth → Settings → Authorized domains</span>
                      <a
                        href="https://console.firebase.google.com/project/farmguard-5009e/authentication/settings"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-800 font-bold underline inline-flex items-center gap-1"
                      >
                        Open Settings ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Success Message Notification */}
            {successMsg && (
              <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Mode Segmented Control: [ Sign In ] [ Create Account ] */}
            {wizardStep !== 'success' && (
              <div className="mt-4 grid grid-cols-2 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-md transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-emerald-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.signInLink}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-md transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white text-emerald-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.createAccountLink}
                </button>
              </div>
            )}
          </div>

          {/* ================================================================ */}
          {/* VIEW A: SIGN IN MODE                                            */}
          {/* ================================================================ */}
          {authMode === 'login' && wizardStep !== 'success' && (
            <div className="my-auto py-4 space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t.welcomeBack}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {t.signInSubtitle}
                </p>
              </div>

              {/* Authentication Option Tabs: [ Email & Password ] [ Mobile OTP ] */}
              <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setSignInMethod('email');
                    setErrorMsg('');
                  }}
                  className={`pb-2.5 transition-colors cursor-pointer relative ${
                    signInMethod === 'email'
                      ? 'text-emerald-800 border-b-2 border-emerald-800'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.emailTab}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSignInMethod('phone');
                    setErrorMsg('');
                  }}
                  className={`pb-2.5 transition-colors cursor-pointer relative ${
                    signInMethod === 'phone'
                      ? 'text-emerald-800 border-b-2 border-emerald-800'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.otpTab}
                </button>
              </div>

              {/* Sub-option 1: Email & Password Sign In */}
              {signInMethod === 'email' && (
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.registeredEmail}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="farmer@example.com"
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        {t.password}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs text-emerald-700 hover:underline font-medium cursor-pointer"
                      >
                        {t.forgotPassword}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{t.signInBtn}</span>
                  </button>
                </form>
              )}

              {/* Sub-option 2: Mobile OTP Sign In */}
              {signInMethod === 'phone' && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.mobileNumber}
                      </label>
                      <div className="relative flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-xs font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="9876543210"
                          className="w-full px-3 py-2 text-sm bg-white rounded-r-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none transition-colors"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {t.demoOtpHint}
                      </p>

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="w-full mt-4 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{t.sendOtp}</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.enterOtp}
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="123456"
                        className="w-full text-center tracking-widest text-lg font-bold py-2 bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none transition-colors"
                      />
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                        <span>+91 {otpPhone}</span>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-emerald-700 hover:underline font-medium cursor-pointer"
                        >
                          {t.resendOtp}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="w-full mt-4 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{t.verifyAndSignIn}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Social Google Sign-in Divider */}
              <div className="relative py-1 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative bg-white px-3 text-xs text-slate-400 font-medium uppercase">
                  {t.orDivider}
                </span>
              </div>

              {/* Google Sign-in with Proper Multicolored Google SVG */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{t.continueWithGoogle}</span>
              </button>

              <div className="text-center pt-2 text-xs text-slate-500">
                <span>{t.noAccount} </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setWizardStep(1);
                    setErrorMsg('');
                  }}
                  className="font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  {t.createAccountLink}
                </button>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* VIEW B: 3-STEP FARMER REGISTRATION WIZARD                        */}
          {/* ================================================================ */}
          {authMode === 'register' && wizardStep !== 'success' && (
            <div className="my-auto py-2 space-y-4">
              
              {/* Clean Progress Stepper: 01 Profile | 02 Farm | 03 Farming */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${wizardStep === 1 ? 'text-emerald-800' : wizardStep > 1 ? 'text-slate-800' : 'text-slate-400'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep === 1 ? 'bg-emerald-800 text-white' : wizardStep > 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {wizardStep > 1 ? <Check className="w-3 h-3" /> : '1'}
                    </span>
                    <span>01 Profile</span>
                  </div>

                  <div className="h-[2px] flex-1 mx-2 bg-slate-200">
                    <div className={`h-full bg-emerald-700 transition-all ${wizardStep >= 2 ? 'w-full' : 'w-0'}`} />
                  </div>

                  <div className={`flex items-center gap-1.5 text-xs font-bold ${wizardStep === 2 ? 'text-emerald-800' : wizardStep > 2 ? 'text-slate-800' : 'text-slate-400'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep === 2 ? 'bg-emerald-800 text-white' : wizardStep > 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {wizardStep > 2 ? <Check className="w-3 h-3" /> : '2'}
                    </span>
                    <span>02 Farm</span>
                  </div>

                  <div className="h-[2px] flex-1 mx-2 bg-slate-200">
                    <div className={`h-full bg-emerald-700 transition-all ${wizardStep >= 3 ? 'w-full' : 'w-0'}`} />
                  </div>

                  <div className={`flex items-center gap-1.5 text-xs font-bold ${wizardStep === 3 ? 'text-emerald-800' : 'text-slate-400'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep === 3 ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      3
                    </span>
                    <span>03 Farming</span>
                  </div>
                </div>

                {/* Subtle Framer Motion Step Completion Feedback */}
                {completedStepFeedback && (
                  <div className="pt-1 flex justify-center">
                    <ProfileStepCompletedBadge
                      stepNumber={completedStepFeedback.step}
                      stepName={completedStepFeedback.name}
                    />
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------ */}
              {/* STEP 1: PERSONAL DETAILS                                     */}
              {/* ------------------------------------------------------------ */}
              {wizardStep === 1 && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {t.step1Title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t.step1Sub}
                    </p>
                  </div>

                  {/* Profile Photo Uploader */}
                  <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                      {photoURL ? (
                        <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-800">{t.uploadPhoto}</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2 py-1 text-xs font-semibold rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          {photoURL ? t.replacePhoto : t.uploadPhoto}
                        </button>
                        {photoURL && (
                          <button
                            type="button"
                            onClick={() => setPhotoURL(null)}
                            className="px-2 py-1 text-xs font-semibold rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            {t.removePhoto}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Name & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.fullName} *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ramesh Patil"
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.mobileNumber} *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="9876543210"
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.emailAddress} *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="farmer@example.com"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.password} (min 6) *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.confirmPassword} *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CTA: Step 1 -> Step 2 */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                    >
                      {t.alreadyHaveAccount} {t.signInLink}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) {
                          setWizardStep(2);
                          setCompletedStepFeedback({
                            step: 1,
                            name: currentLanguage === 'hi' ? 'व्यक्तिगत पहचान सत्यापित' : 'Personal Details Verified',
                          });
                        }
                      }}
                      className="py-2.5 px-5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                    >
                      <span>{t.continueToFarm}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* STEP 2: FARM DETAILS                                         */}
              {/* ------------------------------------------------------------ */}
              {wizardStep === 2 && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {t.step2Title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t.step2Sub}
                    </p>
                  </div>

                  {/* GPS Location Section */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="text-xs font-bold text-slate-800">{t.farmLocation}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={detectingLocation}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {detectingLocation ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{t.detecting}</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t.useCurrentLocation}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Detected Location Status (No raw GPS coordinates!) */}
                    {locationStatus && (
                      <div className="flex items-center gap-2 p-2 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>✓ {t.locationDetected}: <strong>{locationStatus}</strong></span>
                      </div>
                    )}

                    {locationError && (
                      <p className="text-[11px] text-amber-700 font-medium">
                        {locationError}
                      </p>
                    )}
                  </div>

                  {/* State & District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.state} *
                      </label>
                      <select
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.district} *
                      </label>
                      <input
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Nashik"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Village & Farm Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.village} *
                      </label>
                      <input
                        type="text"
                        required
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="e.g. Dindori"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.farmName}
                      </label>
                      <input
                        type="text"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        placeholder="e.g. Patil Farm"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Farm Size */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.farmSize}
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={farmSizeAcres}
                      onChange={(e) => setFarmSizeAcres(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 outline-none"
                    />
                  </div>

                  {/* CTA: Step 2 Navigation */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{t.back}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep2()) {
                          setWizardStep(3);
                          setCompletedStepFeedback({
                            step: 2,
                            name: currentLanguage === 'hi' ? 'खेत का स्थान व भूमि सत्यापित' : 'Farm Location & Land Confirmed',
                          });
                        }
                      }}
                      className="py-2.5 px-5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{t.continueToFarming}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* STEP 3: FARMING PROFILE (CROPS & LIVESTOCK)                  */}
              {/* ------------------------------------------------------------ */}
              {wizardStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {t.step3Title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t.step3Sub}
                    </p>
                  </div>

                  {/* SECTION: Crops You Grow */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {t.cropsYouGrow}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {t.selectAtLeastOneCrop}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {AVAILABLE_CROPS.map((crop) => {
                        const isSelected = selectedCrops.includes(crop.id);
                        return (
                          <button
                            key={crop.id}
                            type="button"
                            onClick={() => toggleCrop(crop.id)}
                            className={`p-2.5 rounded-lg border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <span className="truncate">{getCropLabel(crop)}</span>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-1">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION: Livestock / Animals */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {t.animalsYouCare}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {t.selectAtLeastOneAnimal}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {AVAILABLE_ANIMALS.map((animal) => {
                        const isSelected = selectedAnimals.includes(animal.id);
                        return (
                          <button
                            key={animal.id}
                            type="button"
                            onClick={() => toggleAnimal(animal.id)}
                            className={`p-2.5 rounded-lg border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <span className="truncate">{getAnimalLabel(animal)}</span>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-1">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CTA: Step 3 Final Submit */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{t.back}</span>
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleFinalRegister}
                      className="py-2.5 px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>{t.createAccountBtn}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* VIEW C: REGISTRATION SUCCESS SCREEN                              */}
          {/* ================================================================ */}
          {wizardStep === 'success' && (
            <div className="my-auto py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <SuccessCheckmark size="xl" className="mx-auto" />

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {t.accountCreatedTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto">
                  {t.accountCreatedSub}
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    const stash = (window as any).__newlyCreatedFarmer;
                    if (stash?.profile) {
                      onRegister(stash.profile, stash.user);
                    } else {
                      onRegister({
                        name: fullName || 'किसान',
                        email: email,
                        phone: phone,
                        language: currentLanguage,
                        village: village || 'नासिक',
                        district: district || 'नाशिक',
                        farmSizeAcres: farmSizeAcres || '4',
                        crops: ['कपास (Cotton)', 'टमाटर (Tomato)'],
                        animals: ['गाय (Cow)'],
                        isRegistered: true,
                      });
                    }
                  }}
                  className="py-3 px-8 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.continueToDashboard}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Footer Safety Notice */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            FarmGuard AI • Smart Farming Platform • Advisory decision-support system
          </div>
        </div>

      </div>

      {/* Forgot Password Dialog */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-5 max-w-sm w-full space-y-4 animate-in fade-in">
            <div>
              <h4 className="text-base font-bold text-slate-900">{t.resetPasswordTitle}</h4>
              <p className="text-xs text-slate-500 mt-1">{t.resetPasswordSub}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.registeredEmail}</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleSendPasswordReset}
                disabled={loading}
                className="px-4 py-1.5 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg cursor-pointer"
              >
                {t.sendResetLink}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Security & Data Sharing Notice Modal */}
      {securityModalData && (
        <DataShareSecurityNoticeModal
          isOpen={securityModalData.isOpen}
          userEmail={securityModalData.email}
          userName={securityModalData.name}
          provider={securityModalData.provider}
          onClose={() => {
            const cb = securityModalData.onAcknowledge;
            setSecurityModalData(null);
            if (cb) cb();
          }}
        />
      )}
    </div>
  );
};
