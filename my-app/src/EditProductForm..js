import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import  './EditProductForm.css'
const EditProduct = () => {
  const { id } = useParams(); // To get the product ID from the URL
  const navigate = useNavigate(); // Replaces useHistory
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
    
    if (productData.image) {
      formData.append('image', productData.image);
    }

    try {
      const response = await axios.put(
        `https://salon-backend-api-production.up.railway.app/product/${id}`, // Correct URL format
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Product updated successfully!');
      navigate('/products'); // Replaces history.push('/products')
    } catch (err) {
      setError('Failed to update product');
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Edit Product</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Brand:</label>
          <input
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
