import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProductForm.css';

const EditProduct = () => {
  const { id } = useParams(); // To get the product ID from the URL
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    price: '',
    category: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the product details to prefill the form
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://salon-backend-api-production.up.railway.app/thing/${id}`);
        setProductData(response.data);
      } catch (err) {
        setError('Failed to load product details');
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('brand', productData.brand);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    
    if (productData.image && typeof productData.image !== 'string') {
      formData.append('image', productData.image);
    }

    try {
      await axios.put(
        `https://salon-backend-api-production.up.railway.app/product/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Product updated successfully!');
      navigate('/dashboard'); // Change /products to /dashboard as that is the route that displays Dashboard.js
    } catch (err) {
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-product-container">
      <h3>Edit Product</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Product Image</label>
          <div className="file-upload-wrapper">
            <span className="file-upload-icon">📁</span>
            <span className="file-upload-text">
              {productData.image ? "Click to change image" : "Choose image file"}
            </span>
            {productData.image && (
              <span className="file-name-preview">
                {typeof productData.image === 'string' ? 'Current Image' : productData.image.name}
              </span>
            )}
            <input type="file" onChange={handleImageChange} />
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
