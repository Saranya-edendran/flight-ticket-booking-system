import { Router } from "express";
import Flight from "../models/Flight.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { from, to, date } = req.query;
    const filter = {};
    if (from) filter.from = new RegExp(`^${from.trim()}$`, "i");
    if (to) filter.to = new RegExp(`^${to.trim()}$`, "i");
    if (date) filter.date = date;

    const flights = await Flight.find(filter).sort({ departureTime: 1 });
    res.json(flights.map(f => ({
      ...f.toObject(),
      availableSeats: f.totalSeats - f.bookedSeats.length
    })));
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    const allSeats = Array.from({ length: flight.totalSeats }, (_, i) => `A${i + 1}`);
    res.json({
      ...flight.toObject(),
      availableSeats: flight.totalSeats - flight.bookedSeats.length,
      seats: allSeats.map(seat => ({ seat, booked: flight.bookedSeats.includes(seat) }))
    });
  } catch (error) { next(error); }
});

export default router;
