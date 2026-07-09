import React from "react";
import Card from "../../components/common/Card";
import { getImageUrl } from "../../utils/formatters";

const ProductInfoCard = ({ order }) => (
  <Card variant="container" padding="p-lg" className="border-white/10">
    <div className="flex flex-col md:flex-row gap-xl">
      <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
        <img src={getImageUrl(order.clubProduct?.images?.[0] || order.clubProduct?.coverImage)} alt={order.clubProduct?.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between items-start gap-md mb-2">
          <div>
            <h1 className="text-heading-medium text-text-primary mb-1 leading-tight">{order.clubProduct?.name || "Marketplace Product"}</h1>
            <p className="text-body-small text-text-tertiary">
              Sold by <span className="text-primary-blue font-medium cursor-pointer hover:underline">{order.seller?.name || "Club"}</span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-heading-small text-text-primary">Rs.{parseFloat(order.total).toFixed(2)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-md mt-lg">
          <div className="px-md py-sm rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 min-w-[80px]">
            <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">Size</span>
            <span className="text-body-small-bold text-text-primary">{order.size || "Standard"}</span>
          </div>
          <div className="px-md py-sm rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 min-w-[80px]">
            <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">Color</span>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: order.colorHex || '#2B8CEE' }} />
              <span className="text-body-small-bold text-text-primary">{order.color || "Default"}</span>
            </div>
          </div>
          <div className="px-md py-sm rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 min-w-[60px]">
            <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">Qty</span>
            <span className="text-body-small-bold text-text-primary">{order.qty || 1}</span>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

export default ProductInfoCard;
