import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, ShoppingBag, ArrowUpRight, GraduationCap } from 'lucide-react';

export const transactions = [
    { id: 'tx1', label: 'Winter Gala Ticket Sales', date: 'Oct 24, 2024', amount: '+Rs.450.00', positive: true, status: 'Completed', icon: 'Ticket', iconBg: 'bg-purple-500/20', iconColor: 'text-purple-400' },
    { id: 'tx2', label: 'Club Hoodies Pre-order', date: 'Oct 23, 2024', amount: '+Rs.1,200.00', positive: true, status: 'Completed', icon: 'ShoppingBag', iconBg: 'bg-pink-500/20', iconColor: 'text-pink-400' },
    { id: 'tx3', label: 'Withdrawal to Bank Account', date: 'Oct 20, 2024', amount: '-Rs.500.00', positive: false, status: 'Processed', icon: 'ArrowUpRight', iconBg: 'bg-white/10', iconColor: 'text-text-secondary' },
    { id: 'tx4', label: 'Math Tutoring Services', date: 'Oct 24, 2024', amount: '+Rs.60.00', positive: true, status: 'Pending', icon: 'GraduationCap', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400' },
];

export const statusStyle = {
    Completed: 'bg-state-success/15 text-state-success border border-state-success/20',
    Processed: 'bg-white/8 text-text-secondary border border-white/10',
    Pending: 'bg-state-warning/15 text-state-warning border border-state-warning/20',
};

export const transactionIconMap = {
    Ticket,
    ShoppingBag,
    ArrowUpRight,
    GraduationCap,
};

export const useClubWalletPage = () => {
    const navigate = useNavigate();
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleWithdrawConfirm = () => {
        setShowWithdraw(false);
        setShowSuccess(true);
    };

    const user = {
        name: 'Alex Johnson',
        role: 'club',
        displayRole: 'Clubs & Societies Dashboard',
    };

    return {
        navigate, user,
        showWithdraw, setShowWithdraw,
        showSuccess, setShowSuccess,
        handleWithdrawConfirm,
    };
};
