import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import { User, Car, Bike, Booking } from "./models.js";

const app = express();
// Use 5173 or any free port
const port = process.env.PORT || 2000;

/* -----------------------------------------------------
   1) FIX __dirname for ES modules (so we can serve static files)
----------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -----------------------------------------------------
   2) SERVE IMAGES FROM "public/uploads"
----------------------------------------------------- */
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

/* -----------------------------------------------------
   3) CONFIGURE MULTER TO HANDLE FILE UPLOADS
      (Storing files in "public/uploads")
----------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("public", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

/* -----------------------------------------------------
   4) MIDDLEWARE
----------------------------------------------------- */
app.use(cors());
app.use(express.json());

/* -----------------------------------------------------
   5) CONNECT TO MONGO
----------------------------------------------------- */
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://raheel:raheel724@cluster0.farsr.mongodb.net/motozone"
    );
    console.log(`DB connected successfully. Running on port: ${port}`);
  } catch (error) {
    console.error("DB connection error:", error);
  }
};
connectDB();

/* =====================================================
   ============== USER ROUTES (Register/Login) ==========
   ===================================================== */

/** REGISTER */
app.post("/register", async (req, res) => {
  const { cnic, name, email, address, phoneNumber, fatherName, password } =
    req.body;
  try {
    const newUser = new User({
      cnic,
      name,
      email,
      address,
      phoneNumber,
      fatherName,
      // password automatically hashed by userSchema.pre('save')
      password,
    });
    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error saving user", error });
  }
});

/** LOGIN */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if role is "admin"
    const isAdmin = user.role === "admin";

    return res.status(200).json({
      message: "User login successful",
      userName: user.name,
      isAdmin: isAdmin,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
});

/**GET user by name**/
app.get("/api/users/name/:name", async (req, res) => {
  try {
    const userName = req.params.name;
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ============== CAR ROUTES (with image upload) ========
   ===================================================== */

/**
 * GET: Fetch all cars
 */
app.get("/api/cars", async (req, res) => {
  try {
    const cars = await Car.find();
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching cars", error });
  }
});

/**
 * POST: Add a new car (with optional image)
 * - Use `upload.single("image")` to handle file upload from field name "image"
 */
app.post("/api/cars", upload.single("image"), async (req, res) => {
  try {
    // Grab other fields from req.body
    const {
      carName,
      price,
      rating,
      description,
      model,
      automatic,
      speed,
      gps,
      seatType,
      brand,
    } = req.body;

    // If an image was uploaded, store its relative path in imgUrl
    let imgUrl = "";
    if (req.file) {
      imgUrl = "/uploads/" + req.file.filename;
    }

    // Create Car instance
    const newCar = new Car({
      carName,
      imgUrl,
      price,
      rating,
      description,
      model,
      automatic,
      speed,
      gps,
      seatType,
      brand,
    });

    await newCar.save();
    return res
      .status(201)
      .json({ message: "Car added successfully", car: newCar });
  } catch (error) {
    return res.status(500).json({ message: "Error adding car", error });
  }
});

/**
 * PUT: Update existing car (with optional new image)
 */
app.put("/api/cars/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      carName,
      price,
      rating,
      description,
      model,
      automatic,
      speed,
      gps,
      seatType,
      brand,
    } = req.body;

    // If user uploaded a new file, set a new imgUrl
    let updatedFields = {
      carName,
      price,
      rating,
      description,
      model,
      automatic,
      speed,
      gps,
      seatType,
      brand,
    };

    if (req.file) {
      updatedFields.imgUrl = "/uploads/" + req.file.filename;
    }

    const updatedCar = await Car.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res
      .status(200)
      .json({ message: "Car updated successfully", updatedCar });
  } catch (error) {
    return res.status(500).json({ message: "Error updating car", error });
  }
});

/**
 * DELETE: Remove a car by ID
 */
app.delete("/api/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    return res
      .status(200)
      .json({ message: "Car deleted successfully", deletedCar });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting car", error });
  }
});

