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

// Blog types for JSON storage
export interface BlogPost {
  id: string;
  titulo: string;
  subtitulo: string;
  contenido: string;
  fecha: string;
  imagenes: string[];
  updatedAt: string;
}

export const insertBlogPostSchema = z.object({
  titulo: z.string().min(1, "Título requerido"),
  subtitulo: z.string().optional().default(""),
  contenido: z.string().min(1, "Contenido requerido"),
  fecha: z.string().optional(),
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// Testimonial types for JSON storage
export interface Testimonial {
  id: string;
  autor: string;
  rol: string;
  contenido: string;
  imagen: string;
  fecha: string;
  aprobado: boolean;
  updatedAt: string;
}

export const insertTestimonialSchema = z.object({
  autor: z.string().min(1, "Autor requerido"),
  rol: z.string().optional().default(""),
  contenido: z.string().min(1, "Contenido requerido"),
  aprobado: z.boolean().optional().default(false),
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  proyectoInteres: string;
  fuente: string;
  estado: 'nuevo' | 'contactado' | 'convertido' | 'descartado';
  createdAt: string;
  updatedAt: string;
}

export const insertLeadSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  telefono: z.string().optional().default(""),
  mensaje: z.string().optional().default(""),
  proyectoInteres: z.string().optional().default(""),
  fuente: z.string().optional().default("web"),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
