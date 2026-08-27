import React from 'react';
import Card from '../../components/common/Card';
import { ShoppingBag } from 'lucide-react';
import { ALL_PRODUCT_STATUSES, ALL_EVENT_STATUSES, statusStyle } from './StatusDropdown';

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name[0].toUpperCase();
};

const getAvatarColor = (id) => {
  const colors = ['bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-teal-500', 'bg-red-500', 'bg-purple-500'];
  return colors[id % colors.length];
};

// eslint-disable-next-line react-refresh/only-export-components
export { getInitials, getAvatarColor };

const OrderStatsCards = ({ orders, type }) => {
  const ALL_STATUSES = type === 'club-event' ? ALL_EVENT_STATUSES : ALL_PRODUCT_STATUSES;

  const total = orders.length;
  const todayCount = orders.filter((o) => {
    const orderDate = new Date(o.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  }).length;

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const sizeDist = orders.reduce((acc, o) => {
    const key = o.size === 'XL' || o.size === 'XXL' ? 'L/XL' : o.size;
    acc[key] = (acc[key] || 0) + o.qty;
    return acc;
  }, {});

  const statusBarSegments = [
    { status: 'Order Placed', color: 'bg-yellow-400', flex: counts['Order Placed'] || 0 },
    { status: 'Seller Confirmed', color: 'bg-purple-400', flex: counts['Seller Confirmed'] || 0 },
    { status: 'Ready for Pickup', color: 'bg-state-success', flex: counts['Ready for Pickup'] || 0 },
    { status: 'Order Completed', color: 'bg-white/30', flex: counts['Order Completed'] || 0 },
  ].filter((s) => s.flex > 0);

  const sizeDistEntries = Object.entries(sizeDist).sort((a, b) => b[1] - a[1]);
  const sizeColors = ['bg-primary-blue', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">Total Orders</span>
          <ShoppingBag className="w-4 h-4 text-text-secondary" />
        </div>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-bold">{total}</span>
          {todayCount > 0 && <span className="text-state-success text-xs font-bold mb-1.5">+{todayCount} today</span>}
        </div>
      </Card>

      <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">Status Breakdown</span>
        </div>
        <div className="flex h-2.5 rounded-sm overflow-hidden mb-3 gap-0">
          {statusBarSegments.map((seg) => (
            <div key={seg.status} className={`${seg.color} rounded-sm transition-all`} style={{ flex: seg.flex }} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {ALL_STATUSES.map((s) => {
            const st = statusStyle[s];
            return (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${st.dot}`} />
                <span className="text-[10px] text-text-secondary">{counts[s]} {s.split(' ')[s.split(' ').length - 1]}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">Distribution</span>
        </div>
        <div className="flex flex-col gap-2">
          {sizeDistEntries.map(([size, count], i) => (
            <div key={size} className="flex items-center gap-3">
              <span className="text-xs font-bold text-white w-8">{size}</span>
              <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${sizeColors[i % sizeColors.length]}`} style={{ width: `${(count / (orders.reduce((a, o) => a + o.qty, 0))) * 100}%` }} />
              </div>
              <span className="text-text-secondary text-[10px] w-14 text-right">{count} orders</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OrderStatsCards;
