import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManageProduct.css';

export const ManageProduct = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // Fetching the product list from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://salon-backend-api-production.up.railway.app/product');
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    // Handling product deletion
    const deleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`https://salon-backend-api-production.up.railway.app/product1/${id}`);
                setProducts(products.filter(product => product._id !== id));
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    // Navigate to Edit Product page
    const handleEdit = (id) => {
        navigate(`/edit-product/${id}`);
    };

    return (
        <div className="manage-products-container">
            <h1>Manage Products</h1>
            <div className="table-responsive-wrapper">
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td data-label="Name">{product.name}</td>
                                <td data-label="Brand">{product.brand}</td>
                                <td data-label="Price">${product.price}</td>
                                <td data-label="Category">{product.category}</td>
                                <td data-label="Image">
                                    <div className="table-img-wrapper">
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                </td>
                                <td data-label="Actions">
                                    <div className="action-buttons-group">
                                        <button className="edit-btn" onClick={() => handleEdit(product._id)}>Edit</button>
                                        <button className="delete-btn" onClick={() => deleteProduct(product._id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProduct;
