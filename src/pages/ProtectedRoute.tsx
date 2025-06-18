"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import { Container, Row, Col, Spinner, Alert } from "reactstrap"

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockReason, setBlockReason] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Check if user is logged in via sessionStorage
        const userId = sessionStorage.getItem("userId")
        const userEmail = sessionStorage.getItem("userEmail")
        const userName = sessionStorage.getItem("userName")
        const userRole = sessionStorage.getItem("role")
        const isAdmin = sessionStorage.getItem("isAdmin")

        if (!userId || !userName || !userRole) {
          // User not logged in, redirect to login
          navigate("/login")
          return
        }

        // For admin users, don't check database status
        if (isAdmin === "true") {
          setIsAuthenticated(true)
          setLoading(false)
          return
        }

        // For regular users, check database status
        if (!userEmail) {
          navigate("/login")
          return
        }

        // Check user status in database
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, name, email, role, status, block_reason")
          .eq("id", userId)
          .single()

        if (userError) {
          console.error("User data error:", userError)
          // Clear session and redirect to login
          sessionStorage.clear()
          navigate("/login")
          return
        }

        // If user is blocked, show blocked message
        if (userData.status === "blocked") {
          setIsBlocked(true)
          setBlockReason(userData.block_reason || "")
          setLoading(false)
          return
        }

        // If user is not active, redirect to login
        if (userData.status !== "active") {
          sessionStorage.clear()
          navigate("/login")
          return
        }

        // User is active and authenticated
        setIsAuthenticated(true)
        setLoading(false)
      } catch (error) {
        console.error("Auth check error:", error)
        sessionStorage.clear()
        navigate("/login")
      }
    }

    checkUserStatus()
  }, [navigate])

  const handleBackToLogin = () => {
    sessionStorage.clear()
    navigate("/login")
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
          <div className="mt-3">Loading...</div>
        </div>
      </Container>
    )
  }

  if (isBlocked) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Row className="justify-content-center">
          <Col md="8" lg="6">
            <Alert color="danger">
              <h4 className="alert-heading">Account Blocked</h4>
              <p className="mb-2">
                <strong>
                  You cannot login as you were blocked by admin due to some reasons. Contact Support for more details
                  and how to recover.
                </strong>
              </p>
              {blockReason && (
                <div className="mt-3">
                  <small className="text-muted">
                    <strong>Reason:</strong> {blockReason}
                  </small>
                </div>
              )}
              <hr />
              <div className="mb-3">
                <small>
                  Please contact our support team at{" "}
                  <a href="mailto:support@yourcompany.com" className="alert-link">
                    support@yourcompany.com
                  </a>{" "}
                  for assistance.
                </small>
              </div>
              <button className="btn btn-outline-danger btn-sm" onClick={handleBackToLogin}>
                Back to Login
              </button>
            </Alert>
          </Col>
        </Row>
      </Container>
    )
  }

  if (!isAuthenticated) {
    return null // This shouldn't happen as we redirect, but just in case
  }

  return children
}

export default ProtectedRoute
