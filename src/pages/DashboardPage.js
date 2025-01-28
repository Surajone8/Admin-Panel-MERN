import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { jwtDecode } from "jwt-decode";
import axios from 'axios'


// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardPage = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [error, setError] = useState(null);
  const [orderDates, setOrderDates] = useState([]);
  const [dateCounts, setDateCounts] = useState({});
  const [chartData, setChartData] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueByDate, setRevenueByDate] = useState({});
  const [refProductData, setRefProductData] = useState();
  const [refUserData, setRefUserData] = useState();
  const [statusData, setStatusData] = useState({});
  const [countryCount, setCountryCount] = useState([]);
  const [countryFlagData, setCountryFlagData] = useState({});

  const [selectedChart, setSelectedChart] = useState('orders'); // Track the selected chart
  const navigate = useNavigate();



  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch data (same as before)
        const userResponse = await fetch('http://localhost:3001/api/users');
        const productResponse = await fetch('http://localhost:3001/api/products/');
        const orderResponse = await fetch('http://localhost:3001/api/orders/');
        const orderCheckResponse = await fetch('http://localhost:3001/api/orders/full');

        if (!userResponse.ok || !productResponse.ok || !orderResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const userData = await userResponse.json();
        const productData = await productResponse.json();
        const orderData = await orderResponse.json();
        const orderFullData = await orderCheckResponse.json();

        // Extract and process order dates and revenue
        const orderDates = orderFullData.orders.map(order => order.date.split('T')[0]);
        const orderStatus = orderFullData.orders.map(order => order.status);
        const userCountryCount = userData.map(user => user.address["country"]);
        setRefProductData(productData);
        setRefUserData(userData);

        // Count the number of orders for each date
        const dateCounts = orderDates.reduce((acc, date) => {
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const countryCountex = userCountryCount.reduce((acc, country) => {
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {});
        setCountryCount(countryCountex);

        const statusCount = orderStatus.reduce((acc, Status) => {
          acc[Status] = (acc[Status] || 0) + 1;
          return acc;
        }, {});

        // Calculate total revenue for each date
        const revenueByDate = orderFullData.orders.reduce((acc, order) => {
          const date = order.date.split('T')[0];
          const revenue = order.totalAmount;
          acc[date] = (acc[date] || 0) + revenue;
          return acc;
        }, {});

        // Calculate top products sold based on quantity
        const calculateTopProducts = (orders, by = 'quantity') => {
          const productMap = {};

          orders.forEach(order => {
            if (order.status === 'Cancelled' || !order.productId) return;

            const product = productData.find(prod => prod._id === order.productId);
            const productName = product ? product.name : 'Unknown Product';
            const quantity = order.quantity;
            const revenue = quantity * order.totalAmount;

            if (productMap[productName]) {
              if (by === 'quantity') {
                productMap[productName].quantity += quantity;
              } else if (by === 'revenue') {
                productMap[productName].revenue += revenue;
              }
            } else {
              productMap[productName] = {
                quantity: by === 'quantity' ? quantity : 0,
                revenue: by === 'revenue' ? revenue : 0,
              };
            }
          });

          const sortedProducts = Object.keys(productMap).map(key => ({
            productName: key,
            quantity: productMap[key].quantity,
            revenue: productMap[key].revenue,
          }));

          return sortedProducts.sort((a, b) => {
            return by === 'quantity'
              ? b.quantity - a.quantity
              : b.revenue - a.revenue;
          }).slice(0, 10);
        };

        const topSellingProducts = calculateTopProducts(orderFullData.orders, 'quantity');

        // Set state with fetched data
        setTotalUsers(userData.length);
        setTotalProducts(productData.length);
        setTotalOrders(orderData.totalOrders);
        setOrderDates(orderDates);
        setStatusData(statusCount);
        setDateCounts(dateCounts);
        setRevenueByDate(revenueByDate);
        setTopProducts(topSellingProducts);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch dashboard data when the component is mounted
    fetchDashboardData();

    // Fetch country flags when the country count is updated
    if (countryCount && Object.keys(countryCount).length > 0) {
      async function fetchCountryFlags() {
        const countryFlags = {};
        for (const country of Object.keys(countryCount)) {
          try {
            const response = await fetch(
              `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}`
            );

            if (!response.ok) {
              throw new Error(`Failed to fetch flag for ${country}`);
            }

            const countryData = await response.json();
            countryFlags[country] = {
              flag: countryData[0].flags.svg, // SVG URL for the flag
              count: countryCount[country], // User count
            };
          } catch (error) {
            console.error(`Failed to fetch flag for ${country}:`, error.message);
          }
        }

        console.log("Country Flags with Counts:", countryFlags);
        setCountryFlagData(countryFlags);
      }

      fetchCountryFlags();
    }
  }, [countryCount]); // Dependency array ensures this effect runs when countryCount changes

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  console.log(countryCount);










  const ordersGraphData = {
    labels: Object.keys(dateCounts),
    datasets: [
      {
        label: "Orders Count",
        data: Object.values(dateCounts),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const revenueGraphData = {
    labels: Object.keys(revenueByDate),
    datasets: [
      {
        label: "Revenue Over Time",
        data: Object.values(revenueByDate),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const topProductsGraphData = {
    labels: topProducts.map(p => p.productName),
    datasets: [
      {
        label: "Quantity Sold",
        data: topProducts.map(p => p.quantity),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const labels = Object.keys(statusData); // ["Pending", "Completed", "Cancelled", "Shipped"]
  const data = Object.values(statusData); // [45, 120, 30, 60]

  console.log(labels, data);

  const pieChartData = {
    labels: labels,
    datasets: [
      {
        label: "Order Status Distribution",
        data: data,
        backgroundColor: [
            "#FF6384", // Pending
            "#36A2EB", // Completed
            "#FFCE56", // Cancelled
            "#4BC0C0", // Shipped
            "#9966FF"  // Processing
          ],
          hoverBackgroundColor: [
            "#FF6384", // Pending
            "#36A2EB", // Completed
            "#FFCE56", // Cancelled
            "#4BC0C0", // Shipped
            "#9966FF"  // Processing
          ],
          borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            const total = tooltipItem.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };



  const graphOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const getTop10LowStockProducts = () => {
    if (!Array.isArray(refProductData)) {
      return []; // Return an empty array if products is not an array
    }

    // Filter products with stock 15 or less
    const lowStockProducts = refProductData.filter(product => product.stock <= 15);

    // If there are products with stock 15 or less, call the function
    if (lowStockProducts.length > 0) {
      handleLowStockProducts(lowStockProducts); // Call your custom function (you can change this to whatever function you want to call)
    }

    return refProductData
      .sort((a, b) => a.stock - b.stock) // Sort products by stock in ascending order
      .slice(0, 10); // Get the first 10 products (lowest stock)
  };

  const token = localStorage.getItem('token');

const handleLowStockProducts = (refProductData) => {
    // Check if there are any products with stock of 15 or less
    const lowStockProducts = refProductData.filter(product => product.stock <= 15);

    // If there are low stock products, perform the action (e.g., show alert, log them)
    if (lowStockProducts.length > 0) {

      const token = localStorage.getItem('token');
      if (token) {
        try {

          const decodedToken = jwtDecode(token);

          const userId = decodedToken.userId;
          const user = refUserData.find(user => user._id === userId);
        //   const userEmail = user.email;

          // Log or use the user info as needed
        //   console.log("User ID:", userId);
        //   console.log("User Email:", userEmail);

        } catch (error) {
          console.error("Invalid token or token has expired", error);
        }
      } else {
        console.log("No token found in localStorage");
      }
    }
  };



//   let ProductsWithLeastStock = getTop10LowStockProducts();
//   console.log(ProductsWithLeastStock)
console.log([countryCount])

  return (
    <div className="flex flex-col p-6 space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800">Dashboard</h2>
      <p className="text-lg text-gray-600">Welcome to the admin dashboard!</p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Total Users Card */}
  <div
    className="bg-white shadow-xl rounded-lg p-8 flex flex-col items-center justify-between hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-105"
    onClick={() => navigate('/users')}
  >
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Total Users</h3>
    <p className="text-4xl font-extrabold text-blue-600">{totalUsers !== null ? totalUsers : 'Loading...'}</p>
    <div className="mt-6 w-full h-1 bg-blue-600 rounded-full"></div>
  </div>

  {/* Total Products Card */}
  <div
    className="bg-white shadow-xl rounded-lg p-8 flex flex-col items-center justify-between hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-105"
    onClick={() => navigate('/products')}
  >
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Total Products</h3>
    <p className="text-4xl font-extrabold text-green-600">{totalProducts !== null ? totalProducts : 'Loading...'}</p>
    <div className="mt-6 w-full h-1 bg-green-600 rounded-full"></div>
  </div>

  {/* Total Orders Card */}
  <div
    className="bg-white shadow-xl rounded-lg p-8 flex flex-col items-center justify-between hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-105"
    onClick={() => navigate('/orders')}
  >
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Total Orders</h3>
    <p className="text-4xl font-extrabold text-yellow-600">{totalOrders !== null ? totalOrders : 'Loading...'}</p>
    <div className="mt-6 w-full h-1 bg-yellow-600 rounded-full"></div>
  </div>
</div>


      {/* Buttons to toggle charts */}
      <div className="flex space-x-4 mb-6">
        <button
          className="bg-teal-500 text-white py-2 px-4 rounded"
          onClick={() => setSelectedChart('orders')}
        >
          Orders by Date
        </button>
        <button
          className="bg-purple-600 text-white py-2 px-4 rounded"
          onClick={() => setSelectedChart('revenue')}
        >
          Revenue Over Time
        </button>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded"
          onClick={() => setSelectedChart('topProducts')}
        >
          Top Products Sold
        </button>
        <button
          className="bg-rose-500 text-white py-2 px-4 rounded"
          onClick={() => setSelectedChart('OrderStatus')}
        >
          Order Status
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {selectedChart === 'orders' && (
            <>
            <h3 className="text-xl font-semibold text-gray-800">Sales By Date</h3>
            <div style={{ width: '100%', height: '500px', margin: "0 auto" }}>
            <Bar data={ordersGraphData} options={graphOptions} />
          </div>
            </>

        )}
        {selectedChart === 'revenue' && (
            <>
            <h3 className="text-xl font-semibold text-gray-800">Revenue Over Time</h3>
            <div style={{ width: '100%', height: '500px', margin: "0 auto" }}>
            <Bar data={revenueGraphData} options={graphOptions} />
          </div>
            </>

        )}
        {selectedChart === 'topProducts' && (
            <>
            <h3 className="text-xl font-semibold text-gray-800">Top Products Sold</h3>
            <div style={{ width: '100%', height: '500px', margin: "0 auto" }}>
            <Bar data={topProductsGraphData} options={graphOptions} />
          </div>
            </>

        )}
        {selectedChart === 'OrderStatus' && (
            <>
            <h3 className="text-xl font-semibold text-gray-800">Order Status Distribution</h3>
            <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
              {Object.keys(statusData).length > 0 ? (
                <Doughnut data={pieChartData} options={pieOptions} />
              ) : (
                <p className="text-center text-gray-500">No data available to display.</p>
              )}
            </div>
            </>
        )}
      </div>


      <div className="container mx-auto px-4 py-8">
  <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Dashboard</h1>
  <div className="overflow-x-auto bg-white shadow-md rounded-lg max-w-6xl mx-auto">
    <table className="min-w-full table-auto border-collapse">
      <thead className="bg-indigo-600 text-white">
        <tr>
          <th className="px-6 py-4 text-left font-semibold text-sm">Country & Flag</th>
          <th className="px-6 py-4 text-left font-semibold text-sm">User Count</th>
        </tr>
      </thead>
      <tbody className="bg-gray-50">
        {Object.keys(countryFlagData).map((country, index) => (
          <tr
            key={country}
            className={`border-b hover:bg-indigo-100 transition-colors duration-300 ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
            }`}
          >
            <td className="px-6 py-4 flex items-center space-x-2 text-gray-700">
              <img
                src={countryFlagData[country].flag}
                alt={country}
                className="w-8 h-6 rounded-lg border"
              />
              <span>{country}</span>
            </td>
            <td className="px-6 py-4 text-gray-700 font-medium">{countryFlagData[country].count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>








      <div className="p-6 bg-gradient-to-r from-blue-50 to-teal-50 shadow-xl rounded-xl">
  <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Top 10 Products with Lowest Stock</h2>
  <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
    <table className="min-w-full table-auto text-sm text-left text-gray-600">
      <thead className="bg-teal-600 text-white uppercase tracking-wider">
        <tr>
          <th className="px-6 py-4 text-lg font-medium">Product Name</th>
          <th className="px-6 py-4 text-lg font-medium">Stock</th>
        </tr>
      </thead>
      <tbody>
      {getTop10LowStockProducts().map((product) => (
          <tr
            key={product._id}
            className={`px-6 py-4 border-b border-gray-200 font-semibold transition duration-300 ${
              product.stock <= 15 ? 'bg-red-200' : 'hover:bg-teal-50'
            }`}
          >
            <td className="px-6 py-4 border-b border-gray-200">{product.name}</td>
            <td className="px-6 py-4 border-b border-gray-200">{product.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};

export default DashboardPage;
