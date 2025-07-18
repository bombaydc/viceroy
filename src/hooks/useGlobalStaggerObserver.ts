'use client';

import { useEffect } from 'react';
import Stagger from '@/classes/Stagger';

export const useGlobalStaggerObserver = () => {
	useEffect(() => {
		const root = document.documentElement;
		const containers = Array.from(
			root.querySelectorAll('[data-stagger-motion-observer]')
		);

		if (!containers.length) return;

		const deviceRootMargin = window.innerWidth < 768 ? '-50px' : '-100px';

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const el = entry.target as HTMLElement & {
						staggerInstance?: Stagger;
					};

					if (!el.staggerInstance) return;

					if (entry.isIntersecting) {
						el.staggerInstance.animateIn();
					} else {
						el.staggerInstance.animateOut();
					}
				}
			},
			{ rootMargin: `0px 0px ${deviceRootMargin} 0px` }
		);

		for (const el of containers) {
			const staggerEl = el as HTMLElement & { staggerInstance?: Stagger };
			staggerEl.staggerInstance = new Stagger({ element: staggerEl });
			observer.observe(staggerEl);

			// Optional: allow external unobserve control
			staggerEl.addEventListener('unobserve', () => {
				observer.unobserve(staggerEl);
			});
		}

		// Cleanup on unmount
		return () => {
			containers.forEach((el) => observer.unobserve(el));
		};
	}, []);
};
