import React, { useState } from 'react';
import { Bus, Route } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bus as BusIcon, Users, Activity, AlertTriangle, TrendingUp, Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AdminDashboardProps {
  buses: Bus[];
  routes: Route[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ buses, routes }) => {
  const [isAddBusOpen, setIsAddBusOpen] = useState(false);

  // Calculate statistics
  const totalBuses = buses.length;
  const activeBuses = buses.filter((b) => b.current_status === 'Running').length;
  const delayedBuses = buses.filter((b) => b.current_status === 'Delayed').length;
  const maintenanceBuses = buses.filter((b) => b.current_status === 'Maintenance').length;
  const totalPassengers = buses.reduce((sum, bus) => sum + bus.current_occupancy, 0);
  const averageSpeed = Math.round(buses.reduce((sum, bus) => sum + bus.speed, 0) / buses.length);

  // Chart data
  const routeData = routes.map((route) => {
    const routeBuses = buses.filter((b) => b.route_number === route.route_number);
    const passengers = routeBuses.reduce((sum, bus) => sum + bus.current_occupancy, 0);
    return {
      name: `Route ${route.route_number}`,
      buses: routeBuses.length,
      passengers,
    };
  });

  const statusData = [
    { name: 'Running', value: activeBuses, color: '#10b981' },
    { name: 'Delayed', value: delayedBuses, color: '#f59e0b' },
    { name: 'Maintenance', value: maintenanceBuses, color: '#ef4444' },
  ];

  const performanceData = [
    { time: '06:00', passengers: 120, speed: 35 },
    { time: '08:00', passengers: 450, speed: 25 },
    { time: '10:00', passengers: 280, speed: 38 },
    { time: '12:00', passengers: 310, speed: 32 },
    { time: '14:00', passengers: 290, speed: 35 },
    { time: '16:00', passengers: 380, speed: 28 },
    { time: '18:00', passengers: 520, speed: 22 },
    { time: '20:00', passengers: 240, speed: 40 },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Buses</CardTitle>
            <BusIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalBuses}</div>
            <p className="text-xs text-muted-foreground">
              {activeBuses} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Passengers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalPassengers}</div>
            <p className="text-xs text-muted-foreground">
              Across all active routes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average Speed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{averageSpeed} km/h</div>
            <p className="text-xs text-muted-foreground">
              Fleet-wide average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{delayedBuses + maintenanceBuses}</div>
            <p className="text-xs text-muted-foreground">
              {delayedBuses} delayed, {maintenanceBuses} maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Status Distribution</CardTitle>
                <CardDescription>Current status of all buses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Route Performance</CardTitle>
                <CardDescription>Buses and passengers per route</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={routeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="buses" fill="#3b82f6" name="Buses" />
                    <Bar dataKey="passengers" fill="#10b981" name="Passengers" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Daily Performance Trends</CardTitle>
                <CardDescription>Passenger volume and average speed throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="passengers" stroke="#3b82f6" strokeWidth={2} name="Passengers" />
                    <Line yAxisId="right" type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={2} name="Avg Speed (km/h)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vehicle Management</CardTitle>
                  <CardDescription>Manage all buses in the fleet</CardDescription>
                </div>
                <Dialog open={isAddBusOpen} onOpenChange={setIsAddBusOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bus
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Bus</DialogTitle>
                      <DialogDescription>Enter details for the new bus</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="bus-id">Bus ID</Label>
                        <Input id="bus-id" placeholder="B007" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="route">Route Number</Label>
                        <Select>
                          <SelectTrigger id="route">
                            <SelectValue placeholder="Select route" />
                          </SelectTrigger>
                          <SelectContent>
                            {routes.map((route) => (
                              <SelectItem key={route.route_id} value={route.route_number}>
                                {route.route_number} - {route.route_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="driver">Driver Name</Label>
                        <Input id="driver" placeholder="Enter driver name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input id="capacity" type="number" placeholder="50" />
                      </div>
                      <Button className="w-full">Add Bus</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bus ID</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buses.map((bus) => (
                    <TableRow key={bus.bus_id}>
                      <TableCell>{bus.bus_id.toUpperCase()}</TableCell>
                      <TableCell>{bus.route_number}</TableCell>
                      <TableCell>{bus.driver_name}</TableCell>
                      <TableCell>
                        <Badge variant={
                          bus.current_status === 'Running' ? 'default' :
                          bus.current_status === 'Delayed' ? 'secondary' : 'destructive'
                        }>
                          {bus.current_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{bus.current_occupancy}/{bus.capacity}</TableCell>
                      <TableCell>{bus.speed} km/h</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Route Management</CardTitle>
                  <CardDescription>Manage all bus routes</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Route
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routes.map((route) => {
                  const routeBuses = buses.filter((b) => b.route_number === route.route_number);
                  return (
                    <Card key={route.route_id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: route.color }}
                              />
                              Route {route.route_number} - {route.route_name}
                            </CardTitle>
                            <CardDescription>
                              {route.start_point} → {route.end_point}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Active Buses</p>
                            <p className="text-2xl">{routeBuses.length}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Stops</p>
                            <p className="text-2xl">{route.stops.length}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Passengers</p>
                            <p className="text-2xl">
                              {routeBuses.reduce((sum, bus) => sum + bus.current_occupancy, 0)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm mb-2">Stops:</p>
                          <div className="flex flex-wrap gap-2">
                            {route.stops.map((stop) => (
                              <Badge key={stop.stop_id} variant="outline">
                                {stop.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
              <CardDescription>Detailed analytics and insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">On-Time Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">87.5%</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      <TrendingUp className="h-4 w-4 inline mr-1 text-green-500" />
                      +3.2% from last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Average Delay</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">4.2 min</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      <TrendingUp className="h-4 w-4 inline mr-1 text-green-500" />
                      -1.3 min from last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Fleet Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">92.3%</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Operational efficiency rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Daily Passengers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">2,847</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Average per day this week
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button>Export Report (PDF)</Button>
                <Button variant="outline">Export Data (CSV)</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
