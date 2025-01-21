import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaStar } from 'react-icons/fa';

const CustomerFeedbackForm = () => {
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuth = JSON.parse(localStorage.getItem('authData'));
    if (savedAuth && savedAuth.token) {
      setToken(savedAuth.token);
      fetchProfile(savedAuth.token);
      fetchProducts();
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
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5456/products', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products. Please try again.');
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await fetch('http://localhost:5456/feedback', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFeedbackList(data.feedback);
      } else {
        throw new Error(data.message || 'Failed to fetch feedback');
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      alert('Failed to fetch feedback. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5456/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: profileData.id,
          productId: selectedProduct,
          rating,
          feedback,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedbackList((prev) => [...prev, data.feedback]);
        setFeedback('');
        setRating(0);
        setSelectedProduct('');
        alert('Feedback submitted successfully!');
      } else {
        throw new Error(data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4>Submit Feedback</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="customerName" className="mb-3">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control type="text" value={profileData?.name || ''} readOnly />
                </Form.Group>
                <Form.Group controlId="phoneNumber" className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="text" value={profileData?.contactInfo || ''} readOnly />
                </Form.Group>
                <Form.Group controlId="product" className="mb-3">
                  <Form.Label>Product</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="rating" className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <div>
                    {[...Array(5)].map((star, index) => {
                      const ratingValue = index + 1;
                      return (
                        <label key={index}>
                          <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            style={{ display: 'none' }}
                          />
                          <FaStar
                            size={30}
                            color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </Form.Group>
                <Form.Group controlId="feedback" className="mb-3">
                  <Form.Label>Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <h4>Customer Feedback</h4>
          {feedbackList.length > 0 ? (
            feedbackList.map((fb, index) => (
              <Card key={index} className="mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title>{fb.customerName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {fb.rating} Stars
                  </Card.Subtitle>
                  <Card.Text>{fb.feedback}</Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Alert variant="info">No feedback available.</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerFeedbackForm;
