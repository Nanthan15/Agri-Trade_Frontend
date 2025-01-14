import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuth = JSON.parse(localStorage.getItem('authData'));
    if (savedAuth && savedAuth.token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authData');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#59E659' }}>
      <a className="navbar-brand" href="#" style={{ marginLeft: '13px', color:'white', fontWeight: 'bold', textShadow: '1px 1px 2px black' }}> AGRI&TRADE </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav" style={{ marginLeft: '13px' }}>
        <ul className="navbar-nav me-auto">
          <li className="nav-item active">
            <a className="nav-link" href="/">
              Home <span className="sr-only">(current)</span>
            </a>
          </li>

          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Farmer
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown" style={{ backgroundColor: '#59E659' }}>
              <a className="dropdown-item" href="/products">Product</a>
              <a className="dropdown-item" href="/orders">Orders</a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#">Something else here</a>
            </div>
          </li>

          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Customer
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown" style={{ backgroundColor: '#59E659' }}>
              <a className="dropdown-item" href="/consumer/home">Product</a>
              <a className="dropdown-item" href="/consumer/order">Orders</a>
              <div className="dropdown-divider"></div>
              {/* <a className="dropdown-item" href="#">Something else here</a> */}
            </div>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto" style={{ marginRight: '13px' }}>
          <li className="nav-item">
            <a className="nav-link" href="/profile">Profile</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href={isLoggedIn ? "#" : "/login"} onClick={isLoggedIn ? handleLogout : null}>
              {isLoggedIn ? "Logout" : "Login"}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
