"use client";

import React, { useEffect, useState } from "react";
import AddProduct from "./addCategory";
import { deleteCategory } from "./deleteCategory";
import EditCategory from "./editCategory";

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/category");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategoryClick = () => {
    setIsAddCategoryOpen(true);
  };

  const handleCloseAddCategory = () => {
    setIsAddCategoryOpen(false);
  };

  const handleEditCategoryClick = (product: Category) => {
    setEditCategory(product);
  };

  const handleCloseEditProduct = () => {
    setEditCategory(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Category List</h2>
          <button
            onClick={handleAddCategoryClick}
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
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="flex px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2 pr-2">
                      <button
                        onClick={() => handleEditCategoryClick(category)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          deleteCategory(category.id, setCategories)
                        }
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

        {isAddCategoryOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <button
                onClick={handleCloseAddCategory}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
              <AddProduct
                onClose={handleCloseAddCategory}
                fetchCategories={fetchCategories}
              />
            </div>
          </div>
        )}
        {editCategory && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <button
                onClick={handleCloseEditProduct}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
              <EditCategory
                category={editCategory}
                setCategories={setCategories}
                onClose={handleCloseEditProduct}
                onUpdate={fetchCategories}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryList;
