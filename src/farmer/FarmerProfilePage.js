import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';
import FarmerProfile from './FarmerProfile';
import CustomerProfile from '../customer/CustomerProfile';
import { Box } from '@mui/material';

const FarmerProfilePage = () => {
  const [token, setToken] = useState(null);
  const [role , setRole] =  useState("FARMER");
  const [farmerData, setFarmerData] = useState(null);
  const [customerData , setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuth = JSON.parse(localStorage.getItem('authData'));
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      setRole(savedAuth.role);
    } else {
      alert('No token found. Please log in first.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      if(role==='FARMER'){
        fetchFarmerProfile(token);
      }
      else{
        fetchCustomerProfile(token);
      }
      
    }
  }, [token , role]);

  const fetchFarmerProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:5456/profile/farmer', {
        method: 'GET', // Fixed method declaration
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok ) {
        setFarmerData(data.farmer || {});
        console.log(farmerData);
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to fetch profile. Please try again.');
    } finally {
      setLoading(false); // Ensure loading is false after fetching
    }
  };

  const fetchCustomerProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:5456/profile/customer', {
        method: 'GET', // Fixed method declaration
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok ) {
        setCustomerData(data.customer || {});
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to fetch profile. Please try again.');
    } finally {
      setLoading(false); // Ensure loading is false after fetching
    }
  };

  return (
    <>
    <NavBar />
    {loading ? (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>
    ) : role === "FARMER" ? (
      <Box paddingTop={'20px'}>
        <FarmerProfile farmerData={farmerData} token={token} />
      </Box>
    ) : role === "CUSTOMER" ? (
      <Box paddingTop={'20px'}>
        <CustomerProfile customerData={customerData} token={token} />
      </Box>
    ) : (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>No profile data available.</div>
    )}
  </>
  
  );
};

export default FarmerProfilePage;
