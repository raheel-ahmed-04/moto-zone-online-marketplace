"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  InputGroup,
  Toast,
  ToastBody,
  ToastHeader,
} from "reactstrap"
import { Link, useNavigate } from "react-router-dom"
import "../styles/login.css"
import { supabase } from "../../lib/supabase"
import bcrypt from "bcryptjs"

const Login = () => {
  const [activeTab, setActiveTab] = useState("user")
  const [userFormData, setUserFormData] = useState({
    email: "",
    password: "",
    role: "buyer",
  })
  const [adminFormData, setAdminFormData] = useState({
    username: "",
    password: "",
  })
  const [showUserPassword, setShowUserPassword] = useState(false)
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("Checking connection...")

  // Test database connection on component mount
  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase.from("users").select("id").limit(1)
        if (error) {
          console.error("Connection test error:", error)
          setConnectionStatus(`Connection error: ${error.message}`)
          return
        }
        setConnectionStatus("Connected to Database successfully, Please Enter your Credentials!")
      } catch (err) {
        console.error("Unexpected error:", err)
        setConnectionStatus(`Connection error: ${err.message}`)
      }
    }
    testConnection()
  }, [])

  const handleUserChange = (e) => {
    const { id, value } = e.target
    let fieldName = id

    // Map the field names correctly
    if (id === "userPassword") {
      fieldName = "password"
    }

    setUserFormData({ ...userFormData, [fieldName]: value })
    setErrorMessage("")
  }

  const handleAdminChange = (e) => {
    const { id, value } = e.target
    let fieldName = id

    // Map the field names correctly
    if (id === "adminPassword") {
      fieldName = "password"
    }

    setAdminFormData({ ...adminFormData, [fieldName]: value })
    setErrorMessage("")
  }

  const handleRoleChange = (role) => {
    setUserFormData({ ...userFormData, role })
  }

  const toggleUserPassword = () => setShowUserPassword(!showUserPassword)
  const toggleAdminPassword = () => setShowAdminPassword(!showAdminPassword)

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setLoading(true)

    try {
      const { data: users, error } = await supabase
        .from("users")
        .select("id, name, email, role, password, status, block_reason")
        .eq("email", userFormData.email)
        .eq("role", userFormData.role)
        .limit(1)

      if (error) {
        console.error("Query error:", error)
        throw new Error(`Query error: ${error.message}`)
      }

      if (!users || users.length === 0) {
        setErrorMessage("Invalid email, password, or role")
        setLoading(false)
        return
      }

      const user = users[0]
      const passwordMatch = await bcrypt.compare(userFormData.password, user.password)

      if (!passwordMatch) {
        setErrorMessage("Incorrect password")
        setLoading(false)
        return
      }

      // After password verification, add this block check
      if (user.status === "blocked") {
        setErrorMessage(
          `You cannot login as you were blocked by admin due to some reasons. Contact Support for more details and how to recover.${
            user.block_reason ? ` Reason: ${user.block_reason}` : ""
          }`,
        )
        setLoading(false)
        return
      }

      // Check other statuses
      if (user.status === "inactive") {
        setErrorMessage("Your account is inactive. Please contact support to activate your account.")
        setLoading(false)
        return
      }

      if (user.status === "pending") {
        setErrorMessage("Your account is pending approval. Please wait for admin approval.")
        setLoading(false)
        return
      }

      // Only proceed if user is active
      if (user.status !== "active") {
        setErrorMessage("Your account status does not allow login. Please contact support.")
        setLoading(false)
        return
      }

      sessionStorage.setItem("userName", user.name)
      sessionStorage.setItem("userEmail", user.email)
      sessionStorage.setItem("role", user.role)
      sessionStorage.setItem("isAdmin", "false")
      sessionStorage.setItem("userId", user.id)
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        navigate("/home")
      }, 3000)
    } catch (err) {
      console.error("Login error:", err.message || err)
      setErrorMessage(`Login failed: ${err.message || "Please check your Supabase configuration"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setLoading(true)

    try {
      const adminUsername = import.meta.env.VITE_ADMIN_USERNAME
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

      if (adminFormData.username !== adminUsername || adminFormData.password !== adminPassword) {
        setErrorMessage("Invalid admin credentials")
        setLoading(false)
        return
      }

      // For admin login - set all required session data
      sessionStorage.setItem("userName", adminFormData.username)
      sessionStorage.setItem("userEmail", "admin@system.local") // Dummy email for admin
      sessionStorage.setItem("role", "admin") // Set admin role
      sessionStorage.setItem("isAdmin", "true")
      sessionStorage.setItem("userId", "admin-" + Date.now()) // Generate admin ID
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        navigate("/admin-page")
      }, 3000)
    } catch (err) {
      console.error("Admin login error:", err.message || err)
      setErrorMessage("Admin login failed: Invalid credentials")
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

            <Nav tabs>
              <NavItem>
                <NavLink className={activeTab === "user" ? "active" : ""} onClick={() => setActiveTab("user")}>
                  User Login
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={activeTab === "admin" ? "active" : ""} onClick={() => setActiveTab("admin")}>
                  Admin Login
                </NavLink>
              </NavItem>
            </Nav>

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

            <Toast
              isOpen={showToast}
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 1000,
              }}
            >
              <ToastHeader>Success</ToastHeader>
              <ToastBody>Login successful! Redirecting...</ToastBody>
            </Toast>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="user" className="cursor-pointer">
                <Form onSubmit={handleUserSubmit}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" id="email" required value={userFormData.email} onChange={handleUserChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="userPassword">Password</Label>
                    <InputGroup>
                      <Input
                        type={showUserPassword ? "text" : "password"}
                        id="userPassword"
                        required
                        value={userFormData.password}
                        onChange={handleUserChange}
                      />
                      <Button color="secondary" onClick={toggleUserPassword} style={{ width: "40px", padding: "0" }}>
                        <i className={showUserPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                      </Button>
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label>Role</Label>
                    <div>
                      <Button
                        color={userFormData.role === "buyer" ? "primary" : "secondary"}
                        onClick={() => handleRoleChange("buyer")}
                        className="me-2"
                      >
                        Buyer
                      </Button>
                      <Button
                        color={userFormData.role === "seller" ? "primary" : "secondary"}
                        onClick={() => handleRoleChange("seller")}
                      >
                        Seller
                      </Button>
                    </div>
                  </FormGroup>
                  <Button type="submit" disabled={loading || connectionStatus.includes("error")}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Form>
                <div className="register-link mt-2">
                  <span>Don't have an account? </span>
                  <Link to="/register">Register here</Link>
                </div>
              </TabPane>
              <TabPane tabId="admin">
                <Form onSubmit={handleAdminSubmit}>
                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input
                      type="text"
                      id="username"
                      required
                      value={adminFormData.username}
                      onChange={handleAdminChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="adminPassword">Password</Label>
                    <InputGroup>
                      <Input
                        type={showAdminPassword ? "text" : "password"}
                        id="adminPassword"
                        required
                        value={adminFormData.password}
                        onChange={handleAdminChange}
                      />
                      <Button color="secondary" onClick={toggleAdminPassword} style={{ width: "40px", padding: "0" }}>
                        <i className={showAdminPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                      </Button>
                    </InputGroup>
                  </FormGroup>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Form>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
