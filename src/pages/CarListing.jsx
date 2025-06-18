import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { supabase } from "../../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import "../styles/car-item.css";

const CarListing = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("select");
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  useEffect(() => {
    const fetchCars = async () => {
      try {
        let query = supabase.from("cars").select(`
            *,
            users:seller_id (
              name
            )
        `);

        if (sortOrder === "low") {
          query = query.order("price", { ascending: true });
        } else if (sortOrder === "high") {
          query = query.order("price", { ascending: false });
        }

        const { data, error: supabaseError } = await query;
        if (supabaseError) throw supabaseError;
        setCars(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [sortOrder]);

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  const handleWishlistClick = (car) => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isExist = existing.some(
      (item) => item.id === car.id && item.type === "car"
    );
    let updated;
    if (!isExist) {
      const carToStore = {
        id: car.id,
        imgurl: car.imgurl,
        name: car.carname,
        description: car.description,
        price: car.price,
        type: "car",
        slug: car.carname,
      };
      updated = [...existing, carToStore];
    } else {
      updated = existing.filter(
        (item) => !(item.id === car.id && item.type === "car")
      );
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
  }, [cars]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <Helmet title="Cars">
      <CommonSection title="Car Listing" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="d-flex align-items-center gap-3 mb-5">
                <span className="d-flex align-items-center gap-2">
                  <i className="ri-sort-asc"></i> Sort By
                </span>
                <select value={sortOrder} onChange={handleSort}>
                  <option value="select">Select</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>
            </Col>
            {cars.map((item) => {
              const isInWishlist = wishlist.find(
                (wishlistItem) =>
                  wishlistItem.id === item.id && wishlistItem.type === "car"
              );
              return (
                <Col
                  lg="4"
                  md="4"
                  sm="6"
                  className="mb-5"
                  key={item.id + (localStorage.getItem("wishlist") || "")}
                >
                  <div className="car__item position-relative">
                    {/* Wishlist Icon */}
                    <i
                      className={`wishlist-icon ri-heart-${
                        isInWishlist ? "fill" : "line"
                      }`}
                      style={{ cursor: "pointer", color: "#f9a826" }}
                      onClick={() => handleWishlistClick(item)}
                      title={
                        isInWishlist
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                    ></i>
                    <div className="car__img">
                      <img
                        src={item.imgurl}
                        alt={item.carname}
                        className="w-100"
                      />
                    </div>
                    <div className="car__item-content mt-4">
                      <h4 className="section__title text-center">
                        {item.carname}
                      </h4>
                      <h6 className="price text-center mt-2">
                        ${item.price}.00
                      </h6>
                      <div className="car__item-info d-flex align-items-center justify-content-between mt-3 mb-4">
                        <span className="d-flex align-items-center gap-1">
                          <i className="ri-car-line"></i> {item.model}
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <i className="ri-settings-2-line"></i>{" "}
                          {item.automatic}
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <i className="ri-timer-flash-line"></i> {item.speed}
                        </span>
                      </div>
                      <div className="d-flex align-items-center justify-content-center mt-2 mb-3">
                        <span className="d-flex align-items-center gap-1">
                          <i className="ri-user-3-line"></i> Seller:{" "}
                          {item.users?.name || "Unknown"}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <Link to={`/cars/${item.carname}`} className="buy__btn">
                          Buy Now
                        </Link>
                        <Link
                          to={`/cars/${item.carname}`}
                          className="details__btn"
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

export default CarListing;
