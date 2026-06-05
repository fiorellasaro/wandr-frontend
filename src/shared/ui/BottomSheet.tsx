import { useEffect, useRef, useState } from "react";
import type { PropsWithChildren, ReactNode } from "react";

interface BottomSheetProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  onClose: () => void;
  footer?: ReactNode;
  className?: string;
}

export function BottomSheet({
  eyebrow,
  title,
  onClose,
  footer,
  className,
  children,
}: BottomSheetProps) {
  const closeTimeoutRef = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const panelClassName = [
    "sheet-panel",
    className,
    isClosing ? "sheet-panel--closing" : null,
  ]
    .filter(Boolean)
    .join(" ");
  const backdropClassName = isClosing
    ? "sheet-backdrop sheet-backdrop--closing"
    : "sheet-backdrop";

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    if (isClosing) {
      return;
    }

    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      onClose();
    }, 180);
  };

  return (
    <>
      <button
        aria-label="Close panel"
        className={backdropClassName}
        onClick={handleClose}
        type="button"
      />
      <section className={panelClassName}>
        <button
          aria-label="Close panel"
          className="sheet-panel__handle"
          onClick={handleClose}
          type="button"
        />
        <div className="sheet-panel__header">
          <div>
            <p className="sheet-panel__eyebrow">{eyebrow}</p>
            <h2 className="sheet-panel__title">{title}</h2>
          </div>
          <button className="sheet-panel__close" onClick={handleClose} type="button">
            ✕
          </button>
        </div>
        <div className="sheet-panel__body">{children}</div>
        {footer ? <div className="sheet-panel__footer">{footer}</div> : null}
      </section>
    </>
  );
}
