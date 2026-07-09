import React from 'react';
import Card from '../../components/common/Card';
import { ArrowUp, Coins, DollarSign } from 'lucide-react';

const BalanceCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card variant="card" padding="p-6" className="bg-[#1A2F45]/60 border-white/5">
            <div className="flex flex-col gap-4">
                <span className="text-text-secondary text-sm font-medium">Available Balance</span>
                <span className="text-4xl font-bold tracking-tight">Rs.2,850.00</span>
                <div className="flex items-center gap-1.5 bg-state-success/15 border border-state-success/20 text-state-success px-3 py-1 rounded-full w-fit text-sm font-bold">
                    <ArrowUp className="w-3 h-3" />
                    +12.5% this month
                </div>
            </div>
        </Card>

        <Card variant="card" padding="p-6" className="bg-[#1A2F45]/60 border-white/5">
            <div className="flex flex-col gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-400/20 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-text-secondary text-sm font-medium">Pending Clearance</span>
                <span className="text-3xl font-bold">Rs.420.00</span>
                <span className="text-text-secondary text-sm">Clears in 2&ndash;3 business days</span>
            </div>
        </Card>

        <Card variant="card" padding="p-6" className="bg-[#1A2F45]/60 border-white/5">
            <div className="flex flex-col gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-blue/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary-blue" />
                </div>
                <span className="text-text-secondary text-sm font-medium">Total Lifetime Earnings</span>
                <span className="text-3xl font-bold">Rs.15,340.00</span>
                <span className="text-text-secondary text-sm">Since Sep 2023</span>
            </div>
        </Card>
    </div>
);

export default BalanceCards;
