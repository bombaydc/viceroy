'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@/components/core/button';
import { cn } from '@/utils/cn';
import Facebook from '@/components/core/share/icons/facebook.svg';
import Twitter from '@/components/core/share/icons/twitter.svg';
import LinkedIn from '@/components/core/share/icons/linkedin.svg';
import WhatsApp from '@/components/core/share/icons/whats-app.svg';
import Copy from '@/components/core/share/icons/copy.svg';
import Share from '@/components/core/share/icons/share.svg';
import './index.scss';

const ShareButton = ({ text = 'Share', id = "share-option", href = '', title = '', description = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<string>("-bottom -right");
    const [copyStatus, setCopyStatus] = useState("Copy Link");

    const shareButtonRef = useRef<HTMLButtonElement>(null);
    const shareOptionsRef = useRef<HTMLDivElement>(null);

    const nativeShareText = `${title}\n${description}`;

    const handlePosition = useCallback(() => {
        const button = shareButtonRef.current;
        const options = shareOptionsRef.current;
        if (!button || !options) return;

        const buttonRect = button.getBoundingClientRect();
        const optionsRect = options.getBoundingClientRect();

        const fitsBelow = buttonRect.bottom + optionsRect.height < window.innerHeight;
        const fitsRight = buttonRect.left + optionsRect.width < window.innerWidth;

        setPosition(`${fitsBelow ? "-bottom" : "-top"} ${!fitsRight ? "-right" : "-left"}`);
    }, []);

    useEffect(() => {
        if (isOpen) handlePosition();
    }, [isOpen, handlePosition]);

    const shareNative = () => {
        const shareLink = href || window.location.href;
        if (navigator.share) {
            navigator.share({
                title,
                text: nativeShareText,
                url: shareLink,
            });
        }
    };

    const share = (platform: string) => {
        const shareLink = href || window.location.href;
        const base = encodeURIComponent(shareLink);
        let url = "";

        switch (platform) {
            case "facebook":
                url = `https://www.facebook.com/sharer/sharer.php?u=${base}&t=${encodeURIComponent(title)}`;
                break;
            case "twitter":
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(nativeShareText)}&url=${base}`;
                break;
            case "linkedin":
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${base}`;
                break;
            case "whatsapp":
                url = `https://api.whatsapp.com/send/?text=${encodeURIComponent(nativeShareText)}%0A${base}`;
                break;
        }

        if (url) {
            window.open(url, "_blank", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600");
        }
    };

    const handleCopyLink = async () => {
        const shareLink = href || window.location.href;
        try {
            await navigator.clipboard.writeText(shareLink);
            updateCopyStatus("Copied");
        } catch {
            fallbackCopy(shareLink);
        }
    };

    const fallbackCopy = (text: string) => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const success = document.execCommand("copy");
            updateCopyStatus(success ? "Copied" : "Failed");
        } catch {
            updateCopyStatus("Failed");
        } finally {
            document.body.removeChild(textarea);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            const button = shareButtonRef.current;
            const options = shareOptionsRef.current;
            if (
                button &&
                options &&
                !button.contains(event.target as Node) &&
                !options.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isOpen]);

    const updateCopyStatus = (status: string) => {
        setCopyStatus(status);
        setTimeout(() => setCopyStatus("Copy Link"), 2000);
    };

    const handleToggle = () => {
        if (window.innerWidth > 768) {
            setIsOpen(prev => !prev);
        } else {
            shareNative();
        }
    };

    return (
        <div className="core-btn-share">
            <Button
                variant="secondary"
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-controls={id}
                aria-haspopup="menu"
                ref={shareButtonRef}
                className="core-btn"
                text={text}
                rightIcon={<Share />}
            />

            <div
                id={id}
                tabIndex={isOpen ? 0 : -1}
                role="menu"
                className={cn("core-btn-share__options", position)}
                ref={shareOptionsRef}
            >
                {[
                    { label: "Facebook", icon: <Facebook />, handler: () => share("facebook") },
                    { label: "Twitter", icon: <Twitter />, handler: () => share("twitter") },
                    { label: "LinkedIn", icon: <LinkedIn />, handler: () => share("linkedin") },
                    { label: "WhatsApp", icon: <WhatsApp />, handler: () => share("whatsapp") },
                    { label: copyStatus, icon: <Copy />, handler: handleCopyLink },
                ].map((item, i) => (
                    <button
                        key={i}
                        onClick={item.handler}
                        type="button"
                        role="menuitem"
                        className="core-btn-share__option-btn"
                        aria-label={item.label}
                    >
                        {item.icon}
                        <p>{item.label}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ShareButton;
