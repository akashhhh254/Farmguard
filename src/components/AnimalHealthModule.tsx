import React, { useState, useRef } from 'react';
import { 
  HeartPulse, 
  Camera, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Volume2, 
  ArrowLeft, 
  Sparkles, 
  Stethoscope, 
  HelpCircle, 
  PhoneCall, 
  ShieldCheck,
  AlertOctagon,
  FileText
} from 'lucide-react';
import { Language, AnimalScanResult, ScanRecord, SeverityLevel } from '../types';
import { translations } from '../translations';
import { ANIMAL_LIST, ANIMAL_SYMPTOMS, HACKATHON_DEMO_SAMPLES } from '../sampleData';
import { analyzeAnimalApi } from '../services/api';
import { enqueueOfflineScan, addScanRecord } from '../services/storage';
import { SuccessCheckmark, ScanSavedToast } from './SuccessCheckmark';

interface AnimalHealthModuleProps {
  language: Language;
  isOnline: boolean;
  onBackToDashboard: () => void;
  onScanSaved: (record: ScanRecord) => void;
  onOpenExpertModal: (scan: ScanRecord) => void;
  prefillSample?: typeof HACKATHON_DEMO_SAMPLES[0] | null;
}

export const AnimalHealthModule: React.FC<AnimalHealthModuleProps> = ({
  language,
  isOnline,
  onBackToDashboard,
  onScanSaved,
  onOpenExpertModal,
  prefillSample,
}) => {
  const t = translations[language];

  // Form State
  const [selectedAnimal, setSelectedAnimal] = useState(prefillSample?.animal || 'Cow');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    prefillSample?.symptoms ? (Array.isArray(prefillSample.symptoms) ? prefillSample.symptoms : [prefillSample.symptoms]) : []
  );
  const [notesInput, setNotesInput] = useState('');

  // Image State
  const [imageData, setImageData] = useState<string | null>(prefillSample?.image || null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnimalScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Toggle Symptom Chip
  const toggleSymptom = (label: string) => {
    if (selectedSymptoms.includes(label)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== label));
    } else {
      setSelectedSymptoms([...selectedSymptoms, label]);
    }
  };

  // Camera start
  const handleStartCamera = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable', err);
      setErrorMessage('Unable to access device camera. Please upload an image or choose a demo sample.');
    }
  };

  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.85);
      setImageData(dataUri);
    }
    handleStopCamera();
  };

  const handleStopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageData(event.target?.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectDemo = (sample: typeof HACKATHON_DEMO_SAMPLES[0]) => {
    setSelectedAnimal(sample.animal || 'Cow');
    setSelectedSymptoms(Array.isArray(sample.symptoms) ? sample.symptoms : [sample.symptoms || 'Fever']);
    setImageData(sample.image);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    if (!imageData && selectedSymptoms.length === 0) {
      setErrorMessage('Please either provide a photo or select at least one observed symptom.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    // If offline, queue the scan
    if (!isOnline) {
      const queued = enqueueOfflineScan(
        'animal',
        { animalType: selectedAnimal, symptoms: selectedSymptoms, notes: notesInput },
        imageData || ''
      );
      setIsAnalyzing(false);
      setErrorMessage(`Network offline. Animal screening data queued on device (ID: ${queued.id}). It will sync once connection resumes!`);
      return;
    }

    try {
      const result = await analyzeAnimalApi({
        image: imageData || undefined,
        animalType: selectedAnimal,
        symptoms: selectedSymptoms,
        notes: notesInput,
        language,
      });

      setAnalysisResult(result);

      // Save to scan history
      const record: ScanRecord = {
        id: result.id,
        type: 'animal',
        date: result.timestamp,
        entityName: result.animalType,
        condition: result.possibleCondition,
        confidence: result.confidenceScore,
        severity: result.riskLevel,
        imageThumbnail: result.imageThumbnail || '',
        isHealthy: result.isHealthy,
        animalData: result,
      };
      addScanRecord(record);
      onScanSaved(record);
      setIsSaved(true);
      setShowSavedToast(true);
    } catch (err: any) {
      console.error('Animal screening error', err);
      setErrorMessage(err.message || 'Failed to complete animal health screening. Please retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 cursor-pointer shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-amber-600" />
            Module 2: Livestock Health Screening (Innovation)
          </span>
        </div>
      </div>

      {/* Crucial Safety Banner as mandated by safety guidelines */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-950 text-xs flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Decision Support Notice:</strong> {t.safetyDisclaimerText}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Step 1 (Animal), Step 2 (Photo), Step 3 (Symptoms) */}
        <div className="lg:col-span-6 space-y-6">
          {/* STEP 1: SELECT ANIMAL */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
              <span>{t.animalStep1}</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {ANIMAL_LIST.map((animal) => {
                const isSelected = selectedAnimal.toLowerCase() === animal.nameEn.toLowerCase();
                const localizedName = language === 'hi' ? animal.nameHi : language === 'mr' ? animal.nameMr : animal.nameEn;
                return (
                  <button
                    key={animal.id}
                    type="button"
                    onClick={() => setSelectedAnimal(animal.nameEn)}
                    className={`p-3 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-amber-50/70 border border-slate-200'
                    }`}
                  >
                    <span className="text-2xl">{animal.icon}</span>
                    <span className="font-bold truncate">{localizedName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: ANIMAL PHOTO (OPTIONAL BUT RECOMMENDED) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                <span>{t.animalStep2}</span>
              </h3>
              {imageData && (
                <button
                  onClick={() => setImageData(null)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  {t.retakePhoto}
                </button>
              )}
            </div>

            <div className="relative w-full aspect-video rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex flex-col items-center justify-center">
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                    <button
                      onClick={handleCaptureFrame}
                      className="bg-amber-600 text-white px-5 py-2 rounded-full font-bold text-xs shadow-lg hover:bg-amber-700 cursor-pointer flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" /> Snap Photo
                    </button>
                    <button
                      onClick={handleStopCamera}
                      className="bg-slate-800 text-white px-3 py-2 rounded-full font-bold text-xs shadow-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : imageData ? (
                <div className="relative w-full h-full group">
                  <img src={imageData} alt="Animal inspection" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setImageData(null)}
                      className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-100 cursor-pointer"
                    >
                      {t.retakePhoto}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-5 space-y-2.5">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-100">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Photo of animal or affected area (skin, eye, udder)</p>
                    <p className="text-[11px] text-slate-500">Optional: AI can screen via symptoms if camera is unavailable</p>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={handleStartCamera}
                      className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{t.takePhoto}</span>
                    </button>
                    <label className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t.uploadPhoto}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Animals */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{t.sampleDemos}</span>
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {HACKATHON_DEMO_SAMPLES.filter((s) => s.category === 'animal').map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectDemo(sample)}
                    className="shrink-0 text-left p-2 rounded-lg border border-slate-200 hover:border-amber-500 bg-slate-50 text-xs font-medium cursor-pointer transition-all hover:bg-white"
                  >
                    <div className="text-[10px] font-bold text-amber-700">{sample.animal}</div>
                    <div className="text-[11px] text-slate-800 font-semibold line-clamp-1">{sample.name.split('—')[1]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 3: SYMPTOM CHIPS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] flex items-center justify-center font-bold">3</span>
              <span>{t.animalStep3}</span>
            </h3>

            <div>
              <p className="text-xs text-slate-500 mb-2">Tap all symptoms observed in the animal:</p>
              <div className="flex flex-wrap gap-2">
                {ANIMAL_SYMPTOMS.map((sym) => {
                  const localizedLabel = language === 'hi' ? sym.labelHi : language === 'mr' ? sym.labelMr : sym.labelEn;
                  const isSelected = selectedSymptoms.includes(sym.labelEn) || selectedSymptoms.includes(localizedLabel);
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => toggleSymptom(sym.labelEn)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      {localizedLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.additionalNotes}</label>
              <textarea
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="e.g. Animal began limping yesterday evening, refusing green fodder, body felt warmer than usual."
                rows={2}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 4 ACTION */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!imageData && selectedSymptoms.length === 0)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.analyzingAnimal}</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-4 h-4 text-amber-200" />
                  <span>Screen Animal Health with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Step 4 AI Screening Results */}
        <div className="lg:col-span-6 space-y-6">
          {analysisResult ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 animate-in fade-in-50">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      {analysisResult.animalType} Screening
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                      analysisResult.riskLevel === 'High' || analysisResult.riskLevel === 'Emergency'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {analysisResult.riskLevel} Risk Level
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {analysisResult.possibleCondition}
                  </h3>
                </div>

                <button
                  onClick={() => handleSpeakText(`${analysisResult.animalType} Screening: ${analysisResult.possibleCondition}. Risk: ${analysisResult.riskLevel}. Action: ${analysisResult.immediateSafeActions[0]}`)}
                  className="p-2 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                  title="Read aloud for farmer"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* High Risk / Contagious Emergency Notice */}
              {(analysisResult.riskLevel === 'High' || analysisResult.riskLevel === 'Emergency') && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                    <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>Urgent Veterinary Escalation Advised</span>
                  </div>
                  <p className="leading-relaxed">
                    {analysisResult.veterinaryAdvice}
                  </p>
                </div>
              )}

              {/* Confidence & Risk Level */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold">{t.confidence}</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900">{analysisResult.confidenceScore}%</span>
                    <span className="text-[11px] text-slate-500 font-medium">Screening index</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${analysisResult.confidenceScore}%` }} />
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold">Veterinary Review</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                    <span className="text-xs font-bold text-slate-800">
                      {analysisResult.veterinaryConsultationRequired ? 'Recommended' : 'Optional Check'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Do not administer unprescribed drugs
                  </p>
                </div>
              </div>

              {/* Explainable AI: Why the AI flagged this */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Why AI Flagged This (Clinical Reasoning)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {analysisResult.whyAiFlaggedThis.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Observed Clinical Indicators */}
              {analysisResult.observedIndicators.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Observed Clinical Signs</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.observedIndicators.map((ind, idx) => (
                      <span key={idx} className="text-xs bg-amber-50 text-amber-900 px-2.5 py-1 rounded-md border border-amber-200">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Immediate Safe Supportive Actions (Hydration, Isolation, Shade) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Immediate Safe Supportive Care</span>
                </h4>
                <div className="space-y-2">
                  {analysisResult.immediateSafeActions.map((action, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
                      <span className="font-bold text-amber-800 shrink-0">{idx + 1}.</span>
                      <span className="leading-relaxed">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biosecurity & Shed Hygiene */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Biosecurity & Shed Hygiene Guidance
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {analysisResult.preventionAndHygiene.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Veterinary Hotline Call Action */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pashu Arogya Seva / Veterinary Doctor</span>
                  </span>
                  <p className="text-xs text-emerald-800">
                    Connect directly or share this screening card with your local veterinarian.
                  </p>
                </div>
                <button
                  onClick={() => onOpenExpertModal({
                    id: analysisResult.id,
                    type: 'animal',
                    date: analysisResult.timestamp,
                    entityName: analysisResult.animalType,
                    condition: analysisResult.possibleCondition,
                    confidence: analysisResult.confidenceScore,
                    severity: analysisResult.riskLevel,
                    imageThumbnail: analysisResult.imageThumbnail || '',
                    isHealthy: analysisResult.isHealthy,
                    animalData: analysisResult,
                  })}
                  className="shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer shadow-xs flex items-center gap-1.5 justify-center"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Case Card</span>
                </button>
              </div>

              {/* Saved Status Indicator with Subtle Framer Motion Checkmark */}
              {isSaved && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-500/80 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <SuccessCheckmark size="md" />
                    <div>
                      <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <span>पशु स्वास्थ्य परीक्षण सहेजा गया (Livestock Screening Saved)</span>
                      </h5>
                      <p className="text-[11px] text-emerald-800 font-medium">
                        फार्म हेल्थ रिकॉर्ड्स में सुरक्षित दर्ज • केस आईडी: {analysisResult.id}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-800 text-white px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-2xs">
                    सत्यापित (Verified ✓)
                  </span>
                </div>
              )}

              {!isSaved && (
                <div className="text-center pt-2 text-xs text-slate-400 font-medium">
                  Screening logged into Farm Health History • ID: {analysisResult.id}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-100">
                <HeartPulse className="w-8 h-8" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h4 className="text-base font-bold text-slate-900">Veterinary Screening Assistant Ready</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select your farm animal, pick visible clinical symptoms, optionally snap a photo, and click <strong>Screen Animal Health</strong> to receive instant risk evaluation and safe supportive guidance.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Multimodal Cow, Buffalo, Goat & Poultry Support
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Toast confirmation with Framer Motion checkmark */}
      <ScanSavedToast
        isOpen={showSavedToast}
        onClose={() => setShowSavedToast(false)}
        title="Livestock Screening Successfully Saved & Verified"
        entityName={analysisResult?.animalType}
        recordId={analysisResult?.id}
      />
    </div>
  );
};
