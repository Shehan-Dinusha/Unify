import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { ArrowUp, Coins, DollarSign, Ticket, ShoppingBag, ArrowUpRight, GraduationCap, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ─── Mock data ─────────────────────────────────────────────── */
const transactions = [
    {
        id: "tx1",
        label: "Winter Gala Ticket Sales",
        date: "Oct 24, 2024",
        amount: "+Rs.450.00",
        positive: true,
        status: "Completed",
        icon: Ticket,
        iconBg: "bg-purple-500/20",
        iconColor: "text-purple-400",
    },
    {
        id: "tx2",
        label: "Club Hoodies Pre-order",
        date: "Oct 23, 2024",
        amount: "+Rs.1,200.00",
        positive: true,
        status: "Completed",
        icon: ShoppingBag,
        iconBg: "bg-pink-500/20",
        iconColor: "text-pink-400",
    },
    {
        id: "tx3",
        label: "Withdrawal to Bank Account",
        date: "Oct 20, 2024",
        amount: "-Rs.500.00",
        positive: false,
        status: "Processed",
        icon: ArrowUpRight,
        iconBg: "bg-white/10",
        iconColor: "text-text-secondary",
    },
    {
        id: "tx4",
        label: "Math Tutoring Services",
        date: "Oct 24, 2024",
        amount: "+Rs.60.00",
        positive: true,
        status: "Pending",
        icon: GraduationCap,
        iconBg: "bg-blue-500/20",
        iconColor: "text-blue-400",
    },
];

const statusStyle = {
    Completed: "bg-state-success/15 text-state-success border border-state-success/20",
    Processed: "bg-white/8 text-text-secondary border border-white/10",
    Pending: "bg-state-warning/15 text-state-warning border border-state-warning/20",
};

/* ─── Withdraw Successful Modal ─────────────────────────────── */
const WithdrawSuccessfulModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            {/* Blurred backdrop */}
            <div className="absolute inset-0 bg-dark-1/70 backdrop-blur-md" onClick={onClose} />

            {/* Modal */}
            <Card variant="card" padding="p-10" className="relative w-full max-w-sm flex flex-col items-center text-center overflow-hidden animate-in fade-in zoom-in duration-200 shadow-2xl">

                {/* Success Icon */}
                <div className="w-20 h-20 rounded-full border-2 border-state-success/30 flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 rounded-full border border-state-success animate-ping opacity-20" />
                    <div className="w-14 h-14 rounded-full bg-state-success/10 flex items-center justify-center">
                        <Check className="w-8 h-8 text-state-success" strokeWidth={3} />
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-8">Withdraw Successful!</h3>

                <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full max-w-[200px] justify-center"
                >
                    Back to wallet
                </Button>
            </Card>
        </div>
    );
};

/* ─── Withdraw Modal ─────────────────────────────────────────── */
const WithdrawModal = ({ onClose, onConfirm }) => {
    const [amount, setAmount] = useState("");

    const numericAmount = parseFloat(amount) || 0;
    const serviceFee = +(numericAmount * 0.015).toFixed(2);
    const total = +(numericAmount + serviceFee).toFixed(2);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Blurred backdrop */}
            <div className="absolute inset-0 bg-dark-1/70 backdrop-blur-md" onClick={onClose} />

            {/* Modal */}
            <Card variant="card" padding="p-0" className="relative w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 shadow-2xl">

                {/* Header bar */}
                <div className="px-7 pt-7 pb-5 text-center">
                    <h3 className="text-xl font-bold text-white">Withdraw Balance</h3>
                </div>

                {/* Available Balance */}
                <div className="bg-white/5 border border-white/10 mx-4 rounded-2xl px-6 py-5 text-center mb-5">
                    <p className="text-text-secondary text-sm mb-1">Available Balance</p>
                    <p className="text-4xl font-bold text-white tracking-tight">Rs.1,240.50</p>
                </div>

                <div className="px-6 pb-7 flex flex-col gap-5">
                    {/* Withdrawal Amount */}
                    <div>
                        <label className="text-base font-semibold text-white block mb-2">
                            Withdrawal Amount
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-base focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                        />
                    </div>

                    {/* To Bank Account */}
                    <div>
                        <label className="text-base font-semibold text-white block mb-2">
                            To Bank Account:
                        </label>
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                {/* Bank icon */}
                                <svg className="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white text-base font-medium">Chase Checking</p>
                                <p className="text-text-secondary text-sm">**** **** **** 4829</p>
                            </div>
                        </div>
                    </div>

                    {/* Fee Breakdown */}
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

                    {/* Buttons */}
                    <div className="flex gap-3 mt-1">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 justify-center"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            variant="primary"
                            className="flex-1 justify-center shadow-[0_0_20px_rgba(43,140,238,0.4)]"
                        >
                            Confirm Withdrawal
                        </Button>
                    </div>

                    {/* Footer note */}
                    <p className="text-text-secondary text-xs text-center mt-2">

                    </p>
                </div>
            </Card>
        </div>
    );
};

