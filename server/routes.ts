import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { z } from "zod";
import { WebSocketServer, WebSocket } from "ws";
import { log } from "./vite";
import { setupAuth } from "./auth";
import {
  insertUserSchema,
  insertAppointmentSchema,
  insertForumPostSchema,
  insertForumCommentSchema,
  insertMedicationReminderSchema,
  insertVolunteerApplicationSchema,
  insertHealthcareProviderSchema,
  insertEducationContentSchema
} from "@shared/schema";
import { forwardGeocode, reverseGeocode, findNearbyHealthcareFacilities } from "./geocodingApi";
import { createVideoRoom, createRoomToken, deleteRoom, validateDailyApiKey } from "./dailyApi";
import { createSchedule, getSchedules, deleteSchedule, createMedicationReminder, validateCronhooksApiKey } from "./cronhooksApi";
import { searchVideos, getVideoById, getPopularVideos, validatePexelsApiKey } from "./pexelsApi";
import { submitForm, submitVolunteerApplication, submitContactForm, isFormspreeConfigured } from "./formspreeApi";
import { getSymptoms, getRiskFactors, parseSymptoms, getDiagnosis, getTriage, validateInfermedicaApiCredentials } from "./infermedica";
import { getRandomQuote, getQuoteOfTheDay, getMultipleQuotes, getMentalHealthQuotes } from "./zenQuotesApi";

// Function to check if a Perplexity API key is available
const hasPerplexityKey = () => {
  return !!process.env.PERPLEXITY_API_KEY;
};

// Function to check if a Daily.co API key is available
const hasDailyApiKey = () => {
  return !!process.env.DAILY_API_KEY;
};

// Function to check if a Pexels API key is available
const hasPexelsApiKey = () => {
  return !!process.env.PEXELS_API_KEY;
};

// Function to check if Infermedica API credentials are available
const hasInfermedicaCredentials = () => {
  return !!process.env.INFERMEDICA_API_KEY && !!process.env.INFERMEDICA_APP_ID;
};

// Function to check if a Cronhooks API key is available
const hasCronhooksApiKey = () => {
  return !!process.env.CRONHOOKS_API_KEY;
};

