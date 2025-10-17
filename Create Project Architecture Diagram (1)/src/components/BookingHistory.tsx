import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Ticket, Search, Download, Mail } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleSearch = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-79c18b5f/user-bookings/${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            My Bookings
          </CardTitle>
          <CardDescription>View and manage your ticket bookings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email to view bookings"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Button onClick={handleSearch} disabled={loading || !email}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {bookings.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Found {bookings.length} booking(s)
              </p>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Bus</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Journey Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.booking_id}>
                        <TableCell className="font-mono text-sm">
                          {booking.booking_id}
                        </TableCell>
                        <TableCell>{booking.route_number}</TableCell>
                        <TableCell className="text-sm">
                          {booking.from_stop} → {booking.to_stop}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {booking.seats.map((seat) => (
                              <Badge key={seat} variant="outline" className="text-xs">
                                {seat}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(booking.journey_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>₹{booking.total_amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.payment_status === 'completed'
                                ? 'default'
                                : booking.payment_status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {booking.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedBooking(booking)}
                              >
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Booking Details</DialogTitle>
                                <DialogDescription>
                                  Booking ID: {booking.booking_id}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedBooking && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Passenger Name</p>
                                      <p>{selectedBooking.passenger_name}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Email</p>
                                      <p className="text-sm">{selectedBooking.passenger_email}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Phone</p>
                                      <p>{selectedBooking.passenger_phone}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Bus</p>
                                      <p>{selectedBooking.route_number}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">From</p>
                                      <p>{selectedBooking.from_stop}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">To</p>
                                      <p>{selectedBooking.to_stop}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Journey Date</p>
                                      <p>{new Date(selectedBooking.journey_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Booking Date</p>
                                      <p>{new Date(selectedBooking.booking_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Seats</p>
                                      <div className="flex gap-1 flex-wrap">
                                        {selectedBooking.seats.map((seat) => (
                                          <Badge key={seat} variant="outline">
                                            {seat}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Total Amount</p>
                                      <p className="text-lg">₹{selectedBooking.total_amount}</p>
                                    </div>
                                  </div>
                                  {selectedBooking.transaction_id && (
                                    <div className="pt-4 border-t">
                                      <p className="text-sm text-muted-foreground">Transaction ID</p>
                                      <p className="font-mono text-sm">{selectedBooking.transaction_id}</p>
                                    </div>
                                  )}
                                  <Button className="w-full" variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Ticket
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : email && !loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Ticket className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No bookings found for this email</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
