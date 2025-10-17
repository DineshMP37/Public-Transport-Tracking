export interface Bus {
  bus_id: string;
  route_number: string;
  driver_id: string;
  driver_name: string;
  current_status: 'Running' | 'Delayed' | 'Maintenance' | 'Stopped';
  capacity: number;
  current_occupancy: number;
  latitude: number;
  longitude: number;
  speed: number;
  lastUpdated: Date;
}

export interface Route {
  route_id: string;
  route_name: string;
  route_number: string;
  start_point: string;
  end_point: string;
  stops: Stop[];
  color: string;
}

export interface Stop {
  stop_id: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  role: 'admin' | 'driver' | 'passenger';
}

export interface LocationUpdate {
  bus_id: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed: number;
}

export interface Notification {
  id: string;
  type: 'delay' | 'breakdown' | 'route-change' | 'info';
  message: string;
  bus_id: string;
  timestamp: Date;
}

export interface Seat {
  seat_number: string;
  status: 'available' | 'booked' | 'selected';
  type: 'window' | 'aisle' | 'middle';
}

export interface Booking {
  booking_id: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  bus_id: string;
  route_number: string;
  from_stop: string;
  to_stop: string;
  seats: string[];
  total_amount: number;
  booking_date: Date;
  journey_date: Date;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_method?: string;
  transaction_id?: string;
}

export interface PaymentDetails {
  amount: number;
  upi_id?: string;
  provider: 'gpay' | 'phonepe' | 'paytm' | 'other';
  transaction_id?: string;
}
