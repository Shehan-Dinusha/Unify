import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { getImageUrl } from '../../utils/formatters';
import { getCurrentUser } from '../../services/authService';
import orderService from '../../services/orderService';
import { getInitials, getAvatarColor } from './OrderStatsCards';
import OrderStatsCards from './OrderStatsCards';
import BulkActionBar from './BulkActionBar';
import OrdersTable from './OrdersTable';

const ProductOrderDashboard = () => {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const [orders, setOrders] = useState([]);
  const [itemInfo, setItemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bulkFrom, setBulkFrom] = useState('Order Placed');
  const [bulkTo, setBulkTo] = useState('Seller Confirmed');
  const [filterStatus, setFilterStatus] = useState('All Statuses');

  const user = getCurrentUser();

  const fetchData = async () => {
    setLoading(true);
    try {
      if (type === 'club-product') {
        const res = await orderService.getOrdersByProduct(id);
        if (res.success) {
          if (res.product) setItemInfo(res.product);
          else if (res.orders?.length > 0) setItemInfo(res.orders[0].clubProduct);
          const formatted = res.orders.map((o) => ({
            id: o.id, displayId: `#${o.id.toString().padStart(4, '0')}`,
            name: o.buyer?.name || 'Unknown', email: o.buyer?.email || 'N/A',
            initials: getInitials(o.buyer?.name), avatarColor: getAvatarColor(o.buyer?.id),
            qty: o.qty, size: o.size || '-', colorHex: o.colorHex || null,
            status: o.status, createdAt: o.createdAt,
          }));
          setOrders(formatted);
        }
      } else if (type === 'club-event') {
        const res = await orderService.getBookingsByEvent(id);
        if (res.success) {
          if (res.event) setItemInfo(res.event);
          else if (res.bookings?.length > 0) setItemInfo(res.bookings[0].clubEvent);
          const formatted = res.bookings.map((b) => ({
            id: b.id, displayId: `#${b.id.toString().padStart(4, '0')}`,
            name: b.user?.name || 'Unknown', email: b.user?.email || 'N/A',
            initials: getInitials(b.user?.name), avatarColor: getAvatarColor(b.user?.id),
            qty: b.qty, size: b.tierId || 'Standard', colorHex: null,
            status: b.status, createdAt: b.createdAt,
          }));
          setOrders(formatted);
        }
      }
    } catch (error) {
      // intentionally empty
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, [id, type]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      if (type === 'club-product') {
        await orderService.updateOrderStatus(orderId, { status: newStatus });
      } else {
        await orderService.updateBookingStatus(orderId, { status: newStatus });
      }
      fetchData();
    } catch (error) {
      alert('Failed to update status.');
    }
  };

  const applyBulk = async () => {
    const targetIds = orders.filter((o) => o.status === bulkFrom).map((o) => o.id);
    if (targetIds.length === 0) {
      alert(`No orders found with status "${bulkFrom}"`);
      return;
    }
    try {
      if (type === 'club-product') {
        await orderService.bulkUpdateOrderStatus(targetIds, bulkTo);
      } else {
        await orderService.bulkUpdateBookingStatus(targetIds, bulkTo);
      }
      fetchData();
      alert(`Successfully updated ${targetIds.length} orders to ${bulkTo}`);
    } catch (error) {
      alert('Failed to apply bulk update.');
    }
  };

  if (loading) {
    return (
      <MainLayout user={user} pageTitle="Order Dashboard">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} pageTitle="Order Dashboard" verificationCount={0}>
      <div className="flex flex-col gap-6 pb-12">
        <div className="flex items-center gap-4">
          <img
            src={itemInfo ? (type === 'club-product' ? getImageUrl(itemInfo.images?.[0]) : getImageUrl(itemInfo.coverImage)) : '/placeholder-post.jpg'}
            alt={itemInfo?.name || 'Item'}
            className="w-14 h-14 rounded-2xl object-cover border border-white/10"
          />
          <div>
            <p className="text-text-secondary text-xs mb-0.5">Viewing {type === 'club-product' ? 'orders' : 'bookings'} for</p>
            <h2 className="text-white font-bold text-lg leading-tight">{itemInfo?.name || 'Loading...'}</h2>
            <p className="text-text-secondary text-xs">{itemInfo?.price ? `Rs.${itemInfo.price}` : 'Free'}</p>
          </div>
          <button onClick={() => navigate('/club-owner/dashboard')} className="ml-auto text-text-secondary hover:text-white text-xs font-medium transition-colors">
            ← Back to Dashboard
          </button>
        </div>

        <OrderStatsCards orders={orders} type={type} />

        <BulkActionBar
          orders={orders}
          type={type}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          bulkFrom={bulkFrom}
          setBulkFrom={setBulkFrom}
          bulkTo={bulkTo}
          setBulkTo={setBulkTo}
          applyBulk={applyBulk}
        />

        <OrdersTable orders={orders} type={type} filterStatus={filterStatus} updateStatus={updateStatus} />
      </div>
    </MainLayout>
  );
};

export default ProductOrderDashboard;
