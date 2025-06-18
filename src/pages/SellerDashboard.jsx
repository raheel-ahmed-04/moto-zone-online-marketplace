import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../styles/seller-dashboard.css";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("cars");
  const [cars, setCars] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [bikeAccessories, setBikeAccessories] = useState([]);
  const [carAccessories, setCarAccessories] = useState([]);
  const [modal, setModal] = useState(false);
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const sellerId = parseInt(sessionStorage.getItem("userId"), 10);
  const role = sessionStorage.getItem("role");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (role !== "seller") {
      navigate("/login");
      return;
    }
    fetchItems();
  }, [role, navigate]);

  const fetchItems = async () => {
    try {
      console.log(
        "Fetching items for seller ID: type ",
        typeof sellerId,
        sellerId
      );
      setLoading(true);
      const [carsRes, bikesRes, bikeAccRes, carAccRes] = await Promise.all([
        supabase.from("cars").select("*").eq("seller_id", sellerId),
        supabase.from("bikes").select("*").eq("seller_id", sellerId),
        supabase.from("bikeaccessories").select("*").eq("seller_id", sellerId),
        supabase.from("caraccessories").select("*").eq("seller_id", sellerId),
      ]);

      setCars(carsRes.data || []);
      setBikes(bikesRes.data || []);
      setBikeAccessories(bikeAccRes.data || []);
      setCarAccessories(carAccRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const toggleModal = (clearForm = true) => {
    setModal(!modal);
    if (!modal && clearForm) {
      setFormData({});
      setImageFile(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}-${Math.random()}.${fileExt}`;
      const filePath = `${formType}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true, // Allow overwriting
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imgurl = formData.imgurl;

      if (imageFile) {
        imgurl = await uploadImage(imageFile);
      }

      const submitData = {
        ...formData,
        seller_id: sellerId,
        imgurl,
      };

      let table;
      switch (formType) {
        case "cars":
          table = "cars";
          break;
        case "bikes":
          table = "bikes";
          break;
        case "bikeAccessories":
          table = "bikeaccessories";
          break;
        case "carAccessories":
          table = "caraccessories";
          break;
        default:
          throw new Error("Invalid form type");
      }

      if (formData.id) {
        // Update
        const { error } = await supabase
          .from(table)
          .update(submitData)
          .eq("id", formData.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from(table).insert([submitData]);
        if (error) throw error;
      }

      await fetchItems();
      toggleModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from(type).delete().eq("id", id);

      if (error) throw error;
      await fetchItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (type) => {
    setFormType(type);
    setFormData({});
    toggleModal();
  };
  const handleEdit = (item, type) => {
    console.log("Editing item:", item, "Type:", type);
    setFormType(type);

    // First set the form data
    setFormData(item);

    // Then open the modal, but don't clear the form
    toggleModal(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (role !== "seller") return null;

  const renderForm = () => {
    const commonFields = (
      <>
        {" "}
        <FormGroup>
          <Label for="imgurl">Image</Label>
          <Input type="file" onChange={handleImageChange} accept="image/*" />
          {formData.imgurl && (
            <img
              src={formData.imgurl}
              alt="Preview"
              style={{ width: "100px", marginTop: "10px" }}
            />
          )}
        </FormGroup>
        <FormGroup>
          <Label for="price">Price</Label>
          <Input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="textarea"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
      </>
    );

    const vehicleFields = (
      <>
        <FormGroup>
          <Label for="brand">Brand</Label>
          <Input
            type="text"
            name="brand"
            value={formData.brand || ""}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="model">Model</Label>
          <Input
            type="text"
            name="model"
            value={formData.model || ""}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="speed">Speed</Label>
          <Input
            type="text"
            name="speed"
            value={formData.speed || ""}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="automatic">Transmission</Label>
          <Input
            type="select"
            name="automatic"
            value={formData.automatic || ""}
            onChange={handleInputChange}
            required
          >
            <option value="">Select...</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="gps">GPS</Label>
          <Input
            type="select"
            name="gps"
            value={formData.gps || ""}
            onChange={handleInputChange}
            required
          >
            <option value="">Select...</option>
            <option value="Included">Included</option>
            <option value="Not Included">Not Included</option>
          </Input>
        </FormGroup>
      </>
    );

    switch (formType) {
      case "cars":
        return (
          <>
            <FormGroup>
              <Label for="carname">Car Name</Label>
              <Input
                type="text"
                name="carname"
                value={formData.carname || ""}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            {vehicleFields}
            {commonFields}
          </>
        );
      case "bikes":
        return (
          <>
            <FormGroup>
              <Label for="bikename">Bike Name</Label>
              <Input
                type="text"
                name="bikename"
                value={formData.bikename || ""}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            {vehicleFields}
            {commonFields}
          </>
        );
      case "bikeAccessories":
      case "carAccessories":
        return (
          <>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            {commonFields}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="seller-dashboard">
      <h2>Seller Dashboard</h2>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTab === "cars" ? "active" : ""}
            onClick={() => setActiveTab("cars")}
          >
            Cars
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "bikes" ? "active" : ""}
            onClick={() => setActiveTab("bikes")}
          >
            Bikes
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "bikeAccessories" ? "active" : ""}
            onClick={() => setActiveTab("bikeAccessories")}
          >
            Bike Accessories
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "carAccessories" ? "active" : ""}
            onClick={() => setActiveTab("carAccessories")}
          >
            Car Accessories
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="cars">
          <Button
            color="primary"
            onClick={() => handleAdd("cars")}
            className="mt-3 mb-3"
          >
            Add New Car
          </Button>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>{" "}
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>{car.carname}</td>
                  <td>{car.brand}</td>
                  <td>${car.price}</td>
                  <td>
                    <Button
                      color="warning"
                      onClick={() => handleEdit(car, "cars")}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDelete(car.id, "cars")}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabPane>

        <TabPane tabId="bikes">
          <Button
            color="primary"
            onClick={() => handleAdd("bikes")}
            className="mt-3 mb-3"
          >
            Add New Bike
          </Button>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bikes.map((bike) => (
                <tr key={bike.id}>
                  <td>{bike.bikename}</td>
                  <td>{bike.brand}</td>
                  <td>${bike.price}</td>
                  <td>
                    <Button
                      color="warning"
                      onClick={() => handleEdit(bike, "bikes")}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDelete(bike.id, "bikes")}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabPane>

        <TabPane tabId="bikeAccessories">
          <Button
            color="primary"
            onClick={() => handleAdd("bikeAccessories")}
            className="mt-3 mb-3"
          >
            Add New Accessory
          </Button>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bikeAccessories.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>
                    <Button
                      color="warning"
                      onClick={() => handleEdit(item, "bikeAccessories")}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDelete(item.id, "bikeaccessories")}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabPane>

        <TabPane tabId="carAccessories">
          <Button
            color="primary"
            onClick={() => handleAdd("carAccessories")}
            className="mt-3 mb-3"
          >
            Add New Accessory
          </Button>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carAccessories.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>
                    <Button
                      color="warning"
                      onClick={() => handleEdit(item, "carAccessories")}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDelete(item.id, "caraccessories")}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabPane>
      </TabContent>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {formData.id ? "Edit" : "Add"}{" "}
          {formType.replace(/([A-Z])/g, " $1").trim()}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            {renderForm()}
            <Button color="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default SellerDashboard;
