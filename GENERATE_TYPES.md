# Generate Supabase Types

This guide explains how to regenerate TypeScript types from your Supabase database schema.

**Security Note:** This file does NOT contain any tokens. All tokens are stored in `.env` which is gitignored and will never be committed to the repository.

## Quick Method (Using .env)

If you have `SUPABASE_ACCESS_TOKEN` and `SUPABASE_URL` in your `.env` file:

```bash
SUPABASE_ACCESS_TOKEN=$(grep SUPABASE_ACCESS_TOKEN .env | cut -d '=' -f2) \
PROJECT_ID=$(grep SUPABASE_URL .env | cut -d '/' -f3 | cut -d '.' -f1) \
npx supabase gen types typescript --project-id $PROJECT_ID > types/database.ts
```

**Note:** The `.env` file is gitignored, so your token and project details are safe.

## Alternative Methods

### Method 1: Supabase Dashboard (Easiest)

1. Go to your project settings: https://app.supabase.com
2. Navigate to Settings → API
3. Scroll down to "TypeScript types"
4. Copy the generated types
5. Paste into `types/database.ts`

### Method 2: CLI with Environment Variables

1. Get an access token from: https://app.supabase.com/account/tokens
2. Extract project ID from your Supabase URL (the part before `.supabase.co`)
3. Set environment variables:
   ```bash
   export SUPABASE_ACCESS_TOKEN=your_token_here
   export PROJECT_ID=your_project_id_here
   ```
4. Generate types:
   ```bash
   npx supabase gen types typescript --project-id $PROJECT_ID > types/database.ts
   ```

### Method 3: CLI with Inline Variables

```bash
SUPABASE_ACCESS_TOKEN=your_token_here \
PROJECT_ID=your_project_id_here \
npx supabase gen types typescript --project-id $PROJECT_ID > types/database.ts
```

## When to Regenerate

Regenerate types whenever you:
- Add new tables
- Modify table schemas (add/remove columns)
- Change column types
- Add new views or functions

## Getting Your Project ID

Your project reference ID can be extracted from your Supabase URL:
- URL format: `https://YOUR_PROJECT_ID.supabase.co`
- The project ID is the part before `.supabase.co`

You can also find it in your Supabase dashboard under Settings → General → Reference ID.
