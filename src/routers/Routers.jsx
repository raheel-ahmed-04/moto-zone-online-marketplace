import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import CarListing from "../pages/CarListing";
import CarDetails from "../pages/CarDetails";
import ManageCars from "../pages/ManageCars";
import BikeListing from "../pages/BikeListing"; // New Bike Listing page
import BikeDetails from "../pages/BikeDetails"; // New Bike Details page
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import NotFound from "../pages/NotFound";
import Contact from "../pages/Contact";
import Login from "../pages/login";
import Register from "../pages/Register-page"; // Corrected import
import ManageBikes from "../pages/ManageBikes";
import BookingHistory from "../pages/BookingHistory";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/cars" element={<CarListing />} />
      <Route path="/cars/:slug" element={<CarDetails />} />
      <Route path="/bikes" element={<BikeListing />} />{" "}
      {/* New Bike Listing Route */}
      <Route path="/bikes/:slug" element={<BikeDetails />} />{" "}
      {/* New Bike Details Route */}
      <Route path="/blogs" element={<Blog />} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> {/* Corrected route */}
      <Route path="/manage-cars" element={<ManageCars />} />{" "}
      {/* Corrected route */}
      <Route path="/manage-bikes" element={<ManageBikes />} />{" "}
      {/* Corrected route */}
      <Route path="/bookings-history" element={<BookingHistory />} />{" "}
      {/* Corrected route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
