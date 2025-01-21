import React, { useEffect, useState, useMemo } from "react";
import OrderRow from "../components/OrderRow";
import FilterModal from "./FilterModal";

const OrderPage = () => {
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
    actionsFilter: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);

  // Fetch orders with pagination
  const fetchOrders = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/api/orders/pagination?page=${page}&limit=${itemsPerPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const result = await response.json();
      setOrders(result.orders);
      setTotalOrders(result.totalOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  // Filter orders based on the applied filters
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
      const matchesActions =
        filters.actionsFilter === "" || order.status === filters.actionsFilter;

      return matchesSearch && matchesAmount && matchesDate && matchesActions;
    });
  };

  const filteredOrders = useMemo(() => filterOrders(orders), [orders, filters]);

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  // Pagination controls
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Display the active filters
  const renderActiveFilters = () => {
    const activeFilters = [];

    if (filters.searchQuery) activeFilters.push(`Search: ${filters.searchQuery}`);
    if (filters.minAmount) activeFilters.push(`Min Amount: ${filters.minAmount}`);
    if (filters.maxAmount) activeFilters.push(`Max Amount: ${filters.maxAmount}`);
    if (filters.startDate) activeFilters.push(`Start Date: ${filters.startDate}`);
    if (filters.endDate) activeFilters.push(`End Date: ${filters.endDate}`);
    if (filters.actionsFilter) activeFilters.push(`Status: ${filters.actionsFilter}`);

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
                if (filter.startsWith("Status")) newFilters.actionsFilter = "";
                setFilters(newFilters);
              }}
            >
              <span className="text-lg text-3xl">&times;</span>
            </button>
          </div>
        ))}
      </div>
    ) : null;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

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
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <OrderRow key={order._id} order={order} />
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

export default OrderPage;
