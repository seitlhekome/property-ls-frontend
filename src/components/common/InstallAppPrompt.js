import React, { useEffect, useState } from "react";
import "./InstallAppPrompt.css";

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isMobile && !isStandalone) {
      setShowPrompt(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setShowPrompt(false);
      }

      setDeferredPrompt(null);
    } else {
      alert(
        "Open Chrome menu (⋮) and select 'Install app' to install Property LS."
      );
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt-card">
        <button
          className="install-prompt-close"
          onClick={() => setShowPrompt(false)}
        >
          ×
        </button>

        <img
          src="/logo192.png"
          alt="Property LS"
          className="install-prompt-logo"
        />

        <h2>Install Property LS</h2>

        <p>
          Get faster access to properties in Lesotho directly from your home
          screen.
        </p>

        <button
          className="install-prompt-button"
          onClick={handleInstall}
        >
          Install App
        </button>

        <button
          className="install-prompt-later"
          onClick={() => setShowPrompt(false)}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}