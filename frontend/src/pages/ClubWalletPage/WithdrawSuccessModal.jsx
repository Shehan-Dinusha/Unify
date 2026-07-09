import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Check } from 'lucide-react';

const WithdrawSuccessModal = ({ onClose }) => (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-dark-1/70 backdrop-blur-md" onClick={onClose} />
        <Card variant="card" padding="p-10" className="relative w-full max-w-sm flex flex-col items-center text-center overflow-hidden animate-in fade-in zoom-in duration-200 shadow-2xl">
            <div className="w-20 h-20 rounded-full border-2 border-state-success/30 flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 rounded-full border border-state-success animate-ping opacity-20" />
                <div className="w-14 h-14 rounded-full bg-state-success/10 flex items-center justify-center">
                    <Check className="w-8 h-8 text-state-success" strokeWidth={3} />
                </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-8">Withdraw Successful!</h3>

            <Button onClick={onClose} variant="outline" className="w-full max-w-[200px] justify-center">
                Back to wallet
            </Button>
        </Card>
    </div>
);

export default WithdrawSuccessModal;
