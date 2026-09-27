"use client";

import { useEffect, useId, useRef } from "react";
import { Icon } from "./Icon";

/** Accessible modal built on <dialog>: a bottom sheet on phones, a centred card on larger screens. */
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={`fixed inset-x-0 bottom-0 top-auto m-0 max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-paper p-0 text-ink shadow-2xl sm:inset-0 sm:m-auto sm:h-fit sm:rounded-3xl ${
        wide ? "sm:max-w-2xl" : "sm:max-w-lg"
      }`}
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-paper px-5 pb-3 pt-4">
        <div>
          <h2 id={titleId} className="font-serif text-xl font-bold">
            {title}
          </h2>
          {description ? (
            <p id={descId} className="mt-0.5 text-sm text-muted">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-navy hover:bg-sand"
          aria-label="Close"
        >
          <Icon name="x" />
        </button>
      </div>
      <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">{children}</div>
    </dialog>
  );
}
