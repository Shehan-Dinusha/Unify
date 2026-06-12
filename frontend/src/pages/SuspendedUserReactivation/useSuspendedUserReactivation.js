import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { getSuspendedUserById, reactivateUser } from '../../services/suspensionService';

export const useSuspendedUserReactivation = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [identityVerified, setIdentityVerified] = useState(false);
    const [securityAudit, setSecurityAudit] = useState(false);
    const [internalNote, setInternalNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getSuspendedUserById(id);
                if (response.success) {
                    setUserData(response.data);
                    if (response.data.validations) {
                        setIdentityVerified(!!response.data.validations.identityVerificationComplete);
                        setSecurityAudit(!!response.data.validations.securityAuditPassed);
                    }
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
    }, [id]);

    const handleReactivate = async () => {
        if (!identityVerified || !securityAudit) {
            toast.warning('Validation Required', 'Both identity verification and security audit must be completed before reactivation.');
            return;
        }
        setSubmitting(true);
        try {
            const response = await reactivateUser(id, {
                identityVerificationComplete: identityVerified,
                securityAuditPassed: securityAudit,
                reactivationNotes: internalNote || undefined,
            });
            if (response.success) {
                toast.success('Account Reactivated', `${userData?.user?.name || 'User'}'s account has been restored.`);
                navigate(`/suspended-users/${id}/success`, {
                    state: {
                        reactivationData: response.data,
                        userName: userData?.user?.name,
                        studentId: userData?.user?.studentId,
                        caseReference: response.data?.caseReference || userData?.suspension?.caseRef,
                    },
                });
            } else {
                throw new Error(response.message || 'Reactivation failed');
            }
        } catch (err) {
            toast.error('Reactivation Failed', err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => navigate(`/suspended-users/${id}`);

    const user = userData?.user || {};
    const suspension = userData?.suspension || {};

    return {
        loading, error, user, suspension, submitting,
        identityVerified, setIdentityVerified,
        securityAudit, setSecurityAudit,
        internalNote, setInternalNote,
        handleReactivate, handleCancel, userData,
    };
};
