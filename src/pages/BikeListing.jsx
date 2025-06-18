// BikeListing.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import { supabase } from "../../lib/supabase";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import CommonSection from "../components/UI/CommonSection";
import "../styles/BikeListing.css";
import "../styles/error-message.css";

const BikeListing = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("default");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        let query = supabase.from("bikes").select(`
            *,
            users:seller_id (
              name
            )
        `);

        if (sortBy === "price-low") {
          query = query.order("price", { ascending: true });
        } else if (sortBy === "price-high") {
          query = query.order("price", { ascending: false });
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) throw supabaseError;
        setBikes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, [sortBy]);

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleAddToWishlist = (bike) => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isExist = existing.some((item) => item.id === bike.id);
    if (!isExist) {
      const bikeToStore = {
        id: bike.id,
        image: bike.imgurl,
        title: bike.bikename,
        description: bike.description,
        price: bike.price,
      };
      existing.push(bikeToStore);
      localStorage.setItem("wishlist", JSON.stringify(existing));
    }
    navigate("/wishlist");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <>
    <CommonSection title="Bike Listing" />
    <Container>
      <div className="d-flex justify-content-end mb-4">
        <select
          className="form-select w-auto"
          value={sortBy}
          onChange={handleSort}
          style={{
            borderColor: "#000d6b",
            color: "#000d6b",
            cursor: "pointer",
          }}
        >
          <option value="default">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
      <Row>
        {bikes.map((bike) => (
          <Col lg="4" md="6" sm="12" className="mb-4" key={bike.id}>
            <div className="bike__item">
              <img
                src={bike.imgurl}
                alt={bike.bikename}
                className="bike__image"
                />
              <div className="bike__item-content mt-3">
                <div className="text-end">
                  <button
                    className="wishlist-icon"
                    onClick={() => handleAddToWishlist(bike)}
                    title="Add to Wishlist"
                    >
                    <i className="ri-heart-line"></i>
                  </button>
                </div>
                <h4 className="section__title text-center">{bike.bikename}</h4>
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
                    <Link to={`/bikes/${bike.bikename}`}>Buy Now</Link>
                  </button>
                  <button className="btn details__btn">
                    <Link to={`/bikes/${bike.bikename}`}>View Details</Link>
                  </button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
    </>
  );
};

export default BikeListing;