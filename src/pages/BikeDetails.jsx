import "../styles/BikeDetails.css";
import "../styles/error-message.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
import { supabase } from "../../lib/supabase";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const BikeDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const { data, error } = await supabase
          .from("bikes")
          .select(`*, users:seller_id ( name, email )`)
          .ilike("bikename", slug)
          .single();

        if (error) throw error;
        setBike(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, [slug]);

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
  }, [bike]);

  const toggleWishlist = () => {
    if (!bike) return;
    let updatedWishlist;
    if (wishlist.find((item) => item.id === bike.id && item.type === "bike")) {
      updatedWishlist = wishlist.filter(
        (item) => !(item.id === bike.id && item.type === "bike")
      );
    } else {
      updatedWishlist = [
        ...wishlist,
        {
          id: bike.id,
          imgurl: bike.imgurl,
          name: bike.bikename,
          price: bike.price,
          type: "bike",
        },
      ];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const handleAddToWishlist = () => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isExist = existing.some((item) => item.id === bike.id);

    if (!isExist) {
      const wishlistItem = {
        id: bike.id,
        title: bike.bikename,
        image: bike.imgurl,
        description: bike.description,
        price: bike.price,
      };
      existing.push(wishlistItem);
      localStorage.setItem("wishlist", JSON.stringify(existing));
    }

    navigate("/wishlist");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!bike) return <h2>Bike not found!</h2>;

  return (
    <Helmet title={bike.bikename}>
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <img src={bike.imgurl} alt={bike.bikename} className="w-100" />
            </Col>
            <Col lg="6">
              <div className="bike__info">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="section__title mb-0 d-flex align-items-center justify-content-between">
                    {bike.bikename}
                    <i
                      className={`ri-heart-${
                        wishlist.find(
                          (item) => item.id === bike.id && item.type === "bike"
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
                            bike.seller_id
                          }&dummyMessage=${encodeURIComponent(
                            `can i get more details about your product-${bike.bikename}`
                          )}`
                        )
                      }
                    >
                      <i className="ri-chat-3-line me-2"></i> Chat with Seller
                    </button>
                  </h2>
                </div>
                <h6 className="price">${bike.price}.00</h6>
                <p className="section__description">{bike.description}</p>
                <div className="d-flex align-items-center mt-3">
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-roadster-line"></i> {bike.model}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-settings-2-line"></i> {bike.type}
                  </span>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-dashboard-line"></i> {bike.mileage} kmpl
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-building-2-line"></i> {bike.brand}
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
                    <strong>Name:</strong> {bike.users?.name || "Unknown"}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {bike.users?.email || "N/A"}
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
                          bike.seller_id
                        }&dummyMessage=${encodeURIComponent(
                          `can i get more details about your product-${bike.bikename}`
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

export default BikeDetails;
