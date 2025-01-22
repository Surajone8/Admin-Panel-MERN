import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import OrderPage from './pages/OrderPage';
import OrdersDeliveredPage from './pages/OrdersDeliveredPage'; // New page for delivered orders
import OrdersProcessingPage from './pages/OrdersProcessingPage'; // New page for processing orders
import OrdersPendingPage from './pages/OrdersPendingPage'; // New page for pending orders
import LoginPage from './pages/LoginPage';
import NotFound from './components/NotFound';
import ProtectedRoute from './pages/ProtectedRoute'; // Assuming it's a component
import './App.css';
import EditProductForm from './pages/EditProductForm';
import OrdersShippedPage from './pages/OrdersShippedPage';
import OrdersCancelledPage from './pages/OrdersCancelledPage';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="p-6 flex-1 overflow-auto">
            <Routes>
              {/* Redirect to /dashboard if authenticated, else show LoginPage */}
              <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <UserPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <ProductList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/edit/:id"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <EditProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <OrderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/delivered"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <OrdersDeliveredPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/processing"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <OrdersProcessingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/pending"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <OrdersPendingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/shipped"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <OrdersShippedPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/cancelled"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <OrdersCancelledPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-product"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <ProductForm />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route for not found pages */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
