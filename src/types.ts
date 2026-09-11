export type Language = 'en' | 'hi' | 'mr';

export type AppView =
  | 'dashboard'
  | 'welcome-info'
  | 'crop-scanner'
  | 'animal-scanner'
  | 'overview'
  | 'history'
  | 'alerts'
  | 'irrigation'
  | 'fertilizer'
  | 'expenses'
  | 'farm-records'
  | 'knowledge'
  | 'market'
  | 'admin-analytics'
  | 'offline-library';

export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Emergency';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  provider: 'google' | 'email' | 'phone' | 'demo';
}

export interface CropScanResult {
  id: string;
  timestamp: string;
  imageQualityValid: boolean;
  clarityFeedback: string;
  cropIdentified: string;
  conditionName: string;
  isHealthy: boolean;
  confidenceScore: number;
  severityLevel: 'Low' | 'Moderate' | 'High';
  visibleSymptoms: string[];
  possibleCauses: string[];
  whyAiFlaggedThis: string[];
  immediateActions: string[];
  preventionTips: string[];
  expertAssistanceRecommendation: string;
  imageThumbnail: string;
  growthStage?: string;
  location?: string;
}

export interface AnimalScanResult {
  id: string;
  timestamp: string;
  animalType: string;
  possibleCondition: string;
  isHealthy: boolean;
  riskLevel: SeverityLevel;
  confidenceScore: number;
  observedIndicators: string[];
  whyAiFlaggedThis: string[];
  immediateSafeActions: string[];
  preventionAndHygiene: string[];
  veterinaryConsultationRequired: boolean;
  veterinaryAdvice: string;
  safetyDisclaimer: string;
  imageThumbnail?: string;
  reportedSymptoms: string[];
  notes?: string;
}

export interface ScanRecord {
  id: string;
  type: 'crop' | 'animal';
  date: string;
  entityName: string; // Crop or Animal name
  condition: string;
  confidence: number;
  severity: SeverityLevel;
  imageThumbnail: string;
  isHealthy: boolean;
  cropData?: CropScanResult;
  animalData?: AnimalScanResult;
}

export interface FarmerLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  village?: string;
  district?: string;
  state?: string;
  isLiveGps?: boolean;
}

export interface FarmerProfile {
  uid?: string;
  name: string;
  email?: string;
  phone?: string;
  photoURL?: string;
  language: Language;
  village: string;
  district: string;
  state?: string;
  farmName?: string;
  farmSizeAcres: string;
  crops: string[];
  animals: string[];
  location?: FarmerLocation;
  isRegistered?: boolean;
}

export interface FarmAlert {
  id: string;
  title: string;
  category: 'crop' | 'livestock' | 'weather' | 'reminder';
  severity: 'high' | 'warning' | 'info';
  timestamp: string;
  description: string;
  actionRequired: string;
  isRead?: boolean;
}

export interface WeatherContext {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: string;
  rainProbability: number;
  advisory: {
    cropRisk: string;
    actionItem: string;
    livestockAdvice: string;
  };
}

export interface IrrigationRecommendation {
  crop: string;
  stage: string;
  soilType: string;
  recommendation: 'irrigate_now' | 'delay_irrigation' | 'light_irrigation' | 'sufficient_moisture';
  adviceTitle: string;
  timing: string;
  waterSavingTip: string;
  estimatedLitresPerAcre: number;
  reason: string;
}

export interface FertilizerRecommendation {
  crop: string;
  stage: string;
  soilHealth: string;
  chemicalGuidance: string;
  organicAlternatives: string[];
  safetyPrecautions: string[];
  warningNote: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  type: 'expense' | 'income';
  category: 'Seeds' | 'Fertilizer' | 'Pesticides' | 'Labour' | 'Irrigation' | 'Equipment' | 'Veterinary' | 'Feed' | 'Transport' | 'Produce Sale' | 'Other';
  amount: number;
  notes: string;
}

export interface CropRecordItem {
  id: string;
  cropName: string;
  variety?: string;
  plantingDate: string;
  fieldArea: string;
  stage: string;
  notes: string;
}

export interface AnimalRecordItem {
  id: string;
  tagId: string;
  animalType: string;
  ageYears: number;
  vaccinationHistory: string[];
  lastCheckupDate: string;
  healthStatus: 'healthy' | 'under_observation' | 'treatment';
  notes: string;
}

export interface MarketPriceItem {
  crop: string;
  marketName: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceTrend: 'up' | 'down' | 'stable';
  date: string;
}

export interface QueuedScan {
  id: string;
  timestamp: string;
  type: 'crop' | 'animal';
  payload: any;
  imagePreview: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  entityName?: string;
  condition?: string;
  retryCount?: number;
}
