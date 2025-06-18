"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useNavigate } from "react-router-dom"
import { Alert, Container, Spinner } from "reactstrap"

const AuthGuard = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockReason, setBlockReason] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          navigate("/login")
          return
        }

        if (!session) {
          navigate("/login")
          return
        }

        // Check user status in database
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, name, email, role, status, block_reason")
          .eq("email", session.user.email)
          .single()

        if (userError) {
          console.error("User data error:", userError)
          await supabase.auth.signOut()
          navigate("/login")
          return
        }

        // If user is blocked, sign them out and show blocked message
        if (userData.status === "blocked") {
          await supabase.auth.signOut()
          sessionStorage.clear()
          setIsBlocked(true)
          setBlockReason(userData.block_reason || "")
          setLoading(false)
          return
        }

        // If user is not active, sign them out
        if (userData.status !== "active") {
          await supabase.auth.signOut()
          sessionStorage.clear()
          navigate("/login")
          return
        }

        // User is active, update session storage
        sessionStorage.setItem("userId", userData.id)
        sessionStorage.setItem("userEmail", userData.email)
        sessionStorage.setItem("userName", userData.name)
        sessionStorage.setItem("userRole", userData.role)
        sessionStorage.setItem("isAdmin", userData.role === "admin" ? "true" : "false")

        setLoading(false)
      } catch (error) {
        console.error("Auth guard error:", error)
        await supabase.auth.signOut()
        navigate("/login")
      }
    }

    checkUserStatus()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        sessionStorage.clear()
        navigate("/login")
      } else if (event === "SIGNED_IN") {
        // Re-check user status when signed in
        checkUserStatus()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
          <div className="mt-3">Loading...</div>
        </div>
      </Container>
    )
  }

  if (isBlocked) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="col-md-6">
          <Alert color="danger">
            <h4 className="alert-heading">Account Blocked</h4>
            <p className="mb-2">
              <strong>
                You cannot login as you were blocked by admin due to some reasons. Contact Support for more details and
                how to recover.
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
            <div className="mb-0">
              <small>
                Please contact our support team at{" "}
                <a href="mailto:support@yourcompany.com" className="alert-link">
                  support@yourcompany.com
                </a>{" "}
                for assistance.
              </small>
            </div>
            <div className="mt-3">
              <button className="btn btn-outline-danger btn-sm" onClick={() => navigate("/login")}>
                Back to Login
              </button>
            </div>
          </Alert>
        </div>
      </Container>
    )
  }

  return children
}

export default AuthGuard
