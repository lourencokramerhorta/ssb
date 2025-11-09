# Project Structure Guide

This document explains the overall structure of the mobile app project.

## 📁 Directory Overview

```
ssb/
├── app/                    # 🎯 Expo Router - File-based routing (SCREENS)
├── components/             # 🧩 Reusable UI components
├── constants/              # 📐 App-wide constants (theme, colors, etc.)
├── hooks/                  # 🪝 Custom React hooks
├── assets/                 # 🖼️ Images, fonts, and static files
├── services/               # 🔌 API services (Supabase - to be created)
├── types/                  # 📝 TypeScript type definitions (to be created)
├── utils/                  # 🛠️ Utility functions (to be created)
├── scripts/                # 📜 Build/utility scripts
├── node_modules/           # 📦 Dependencies (auto-generated)
├── package.json            # 📋 Project dependencies and scripts
├── tsconfig.json           # ⚙️ TypeScript configuration
├── app.json                # ⚙️ Expo configuration
├── eslint.config.js        # ⚙️ ESLint configuration
├── PROJECT.md              # 📚 Detailed project documentation
└── README.md               # 📚 Quick start guide
```

---

## 🎯 The `app/` Directory - Expo Router (File-Based Routing)

**This is the heart of your app navigation!** Expo Router uses file-based routing, meaning the file structure directly maps to your app's navigation structure.

```
app/
├── _layout.tsx          # Root layout - wraps entire app
├── (tabs)/              # Tab navigation group (parentheses = route group)
│   ├── _layout.tsx      # Tab layout configuration
│   ├── index.tsx        # Home tab (default route)
│   └── explore.tsx      # Explore tab
└── modal.tsx            # Modal screen (accessible from anywhere)
```

### How It Works:

1. **`_layout.tsx`** (Root Layout)
   - The top-level layout that wraps your entire app
   - Sets up theme, navigation stack, and global providers
   - Currently configures a Stack navigator with tabs and modal

2. **`(tabs)/`** - Route Group
   - Parentheses `()` create a route group (doesn't affect URL)
   - Contains your tab navigation structure
   - `_layout.tsx` inside defines the tab bar with Home and Explore tabs
   - `index.tsx` = Home tab (the default tab)
   - `explore.tsx` = Explore tab

3. **`modal.tsx`**
   - A modal screen that can be opened from anywhere
   - Configured in root layout to present as a modal

### File-Based Routing Rules:
- `index.tsx` = default route for that directory
- `_layout.tsx` = layout wrapper for that directory
- `(folder)` = route group (doesn't appear in URL)
- File name = route name (e.g., `modal.tsx` → `/modal`)

---

## 🧩 The `components/` Directory

Reusable UI components that can be used across your app.

```
components/
├── ui/                   # UI component library
│   ├── collapsible.tsx
│   ├── icon-symbol.tsx
│   └── icon-symbol.ios.tsx
├── themed-text.tsx      # Text component with theme support
├── themed-view.tsx      # View component with theme support
├── hello-wave.tsx       # Example animated component
├── haptic-tab.tsx       # Tab button with haptic feedback
├── parallax-scroll-view.tsx  # Parallax scrolling component
└── external-link.tsx    # External link component
```

**Usage**: Import these components in your screens to build UI.

---

## 📐 The `constants/` Directory

App-wide constants and configuration values.

```
constants/
└── theme.ts             # Theme colors, spacing, typography
```

**Usage**: Store colors, API endpoints, app configuration, etc.

---

## 🪝 The `hooks/` Directory

Custom React hooks for reusable logic.

```
hooks/
├── use-color-scheme.ts      # Detects light/dark mode
├── use-color-scheme.web.ts  # Web-specific color scheme
└── use-theme-color.ts       # Gets theme colors
```

**Usage**: Create custom hooks for authentication, data fetching, etc.

---

## 🖼️ The `assets/` Directory

Static files like images, fonts, and icons.

```
assets/
└── images/
    ├── icon.png              # App icon
    ├── splash-icon.png       # Splash screen icon
    ├── react-logo.png        # Example images
    └── ...                   # Other images
```

**Usage**: Store all static assets here.

---

## 🔌 The `services/` Directory (To Be Created)

API services and external integrations.

```
services/
├── supabase.ts          # Supabase client configuration
└── auth.ts              # Authentication service functions
```

**Usage**: This is where we'll set up Supabase client and auth functions.

---

## 📝 The `types/` Directory (To Be Created)

TypeScript type definitions.

```
types/
├── auth.ts              # Authentication types
├── database.ts          # Database schema types
└── index.ts             # Re-export all types
```

**Usage**: Define TypeScript interfaces and types for better type safety.

---

## 🛠️ The `utils/` Directory (To Be Created)

Utility functions and helpers.

```
utils/
├── validation.ts        # Form validation helpers
└── formatting.ts        # Data formatting functions
```

**Usage**: Helper functions used across the app.

---

## ⚙️ Configuration Files

### `package.json`
- Lists all dependencies (React Native, Expo, etc.)
- Defines npm scripts (`npm start`, `npm run ios`, etc.)

### `tsconfig.json`
- TypeScript configuration
- Path aliases (e.g., `@/` maps to root directory)

### `app.json`
- Expo app configuration
- App name, icon, splash screen, plugins, etc.

### `eslint.config.js`
- Code linting rules

---

## 🔄 How It All Works Together

### Navigation Flow:
1. **App starts** → `app/_layout.tsx` (Root Layout)
2. **Root Layout** → Sets up Stack navigator
3. **Stack** → Contains `(tabs)` group and `modal` screen
4. **Tabs Layout** → `app/(tabs)/_layout.tsx` creates tab bar
5. **Tab Screens** → `index.tsx` (Home) and `explore.tsx` (Explore)

### Component Usage:
- Screens in `app/` import components from `components/`
- Components use hooks from `hooks/`
- Hooks use constants from `constants/`
- Services (when created) will be imported by screens/hooks

### Example: Home Screen Flow
```
app/(tabs)/index.tsx
  ↓ imports
components/themed-text.tsx
  ↓ uses
hooks/use-color-scheme.ts
  ↓ uses
constants/theme.ts
```

---

## 🎯 What We'll Add Next

1. **`services/supabase.ts`** - Supabase client setup
2. **`services/auth.ts`** - Authentication functions
3. **`types/`** - TypeScript definitions for Supabase
4. **`app/(auth)/`** - Authentication screens (login, register)
5. **`app/(tabs)/index.tsx`** - Replace with "Hello World" screen
6. **`.env`** - Environment variables for Supabase credentials

---

## 📚 Key Concepts

### Expo Router (File-Based Routing)
- Files in `app/` automatically become routes
- No need to manually configure routes
- Similar to Next.js routing

### Route Groups `(folder)`
- Parentheses create groups that don't affect URLs
- Useful for organizing routes (tabs, auth, etc.)

### Layouts `_layout.tsx`
- Wraps child routes
- Can have nested layouts
- Perfect for navigation structure

### TypeScript
- Type safety throughout the app
- Better IDE support
- Catches errors early

---

## 🚀 Next Steps

1. Install Supabase client library
2. Create `services/` directory with Supabase setup
3. Create authentication screens in `app/(auth)/`
4. Replace Home screen with "Hello World"
5. Set up protected routes

---

**Last Updated**: 2024-12-19

