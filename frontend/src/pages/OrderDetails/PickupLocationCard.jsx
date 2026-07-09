import React from "react";
import Card from "../../components/common/Card";
import { MapPin } from "lucide-react";

const PickupLocationCard = ({ order }) => (
  <Card variant="card" padding="p-xl" className="bg-white/[0.03] border-white/5 flex flex-col h-full">
    <h3 className="text-body-large-bold text-text-primary mb-lg">Pickup Location</h3>
    <div className="flex items-start gap-md">
      <div className="p-sm rounded-xl bg-primary-blue/10 text-primary-blue shrink-0">
        <MapPin size={20} />
      </div>
      <div>
        <p className="text-body-small text-text-secondary leading-relaxed">
          {order.pickupLocation || "Pickup details will be provided once order is ready."}
        </p>
      </div>
    </div>
  </Card>
);

export default PickupLocationCard;
