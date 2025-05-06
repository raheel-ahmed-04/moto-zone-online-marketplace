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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    cnic: "",
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    fatherName: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:2000/register", formData);
      navigate("/login"); // Redirect to the login page after successful registration
    } catch (error) {
      console.error("There was an error !!!!", error);
    }
  };

  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg="6" md="8" sm="12">
            <h2>Register</h2>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="cnic">CNIC</Label>
                <Input
                  type="text"
                  id="cnic"
                  required
                  value={formData.cnic}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormGroup>
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
                <Label for="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="phoneNumber">Phone Number</Label>
                <Input
                  type="tel"
                  id="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="fatherName">Father's Name</Label>
                <Input
                  type="text"
                  id="fatherName"
                  value={formData.fatherName}
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
              <Button type="submit">Submit</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
