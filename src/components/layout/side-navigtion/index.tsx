'use client';
import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const SideNavigation = () => {
    const pathname = usePathname(); 
    return (
        <aside className="component-listing-sidenav" aria-labelledby="component-listing-sidenav-title">
            <h2 id="component-listing-sidenav-title" className="component-listing-sidenav__title u-sr-only">On This Page</h2>
            <nav className="component-listing-sidenav__nav" aria-label="doc-sidenav navigation">
                <ul className="component-listing-sidenav__list">
                    {
                        menus.map((menu) => { 
                            const isActive = pathname === menu.href; 
                            return (
                                <li key={menu.href} className="component-listing-sidenav__item">
                                    <Link href={menu.href} className={cn("component-listing-sidenav__link", isActive ? 'is-active' : '')}>{menu.label}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
        </aside >
    )
}

export default SideNavigation