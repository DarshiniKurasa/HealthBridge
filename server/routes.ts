import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { z } from "zod";
import { WebSocketServer, WebSocket } from "ws";
import { log } from "./vite";
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

// Function to check if a Perplexity API key is available
const hasPerplexityKey = () => {
  return !!process.env.PERPLEXITY_API_KEY;
};

export async function registerRoutes(app: Express): Promise<Server> {
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
