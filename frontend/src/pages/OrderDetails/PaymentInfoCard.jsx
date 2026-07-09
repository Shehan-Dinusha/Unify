import React from "react";
import Card from "../../components/common/Card";
import { ShieldCheck, CreditCard } from "lucide-react";

const PaymentInfoCard = ({ order }) => (
  <Card variant="card" padding="p-xl" className="bg-white/[0.03] border-white/5 flex flex-col h-full">
    <h3 className="text-body-large-bold text-text-primary mb-lg">Payment Information</h3>
    <div className="flex items-center gap-md mb-lg">
      <div className="p-sm rounded-xl bg-white/5 border border-white/10 shrink-0">
        <CreditCard size={20} className="text-text-secondary" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-5 bg-[#EB001B] rounded-sm relative overflow-hidden flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#FF5F00] translate-x-1" />
            <div className="w-3 h-3 rounded-full bg-[#F79E1B] -translate-x-1" />
          </div>
          <span className="text-body-medium-bold text-text-primary uppercase">{order.paymentMethod}</span>
        </div>
      </div>
    </div>
    <div className="px-lg py-sm rounded-2xl bg-state-success/5 border border-state-success/10 flex items-center gap-sm mt-auto">
      <ShieldCheck size={16} className="text-state-success" />
      <span className="text-[11px] font-bold text-state-success uppercase tracking-wider">Payment Verified</span>
    </div>
  </Card>
);

export default PaymentInfoCard;
