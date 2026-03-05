// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        // Allow everything by default, but block private areas
        disallow: ['/admin', '/vendor', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
