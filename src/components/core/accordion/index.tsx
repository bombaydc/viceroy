"use client";

import { cn } from "@/utils/cn";
import React, {
    ReactNode,
    useState,
    useContext,
    createContext, 
    useMemo,
    KeyboardEvent,
    useId,
} from "react";
import './index.scss'; 
// ─────────────────────────────────────────────
// Contexts
// ─────────────────────────────────────────────

type AccordionContextType = {
    openItems: Set<string>;
    toggleItem: (id: string) => void;
    allowMultiple: boolean;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordionContext() {
    const ctx = useContext(AccordionContext);
    if (!ctx) throw new Error("Must be used inside <Accordion>");
    return ctx;
}

type ItemContextType = {
    itemId: string;
};

const ItemContext = createContext<ItemContextType | null>(null);

function useItemContext() {
    const ctx = useContext(ItemContext);
    if (!ctx) throw new Error("Must be used inside <AccordionItem>");
    return ctx;
}

// ─────────────────────────────────────────────
// Accordion Root
// ─────────────────────────────────────────────

type AccordionProps = {
    children: ReactNode;
    allowMultiple?: boolean;
    className?: string;
    defaultOpenItems?: string[];
    
};

const Accordion = ({
    children,
    allowMultiple = false,
    className = '',
    defaultOpenItems = [],
    ...props
}: AccordionProps) => {
    const [openItems, setOpenItems] = useState<Set<string>>(
        new Set(defaultOpenItems)
    );

    const toggleItem = React.useCallback((id: string) => {
        setOpenItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                if (!allowMultiple) newSet.clear();
                newSet.add(id);
            }
            return newSet;
        });
    }, [allowMultiple]);

    const value = useMemo(
        () => ({ openItems, toggleItem, allowMultiple }),
        [openItems, toggleItem, allowMultiple]
    );

    return (
        <AccordionContext.Provider value={value} >
            <div className={cn("core-accordion", className)} {...props}>{children}</div>
        </AccordionContext.Provider>
    );
};

// ─────────────────────────────────────────────
// Accordion Item
// ─────────────────────────────────────────────

const AccordionItem = ({ children, className = '' ,...props }: { children: ReactNode, className?: string }) => {
    const itemId = useId();
    const value = useMemo(() => ({ itemId }), [itemId]);

    return (
        <ItemContext.Provider value={value}>
            <div className={cn("core-accordion-item", className)} {...props}>{children}</div>
        </ItemContext.Provider>
    );
};

// ─────────────────────────────────────────────
// Accordion Header
// ─────────────────────────────────────────────

const AccordionHeader = ({ children }: { children: ReactNode }) => (
    <h3 className="accordion-header">{children}</h3>
);

// ─────────────────────────────────────────────
// Accordion Trigger
// ─────────────────────────────────────────────

const AccordionTrigger = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
    const { openItems, toggleItem } = useAccordionContext();
    const { itemId } = useItemContext();
    const isOpen = openItems.has(itemId);
    const panelId = `panel-${itemId}`;

    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleItem(itemId);
        }
    };

    const handleClick = () => {
        toggleItem(itemId);
    };

    React.useEffect(() => {
        if (isOpen && buttonRef.current) {
            const topOffset = 80; // Adjust this value as needed
            const rect = buttonRef.current.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = rect.top + scrollTop - topOffset;
            window.scrollTo({ top: targetY, behavior: "smooth" });
        }
    }, [isOpen]);

    return (
        <button
            ref={buttonRef}
            id={`trigger-${itemId}`}
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={cn("core-accordion-item__btn", className)} 
            type="button"
        >
            <span className="core-accordion-item__btn-text">
                {children}
            </span>
            <div className="core-accordion-item__btn-icon-wrapper">
                <svg className="core-accordion-item__btn-icon core-accordion-item__btn-icon--chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path className="core-accordion-item__btn-icon-arrow-path"
                        d="M8.99982 11.0076C8.90944 11.0076 8.82532 10.9932 8.74744 10.9643C8.66957 10.9354 8.59551 10.8859 8.52526 10.8158L5.15457 7.44514C5.05082 7.34126 4.99769 7.2107 4.99519 7.05345C4.99282 6.89632 5.04594 6.76339 5.15457 6.65464C5.26332 6.54601 5.39507 6.4917 5.54982 6.4917C5.70457 6.4917 5.83632 6.54601 5.94507 6.65464L8.99982 9.70957L12.0546 6.65464C12.1584 6.55089 12.289 6.49776 12.4463 6.49526C12.6034 6.49289 12.7363 6.54601 12.8451 6.65464C12.9537 6.76339 13.008 6.89514 13.008 7.04989C13.008 7.20464 12.9537 7.33639 12.8451 7.44514L9.47438 10.8158C9.40413 10.8859 9.33007 10.9354 9.25219 10.9643C9.17432 10.9932 9.09019 11.0076 8.99982 11.0076Z"
                        fill="#6B6B80" />
                </svg>
            </div>
        </button>
    );
};


// ─────────────────────────────────────────────
// Accordion Content
// ─────────────────────────────────────────────

const AccordionContent = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
    const { openItems } = useAccordionContext();
    const { itemId } = useItemContext();
    const isOpen = openItems.has(itemId);
    const panelId = `panel-${itemId}`;
    const triggerId = `trigger-${itemId}`;
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isOpen && contentRef.current) {
            contentRef.current.focus({ preventScroll: true });
        }
    }, [isOpen]);

    return (
        <section
            ref={contentRef}
            id={panelId}
            aria-labelledby={triggerId}
            inert={isOpen} 
            className={cn("core-accordion-item__content-outer", className)}
        >
            <div className="core-accordion-item__content">
                <div className="core-accordion-item__content-inner">
                    {children}
                </div>
            </div>
        </section>
    );
};


// ─────────────────────────────────────────────
// Composition API
// ───────────────────────────────────────────── 

export { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent };