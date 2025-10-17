import React, { useState } from 'react';
import { Bus, Route, Booking, PaymentDetails } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SeatSelection } from './SeatSelection';
import { UpiPayment } from './UpiPayment';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Ticket, CalendarIcon, MapPin, IndianRupee, User, Mail, Phone, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface TicketBookingProps {
  bus: Bus;
  route: Route;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketBooking: React.FC<TicketBookingProps> = ({ bus, route, isOpen, onClose }) => {
  const [step, setStep] = useState<'details' | 'seats' | 'payment' | 'confirmation'>('details');
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [fromStop, setFromStop] = useState('');
  const [toStop, setToStop] = useState('');
  const [journeyDate, setJourneyDate] = useState<Date>(new Date());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const TICKET_PRICE = 25; // Price per seat
  const totalAmount = selectedSeats.length * TICKET_PRICE;

  // Mock booked seats (in production, fetch from backend)
  const bookedSeats = ['2A', '3B', '5C', '7D', '8A'];

  const handleDetailsSubmit = () => {
    if (passengerName && passengerEmail && passengerPhone && fromStop && toStop) {
      setStep('seats');
    }
  };

  const handleSeatsConfirm = () => {
    if (selectedSeats.length > 0) {
      setStep('payment');
      setShowPayment(true);
    }
  };

  const handlePaymentComplete = async (paymentDetails: PaymentDetails) => {
    const booking: Booking = {
      booking_id: `BKG${Date.now()}`,
      passenger_name: passengerName,
      passenger_email: passengerEmail,
      passenger_phone: passengerPhone,
      bus_id: bus.bus_id,
      route_number: bus.route_number,
      from_stop: fromStop,
      to_stop: toStop,
      seats: selectedSeats,
      total_amount: totalAmount,
      booking_date: new Date(),
      journey_date: journeyDate,
      payment_status: 'completed',
      payment_method: paymentDetails.provider,
      transaction_id: paymentDetails.transaction_id,
    };

    try {
      // Save booking to backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-79c18b5f/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(booking),
        }
      );

      if (response.ok) {
        setBookingId(booking.booking_id);
        setShowPayment(false);
        setBookingConfirmed(true);
        setStep('confirmation');
      }
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const handleClose = () => {
    setStep('details');
    setPassengerName('');
    setPassengerEmail('');
    setPassengerPhone('');
    setFromStop('');
    setToStop('');
    setSelectedSeats([]);
    setBookingConfirmed(false);
    setBookingId('');
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {['details', 'seats', 'payment', 'confirmation'].map((s, idx) => (
        <React.Fragment key={s}>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
              step === s
                ? 'bg-primary text-primary-foreground'
                : idx < ['details', 'seats', 'payment', 'confirmation'].indexOf(step)
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {idx + 1}
          </div>
          {idx < 3 && <div className="w-8 h-0.5 bg-gray-200"></div>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Book Your Ticket
            </DialogTitle>
            <DialogDescription>
              Bus {bus.route_number} - {route.route_name}
            </DialogDescription>
          </DialogHeader>

          {!bookingConfirmed && renderStepIndicator()}

          {/* Step 1: Passenger Details */}
          {step === 'details' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Passenger Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className="pl-9"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-9"
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="pl-9"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Journey Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From Stop *</Label>
                    <Select value={fromStop} onValueChange={setFromStop}>
                      <SelectTrigger id="from">
                        <SelectValue placeholder="Select boarding point" />
                      </SelectTrigger>
                      <SelectContent>
                        {route.stops.map((stop) => (
                          <SelectItem key={stop.stop_id} value={stop.name}>
                            {stop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">To Stop *</Label>
                    <Select value={toStop} onValueChange={setToStop}>
                      <SelectTrigger id="to">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {route.stops
                          .filter((stop) => stop.name !== fromStop)
                          .map((stop) => (
                            <SelectItem key={stop.stop_id} value={stop.name}>
                              {stop.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Journey Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(journeyDate, 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={journeyDate}
                          onSelect={(date) => date && setJourneyDate(date)}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" onClick={handleDetailsSubmit}>
                Continue to Seat Selection
              </Button>
            </div>
          )}

          {/* Step 2: Seat Selection */}
          {step === 'seats' && (
            <div className="space-y-4">
              <SeatSelection
                totalSeats={bus.capacity}
                bookedSeats={bookedSeats}
                onSeatsSelect={setSelectedSeats}
                maxSeats={5}
              />

              {selectedSeats.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl">₹{totalAmount}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedSeats.length} seat(s) × ₹{TICKET_PRICE}
                        </p>
                      </div>
                      <Button onClick={handleSeatsConfirm}>
                        Proceed to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button variant="outline" className="w-full" onClick={() => setStep('details')}>
                Back to Details
              </Button>
            </div>
          )}

          {/* Step 3: Payment (handled by UpiPayment modal) */}
          {step === 'payment' && !showPayment && (
            <div className="text-center py-8">
              <p>Processing payment...</p>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirmation' && bookingConfirmed && (
            <div className="space-y-6">
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl">Booking Confirmed!</h3>
                  <p className="text-muted-foreground mt-2">
                    Your ticket has been booked successfully
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Booking ID</p>
                      <p className="font-mono">{bookingId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bus</p>
                      <p>{bus.route_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <p>{fromStop}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">To</p>
                      <p>{toStop}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{format(journeyDate, 'PPP')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Seats</p>
                      <div className="flex gap-1 flex-wrap">
                        {selectedSeats.map((seat) => (
                          <Badge key={seat}>{seat}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <p>Total Paid</p>
                    <p className="text-xl">₹{totalAmount}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="text-sm text-muted-foreground text-center bg-blue-50 p-4 rounded-lg">
                <p>A confirmation email has been sent to <strong>{passengerEmail}</strong></p>
                <p className="mt-1">Please show this booking ID at the time of boarding.</p>
              </div>

              <Button className="w-full" onClick={handleClose}>
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* UPI Payment Modal */}
      <UpiPayment
        amount={totalAmount}
        onPaymentComplete={handlePaymentComplete}
        onCancel={() => {
          setShowPayment(false);
          setStep('seats');
        }}
        isOpen={showPayment}
      />
    </>
  );
};
