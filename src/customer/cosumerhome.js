import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';
import '../styles/global.css';

const ConsumerHome = () => {
    const [token, setToken] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const savedAuth = JSON.parse(localStorage.getItem('authData'));
        if (savedAuth && savedAuth.token) {
            setToken(savedAuth.token);
            setUserName(savedAuth.username);
            fetchUserProfile(savedAuth.token);
            fetchAllProducts(savedAuth.token);
        } else {
            alert('Hey consumer, please log in first.');
            navigate('/login');
        }
    }, [navigate]);

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch('http://localhost:5456/profile/customer', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setUserName(data.name || 'User');
            } else {
                throw new Error(data.message || 'Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            alert('Only for Consumers...!!');
            navigate('/');
        }
    };

    const fetchAllProducts = async (token) => {
        try {
            const response = await fetch('http://localhost:5456/farmers/product/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok && data.status === 201) {
                setAllProducts(data.productList || []);
            } else {
                throw new Error(data.message || 'Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching all products:', error);
            alert('Only for Consumers...!!');
        }
    };

    return (
        <div>
            <NavBar />
            <br></br>
            <h2 className='heading11'>Hey {userName}! Welcome</h2>
            <h5 className='headingh5'>Please make yourself comfortable in finding our esteemed products</h5>
            <div className='product-list'>
                {allProducts.map((product, index) => (
                    <div key={index} className='product-item'>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ConsumerHome;