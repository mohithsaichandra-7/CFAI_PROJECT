import { InventoryItem } from '../types/inventory';
import { getStockLevel, getStockPercentage, getStockColor, getStockBgColor, getProgressColor, estimateRunoutTime } from '../utils/inventoryUtils';
import { AlertCircle, Package, TrendingDown } from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface InventoryItemCardProps {
  item: InventoryItem;
  loungeName: string;
}

export function InventoryItemCard({ item, loungeName }: InventoryItemCardProps) {
  const stockLevel = getStockLevel(item);
  const percentage = getStockPercentage(item);
  const runoutHours = estimateRunoutTime(item);

  return (
    <div className={`border rounded-lg p-4 ${getStockBgColor(stockLevel)} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-gray-600">{loungeName}</p>
        </div>
        <div className="flex items-center gap-2">
          {stockLevel === 'critical' && (
            <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
          )}
          <Badge variant={stockLevel === 'critical' ? 'destructive' : stockLevel === 'low' ? 'outline' : 'secondary'}>
            {stockLevel.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className={`font-medium ${getStockColor(stockLevel)}`}>
              {item.currentStock} / {item.maxCapacity} {item.unit}
            </span>
            <span className="text-gray-600">{percentage.toFixed(0)}%</span>
          </div>
          <Progress value={percentage} className="h-2" indicatorClassName={getProgressColor(stockLevel)} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>Reorder: {item.reorderThreshold} {item.unit}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>Rate: {item.consumptionRate}/hr</span>
          </div>
        </div>

        {runoutHours < 24 && runoutHours > 0 && (
          <div className={`text-xs px-2 py-1 rounded ${stockLevel === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
            ⏱ Est. stockout in {runoutHours < 1 ? `${Math.round(runoutHours * 60)}m` : `${runoutHours.toFixed(1)}h`}
          </div>
        )}
      </div>
    </div>
  );
}
