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

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
