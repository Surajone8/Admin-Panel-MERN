import React, { useEffect, useState, useMemo } from "react";
import OrderRow from "../components/OrderRow";
import FilterModal from "./FilterModal"; // Import FilterModal

const OrdersProcessingPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);

  // Function to fetch orders with the "Processing" status
  const fetchOrders = async (page, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/api/orders/pagination?page=${page}&limit=${itemsPerPage}&status=${status}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const result = await response.json();
      console.log("API Response:", result); // Add this log to check the API response
      setOrders(result.orders);
      setTotalOrders(result.totalOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

//   const updateOrderStatus = async (orderId, newStatus, page) => {
//     try {
//       const response = await fetch(`http://localhost:3001/api/orders/update-status/${orderId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (response.ok) {
//         const updatedOrder = await response.json();
//         console.log("Order status updated:", updatedOrder);
//         alert(updatedOrder.orderId +" Added To "+ updatedOrder.status)

//         // Call fetchOrders after the status is updated
//         fetchOrders(currentPage, "Processing");
//       } else {
//         throw new Error('Failed to update order status');
//       }
//     } catch (error) {
//       console.error("Error updating order status:", error);
//     }
//   };

  // Use useEffect to fetch orders when the page or filters change
  useEffect(() => {
    const status = "Processing"; // We're fetching orders with the "Processing" status
    fetchOrders(currentPage, status);
  }, [currentPage]);

  // Filter orders based on the filters state
  const filterOrders = (orders) => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderId.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesAmount =
        (filters.minAmount === "" || order.totalAmount >= parseFloat(filters.minAmount)) &&
        (filters.maxAmount === "" || order.totalAmount <= parseFloat(filters.maxAmount));
      const matchesDate =
        (filters.startDate === "" || new Date(order.date) >= new Date(filters.startDate)) &&
        (filters.endDate === "" || new Date(order.date) <= new Date(filters.endDate));
      const matchesStatus = order.status === "Processing"; // Ensure we're only filtering "Processing" orders

      return matchesSearch && matchesAmount && matchesDate && matchesStatus;
    });
  };

  const filteredOrders = useMemo(() => filterOrders(orders), [orders, filters]);

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Helper function to display the active filters
  const renderActiveFilters = () => {
    const activeFilters = [];

    if (filters.searchQuery) activeFilters.push(`Search: ${filters.searchQuery}`);
    if (filters.minAmount) activeFilters.push(`Min Amount: ${filters.minAmount}`);
    if (filters.maxAmount) activeFilters.push(`Max Amount: ${filters.maxAmount}`);
    if (filters.startDate) activeFilters.push(`Start Date: ${filters.startDate}`);
    if (filters.endDate) activeFilters.push(`End Date: ${filters.endDate}`);

    return activeFilters.length > 0 ? (
      <div className="mb-4 p-2 bg-gray-100 rounded-lg shadow-sm flex flex-wrap gap-2">
        <strong>Active Filters:</strong>
        {activeFilters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
            <span className="text-base">{filter}</span>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => {
                const newFilters = { ...filters };
                if (filter.startsWith("Search")) newFilters.searchQuery = "";
                if (filter.startsWith("Min Amount")) newFilters.minAmount = "";
                if (filter.startsWith("Max Amount")) newFilters.maxAmount = "";
                if (filter.startsWith("Start Date")) newFilters.startDate = "";
                if (filter.startsWith("End Date")) newFilters.endDate = "";
                setFilters(newFilters);
              }}
            >
              <span className="text-lg text-3xl">&times;</span> {/* X button */}
            </button>
          </div>
        ))}
      </div>
    ) : null;
  };

  const updateOrder = async (orderId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/update-order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const updatedOrder = await response.json();
      fetchOrders(currentPage, "Processing");
      console.log('Order updated successfully:', updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Processing Orders</h1>

      {/* Filter Modal Trigger */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Filter Orders
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Active Filters */}
      {renderActiveFilters()}

      {filteredOrders.length > 0 ? (
        <table className="min-w-full table-auto mb-6">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Order ID</th>
              <th className="border px-4 py-2 text-left">User ID</th>
              <th className="border px-4 py-2 text-left">Product ID</th>
              <th className="border px-4 py-2 text-left">Quantity</th>
              <th className="border px-4 py-2 text-left">Total Amount</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Delivery Date</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <OrderRow
              key={order._id}
              order={order}
              updateOrder={updateOrder} // Pass the function here
            />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Filter Modal */}
      <FilterModal
        showModal={showModal}
        setShowModal={setShowModal}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

export default OrdersProcessingPage;
