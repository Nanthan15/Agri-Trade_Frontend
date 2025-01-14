import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../ApiService';
import NavBar from './compo/nav';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoginStatus('');

    try {
      const authData = await ApiService.loginUser(username, password);
      if (authData && authData.token) {
        setLoginStatus("Login successful!");
        localStorage.setItem('authData', JSON.stringify(authData));
        console.log("Auth data saved:", authData);
        navigate('/');
      }
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h2>Login</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleLogin}>
                  <div className="form-group mb-3">
                    <label>Username:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                  </div>
                </form>
                {loginStatus && <div className="alert alert-success mt-3">{loginStatus}</div>}
                {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
