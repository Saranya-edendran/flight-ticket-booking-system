import { Router } from "express";
import { randomBytes } from "node:crypto";
import Flight from "../models/Flight.js";
import Booking from "../models/Booking.js";

const router = Router();
const SEAT_CHARGE = 350;

router.post("/", async (req, res, next) => {
  try {
    const { flightId, passengerName, email, seat } = req.body;
    if (!flightId || !passengerName?.trim() || !email?.trim() || !seat) {
      return res.status(400).json({ message: "Flight, passenger name, email, and seat are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    // Atomic condition prevents two requests from booking the same seat.
    const flight = await Flight.findOneAndUpdate(
      { _id: flightId, bookedSeats: { $ne: seat } },
      { $addToSet: { bookedSeats: seat } },
      { new: true }
    );
    if (!flight) {
      const exists = await Flight.exists({ _id: flightId });
      return res.status(exists ? 409 : 404).json({
        message: exists ? "That seat has just been booked. Please choose another." : "Flight not found."
      });
    }

    const reference = `FL${randomBytes(4).toString("hex").toUpperCase()}`;
    const booking = await Booking.create({
      reference, flight: flight._id, passengerName: passengerName.trim(),
      email: email.trim().toLowerCase(), seat, totalFare: flight.baseFare + SEAT_CHARGE
    });

    res.status(201).json({
      message: "Booking confirmed",
      booking: {
        reference: booking.reference, passengerName: booking.passengerName,
        email: booking.email, seat: booking.seat, totalFare: booking.totalFare,
        status: booking.status
      },
      flight: {
        airline: flight.airline, flightNumber: flight.flightNumber,
        from: flight.from, to: flight.to, date: flight.date,
        departureTime: flight.departureTime, arrivalTime: flight.arrivalTime
      }
    });
  } catch (error) { next(error); }
});

router.get("/:reference", async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ reference: req.params.reference.toUpperCase() }).populate("flight");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) { next(error); }
});

export default router;
