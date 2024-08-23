"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle window resize events
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setIsOpen(true); // Show sidebar on large screens
    } else {
      setIsOpen(false); // Hide sidebar on small screens
    }
  };

  // Setup event listener for window resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initial check on component mount
  useEffect(() => {
    handleResize();
  }, []);

  return (
    <div>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-0 left-0 p-4 bg-red-600 text-white z-50"
      >
        ☰
      </button>
      <div
        className={`fixed top-0 left-0 w-64 bg-slate-200 shadow-md transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 lg:relative lg:w-64`}
      >
        <ul className="p-4">
          <li className="p-4">
            <Link href="/product-list">Products</Link>
          </li>
          <li className="p-4">
            <Link href="/category">Categories</Link>
          </li>
          <li className="p-4">
            <Link href="/stores">Stores Products</Link>
          </li>
          <li className="p-4">
            <Link href="/home">Home</Link>
          </li>
          {/* Add more items as needed */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
