import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin); // Switch between Login and Signup form
    setErrorMessage(''); // Reset error message when toggling
  };

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Login successful!');
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };


  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Signup successful! Please log in.');
        setIsLogin(true); // Switch to Login form after successful signup
      } else {
        setErrorMessage(data.message || 'Signup failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-600 text-center mb-4">{errorMessage}</div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="text-green-600 text-center mb-4">{successMessage}</div>
        )}

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none"
            >
              Login
            </button>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">Don't have an account?</span>
              <button
                onClick={toggleForm}
                className="text-sm text-blue-600 hover:underline ml-1"
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none"
            >
              Sign Up
            </button>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">Already have an account?</span>
              <button
                onClick={toggleForm}
                className="text-sm text-blue-600 hover:underline ml-1"
              >
                Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
