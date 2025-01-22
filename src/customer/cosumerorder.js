import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';
import { Modal, Button, Accordion, Card } from 'react-bootstrap';

const fetchPaymentStatus = async (orderId, token) => {
    try {
        const response = await fetch(`http://localhost:5456/customers/payments/get-byOrderId?orderId=${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            return 'Completed';
        } else {
            throw new Error('Payment pending');
        }
    } catch (error) {
        return 'Pending';
    }
};

const ConsumerOrder = () => {
    const [token, setToken] = useState(null);
    const [allOrders, setAllOrders] = useState([]);
    const [userName, setUserName] = useState('');
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [deliveryDetails, setDeliveryDetails] = useState(null);
    const [paymentStatuses, setPaymentStatuses] = useState({});
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
                setAllOrders(Array.isArray(data.addOrderResposeList) ? data.addOrderResposeList : []);
            } else {
                throw new Error(data.message || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching all orders:', error);
            alert('Failed to fetch orders. Please try again.');
        }
    };

    useEffect(() => {
        const fetchAllPaymentStatuses = async () => {
            const statuses = {};
            for (const order of allOrders) {
                const status = await fetchPaymentStatus(order.orderId, token);
                statuses[order.orderId] = status;
            }
            setPaymentStatuses(statuses);
        };

        if (allOrders.length > 0) {
            fetchAllPaymentStatuses();
        }
    }, [allOrders, token]);

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
                fetchAllOrders(token);
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
            const response = await fetch(`http://localhost:5456/delivery-byorderid?id=${orderId}`, {
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
            <section className="h-100 h-custom" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container py-5 h-100">
                    <h3 className="text-center mb-4" style={{ color: '#f37a27' }}>Your Orders({allOrders.length})</h3>
                    <Accordion defaultActiveKey="0" style={{gap: '10px'}}>
                        {allOrders.map((order, index) => (
                            <Accordion.Item eventKey={index.toString()} key={index}>
                                <Accordion.Header>
                                    <strong>Order ID:</strong> {order.orderId} &nbsp; | &nbsp; <strong>Product:</strong> {order.productName}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <p><strong>Quantity:</strong> {order.quantity}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                                        </div>
                                    </div>
                                    <p className="lead fw-bold mb-1" style={{ color: 'blue', fontSize: '0.9rem' }}>
                                        Payment Status: {paymentStatuses[order.orderId] || 'Loading...'}
                                    </p>
                                    <p className="lead fw-bold mb-3" style={{ color: 'green' }}>
                                        Order Status: {order.orderStatus === 'Completed' ? 'Completed' : order.orderStatus}
                                    </p>
                                    <div className="row">
                                        <div className="col-md-4 text-center mb-2">
                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() => handleProceedToPayment(order)}
                                                disabled={paymentStatuses[order.orderId] === 'Completed'}
                                            >
                                                Proceed to Payment
                                            </button>
                                        </div>
                                        <div className="col-md-4 text-center mb-2">
                                            <button
                                                className="btn btn-danger w-100"
                                                onClick={() => handleDeleteOrder(order.orderId)}
                                                disabled={order.orderStatus === 'COMPLETED'}
                                            >
                                                Delete Order
                                            </button>
                                        </div>
                                        <div className="col-md-4 text-center">
                                            <button
                                                className="btn btn-info w-100"
                                                onClick={() => handleCheckDeliveryStatus(order.orderId)}
                                            >
                                                Delivery Status
                                            </button>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
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
};

export default ConsumerOrder;
