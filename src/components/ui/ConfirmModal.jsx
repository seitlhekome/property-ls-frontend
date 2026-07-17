import React, { useEffect } from "react";
import LoadingButton from "./LoadingButton";

const CloseIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="m6 6 12 12" />
    <path d="m18 6-12 12" />
  </svg>
);

const ModalIcon = ({ type }) => {
  if (type === "danger") {
    return (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="m19 6-1 14H6L5 6" />
        <path d="M10 11v5" />
        <path d="M14 11v5" />
      </svg>
    );
  }

  if (type === "warning") {
    return (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10.3 3.7 2.5 17.2A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.8L13.7 3.7a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (type === "success") {
    return (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    );
  }

  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
};

const typeStyles = {
  danger: {
    icon: "bg-red-50 text-red-600",
    confirmVariant: "danger",
  },
  warning: {
    icon: "bg-amber-50 text-amber-600",
    confirmVariant: "warning",
  },
  success: {
    icon: "bg-emerald-50 text-emerald-600",
    confirmVariant: "success",
  },
  info: {
    icon: "bg-blue-50 text-blue-600",
    confirmVariant: "primary",
  },
};

export default function ConfirmModal({
  open = false,
  title = "Confirm action",
  message = "",
  description = "",
  type = "info",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  loadingText = "Processing...",
  onConfirm,
  onCancel,
  children,
}) {
  const selectedStyle = typeStyles[type] || typeStyles.info;

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        onCancel?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, loading, onCancel]);

  if (!open) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !loading) {
      onCancel?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-end justify-center bg-slate-950/55 px-4 py-4 backdrop-blur-[2px] sm:items-center sm:py-8"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
      >
        <div className="relative p-5 sm:p-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close confirmation"
          >
            <CloseIcon />
          </button>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${selectedStyle.icon}`}
          >
            <ModalIcon type={type} />
          </div>

          <div className="mt-4 pr-8">
            <h2
              id="confirm-modal-title"
              className="text-xl font-bold tracking-tight text-gray-950"
            >
              {title}
            </h2>

            {message && (
              <p
                id="confirm-modal-description"
                className="mt-2 text-sm leading-6 text-gray-600"
              >
                {message}
              </p>
            )}

            {description && (
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
              </p>
            )}

            {children && (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                {children}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/70 p-4 sm:flex-row sm:justify-end sm:px-6">
          <LoadingButton
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            fullWidth
            className="sm:w-auto"
          >
            {cancelText}
          </LoadingButton>

          <LoadingButton
            variant={selectedStyle.confirmVariant}
            onClick={onConfirm}
            loading={loading}
            loadingText={loadingText}
            fullWidth
            className="sm:w-auto"
          >
            {confirmText}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}