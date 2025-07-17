import { fetchData } from "@/utils/fetchData";
import { sendResponse } from "@/utils/response";
import { NextRequest } from "next/server";
import { types } from "util";


interface BlogItem {
    slug: string;
    type: string;
    [key: string]: any;
}

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
        let filteredBlogs = type === "all" ? blogs : blogs.filter((blog) => blog.type.toLowerCase() === type);
        const uniqueBlogTypes = Array.from(
            new Set(blogs.map((blog) => blog.type.toLowerCase()))
        );

        // 📄 Pagination logic
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

        const meta = {
            total: filteredBlogs.length,
            page,
            limit,
            totalPages: Math.ceil(filteredBlogs.length / limit),
        };

        return sendResponse(200, "Blogs fetched successfully", {
            blogs: paginatedBlogs,
            types: uniqueBlogTypes,
            meta,
        });

    } catch (error) {
        console.error('Error fetching blog data:', error);
        return sendResponse(500, "Failed to fetch data");
    }

}