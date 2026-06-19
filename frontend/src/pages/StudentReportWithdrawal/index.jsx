import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import Overlay from "../../components/common/Overlay";
import { useStudentReportWithdrawal } from "./useStudentReportWithdrawal";
import WithdrawalForm from "./WithdrawalForm";

const StudentReportWithdrawal = () => {
  const { navigate, user, reason, setReason, submitting, loading, displayId, handleConfirm, handleCancel } = useStudentReportWithdrawal();

  if (loading) {
    return (
      <MainLayout user={user} pageTitle="Report Withdrawal" verificationCount={0}>
        <Overlay open={true} className="!transition-none"><p className="text-text-secondary">Loading...</p></Overlay>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} pageTitle="Report Withdrawal" verificationCount={0}>
      <Overlay open={true} className="overflow-y-auto">
        <WithdrawalForm displayId={displayId} reason={reason} onReasonChange={setReason}
          submitting={submitting} onConfirm={handleConfirm} onCancel={handleCancel} />
      </Overlay>
    </MainLayout>
  );
};

export default StudentReportWithdrawal;
