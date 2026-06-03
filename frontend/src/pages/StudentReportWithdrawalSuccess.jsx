import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import { getCurrentUser } from "../services/authService";
import { CheckCircle2, LayoutDashboard, FileText, RotateCcw } from "lucide-react";

const StudentReportWithdrawalSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = getCurrentUser() || { name: 'Student', role: 'student' };

  const displayId = `#RPT-${id}`;

  return (
    <MainLayout user={user} pageTitle="Report Withdrawal" verificationCount={0}>
      {/* Success Modal — same pattern as SuspendedUserSuccess / BoostPackageForm */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4 py-6 overflow-y-auto">
        <Card
          variant="modal"
          padding="p-0"
          className="my-auto"
        >
          <div className="p-6 sm:p-8 pb-4 sm:pb-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-state-success/5">
              <CheckCircle2
                size={28}
                className="text-state-success sm:hidden"
              />
              <CheckCircle2
                size={32}
                className="text-state-success hidden sm:block"
              />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
              Report Withdrawn Successfully
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 max-w-sm">
              Report{" "}
              <span className="text-primary-blue font-semibold">
                {displayId}
              </span>{" "}
              has been successfully withdrawn. The investigation has been halted
              and relevant parties have been notified.
            </p>
            <div className="w-full bg-white/5 rounded-2xl border border-white/10 p-md sm:p-lg mb-4 sm:mb-6">
              <div className="flex items-center justify-between py-xs sm:py-sm border-b border-white/10">
                <span className="text-body-extra-small text-text-secondary font-inter">
                  Report ID
                </span>
                <span className="text-body-extra-small sm:text-body-small-bold text-text-primary font-inter">
                  {displayId}
                </span>
              </div>
              <div className="flex items-center justify-between py-xs sm:py-sm border-b border-white/10">
                <span className="text-body-extra-small text-text-secondary font-inter">
                  Status
                </span>
                <span className="text-body-extra-small sm:text-body-small-bold text-state-warning font-inter">
                  Withdrawn
                </span>
              </div>
              <div className="flex items-center justify-between py-xs sm:py-sm">
                <span className="text-body-extra-small text-text-secondary font-inter">
                  Withdrawn On
                </span>
                <span className="text-body-extra-small sm:text-body-small-bold text-text-primary font-inter">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  •{" "}
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 sm:pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigate("/news-feed")}
              className="w-full h-11 sm:h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
            >
              <LayoutDashboard size={18} /> Return to Dashboard
            </button>
            <button
              onClick={() => navigate("/student/reports")}
              className="w-full h-11 sm:h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"
            >
              <RotateCcw size={18} className="text-text-secondary" /> View My
              Reports
            </button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StudentReportWithdrawalSuccess;
