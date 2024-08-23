"use client";

import React, { useEffect, useState } from "react";

interface AddStoreProductProps {
  onClose: () => void;
  fetchStoreProducts: () => void;
}

const AddStoreProduct: React.FC<AddStoreProductProps> = ({
  onClose,
  fetchStoreProducts,
}) => {
  const [store, setStore] = useState<{ id: number; name: string }[]>([]);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [product, setProduct] = useState<{ id: number; name: string }[]>([]);
  const [productId, setProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPRoductsAndStores = async () => {
      try {
        const productResponse = await fetch(
          "http://localhost:8080/api/v1/products"
        );
        const productData = await productResponse.json();
        setProduct(productData);

        const storeResponse = await fetch(
          "http://localhost:8080/api/v1/stores"
        );
        const storeData = await storeResponse.json();
        setStore(storeData);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchPRoductsAndStores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newStoreProduct = {
      productId: productId ?? 0,
      storeId: storeId ?? 0,
      quantity,
    };

    try {
      // Kirim request ke backend dengan JSON string
      const response = await fetch(
        "http://localhost:8080/api/v1/inventory/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStoreProduct),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchStoreProducts();

      setProductId(null);
      setStoreId(null);
      setQuantity(0);
      setSuccessMessage("Product added successfully!");

      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while trying to add the product.");
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
            Product Name
          </label>
          <select
            value={productId ?? ""}
            onChange={(e) => setProductId(parseInt(e.target.value, 10))}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="" disabled>
              Select a Product
            </option>
            {product.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Store Name
          </label>
          <select
            value={storeId ?? ""}
            onChange={(e) => setStoreId(parseInt(e.target.value, 10))}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="" disabled>
              Select a Store
            </option>
            {store.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
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
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStoreProduct;
