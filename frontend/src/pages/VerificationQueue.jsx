import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import VerifiedList from "../components/verification/VerifiedList";
import RequestList from "../components/verification/RequestList";
import { mockRequests } from "../data/mockData";
import {
  VerificationConfirmationModal,
  VerificationSuccessModal,
  VerificationRejectionModal,
  VerificationRejectedSuccessModal,
} from "../components/common/VerificationModals";

const VerificationQueue = () => {
  const [activeTab, setActiveTab] = useState("requests");

  // Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verifiedRequest, setVerifiedRequest] = useState(null);

  // Rejection State
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showRejectionSuccessModal, setShowRejectionSuccessModal] =
    useState(false);
  const [rejectedRequest, setRejectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleVerifyClick = (request) => {
    setSelectedRequest(request);
  };

  const handleConfirmVerify = () => {
    // In a real app, you would make an API call here
    setVerifiedRequest(selectedRequest);
    setSelectedRequest(null);
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setVerifiedRequest(null);
  };

  // Rejection Handlers
  const handleRejectClick = (request) => {
    setRejectedRequest(request);
    setShowRejectionModal(true);
  };

  const handleConfirmReject = (reason, customReason) => {
    // In a real app, API call here
    setRejectionReason(customReason ? customReason : reason);
    setShowRejectionModal(false);
    setShowRejectionSuccessModal(true);
  };

  const handleCloseRejectionSuccess = () => {
    setShowRejectionSuccessModal(false);
    setRejectedRequest(null);
    setRejectionReason("");
  };

  const headerActions = (
    <div className="flex w-full sm:w-auto bg-white/5 p-1 sm:p-xs rounded-2xl border border-primary-blue/20">
      <button
        onClick={() => setActiveTab("requests")}
        className={`flex flex-1 sm:flex-none justify-center items-center gap-2 sm:gap-sm px-3 sm:px-lg py-2 sm:py-sm rounded-xl transition-all ${
          activeTab === "requests"
            ? "bg-primary-blue/20 text-text-primary border border-primary-blue/50"
            : "text-text-secondary hover:text-text-primary border border-transparent"
        }`}
      >
        <img
          src="/icon_tab_requests.svg"
          alt="Requests"
          className={`w-4 h-4 ${activeTab !== "requests" && "opacity-70"}`}
        />
        <span className="hidden sm:inline-block text-sm sm:text-body-small-bold font-inter">
          Requests
        </span>
      </button>
      <button
        onClick={() => setActiveTab("verified")}
        className={`flex flex-1 sm:flex-none justify-center items-center gap-2 sm:gap-sm px-3 sm:px-lg py-2 sm:py-sm rounded-xl transition-all ${
          activeTab === "verified"
            ? "bg-primary-blue/20 text-text-primary border border-primary-blue/50"
            : "text-text-secondary hover:text-text-primary border border-transparent"
        }`}
      >
        <img
          src="/icon_tab_verified.svg"
          alt="Verified"
          className={`w-4 h-5 ${activeTab !== "verified" && "opacity-70"}`}
        />
        <span className="hidden sm:inline-block text-sm sm:text-body-small-bold font-inter">
          Verified
        </span>
      </button>
    </div>
  );

  return (
    <MainLayout
      user={{ name: "Alex Johnson", role: "admin" }}
      pageTitle="Verification Queue"
      headerRight={headerActions}
      verificationCount={mockRequests.length}
    >
      {activeTab === "requests" ? (
        <RequestList
          requests={mockRequests}
          onVerify={handleVerifyClick}
          onReject={handleRejectClick}
        />
      ) : (
        <VerifiedList />
      )}

      {/* Verification Modals */}
      <VerificationConfirmationModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onConfirm={handleConfirmVerify}
      />
      <VerificationSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccess}
        clubName={verifiedRequest?.name}
      />

      {/* Rejection Modals */}
      <VerificationRejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onConfirm={handleConfirmReject}
        clubName={rejectedRequest?.name}
        requestType={rejectedRequest?.type}
      />
      <VerificationRejectedSuccessModal
        isOpen={showRejectionSuccessModal}
        onClose={handleCloseRejectionSuccess}
        clubName={rejectedRequest?.name}
        reason={rejectionReason}
      />
    </MainLayout>
  );
};

export default VerificationQueue;
