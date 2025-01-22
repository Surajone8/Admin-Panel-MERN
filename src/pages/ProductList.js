import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import ProductRow from "../components/ProductRow";
import ProductFormModal from "./ProductFormModal";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [stockRange, setStockRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showFilterOverlay, setShowFilterOverlay] = useState(false); // State to control overlay visibility
//   const [users, setUsers] = useState([]);
//   const [userID, setUserID] = useState([]);

//   const navigate = useNavigate();

  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/products/pagination?page=${page}&limit=${itemsPerPage}`
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const result = await response.json();
      setProducts(result.data || []);
      setTotalProducts(result.total || 0);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };




  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    fetchProducts(currentPage);
    setShowModal(false);
    setCurrentProduct(null);
  };

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setShowModal(true);
  };

  const applyFilters = (product) => {
    const priceValid =
      (!priceRange.min || product.price >= Number(priceRange.min)) &&
      (!priceRange.max || product.price <= Number(priceRange.max));
    const stockValid =
      (!stockRange.min || product.stock >= Number(stockRange.min)) &&
      (!stockRange.max || product.stock <= Number(stockRange.max));
    return priceValid && stockValid;
  };

  const filteredProducts = Array.isArray(products)
    ? products
        .filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(applyFilters)
    : [];

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Close modal function
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
  };

  console.log(currentProduct)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      {/* Search and Filters Button */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={() => setShowFilterOverlay(true)} // Show the filter overlay
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Filters
        </button>
      </div>

      {/* Product Table */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {filteredProducts.length > 0 ? (
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
            {filteredProducts.map((product) => (
              <ProductRow
                key={product._id}
                product={product}
                handleDeleteProduct={handleDeleteProduct}
                handleEditProduct={handleEditProduct}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products found.</p>
      )}

      <button
        onClick={handleAddProduct}
        className="mt-6 bg-green-500 text-white px-6 py-2 rounded"
      >
        Add New Product
      </button>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
          className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } rounded`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Filter Overlay */}
      {showFilterOverlay && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">Filters</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600">Price Range</label>
              <div className="flex gap-3 mt-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600">Stock Range</label>
              <div className="flex gap-3 mt-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={stockRange.min}
                  onChange={(e) =>
                    setStockRange({ ...stockRange, min: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={stockRange.max}
                  onChange={(e) =>
                    setStockRange({ ...stockRange, max: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowFilterOverlay(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded"
              >
                Close
              </button>
              <button
                onClick={() => setShowFilterOverlay(false)}
                className="bg-blue-500 text-white px-6 py-2 rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ProductFormModal */}
      {showModal && (
        <ProductFormModal
          showModal={showModal}
          onClose={handleCloseModal}
          setShowModal={handleCloseModal}
          currentProduct={currentProduct}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default ProductList;
