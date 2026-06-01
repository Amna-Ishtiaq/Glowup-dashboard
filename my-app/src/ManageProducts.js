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
            const response = await axios.get('https://salon-backend-api-production.up.railway.app/product');
            setProducts(response.data);
        };
        fetchProducts();
    }, []);

    // Handling product deletion
    const deleteProduct = async (id) => {
        await axios.delete(`https://salon-backend-api-production.up.railway.app/product1/${id}`);
        setProducts(products.filter(product => product._id !== id)); // Updating UI after deletion
    };

    // Navigate to Edit Product page
    const handleEdit = (id) => {
        navigate(`/edit-product/${id}`);
    };

    return (
        <div>
            <h1>Manage Products</h1>
            <table>
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
                            <td>{product.name}</td>
                            <td>{product.brand}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td><img src={product.image} alt={product.name} width="50" /></td>
                            <td>
                                <button onClick={() => handleEdit(product._id)}>Edit</button>
                                <button onClick={() => deleteProduct(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default ManageProduct;
