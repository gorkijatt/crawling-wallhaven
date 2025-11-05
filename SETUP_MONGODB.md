# Setting Up MongoDB Atlas - Step by Step

## What is MongoDB Atlas?
MongoDB Atlas is a cloud-based NoSQL database service that provides:
- 512MB free storage
- Shared cluster (free tier)
- Flexible document-based structure
- Built-in backup and monitoring

## Step-by-Step Setup

### 1. Create a MongoDB Account

1. Go to **https://www.mongodb.com/cloud/atlas/register**
2. Sign up using:
   - Google (recommended - fastest)
   - GitHub
   - Email
3. Fill in basic information if prompted

### 2. Create a Free Cluster

1. After logging in, you'll see "Create" or "Build a Database"
2. Click **"Build a Database"**
3. Choose the **FREE** tier (M0 Sandbox):
   ```
   ✅ Shared (FREE)
   - 512 MB storage
   - Shared RAM
   - No credit card required
   ```
4. Configure your cluster:
   ```
   Cloud Provider: AWS, Google Cloud, or Azure (choose any)
   Region: Choose closest to you (e.g., us-east-1, eu-west-1)
   Cluster Name: Cluster0 (or rename it to "wallhaven")
   ```
5. Click **"Create Cluster"** (bottom right)
6. Wait 1-3 minutes for cluster creation

### 3. Set Up Database Access (Create User)

1. You'll see a "Security Quickstart" screen, or click **"Database Access"** in left sidebar under SECURITY
2. Click **"Add New Database User"** or **"ADD NEW DATABASE USER"**
3. Choose **"Password"** authentication
4. Fill in:
   ```
   Username: wallhaven_user (or any username)
   Password: [Create a strong password - SAVE THIS!]

   Or click "Autogenerate Secure Password" and save it
   ```
5. Database User Privileges: Select **"Read and write to any database"**
6. Click **"Add User"**

### 4. Set Up Network Access (Allow Your IP)

1. Click **"Network Access"** in left sidebar under SECURITY
2. Click **"Add IP Address"**
3. You have two options:

   **Option A: Allow Your Current IP** (More Secure)
   ```
   - Click "Add Current IP Address"
   - Your IP will be automatically detected
   - Click "Confirm"
   ```

   **Option B: Allow Access from Anywhere** (Easier, Less Secure)
   ```
   - Click "Allow Access from Anywhere"
   - IP Address: 0.0.0.0/0 (will be auto-filled)
   - Click "Confirm"
   ```

   ⚠️ **Note**: Option B is fine for testing but less secure for production

4. Wait for status to change from "Pending" to "Active" (30 seconds)

### 5. Get Your Connection String

1. Click **"Database"** in the left sidebar (under DEPLOYMENT)
2. Click **"Connect"** button next to your cluster name
3. Choose **"Drivers"**
4. Select:
   ```
   Driver: Node.js
   Version: 5.5 or later (latest)
   ```
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://wallhaven_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **IMPORTANT**: Replace `<password>` with your actual password!

### 6. Configure Your Project

1. Open the `.env` file in your project (copy from `.env.example` if not exists)
2. Add your credentials:
   ```env
   DATABASE_TYPE=mongodb
   MONGODB_URI=mongodb+srv://wallhaven_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DATABASE=wallhaven

   START_PAGE=1
   MAX_PAGES=5
   DELAY_MS=1000
   ```
3. Make sure to replace:
   - `YOUR_PASSWORD` with your actual password
   - The cluster URL with your actual cluster URL
4. Save the file

### 7. Test the Connection

Run the test script:
```bash
npm run test-db
```

You should see:
```
✅ MongoDB connection successful!
✓ Connected to MongoDB database: wallhaven
Database is ready to use.
```

## Viewing Your Data

After running the crawler, view your data in MongoDB Atlas:

### Using Atlas Dashboard

1. Go to **Database** → **Browse Collections**
2. Select your database: **wallhaven**
3. Select collection: **wallhaven_tags**
4. You'll see all your crawled tags as JSON documents

### Using MongoDB Compass (Optional Desktop App)

1. Download: https://www.mongodb.com/try/download/compass
2. Install and open Compass
3. Paste your connection string
4. Browse your data visually

## MongoDB Atlas Dashboard Features

### Collections Tab
- View documents as JSON
- Add/edit/delete documents
- Search and filter

### Metrics
- Monitor database performance
- View connection stats
- Track storage usage

### Backup
- Free automated backups
- Point-in-time restore

## Connection String Format Explained

```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database?options
           ↑          ↑           ↑                            ↑       ↑
        username   password   cluster address            database  options
```

**Common mistakes:**
- ❌ Forgetting to replace `<password>` with actual password
- ❌ Password contains special characters (`, @, :, /`) - must be URL encoded
- ❌ Spaces in password or username
- ❌ Wrong cluster address

**If your password has special characters:**
- Use URL encoding: `@` becomes `%40`, `#` becomes `%23`, etc.
- Or create a new user with a simple password (letters and numbers only)

## Common Issues & Solutions

### Issue: "Authentication failed"
**Solution:**
- Check username and password are correct
- Make sure you replaced `<password>` in connection string
- URL encode special characters in password

### Issue: "Connection timeout" or "Could not connect"
**Solution:**
- Check Network Access settings (IP whitelist)
- Try adding `0.0.0.0/0` to allow all IPs
- Make sure cluster is active (green status)

### Issue: "MongoServerError: bad auth"
**Solution:**
- Create a new database user
- Make sure user has "Read and write to any database" permission
- Wait 1-2 minutes after creating user

### Issue: "Database name is required"
**Solution:**
- Make sure `MONGODB_DATABASE=wallhaven` is in your `.env` file

## Free Tier Limits

- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: Unlimited
- **Backups**: Basic automated
- **Clusters**: 1 free cluster per project

512MB can store approximately **50,000-100,000 tags** depending on data size!

## Data Structure in MongoDB

Each tag is stored as a document:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "tag_id": "123",
  "tag_name": "anime",
  "tag_url": "https://wallhaven.cc/tag/123",
  "creator": "username",
  "creator_url": "https://wallhaven.cc/user/username",
  "created_date": "2 weeks ago",
  "category": "Anime & Manga",
  "submissions": "1234",
  "views": "56789",
  "favorites": "890",
  "crawled_at": "2025-11-05T10:30:00.000Z",
  "page_number": 1
}
```

## Next Steps

Once MongoDB is set up:
1. Run `npm run test-db` to verify connection
2. Run `npm run crawl` to start crawling
3. View results in Atlas Dashboard → Browse Collections

## Resources

- MongoDB Atlas Dashboard: https://cloud.mongodb.com
- MongoDB Docs: https://www.mongodb.com/docs/atlas/
- Connection String Guide: https://www.mongodb.com/docs/manual/reference/connection-string/

## Switching Between Databases

You can switch between Supabase and MongoDB anytime:

**To use MongoDB:**
```env
DATABASE_TYPE=mongodb
```

**To use Supabase:**
```env
DATABASE_TYPE=supabase
```

Just change this in your `.env` file and run the crawler!

---

✅ **You're all set!** Proceed to run the crawler or test your connection.
