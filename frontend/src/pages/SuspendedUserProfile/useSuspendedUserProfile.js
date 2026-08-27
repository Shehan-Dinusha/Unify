import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { getSuspendedUserById } from '../../services/suspensionService';

export const useSuspendedUserProfile = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getSuspendedUserById(id);
                if (response.success) {
                    setData(response.data);
                } else {
                    throw new Error(response.message || 'Failed to load user');
                }
            } catch (err) {
                setError(err.message);
                toast.error('Error', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const user = data?.user || {};
    const suspension = data?.suspension || {};

    return {
        navigate, loading, error, user, suspension, id,
    };
};
