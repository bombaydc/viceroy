import { fetchData } from "@/utils/fetchData";
import { sendResponse } from "@/utils/response";
import { NextRequest } from "next/server";


interface BlogItem {
    slug: string;
    type: string;
    publishedAt: string;
    publisher: string;
    title: string;
    desktopimage: {
        url: string;
    };
}

export async function GET(_: NextRequest, context: { params: { slug: string } }) {
    const slug = context.params?.slug?.toLowerCase() ?? "";

    if (!slug) {
        return sendResponse(400, "Missing blog slug");
    }

    try {
        const data = await fetchData("blog.json");

        if (!data || !Array.isArray(data.data)) {
            return sendResponse(404, "Blog data not found or invalid format");
        }

        const blogs: BlogItem[] = data.data;
        const matchedBlogs = blogs.filter(blog => blog.slug.toLowerCase() === slug);

        const relatedBlogs = blogs.filter(blog => blog.type.toLowerCase() === matchedBlogs[0].type.toLowerCase() && blog.slug !== matchedBlogs[0].slug);


        if (matchedBlogs.length === 0) {
            return sendResponse(404, `No blog found for slug: ${slug}`);
        }
        return sendResponse(200, "Blogs fetched by slug", {
            pageData: matchedBlogs[0],
            relatedBlogs: relatedBlogs.slice(0, 2)
        });


    } catch (error) {
        console.error('Error fetching blog data by slug:', error);
        return sendResponse(500, "Failed to fetch data");
    }

}