import React from 'react';
import Card from '../../components/common/Card';
import { transactions, statusStyle, transactionIconMap } from './useClubWalletPage';

const TransactionTable = () => (
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
                    {transactions.map((tx, i) => {
                        const Icon = transactionIconMap[tx.icon];
                        return (
                            <tr key={tx.id} className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${i === transactions.length - 1 ? 'border-b-0' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-xl ${tx.iconBg} flex items-center justify-center shrink-0`}>
                                            {Icon && <Icon className={`w-4 h-4 ${tx.iconColor}`} />}
                                        </div>
                                        <span className="font-medium text-base">{tx.label}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center text-text-secondary text-sm">{tx.date}</td>
                                <td className={`px-6 py-4 text-center font-bold text-base ${tx.positive ? 'text-state-success' : 'text-text-secondary'}`}>{tx.amount}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle[tx.status]}`}>{tx.status}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </Card>
);

export default TransactionTable;
