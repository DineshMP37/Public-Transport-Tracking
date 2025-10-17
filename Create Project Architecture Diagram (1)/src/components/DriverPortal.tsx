import React, { useState } from 'react';
import { Bus } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { MapPin, Navigation, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Progress } from './ui/progress';

interface DriverPortalProps {
  currentBus: Bus | null;
}

export const DriverPortal: React.FC<DriverPortalProps> = ({ currentBus }) => {
  const [status, setStatus] = useState(currentBus?.current_status || 'Running');
  const [gpsEnabled, setGpsEnabled] = useState(true);

  if (!currentBus) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Bus Assigned</CardTitle>
            <CardDescription>Please contact admin to assign a bus to your account</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const occupancyPercentage = (currentBus.current_occupancy / currentBus.capacity) * 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bus {currentBus.route_number}</CardTitle>
              <CardDescription>Vehicle ID: {currentBus.bus_id.toUpperCase()}</CardDescription>
            </div>
            <Badge variant={
              status === 'Running' ? 'default' :
              status === 'Delayed' ? 'secondary' : 'destructive'
            } className="text-lg px-4 py-2">
              {status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* GPS Status */}
      {gpsEnabled ? (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>GPS Tracking Active</AlertTitle>
          <AlertDescription>
            Your location is being updated every 10 seconds. Last update: {currentBus.lastUpdated.toLocaleTimeString()}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>GPS Tracking Disabled</AlertTitle>
          <AlertDescription>
            Please enable GPS to allow passengers to track your bus location.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Update Bus Status</CardTitle>
            <CardDescription>Change your current operational status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={status} onValueChange={setStatus}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                <RadioGroupItem value="Running" id="running" />
                <Label htmlFor="running" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p>Running</p>
                      <p className="text-sm text-muted-foreground">Operating normally</p>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                <RadioGroupItem value="Delayed" id="delayed" />
                <Label htmlFor="delayed" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <div>
                      <p>Delayed</p>
                      <p className="text-sm text-muted-foreground">Running behind schedule</p>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                <RadioGroupItem value="Stopped" id="stopped" />
                <Label htmlFor="stopped" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-gray-500" />
                    <div>
                      <p>Stopped</p>
                      <p className="text-sm text-muted-foreground">Temporarily stopped</p>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                <RadioGroupItem value="Maintenance" id="maintenance" />
                <Label htmlFor="maintenance" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <div>
                      <p>Maintenance</p>
                      <p className="text-sm text-muted-foreground">Vehicle needs service</p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <Button className="w-full">Update Status</Button>
          </CardContent>
        </Card>

        {/* Vehicle Info */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>Current vehicle details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Driver</span>
                <span className="font-medium">{currentBus.driver_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Route Number</span>
                <span className="font-medium">{currentBus.route_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Capacity</span>
                <span className="font-medium">{currentBus.capacity} passengers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Speed</span>
                <span className="font-medium">{currentBus.speed} km/h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Current Location</CardTitle>
            <CardDescription>GPS coordinates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Latitude</p>
                  <p className="font-mono">{currentBus.latitude.toFixed(6)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Longitude</p>
                  <p className="font-mono">{currentBus.longitude.toFixed(6)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">GPS Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${gpsEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p className="text-sm">{gpsEnabled ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant={gpsEnabled ? 'outline' : 'default'}
              className="w-full"
              onClick={() => setGpsEnabled(!gpsEnabled)}
            >
              {gpsEnabled ? 'Disable GPS Tracking' : 'Enable GPS Tracking'}
            </Button>
          </CardContent>
        </Card>

        {/* Passenger Info */}
        <Card>
          <CardHeader>
            <CardTitle>Passenger Information</CardTitle>
            <CardDescription>Current occupancy status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Occupancy</span>
                <span className="font-medium">
                  {currentBus.current_occupancy} / {currentBus.capacity}
                </span>
              </div>
              <Progress value={occupancyPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {occupancyPercentage.toFixed(1)}% full
              </p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">Occupancy Status</p>
              </div>
              {occupancyPercentage >= 90 ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Bus is crowded. Consider skipping some stops if safe.
                  </AlertDescription>
                </Alert>
              ) : occupancyPercentage >= 70 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Moderate occupancy. Monitor passenger flow.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Seats available. Normal operations.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline">Report Issue</Button>
            <Button variant="outline">Emergency Alert</Button>
            <Button variant="outline">Break Time</Button>
            <Button variant="outline">End Shift</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
