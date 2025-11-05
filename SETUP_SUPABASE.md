# Setting Up Supabase (PostgreSQL) - Step by Step

## What is Supabase?
Supabase is an open-source Firebase alternative that provides:
- PostgreSQL database (500MB free)
- Auto-generated REST API
- Real-time subscriptions
- Authentication (if needed later)

## Step-by-Step Setup

### 1. Create a Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using:
   - GitHub (recommended - fastest)
   - Google
   - Email

### 2. Create a New Project

1. After logging in, click **"New Project"**
2. Fill in the project details:
   ```
   Name: wallhaven-crawler (or any name you like)
   Database Password: [Create a strong password - SAVE THIS!]
   Region: Choose closest to you (e.g., US East, EU West, etc.)
   Pricing Plan: Free
   ```
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be set up

### 3. Get Your API Credentials

1. Once the project is ready, go to **Settings** (gear icon on left sidebar)
2. Click **"API"** in the settings menu
3. You'll see:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon/public key: eyJhbGc............. (long string)
   ```
4. **Copy both of these** - you'll need them!

### 4. Create the Database Table

1. Click **"SQL Editor"** in the left sidebar (database icon)
2. Click **"New query"**
3. Copy the entire content from `setup-supabase.sql` file in this project
4. Paste it into the SQL Editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see: ✅ "Success. No rows returned"

### 5. Verify the Table

1. Click **"Table Editor"** in the left sidebar
2. You should see **"wallhaven_tags"** table listed
3. Click on it to see the columns (it will be empty for now)

### 6. Configure Your Project

1. Open the `.env` file in your project (copy from `.env.example` if not exists)
2. Add your credentials:
   ```env
   DATABASE_TYPE=supabase
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_KEY=eyJhbGc.............

   START_PAGE=1
   MAX_PAGES=5
   DELAY_MS=1000
   ```
3. Save the file

### 7. Test the Connection

Run the test script:
```bash
npm run test-db
```

You should see:
```
✅ Supabase connection successful!
Database is ready to use.
```

## Viewing Your Data

After running the crawler, view your data in Supabase:

1. Go to **Table Editor** → **wallhaven_tags**
2. You'll see all crawled tags with their information
3. You can:
   - Sort by any column
   - Filter data
   - Export to CSV
   - View individual records

## Supabase Dashboard Features

### Table Editor
- View and edit data visually
- Add/delete rows manually
- Export data

### SQL Editor
- Run custom queries
- Create indexes
- Modify schema

### API Docs
- Auto-generated REST API
- Copy-paste code examples
- Test API endpoints

## Common Issues & Solutions

### Issue: "Invalid API key"
**Solution:**
- Make sure you copied the `anon` key, not the `service_role` key
- Check for extra spaces in your `.env` file

### Issue: "Table does not exist"
**Solution:**
- Go to SQL Editor and run `setup-supabase.sql` again
- Check Table Editor to confirm table exists

### Issue: "Row level security policy"
**Solution:**
- By default, RLS is enabled but our SQL creates the table without it
- If you get RLS errors, go to Table Editor → wallhaven_tags → Settings → Disable RLS

## Free Tier Limits

- **Database size**: 500 MB
- **Projects**: 2 free projects
- **Bandwidth**: 5 GB
- **API requests**: 50,000 per month
- **Storage**: 1 GB

For this crawler, 500MB can store approximately **50,000+ tags** easily!

## Next Steps

Once Supabase is set up:
1. Run `npm run test-db` to verify connection
2. Run `npm run crawl` to start crawling
3. View results in Supabase Table Editor

## Resources

- Supabase Dashboard: https://app.supabase.com
- Supabase Docs: https://supabase.com/docs
- SQL Tutorial: https://supabase.com/docs/guides/database

---

✅ **You're all set!** Proceed to run the crawler or set up MongoDB as an alternative.
