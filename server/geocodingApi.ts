/**
 * Utility functions for interacting with OpenCage Geocoding API
 */

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
const OPENCAGE_API_URL = 'https://api.opencagedata.com/geocode/v1/json';

/**
 * Forward geocoding - convert address to coordinates
 * @param address The address to geocode
 * @returns Coordinates and detailed location information
 */
export async function forwardGeocode(address: string): Promise<any> {
  try {
    const url = `${OPENCAGE_API_URL}?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0];
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

/**
 * Reverse geocoding - convert coordinates to address
 * @param lat Latitude
 * @param lng Longitude
 * @returns Address and detailed location information
 */
export async function reverseGeocode(lat: number, lng: number): Promise<any> {
  try {
    const url = `${OPENCAGE_API_URL}?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0];
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
}

/**
 * Find healthcare facilities near a location
 * @param lat Latitude
 * @param lng Longitude
 * @param type Type of facility ('hospital', 'pharmacy', etc.)
 * @param radius Search radius in km
 * @returns List of nearby healthcare facilities
 */
export async function findNearbyHealthcareFacilities(
  lat: number, 
  lng: number, 
  type: string = 'hospital', 
  radius: number = 5
): Promise<any[]> {
  // In a real implementation, this would use the OpenCage API with additional parameters
  // For now, we'll return mock data based on the provided location
  
  // In production, you'd want to use a service like Google Places API or a medical facility database
  // This is just to demonstrate the structure
  const mockFacilities = [
    {
      name: `${type === 'hospital' ? 'City General Hospital' : 'Community Pharmacy'}`,
      address: "123 Healthcare Ave",
      coordinates: { lat: lat + 0.01, lng: lng + 0.01 },
      distance: "1.2 km",
      type: type,
      phone: "555-123-4567",
      hours: "8:00 AM - 8:00 PM",
      rating: 4.5
    },
    {
      name: `${type === 'hospital' ? 'Mercy Medical Center' : 'Health First Pharmacy'}`,
      address: "456 Wellness Blvd",
      coordinates: { lat: lat - 0.015, lng: lng + 0.02 },
      distance: "2.5 km",
      type: type,
      phone: "555-987-6543",
      hours: "24 hours",
      rating: 4.2
    },
    {
      name: `${type === 'hospital' ? 'Community Health Clinic' : 'MediPharm Plus'}`,
      address: "789 Caregiver Street",
      coordinates: { lat: lat + 0.025, lng: lng - 0.01 },
      distance: "3.8 km",
      type: type,
      phone: "555-456-7890",
      hours: "9:00 AM - 6:00 PM",
      rating: 3.9
    }
  ];
  
  return mockFacilities;
}