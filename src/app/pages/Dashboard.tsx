import { useState } from 'react';
import { Lounge, RestockOrder, Alert } from '../types/inventory';
import { mockLounges, mockRestockOrders, mockPeakFlights, generateAlerts } from '../data/mockData';
import { LoungeStats } from '../components/LoungeStats';
import { InventoryMonitor } from '../components/InventoryMonitor';
import { InventoryItemCard } from '../components/InventoryItemCard';
import { RestockOrderCard } from '../components/RestockOrderCard';
import { AlertsPanel } from '../components/AlertsPanel';
import { PeakFlightsPanel } from '../components/PeakFlightsPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { getStockLevel } from '../utils/inventoryUtils';
import { Package, ShoppingCart, AlertCircle, Plane } from 'lucide-react';

export function Dashboard() {
  const [lounges, setLounges] = useState<Lounge[]>(mockLounges);
  const [orders] = useState<RestockOrder[]>(mockRestockOrders);
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts(mockLounges));
  const [selectedLounge, setSelectedLounge] = useState<string>('all');

  const handleLoungesUpdate = (updatedLounges: Lounge[]) => {
    setLounges(updatedLounges);
  };

  const handleNewAlert = (newAlert: Alert) => {
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const filteredItems = selectedLounge === 'all'
    ? lounges.flatMap((lounge) =>
        lounge.inventory.map((item) => ({ item, lounge }))
      )
    : lounges
        .filter((lounge) => lounge.id === selectedLounge)
        .flatMap((lounge) =>
          lounge.inventory.map((item) => ({ item, lounge }))
        );

  const criticalItems = filteredItems.filter(
    ({ item }) => getStockLevel(item) === 'critical'
  );

  const lowStockItems = filteredItems.filter(
    ({ item }) => getStockLevel(item) === 'low'
  );

  const activeOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'approved' || o.status === 'in-transit'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Airport Lounge Inventory Monitor</h1>
        <p className="text-gray-600">
          Real-time inventory tracking with automated restock alerts
        </p>
      </div>

      <LoungeStats lounges={lounges} />

      <InventoryMonitor
        lounges={lounges}
        onLoungesUpdate={handleLoungesUpdate}
        onNewAlert={handleNewAlert}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Current stock levels across all lounges</CardDescription>
              </div>
              <Select value={selectedLounge} onValueChange={setSelectedLounge}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lounges</SelectItem>
                  {lounges.map((lounge) => (
                    <SelectItem key={lounge.id} value={lounge.id}>
                      {lounge.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="critical">
              <TabsList className="mb-4">
                <TabsTrigger value="critical" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Critical ({criticalItems.length})
                </TabsTrigger>
                <TabsTrigger value="low" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Low Stock ({lowStockItems.length})
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  All Items ({filteredItems.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="critical" className="space-y-3">
                {criticalItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                    {criticalItems.map(({ item, lounge }) => (
                      <InventoryItemCard
                        key={`${lounge.id}-${item.id}`}
                        item={item}
                        loungeName={lounge.name}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No critical items</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="low" className="space-y-3">
                {lowStockItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                    {lowStockItems.map(({ item, lounge }) => (
                      <InventoryItemCard
                        key={`${lounge.id}-${item.id}`}
                        item={item}
                        loungeName={lounge.name}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No low stock items</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredItems.map(({ item, lounge }) => (
                    <InventoryItemCard
                      key={`${lounge.id}-${item.id}`}
                      item={item}
                      loungeName={lounge.name}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Active Alerts
              </CardTitle>
              <CardDescription>Stock level notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Peak Flights
              </CardTitle>
              <CardDescription>Upcoming high-traffic periods</CardDescription>
            </CardHeader>
            <CardContent>
              <PeakFlightsPanel flights={mockPeakFlights} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Restock Orders ({activeOrders.length})
          </CardTitle>
          <CardDescription>Automated and manual restock requests</CardDescription>
        </CardHeader>
        <CardContent>
          {activeOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order) => (
                <RestockOrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active restock orders</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
