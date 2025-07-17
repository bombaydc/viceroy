import BlogListing from "@/components/ui/BlogListing"
import SectionHead from "@/components/ui/SectionHead"
import { callApi } from "@/utils/apiClient";
import { fetchData } from "@/utils/fetchData";
import { createMetadata } from "@/utils/meta";


export async function generateMetadata() {
  const pageData = await fetchData("blog-landing.json");
  return createMetadata({ ...pageData?.data.seo, canonical: `/blogs/` });
}



const page = async ( context: { searchParams: { type: string } }) => {
  const { type } = context.searchParams;
  const pageData = await fetchData("blog-landing.json");
  const blogData = await callApi("blogs", {params: { type } });
  const { blogs, types, meta } = blogData.data;

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
      <BlogListing type={type ?? 'all'}  options={options} blogs={blogs} meta={meta}/>
    </>
  )
}

export default page