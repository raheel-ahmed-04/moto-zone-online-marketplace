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
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
  }, [bikes]);

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleWishlistClick = (bike) => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isExist = existing.some(
      (item) => item.id === bike.id && item.type === "bike"
    );
    let updated;
    if (!isExist) {
      const bikeToStore = {
        id: bike.id,
        imgurl: bike.imgurl,
        title: bike.bikename,
        description: bike.description,
        price: bike.price,
        type: "bike",
      };
      updated = [...existing, bikeToStore];
    } else {
      updated = existing.filter(
        (item) => !(item.id === bike.id && item.type === "bike")
      );
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const filteredBikes = bikes.filter(
    (bike) =>
      bike.bikename?.toLowerCase().includes(search.toLowerCase()) ||
      bike.brand?.toLowerCase().includes(search.toLowerCase()) ||
      bike.model?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <>
      <CommonSection title="Bike Listing" />
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
            <select
              className="form-select"
              style={{ width: 150 }}
              value={sortBy}
              onChange={handleSort}
            >
              <option value="default">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </Col>
        </Row>
        <Row>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="error-message">Error: {error}</div>
          ) : filteredBikes.length === 0 ? (
            <div className="error-message">No bikes found.</div>
          ) : (
            filteredBikes.map((bike) => {
              const isInWishlist = wishlist.find(
                (item) => item.id === bike.id && item.type === "bike"
              );
              return (
                <Col
                  lg="4"
                  md="6"
                  sm="12"
                  className="mb-4"
                  key={bike.id + (localStorage.getItem("wishlist") || "")}
                >
                  <div className="bike__item position-relative">
                    <i
                      className={`ri-heart-${
                        isInWishlist ? "fill" : "line"
                      } wishlist-icon`}
                      onClick={() => handleWishlistClick(bike)}
                      title={
                        isInWishlist
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                      style={{ color: "#f9a826", cursor: "pointer" }}
                    ></i>
                    <img
                      src={bike.imgurl}
                      alt={bike.bikename}
                      className="bike__image w-100"
                      style={{
                        borderRadius: "10px",
                        objectFit: "cover",
                        height: "200px",
                      }}
                    />
                    <div className="bike__item-content mt-3">
                      <h4 className="section__title text-center">
                        {bike.bikename}
                      </h4>
                      <h6 className="price text-center mt-2">
                        ${bike.price}.00
                      </h6>
                      <div className="d-flex align-items-center justify-content-center mt-3 mb-4">
                        <span className="d-flex align-items-center me-3">
                          <i className="ri-roadster-line"></i> {bike.model}
                        </span>
                        <span className="d-flex align-items-center me-3">
                          <i className="ri-settings-2-line"></i> {bike.type}
                        </span>
                        <span className="d-flex align-items-center">
                          <i className="ri-dashboard-line"></i> {bike.mileage}{" "}
                          kmpl
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <Link
                          to={`/bikes/${bike.bikename}`}
                          className="buy__btn"
                        >
                          Buy Now
                        </Link>
                        <Link
                          to={`/bikes/${bike.bikename}`}
                          className="details__btn"
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
    </>
  );
};

export default BikeListing;
