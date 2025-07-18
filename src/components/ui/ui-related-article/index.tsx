import ArticleCard from "@/components/ui/ui-article-card";
import './index.scss';
import { Slider, SliderContent, SliderIndicator, SliderItem } from "@/components/core/slider";
import Stagger from "@/components/motion/stagger";
interface RealatedArticleProps {
    title: string;
    data: any[];
}


const RealatedArticle: React.FC<RealatedArticleProps> = ({ title, data }) => {
    if (!data || data.length === 0) {
        return null;
    }
    return (
        <Stagger as={"section"} className="ui-related-article">
            <div className="ui-related-article__container"> 
                <h4 className="ui-related-article__title" data-stagger-motion-index={1} data-stagger-motion-type="md">
                    {title}
                </h4> 
                <div data-stagger-motion-index={2} data-stagger-motion-type="md">
                    <Slider className=" ui-related-article__list">
                        <SliderContent>
                            {
                                data.map((blog: any, index: number) => (
                                    <SliderItem key={index} className="ui-related-article__item">
                                        <ArticleCard
                                            title={blog.title}
                                            href={blog.link}
                                            isExternal={blog.isExternal}
                                            label={blog.label}
                                            image={blog.desktopimage?.url ?? ""}
                                        />
                                    </SliderItem>
                                ))}
                        </SliderContent>
                        <SliderIndicator />

                    </Slider>
                </div>
            </div>
        </Stagger>
    )
}

export default RealatedArticle