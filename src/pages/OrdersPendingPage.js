// components/OrdersPendingPage.js
import React, { useEffect, useState, useMemo } from "react";
import OrderRow from "../components/OrderRow";
import FilterModal from "./FilterModal"; // Import FilterModal
import emailjs from "emailjs-com";



const OrdersPendingPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // For Filter Modal
  const [showAddOrderModal, setShowAddOrderModal] = useState(false); // For Add Order Modal
  const [filters, setFilters] = useState({
    searchQuery: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });
  const [newOrder, setNewOrder] = useState({
    // orderId: '',
    userId: '',
    productId: '',
    quantity: 1,
    status: 'Pending',
    // date: '',
    totalAmount: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [singleProduct, setSingleProduct] = useState(null);

//   const [users, setUsers] = useState([]);
  const [userEmails, setUserEmails] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [singleProductID, setSingleProductID] = useState(null);
  const [user, setUser] = useState()
  const [product, setProduct] = useState();
  const [currProductStock, setCurrProductStock] = useState();

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
      setOrders(result.orders);
      console.log(orders)
      setTotalOrders(result.totalOrders); // Set totalOrders to update pagination
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
//   console.log("orders data",orders)

  useEffect(() => {
    fetchOrders(currentPage, "Pending");
  }, [currentPage]);
//   console.log(orders)

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
      const matchesDeliveredStatus = order.status === "Pending";

      return matchesSearch && matchesAmount && matchesDate && matchesDeliveredStatus;
    });
  };

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        // setUsers(data);
        setLoading(false);

        // Extracting the _id from each user and storing it in an array
        // const userIds = data.map(user => user._id);
        // console.log(data);
        setUserEmails(data.map(user => user.email));
        setUser(data);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
//   console.log(userNames);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // console.log(data)
        setProductNames(data.map(product => product.name)); // Set the products state with the fetched products
        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);

//   console.log(product)



  const filteredOrders = useMemo(() => filterOrders(orders), [orders, filters]);

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
              <span className="text-lg text-3xl">&times;</span>
            </button>
          </div>
        ))}
      </div>
    ) : null;
  };

  const handleAddOrderChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)

    // Handle the "quantity" field specifically
    if (name === "quantity") {
      const quantity = parseInt(value, 10);

      // Check for max value
      if (quantity > (singleProduct ? singleProduct.stock : 100)) {
        setError(`Quantity cannot exceed ${singleProduct ? singleProduct.stock : 100}.`);
      } else {
        setError(""); // Clear the error if value is valid
      }
    }

    // const productID = user.filter(e => e.email.toLowerCase().includes(value.toLowerCase()))[0]._id

    // If the date is empty, set the current date automatically
    if (name === "date" && !value) {
      const now = new Date();
      const day = now.getDate();
      const month = now.getMonth() + 1; // Months are zero-indexed
      const year = now.getFullYear();
      // Format date as YYYY-MM-DD
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      setNewOrder((prevOrder) => ({
        ...prevOrder,
        [name]: formattedDate,
      }));
    } else {
      setNewOrder((prevOrder) => ({
        ...prevOrder,
        [name]: value,
      }));
    }
  };

  const handleAddOrderChangeUserId = (e) => {
    const { name, value } = e.target;
    console.log(name);
    const userID = user.filter(e => e.email.toLowerCase().includes(value.toLowerCase()))[0]._id
  console.log(userID)
    // setSingleProductID(userI)

  setNewOrder((prevOrder) => ({
    ...prevOrder,
    [name]: userID,
  }));
};

  const handleAddOrderChangeProductId = (e) => {
      const { name, value } = e.target;
      console.log(name);
    const productID = product.filter(e => e.name.toLowerCase().includes(value.toLowerCase()))[0]._id
    console.log(productID)
    // conaole.log()
      setSingleProductID(productID)

    setNewOrder((prevOrder) => ({
      ...prevOrder,
      [name]: productID,
    }));
  };

