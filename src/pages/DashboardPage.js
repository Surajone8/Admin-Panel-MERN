import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null); // Dynamic value for orders
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch data for users, products, and orders
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total users, products, and orders count
        const userResponse = await fetch('http://localhost:3001/api/users');
        const productResponse = await fetch('http://localhost:3001/api/products/');
        const orderResponse = await fetch('http://localhost:3001/api/orders/');

        if (!userResponse.ok || !productResponse.ok || !orderResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const userData = await userResponse.json();
        const productData = await productResponse.json();
        const orderData = await orderResponse.json();

        // Set state with fetched data
        setTotalUsers(userData.length); // Assuming the response is an array of users
        setTotalProducts(productData.length); // Assuming the response is an array of products
        setTotalOrders(orderData.totalOrders); // Assuming the response contains totalOrders key

      } catch (err) {
        setError(err.message);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col p-6 space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800">Dashboard</h2>
      <p className="text-lg text-gray-600">Welcome to the admin dashboard!</p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div
          className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between hover:shadow-lg transition duration-300 cursor-pointer"
          onClick={() => navigate('/users')}
        >
          <h3 className="text-xl font-semibold text-gray-800">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{totalUsers !== null ? totalUsers : 'Loading...'}</p>
        </div>
        {/* Total Products Card */}
        <div
          className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between hover:shadow-lg transition duration-300 cursor-pointer"
          onClick={() => navigate('/products')}
        >
          <h3 className="text-xl font-semibold text-gray-800">Total Products</h3>
          <p className="text-3xl font-bold text-green-600">{totalProducts !== null ? totalProducts : 'Loading...'}</p>
        </div>
        {/* Total Orders Card (Dynamic) */}
        <div
          className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between hover:shadow-lg transition duration-300 cursor-pointer"
          onClick={() => navigate('/orders')}
        >
          <h3 className="text-xl font-semibold text-gray-800">Total Orders</h3>
          <p className="text-3xl font-bold text-yellow-600">{totalOrders !== null ? totalOrders : 'Loading...'}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800">Performance Overview</h3>
        <div className="h-60 bg-gray-200 mt-4 rounded-lg"> {/* Placeholder for chart */} </div>
      </div>
    </div>
  );
};

export default DashboardPage;
