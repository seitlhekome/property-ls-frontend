import React, { useState } from "react";

export default function AuthModal({
  authIsSignup,
  setAuthIsSignup,
  authForm,
  setAuthForm,
  login,
  signup,
  loading,
  setShowAuthModal,
}) {
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateForm = () => {
    const errors = {};

    if (authIsSignup && !authForm.name?.trim()) {
      errors.name = "Full name is required";
    }

    if (!authForm.email?.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(authForm.email.trim())) {
        errors.email = "Enter a valid email, for example name@gmail.com";
      }
    }

    if (!authForm.password) {
      errors.password = "Password is required";
    } else if (authForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (!/[A-Za-z]/.test(authForm.password)) {
      errors.password = "Password must include at least one letter";
    } else if (!/[0-9]/.test(authForm.password)) {
      errors.password = "Password must include at least one number";
    }

    if (authIsSignup) {
      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (confirmPassword !== authForm.password) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setErrorMsg("");

    if (!validateForm()) return;

    try {
      if (authIsSignup) {
        await signup(authForm);
      } else {
        await login(authForm);
      }

      setShowAuthModal(false);
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong");
    }
  };

  const handleModeSwitch = () => {
    setAuthIsSignup(!authIsSignup);
    setErrorMsg("");
    setFieldErrors({});
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-lg outline-none transition ${
      fieldErrors[field]
        ? "border-red-500 focus:ring-2 focus:ring-red-200"
        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute right-3 top-3 text-xl text-gray-500 transition hover:text-gray-800"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
          {authIsSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <p className="mb-5 text-center text-sm text-gray-500">
          {authIsSignup
            ? "Create your buyer or agent account to continue."
            : "Sign in to manage listings and saved properties."}
        </p>

        {errorMsg && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {authIsSignup && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Full Name"
              value={authForm.name}
              onChange={(e) => {
                setAuthForm({ ...authForm, name: e.target.value });
                setFieldErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={inputClass("name")}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
            )}
          </div>
        )}

        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) => {
              setAuthForm({ ...authForm, email: e.target.value });
              setFieldErrors((prev) => ({ ...prev, email: "" }));
            }}
            className={inputClass("email")}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div className="mb-2">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={authForm.password}
              onChange={(e) => {
                setAuthForm({ ...authForm, password: e.target.value });
                setFieldErrors((prev) => ({
                  ...prev,
                  password: "",
                  confirmPassword: "",
                }));
              }}
              className={`${inputClass("password")} pr-16`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            Use at least 6 characters, with one letter and one number.
          </p>
        </div>

        {authIsSignup && (
          <>
            <div className="mb-3">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  className={`${inputClass("confirmPassword")} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={authForm.role}
              onChange={(e) =>
                setAuthForm({ ...authForm, role: e.target.value })
              }
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="user">Buyer</option>
              <option value="agent">Agent</option>
            </select>

            <input
              type="text"
              placeholder="WhatsApp (optional)"
              value={authForm.whatsapp}
              onChange={(e) =>
                setAuthForm({ ...authForm, whatsapp: e.target.value })
              }
              className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full rounded-lg py-2.5 font-medium text-white transition ${
            loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Please wait..."
            : authIsSignup
            ? "Create Account"
            : "Sign In"}
        </button>

        <div className="mt-4 text-center text-sm">
          <button
            onClick={handleModeSwitch}
            className="text-blue-600 hover:underline"
          >
            {authIsSignup
              ? "Already have an account? Sign In"
              : "Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
}