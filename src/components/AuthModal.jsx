import React from "react";

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
  const handleSubmit = () => {
    if (authIsSignup) {
      signup(authForm);
    } else {
      login(authForm);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">
          {authIsSignup ? "Create Account" : "Sign In"}
        </h2>

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
            <label className="font-medium">Role</label>
            <select
              value={authForm.role}
              onChange={(e) =>
                setAuthForm({ ...authForm, role: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded"
            >
              <option value="buyer">Buyer</option>
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading
            ? "Please wait..."
            : authIsSignup
            ? "Create Account"
            : "Sign In"}
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={() => setAuthIsSignup(!authIsSignup)}
            className="text-blue-600"
          >
            {authIsSignup
              ? "Have an account? Sign In"
              : "Create an account"}
          </button>
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-gray-500 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
