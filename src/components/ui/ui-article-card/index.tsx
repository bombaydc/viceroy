import Button from '@/components/core/button';
import Image from '@/components/core/image';
import Link from 'next/link';
import './index.scss';
import { cn } from '@/utils/cn';

interface ArticleCardProps {
    title: string;
    image?: string;
    label?: string;
    href?: string;
    isExternal?: boolean;
    hasImage?: boolean;
    description?: string;
    props?: React.HTMLAttributes<HTMLDivElement>;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title = '', image = '', label = '', href = '', isExternal = false, hasImage = true, ...props }) => {
    return (
        <Link href={href} className={cn('ui-article-card', !hasImage && 'ui-article-card--news-card')} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined} {...props}>
            <div className="ui-article-card__wrapper">
                {hasImage && <Image src={image} alt={title} width={392} height={260} className='ui-article-card__image' />}
                <div className="ui-article-card__content">
                    {label && <p className='ui-article-card__label'>{label}</p>}
                    <h6 className='ui-article-card__title'>{title}</h6>
                    {isExternal ? <Button tag='div' variant='tertiary' text='Read More' rightIcon={<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <g stroke="#2B3E31" strokeMiterlimit="10" clipPath="url(#clip0)"> <path d="M12.918 3.586 3.815 12.689" /> <path d="M5.743 3.587h7.174v7.17" /> </g> <defs> <clipPath id="clip0"> <rect width="16" height="16" fill="#fff" transform="translate(0.5)" /> </clipPath> </defs> </svg>} className='ui-article-card__button' /> : <Button tag='div' variant='tertiary' text='Read More' className='ui-article-card__button' />}
                </div>
            </div>
        </Link>
    )
}

export default ArticleCard