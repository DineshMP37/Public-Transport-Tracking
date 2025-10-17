# 🎫 Ticket Booking System Guide

## Features Implemented

### 1. **Seat Selection** 🪑
- Visual seat layout with 2-2 configuration (4 seats per row)
- Real-time seat availability status:
  - ✅ **Available** (Green) - Ready to book
  - 🔵 **Selected** (Blue) - Currently selected by you
  - ❌ **Booked** (Gray) - Already taken
- Select up to 5 seats per booking
- Window and aisle seat indicators
- Clear selection option

### 2. **UPI Payment Integration** 💳
Supports multiple UPI providers:
- **Google Pay** (GPay)
- **PhonePe**
- **Paytm**
- **Other UPI** (custom UPI ID)

Payment flow:
1. Select your preferred UPI provider
2. Enter UPI ID (for "Other UPI" option)
3. Confirm payment amount
4. Simulated payment processing (2 seconds)
5. Transaction ID generation

### 3. **Complete Booking Flow** 📝

#### Step 1: Passenger Details
- Full Name *
- Email Address *
- Phone Number *

#### Step 2: Journey Details
- Boarding Point (From Stop)
- Destination (To Stop)
- Journey Date (calendar picker)

#### Step 3: Seat Selection
- Interactive seat layout
- Real-time seat availability
- Multiple seat selection
- Price calculation (₹25 per seat)

#### Step 4: Payment
- UPI payment interface
- Secure transaction processing
- Transaction ID tracking

#### Step 5: Confirmation
- Booking confirmation screen
- Booking ID generation
- Email confirmation notification
- Downloadable ticket option

### 4. **Booking History** 📋
- Search bookings by email
- View all past and upcoming bookings
- Detailed booking information:
  - Booking ID
  - Bus and route details
  - Seat numbers
  - Journey date
  - Payment status
  - Transaction ID
- Download ticket option

## Backend Integration

### API Endpoints

#### 1. Create Booking
```
POST /make-server-79c18b5f/bookings
```
Stores booking in Supabase KV store with:
- Booking details
- Payment information
- Seat assignments

#### 2. Get Booking by ID
```
GET /make-server-79c18b5f/bookings/:bookingId
```

#### 3. Get User Bookings
```
GET /make-server-79c18b5f/user-bookings/:email
```

#### 4. Get Booked Seats
```
GET /make-server-79c18b5f/booked-seats/:busId/:date
```

### Data Storage

The system uses Supabase KV store with these key patterns:
- `booking:{booking_id}` - Individual booking data
- `user_bookings:{email}` - List of booking IDs per user
- `bus_seats:{bus_id}:{date}` - Booked seats per bus per day

## How to Use

### For Passengers:

1. **Track a Bus**
   - Go to Passenger view
   - Select a bus from the map or list
   - View real-time location and ETA

2. **Book a Ticket**
   - Click "Book Ticket" button on selected bus
   - Fill in passenger details
   - Choose boarding and destination stops
   - Select journey date
   - Choose your seats
   - Complete payment via UPI
   - Receive booking confirmation

3. **View Bookings**
   - Switch to "My Bookings" tab
   - Enter your email address
   - View all your bookings
   - Download tickets

### For Admins:

- Monitor all bookings in real-time
- Track revenue and occupancy
- Manage routes and schedules

## Pricing

- **Base Fare**: ₹25 per seat
- **Payment Methods**: UPI only (expandable)
- **Booking Fee**: None currently

## Security & Privacy

- Email-based booking retrieval
- Secure transaction IDs
- No payment credentials stored
- Backend validation for all bookings

## Future Enhancements

Potential additions:
- 🔐 User authentication with login/signup
- 📱 SMS notifications
- 🎟️ QR code ticket generation
- 💰 Dynamic pricing based on demand
- 🔄 Booking cancellation and refunds
- 📊 Passenger analytics
- 🎁 Loyalty rewards program
- 💳 Multiple payment methods (cards, wallets)

## Notes

- The current implementation uses simulated payment processing
- Seat availability is managed per bus per date
- All bookings are stored persistently in Supabase
- Email confirmations are noted but not actually sent (requires email service integration)
