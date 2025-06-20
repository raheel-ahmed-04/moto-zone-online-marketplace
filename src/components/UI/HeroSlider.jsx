import React from "react";

import Slider from "react-slick";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";

import "../../styles/hero-slider.css";

const HeroSlider = () => {
  const settings = {
    fade: true,
    speed: 2000,
    autoplaySpeed: 3000,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
  };
  return (
    <Slider {...settings} className="hero__slider">
      <div className="slider__item slider__item-01 mt0">
        <Container>
          <div className="slider__content">
            <h4 className="text-light mb-3">Your Trusted Auto Marketplace</h4>
            <h1 className="text-light mb-4">
              Buy & Sell Cars, Bikes & Accessories Easily
            </h1>

            <button className="btn reserve__btn mt-4">
              <Link to="/cars">Explore Listings</Link>
            </button>
          </div>
        </Container>
      </div>

      <div className="slider__item slider__item-02 mt0">
        <Container>
          <div className="slider__content">
            <h4 className="text-light mb-3">For Sellers & Dealers</h4>
            <h1 className="text-light mb-4">
              List Your Vehicles and Reach More Buyers
            </h1>

            <button className="btn reserve__btn mt-4">
              <Link to="/seller-dashboard">Start Selling</Link>
            </button>
          </div>
        </Container>
      </div>

      <div className="slider__item slider__item-03 mt0">
        <Container>
          <div className="slider__content">
            <h4 className="text-light mb-3">Accessories at Your Fingertips</h4>
            <h1 className="text-light mb-4">
              Find the Best Deals on Auto Parts & Gear
            </h1>

            <button className="btn reserve__btn mt-4">
              <Link to="/bike-accessories">Shop Accessories</Link>
            </button>
          </div>
        </Container>
      </div>
    </Slider>
  );
};

export default HeroSlider;
