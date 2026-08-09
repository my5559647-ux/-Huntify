export interface Lead {
  id: string;
  businessName: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  serviceNeeded: 'Web Development' | 'Graphic Design' | 'Video Editing';
  statusCategory: 'Need New' | 'Need Perfection';
  rating: number;
  hasWebsite: boolean;
  websiteUrl?: string;
}

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    businessName: 'Fitness Club Gulberg',
    country: 'Pakistan',
    city: 'Lahore',
    phone: '+92 300 1234567',
    email: 'contact@fitnessclub.pk',
    serviceNeeded: 'Web Development',
    statusCategory: 'Need New',
    rating: 4.5,
    hasWebsite: false,
  },
  {
    id: '2',
    businessName: 'Apex Studio Design',
    country: 'Pakistan',
    city: 'Karachi',
    phone: '+92 321 9876543',
    email: 'info@apexstudio.pk',
    serviceNeeded: 'Graphic Design',
    statusCategory: 'Need Perfection',
    rating: 4.1,
    hasWebsite: true,
    websiteUrl: 'http://apexstudio-old.com',
  },
  {
    id: '3',
    businessName: 'Islamabad Legal Advisors',
    country: 'Pakistan',
    city: 'Islamabad',
    phone: '+92 333 5551212',
    email: 'lawyers@isbadlaw.pk',
    serviceNeeded: 'Video Editing',
    statusCategory: 'Need New',
    rating: 4.8,
    hasWebsite: false,
  },
];