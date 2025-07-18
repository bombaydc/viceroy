import RichTextContent from "@/components/ui/ui-rich-text-content";
import './index.scss';
import ShareButton from "@/components/core/share";
import Stagger from "@/components/motion/stagger";

const ArticleDetails = ({ title = '', description = '', content = '', label = '' }) => {
    return (
        <Stagger as={"section"} className='ui-article-details' >
            <div className='ui-article-details__container'>
                <div className="ui-article-details__content">
                    {label && <p className='ui-article-details__label'>{label}</p>}
                    <h1 className={`ui-article-details__title`}>{title}</h1>
                    <p className={`ui-article-details__description`}>{description}</p>
                    <ShareButton id="share-option1" title={title} description={description} />
                </div>
                {content ? <RichTextContent content={content} /> : ''}
                <ShareButton id="share-option2" title={title} description={description} />
                
            </div>
        </Stagger>
    )
}
export default ArticleDetails