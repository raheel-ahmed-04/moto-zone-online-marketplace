import React from "react";
import { useParams } from "react-router-dom";
import bikeData from "../assets/data/bikeData";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
import "../styles/BikeDetails.css"; // Ensure you have the CSS file

const BikeDetails = () => {
  const { slug } = useParams();
  const bike = bikeData.find(
    (item) => item.bikeName.toLowerCase() === slug.toLowerCase()
  );

  if (!bike) {
    return <h2>Bike not found!</h2>;
  }

  return (
    <Helmet title={bike.bikeName}>
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <img src={bike.imgUrl} alt={bike.bikeName} className="w-100" />
            </Col>
            <Col lg="6">
              <div className="bike__info">
                <h2 className="section__title">{bike.bikeName}</h2>
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
