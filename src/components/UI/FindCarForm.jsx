import React from "react";
import "../../styles/find-car-form.css";
import { Form, FormGroup } from "reactstrap";

const FindCarForm = () => {
  return (
    <Form className="form">
      <div className="d-flex align-items-center justify-content-between flex-wrap">

        <FormGroup className="form__group">
          <input type="text" placeholder="Search by Make or Model" required />
        </FormGroup>

        <FormGroup className="select__group">
          <select required>
            <option value="">Select Category</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="accessory">Accessory</option>
          </select>
        </FormGroup>

        <FormGroup className="form__group">
          <input type="text" placeholder="Min Price" />
        </FormGroup>

        <FormGroup className="form__group">
          <input type="text" placeholder="Max Price" />
        </FormGroup>

        <FormGroup className="form__group">
          <input type="text" placeholder="City or Location" />
        </FormGroup>

        <FormGroup className="form__group">
          <button className="btn find__car-btn">Search</button>
        </FormGroup>
      </div>
    </Form>
  );
};

export default FindCarForm;
