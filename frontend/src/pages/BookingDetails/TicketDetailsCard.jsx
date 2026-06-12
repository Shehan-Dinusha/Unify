import React from "react";
import Card from "../../components/common/Card";
import { Ticket, ShieldCheck } from "lucide-react";

const TicketDetailsCard = ({ booking }) => (
  <Card variant="card" padding="p-xl" className="bg-white/[0.03] border-white/5 flex flex-col h-full">
    <h3 className="text-body-large-bold text-text-primary mb-lg flex items-center gap-2">
      <Ticket size={20} className="text-primary-blue" />
      Ticket Details
    </h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center py-2 border-b border-white/5">
        <span className="text-body-small text-text-secondary">Tier</span>
        <span className="text-body-small-bold text-text-primary uppercase">{booking.tierId || "Standard"}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-white/5">
        <span className="text-body-small text-text-secondary">Quantity</span>
        <span className="text-body-small-bold text-text-primary">{booking.qty}x</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-white/5">
        <span className="text-body-small text-text-secondary">Booking ID</span>
        <span className="text-body-small-bold text-text-primary font-mono text-[10px]">{booking.bookingId}</span>
      </div>
    </div>
    <div className="mt-auto pt-6 flex items-center gap-sm">
      <div className={`px-lg py-sm rounded-2xl flex items-center gap-sm flex-1 justify-center ${
        booking.paymentStatus === "PAID"
          ? "bg-state-success/5 border border-state-success/10 text-state-success"
          : "bg-state-warning/5 border border-state-warning/10 text-state-warning"
      }`}>
        <ShieldCheck size={16} />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          {booking.paymentStatus === "PAID" ? "Payment Verified" : "Payment Pending"}
        </span>
      </div>
    </div>
  </Card>
);

export default TicketDetailsCard;
