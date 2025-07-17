import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type StaggerMotionType = 'xxs' | 'xs' | 'sm' | 'md' | 'lg';

export type AnimationConfig = Partial<Record<StaggerMotionType, {
	y: number;
	duration: number;
	ease: string;
}>>;

interface Options {
	config?: AnimationConfig;
	stagger?: number;
	persist?: boolean;
	onComplete?: (el: HTMLElement) => void; 
}



export default class StaggerAnimator {
	container: HTMLElement;
	stagger: number;
	persist: boolean;
	config: AnimationConfig;
	onComplete?: (el: HTMLElement) => void;
	staggerElements: HTMLElement[] = [];
	isAnimatedIn: boolean = false;
	scrollTrigger?: ScrollTrigger;

	constructor(container: HTMLElement, options: Options = {}) {
		this.container = container;
		this.stagger = options.stagger ?? 0.06;
		this.persist = options.persist ?? true;
		this.onComplete = options.onComplete;
		this.config = options.config ?? {};
		this.staggerElements = this.getStaggerElements();

		this.initScrollTrigger();

	}

	getStaggerElements(): HTMLElement[] {
		return [...this.container.querySelectorAll('[data-stagger-motion-index]')].filter((el) =>
			el.closest('[data-stagger-motion-observer]') === this.container
		) as HTMLElement[];
	}

	updateConfig(config: AnimationConfig) {
		this.config = config;
		this.isAnimatedIn = false;
		this.staggerElements = this.getStaggerElements();
	}

	initScrollTrigger() {
		this.scrollTrigger = ScrollTrigger.create({
			trigger: this.container,
			start: 'top 85%',
			once: true, // 🔥 Only trigger once
			onEnter: () => this.animateIn(),
		});
	}

	animateIn() {
		if (this.isAnimatedIn && this.persist) return;
		this.isAnimatedIn = true;

		this.staggerElements.forEach((el) => {
			const type = (el.dataset.staggerMotionType as StaggerMotionType) ?? 'sm';
			const index = parseInt(el.dataset.staggerMotionIndex ?? '1') - 1;
			const delay = index * this.stagger;
			const { y, duration, ease } = this.config[type] ?? this.config['sm']!;

			gsap.set(el, { y, opacity: 0 });

			gsap.to(el, {
				y: 0,
				opacity: 1,
				duration: duration / 1000,
				ease,
				delay,
				onComplete: () => {
					el.style.transform = '';
					this.onComplete?.(el);
				},
			});
		});

		this.container.classList.add('has-staggered-in');
	}

	retriggerAnimation() {
		this.isAnimatedIn = false;
		this.animateIn();
	}

	destroy() {
		this.scrollTrigger?.kill();
	}
}
