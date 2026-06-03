import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Overlay from "../components/common/Overlay";
import { useToast } from "../components/common/Toast";
import { getMyReportById, withdrawMyReport } from "../services/reportService";
import { getCurrentUser } from "../services/authService";
import { X, Info, AlertTriangle } from "lucide-react";

const StudentReportWithdrawal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser() || { name: "Student", role: "student" };

  // ── Load report to get display ID and internal ID ──────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const result = await getMyReportById(id);
        setReport(result.data);
      } catch (err) {
        console.error('[Withdrawal] Failed to load report:', err);
        toast.error('Error', 'Could not load report data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const internalId = report?.internalId || id;
      await withdrawMyReport(internalId, reason);
      toast.success('Report Withdrawn', 'Your report has been withdrawn successfully.');
      navigate(`/student/reports/${id}/withdraw/success`);
    } catch (err) {
      console.error('[Withdrawal] Failed:', err);
      const msg = err.response?.data?.message || 'Failed to withdraw report.';
      toast.error('Withdrawal Failed', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/student/reports/${id}`);
  };

  const displayId = report ? report.reportId : `#RPT-${id}`;

  if (loading) {
    return (
      <MainLayout user={user} pageTitle="Report Withdrawal" verificationCount={0}>
        <Overlay open={true} className="!transition-none">
          <p className="text-text-secondary">Loading...</p>
        </Overlay>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} pageTitle="Report Withdrawal" verificationCount={0}>
      {/* Modal Overlay */}
      <Overlay open={true} className="overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-10">
          <Card
            variant="modal"
            padding="p-0"
            className=""
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
              <Button
                onClick={handleConfirm}
                disabled={submitting}
                variant="gradient" fullWidth size="medium" className="gap-2.5"
              >
                <AlertTriangle size={18} /> {submitting ? 'Withdrawing...' : 'Confirm Withdrawal'}
              </Button>
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
    </Overlay>
  </MainLayout>
);
};

export default StudentReportWithdrawal;
