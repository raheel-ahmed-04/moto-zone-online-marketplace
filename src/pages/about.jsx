import React from "react";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import BecomeDriverSection from "../components/UI/BecomeDriverSection";
import driveImg from "../assets/all-images/drive.jpg";
import OurMembers from "../components/UI/OurMembers";
import "../styles/about.css";
import "../styles/developer-card.css";

// Placeholder images for developers (replace with actual images)
import raheelImg from "../assets/all-images/developers/raheel.jpg";
import ahadImg from "../assets/all-images/developers/ahad.jpg";
import bilalImg from "../assets/all-images/developers/bilal.jpeg";
import ahmadImg from "../assets/all-images/developers/ahmad.jpg";

const About = () => {
  return (
    <Helmet title="About">
      <CommonSection title="About MotoZone" />

      <section className="about__page-section">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12">
              <div className="about__page-img">
                <img
                  src={driveImg}
                  alt="Vehicle showcase"
                  className="w-100 rounded-3"
                />
              </div>
            </Col>

            <Col lg="6" md="6" sm="12">
              <div className="about__page-content">
                <h2 className="section__title">
                  MotoZone: Your Trusted Online Marketplace
                </h2>

                <p className="section__description">
                  MotoZone is a comprehensive online marketplace designed to
                  streamline the buying and selling of vehicles, bikes, and
                  accessories in Pakistan. Developed as a Software Quality
                  Engineering semester project by students at COMSATS University
                  Islamabad, Wah Campus, MotoZone addresses common challenges in
                  the market, such as unreliable listings and lack of dedicated
                  accessory sections. Our platform offers verified seller
                  authentication, real-time chat for secure communication,
                  advanced search and filtering, and an admin dashboard to
                  ensure trust and safety. Whether you're a buyer seeking your
                  dream ride or a seller looking to reach genuine customers,
                  MotoZone is your one-stop solution.
                </p>

                <p className="section__description">
                  Find your ideal bike, car, or accessory at MotoZone today!
                </p>

                <div className="d-flex align-items-center gap-3 mt-4">
                  <span className="fs-4">
                    <i className="ri-phone-line"></i>
                  </span>

                  <div>
                    <h6 className="section__subtitle">Need Any Help?</h6>
                    <h4>+923105789804</h4>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="about__page-section">
        <Container>
          <Row>
            <Col lg="12" className="mb-5 text-center">
              <h6 className="section__subtitle">Our Team</h6>
              <h2 className="section__title">Meet Our Developers</h2>
            </Col>
          </Row>
          <Row>
            <Col lg="3" md="6" sm="12" className="mb-4 text-center">
              <div className="developer__card">
                <img
                  src={raheelImg}
                  alt="Raheel Ahmed"
                  className="developer__img rounded-circle w-100"
                />
                <h5 className="mt-3">Raheel Ahmed</h5>
                <p className="section__description">
                  Team Lead <br></br>User Management/Authorization <br></br> Role-Based Access <br></br> and Frontend Developer
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <a
                    href="https://github.com/raheel-ahmed-04"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ri-github-fill fs-5"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/raheelahmad72"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ri-linkedin-fill fs-5"></i>
                  </a>
                </div>
              </div>
            </Col>
            <Col lg="3" md="6" sm="12" className="mb-4 text-center">
              <div className="developer__card">
                <img
                  src={ahadImg}
                  alt="Ahad Ur Rehman"
                  className="developer__img rounded-circle w-100"
                />
                <h5 className="mt-3">Ahad Ur Rehman</h5>
                <p className="section__description">
                  Admin Dashboard <br></br> and Database Developer
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <a
                    href="https://github.com/Ahad-Rehman"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ri-github-fill fs-5"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ahad-ur-rehman-a4bb77278/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ri-linkedin-fill fs-5"></i>
                  </a>
                </div>
              </div>
            </Col>
            <Col lg="3" md="6" sm="12" className="mb-4 text-center">
              <div className="developer__card">
                <img
                  src={bilalImg}
                  alt="Bilal Arshad"
                  className="developer__img rounded-circle w-100"
                />
                <h5 className="mt-3">Bilal Arshad</h5>
                <p className="section__description">
                  All Listing <br></br> and Frontend Developer
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <a
                    href="https://github.com/raheel-ahmed-04"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ri-github-fill fs-5"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/raheelahmad72"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ri-linkedin-fill fs-5"></i>
                  </a>
                </div>
              </div>
            </Col>
            <Col lg="3" md="6" sm="12" className="mb-4 text-center">
              <div className="developer__card">
                <img
                  src={ahmadImg}
                  alt="Ahmad Rana"
                  className="developer__img rounded-circle w-100"
                />
                <h5 className="mt-3">Ahmad Rana</h5>
                <p className="section__description">
                  Chat & Communication Developer
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <a
                    href="https://github.com/ahmad1751"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ri-github-fill fs-5"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ahmad-rana-311b63282"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ri-linkedin-fill fs-5"></i>
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

    </Helmet>
  );
};

export default About;
