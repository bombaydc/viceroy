import { fetchData } from "@/utils/fetchData";
import { formateDate } from "@/utils/formateDate";
import { sendResponse } from "@/utils/response";
import { NextRequest } from "next/server";


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
        const data = await fetchData("media.json");


        if (!data || !Array.isArray(data.data)) {
            return sendResponse(404, "Media data not found or invalid format");
        }

        console.log('Fetched Media Data:', data.data);
        const medias: BlogItem[] = data.data;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMedias = medias.slice(startIndex, endIndex).map((blog) => ({
            title: blog.title,
            label: `${formateDate(blog.publishedAt)} • ${blog.publisher}`,
            isExternal: true,
            link: blog.link ?? "",
            image: ""
        }));


        const meta = {
            total: medias.length,
            page,
            limit,
            totalPages: Math.ceil(medias.length / limit),
        };

        return sendResponse(200, "Medias fetched successfully", {
            medias: paginatedMedias,
            meta,
        });

    } catch (error) {
        console.error('Error fetching Media data:', error);
        return sendResponse(500, "Failed to fetch data");
    }

}