# Handling Cloudflare Protection on Wallhaven

## The Problem

Wallhaven.cc uses **Cloudflare DDoS protection** which blocks automated HTTP requests. This is why you might see errors like:
- "Maximum number of redirects exceeded"
- "503 Service Unavailable"
- "Challenge page" redirects

This is **normal and expected** for protected websites!

## ✅ Solution 1: Use Puppeteer (Headless Browser)

Puppeteer simulates a real browser, which can bypass Cloudflare protection.

### Install Puppeteer

```bash
npm install puppeteer
```

This will download Chromium (~170MB) but it's worth it!

### Run the Puppeteer Crawler

```bash
npm run crawl:puppeteer
```

**Advantages:**
- ✓ Bypasses Cloudflare protection
- ✓ Works like a real browser
- ✓ Handles JavaScript-rendered content
- ✓ More reliable for protected sites

**Disadvantages:**
- ✗ Slower than regular HTTP requests
- ✗ Uses more memory/CPU
- ✗ Requires Chromium download

## ✅ Solution 2: Run Locally

The simple axios-based crawler often works fine when run from your local machine:

```bash
# On your computer:
git clone <your-repo>
cd crawling-wallhaven
npm install
npm run crawl
```

**Why?** Cloudflare is less likely to block residential IPs.

## ✅ Solution 3: Use a Proxy/VPN

If Cloudflare is blocking your IP:

```bash
# Add proxy support to .env
HTTP_PROXY=http://your-proxy:port
HTTPS_PROXY=http://your-proxy:port
```

Then update the crawler to use the proxy (code modification needed).

## ✅ Solution 4: Respect Rate Limits

Sometimes slowing down helps:

```env
# In your .env file
DELAY_MS=3000  # Wait 3 seconds between requests instead of 1
MAX_PAGES=3    # Crawl fewer pages at a time
```

## Comparison: Regular vs Puppeteer

| Feature | Regular Crawler | Puppeteer Crawler |
|---------|----------------|-------------------|
| Speed | ⚡ Fast | 🐢 Slower |
| Memory | 💚 Low | 💛 Higher |
| Cloudflare | ❌ Often blocked | ✅ Usually works |
| Setup | ✅ Simple | ⚠️ Need Chromium |
| Best for | APIs, simple sites | Protected sites |

## Which Should You Use?

### Use Regular Crawler (`npm run crawl`) when:
- Running on your local machine
- Site doesn't have Cloudflare
- You have a trusted IP/proxy

### Use Puppeteer Crawler (`npm run crawl:puppeteer`) when:
- Getting Cloudflare errors
- Site requires JavaScript
- Need to bypass bot detection
- Running on cloud servers

## Testing Both

Try the regular crawler first:
```bash
npm run crawl
```

If you get errors, switch to Puppeteer:
```bash
npm install puppeteer
npm run crawl:puppeteer
```

## Understanding Cloudflare Protection

Cloudflare uses several methods to detect bots:
1. **User-Agent checking** - We handle this with proper headers
2. **TLS fingerprinting** - Hard to bypass with axios
3. **JavaScript challenges** - Requires browser execution
4. **Rate limiting** - Slow down requests
5. **IP reputation** - Use residential IPs or proxies

**Puppeteer solves #1-3 automatically!**

## Troubleshooting

### "ECONNREFUSED" or "ETIMEDOUT"
- Check your internet connection
- Try with VPN
- Site might be down

### "403 Forbidden"
- IP is blocked
- Try Puppeteer
- Wait and try later

### "503 Service Unavailable"
- Cloudflare is active
- Use Puppeteer
- Or run locally

### Puppeteer "Failed to launch browser"
```bash
# On Linux, you might need:
sudo apt-get install -y \
  libnss3 \
  libatk-bridge2.0-0 \
  libdrm2 \
  libxkbcommon0 \
  libgbm1 \
  libasound2

# On macOS, usually works out of the box
# On Windows, usually works out of the box
```

## Best Practices for Web Scraping

1. **Respect robots.txt**: Check https://wallhaven.cc/robots.txt
2. **Use delays**: Don't hammer the server
3. **Identify yourself**: Use a proper User-Agent
4. **Cache responses**: Don't re-fetch the same data
5. **Handle errors**: Retry with exponential backoff
6. **Check Terms of Service**: Make sure scraping is allowed

## Alternative: Official API

Check if Wallhaven has an official API:
- Official APIs are faster and more reliable
- No Cloudflare issues
- Often free with rate limits
- Better for long-term projects

## Summary

```bash
# Quick fix for Cloudflare issues:
npm install puppeteer
npm run crawl:puppeteer

# That's it! 🎉
```

The Puppeteer crawler will:
- ✓ Connect to your Supabase database
- ✓ Bypass Cloudflare protection
- ✓ Crawl tags successfully
- ✓ Save everything to your database

---

**Need more help?** Check the main README.md or open an issue!
