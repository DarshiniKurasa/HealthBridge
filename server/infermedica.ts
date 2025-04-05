/**
 * Utility functions for interacting with Infermedica API
 */

const INFERMEDICA_API_KEY = process.env.INFERMEDICA_API_KEY;
const INFERMEDICA_APP_ID = process.env.INFERMEDICA_APP_ID;
const INFERMEDICA_API_URL = 'https://api.infermedica.com/v3';

interface Evidence {
  id: string;
  choice_id: string;
  source?: string;
}

interface Condition {
  id: string;
  name: string;
  common_name: string;
  probability: number;
}

interface Patient {
  sex: 'male' | 'female';
  age: number;
}

/**
 * Get symptoms from Infermedica
 * @returns List of available symptoms
 */
export async function getSymptoms(): Promise<any> {
  try {
    if (!INFERMEDICA_API_KEY || !INFERMEDICA_APP_ID) {
      throw new Error('Infermedica API credentials not configured');
    }

    const response = await fetch(`${INFERMEDICA_API_URL}/symptoms`, {
      headers: {
        'App-Id': INFERMEDICA_APP_ID,
        'App-Key': INFERMEDICA_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get symptoms: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting symptoms:', error);
    throw error;
  }
}

/**
 * Get risk factors from Infermedica
 * @returns List of available risk factors
 */
export async function getRiskFactors(): Promise<any> {
  try {
    if (!INFERMEDICA_API_KEY || !INFERMEDICA_APP_ID) {
      throw new Error('Infermedica API credentials not configured');
    }

    const response = await fetch(`${INFERMEDICA_API_URL}/risk_factors`, {
      headers: {
        'App-Id': INFERMEDICA_APP_ID,
        'App-Key': INFERMEDICA_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get risk factors: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting risk factors:', error);
    throw error;
  }
}

/**
 * Parse symptoms from user input
 * @param text The text to parse
 * @param context Additional context
 * @returns Parsed symptoms
 */
export async function parseSymptoms(text: string, context?: any): Promise<any> {
  try {
    if (!INFERMEDICA_API_KEY || !INFERMEDICA_APP_ID) {
      throw new Error('Infermedica API credentials not configured');
    }

    const response = await fetch(`${INFERMEDICA_API_URL}/parse`, {
      method: 'POST',
      headers: {
        'App-Id': INFERMEDICA_APP_ID,
        'App-Key': INFERMEDICA_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        context
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to parse symptoms: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error parsing symptoms:', error);
    throw error;
  }
}

/**
 * Get diagnosis based on symptoms
 * @param evidence List of symptoms and their states
 * @param patient Patient information
 * @returns Diagnosis information
 */
export async function getDiagnosis(evidence: Evidence[], patient: Patient): Promise<any> {
  try {
    if (!INFERMEDICA_API_KEY || !INFERMEDICA_APP_ID) {
      throw new Error('Infermedica API credentials not configured');
    }

    const response = await fetch(`${INFERMEDICA_API_URL}/diagnosis`, {
      method: 'POST',
      headers: {
        'App-Id': INFERMEDICA_APP_ID,
        'App-Key': INFERMEDICA_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sex: patient.sex,
        age: patient.age,
        evidence
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to get diagnosis: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting diagnosis:', error);
    throw error;
  }
}

/**
 * Get triage information based on symptoms
 * @param evidence List of symptoms and their states
 * @param patient Patient information
 * @returns Triage recommendation
 */
export async function getTriage(evidence: Evidence[], patient: Patient): Promise<any> {
  try {
    if (!INFERMEDICA_API_KEY || !INFERMEDICA_APP_ID) {
      throw new Error('Infermedica API credentials not configured');
    }

    const response = await fetch(`${INFERMEDICA_API_URL}/triage`, {
      method: 'POST',
      headers: {
        'App-Id': INFERMEDICA_APP_ID,
        'App-Key': INFERMEDICA_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sex: patient.sex,
        age: patient.age,
        evidence
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to get triage: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting triage:', error);
    throw error;
  }
}

/**
 * Check if Infermedica API is properly configured
 * @returns Boolean indicating if the API credentials are valid
 */
export async function validateInfermedicaApiCredentials(): Promise<boolean> {
  if (!INFERMEDICA_API_KEY || !INFERMEDICA_APP_ID) return false;
  
  try {
    const response = await fetch(`${INFERMEDICA_API_URL}/info`, {
      headers: {
        'App-Id': INFERMEDICA_APP_ID,
        'App-Key': INFERMEDICA_API_KEY
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating Infermedica API credentials:', error);
    return false;
  }
}