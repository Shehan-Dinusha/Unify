import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import { mockStudentReports } from "../data/mockReportData";
import { X, Info, AlertTriangle } from "lucide-react";

const StudentReportWithdrawal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const report = mockStudentReports.find((r) => r.id === id);
  const [reason, setReason] = useState("");

  const user = { name: "Alex Johnson", role: "student" };

  const handleConfirm = () => {
    navigate(`/student/reports/${id}/withdraw/success`);
  };

  const handleCancel = () => {
    navigate(`/student/reports/${id}`);
  };

  const displayId = report ? report.reportId : `#RPT-${id}`;

  return (
    <MainLayout user={user} pageTitle="Report Withdrawal" verificationCount={0}>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
        <div className="min-h-full flex items-center justify-center px-4 py-10">
          <Card
            variant="card"
            padding="p-0"
            className="w-full max-w-[440px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl"
          >
            <div className="p-lg flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-state-warning/10 rounded-full flex items-center justify-center">
                  <AlertTriangle size={20} className="text-state-warning" />
                </div>
                <div>
                  <h3 className="text-body-large-bold text-text-primary">
                    Withdraw Report
                  </h3>
                  <p className="text-body-extra-small text-text-secondary">
                    Report ID:{" "}
                    <span className="text-primary-blue">{displayId}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-primary-blue/5 border border-primary-blue/20 rounded-xl p-md mb-5 flex items-start gap-3">
              <Info size={18} className="text-primary-blue flex-shrink-0 mt-0.5" />
              <p className="text-body-small text-text-secondary leading-relaxed">
                You are initiating the withdrawal process for{" "}
                <span className="text-text-primary font-semibold">
                  Report {displayId}
                </span>
                . This action will immediately halt the ongoing investigation.
              </p>
            </div>

            {/* Reason */}
            <div className="mb-4">
              <label className="text-body-small-bold text-text-primary mb-2 block">
                Reason for withdrawal{" "}
                <span className="text-text-tertiary font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please briefly explain why you are withdrawing this report..."
                className="w-full h-24 bg-white/5 rounded-2xl border border-white/10 p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors"
              />
            </div>

            {/* Record Retention */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-md mb-6 flex items-start gap-3">
              <Info size={16} className="text-text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-body-small-bold text-text-primary">Record Retention Policy</span>
                <p className="text-body-extra-small text-text-secondary mt-0.5 leading-relaxed">
                  While the investigation will stop, a record of this withdrawal
                  and the original submission may be archived by the
                  administration for audit purposes.
                </p>
              </div>
            </div>

            {/* Buttons — same pattern as admin modals */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirm}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              >
                <AlertTriangle size={18} /> Confirm Withdrawal
              </button>
              <button
                onClick={handleCancel}
                className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </MainLayout>
);
};

export default StudentReportWithdrawal;
