import React from 'react';
import Card from '../components/common/Card';
import { getImageUrl } from '../utils/formatters';

const RecentOrdersTable = ({ recentOrders, navigate }) => (
  <div>
    <div className="flex items-center justify-between mb-4 px-1">
      <h3 className="font-bold text-base">Recent Orders</h3>
      <span
        onClick={() => navigate('/club-owner/product-orders')}
        className="text-primary-blue text-xs font-medium cursor-pointer hover:underline"
      >
        View all
      </span>
    </div>
    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-text-secondary text-[11px] uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">Order</th>
              <th className="text-left px-5 py-3 font-medium">Product</th>
              <th className="text-left px-5 py-3 font-medium">Date</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-right px-5 py-3 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length > 0 ? (
              recentOrders.map((order, i) => {
                const statusStyle =
                  order.status === 'Order Completed' || order.status === 'COMPLETED'
                    ? 'bg-state-success/15 text-state-success'
                    : order.status === 'CANCELLED'
                      ? 'bg-state-error/15 text-state-error'
                      : ['Order Placed', 'Seller Confirmed', 'IN PROGRESS'].includes(order.status)
                        ? 'bg-primary-blue/15 text-primary-blue'
                        : 'bg-state-warning/15 text-state-warning';
                return (
                  <tr
                    key={order.id}
                    className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${i === recentOrders.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-5 py-4 text-text-secondary font-mono text-xs">
                      {order.orderId}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(order.clubProduct?.images?.[0]) || 'https://via.placeholder.com/32'}
                          alt={order.clubProduct?.name || 'Product'}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <span className="font-medium text-xs truncate max-w-[180px]">
                          {order.clubProduct?.name || 'Product'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-secondary text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyle}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-primary-blue text-xs">
                      Rs.{parseFloat(order.total).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center text-text-secondary text-xs">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

export default RecentOrdersTable;
