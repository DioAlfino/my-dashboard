// deleteProduct.tsx

import { Product } from "./page"; // Impor tipe Product dari ProductList.tsx

export const deleteProduct = async (
  id: number,
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );
  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/products/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete product with id ${id}.`);
    }

    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
    console.log(`Product with id ${id} has been deleted.`);
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("An error occurred while trying to delete the product.");
  }
};
