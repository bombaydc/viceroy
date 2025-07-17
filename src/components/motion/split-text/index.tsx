"use client";

import React, { JSX, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './index.scss';

gsap.registerPlugin(ScrollTrigger);

type SplitType = "word" | "char";
type Tag = keyof JSX.IntrinsicElements;

interface SplitTextProps {
    text: string;
    type?: SplitType;
    as?: Tag;
    animation?: gsap.TweenVars;
    scrollOptions?: Partial<ScrollTrigger.Vars>;
    className?: string;
}

export const SplitText = ({
    text,
    type = "char",
    as = "div",
    animation,
    scrollOptions,
    className = "",
}: SplitTextProps) => {
    const ref = useRef<HTMLElement>(null);

    const defaultAnimation = useMemo<gsap.TweenVars>(() => ({
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
        ...animation,
    }), [animation]);

    const defaultScrollOptions = useMemo<Partial<ScrollTrigger.Vars>>(() => ({
        start: "top 90%",
        toggleActions: "play none none reverse",
        once: true,
        ...scrollOptions,
    }), [scrollOptions]);

    useEffect(() => {
        if (!ref.current) return;

        const targets = ref.current.querySelectorAll("span");

        const ctx = gsap.context(() => {
            gsap.fromTo(
                targets,
                { y: defaultAnimation.y, opacity: defaultAnimation.opacity },
                {
                    ...defaultAnimation,
                    y: 0,
                    opacity: 1,
                    scrollTrigger: {
                        ...defaultScrollOptions,
                        trigger: ref.current,
                    },
                }
            );
        }, ref);

        return () => ctx.revert();
    }, [text, defaultAnimation, defaultScrollOptions]);

    const splitText = () => {
        const parts = type === "word" ? text.split(" ") : Array.from(text);

        return parts.map((part, i) => (
            <span
                key={`split-text-${part}-${i}`}
                style={{ display: "inline-block", whiteSpace: "pre" }}
                aria-hidden="true"
            >
                {part}
                {type === "word" ? "\u00A0" : ""}
            </span>
        ));
    };

    return (
        // Render with dynamic HTML tag
        React.createElement(
            as,
            {
                ref,
                className: `split-text ${className}`,
                "aria-label": text,
            },
            splitText()
        )
    );
};