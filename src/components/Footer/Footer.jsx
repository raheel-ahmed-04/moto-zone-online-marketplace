import React from "react";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/footer.css";
import logo from "../../assets/all-images/logo/logo.png"; // ✅ Logo imported

const quickLinks = [
  { path: "/about", display: "About" },
  { path: "#", display: "Privacy Policy" },
  { path: "/cars", display: "Car Listing" },
  { path: "/bikes", display: "Bike Listing" },
  { path: "/contact", display: "Contact" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row>
          {/* Logo Section */}
          <Col lg="4" md="4" sm="12">
            <div className="footer__logo d-flex align-items-center gap-2">
              <Link
                to="/home"
                className="d-flex align-items-center gap-2 text-white text-decoration-none"
              >
                <img
                  src={logo}
                  alt="Moto Zone Logo"
                  className="footer-logo-img"
                  style={{ width: "150px" }}
                />
                <span className="logo-text">MotoZone MarketPlace</span>
              </Link>
            </div>
            <p className="footer__logo-content mt-3">
              Welcome to Moto Zone, your ultimate destination for cars and bikes. 
              Explore our wide range of vehicles and find your perfect ride.
            </p>
          </Col>

          {/* Quick Links */}
          <Col lg="2" md="4" sm="6">
            <div className="mb-4">
              <h5 className="footer__link-title">Quick Links</h5>
              <ListGroup>
                {quickLinks.map((item, index) => (
                  <ListGroupItem key={index} className="p-0 mt-3 quick__link">
                    <Link to={item.path}>{item.display}</Link>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </div>
          </Col>

          {/* Head Office Info */}
          <Col lg="3" md="4" sm="6">
            <div className="mb-4">
              <h5 className="footer__link-title mb-4">Head Office</h5>
              <p className="office__info">123 Comsats, Wah Cantt, Pakistan</p>
              <p className="office__info">Phone: +92-310579804</p>
              <p className="office__info">Email: bilalraheel5532@gmail.com</p>
              <p className="office__info">Office Time: 10am - 7pm</p>
            </div>
          </Col>

          {/* Newsletter */}
          <Col lg="3" md="4" sm="12">
            <div className="mb-4">
              <h5 className="footer__link-title">Newsletter</h5>
              <p className="section__description">Subscribe to our newsletter</p>
              <div className="newsletter">
                <input type="email" placeholder="Email" />
                <span>
                  <i className="ri-send-plane-line"></i>
                </span>
              </div>
            </div>
          </Col>

          {/* Footer Bottom */}
          <Col lg="12">
            <div className="footer__bottom">
              <p className="section__description d-flex align-items-center justify-content-center gap-1 pt-4">
                <i className="ri-copyright-line"></i>
                Copyright {year}, Developed by Bilal Raheel. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
