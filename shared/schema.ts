import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("patient"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
});

// Healthcare providers schema
export const healthcareProviders = pgTable("healthcare_providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  specialty: text("specialty").notNull(),
  licenseNumber: text("license_number").notNull(),
  address: text("address"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  availableHours: jsonb("available_hours"),
  isVerified: boolean("is_verified").default(false),
});

export const insertHealthcareProviderSchema = createInsertSchema(healthcareProviders).pick({
  userId: true,
  specialty: true,
  licenseNumber: true,
  address: true,
  latitude: true,
  longitude: true,
  availableHours: true,
});

// Telemedicine appointments schema
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  providerId: integer("provider_id").references(() => healthcareProviders.id).notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  status: text("status").notNull().default("scheduled"),
  meetingLink: text("meeting_link"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  patientId: true,
  providerId: true,
  scheduledTime: true,
  notes: true,
});

// Community forum posts schema
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertForumPostSchema = createInsertSchema(forumPosts).pick({
  userId: true,
  title: true,
  content: true,
  tags: true,
});

// Comments on forum posts
export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => forumPosts.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertForumCommentSchema = createInsertSchema(forumComments).pick({
  postId: true,
  userId: true,
  content: true,
});

// Medication reminders schema
export const medicationReminders = pgTable("medication_reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  medicationName: text("medication_name").notNull(),
  dosage: text("dosage").notNull(),
  schedule: jsonb("schedule").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMedicationReminderSchema = createInsertSchema(medicationReminders).pick({
  userId: true,
  medicationName: true,
  dosage: true,
  schedule: true,
  startDate: true,
  endDate: true,
});

// Volunteer applications schema
export const volunteerApplications = pgTable("volunteer_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  skills: text("skills").array(),
  availability: jsonb("availability"),
  motivation: text("motivation").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVolunteerApplicationSchema = createInsertSchema(volunteerApplications).pick({
  userId: true,
  skills: true,
  availability: true,
  motivation: true,
});

// Health education content schema
export const educationContent = pgTable("education_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // article, video, etc.
  content: text("content"),
  mediaUrl: text("media_url"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEducationContentSchema = createInsertSchema(educationContent).pick({
  title: true,
  type: true,
  content: true,
  mediaUrl: true,
  tags: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type HealthcareProvider = typeof healthcareProviders.$inferSelect;
export type InsertHealthcareProvider = z.infer<typeof insertHealthcareProviderSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

export type ForumComment = typeof forumComments.$inferSelect;
export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;

export type MedicationReminder = typeof medicationReminders.$inferSelect;
export type InsertMedicationReminder = z.infer<typeof insertMedicationReminderSchema>;

export type VolunteerApplication = typeof volunteerApplications.$inferSelect;
export type InsertVolunteerApplication = z.infer<typeof insertVolunteerApplicationSchema>;

export type EducationContent = typeof educationContent.$inferSelect;
export type InsertEducationContent = z.infer<typeof insertEducationContentSchema>;
