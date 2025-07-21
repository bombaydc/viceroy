import ArticleListing from "@/components/ui/ui-article-listing"; 
import SectionHead from "@/components/ui/ui-section-head";
import { callApi } from "@/utils/apiClient";
import { fetchData } from "@/utils/fetchData";
import { createMetadata } from "@/utils/meta";


export async function generateMetadata() {
  const pageData = await fetchData("media-landing.json");
  return createMetadata({ ...pageData?.data.seo, canonical: `/news/` });
}

const page = async (context: { searchParams: { type: string } }) => {
  const { type } = context.searchParams;
  const pageData = await fetchData("media-landing.json");
  const blogData = await callApi("news", { params: { type } });
  const { medias, meta } = blogData.data;
  return (
    <>
      <SectionHead label={pageData.data.mediaLanding.preTitle} title={pageData.data.mediaLanding.Title} description={pageData.data.mediaLanding.Description} />
      <ArticleListing medias={medias} meta={meta} endpoint="news" className="--grid" />
    </>
  )
}

export default page