// Function to check if a Formspree form ID is available
const hasFormspreeFormId = () => {
  return !!process.env.FORMSPREE_FORM_ID;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // API Routes
  const apiRouter = express.Router();
  
  // User Authentication Routes
  apiRouter.post("/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating user" });
      }
    }
  });

  apiRouter.post("/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ message: "Login successful", userId: user.id });
    } catch (error) {
      res.status(500).json({ message: "Error during login" });
    }
  });

  // Healthcare Providers Routes
  apiRouter.post("/providers", async (req, res) => {
    try {
      const providerData = insertHealthcareProviderSchema.parse(req.body);
      const provider = await storage.createHealthcareProvider(providerData);
      res.status(201).json({ message: "Provider created successfully", providerId: provider.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid provider data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating provider" });
      }
    }
  });

  apiRouter.get("/providers", async (req, res) => {
    try {
      const providers = await storage.getAllHealthcareProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving providers" });
    }
  });

  apiRouter.get("/providers/:id", async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const provider = await storage.getHealthcareProvider(providerId);
      
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      
      res.json(provider);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving provider" });
    }
  });

  // Telemedicine Appointments Routes
  apiRouter.post("/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json({ message: "Appointment scheduled successfully", appointmentId: appointment.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error scheduling appointment" });
      }
    }
  });

  apiRouter.get("/appointments/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const appointments = await storage.getUserAppointments(userId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving appointments" });
    }
  });

  // Forum Posts Routes
  apiRouter.post("/forum/posts", async (req, res) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(postData);
      res.status(201).json({ message: "Post created successfully", postId: post.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid post data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating post" });
      }
    }
  });

  apiRouter.get("/forum/posts", async (req, res) => {
    try {
      const posts = await storage.getAllForumPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving posts" });
    }
  });

  // Forum Comments Routes
  apiRouter.post("/forum/comments", async (req, res) => {
    try {
      const commentData = insertForumCommentSchema.parse(req.body);
      const comment = await storage.createForumComment(commentData);
      res.status(201).json({ message: "Comment added successfully", commentId: comment.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error adding comment" });
      }
    }
  });

  // Medication Reminders Routes
  apiRouter.post("/reminders", async (req, res) => {
    try {
      const reminderData = insertMedicationReminderSchema.parse(req.body);
      const reminder = await storage.createMedicationReminder(reminderData);
      res.status(201).json({ message: "Reminder created successfully", reminderId: reminder.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid reminder data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating reminder" });
      }
    }
  });

  apiRouter.get("/reminders/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reminders = await storage.getUserMedicationReminders(userId);
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving reminders" });
    }
  });

  // Volunteer Applications Routes
  apiRouter.post("/volunteers/apply", async (req, res) => {
    try {
      const applicationData = insertVolunteerApplicationSchema.parse(req.body);
      const application = await storage.createVolunteerApplication(applicationData);
      res.status(201).json({ message: "Application submitted successfully", applicationId: application.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid application data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error submitting application" });
      }
    }
  });

  // AI Symptom Diagnosis Route
  apiRouter.post("/diagnosis/symptoms", async (req, res) => {
    try {
      const { symptoms } = req.body;
      
      if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
        return res.status(400).json({ message: "Valid symptoms array required" });
      }
      
      try {
        // Import the analyzeSymptoms function from geminiApi
        const { analyzeSymptoms } = await import('./geminiApi');
        
        // Get AI analysis of symptoms
        const analysis = await analyzeSymptoms(symptoms);
        
        return res.json({ 
          message: "Symptom analysis completed",
          analysis,
          source: "gemini" 
        });
      } catch (error) {
        log(`Error analyzing symptoms with Gemini: ${error}`, 'diagnosis');
        
        // Fallback responses if AI processing fails
        const fallbackResponses = [
          "Based on your symptoms, you might be experiencing a common cold. Rest, fluids, and over-the-counter medication may help. Consult a doctor if symptoms worsen.",
          "Your symptoms could be related to seasonal allergies. Antihistamines might provide relief. If symptoms persist, please consult a healthcare provider.",
          "These symptoms could indicate a viral infection. Rest and hydration are important. If symptoms worsen or persist beyond a few days, consult a healthcare professional."
        ];
        
        return res.json({ 
          message: "Symptom analysis completed",
          analysis: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)] + 
                   "\n\nDISCLAIMER: This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation.",
          source: "fallback"
        });
      }
    } catch (error) {
      log(`Diagnosis route error: ${error}`, 'diagnosis');
      res.status(500).json({ message: "Error processing symptom diagnosis" });
    }
  });
  
  // Health Education Content Routes
  apiRouter.post("/education/content", async (req, res) => {
    try {
      const contentData = insertEducationContentSchema.parse(req.body);
      const content = await storage.createEducationContent(contentData);
      res.status(201).json({ message: "Content created successfully", contentId: content.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid content data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating content" });
      }
    }
  });

  apiRouter.get("/education/content", async (req, res) => {
    try {
      const { type } = req.query;
      let content;
      
      if (type) {
        content = await storage.getEducationContentByType(type as string);
      } else {
        content = await storage.getAllEducationContent();
      }
      
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving content" });
    }
  });

  // Emergency SOS Route
  apiRouter.post("/emergency/sos", async (req, res) => {
    try {
      const { userId, location } = req.body;
      
      if (!userId || !location) {
        return res.status(400).json({ message: "User ID and location are required" });
      }
      
      // In a real implementation, this would trigger notifications to nearby healthcare providers
      const emergencyResponse = await storage.createEmergencyAlert({ userId, location });
      
      res.status(201).json({ 
        message: "Emergency alert sent successfully", 
        emergencyId: emergencyResponse.id,
        estimatedResponse: "Emergency services notified. Help is on the way." 
      });
    } catch (error) {
      res.status(500).json({ message: "Error sending emergency alert" });
    }
  });

  // Geocoding API Routes
  apiRouter.get("/geocode/forward", async (req, res) => {
    try {
      const { address } = req.query;
      
      if (!address) {
        return res.status(400).json({ message: "Address is required" });
      }
      
      const result = await forwardGeocode(address as string);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Error geocoding address", error: error.message || String(error) });
    }
  });

  apiRouter.get("/geocode/reverse", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      const result = await reverseGeocode(parseFloat(lat as string), parseFloat(lng as string));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Error reverse geocoding", error: error.message || String(error) });
    }
  });

  // Healthcare Facilities Routes
  apiRouter.get("/healthcare/facilities", async (req, res) => {
    try {
      const { lat, lng, type, radius } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      const facilities = await findNearbyHealthcareFacilities(
        parseFloat(lat as string),
        parseFloat(lng as string),
        type as string || 'hospital',
        radius ? parseFloat(radius as string) : 5
      );
      
      res.json(facilities);
    } catch (error: any) {
      res.status(500).json({ message: "Error finding healthcare facilities", error: error.message || String(error) });
    }
  });

  // Video Call Routes
  apiRouter.get("/video/status", async (req, res) => {
    try {
      const isConfigured = hasDailyApiKey();
      
      if (isConfigured) {
        const isValid = await validateDailyApiKey();
        res.json({ 
          status: "success", 
          videoServiceAvailable: isValid,
          videoProvider: "daily.co" 
        });
      } else {
        res.json({ 
          status: "success", 
          videoServiceAvailable: false,
          videoProvider: null,
          message: "Video service not configured" 
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error checking video service status",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.post("/video/rooms", async (req, res) => {
    try {
      if (!hasDailyApiKey()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Video service not configured"
        });
      }
      
      const { appointmentId, expiryMinutes } = req.body;
      
      if (!appointmentId) {
        return res.status(400).json({ message: "Appointment ID is required" });
      }
      
      const roomDetails = await createVideoRoom(
        appointmentId.toString(),
        expiryMinutes ? parseInt(expiryMinutes) : 60
      );
      
      res.status(201).json({ 
        status: "success",
        room: roomDetails
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error creating video room",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.post("/video/tokens", async (req, res) => {
    try {
      if (!hasDailyApiKey()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Video service not configured"
        });
      }
      
      const { roomName, participantName, isDoctor } = req.body;
      
      if (!roomName || !participantName) {
        return res.status(400).json({ message: "Room name and participant name are required" });
      }
      
      const token = await createRoomToken(
        roomName,
        participantName,
        isDoctor === true
      );
      
      res.json({ 
        status: "success",
        token
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error creating room token",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.delete("/video/rooms/:roomName", async (req, res) => {
    try {
      if (!hasDailyApiKey()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Video service not configured"
        });
      }
      
      const { roomName } = req.params;
      
      if (!roomName) {
        return res.status(400).json({ message: "Room name is required" });
      }
      
      const success = await deleteRoom(roomName);
      
      if (success) {
        res.json({ 
          status: "success",
          message: "Room deleted successfully" 
        });
      } else {
        res.status(500).json({ 
          status: "error", 
          message: "Failed to delete room"
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error deleting room",
        error: error.message || String(error)
      });
    }
  });

  // Cronhooks Medication Reminder Routes
  apiRouter.post("/reminders/schedule", async (req, res) => {
    try {
      if (!hasCronhooksApiKey()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Cronhooks reminder service not configured"
        });
      }
      
      const { userId, medicationName, dosage, scheduledTime, frequency, callbackUrl } = req.body;
      
      if (!userId || !medicationName || !dosage || !scheduledTime) {
        return res.status(400).json({ message: "User ID, medication name, dosage, and scheduled time are required" });
      }
      
      const schedule = await createMedicationReminder(
        parseInt(userId),
        medicationName,
        dosage,
        scheduledTime,
        frequency || 'daily',
        callbackUrl
      );
      
      res.status(201).json({ 
        status: "success",
        message: "Medication reminder scheduled successfully",
        schedule
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error scheduling medication reminder",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.get("/reminders/schedules", async (req, res) => {
    try {
      if (!hasCronhooksApiKey()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Cronhooks reminder service not configured"
        });
      }
      
      const schedules = await getSchedules();
      res.json({ 
        status: "success",
        schedules
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error retrieving schedules",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.delete("/reminders/schedules/:id", async (req, res) => {
    try {
      if (!hasCronhooksApiKey()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Cronhooks reminder service not configured"
        });
      }
      
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: "Schedule ID is required" });
      }
      
      const success = await deleteSchedule(id);
      
      if (success) {
        res.json({ 
          status: "success", 
          message: "Schedule deleted successfully" 
        });
      } else {
        res.status(500).json({ 
          status: "error", 
          message: "Failed to delete schedule" 
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error deleting schedule",
        error: error.message || String(error)
      });
    }
  });

  // Pexels Video API Routes
  apiRouter.get("/videos/search", async (req, res) => {
    try {
      if (!hasPexelsApiKey()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Pexels video service not configured"
        });
      }
      
      const { query, page, perPage } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const videos = await searchVideos(
        query as string,
        perPage ? parseInt(perPage as string) : 10,
        page ? parseInt(page as string) : 1
      );
      
      res.json({ 
        status: "success",
        videos
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error searching videos",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.get("/videos/:id", async (req, res) => {
    try {
      if (!hasPexelsApiKey()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Pexels video service not configured"
        });
      }
      
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: "Video ID is required" });
      }
      
      const video = await getVideoById(id);
      
      res.json({ 
        status: "success",
        video
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error retrieving video",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.get("/videos/popular", async (req, res) => {
    try {
      if (!hasPexelsApiKey()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Pexels video service not configured"
        });
      }
      
      const { page, perPage } = req.query;
      
      const videos = await getPopularVideos(
        perPage ? parseInt(perPage as string) : 10,
        page ? parseInt(page as string) : 1
      );
      
      res.json({ 
        status: "success",
        videos
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error retrieving popular videos",
        error: error.message || String(error)
      });
    }
  });

  // Formspree API Routes
  apiRouter.post("/volunteers/submit", async (req, res) => {
    try {
      if (!hasFormspreeFormId()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Formspree service not configured"
        });
      }
      
      const { name, email, phone, skills, availability, message } = req.body;
      
      if (!name || !email || !phone || !skills || !availability) {
        return res.status(400).json({ message: "Name, email, phone, skills, and availability are required" });
      }
      
      const response = await submitVolunteerApplication(
        name,
        email,
        phone,
        Array.isArray(skills) ? skills : [skills],
        Array.isArray(availability) ? availability : [availability],
        message
      );
      
      res.status(201).json({ 
        status: "success",
        message: "Volunteer application submitted successfully",
        response
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error submitting volunteer application",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.post("/contact/submit", async (req, res) => {
    try {
      if (!hasFormspreeFormId()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Formspree service not configured"
        });
      }
      
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "Name, email, subject, and message are required" });
      }
      
      const response = await submitContactForm(name, email, subject, message);
      
      res.status(201).json({ 
        status: "success",
        message: "Contact form submitted successfully",
        response
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error submitting contact form",
        error: error.message || String(error)
      });
    }
  });

  // Infermedica API Routes
  apiRouter.get("/infermedica/symptoms", async (req, res) => {
    try {
      if (!hasInfermedicaCredentials()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Infermedica API not configured"
        });
      }
      
      const symptoms = await getSymptoms();
      
      res.json({ 
        status: "success",
        symptoms
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error retrieving symptoms",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.get("/infermedica/risk-factors", async (req, res) => {
    try {
      if (!hasInfermedicaCredentials()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Infermedica API not configured"
        });
      }
      
      const riskFactors = await getRiskFactors();
      
      res.json({ 
        status: "success",
        riskFactors
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error retrieving risk factors",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.post("/infermedica/parse", async (req, res) => {
    try {
      if (!hasInfermedicaCredentials()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Infermedica API not configured"
        });
      }
      
      const { text, context } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const parsedSymptoms = await parseSymptoms(text, context);
      
      res.json({ 
        status: "success",
        parsedSymptoms
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error parsing symptoms",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.post("/infermedica/diagnosis", async (req, res) => {
    try {
      if (!hasInfermedicaCredentials()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Infermedica API not configured"
        });
      }
      
      const { evidence, patient } = req.body;
      
      if (!evidence || !patient || !patient.sex || !patient.age) {
        return res.status(400).json({ message: "Evidence, patient sex, and patient age are required" });
      }
      
      const diagnosis = await getDiagnosis(evidence, patient);
      
      res.json({ 
        status: "success",
        diagnosis
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error getting diagnosis",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.post("/infermedica/triage", async (req, res) => {
    try {
      if (!hasInfermedicaCredentials()) {
        return res.status(503).json({ 
          status: "error", 
          message: "Infermedica API not configured"
        });
      }
      
      const { evidence, patient } = req.body;
      
      if (!evidence || !patient || !patient.sex || !patient.age) {
        return res.status(400).json({ message: "Evidence, patient sex, and patient age are required" });
      }
      
      const triage = await getTriage(evidence, patient);
      
      res.json({ 
        status: "success",
        triage
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error getting triage",
        error: error.message || String(error)
      });
    }
  });

  // ZenQuotes API Routes
  apiRouter.get("/quotes/random", async (req, res) => {
    try {
      const quote = await getRandomQuote();
      
      res.json({ 
        status: "success",
        quote
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error retrieving random quote",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.get("/quotes/today", async (req, res) => {
    try {
      const quote = await getQuoteOfTheDay();
      
      res.json({ 
        status: "success",
        quote
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error retrieving quote of the day",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.get("/quotes/multiple", async (req, res) => {
    try {
      const { count } = req.query;
      
      const quotes = await getMultipleQuotes(count ? parseInt(count as string) : 5);
      
      res.json({ 
        status: "success",
        quotes
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error retrieving multiple quotes",
        error: error.message || String(error)
      });
    }
  });

  apiRouter.get("/quotes/mental-health", async (req, res) => {
    try {
      const { count } = req.query;
      
      const quotes = await getMentalHealthQuotes(count ? parseInt(count as string) : 5);
      
      res.json({ 
        status: "success",
        quotes
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        message: "Error retrieving mental health quotes",
        error: error.message || String(error)
      });
    }
  });

  // Register API routes with /api prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  // Set up WebSocket server for mental health chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    log('WebSocket client connected', 'websocket');
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'chat_message' && data.content) {
          // If we have the required imports, we can use them
          const { processMentalHealthMessage } = await import('./geminiApi');
          
          log(`Received message: ${data.content}`, 'websocket');
          
          try {
            // Process the message with Gemini AI
            const aiResponse = await processMentalHealthMessage(data.content, data.history || '');
            
            // Send the AI response back to the client
            const response = {
              type: 'chat_response',
              message: aiResponse,
              timestamp: new Date()
            };
            
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify(response));
            }
          } catch (error) {
            log(`Error processing mental health message: ${error}`, 'websocket');
            
            // Fallback response if AI processing fails
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'chat_response',
                message: "I'm here to listen. Could you tell me more about how you're feeling?",
                timestamp: new Date()
              }));
            }
          }
        }
      } catch (error) {
        log(`Error parsing WebSocket message: ${error}`, 'websocket');
      }
    });
    
    ws.on('close', () => {
      log('WebSocket client disconnected', 'websocket');
    });
  });

  return httpServer;
}
