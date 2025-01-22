import React from "react";

const ProductRow = ({ product, handleDeleteProduct, handleEditProduct }) => {
  return (
    <tr
  key={product._id}
  className="transition-all transform hover:bg-gray-50 hover:shadow-lg"
>
  <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">{product.name}</td>
  <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">${product.price.toFixed(2)}</td>
  <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">{product.stock}</td>
  <td className="border-b px-6 py-4 text-sm font-medium">
    <div className="flex align-middle gap-10">
      <button
        onClick={() => handleEditProduct(product)} // Pass the product data to edit
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        Edit
      </button>
      <button
        onClick={() => handleDeleteProduct(product._id)} // Pass the product id to delete
        className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
      >
        Delete
      </button>
    </div>
  </td>
</tr>

  );
};

export default ProductRow;
