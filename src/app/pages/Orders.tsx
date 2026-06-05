import { useState } from 'react';
import { mockRestockOrders } from '../data/mockData';
import { RestockOrder, OrderStatus } from '../types/inventory';
import { RestockOrderCard } from '../components/RestockOrderCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';

export function Orders() {
  const [orders] = useState<RestockOrder[]>(mockRestockOrders);

  const filterByStatus = (status: OrderStatus | 'all') => {
    if (status === 'all') return orders;
    return orders.filter((order) => order.status === status);
  };

  const statusCounts = {
    pending: orders.filter((o) => o.status === 'pending').length,
    approved: orders.filter((o) => o.status === 'approved').length,
    inTransit: orders.filter((o) => o.status === 'in-transit').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Restock Orders</h1>
        <p className="text-gray-600">Manage automated and manual inventory orders</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            All Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approved ({statusCounts.approved})
          </TabsTrigger>
          <TabsTrigger value="in-transit" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            In Transit ({statusCounts.inTransit})
          </TabsTrigger>
          <TabsTrigger value="delivered" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Delivered ({statusCounts.delivered})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterByStatus('all').map((order) => (
              <RestockOrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {statusCounts.pending > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterByStatus('pending').map((order) => (
                <RestockOrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No pending orders</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {statusCounts.approved > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterByStatus('approved').map((order) => (
                <RestockOrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No approved orders</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-transit" className="mt-6">
          {statusCounts.inTransit > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterByStatus('in-transit').map((order) => (
                <RestockOrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No orders in transit</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="delivered" className="mt-6">
          {statusCounts.delivered > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterByStatus('delivered').map((order) => (
                <RestockOrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No delivered orders</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
