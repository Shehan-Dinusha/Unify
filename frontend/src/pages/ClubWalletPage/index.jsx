import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { useClubWalletPage } from './useClubWalletPage';
import BalanceCards from './BalanceCards';
import TransactionTable from './TransactionTable';
import WithdrawModal from './WithdrawModal';
import WithdrawSuccessModal from './WithdrawSuccessModal';

const ClubWalletPage = () => {
    const {
        user,
        showWithdraw, setShowWithdraw,
        showSuccess, setShowSuccess,
        handleWithdrawConfirm,
    } = useClubWalletPage();

    return (
        <MainLayout user={user} pageTitle="Wallet" verificationCount={0}>
            <div className="flex flex-col gap-8 pb-12">
                <BalanceCards />

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
                    <TransactionTable />
                </div>
            </div>

            {showWithdraw && (
                <WithdrawModal
                    onClose={() => setShowWithdraw(false)}
                    onConfirm={handleWithdrawConfirm}
                />
            )}
            {showSuccess && <WithdrawSuccessModal onClose={() => setShowSuccess(false)} />}
        </MainLayout>
    );
};

export default ClubWalletPage;
