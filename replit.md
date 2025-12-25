# Mentang² Trend - Meme Generator

## Overview

A meme/image generator web application that allows users to upload photos, add text overlays (top and bottom text), and download the generated images. The app follows the "Mentang-mentang" trend format, providing a simple two-step workflow: upload & write, then download.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts`
- **Validation**: Zod schemas for request/response validation

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit (`drizzle-kit push`)
- **Tables**: `images` table storing original/generated image URLs and text overlays

### Image Processing
- **Approach**: Client-side canvas rendering using HTML5 Canvas API
- **Component**: `MemeCanvas.tsx` handles image compositing with text overlays
- **Output Format**: JPEG data URLs stored in database

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI components including MemeCanvas
│       ├── hooks/        # Custom React hooks (use-images, use-toast)
│       ├── pages/        # Route components (Home, not-found)
│       └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API endpoint handlers
│   ├── storage.ts    # Database access layer
│   └── db.ts         # Drizzle database connection
├── shared/           # Shared types and schemas
│   ├── schema.ts     # Drizzle table definitions
│   └── routes.ts     # API route definitions with Zod schemas
└── migrations/       # Database migrations
```

### Key Design Decisions

1. **Shared Route Definitions**: API routes are defined once in `shared/routes.ts` with Zod schemas, ensuring type-safe API contracts between frontend and backend.

2. **Client-Side Image Generation**: Images are processed entirely in the browser using Canvas API to keep the bundle small and reduce server load.

3. **Data URI Storage**: Generated images are stored as data URIs in the database rather than file storage, simplifying deployment but limiting image size.

4. **Component Library**: shadcn/ui provides accessible, customizable components without adding heavy dependencies.

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **Radix UI**: Accessible component primitives (dialog, toast, tooltip, etc.)
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Frontend build and dev server
- **esbuild**: Server bundling for production
- **TypeScript**: Type checking across the stack

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string