import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import bikeAccessoriesData from "../assets/data/bikeAccessoriesData";
import "../styles/BikeAccessories.css";

const BikeAccessories = () => {
  const navigate = useNavigate();

  const handleAddToWishlist = (item) => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isExist = existing.some((i) => i.id === item.id && i.type === "bikeaccessory");

    if (!isExist) {
      const itemToStore = {
        id: item.id,
        imgurl: item.imgUrl,
        name: item.name,
        description: item.description,
        price: item.price,
        type: "bikeaccessory",
        slug: item.name,
      };
      existing.push(itemToStore);
      localStorage.setItem("wishlist", JSON.stringify(existing));
    }
    navigate("/wishlist");
  };

  return (
    <Helmet title="Bike Accessories">
    <CommonSection title="Bike Accessories" />
      <section className="accessories">
        <Container>
          <Row>
            {bikeAccessoriesData.map((item) => (
              <Col lg="4" md="6" sm="12" key={item.id} className="mb-4">
                <div className="accessory__item position-relative">
                  <i
                    className="ri-heart-line wishlist-icon"
                    onClick={() => handleAddToWishlist(item)}
                    title="Add to Wishlist"
                  ></i>
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                    className="accessory__image"
                  />
                  <div className="accessory__content mt-3">
                    <h4 className="text-center">{item.name}</h4>
                    <h6 className="price text-center">${item.price}.00</h6>
                    <p className="description text-center">{item.description}</p>
                    <div className="d-flex justify-content-between gap-2 mt-3 px-3">
                      <Link to="/contact" className="buy__btn w-50 text-center">Buy Now</Link>
                      <Link to={`/bike-accessories/${item.name}`} className="details__btn w-50 text-center">View Details</Link>
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
;

