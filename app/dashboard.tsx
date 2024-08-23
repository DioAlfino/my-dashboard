import React from "react";
import ProductList from "./product-list/page";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ProductList />
    </div>
  );
};

export default Dashboard;
