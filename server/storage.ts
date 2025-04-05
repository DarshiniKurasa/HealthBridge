import {
  users,
  type User,
  type InsertUser,
  type HealthcareProvider,
  type InsertHealthcareProvider,
  type Appointment,
  type InsertAppointment,
  type ForumPost,
  type InsertForumPost,
  type ForumComment,
  type InsertForumComment,
  type MedicationReminder,
  type InsertMedicationReminder,
  type VolunteerApplication,
  type InsertVolunteerApplication,
  type EducationContent,
  type InsertEducationContent,
  healthcareProviders, 
  appointments, 
  forumPosts, 
  forumComments, 
  medicationReminders, 
  volunteerApplications,
  educationContent
} from "@shared/schema";
import session from "express-session";
import { Store } from "express-session";
import { db, pool } from "./db";
import { eq, and } from "drizzle-orm";
import pg from "pg";

// Session store imports
import createMemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
const MemoryStore = createMemoryStore(session);
const PgSession = connectPgSimple(session);

// Storage interface with all required methods
export interface IStorage {
  // Session store
  sessionStore: Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Healthcare provider methods
  createHealthcareProvider(provider: InsertHealthcareProvider): Promise<HealthcareProvider>;
  getHealthcareProvider(id: number): Promise<HealthcareProvider | undefined>;
  getAllHealthcareProviders(): Promise<HealthcareProvider[]>;
  
  // Appointment methods
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getUserAppointments(userId: number): Promise<Appointment[]>;
  
  // Forum methods
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getAllForumPosts(): Promise<ForumPost[]>;
  createForumComment(comment: InsertForumComment): Promise<ForumComment>;
  getPostComments(postId: number): Promise<ForumComment[]>;
  
  // Medication reminder methods
  createMedicationReminder(reminder: InsertMedicationReminder): Promise<MedicationReminder>;
  getUserMedicationReminders(userId: number): Promise<MedicationReminder[]>;
  
  // Volunteer methods
  createVolunteerApplication(application: InsertVolunteerApplication): Promise<VolunteerApplication>;
  
  // Education content methods
  createEducationContent(content: InsertEducationContent): Promise<EducationContent>;
  getAllEducationContent(): Promise<EducationContent[]>;
  getEducationContentByType(type: string): Promise<EducationContent[]>;
  
  // Emergency methods
  createEmergencyAlert(data: { userId: number; location: any }): Promise<{ id: number }>;
}

// In-memory storage implementation with session store for auth
export class MemStorage implements IStorage {
  sessionStore: Store;
  
  private users: Map<number, User>;
  private healthcareProviders: Map<number, HealthcareProvider>;
  private appointments: Map<number, Appointment>;
  private forumPosts: Map<number, ForumPost>;
  private forumComments: Map<number, ForumComment>;
  private medicationReminders: Map<number, MedicationReminder>;
  private volunteerApplications: Map<number, VolunteerApplication>;
  private educationContent: Map<number, EducationContent>;
  private emergencyAlerts: Map<number, any>;
  
  private currentId: {
    users: number;
    providers: number;
    appointments: number;
    posts: number;
    comments: number;
    reminders: number;
    applications: number;
    content: number;
    emergencies: number;
  };

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    this.users = new Map();
    this.healthcareProviders = new Map();
    this.appointments = new Map();
    this.forumPosts = new Map();
    this.forumComments = new Map();
    this.medicationReminders = new Map();
    this.volunteerApplications = new Map();
    this.educationContent = new Map();
    this.emergencyAlerts = new Map();
    
