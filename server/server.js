import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import flightRoutes from "./routes/flights.js";
import bookingRoutes from "./routes/bookings.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "Flight Booking API" }));
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error. Please try again." });
});

const PORT = process.env.PORT || 5000;
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
}
