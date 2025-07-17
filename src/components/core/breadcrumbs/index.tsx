'use client';
import React, { useEffect, useState, useCallback } from "react";
import './index.scss'
import Link from "next/link";
import { cn } from "@/utils/cn";
// Define the shape of a breadcrumb item
interface BreadcrumbItem {
    href: string;
    title: string;
    isCurrentPage?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    threshold?: number
    className?: string
}

const COLLAPSE_WIDTH = 768;
const ITEM_THRESHOLD = 2;

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, threshold = ITEM_THRESHOLD, className = "" }) => {
    const [collapsed, setCollapsed] = useState(false);

    // Check if we should collapse based on window size and item count
    const updateCollapseState = useCallback(() => {
        const shouldCollapse = window.innerWidth < COLLAPSE_WIDTH && items.length > threshold;
        setCollapsed(shouldCollapse);
    }, [items, threshold]);

    useEffect(() => {
        updateCollapseState(); // Initial check
        window.addEventListener("resize", updateCollapseState);
        return () => window.removeEventListener("resize", updateCollapseState);
    }, [updateCollapseState]);

    const handleExpand = (e: React.MouseEvent) => {
        e.preventDefault();
        setCollapsed(false);
    };

    const renderItem = (item: BreadcrumbItem, key: string | number) => (
        <li key={key} className="core-breadcrumbs__list-item">
            <Link href={item.href} className={cn(
                "core-breadcrumbs__crumb",
                "core-breadcrumbs__crumb--link",
                item.isCurrentPage && "core-breadcrumbs__crumb--current"
            )} aria-current={item.isCurrentPage ? "page" : undefined}>
                {item.title}
            </Link>
        </li>
    );

    const renderCollapsedItems = () => {
        const lastSecondLink = items[items.length - 2];
        const last = items[items.length - 1];
        return (
            <>
                <li className="core-breadcrumbs__list-item core-breadcrumbs__expand-btn">
                    <button
                        type="button"
                        onClick={handleExpand}
                        className="core-breadcrumbs__crumb core-breadcrumbs__crumb--link"
                        aria-label="Expand breadcrumbs"
                    >
                        ...
                    </button>
                </li>
                {renderItem(lastSecondLink, "lastSecondLink")}
                {renderItem(last, "last")}
            </>
        );
    };

    return (
        <div className={cn("core-breadcrumbs", className)}>
            <nav className="core-breadcrumbs__nav" aria-label="Breadcrumb">
                <ol className="core-breadcrumbs__list">
                    {collapsed ? renderCollapsedItems() : items.map((item, idx) => renderItem(item, idx))}
                </ol>
            </nav>
        </div>
    );
};

export default Breadcrumbs;
