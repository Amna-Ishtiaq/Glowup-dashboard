import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

export const AddProduct = () => {
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null); 
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('brand', brand);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('image', image); 

        try {
            const result = await axios.post("https://salon-backend-api-production.up.railway.app/upload1", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(result);
            alert("Product added successfully!");
            
            // Clear form
            setName("");
            setBrand("");
            setPrice("");
            setCategory("");
            setImage(null);
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <h1>Add Product</h1>
            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="form-group">
                    <label>Product Name</label>
                    <input 
                        type='text' 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder='e.g., Styling Gel' 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Brand</label>
                    <input 
                        type='text' 
                        value={brand} 
                        onChange={(e) => setBrand(e.target.value)}  
                        placeholder='e.g., L’Oréal' 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Price ($)</label>
                    <input 
                        type='number' 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)}  
                        placeholder='e.g., 29.99' 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <input 
                        type='text' 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}  
                        placeholder='e.g., Hair Care' 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Product Image</label>
                    <div className="file-upload-wrapper">
                        <span className="file-upload-icon">📁</span>
                        <span className="file-upload-text">
                            {image ? "Click to change image" : "Choose image file"}
                        </span>
                        {image && <span className="file-name-preview">{image.name}</span>}
                        <input 
                            type='file' 
                            onChange={(e) => setImage(e.target.files[0])} 
                            required={!image}
                        />
                    </div>
                </div>
                <button type="submit" className="add-product-btn" disabled={loading}>
                    {loading ? "Adding Product..." : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
