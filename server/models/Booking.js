import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
  passengerName: { type: String, required: true },
  email: { type: String, required: true },
  seat: { type: String, required: true },
  totalFare: { type: Number, required: true },
  status: { type: String, enum: ["CONFIRMED"], default: "CONFIRMED" }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
