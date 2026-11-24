import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  date: { type: String, required: true },
  duration: { type: String, required: true },
  baseFare: { type: Number, required: true },
  bookedSeats: { type: [String], default: [] },
  totalSeats: { type: Number, default: 30 }
}, { timestamps: true });

export default mongoose.model("Flight", flightSchema);
