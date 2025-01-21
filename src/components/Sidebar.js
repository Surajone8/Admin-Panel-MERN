import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';

const Sidebar = () => {
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const ordersRef = useRef(null); // Ref to track the height of the orders section

  const navigate = useNavigate();

  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  // Logout function
  const handleLogout = () => {
    // Display a confirmation prompt to the user before logging out
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (!confirmLogout) return;

    // Remove the token from localStorage
    localStorage.removeItem('token');

    window.location.href = '/'; // Redirect to the login page and refresh
  };

  // Toggle dropdown visibility
  const toggleOrdersDropdown = () => {
    setIsOrdersOpen((prev) => !prev);
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-full p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-center mb-8">Admin Panel</h2>
        <ul className="space-y-4 list-none">
          <li>
            <Link to="/dashboard" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/users" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
              Users
            </Link>
          </li>
          <li>
            <Link to="/products" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
              Products
            </Link>
          </li>
          <li>
            <div>
              <button
                onClick={toggleOrdersDropdown}
                className="block text-lg hover:bg-gray-700 py-2 px-4 rounded w-full text-left flex items-center justify-between"
              >
                Orders
                {isOrdersOpen ? (
                  <ChevronUpIcon className="w-5 h-5 text-white" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-white" />
                )}
              </button>
              <div
                ref={ordersRef}
                className={`overflow-hidden transition-all duration-500 ease-in-out`}
                style={{
                  height: isOrdersOpen ? `${ordersRef.current.scrollHeight}px` : '0px', // Set height dynamically
                }}
              >
                <ul className="bg-gray-700 space-y-2 mt-2 rounded list-none">
                  <li>
                    <Link
                      to="/orders/delivered"
                      className="text-lg hover:bg-gray-600 py-2 px-4 rounded flex items-center"
                    >
                      <span className="w-4 h-4">
                        <i className="fas fa-check-circle"></i>
                      </span>
                      <span>Orders Delivered</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders/processing"
                      className="text-lg hover:bg-gray-600 py-2 px-4 rounded flex items-center"
                    >
                      <span className="w-4 h-4">
                        <i className="fas fa-cogs"></i>
                      </span>
                      <span>Orders Processing</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders/pending"
                      className="text-lg hover:bg-gray-600 py-2 px-4 rounded flex items-center"
                    >
                      <span className="w-4 h-4">
                        <i className="fas fa-hourglass-half"></i>
                      </span>
                      <span>Orders Pending</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders/shipped"
                      className="text-lg hover:bg-gray-600 py-2 px-4 rounded flex items-center"
                    >
                      <span className="w-4 h-4">
                        <i className="fas fa-truck"></i>
                      </span>
                      <span>Orders Shipped</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders/cancelled"
                      className="text-lg hover:bg-gray-600 py-2 px-4 rounded flex items-center"
                    >
                      <span className="w-4 h-4">
                        <i className="fas fa-ban"></i>
                      </span>
                      <span>Orders Cancelled</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="mt-auto">
        {!isAuthenticated ? (
          <li className='list-none'>
            <Link to="/" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
              Login
            </Link>
          </li>
        ) : (
          <li className="list-none">
            <button
              onClick={handleLogout}
              className="block text-lg hover:bg-gray-700 py-2 px-4 rounded w-full text-left"
            >
              Logout
            </button>
          </li>
        )}
      </div>
      <footer className="text-center text-sm text-gray-400 mt-8">
        <p>Admin Panel - &copy; 2025</p>
      </footer>
    </div>
  );
};

export default Sidebar;
