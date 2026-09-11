import { FarmerLocation } from '../types';

export const LocationService = {
  /**
   * Request device geolocation with high accuracy
   */
  async getCurrentLocation(): Promise<FarmerLocation> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy);

          // Reverse geocoding or regional district heuristic
          let district = 'Nashik';
          let state = 'Maharashtra';
          let address = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;

          try {
            // Attempt reverse geocoding via OpenStreetMap Nominatim with gentle timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);

            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
              {
                headers: { 'User-Agent': 'FarmGuard-AI-App' },
                signal: controller.signal,
              }
            );
            clearTimeout(timeoutId);

            if (res.ok) {
              const data = await res.json();
              if (data && data.address) {
                district = data.address.state_district || data.address.county || data.address.city || district;
                state = data.address.state || state;
                address = data.display_name?.split(',').slice(0, 3).join(',') || address;
              }
            }
          } catch {
            // Graceful fallback to GPS coords
          }

          resolve({
            latitude: lat,
            longitude: lon,
            accuracy,
            district,
            state,
            address,
            isLiveGps: true,
          });
        },
        (err) => {
          let errorMsg = 'Location permission was denied or unavailable.';
          if (err.code === err.PERMISSION_DENIED) {
            errorMsg = 'Location permission was denied by user.';
          } else if (err.code === err.TIMEOUT) {
            errorMsg = 'Location request timed out.';
          }
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 60000,
        }
      );
    });
  },

  /**
   * Manual location setting fallback
   */
  createManualLocation(district: string, state: string = 'Maharashtra'): FarmerLocation {
    // Standard coordinates for agricultural districts
    const districtCoords: Record<string, { lat: number; lon: number }> = {
      'Nashik': { lat: 19.9975, lon: 73.7898 },
      'Pune': { lat: 18.5204, lon: 73.8567 },
      'Nagpur': { lat: 21.1458, lon: 79.0882 },
      'Amravati': { lat: 20.9374, lon: 77.7796 },
      'Aurangabad': { lat: 19.8762, lon: 75.3433 },
      'Kolhapur': { lat: 16.7050, lon: 74.2433 },
      'Akola': { lat: 20.7002, lon: 77.0082 },
      'Indore': { lat: 22.7196, lon: 75.8577 },
      'Bhopal': { lat: 23.2599, lon: 77.4126 },
    };

    const coord = districtCoords[district] || { lat: 19.7515, lon: 75.7139 };

    return {
      latitude: coord.lat,
      longitude: coord.lon,
      district,
      state,
      address: `${district}, ${state}`,
      isLiveGps: false,
    };
  },
};
