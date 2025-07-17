'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import './index.scss';
import { cn } from "@/utils/cn";

interface SliderContextType {
    sliderRef: React.RefObject<HTMLUListElement | null>;
    currentIndex: number;
    scrollToIndex: (index: number) => void;
    setCurrentIndex: (index: number) => void;
    next: () => void;
    prev: () => void;
    total: number;
    cardSliderPer: number;
}

const SliderContext = createContext<SliderContextType | null>(null);

export const useSliderContext = (): SliderContextType => {
    const ctx = useContext(SliderContext);
    if (!ctx) throw new Error("Tabs components must be wrapped in <Tabs>");
    return ctx;
};



const Slider = ({
    children,
    className = '',
    cardSliderPer = 1,
}: {
    children: React.ReactNode;
    className?: string;
    cardSliderPer?: number;
}) => {
    const sliderRef = useRef<HTMLUListElement | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalSlides, setTotalSlides] = useState(0);

    useEffect(() => {
        if (sliderRef.current) {
            setTotalSlides(sliderRef.current.children.length);
        }
    }, [sliderRef, setTotalSlides]);
    const scrollToIndex = useCallback(
        (pageIndex: number) => {
            if (!sliderRef.current) return;
            const itemWidth = sliderRef.current.clientWidth / cardSliderPer;
            sliderRef.current.scrollTo({
                left: itemWidth * cardSliderPer * pageIndex,
                behavior: "smooth",
            });
            setCurrentIndex(pageIndex);
        },
        [cardSliderPer]
    );

    const next = () => {
        const maxIndex = Math.ceil(totalSlides / cardSliderPer) - 1;
        if (currentIndex < maxIndex) {
            scrollToIndex(currentIndex + 1);
        }
    };

    const prev = () => {
        if (!sliderRef.current) return;
        const scrollLeft = sliderRef.current.scrollLeft;
        if (currentIndex > 0 || scrollLeft > 0) {
            const newIndex = Math.max(currentIndex - 1, 0);
            scrollToIndex(newIndex);
        }
    };
    const contextValue = useMemo(() => ({ sliderRef, currentIndex, setCurrentIndex, scrollToIndex, next, prev, total: totalSlides, cardSliderPer }), [
        sliderRef,
        currentIndex,
        setCurrentIndex,
        scrollToIndex,
        next,
        prev,
        totalSlides,
        cardSliderPer,
    ])
    return (
        <SliderContext.Provider value={contextValue}>
            <div className={cn("core-card-slider", className)}>{children}</div>
        </SliderContext.Provider>
    )
}


const SliderContent = ({ children, className = '' }: { children: ReactNode, className?: string }) => {
    const { sliderRef, cardSliderPer, setCurrentIndex } = useSliderContext();

    const handleScroll = useCallback(() => {
        if (!sliderRef.current) return;
        const itemWidth = sliderRef.current.clientWidth / cardSliderPer;
        const pageIndex = Math.round(sliderRef.current.scrollLeft / itemWidth / cardSliderPer);

        setCurrentIndex(pageIndex);
    }, [cardSliderPer, setCurrentIndex, sliderRef]);
    return (
        <ul
            ref={sliderRef}
            className={cn("core-card-slider__card-list", className)}
            data-card-per={cardSliderPer} 
            aria-label="Slider content"
            onScroll={handleScroll}
        >
            {children}
        </ul>
    );
}



const SliderItem = ({ children,
    className = "", }: {
        children: React.ReactNode;
        className?: string;
    }) => {

    return <li
        aria-roledescription="slide"
        className={cn("core-card-slider__card-list-item", className)}>
        <div className="core-card-slider__card">{children}</div>
    </li>
}

const SliderPrevButton = () => {
    const { prev, sliderRef } = useSliderContext();
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        const el = sliderRef.current;
        if (!el) return;

        const handleScroll = () => {
            const scrollLeft = el.scrollLeft;
            setDisabled(scrollLeft === 0); // -1 to avoid float precision errors
        };

        handleScroll(); // init
        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [sliderRef]);


    return (
        <button
            type="button"
            aria-label="Previous Slide"
            onClick={prev}
            disabled={disabled}
            className="core-card-slider__nav-btn core-card-slider__nav-btn--prev"
        >
            <svg className="core-card-slider__nav-btn-icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                <path d="M6.44753 7.18755L9.13086 4.50421L8.51617 3.88953L5.21815 7.18755L8.51617 10.4856L9.13086 9.87088L6.44753 7.18755Z" fill="#6B6B80" />
            </svg>
        </button>
    );
};

const SliderHeader = ({ title }: { title: string }) => {
    return (
        <div className="core-card-slider__header">
            <h2 className="core-card-slider__title">{title}</h2>
        </div>
    );
};

const SliderNextButton = () => {
    const { next, sliderRef } = useSliderContext();
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        const el = sliderRef.current;
        if (!el) return;

        const handleScroll = () => {
            const scrollLeft = el.scrollLeft;
            const maxScroll = el.scrollWidth - el.clientWidth;
            setDisabled(scrollLeft >= maxScroll - 1); // -1 to avoid float precision errors
        };

        handleScroll(); // init
        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [sliderRef]);

    return (
        <button
            type="button"
            aria-label="Next Slide"
            onClick={next}
            disabled={disabled}
            className="core-card-slider__nav-btn core-card-slider__nav-btn--next"
        >
            <svg className="core-card-slider__nav-btn-icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                <path d="M7.55247 7.18755L4.86914 4.50421L5.48383 3.88953L8.78185 7.18755L5.48383 10.4856L4.86914 9.87088L7.55247 7.18755Z" fill="#6B6B80" />
            </svg>
        </button>
    );
};

const SliderNavigation = ({ className = '' }: { className?: string }) => {
    return (
        <div className={cn("core-card-slider__nav", className)}>
            <SliderPrevButton />
            <SliderNextButton />
        </div>
    )
}

const SliderIndicator = () => {
    const { sliderRef } = useSliderContext();
    const [scrollInfo, setScrollInfo] = useState({ width: 0, left: 0 });

    useEffect(() => {
        const el = sliderRef.current;
        if (!el) return;

        const updateScroll = () => {
            const visibleWidth = el.clientWidth;
            const totalWidth = el.scrollWidth;
            const scrollLeft = el.scrollLeft;

            const width = (visibleWidth / totalWidth) * 100;
            const left = (scrollLeft / totalWidth) * 100;

            setScrollInfo({ width, left });
        };

        updateScroll(); // initial
        el.addEventListener("scroll", updateScroll);
        window.addEventListener("resize", updateScroll);

        return () => {
            el.removeEventListener("scroll", updateScroll);
            window.removeEventListener("resize", updateScroll);
        };
    }, [sliderRef]);

    return (
        <div className="core-card-slider__scroll-indicator" aria-hidden="true">
            <div className="core-card-slider__scroll-indicator-track">
                <div
                    className="core-card-slider__scroll-indicator-thumb"
                    style={{
                        width: `${scrollInfo.width}%`,
                        left: `${scrollInfo.left}%`,
                        position: "absolute",
                        transition: "left 0.2s ease",
                    }}
                />
            </div>
        </div>
    );
};

export { Slider, SliderItem, SliderHeader, SliderContent, SliderNextButton, SliderPrevButton, SliderNavigation, SliderIndicator };