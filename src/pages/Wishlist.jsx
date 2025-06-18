import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/wishlist.css";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(storedWishlist);
  }, []);

  const handleDelete = (itemId) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== itemId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <Container className="wishlist-container mt-5">
      <h2 className="wishlist-title">My Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p className="empty-wishlist">No items in wishlist.</p>
      ) : (
        <Row>
          {wishlistItems.map((item) => (
            <Col lg="4" md="6" sm="12" key={item.id} className="mb-4">
              <div className="wishlist-card">
                <img
                  src={item.imgurl || "/placeholder.jpg"}
                  alt={item.name || item.title}
                  className="wishlist-img"
                />
                <h5 className="wishlist-title-text">{item.name || item.title}</h5>
                <h6 className="wishlist-price">${item.price}.00</h6>
                <p className="wishlist-description">{item.description}</p>
                <div className="wishlist-actions">
                  <Link to={`/${item.type || "vehicle"}-details/${item.slug || item.name}`}>
                    <Button color="primary" className="me-2">
                      View Details
                    </Button>
                  </Link>
                  <Button color="danger" onClick={() => handleDelete(item.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Wishlist;
