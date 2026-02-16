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
  const [errorMsg, setErrorMsg] = useState(""); // ✅ store error messages

  const handleSubmit = async () => {
    setErrorMsg(""); // reset previous error
    try {
      if (authIsSignup) {
        await signup(authForm); // wait for signup
      } else {
        await login(authForm); // wait for login
      }
      setShowAuthModal(false); // close modal on success
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong"); // display error inside modal
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 relative">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-2 right-2 text-gray-600 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {authIsSignup ? "Create Account" : "Sign In"}
        </h2>

        {errorMsg && (
          <div className="mb-3 text-red-600 font-medium">{errorMsg}</div>
        )}

        {authIsSignup && (
          <input
            type="text"
            placeholder="Full Name"
            value={authForm.name}
            onChange={(e) =>
              setAuthForm({ ...authForm, name: e.target.value })
            }
            className="w-full mb-3 px-3 py-2 border rounded"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={authForm.email}
          onChange={(e) =>
            setAuthForm({ ...authForm, email: e.target.value })
          }
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={authForm.password}
          onChange={(e) =>
            setAuthForm({ ...authForm, password: e.target.value })
          }
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        {authIsSignup && (
          <>
            <label className="font-medium mb-1 block">Role</label>
            <select
              value={authForm.role}
              onChange={(e) =>
                setAuthForm({ ...authForm, role: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded"
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
              className="w-full mb-3 px-3 py-2 border rounded"
            />
          </>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Please wait..."
            : authIsSignup
            ? "Create Account"
            : "Sign In"}
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setAuthIsSignup(!authIsSignup);
              setErrorMsg(""); // clear errors when switching
            }}
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
