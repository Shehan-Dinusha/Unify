import React from 'react';
import Card from '../../components/common/Card';
import StatusDropdown from './StatusDropdown';

const OrdersTable = ({ orders, type, filterStatus, updateStatus }) => {
  const displayedOrders = filterStatus === 'All Statuses' ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-text-secondary text-[11px] uppercase tracking-wider">
              <th className="text-left px-6 py-4 font-medium">{type === 'club-product' ? 'Order' : 'Booking'} ID</th>
              <th className="text-left px-6 py-4 font-medium">Student Name</th>
              <th className="text-center px-4 py-4 font-medium">Qty</th>
              <th className="text-center px-4 py-4 font-medium">{type === 'club-product' ? 'Size' : 'Tier'}</th>
              <th className="text-center px-4 py-4 font-medium">Color</th>
              <th className="text-right px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.map((order, i) => (
              <tr key={order.id} className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${i === displayedOrders.length - 1 ? 'border-b-0' : ''}`}>
                <td className="px-6 py-4 font-mono text-xs text-text-secondary">{order.displayId}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${order.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {order.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{order.name}</p>
                      <p className="text-text-secondary text-xs">{order.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-bold">{order.qty}</td>
                <td className="px-4 py-4 text-center">
                  <span className="px-2.5 py-1 bg-white/8 border border-white/10 rounded-lg text-xs font-bold">
                    {order.size}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="w-5 h-5 rounded-full border border-white/15 mx-auto" style={{ backgroundColor: order.colorHex }} />
                </td>
                <td className="px-6 py-4 text-right">
                  <StatusDropdown value={order.status} onChange={(s) => updateStatus(order.id, s)} type={type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default OrdersTable;
