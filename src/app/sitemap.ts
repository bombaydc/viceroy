
import { MetadataRoute } from 'next';
 
export const dynamic = 'force-dynamic';  

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const changeFrequency = "monthly" as const;

    const staticPages = [
        { url: `${APP_URL}/`, changeFrequency, priority: 1 }, 
        { url: `${APP_URL}/blogs/`, changeFrequency, priority: 0.7 },
        { url: `${APP_URL}/privacy-policy/`, changeFrequency, priority: 0.6 },
        { url: `${APP_URL}/sitemaps/blogsitemap.xml`, }
    ];
    return [...staticPages];
}
