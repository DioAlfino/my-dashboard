import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-red-600 text-white p-4 shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold flex-1 text-center lg:text-left">
          Admin Dashboard
        </h1>
        {/* Add a mobile menu button */}
        <div className="block lg:hidden flex-shrink-0">
          <button className="text-white focus:outline-none w-full">
            {/* Add a mobile menu icon here */}☰
          </button>
        </div>
        {/* Add a desktop menu */}
        <div className="hidden lg:flex space-x-4">
          <a href="/products" className="hover:bg-red-700 px-3 py-2 rounded-md">
            Products
          </a>
          {/* Add more links if needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
