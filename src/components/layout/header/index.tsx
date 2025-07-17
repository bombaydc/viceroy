'use client';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
const menus = [
    {
        href: "/components/accordion/", label: "Accordion"
    },
    {
        href: "/components/alert/", label: "Alert"
    },
    {
        href: "/components/breadcrumbs/", label: "Breadcrumbs"
    },
    {
        href: "/components/slider/", label: "Card Slider"
    },
    {
        href: "/components/inputs/", label: "Inputs"
    },
    {
        href: "/components/loader/", label: "Loader"
    },
    {
        href: "/components/modal/", label: "Modal"
    },
    {
        href: "/components/tab/", label: "Tab Group"
    },

];

const Header = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className={cn("core-design-system-header", isOpen ? 'is-open' : '')}>
            <div className="core-design-system-header__inner">
                <Link href="/components" className="core-design-system-header__logo" aria-label="Go to homepage">
                    <span className="core-design-system-header__logo__icon" aria-label="Design System Logo" ></span>
                    <p className="core-design-system-header__logo__copy">Design System</p>
                </Link>
                <nav className="core-design-system-header__nav" aria-label="Main navigation">
                    <ul className="core-design-system-header__nav-list">
                        {
                            menus.map((menu) => {
                                const isActive = pathname === menu.href;
                                return (
                                    <li key={menu.href} className="core-design-system-header__nav-item">
                                        <Link href={menu.href} onClick={() => setIsOpen(false)} className={cn("core-design-system-header__nav-link", isActive ? 'is-active' : '')}>{menu.label}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>
                <button type="button" onClick={() => setIsOpen(!isOpen)} className="core-design-system-header__navbar-toggle" aria-label="toggle menu">
                    <svg className="core-design-system-header__menu-open-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.66675 21.6345V20.1347H27.3334V21.6345H4.66675ZM4.66675 16.75V15.25H27.3334V16.75H4.66675ZM4.66675 11.8652V10.3655H27.3334V11.8652H4.66675Z" fill="#5C5C64" />
                    </svg>
                    <svg className="core-design-system-header__menu-close-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_b_130_6210)">
                            <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="white" />
                            <path d="M0.5 16C0.5 7.43959 7.43959 0.5 16 0.5C24.5604 0.5 31.5 7.43959 31.5 16C31.5 24.5604 24.5604 31.5 16 31.5C7.43959 31.5 0.5 24.5604 0.5 16Z" stroke="#E1E1E3" />
                            <mask id="mask0_130_6210" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="8" y="8" width="16" height="16">
                                <rect x="8" y="8" width="16" height="16" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_130_6210)">
                                <path d="M16 16.7025L12.618 20.0847C12.5257 20.1769 12.4096 20.2241 12.2698 20.2263C12.1302 20.2285 12.012 20.1812 11.9153 20.0847C11.8188 19.988 11.7705 19.8709 11.7705 19.7333C11.7705 19.5958 11.8188 19.4787 11.9153 19.382L15.2975 16L11.9153 12.618C11.8231 12.5257 11.7759 12.4096 11.7737 12.2698C11.7716 12.1302 11.8188 12.012 11.9153 11.9153C12.012 11.8188 12.1291 11.7705 12.2667 11.7705C12.4042 11.7705 12.5213 11.8188 12.618 11.9153L16 15.2975L19.382 11.9153C19.4743 11.8231 19.5904 11.7759 19.7302 11.7737C19.8698 11.7716 19.988 11.8188 20.0847 11.9153C20.1812 12.012 20.2295 12.1291 20.2295 12.2667C20.2295 12.4042 20.1812 12.5213 20.0847 12.618L16.7025 16L20.0847 19.382C20.1769 19.4743 20.2241 19.5904 20.2263 19.7302C20.2285 19.8698 20.1812 19.988 20.0847 20.0847C19.988 20.1812 19.8709 20.2295 19.7333 20.2295C19.5958 20.2295 19.4787 20.1812 19.382 20.0847L16 16.7025Z" fill="#707070" />
                            </g>
                        </g>
                        <defs>
                            <filter id="filter0_b_130_6210" x="-40" y="-40" width="112" height="112" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feGaussianBlur in="BackgroundImageFix" stdDeviation="20" />
                                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_130_6210" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_130_6210" result="shape" />
                            </filter>
                        </defs>
                    </svg>

                </button>
            </div>
        </header>

    )
}

export default Header