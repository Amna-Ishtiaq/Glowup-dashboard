import React, { useState } from 'react';
import axios from 'axios';

export const AddProduct = () => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const collectData = async () => {
    // reset messages
    setSuccessMessage("");
    setErrorMessage("");

    // basic validation
    if (!name || !brand || !price || !category || !image) {
      setErrorMessage("Please fill all fields and select an image.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('image', image);

      const result = await axios.post("https://salon-backend-api-production.up.railway.app/upload1", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log(result);
      // show success message
      setSuccessMessage("Product added successfully!");
      // clear form fields
      setName("");
      setBrand("");
      setPrice("");
      setCategory("");
      setImage(null);

      // If backend returns a message, you can use it instead:
      // setSuccessMessage(result.data?.message || "Product added successfully!");
    } catch (err) {
      console.error(err);
      // friendly error message
      const serverMsg = err.response?.data?.message || err.message || "Something went wrong.";
      setErrorMessage("Failed to add product: " + serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='add-product'></div>
      <h1>Add Product</h1>

      {successMessage && (
        <div style={{ background: "#d4edda", color: "#155724", padding: "10px", marginBottom: "10px", borderRadius: 4 }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ background: "#f8d7da", color: "#721c24", padding: "10px", marginBottom: "10px", borderRadius: 4 }}>
          {errorMessage}
        </div>
      )}

      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Enter Name'
        className='inputBox'
      />
      <input
        type='text'
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        placeholder='Enter Brand'
        className='inputBox'
      />
      <input
        type='number'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder='Enter Price'
        className='inputBox'
      />
      <input
        type='text'
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder='Enter Category'
        className='inputBox'
      />
      <input
        type='file'
        onChange={(e) => setImage(e.target.files[0])}
        className='inputBox'
      />

      <button onClick={collectData} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
        {loading ? "Adding..." : "Add Product"}
      </button>
    </>
  );
};

export default AddProduct;
