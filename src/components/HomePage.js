import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const goToAddProductPage = () => {
    navigate('/add-product');
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {/* Add other content here */}
      <p>token is {}</p>
      <button onClick={goToAddProductPage} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Add Product
      </button>

    </div>
  );
};

export default HomePage;
