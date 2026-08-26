import { Request, Response } from 'express';
import puppeteer from 'puppeteer';

// Build a realistic-but-derived email from a real website domain (best-effort)
const emailFromDomain = (domain: string) => {
  if (!domain) return '';
  const host = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  return host ? `info@${host}` : '';
};

// Dynamically infer a "web flaw" from the real scraped data
const inferFlaw = (website: string, ratingStr: string) => {
  if (!website || website === 'No active website found' || website === '') {
    return 'No active website or online presence found — missing out on digital leads.';
  }
  const rating = parseFloat(ratingStr);
  if (!isNaN(rating) && rating < 4.0) {
    return `Low online rating (${ratingStr}★) — weak reputation and poor review management.`;
  }
  return 'Outdated website design with no mobile optimization and slow loading speed.';
};

export const startScrapingTask = async (req: Request, res: Response): Promise<void> => {
  const { keyword, location } = req.body;
  const searchKeyword = (keyword || 'Business').trim();
  const searchLocation = (location || 'Lahore').trim();

  let browser: any = null;
  try {
    // 1. Launch Puppeteer with anti-bot flags + realistic user agent
    // For Railway/deployment: skip Chrome download, use system Chrome or executablePath
    const launchOptions: any = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--window-size=1366,900',
      ],
    };

    // If PUPPETEER_EXECUTABLE_PATH is set (for Railway/deployment), use it
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    // 2. Go to Google Maps search
    const url = `https://www.google.com/maps/search/${encodeURIComponent(
      searchKeyword
    )}+in+${encodeURIComponent(searchLocation)}`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // 3. Dismiss Google consent popup if shown
    try {
      const consentBtn = await page.$('button[aria-label*="Accept all"]');
      if (consentBtn) await consentBtn.click();
    } catch {
      /* ignore */
    }

    // 4. Wait for the results feed, then scroll to load more listings
    await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 30000 }).catch(() => {});
    for (let i = 0; i < 8; i++) {
      await page.evaluate(() => {
        const feed = document.querySelector('div[role="feed"]');
        if (feed) feed.scrollBy(0, 1200);
        else window.scrollBy(0, 1200);
      });
      await new Promise((r) => setTimeout(r, 900));
    }

    // 5. Extract authentic business data from the DOM
    const scraped = await page.evaluate(() => {
      const places = Array.from(
        document.querySelectorAll('a[href*="/maps/place/"]')
      ).map((a) => a.closest('div')?.parentElement?.parentElement || a);

      const seen = new Set<string>();
      return places
        .map((el) => {
          const nameEl = el.querySelector('[role="heading"]') || el.querySelector('a[href*="/maps/place/"]');
          const name = nameEl?.textContent?.trim() || '';

          const subtitle = el.querySelector('.fontBodyMedium')?.textContent?.trim() || '';

          // Rating: look for an aria-label like "X stars"
          const ratingRegex = /([\d.]+)\s*stars?/i;
          const ratingEl = el.querySelector('[aria-label*="stars" i]');
          const ratingMatch = ratingEl?.getAttribute('aria-label')?.match(ratingRegex);
          const rating = ratingMatch ? ratingMatch[1] : '';

          // Address: often the last text line
          const allText = el.textContent?.trim() || '';
          const addressMatch = allText.match(/([^,]+,\s*[^,]+,\s*[^,]+)/);
          const address = addressMatch ? addressMatch[1].trim() : '';

          // Website: real external link
          const websiteEl = Array.from(el.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')).find(
            (a) => !a.href.includes('google.com') && !a.href.includes('/maps/')
          );
          const website = websiteEl?.href || '';

          // Phone: Pakistani number pattern
          const phoneMatch = allText.match(/\+92[\d\s-]{10,14}/);
          const phone = phoneMatch ? phoneMatch[0].trim() : '+92 (not listed)';

          if (!name || seen.has(name)) return null;
          seen.add(name);
          return { name, subtitle, rating, address, website, phone };
        })
        .filter(Boolean)
        .slice(0, 15);
    });

    await browser.close();

    if (scraped.length === 0) {
      res.status(200).json({
        success: true,
        message: 'No businesses found on Google Maps for this query.',
        data: [],
      });
      return;
    }

    // 6. Map to the exact frontend card schema
    const leads = scraped.map((raw: any, index: number) => {
      const domain = raw.website || '';
      const email = domain ? emailFromDomain(domain) : '';
      const flaw = inferFlaw(domain, raw.rating);
      const ratingLabel = raw.rating ? `${raw.rating} ⭐` : 'Not rated';

      return {
        id: index + 1,
        skill: searchKeyword,
        name: raw.name,
        niche: raw.subtitle || `${searchKeyword} / Local Business`,
        address: raw.address || `${searchLocation} area`,
        established: 'Verified on Google Maps',
        website: domain || 'No active website found',
        hasWebsiteIssue: flaw,
        pitchIdea: `Hi ${raw.name}! I found your business on Google Maps (${ratingLabel}). I noticed — ${flaw} As a ${searchKeyword} specialist, I can help you win more customers in ${searchLocation} with a solid online presence.`,
        rating: ratingLabel,
        contactEmail: email || 'No public email listed',
        phone: raw.phone,
      };
    });

    res.status(200).json({
      success: true,
      message: `Scraped ${leads.length} real businesses from Google Maps in ${searchLocation}`,
      data: leads,
    });
  } catch (error: any) {
    console.error('Scraping Error:', error?.message || error);
    if (browser) {
      try {
        await browser.close();
      } catch {
        /* ignore */
      }
    }
    res.status(500).json({
      success: false,
      error: 'Scraping failed',
      details: error?.message || 'Unknown error',
    });
  }
};
