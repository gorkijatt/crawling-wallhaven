import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export class MongoDB {
  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;
    this.collectionName = 'wallhaven_tags';
  }

  async connect() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DATABASE || 'wallhaven';

    if (!uri) {
      throw new Error('Missing MongoDB URI. Please set MONGODB_URI in .env file');
    }

    this.client = new MongoClient(uri);
    await this.client.connect();

    this.db = this.client.db(dbName);
    this.collection = this.db.collection(this.collectionName);

    // Create index on tag_id for faster upserts
    await this.collection.createIndex({ tag_id: 1 }, { unique: true });

    console.log(`✓ Connected to MongoDB database: ${dbName}`);
  }

  async saveTags(tags) {
    if (!this.collection) {
      throw new Error('Database not connected. Call connect() first.');
    }

    // Use bulkWrite for efficient upserts
    const operations = tags.map(tag => ({
      updateOne: {
        filter: { tag_id: tag.tag_id },
        update: { $set: tag },
        upsert: true
      }
    }));

    const result = await this.collection.bulkWrite(operations);
    return result;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('✓ Disconnected from MongoDB');
    }
  }

  async getTagsCount() {
    if (!this.collection) {
      throw new Error('Database not connected');
    }

    return await this.collection.countDocuments();
  }
}
