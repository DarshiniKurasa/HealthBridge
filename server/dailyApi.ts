/**
 * Utility functions for interacting with Daily.co API
 */

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_API_URL = 'https://api.daily.co/v1';

/**
 * Create a new Daily.co room for a telemedicine appointment
 * @param appointmentId Unique identifier for the appointment
 * @param expiryMinutes Number of minutes until the room expires (default: 60)
 * @returns Room details including URL
 */
export async function createVideoRoom(appointmentId: string, expiryMinutes: number = 60): Promise<any> {
  try {
    const response = await fetch(`${DAILY_API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`
      },
      body: JSON.stringify({
        name: `appointment-${appointmentId}`,
        privacy: 'private',
        properties: {
          exp: Math.floor(Date.now() / 1000) + (expiryMinutes * 60),
          eject_at_room_exp: true,
          enable_chat: true,
          start_video_off: false,
          start_audio_off: false,
          enable_screenshare: true,
          enable_emoji_reactions: true
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create Daily.co room: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      roomName: data.name,
      roomUrl: data.url,
      expiresAt: new Date((data.config.exp || 0) * 1000).toISOString(),
      privacy: data.privacy
    };
  } catch (error) {
    console.error('Error creating Daily.co room:', error);
    throw error;
  }
}

/**
 * Create a token for a specific room
 * @param roomName The name of the room to create a token for
 * @param participantName Name of the participant
 * @param isDoctor Whether the participant is a doctor (grants additional permissions)
 * @returns A token that can be used to join the room
 */
export async function createRoomToken(
  roomName: string, 
  participantName: string, 
  isDoctor: boolean = false
): Promise<string> {
  try {
    const response = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_name: participantName,
          is_owner: isDoctor,
          enable_recording: isDoctor,
          start_video_off: false,
          start_audio_off: false,
          exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour token
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create Daily.co token: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error creating Daily.co token:', error);
    throw error;
  }
}

/**
 * Delete a Daily.co room
 * @param roomName The name of the room to delete
 * @returns Success status
 */
export async function deleteRoom(roomName: string): Promise<boolean> {
  try {
    const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting Daily.co room:', error);
    return false;
  }
}

/**
 * Validate if a Daily.co API key is properly configured
 * @returns Boolean indicating if the API key is valid
 */
export async function validateDailyApiKey(): Promise<boolean> {
  if (!DAILY_API_KEY) return false;
  
  try {
    const response = await fetch(`${DAILY_API_URL}/rooms`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating Daily.co API key:', error);
    return false;
  }
}