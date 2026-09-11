import { ScanRecord, FarmerProfile, QueuedScan, FarmAlert } from '../types';
import { INITIAL_SCAN_HISTORY, INITIAL_FARM_ALERTS } from '../sampleData';

const STORAGE_KEYS = {
  SCANS: 'farmguard_scans_v1',
  PROFILE: 'farmguard_profile_v1',
  QUEUE: 'farmguard_sync_queue_v1',
  ALERTS: 'farmguard_alerts_v1',
  REGISTERED: 'farmguard_registered_status_v1',
};

export const DEFAULT_DEMO_PROFILE: FarmerProfile = {
  name: 'आकाश ठाकरे (Akash Thakare)',
  language: 'hi',
  village: 'पिंपलगांव (Pimpalgaon)',
  district: 'नाशिक (Nashik), Maharashtra',
  farmSizeAcres: '4',
  crops: ['कपास (Cotton)', 'टमाटर (Tomato)', 'सोयाबीन (Soybean)'],
  animals: ['गाय (Cow)', 'भैंस (Buffalo)'],
  phone: '9822012345',
  isRegistered: true,
};

export function isUserRegistered(): boolean {
  try {
    const status = localStorage.getItem(STORAGE_KEYS.REGISTERED);
    return status === 'true';
  } catch (e) {
    return false;
  }
}

export function setRegistrationStatus(status: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTERED, String(status));
  } catch (e) {
    console.error('Failed to save registration status', e);
  }
}

export function clearUserRegistration(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.REGISTERED);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  } catch (e) {
    console.error('Failed to clear registration', e);
  }
}

export function getStoredProfile(): FarmerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load profile', e);
  }
  return null;
}

export function saveStoredProfile(profile: FarmerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEYS.REGISTERED, 'true');
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getStoredScans(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCANS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load scans', e);
  }
  // Initialize with seed data if first time
  saveStoredScans(INITIAL_SCAN_HISTORY);
  return INITIAL_SCAN_HISTORY;
}

export function saveStoredScans(scans: ScanRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));
  } catch (e) {
    console.error('Failed to save scans', e);
  }
}

export function addScanRecord(record: ScanRecord): void {
  const scans = getStoredScans();
  const updated = [record, ...scans];
  saveStoredScans(updated);
}

export function getQueuedScans(): QueuedScan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUEUE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load queue', e);
  }
  return [];
}

export function saveQueuedScans(queue: QueuedScan[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save queue', e);
  }
}

export function enqueueOfflineScan(type: 'crop' | 'animal', payload: any, imagePreview: string): QueuedScan {
  const queue = getQueuedScans();
  const item: QueuedScan = {
    id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    type,
    timestamp: new Date().toLocaleString(),
    payload,
    imagePreview,
    status: 'pending',
  };
  const updated = [item, ...queue];
  saveQueuedScans(updated);
  return item;
}

export function removeQueuedScan(id: string): void {
  const queue = getQueuedScans().filter((q) => q.id !== id);
  saveQueuedScans(queue);
}

export function getStoredAlerts(): FarmAlert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load alerts', e);
  }
  return INITIAL_FARM_ALERTS;
}

export function saveStoredAlerts(alerts: FarmAlert[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts', e);
  }
}

export function getStoredExpenses(): import('../types').ExpenseRecord[] {
  const DEFAULT_EXPENSES: import('../types').ExpenseRecord[] = [
    { id: 'exp-1', date: '2026-09-08', type: 'expense', category: 'Fertilizer', amount: 3200, notes: 'DAP & Urea bags' },
    { id: 'exp-2', date: '2026-09-05', type: 'expense', category: 'Labour', amount: 2400, notes: 'Weeding 4 workers' },
    { id: 'exp-3', date: '2026-09-02', type: 'income', category: 'Produce Sale', amount: 18500, notes: 'Tomato harvest 12 crates' },
    { id: 'exp-4', date: '2026-08-28', type: 'expense', category: 'Veterinary', amount: 800, notes: 'Deworming & calcium tonic' },
  ];
  try {
    const raw = localStorage.getItem('farmguard_expenses_v1');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_EXPENSES;
}

export function saveStoredExpenses(expenses: import('../types').ExpenseRecord[]): void {
  try {
    localStorage.setItem('farmguard_expenses_v1', JSON.stringify(expenses));
  } catch (e) {
    console.error('Failed to save expenses', e);
  }
}

export function getStoredCropRecords(): import('../types').CropRecordItem[] {
  const DEFAULT_CROPS: import('../types').CropRecordItem[] = [
    { id: 'cr-1', cropName: 'Cotton (कपास)', variety: 'Bt Cotton RCH-659', plantingDate: '2026-06-15', fieldArea: '2.5 Acres (North Plot)', stage: 'Square Formation', notes: 'Drip irrigated, monitored for bollworm' },
    { id: 'cr-2', cropName: 'Tomato (टमाटर)', variety: 'Abhinav Hybrid', plantingDate: '2026-07-20', fieldArea: '1.0 Acre (South Plot)', stage: 'Fruiting Stage', notes: 'Staked with bamboo, weekly calcium spray' },
  ];
  try {
    const raw = localStorage.getItem('farmguard_crop_records_v1');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_CROPS;
}

export function saveStoredCropRecords(records: import('../types').CropRecordItem[]): void {
  try {
    localStorage.setItem('farmguard_crop_records_v1', JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save crop records', e);
  }
}

export function getStoredAnimalRecords(): import('../types').AnimalRecordItem[] {
  const DEFAULT_ANIMALS: import('../types').AnimalRecordItem[] = [
    { id: 'an-1', tagId: 'IN-MH-1082', animalType: 'Gir Cow (गाय - गौरी)', ageYears: 4, vaccinationHistory: ['FMD (Aug 2026)', 'Lumpy Skin (May 2026)'], lastCheckupDate: '2026-08-15', healthStatus: 'healthy', notes: 'Yields 11 L/day, high appetite' },
    { id: 'an-2', tagId: 'IN-MH-2041', animalType: 'Murrah Buffalo (भैंस - लक्ष्मी)', ageYears: 5, vaccinationHistory: ['HS & BQ (Jul 2026)'], lastCheckupDate: '2026-08-20', healthStatus: 'healthy', notes: 'Calved in June, healthy lactation' },
  ];
  try {
    const raw = localStorage.getItem('farmguard_animal_records_v1');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_ANIMALS;
}

export function saveStoredAnimalRecords(records: import('../types').AnimalRecordItem[]): void {
  try {
    localStorage.setItem('farmguard_animal_records_v1', JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save animal records', e);
  }
}

