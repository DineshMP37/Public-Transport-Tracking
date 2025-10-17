import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-79c18b5f/health", (c) => {
  return c.json({ status: "ok" });
});

// Bookings endpoints
app.post("/make-server-79c18b5f/bookings", async (c) => {
  try {
    const booking = await c.req.json();
    
    // Store booking in KV store
    await kv.set(`booking:${booking.booking_id}`, booking);
    
    // Also store in user's bookings list
    const userKey = `user_bookings:${booking.passenger_email}`;
    const existingBookings = await kv.get(userKey) || [];
    existingBookings.push(booking.booking_id);
    await kv.set(userKey, existingBookings);
    
    // Store booked seats for the bus
    const seatsKey = `bus_seats:${booking.bus_id}:${booking.journey_date}`;
    const existingSeats = await kv.get(seatsKey) || [];
    const updatedSeats = [...new Set([...existingSeats, ...booking.seats])];
    await kv.set(seatsKey, updatedSeats);
    
    return c.json({ 
      success: true, 
      booking_id: booking.booking_id,
      message: "Booking confirmed successfully"
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return c.json({ 
      success: false, 
      error: "Failed to create booking",
      details: error.message 
    }, 500);
  }
});

app.get("/make-server-79c18b5f/bookings/:bookingId", async (c) => {
  try {
    const bookingId = c.req.param("bookingId");
    const booking = await kv.get(`booking:${bookingId}`);
    
    if (!booking) {
      return c.json({ success: false, error: "Booking not found" }, 404);
    }
    
    return c.json({ success: true, booking });
  } catch (error) {
    console.error("Booking fetch error:", error);
    return c.json({ 
      success: false, 
      error: "Failed to fetch booking",
      details: error.message 
    }, 500);
  }
});

app.get("/make-server-79c18b5f/user-bookings/:email", async (c) => {
  try {
    const email = c.req.param("email");
    const bookingIds = await kv.get(`user_bookings:${email}`) || [];
    
    const bookings = [];
    for (const bookingId of bookingIds) {
      const booking = await kv.get(`booking:${bookingId}`);
      if (booking) {
        bookings.push(booking);
      }
    }
    
    return c.json({ success: true, bookings });
  } catch (error) {
    console.error("User bookings fetch error:", error);
    return c.json({ 
      success: false, 
      error: "Failed to fetch user bookings",
      details: error.message 
    }, 500);
  }
});

app.get("/make-server-79c18b5f/booked-seats/:busId/:date", async (c) => {
  try {
    const busId = c.req.param("busId");
    const date = c.req.param("date");
    const seats = await kv.get(`bus_seats:${busId}:${date}`) || [];
    
    return c.json({ success: true, seats });
  } catch (error) {
    console.error("Booked seats fetch error:", error);
    return c.json({ 
      success: false, 
      error: "Failed to fetch booked seats",
      details: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);