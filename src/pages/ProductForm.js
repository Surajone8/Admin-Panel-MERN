// ProductForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";  // Import the generic InputField component

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook to navigate after form submission

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to create product");
      }
      const newProduct = await response.json();
      navigate("/products");  // Redirect to the product list page after adding the product
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded shadow-lg">
        <InputField
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <InputField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <InputField
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          type="number"
          required
        />
        <InputField
          label="Stock"
          name="stock"
          value={formData.stock}
          onChange={handleInputChange}
          type="number"
          required
        />
        <InputField
          label="Image URL"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleInputChange}
          type="url"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
