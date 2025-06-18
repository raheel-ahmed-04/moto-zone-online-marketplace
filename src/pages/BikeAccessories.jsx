// src/pages/BikeAccessories.jsx
import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import bikeAccessoriesData from "../assets/data/bikeAccessoriesData";
import "../styles/BikeAccessories.css";

const BikeAccessories = () => {
  return (
    <Helmet title="Bike Accessories">
    <CommonSection title="Bike Accessories" />
      <section className="accessories">
        <Container>
          <Row>
            {bikeAccessoriesData.map((item) => (
              <Col lg="4" md="6" sm="12" key={item.id} className="mb-4">
                <div className="accessory__item">
                  <img src={item.imgUrl} alt={item.name} className="accessory__image" />
                  <div className="accessory__content mt-3">
                    <h4 className="text-center">{item.name}</h4>
                    <h6 className="price text-center">${item.price}.00</h6>
                    <p className="description text-center">{item.description}</p>
                    <div className="d-flex justify-content-center mt-3">
                      <button className="btn buy__btn">
                        <Link to="/contact">Buy Now</Link>
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default BikeAccessories;
