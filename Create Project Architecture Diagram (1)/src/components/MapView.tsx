import React, { useEffect, useRef } from 'react';
import { Bus, Route } from '../types';
import { Badge } from './ui/badge';
import { MapPin, Navigation } from 'lucide-react';

interface MapViewProps {
  buses: Bus[];
  routes: Route[];
  selectedBus: string | null;
  onBusSelect: (busId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ buses, routes, selectedBus, onBusSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Map boundaries (Bangalore area)
  const mapBounds = {
    minLat: 12.84,
    maxLat: 12.98,
    minLng: 77.58,
    maxLng: 77.76,
  };

  const latLngToPixel = (lat: number, lng: number, width: number, height: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * width;
    const y = height - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * height;
    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo((i * width) / 10, 0);
      ctx.lineTo((i * width) / 10, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, (i * height) / 10);
      ctx.lineTo(width, (i * height) / 10);
      ctx.stroke();
    }

    // Draw routes
    routes.forEach((route) => {
      ctx.strokeStyle = route.color;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      route.stops.forEach((stop, idx) => {
        const { x, y } = latLngToPixel(stop.latitude, stop.longitude, width, height);
        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw stops
      route.stops.forEach((stop) => {
        const { x, y } = latLngToPixel(stop.latitude, stop.longitude, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = route.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    });

    // Draw buses
    buses.forEach((bus) => {
      const { x, y } = latLngToPixel(bus.latitude, bus.longitude, width, height);
      const isSelected = selectedBus === bus.bus_id;

      // Bus icon (triangle pointing up)
      ctx.save();
      ctx.translate(x, y);
      
      // Shadow for selected bus
      if (isSelected) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
      }

      ctx.fillStyle = bus.current_status === 'Running' ? '#10b981' :
                       bus.current_status === 'Delayed' ? '#f59e0b' :
                       bus.current_status === 'Maintenance' ? '#ef4444' : '#6b7280';
      
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(8, 8);
      ctx.lineTo(-8, 8);
      ctx.closePath();
      ctx.fill();

      // White border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Route number
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bus.route_number, 0, 2);

      ctx.restore();

      // Pulse effect for selected bus
      if (isSelected) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }, [buses, routes, selectedBus]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if click is near any bus
    buses.forEach((bus) => {
      const { x, y } = latLngToPixel(bus.latitude, bus.longitude, canvas.width, canvas.height);
      const distance = Math.sqrt(Math.pow(clickX - x, 2) + Math.pow(clickY - y, 2));
      if (distance < 20) {
        onBusSelect(bus.bus_id);
      }
    });
  };

  return (
    <div className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
      />
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Running</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Maintenance</span>
          </div>
        </div>
      </div>
    </div>
  );
};
