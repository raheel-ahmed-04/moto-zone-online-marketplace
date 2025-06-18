// CarDetails.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import { useParams, useNavigate } from "react-router-dom";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
import { supabase } from "../../lib/supabase";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import "../styles/error-message.css";

const CarDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
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
                  <span className="d-flex align-items-center">
                    {car.carname}
                    <i
                      className={`ri-heart-${
                        wishlist.find(
                          (item) => item.id === car.id && item.type === "car"
                        )
                          ? "fill"
                          : "line"
                      }`}
                      style={{
                        cursor: "pointer",
                        color: "#f9a826",
                        marginLeft: 16,
                      }}
                      onClick={toggleWishlist}
                    ></i>
                    <button
                      className="btn btn-primary btn-sm ms-3"
                      style={{
                        borderRadius: 20,
                        fontSize: "1rem",
                        padding: "0.3rem 1.2rem",
                        marginLeft: 16,
                      }}
                      onClick={() =>
                        navigate(
                          `/chat?contactId=${
                            car.seller_id
                          }&dummyMessage=${encodeURIComponent(
                            `can i get more details about your product-${car.carname}`
                          )}`
                        )
                      }
                    >
                      <i className="ri-chat-3-line me-2"></i> Negotiate with Seller
                    </button>
                  </span>
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
                    <i
                      className="ri-roadster-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {car.model}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-settings-2-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {car.automatic}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-timer-flash-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {car.speed}
                  </span>
                </div>

                <div
                  className="d-flex align-items-center mt-3"
                  style={{ columnGap: "2.8rem" }}
                >
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-map-pin-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {car.gps}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-wheelchair-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {car.seatType}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-building-2-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {car.brand}
                  </span>
                </div>
              </div>
            </Col>
          </Row>

          {/* Seller Details Section - horizontal and separate */}
          <Row className="mt-5 justify-content-center">
            <Col lg="8">
              <div className="d-flex flex-row align-items-center justify-content-center p-4 border rounded bg-light">
                <div
                  className="d-flex align-items-center justify-content-center me-4"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "#e9ecef",
                  }}
                >
                  <i
                    className="ri-user-3-line"
                    style={{ fontSize: 60, color: "#adb5bd" }}
                  ></i>
                </div>
                <div>
                  <h4 className="mb-2">Seller Details</h4>
                  <div className="mb-1">
                    <strong>Name:</strong> {car.users?.name || "Unknown"}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {car.users?.email || "N/A"}
                  </div>
                  <button
                    className="btn btn-primary btn-lg mt-2"
                    style={{
                      borderRadius: 30,
                      padding: "0.75rem 2.5rem",
                      fontSize: "1.2rem",
                    }}
                    onClick={() =>
                      navigate(
                        `/chat?contactId=${
                          car.seller_id
                        }&dummyMessage=${encodeURIComponent(
                          `can i get more details about your product-${car.carname}`
                        )}`
                      )
                    }
                  >
                    <i className="ri-chat-3-line me-2"></i> Chat with Seller
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default CarDetails;
