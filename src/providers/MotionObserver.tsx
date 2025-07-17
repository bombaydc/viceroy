"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MotionObserver = () => {
	const pathname = usePathname();

	useEffect(() => {
		if (typeof document === "undefined") return;

		let loadTimeout: NodeJS.Timeout | null = null;

		// Animate on-load elements
		const onLoadElements = document.querySelectorAll<HTMLElement>("[data-motion='stagger-fade-on-load']");
		loadTimeout = setTimeout(() => {
			onLoadElements.forEach((el) => el.classList.add("motion-triggered"));
		}, 50); // slight delay to allow paint

		// Animate in-view elements
		const observerElements = document.querySelectorAll<HTMLElement>("[data-motion='stagger-fade']");
		if (observerElements.length === 0) return;

		const observer = new IntersectionObserver(
			(entries, obs) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add("motion-triggered");
						obs.unobserve(entry.target);
					}
				}
			},
			{
				root: null,
				threshold: 0,
				rootMargin: "0px 0px -100px 0px",
			}
		);

		observerElements.forEach((el) => observer.observe(el));

		return () => {
			if (loadTimeout) clearTimeout(loadTimeout);
			observer.disconnect();
		};
	}, [pathname]);

	return null;
};

export default MotionObserver;
