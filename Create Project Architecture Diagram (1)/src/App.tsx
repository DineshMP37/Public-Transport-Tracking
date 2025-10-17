import React, { useState, useEffect } from 'react';
import { PassengerView } from './components/PassengerView';
import { AdminDashboard } from './components/AdminDashboard';
import { DriverPortal } from './components/DriverPortal';
import { BookingHistory } from './components/BookingHistory';
import { mockBuses, mockRoutes, mockNotifications } from './data/mockData';
import { Bus } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Bus as BusIcon, Shield, User, Ticket } from 'lucide-react';

function App() {
  const [buses, setBuses] = useState(mockBuses);
  const [currentView, setCurrentView] = useState<'passenger' | 'admin' | 'driver' | 'bookings'>('passenger');

  // Simulate real-time GPS updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          if (bus.current_status !== 'Running' && bus.current_status !== 'Delayed') {
            return bus;
          }

          // Simulate movement (small random changes in coordinates)
          const latChange = (Math.random() - 0.5) * 0.002;
          const lngChange = (Math.random() - 0.5) * 0.002;
          const speedChange = Math.floor((Math.random() - 0.5) * 10);

          return {
            ...bus,
            latitude: bus.latitude + latChange,
            longitude: bus.longitude + lngChange,
            speed: Math.max(0, Math.min(60, bus.speed + speedChange)),
            lastUpdated: new Date(),
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <BusIcon className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl tracking-tight">Smart Transport System</h1>
          </div>
          <p className="text-muted-foreground">
            Real-time public transport tracking and management platform
          </p>
        </div>

        {/* Role Selection */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Select View</CardTitle>
            <CardDescription>Choose your role to access the appropriate dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="passenger" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Passenger
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  My Bookings
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </TabsTrigger>
                <TabsTrigger value="driver" className="flex items-center gap-2">
                  <BusIcon className="h-4 w-4" />
                  Driver
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {currentView === 'passenger' && (
            <PassengerView
              buses={buses}
              routes={mockRoutes}
              notifications={mockNotifications}
            />
          )}
          {currentView === 'bookings' && (
            <BookingHistory />
          )}
          {currentView === 'admin' && (
            <AdminDashboard buses={buses} routes={mockRoutes} />
          )}
          {currentView === 'driver' && (
            <DriverPortal currentBus={buses[0]} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Smart Public Transport Tracking System • Real-time GPS tracking • Route optimization
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
