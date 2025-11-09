# Mobile-First Application with Supabase

## Project Overview

A mobile-first application (not a website) built with Supabase as the backend. The app is designed with scalability and extensibility in mind, starting with foundational features and expanding to include multiple features over time.

## Tech Stack

### Frontend
- **Framework**: React Native / Expo (mobile-first)
- **Language**: TypeScript (strict mode enabled)
- **Navigation**: Expo Router (file-based routing)
- **React Version**: 19.1.0
- **React Native Version**: 0.81.5
- **Expo SDK**: ~54.0.23

### Backend
- **Backend Service**: Supabase
  - Authentication (Email/Password, OAuth providers optional)
  - Database (PostgreSQL via Supabase)
  - API (Supabase REST API / Realtime)

### Development Environment
- **Node.js**: (version to be specified)
- **Package Manager**: npm
- **Development Tools**: 
  - Expo CLI (installed globally)
  - Expo Router (file-based routing)
  - TypeScript with strict mode
  - ESLint configured

## Initial Features (Phase 1)

### 1. Authentication
- Email/password login system using Supabase Auth
- User registration
- Session management
- Protected routes/navigation
- **Future**: OAuth providers (Google, Apple, etc.)

### 2. Homepage
- Simple screen displaying "Hello World"
- Confirms app is running correctly
- Basic navigation structure

### 3. Backend Integration
- Supabase project setup
- Authentication integration
- Database schema design (scalable for future features)
- API connection verification

### 4. Project Structure
- Clean, maintainable architecture
- Scalable folder structure
- Separation of concerns
- Ready for feature expansion

## Future Features (To Be Implemented)

- User profiles
- Data submission forms
- Feature-specific screens
- Additional authentication methods (OAuth)
- Real-time features (if needed)
- Push notifications (if needed)

## Project Structure

```
ssb/
├── PROJECT.md (this file)
├── README.md
├── package.json
├── tsconfig.json (TypeScript config with strict mode)
├── app.json (Expo configuration)
├── eslint.config.js
├── app/                 # Expo Router file-based routing
│   ├── _layout.tsx      # Root layout
│   ├── (tabs)/          # Tab navigation group
│   │   ├── _layout.tsx
│   │   ├── index.tsx    # Home tab
│   │   └── explore.tsx  # Explore tab
│   └── modal.tsx        # Modal screen
├── components/          # Reusable UI components
│   ├── ui/              # UI components
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ...
├── constants/           # App constants
│   └── theme.ts
├── hooks/              # Custom React hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
├── services/           # API services, Supabase client (to be created)
│   ├── supabase.ts
│   └── auth.ts
├── types/              # TypeScript type definitions (to be created)
├── utils/              # Utility functions (to be created)
└── assets/             # Images, fonts, etc.
    └── images/
```

**Note**: Using Expo Router for file-based routing. Screens are defined in the `app/` directory. We'll create `services/`, `types/`, and `utils/` directories for Supabase integration.

## Supabase Configuration

### Required Setup
1. Create Supabase project
2. Configure authentication providers (Email/Password)
3. Set up database tables (initial schema)
4. Configure environment variables
5. Set up Row Level Security (RLS) policies

### Environment Variables

Configuration is handled via a `.env` file (single source of truth).

**Setup:**
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials to `.env`:
   ```bash
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

**How it works:**
- `app.config.js` reads from `.env` at build time
- Passes values to `expo.extra`
- `config.ts` reads from `expo-constants` at runtime
- **No need to update multiple files** - just `.env`!

**To get your Supabase credentials:**
1. Go to https://app.supabase.com
2. Create or select your project
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key
5. Add these values to your `.env` file

**Note**: The `.env` file is gitignored by default to keep your credentials secure.

## Development Goals

### Phase 1 (Current)
- [x] Set up project structure
- [x] Initialize React Native/Expo project
- [x] Install Supabase client library (`@supabase/supabase-js`)
- [x] Configure Supabase client (`services/supabase.ts`)
- [x] Create configuration file (`config.ts`)
- [x] Create `services/` directory with Supabase client configuration
- [x] Create `types/` directory for TypeScript definitions
- [x] Create auth service functions (login, register, logout, session)
- [x] Create authentication hook (`hooks/use-auth.ts`)
- [x] Implement authentication screens (Login/Register)
- [x] Replace default Homepage with "Hello World" screen
- [x] Set up protected routes/navigation guards
- [ ] Configure Supabase credentials in `.env` file
- [ ] Test authentication flow

### Phase 2 (Future)
- [ ] User profile management
- [ ] Additional screens
- [ ] Data submission features
- [ ] OAuth integration (optional)

## Architecture Principles

1. **Scalability**: Structure should accommodate future features without major refactoring
2. **Maintainability**: Clean code, clear separation of concerns, documentation
3. **Mobile-First**: All design decisions prioritize mobile experience
4. **Type Safety**: Use TypeScript for better development experience and fewer bugs
5. **Security**: Proper authentication, RLS policies, secure API calls

## Database Schema (Initial)

### Users Table (managed by Supabase Auth)
- Handled automatically by Supabase Auth
- Additional user metadata can be stored in `public.profiles` table

### Profiles Table (Future)
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Navigation Structure

### Current Setup
- Using **Expo Router** (file-based routing)
- Default tab navigation structure in `app/(tabs)/`
- Root layout in `app/_layout.tsx`

### Planned Flow
1. **Auth Stack**: Login/Register screens (to be created)
2. **Main Stack**: Home and other authenticated screens
3. Navigation guards to protect authenticated routes using Expo Router middleware

## Development Notes

- Use functional components with hooks
- Implement error handling for API calls
- Add loading states for async operations
- Follow React Native best practices
- Use environment variables for configuration
- Implement proper TypeScript types

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

## Next Steps

1. ✅ Initialize the project (Expo with Expo Router)
2. ✅ Install Supabase client library (`@supabase/supabase-js`)
3. ✅ Create configuration file (`config.ts`)
4. ✅ Create `services/` directory with Supabase client configuration
5. ✅ Create `types/` directory for TypeScript definitions
6. ✅ Implement authentication screens (Login/Register)
7. ✅ Replace default Homepage with "Hello World" screen
8. ✅ Set up protected routes using Expo Router middleware
9. ⏳ Set up Supabase project and get credentials
10. ⏳ Configure Supabase credentials in `.env` file
11. ⏳ Test and verify authentication flow

## Current Project Status

- ✅ Expo project initialized
- ✅ TypeScript configured with strict mode
- ✅ Expo Router set up with file-based routing
- ✅ Default tab navigation structure created
- ✅ Project structure established
- ✅ Supabase client library installed
- ✅ Supabase client configured (`services/supabase.ts`)
- ✅ Authentication service created (`services/auth.ts`)
- ✅ Authentication hook created (`hooks/use-auth.ts`)
- ✅ Authentication screens created (Login/Register)
- ✅ Home screen updated with "Hello World"
- ✅ Protected routes implemented
- ⏳ **Next**: Configure Supabase credentials and test

---

**Last Updated**: 2024-12-19
**Status**: Supabase Integration Complete → Ready for Configuration & Testing

