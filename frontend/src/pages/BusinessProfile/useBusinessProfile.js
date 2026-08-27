import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { getBusinessProfile, updateBusinessStatus } from '../../services/businessService';

export const useBusinessProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getBusinessProfile(id);
        setBiz(result.data);
      } catch (err) {
        setError('Failed to load business profile. Please check backend.');
        toast.error('Connection Error', 'Could not load business profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [modal, setModal] = useState(null);
  const [success, setSuccess] = useState(null);
  const [suspendReason, setSuspendReason] = useState('Violation of Terms');
  const [suspendDetail, setSuspendDetail] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  const openModal = (m) => setModal(m);
  const closeModal = () => { setModal(null); setSuspendDetail(''); };

  const confirmAction = async (type) => {
    setActionLoading(true);
    try {
      if (type === 'suspend') {
        await updateBusinessStatus(id, {
          status: 'Suspended',
          suspensionCategory: suspendReason,
          reason: suspendDetail,
          sendEmail,
        });
        toast.success('Suspended', `${biz.name}'s business has been suspended.`);
      } else if (type === 'activate') {
        await updateBusinessStatus(id, { status: 'Active' });
        toast.success('Activated', `${biz.name}'s business access has been restored.`);
      } else if (type === 'message') {
        toast.success('Message Sent', `Message sent to ${biz.name} successfully.`);
      }
      closeModal();
      setSuccess(type);

      try {
        const result = await getBusinessProfile(id);
        setBiz(result.data);
      } catch (e) {
        toast.error("Error", "Failed to refresh business data");
      }
    } catch (err) {
      const msg = err.message || 'Action failed. Please try again.';
      toast.error('Action Failed', msg);
    } finally {
      setActionLoading(false);
    }
  };

  const closeSuccess = (dest) => {
    setSuccess(null);
    if (dest === 'dashboard') navigate('/admin');
    else navigate('/active-businesses');
  };

  return {
    biz,
    loading,
    error,
    actionLoading,
    modal,
    success,
    suspendReason,
    suspendDetail,
    sendEmail,
    setSuspendReason,
    setSuspendDetail,
    setSendEmail,
    openModal,
    closeModal,
    confirmAction,
    closeSuccess,
  };
};
