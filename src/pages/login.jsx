import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css"; // Make sure to create this CSS file for styling

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isAdmin: false, // NEW admin field
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === "checkbox") {
      // If it's a checkbox, handle boolean
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include isAdmin in the request body
      const response = await axios.post(
        "http://localhost:2000/login",
        formData
      );

      // Example: { message: "User login successful", userName: "John Doe", isAdmin: true/false }
      console.log("Login Response:", response.data);

      // Store the name in localStorage
      if (response.data?.userName) {
        localStorage.setItem("userName", response.data.userName);
      }

      // If the backend returns isAdmin = true, store that too (optional)
      if (response.data?.isAdmin) {
        localStorage.setItem("isAdmin", "true");
      } else {
        localStorage.removeItem("isAdmin"); // or set to "false"
      }

      // Redirect to homepage or admin dashboard
      if (response.data?.isAdmin) {
        // If user is an admin, maybe navigate them to an admin panel
        navigate("/home");
      } else {
        // Otherwise, regular user goes to /home
        navigate("/home");
      }
    } catch (error) {
      // If there's a server response with status 400, display the message
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        // Otherwise show a generic error
        setErrorMessage("Something went wrong. Please try again.");
      }
      console.error("There was an error!!", error);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg="6" md="8" sm="12">
            <h2>Login</h2>

            {/* Conditionally render the error message */}
            {errorMessage && (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  padding: "10px",
                  marginBottom: "10px",
                  color: "#721c24",
                }}
              >
                {errorMessage}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormGroup>

              {/* NEW Admin Checkbox */}
              <FormGroup check className="mb-3">
                <Input
                  type="checkbox"
                  id="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleChange}
                />
                <Label check htmlFor="isAdmin">
                  Are you an admin?
                </Label>
              </FormGroup>

              <Button type="submit">Login</Button>
            </Form>
            <div className="register-link mt-2">
              <span>Don't have an account? </span>
              <Link to="/register">Register here</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
