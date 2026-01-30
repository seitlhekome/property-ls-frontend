// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="flex-shrink-0 bg-gray-800 text-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* About */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white mb-2">Property LS</h2>
          <p className="text-sm">
            Lesotho Real Estate Listings. Browse, buy, rent, or list properties safely and easily.  Developed by Creative hub studios (PTY) Ltd
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="text-sm space-y-1">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/" className="hover:underline">Buy</a></li>
            <li><a href="/" className="hover:underline">Rent</a></li>
            <li><a href="/" className="hover:underline">List Property</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-sm">Email: info@propertyls.com</p>
          <p className="text-sm">Phone: +266 57194234</p>
          <p className="text-sm">Address: Maseru 100, Lesotho</p>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm border-t border-gray-700 mt-4 pt-2">
        &copy; {new Date().getFullYear()} Property LS. All rights reserved.
      </div>
    </footer>
  );
}
