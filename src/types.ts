export type Language = 'en' | 'hi' | 'mr';

export type AppView =
  | 'dashboard'
  | 'crop-scanner'
  | 'animal-scanner'
  | 'overview'
  | 'history'
  | 'alerts'
  | 'admin-analytics'
  | 'offline-library';

export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Emergency';

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

export interface QueuedScan {
  id: string;
  type: 'crop' | 'animal';
  timestamp: string;
  payload: any;
  imagePreview: string;
  status: 'pending' | 'syncing' | 'failed';
}

export interface FarmerProfile {
  name: string;
  language: Language;
  village: string;
  district: string;
  farmSizeAcres: string;
  crops: string[];
  animals: string[];
  phone?: string;
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
