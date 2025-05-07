import { useState } from "react"
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, InputGroup, Toast, ToastBody, ToastHeader } from "reactstrap"
import { Link, useNavigate } from "react-router-dom"
import "../styles/register.css"
import { supabase } from "../../lib/supabase"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
    setErrorMessage("")
  }

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role })
  }

  const togglePassword = () => setShowPassword(!showPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setLoading(true)

    try {
      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from("users")
        .select("email")
        .eq("email", formData.email)

      if (checkError) {
        console.error("Check error:", checkError)
        throw new Error(`Check error: ${checkError.message}`)
      }

      if (existingUsers && existingUsers.length > 0) {
        setErrorMessage("Email already registered")
        setLoading(false)
        return
      }

      // Insert new user into Supabase
      const { error } = await supabase.from("users").insert([
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
      ])

      if (error) {
        console.error("Insert error:", error)
        throw new Error(`Registration error: ${error.message}`)
      }

      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        navigate("/login")
      }, 3000)
    } catch (err) {
      console.error("Registration error:", err.message || err)
      setErrorMessage(`Registration failed: ${err.message || "Please check your Supabase configuration"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg="6" md="8" sm="12">
            <h2>Register</h2>

            {errorMessage && (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  padding: "10px",
                  marginBottom: "10px",
                  color: "#721c24",
                  borderRadius: "4px",
                }}
              >
                {errorMessage}
              </div>
            )}

            <Toast isOpen={showToast} style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}>
              <ToastHeader>Success</ToastHeader>
              <ToastBody>Registration successful! Redirecting to login...</ToastBody>
            </Toast>

            <Form onSubmit={handleSubmit}>
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
 USING THIS CODE IN THE FUTURE
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Button
                    color="secondary"
                    onClick={togglePassword}
                    style={{ width: "40px", padding: "0" }}
                  >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </Button>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Role</Label>
                <div className="d-flex justify-content-between">
                  <Button
                    color={formData.role === "buyer" ? "primary" : "secondary"}
                    onClick={() => handleRoleChange("buyer")}
                    className="me-2"
                  >
                    Buyer
                  </Button>
                  <Button
                    color={formData.role === "seller" ? "primary" : "secondary"}
                    onClick={() => handleRoleChange("seller")}
                  >
                    Seller
                  </Button>
                </div>
              </FormGroup>
              <Button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </Form>
            <div className="login-link mt-2">
              <span>Already have an account? </span>
              <Link to="/login">Login here</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Register