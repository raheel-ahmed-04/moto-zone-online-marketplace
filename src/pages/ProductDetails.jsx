import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { supabase } from "../../lib/supabase";
import "../styles/error-message.css";

const TABLES = {
  car: {
    table: "cars",
    nameField: "carname",
    type: "car",
    chatLabel: "Negotiate with Seller",
    details: ["model", "automatic", "speed", "gps", "seatType", "brand"],
    priceField: "price",
    imgField: "imgurl",
    sellerField: "seller_id",
    titleField: "carname",
    ratingField: "rating",
    descriptionField: "description",
    joinSeller: true,
  },
  bike: {
    table: "bikes",
    nameField: "bikename",
    type: "bike",
    chatLabel: "Chat with Seller",
    details: ["model", "type", "mileage", "brand"],
    priceField: "price",
    imgField: "imgurl",
    sellerField: "seller_id",
    titleField: "bikename",
    ratingField: "rating",
    descriptionField: "description",
    joinSeller: true,
  },
  caraccessory: {
    table: "caraccessories",
    nameField: "name",
    type: "caraccessory",
    chatLabel: "Chat with Seller",
    details: [],
    priceField: "price",
    imgField: "imgurl",
    sellerField: "seller_id",
    titleField: "name",
    ratingField: "rating",
    descriptionField: "description",
    joinSeller: true,
  },
  bikeaccessory: {
    table: "bikeaccessories",
    nameField: "name",
    type: "bikeaccessory",
    chatLabel: "Chat with Seller",
    details: [],
    priceField: "price",
    imgField: "imgurl",
    sellerField: "seller_id",
    titleField: "name",
    ratingField: "rating",
    descriptionField: "description",
    joinSeller: true,
  },
};

const ProductDetails = (props) => {
  // Support both prop and URL param for type
  const params = useParams();
  const type = props.type || params.type;
  const slug = params.slug;
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  const config = TABLES[type];

  // Handle invalid type
  if (!config) {
    return <div className="error-message">Invalid product type in URL.</div>;
  }

  useEffect(() => {
    const fetchItem = async () => {
      try {
        let query = supabase.from(config.table).select("*");
        if (config.joinSeller) {
          query = supabase
            .from(config.table)
            .select(`*, users:seller_id ( id, name, email )`);
        }
        query = query.ilike(config.nameField, slug).single();
        const { data, error } = await query;
        if (error) throw error;
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
    // eslint-disable-next-line
  }, [type, slug]);

  const toggleWishlist = () => {
    if (!item) return;
    let updatedWishlist;
    if (wishlist.find((w) => w.id === item.id && w.type === config.type)) {
      updatedWishlist = wishlist.filter(
        (w) => !(w.id === item.id && w.type === config.type)
      );
    } else {
      updatedWishlist = [
        ...wishlist,
        {
          id: item.id,
          imgurl: item[config.imgField],
          name: item[config.titleField],
          price: item[config.priceField],
          type: config.type,
        },
      ];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!item) return <h2>Item not found!</h2>;

  return (
    <Helmet title={item[config.titleField]}>
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <img
                src={item[config.imgField]}
                alt={item[config.titleField]}
                className="w-100"
              />
            </Col>
            <Col lg="6">
              <div className="car__info">
                <h2 className="section__title d-flex align-items-center justify-content-between">
                  <span className="d-flex align-items-center">
                    {item[config.titleField]}
                    <i
                      className={`ri-heart-${
                        wishlist.find(
                          (w) => w.id === item.id && w.type === config.type
                        )
                          ? "fill"
                          : "line"
                      }`}
                      style={{
                        cursor: "pointer",
                        color: "#f9a826",
                        marginLeft: 16,
                      }}
                      onClick={toggleWishlist}
                    ></i>
                    {config.joinSeller && (
                      <button
                        className="btn btn-primary btn-sm ms-3"
                        style={{
                          borderRadius: 20,
                          fontSize: "1rem",
                          padding: "0.3rem 1.2rem",
                          marginLeft: 16,
                        }}
                        onClick={() =>
                          navigate(
                            `/chat?contactId=${
                              item[config.sellerField]
                            }&dummyMessage=${encodeURIComponent(
                              `can i get more details about your ${type} - ${
                                item[config.titleField]
                              }`
                            )}`
                          )
                        }
                      >
                        <i className="ri-chat-3-line me-2"></i>{" "}
                        {config.chatLabel}
                      </button>
                    )}
                  </span>
                </h2>
                <h6 className="price fw-bold fs-4">
                  ${item[config.priceField]}.00
                </h6>
                {config.ratingField && (
                  <span className="d-flex align-items-center gap-2">
                    <span style={{ color: "#f9a826" }}>
                      <i className="ri-star-s-fill"></i>
                      <i className="ri-star-s-fill"></i>
                      <i className="ri-star-s-fill"></i>
                      <i className="ri-star-s-fill"></i>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    ({item[config.ratingField]} ratings)
                  </span>
                )}
                <p className="section__description">
                  {item[config.descriptionField]}
                </p>
                {config.details.length > 0 && (
                  <div
                    className="d-flex align-items-center mt-3"
                    style={{ columnGap: "2.8rem" }}
                  >
                    {config.details.map((field) => (
                      <span
                        key={field}
                        className="d-flex align-items-center gap-1 section__description"
                      >
                        <i
                          className={`ri-${field}-line`}
                          style={{ color: "#f9a826" }}
                        ></i>
                        {item[field]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
          {/* Seller Details Section for cars and bikes */}
          {config.joinSeller && (
            <Row className="mt-5 justify-content-center">
              <Col lg="8">
                <div className="d-flex flex-row align-items-center justify-content-center p-4 border rounded bg-light">
                  <div
                    className="d-flex align-items-center justify-content-center me-4"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "#e9ecef",
                    }}
                  >
                    <i
                      className="ri-user-3-line"
                      style={{ fontSize: 60, color: "#adb5bd" }}
                    ></i>
                  </div>
                  <div>
                    <h4 className="mb-2">Seller Details</h4>
                    <div className="mb-1">
                      <strong>Name:</strong> {item.users?.name || "Unknown"}
                    </div>
                    <div className="mb-3">
                      <strong>Email:</strong> {item.users?.email || "N/A"}
                    </div>
                    <button
                      className="btn btn-primary btn-lg mt-2"
                      style={{
                        borderRadius: 30,
                        padding: "0.75rem 2.5rem",
                        fontSize: "1.2rem",
                      }}
                      onClick={() =>
                        navigate(
                          `/chat?contactId=${
                            item[config.sellerField]
                          }&dummyMessage=${encodeURIComponent(
                            `can i get more details about your product-${
                              item[config.titleField]
                            }`
                          )}`
                        )
                      }
                    >
                      <i className="ri-chat-3-line me-2"></i> Chat with Seller
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;
