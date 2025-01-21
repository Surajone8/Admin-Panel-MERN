// components/FilterModal.js
import React, { useState, useEffect } from 'react';

const FilterModal = ({ showModal, setShowModal, filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setFilters(localFilters);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 transition-all ${
        showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Filters</h2>

        <input
          type="text"
          name="searchQuery"
          placeholder="Search by Order ID"
          value={localFilters.searchQuery}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
        />
        <input
          type="number"
          name="minAmount"
          placeholder="Min Amount"
          value={localFilters.minAmount}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
        />
        <input
          type="number"
          name="maxAmount"
          placeholder="Max Amount"
          value={localFilters.maxAmount}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
        />
        <input
          type="date"
          name="startDate"
          value={localFilters.startDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
        />
        <input
          type="date"
          name="endDate"
          value={localFilters.endDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
        />

        <div className="flex justify-between">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-black rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
