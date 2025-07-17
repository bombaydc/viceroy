"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { disableScroll, enableScroll } from "@/utils/scroll";
import { cn } from "@/utils/cn";
import './index.scss';
import { v4 as uuidv4 } from 'uuid';
import Button from "../button";

// ─────────────────────────────────────────────
// Contexts
// ─────────────────────────────────────────────

type ModalContextType = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
    titleId: string;
    contentId: string;
    descriptionId: string;
    onOpenChange?: (open: boolean) => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

function useModalContext() {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("Modal components must be wrapped in <Modal>");
    return ctx;
}

// ─────────────────────────────────────────────
// Modal Root
// ─────────────────────────────────────────────

type ModalProps = {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    children,
}) => {
    const [openState, setOpenState] = useState(defaultOpen);
    const open = openProp ?? openState;
    const setOpen = useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
        (u) => {
            const value = typeof u === "function" ? (u as (prev: boolean) => boolean)(open) : u;
            if (openProp === undefined) setOpenState(u);
            onOpenChange?.(value);
        },
        [openProp, onOpenChange, open]
    );
    const id = uuidv4();

    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const contentId = `modal-content-${id}`;
    const titleId = `modal-title-${id}`;
    const descriptionId = `modal-desc-${id}`;

    // Return focus to trigger on close
    useEffect(() => {
        if (!open) {
            triggerRef.current?.focus();
        }
    }, [open]);

    // ESC to close
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, setOpen]);
    const contextValue = useMemo(() => ({
        open,
        setOpen,
        triggerRef,
        contentRef,
        contentId,
        titleId,
        descriptionId,
        onOpenChange,
    }), [open, setOpen, triggerRef, contentRef, contentId, titleId, descriptionId, onOpenChange]);

    return (
        <ModalContext.Provider
            value={contextValue}
        >
            {children}
        </ModalContext.Provider>
    );
};

// ─────────────────────────────────────────────
// Modal Trigger
// ─────────────────────────────────────────────

const ModalTrigger: React.FC<React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>> = ({
    children,
    ...props
}) => {
    const { setOpen } = useModalContext();
 
    return (
        <Button
            type="button"
            tabIndex={0}
            className={cn("core-modal__trigger", props.className)}
            onClick={() => setOpen(true)}
            {...props}
        >
            {children}
        </Button>
    );
};

// ─────────────────────────────────────────────
// Modal Content
// ─────────────────────────────────────────────

function focusFirstDescendant(parent: HTMLElement): boolean {
    for (const child of Array.from(parent.children) as HTMLElement[]) {
        const isDisabled =
            (child instanceof HTMLButtonElement || child instanceof HTMLInputElement || child instanceof HTMLTextAreaElement || child instanceof HTMLOptionElement || child instanceof HTMLFieldSetElement)
                ? child.disabled
                : false;
        if (child.tabIndex >= 0 && !isDisabled) {
            child.focus();
            return true;
        }
        if (focusFirstDescendant(child)) return true;
    }
    return false;
}

