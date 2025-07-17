type AlertVariant = "success" | "error" | "warning" | "info";
type AlertType = "standard" | "toast" | "contextual" | "callout";
type AlertPosition = "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
interface AlertAction {
    label: string;
    onClick: () => void;
}

interface Alert {
    id: string;
    variant: AlertVariant;
    type: AlertType;
    message: string;
    description?: string;
    action?: AlertAction;
    dismissible?: boolean;
    autoClose?: number;
    position?: AlertPosition;
    rendererId?: string; // New property to target specific AlertRenderer
}

export { Alert, AlertVariant, AlertType, AlertAction };