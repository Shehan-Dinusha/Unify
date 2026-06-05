import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import VerifiedList from "../../components/verification/VerifiedList";
import RequestList from "../../components/verification/RequestList";
import NotFound from "../NotFound";
import {
  VerificationConfirmationModal,
  VerificationSuccessModal,
  VerificationRejectionModal,
  VerificationRejectedSuccessModal,
  ActionErrorModal,
} from "../../components/common/VerificationModals";
import { useVerificationQueue } from "./useVerificationQueue";

const VerificationQueue = () => {
  const {
    errorStatus, activeTab, setActiveTab, requests, requestStats, loading,
    selectedRequest, setSelectedRequest, showSuccessModal, verifiedRequest,
    showRejectionModal, setShowRejectionModal, showRejectionSuccessModal, rejectedRequest, rejectionReason,
    showErrorModal, errorMessage, handleVerifyClick, handleConfirmVerify, handleCloseSuccess,
    handleRejectClick, handleConfirmReject, handleCloseError, handleCloseRejectionSuccess,
  } = useVerificationQueue();

  const headerActions = (
    <div className="flex w-full sm:w-auto bg-white/5 p-1 sm:p-xs rounded-2xl border border-primary-blue/20">
      <button onClick={() => setActiveTab("requests")}
        className={`flex flex-1 sm:flex-none justify-center items-center gap-2 sm:gap-sm px-3 sm:px-lg py-2 sm:py-sm rounded-xl transition-all ${
          activeTab === "requests"
            ? "bg-primary-blue/20 text-text-primary border border-primary-blue/50"
            : "text-text-secondary hover:text-text-primary border border-transparent"
        }`}>
        <img src="/icon_tab_requests.svg" alt="Requests" className={`w-4 h-4 ${activeTab !== "requests" && "opacity-70"}`} />
        <span className="hidden sm:inline-block text-sm sm:text-body-small-bold font-inter">Requests</span>
      </button>
      <button onClick={() => setActiveTab("verified")}
        className={`flex flex-1 sm:flex-none justify-center items-center gap-2 sm:gap-sm px-3 sm:px-lg py-2 sm:py-sm rounded-xl transition-all ${
          activeTab === "verified"
            ? "bg-primary-blue/20 text-text-primary border border-primary-blue/50"
            : "text-text-secondary hover:text-text-primary border border-transparent"
        }`}>
        <img src="/icon_tab_verified.svg" alt="Verified" className={`w-4 h-5 ${activeTab !== "verified" && "opacity-70"}`} />
        <span className="hidden sm:inline-block text-sm sm:text-body-small-bold font-inter">Verified</span>
      </button>
    </div>
  );

  if (errorStatus) return <NotFound />;

  return (
    <MainLayout pageTitle="Verification Queue" headerRight={headerActions}>
      {activeTab === "requests" ? (
        <RequestList requests={requests} stats={requestStats} onVerify={handleVerifyClick} onReject={handleRejectClick} loading={loading} />
      ) : (
        <VerifiedList />
      )}

      <VerificationConfirmationModal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} onConfirm={handleConfirmVerify} loading={loading} />
      <VerificationSuccessModal isOpen={showSuccessModal} onClose={handleCloseSuccess} clubName={verifiedRequest?.name} />

      <VerificationRejectionModal isOpen={showRejectionModal} onClose={() => setShowRejectionModal(false)} onConfirm={handleConfirmReject}
        clubName={rejectedRequest?.name} requestType={rejectedRequest?.type} loading={loading} />
      <VerificationRejectedSuccessModal isOpen={showRejectionSuccessModal} onClose={handleCloseRejectionSuccess} clubName={rejectedRequest?.name} reason={rejectionReason} />

      <ActionErrorModal isOpen={showErrorModal} onClose={handleCloseError} title="Action Failed" message={errorMessage} />
    </MainLayout>
  );
};

export default VerificationQueue;
