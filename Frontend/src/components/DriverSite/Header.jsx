import React from 'react';
import { Menu, MapPin, Bell, User } from 'lucide-react';

const Header = ({ onMenuToggle }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left side */}
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 lg:hidden"
              onClick={onMenuToggle}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
              <span className="text-2xl font-bold text-emerald-500">DeliverEase</span>
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 mr-4">
              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
              <span>San Francisco</span>
            </div>

            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative mr-2">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            <div className="ml-3 relative">
              <div>
                <button className="flex items-center max-w-xs bg-gray-100 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                  <span className="sr-only">Open user menu</span>
                  <User className="h-8 w-8 rounded-full p-1" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
