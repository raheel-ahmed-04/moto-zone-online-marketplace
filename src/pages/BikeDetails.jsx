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
                  <h2 className="section__title">{bike.bikename}</h2>
                  <button className="wishlist-icon" onClick={handleAddToWishlist}>
                    <i className="ri-heart-line"></i>
                  </button>
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
                <div className="d-flex align-items-center mt-3">
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-user-3-line"></i> Seller: {bike.users?.name || "Unknown"}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-mail-line"></i> {bike.users?.email || "N/A"}
                  </span>
                </div>
              </div>
            </Col>
            <Col lg="7" className="mt-5">
              <BookingForm />
            </Col>
            <Col lg="5" className="mt-5">
              <PaymentMethod />
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default BikeDetails;
