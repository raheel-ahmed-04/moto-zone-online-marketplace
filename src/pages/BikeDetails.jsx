import "../styles/BikeDetails.css";
import "../styles/error-message.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
import { supabase } from "../../lib/supabase";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import "../styles/BikeDetails.css"; // Ensure you have the CSS file

const BikeDetails = () => {
  const { slug } = useParams();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const { data, error } = await supabase
          .from("bikes")
          .select(
            `
            *,
            users:seller_id (
              name,
              email
            )
          `
          )
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
                <h2 className="section__title">{bike.bikename}</h2>
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
                  </span>{" "}
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-building-2-line"></i> {bike.brand}
                  </span>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-user-3-line"></i> Seller:{" "}
                    {bike.users?.name || "Unknown"}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-mail-line"></i>{" "}
                    {bike.users?.email || "N/A"}
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