// GET a single car by slug
app.get("/api/cars/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const car = await Car.findOne({ carName: slug });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ============== BIKE ROUTES (with image upload) =======
   ===================================================== */

/**
 * GET: Fetch all bikes
 */
app.get("/api/bikes", async (req, res) => {
  try {
    const bikes = await Bike.find();
    return res.status(200).json(bikes);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching bikes", error });
  }
});

/**
 * POST: Add a new bike (with optional image)
 */
app.post("/api/bikes", upload.single("image"), async (req, res) => {
  try {
    // Grab other fields from req.body
    const {
      bikeName,
      brand,
      rating,
      price,
      speed,
      gps,
      seatType,
      automatic,
      model,
      description,
    } = req.body;

    let imgUrl = "";
    if (req.file) {
      imgUrl = "/uploads/" + req.file.filename;
    }

    // Create Bike instance
    const newBike = new Bike({
      bikeName,
      brand,
      rating,
      price,
      speed,
      gps,
      seatType,
      automatic,
      model,
      description,
      imgUrl,
    });

    await newBike.save();
    return res
      .status(201)
      .json({ message: "Bike added successfully", bike: newBike });
  } catch (error) {
    return res.status(500).json({ message: "Error adding bike", error });
  }
});

/**
 * PUT: Update existing bike (with optional new image)
 */
app.put("/api/bikes/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      bikeName,
      brand,
      rating,
      price,
      speed,
      gps,
      seatType,
      automatic,
      model,
      description,
    } = req.body;

    let updatedFields = {
      bikeName,
      brand,
      rating,
      price,
      speed,
      gps,
      seatType,
      automatic,
      model,
      description,
    };

    // If user uploaded a new file, set a new imgUrl
    if (req.file) {
      updatedFields.imgUrl = "/uploads/" + req.file.filename;
    }

    const updatedBike = await Bike.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedBike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    return res
      .status(200)
      .json({ message: "Bike updated successfully", updatedBike });
  } catch (error) {
    return res.status(500).json({ message: "Error updating bike", error });
  }
});

/**
 * DELETE: Remove a bike by ID
 */
app.delete("/api/bikes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBike = await Bike.findByIdAndDelete(id);
    if (!deletedBike) {
      return res.status(404).json({ message: "Bike not found" });
    }
    return res
      .status(200)
      .json({ message: "Bike deleted successfully", deletedBike });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting bike", error });
  }
});

// GET a single bike by slug
app.get("/api/bikes/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    // If you store the bikeName in the DB, do something like:
    const bike = await Bike.findOne({ bikeName: slug });
    // OR .toLowerCase() if you do a case-insensitive match
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }
    res.json(bike);
  } catch (error) {
    console.error("Error fetching bike:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ============== BOOKING ROUTES =========================
   ===================================================== */

/*** POST: Create a new booking ***/
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      userId,
      vehicleRef, // _id of the car or bike
      vehicleRefModel, // "Car" or "Bike"
      firstName,
      lastName,
      email,
      phone,
      toAddress,
      notes,
      paymentMethod,
    } = req.body;

    const newBooking = new Booking({
      user: userId,
      vehicleRef, // e.g. "63f9db5...someCarOrBikeId"
      vehicleRefModel, // "Car" or "Bike"
      firstName,
      lastName,
      email,
      phone,
      toAddress,
      notes,
      paymentMethod,
    });

    await newBooking.save();

    return res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Error creating booking", error });
  }
});

/***  GET all bookings for a particular user name */
app.get("/api/bookings/user/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by their name
    const user = await User.findOne({ name: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Populate vehicleRef (Car or Bike)
    const userBookings = await Booking.find({ user: user._id }).populate({
      path: "vehicleRef",
      select: "carName bikeName model price", // Only fetch necessary fields
    });

    return res.status(200).json(userBookings);
  } catch (error) {
    console.error("Error fetching user's bookings:", error);
    return res.status(500).json({ message: "Error fetching bookings", error });
  }
});

/* =====================================================
   ============== DEFAULT ROUTE =========================
   ===================================================== */
app.get("/", (req, res) => {
  res.send("Hello World from the backend with image uploads!");
});

/* =====================================================
   ============== START THE SERVER ======================
   ===================================================== */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
