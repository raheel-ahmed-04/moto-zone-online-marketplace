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
  const [search, setSearch] = useState("");

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

  const filteredAccessories = bikeAccessories.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Helmet title="Bike Accessories">
      <CommonSection title="Bike Accessories" />
      <section className="accessories">
        <Container>
          <Row className="mb-3 justify-content-end align-items-center">
            <Col md="auto" className="d-flex align-items-center gap-2">
              <div style={{ position: "relative", width: 300 }}>
                <input
                  type="text"
                  className="form-control ps-4 pe-2"
                  style={{ width: 250, display: "inline-block" }}
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#888",
                    pointerEvents: "none",
                    fontSize: 18,
                  }}
                >
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
          <Row>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error}</div>
            ) : filteredAccessories.length === 0 ? (
              <div className="error-message">No accessories found.</div>
            ) : (
              filteredAccessories.map((item) => {
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
                            to={`/car-accessories/${item.name}`}
                            className="details__btn w-50 text-center"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default BikeAccessories;
