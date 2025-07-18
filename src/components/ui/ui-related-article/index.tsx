import ArticleCard from "@/components/ui/ui-article-card"; 

interface RealatedArticleProps {
    title: string;
    data: any[];  
}


const RealatedArticle: React.FC<RealatedArticleProps> = ({ title, data }) => {
    if (!data || data.length === 0) {
        return null; 
    }
    return (
        <section className="ui-related-article">
            <div className="ui-related-article__container">

                <h4 className="ui-related-article__title">
                    {title}
                </h4>
                <ul className="ui-related-article__list">
                    {
                        data.map((blog: any, index: number) => (
                            <li key={index} className="ui-article-listing__item">
                                <ArticleCard
                                    title={blog.title}
                                    href={`/blogs/${blog.slug}`}
                                    label={`${blog.publisher}`}
                                    image={blog.desktopimage?.url ?? ""}
                                />
                            </li>
                        ))}
                </ul>
            </div>
        </section>
    )
}

export default RealatedArticle