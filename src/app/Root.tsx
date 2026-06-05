import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, Building2, ShoppingCart, Activity } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { AIChatBox } from "./components/AIChatBox";
import { mockLounges, mockRestockOrders } from "./data/mockData";

export function Root() {
  const location = useLocation();

  // Flatten inventory from all lounges for the chatbox with lounge info
  const allInventory = mockLounges.flatMap(lounge =>
    lounge.inventory.map(item => ({ ...item, lounge: lounge.name }))
  );

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Lounges", href: "/lounges", icon: Building2 },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Lounge Monitor</h1>
                <p className="text-xs text-gray-600">Inventory Management System</p>
              </div>
            </div>

            <nav className="flex gap-2">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <AIChatBox inventory={allInventory} orders={mockRestockOrders} />

      <Toaster />
    </div>
  );
}
