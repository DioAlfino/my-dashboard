// deleteProduct.tsx

import { StoreProduct } from "./page"; // Impor tipe Product dari ProductList.tsx

export const deleteStoreProduct = async (
  id: number,
  setStoreProducts: React.Dispatch<React.SetStateAction<StoreProduct[]>>
) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );
  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/inventory/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete product with id ${id}.`);
    }

    setStoreProducts((prevStoreProducts) =>
      prevStoreProducts.filter((storeProduct) => storeProduct.id !== id)
    );
    console.log(`Product with id ${id} has been deleted.`);
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("An error occurred while trying to delete the product.");
  }
};
