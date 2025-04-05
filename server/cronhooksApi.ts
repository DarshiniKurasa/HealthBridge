/**
 * Utility functions for interacting with Cronhooks API
 */

const CRONHOOKS_API_KEY = process.env.CRONHOOKS_API_KEY;
const CRONHOOKS_API_URL = 'https://cronhooks.io/api/v1';

interface CronhookSchedule {
  title: string;
  description?: string;
  scheduled_time: string; // ISO 8601 format
  frequency?: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  tags?: string[];
  event_data?: any;
  callback_url?: string;
}

/**
 * Create a new scheduled reminder in Cronhooks
 * @param schedule The schedule details
 * @returns The created schedule
 */
export async function createSchedule(schedule: CronhookSchedule): Promise<any> {
  try {
    if (!CRONHOOKS_API_KEY) {
      throw new Error('Cronhooks API key not configured');
    }

    const response = await fetch(`${CRONHOOKS_API_URL}/schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CRONHOOKS_API_KEY}`
      },
      body: JSON.stringify(schedule)
    });

    if (!response.ok) {
      throw new Error(`Failed to create Cronhooks schedule: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Cronhooks schedule:', error);
    throw error;
  }
}

/**
 * Get all scheduled reminders
 * @returns List of schedules
 */
export async function getSchedules(): Promise<any> {
  try {
    if (!CRONHOOKS_API_KEY) {
      throw new Error('Cronhooks API key not configured');
    }

    const response = await fetch(`${CRONHOOKS_API_URL}/schedules`, {
      headers: {
        'Authorization': `Bearer ${CRONHOOKS_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get Cronhooks schedules: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting Cronhooks schedules:', error);
    throw error;
  }
}

/**
 * Delete a schedule by ID
 * @param scheduleId The ID of the schedule to delete
 * @returns Success status
 */
export async function deleteSchedule(scheduleId: string): Promise<boolean> {
  try {
    if (!CRONHOOKS_API_KEY) {
      throw new Error('Cronhooks API key not configured');
    }

    const response = await fetch(`${CRONHOOKS_API_URL}/schedules/${scheduleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${CRONHOOKS_API_KEY}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting Cronhooks schedule:', error);
    return false;
  }
}

/**
 * Create a medication reminder schedule
 * @param userId User ID
 * @param medicationName Name of the medication
 * @param dosage Dosage information
 * @param scheduledTime When to remind the user (ISO 8601 format)
 * @param frequency How often to repeat the reminder
 * @param callbackUrl URL to call when the reminder is triggered
 * @returns The created schedule
 */
export async function createMedicationReminder(
  userId: number,
  medicationName: string,
  dosage: string,
  scheduledTime: string,
  frequency: 'once' | 'daily' | 'weekly' = 'daily',
  callbackUrl?: string
): Promise<any> {
  const schedule: CronhookSchedule = {
    title: `Medication Reminder: ${medicationName}`,
    description: `Time to take ${dosage} of ${medicationName}`,
    scheduled_time: scheduledTime,
    frequency: frequency,
    tags: ['medication', 'reminder', `user-${userId}`],
    event_data: {
      userId,
      medicationName,
      dosage,
      type: 'medication_reminder'
    },
    callback_url: callbackUrl
  };

  return await createSchedule(schedule);
}

/**
 * Check if Cronhooks API is properly configured
 * @returns Boolean indicating if the API key is valid
 */
export async function validateCronhooksApiKey(): Promise<boolean> {
  if (!CRONHOOKS_API_KEY) return false;
  
  try {
    const response = await fetch(`${CRONHOOKS_API_URL}/schedules`, {
      headers: {
        'Authorization': `Bearer ${CRONHOOKS_API_KEY}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating Cronhooks API key:', error);
    return false;
  }
}