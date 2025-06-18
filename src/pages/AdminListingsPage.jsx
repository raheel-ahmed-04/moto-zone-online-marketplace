"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Alert,
  Badge,
  InputGroup,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

const AdminListingsPage = () => {
  const [activeTab, setActiveTab] = useState("cars");
  const [listings, setListings] = useState({
    cars: [],
    bikes: [],
    bikeaccessories: [],
    caraccessories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Modal states
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [formData, setFormData] = useState({});

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = () => {
      const isAdminUser = sessionStorage.getItem("isAdmin") === "true";
      setIsAdmin(isAdminUser);

      if (!isAdminUser) {
        navigate("/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  // Fetch all listings data
  useEffect(() => {
    const fetchAllListings = async () => {
      if (!isAdmin) return;

      try {
        setLoading(true);

        // Fetch cars
        const { data: carsData, error: carsError } = await supabase
          .from("cars")
          .select("*")
          .order("created_at", { ascending: false });

        // Fetch bikes
        const { data: bikesData, error: bikesError } = await supabase
          .from("bikes")
          .select("*")
          .order("created_at", { ascending: false });

        // Fetch bike accessories
        const { data: bikeAccessoriesData, error: bikeAccessoriesError } =
          await supabase
            .from("bikeaccessories")
            .select("*")
            .order("created_at", { ascending: false });

        // Fetch car accessories
        const { data: carAccessoriesData, error: carAccessoriesError } =
          await supabase
            .from("caraccessories")
            .select("*")
            .order("created_at", { ascending: false });

        if (carsError) throw carsError;
        if (bikesError) throw bikesError;
        if (bikeAccessoriesError) throw bikeAccessoriesError;
        if (carAccessoriesError) throw carAccessoriesError;

        setListings({
          cars: carsData || [],
          bikes: bikesData || [],
          bikeaccessories: bikeAccessoriesData || [],
          caraccessories: carAccessoriesData || [],
        });
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllListings();
  }, [isAdmin]);

  // Toggle between tabs
  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setSearchTerm("");
      setStatusFilter("all");
    }
  };

  // Toggle modals
  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      // When closing modal, clear the form data and current listing
      setCurrentListing(null);
      setFormData({});
    }
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
    if (deleteModal) {
      // Only clear currentListing when closing the modal
      setCurrentListing(null);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Get table columns based on active tab
  const getTableColumns = (table) => {
    switch (table) {
      case "cars":
        return [
          "id",
          "carname",
          "brand",
          "model",
          "price",
          "speed",
          "gps",
          "seattype",
          "automatic",
          "created_at",
        ];
      case "bikes":
        return [
          "id",
          "bikename",
          "brand",
          "model",
          "price",
          "speed",
          "gps",
          "seattype",
          "automatic",
          "created_at",
        ];
      case "bikeaccessories":
      case "caraccessories":
        return ["id", "name", "price", "description", "created_at"];
      default:
        return ["id", "name", "price", "created_at"];
    }
  };

  // Get form fields based on active tab
  const getFormFields = (table) => {
    switch (table) {
      case "cars":
        return [
          { name: "carname", label: "Car Name", type: "text", required: true },
          { name: "brand", label: "Brand", type: "text", required: true },
          { name: "model", label: "Model", type: "text", required: true },
          { name: "price", label: "Price", type: "number", required: true },
          { name: "speed", label: "Speed", type: "text", required: false },
          { name: "gps", label: "GPS", type: "text", required: false },
          {
            name: "seattype",
            label: "Seat Type",
            type: "text",
            required: false,
          },
          {
            name: "automatic",
            label: "Transmission",
            type: "select",
            options: ["manual", "automatic"],
            required: false,
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            required: true,
          },
          { name: "imgurl", label: "Image URL", type: "text", required: false },
          {
            name: "rating",
            label: "Rating (1-5)",
            type: "number",
            required: false,
            min: 1,
            max: 5,
          },
        ];
      case "bikes":
        return [
          {
            name: "bikename",
            label: "Bike Name",
            type: "text",
            required: true,
          },
          { name: "brand", label: "Brand", type: "text", required: true },
          { name: "model", label: "Model", type: "text", required: true },
          { name: "price", label: "Price", type: "number", required: true },
          { name: "speed", label: "Speed", type: "text", required: false },
          { name: "gps", label: "GPS", type: "text", required: false },
          {
            name: "seattype",
            label: "Seat Type",
            type: "text",
            required: false,
          },
          {
            name: "automatic",
            label: "Transmission",
            type: "select",
            options: ["manual", "automatic"],
            required: false,
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            required: true,
          },
          { name: "imgurl", label: "Image URL", type: "text", required: false },
          {
            name: "rating",
            label: "Rating (1-5)",
            type: "number",
            required: false,
            min: 1,
            max: 5,
          },
        ];
      case "bikeaccessories":
      case "caraccessories":
        return [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "price", label: "Price", type: "number", required: true },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            required: true,
          },
          { name: "imgurl", label: "Image URL", type: "text", required: false },
        ];
      default:
        return [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "price", label: "Price", type: "number", required: true },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            required: true,
          },
        ];
    }
  };

  // Open edit modal
  const handleEdit = (listing) => {
    setCurrentListing(listing);
    // Create a copy of the listing data to avoid direct mutation
    const editData = { ...listing };
    setFormData(editData);
    toggleModal();
  };

  // Open delete modal
  const handleDelete = (listing) => {
    setCurrentListing(listing);
    toggleDeleteModal();
  };

  // Save listing (create or update)
  const handleSave = async () => {
    try {
      setError(null);

      if (currentListing) {
        // Update existing listing
        const { error } = await supabase
          .from(activeTab)
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentListing.id);

        if (error) throw error;
        setSuccess("Listing updated successfully!");
      }

      // Refresh listings
      const { data: refreshedData } = await supabase
        .from(activeTab)
        .select("*")
        .order("created_at", { ascending: false });
      setListings({ ...listings, [activeTab]: refreshedData || [] });

      toggleModal();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving listing:", err);
      setError(err.message);
    }
  };

  // Delete listing
  const handleConfirmDelete = async () => {
    if (!currentListing || !currentListing.id) {
      setError("No listing selected for deletion");
      return;
    }

    try {
      setError(null);

      const { error } = await supabase
        .from(activeTab)
        .delete()
        .eq("id", currentListing.id);

      if (error) throw error;

      // Update state to remove the deleted listing
      setListings({
        ...listings,
        [activeTab]: listings[activeTab].filter(
          (item) => item.id !== currentListing.id
        ),
      });

      setSuccess("Listing deleted successfully!");
      toggleDeleteModal();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting listing:", err);
      setError(err.message);
    }
  };

  // Filter listings based on search and status
  const getFilteredListings = () => {
    let filtered = listings[activeTab] || [];

    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const searchFields = [];

        if (activeTab === "cars") {
          searchFields.push(item.carname, item.brand, item.model);
        } else if (activeTab === "bikes") {
          searchFields.push(item.bikename, item.brand, item.model);
        } else {
          searchFields.push(item.name);
        }

        return searchFields.some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    return filtered;
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const colors = {
      active: "success",
      inactive: "warning",
      sold: "secondary",
    };
    return <Badge color={colors[status] || "primary"}>{status}</Badge>;
  };

  if (!isAdmin) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <Container className="admin-listings-page mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Admin - Listings Management</h2>
          <p className="text-muted">
            Manage all listings across cars, bikes, and accessories
          </p>
        </Col>
      </Row>

      {error && (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert color="success" className="mb-4">
          {success}
        </Alert>
      )}

      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTab === "cars" ? "active" : ""}
            onClick={() => toggle("cars")}
          >
            Cars ({listings.cars.length})
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "bikes" ? "active" : ""}
            onClick={() => toggle("bikes")}
          >
            Bikes ({listings.bikes.length})
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "bikeaccessories" ? "active" : ""}
            onClick={() => toggle("bikeaccessories")}
          >
            Bike Accessories ({listings.bikeaccessories.length})
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "caraccessories" ? "active" : ""}
            onClick={() => toggle("caraccessories")}
          >
            Car Accessories ({listings.caraccessories.length})
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab} className="mt-3">
        {["cars", "bikes", "bikeaccessories", "caraccessories"].map((tab) => (
          <TabPane key={tab} tabId={tab}>
            <Card>
              <CardHeader>
                <Row className="align-items-center">
                  <Col md="4">
                    <h5 className="mb-0">
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} Management
                    </h5>
                  </Col>
                  <Col md="4">
                    <InputGroup>
                      <Input
                        type="text"
                        placeholder="Search listings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md="2">
                    <Input
                      type="select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="sold">Sold</option>
                    </Input>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <div className="text-center my-5">Loading {tab}...</div>
                ) : (
                  <Table striped responsive>
                    <thead>
                      <tr>
                        {tab === "cars" && (
                          <>
                            <th>Car Name</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Price</th>
                            <th>Speed</th>
                            <th>GPS</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </>
                        )}
                        {tab === "bikes" && (
                          <>
                            <th>Bike Name</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Price</th>
                            <th>Speed</th>
                            <th>GPS</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </>
                        )}
                        {(tab === "bikeaccessories" ||
                          tab === "caraccessories") && (
                          <>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredListings().length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No {tab} found. Add your first listing!
                          </td>
                        </tr>
                      ) : (
                        getFilteredListings().map((listing) => (
                          <tr key={listing.id}>
                            {tab === "cars" && (
                              <>
                                <td>{listing.carname}</td>
                                <td>{listing.brand}</td>
                                <td>{listing.model}</td>
                                <td>${listing.price}</td>
                                <td>{listing.speed}</td>
                                <td>{listing.gps}</td>
                                <td>
                                  {new Date(
                                    listing.created_at
                                  ).toLocaleDateString()}
                                </td>
                              </>
                            )}
                            {tab === "bikes" && (
                              <>
                                <td>{listing.bikename}</td>
                                <td>{listing.brand}</td>
                                <td>{listing.model}</td>
                                <td>${listing.price}</td>
                                <td>{listing.speed}</td>
                                <td>{listing.gps}</td>
                                <td>
                                  {new Date(
                                    listing.created_at
                                  ).toLocaleDateString()}
                                </td>
                              </>
                            )}
                            {(tab === "bikeaccessories" ||
                              tab === "caraccessories") && (
                              <>
                                <td>{listing.name}</td>
                                <td>${listing.price}</td>
                                <td>
                                  {listing.description?.substring(0, 50)}...
                                </td>
                                <td>
                                  {new Date(
                                    listing.created_at
                                  ).toLocaleDateString()}
                                </td>
                              </>
                            )}
                            <td>
                              <Button
                                color="info"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEdit(listing)}
                              >
                                Edit
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(listing)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </TabPane>
        ))}
      </TabContent>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete "
          {currentListing?.carname ||
            currentListing?.bikename ||
            currentListing?.name ||
            "this item"}
          "? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default AdminListingsPage;
