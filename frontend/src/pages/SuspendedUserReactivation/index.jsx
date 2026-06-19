import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Overlay from '../../components/common/Overlay';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { getCurrentUser } from '../../services/authService';
import { useSuspendedUserReactivation } from './useSuspendedUserReactivation';
import ReactivationForm from './ReactivationForm';

const SuspendedUserReactivation = () => {
    const {
        loading, error, user, suspension, submitting,
        identityVerified, setIdentityVerified,
        securityAudit, setSecurityAudit,
        internalNote, setInternalNote,
        handleReactivate, handleCancel,
    } = useSuspendedUserReactivation();

    return (
        <MainLayout user={getCurrentUser() || { name: 'Admin', role: 'Admin' }} pageTitle="Reactivate Account" verificationCount={0}>
            <Overlay open={true} className="py-6 overflow-y-auto">
                <Card variant="modal" padding="p-0" className="w-full max-w-[520px] my-auto">
                    {loading && (
                        <div className="p-12 flex flex-col items-center justify-center">
                            <Loader2 size={32} className="text-primary-blue animate-spin mb-md" />
                            <p className="text-body-small text-text-secondary font-inter">Loading user data...</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="p-8 flex flex-col items-center justify-center text-center">
                            <div className="w-14 h-14 bg-state-error/10 rounded-full flex items-center justify-center mb-md">
                                <AlertTriangle size={24} className="text-state-error" />
                            </div>
                            <h3 className="text-body-large-bold text-text-primary font-inter mb-sm">Error</h3>
                            <p className="text-body-small text-text-secondary font-inter mb-lg">{error}</p>
                            <button onClick={handleCancel} className="h-11 px-8 rounded-2xl bg-primary-blue text-white font-inter font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all duration-200">
                                Go Back
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <ReactivationForm
                            user={user}
                            suspension={suspension}
                            submitting={submitting}
                            identityVerified={identityVerified}
                            onToggleIdentity={() => setIdentityVerified(!identityVerified)}
                            securityAudit={securityAudit}
                            onToggleSecurity={() => setSecurityAudit(!securityAudit)}
                            internalNote={internalNote}
                            onNoteChange={setInternalNote}
                            onReactivate={handleReactivate}
                            onCancel={handleCancel}
                        />
                    )}
                </Card>
            </Overlay>
        </MainLayout>
    );
};

export default SuspendedUserReactivation;
