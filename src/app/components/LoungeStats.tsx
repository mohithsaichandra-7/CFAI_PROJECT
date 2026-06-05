import { Lounge } from '../types/inventory';
import { getStockLevel } from '../utils/inventoryUtils';
import { Package, AlertCircle, Users, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';

interface LoungeStatsProps {
  lounges: Lounge[];
}

export function LoungeStats({ lounges }: LoungeStatsProps) {
  const totalItems = lounges.reduce((sum, lounge) => sum + lounge.inventory.length, 0);
  
  const criticalItems = lounges.reduce(
    (sum, lounge) =>
      sum + lounge.inventory.filter((item) => getStockLevel(item) === 'critical').length,
    0
  );
  
  const lowStockItems = lounges.reduce(
    (sum, lounge) =>
      sum + lounge.inventory.filter((item) => getStockLevel(item) === 'low').length,
    0
  );

  const totalOccupancy = lounges.reduce((sum, lounge) => sum + lounge.currentOccupancy, 0);
  const totalCapacity = lounges.reduce((sum, lounge) => sum + lounge.capacity, 0);
  const occupancyRate = ((totalOccupancy / totalCapacity) * 100).toFixed(0);

  const stats = [
    {
      label: 'Total Items Tracked',
      value: totalItems,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Critical Stock',
      value: criticalItems,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Low Stock Items',
      value: lowStockItems,
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Lounge Occupancy',
      value: `${occupancyRate}%`,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
