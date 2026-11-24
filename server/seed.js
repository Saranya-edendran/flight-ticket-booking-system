import "dotenv/config";
import mongoose from "mongoose";
import Flight from "./models/Flight.js";

const flights = [
  { airline: "SkyWays", flightNumber: "SW101", from: "Chennai", to: "Bengaluru", departureTime: "07:15", arrivalTime: "08:20", date: "2026-12-15", duration: "1h 05m", baseFare: 3200 },
  { airline: "AirNova", flightNumber: "AN204", from: "Chennai", to: "Bengaluru", departureTime: "11:40", arrivalTime: "12:45", date: "2026-12-15", duration: "1h 05m", baseFare: 3750 },
  { airline: "SkyWays", flightNumber: "SW310", from: "Chennai", to: "Mumbai", departureTime: "09:00", arrivalTime: "11:05", date: "2026-12-15", duration: "2h 05m", baseFare: 5100 },
  { airline: "AirNova", flightNumber: "AN415", from: "Bengaluru", to: "Chennai", departureTime: "18:10", arrivalTime: "19:15", date: "2026-12-16", duration: "1h 05m", baseFare: 3400 }
];

try {
  await mongoose.connect(process.env.MONGODB_URI);
  await Flight.deleteMany({ flightNumber: { $in: flights.map(f => f.flightNumber) } });
  await Flight.insertMany(flights);
  console.log("Sample flights inserted.");
} catch (error) {
  console.error(error);
} finally {
  await mongoose.disconnect();
}
