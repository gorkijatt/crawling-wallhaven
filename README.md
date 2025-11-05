# Wallhaven Tags Crawler

A web crawler that extracts tags from [Wallhaven.cc](https://wallhaven.cc/tags) and saves them to a free online database (Supabase or MongoDB Atlas).

## Features

- 🎯 Crawls tags from Wallhaven.cc with pagination support
- 💾 Saves to **Supabase** (PostgreSQL) or **MongoDB Atlas**
- 🔄 Automatic upsert (updates existing tags, inserts new ones)
- ⏱️ Configurable delay between requests (respectful crawling)
- 📊 Captures tag metadata: name, creator, category, stats (submissions, views, favorites)

## Free Database Options

### Option 1: Supabase (Recommended) ✓

**Free Tier:**
- 500MB PostgreSQL database
- 2 free projects
- Built-in REST API
- Real-time subscriptions

**Setup:**
1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Go to SQL Editor and run the SQL from `setup-supabase.sql`
4. Copy your project URL and anon key from Settings → API

### Option 2: MongoDB Atlas

**Free Tier:**
- 512MB storage
- Shared cluster
- Good for flexible schemas

**Setup:**
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up and create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string

## Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd crawling-wallhaven
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
```

4. **Edit `.env` file:**

For Supabase:
```env
DATABASE_TYPE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

START_PAGE=1
MAX_PAGES=10
DELAY_MS=1000
```

For MongoDB:
```env
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=wallhaven

START_PAGE=1
MAX_PAGES=10
DELAY_MS=1000
```

5. **If using Supabase, create the table:**
   - Open Supabase Dashboard → SQL Editor
   - Copy and run the SQL from `setup-supabase.sql`

## Usage

Run the crawler:
```bash
npm run crawl
```

The crawler will:
1. Connect to your chosen database
2. Crawl pages starting from `START_PAGE`
3. Extract tag information (name, creator, stats, etc.)
4. Save/update tags in the database
5. Wait `DELAY_MS` milliseconds between requests

## Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_TYPE` | Choose 'supabase' or 'mongodb' | supabase |
| `START_PAGE` | First page to crawl | 1 |
| `MAX_PAGES` | Number of pages to crawl | 10 |
| `DELAY_MS` | Delay between requests (ms) | 1000 |

## Data Structure

Each tag record includes:
- `tag_id` - Unique tag identifier
- `tag_name` - Name of the tag
- `tag_url` - Full URL to the tag page
- `creator` - Username who created the tag
- `creator_url` - Link to creator's profile
- `created_date` - When the tag was created
- `category` - Tag category (e.g., "Anime & Manga")
- `submissions` - Number of submissions using this tag
- `views` - Number of views
- `favorites` - Number of favorites
- `crawled_at` - Timestamp when crawled
- `page_number` - Which page this tag was found on

## Example Output

```
🚀 Starting Wallhaven Tags Crawler
Configuration:
  - Database: supabase
  - Pages: 1 to 10
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
Total tags collected: 240
```

## Project Structure

```
crawling-wallhaven/
├── src/
│   ├── crawler.js           # Main crawler logic
│   └── database/
│       ├── supabase.js      # Supabase database connector
│       └── mongodb.js       # MongoDB database connector
├── .env.example             # Environment variables template
├── setup-supabase.sql       # SQL to create Supabase table
├── package.json             # Dependencies
└── README.md               # This file
```

## Tips

- Start with a small `MAX_PAGES` value (e.g., 2-3) to test
- Use `DELAY_MS=1000` or higher to be respectful to the server
- Both databases support automatic upserts (won't duplicate tags)
- Check your database dashboard to see collected data

## Troubleshooting

**"Missing Supabase credentials" error:**
- Make sure `.env` file exists and has correct values
- Check that SUPABASE_URL and SUPABASE_KEY are set

**"Table does not exist" warning:**
- Run the SQL from `setup-supabase.sql` in Supabase SQL Editor

**"No tags found" on page 1:**
- The website structure may have changed
- Check if Wallhaven is accessible from your location

**MongoDB connection errors:**
- Verify your IP is whitelisted in MongoDB Atlas
- Check that the connection string is correct
- Ensure database user has read/write permissions

## License

ISC
