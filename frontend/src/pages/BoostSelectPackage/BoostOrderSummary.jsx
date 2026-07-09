import React from 'react';
import { Zap } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const BoostOrderSummary = ({ selectedPkg, durationLabel, subtotal, tax, total, onBoostNow }) => (
  <div className="lg:col-span-2">
    <Card variant="card" padding="p-lg" className="h-full flex flex-col">
      <h3 className="text-body-large-bold text-text-primary font-inter mb-lg">Order Summary</h3>

      <div className="flex flex-col gap-sm flex-1">
        <div className="flex items-center justify-between py-xs">
          <span className="text-body-small text-text-secondary font-inter">Selected Package</span>
          <span className="text-body-small-bold text-text-primary font-inter">{selectedPkg.name} ({durationLabel})</span>
        </div>
        <div className="h-px bg-white/10 w-full" />
        <div className="flex items-center justify-between py-xs">
          <span className="text-body-small text-text-secondary font-inter">Subtotal</span>
          <span className="text-body-small text-text-primary font-inter">Rs. {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between py-xs">
          <span className="text-body-small text-text-secondary font-inter">Tax (Estimated)</span>
          <span className="text-body-small text-text-primary font-inter">Rs. {tax.toFixed(2)}</span>
        </div>
        <div className="h-px bg-white/10 w-full" />
        <div className="flex items-center justify-between py-sm">
          <span className="text-body-medium-bold text-text-primary font-inter">Total Due</span>
          <span className="text-body-medium-bold text-state-error font-inter">Rs. {total.toFixed(2)}</span>
        </div>
      </div>

      <Button onClick={onBoostNow} variant="gradient" fullWidth size="medium" className="h-10 mt-md gap-2">
        <Zap size={15} />
        Boost Now
      </Button>
    </Card>
  </div>
);

export default BoostOrderSummary;
