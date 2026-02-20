import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Toast.scss";

export default function Toast({
  message,
  type = "success",
  duration = 4000,
  onDismiss,
}) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!exiting) return;

    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 300);

    return () => clearTimeout(timer);
  }, [exiting, onDismiss]);

  const handleClose = () => {
    setExiting(true);
  };

  if (!visible) return null;

  return createPortal(
    <div
      className={`toast toast--${type} ${exiting ? "toast--exiting" : ""}`}
      role="alert"
    >
      <span className="toast__message font-text-2">{message}</span>
      <button
        className="toast__close font-text"
        onClick={handleClose}
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>,
    document.body,
  );
}
