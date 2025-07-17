import { cn } from '@/utils/cn';
import './index.scss';
import { Alert } from '../../types';
import { alertManager } from '../..';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

const variantStyles: Record<Alert["variant"], string> = {
    success: "core-toast-alert--success",
    error: "core-toast-alert--error",
    warning: "core-toast-alert--warning",
    info: "core-toast-alert--info",
};
const positionStyles: Record<string, string> = {
    "bottom": "core-toast-alert--bottom",
    "top": "core-toast-alert--top",
    "top-right": "core-toast-alert--top-right",
    "bottom-right": "core-toast-alert--bottom-right",
    "bottom-left": "core-toast-alert--bottom-left",
    "top-left": "core-toast-alert--top-left"
};

const ToastAlert: React.FC<Alert> = ({ id, variant, position, message,  dismissible, autoClose }) => {
    const [hidden, setHidden] = useState(true);

    const handleClose = useCallback(() => {
        setHidden(true);
        setTimeout(() => {
            alertManager.removeAlert(id);
        }, 300);
    }, [id]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setHidden(false); // Trigger fade-in after mount
        }, 10);

        let autoCloseTimeout: NodeJS.Timeout | undefined;
        if (autoClose) {
            autoCloseTimeout = setTimeout(handleClose, autoClose);
        }
        return () => {
            clearTimeout(timeout);
            if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
        };
    }, [autoClose, handleClose]);

    return (
        <div id={id} className={cn('core-toast-alert sample-toast-alert', variantStyles[variant], position ? positionStyles[position] : '')} aria-hidden={hidden} tabIndex={hidden ? -1 : 0}>
            <div className="core-toast-alert__inner">
                <div className="core-toast-alert__message-container">
                    <p className="core-toast-alert__message">{message}</p>
                </div>
                <div className="core-toast-alert__action-container">
                    <button className="core-toast-alert__action-btn">Undo</button>
                    {
                        dismissible &&
                        <button onClick={handleClose} className="core-toast-alert__close-btn" aria-label="Close toast alert">
                            <Image className="core-toast-alert__close-btn-icon" width="14" height="14" src="/assets/common/icon_close.svg" alt="" />
                        </button>
                    }
                </div>
            </div>
        </div>

    );
}

export default ToastAlert;