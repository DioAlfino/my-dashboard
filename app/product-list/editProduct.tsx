"use client";

import React, { useState, useEffect } from "react";

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

interface EditProductProps {
  product: Product;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onClose: () => void;
  onUpdate: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({
  product,
  setProducts,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [categoryId, setCategoryId] = useState<number | null>(
    product.categoryId
  );
  const [imageUrls, setImageUrls] = useState<string[]>(product.imageUrls || []);
  const [imageIds, setImageIds] = useState<number[]>(product.imageIds || []); // State untuk ID gambar
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]); // State untuk ID gambar yang akan dihapus
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
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("categoryId", categoryId?.toString() || "");

    if (imageFiles) {
      Array.from(imageFiles).forEach((file) => {
        formData.append("imageFiles", file);
      });
    }

    imagesToDelete.forEach((imageId) => {
      formData.append("imagesToDelete", imageId.toString());
    });

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/products/${product.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedProduct: Product = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === product.id ? updatedProduct : p))
      );

      setSuccessMessage("Product updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while trying to update the product.");
    }
  };

  const handleRemoveImage = (imageUrl: string, imageId: number) => {
    setImageUrls((prevImageUrls) =>
      prevImageUrls.filter((url) => url !== imageUrl)
    );
    setImageIds((prevImageIds) => prevImageIds.filter((id) => id !== imageId));
    setImagesToDelete((prevImagesToDelete) => [...prevImagesToDelete, imageId]);
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
              Select a category
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
            Current Images
          </label>
          {imageUrls.length > 0 ? (
            <div className="mt-2 space-y-2">
              {imageUrls.map((url, index) => {
                const imageId = imageIds[index]; // Ambil ID gambar sesuai dengan indeks
                return (
                  <div key={index} className="relative inline-block">
                    <img
                      src={url}
                      alt={`Product Image ${index + 1}`}
                      className="w-32 h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url, imageId)}
                      className="absolute top-0 right-0 bg-gray-700 text-white p-1 rounded-full"
                      aria-label="Remove Image"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No images uploaded</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Update Images
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
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
