import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { BankIcon } from '../../components/common/Icons';

const WithdrawModal = ({ onClose, onConfirm }) => {
    const [amount, setAmount] = useState('');
    const numericAmount = parseFloat(amount) || 0;
    const serviceFee = +(numericAmount * 0.015).toFixed(2);
    const total = +(numericAmount + serviceFee).toFixed(2);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-dark-1/70 backdrop-blur-md" onClick={onClose} />
            <Card variant="card" padding="p-0" className="relative w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 shadow-2xl">
                <div className="px-7 pt-7 pb-5 text-center">
                    <h3 className="text-xl font-bold text-white">Withdraw Balance</h3>
                </div>

                <div className="bg-white/5 border border-white/10 mx-4 rounded-2xl px-6 py-5 text-center mb-5">
                    <p className="text-text-secondary text-sm mb-1">Available Balance</p>
                    <p className="text-4xl font-bold text-white tracking-tight">Rs.1,240.50</p>
                </div>

                <div className="px-6 pb-7 flex flex-col gap-5">
                    <div>
                        <label className="text-base font-semibold text-white block mb-2">Withdrawal Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-base focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                        />
                    </div>

                    <div>
                        <label className="text-base font-semibold text-white block mb-2">To Bank Account:</label>
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                <BankIcon className="w-5 h-5 text-text-secondary" />
                            </div>
                            <div>
                                <p className="text-white text-base font-medium">Chase Checking</p>
                                <p className="text-text-secondary text-sm">**** **** **** 4829</p>
                            </div>
                        </div>
                    </div>

                    {numericAmount > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex flex-col gap-2.5">
                            <div className="flex justify-between text-base text-text-secondary">
                                <span>Withdrawal Amount</span>
                                <span>${numericAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base text-text-secondary">
                                <span>Service Fee (1.5%)</span>
                                <span>${serviceFee.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-white/10 mt-1 pt-2.5 flex justify-between text-base font-bold text-white">
                                <span>Total Deducted</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 mt-1">
                        <Button onClick={onClose} variant="outline" className="flex-1 justify-center">Cancel</Button>
                        <Button onClick={onConfirm} variant="primary" className="flex-1 justify-center shadow-[0_0_20px_rgba(43,140,238,0.4)]">Confirm Withdrawal</Button>
                    </div>

                    <p className="text-text-secondary text-xs text-center mt-2"></p>
                </div>
            </Card>
        </div>
    );
};

export default WithdrawModal;
