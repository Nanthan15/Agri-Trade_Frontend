import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';

const Payment = () => {
    const [token, setToken] = useState(null);
    const [order, setOrder] = useState(null);
    const [paymentType, setPaymentType] = useState('Credit Card');
    const [paymentStatus, setPaymentStatus] = useState('Completed');
    const navigate = useNavigate();

    useEffect(() => {
        const savedAuth = JSON.parse(localStorage.getItem('authData'));
        const orderToPay = JSON.parse(localStorage.getItem('orderToPay'));
        if (savedAuth && savedAuth.token && orderToPay) {
            setToken(savedAuth.token);
            setOrder(orderToPay);
        } else {
            alert('Please log in first.');
            navigate('/login');
        }
    }, [navigate]);

    const handlePayment = async () => {
        try {
            const response = await fetch('http://localhost:5456/customers/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: order.totalPrice,
                    paymentType,
                    paymentStatus,
                    orderId: order.orderId
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Payment successful!');
                navigate('/consumer/order');
            } else {
                throw new Error(data.message || 'Payment failed');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment failed. Please try again.');
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container mt-4">
                <h2 className="text-center mb-4">Payment Page</h2>
                {order && (
                    <div className="card mx-auto" style={{ maxWidth: '600px' }}>
                        <div className="card-header text-center bg-primary text-white">
                            <h4>Order Payment</h4>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Order ID: {order.orderId}</h5>
                            <p className="card-text"><strong>Product:</strong> {order.productName}</p>
                            <p className="card-text"><strong>Quantity:</strong> {order.quantity}</p>
                            <p className="card-text"><strong>Total Price:</strong> ${order.totalPrice}</p>
                            <div className="form-group">
                                <label htmlFor="paymentType">Payment Type</label>
                                <select
                                    id="paymentType"
                                    className="form-control"
                                    value={paymentType}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                >
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Debit Card">Debit Card</option>
                                    <option value="PayPal">PayPal</option>
                                </select>
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="paymentStatus">Payment Status</label>
                                <select
                                    id="paymentStatus"
                                    className="form-control"
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                >
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Failed">Failed</option>
                                </select>
                            </div>
                            <button className="btn btn-success btn-block mt-4" onClick={handlePayment}>Pay Now</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Payment;
