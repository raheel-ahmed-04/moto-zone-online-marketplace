"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap"
import { Link, useNavigate } from "react-router-dom"
import "../styles/login.css"
import { supabase } from "../../lib/supabase"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isAdmin: false,
  })
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("Checking connection...")

  // Test connection on component mount
  useEffect(() => {
    async function testConnection() {
      try {
        // Use a simple query instead of count() to test connection
        // Just fetch a single row with limit 1 instead of using count()
        const { error } = await supabase.from("login").select("id").limit(1)

        if (error) {
          console.error("Connection test error:", error)
          setConnectionStatus(`Connection error: ${error.message}`)
          return
        }

        setConnectionStatus("Connected to Supabase successfully")
      } catch (err) {
        console.error("Unexpected error:", err)
        setConnectionStatus(`Connection error: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target
    if (type === "checkbox") {
      setFormData({ ...formData, [id]: checked })
    } else {
      setFormData({ ...formData, [id]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setLoading(true)

    try {
      // Now try the actual login
      const { data: users, error } = await supabase
        .from("login")
        .select("*")
        .eq("email", formData.email)
        .eq("password", formData.password)

      if (error) {
        console.error("Query error:", error)
        throw new Error(`Query error: ${error.message}`)
      }

      if (!users || users.length === 0) {
        setErrorMessage("Invalid email or password")
        setLoading(false)
        return
      }

      const user = users[0]
      localStorage.setItem("userName", user.email)

      if (user.is_admin) {
        localStorage.setItem("isAdmin", "true")
      } else {
        localStorage.removeItem("isAdmin")
      }

      navigate("/home")
    } catch (err) {
      console.error("Login error:", err.message || err)
      setErrorMessage(`Login failed: ${err.message || "Please check your Supabase configuration"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg="6" md="8" sm="12">
            <h2>Login</h2>

            {/* Connection status indicator */}
            <div
              style={{
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "4px",
                backgroundColor: connectionStatus.includes("error") ? "#f8d7da" : "#d4edda",
                color: connectionStatus.includes("error") ? "#721c24" : "#155724",
              }}
            >
              {connectionStatus}
            </div>

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

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input type="email" id="email" required value={formData.email} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input type="password" id="password" required value={formData.password} onChange={handleChange} />
              </FormGroup>

              <FormGroup check className="mb-3">
                <Input type="checkbox" id="isAdmin" checked={formData.isAdmin} onChange={handleChange} />
                <Label check htmlFor="isAdmin">
                  Are you an admin?
                </Label>
              </FormGroup>

              <Button type="submit" disabled={loading || connectionStatus.includes("error")}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form>
            <div className="register-link mt-2">
              <span>Don't have an account? </span>
              <Link to="/register">Register here</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
