import { cn } from '@/utils/cn';
import './index.scss';
import { Alert } from '../../types';
import { alertManager } from '../..';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

const variantStyles: Record<Alert["variant"], string> = {
    success: "core-standard-alert--success",
    error: "core-standard-alert--error",
    warning: "core-standard-alert--warning",
    info: "core-standard-alert--info",
};

const StandardAlert: React.FC<Alert> = ({ id, variant, message, dismissible, autoClose }) => {
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
        <div id={id} className={cn('core-standard-alert sample-standard-alert', variantStyles[variant])} aria-hidden={hidden} tabIndex={hidden ? -1 : 0}>
            <div className="core-standard-alert__inner">
                <div className="core-standard-alert__message-container">
                    <div className="core-standard-alert__icon-wrapper">
                        <svg className="core-standard-alert__icon" aria-hidden="true" focusable="false" xmlns=" http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 14.7309C10.2288 14.7309 10.4207 14.6535 10.5755 14.4987C10.7303 14.3438 10.8077 14.152 10.8077 13.9232C10.8077 13.6943 10.7303 13.5025 10.5755 13.3477C10.4207 13.193 10.2288 13.1157 10 13.1157C9.77117 13.1157 9.57933 13.193 9.4245 13.3477C9.26967 13.5025 9.19225 13.6943 9.19225 13.9232C9.19225 14.152 9.26967 14.3438 9.4245 14.4987C9.57933 14.6535 9.77117 14.7309 10 14.7309ZM10.0002 11.0772C10.2129 11.0772 10.391 11.0053 10.5345 10.8614C10.6782 10.7178 10.75 10.5397 10.75 10.3272V5.82717C10.75 5.61467 10.6781 5.4365 10.5342 5.29267C10.3904 5.149 10.2122 5.07717 9.99975 5.07717C9.78708 5.07717 9.609 5.149 9.4655 5.29267C9.32183 5.4365 9.25 5.61467 9.25 5.82717V10.3272C9.25 10.5397 9.32192 10.7178 9.46575 10.8614C9.60958 11.0053 9.78775 11.0772 10.0002 11.0772ZM10.0017 19.5002C8.68775 19.5002 7.45267 19.2508 6.2965 18.7522C5.14033 18.2535 4.13467 17.5767 3.2795 16.7219C2.42433 15.8671 1.74725 14.8618 1.24825 13.7062C0.749416 12.5505 0.5 11.3158 0.5 10.0019C0.5 8.68792 0.749333 7.45283 1.248 6.29667C1.74667 5.1405 2.42342 4.13483 3.27825 3.27967C4.13308 2.4245 5.13833 1.74742 6.294 1.24842C7.44967 0.749584 8.68442 0.500168 9.99825 0.500168C11.3122 0.500168 12.5473 0.749501 13.7035 1.24817C14.8597 1.74683 15.8653 2.42358 16.7205 3.27842C17.5757 4.13325 18.2527 5.1385 18.7517 6.29417C19.2506 7.44983 19.5 8.68458 19.5 9.99842C19.5 11.3124 19.2507 12.5475 18.752 13.7037C18.2533 14.8598 17.5766 15.8655 16.7217 16.7207C15.8669 17.5758 14.8617 18.2529 13.706 18.7519C12.5503 19.2507 11.3156 19.5002 10.0017 19.5002Z" fill="#F50000" />
                        </svg>
                    </div>
                    <div className="core-standard-alert__message-wrapper">
                        <div className="core-standard-alert__message" dangerouslySetInnerHTML={{ __html: message }} />
                    </div>
                </div>
                {
                    dismissible &&
                    <button className="core-standard-alert__close-btn" onClick={handleClose} aria-label="Close toast alert">
                        <Image className="core-standard-alert__close-btn-icon" width="14" height="14" src="/assets/common/icon_close.svg" alt="" />
                    </button>
                }
            </div>
        </div>

    );
}

export default StandardAlert;