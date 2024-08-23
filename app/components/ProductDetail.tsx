import React from "react";

interface Product {
  name: string;
  categoryName: string;
  quantity: number;
}

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">{product.name}</h2>
      <p className="text-lg">Category: {product.categoryName}</p>
      <p className="text-lg">Quantity: {product.quantity}</p>
    </div>
  );
};

export default ProductDetail;
