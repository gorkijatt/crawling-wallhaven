import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { SupabaseDB } from './database/supabase.js';
import { MongoDB } from './database/mongodb.js';

dotenv.config();

class WallhavenTagsCrawler {
  constructor() {
    this.baseUrl = 'https://wallhaven.cc/tags';
    this.delay = parseInt(process.env.DELAY_MS) || 1000;
    this.maxPages = parseInt(process.env.MAX_PAGES) || 10;
    this.startPage = parseInt(process.env.START_PAGE) || 1;

    // Initialize database based on config
    const dbType = process.env.DATABASE_TYPE || 'supabase';
    this.db = dbType === 'mongodb' ? new MongoDB() : new SupabaseDB();
  }

  async initialize() {
    await this.db.connect();
    console.log(`✓ Connected to ${process.env.DATABASE_TYPE || 'supabase'} database`);
  }

  async crawlPage(pageNumber) {
    try {
      const url = `${this.baseUrl}/${pageNumber}`;
      console.log(`\nCrawling page ${pageNumber}: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        },
        maxRedirects: 5,
        timeout: 30000
      });

      const $ = cheerio.load(response.data);
      const tags = [];

      // Parse tags from the page
      $('.tag-list li').each((index, element) => {
        const $tag = $(element);

        const tagLink = $tag.find('a.tag-name');
        const tagName = tagLink.text().trim();
        const tagUrl = tagLink.attr('href');
        const tagId = tagUrl ? tagUrl.split('/').pop() : null;

        const creator = $tag.find('.username').text().trim();
        const creatorUrl = $tag.find('.username').attr('href');

        const date = $tag.find('.date').text().trim();
        const category = $tag.find('.tag-category').text().trim();

        // Extract metrics (submissions, views, favorites)
        const metrics = $tag.find('.tag-stats span').map((i, el) => {
          return $(el).text().trim();
        }).get();

        if (tagName && tagId) {
          tags.push({
            tag_id: tagId,
            tag_name: tagName,
            tag_url: tagUrl ? `https://wallhaven.cc${tagUrl}` : null,
            creator: creator || null,
            creator_url: creatorUrl ? `https://wallhaven.cc${creatorUrl}` : null,
            created_date: date || null,
            category: category || null,
            submissions: metrics[0] || '0',
            views: metrics[1] || '0',
            favorites: metrics[2] || '0',
            crawled_at: new Date().toISOString(),
            page_number: pageNumber
          });
        }
      });

      console.log(`✓ Found ${tags.length} tags on page ${pageNumber}`);
      return tags;
    } catch (error) {
      console.error(`✗ Error crawling page ${pageNumber}:`, error.message);
      return [];
    }
  }

  async saveTags(tags) {
    if (tags.length === 0) {
      console.log('No tags to save');
      return;
    }

    try {
      await this.db.saveTags(tags);
      console.log(`✓ Saved ${tags.length} tags to database`);
    } catch (error) {
      console.error('✗ Error saving tags:', error.message);
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async crawl() {
    console.log('🚀 Starting Wallhaven Tags Crawler');
    console.log(`Configuration:`);
    console.log(`  - Database: ${process.env.DATABASE_TYPE || 'supabase'}`);
    console.log(`  - Pages: ${this.startPage} to ${this.startPage + this.maxPages - 1}`);
    console.log(`  - Delay: ${this.delay}ms between requests`);

    await this.initialize();

    let totalTags = 0;

    for (let page = this.startPage; page < this.startPage + this.maxPages; page++) {
      const tags = await this.crawlPage(page);

      if (tags.length === 0) {
        console.log(`No more tags found. Stopping at page ${page}`);
        break;
      }

      await this.saveTags(tags);
      totalTags += tags.length;

      // Delay between requests to be respectful
      if (page < this.startPage + this.maxPages - 1) {
        console.log(`Waiting ${this.delay}ms before next request...`);
        await this.sleep(this.delay);
      }
    }

    await this.db.disconnect();

    console.log(`\n✅ Crawling completed!`);
    console.log(`Total tags collected: ${totalTags}`);
  }
}

// Run the crawler
const crawler = new WallhavenTagsCrawler();
crawler.crawl().catch(console.error);
