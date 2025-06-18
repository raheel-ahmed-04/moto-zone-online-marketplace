import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
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
      <section className="accessories">
        <Container>
          <Row>
            <h2 className="section__title text-center mb-5">Bike Accessories</h2>
            {bikeAccessoriesData.map((item) => (
              <Col lg="4" md="6" sm="12" key={item.id} className="mb-4">
                <div className="accessory__item position-relative">
                  <i
                    className="ri-heart-line wishlist-icon"
                    onClick={() => handleAddToWishlist(item)}
                    title="Add to Wishlist"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      color: "#f94c10",
                      zIndex: 2,
                    }}
                  ></i>
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                    className="accessory__image"
                    style={{ borderRadius: "10px", objectFit: "cover", height: "200px", width: "100%" }}
                  />
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
