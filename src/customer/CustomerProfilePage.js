import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';
import CustomerFeedbackForm from './CustomerFeedbackForm';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomerProfilePage = () => {
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuth = JSON.parse(localStorage.getItem('authData'));
    if (savedAuth && savedAuth.token) {
      setToken(savedAuth.token);
      fetchProfile(savedAuth.token);
    } else {
      alert('No token found. Please log in first.');
      navigate('/login');
    }
  }, [navigate]);

  const fetchProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:5456/profile/customer', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProfileData(data.customer);
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
      <Container className="mt-5">
        {loading ? (
          <Row className="justify-content-center">
            <Spinner animation="border" />
          </Row>
        ) : profileData ? (
          <Row className="justify-content-center">
            <Col md={8}>
              <CustomerFeedbackForm profileData={profileData} />
            </Col>
          </Row>
        ) : (
          <Row className="justify-content-center">
            <Alert variant="danger">No profile data available.</Alert>
          </Row>
        )}
      </Container>
    </>
  );
};

export default CustomerProfilePage;
