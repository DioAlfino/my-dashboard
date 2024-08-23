"use client";

import React, { useState, useEffect } from "react";

interface StoreProduct {
  id: number;
  product: { id: number; name: string } | null;
  store: { id: number; name: string } | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
interface EditStoreProductProps {
  storeProduct: StoreProduct;
  setStoreProducts: React.Dispatch<React.SetStateAction<StoreProduct[]>>;
  onClose: () => void;
  onUpdate: () => void;
}

const EditStoreProduct: React.FC<EditStoreProductProps> = ({
  storeProduct,
  setStoreProducts,
  onClose,
  onUpdate,
}) => {
  const [quantity, setQuantity] = useState(storeProduct.quantity);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/inventory/${storeProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: storeProduct.product?.id,
            storeId: storeProduct.store?.id,
            quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedStoreProduct: StoreProduct = await response.json();
      setStoreProducts((prevStoreProduct) =>
        prevStoreProduct.map((p) =>
          p.id === storeProduct.id ? updatedStoreProduct : p
        )
      );

      setSuccessMessage("Product updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while trying to update the product.");
    }
  };

  return (
    <div className="relative p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        &times;
      </button>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Update Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStoreProduct;
