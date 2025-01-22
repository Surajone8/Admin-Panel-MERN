import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProductFormModal = ({ currentProduct, onClose, onSave }) => {
    const product = currentProduct;
    // console.log(product.name)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize the form data when editing a product
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = product ? "PUT" : "POST";  // Use PUT for updating and POST for creating
    const url = product
      ? `http://localhost:3001/api/products/${product._id}`  // Update the specific product
      : "http://localhost:3001/api/products/create";  // Create a new product

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(product ? "Failed to update product" : "Failed to create product");
      }

      const result = await response.json();
      navigate("/products"); // Redirect to the product list page after success

      // If onSave callback is passed, call it to notify the parent component
      if (onSave) onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2 className="text-xl font-bold mb-4">{product ? "Edit Product" : "Add New Product"}</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}  {/* Show error message if any */}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
