import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { fetchAllReports, getReportStats } from '../../services/reportService';

export const useReportModeration = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getReportStats();
                const d = result.data || {};
                setStats([
                    { icon: 'TrendingUp', iconBg: 'bg-state-warning/20', iconColor: 'text-state-warning', value: String(d.totalPending ?? 0), label: 'Total Pending', cardBg: 'bg-gradient-to-br from-state-warning/10 to-transparent' },
                    { icon: 'ShieldAlert', iconBg: 'bg-state-error/20', iconColor: 'text-state-error', value: String(d.criticalFlags ?? 0), label: 'Critical Flags', cardBg: 'bg-gradient-to-br from-state-error/10 to-transparent' },
                    { icon: 'ShieldCheck', iconBg: 'bg-state-success/20', iconColor: 'text-state-success', value: String(d.resolvedToday ?? 0), label: 'Resolved Today', cardBg: 'bg-gradient-to-br from-state-success/10 to-transparent' },
                ]);
            } catch (err) {
                toast.error('Connection Error', 'Failed to load report stats. Please check your backend.');
            }
        };
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const loadReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await fetchAllReports({
                    type: filterType,
                    status: filterStatus,
                });
                setReports(result.data || []);
            } catch (err) {
                setError('Failed to connect to the server. Please make sure the backend is running.');
                toast.error('Connection Error', 'Failed to load report queue.');
            } finally {
                setLoading(false);
            }
        };
        loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterType, filterStatus]);

    const typeOptions = [
        { value: '', label: 'All Report Types' },
        { value: 'Inappropriate Content', label: 'Inappropriate Content' },
        { value: 'Spam', label: 'Spam' },
        { value: 'Harassment', label: 'Harassment' },
        { value: 'Misinformation', label: 'Misinformation' },
        { value: 'Other', label: 'Other' },
    ];

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'Pending', label: '\u25CF Pending' },
        { value: 'In Review', label: '\u25CF In Review' },
        { value: 'Resolved', label: '\u25CF Resolved' },
        { value: 'Dismissed', label: '\u25CF Dismissed' },
        { value: 'Withdrawn', label: '\u25CF Withdrawn' },
    ];

    const viewDetails = (r) => navigate(`/report-moderation/${r.id}`);

    const handleResetFilters = () => {
        setFilterType('');
        setFilterStatus('');
    };

    return {
        stats, reports, loading, error,
        filterType, setFilterType,
        filterStatus, setFilterStatus,
        typeOptions, statusOptions,
        viewDetails, handleResetFilters, navigate,
    };
};
