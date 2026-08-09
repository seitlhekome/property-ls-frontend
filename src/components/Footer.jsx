// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex-shrink-0 bg-gray-800 text-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* About */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white mb-2">
            Property LS
          </h2>

          <p className="text-sm leading-6 text-gray-300">
            Lesotho Real Estate Listings. Browse, buy, rent, or list properties
            safely and easily. Developed by Creative Hub Studios (PTY) Ltd.
          </p>
        </div>

        {/* Explore */}
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-2">
            Explore
          </h3>

          <ul className="text-sm space-y-2">
            <li>
              <Link
                to="/"
                className="text-gray-300 hover:text-white hover:underline transition-colors"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/map"
                className="text-gray-300 hover:text-white hover:underline transition-colors"
              >
                Explore Map
              </Link>
            </li>

            <li>
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-white hover:underline transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-2">
            Contact
          </h3>

          <div className="text-sm space-y-2 text-gray-300">
            <p>
              Phone:{" "}
              <a
                href="tel:+26657194234"
                className="hover:text-white hover:underline transition-colors"
              >
                +266 57194234
              </a>
            </p>

            <p>
              Address: Maseru 100, Lesotho
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center text-sm text-gray-400">
          <span>
            &copy; {new Date().getFullYear()} Property LS. All rights reserved.
          </span>

          <span className="hidden sm:inline">·</span>

          <Link
            to="/privacy"
            className="hover:text-white hover:underline transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}