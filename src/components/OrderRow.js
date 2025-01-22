import React, { useState, useEffect } from "react";
import OrderStatusDropdown from "./OrderStatusDropdown";

const OrderRow = ({ order, updateOrder, userData, productData }) => {
  const { orderId, userId, productId, quantity, totalAmount, status, date, deliveryDate } = order;
//   console.log("update order", updateOrder)
// console.log(order);



  let formattedDate = "N/A";
  let formattedDeliveryDate = "N/A";
  if (date) {
    formattedDate = new Date(date).toLocaleDateString('en-US');
  }
  if (deliveryDate) {
    formattedDeliveryDate = new Date(deliveryDate).toLocaleDateString('en-US');
  }
//   console.log("formattedDeliveryDate :", formattedDeliveryDate);

  const orderQuantity = quantity?.$numberInt || quantity || 0;
  const orderTotalAmount = totalAmount?.$numberDouble || totalAmount || 0;

  // State to manage modal visibility and form data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    status: status,
    quantity: orderQuantity,
    totalAmount: orderTotalAmount,
    deliveryDate: deliveryDate ? new Date(deliveryDate).toISOString().slice(0, 10) : "", // Format for date input
  });

  const [user, setUser] = useState()
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle opening the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    setFormData((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  // Function to handle order update (status, quantity, totalAmount, etc.)
  const handleUpdateOrder = () => {
    updateOrder(orderId, formData); // Pass the updated form data
    closeModal();
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
        setUser(data);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
//   console.log(userID);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // console.log(data)
        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);









  const Currentuser = order.userId;
//   console.log(Currentuser);
//   console.log(Currentuser? Currentuser[0].name : "username");
// console.log(Currentuser[0])
//   console.log(userData)
  const currentproduct = order.productId;
//   console.log(product)

  return (
    <tr>
      <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">{orderId}</td>
      <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">{Currentuser.email}</td>
      <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">{currentproduct.name}</td>
      <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">{orderQuantity}</td>
      <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">${orderTotalAmount.toFixed(2)}</td>
      <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">{formattedDate}</td>
      <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">{formattedDeliveryDate}</td>
      <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">{status}</td>
      <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Update Order
        </button>
      </td>

      {/* Modal Overlay for updating order */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl mb-4">Update Order</h2>

            {/* Input fields for updating order details */}
            <div className="mb-4">
              <label htmlFor="quantity" className="block">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="px-4 py-2 w-full border rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="totalAmount" className="block">Total Amount</label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
                className="px-4 py-2 w-full border rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="deliveryDate" className="block">Delivery Date</label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                className="px-4 py-2 w-full border rounded"
              />
            </div>

            {/* Order status dropdown */}
            <div className="mb-4">
              <label htmlFor="status" className="block">Status</label>
              <OrderStatusDropdown
                currentStatus={formData.status}
                onStatusChange={handleStatusChange}
              />
            </div>

            {/* Modal action buttons */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUpdateOrder}
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
              >
                Update
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </tr>
  );
};

export default OrderRow;
