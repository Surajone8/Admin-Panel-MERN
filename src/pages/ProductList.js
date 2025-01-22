import React, { useEffect, useState, useMemo } from "react";
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
  const [showFilterOverlay, setShowFilterOverlay] = useState(false);

  // Fetch Products from API
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Delete Product
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

  // Edit Product
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  // Add Product
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setShowModal(true);
  };

  // Apply Filters
  const applyFilters = (product) => {
    const priceValid =
      (!priceRange.min || product.price >= Number(priceRange.min)) &&
      (!priceRange.max || product.price <= Number(priceRange.max));
    const stockValid =
      (!stockRange.min || product.stock >= Number(stockRange.min)) &&
      (!stockRange.max || product.stock <= Number(stockRange.max));
    return priceValid && stockValid;
  };

  // Filtered Products with memoization
  const filteredProducts = useMemo(
    () =>
      products
        .filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(applyFilters),
    [products, searchQuery, priceRange, stockRange]
  );

  // Total Pages for Pagination
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Pagination Function
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="flex w-full md:w-3/4 gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 text-lg font-medium bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
          <button
            onClick={() => setShowFilterOverlay(true)}
            className="w-32 px-5 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
          >
            Filters
          </button>
        </div>
      </div>

      {/* Loading and Error Handling */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Product Table */}
      {filteredProducts.length > 0 ? (
  <table className="min-w-full table-auto mb-6 shadow-lg rounded-lg overflow-hidden bg-white opacity-0 animate-fade-in">
    <thead className="bg-teal-600 text-white">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">Name</th>
        <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">Price</th>
        <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">Stock</th>
        <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider uppercase">Actions</th>
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


      {/* Add New Product Button */}
      <button
        onClick={handleAddProduct}
        className="mt-6 bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition duration-300"
      >
        Add New Product
      </button>

      {/* Pagination Controls */}
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
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
              <button
                onClick={() => setShowFilterOverlay(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showModal && (
        <ProductFormModal
          currentProduct={currentProduct}
          onClose={handleCloseModal}
          onSave={() => fetchProducts(currentPage)}
        />
      )}
    </div>
  );
};

export default ProductList;
