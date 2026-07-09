import React from "react";
import Button from "../../components/common/Button";
import { ClipboardList, ArrowRight } from "lucide-react";

const ActionButtons = ({ onViewOrders, onContinueShopping }) => (
  <div className="mx-md md:mx-2xl mt-xl mb-xl md:mb-2xl flex flex-col md:flex-row gap-md">
    <Button variant="secondary" size="medium" className="w-full md:flex-1 justify-center py-md" icon={ClipboardList} onClick={onViewOrders}>
      View My Orders
    </Button>
    <Button variant="primary" size="medium" className="w-full md:flex-1 justify-center py-md" icon={ArrowRight} iconPosition="right" onClick={onContinueShopping}>
      Continue Shopping
    </Button>
  </div>
);

export default ActionButtons;
