import { callApi } from "@/utils/apiClient";
 
export const dynamic = 'force-dynamic';

export async function GET() {
    const blogData = await callApi("blogs");
    const { blogs } = blogData.data;
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';


    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${blogs
            .map(({ slug }: { slug: string }) => `
        <url>
          <loc>${APP_URL}/blogs/${slug}/</loc> 
        </url>`)
            .join('')}
    </urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
