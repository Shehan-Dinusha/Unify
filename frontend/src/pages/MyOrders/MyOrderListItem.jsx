import React from "react";
import { Package, Calendar, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../utils/formatters";

const MyOrderListItem = ({ item, viewType, onNavigate, getStatusStyles, formatDate }) => (
  <div onClick={() => onNavigate(viewType === "Marketplace" ? `/order-details/${item.id}` : `/booking-details/${item.id}`)}
    className="group cursor-pointer hover:bg-white/[0.03] transition-colors p-md md:p-lg">
    <div className="flex items-center gap-lg">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
        <img src={getImageUrl(
          viewType === "Marketplace"
            ? (item.clubProduct?.images?.[0] || item.clubProduct?.coverImage)
            : (item.event?.coverImage)
        )} alt={viewType === "Marketplace" ? item.clubProduct?.name : item.event?.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm md:text-body-large-bold text-text-primary truncate mb-0.5 md:mb-xs">
          {viewType === "Marketplace" ? item.clubProduct?.name : item.event?.name}
        </h3>
        <div className="flex items-center gap-xs text-[11px] md:text-body-extra-small text-text-tertiary">
          <span>{viewType === "Marketplace" ? item.orderId : item.bookingId}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-text-tertiary">
          {viewType === "Marketplace" ? <Package size={12} /> : <Calendar size={12} />}
          <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-wider">
            {viewType === "Marketplace" ? "Ordered on " : "Booked on "} {formatDate(item.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-md md:gap-xl shrink-0">
        <span className={`px-2 md:px-sm py-1 rounded-full text-[9px] md:text-[10px] font-bold border uppercase whitespace-nowrap ${getStatusStyles(item.status)}`}>
          {item.status}
        </span>
        <div className="text-right min-w-[80px] md:min-w-[100px] hidden sm:block">
          <p className="text-sm md:text-body-large-bold text-text-primary">Rs.{parseFloat(item.total).toFixed(2)}</p>
        </div>
        <div className="p-1.5 md:p-sm rounded-xl bg-white/5 text-text-tertiary group-hover:text-text-primary group-hover:bg-white/10 transition-all">
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  </div>
);

export default MyOrderListItem;
