import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';
import '../styles/global.css';

const ConsumerHome = () => {
    const [token, setToken] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true); // New loading state
    const navigate = useNavigate();

    useEffect(() => {
        const savedAuth = JSON.parse(localStorage.getItem('authData'));
        const savedToken = localStorage.getItem('authToken');
        if (savedAuth && savedAuth.token) {
            setToken(savedToken);
            setUserName(savedAuth.username);
            fetchAllProducts(savedAuth.token);
        } else {
            alert('Hey consumer, please log in first.');
            navigate('/login');
        }
    }, [navigate]);



    const fetchAllProducts = async (token) => {
        try {
            const response = await fetch('http://localhost:5456/customer/products', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setAllProducts(data.productList || []);
            } else {
                throw new Error(data.message || 'Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching all products:', error);
            alert('Unable to fetch products at the moment. Please try again later.');
        } finally {
            setLoading(false); // Ensure loading is set to false after fetching
        }
    };

    return (
        <div>
            <NavBar />
            <br />
            <h2 className='heading11'>Hey {userName}! Welcome</h2>
            <h5 className='headingh5'>Please make yourself comfortable in finding our esteemed products</h5>
            {loading ? (
                <p>Loading products...</p>
            ) : (
                <div className='product-list'>
                    {allProducts.length > 0 ? (
                        allProducts.map((product, index) => (
                            <div key={product.prod_id || index} className='product-item'>
                                <h3>{product.prod_Name}</h3>
                                <p>{product.prod_Description}</p>
                                <p>Price: ₹{product.prod_Price}</p>
                                <p>Stock: {product.prod_Stock}</p>
                            </div>
                        ))
                    ) : (
                        <p>No products available at the moment.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ConsumerHome;
