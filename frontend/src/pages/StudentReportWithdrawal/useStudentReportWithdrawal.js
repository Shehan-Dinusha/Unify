import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../components/common/Toast";
import { getMyReportById, withdrawMyReport } from "../../services/reportService";
import { getCurrentUser } from "../../services/authService";

export const useStudentReportWithdrawal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser() || { name: "Student", role: "student" };

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getMyReportById(id);
        setReport(result.data);
      } catch (err) {
        toast.error('Error', 'Could not load report data.');
      } finally { setLoading(false); }
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
      const msg = err.response?.data?.message || 'Failed to withdraw report.';
      toast.error('Withdrawal Failed', msg);
    } finally { setSubmitting(false); }
  };

  const handleCancel = () => navigate(`/student/reports/${id}`);

  const displayId = report ? report.reportId : `#RPT-${id}`;

  return { navigate, user, reason, setReason, submitting, report, loading, displayId, handleConfirm, handleCancel };
};
