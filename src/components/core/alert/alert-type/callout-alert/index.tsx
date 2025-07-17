import { cn } from '@/utils/cn';
import { Alert } from '../../types';
import './index.scss';
import { useEffect, useState, useCallback } from 'react';
import { alertManager } from '../..';

const variantStyles: Record<Alert["variant"], string> = {
    success: "core-callout-alert--success",
    error: "core-callout-alert--error",
    warning: "core-callout-alert--warning",
    info: "core-callout-alert--info",
};


const CalloutAlert: React.FC<Alert> = ({ id, variant, message,   action, autoClose }) => {
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
        <div className={cn('core-callout-alert sample-callout-alert', variantStyles[variant])} id={id} aria-hidden={hidden}  tabIndex={hidden ? -1 : 0}>
            <div className="core-callout-alert__inner">
                <div className="core-callout-alert__message-container">
                    <svg className="core-callout-alert__icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 16.731C12.2288 16.731 12.4207 16.6536 12.5755 16.4987C12.7303 16.3439 12.8077 16.1521 12.8077 15.9232C12.8077 15.6944 12.7303 15.5026 12.5755 15.3477C12.4207 15.1931 12.2288 15.1157 12 15.1157C11.7712 15.1157 11.5793 15.1931 11.4245 15.3477C11.2697 15.5026 11.1922 15.6944 11.1922 15.9232C11.1922 16.1521 11.2697 16.3439 11.4245 16.4987C11.5793 16.6536 11.7712 16.731 12 16.731ZM12.0002 13.0772C12.2129 13.0772 12.391 13.0053 12.5345 12.8615C12.6782 12.7178 12.75 12.5397 12.75 12.3272V7.82724C12.75 7.61474 12.6781 7.43658 12.5342 7.29274C12.3904 7.14908 12.2122 7.07724 11.9997 7.07724C11.7871 7.07724 11.609 7.14908 11.4655 7.29274C11.3218 7.43658 11.25 7.61474 11.25 7.82724V12.3272C11.25 12.5397 11.3219 12.7178 11.4657 12.8615C11.6096 13.0053 11.7877 13.0772 12.0002 13.0772ZM12.0017 21.5002C10.6877 21.5002 9.45267 21.2509 8.2965 20.7522C7.14033 20.2536 6.13467 19.5768 5.2795 18.722C4.42433 17.8672 3.74725 16.8619 3.24825 15.7062C2.74942 14.5506 2.5 13.3158 2.5 12.002C2.5 10.688 2.74933 9.45291 3.248 8.29674C3.74667 7.14058 4.42342 6.13491 5.27825 5.27974C6.13308 4.42458 7.13833 3.74749 8.294 3.24849C9.44967 2.74966 10.6844 2.50024 11.9982 2.50024C13.3122 2.50024 14.5473 2.74958 15.7035 3.24824C16.8597 3.74691 17.8653 4.42366 18.7205 5.27849C19.5757 6.13333 20.2527 7.13858 20.7517 8.29424C21.2506 9.44991 21.5 10.6847 21.5 11.9985C21.5 13.3125 21.2507 14.5476 20.752 15.7037C20.2533 16.8599 19.5766 17.8656 18.7217 18.7207C17.8669 19.5759 16.8617 20.253 15.706 20.752C14.5503 21.2508 13.3156 21.5002 12.0017 21.5002Z" fill="#F4C600" />
                    </svg>
                    <div className="core-callout-alert__message-wrapper">
                        <p className="core-callout-alert__message">{message}</p>
                        {
                            action && (
                                <button onClick={action.onClick} className="core-callout-alert__action-btn" aria-label="Dummy action">
                                    {action.label}
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalloutAlert