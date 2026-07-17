import React, { useEffect, useState } from "react";

const ToastIcon = ({ type }) => {
  const commonClass = "h-5 w-5";

  if (type === "success") {
    return (
      <svg
        className={commonClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    );
  }

  if (type === "error") {
    return (
      <svg
        className={commonClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6" />
        <path d="m15 9-6 6" />
      </svg>
    );
  }

  if (type === "warning") {
    return (
      <svg
        className={commonClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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

  return (
    <svg
      className={commonClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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

const CloseIcon = () => (
  <svg
    className="h-4 w-4"
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

const toastStyles = {
  success: {
    wrapper: "border-emerald-200 bg-white",
    icon: "bg-emerald-50 text-emerald-600",
    title: "text-emerald-900",
    progress: "bg-emerald-500",
  },

  error: {
    wrapper: "border-red-200 bg-white",
    icon: "bg-red-50 text-red-600",
    title: "text-red-900",
    progress: "bg-red-500",
  },

  warning: {
    wrapper: "border-amber-200 bg-white",
    icon: "bg-amber-50 text-amber-600",
    title: "text-amber-900",
    progress: "bg-amber-500",
  },

  info: {
    wrapper: "border-blue-200 bg-white",
    icon: "bg-blue-50 text-blue-600",
    title: "text-blue-900",
    progress: "bg-blue-500",
  },
};

const defaultTitles = {
  success: "Success",
  error: "Something went wrong",
  warning: "Please check",
  info: "Information",
};

export default function Toast({
  open = false,
  type = "info",
  title = "",
  message = "",
  duration = 4000,
  onClose,
}) {
  const [visible, setVisible] = useState(false);
  const selectedStyle = toastStyles[type] || toastStyles.info;

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return undefined;
    }

    const entranceTimer = window.setTimeout(() => {
      setVisible(true);
    }, 20);

    return () => {
      window.clearTimeout(entranceTimer);
    };
  }, [open, message]);

  useEffect(() => {
    if (
      !open ||
      duration <= 0 ||
      typeof onClose !== "function"
    ) {
      return undefined;
    }

    const closeTimer = window.setTimeout(() => {
      setVisible(false);

      window.setTimeout(() => {
        onClose();
      }, 250);
    }, duration);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [open, duration, onClose, message]);

  const handleClose = () => {
    if (typeof onClose !== "function") return;

    setVisible(false);

    window.setTimeout(() => {
      onClose();
    }, 250);
  };

  if (!open || !message) {
    return null;
  }

  return (
    <>
      <div
        className="
          pointer-events-none fixed inset-x-0 top-4 z-[1200]
          flex justify-center px-4
          sm:inset-x-auto sm:right-5 sm:top-5 sm:block
          sm:w-full sm:max-w-sm
        "
        role={type === "error" ? "alert" : "status"}
        aria-live={type === "error" ? "assertive" : "polite"}
        aria-atomic="true"
      >
        <div
          className={`
            pointer-events-auto relative w-full overflow-hidden
            rounded-2xl border shadow-2xl
            transition-all duration-300 ease-out
            ${
              visible
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0 sm:translate-x-5 sm:translate-y-0"
            }
            ${selectedStyle.wrapper}
          `}
        >
          <div className="flex items-start gap-3 p-4">
            <div
              className={`
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                ${selectedStyle.icon}
              `}
            >
              <ToastIcon type={type} />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-bold ${selectedStyle.title}`}
              >
                {title || defaultTitles[type] || defaultTitles.info}
              </p>

              <p className="mt-1 break-words text-sm leading-5 text-gray-600">
                {message}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="
                flex h-8 w-8 shrink-0 items-center justify-center
                rounded-lg text-gray-400 transition
                hover:bg-gray-100 hover:text-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-200
              "
              aria-label="Close notification"
            >
              <CloseIcon />
            </button>
          </div>

          {duration > 0 && (
            <div className="h-1 overflow-hidden bg-gray-100">
              <div
                key={`${type}-${message}-${open}`}
                className={`h-full ${selectedStyle.progress}`}
                style={{
                  animationName: "property-ls-toast-progress",
                  animationDuration: `${duration}ms`,
                  animationTimingFunction: "linear",
                  animationFillMode: "forwards",
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes property-ls-toast-progress {
            from {
              width: 100%;
            }

            to {
              width: 0%;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .property-ls-toast {
              transition: none !important;
            }
          }
        `}
      </style>
    </>
  );
}