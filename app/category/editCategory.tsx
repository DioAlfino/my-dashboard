"use client";

import React, { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface EditCategoryProps {
  category: Category;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  onClose: () => void;
  onUpdate: () => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({
  category,
  setCategories,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState(category.name);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/category");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/category/${category.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedCategory: Category = await response.json();
      setCategories((prevCategories) =>
        prevCategories.map((p) => (p.id === category.id ? updatedCategory : p))
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
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

export default EditCategory;
