import { fetchData } from "@/utils/fetchData";
import { formateDate } from "@/utils/formateDate";
import { sendResponse } from "@/utils/response";
import { NextRequest } from "next/server";
 
export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams;
    const type = query.get("type") ?? 'all';
    const page = parseInt(query.get("page") || "1", 10);
    const limit = parseInt(query.get("limit") || "10", 10);

    try {
        const data = await fetchData("blog.json");

        if (!data || !Array.isArray(data.data)) {
            return sendResponse(404, "Blog data not found or invalid format");
        }
        const blogs: BlogItem[] = data.data;
        const sortedBlogs = blogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        const filteredBlogs = type === "all" ? sortedBlogs : sortedBlogs.filter((blog) => blog.type.toLowerCase() === type.toLowerCase());
        const uniqueBlogTypes = Array.from(new Set(blogs.map((blog) => blog.type.toLowerCase())));

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex).map((blog) => ({
            title: blog.title,
            label: `${formateDate(blog.publishedAt)} • ${blog.publisher}`,
            isExternal: false,
            link: `/blogs/${blog.slug}`,
            image: blog.desktopimage?.url || "",
        }));

        const meta = {
            total: filteredBlogs.length,
            page,
            limit,
            totalPages: Math.ceil(filteredBlogs.length / limit),
        };

        return sendResponse(200, "Blogs fetched successfully", {
            medias: paginatedBlogs,
            types: uniqueBlogTypes,
            meta,
        });

    } catch (error) {
        console.error('Error fetching blog data:', error);
        return sendResponse(500, "Failed to fetch data");
    }

}