import dotenv from 'dotenv';
import { SupabaseDB } from './database/supabase.js';
import { MongoDB } from './database/mongodb.js';

dotenv.config();

console.log('🧪 Testing Database Connection...\n');

const dbType = process.env.DATABASE_TYPE || 'supabase';
console.log(`Database Type: ${dbType}`);
console.log('━'.repeat(50));

async function testSupabase() {
  console.log('\n📊 Testing Supabase Connection...\n');

  // Check environment variables
  if (!process.env.SUPABASE_URL) {
    console.error('❌ Missing SUPABASE_URL in .env file');
    console.log('   Please add: SUPABASE_URL=https://your-project.supabase.co');
    return false;
  }

  if (!process.env.SUPABASE_KEY) {
    console.error('❌ Missing SUPABASE_KEY in .env file');
    console.log('   Please add: SUPABASE_KEY=your-anon-key');
    return false;
  }

  console.log('✓ Environment variables found');
  console.log(`  SUPABASE_URL: ${process.env.SUPABASE_URL}`);
  console.log(`  SUPABASE_KEY: ${process.env.SUPABASE_KEY.substring(0, 20)}...`);

  try {
    const db = new SupabaseDB();
    await db.connect();
    console.log('\n✓ Connected to Supabase successfully!');

    // Test if we can query the table
    const count = await db.getTagsCount();
    console.log(`✓ Table query successful`);
    console.log(`  Current tags in database: ${count}`);

    await db.disconnect();

    console.log('\n✅ Supabase connection test PASSED!');
    console.log('   You can now run: npm run crawl');
    return true;

  } catch (error) {
    console.error('\n❌ Supabase connection test FAILED!');
    console.error(`   Error: ${error.message}`);

    if (error.message.includes('Invalid API key')) {
      console.log('\n💡 Tips:');
      console.log('   - Check your SUPABASE_KEY is the "anon/public" key');
      console.log('   - Go to Supabase Dashboard → Settings → API');
      console.log('   - Copy the "anon" key (not service_role)');
    } else if (error.message.includes('42P01') || error.message.includes('does not exist')) {
      console.log('\n💡 Tips:');
      console.log('   - The table "wallhaven_tags" does not exist');
      console.log('   - Go to Supabase Dashboard → SQL Editor');
      console.log('   - Run the SQL from setup-supabase.sql');
    } else {
      console.log('\n💡 Tips:');
      console.log('   - Check your SUPABASE_URL is correct');
      console.log('   - Make sure your Supabase project is active');
      console.log('   - See SETUP_SUPABASE.md for detailed instructions');
    }

    return false;
  }
}

async function testMongoDB() {
  console.log('\n📊 Testing MongoDB Connection...\n');

  // Check environment variables
  if (!process.env.MONGODB_URI) {
    console.error('❌ Missing MONGODB_URI in .env file');
    console.log('   Please add: MONGODB_URI=mongodb+srv://...');
    return false;
  }

  console.log('✓ Environment variables found');
  console.log(`  MONGODB_URI: ${process.env.MONGODB_URI.substring(0, 30)}...`);
  console.log(`  MONGODB_DATABASE: ${process.env.MONGODB_DATABASE || 'wallhaven'}`);

  try {
    const db = new MongoDB();
    await db.connect();

    // Test if we can query the collection
    const count = await db.getTagsCount();
    console.log(`✓ Collection query successful`);
    console.log(`  Current tags in database: ${count}`);

    await db.disconnect();

    console.log('\n✅ MongoDB connection test PASSED!');
    console.log('   You can now run: npm run crawl');
    return true;

  } catch (error) {
    console.error('\n❌ MongoDB connection test FAILED!');
    console.error(`   Error: ${error.message}`);

    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.log('\n💡 Tips:');
      console.log('   - Check your username and password are correct');
      console.log('   - Make sure you replaced <password> in the connection string');
      console.log('   - If password has special characters, URL encode them');
      console.log('   - Wait 1-2 minutes after creating a new user');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      console.log('\n💡 Tips:');
      console.log('   - Check Network Access in MongoDB Atlas');
      console.log('   - Add your IP address or use 0.0.0.0/0 for all IPs');
      console.log('   - Make sure your cluster is active');
    } else {
      console.log('\n💡 Tips:');
      console.log('   - Check your MONGODB_URI is correct');
      console.log('   - Verify cluster is running in MongoDB Atlas');
      console.log('   - See SETUP_MONGODB.md for detailed instructions');
    }

    return false;
  }
}

// Run the appropriate test
async function runTest() {
  console.log('\n');

  let success = false;

  if (dbType === 'mongodb') {
    success = await testMongoDB();
  } else if (dbType === 'supabase') {
    success = await testSupabase();
  } else {
    console.error(`❌ Invalid DATABASE_TYPE: ${dbType}`);
    console.log('   Must be either "supabase" or "mongodb"');
    process.exit(1);
  }

  console.log('\n' + '━'.repeat(50));

  if (success) {
    console.log('\n🎉 All tests passed! Your database is ready to use.');
    console.log('\nNext steps:');
    console.log('  1. Run the crawler: npm run crawl');
    console.log('  2. View data in your database dashboard');
    process.exit(0);
  } else {
    console.log('\n⚠️  Please fix the errors above and try again.');
    console.log('\nNeed help?');
    console.log(`  - Read ${dbType === 'mongodb' ? 'SETUP_MONGODB.md' : 'SETUP_SUPABASE.md'}`);
    console.log('  - Check your .env file has correct values');
    process.exit(1);
  }
}

runTest();
