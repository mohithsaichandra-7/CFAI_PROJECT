import { PeakFlight } from '../types/inventory';
import { formatDateTime } from '../utils/inventoryUtils';
import { Plane, Users, Clock } from 'lucide-react';
import { Badge } from './ui/badge';

interface PeakFlightsPanelProps {
  flights: PeakFlight[];
}

export function PeakFlightsPanel({ flights }: PeakFlightsPanelProps) {
  const now = new Date('2026-02-27T14:30:00');
  const upcomingFlights = flights
    .filter((f) => f.loungeAccess && f.departure > now)
    .sort((a, b) => a.departure.getTime() - b.departure.getTime())
    .slice(0, 5);

  const getTimeUntilDeparture = (departure: Date): string => {
    const hours = (departure.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    return `${hours.toFixed(1)}h`;
  };

  const getUrgencyColor = (departure: Date): string => {
    const hours = (departure.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hours < 2) return 'bg-red-500';
    if (hours < 3) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-3">
      {upcomingFlights.map((flight) => (
        <div
          key={flight.id}
          className="border rounded-lg p-4 bg-white hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${getUrgencyColor(flight.departure)} bg-opacity-10`}>
                <Plane className={`w-4 h-4 ${getUrgencyColor(flight.departure).replace('bg-', 'text-')}`} />
              </div>
              <div>
                <h4 className="font-medium">{flight.flightNumber}</h4>
                <p className="text-sm text-gray-600">{flight.terminal}</p>
              </div>
            </div>
            <Badge variant="outline">
              {getTimeUntilDeparture(flight.departure)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatDateTime(flight.departure)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{flight.expectedPassengers} pax</span>
            </div>
          </div>
        </div>
      ))}

      {upcomingFlights.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Plane className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No upcoming peak flights</p>
        </div>
      )}
    </div>
  );
}
