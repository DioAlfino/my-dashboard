"use client";

import React, { useState } from "react";

interface AddCategoryProps {
  onClose: () => void;
  fetchCategories: () => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({
  onClose,
  fetchCategories,
}) => {
  const [name, setName] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCategory = { name };

    try {
      // Kirim request ke backend dengan JSON string
      const response = await fetch("http://localhost:8080/api/v1/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchCategories();

      // Clear form fields after successful submission
      setName("");
      // Show success message
      setSuccessMessage("Product added successfully!");

      // Close form
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
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
