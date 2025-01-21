import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // If using react-router for navigation

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
