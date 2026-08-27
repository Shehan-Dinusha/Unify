import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { getMyReports } from '../../services/reportService';
import { getCurrentUser } from '../../services/authService';

export const useStudentSubmittedReports = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Reports');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = getCurrentUser() || { name: 'Student', role: 'student' };

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getMyReports({ status: statusFilter, category: categoryFilter, search: searchQuery });
        setReports(result.data?.reports || []);
      } catch (err) {
        setError('Failed to connect to the server. Please make sure the backend is running.');
        toast.error('Connection Error', 'Failed to load your reports.');
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFilter('All Reports');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  return {
    reports, loading, error, user,
    searchQuery, setSearchQuery,
    activeFilter, setActiveFilter,
    statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter,
    handleResetFilters, navigate,
  };
};
