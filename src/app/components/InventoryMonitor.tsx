import { useState, useEffect } from 'react';
import { Lounge, Alert } from '../types/inventory';
import { getStockLevel } from '../utils/inventoryUtils';
import { Activity, Pause, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface InventoryMonitorProps {
  lounges: Lounge[];
  onLoungesUpdate: (lounges: Lounge[]) => void;
  onNewAlert: (alert: Alert) => void;
}

export function InventoryMonitor({ lounges, onLoungesUpdate, onNewAlert }: InventoryMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Simulate consumption
      const updatedLounges = lounges.map((lounge) => ({
        ...lounge,
        inventory: lounge.inventory.map((item) => {
          // Random consumption between 0 and consumptionRate per hour
          const consumptionFactor = Math.random() * 0.5 + 0.5; // 50-100% of rate
          const consumed = Math.floor((item.consumptionRate / 60) * consumptionFactor); // per minute
          const newStock = Math.max(0, item.currentStock - consumed);

          // Check if crossed threshold
          const oldLevel = getStockLevel(item);
          const newItem = { ...item, currentStock: newStock };
          const newLevel = getStockLevel(newItem);

          // Generate alert if level changed to critical or low
          if (oldLevel !== newLevel && (newLevel === 'critical' || newLevel === 'low')) {
            const alert: Alert = {
              id: `alert-${Date.now()}-${item.id}`,
              loungeId: lounge.id,
              loungeName: lounge.name,
              itemName: item.name,
              currentStock: newStock,
              threshold: newLevel === 'critical' ? item.criticalThreshold : item.reorderThreshold,
              severity: newLevel === 'critical' ? 'critical' : 'warning',
              message: `${newLevel === 'critical' ? 'CRITICAL' : 'Low stock'}: ${item.name} at ${newStock} ${item.unit}`,
              timestamp: new Date(),
              acknowledged: false,
            };
            onNewAlert(alert);

            if (newLevel === 'critical') {
              toast.error(`Critical Stock Alert: ${item.name}`, {
                description: `${lounge.name} - Only ${newStock} ${item.unit} remaining`,
              });
            }
          }

          return newItem;
        }),
      }));

      onLoungesUpdate(updatedLounges);
      setLastUpdate(new Date());
    }, 3000); // Update every 3 seconds for demo

    return () => clearInterval(interval);
  }, [isMonitoring, lounges, onLoungesUpdate, onNewAlert]);

  return (
    <div className="flex items-center gap-4 p-4 bg-white border rounded-lg">
      <div className="flex items-center gap-2">
        <Activity className={`w-5 h-5 ${isMonitoring ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
        <div>
          <p className="text-sm font-medium">
            {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
          </p>
          <p className="text-xs text-gray-600">
            Last update: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="flex-1" />

      <Badge variant={isMonitoring ? 'default' : 'secondary'}>
        {isMonitoring ? 'LIVE' : 'PAUSED'}
      </Badge>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsMonitoring(!isMonitoring)}
      >
        {isMonitoring ? (
          <>
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Resume
          </>
        )}
      </Button>
    </div>
  );
}
