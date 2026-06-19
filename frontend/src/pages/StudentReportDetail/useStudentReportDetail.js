import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { getMyReportById } from '../../services/reportService';
import { getCurrentUser } from '../../services/authService';

export const useStudentReportDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const user = getCurrentUser() || { name: 'Student', role: 'student' };
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getMyReportById(id);
        setReport(result.data);
      } catch (err) {
        console.error('[StudentReportDetail] Failed to load:', err);
        setError('Failed to load report details. Please check the backend.');
        toast.error('Connection Error', 'Failed to load report details.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [id]);

  return { report, loading, error, user, navigate };
};
