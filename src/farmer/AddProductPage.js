import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';

const AddProductPage = () => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [category, setCategory] = useState('');
    const [productImg, setProductImg] = useState(null);
    const [productStock, setProductStock] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [listingDate, setListingDate] = useState('');
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
            setToken(savedToken);
        } else {
            alert('No token found. Please log in first.');
            navigate('/login');
        }
    }, [navigate]);

    const handleImageUpload = (e) => {
        setProductImg(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert('No token found. Please log in first.');
            return;
        }

        if (!productImg) {
            alert('Please upload an image.');
            return;
        }

        const formData = new FormData();
        const productData = {
            prod_Name: productName,
            prod_Description: productDescription,
            category,
            prod_Stock: productStock,
            prod_Quantity: productQuantity,
            prod_Price: productPrice,
            listing_Date: listingDate,
        };

        formData.append('products', JSON.stringify(productData));
        formData.append('prodImage', productImg);

        try {
            const response = await fetch('http://localhost:5456/farmers/product', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to add product');
            }

            alert('Product added successfully!');
            navigate('/home');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    };

    return (
        <>
            <NavBar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <h2>Add Product</h2>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label>Product Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Product Description:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={productDescription}
                                            onChange={(e) => setProductDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Category:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Product Image:</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={handleImageUpload}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Product Stock:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={productStock}
                                            onChange={(e) => setProductStock(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Product Quantity:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={productQuantity}
                                            onChange={(e) => setProductQuantity(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Product Price:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={productPrice}
                                            onChange={(e) => setProductPrice(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Listing Date:</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={listingDate}
                                            onChange={(e) => setListingDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary w-100">Add Product</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddProductPage;
