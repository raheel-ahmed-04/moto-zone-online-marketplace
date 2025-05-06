// src/pages/BookingHistory.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonSection from "../components/UI/CommonSection"; // Optional: Import for page header

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // 1) Get userName from localStorage
        const userName = localStorage.getItem("userName");
        if (!userName) {
          setError("No user logged in");
          return;
        }

        // 2) Fetch bookings for this user
        const { data } = await axios.get(
          `http://localhost:2000/api/bookings/user/${userName}`
        );
        setBookings(data); // data is an array of Booking documents
      } catch (err) {
        console.error("Error fetching user bookings:", err);
        setError("Failed to fetch bookings");
      }
    };

    fetchBookings();
  }, []);

  // If there's an error, display a message
  if (error) {
    return (
      <>
        <CommonSection title="My Booking History" />
        <h4 style={{ margin: "50px" }}>{error}</h4>
      </>
    );
  }

  return (
    <>
      {/* Optional page header */}
      <CommonSection title="My Booking History" />

      <div style={{ margin: "50px", padding: "20px" }}>
        {/* If no bookings, show a note */}
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <th style={{ padding: "8px" }}>Booking ID</th>
                <th style={{ padding: "8px" }}>Name</th>
                <th style={{ padding: "8px" }}>Address</th>
                <th style={{ padding: "8px" }}>Payment</th>
                <th style={{ padding: "8px" }}>Vehicle</th>
                <th style={{ padding: "8px" }}>Model</th>
                <th style={{ padding: "8px" }}>Price</th>
                <th style={{ padding: "8px" }}>Notes</th>
                <th style={{ padding: "8px" }}>Date Created</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                // Check if this is a car or bike
                let vehicleName = "";
                let vehicleModel = "";
                let vehiclePrice = "";

                if (booking.vehicleRefModel === "Car" && booking.vehicleRef) {
                  vehicleName = booking.vehicleRef.carName;
                  vehicleModel = booking.vehicleRef.model;
                  vehiclePrice = `$${booking.vehicleRef.price}`;
                } else if (
                  booking.vehicleRefModel === "Bike" &&
                  booking.vehicleRef
                ) {
                  vehicleName = booking.vehicleRef.bikeName;
                  vehicleModel = booking.vehicleRef.model;
                  vehiclePrice = `$${booking.vehicleRef.price}`;
                }

                return (
                  <tr
                    key={booking._id}
                    style={{ borderBottom: "1px solid #ccc" }}
                  >
                    <td style={{ padding: "8px" }}>{booking._id}</td>
                    <td style={{ padding: "8px" }}>
                      {booking.firstName} {booking.lastName}
                    </td>
                    <td style={{ padding: "8px" }}>{booking.toAddress}</td>
                    <td style={{ padding: "8px" }}>{booking.paymentMethod}</td>
                    <td style={{ padding: "8px" }}>
                      {vehicleName || "Unknown"}
                    </td>
                    <td style={{ padding: "8px" }}>
                      {vehicleModel || "Unknown"}
                    </td>
                    <td style={{ padding: "8px" }}>{vehiclePrice || "N/A"}</td>
                    <td style={{ padding: "8px" }}>{booking.notes || "N/A"}</td>
                    <td style={{ padding: "8px" }}>
                      {new Date(booking.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default BookingHistory;
