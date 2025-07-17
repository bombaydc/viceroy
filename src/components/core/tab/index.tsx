"use client";
import { createContext, ReactNode, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import './index.scss';
// ─────────────────────────────────────────────
// Contexts
// ─────────────────────────────────────────────

type TabsContextType = {
    activeTab: string;
    setActiveTab: (tabId: string) => void;
    idPrefix: string;
};

const TabsContext = createContext<TabsContextType | null>(null);

export const useTabsContext = (): TabsContextType => {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error("Tabs components must be wrapped in <Tabs>");
    return ctx;
};


type TabsProps = {
    value?: string;
    defaultValue?: string;
    className?: string;
    onValueChange?: (val: string) => void;
    children: ReactNode;
};

export const Tabs: React.FC<TabsProps> = ({
    value: controlledValue,
    defaultValue = "",
    className = "",
    onValueChange,
    children,
}) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const activeTab = controlledValue ?? internalValue;

    const setActiveTab = useCallback(
        (tabId: string) => {
            if (controlledValue === undefined) setInternalValue(tabId);
            onValueChange?.(tabId);
        },
        [controlledValue, onValueChange]
    );

    const idPrefix = useId();

    const contextValue = useMemo(() => ({ activeTab, setActiveTab, idPrefix }), [
        activeTab,
        setActiveTab,
        idPrefix,
    ]);

    return <TabsContext.Provider value={contextValue}>
        <div className={cn("core-tab-group", className)}>
            {children}
        </div>
    </TabsContext.Provider>;
};



export const TabList: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tabListRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (!tabListRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = tabListRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // slight margin
    };

    const scroll = (direction: "left" | "right") => {
        if (!tabListRef.current) return;
        const scrollAmount = tabListRef.current.clientWidth * 0.6;
        tabListRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement | HTMLUListElement>) => {
        if (!tabListRef.current) return;

        // Get all tabs with role="tab" inside the tablist
        const tabs = Array.from(tabListRef.current.querySelectorAll('[role="tab"]'))
            .filter((el): el is HTMLElement => el instanceof HTMLElement);
        const focusedTab = document.activeElement;
        const focusedIndex = tabs.indexOf(focusedTab as HTMLElement);

        if (focusedIndex === -1) return; // No tab is focused

        let newIndex: number | null = null;

        if (event.key === 'ArrowLeft') {
            newIndex = focusedIndex > 0 ? focusedIndex - 1 : tabs.length - 1; // Move to previous tab or wrap to last
        } else if (event.key === 'ArrowRight') {
            newIndex = focusedIndex < tabs.length - 1 ? focusedIndex + 1 : 0; // Move to next tab or wrap to first
        }

        if (newIndex !== null) {
            event.preventDefault(); // Prevent default scrolling behavior
            tabs[newIndex].focus(); // Move focus to the new tab
            tabs[newIndex].click();
            // Optionally, scroll the tab into view
            tabs[newIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    };

    useEffect(() => {
        checkScroll();
        const el = tabListRef.current;
        if (!el) return;

        const handleScroll = () => checkScroll();
        el.addEventListener("scroll", handleScroll);

        const observer = new ResizeObserver(() => checkScroll());
        observer.observe(el);

        return () => {
            el.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);
    return (
        <div className="core-tab-group__tablist-container"
            ref={containerRef}>
            <button className="core-tab-group__prev-btn"
                onClick={() => scroll("left")}
                aria-hidden={!canScrollLeft}
                disabled={!canScrollLeft}
                tabIndex={canScrollLeft ? 0 : -1}
            >
                <svg className="core-tab-group__prev-btn__icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                    <path d="M6.44753 7.18755L9.13086 4.50421L8.51617 3.88953L5.21815 7.18755L8.51617 10.4856L9.13086 9.87088L6.44753 7.18755Z" fill="#6B6B80" />
                </svg>
            </button>
            <div className="core-tab-group__tablist"
                ref={tabListRef}
                role="tablist"
                onKeyDown={handleKeyDown}
                tabIndex={0}
                aria-label="Tab navigation"
            >
                {children}
            </div>
            <button className="core-tab-group__next-btn"
                onClick={() => scroll("right")}
                aria-hidden={!canScrollRight}
                disabled={!canScrollRight}
                tabIndex={canScrollRight ? 0 : -1}
            >
                <svg className="core-tab-group__prev-btn__icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                    <path d="M6.44753 7.18755L9.13086 4.50421L8.51617 3.88953L5.21815 7.18755L8.51617 10.4856L9.13086 9.87088L6.44753 7.18755Z" fill="#6B6B80" />
                </svg>
            </button>
        </div>
    );
};


type TabProps = {
    tabId: string;
    className?: string;
    children: React.ReactNode;
};

export const Tab: React.FC<TabProps> = ({ tabId, children, className = '' }) => {

    const { activeTab, setActiveTab, idPrefix } = useTabsContext();
    const isSelected = activeTab === tabId;

    const tabRef = useRef<HTMLButtonElement>(null);

    const handleClick = () => {
        setActiveTab(tabId);

        const el = tabRef.current;
        const container = el?.closest("ul");
        if (!el || !container) return;

        const leftOffset = 30; // px
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        const isOutOfViewLeft = elRect.left < containerRect.left + leftOffset;
        const isOutOfViewRight = elRect.right > containerRect.right - leftOffset;
        if (isOutOfViewLeft || isOutOfViewRight) {
            const scrollAmount = isOutOfViewLeft
                ? elRect.left - containerRect.left - leftOffset
                : elRect.right - containerRect.right + leftOffset;
            container.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };
    const handleKeyUp = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActiveTab(tabId);
        }
    };

    return (
        // <li className="core-tab-group__tab-wrapper">
        <button
            id={`${idPrefix}-tab-${tabId}`}
            role="tab"
            ref={tabRef}
            tabIndex={0}
            aria-selected={isSelected}
            aria-controls={`${idPrefix}-panel-${tabId}`}
            className={cn("core-tab-group__tab", className, isSelected ? "is-active" : "")}
            onClick={handleClick}
            onKeyUp={handleKeyUp}
            type="button"
        >
            {children}
        </button>
        // </li>
    );
};



type TabPanelProps = {
    tabId: string;
    children: React.ReactNode;
};

export const TabPanel: React.FC<TabPanelProps> = ({ tabId, children }) => {
    const { activeTab, idPrefix } = useTabsContext();

    return activeTab === tabId ? (
        <div
            id={`${idPrefix}-panel-${tabId}`}
            role="tabpanel"
            aria-labelledby={`${idPrefix}-tab-${tabId}`}
            className="py-4"
        >
            {children}
        </div>
    ) : null;
};