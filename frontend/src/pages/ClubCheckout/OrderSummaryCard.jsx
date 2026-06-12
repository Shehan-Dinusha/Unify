import React from "react";
import Card from "../../components/common/Card";
import { ShoppingBag } from "lucide-react";
import { getImageUrl } from "../../utils/formatters";

const OrderSummaryCard = ({ product, selectedColor, selectedSize, quantity, subtotal, onBack }) => (
  <Card variant="card" className="border-white/5" padding="p-md md:p-xl">
    <div className="flex items-center gap-md mb-lg md:mb-xl">
      <div className="p-xs md:p-sm rounded-xl bg-primary-blue/10 text-primary-blue">
        <ShoppingBag size={20} />
      </div>
      <h2 className="text-body-large-bold md:text-heading-small font-bold text-text-primary">Order Summary</h2>
    </div>

    <div className="flex gap-md md:gap-xl items-start">
      <div className="w-20 h-20 md:w-32 md:h-32 aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
        <img src={getImageUrl(product.images?.[0] || product.image || product.coverImage)} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="md:flex md:justify-between md:items-start md:gap-sm">
          <div>
            <h3 className="text-body-medium-bold md:text-body-large-bold text-text-primary leading-snug md:truncate">{product.name}</h3>
            <p className="text-body-extra-small md:text-body-small text-text-tertiary mt-xs md:truncate">
              {product.author?.name || "Club"} · {product.category || "Official Merchandise"}
            </p>
          </div>
          <p className="text-body-medium-bold md:text-body-large-bold text-text-primary shrink-0 mt-xs md:mt-0">Rs.{subtotal.toFixed(2)}</p>
        </div>

        <div className="mt-md md:mt-lg flex flex-wrap gap-xs md:gap-sm">
          {selectedSize && (
            <div className="px-sm md:px-md py-xs rounded-full bg-white/5 border border-white/10 flex items-center gap-xs">
              <span className="text-[10px] md:text-body-extra-small text-text-tertiary">{product.postType === "club-event" ? "Ticket:" : "Size:"}</span>
              <span className="text-[10px] md:text-body-extra-small-bold text-text-primary uppercase">{selectedSize}</span>
            </div>
          )}
          {selectedColor && (
            <div className="px-sm md:px-md py-xs rounded-full bg-white/5 border border-white/10 flex items-center gap-xs">
              <span className="text-[10px] md:text-body-extra-small text-text-tertiary">Color:</span>
              <div className="flex items-center gap-xs">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                <span className="text-[10px] md:text-body-extra-small-bold text-text-primary uppercase">{selectedColor.name}</span>
              </div>
            </div>
          )}
          <div className="px-sm md:px-md py-xs rounded-full bg-white/5 border border-white/10 flex items-center gap-xs">
            <span className="text-[10px] md:text-body-extra-small text-text-tertiary">Qty:</span>
            <span className="text-[10px] md:text-body-extra-small-bold text-text-primary">{quantity}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-lg md:mt-xl pt-md md:pt-lg border-t border-white/5 flex justify-end">
      <button onClick={onBack}
        className="flex items-center gap-xs text-body-extra-small-bold md:text-body-small-bold text-primary-blue hover:underline">
        Edit Selection
      </button>
    </div>
  </Card>
);

export default OrderSummaryCard;
