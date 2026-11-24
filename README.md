# Flight Ticket Booking Web Application

A full-stack demo built with React, Node.js, Express, and MongoDB.

## Features
- Search seeded flights by origin, destination, and travel date
- View flight details and base fares
- Select available seats
- Calculate fare dynamically (base fare + seat charge)
- Create a booking and receive a booking reference
- Prevent the same seat from being booked twice (atomic MongoDB update)
- Responsive interface

> This is a portfolio/demo project. It does not connect to airline systems or process real payments.

## Requirements
- Node.js 18+
- npm
- MongoDB local installation OR a MongoDB Atlas connection string

## 1. Configure the backend

Open a terminal in `server/`:

```bash
npm install
```

Copy `.env.example` to `.env` and set `MONGODB_URI`.

Example local MongoDB:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/flight_booking
PORT=5000
CLIENT_URL=http://localhost:5173
```

Seed sample flights:
```bash
npm run seed
```

Start the API:
```bash
npm run dev
```

API runs at `http://localhost:5000`.

## 2. Start the frontend

Open a second terminal in `client/`:

```bash
npm install
npm run dev
```

Open the URL shown by Vite, usually `http://localhost:5173`.

## 3. Test the application
Use the seeded route/date values shown in the app. Search flights, choose a flight, select a seat, enter passenger details, and confirm the demo booking.

## API endpoints
- `GET /api/health` - API health check
- `GET /api/flights?from=Chennai&to=Bengaluru&date=2026-12-15` - search flights
- `GET /api/flights/:id` - flight details and seat availability
- `POST /api/bookings` - create a booking
- `GET /api/bookings/:reference` - retrieve a booking

## Suggested GitHub description
Full-stack flight booking demo featuring React, Express REST APIs, MongoDB, flight search, seat availability, dynamic fare calculation, and booking confirmation.
