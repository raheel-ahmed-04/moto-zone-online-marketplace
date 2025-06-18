<<<<<<< HEAD
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
=======
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import CarListing from "../pages/CarListing";
import BikeListing from "../pages/BikeListing";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import NotFound from "../pages/NotFound";
import Contact from "../pages/Contact";
import Login from "../pages/login";
import Register from "../pages/Register-page";
import ManageCars from "../pages/ManageCars";
import ManageBikes from "../pages/ManageBikes";
import BookingHistory from "../pages/BookingHistory";
import ChatPage from "../pages/ChatPage";
import AdminPage from "../pages/AdminPage";
import BikeAccessories from "../pages/BikeAccessories";
import SellerDashboard from "../pages/SellerDashboard";
import Wishlist from "../pages/Wishlist";
import CarAccessories from "../pages/CarAccessories";
import ProductDetails from "../pages/ProductDetails";
>>>>>>> e72981c0cb714afb49c246704935fd21b0c3e7bf

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
<<<<<<< HEAD

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

=======
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/cars" element={<CarListing />} />
      {/* Use ProductDetails for car details */}
      <Route path="/cars/:slug" element={<ProductDetails type="car" />} />
      <Route path="/bikes" element={<BikeListing />} />
      {/* Use ProductDetails for bike details */}
      <Route path="/bikes/:slug" element={<ProductDetails type="bike" />} />
      <Route path="/blogs" element={<Blog />} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/manage-cars" element={<ManageCars />} />
      <Route path="/manage-bikes" element={<ManageBikes />} />
      <Route path="/bookings-history" element={<BookingHistory />} />
      <Route path="/admin" element={<ManageCars />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/admin-page" element={<AdminPage />} />
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/bike-accessories" element={<BikeAccessories />} />
      {/* Use ProductDetails for bike accessory details */}
      <Route
        path="/bike-accessories/:slug"
        element={<ProductDetails type="bikeaccessory" />}
      />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/car-accessories" element={<CarAccessories />} />
      {/* Use ProductDetails for car accessory details */}
      <Route
        path="/car-accessories/:slug"
        element={<ProductDetails type="caraccessory" />}
      />
      {/* Optionally, a single catch-all details route: */}
      {/* <Route path="/details/:type/:slug" element={<ProductDetails />} /> */}
>>>>>>> e72981c0cb714afb49c246704935fd21b0c3e7bf
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Routers
