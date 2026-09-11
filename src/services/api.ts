import { CropScanResult, AnimalScanResult, WeatherContext } from '../types';

export async function analyzeCropApi(payload: {
  image: string;
  cropType: string;
  stage?: string;
  symptoms?: string;
  location?: string;
  language: string;
}): Promise<CropScanResult> {
  const response = await fetch('/api/analyze/crop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze crop image');
  }

  const data = await response.json();
  return {
    ...data,
    id: `crop-${Date.now()}`,
    timestamp: new Date().toLocaleString(),
    imageThumbnail: payload.image,
    growthStage: payload.stage,
    location: payload.location,
  };
}

export async function analyzeAnimalApi(payload: {
  image?: string;
  animalType: string;
  symptoms: string[];
  notes?: string;
  language: string;
}): Promise<AnimalScanResult> {
  const response = await fetch('/api/analyze/animal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze animal health');
  }

  const data = await response.json();
  return {
    ...data,
    id: `animal-${Date.now()}`,
    timestamp: new Date().toLocaleString(),
    imageThumbnail: payload.image,
    reportedSymptoms: payload.symptoms,
    notes: payload.notes,
  };
}

export async function fetchWeatherAdvisory(location: string = 'Central Farming District'): Promise<WeatherContext> {
  try {
    const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn('Weather fetch fallback', e);
  }
  return {
    location,
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 75,
    windSpeed: '14 km/h',
    rainProbability: 40,
    advisory: {
      cropRisk: 'High humidity accelerates leaf spot and powdery mildew risk.',
      actionItem: 'Check lower leaf canopies for circular brown spots.',
      livestockAdvice: 'Keep cattle shed dry; inspect hooves and teats.',
    },
  };
}

export async function processVoiceQuery(transcript: string, language: string) {
  const response = await fetch('/api/voice/assist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, language }),
  });
  if (!response.ok) {
    throw new Error('Voice assistant request failed');
  }
  return await response.json();
}
