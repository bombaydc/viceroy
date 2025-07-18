import ArticleListing from "@/components/ui/ui-article-listing"
import SectionHead from "@/components/ui/ui-section-head"
import { callApi } from "@/utils/apiClient";
import { fetchData } from "@/utils/fetchData";
import { createMetadata } from "@/utils/meta";


export async function generateMetadata() {
  const pageData = await fetchData("blog-landing.json");
  return createMetadata({ ...pageData?.data.seo, canonical: `/blogs/` });
}



const page = async (context: { searchParams: { type: string } }) => {
  const { type } = context.searchParams;
  const pageData = await fetchData("blog-landing.json");
  const blogData = await callApi("blogs", { params: { type } });
  const { medias, types, meta } = blogData.data;

  const options = [
    { label: "All", value: "/blogs" },
    ...types.map((type: string) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: `/blogs?type=${type}`
    }))
  ];
  return (
    <>
      <SectionHead label={pageData.data.blogLanding.preTitle} title={pageData.data.blogLanding.Title} description={pageData.data.blogLanding.Description} />
      <ArticleListing type={type ?? 'all'} options={options} medias={medias} meta={meta} endpoint="blogs" />
    </>
  )
}

export default page