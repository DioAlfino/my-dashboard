// deleteProduct.tsx

import { Category } from "./page"; // Impor tipe Product dari ProductList.tsx

export const deleteCategory = async (
  id: number,
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );
  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/category/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete product with id ${id}.`);
    }

    setCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== id)
    );
    console.log(`Product with id ${id} has been deleted.`);
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("An error occurred while trying to delete the product.");
  }
};
