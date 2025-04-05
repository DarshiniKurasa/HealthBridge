/**
 * Utility functions for interacting with Pexels Video API
 */

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/videos';

/**
 * Search for videos on Pexels
 * @param query The search query
 * @param perPage Number of videos per page
 * @param page Page number
 * @returns Video search results
 */
export async function searchVideos(query: string, perPage: number = 10, page: number = 1): Promise<any> {
  try {
    if (!PEXELS_API_KEY) {
      throw new Error('Pexels API key not configured');
    }

    const url = new URL(`${PEXELS_API_URL}/search`);
    url.searchParams.append('query', query);
    url.searchParams.append('per_page', perPage.toString());
    url.searchParams.append('page', page.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to search videos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
}

/**
 * Get a specific video by ID
 * @param id The video ID
 * @returns Video details
 */
export async function getVideoById(id: string): Promise<any> {
  try {
    if (!PEXELS_API_KEY) {
      throw new Error('Pexels API key not configured');
    }

    const response = await fetch(`${PEXELS_API_URL}/videos/${id}`, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get video: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting video:', error);
    throw error;
  }
}

/**
 * Get popular videos
 * @param perPage Number of videos per page
 * @param page Page number
 * @returns Popular videos
 */
export async function getPopularVideos(perPage: number = 10, page: number = 1): Promise<any> {
  try {
    if (!PEXELS_API_KEY) {
      throw new Error('Pexels API key not configured');
    }

    const url = new URL(`${PEXELS_API_URL}/popular`);
    url.searchParams.append('per_page', perPage.toString());
    url.searchParams.append('page', page.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get popular videos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting popular videos:', error);
    throw error;
  }
}

/**
 * Check if Pexels API is properly configured
 * @returns Boolean indicating if the API key is valid
 */
export async function validatePexelsApiKey(): Promise<boolean> {
  if (!PEXELS_API_KEY) return false;
  
  try {
    const response = await fetch(`${PEXELS_API_URL}/popular?per_page=1`, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating Pexels API key:', error);
    return false;
  }
}