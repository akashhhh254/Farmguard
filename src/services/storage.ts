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
