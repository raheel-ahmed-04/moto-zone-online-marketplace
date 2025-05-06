import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";

const ManageBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [newBike, setNewBike] = useState({
    bikeName: "",
    brand: "",
    rating: "",
    price: "",
    speed: "",
    gps: "",
    seatType: "",
    automatic: "",
    model: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingBike, setEditingBike] = useState(null);

  // Fetch bikes from backend when component mounts
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const { data } = await axios.get("http://localhost:2000/api/bikes");
        setBikes(data);
      } catch (error) {
        console.error("Error fetching bikes:", error);
      }
    };
    fetchBikes();
  }, []);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBike((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Reset form
  const resetForm = () => {
    setNewBike({
      bikeName: "",
      brand: "",
      rating: "",
      price: "",
      speed: "",
      gps: "",
      seatType: "",
      automatic: "",
      model: "",
      description: "",
    });
    setImageFile(null);
    setEditingBike(null);
  };

  // Add or update bike
  const handleAddOrUpdateBike = async () => {
    try {
      // Use FormData to include both text fields and the uploaded file
      const formData = new FormData();
      formData.append("bikeName", newBike.bikeName);
      formData.append("brand", newBike.brand);
      formData.append("rating", newBike.rating);
      formData.append("price", newBike.price);
      formData.append("speed", newBike.speed);
      formData.append("gps", newBike.gps);
      formData.append("seatType", newBike.seatType);
      formData.append("automatic", newBike.automatic);
      formData.append("model", newBike.model);
      formData.append("description", newBike.description);

      // Append file if selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingBike) {
        // Update existing bike
        const { data } = await axios.put(
          `http://localhost:2000/api/bikes/${editingBike._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setBikes((prev) =>
          prev.map((bike) => (bike._id === editingBike._id ? data.updatedBike : bike))
        );
      } else {
        // Add a new bike
        const { data } = await axios.post(
          "http://localhost:2000/api/bikes",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setBikes((prev) => [...prev, data.bike]);
      }

      resetForm();
    } catch (error) {
      console.error("Error adding/updating bike:", error);
    }
  };

  // Edit a bike
  const handleEdit = (bike) => {
    setNewBike({
      bikeName: bike.bikeName || "",
      brand: bike.brand || "",
      rating: bike.rating || "",
      price: bike.price || "",
      speed: bike.speed || "",
      gps: bike.gps || "",
      seatType: bike.seatType || "",
      automatic: bike.automatic || "",
      model: bike.model || "",
      description: bike.description || "",
    });
    setImageFile(null);
    setEditingBike(bike);
  };

  // Delete a bike
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2000/api/bikes/${id}`);
      setBikes((prev) => prev.filter((bike) => bike._id !== id));
    } catch (error) {
      console.error("Error deleting bike:", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col lg="6">
          <h2>{editingBike ? "Edit Bike" : "Add a New Bike"}</h2>
          <Form>
            <FormGroup>
              <Label for="bikeName">Bike Name</Label>
              <Input
                type="text"
                name="bikeName"
                value={newBike.bikeName}
                onChange={handleChange}
              />
            </FormGroup>

            {/* File input for image */}
            <FormGroup>
              <Label for="image">Bike Image</Label>
              <Input type="file" name="image" onChange={handleFileChange} />
            </FormGroup>

            <FormGroup>
              <Label for="brand">Brand</Label>
              <Input
                type="text"
                name="brand"
                value={newBike.brand}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="rating">Rating</Label>
              <Input
                type="text"
                name="rating"
                value={newBike.rating}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input
                type="text"
                name="price"
                value={newBike.price}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="speed">Speed</Label>
              <Input
                type="text"
                name="speed"
                value={newBike.speed}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="gps">GPS</Label>
              <Input
                type="text"
                name="gps"
                value={newBike.gps}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="seatType">Seat Type</Label>
              <Input
                type="text"
                name="seatType"
                value={newBike.seatType}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="automatic">Automatic</Label>
              <Input
                type="text"
                name="automatic"
                value={newBike.automatic}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="model">Model</Label>
              <Input
                type="text"
                name="model"
                value={newBike.model}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                value={newBike.description}
                onChange={handleChange}
              />
            </FormGroup>

            <Button
              color="warning"
              style={{ marginRight: "10px" }}
              onClick={handleAddOrUpdateBike}
            >
              {editingBike ? "Update Bike" : "Add Bike"}
            </Button>
            {editingBike && (
              <Button color="warning" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </Form>
        </Col>

        <Col lg="6">
          <h2>Manage Bikes</h2>
          {bikes.map((bike) => (
            <div key={bike._id} style={{ marginBottom: "10px" }}>
              <h5>{bike.bikeName}</h5>

              {/* Display the uploaded image if it exists */}
              {bike.imgUrl && (
                <img
                  src={`${bike.imgUrl}`}
                  alt={bike.bikeName}
                  style={{ width: "100px", height: "60px", objectFit: "cover" }}
                />
              )}
              <div style={{ marginTop: "5px" }}>
                <Button
                  color="warning"
                  style={{ marginRight: "10px" }}
                  onClick={() => handleEdit(bike)}
                >
                  Edit
                </Button>
                <Button
                  color="dark"
                  style={{ color: "white" }}
                  onClick={() => handleDelete(bike._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ManageBikes;
