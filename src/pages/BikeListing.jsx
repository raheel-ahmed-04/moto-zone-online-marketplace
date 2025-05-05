import React from 'react';
import { Link } from 'react-router-dom';
import bikeData from '../assets/data/bikeData';
import { Row, Col } from 'reactstrap'; // Note: Added Row to group columns
import '../styles/BikeListing.css'; // Ensure you have the CSS file

const BikeListing = () => {
  return (
    <Row> {/* Added Row to wrap the Col elements */}
      {bikeData.map((bike) => (
        <Col lg="4" md="6" sm="12" className="mb-4" key={bike.id}> {/* Changed sm="6" to sm="12" */}
          <div className="bike__item">
            <img src={bike.imgUrl} alt={bike.bikeName} className="bike__image" />
            <div className="bike__item-content mt-3">
              <h4 className="section__title text-center">{bike.bikeName}</h4>
              <h6 className="price text-center mt-2">${bike.price}.00</h6>
              <div className="d-flex align-items-center justify-content-center mt-3 mb-4">
                <span className="d-flex align-items-center me-3">
                  <i className="ri-roadster-line"></i> {bike.model}
                </span>
                <span className="d-flex align-items-center me-3">
                  <i className="ri-settings-2-line"></i> {bike.type}
                </span>
                <span className="d-flex align-items-center">
                  <i className="ri-dashboard-line"></i> {bike.mileage} kmpl
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn buy__btn">
                  <Link to={`/bikes/${bike.bikeName}`}>Buy Now</Link>
                </button>
                <button className="btn details__btn">
                  <Link to={`/bikes/${bike.bikeName}`}>View Details</Link>
                </button>
              </div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default BikeListing;
