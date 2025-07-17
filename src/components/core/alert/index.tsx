'use client';
import { useEffect,  useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Alert } from "./types";
import StandardAlert from "./alert-type/standard-alert";
import CalloutAlert from "./alert-type/callout-alert";
import ContextualAlert from "./alert-type/contextual-alert";
import ToastAlert from "./alert-type/toast-alert";
import { v4 as uuidv4 } from 'uuid';

const alertManager = {
  alerts: [] as Alert[],
  listeners: [] as ((alerts: Alert[]) => void)[],
  addAlert(options: Omit<Alert, "id">) {
    const isDuplicate = this.alerts.some(
      (alert) =>
        alert.type === options.type &&
        alert.message === options.message &&
        alert.description === options.description
    );

    if (isDuplicate) {
      console.log("Duplicate alert ignored");
      return; // Don't add it again
    }
    const id = uuidv4();
    const alert = { ...options, id };
    this.alerts.push(alert);
    console.log("Alert added:", alert); // Add this line
 
    this.notify();
  },
  removeAlert(id: string) {
    this.alerts = this.alerts.filter((alert) => alert.id !== id);
    this.notify();
  },
  subscribe(listener: (alerts: Alert[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
  notify() {
    this.listeners.forEach((listener) => listener(this.alerts));
  },
}; 

const alert = (options: Omit<Alert, "id">) => {
  alertManager.addAlert(options);
};



interface AlertRendererProps {
  rendererId?: string; // Optional ID to filter alerts
}
const ALERT_COMPONENTS = {
  standard: StandardAlert,
  toast: ToastAlert,
  contextual: ContextualAlert,
  callout: CalloutAlert,
} as const;

// alert.tsx (updated portion)
const AlertRenderer: React.FC<AlertRendererProps> = ({ rendererId }) => {
  const [alerts, setAlerts] = useState<Alert[]>(alertManager.alerts);
  const [isMounted, setIsMounted] = useState(false); // Add this to ensure client-side rendering

  useEffect(() => {
    const update = () => { 
      setAlerts([...alertManager.alerts]); // Force new reference
    };
 
    setIsMounted(true);

    update(); // Initial sync
    const unsubscribe = alertManager.subscribe(update);
    return unsubscribe;
  }, []);

  // Memoize filtered alerts to avoid unnecessary re-renders
  const filteredAlerts = useMemo(() => {
    if (rendererId) {
      return alerts.filter(
        (alert) =>
          (alert.type !== "toast" && alert.type !== "standard") &&
          (alert.rendererId === rendererId || !alert.rendererId)
      );
    }
    return alerts.filter((alert) => alert.type !== "contextual" && alert.type !== "callout");
  }, [alerts, rendererId]);
  if (filteredAlerts.length > 0) {
    console.log("filteredAlerts", ALERT_COMPONENTS[filteredAlerts[0]?.type]);
  }
  if (!isMounted) {
    return null; // Prevent rendering on the server
  }
  // Render contextual or callout alerts
  if (rendererId) {
    return (
      <div role="alertdialog" aria-live="polite">
        {filteredAlerts.map((alert) => {
          const Component = ALERT_COMPONENTS[alert.type];
          return Component ? <Component key={alert.id} {...alert} /> : null;
        })}
      </div>
    );
  }

  // Render toast or standard alerts via portal
  return createPortal(
    <div className="toast-container" role="alert" aria-live="assertive">
      {filteredAlerts.map((alert) => {
        const Component = ALERT_COMPONENTS[alert.type];
        return Component ? <Component key={alert.id} {...alert} /> : null;
      })}
    </div>,
    document.body
  );
};


export { alert, alertManager, AlertRenderer };