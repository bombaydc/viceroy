
import Image from 'next/image';
import './index.scss';
import Link from 'next/link';
import { fetchData } from '@/utils/fetchData';

const Footer = async () => {
    const data = await fetchData('common.json');
    console.log('Footer Data:', data.data.legalCard);


    return (
        <footer className="ui-footer">
            <div className="ui-footer__container">
                <div className="ui-footer__wrapper">
                    <div className='ui-footer__menus'>
                        <ul className='ui-footer__menu-list'>
                            <li className='ui-footer__menu-item'>
                                <Link href={'/'} className='ui-footer__menu-link'>Home</Link>
                            </li>
                            <li className='ui-footer__menu-item'>
                                <Link href={'/'} className='ui-footer__menu-link'>About</Link>
                            </li>
                            <li className='ui-footer__menu-item'>
                                <Link href={'/'} className='ui-footer__menu-link'>Careers</Link>
                            </li>
                        </ul>
                        <ul className='ui-footer__menu-list'>
                            <li className='ui-footer__menu-item'>
                                <Link href={'/'} className='ui-footer__menu-link'>Projects</Link>
                            </li>
                            <li className='ui-footer__menu-item'>
                                <Link href={'/'} className='ui-footer__menu-link'>SAVĀNA</Link>
                            </li>
                            <li className='ui-footer__menu-item'>
                                <Link href={'/'} className='ui-footer__menu-link'>PRIVÉ</Link>
                            </li>
                            <li className='ui-footer__menu-item'>
                                <Link href={'/'} className='ui-footer__menu-link'>VERSOVA</Link>
                            </li>
                        </ul>

                    </div>
                    <Link className='ui-footer__logo-anchor' href={""} aria-label='Home Page'><Image src={'/assets/common/logo/dark-logo.svg'} alt="logo" width={194} height={46} className='ui-footer__logo' /></Link>
                </div>
                <div className="ui-footer__bottom">
                    {
                        data.data.legalCard && data.data.legalCard.length > 0 &&
                        <ul className='ui-footer__links'>
                            {
                                data.data.legalCard.map((item: any, index: number) =>
                                    item.link && item.title &&
                                    <li className='ui-footer__link-item' key={index} >
                                        <Link href={item.link} className='ui-footer__link' target={item.target || '_self'}>{item.title}</Link>
                                    </li>
                                )
                            }
                        </ul>
                    }
                    {
                        data.data.social && data.data.social.length > 0 &&
                        <ul className='ui-footer__social-links'>
                            {
                                data.data.social.map((item: any, index: number) =>
                                    item.buttonIcon && item.buttonLink &&
                                    <li className='ui-footer__link-item'>
                                        <Link key={index} href={item.buttonLink} className='ui-footer__link' target={'_blank'}>
                                            <Image src={item.buttonIcon?.url ?? ''} alt={item.buttonText} width={24} height={24} />
                                        </Link>
                                    </li>
                                )
                            }
                        </ul>
                    }
                    {
                        data.data.copyright &&
                        <p className='ui-footer__copyright'>{data.data.copyright}</p>
                    }
                </div>
            </div>
        </footer>
    )
}

export default Footer