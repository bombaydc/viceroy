import Button from '@/components/core/button';
import Image from '@/components/core/image';
import Link from 'next/link';
import './index.scss';

interface ArticleCardProps {
    title: string;
    image?: string;
    label?: string;
    href?: string;
    isExternal?: boolean;
    description?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title = '', image = '', label = '', href = '', isExternal = false }) => {
    return (
        <Link href={href} className="ui-article-card">
            <div className="ui-article-card__wrapper">
                <Image src={image} alt={title} width={392} height={260} className='ui-article-card__image' />
                <div className="ui-article-card__content">
                    {label && <p className='ui-article-card__label'>{label}</p>}
                    <h6 className='ui-article-card__title'>{title}</h6>
                    <Button tag='div' variant='tertiary' text='Read More' className='ui-article-card__button' />
                </div>
            </div>
        </Link>
    )
}

export default ArticleCard