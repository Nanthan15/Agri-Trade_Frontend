import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';
import '../styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Spinner, Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap'; // Import Bootstrap components

const ConsumerHome = () => {
    const [token, setToken] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
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
            setLoading(false);
        }
    };

    const handleBuyClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleOrderSubmit = async () => {
        if (!selectedProduct) return;
        try {
            const response = await fetch('http://localhost:5456/customers/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: selectedProduct.prod_id,
                    quantity,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Order placed successfully');
                setShowModal(false);
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Unable to place order at the moment. Please try again later.');
        }
    };

    return (
        <div>
            <NavBar />
            <Container className="mt-4">
                <h2 className='text-center'>Hey {userName}! Welcome</h2>
                <h5 className='text-center mb-4'>Please make yourself comfortable in finding our esteemed products</h5>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <Row>
                        {allProducts.length > 0 ? (
                            allProducts.map((product, index) => (
                                <Col key={product.prod_id || index} md={4} className="mb-4">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{product.prod_Name}</Card.Title>
                                            <Card.Text>{product.prod_Description}</Card.Text>
                                            <Card.Text>Price: ₹{product.prod_Price}</Card.Text>
                                            <Card.Text>Stock: {product.prod_Stock}</Card.Text>
                                            <Button variant="primary" onClick={() => handleBuyClick(product)}>Buy</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p className="text-center">No products available at the moment.</p>
                        )}
                    </Row>
                )}
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Place Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="productId">
                            <Form.Label>Product ID</Form.Label>
                            <Form.Control type="text" value={selectedProduct?.prod_id || ''} readOnly />
                        </Form.Group>
                        <Form.Group controlId="quantity" className="mt-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleOrderSubmit}>Place Order</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ConsumerHome;
