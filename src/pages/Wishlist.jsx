// ✅ Wishlist.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(storedWishlist);
  }, []);

  const handleDelete = (itemId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <Container className="mt-5">
      <h2>My Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <Row>
          {wishlistItems.map((item) => (
            <Col lg="4" md="6" sm="12" key={item.id} className="mb-4">
              <div className="border p-3">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.title}
                  className="img-fluid"
                />
                <h5>{item.title}</h5>
                <h6 className="price">${item.price}.00</h6>
                <p>{item.description}</p>
                <Button color="danger" onClick={() => handleDelete(item.id)}>
                  Remove
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Wishlist;