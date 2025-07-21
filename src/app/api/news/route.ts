import { fetchData } from "@/utils/fetchData";
import { formateDate } from "@/utils/formateDate";
import { sendResponse } from "@/utils/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams; 
    const page = parseInt(query.get("page") || "1", 10);
    const limit = parseInt(query.get("limit") || "10", 10);

    try {
        const data = await fetchData("media.json");


        if (!data || !Array.isArray(data.data)) {
            return sendResponse(404, "Media data not found or invalid format");
        }

        console.log('Fetched Media Data:', data.data);
        const medias: MediaItem[] = data.data;
        const sortedMedias = medias.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMedias = sortedMedias.slice(startIndex, endIndex).map((blog) => ({
            title: blog.title,
            label: `${formateDate(blog.publishedAt)} • ${blog.publisher}`,
            isExternal: true,
            link: blog.link ?? "",
            image: ""
        }));


        const meta = {
            total: sortedMedias.length,
            page,
            limit,
            totalPages: Math.ceil(sortedMedias.length / limit),
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