const ModalContent = ({
    children,
    className = '',
    size = 'default',
    align = 'default',
    side = 'default'
}: {
    children: React.ReactNode, className?: string,
    align?: 'start' | 'default' | 'end',
    side?: 'default' | 'left' | 'right',
    size?: 'default' | 'small' | 'medium' | 'full'
}) => {
    const { open, triggerRef, contentId, titleId, descriptionId, setOpen } = useModalContext();
    const contentRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Focus trap on mount
    useEffect(() => {
        if (open && contentRef.current) {
            // Delay focus to allow rendering
            window.requestAnimationFrame(() =>
                focusFirstDescendant(contentRef.current!)
            );
        }
    }, [open, contentRef]);
    // ESC to close
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };
        document.documentElement.classList.toggle("html--modal-dimmer-visible", open);
        if (open) {
            document.addEventListener("keydown", handleKey);
            disableScroll();
        } else {
            enableScroll();
            // Pause any playing video inside the modal (including YouTube iframes)
            if (contentRef.current) {
                // Pause <video> elements
                const videos = contentRef.current.querySelectorAll("video");
                videos.forEach((video) => {
                    if (!video.paused) {
                        video.pause();
                    }
                });

                // Pause YouTube iframes
                const iframes = contentRef.current.querySelectorAll("iframe[src*='youtube-nocookie.com'],iframe[src*='youtube.com']");
                iframes.forEach((iframe) => {
                    const iframeEl = iframe as HTMLIFrameElement;
                    const iframeSrc = iframeEl.src;
                    if (iframeSrc.includes("youtube.com") || iframeSrc.includes("youtube-nocookie.com")) {
                        iframeEl.contentWindow?.postMessage('{"event":"command","func":"stopVideo","args":""}', window.location.origin);
                    }
                });
            }
        }
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, triggerRef, setOpen]);

    // Click outside to close
    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
            setOpen(false);
            triggerRef.current?.focus();
        }
    }, [setOpen, triggerRef]);

    useEffect(() => {
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, handleClickOutside]);

    if (!mounted) return null;
    const alignClasses = { 'default': '', 'start': 'core-modal--start', 'end': 'core-modal--end' };
    const sideClasses = { 'default': '', 'left': 'core-modal--left', 'right': 'core-modal--right' };
    const sizeClasses = { 'default': '', 'small': 'core-modal--small', 'medium': 'core-modal--medium', 'full': 'core-modal--full' };
    return createPortal(
        <dialog
            hidden={!open}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            id={contentId}
            aria-hidden={!open}
            open={open}
            className={cn("core-modal", className, sizeClasses[size], alignClasses[align || ''], sideClasses[side], open ? 'core-modal--open' : '')}
        >
            <div
                ref={contentRef}
                className={cn("core-modal__dialog")}
            >
                <div className="core-modal__dialog-inner">
                    {children}
                </div>
            </div>
        </dialog>,
        document.body
    );
};


// ─────────────────────────────────────────────
// Modal Header
// ─────────────────────────────────────────────

const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    ...props
}) => (
    <div className={cn("core-modal__header", props.className)} {...props}>
        {children}
    </div>
);

// ─────────────────────────────────────────────
// Modal Title
// ─────────────────────────────────────────────

const ModalTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
    children,
    className = '',
    ...props
}) => {
    const { titleId } = useModalContext();
    return (
        <h2 id={titleId} className={cn("core-modal-title", className)}  {...props}>
            {children}
        </h2>
    );
};


// ─────────────────────────────────────────────
// Modal Description
// ─────────────────────────────────────────────

const ModalDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    ...props
}) => {
    const { descriptionId } = useModalContext();
    return (
        <div id={descriptionId} className={cn(props.className)} {...props}>
            {children}
        </div>
    );
};


// ─────────────────────────────────────────────
// Modal Close
// ─────────────────────────────────────────────

const ModalClose: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    children,
    ...props
}) => {
    const { setOpen } = useModalContext();
    return (
        <button
            type="button"
            aria-label="Close modal"
            onClick={() => setOpen(false)}
            className={cn("core-modal__close-btn", props.className)}
            {...props}
        >
            {children ?? <svg className="sample-modal__close-btn-icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path className="sample-modal__close-btn-icon-path" d="M7.99903 8.70251L4.61703 12.0847C4.5247 12.1769 4.40864 12.2241 4.26886 12.2263C4.1292 12.2285 4.01103 12.1812 3.91436 12.0847C3.81781 11.988 3.76953 11.8709 3.76953 11.7333C3.76953 11.5958 3.81781 11.4787 3.91436 11.382L7.29653 8.00001L3.91436 4.61801C3.82214 4.52568 3.77492 4.40962 3.7727 4.26984C3.77059 4.13017 3.81781 4.01201 3.91436 3.91534C4.01103 3.81879 4.12814 3.77051 4.2657 3.77051C4.40325 3.77051 4.52036 3.81879 4.61703 3.91534L7.99903 7.29751L11.381 3.91534C11.4734 3.82312 11.5894 3.7759 11.7292 3.77367C11.8689 3.77156 11.987 3.81879 12.0837 3.91534C12.1803 4.01201 12.2285 4.12912 12.2285 4.26667C12.2285 4.40423 12.1803 4.52134 12.0837 4.61801L8.70153 8.00001L12.0837 11.382C12.1759 11.4743 12.2231 11.5904 12.2254 11.7302C12.2275 11.8698 12.1803 11.988 12.0837 12.0847C11.987 12.1812 11.8699 12.2295 11.7324 12.2295C11.5948 12.2295 11.4777 12.1812 11.381 12.0847L7.99903 8.70251Z" fill="#707070"></path>
            </svg>}
        </button>
    );
};


export { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalClose };