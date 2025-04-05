/**
 * Utility functions for interacting with Formspree API
 */

const FORMSPREE_FORM_ID = process.env.FORMSPREE_FORM_ID;
const FORMSPREE_API_URL = 'https://formspree.io/f';

/**
 * Submit a form to Formspree
 * @param formData The form data to submit
 * @returns The response from Formspree
 */
export async function submitForm(formData: Record<string, any>): Promise<any> {
  try {
    if (!FORMSPREE_FORM_ID) {
      throw new Error('Formspree form ID not configured');
    }

    const response = await fetch(`${FORMSPREE_API_URL}/${FORMSPREE_FORM_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error(`Failed to submit form: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
}

/**
 * Submit a volunteer application
 * @param name Volunteer's name
 * @param email Volunteer's email
 * @param phone Volunteer's phone number
 * @param skills Volunteer's skills
 * @param availability Volunteer's availability
 * @param message Additional message from volunteer
 * @returns The response from Formspree
 */
export async function submitVolunteerApplication(
  name: string,
  email: string,
  phone: string,
  skills: string[],
  availability: string[],
  message?: string
): Promise<any> {
  const formData = {
    name,
    email,
    phone,
    skills: skills.join(', '),
    availability: availability.join(', '),
    message: message || '',
    form_name: 'volunteer_application'
  };

  return await submitForm(formData);
}

/**
 * Submit a contact form
 * @param name Contact's name
 * @param email Contact's email
 * @param subject Subject of the message
 * @param message The message
 * @returns The response from Formspree
 */
export async function submitContactForm(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<any> {
  const formData = {
    name,
    email,
    subject,
    message,
    form_name: 'contact_form'
  };

  return await submitForm(formData);
}

/**
 * Check if Formspree is properly configured
 * @returns Boolean indicating if the form ID is configured
 */
export function isFormspreeConfigured(): boolean {
  return !!FORMSPREE_FORM_ID;
}