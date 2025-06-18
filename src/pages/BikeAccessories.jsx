import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { supabase } from "../../lib/supabase";
import "../styles/BikeAccessories.css";

const BikeAccessories = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [bikeAccessories, setBikeAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const { data, error } = await supabase
          .from("bikeaccessories")
          .select("*");
        if (error) throw error;
        setBikeAccessories(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAccessories();
  }, []);

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
  }, []);

  const handleWishlistClick = (item) => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isExist = existing.some(
      (i) => i.id === item.id && i.type === "bikeaccessory"
    );
    let updated;
    if (!isExist) {
      const itemToStore = {
        id: item.id,
        imgurl: item.imgurl,
        name: item.name,
        description: item.description,
        price: item.price,
        type: "bikeaccessory",
        slug: item.name,
      };
      updated = [...existing, itemToStore];
    } else {
      updated = existing.filter(
        (i) => !(i.id === item.id && i.type === "bikeaccessory")
      );
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Helmet title="Bike Accessories">
      <CommonSection title="Bike Accessories" />
      <section className="accessories">
        <Container>
          <Row>
            {bikeAccessories.map((item) => {
              const isInWishlist = wishlist.find(
                (i) => i.id === item.id && i.type === "bikeaccessory"
              );
              return (
                <Col lg="4" md="6" sm="12" key={item.id} className="mb-4">
                  <div className="accessory__item position-relative">
                    <i
                      className={`ri-heart-${
                        isInWishlist ? "fill" : "line"
                      } wishlist-icon`}
                      onClick={() => handleWishlistClick(item)}
                      title={
                        isInWishlist
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                      style={{ color: "#f9a826", cursor: "pointer" }}
                    ></i>
                    <img
                      src={item.imgurl}
                      alt={item.name}
                      className="accessory__image"
                    />
                    <div className="accessory__content mt-3">
                      <h4 className="text-center">{item.name}</h4>
                      <h6 className="price text-center">${item.price}.00</h6>
                      <p className="description text-center">
                        {item.description}
                      </p>
                      <div className="d-flex justify-content-between gap-2 mt-3 px-3">
                        <Link
                          to="/contact"
                          className="buy__btn w-50 text-center"
                        >
                          Buy Now
                        </Link>
                        <Link
                          to={`/bike-accessories/${item.name}`}
                          className="details__btn w-50 text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default BikeAccessories;
