import React from "react";

const Spinner = ({ className = "h-4 w-4" }) => (
  <svg
    className={`animate-spin ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="3"
      className="opacity-25"
    />

    <path
      fill="currentColor"
      className="opacity-90"
      d="M21 12a9 9 0 0 0-9-9v3a6 6 0 0 1 6 6h3Z"
    />
  </svg>
);

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200 disabled:bg-blue-400",

  secondary:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-200 disabled:bg-gray-100 disabled:text-gray-400",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 disabled:bg-red-400",

  warning:
    "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-200 disabled:bg-amber-300",

  dark:
    "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-300 disabled:bg-slate-500",

  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-200 disabled:bg-emerald-400",
};

const sizes = {
  small: "min-h-9 rounded-lg px-3 py-2 text-xs",
  medium: "min-h-11 rounded-xl px-4 py-2.5 text-sm",
  large: "min-h-12 rounded-xl px-5 py-3 text-base",
};

export default function LoadingButton({
  children,
  loading = false,
  loadingText = "Please wait...",
  disabled = false,
  variant = "primary",
  size = "medium",
  type = "button",
  icon = null,
  loadingIcon = null,
  fullWidth = false,
  className = "",
  onClick,
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold shadow-sm transition
        focus:outline-none focus:ring-4
        disabled:cursor-not-allowed disabled:opacity-80
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.medium}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <>
          {loadingIcon || <Spinner />}
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}