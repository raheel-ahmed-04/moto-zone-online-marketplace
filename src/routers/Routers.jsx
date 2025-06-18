import { Routes, Route, Navigate } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import CarListing from "../pages/CarListing"
import BikeListing from "../pages/BikeListing"
import Blog from "../pages/Blog"
import BlogDetails from "../pages/BlogDetails"
import NotFound from "../pages/NotFound"
import Contact from "../pages/Contact"
import Login from "../pages/login"
import Register from "../pages/Register-page"
import BookingHistory from "../pages/BookingHistory"
import ChatPage from "../pages/ChatPage"
import AdminPage from "../pages/AdminPage"
import AdminListingsPage from "../pages/AdminListingsPage"
import BikeAccessories from "../pages/BikeAccessories"
import SellerDashboard from "../pages/SellerDashboard"
import Wishlist from "../pages/Wishlist"
import ProductDetails from "../pages/ProductDetails";
import SimpleProtectedRoute from "../components/SimpleProtectedRoute"
import CarAccessories from "../pages/CarAccessories"

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
      <Route path="/home"  element={<Home /> } />

      {/* Protected routes - require authentication and block check */}
      <Route
        path="/cars"
        element={
          <SimpleProtectedRoute>
            <CarListing />
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
        path="/bookings-history"
        element={
          <SimpleProtectedRoute>
            <BookingHistory />
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
        path="/admin-listings"
        element={
          <SimpleProtectedRoute>
            <AdminListingsPage />
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
        path="/car-accessories"
        element={
          <SimpleProtectedRoute>
            <CarAccessories />
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

      <Route path="/cars/:slug" element={
          <SimpleProtectedRoute>
            <ProductDetails type="car" />
          </SimpleProtectedRoute>
        } 
      />

      <Route path="/bikes/:slug" element={
          <SimpleProtectedRoute>
            <ProductDetails type="bike" />
          </SimpleProtectedRoute>
        } 
      />

      <Route path="/bike-accessories/:slug" element={
          <SimpleProtectedRoute>
            <ProductDetails type="bikeaccessory" />
          </SimpleProtectedRoute>
        } 
      />

      <Route path="/car-accessories/:slug" element={
          <SimpleProtectedRoute>
            <ProductDetails type="caraccessory" />
          </SimpleProtectedRoute>
        } 
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Routers
