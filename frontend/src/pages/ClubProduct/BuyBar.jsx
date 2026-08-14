import React from 'react';
import Button from '../../components/common/Button';
import { Minus, Plus, MapPin } from 'lucide-react';

const BuyBar = ({ qty, onQtyChange, onBuy, pickupNote }) => (
    <>
        <div className="fixed bottom-0 left-0 right-0 z-50 p-md bg-dark-1/90 backdrop-blur-lg border-t border-white/10 md:static md:z-auto md:p-0 md:bg-transparent md:backdrop-blur-none md:border-t-0 md:mt-2xl">
            <div className="flex items-center gap-md flex-wrap">
                <div className="h-12 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center overflow-hidden">
                    <button type="button" onClick={() => onQtyChange(Math.max(1, qty - 1))}
                        className="w-12 md:w-14 h-12 md:h-14 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                        <Minus size={18} />
                    </button>
                    <div className="w-10 md:w-14 text-center text-body-medium-bold text-text-primary">{qty}</div>
                    <button type="button" onClick={() => onQtyChange(qty + 1)}
                        className="w-12 md:w-14 h-12 md:h-14 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                        <Plus size={18} />
                    </button>
                </div>

                <Button variant="primary" size="large" className="flex-1 min-w-0 md:min-w-[260px] justify-center !bg-primary-blue !text-white" onClick={onBuy}>
                    Buy Now
                </Button>
            </div>
            <div className="mt-lg p-md rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-md">
                <div className="p-xs rounded-lg bg-primary-blue/10 text-primary-blue shrink-0 mt-0.5">
                    <MapPin size={16} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] md:text-body-extra-small-bold text-text-tertiary uppercase tracking-wider mb-1">Pickup Information</p>
                    <p className="text-body-small text-text-secondary leading-relaxed">
                        {pickupNote || 'Ready for pickup once order is confirmed. Check your email for further instructions.'}
                    </p>
                </div>
            </div>
        </div>
        <div className="h-28 md:hidden" />
    </>
);

export default BuyBar;
