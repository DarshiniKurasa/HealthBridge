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
  type InsertEducationContent
} from "@shared/schema";

// Storage interface with all required methods
export interface IStorage {
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

// In-memory storage implementation
export class MemStorage implements IStorage {
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
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Healthcare provider methods
  async createHealthcareProvider(insertProvider: InsertHealthcareProvider): Promise<HealthcareProvider> {
    const id = this.currentId.providers++;
    const provider: HealthcareProvider = {
      ...insertProvider,
      id,
      isVerified: false
    };
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
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      status: "scheduled",
      meetingLink: `https://meet.google.com/generated-link-${id}`,
      createdAt: now
    };
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
    const post: ForumPost = {
      ...insertPost,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.forumPosts.set(id, post);
    return post;
  }

  async getAllForumPosts(): Promise<ForumPost[]> {
    return Array.from(this.forumPosts.values());
  }

  async createForumComment(insertComment: InsertForumComment): Promise<ForumComment> {
    const id = this.currentId.comments++;
    const now = new Date();
    const comment: ForumComment = {
      ...insertComment,
      id,
      createdAt: now
    };
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
    const reminder: MedicationReminder = {
      ...insertReminder,
      id,
      createdAt: now
    };
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
    const application: VolunteerApplication = {
      ...insertApplication,
      id,
      status: "pending",
      createdAt: now
    };
    this.volunteerApplications.set(id, application);
    return application;
  }

  // Education content methods
  async createEducationContent(insertContent: InsertEducationContent): Promise<EducationContent> {
    const id = this.currentId.content++;
    const now = new Date();
    const content: EducationContent = {
      ...insertContent,
      id,
      createdAt: now,
      updatedAt: now
    };
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

// Export storage instance
export const storage = new MemStorage();
