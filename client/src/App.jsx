import { useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api";
const SEAT_CHARGE = 350;
const today = new Date().toISOString().slice(0, 10);

export default function App() {
  const [from, setFrom] = useState("Chennai");
  const [to, setTo] = useState("Bengaluru");
  const [date, setDate] = useState("2026-12-15");
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const totalFare = useMemo(
    () => selectedFlight ? selectedFlight.baseFare + SEAT_CHARGE : 0,
    [selectedFlight]
  );

  async function searchFlights(event) {
    event?.preventDefault();
    setError(""); setBooking(null); setSelectedFlight(null); setSelectedSeat("");
    if (!from.trim() || !to.trim() || !date) {
      setError("Please enter origin, destination, and travel date."); return;
    }
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      setError("Origin and destination must be different."); return;
    }
    setLoading(true); setSearched(true);
    try {
      const params = new URLSearchParams({ from, to, date });
      const response = await fetch(`${API}/flights?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to search flights.");
      setFlights(data);
    } catch (e) { setError(e.message); setFlights([]); }
    finally { setLoading(false); }
  }

  async function chooseFlight(flight) {
    setError(""); setSelectedSeat(""); setSelectedFlight(flight);
    try {
      const response = await fetch(`${API}/flights/${flight._id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load seats.");
      setSeats(data.seats || []);
    } catch (e) { setError(e.message); }
  }

  async function confirmBooking(event) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightId: selectedFlight._id, passengerName, email, seat: selectedSeat
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Booking failed.");
      setBooking(data);
      setSelectedFlight(null);
      setSelectedSeat("");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { searchFlights(); }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="SkyBook home"><span className="brand-mark">✈</span> SkyBook</a>
        <span className="top-note">Your journey starts here</span>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">TRAVEL MADE SIMPLE</p>
            <h1>Find your next<br /><span>destination.</span></h1>
            <p className="hero-sub">Compare flights, choose your seat, and book your trip in a few simple steps.</p>
          </div>
          <div className="plane-art" aria-hidden="true">✈</div>
        </section>

        <section className="search-card" aria-labelledby="search-title">
          <div className="section-heading">
            <div><p className="eyebrow">BOOK A FLIGHT</p><h2 id="search-title">Where would you like to go?</h2></div>
            <span className="step-pill">01 — Search</span>
          </div>
          <form className="search-form" onSubmit={searchFlights}>
            <label>FROM<input value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g. Chennai" required /></label>
            <label>TO<input value={to} onChange={e => setTo(e.target.value)} placeholder="e.g. Bengaluru" required /></label>
            <label>TRAVEL DATE<input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} required /></label>
            <button className="primary-btn search-btn" disabled={loading}>{loading ? "Please wait…" : "Search flights →"}</button>
          </form>
          <p className="hint">Demo data is available for Chennai → Bengaluru on 15 December 2026.</p>
        </section>

        {error && <div className="alert" role="alert">{error}</div>}

        {searched && <section className="results-section">
          <div className="section-heading results-heading">
            <div><p className="eyebrow">AVAILABLE OPTIONS</p><h2>Choose your flight</h2></div>
            <span className="muted">{flights.length} flight(s) found</span>
          </div>
          {flights.length === 0 ? <div className="empty-state">No flights found for this search. Try the demo route and date above.</div> :
            <div className="flight-list">{flights.map(flight => (
              <article className={`flight-card ${selectedFlight?._id === flight._id ? "chosen" : ""}`} key={flight._id}>
                <div className="airline"><span className="airline-icon">✈</span><div><strong>{flight.airline}</strong><small>{flight.flightNumber}</small></div></div>
                <div className="time-block"><strong>{flight.departureTime}</strong><small>{flight.from}</small></div>
                <div className="duration"><span>{flight.duration}</span><i></i><small>Non-stop</small></div>
                <div className="time-block"><strong>{flight.arrivalTime}</strong><small>{flight.to}</small></div>
                <div className="fare"><strong>₹{flight.baseFare.toLocaleString("en-IN")}</strong><small>per person</small></div>
                <button className="outline-btn" onClick={() => chooseFlight(flight)}>Select</button>
              </article>
            ))}</div>}
        </section>}

        {selectedFlight && <section className="booking-grid">
          <div className="panel">
            <div className="section-heading"><div><p className="eyebrow">STEP 02</p><h2>Select your seat</h2></div><span className="step-pill">Seat map</span></div>
            <div className="seat-legend"><span><i className="seat available"></i> Available</span><span><i className="seat selected"></i> Selected</span><span><i className="seat booked"></i> Booked</span></div>
            <div className="seat-map">
              <div className="seat-label">FRONT OF AIRCRAFT</div>
              <div className="seat-grid">{seats.map((item, index) => (
                <button key={item.seat} type="button" aria-label={`Seat ${item.seat}${item.booked ? ", booked" : ""}`}
                  disabled={item.booked} onClick={() => setSelectedSeat(item.seat)}
                  className={`seat ${item.booked ? "booked" : selectedSeat === item.seat ? "selected" : "available"}`}>
                  {index + 1}
                </button>
              ))}</div>
              <p className="seat-caption">Select one available seat</p>
            </div>
          </div>

          <div className="panel passenger-panel">
            <p className="eyebrow">STEP 03</p><h2>Passenger details</h2>
            <form onSubmit={confirmBooking}>
              <label>FULL NAME<input value={passengerName} onChange={e => setPassengerName(e.target.value)} required minLength="2" placeholder="Enter passenger name" /></label>
              <label>EMAIL ADDRESS<input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com" /></label>
              <div className="fare-breakdown">
                <div><span>Base fare</span><strong>₹{selectedFlight.baseFare.toLocaleString("en-IN")}</strong></div>
                <div><span>Seat selection</span><strong>₹{SEAT_CHARGE.toLocaleString("en-IN")}</strong></div>
                <div className="total"><span>Total</span><strong>₹{totalFare.toLocaleString("en-IN")}</strong></div>
              </div>
              <p className="hint">Selected seat: <strong>{selectedSeat || "Not selected"}</strong></p>
              <button className="primary-btn full-btn" disabled={!selectedSeat || loading}>{loading ? "Confirming…" : "Confirm demo booking"}</button>
            </form>
          </div>
        </section>}

        {booking && <section className="confirmation" aria-live="polite">
          <div className="success-icon">✓</div><p className="eyebrow">BOOKING CONFIRMED</p>
          <h2>Your trip is reserved!</h2><p className="muted">This is a demo confirmation. No payment was collected.</p>
          <div className="reference">BOOKING REFERENCE<strong>{booking.booking.reference}</strong></div>
          <div className="confirmation-details">
            <span>{booking.flight.from} → {booking.flight.to}</span>
            <span>{booking.flight.date}</span>
            <span>Seat {booking.booking.seat}</span>
            <strong>₹{booking.booking.totalFare.toLocaleString("en-IN")}</strong>
          </div>
          <button className="outline-btn" onClick={() => { setBooking(null); setPassengerName(""); setEmail(""); searchFlights(); }}>Book another flight</button>
        </section>}
      </main>
      <footer>© 2026 SkyBook · Portfolio demonstration project · Secure booking flow demo</footer>
    </div>
  );
}
