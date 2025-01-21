import React from "react";

const ProductRow = ({ product, handleDeleteProduct, handleEditProduct }) => {
  return (
    <tr>
      <td className="border px-4 py-2">{product.name}</td>
      <td className="border px-4 py-2">{product.price}</td>
      <td className="border px-4 py-2">{product.stock}</td>
      <td className="border px-4 py-2">
        <button
          onClick={() => handleEditProduct(product)}  // Pass the product data to edit
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteProduct(product._id)}  // Pass the product id to delete
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