    this.currentId = {
      users: 1,
      providers: 1,
      appointments: 1,
      posts: 1,
      comments: 1,
      reminders: 1,
      applications: 1,
      content: 1,
      emergencies: 1
    };
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const now = new Date();
    const user = { 
      ...insertUser, 
      id,
      createdAt: now
    } as User;
    this.users.set(id, user);
    return user;
  }

  // Healthcare provider methods
  async createHealthcareProvider(insertProvider: InsertHealthcareProvider): Promise<HealthcareProvider> {
    const id = this.currentId.providers++;
    const provider = {
      ...insertProvider,
      id,
      isVerified: false as boolean,
      address: insertProvider.address || null,
      latitude: insertProvider.latitude || null,
      longitude: insertProvider.longitude || null,
      availableHours: insertProvider.availableHours || null
    } as HealthcareProvider;
    this.healthcareProviders.set(id, provider);
    return provider;
  }

  async getHealthcareProvider(id: number): Promise<HealthcareProvider | undefined> {
    return this.healthcareProviders.get(id);
  }

  async getAllHealthcareProviders(): Promise<HealthcareProvider[]> {
    return Array.from(this.healthcareProviders.values());
  }

  // Appointment methods
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentId.appointments++;
    const now = new Date();
    const appointment = {
      ...insertAppointment,
      id,
      status: "scheduled",
      meetingLink: `https://meet.google.com/generated-link-${id}`,
      createdAt: now,
      notes: insertAppointment.notes || null
    } as Appointment;
    this.appointments.set(id, appointment);
    return appointment;
  }

  async getUserAppointments(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.patientId === userId || 
                       this.healthcareProviders.get(appointment.providerId)?.userId === userId
    );
  }

  // Forum methods
  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const id = this.currentId.posts++;
    const now = new Date();
    const post = {
      ...insertPost,
      id,
      createdAt: now,
      updatedAt: now,
      tags: insertPost.tags || null
    } as ForumPost;
    this.forumPosts.set(id, post);
    return post;
  }

  async getAllForumPosts(): Promise<ForumPost[]> {
    return Array.from(this.forumPosts.values());
  }

  async createForumComment(insertComment: InsertForumComment): Promise<ForumComment> {
    const id = this.currentId.comments++;
    const now = new Date();
    const comment = {
      ...insertComment,
      id,
      createdAt: now
    } as ForumComment;
    this.forumComments.set(id, comment);
    return comment;
  }

  async getPostComments(postId: number): Promise<ForumComment[]> {
    return Array.from(this.forumComments.values()).filter(
      (comment) => comment.postId === postId
    );
  }

  // Medication reminder methods
  async createMedicationReminder(insertReminder: InsertMedicationReminder): Promise<MedicationReminder> {
    const id = this.currentId.reminders++;
    const now = new Date();
    const reminder = {
      ...insertReminder,
      id,
      createdAt: now,
      endDate: insertReminder.endDate || null
    } as MedicationReminder;
    this.medicationReminders.set(id, reminder);
    return reminder;
  }

  async getUserMedicationReminders(userId: number): Promise<MedicationReminder[]> {
    return Array.from(this.medicationReminders.values()).filter(
      (reminder) => reminder.userId === userId
    );
  }

  // Volunteer methods
  async createVolunteerApplication(insertApplication: InsertVolunteerApplication): Promise<VolunteerApplication> {
    const id = this.currentId.applications++;
    const now = new Date();
    const application = {
      ...insertApplication,
      id,
      status: "pending",
      createdAt: now,
      skills: insertApplication.skills || null,
      availability: insertApplication.availability || null
    } as VolunteerApplication;
    this.volunteerApplications.set(id, application);
    return application;
  }

  // Education content methods
  async createEducationContent(insertContent: InsertEducationContent): Promise<EducationContent> {
    const id = this.currentId.content++;
    const now = new Date();
    const content = {
      ...insertContent,
      id,
      createdAt: now,
      updatedAt: now,
      content: insertContent.content || null,
      tags: insertContent.tags || null,
      mediaUrl: insertContent.mediaUrl || null
    } as EducationContent;
    this.educationContent.set(id, content);
    return content;
  }

  async getAllEducationContent(): Promise<EducationContent[]> {
    return Array.from(this.educationContent.values());
  }

  async getEducationContentByType(type: string): Promise<EducationContent[]> {
    return Array.from(this.educationContent.values()).filter(
      (content) => content.type === type
    );
  }

  // Emergency methods
  async createEmergencyAlert(data: { userId: number; location: any }): Promise<{ id: number }> {
    const id = this.currentId.emergencies++;
    const now = new Date();
    
    const emergencyAlert = {
      id,
      userId: data.userId,
      location: data.location,
      status: "active",
      createdAt: now
    };
    
    this.emergencyAlerts.set(id, emergencyAlert);
    return { id };
  }
}