//   console.log(product.filter(e => e.name.toLowerCase().includes(value.toLowerCase())))

  const fetchProduct = async ({ productID }) => {
    try {
      console.log("Fetching product with ID:", productID);

      const response = await fetch(`http://localhost:3001/api/products/${productID}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }

      const data = await response.json();
      console.log("Fetched product data:", data);
      setCurrProductStock(data.stock);
    //   console.log(currProductStock);

      setSingleProduct(data);
      setError(null); // Clear previous errors
    } catch (err) {
      console.error("Error fetching product:", err.message);
      setSingleProduct(null); // Clear previous product data
      setError(err.message);
    }
  };

  useEffect(() => {
    if (singleProductID) {
      fetchProduct({ productID: singleProductID }); // Pass the dynamic ID here
    }
  }, [singleProductID]); // Re-run when singleProductID changes


//   console.log(singleProductID)
//   console.log(currProductStock)
const sendLowStockEmail = (product) => {
    console.log("inside email");
    setLoading(true);

    emailjs
      .send(
        "service_sokretx", // Replace with your EmailJS service ID
        "template_ew9z2yz", // Replace with your EmailJS template ID
        {
          from_name: "Inventory Management System", // Sender name
          to_name: "Admin", // Recipient name
          product_name: product.name, // Product name
          product_id: product._id, // Product ID
          product_price: product.price, // Product price
          product_stock: product.stock, // Product stock level
          to_email: "ysuraj18333@gmail.com", // Replace with the recipient's email
        },
        "xRLnnNajFxTGjT-En" // Replace with your EmailJS user ID
      )
      .then(
        () => {
          setLoading(false);
          console.log("Low stock email sent successfully.");
          alert('email sent successfully');
        },
        (error) => {
          setLoading(false);
          console.error("Failed to send low stock email:", error);
        }
      );
  };







  const totalPrice = singleProduct ? singleProduct.price * newOrder.quantity : 0;

  const handleAddOrderSubmit = async (e) => {
    e.preventDefault();

    // Calculate the total amount dynamically
    const totalAmount = singleProduct ? singleProduct.price * newOrder.quantity : 0;

    // Ensure the totalAmount is updated before sending the data
    const orderToSubmit = { ...newOrder, totalAmount };
    const newPrice = currProductStock - newOrder.quantity;
    console.log(newPrice, newOrder);

    try {
        // 1. Submit the order first
        const orderResponse = await fetch("http://localhost:3001/api/orders/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderToSubmit),
        });

        if (!orderResponse.ok) {
            const result = await orderResponse.json();
            throw new Error(result.message || "Failed to add order");
        }

        const result = await orderResponse.json();
        console.log("Order Added:", result);

        // 2. Update the product stock count
        const updatedProduct = {
            ...singleProduct,
            stock: newPrice // Update the stock count based on the new price
        };

        const productResponse = await fetch(`http://localhost:3001/api/products/${singleProduct._id}`, {
            method: "PUT", // Make sure to use PUT method for updating
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        });

        if (!productResponse.ok) {
            const result = await productResponse.json();
            throw new Error(result.message || "Failed to update product stock");
        }

        const updatedProductData = await productResponse.json();
        console.log("Product Stock Updated:", updatedProductData);


        if (updatedProductData.product.stock <= 15) {
            // Send low stock email
            console.log("calling email...");
            sendLowStockEmail(updatedProductData.product);
          }

          console.log("after email function");

        // 3. Finalize order flow
        setShowAddOrderModal(false); // Close the modal after success
        setNewOrder({
            userId: '',
            productId: '',
            quantity: 1,
            status: 'Pending',
            totalAmount: '',
        }); // Reset form fields
        setSingleProduct(null); // Reset product data after submitting the order
        fetchOrders(currentPage, "Pending"); // Refresh orders list
    } catch (error) {
        console.error("Error adding order:", error.message);
        alert(error.message); // Show the specific error message (e.g., duplicate orderId)
    }
};



//   function getCurrentDateTime() {
//     const now = new Date();

//     const day = now.getDate();
//     const month = now.getMonth() + 1; // Months are zero-indexed
//     const year = now.getFullYear();

//     let hours = now.getHours();
//     const minutes = now.getMinutes().toString().padStart(2, '0');
//     const seconds = now.getSeconds().toString().padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';

//     // Convert to 12-hour format
//     hours = hours % 12;
//     hours = hours ? hours : 12; // The hour '0' should be '12'

//     return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
//   }

//   const CurrentDateTime = getCurrentDateTime();
//   console.log(CurrentDateTime)


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
      fetchOrders(currentPage, "Pending");
      console.log('Order updated successfully:', updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };


//   console.log(user);
//   console.log(product)




  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pending Orders</h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowAddOrderModal(true)} // Show the modal
          className="mt-6 bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition duration-300"
        >
          Add New Order
        </button>
        <button
          onClick={() => setShowModal(true)} // Show the filter modal
          className="mt-6 bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition duration-300"
        >
          Filter
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {renderActiveFilters()}

      {filteredOrders.length > 0 ? (
        <table className="min-w-full table-auto mb-6 shadow-lg rounded-lg overflow-hidden bg-white opacity-0 animate-fade-in">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">User Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">Product Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">Total Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">Delivery Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <OrderRow key={order._id} order={order} updateOrder={updateOrder} userData={user} productData={product} />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found</p>
      )}

<div className="flex justify-center mt-6 gap-3">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg disabled:opacity-50 transition-all"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-6 py-3 font-semibold rounded-lg transition-all ${
              currentPage === index + 1
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg disabled:opacity-50 transition-all"
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

      {/* Add Order Modal */}
      {showAddOrderModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Add New Order</h2>
            <form onSubmit={handleAddOrderSubmit}>
              {/* <div className="mb-4">
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
                  Order ID
                </label>
                <input
                  type="text"
                  id="orderId"
                  name="orderId"
                  value={newOrder.orderId}
                  onChange={handleAddOrderChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div> */}
              <div className="mb-4">
                  <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                    User ID (By name)
                  </label>
                  <select
                    id="userId"
                    name="userId"
                    value={newOrder.userId} // Use newOrder.userId here
                    onChange={handleAddOrderChangeUserId} // Keep your existing onChange function
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="" disabled>Select User</option>
                    {userEmails.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
                    Product ID
                  </label>
                  <select
                    id="productId"
                    name="productId"
                    value={newOrder.productId} // Use newOrder.productId here
                    onChange={handleAddOrderChangeProductId} // Keep your existing onChange function
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="" disabled>Select Product</option>
                    {productNames.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
        Quantity
      </label>
      <input
        type="number"
        id="quantity"
        name="quantity"
        min={1}
        max={singleProduct ? singleProduct.stock : 100} // Ensure max value is set correctly
        value={newOrder.quantity}
        onChange={handleAddOrderChange}
        required
        className={`mt-1 block w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
      />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>

              <div className="mb-4">
                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
                  Total Amount
                </label>
                <input
                  type="number"
                  id="totalAmount"
                  name="totalAmount"
                  value={totalPrice}
                  onChange={handleAddOrderChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {/* <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newOrder.date}
                  onChange={handleAddOrderChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div> */}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddOrderModal(false)}
                  className="mr-4 px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Add Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPendingPage;
