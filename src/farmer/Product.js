import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';
import ProductCard from './ProductCard';
import { Divider, Stack, Typography } from '@mui/material';
import ProductGrid from './ProductGrid';
import { red } from '@mui/material/colors';


const Product = () => {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuth = JSON.parse(localStorage.getItem('authData'));
    if (savedAuth && savedAuth.token) {
      setToken(savedAuth.token);
      fetchAllProducts(savedAuth.token);
    } else {
      alert('No token found. Please log in first.');
      navigate('/login');
    }
  }, [navigate]);

  const fetchProductById = async (id, token) => {
    try {
      const response = await fetch(`http://localhost:5456/farmers/product?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.status === 201) {
        setProduct(data.product);
      } else {
        throw new Error(data.message || 'Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      alert('Failed to fetch product. Please try again.');
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
        console.log(allProducts);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching all products:', error);
      alert('Only for farmer use.. !!');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (productId && token) {
      fetchProductById(productId, token);
    }
  };

  const getImageUrl = (imageName) => {
    // console.log(imageName);
    const image = `http://localhost:5456${imageName}`;
    // console.log(image);
    return image;
  };

  return (
    <>
  <NavBar />
  <Stack >
  
    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold',mt:'10px', textAlign: 'center'}}>
    Products ({allProducts.length})
        </Typography>
    <Divider sx={{
      height:'3px',
    }}></Divider>
    <ProductGrid allProducts={allProducts} />
  </Stack>
</>
  );
};

export default Product;
