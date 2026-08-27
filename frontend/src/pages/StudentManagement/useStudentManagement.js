import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { getStudentDirectory, getStudentStats } from '../../services/studentService';

export const useStudentManagement = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Students');
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_LIMIT = 10;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getStudentStats();
        const d = result.data || {};
        setStats([
          { value: d.activityRate || '0%', label: 'Activity Rate', cardBg: 'bg-gradient-to-br from-state-success/10 to-transparent' },
          { value: String(d.verifiedIdentities ?? 0), label: 'Verified Identities', cardBg: 'bg-gradient-to-br from-primary-blue/10 to-transparent' },
          { value: String(d.flaggedSessions ?? 0), label: 'Flagged Sessions', cardBg: 'bg-gradient-to-br from-state-warning/10 to-transparent' },
        ]);
      } catch (err) {
        toast.error('Connection Error', 'Failed to load student stats. Please check your backend.');
      }
    };
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, facultyFilter]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getStudentDirectory({
          search: searchQuery,
          status: statusFilter,
          faculty: facultyFilter,
          page: currentPage,
          limit: PAGE_LIMIT,
        });
        const data = result.data || {};
        setStudents(data.students || []);
        setTotalCount(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / PAGE_LIMIT));
      } catch (err) {
        setError('Failed to connect to the server. Please make sure the backend is running.');
        toast.error('Connection Error', 'Failed to load student directory.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, facultyFilter, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFilter('All Students');
    setFacultyFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return {
    stats,
    students,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    facultyFilter,
    setFacultyFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    PAGE_LIMIT,
    handleResetFilters,
    navigate,
  };
};
