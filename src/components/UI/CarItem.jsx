import React from "react";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/car-item.css";

const CarItem = ({ item, onAddToWishlist }) => {
  const { imgurl, model, carname, automatic, speed, price, users } = item;

  return (
    <Col lg="4" md="4" sm="6" className="mb-5">
      <div className="car__item position-relative">
        {/* Wishlist Icon */}
        <i
          className="ri-heart-line wishlist-icon"
          onClick={() => onAddToWishlist(item)}
          title="Add to Wishlist"
        ></i>

        <div className="car__img">
          <img src={imgurl} alt={carname} className="w-100" />
        </div>

        <div className="car__item-content mt-4">
          <h4 className="section__title text-center">{carname}</h4>
          <h6 className="price text-center mt-2">${price}.00</h6>

          <div className="car__item-info d-flex align-items-center justify-content-between mt-3 mb-4">
            <span className="d-flex align-items-center gap-1">
              <i className="ri-car-line"></i> {model}
            </span>
            <span className="d-flex align-items-center gap-1">
              <i className="ri-settings-2-line"></i> {automatic}
            </span>
            <span className="d-flex align-items-center gap-1">
              <i className="ri-timer-flash-line"></i> {speed}
            </span>
          </div>

          <div className="d-flex align-items-center justify-content-center mt-2 mb-3">
            <span className="d-flex align-items-center gap-1">
              <i className="ri-user-3-line"></i> Seller: {users?.name || "Unknown"}
            </span>
          </div>

          <div className="d-flex justify-content-between">
            <Link to={`/cars/${carname}`} className="buy__btn">
              Buy Now
            </Link>
            <Link to={`/cars/${carname}`} className="details__btn">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default CarItem;

