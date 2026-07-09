import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CheckCircle2, Lock, Loader2 } from 'lucide-react';

const OrderSummary = ({ dailyRate, durationDays, subtotal, tax, total, isPurchasing, onProceed, onModify }) => (
  <div className="sticky top-24">
    <Card variant="card" padding="p-lg">
      <h3 className="text-body-large-bold text-text-primary font-inter mb-lg">Order Summary</h3>

      <div className="flex flex-col gap-sm">
        <div className="flex items-center justify-between py-xs">
          <span className="text-body-small text-text-secondary font-inter">Daily Rate</span>
          <span className="text-body-small text-text-primary font-inter">Rs. {dailyRate.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between py-xs">
          <span className="text-body-small text-text-secondary font-inter">Duration</span>
          <span className="text-body-small text-text-primary font-inter">{durationDays} Days</span>
        </div>
        <div className="h-px bg-white/10 w-full" />
        <div className="flex items-center justify-between py-xs">
          <span className="text-body-small text-text-secondary font-inter">Subtotal</span>
          <span className="text-body-small text-text-primary font-inter">Rs. {subtotal.toLocaleString()}.00</span>
        </div>
        <div className="flex items-center justify-between py-xs">
          <span className="text-body-small text-text-secondary font-inter">Tax (VAT 0%)</span>
          <span className="text-body-small text-text-primary font-inter">Rs. {tax.toFixed(2)}</span>
        </div>
        <div className="h-px bg-white/10 w-full" />
        <div className="flex items-center justify-between py-sm">
          <span className="text-body-large-bold text-text-primary font-inter">Total</span>
          <span className="text-heading-small text-text-primary font-inter font-bold">Rs. {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-lg flex flex-col gap-3">
        <Button onClick={onProceed} disabled={isPurchasing} variant="gradient" fullWidth size="medium" className="gap-2.5">
          {isPurchasing ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <><Lock size={16} /> Proceed to Payment</>}
        </Button>
        <button onClick={onModify} disabled={isPurchasing}
          className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-50">
          Modify Package
        </button>
      </div>

      <div className="flex items-center justify-center gap-lg mt-md">
        <span className="text-body-extra-small text-text-secondary font-inter flex items-center gap-1"><CheckCircle2 size={12} className="text-state-success" /> Secure</span>
        <span className="text-body-extra-small text-text-secondary font-inter flex items-center gap-1"><CheckCircle2 size={12} className="text-state-success" /> Money-back</span>
        <span className="text-body-extra-small text-text-secondary font-inter flex items-center gap-1"><CheckCircle2 size={12} className="text-state-success" /> Support</span>
      </div>
    </Card>
  </div>
);

export default OrderSummary;
