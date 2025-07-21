import ArticleDetails from '@/components/ui/ui-article-details';
import RealatedArticle from '@/components/ui/ui-related-article';
import { callApi } from '@/utils/apiClient';
import { fetchData } from '@/utils/fetchData';
import { createMetadata } from '@/utils/meta';
import { notFound } from 'next/navigation';



export async function generateStaticParams() {
  const { data } = await fetchData("blog.json");
  if (!data || !Array.isArray(data.data)) {
    return [];
  }
  return data.map(({ slug }: { slug: string }) => ({
    slug,
  }))
}



export async function generateMetadata(context: { params: { slug: string } }) {
  const { slug } = context.params;
  const pageData = await callApi(`blogs/${slug}`);

  const metaData = {
    metaTitle: pageData.data?.title ?? "Blog Article",
    metaDescription: pageData.data?.shortDesc ?? "Read this case studies.",
  };

  return createMetadata({
    ...metaData,
    canonical: `/${slug}`
  });
}




const page = async (context: { params: { slug: string } }) => {
  const { slug } = context.params;
  const fetchedData = await callApi(`blogs/${slug}`);

  const { pageData, relatedBlogs } = fetchedData.data;

  if (!pageData) {
    notFound();
  } 
  
  return (
    <>
      <ArticleDetails image={pageData.desktopimage.url} title={pageData.title} content={pageData.details} description={pageData.shortDesc} label={pageData.publisher} />
      <RealatedArticle title='Related Articles' data={relatedBlogs ?? []} />
    </>
  )
}

export default page