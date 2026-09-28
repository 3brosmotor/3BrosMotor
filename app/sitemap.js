import { INITIAL_60_VEHICLES } from './lib/carsData';

export default function sitemap() {
  const baseUrl = process.env.APP_URL || 'https://3brosmotor.com';
  const currentDate = new Date().toISOString();

  // Core static pages
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic vehicle deep-links (indexed for Google rich results)
  const vehicleRoutes = (INITIAL_60_VEHICLES || []).slice(0, 30).map((car) => ({
    url: `${baseUrl}/?stock=${car.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
