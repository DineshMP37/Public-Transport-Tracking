import React, { useState } from 'react';
import { Seat } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Armchair } from 'lucide-react';

interface SeatSelectionProps {
  totalSeats: number;
  bookedSeats: string[];
  onSeatsSelect: (seats: string[]) => void;
  maxSeats?: number;
}

export const SeatSelection: React.FC<SeatSelectionProps> = ({
  totalSeats,
  bookedSeats,
  onSeatsSelect,
  maxSeats = 5,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Generate seat layout (4 seats per row: 2-2 configuration)
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const seatsPerRow = 4;
    const rows = Math.ceil(totalSeats / seatsPerRow);

    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= seatsPerRow; col++) {
        const seatNumber = `${row}${String.fromCharCode(64 + col)}`; // 1A, 1B, etc.
        const seatIndex = (row - 1) * seatsPerRow + col;
        
        if (seatIndex <= totalSeats) {
          seats.push({
            seat_number: seatNumber,
            status: bookedSeats.includes(seatNumber) 
              ? 'booked' 
              : selectedSeats.includes(seatNumber) 
              ? 'selected' 
              : 'available',
            type: col === 1 || col === 4 ? 'window' : col === 2 || col === 3 ? 'aisle' : 'middle',
          });
        }
      }
    }

    return seats;
  };

  const seats = generateSeats();

  const handleSeatClick = (seatNumber: string) => {
    if (bookedSeats.includes(seatNumber)) return;

    let newSelectedSeats: string[];
    if (selectedSeats.includes(seatNumber)) {
      newSelectedSeats = selectedSeats.filter((s) => s !== seatNumber);
    } else {
      if (selectedSeats.length >= maxSeats) {
        return; // Max seats reached
      }
      newSelectedSeats = [...selectedSeats, seatNumber];
    }

    setSelectedSeats(newSelectedSeats);
    onSeatsSelect(newSelectedSeats);
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 hover:bg-green-200 border-green-300 text-green-700 cursor-pointer';
      case 'booked':
        return 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed';
      case 'selected':
        return 'bg-blue-500 border-blue-600 text-white cursor-pointer';
      default:
        return 'bg-gray-100';
    }
  };

  // Group seats by row
  const rows: Seat[][] = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Seats</CardTitle>
        <CardDescription>
          Choose up to {maxSeats} seats. Click on available seats to select.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 border border-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 border border-gray-400 rounded"></div>
            <span>Booked</span>
          </div>
        </div>

        {/* Seat Layout */}
        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
          {/* Driver Section */}
          <div className="flex justify-end mb-4">
            <div className="bg-gray-700 text-white px-4 py-2 rounded text-sm">
              Driver
            </div>
          </div>

          {/* Seats */}
          <div className="space-y-2">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-2">
                {/* Left side seats (2 seats) */}
                <div className="flex gap-2">
                  {row.slice(0, 2).map((seat) => (
                    <button
                      key={seat.seat_number}
                      onClick={() => handleSeatClick(seat.seat_number)}
                      disabled={seat.status === 'booked'}
                      className={`w-12 h-12 rounded border-2 flex flex-col items-center justify-center text-xs transition-all ${getSeatColor(
                        seat.status
                      )}`}
                      title={`${seat.seat_number} (${seat.type})`}
                    >
                      <Armchair className="h-4 w-4" />
                      <span className="text-xs mt-0.5">{seat.seat_number}</span>
                    </button>
                  ))}
                </div>

                {/* Aisle */}
                <div className="w-8"></div>

                {/* Right side seats (2 seats) */}
                <div className="flex gap-2">
                  {row.slice(2, 4).map((seat) => (
                    <button
                      key={seat.seat_number}
                      onClick={() => handleSeatClick(seat.seat_number)}
                      disabled={seat.status === 'booked'}
                      className={`w-12 h-12 rounded border-2 flex flex-col items-center justify-center text-xs transition-all ${getSeatColor(
                        seat.status
                      )}`}
                      title={`${seat.seat_number} (${seat.type})`}
                    >
                      <Armchair className="h-4 w-4" />
                      <span className="text-xs mt-0.5">{seat.seat_number}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Seats Summary */}
        {selectedSeats.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Selected Seats:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSeats.map((seat) => (
                    <Badge key={seat} variant="default">
                      {seat}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSeats([]);
                  onSeatsSelect([]);
                }}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
