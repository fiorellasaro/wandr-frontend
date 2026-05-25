import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(onDismiss, 2400);
    return () => window.clearTimeout(timeoutId);
  }, [message, onDismiss]);

  return (
    <div className={`toast${message ? " toast--visible" : ""}`} role="status">
      {message}
    </div>
  );
}
