# Mobile-First App with Supabase

A mobile-first application built with React Native/Expo and Supabase as the backend.

## Quick Start

### Prerequisites
- Node.js (version TBD)
- npm
- Expo CLI (installed globally: `npm install -g expo`)
- Supabase account and project

### Installation

```bash
# Dependencies are already installed
# If needed, reinstall:
npm install

# Start the development server
npm start

# Or run on specific platform:
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

### Environment Setup

1. Get your Supabase credentials from https://app.supabase.com
   - Go to your project → Settings → API
   - Copy the "Project URL" and "anon public" key
2. Create a `.env` file in the root directory:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: The `.env` file is already created. Just add your credentials to it.

## Project Status

🚧 **In Development** - Foundation phase

### Current Phase: Foundation
- [x] Project initialization (Expo with Expo Router)
- [x] TypeScript setup
- [x] Project structure
- [x] Supabase integration
- [x] Authentication flow
- [x] Homepage screen ("Hello World")
- [x] Basic navigation with auth guards
- [ ] Configure Supabase credentials
- [ ] Test authentication flow

## Features

### Phase 1 (Current)
- ✅ Email/Password authentication
- ✅ User registration
- ✅ User login
- ✅ Session management
- ✅ Protected routes
- ✅ Homepage with "Hello World"
- ✅ Supabase backend integration

### Future Features
- User profiles
- Data submission
- OAuth providers
- Additional screens

## Documentation

For detailed project information, architecture, and development notes, see [PROJECT.md](./PROJECT.md).

## Tech Stack

- **Frontend**: React Native / Expo
- **Backend**: Supabase (Auth, Database, API)
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router (file-based routing)
- **React**: 19.1.0
- **React Native**: 0.81.5
- **Expo SDK**: ~54.0.23

## Development

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web

# Lint code
npm run lint
```

## Project Structure

- `app/` - Expo Router file-based routing (screens)
- `components/` - Reusable UI components
- `constants/` - App constants and theme
- `hooks/` - Custom React hooks
- `services/` - API services and Supabase client (to be created)
- `types/` - TypeScript type definitions (to be created)
- `utils/` - Utility functions (to be created)
- `assets/` - Images, fonts, and other assets

## License

[To be determined]

