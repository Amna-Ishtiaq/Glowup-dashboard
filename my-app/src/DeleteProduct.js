import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageProduct.css";

const DeleteProduct = () => {
  const [products, setProducts] = useState([]);

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4500/product1");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Delete product by ID
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`https://salon-backend-api-production.up.railway.app/product1/${id}`);
        // Remove the deleted product from the state
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="manage-products-container">
      <h2>Delete Products</h2>
      <div className="table-responsive-wrapper">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td data-label="ID">{product._id}</td>
                <td data-label="Product Name">{product.name}</td>
                <td data-label="Actions">
                  <button
                    className="delete-btn"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeleteProduct;
