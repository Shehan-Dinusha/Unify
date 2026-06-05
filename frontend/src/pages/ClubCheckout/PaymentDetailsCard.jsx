import React from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { ArrowRight } from "lucide-react";

const PaymentDetailsCard = ({ subtotal, total, loading, onProceed }) => (
  <Card variant="card" className="border-white/5" padding="p-md md:p-xl pb-24 md:pb-xl">
    <h2 className="text-body-large-bold md:text-heading-small font-bold text-text-primary mb-lg md:mb-xl">Payment Details</h2>

    <div className="space-y-sm md:space-y-md">
      <div className="flex justify-between items-center text-body-small md:text-body-medium">
        <span className="text-text-secondary">Subtotal</span>
        <span className="text-text-primary font-bold">Rs.{subtotal.toFixed(2)}</span>
      </div>
    </div>

    <div className="my-lg md:my-xl h-px bg-white/10" />

    <div className="flex justify-between items-center mb-lg md:mb-xl">
      <span className="text-body-large-bold md:text-heading-small font-bold text-text-primary">Total</span>
      <span className="text-body-large-bold md:text-heading-small font-bold text-text-primary">Rs.{total.toFixed(2)}</span>
    </div>

    <p className="mt-md md:mt-lg text-[10px] md:text-[11px] text-text-tertiary text-center leading-relaxed">
      By <span className="font-semibold">proceeding</span>, you agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Return Policy</a>.
    </p>

    <div className="mt-md md:mt-xl mb-md md:mb-0 p-sm md:p-md bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-center gap-md md:gap-lg">
      <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-4 md:h-5" />
      <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-4 md:h-5" />
      <img src="https://img.icons8.com/color/48/000000/apple-pay.png" alt="Apple Pay" className="h-4 md:h-5" />
    </div>

    <div className="fixed bottom-0 left-0 right-0 z-50 p-md bg-[#0D1A26]/90 backdrop-blur-lg border-t border-white/10 md:static md:z-auto md:p-0 md:bg-transparent md:backdrop-blur-none md:border-t-0 md:mt-lg">
      <Button variant="primary" className="w-full justify-center py-sm md:py-lg group"
        icon={ArrowRight} iconPosition="right" loading={loading} onClick={onProceed}>
        Proceed to Payment
      </Button>
    </div>
  </Card>
);

export default PaymentDetailsCard;
