'use client';

import React, {
	useRef,
	useImperativeHandle,
	forwardRef,
	useLayoutEffect,
	useEffect,
	ElementType,
	HTMLAttributes,
} from 'react';
import { gsap } from 'gsap';
import StaggerAnimator, { AnimationConfig } from './StaggerAnimator';

export interface StaggerHandle {
	retrigger: () => void;
}

interface StaggerProps extends HTMLAttributes<HTMLElement> {
	children: React.ReactNode;
	config?: AnimationConfig;
	stagger?: number;
	as?: ElementType;
	className?: string;
	style?: React.CSSProperties;
}

const defaultConfig: AnimationConfig = {
	sm: { y: 40, duration: 450, ease: 'power2.out' },
	md: { y: 60, duration: 450, ease: 'power2.out' },
	lg: { y: 80, duration: 450, ease: 'power2.out' },
};

const Stagger = forwardRef<StaggerHandle, StaggerProps>(({
	children,
	config = defaultConfig,
	stagger = 0.06,
	as: Component = 'div',
	className,
	style,
	...rest
}, ref) => {
	const containerRef = useRef<HTMLElement>(null);
	const animatorRef = useRef<StaggerAnimator | null>(null);

	useImperativeHandle(ref, () => ({
		retrigger: () => {
			animatorRef.current?.retriggerAnimation();
		},
	}));

	useLayoutEffect(() => {
		if (!containerRef.current) return;

		const ctx = gsap.context(() => {
			const container = containerRef.current!;
			const animator = new StaggerAnimator(container, {
				config,
				stagger,
			});
			animatorRef.current = animator;

			// Automatically bind buttons with the retrigger attribute
			const retriggerBtns = container.querySelectorAll('[data-stagger-motion-retrigger-btn]');
			retriggerBtns.forEach((btn) => {
				btn.addEventListener('click', animator.retriggerAnimation.bind(animator));
			});
		}, containerRef);

		return () => {
			ctx.revert();
			animatorRef.current?.destroy();
		};
	}, [config, stagger]);

	useEffect(() => {
		if (animatorRef.current) {
			animatorRef.current.updateConfig(config);
		}
	}, [config]);

	return (
		<Component
			ref={containerRef}
			data-stagger-motion-observer
			className={className}
			style={style}
			{...rest}
		>
			{children}
		</Component>
	);
});

Stagger.displayName = 'Stagger';
export default Stagger;
