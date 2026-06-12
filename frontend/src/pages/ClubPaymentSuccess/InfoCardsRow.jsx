import React from "react";
import Card from "../../components/common/Card";
import { Mail, MapPin } from "lucide-react";

const InfoCardsRow = ({ order }) => (
  <div className="mx-md md:mx-2xl mt-md grid grid-cols-1 md:grid-cols-2 gap-md">
    <Card variant="container" padding="p-md md:p-lg">
      <div className="flex items-start gap-md">
        <div className="p-sm rounded-xl bg-primary-blue/10 text-primary-blue shrink-0">
          <Mail size={16} className="md:hidden" /><Mail size={18} className="hidden md:block" />
        </div>
        <div className="min-w-0">
          <p className="text-body-small-bold text-text-primary">Confirmation Email</p>
          <p className="text-[11px] md:text-body-extra-small text-text-tertiary mt-xs leading-relaxed">We've sent the details to your registered email.</p>
        </div>
      </div>
    </Card>
    <Card variant="container" padding="p-md md:p-lg">
      <div className="flex items-start gap-md">
        <div className="p-sm rounded-xl bg-primary-blue/10 text-primary-blue shrink-0">
          <MapPin size={16} className="md:hidden" /><MapPin size={18} className="hidden md:block" />
        </div>
        <div className="min-w-0">
          <p className="text-body-small-bold text-text-primary">Pickup Details</p>
          <p className="text-[11px] md:text-body-extra-small text-text-tertiary mt-xs leading-relaxed">{order.pickupLocation || "Ready for pickup once order is confirmed."}</p>
        </div>
      </div>
    </Card>
  </div>
);

export default InfoCardsRow;
