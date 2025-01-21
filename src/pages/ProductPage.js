import React, { useEffect, useState } from "react";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for new product form and update form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data); // Set products data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Only fetch once on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateProduct = async (e) => {
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

      // After product is added, re-fetch products to update the list
      await fetchProducts();

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/products/${currentProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      const updatedProduct = await response.json();
      const updatedProducts = products.map((product) =>
        product._id === currentProductId ? updatedProduct : product
      );
      setProducts(updatedProducts);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
      });
      setIsUpdateMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });
    setIsUpdateMode(true);
    setCurrentProductId(product._id);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch the products again after adding a new product
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="products-page p-6">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <p className="mb-6">Manage all products here.</p>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <table className="min-w-full table-auto mb-6">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-left">Stock</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">{product.price}</td>
                  <td className="border px-4 py-2">{product.stock}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Form to Add or Update Product */}
          <form
            onSubmit={isUpdateMode ? handleUpdateProduct : handleCreateProduct}
            className="bg-gray-100 p-6 rounded shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">{isUpdateMode ? "Update Product" : "Add New Product"}</h3>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block mb-2">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block mb-2">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="stock" className="block mb-2">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block mb-2">Image URL</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded"
            >
              {isUpdateMode ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
