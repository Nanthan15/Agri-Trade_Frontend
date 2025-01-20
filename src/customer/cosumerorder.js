import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';
import { Modal, Button } from 'react-bootstrap';

const ConsumerOrder = () => {
    const [token, setToken] = useState(null);
    const [allOrders, setAllOrders] = useState([]);
    const [userName, setUserName] = useState('');
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [deliveryDetails, setDeliveryDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedAuth = JSON.parse(localStorage.getItem('authData'));
        const savedToken = localStorage.getItem('authToken');
        if (savedAuth && savedAuth.token) {
            setToken(savedToken);
            setUserName(savedAuth.username);
            fetchAllOrders(savedToken);
        } else {
            alert('Hey consumer, please log in first.');
            navigate('/login');
        }
    }, [navigate]);

    const fetchAllOrders = async (token) => {
        try {
            const response = await fetch('http://localhost:5456/customers/orders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setAllOrders(Array.isArray(data.addOrderResposeList) ? data.addOrderResposeList : []); // Ensure data is an array
            } else {
                throw new Error(data.message || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching all orders:', error);
            alert('Failed to fetch orders. Please try again.');
        }
    };

    const handleProceedToPayment = (order) => {
        localStorage.setItem('orderToPay', JSON.stringify(order));
        navigate('/consumer/payment');
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5456/orders?id=${orderId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                alert('Order deleted successfully');
                fetchAllOrders(token); // Refresh the orders list
            } else {
                throw new Error('Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order. Please try again.');
        }
    };

    const handleCheckDeliveryStatus = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5456/delivery?id=${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setDeliveryDetails(data);
                setShowDeliveryModal(true);
            } else {
                throw new Error(data.message || 'Failed to fetch delivery status');
            }
        } catch (error) {
            console.error('Error fetching delivery status:', error);
            alert('Failed to fetch delivery status. Please try again.');
        }
    };

    return (
        <div>
            <NavBar />
            <section className="h-100 h-custom" style={{ backgroundColor: '#eee' }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-8 col-xl-6">
                            <div className="card border-top border-bottom border-3" style={{ borderColor: '#f37a27 !important' }}>
                                <div className="card-body p-5">
                                    <p className="lead fw-bold mb-5" style={{ color: 'green' }}>Purchase Details</p>
                                    {allOrders.map((order, index) => (
                                        <div key={index}>
                                            <div className="row">
                                                <div className="col mb-3">
                                                    <p className="small text-muted mb-1">Order ID</p>
                                                    <p>{order.orderId}</p>
                                                </div>
                                                <div className="col mb-3">
                                                    <p className="small text-muted mb-1">Product</p>
                                                    <p>{order.productName}</p>
                                                </div>
                                            </div>
                                            <div className="mx-n5 px-5 py-4" style={{ backgroundColor: '#f2f2f2' }}>
                                                <div className="row">
                                                    <div className="col-md-8 col-lg-9">
                                                        <p>Quantity: {order.quantity}</p>
                                                    </div>
                                                    <div className="col-md-4 col-lg-3">
                                                        <p>Total Price: ${order.totalPrice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row my-4">
                                                <div className="col-md-12">
                                                    <p className="lead fw-bold mb-0" style={{ color: 'green' }}>Order Status: {order.orderStatus === 'Completed' ? 'Completed' : order.orderStatus}</p>
                                                </div>
                                            </div>
                                            <div className="row my-4">
                                                <div className="col-md-6 text-center">
                                                    <button className="btn btn-primary" onClick={() => handleProceedToPayment(order)}>Proceed to Payment</button>
                                                </div>
                                                <div className="col-md-6 text-center">
                                                    <button className="btn btn-danger" onClick={() => handleDeleteOrder(order.orderId)} disabled={order.orderStatus === 'COMPLETED'}>Delete Order</button>
                                                </div>
                                            </div>
                                            <div className="row my-4">
                                                <div className="col-md-12 text-right">
                                                    <button className="btn btn-info" onClick={() => handleCheckDeliveryStatus(order.orderId)}>Delivery Status</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <p className="mt-4 pt-2 mb-0">Want any help? <a href="#!" style={{ color: '#f37a27' }}>Please contact us</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Modal show={showDeliveryModal} onHide={() => setShowDeliveryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delivery Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deliveryDetails ? (
                        <div>
                            <p><strong>Tracking Number:</strong> {deliveryDetails.trackingNumber}</p>
                            <p><strong>Estimated Arrival Time:</strong> {deliveryDetails.estimatedArrivalTime}</p>
                            <p><strong>Delivery Address:</strong> {deliveryDetails.deliveryAddress}</p>
                        </div>
                    ) : (
                        <p>No delivery details available.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeliveryModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ConsumerOrder;