"use client";

import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number | null;
  categoryName: string;
  imageUrls: string[] | null;
  imageIds: number[] | null;
  createdAt: string;
  updatedAt: string;
}

interface AddProductProps {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onClose: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ setProducts, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: String }[]>(
    []
  );
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const respone = await fetch("http://localhost:8080/api/v1/category");
        const data = await respone.json();
        setCategories(data);
      } catch (error) {
        console.log("error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("categoryId", categoryId?.toString() || "");

    // Append each image file to the form data
    if (imageFiles) {
      Array.from(imageFiles).forEach((file) => {
        formData.append("imageFiles", file);
      });
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/products/create",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newProduct: Product = await response.json();
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      console.log("Product added successfully:", newProduct);

      // Clear form fields after successful submission
      // setName("");
      // setDescription("");
      // setPrice(0);
      // setCategoryId(null);
      // setImageFiles(null);

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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={categoryId || ""}
            onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="" disabled>
              Select a Category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => setImageFiles(e.target.files)}
            className="mt-1 block w-full"
          />
        </div>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
