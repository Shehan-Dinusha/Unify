import React from 'react';
import { AlertTriangle } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import { getCurrentUser } from '../../services/authService';
import { useBusinessProfile } from './useBusinessProfile';
import SuspendedBanner from './SuspendedBanner';
import BusinessHeaderCard from './BusinessHeaderCard';
import BusinessStatsRow from './BusinessStatsRow';
import BusinessInfoSection from './BusinessInfoSection';
import BusinessSentimentCard from './BusinessSentimentCard';
import SuspendModal from './SuspendModal';
import MessageModal from './MessageModal';
import ActionSuccessModal from './ActionSuccessModal';

const BusinessProfile = () => {
  const {
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
  } = useBusinessProfile();

  const statsArray = biz ? [biz.stats.revenue, biz.stats.ads, biz.stats.engagement] : [];

  if (loading) {
    return (
      <MainLayout user={{ name: 'Admin', role: 'admin' }} pageTitle="Loading Profile...">
        <div className="flex items-center justify-center h-64">
          <p className="text-text-secondary text-body-medium">Loading business profile...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !biz) {
    return (
      <MainLayout user={{ name: 'Admin', role: 'admin' }} pageTitle="Error">
        <Card variant="container" className="border-state-error/30 bg-state-error/5">
          <div className="flex items-center gap-md">
            <AlertTriangle size={24} className="text-state-error shrink-0" />
            <div>
              <p className="text-body-medium-bold text-state-error">Failed to Load Profile</p>
              <p className="text-body-small text-text-secondary">{error || 'Business not found.'}</p>
            </div>
          </div>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      user={getCurrentUser() || { name: 'Admin', role: 'Admin' }}
      pageTitle={`${biz.name}'s Profile`}
    >
      {biz.status === 'Suspended' && <SuspendedBanner />}

      <BusinessHeaderCard
        biz={biz}
        onSuspend={() => openModal('suspend')}
        onMessage={() => openModal('message')}
      />

      <BusinessStatsRow stats={statsArray} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <BusinessInfoSection biz={biz} />
        <div className="lg:col-span-1">
          <BusinessSentimentCard sentiment={biz.sentiment} />
        </div>
      </div>

      <SuspendModal
        open={modal === 'suspend'}
        biz={biz}
        suspendReason={suspendReason}
        suspendDetail={suspendDetail}
        sendEmail={sendEmail}
        actionLoading={actionLoading}
        onClose={closeModal}
        onReasonChange={setSuspendReason}
        onDetailChange={setSuspendDetail}
        onEmailToggle={() => setSendEmail(!sendEmail)}
        onConfirm={confirmAction}
      />

      <MessageModal
        open={modal === 'message'}
        biz={biz}
        onClose={closeModal}
        onSend={() => confirmAction('message')}
      />

      <ActionSuccessModal
        success={success}
        biz={biz}
        onClose={closeSuccess}
      />
    </MainLayout>
  );
};

export default BusinessProfile;
