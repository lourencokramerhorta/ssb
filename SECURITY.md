# Security & Environment Variables

## What's in `.env` and Where It Goes

### ✅ **SAFE - Never Exposed to App/Build:**

- **`SUPABASE_ACCESS_TOKEN`** (sbp_...)
  - **Purpose:** Only used locally for CLI commands (type generation)
  - **Exposed?** ❌ NO - Never included in app builds
  - **Location:** Only in `.env` (gitignored)
  - **Used by:** `GENERATE_TYPES.md` scripts only

### ⚠️ **Accessible in Built App (But Safe):**

- **`SUPABASE_URL`** 
  - **Purpose:** Your Supabase project URL
  - **Exposed?** ✅ YES - Included in app build via `expo.extra`
  - **Security:** This is **public information** (part of your public API endpoint)
  - **Risk:** None - Anyone can see your Supabase URL anyway

- **`SUPABASE_ANON_KEY`**
  - **Purpose:** Supabase anonymous/public key for client-side access
  - **Exposed?** ✅ YES - Included in app build via `expo.extra`
  - **Security:** This is **meant to be public** - it's called "anon" for a reason
  - **Risk:** Low - Protected by Row Level Security (RLS) policies in Supabase
  - **Note:** RLS policies in your database protect your data, not the key itself

## How It Works

1. **`.env` file** (gitignored, never committed)
   - Contains: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_ACCESS_TOKEN`

2. **`app.config.js`** (committed, but only reads from `.env`)
   - Reads `.env` at build time
   - Only exposes `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `expo.extra`
   - **Does NOT expose `SUPABASE_ACCESS_TOKEN`**

3. **Built app** (what users download)
   - Contains: `SUPABASE_URL` and `SUPABASE_ANON_KEY` (via `expo.extra`)
   - **Does NOT contain:** `SUPABASE_ACCESS_TOKEN`

## Security Best Practices

✅ **What's Protected:**
- `.env` file is gitignored - never committed
- Access token only used locally
- Database protected by RLS policies

✅ **What's Safe to Expose:**
- Supabase URL (public endpoint)
- Anon key (designed to be public, protected by RLS)

⚠️ **Important:**
- Always use Row Level Security (RLS) policies in Supabase
- Never use service role keys in client-side code
- The anon key is safe because RLS policies restrict what users can access

## Verifying Security

To check what's actually in your built app:
```bash
# Check what's in expo.extra (won't show .env values, but shows structure)
grep -r "expo.extra" app.config.js
```

Your `.env` file is protected by `.gitignore` and will never be committed to the repository.

