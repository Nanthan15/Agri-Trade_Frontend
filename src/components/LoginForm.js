import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../ApiService";
import { Form, Button, Alert, Card, Container, Row, Col } from "react-bootstrap";
import farmerimage from "../resource/farmer.png";
import costsimage from "../resource/costs.png";
import "../styles/logincss.css"; // CSS for animations
import NavBar from "./compo/nav";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoginStatus("");
    setIsLoading(true);

    try {
      const authData = await ApiService.loginUser(username, password);
      if (authData && authData.token) {
        setLoginStatus("Welcome back! Redirecting...");
        localStorage.setItem("authData", JSON.stringify(authData));
        localStorage.setItem("authToken", authData.token);
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <> 
    {/* <NavBar></NavBar> */}
    
    
    <div className="login-page">
    
    <div className="form-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg">
              <Card.Header className="bg-success text-white text-center">
                <img
                  src={farmerimage}
                  alt="Farmer Logo"
                  className="mb-3"
                  style={{ width: "80px" }}
                />
                <h3>Welcome to AgriTrading</h3>
                <p>Your gateway to smarter farming solutions</p>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleLogin} noValidate>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    className="w-100"
                    variant="success"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </Form>
                {loginStatus && (
                  <Alert variant="success" className="mt-3">
                    {loginStatus}
                  </Alert>
                )}
                {errorMessage && (
                  <Alert variant="danger" className="mt-3">
                    {errorMessage}
                  </Alert>
                )}
                <div className="text-center mt-3">
                  <p className="small">
                    Don't have an account? <a href="/register">Sign up here</a>
                  </p>
                  <a href="/forgot-password" className="small text-muted">
                    Forgot password?
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  </div></>
    
  );
};

export default LoginForm;
