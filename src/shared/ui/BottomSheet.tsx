import type { PropsWithChildren, ReactNode } from "react";

interface BottomSheetProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  onClose: () => void;
  footer?: ReactNode;
}

export function BottomSheet({
  eyebrow,
  title,
  onClose,
  footer,
  children,
}: BottomSheetProps) {
  return (
    <>
      <button
        aria-label="Close panel"
        className="sheet-backdrop"
        onClick={onClose}
        type="button"
      />
      <section className="sheet-panel">
        <button
          aria-label="Close panel"
          className="sheet-panel__handle"
          onClick={onClose}
          type="button"
        />
        <div className="sheet-panel__header">
          <div>
            <p className="sheet-panel__eyebrow">{eyebrow}</p>
            <h2 className="sheet-panel__title">{title}</h2>
          </div>
          <button className="sheet-panel__close" onClick={onClose} type="button">
            ✕
          </button>
        </div>
        <div className="sheet-panel__body">{children}</div>
        {footer ? <div className="sheet-panel__footer">{footer}</div> : null}
      </section>
    </>
  );
}
