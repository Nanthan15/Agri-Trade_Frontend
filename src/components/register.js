import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../ApiService";
import farmerimage from "../resource/farmer.png";
import { img10,img11 } from "../resource";

import { Form, Button, Alert, Card, Container, Row, Col, Nav } from "react-bootstrap";
import "../styles/logincss.css";

const Register = () => {
  const [role, setRole] = useState("FARMER");
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    role: "FARMER",
    farmLocation: "",
    contactInfo: "",
    farmType: "",
    certification: "",
    address: "",
    preferredPaymentMethod: "",
  });
  const [registerStatus, setRegisterStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Animation state for header text
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prevStep) => (prevStep < 2 ? prevStep + 1 : prevStep));
    }, 300); // Adjust the timing for animation steps
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData((prevData) => ({
      ...prevData,
      role: newRole,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setRegisterStatus("");
    setIsLoading(true);

    const payload =
      role === "FARMER"
        ? {
            username: formData.username,
            name: formData.name,
            password: formData.password,
            role: formData.role,
            farmLocation: formData.farmLocation,
            contactInfo: formData.contactInfo,
            farmType: formData.farmType,
            certification: formData.certification,
          }
        : {
            username: formData.username,
            password: formData.password,
            role: formData.role,
            address: formData.address,
            contactInfo: formData.contactInfo,
            preferredPaymentMethod: formData.preferredPaymentMethod,
          };

    try {
      const response = await ApiService.registerUser(payload);
      if (response && response.status === 200) {
        setRegisterStatus("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="register-page"
        style={{
          backgroundImage: `url(${img10})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.9,
        }}
      >
        <div className="form-container">
          <Container>
            <Row className="justify-content-center">
              <Col md={6} lg={5}>
                <Card className="shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
                  <Card.Header className="bg-success text-white text-center">
                    <img
                      src={img11}
                      alt="Farmer Logo"
                      className="mb-3"
                      style={{ width: "180px" }}
                    />
                    <h3
                      style={{
                        opacity: animationStep >= 1 ? 1 : 0,
                        transition: "opacity 1s ease-in-out",
                        transform: animationStep >= 1 ? "translateY(0)" : "translateY(-20px)",
                      }}
                    >
                      Join AgriTrading
                    </h3>
                    <p
                      style={{
                        opacity: animationStep >= 2 ? 1 : 0,
                        transition: "opacity 1s ease-in-out",
                        transform: animationStep >= 2 ? "translateY(0)" : "translateY(-20px)",
                      }}
                    >
                      Create your account to get started
                    </p>
                  </Card.Header>
                  <Card.Body>
                    <Nav
                      variant="tabs"
                      className="mb-4 justify-content-center"
                      style={{ borderBottom: "2px solid #198754" }}
                    >
                      <Nav.Item>
                        <Nav.Link
                          active={role === "FARMER"}
                          onClick={() => handleRoleChange("FARMER")}
                          className={role === "FARMER" ? "text-success" : ""}
                          style={{
                            borderColor: role === "FARMER" ? "#198754" : "",
                            borderBottom: "none",
                          }}
                        >
                          Farmer
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          active={role === "CUSTOMER"}
                          onClick={() => handleRoleChange("CUSTOMER")}
                          className={role === "CUSTOMER" ? "text-success" : ""}
                          style={{
                            borderColor: role === "CUSTOMER" ? "#198754" : "",
                            borderBottom: "none",
                          }}
                        >
                          Customer
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>

                    <Form onSubmit={handleRegister} noValidate>
                      <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          placeholder="Enter username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>

                      {role === "FARMER" && (
                        <>
                          <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              placeholder="Enter name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="formFarmLocation">
                            <Form.Label>Farm Location</Form.Label>
                            <Form.Control
                              type="text"
                              name="farmLocation"
                              placeholder="Enter farm location"
                              value={formData.farmLocation}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="formFarmType">
                            <Form.Label>Farm Type</Form.Label>
                            <Form.Control
                              type="text"
                              name="farmType"
                              placeholder="Enter farm type"
                              value={formData.farmType}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="formCertification">
                            <Form.Label>Certification</Form.Label>
                            <Form.Control
                              type="text"
                              name="certification"
                              placeholder="Enter certification"
                              value={formData.certification}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </>
                      )}

                      {role === "CUSTOMER" && (
                        <>
                          <Form.Group className="mb-3" controlId="formAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              type="text"
                              name="address"
                              placeholder="Enter address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="formPaymentMethod">
                            <Form.Label>Preferred Payment Method</Form.Label>
                            <Form.Control
                              type="text"
                              name="preferredPaymentMethod"
                              placeholder="Enter payment method"
                              value={formData.preferredPaymentMethod}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </>
                      )}

                      <Form.Group className="mb-3" controlId="formContactInfo">
                        <Form.Label>Contact Info</Form.Label>
                        <Form.Control
                          type="text"
                          name="contactInfo"
                          placeholder="Enter contact info"
                          value={formData.contactInfo}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100"
                        variant="success"
                        disabled={isLoading}
                      >
                        {isLoading ? "Registering..." : "Register"}
                      </Button>
                    </Form>

                    {registerStatus && (
                      <Alert variant="success" className="mt-3">
                        {registerStatus}
                      </Alert>
                    )}
                    {errorMessage && (
                      <Alert variant="danger" className="mt-3">
                        {errorMessage}
                      </Alert>
                    )}

                    <div className="text-center mt-3">
                      <p className="small">
                        Already have an account? <a href="/login">Login here</a>
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Register;
