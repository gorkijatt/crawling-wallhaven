import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

export class SupabaseDB {
  constructor() {
    this.client = null;
    this.tableName = 'wallhaven_tags';
  }

  async connect() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY in .env file');
    }

    this.client = createClient(supabaseUrl, supabaseKey);

    // Test the connection
    try {
      const { error } = await this.client.from(this.tableName).select('count').limit(1);
      if (error && error.code === '42P01') {
        console.log('⚠️  Table does not exist. Please create it using the SQL in setup-supabase.sql');
      }
    } catch (error) {
      console.log('⚠️  Could not verify table exists:', error.message);
    }
  }

  async saveTags(tags) {
    if (!this.client) {
      throw new Error('Database not connected. Call connect() first.');
    }

    // Upsert tags (insert or update if tag_id already exists)
    const { data, error } = await this.client
      .from(this.tableName)
      .upsert(tags, { onConflict: 'tag_id' });

    if (error) {
      throw new Error(`Failed to save tags: ${error.message}`);
    }

    return data;
  }

  async disconnect() {
    // Supabase client doesn't need explicit disconnection
    console.log('✓ Disconnected from Supabase');
  }

  async getTagsCount() {
    if (!this.client) {
      throw new Error('Database not connected');
    }

    const { count, error } = await this.client
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Failed to get count: ${error.message}`);
    }

    return count;
  }
}
