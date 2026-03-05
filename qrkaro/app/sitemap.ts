import { MetadataRoute } from 'next';
import connectDB from '../lib/db';
import Vendor from '../lib/models/Vendor';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // static routes that don't depend on data
  const staticPaths = [
    '/',
    '/admin',
    '/admin/earnings',
    '/admin/login',
    '/admin/settings',
    '/admin/transactions',
    '/admin/vendors',
    '/onboard',
    '/success',
    '/vendor/dashboard',
    '/vendor/dashboard/insights',
    '/vendor/dashboard/menu',
    '/vendor/dashboard/settings',
    '/vendor/dashboard/settings/edit-shop',
    '/vendor/login',
  ];

  const sitemap: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
  }));

  // include dynamic vendor pages (and related subpaths) by querying the database
  try {
    await connectDB();
    const vendors = await Vendor.find({ isActive: true })
      .select('vendorId updatedAt')
      .lean();

    vendors.forEach((v) => {
      const updated = v.updatedAt?.toISOString();
      sitemap.push({ url: `${baseUrl}/v/${v.vendorId}`, lastModified: updated });
      sitemap.push({ url: `${baseUrl}/v/${v.vendorId}/cart`, lastModified: updated });
      sitemap.push({ url: `${baseUrl}/v/${v.vendorId}/order-success`, lastModified: updated });
    });
  } catch (err) {
    console.error('Error generating sitemap vendor entries', err);
    // fail gracefully -- we'll still return the static urls
  }

  return sitemap;
}