/* ─── Page ─────────────────────────────────────────────────── */
const ClubWalletPage = () => {
    const navigate = useNavigate();
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleWithdrawConfirm = () => {
        setShowWithdraw(false);
        setShowSuccess(true);
    };

    const user = {
        name: "Alex Johnson",
        role: "club",
        displayRole: "Clubs & Societies Dashboard",
    };

    return (
        <MainLayout user={user} pageTitle="Wallet" verificationCount={0}>
            <div className="flex flex-col gap-8 pb-12">

                {/* ── Balance Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Available Balance */}
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

                    {/* Pending Clearance */}
                    <Card variant="card" padding="p-6" className="bg-[#1A2F45]/60 border-white/5">
                        <div className="flex flex-col gap-3">
                            <div className="w-9 h-9 rounded-xl bg-orange-400/20 flex items-center justify-center">
                                <Coins className="w-5 h-5 text-orange-400" />
                            </div>
                            <span className="text-text-secondary text-sm font-medium">Pending Clearance</span>
                            <span className="text-3xl font-bold">Rs.420.00</span>
                            <span className="text-text-secondary text-sm">Clears in 2–3 business days</span>
                        </div>
                    </Card>

                    {/* Total Lifetime Earnings */}
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

                {/* ── Recent Transactions ── */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Recent Transactions</h3>
                        <button
                            onClick={() => setShowWithdraw(true)}
                            className="bg-primary-blue hover:bg-primary-blue/90 text-white font-bold px-5 py-2 rounded-full text-base transition-all shadow-[0_0_15px_rgba(43,140,238,0.35)]"
                        >
                            Withdraw
                        </button>
                    </div>

                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5 text-text-secondary text-xs uppercase tracking-wider">
                                        <th className="text-left px-6 py-4 font-medium">Transaction Detail</th>
                                        <th className="text-center px-6 py-4 font-medium">Date</th>
                                        <th className="text-center px-6 py-4 font-medium">Amount</th>
                                        <th className="text-right px-6 py-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx, i) => (
                                        <tr
                                            key={tx.id}
                                            className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${i === transactions.length - 1 ? "border-b-0" : ""}`}
                                        >
                                            {/* Detail */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl ${tx.iconBg} flex items-center justify-center shrink-0`}>
                                                        <tx.icon className={`w-4 h-4 ${tx.iconColor}`} />
                                                    </div>
                                                    <span className="font-medium text-base">{tx.label}</span>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 text-center text-text-secondary text-sm">{tx.date}</td>

                                            {/* Amount */}
                                            <td className={`px-6 py-4 text-center font-bold text-base ${tx.positive ? "text-state-success" : "text-text-secondary"}`}>
                                                {tx.amount}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle[tx.status]}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>

            {showWithdraw && (
                <WithdrawModal
                    onClose={() => setShowWithdraw(false)}
                    onConfirm={handleWithdrawConfirm}
                />
            )}
            {showSuccess && <WithdrawSuccessfulModal onClose={() => setShowSuccess(false)} />}
        </MainLayout>
    );
};

export default ClubWalletPage;
