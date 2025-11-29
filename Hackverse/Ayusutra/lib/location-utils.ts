export interface Location {
  latitude: number;
  longitude: number;
}

export interface ClinicWithDistance {
  id?: number;
  name: string;
  address: string;
  phone: string;
  rating: number;
  image: string;
  description: string;
  services: string[];
  distance?: number;
  therapyPricing?: string;
  reviews?: number;
  photo?: string;
}

export interface Clinic {
  id?: number;
  name: string;
  address: string;
  phone: string;
  rating: number;
  image: string;
  description: string;
  services: string[];
  latitude: number;
  longitude: number;
}

/**
 * Get the current user's location using the browser's geolocation API
 */
export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user. Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your internet connection.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout
        maximumAge: 0, // Don't use cached location - force fresh request
      }
    );
  });
}

/**
 * Calculate the distance between two points using the Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Validate inputs
  if (!lat1 || !lon1 || !lat2 || !lon2 || 
      isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    return 0;
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  // Apply correction factor for real-world driving distance
  // Haversine gives "as the crow flies" distance, but driving distance is typically 1.5-1.8x longer
  const correctedDistance = distance * 1.6;
  
  return Math.round(correctedDistance * 100) / 100; // Round to 2 decimal places
}


/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Sort clinics by distance from user location
 */
export function sortClinicsByDistance(
  clinics: Clinic[],
  userLocation: Location
): ClinicWithDistance[] {
  return clinics
    .map((clinic) => ({
      ...clinic,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        clinic.latitude,
        clinic.longitude
      ),
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Format distance for display
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance}km`;
}

/**
 * Check if location services are available
 */
export function isLocationAvailable(): boolean {
  return 'geolocation' in navigator;
}

/**
 * Get location permission status
 */
export async function getLocationPermission(): Promise<PermissionState> {
  if (!('permissions' in navigator)) {
    return 'prompt';
  }
  
  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
    return permission.state;
  } catch (error) {
    return 'prompt';
  }
}