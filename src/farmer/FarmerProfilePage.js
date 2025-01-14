import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';
import FarmerProfile from './FarmerProfile';
import { Box } from '@mui/material';

const FarmerProfilePage = () => {
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuth = JSON.parse(localStorage.getItem('authData'));
    if (savedAuth && savedAuth.token) {
      setToken(savedAuth.token);
      setRole(savedAuth.role);
    } else {
      alert('No token found. Please log in first.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (token && role) {
      fetchProfile(token, role);
    }
  }, [token, role]);

  const fetchProfile = async (token, role) => {
    try {
      const apiUrl = role === 'FARMER'
        ? 'http://localhost:5456/profile/farmer'
        : 'http://localhost:5456/profile/customer';

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProfileData(role === 'FARMER' ? data.farmer : data.customer);
        console.log('Profile data:', data);
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to fetch profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>
      ) : profileData ? (
        <Box paddingTop={'20px'}>
          <FarmerProfile farmerData={profileData} role={role} />
        </Box>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>No profile data available.</div>
      )}
    </>
  );
};

export default FarmerProfilePage;