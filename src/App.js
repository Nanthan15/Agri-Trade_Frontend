import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import AddProductPage from './farmer/AddProductPage';
import Home from './components/Home';
import Product from './farmer/Product';
import OrdersPage from './farmer/OrdersPage';
import FarmerProfilePage from './farmer/FarmerProfilePage';
import ConsumerHome from './customer/cosumerhome';
import ConsumerOrder from './customer/cosumerorder';
import Payment from './customer/payment';
import Predict from './AI/predict';
import Insight from './farmer/InsightPage';
import InsightPage from './farmer/InsightProductPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/products" element={<Product />} />
        <Route path="/orders" element={<OrdersPage/>}/>
        <Route path="/profile" element={<FarmerProfilePage/>}/>
        <Route path="/consumer/home" element={<ConsumerHome/>} />
        <Route path="/consumer/order" element={<ConsumerOrder/>} />
        <Route path="/consumer/payment" element={<Payment/>} />
        <Route path="/predict" element={<Predict/>} />
        <Route path="/insight" element={<Insight/>}/>
        <Route path="/insightproduct" element={<InsightPage/>}/>
      </Routes>
    </Router>
  );
};

export default App;
