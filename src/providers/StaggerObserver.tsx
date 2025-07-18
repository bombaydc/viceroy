'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Stagger from '@/classes/Stagger';

declare global {
	interface HTMLElement {
		staggerInstance?: Stagger;
	}
}

const StaggerObserver = () => {
	const pathname = usePathname(); // triggers on every route change
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const el = entry.target as HTMLElement & {
						staggerInstance?: Stagger;
					};
					if (!el.staggerInstance) return;

					if (entry.isIntersecting) {
						el.staggerInstance.animateIn();
					} else {
						el.staggerInstance.animateOut();
					}
				});
			},
			{
				rootMargin:
					window.innerWidth < 768 ? '0px 0px -50px 0px' : '0px 0px -100px 0px',
			}
		);

		observerRef.current = observer;

		const containers: HTMLElement[] = Array.from(
			document.querySelectorAll('[data-stagger-motion-observer]')
		);

		for (const el of containers) {
			// Clean up existing instance if needed
			if (el.staggerInstance) {
				el.staggerInstance.animateOut();
				delete el.staggerInstance;
			}

			el.staggerInstance = new Stagger({ element: el });
			observer.observe(el);

			el.addEventListener('unobserve', () => {
				observer.unobserve(el);
			});
		}

		return () => {
			observer.disconnect();
		};
	}, [pathname]); // ← triggers on every page route change

	return null;
};

export default StaggerObserver;
