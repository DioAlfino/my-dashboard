"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
}
const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition duration-200 ease-in-out transform hover:scale-105">
              <div className="relative h-48">
                <Image
                  src={product.imageUrls[0]}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 m-2 rounded">
                  15% OFF
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 truncate">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-bold">
                    Rp {product.price.toLocaleString()}
                  </span>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 ease-in-out">
                    Beli
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
