# HeyNidus - Real Estate Lot Commercialization Platform

## Overview

HeyNidus is a landing page and marketing website for a real estate company specializing in the commercialization of land lots in Argentina. The platform showcases both proprietary and third-party development projects, helping buyers and investors find suitable lots for living, investing, or developing. The application provides project information, blog content, testimonials, and contact functionality to connect potential buyers with real estate opportunities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (single-page application navigation)

**UI Component Library:**
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom theme configuration
- Design system follows "new-york" style variant with neutral base colors
- Component structure emphasizes accessibility and customization

**State Management:**
- React hooks (useState, useEffect) for local component state
- TanStack Query (React Query) for data fetching from API endpoints
- Form state managed with react-hook-form in admin pages

**Design Approach:**
- Landing page optimized for conversions
- Responsive mobile-first design
- Design inspiration from Stripe, Linear, and Vercel aesthetics
- Custom color scheme with emerald green as primary brand color
- Typography using system fonts with Inter as primary typeface

**Key Frontend Features:**
- Lazy loading for Blog and Testimonials components to improve initial load performance
- Image carousel/gallery functionality for project details
- Smooth scroll navigation between page sections
- Mobile-responsive navigation with hamburger menu
- Contact form with client-side validation

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for the HTTP server
- Separate development and production entry points (index-dev.ts, index-prod.ts)
- Custom logging middleware for API request tracking

**Development vs Production:**
- Development mode integrates Vite middleware for HMR and on-the-fly compilation
- Production mode serves pre-built static assets from dist/public directory
- Environment-specific build processes defined in package.json scripts

**API Structure:**
- RESTful API design pattern (routes prefixed with /api)
- Modular route registration system in routes.ts
- Projects CRUD endpoints: GET /api/projects/list, GET /api/projects/:id, POST /api/projects, PUT /api/projects/:id, DELETE /api/projects/:id
- File upload support with multer for project images, master plans and videos

**Storage Layer:**
- JSON file storage for projects (data/projects.json)
- File uploads stored in uploads/ directory
- In-memory storage implementation (MemStorage class) for users
- Prepared for database integration with Drizzle ORM configuration

### Data Storage Solutions

**Database Setup (Configured but Not Active):**
- Drizzle ORM configured for PostgreSQL with Neon serverless adapter
- Schema defined in shared/schema.ts with users table
- Migration system configured to output to ./migrations directory
- Connection expects DATABASE_URL environment variable

**Current Data Management:**
- Projects data stored in data/projects.json (dynamic, editable via admin)
- Blog posts and testimonials still in client/src/data/siteData.ts as static constants
- Project images, master plans, videos uploaded to uploads/ directory
- Static image assets in attached_assets directory for fallbacks

### Authentication and Authorization

**Current Implementation:**
- Basic admin password protection for /admin routes
- Admin password configured via ADMIN_PASSWORD environment variable (default: "admin123")
- Session-based authentication using express-session with memory store
- Admin pages protected with checkAdminAuth middleware

**Admin Features:**
- Unified admin panel at /admin with tabbed interface
- 4 main tabs: Estadísticas, Proyectos, Blog, Testimonios
- All CRUD operations in single Dashboard component
- File upload for images, master plan files, and videos
- Google Maps integration with lat/lng coordinates and place URLs
- Local theme toggle for dark/light mode preference

### External Dependencies

**Third-Party UI Libraries:**
- Radix UI component primitives (@radix-ui/* packages) for accessible headless components
- Lucide React for icon library
- React Icons for social media icons
- embla-carousel-react for image carousels
- date-fns for date formatting

**Development Tools:**
- TypeScript for type checking
- ESBuild for production server bundling
- PostCSS with Autoprefixer for CSS processing
- Tailwind CSS for styling

**Database & ORM:**
- @neondatabase/serverless for PostgreSQL connectivity
- Drizzle ORM for type-safe database queries
- drizzle-zod for schema validation

**Form Handling:**
- @hookform/resolvers for validation (installed but not used)
- react-hook-form available but contact form uses native React state

**Asset Management:**
- Static images stored in attached_assets directory
- Vite handles image imports with ?url suffix for proper asset URLs
- Generated images for projects, testimonials, and blog posts

**Replit Integration:**
- @replit/vite-plugin-runtime-error-modal for development error overlay
- @replit/vite-plugin-cartographer for code navigation
- @replit/vite-plugin-dev-banner for development environment indication

**Content Structure:**
- Project data includes name, type, location, description, images, development stage
- Blog content stored as static data with associated images
- Testimonial data includes author information and portrait images
- Social media links integrated in footer (Facebook, Instagram, TikTok, YouTube, WhatsApp)