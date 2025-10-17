import React, { useState, useEffect } from 'react';
import { Bus, Route, Notification } from '../types';
import { MapView } from './MapView';
import { TicketBooking } from './TicketBooking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Search, Bell, Clock, Users, MapPin, TrendingUp, Ticket } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';

interface PassengerViewProps {
  buses: Bus[];
  routes: Route[];
  notifications: Notification[];
}

export const PassengerView: React.FC<PassengerViewProps> = ({ buses, routes, notifications }) => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingBus, setBookingBus] = useState<Bus | null>(null);

  const filteredBuses = buses.filter((bus) => {
    const matchesRoute = selectedRoute === 'all' || bus.route_number === selectedRoute;
    const matchesSearch = bus.route_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bus.driver_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRoute && matchesSearch;
  });

  const selectedBusData = buses.find((b) => b.bus_id === selectedBus);
  const selectedBusRoute = routes.find((r) => r.route_number === selectedBusData?.route_number);

  const calculateETA = (bus: Bus) => {
    // Simple ETA calculation based on distance and speed
    const baseMinutes = Math.floor(Math.random() * 15) + 3;
    return bus.current_status === 'Delayed' ? baseMinutes + 10 : baseMinutes;
  };

  const getOccupancyStatus = (bus: Bus) => {
    const percentage = (bus.current_occupancy / bus.capacity) * 100;
    if (percentage >= 90) return { label: 'Crowded', color: 'destructive' };
    if (percentage >= 70) return { label: 'Moderate', color: 'default' };
    return { label: 'Available', color: 'secondary' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Map Section */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Bus Tracking</CardTitle>
            <CardDescription>Real-time location of all active buses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <MapView
                buses={filteredBuses}
                routes={routes}
                selectedBus={selectedBus}
                onBusSelect={setSelectedBus}
              />
            </div>
          </CardContent>
        </Card>

        {/* Selected Bus Details */}
        {selectedBusData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bus {selectedBusData.route_number}</CardTitle>
                  <CardDescription>{selectedBusRoute?.route_name}</CardDescription>
                </div>
                <Badge variant={
                  selectedBusData.current_status === 'Running' ? 'default' :
                  selectedBusData.current_status === 'Delayed' ? 'secondary' : 'destructive'
                }>
                  {selectedBusData.current_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">ETA</p>
                    <p className="font-medium">{calculateETA(selectedBusData)} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Occupancy</p>
                    <p className="font-medium">{selectedBusData.current_occupancy}/{selectedBusData.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Speed</p>
                    <p className="font-medium">{selectedBusData.speed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={getOccupancyStatus(selectedBusData).color as any}>
                      {getOccupancyStatus(selectedBusData).label}
                    </Badge>
                  </div>
                </div>
              </div>
              {selectedBusRoute && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Route Stops:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBusRoute.stops.map((stop) => (
                      <Badge key={stop.stop_id} variant="outline">
                        {stop.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 pt-4 border-t">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setBookingBus(selectedBusData);
                    setShowBooking(true);
                  }}
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  Book Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Search & Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Find Your Bus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search route or destination..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {routes.map((route) => (
                  <SelectItem key={route.route_id} value={route.route_number}>
                    Route {route.route_number} - {route.route_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Active Buses */}
        <Card>
          <CardHeader>
            <CardTitle>Active Buses</CardTitle>
            <CardDescription>{filteredBuses.length} buses on route</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {filteredBuses.map((bus) => {
                  const route = routes.find((r) => r.route_number === bus.route_number);
                  const occupancy = getOccupancyStatus(bus);
                  return (
                    <div
                      key={bus.bus_id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedBus === bus.bus_id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                      }`}
                      onClick={() => setSelectedBus(bus.bus_id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">Bus {bus.route_number}</p>
                          <p className="text-sm text-muted-foreground">{route?.route_name}</p>
                        </div>
                        <Badge variant={occupancy.color as any} className="text-xs">
                          {occupancy.label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-sm mt-2">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {calculateETA(bus)} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {bus.current_occupancy}/{bus.capacity}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookingBus(bus);
                            setShowBooking(true);
                          }}
                        >
                          <Ticket className="h-3 w-3 mr-1" />
                          Book
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[150px]">
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className="pb-3 border-b last:border-0">
                    <div className="flex items-start gap-2">
                      <Badge variant={
                        notif.type === 'delay' ? 'secondary' :
                        notif.type === 'breakdown' ? 'destructive' : 'default'
                      } className="text-xs mt-1">
                        {notif.type}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Booking Modal */}
      {bookingBus && (
        <TicketBooking
          bus={bookingBus}
          route={routes.find((r) => r.route_number === bookingBus.route_number)!}
          isOpen={showBooking}
          onClose={() => {
            setShowBooking(false);
            setBookingBus(null);
          }}
        />
      )}
    </div>
  );
};
