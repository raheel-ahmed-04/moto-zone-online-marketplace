import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import CarItem from "../components/UI/CarItem";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const CarListing = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("select");

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

  const handleManageCars = () => {
    navigate("/manage-cars");
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  const handleAddToWishlist = (car) => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isExist = existing.some((item) => item.id === car.id);
    if (!isExist) {
      const carToStore = {
        id: car.id,
        imgurl: car.imgurl,
        name: car.carname,
        description: car.description,
        price: car.price,
        type: "car",
        slug: car.carname, // optional for View Details routing
      };
      existing.push(carToStore);
      localStorage.setItem("wishlist", JSON.stringify(existing));
    }
    navigate("/wishlist");
  };

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
                <Button onClick={handleManageCars}>Manage Cars</Button>
              </div>
            </Col>

            {cars.map((item) => (
              <CarItem key={item.id} item={item} onAddToWishlist={handleAddToWishlist} />
            ))}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default CarListing;
