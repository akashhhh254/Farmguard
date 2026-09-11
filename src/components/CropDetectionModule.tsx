import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  Volume2, 
  ArrowLeft, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  MapPin, 
  Sprout, 
  FileText,
  BookmarkPlus,
  Share2,
  PhoneCall
} from 'lucide-react';
import { Language, CropScanResult, ScanRecord } from '../types';
import { translations } from '../translations';
import { CROP_LIST, GROWTH_STAGES, HACKATHON_DEMO_SAMPLES } from '../sampleData';
import { analyzeCropApi } from '../services/api';
import { enqueueOfflineScan, addScanRecord } from '../services/storage';

interface CropDetectionModuleProps {
  language: Language;
  isOnline: boolean;
  onBackToDashboard: () => void;
  onScanSaved: (record: ScanRecord) => void;
  onOpenExpertModal: (scan: ScanRecord) => void;
  prefillSample?: typeof HACKATHON_DEMO_SAMPLES[0] | null;
}

export const CropDetectionModule: React.FC<CropDetectionModuleProps> = ({
  language,
  isOnline,
  onBackToDashboard,
  onScanSaved,
  onOpenExpertModal,
  prefillSample,
}) => {
  const t = translations[language];

  // Form State
  const [selectedCrop, setSelectedCrop] = useState(prefillSample?.crop || 'Cotton');
  const [growthStage, setGrowthStage] = useState(prefillSample?.stage || 'Vegetative');
  const [locationName, setLocationName] = useState('East Field Block 2');
  const [symptomsInput, setSymptomsInput] = useState(prefillSample?.symptoms || '');

  // Image State
  const [imageData, setImageData] = useState<string | null>(prefillSample?.image || null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CropScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

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
      setErrorMessage('Unable to access device camera. Please upload an image or select a sample.');
    }
  };

  // Camera capture
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
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageData(event.target?.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  // Quick Demo Selector
  const handleSelectDemo = (sample: typeof HACKATHON_DEMO_SAMPLES[0]) => {
    setSelectedCrop(sample.crop || 'Cotton');
    setGrowthStage(sample.stage || 'Vegetative');
    setSymptomsInput(sample.symptoms || '');
    setImageData(sample.image);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  // Trigger Analysis
  const handleAnalyze = async () => {
    if (!imageData) {
      setErrorMessage('Please capture or upload a plant leaf image first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    // If offline, queue the scan for later sync
    if (!isOnline) {
      const queued = enqueueOfflineScan(
        'crop',
        { cropType: selectedCrop, stage: growthStage, location: locationName, symptoms: symptomsInput },
        imageData
      );
      setIsAnalyzing(false);
      setErrorMessage(`Network offline. This scan has been safely queued on device (ID: ${queued.id}). It will automatically process when you re-connect!`);
      return;
    }

    try {
      const result = await analyzeCropApi({
        image: imageData,
        cropType: selectedCrop,
        stage: growthStage,
        symptoms: symptomsInput,
        location: locationName,
        language,
      });

      setAnalysisResult(result);

      // Auto-save to scan history if valid
      if (result.imageQualityValid) {
        const record: ScanRecord = {
          id: result.id,
          type: 'crop',
          date: result.timestamp,
          entityName: result.cropIdentified,
          condition: result.conditionName,
          confidence: result.confidenceScore,
          severity: result.severityLevel,
          imageThumbnail: result.imageThumbnail,
          isHealthy: result.isHealthy,
          cropData: result,
        };
        addScanRecord(record);
        onScanSaved(record);
        setIsSaved(true);
      }
    } catch (err: any) {
      console.error('Crop diagnosis failed', err);
      setErrorMessage(err.message || 'Failed to complete AI crop diagnosis. Please retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Text-To-Speech for low literacy farmers
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
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5" />
            Module 1: Crop Disease Detection
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Step 1 (Crop Details) & Step 2 (Image Upload) */}
        <div className="lg:col-span-6 space-y-6">
          {/* STEP 1: CROP CONTEXT */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                <span>{t.step1SelectCrop}</span>
              </h3>
            </div>

            {/* Crop Selector Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.cropType}</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
                {CROP_LIST.map((crop) => {
                  const isSelected = selectedCrop.toLowerCase() === crop.nameEn.toLowerCase();
                  const localizedName = language === 'hi' ? crop.nameHi : language === 'mr' ? crop.nameMr : crop.nameEn;
                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => setSelectedCrop(crop.nameEn)}
                      className={`p-2 rounded-lg text-left text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                      }`}
                    >
                      <span className="text-base">{crop.icon}</span>
                      <span className="truncate">{localizedName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Growth Stage */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.growthStage}</label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {GROWTH_STAGES.map((s) => (
                    <option key={s.id} value={s.labelEn}>
                      {language === 'hi' ? s.labelHi : language === 'mr' ? s.labelMr : s.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.fieldLocation}</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. North Acre / Plot 3"
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Optional Symptoms */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.reportedSymptoms} (Optional)</label>
              <input
                type="text"
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="e.g. Brown circular spots, leaf curl, wilting leaves"
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* STEP 2: IMAGE CAPTURE / UPLOAD */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                <span>{t.step2UploadImage}</span>
              </h3>
              {imageData && (
                <button
                  onClick={() => {
                    setImageData(null);
                    setAnalysisResult(null);
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  {t.retakePhoto}
                </button>
              )}
            </div>

            {/* Camera View or Preview Canvas */}
            <div className="relative w-full aspect-video rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex flex-col items-center justify-center">
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                    <button
                      onClick={handleCaptureFrame}
                      className="bg-emerald-600 text-white px-5 py-2 rounded-full font-bold text-xs shadow-lg hover:bg-emerald-700 cursor-pointer flex items-center gap-1.5"
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
                  <img
                    src={imageData}
                    alt="Plant to analyze"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setImageData(null)}
                      className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-100 cursor-pointer"
                    >
                      {t.retakePhoto}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-100">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Capture or upload plant leaf image</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Ensure good daylight and sharp focus on symptoms</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      onClick={handleStartCamera}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer shadow-xs transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{t.takePhoto}</span>
                    </button>

                    <label className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t.uploadPhoto}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Sample Selector for Instant Hackathon Demonstration */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{t.sampleDemos}</span>
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {HACKATHON_DEMO_SAMPLES.filter((s) => s.category === 'crop').map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectDemo(sample)}
                    className="shrink-0 text-left p-2 rounded-lg border border-slate-200 hover:border-emerald-500 bg-slate-50 text-xs font-medium cursor-pointer transition-all hover:bg-white"
                  >
                    <div className="text-[10px] font-bold text-emerald-700">{sample.crop}</div>
                    <div className="text-[11px] text-slate-800 font-semibold line-clamp-1">{sample.name.split('—')[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* STEP 3 ACTION BUTTON */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !imageData}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.analyzingCrop}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>{t.analyzeNow}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Step 3 AI Diagnostic Results & Explainability */}
        <div className="lg:col-span-6 space-y-6">
          {analysisResult ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 animate-in fade-in-50">
              {/* Header with Crop Name and Read Aloud */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {analysisResult.cropIdentified}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{analysisResult.growthStage} Stage</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {analysisResult.conditionName}
                  </h3>
                </div>

                <button
                  onClick={() => handleSpeakText(`${analysisResult.cropIdentified}: ${analysisResult.conditionName}. Severity: ${analysisResult.severityLevel}. Recommended action: ${analysisResult.immediateActions[0]}`)}
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                  title="Read aloud for farmer in selected language"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Quality Warning if invalid */}
              {!analysisResult.imageQualityValid && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{t.imageQualityInsufficient}</span>
                  </div>
                  <p>{analysisResult.clarityFeedback}</p>
                </div>
              )}

              {/* Metrics: Confidence & Severity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold">{t.confidence}</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900">{analysisResult.confidenceScore}%</span>
                    <span className="text-[11px] text-slate-500 font-medium">Model certainty</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${analysisResult.confidenceScore}%` }} />
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold">{t.severity}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-base font-extrabold px-2.5 py-0.5 rounded-lg border ${
                      analysisResult.severityLevel === 'High'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : analysisResult.severityLevel === 'Moderate'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {analysisResult.severityLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    {analysisResult.isHealthy ? 'No treatment required' : 'Timely intervention advised'}
                  </p>
                </div>
              </div>

              {/* MODULE 7: EXPLAINABLE AI — WHY THE AI FLAGGED THIS */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span>{t.whyAiFlaggedThis} (Explainable AI)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {analysisResult.whyAiFlaggedThis.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visible Symptoms */}
              {analysisResult.visibleSymptoms.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Identified Symptoms</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.visibleSymptoms.map((sym, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200">
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Immediate Safe Actions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.immediateActions}</span>
                </h4>
                <div className="space-y-2">
                  {analysisResult.immediateActions.map((action, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
                      <span className="font-bold text-emerald-700 shrink-0">{idx + 1}.</span>
                      <span className="leading-relaxed">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prevention & Cultural Management */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {t.preventionTips}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {analysisResult.preventionTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expert Recommendation / KVK Escalation Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{t.expertRecommendation}</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {analysisResult.expertAssistanceRecommendation}
                  </p>
                </div>
                <button
                  onClick={() => onOpenExpertModal({
                    id: analysisResult.id,
                    type: 'crop',
                    date: analysisResult.timestamp,
                    entityName: analysisResult.cropIdentified,
                    condition: analysisResult.conditionName,
                    confidence: analysisResult.confidenceScore,
                    severity: analysisResult.severityLevel,
                    imageThumbnail: analysisResult.imageThumbnail,
                    isHealthy: analysisResult.isHealthy,
                    cropData: analysisResult,
                  })}
                  className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer shadow-xs flex items-center gap-1.5 justify-center"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>KVK Helpline</span>
                </button>
              </div>

              {/* Saved Status Indicator */}
              <div className="text-center pt-2 text-xs text-slate-400 font-medium">
                Report logged into Farm Health Scan History • ID: {analysisResult.id}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-100">
                <Sprout className="w-8 h-8" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h4 className="text-base font-bold text-slate-900">AI Plant Pathology Ready</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select your crop, capture or upload a leaf photo, and click <strong>Analyze Plant Health</strong> to receive instant disease identification and safe remedy steps.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Multilingual Agronomic Decision Support
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
