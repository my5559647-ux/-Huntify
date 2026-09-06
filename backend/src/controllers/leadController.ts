import { Request, Response } from 'express';

// Build a realistic-but-derived email from a real website domain (best-effort)
const emailFromDomain = (domain: string) => {
  if (!domain) return '';
  const host = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  return host ? `info@${host}` : '';
};

// Sanitize text to remove Google's boilerplate and UI text
const sanitizeText = (text: string): string => {
  if (!text) return '';

  // Common Google Maps boilerplate patterns to remove - more aggressive
  const boilerplatePatterns = [
    // Specific Google UI footers and disclaimers
    /Some of these hotel and vacation rental search/gi,
    /Some of these.*search/gi,
    /hotel and vacation rental/gi,
    /vacation rental search/gi,
    /RatingHours/gi,
    /Rating Hours/gi,
    /Hours.*Rating/gi,
    /Rating.*Hours/gi,
    /Hours of operation/gi,
    /Operational hours/gi,
    /Business hours/gi,
    /Open now/gi,
    /Closed now/gi,
    /Temporarily closed/gi,
    /Permanently closed/gi,

    // Common Google Maps boilerplate
    /All filters?/gi,
    /Results?/gi,
    /Prices? come from Google's partners?/gi,
    /Google partners?/gi,
    /People also search for/gi,
    /People also ask/gi,
    /Related searches?/gi,
    /See more/gi,
    /Show more/gi,
    /View all/gi,
    /Read more/gi,
    /Learn more/gi,
    /Privacy policy/gi,
    /Terms of service/gi,
    /Cookie policy/gi,
    /Help/gi,
    /Send feedback/gi,
    /About this result/gi,
    /Similar to/gi,
    /Based on/gi,
    /Sponsored/gi,
    /Ad/gi,
    /By/gi,

    // Google Maps UI elements
    /Reviews? from/gi,
    /Reviews? on/gi,
    /Google Reviews?/gi,
    /Star rating/gi,
    /User reviews?/gi,
    /Customer reviews?/gi,
    /Write a review/gi,
    /Add a review/gi,
    /Leave a review/gi,

    // Footer and navigation text
    /Directions/gi,
    /Website/gi,
    /Call/gi,
    /Save/gi,
    /Share/gi,
    /Report/gi,
    /Claim/gi,
    /Edit/gi,
    /Suggest/gi,
    /Update/gi,

    // Time and location patterns
    /AM.*PM/gi,
    /am.*pm/gi,
    /Opens.*closes/gi,
    /Closes.*opens/gi,
    /Today/gi,
    /Tomorrow/gi,
    /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/gi,
    /Mon|Tue|Wed|Thu|Fri|Sat|Sun/gi,

    // Special characters and UI artifacts
    /•/gi,
    /···/gi,
    /…/gi,
    /\|/gi,
    /—/gi,
    /–/gi,
    /→/gi,
    /←/gi,
    /↑/gi,
    /↓/gi,
    /✓/gi,
    /✗/gi,
    /⭐/gi,
    /★/gi,

    // Phone and address patterns that might leak in
    /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/gi,
    /Address:/gi,
    /Phone:/gi,
    /Mobile:/gi,
    /Tel:/gi,
  ];

  let cleaned = text;

  // Remove all boilerplate patterns
  boilerplatePatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });

  // Clean up multiple spaces and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Remove leading/trailing special characters and numbers
  cleaned = cleaned.replace(/^[^\w]+|[^\w]+$/g, '');

  // Remove sentences that are too long (likely descriptions/disclaimers)
  const sentences = cleaned.split(/[.!?]/).filter(s => s.trim().length > 0);
  const shortSentences = sentences.filter(s => s.trim().length < 50);
  cleaned = shortSentences.join('. ').trim();

  // Limit length to reasonable business description (max 150 chars for cleaner output)
  if (cleaned.length > 150) {
    cleaned = cleaned.substring(0, 147) + '...';
  }

  // Fallback to generic description if still contains suspicious patterns
  const suspiciousPatterns = [
    /hotel/i,
    /vacation/i,
    /rental/i,
    /search/i,
    /partners/i,
    /policy/i,
    /terms/i,
    /cookie/i,
    /feedback/i,
  ];

  const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(cleaned));

  if (hasSuspiciousContent || cleaned.length < 3) {
    return 'Local retail store in Lahore';
  }

  return cleaned || 'Local retail store in Lahore';
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

  // Fallback mock data for when scraping fails
  const FALLBACK_LEADS = [
    {
      id: 1,
      skill: searchKeyword,
      name: 'Lahore Gourmet Bakers & Cafe',
      niche: 'Restaurant / Food',
      address: 'Main Boulevard, Gulberg III, Lahore',
      established: 'Est. 2018',
      website: 'www.lahoregourmetcafe.pk',
      hasWebsiteIssue: 'Outdated UI design, slow loading speed on mobile devices.',
      pitchIdea: `Hey! I noticed your website layout is a bit dated on mobile screens. As a ${searchKeyword}, I can revamp it with a modern, high-converting interface to bring you more dine-in bookings.`,
      rating: '4.6 ⭐',
      contactEmail: 'info@lahoregourmetcafe.pk',
      phone: '+92 42 3571XXXX'
    },
    {
      id: 2,
      skill: searchKeyword,
      name: 'Al-Madina Auto Spare Parts',
      niche: 'Automotive / Retail',
      address: 'Badami Bagh Auto Market, Lahore',
      established: 'Est. 2012',
      website: 'No active website found',
      hasWebsiteIssue: 'Zero digital ads presence & missing Google Business optimization.',
      pitchIdea: `Hi there! Your auto business has great local reputation since 2012, but you are missing out on online buyers. I can set up high-ROI Facebook & Google Ads for you.`,
      rating: '4.2 ⭐',
      contactEmail: 'contact@almadinaauto.pk',
      phone: '+92 42 3772XXXX'
    },
    {
      id: 3,
      skill: searchKeyword,
      name: 'Zenith Tech Software House',
      niche: 'IT & Software',
      address: 'Arfa Software Technology Park, Lahore',
      established: 'Est. 2021',
      website: 'www.zenithtech-old.com',
      hasWebsiteIssue: 'Broken API links and unoptimized client portal dashboard.',
      pitchIdea: `Hello! Checked your client portal and found a few backend routing bugs. As a ${searchKeyword}, I can instantly secure and scale your web application infrastructure.`,
      rating: '4.9 ⭐',
      contactEmail: 'hello@zenithtech.com',
      phone: '+92 42 3592XXXX'
    }
  ];

  let browser: any = null;
  try {
    // 1. Launch Puppeteer with anti-bot flags + realistic user agent
    // For Railway/deployment: skip Chrome download, use system Chrome or executablePath
    const puppeteer = await import('puppeteer');

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

          // Try multiple selectors for subtitle/description
          const subtitleEl = el.querySelector('.fontBodyMedium') ||
                            el.querySelector('[class*="subtitle"]') ||
                            el.querySelector('[class*="description"]') ||
                            el.querySelector('[class*="category"]');
          const subtitle = subtitleEl?.textContent?.trim() || '';

          // Rating: look for an aria-label like "X stars"
          const ratingRegex = /([\d.]+)\s*stars?/i;
          const ratingEl = el.querySelector('[aria-label*="stars" i]');
          const ratingMatch = ratingEl?.getAttribute('aria-label')?.match(ratingRegex);
          const rating = ratingMatch ? ratingMatch[1] : '';

          // Address: more specific extraction
          const addressEl = el.querySelector('[class*="address"]') ||
                           el.querySelector('[class*="location"]') ||
                           el.querySelector('[aria-label*="Address" i]');
          let address = addressEl?.textContent?.trim() || '';

          // Fallback to text extraction if specific element not found
          if (!address) {
            const allText = el.textContent?.trim() || '';
            const addressMatch = allText.match(/([^,]+,\s*[^,]+,\s*[^,]+)/);
            address = addressMatch ? addressMatch[1].trim() : '';
          }

          // Website: real external link
          const websiteEl = Array.from(el.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')).find(
            (a) => !a.href.includes('google.com') && !a.href.includes('/maps/')
          );
          const website = websiteEl?.href || '';

          // Phone: Pakistani number pattern
          const phoneMatch = el.textContent?.match(/\+92[\d\s-]{10,14}/);
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
      console.log('No businesses found on Google Maps, returning fallback data');
      res.status(200).json({
        success: true,
        message: 'No businesses found on Google Maps for this query. Using fallback data.',
        data: FALLBACK_LEADS,
      });
      return;
    }

    // 6. Map to the exact frontend card schema with sanitization
    const leads = scraped.map((raw: any, index: number) => {
      const domain = raw.website || '';
      const email = domain ? emailFromDomain(domain) : '';
      const flaw = inferFlaw(domain, raw.rating);
      const ratingLabel = raw.rating ? `${raw.rating} ⭐` : 'Not rated';

      // Sanitize all text fields
      const cleanName = sanitizeText(raw.name);
      const cleanSubtitle = sanitizeText(raw.subtitle);
      const cleanAddress = sanitizeText(raw.address);
      const cleanPhone = sanitizeText(raw.phone);

      return {
        id: index + 1,
        skill: searchKeyword,
        name: cleanName,
        niche: cleanSubtitle || `${searchKeyword} / Local Business`,
        address: cleanAddress || `${searchLocation} area`,
        established: 'Verified on Google Maps',
        website: domain || 'No active website found',
        hasWebsiteIssue: flaw,
        pitchIdea: `Hi ${cleanName}! I found your business on Google Maps (${ratingLabel}). I noticed — ${flaw} As a ${searchKeyword} specialist, I can help you win more customers in ${searchLocation} with a solid online presence.`,
        rating: ratingLabel,
        contactEmail: email || 'No public email listed',
        phone: cleanPhone || '+92 (not listed)',
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
    // Return fallback data instead of error
    console.log('Returning fallback data due to scraping error');
    res.status(200).json({
      success: true,
      message: 'Scraping failed. Using fallback data.',
      data: FALLBACK_LEADS,
    });
  }
};
