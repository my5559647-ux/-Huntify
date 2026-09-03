import { NextResponse } from 'next/server';

// Fallback mock data for when external APIs fail
const MOCK_BUSINESSES = [
  {
    id: 1,
    skill: 'Web Designer',
    name: 'Lahore Gourmet Bakers & Cafe',
    niche: 'Restaurant / Food',
    address: 'Main Boulevard, Gulberg III, Lahore',
    established: 'Est. 2018',
    website: 'www.lahoregourmetcafe.pk',
    hasWebsiteIssue: 'Outdated UI design, slow loading speed on mobile devices.',
    pitchIdea: 'Hey! I noticed your website layout is a bit dated on mobile screens. As a Web Designer, I can revamp it with a modern, high-converting interface to bring you more dine-in bookings.',
    rating: '4.6',
    contactEmail: 'info@lahoregourmetcafe.pk',
    phone: '+92 42 3571XXXX'
  },
  {
    id: 2,
    skill: 'Web Designer',
    name: 'Al-Madina Auto Spare Parts',
    niche: 'Automotive / Retail',
    address: 'Badami Bagh Auto Market, Lahore',
    established: 'Est. 2012',
    website: 'No active website found',
    hasWebsiteIssue: 'Zero digital ads presence & missing Google Business optimization.',
    pitchIdea: 'Hi there! Your auto business has great local reputation since 2012, but you are missing out on online buyers. I can set up high-ROI Facebook & Google Ads for you.',
    rating: '4.2',
    contactEmail: 'contact@almadinaauto.pk',
    phone: '+92 42 3772XXXX'
  },
  {
    id: 3,
    skill: 'Web Designer',
    name: 'Zenith Tech Software House',
    niche: 'IT & Software',
    address: 'Arfa Software Technology Park, Lahore',
    established: 'Est. 2021',
    website: 'www.zenithtech-old.com',
    hasWebsiteIssue: 'Broken API links and unoptimized client portal dashboard.',
    pitchIdea: 'Hello! Checked your client portal and found a few backend routing bugs. As a Full Stack Developer, I can instantly secure and scale your web application infrastructure.',
    rating: '4.9',
    contactEmail: 'hello@zenithtech.com',
    phone: '+92 42 3592XXXX'
  }
];

export async function GET(request: Request) {
  const overpassUrl = 'https://overpass-api.de/api/interpreter?data=[out:json];area[name="Lahore"]->.searchArea;(node["amenity"="cafe"](area.searchArea);way["amenity"="cafe"](area.searchArea););out body;>;out skel qt;';

  try {
    const response = await fetch(overpassUrl, {
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Overpass API returned ${response.status}`);
    }

    const data = await response.json();

    const businesses = data.elements
      ?.filter((el: any) => el.tags && el.tags.name)
      ?.map((el: any) => ({
        id: el.id,
        name: el.tags.name,
        website: el.tags.website || 'No Website',
        address: el.tags['addr:street'] || 'Lahore, Pakistan',
      })) || [];

    // If we got no data, return fallback
    if (businesses.length === 0) {
      console.log('No businesses from Overpass API, returning fallback data');
      return NextResponse.json({ success: true, data: MOCK_BUSINESSES });
    }

    return NextResponse.json({ success: true, data: businesses });
  } catch (error: any) {
    console.error('Error fetching from Overpass API:', error.message);
    // Return fallback data instead of error
    return NextResponse.json({
      success: true,
      message: 'Using fallback data due to API error',
      data: MOCK_BUSINESSES
    });
  }
}