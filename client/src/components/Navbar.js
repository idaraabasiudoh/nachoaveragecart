import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiSearch, FiShoppingCart, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null; // Don't show navbar for non-authenticated users
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">Nacho-Average Cart</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 text-gray-600 hover:text-primary-600 flex items-center">
              <FiHome className="mr-1" />
              <span className="hidden md:inline">Home</span>
            </Link>
            
            <Link to="/search" className="p-2 text-gray-600 hover:text-primary-600 flex items-center">
              <FiSearch className="mr-1" />
              <span className="hidden md:inline">Search</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-primary-600 flex items-center"
            >
              <FiLogOut className="mr-1" />
              <span className="hidden md:inline">Logout</span>
            </button>
            
            <div className="ml-4 flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 text-sm font-medium hidden md:inline">
                {user.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
