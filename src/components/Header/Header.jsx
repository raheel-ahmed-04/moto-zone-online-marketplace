import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../styles/header.css";

const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/cars",
    display: "Cars",
  },
  {
    path: "/bikes",
    display: "Bikes",
  },
  {
    path: "/blogs",
    display: "Blog",
  },
  {
    path: "/contact",
    display: "Contact",
  },
  // {
  //   path: "/admin",
  //   display: "Admin",
  // }
];

const Header = () => {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem("userName");
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";
  const role = isAdmin ? "admin" : sessionStorage.getItem("role") || "";
  const isLoggedIn = !!userName;

  const handleLogout = () => {
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header__top">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              <div className="header_top_left">
                <span>Need Help?</span>
                <span className="header_top_help">
                  <i className="ri-phone-fill"></i> +92-3105789904
                </span>
              </div>
            </Col>
            <Col lg="6" md="6" sm="6">
              <div className="header_top_right d-flex align-items-center justify-content-end gap-3">
                {isLoggedIn ? (
                  <>
                    <span className="d-flex align-items-center gap-1">
                      <i className="ri-user-line"></i> {userName} ({role})
                    </span>
                    <Link
                      to="#"
                      className="d-flex align-items-center gap-1"
                      onClick={handleLogout}
                    >
                      <i className="ri-logout-circle-line"></i> Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="d-flex align-items-center gap-1"
                    >
                      <i className="ri-login-circle-line"></i> Login
                    </Link>
                    <Link
                      to="/register"
                      className="d-flex align-items-center gap-1"
                    >
                      <i className="ri-user-line"></i> Register
                    </Link>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="header__middle">
        <Container>
          <Row className="align-items-center">
            <Col lg="4" md="3" sm="4">
              <div className="logo">
                <h1>
                  <Link to="/home" className="d-flex align-items-center gap-2">
                    <i className="ri-car-line"></i>
                    <span>
                      Moto Zone <br /> Showroom
                    </span>
                  </Link>
                </h1>
              </div>
            </Col>

            <Col lg="4" md="5" sm="4">
              <div className="header__location d-flex align-items-center gap-2">
                <span>
                  <i className="ri-earth-line"></i>
                </span>
                <div className="header__location-content">
                  <h4>Pakistan</h4>
                  <h6>Wah Cantt, Islamabad</h6>
                </div>
              </div>
            </Col>

            <Col
              lg="4"
              md="4"
              sm="4"
              className="d-flex align-items-center justify-content-end"
            >
              <button
                className="header__btn btn"
                style={{ backgroundColor: "#ffc107" }}
              >
                <Link to="/contact" style={{ color: "inherit" }}>
                  <i className="ri-phone-line"></i> Request a call
                </Link>
              </button>
              <Link to="/chat" className="btn btn-warning ms-2">
                Chat Page
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="main__navbar">
        <Container>
          <div className="navigation__wrapper d-flex align-items-center justify-content-between">
            <span className="mobile__menu">
              <i className="ri-menu-line"></i>
            </span>

            <div className="navigation">
              <div className="menu">
                {navLinks.map((link, index) => (
                  <NavLink
                    to={link.path}
                    key={index}
                    className="nav__item"
                    activeClassName="nav__active"
                  >
                    {link.display}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="search__box">
              <input type="text" placeholder="Search" />
              <span>
                <i className="ri-search-line"></i>
              </span>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header;
