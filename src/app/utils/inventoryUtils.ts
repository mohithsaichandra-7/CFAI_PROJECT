import { InventoryItem, StockLevel } from '../types/inventory';

export const getStockLevel = (item: InventoryItem): StockLevel => {
  if (item.currentStock <= item.criticalThreshold) return 'critical';
  if (item.currentStock <= item.reorderThreshold) return 'low';
  if (item.currentStock >= item.maxCapacity * 0.8) return 'full';
  return 'normal';
};

export const getStockPercentage = (item: InventoryItem): number => {
  return (item.currentStock / item.maxCapacity) * 100;
};

export const getStockColor = (level: StockLevel): string => {
  switch (level) {
    case 'critical':
      return 'text-red-600';
    case 'low':
      return 'text-amber-600';
    case 'normal':
      return 'text-blue-600';
    case 'full':
      return 'text-green-600';
  }
};

export const getStockBgColor = (level: StockLevel): string => {
  switch (level) {
    case 'critical':
      return 'bg-red-50 border-red-200';
    case 'low':
      return 'bg-amber-50 border-amber-200';
    case 'normal':
      return 'bg-blue-50 border-blue-200';
    case 'full':
      return 'bg-green-50 border-green-200';
  }
};

export const getProgressColor = (level: StockLevel): string => {
  switch (level) {
    case 'critical':
      return 'bg-red-500';
    case 'low':
      return 'bg-amber-500';
    case 'normal':
      return 'bg-blue-500';
    case 'full':
      return 'bg-green-500';
  }
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date('2026-02-27T14:30:00');
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateRestockQuantity = (item: InventoryItem): number => {
  return item.maxCapacity - item.currentStock;
};

export const estimateRunoutTime = (item: InventoryItem): number => {
  // Returns hours until stockout based on consumption rate
  if (item.consumptionRate === 0) return Infinity;
  return item.currentStock / item.consumptionRate;
};
