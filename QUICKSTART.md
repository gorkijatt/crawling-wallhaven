# Quick Start Guide - Wallhaven Tags Crawler

Get started in 3 simple steps!

## Prerequisites

- Node.js installed (v16 or higher)
- A free database account (we'll set this up)

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `axios` - For HTTP requests
- `cheerio` - For HTML parsing
- `dotenv` - For environment variables
- `@supabase/supabase-js` - Supabase client
- `mongodb` - MongoDB driver

## Step 2: Choose & Setup Your Database

You can use **either** Supabase or MongoDB (or set up both!):

### Option A: Supabase (Recommended for Beginners)

1. **Follow the guide**: Read `SETUP_SUPABASE.md`
2. **Quick steps**:
   - Sign up at https://supabase.com
   - Create a new project
   - Run the SQL from `setup-supabase.sql` in SQL Editor
   - Get your URL and Key from Settings → API
3. **Configure**:
   ```bash
   cp .env.example .env
   # Edit .env and add your Supabase credentials
   ```

### Option B: MongoDB Atlas

1. **Follow the guide**: Read `SETUP_MONGODB.md`
2. **Quick steps**:
   - Sign up at https://mongodb.com/cloud/atlas
   - Create a free cluster (M0)
   - Create a database user
   - Whitelist your IP (or use 0.0.0.0/0)
   - Get your connection string
3. **Configure**:
   ```bash
   cp .env.example .env
   # Edit .env and add your MongoDB credentials
   ```

## Step 3: Test & Run

### Test Your Database Connection

```bash
npm run test-db
```

Expected output:
```
✅ Supabase connection test PASSED!
   You can now run: npm run crawl
```

or

```
✅ MongoDB connection test PASSED!
   You can now run: npm run crawl
```

### Run the Crawler

```bash
npm run crawl
```

The crawler will:
1. Connect to your database ✓
2. Crawl Wallhaven tags pages
3. Save tag data automatically
4. Show progress as it goes

Example output:
```
🚀 Starting Wallhaven Tags Crawler
Configuration:
  - Database: supabase
  - Pages: 1 to 5
  - Delay: 1000ms between requests
✓ Connected to supabase database

Crawling page 1: https://wallhaven.cc/tags/1
✓ Found 24 tags on page 1
✓ Saved 24 tags to database
Waiting 1000ms before next request...

Crawling page 2: https://wallhaven.cc/tags/2
✓ Found 24 tags on page 2
✓ Saved 24 tags to database
...

✅ Crawling completed!
Total tags collected: 120
```

## View Your Data

### Supabase
1. Go to https://app.supabase.com
2. Open your project
3. Click **Table Editor** → **wallhaven_tags**
4. Browse your collected tags!

### MongoDB
1. Go to https://cloud.mongodb.com
2. Click **Database** → **Browse Collections**
3. Select **wallhaven** → **wallhaven_tags**
4. View your tags as JSON documents!

## Configuration Options

Edit your `.env` file to customize:

```env
# Start from page 1
START_PAGE=1

# Crawl 10 pages (24 tags per page = ~240 tags)
MAX_PAGES=10

# Wait 1 second between requests (be respectful!)
DELAY_MS=1000
```

## Troubleshooting

### "npm: command not found"
**Install Node.js**: https://nodejs.org/

### "Missing SUPABASE_URL"
**Run**: `cp .env.example .env` and fill in your credentials

### "Authentication failed" (MongoDB)
- Check username/password in connection string
- Make sure `<password>` is replaced with your actual password
- URL encode special characters

### "Table does not exist" (Supabase)
- Go to SQL Editor in Supabase
- Run the SQL from `setup-supabase.sql`

### "No tags found"
- Check if Wallhaven.cc is accessible
- The site structure may have changed
- Try accessing https://wallhaven.cc/tags/1 in your browser

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run test-db` | Test database connection |
| `npm run crawl` | Run the crawler |

## What Data Gets Collected?

For each tag, we collect:
- Tag name and ID
- Tag URL
- Creator name and URL
- Creation date
- Category (e.g., "Anime & Manga")
- Stats: submissions, views, favorites
- Crawl timestamp
- Page number where found

## Free Tier Limits

Both databases have generous free tiers:

| Feature | Supabase | MongoDB Atlas |
|---------|----------|---------------|
| Storage | 500 MB | 512 MB |
| Capacity | ~50,000 tags | ~50,000-100,000 tags |
| Projects | 2 free | 1 free cluster |
| Bandwidth | 5 GB/month | Unlimited |

You're unlikely to hit these limits with tag crawling!

## Next Steps

- **Crawl more pages**: Increase `MAX_PAGES` in `.env`
- **Schedule crawling**: Set up a cron job to run daily
- **Export data**: Use database dashboard to export to CSV/JSON
- **Build an API**: Use Supabase's auto-generated REST API
- **Add analytics**: Query your data to find popular tags

## Need Help?

1. **Detailed setup guides**:
   - `SETUP_SUPABASE.md` - Supabase setup with screenshots instructions
   - `SETUP_MONGODB.md` - MongoDB Atlas setup guide

2. **Test your setup**: `npm run test-db`

3. **Check your config**: Make sure `.env` has correct values

4. **Read error messages**: The test script provides helpful tips

---

🎉 **Happy Crawling!**

Start collecting Wallhaven tags and build your own tag database in minutes!
