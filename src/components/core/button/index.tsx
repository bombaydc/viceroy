import React, { forwardRef } from 'react';
import './index.scss';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import DotLoader from '../loader/dot-loader';

export interface ButtonProps {
    tag?: 'a' | 'button';
    text?: string;
    type?: "button" | "submit" | "reset";
    href?: string;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    variant?: 'primary' | 'secondary' | 'primary-icon' | 'secondary-icon' | 'tertiary';
    onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    target?: string;
    rel?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
}

// Forward ref to support both <a> and <button> use cases
const Button = forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    ButtonProps
>(({
    tag = 'button',
    text = '',
    type = 'button',
    href,
    disabled = false,
    loading = false,
    className = '',
    variant = 'primary',
    onClick,
    target,
    rel,
    leftIcon = null,
    rightIcon = null,
    children = null,
    ...props
}, ref) => {
    const isLink = tag === 'a'; 
    const varaintStyle = {
        primary: 'core-button--primary',
        secondary: 'core-button--secondary',
        outline: 'core-button--outline',
        tertiary: 'core-button--tertiary',
        'primary-icon': 'core-button--primary-icon',
        'secondary-icon': 'core-button--secondary-icon'
    }


    const isLoading = loading ? 'core-button--loading' : '';
    const classes = cn('core-button', className, isLoading, varaintStyle[variant]);
    

    const content = (
        <>
            {children}
            {leftIcon && <span className="core-button__icon core-button__icon--left">{leftIcon}</span>}
            {text && <span className="core-button__text">{text}</span>}
            {rightIcon && <span className="core-button__icon core-button__icon--right">{rightIcon}</span>}
            {loading && (
                <DotLoader />
            )}
        </>
    );

    if (isLink) {
        return (
            <Link
                href={href ?? '#'}
                className={classes}
                onClick={onClick}
                target={target}
                rel={rel}
                ref={ref as React.Ref<HTMLAnchorElement>}
                aria-disabled={disabled}
                {...props}
            >
                {content}
            </Link>
        );
    } 

    return (
        <button
            type={type}
            onClick={onClick}
            className={classes}
            disabled={disabled || loading}
            ref={ref as React.Ref<HTMLButtonElement>}
            {...props}
        >
            {content}
        </button>
    );
});

Button.displayName = 'Button';
export default Button;