// Database implementation
export class DatabaseStorage implements IStorage {
  sessionStore: Store;

  constructor() {
    this.sessionStore = new PgSession({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Healthcare provider methods
  async createHealthcareProvider(provider: InsertHealthcareProvider): Promise<HealthcareProvider> {
    const [newProvider] = await db.insert(healthcareProviders).values(provider).returning();
    return newProvider;
  }

  async getHealthcareProvider(id: number): Promise<HealthcareProvider | undefined> {
    const [provider] = await db.select().from(healthcareProviders).where(eq(healthcareProviders.id, id));
    return provider;
  }

  async getAllHealthcareProviders(): Promise<HealthcareProvider[]> {
    return await db.select().from(healthcareProviders);
  }

  // Appointment methods
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async getUserAppointments(userId: number): Promise<Appointment[]> {
    // Get patient appointments
    const patientAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.patientId, userId));

    // Get provider appointments (if the user is a provider)
    const userProviders = await db
      .select()
      .from(healthcareProviders)
      .where(eq(healthcareProviders.userId, userId));
    
    if (userProviders.length === 0) {
      return patientAppointments;
    }

    const providerIds = userProviders.map(provider => provider.id);
    const providerAppointments = await Promise.all(
      providerIds.map(providerId => 
        db.select().from(appointments).where(eq(appointments.providerId, providerId))
      )
    );

    return [...patientAppointments, ...providerAppointments.flat()];
  }

  // Forum methods
  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await db.insert(forumPosts).values(post).returning();
    return newPost;
  }

  async getAllForumPosts(): Promise<ForumPost[]> {
    return await db.select().from(forumPosts);
  }

  async createForumComment(comment: InsertForumComment): Promise<ForumComment> {
    const [newComment] = await db.insert(forumComments).values(comment).returning();
    return newComment;
  }

  async getPostComments(postId: number): Promise<ForumComment[]> {
    return await db.select().from(forumComments).where(eq(forumComments.postId, postId));
  }

  // Medication reminder methods
  async createMedicationReminder(reminder: InsertMedicationReminder): Promise<MedicationReminder> {
    const [newReminder] = await db.insert(medicationReminders).values(reminder).returning();
    return newReminder;
  }

  async getUserMedicationReminders(userId: number): Promise<MedicationReminder[]> {
    return await db.select().from(medicationReminders).where(eq(medicationReminders.userId, userId));
  }

  // Volunteer methods
  async createVolunteerApplication(application: InsertVolunteerApplication): Promise<VolunteerApplication> {
    const [newApplication] = await db.insert(volunteerApplications).values(application).returning();
    return newApplication;
  }

  // Education content methods
  async createEducationContent(content: InsertEducationContent): Promise<EducationContent> {
    const [newContent] = await db.insert(educationContent).values(content).returning();
    return newContent;
  }

  async getAllEducationContent(): Promise<EducationContent[]> {
    return await db.select().from(educationContent);
  }

  async getEducationContentByType(type: string): Promise<EducationContent[]> {
    return await db.select().from(educationContent).where(eq(educationContent.type, type));
  }

  // Emergency methods
  async createEmergencyAlert(data: { userId: number; location: any }): Promise<{ id: number }> {
    // In a real implementation, this would insert into an emergency_alerts table
    // For now, we'll just return a mock ID since this isn't part of our schema yet
    return { id: Math.floor(Math.random() * 10000) + 1 };
  }
}

// Export storage instance 
// Using DatabaseStorage with Postgres
export const storage = new DatabaseStorage();
