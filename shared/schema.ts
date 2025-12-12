import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Project types for JSON storage
export interface ProjectMaps {
  lat?: number;
  lng?: number;
  placeUrl?: string;
}

export interface Project {
  id: string;
  nombre: string;
  tipo: string;
  etapa: string;
  ubicacionTexto: string;
  descripcion: string;
  contenidoLargo: string;
  maps: ProjectMaps;
  linkLotes: string;
  masterPlanFiles: string[];
  imagenes: string[];
  videos: string[];
  caracteristicas: string[];
  servicios: string[];
  amenidades: string[];
  superficie: string;
  lotes: string;
  updatedAt: string;
}

export const insertProjectSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  tipo: z.string().min(1, "Tipo requerido"),
  etapa: z.string().min(1, "Etapa requerida"),
  ubicacionTexto: z.string().min(1, "Ubicación requerida"),
  descripcion: z.string().min(1, "Descripción requerida"),
  contenidoLargo: z.string().optional().default(""),
  maps: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    placeUrl: z.string().optional(),
  }).optional().default({}),
  linkLotes: z.string().optional().default(""),
  caracteristicas: z.array(z.string()).optional().default([]),
  servicios: z.array(z.string()).optional().default([]),
  amenidades: z.array(z.string()).optional().default([]),
  superficie: z.string().optional().default(""),
  lotes: z.string().optional().default(""),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
