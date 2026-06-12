import React from "react";
import Card from "../../components/common/Card";
import { getImageUrl } from "../../utils/formatters";

const OrderSummaryCard = ({ order, product }) => (
  <Card variant="container" className="mx-md md:mx-2xl mt-md" padding="p-md md:p-lg">
    <div className="flex justify-between items-start mb-lg">
      <div>
        <p className="text-[10px] md:text-body-extra-small text-text-tertiary uppercase tracking-wider">Order ID</p>
        <p className="text-body-small-bold md:text-body-medium-bold text-text-primary mt-xs">{order.orderId}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] md:text-body-extra-small text-text-tertiary uppercase tracking-wider">Total Paid</p>
        <p className="text-body-small-bold md:text-body-medium-bold text-text-primary mt-xs">Rs.{parseFloat(order.total).toFixed(2)}</p>
      </div>
    </div>
    <div className="h-px bg-white/10 mb-lg" />
    <div className="flex items-center gap-md">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
        <img src={getImageUrl(product?.images?.[0] || product?.image)} alt={product?.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-small-bold text-text-primary truncate">{product?.name}</p>
        <p className="text-[11px] md:text-body-extra-small text-text-tertiary mt-xs truncate">
          {order.size && `Size: ${order.size}`} {order.color && `\u2022 Color: ${order.color}`}
        </p>
        <span className="inline-block mt-xs px-sm py-[2px] rounded-full bg-primary-blue/15 text-primary-blue text-[10px] md:text-[11px] font-bold">Qty: {order.qty}</span>
      </div>
    </div>
  </Card>
);

export default OrderSummaryCard;
