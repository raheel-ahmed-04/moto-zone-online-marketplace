import React, { useState } from "react";
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from "reactstrap";
import carData from "../assets/data/carData";

const ManageCars = () => {
  const [cars, setCars] = useState(carData);
  const [newCar, setNewCar] = useState({
    id: '',
    carName: '',
    imgUrl: '',
    price: '',
    rating: '',
    description: '',
    model: '',
    automatic: '',
    speed: '',
    gps: '',
    seatType: '',
    brand: ''
  });
  const [editingCar, setEditingCar] = useState(null);

  const handleDelete = (id) => {
    const updatedCars = cars.filter(car => car.id !== id);
    setCars(updatedCars);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCar({ ...newCar, [name]: value });
  };

  const handleAdd = () => {
    if (editingCar) {
      const updatedCars = cars.map(car =>
        car.id === editingCar.id ? { ...newCar, id: editingCar.id } : car
      );
      setCars(updatedCars);
      setEditingCar(null);
    } else {
      setCars([...cars, { ...newCar, id: cars.length + 1 }]);
    }
    resetForm();
  };

  const handleEdit = (car) => {
    setNewCar(car);
    setEditingCar(car);
  };

  const resetForm = () => {
    setNewCar({
      id: '',
      carName: '',
      imgUrl: '',
      price: '',
      rating: '',
      description: '',
      model: '',
      automatic: '',
      speed: '',
      gps: '',
      seatType: '',
      brand: ''
    });
    setEditingCar(null);
  };

  return (
    <Container>
      <Row>
        <Col lg="6">
          <h2>{editingCar ? 'Edit Car' : 'Add a New Car'}</h2>
          <Form>
            <FormGroup>
              <Label for="carName">Car Name</Label>
              <Input type="text" name="carName" value={newCar.carName} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="imgUrl">Image URL</Label>
              <Input type="text" name="imgUrl" value={newCar.imgUrl} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input type="text" name="price" value={newCar.price} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="rating">Rating</Label>
              <Input type="text" name="rating" value={newCar.rating} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="text" name="description" value={newCar.description} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="model">Model</Label>
              <Input type="text" name="model" value={newCar.model} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="automatic">Automatic</Label>
              <Input type="text" name="automatic" value={newCar.automatic} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="speed">Speed</Label>
              <Input type="text" name="speed" value={newCar.speed} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="gps">GPS</Label>
              <Input type="text" name="gps" value={newCar.gps} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="seatType">Seat Type</Label>
              <Input type="text" name="seatType" value={newCar.seatType} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="brand">Brand</Label>
              <Input type="text" name="brand" value={newCar.brand} onChange={handleChange} />
            </FormGroup>
            <Button onClick={handleAdd} style={{ backgroundColor: "#ffc107", marginRight: "10px" }}>
              {editingCar ? 'Update Car' : 'Add Car'}
            </Button>
            {editingCar && (
              <Button onClick={resetForm} style={{ backgroundColor: "#ffc107" }}>
                Cancel
              </Button>
            )}
          </Form>
        </Col>
        <Col lg="6">
          <h2>Manage Cars</h2>
          {cars.map((car) => (
            <div key={car.id} style={{ marginBottom: "10px" }}>
              <h5>{car.carName}</h5>
              <Button onClick={() => handleEdit(car)} style={{ backgroundColor: "#ffc107", marginRight: "10px" }}>
                Edit
              </Button>
              <Button onClick={() => handleDelete(car.id)} style={{ backgroundColor: "black", color: "white" }}>
                Delete
              </Button>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ManageCars;
