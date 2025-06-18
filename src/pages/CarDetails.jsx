// CarDetails.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import { useParams } from "react-router-dom";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
import { supabase } from "../../lib/supabase";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import "../styles/error-message.css";

const CarDetails = () => {
  const { slug } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data, error } = await supabase
          .from("cars")
          .select(
            `
            *,
            users:seller_id (
              name,
              email
            )
          `
          )
          .eq("carname", slug)
          .single();

        if (error) throw error;
        setCar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
    window.scrollTo(0, 0);
  }, [slug]);

  const toggleWishlist = () => {
    let updatedWishlist;
    if (wishlist.find((item) => item.id === car.id && item.type === "car")) {
      updatedWishlist = wishlist.filter(
        (item) => !(item.id === car.id && item.type === "car")
      );
    } else {
      updatedWishlist = [
        ...wishlist,
        {
          id: car.id,
          imgurl: car.imgurl,
          name: car.carname,
          price: car.price,
          type: "car",
        },
      ];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!car) return <h2>Car not found!</h2>;

  return (
    <Helmet title={car.carname}>
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <img src={car.imgurl} alt={car.carname} className="w-100" />
            </Col>

            <Col lg="6">
              <div className="car__info">
                <h2 className="section__title d-flex align-items-center justify-content-between">
                  {car.carname}
                  <i
                    className={`ri-heart-${
                      wishlist.find(
                        (item) => item.id === car.id && item.type === "car"
                      )
                        ? "fill"
                        : "line"
                    }`}
                    style={{ cursor: "pointer", color: "#f9a826" }}
                    onClick={toggleWishlist}
                  ></i>
                </h2>

                <div className="d-flex align-items-center gap-5 mb-4 mt-3">
                  <h6 className="price fw-bold fs-4">${car.price}.00</h6>

                  <span className="d-flex align-items-center gap-2">
                    <span style={{ color: "#f9a826" }}>
                      <i className="ri-star-s-fill"></i>
                      <i className="ri-star-s-fill"></i>
                      <i className="ri-star-s-fill"></i>
                      <i className="ri-star-s-fill"></i>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    ({car.rating} ratings)
                  </span>
                </div>

                <p className="section__description">{car.description}</p>

                <div
                  className="d-flex align-items-center mt-3"
                  style={{ columnGap: "4rem" }}
                >
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-roadster-line" style={{ color: "#f9a826" }}></i>
                    {car.model}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-settings-2-line" style={{ color: "#f9a826" }}></i>
                    {car.automatic}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-timer-flash-line" style={{ color: "#f9a826" }}></i>
                    {car.speed}
                  </span>
                </div>

                <div
                  className="d-flex align-items-center mt-3"
                  style={{ columnGap: "2.8rem" }}
                >
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-map-pin-line" style={{ color: "#f9a826" }}></i>
                    {car.gps}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-wheelchair-line" style={{ color: "#f9a826" }}></i>
                    {car.seatType}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-building-2-line" style={{ color: "#f9a826" }}></i>
                    {car.brand}
                  </span>
                </div>

                <div
                  className="d-flex align-items-center mt-3"
                  style={{ columnGap: "2.8rem" }}
                >
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-user-3-line" style={{ color: "#f9a826" }}></i>
                    Seller: {car.users?.name || "Unknown"}
                  </span>

                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-mail-line" style={{ color: "#f9a826" }}></i>
                    {car.users?.email || "N/A"}
                  </span>
                </div>
              </div>
            </Col>

            <Col lg="7" className="mt-5">
              <div className="booking-info mt-5">
                <h5 className="mb-4 fw-bold">Purchase Information</h5>
                <BookingForm />
              </div>
            </Col>

            <Col lg="5" className="mt-5">
              <div className="payment__info mt-5">
                <h5 className="mb-4 fw-bold">Payment Information</h5>
                <PaymentMethod />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default CarDetails;
