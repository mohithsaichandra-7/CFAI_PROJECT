import { useState } from 'react';
import { mockLounges } from '../data/mockData';
import { Lounge } from '../types/inventory';
import { InventoryItemCard } from '../components/InventoryItemCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { MapPin, Users, Package } from 'lucide-react';
import { getStockLevel } from '../utils/inventoryUtils';

export function Lounges() {
  const [lounges] = useState<Lounge[]>(mockLounges);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Lounge Management</h1>
        <p className="text-gray-600">Detailed inventory view by lounge</p>
      </div>

      <div className="space-y-6">
        {lounges.map((lounge) => {
          const occupancyPercent = (lounge.currentOccupancy / lounge.capacity) * 100;
          const criticalCount = lounge.inventory.filter(
            (item) => getStockLevel(item) === 'critical'
          ).length;
          const lowStockCount = lounge.inventory.filter(
            (item) => getStockLevel(item) === 'low'
          ).length;

          return (
            <Card key={lounge.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {lounge.name}
                      {criticalCount > 0 && (
                        <Badge variant="destructive">{criticalCount} Critical</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      {lounge.terminal}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">
                        {lounge.currentOccupancy} / {lounge.capacity}
                      </span>
                    </div>
                    <Progress value={occupancyPercent} className="w-32 h-2" />
                  </div>
                </div>

                <div className="flex gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">
                      {lounge.inventory.length} items tracked
                    </span>
                  </div>
                  {lowStockCount > 0 && (
                    <Badge variant="outline">{lowStockCount} low stock</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lounge.inventory.map((item) => (
                    <InventoryItemCard
                      key={item.id}
                      item={item}
                      loungeName={lounge.name}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
