import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { SupabaseDB } from './database/supabase.js';
import { MongoDB } from './database/mongodb.js';

dotenv.config();

class WallhavenTagsCrawlerPuppeteer {
  constructor() {
    this.baseUrl = 'https://wallhaven.cc/tags';
    this.delay = parseInt(process.env.DELAY_MS) || 2000;
    this.maxPages = parseInt(process.env.MAX_PAGES) || 10;
    this.startPage = parseInt(process.env.START_PAGE) || 1;

    // Initialize database based on config
    const dbType = process.env.DATABASE_TYPE || 'supabase';
    this.db = dbType === 'mongodb' ? new MongoDB() : new SupabaseDB();
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    await this.db.connect();
    console.log(`✓ Connected to ${process.env.DATABASE_TYPE || 'supabase'} database`);

    // Launch browser
    console.log('Launching browser...');
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    this.page = await this.browser.newPage();

    // Set viewport and user agent
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('✓ Browser ready');
  }

  async crawlPage(pageNumber) {
    try {
      const url = `${this.baseUrl}/${pageNumber}`;
      console.log(`\nCrawling page ${pageNumber}: ${url}`);

      // Navigate to the page
      await this.page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Wait for content to load
      await this.page.waitForSelector('.tag-list, .no-results', { timeout: 10000 }).catch(() => {
        console.log('No tag list found, page might be empty or structure changed');
      });

      // Extract tags using page.evaluate
      const tags = await this.page.evaluate((pageNum) => {
        const tagsList = [];
        const tagElements = document.querySelectorAll('.tag-list li');

        tagElements.forEach(element => {
          try {
            const tagLink = element.querySelector('a.tag-name, .tag-name a, a[href*="/tag/"]');
            const tagName = tagLink ? tagLink.textContent.trim() : null;
            const tagUrl = tagLink ? tagLink.getAttribute('href') : null;
            const tagId = tagUrl ? tagUrl.split('/').pop() : null;

            const creatorEl = element.querySelector('.username, a.username');
            const creator = creatorEl ? creatorEl.textContent.trim() : null;
            const creatorUrl = creatorEl ? creatorEl.getAttribute('href') : null;

            const dateEl = element.querySelector('.date, time, .created-at');
            const date = dateEl ? dateEl.textContent.trim() : null;

            const categoryEl = element.querySelector('.tag-category, .category');
            const category = categoryEl ? categoryEl.textContent.trim() : null;

            // Extract stats
            const statsElements = element.querySelectorAll('.tag-stats span, .stats span, li');
            const metrics = Array.from(statsElements).map(el => el.textContent.trim());

            if (tagName && tagId) {
              tagsList.push({
                tag_id: tagId,
                tag_name: tagName,
                tag_url: tagUrl ? (tagUrl.startsWith('http') ? tagUrl : `https://wallhaven.cc${tagUrl}`) : null,
                creator: creator || null,
                creator_url: creatorUrl ? (creatorUrl.startsWith('http') ? creatorUrl : `https://wallhaven.cc${creatorUrl}`) : null,
                created_date: date || null,
                category: category || null,
                submissions: metrics[0] || '0',
                views: metrics[1] || '0',
                favorites: metrics[2] || '0',
                crawled_at: new Date().toISOString(),
                page_number: pageNum
              });
            }
          } catch (error) {
            console.error('Error parsing tag element:', error);
          }
        });

        return tagsList;
      }, pageNumber);

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
    console.log('🚀 Starting Wallhaven Tags Crawler (Puppeteer Mode)');
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

    await this.cleanup();

    console.log(`\n✅ Crawling completed!`);
    console.log(`Total tags collected: ${totalTags}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('✓ Browser closed');
    }
    await this.db.disconnect();
  }
}

// Run the crawler
const crawler = new WallhavenTagsCrawlerPuppeteer();
crawler.crawl().catch(console.error);
