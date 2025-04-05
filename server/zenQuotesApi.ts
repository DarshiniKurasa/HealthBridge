/**
 * Utility functions for interacting with ZenQuotes API
 */

const ZENQUOTES_API_URL = 'https://zenquotes.io/api';

interface Quote {
  q: string; // quote text
  a: string; // author
  h: string; // HTML format
}

/**
 * Get a random inspirational quote
 * @returns A random quote
 */
export async function getRandomQuote(): Promise<Quote> {
  try {
    const response = await fetch(`${ZENQUOTES_API_URL}/random`);
    
    if (!response.ok) {
      throw new Error(`Failed to get quote: ${response.statusText}`);
    }
    
    const quotes = await response.json();
    return quotes[0];
  } catch (error) {
    console.error('Error getting random quote:', error);
    throw error;
  }
}

/**
 * Get today's quote of the day
 * @returns Quote of the day
 */
export async function getQuoteOfTheDay(): Promise<Quote> {
  try {
    const response = await fetch(`${ZENQUOTES_API_URL}/today`);
    
    if (!response.ok) {
      throw new Error(`Failed to get quote of the day: ${response.statusText}`);
    }
    
    const quotes = await response.json();
    return quotes[0];
  } catch (error) {
    console.error('Error getting quote of the day:', error);
    throw error;
  }
}

/**
 * Get multiple random quotes
 * @param count Number of quotes to retrieve
 * @returns Array of quotes
 */
export async function getMultipleQuotes(count: number = 5): Promise<Quote[]> {
  try {
    const response = await fetch(`${ZENQUOTES_API_URL}/quotes`);
    
    if (!response.ok) {
      throw new Error(`Failed to get quotes: ${response.statusText}`);
    }
    
    const quotes = await response.json();
    
    // Return only the requested number of quotes
    return quotes.slice(0, count);
  } catch (error) {
    console.error('Error getting multiple quotes:', error);
    throw error;
  }
}

/**
 * Get mental health related quotes
 * @param count Number of quotes to retrieve
 * @returns Array of mental health related quotes
 */
export async function getMentalHealthQuotes(count: number = 5): Promise<Quote[]> {
  try {
    // Use the Quotable API for specific topics
    const response = await fetch(`https://api.quotable.io/quotes?tags=wisdom,happiness,inspirational&limit=${count}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get mental health quotes: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the response to match the ZenQuotes format
    return data.results.map((quote: any) => ({
      q: quote.content,
      a: quote.author,
      h: `<blockquote>&ldquo;${quote.content}&rdquo; &mdash; <footer>${quote.author}</footer></blockquote>`
    }));
  } catch (error) {
    console.error('Error getting mental health quotes:', error);
    
    // Fallback to random quotes if mental health quotes fail
    return getMultipleQuotes(count);
  }
}