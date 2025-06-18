import { Routes, Route, Navigate } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import CarListing from "../pages/CarListing"
import CarDetails from "../pages/CarDetails"
import ManageCars from "../pages/ManageCars"
import BikeListing from "../pages/BikeListing"
import BikeDetails from "../pages/BikeDetails"
import Blog from "../pages/Blog"
import BlogDetails from "../pages/BlogDetails"
import NotFound from "../pages/NotFound"
import Contact from "../pages/Contact"
import Login from "../pages/login"
import Register from "../pages/Register-page"
import ManageBikes from "../pages/ManageBikes"
import BookingHistory from "../pages/BookingHistory"
import ChatPage from "../pages/ChatPage"
import AdminPage from "../pages/AdminPage"
import BikeAccessories from "../pages/BikeAccessories"
import SellerDashboard from "../pages/SellerDashboard"
import Wishlist from "../pages/Wishlist"
import SimpleProtectedRoute from "../components/SimpleProtectedRoute"

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Public routes - no authentication required */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blogs" element={<Blog />} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />

      {/* Protected routes - require authentication and block check */}
      <Route
        path="/home"
        element={
          <SimpleProtectedRoute>
            <Home />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/cars"
        element={
          <SimpleProtectedRoute>
            <CarListing />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/cars/:slug"
        element={
          <SimpleProtectedRoute>
            <CarDetails />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/bikes"
        element={
          <SimpleProtectedRoute>
            <BikeListing />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/bikes/:slug"
        element={
          <SimpleProtectedRoute>
            <BikeDetails />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/manage-cars"
        element={
          <SimpleProtectedRoute>
            <ManageCars />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/manage-bikes"
        element={
          <SimpleProtectedRoute>
            <ManageBikes />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/bookings-history"
        element={
          <SimpleProtectedRoute>
            <BookingHistory />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <SimpleProtectedRoute>
            <ManageCars />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <SimpleProtectedRoute>
            <ChatPage />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/admin-page"
        element={
          <SimpleProtectedRoute>
            <AdminPage />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/seller-dashboard"
        element={
          <SimpleProtectedRoute>
            <SellerDashboard />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/bike-accessories"
        element={
          <SimpleProtectedRoute>
            <BikeAccessories />
          </SimpleProtectedRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <SimpleProtectedRoute>
            <Wishlist />
          </SimpleProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Routers
