import RichTextContent from "@/components/ui/ui-rich-text-content";
import ShareButton from "@/components/core/share";
import Image from "@/components/core/image";
import './index.scss';

const ArticleDetails = ({ title = '', description = '', content = '', label = '', image = "" }) => {
    let index = 0;
    return (
        <section data-stagger-motion-observer className='ui-article-details' >
            <div className='ui-article-details__container'>
                <div className="ui-article-details__content">
                    {label && <p className='ui-article-details__label' data-stagger-motion-index={index++} data-stagger-motion-type="sm">{label}</p>}
                    <h1 className={`ui-article-details__title`} data-stagger-motion-index={index++} data-stagger-motion-type="sm">{title}</h1>
                    <p className={`ui-article-details__description`} data-stagger-motion-index={index++} data-stagger-motion-type="sm">{description}</p>
                    <ShareButton id="share-option1" title={title} description={description} />
                </div>
                <div className="ui-article-details__wrapper" data-stagger-motion-index={index++} data-stagger-motion-type="sm">
                    <Image src={image} width={795} height={529} className="ui-article-details__banner" alt={title} priority />
                    {content ? <RichTextContent content={content} /> : ''}
                </div>
                <ShareButton id="share-option2" title={title} description={description} />

            </div>
        </section>
    )
}
export default ArticleDetails