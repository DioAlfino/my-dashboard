"use client";

import React, { useEffect, useState } from "react";
import AddProduct from "./addProduct";
import { deleteProduct } from "./deleteProduct";
import EditProduct from "./editProduct";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number | null;
  categoryName: string;
  imageUrls: string[] | null;
  imageIds: number[] | null; // Tambahkan imageIds di sini
  createdAt: string;
  updatedAt: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/products");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProductClick = () => {
    setIsAddProductOpen(true);
  };

  const handleCloseAddProduct = () => {
    setIsAddProductOpen(false);
  };

  const handleEditProductClick = (product: Product) => {
    setEditProduct(product);
  };

  const handleCloseEditProduct = () => {
    setEditProduct(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Product List</h2>
          <button
            onClick={handleAddProductClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.description}
                  </td>
                  <td className="flex px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2 pr-2">
                      <button
                        onClick={() => handleEditProductClick(product)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => deleteProduct(product.id, setProducts)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isAddProductOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <button
                onClick={handleCloseAddProduct}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
              <AddProduct
                setProducts={setProducts}
                onClose={handleCloseAddProduct}
              />
            </div>
          </div>
        )}
        {editProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <button
                onClick={handleCloseEditProduct}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
              <EditProduct
                product={editProduct}
                setProducts={setProducts}
                onClose={handleCloseEditProduct}
                onUpdate={fetchProducts}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
